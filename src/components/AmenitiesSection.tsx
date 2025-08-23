const AmenitiesSection = () => {
  const amenities = [
    {
      category: "Tiện ích Thương mại & Giải trí",
      items: [
        {
          title: "Trung tâm thương mại 3 tầng",
          description: "Diện tích 10.000 m², tích hợp các dịch vụ giải trí, ẩm thực, giáo dục và chăm sóc sức khỏe.",
          icon: "🏢"
        },
        {
          title: "Sky bar và nhà hàng",
          description: "Tọa lạc trên cao, mang đến trải nghiệm ẩm thực với tầm nhìn toàn cảnh thành phố.",
          icon: "🍽️"
        },
        {
          title: "Quảng trường ánh sáng",
          description: "Điểm nhấn kiến trúc với đài phun nước, tháp đồng hồ và bến du thuyền mini.",
          icon: "✨"
        }
      ]
    },
    {
      category: "Tiện ích Thể thao & Sức khỏe",
      items: [
        {
          title: "Hồ bơi ngoài trời",
          description: "Thiết kế hiện đại, là nơi thư giãn lý tưởng với view biển tuyệt đẹp.",
          icon: "🏊‍♂️"
        },
        {
          title: "Phòng tập gym cao cấp",
          description: "Trang thiết bị hiện đại, phục vụ 24/7 cho cư dân.",
          icon: "💪"
        },
        {
          title: "Spa & Wellness",
          description: "Dịch vụ chăm sóc sức khỏe và thư giãn đẳng cấp 5 sao.",
          icon: "🧘‍♀️"
        }
      ]
    },
    {
      category: "Tiện ích Gia đình & Trẻ em",
      items: [
        {
          title: "Kids Art",
          description: "Khu vui chơi trong nhà dành cho trẻ em, kết hợp giáo dục và giải trí sáng tạo.",
          icon: "🎨"
        },
        {
          title: "Vườn trẻ em",
          description: "Không gian vui chơi ngoài trời an toàn với các thiết bị hiện đại.",
          icon: "🌳"
        },
        {
          title: "Phòng sinh hoạt cộng đồng",
          description: "Nơi tổ chức các hoạt động văn hóa, giao lưu giữa các cư dân.",
          icon: "🏠"
        }
      ]
    },
    {
      category: "Tiện ích An ninh & Giao thông",
      items: [
        {
          title: "Hầm giữ xe",
          description: "Rộng rãi, hiện đại, đảm bảo an ninh 24/7 với hệ thống camera và bảo vệ chuyên nghiệp.",
          icon: "🚗"
        },
        {
          title: "Hệ thống an ninh 24/7",
          description: "Bảo vệ chuyên nghiệp, camera giám sát toàn bộ khu vực.",
          icon: "🔒"
        },
        {
          title: "Lobby sang trọng",
          description: "Sảnh đón tiếp cao cấp với dịch vụ concierge chuyên nghiệp.",
          icon: "🏛️"
        }
      ]
    },
    {
      category: "Tiện ích Cảnh quan & Môi trường",
      items: [
        {
          title: "Công viên xanh",
          description: "Không gian xanh mát với hệ thống cây xanh, hoa cỏ được chăm sóc chu đáo.",
          icon: "🌿"
        },
        {
          title: "Hồ cảnh quan",
          description: "Hồ nước tạo điểm nhấn thẩm mỹ và điều hòa không khí.",
          icon: "💧"
        },
        {
          title: "Đường đi bộ ven biển",
          description: "Lối đi bộ dọc bờ biển, nơi thư giãn và tập thể dục lý tưởng.",
          icon: "🚶‍♂️"
        }
      ]
    },
    {
      category: "Tiện ích Dịch vụ & Tiện nghi",
      items: [
        {
          title: "Dịch vụ giặt là",
          description: "Dịch vụ giặt là cao cấp, phục vụ nhu cầu của cư dân.",
          icon: "👕"
        },
        {
          title: "Phòng họp",
          description: "Phòng họp hiện đại phục vụ nhu cầu làm việc tại nhà.",
          icon: "💼"
        },
        {
          title: "Khu BBQ ngoài trời",
          description: "Không gian tổ chức tiệc nướng ngoài trời với view biển.",
          icon: "🍖"
        }
      ]
    }
  ];

  return (
    <section id="amenities" className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Tiện Ích Đẳng Cấp 5 Sao
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Khám phá hệ thống tiện ích hoàn hảo tại Regal Complex Đà Nẵng - Nơi cuộc sống thượng lưu gặp gỡ tiện nghi hiện đại
          </p>
        </div>

        <div className="space-y-16">
          {amenities.map((category, categoryIndex) => (
            <div key={categoryIndex} className="space-y-8">
              <div className="text-center">
                <h3 className="text-2xl md:text-3xl font-bold text-blue-600 mb-4">
                  {category.category}
                </h3>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.items.map((item, itemIndex) => (
                  <div 
                    key={itemIndex} 
                    className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                            {item.title}
                          </h4>
                          <p className="text-gray-600 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Trải Nghiệm Cuộc Sống Đẳng Cấp
            </h3>
            <p className="text-lg text-blue-100 mb-6 max-w-2xl mx-auto">
              Đăng ký ngay để được tư vấn chi tiết về các tiện ích và trải nghiệm cuộc sống tại Regal Complex Đà Nẵng
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="#contact" 
                className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
              >
                Đăng Ký Tư Vấn
              </a>
              <a 
                href="#pricing" 
                className="inline-block bg-transparent text-white border-2 border-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Xem Giá & Chính Sách
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AmenitiesSection;
