import * as fs from 'fs';
import * as path from 'path';

interface RawProject {
  key: string;
  folder: string;
  file: string;
  name: string;
  tagline: string | null;
  details: Array<{ label: string; value: string }>;
  sections: Array<{
    title: string;
    paragraphs: string[];
    facts: Array<{ label: string; value: string }>;
  }>;
  media: Array<{ type: string; url: string }>;
}

interface ProjectInfo {
  projectName: string;
  slogan: string;
  summary: string;
  location: {
    address: string;
    region: string;
    city: string;
    district: string;
    coordinates: string;
    surrounding: string;
  };
  overview: {
    description: string;
    highlights: string[];
  };
  investor: string;
  developers: string[];
  contractors: string[];
  legalStatus: string;
  ownership: string;
  handoverTime: string;
  constructionStart: string;
  constructionProgress: string;
  scale: {
    totalLandArea: string;
    constructionArea: string;
    floorArea: string;
    buildingDensity: string;
    numberOfBlocks: string;
    numberOfFloors: string;
    numberOfUnits: string;
    greenArea: string;
    parking: string;
  };
  design: {
    architectureStyle: string;
    interior: string;
    floorPlans: string;
    unitTypes: Array<{
      type: string;
      area: string;
      bedrooms: string;
      bathrooms: string;
      description: string;
    }>;
  };
  amenities: {
    internal: string[];
    external: string[];
  };
  pricing: {
    startingPrice: string;
    priceRange: string;
    pricePerSqm: string;
    paymentPolicy: string;
    promotion: string;
    maintenanceFee: string;
    managementFee: string;
  };
  policies: {
    salesPolicy: string;
    bankSupport: string;
    loanSupport: string;
    interestRatePolicy: string;
  };
  gallery: {
    images: string[];
    videos: string[];
  };
  attachments: string[];
}

function normalizeText(value: string | null | undefined): string {
  if (!value) return '';
  return value.trim();
}

function normalizeArray(value: string | string[] | null | undefined): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(v => v && v.trim());
  if (typeof value === 'string') {
    // Split by common delimiters
    return value.split(/[,;|]/).map(v => v.trim()).filter(v => v);
  }
  return [];
}

function findDetailValue(details: Array<{ label: string; value: string }>, ...labels: string[]): string {
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

function extractNumber(value: string): string {
  if (!value) return '';
  // Extract numbers and units
  const match = value.match(/([\d.,]+)\s*([a-zA-Zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]*)/i);
  if (match) {
    return match[0].trim();
  }
  return normalizeText(value);
}

function parseUnitTypes(areaString: string): Array<{
  type: string;
  area: string;
  bedrooms: string;
  bathrooms: string;
  description: string;
}> {
  if (!areaString) return [];
  
  // Extract area ranges like "45-61-77-84m2" or "47-67-78m2"
  const areas = areaString.match(/(\d+)/g) || [];
  
  return areas.map((area, index) => ({
    type: `Loại ${index + 1}`,
    area: `${area}m²`,
    bedrooms: '',
    bathrooms: '',
    description: `Căn hộ ${area}m²`
  }));
}

function normalizeProject(raw: RawProject): ProjectInfo {
  const details = raw.details || [];
  
  // Extract pricing information
  const priceValue = findDetailValue(details, 'giá', 'price', 'giá bán');
  const pricePerSqm = priceValue.includes('triệu/m2') || priceValue.includes('triệu/m²') 
    ? priceValue 
    : priceValue.includes('triệu') 
      ? `${priceValue}/m²`
      : priceValue;

  // Extract scale information
  const quyMo = findDetailValue(details, 'quy mô', 'tổng diện tích', 'diện tích đất');
  const soBlock = findDetailValue(details, 'số block', 'block', 'số tòa');
  const soTang = findDetailValue(details, 'số tầng', 'tầng');
  const soCanHo = findDetailValue(details, 'số căn hộ', 'căn hộ');
  const matDo = findDetailValue(details, 'mật độ', 'mật độ xây dựng');
  const dienTichCanHo = findDetailValue(details, 'diện tích căn hộ', 'diện tích');

  // Extract time information
  const thoiGianGiaoNha = findDetailValue(details, 'thời gian giao nhà', 'giao nhà', 'handover');
  const thoiGianXayDung = findDetailValue(details, 'thời gian xây dựng', 'khởi công', 'construction start');
  const trangThai = findDetailValue(details, 'trạng thái', 'status');

  // Extract location from name or details
  const locationInfo = findDetailValue(details, 'địa chỉ', 'vị trí', 'location', 'address');
  
  // Extract description from sections
  let description = '';
  let highlights: string[] = [];
  
  if (raw.sections && raw.sections.length > 0) {
    const overviewSection = raw.sections.find(s => 
      s.title.toLowerCase().includes('tổng quan') || 
      s.title.toLowerCase().includes('giới thiệu') ||
      s.title.toLowerCase().includes('overview')
    );
    
    if (overviewSection) {
      description = overviewSection.paragraphs.join('\n\n');
      highlights = overviewSection.paragraphs.filter(p => p.length < 200);
    } else if (raw.sections[0]) {
      description = raw.sections[0].paragraphs.join('\n\n');
    }
  }

  // Extract amenities from sections
  const amenitiesSection = raw.sections?.find(s => 
    s.title.toLowerCase().includes('tiện ích') || 
    s.title.toLowerCase().includes('amenities')
  );
  
  const internalAmenities: string[] = [];
  const externalAmenities: string[] = [];
  
  if (amenitiesSection) {
    const allAmenities = [...amenitiesSection.paragraphs, ...amenitiesSection.facts.map(f => f.value)];
    allAmenities.forEach(amenity => {
      const lower = amenity.toLowerCase();
      if (lower.includes('hồ bơi') || lower.includes('gym') || lower.includes('spa') || 
          lower.includes('thang máy') || lower.includes('lobby')) {
        internalAmenities.push(amenity);
      } else {
        externalAmenities.push(amenity);
      }
    });
  }

  // Extract gallery
  const images: string[] = raw.media?.filter(m => m.type === 'image').map(m => m.url) || [];
  const videos: string[] = raw.media?.filter(m => m.type === 'video').map(m => m.url) || [];

  // Extract investor/developer from sections or details
  const investor = findDetailValue(details, 'chủ đầu tư', 'investor', 'nhà đầu tư');
  const developers: string[] = [];
  const contractors: string[] = [];
  
  const developerValue = findDetailValue(details, 'nhà phát triển', 'developer', 'phát triển');
  if (developerValue) {
    developers.push(...normalizeArray(developerValue));
  }

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
      district: extractDistrictFromName(raw.name) || '',
      coordinates: '',
      surrounding: ''
    },
    overview: {
      description: description || '',
      highlights: highlights.length > 0 ? highlights : (description ? [description.substring(0, 200)] : [])
    },
    investor: investor || '',
    developers: developers.length > 0 ? developers : (investor ? [investor] : []),
    contractors: contractors,
    legalStatus: trangThai || '',
    ownership: '',
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
      numberOfUnits: extractNumber(soCanHo) || '',
      greenArea: '',
      parking: ''
    },
    design: {
      architectureStyle: '',
      interior: '',
      floorPlans: '',
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
      paymentPolicy: '',
      promotion: '',
      maintenanceFee: '',
      managementFee: ''
    },
    policies: {
      salesPolicy: '',
      bankSupport: '',
      loanSupport: '',
      interestRatePolicy: ''
    },
    gallery: {
      images: images,
      videos: videos
    },
    attachments: []
  };
}

function extractDistrictFromName(name: string): string {
  const districts = ['Hoà Xuân', 'Hải Châu', 'Thanh Khê', 'Liên Chiểu', 'Ngũ Hành Sơn', 'Sơn Trà', 'Cẩm Lệ'];
  const nameLower = name.toLowerCase();
  
  for (const district of districts) {
    if (nameLower.includes(district.toLowerCase())) {
      return district;
    }
  }
  
  return '';
}

// Main execution
const assetsPath = path.join(__dirname, '..', 'assets', 'projects.json');
const outputPath = path.join(__dirname, '..', 'assets', 'projects.json');

try {
  const rawData = JSON.parse(fs.readFileSync(assetsPath, 'utf-8')) as RawProject[];
  const normalizedProjects: ProjectInfo[] = rawData.map(normalizeProject);
  
  fs.writeFileSync(outputPath, JSON.stringify(normalizedProjects, null, 2), 'utf-8');
  
  console.log(`✅ Đã normalize ${normalizedProjects.length} dự án thành công!`);
  console.log(`📁 File output: ${outputPath}`);
} catch (error) {
  console.error('❌ Lỗi khi normalize dữ liệu:', error);
  process.exit(1);
}

