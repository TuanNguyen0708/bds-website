const fs = require('fs');
const path = require('path');

function normalizeText(value) {
  if (!value) return '';
  return value.trim();
}

function normalizeArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(v => v && v.trim());
  if (typeof value === 'string') {
    // Split by common delimiters
    return value.split(/[,;|]/).map(v => v.trim()).filter(v => v);
  }
  return [];
}

function findDetailValue(details, ...labels) {
  for (const detail of details) {
    const normalizedLabel = detail.label.toLowerCase().trim();
    for (const label of labels) {
      if (normalizedLabel.includes(label.toLowerCase()) || label.toLowerCase().includes(normalizedLabel)) {
        return normalizeText(detail.value);
      }
    }
  }
  return '';
}

function extractNumber(value) {
  if (!value) return '';
  // Extract numbers and units
  const match = value.match(/([\d.,]+)\s*([a-zA-Zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]*)/i);
  if (match) {
    return match[0].trim();
  }
  return normalizeText(value);
}

function parseUnitTypes(areaString) {
  if (!areaString) return [];
  
  // Extract area ranges like "45-61-77-84m2" or "47-67-78m2" or "45m2 - 90m2"
  // Remove "m2", "m²" and split by common delimiters
  const cleaned = areaString.replace(/m[²2]/gi, '').trim();
  const parts = cleaned.split(/[-–—,]/).map(p => p.trim()).filter(p => p);
  
  // Extract numbers from each part
  const areas = [];
  parts.forEach(part => {
    const numbers = part.match(/\d+/g);
    if (numbers) {
      areas.push(...numbers.map(n => parseInt(n, 10)));
    }
  });
  
  // Remove duplicates and sort
  const uniqueAreas = [...new Set(areas)].sort((a, b) => a - b);
  
  return uniqueAreas.map((area, index) => ({
    type: `Loại ${index + 1}`,
    area: `${area}m²`,
    bedrooms: '',
    bathrooms: '',
    description: `Căn hộ ${area}m²`
  }));
}

function extractDistrictFromName(name) {
  if (!name) return '';
  const districts = ['Hoà Xuân', 'Hải Châu', 'Thanh Khê', 'Liên Chiểu', 'Ngũ Hành Sơn', 'Sơn Trà', 'Cẩm Lệ'];
  const nameLower = name.toLowerCase();
  
  for (const district of districts) {
    if (nameLower.includes(district.toLowerCase())) {
      return district;
    }
  }
  
  return '';
}

function findSectionByTitle(sections, ...titles) {
  if (!sections || sections.length === 0) return null;
  for (const section of sections) {
    const sectionTitle = (section.title || '').toLowerCase();
    for (const title of titles) {
      if (sectionTitle.includes(title.toLowerCase())) {
        return section;
      }
    }
  }
  return null;
}

function findFactValue(section, ...labels) {
  if (!section || !section.facts) return '';
  for (const fact of section.facts) {
    const normalizedLabel = (fact.label || '').toLowerCase().trim();
    for (const label of labels) {
      if (normalizedLabel.includes(label.toLowerCase()) || label.toLowerCase().includes(normalizedLabel)) {
        return normalizeText(fact.value);
      }
    }
  }
  return '';
}

function extractFromAllSections(sections, searchTerms) {
  const results = [];
  if (!sections) return results;
  
  for (const section of sections) {
    const allText = [
      ...(section.paragraphs || []),
      ...(section.facts || []).map(f => `${f.label}: ${f.value}`)
    ].join(' ').toLowerCase();
    
    for (const term of searchTerms) {
      if (allText.includes(term.toLowerCase())) {
        results.push(...(section.paragraphs || []));
        break;
      }
    }
  }
  
  return results;
}

function normalizeProject(raw) {
  const details = raw.details || [];
  const sections = raw.sections || [];
  
  // Extract pricing information
  const priceValue = findDetailValue(details, 'giá', 'price', 'giá bán');
  const pricePerSqm = priceValue.includes('triệu/m2') || priceValue.includes('triệu/m²') 
    ? priceValue 
    : priceValue.includes('triệu') 
      ? `${priceValue}/m²`
      : priceValue;

  // Extract scale information from details (description will be extracted later)
  let quyMo = findDetailValue(details, 'quy mô', 'tổng diện tích', 'diện tích đất');
  
  // Extract from description after it's available - will be updated below
  
  const soBlock = findDetailValue(details, 'số block', 'block', 'số tòa');
  const soTang = findDetailValue(details, 'số tầng', 'tầng');
  const soCanHo = findDetailValue(details, 'số căn hộ');
  const matDo = findDetailValue(details, 'mật độ', 'mật độ xây dựng');
  const dienTichCanHo = findDetailValue(details, 'diện tích căn hộ', 'diện tích');
  
  // Clean up numberOfUnits - ensure we only use it if it's actually a unit count, not an area
  let cleanedSoCanHo = soCanHo || '';
  // If numberOfUnits is empty or seems to be extracted from area string, keep it empty
  if (!cleanedSoCanHo) {
    cleanedSoCanHo = '';
  }

  // Extract time information
  const thoiGianGiaoNha = findDetailValue(details, 'thời gian giao nhà', 'giao nhà', 'handover');
  const thoiGianXayDung = findDetailValue(details, 'thời gian xây dựng', 'khởi công', 'construction start');
  const trangThai = findDetailValue(details, 'trạng thái', 'status');

  // Extract description from sections FIRST (needed for other extractions)
  let description = '';
  let highlights = [];
  const overviewSection = findSectionByTitle(sections, 'tổng quan', 'giới thiệu', 'overview', 'nội dung');
  
  if (overviewSection) {
    description = overviewSection.paragraphs.join('\n\n');
    highlights = overviewSection.paragraphs.filter(p => p.length < 200 && p.length > 20);
  } else if (sections.length > 0 && sections[0].paragraphs) {
    description = sections[0].paragraphs.join('\n\n');
  }
  
  // Now update quyMo from description if we have better value
  if (description && (!quyMo || quyMo.length < 5)) {
    const quyMoMatch = description.match(/(?:Quy Mô|quy mô)[:\s]+([\d.,]+\s*(?:m2|m²|ha|hecta)?)/i);
    if (quyMoMatch) {
      quyMo = quyMoMatch[1].trim();
    }
  }

  // Extract location from sections and details (description will be used later)
  const locationSection = findSectionByTitle(sections, 'vị trí', 'location', 'địa chỉ');
  let locationInfo = findDetailValue(details, 'địa chỉ', 'vị trí', 'location', 'address');
  
  // Try to extract from description if not found
  if (!locationInfo && description) {
    // Pattern 1: "Vị Trí : Dự án tọa lạc tại đường Trần Hưng Đạo, Ngô Quyền và Nguyễn Công Trứ"
    const addressMatch1 = description.match(/(?:Vị Trí|vị trí|Vị trí)[:\s]+(?:Dự án\s+)?(?:tọa lạc|nằm|tại)[:\s]+([^.\n]+?)(?:Quy Mô|gần|\.)/i);
    if (addressMatch1) {
      locationInfo = addressMatch1[1].trim();
    }
    
    // Pattern 2: "Vị trí: Số 50 Quy Mỹ, Phường Hoà Cường Nam, Quận Hải Châu"
    if (!locationInfo || locationInfo.length < 20) {
      const addressMatch2 = description.match(/(?:Vị trí|Vị Trí)[:\s]+(?:Số|số)\s+\d+[^.\n]+(?:Phường|phường|Quận|quận)[^.\n]+/i);
      if (addressMatch2) {
        locationInfo = addressMatch2[0].replace(/(?:Vị trí|Vị Trí)[:\s]+/i, '').trim();
      }
    }
    
    // Pattern 3: "tọa lạc tại đường..." from location section
    if (!locationInfo || locationInfo.length < 20) {
      const addressMatch3 = description.match(/(?:tọa lạc|toạ lạc|nằm|tại)\s+(?:số\s+)?([^.\n,]+(?:đường|phường|quận|và)[^.\n,]*)/i);
      if (addressMatch3) {
        const candidate = addressMatch3[1].trim();
        if (!locationInfo || candidate.length > locationInfo.length) {
          locationInfo = candidate;
        }
      }
    }
    
    // Pattern 4: "Số X, Phường Y, Quận Z"
    if (!locationInfo || locationInfo.length < 20) {
      const addressMatch4 = description.match(/(?:Số|số)\s+\d+[^.\n]*(?:Phường|phường|Quận|quận)[^.\n]+/i);
      if (addressMatch4) {
        locationInfo = addressMatch4[0].trim();
      }
    }
  }
  
  if (!locationInfo && locationSection) {
    const locationText = locationSection.paragraphs.join(' ');
    // Try to extract address from location text
    const addressMatch = locationText.match(/(?:tọa lạc|nằm|tại|địa chỉ|vị trí|toạ lạc)[:\s]+([^.\n]+(?:đường|phường|quận)[^.\n]*)/i);
    if (addressMatch) {
      locationInfo = addressMatch[1].trim();
    } else if (locationText.length > 50) {
      // Extract first meaningful sentence
      const sentences = locationText.split(/[.\n]/).filter(s => s.trim().length > 30);
      if (sentences.length > 0) {
        locationInfo = sentences[0].trim();
      }
    }
  }
  
  // Clean up address - remove trailing commas and "tại" prefix
  if (locationInfo) {
    locationInfo = locationInfo.replace(/^tại\s+/i, '').replace(/[,\s]+$/, '').trim();
  }
  
  // Extract surrounding information
  let surrounding = '';
  if (locationSection) {
    const locationText = locationSection.paragraphs.join('\n');
    // Extract all surrounding information
    const surroundingParts = [];
    
    // Extract directions (Phía Đông, Phía Tây, etc.)
    const directionMatches = locationText.match(/(?:Phía|phía)\s+(Đông|Tây|Nam|Bắc)[:\s]+([^\n]+)/gi);
    if (directionMatches) {
      surroundingParts.push(...directionMatches);
    }
    
    // Extract nearby places
    const nearbyMatches = locationText.match(/(?:tiếp giáp|gần| cách|cách khoảng|khoảng|nằm giữa)[:\s]+([^\n.]+)/gi);
    if (nearbyMatches) {
      surroundingParts.push(...nearbyMatches);
    }
    
    if (surroundingParts.length > 0) {
      surrounding = surroundingParts.join('; ');
    } else if (locationText.length > 50) {
      surrounding = locationText;
    }
  } else if (description) {
    // Extract from description if no location section
    const locationText = description.match(/(?:II\/\s*)?VỊ TRÍ[^III]+/is);
    if (locationText) {
      const text = locationText[0];
      const directionMatches = text.match(/(?:Phía|phía)\s+(Đông|Tây|Nam|Bắc)[:\s]+([^\n]+)/gi);
      if (directionMatches) {
        surrounding = directionMatches.join('; ');
      }
      const nearbyMatches = text.match(/(?:tiếp giáp|gần| cách|cách khoảng|khoảng|nằm giữa)[:\s]+([^\n.]+)/gi);
      if (nearbyMatches && !surrounding) {
        surrounding = nearbyMatches.join('; ');
      }
    }
  }
  
  // Extract district from description if not found in name
  let district = extractDistrictFromName(raw.name);
  if (!district && description) {
    const districtMatch = description.match(/(?:phường|quận|huyện)\s+([A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]+)/i);
    if (districtMatch) {
      district = districtMatch[1].trim();
    }
  }
  
  // Extract additional scale information from description
  if (description) {
    // Extract total land area if not found
    if (!quyMo || quyMo.length < 5) {
      const quyMoMatch = description.match(/(?:Quy Mô|Quy mô|quy mô)[:\s]+([^.\n]+)/i);
      if (quyMoMatch) {
        quyMo = quyMoMatch[1].trim();
      }
    }
    
    // Extract number of units if not found
    if (!cleanedSoCanHo) {
      const soCanHoMatch = description.match(/(?:Số lượng căn hộ|số căn hộ|Số căn hộ)[:\s]+([^.\n]+)/i);
      if (soCanHoMatch) {
        cleanedSoCanHo = soCanHoMatch[1].trim();
      }
    }
  }

  // Extract amenities from sections
  const amenitiesSection = findSectionByTitle(sections, 'tiện ích', 'amenities', 'tiện nghi');
  
  const internalAmenities = [];
  const externalAmenities = [];
  
  if (amenitiesSection) {
    const allText = amenitiesSection.paragraphs.join('\n');
    
    // Extract specific amenities using patterns
    const amenityPatterns = [
      { pattern: /hồ bơi[^.\n]*(?:chuẩn|olympic|vô cực|tràn bờ|tầng \d+)?/gi, type: 'internal', name: 'Hồ bơi' },
      { pattern: /(?:phòng|khu|trung tâm)\s*(?:gym|thể dục|thể thao)[^.\n]*/gi, type: 'internal', name: 'Phòng gym' },
      { pattern: /(?:phòng|khu)\s*yoga[^.\n]*/gi, type: 'internal', name: 'Phòng yoga' },
      { pattern: /(?:công viên|vườn)[^.\n]*(?:chuyên đề|nội khu|xanh mát)?/gi, type: 'internal', name: 'Công viên' },
      { pattern: /(?:tttm|trung tâm thương mại)[^.\n]*(?:lớn nhất|toạ lạc)?/gi, type: 'external', name: 'TTTM' },
      { pattern: /(?:sảnh|lobby|sảnh đón|sảnh lễ tân)[^.\n]*/gi, type: 'internal', name: 'Sảnh' },
      { pattern: /(?:khu vui chơi|playground|trẻ em)[^.\n]*(?:trong nhà|ngoài trời)?/gi, type: 'internal', name: 'Khu vui chơi' },
      { pattern: /(?:hầm đỗ xe|parking|đỗ xe)[^.\n]*(?:thông minh)?/gi, type: 'internal', name: 'Hầm đỗ xe' },
      { pattern: /(?:sky lounge|sky bar)[^.\n]*/gi, type: 'internal', name: 'Sky Lounge' },
      { pattern: /(?:phòng sinh hoạt|community room|phòng sinh hoạt cộng đồng)[^.\n]*/gi, type: 'internal', name: 'Phòng sinh hoạt' },
      { pattern: /(?:shophouse|nhà hàng|quán cà phê|restaurant|cafe|thương mại dịch vụ)[^.\n]*/gi, type: 'external', name: 'Thương mại dịch vụ' },
      { pattern: /(?:bảo vệ|security|camera|an ninh|hệ thống an ninh)[^.\n]*(?:24\/7)?/gi, type: 'internal', name: 'An ninh' },
      { pattern: /(?:vườn thiền|đường dạo bộ|tiểu cảnh nước)[^.\n]*/gi, type: 'internal', name: 'Cảnh quan' },
      { pattern: /(?:pickleball|sân pickleball)[^.\n]*/gi, type: 'internal', name: 'Sân Pickleball' },
      { pattern: /(?:concierge|dịch vụ concierge)[^.\n]*/gi, type: 'internal', name: 'Concierge' },
    ];
    
    amenityPatterns.forEach(({ pattern, type, name }) => {
      const matches = allText.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const text = match.trim();
          if (type === 'internal' && name && !internalAmenities.includes(name)) {
            internalAmenities.push(name);
          } else if (type === 'external' && name && !externalAmenities.includes(name)) {
            externalAmenities.push(name);
          } else if (text.length > 5 && text.length < 200) {
            if (type === 'internal' && !internalAmenities.includes(text)) {
              internalAmenities.push(text);
            } else if (type === 'external' && !externalAmenities.includes(text)) {
              externalAmenities.push(text);
            }
          }
        });
      }
    });
    
    // Extract from description if section found but no specific amenities extracted
    if (internalAmenities.length === 0 && externalAmenities.length === 0 && description) {
      const amenitiesText = description.match(/(?:III\/\s*)?TIỆN ÍCH[^IV]+/is);
      if (amenitiesText) {
        const text = amenitiesText[0];
        // Extract number of amenities
        const countMatch = text.match(/(\d+)\s*tiện ích/i);
        if (countMatch) {
          internalAmenities.push(`${countMatch[1]} tiện ích`);
        }
        // Extract key amenities
        if (text.includes('hồ bơi')) internalAmenities.push('Hồ bơi');
        if (text.includes('công viên')) internalAmenities.push('Công viên');
        if (text.includes('TTTM') || text.includes('trung tâm thương mại')) externalAmenities.push('TTTM');
      }
    }
    
    // If still no amenities, extract from paragraphs
    if (internalAmenities.length === 0 && externalAmenities.length === 0 && amenitiesSection) {
      amenitiesSection.paragraphs.forEach(para => {
        if (para && para.length > 20) {
          // Split by common delimiters
          const items = para.split(/[,\n•\-\u2022]/).map(i => i.trim()).filter(i => i.length > 5 && i.length < 100);
          items.forEach(item => {
            const lower = item.toLowerCase();
            if (lower.includes('hồ bơi') || lower.includes('gym') || lower.includes('spa') || 
                lower.includes('công viên') || lower.includes('sảnh') || lower.includes('lobby')) {
              if (!internalAmenities.includes(item)) {
                internalAmenities.push(item);
              }
            } else if (lower.includes('tttm') || lower.includes('mall') || lower.includes('trung tâm')) {
              if (!externalAmenities.includes(item)) {
                externalAmenities.push(item);
              }
            }
          });
        }
      });
    }
  }
  
  // Always try to extract from description as fallback
  if ((internalAmenities.length === 0 && externalAmenities.length === 0) && description) {
    // Try multiple patterns to find amenities section
    let amenitiesText = description.match(/(?:III\/\s*)?TIỆN ÍCH[^IV]+/is);
    if (!amenitiesText) {
      amenitiesText = description.match(/TIỆN ÍCH[^IV]+/is);
    }
    if (!amenitiesText) {
      amenitiesText = description.match(/tiện ích[^IV]+/is);
    }
    
    if (amenitiesText) {
      const text = amenitiesText[0];
      // Extract number of amenities
      const countMatch = text.match(/(\d+)\s*tiện ích/i);
      if (countMatch) {
        internalAmenities.push(`${countMatch[1]} tiện ích`);
      }
      // Extract key amenities
      if (text.includes('hồ bơi') || text.includes('Hồ bơi')) {
        internalAmenities.push('Hồ bơi');
      }
      if (text.includes('công viên') || text.includes('Công viên')) {
        internalAmenities.push('Công viên');
      }
      if (text.includes('TTTM') || text.includes('trung tâm thương mại') || text.includes('TTTM')) {
        externalAmenities.push('TTTM');
      }
      // Extract more amenities from text
      const amenityKeywords = [
        { keyword: 'gym', name: 'Phòng gym' },
        { keyword: 'yoga', name: 'Phòng yoga' },
        { keyword: 'spa', name: 'Spa' },
        { keyword: 'sảnh', name: 'Sảnh' },
        { keyword: 'lobby', name: 'Lobby' },
        { keyword: 'khu vui chơi', name: 'Khu vui chơi' },
        { keyword: 'hầm đỗ xe', name: 'Hầm đỗ xe' },
        { keyword: 'sky lounge', name: 'Sky Lounge' },
        { keyword: 'sky bar', name: 'Sky Bar' },
        { keyword: 'phòng sinh hoạt', name: 'Phòng sinh hoạt' },
        { keyword: 'shophouse', name: 'Shophouse' },
        { keyword: 'nhà hàng', name: 'Nhà hàng' },
        { keyword: 'quán cà phê', name: 'Quán cà phê' },
        { keyword: 'bảo vệ', name: 'An ninh 24/7' },
        { keyword: 'camera', name: 'Camera giám sát' },
      ];
      
      amenityKeywords.forEach(({ keyword, name }) => {
        if (text.toLowerCase().includes(keyword.toLowerCase()) && !internalAmenities.includes(name) && !externalAmenities.includes(name)) {
          if (keyword.includes('tttm') || keyword.includes('mall') || keyword.includes('nhà hàng') || keyword.includes('quán cà phê') || keyword.includes('shophouse')) {
            externalAmenities.push(name);
          } else {
            internalAmenities.push(name);
          }
        }
      });
    }
    
    // Always search entire description for amenities as fallback
    const descLower = description.toLowerCase();
    const descOriginal = description;
    
    // Extract number of amenities
    const countMatch = descOriginal.match(/(\d+)\s*tiện ích/i);
    if (countMatch && !internalAmenities.some(a => a.includes('tiện ích'))) {
      internalAmenities.push(`${countMatch[1]} tiện ích`);
    }
    
    // Extract key amenities
    if (descLower.includes('hồ bơi') && !internalAmenities.includes('Hồ bơi')) {
      internalAmenities.push('Hồ bơi');
    }
    if (descLower.includes('công viên') && !internalAmenities.includes('Công viên')) {
      internalAmenities.push('Công viên');
    }
    if ((descLower.includes('tttm') || descLower.includes('trung tâm thương mại')) && !externalAmenities.includes('TTTM')) {
      externalAmenities.push('TTTM');
    }
    
    // Extract more amenities
    const amenityKeywords = [
      { keyword: 'gym', name: 'Phòng gym', type: 'internal' },
      { keyword: 'yoga', name: 'Phòng yoga', type: 'internal' },
      { keyword: 'spa', name: 'Spa', type: 'internal' },
      { keyword: 'sảnh', name: 'Sảnh', type: 'internal' },
      { keyword: 'lobby', name: 'Lobby', type: 'internal' },
      { keyword: 'khu vui chơi', name: 'Khu vui chơi', type: 'internal' },
      { keyword: 'hầm đỗ xe', name: 'Hầm đỗ xe', type: 'internal' },
      { keyword: 'sky lounge', name: 'Sky Lounge', type: 'internal' },
      { keyword: 'sky bar', name: 'Sky Bar', type: 'internal' },
      { keyword: 'phòng sinh hoạt', name: 'Phòng sinh hoạt', type: 'internal' },
      { keyword: 'shophouse', name: 'Shophouse', type: 'external' },
      { keyword: 'nhà hàng', name: 'Nhà hàng', type: 'external' },
      { keyword: 'quán cà phê', name: 'Quán cà phê', type: 'external' },
      { keyword: 'bảo vệ', name: 'An ninh 24/7', type: 'internal' },
      { keyword: 'camera', name: 'Camera giám sát', type: 'internal' },
    ];
    
    amenityKeywords.forEach(({ keyword, name, type }) => {
      if (descLower.includes(keyword)) {
        if (type === 'internal' && !internalAmenities.includes(name)) {
          internalAmenities.push(name);
        } else if (type === 'external' && !externalAmenities.includes(name)) {
          externalAmenities.push(name);
        }
      }
    });
  }

  // Extract design information
  const designSection = findSectionByTitle(sections, 'thiết kế', 'design', 'kiến trúc', 'mặt bằng');
  let architectureStyle = designSection ? designSection.paragraphs.join(' ') : '';
  
  // Extract from description if not found
  if (!architectureStyle && description) {
    const styleMatch = description.match(/(?:thiết kế|kiến trúc|phong cách)[:\s]+([^.\n]+)/i);
    if (styleMatch) {
      architectureStyle = styleMatch[1].trim();
    }
  }
  
  const floorPlansSection = findSectionByTitle(sections, 'mặt bằng', 'floor plan', 'layout');
  let floorPlans = floorPlansSection ? floorPlansSection.paragraphs.join('\n') : '';
  
  // Extract from description if not found
  if (!floorPlans && description) {
    const floorPlanMatch = description.match(/(?:Mặt bằng|mặt bằng|Layout|layout)[:\s]+([^.\n]+)/i);
    if (floorPlanMatch) {
      floorPlans = floorPlanMatch[1].trim();
    }
  }

  // Extract policies
  const policiesSection = findSectionByTitle(sections, 'chính sách', 'policies', 'chính sách bán hàng');
  let salesPolicy = policiesSection ? policiesSection.paragraphs.join('\n') : '';
  
  // Extract from description if not found
  if (!salesPolicy && description) {
    const policyMatch = description.match(/(?:V\/\s*)?CHÍNH SÁCH BÁN HÀNG[^VI]+/is);
    if (policyMatch) {
      salesPolicy = policyMatch[0].replace(/CHÍNH SÁCH BÁN HÀNG[:\s]*/i, '').replace(/VI\/.*$/is, '').trim();
    } else {
      const policyMatch2 = description.match(/(?:chính sách bán hàng|chính sách)[:\s]+([^VI]+)/is);
      if (policyMatch2) {
        salesPolicy = policyMatch2[1].trim();
      }
    }
  }
  
  let bankSupport = findFactValue(policiesSection, 'ngân hàng', 'bank', 'hỗ trợ vay') || 
    extractFromAllSections(sections, ['ngân hàng', 'bank', 'vay']).join(' ');
  
  if (!bankSupport && description) {
    const bankMatch = description.match(/(?:ngân hàng|bank|hỗ trợ vay|vay)[:\s]+([^.\n]+)/i);
    if (bankMatch) {
      bankSupport = bankMatch[1].trim();
    }
  }
  
  let loanSupport = findFactValue(policiesSection, 'vay', 'loan', 'hỗ trợ') || bankSupport;
  
  if (!loanSupport && description) {
    const loanMatch = description.match(/(?:hỗ trợ vay|loan support|vay vốn)[:\s]+([^.\n]+)/i);
    if (loanMatch) {
      loanSupport = loanMatch[1].trim();
    }
  }

  // Extract investor/developer from sections or details
  const investorSection = findSectionByTitle(sections, 'chủ đầu tư', 'investor', 'nhà đầu tư');
  let investor = findDetailValue(details, 'chủ đầu tư', 'investor', 'nhà đầu tư');
  
  if (!investor && description) {
    // Try to extract from description - pattern "Chủ Đầu Tư : Company Name"
    const investorMatch1 = description.match(/(?:Chủ Đầu Tư|Chủ đầu tư|chủ đầu tư)[:\s]+([^.\nVị]+?)(?:Vị Trí|Quy Mô|\.)/i);
    if (investorMatch1) {
      investor = investorMatch1[1].trim();
    }
    
    // Pattern 2: "Chủ đầu tư: Company Name."
    if (!investor) {
      const investorMatch2 = description.match(/(?:Chủ đầu tư|chủ đầu tư)[:\s]+([^.\n]+)/i);
      if (investorMatch2) {
        investor = investorMatch2[1].trim();
      }
    }
  }
  
  if (!investor && investorSection) {
    investor = investorSection.paragraphs.join(' ').substring(0, 200);
  }
  
  const developers = [];
  const contractors = [];
  
  let developerValue = findDetailValue(details, 'nhà phát triển', 'developer', 'phát triển') ||
    findFactValue(investorSection, 'phát triển', 'developer');
  
  if (!developerValue && description) {
    const devMatch = description.match(/(?:nhà phát triển|developer)[:\s]+([^.\n]+)/i);
    if (devMatch) {
      developerValue = devMatch[1].trim();
    }
  }
  
  // If investor contains multiple companies, split them for developers
  if (!developerValue && investor) {
    if (investor.includes('và')) {
      const investorParts = investor.split(/\s+và\s+/);
      developers.push(...investorParts.map(p => p.trim()).filter(p => p && p.length > 5));
    } else if (investor.length > 5) {
      developers.push(investor);
    }
  } else if (developerValue) {
    developers.push(...normalizeArray(developerValue));
  }
  
  let contractorValue = findDetailValue(details, 'nhà thầu', 'contractor', 'thi công', 'đơn vị xây dựng') ||
    findFactValue(investorSection, 'nhà thầu', 'contractor');
  
  if (!contractorValue && description) {
    const contractorMatch = description.match(/(?:nhà thầu|đơn vị xây dựng|contractor)[:\s]+([^.\n]+)/i);
    if (contractorMatch) {
      contractorValue = contractorMatch[1].trim();
    }
  }
  
  if (contractorValue) {
    contractors.push(...normalizeArray(contractorValue));
  }

  // Extract ownership from description or details
  let ownership = findDetailValue(details, 'sở hữu', 'ownership', 'quyền sở hữu', 'pháp lý') ||
    findFactValue(policiesSection, 'sở hữu', 'ownership', 'pháp lý');
  
  if (!ownership && description) {
    const ownershipMatch = description.match(/(?:Pháp Lý|pháp lý|Sở hữu|sở hữu|Hình thức sở hữu)[:\s]+([^.\n]+)/i);
    if (ownershipMatch) {
      ownership = ownershipMatch[1].trim();
    }
  }

  // Extract payment policy
  const paymentPolicy = findFactValue(policiesSection, 'thanh toán', 'payment', 'trả góp') ||
    extractFromAllSections(sections, ['thanh toán', 'payment', 'trả góp']).join(' ');

  // Extract promotion
  const promotion = findFactValue(policiesSection, 'ưu đãi', 'promotion', 'khuyến mãi') ||
    extractFromAllSections(sections, ['ưu đãi', 'promotion', 'khuyến mãi']).join(' ');

  // Extract gallery
  const images = raw.media?.filter(m => m.type === 'image').map(m => m.url) || [];
  const videos = raw.media?.filter(m => m.type === 'video').map(m => m.url) || [];

  // Parse unit types from area string
  const unitTypes = parseUnitTypes(dienTichCanHo);

  return {
    projectName: normalizeText(raw.name),
    slogan: normalizeText(raw.tagline) || '',
    summary: description || normalizeText(raw.tagline) || '',
    location: {
      address: locationInfo || '',
      region: 'Miền Trung',
      city: 'Đà Nẵng',
      district: district || '',
      coordinates: '',
      surrounding: surrounding || ''
    },
    overview: {
      description: description || '',
      highlights: highlights.length > 0 ? highlights : (description ? [description.substring(0, 200)] : [])
    },
    investor: investor || '',
    developers: developers.length > 0 ? developers : [],
    contractors: contractors,
    legalStatus: trangThai || '',
    ownership: ownership || '',
    handoverTime: thoiGianGiaoNha || '',
    constructionStart: thoiGianXayDung || '',
    constructionProgress: trangThai || '',
    scale: {
      totalLandArea: quyMo || '',
      constructionArea: '',
      floorArea: '',
      buildingDensity: matDo || '',
      numberOfBlocks: extractNumber(soBlock) || '',
      numberOfFloors: extractNumber(soTang) || '',
      numberOfUnits: extractNumber(cleanedSoCanHo) || '',
      greenArea: '',
      parking: ''
    },
    design: {
      architectureStyle: architectureStyle || '',
      interior: '',
      floorPlans: floorPlans || '',
      unitTypes: unitTypes
    },
    amenities: {
      internal: internalAmenities,
      external: externalAmenities
    },
    pricing: {
      startingPrice: '',
      priceRange: pricePerSqm || '',
      pricePerSqm: pricePerSqm || '',
      paymentPolicy: paymentPolicy || '',
      promotion: promotion || '',
      maintenanceFee: '',
      managementFee: ''
    },
    policies: {
      salesPolicy: salesPolicy || '',
      bankSupport: bankSupport || '',
      loanSupport: loanSupport || '',
      interestRatePolicy: ''
    },
    gallery: {
      images: images,
      videos: videos
    },
    attachments: []
  };
}

// Main execution
const assetsPath = path.join(__dirname, '..', 'assets', 'projects-raw.json');
const outputPath = path.join(__dirname, '..', 'assets', 'projects.json');

try {
  let fileContent = fs.readFileSync(assetsPath, 'utf-8');
  // Remove BOM if present
  if (fileContent.charCodeAt(0) === 0xFEFF) {
    fileContent = fileContent.slice(1);
  }
  const rawData = JSON.parse(fileContent);
  const normalizedProjects = rawData.map(normalizeProject);
  
  fs.writeFileSync(outputPath, JSON.stringify(normalizedProjects, null, 2), 'utf-8');
  
  console.log(`✅ Đã normalize ${normalizedProjects.length} dự án thành công!`);
  console.log(`📁 File output: ${outputPath}`);
} catch (error) {
  console.error('❌ Lỗi khi normalize dữ liệu:', error);
  process.exit(1);
}

