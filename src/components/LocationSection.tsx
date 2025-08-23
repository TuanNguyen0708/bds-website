const LocationSection = () => {
  return (
    <section id="location" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Vị Trí Dự Án
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Khám phá vị trí đắc địa và tiềm năng phát triển của Regal Complex Đà Nẵng
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Content - Project Information */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-3xl md:text-4xl font-bold text-blue-600 leading-tight">
                BÍ MẬT REGAL COMPLEX ĐÀ NẴNG
              </h3>
              <h4 className="text-xl md:text-2xl font-semibold text-gray-800 leading-relaxed">
                SỞ HỮU ĐỊA ĐIỂM ĐẮC ĐỊA – NÂNG TẦM GIÁ TRỊ SỐNG ĐẲNG CẤP BẬC NHẤT
              </h4>
            </div>

            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p className="text-lg">
                Hãy tưởng tượng bạn đang sống tại một nơi hội tụ mọi điều kiện hoàn hảo: Vị trí vàng, tiện ích đẳng cấp, và tiềm năng gia tăng giá trị vượt bậc! Regal Complex Đà Nẵng, nằm ngay trái tim khu đô thị Phú Mỹ An, không chỉ đơn thuần là nơi an cư, mà còn là một tuyên ngôn về phong cách sống thượng lưu.
              </p>

              <p className="text-lg">
                Với vị trí hai mặt tiền đường Đào Duy Tùng, chỉ cách biển Sơn Thủy 1,5km, danh thắng Ngũ Hành Sơn 2km và bãi biển Mỹ Khê 9km, bạn sẽ tận hưởng cuộc sống mà người khác chỉ dám mơ.
              </p>

              <p className="text-lg">
                Regal Complex còn nằm ngay bên dòng sông Cổ Cò thơ mộng, kết nối trực tiếp với bãi biển Non Nước – thiên đường du lịch nổi tiếng. Đặc biệt, dự án này tạo nên một điểm nhấn độc tôn giữa hai trung tâm du lịch lớn: Đà Nẵng và Hội An. Tầm nhìn chiến lược này không chỉ mang lại không gian sống đẳng cấp, mà còn đảm bảo giá trị đầu tư gia tăng bền vững.
              </p>
            </div>

            {/* Tứ cận đắc địa */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h5 className="text-xl font-bold text-blue-600 mb-4">Tứ cận đắc địa:</h5>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="font-medium">Phía Đông:</span>
                  </div>
                  <p className="text-gray-700 ml-5">Giáp đường Vũ Văn Cẩn</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="font-medium">Phía Tây:</span>
                  </div>
                  <p className="text-gray-700 ml-5">Giáp đường Trần Quốc Vượng</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium">Phía Nam:</span>
                  </div>
                  <p className="text-gray-700 ml-5">Giáp đường Vùng Trung 14</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="font-medium">Phía Bắc:</span>
                  </div>
                  <p className="text-gray-700 ml-5">Giáp trục đường Đào Duy Tùng 42m</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p className="text-lg">
                Bạn sẽ bước vào thế giới tiện ích chuẩn 5 sao: sân golf ven biển, resort cao cấp, trường học quốc tế, và các danh thắng nổi tiếng. Đừng chỉ mơ về phong cách sống thượng lưu – hãy biến nó thành hiện thực tại Regal Complex Đà Nẵng.
              </p>

              <p className="text-lg font-semibold text-blue-600">
                Đặt chân vào, và bạn sẽ không muốn rời bước!
              </p>

              <p className="text-lg">
                Hãy hành động ngay hôm nay để không bỏ lỡ cơ hội đầu tư "vàng son" tại Regal Complex Đà Nẵng – nơi đỉnh cao của phong cách sống hiện đại và giá trị trường tồn theo thời gian với những cung bật cảm xúc tuyệt đối với chuỗi Luxury Condo Danang có 1-0-2.
              </p>
            </div>
          </div>

          {/* Right Content - Google Maps */}
          <div className="sticky top-24">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h4 className="text-xl font-bold text-gray-900 mb-2">Vị Trí Dự Án</h4>
                <p className="text-gray-600">Regal Complex Đà Nẵng - Khu đô thị Phú Mỹ An</p>
              </div>
              <div className="aspect-square w-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3835.738123456789!2d108.12345678901234!3d15.98765432109876!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTXCsDU5JzE1LjYiTiAxMDjCsDA3JzM0LjQiRQ!5e0!3m2!1svi!2s!4v1234567890123"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Regal Complex Đà Nẵng Location"
                  className="w-full h-full"
                ></iframe>
              </div>
              <div className="p-4 bg-gray-50">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>📍 Đường Đào Duy Tùng, Phú Mỹ An</span>
                  <a 
                    href="https://maps.google.com/?q=Regal+Complex+Da+Nang+Phu+My+An+Da+Nang" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Xem trên Google Maps →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LocationSection
