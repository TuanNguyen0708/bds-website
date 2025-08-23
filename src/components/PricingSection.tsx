const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Chính Sách Bán Hàng & Giá Bán
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Khám phá chính sách ưu đãi đặc biệt và giá bán hấp dẫn của Regal Complex Đà Nẵng
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Content - Sales Policy & Pricing */}
          <div className="space-y-8">

            {/* Pricing */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h4 className="text-2xl font-bold text-gray-900 mb-6 text-center">Giá Bán Căn Hộ</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                  <span className="font-medium text-gray-700">Căn 1 phòng ngủ:</span>
                  <span className="text-xl font-bold text-blue-600">Từ 2.X tỷ đồng</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                  <span className="font-medium text-gray-700">Căn 2 phòng ngủ:</span>
                  <span className="text-xl font-bold text-green-600">Từ 3.X tỷ đồng</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                  <span className="font-medium text-gray-700">Căn 3 phòng ngủ:</span>
                  <span className="text-xl font-bold text-purple-600">Từ 5.X tỷ đồng</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg text-center">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Giá bán:</span> Chỉ từ 5X triệu/m² (bao gồm VAT)
                </p>
              </div>
            </div>

            {/* Key Benefits */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border-l-4 border-blue-500">
                <h4 className="text-xl font-bold text-blue-600 mb-3">Ưu Đãi Đặc Biệt</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center space-x-2">
                    <span className="text-blue-500">✓</span>
                    <span>Khách hàng được ưu tiên chọn căn theo bảng hàng trực tiếp từ chủ đầu tư</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-blue-500">✓</span>
                    <span>Chính sách chiết khấu đặc biệt cho nhà đầu tư và khách hàng mua ở giai đoạn 1</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-blue-500">✓</span>
                    <span>Bàn giao nội thất tiêu chuẩn 5 sao</span>
                  </li>
                </ul>
              </div>

              {/* Financial Support */}
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border-l-4 border-green-500">
                <h4 className="text-xl font-bold text-green-600 mb-3">Hỗ Trợ Tài Chính</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>Vay mua với lãi suất ưu đãi</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>Hỗ trợ vay tối đa đến 75% giá trị hợp đồng</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>Thời hạn vay lên đến 35 năm</span>
                  </li>
                </ul>
              </div>

              {/* Quick Payment Discount */}
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-xl border-l-4 border-orange-500">
                <h4 className="text-xl font-bold text-orange-600 mb-3">Chiết Khấu Thanh Toán Nhanh</h4>
                <p className="text-gray-700 mb-3">
                  Khách hàng chọn phương thức thanh toán nhanh sẽ được chiết khấu từ 4% đến 6.5% trực tiếp vào giá bán.
                </p>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-white p-3 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">4%</div>
                    <div className="text-sm text-gray-600">Chiết khấu cơ bản</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">6.5%</div>
                    <div className="text-sm text-gray-600">Chiết khấu tối đa</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Payment Schedule */}
          <div className="space-y-8">

            {/* Payment Schedule */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h4 className="text-2xl font-bold text-gray-900 mb-6 text-center">Tiến Độ Thanh Toán</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Giữ chỗ</div>
                    <div className="text-sm text-gray-600">50 triệu đồng/suất booking thiện chí</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Đợt 1</div>
                    <div className="text-sm text-gray-600">30% khi ký hợp đồng mua bán (bao gồm tiền giữ chỗ)</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Đợt 2</div>
                    <div className="text-sm text-gray-600">10% khi hoàn thành tầng 5</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Đợt 3</div>
                    <div className="text-sm text-gray-600">10% khi hoàn thành tầng 10</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">5</div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Đợt 4</div>
                    <div className="text-sm text-gray-600">10% khi hoàn thành tầng 15</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">6</div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Đợt 5</div>
                    <div className="text-sm text-gray-600">10% khi cất nóc</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-bold">7</div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Đợt 6</div>
                    <div className="text-sm text-gray-600">25% + 2% phí bảo trì khi có thông báo nhận bàn giao (dự kiến quý II/2027)</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center text-sm font-bold">8</div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Đợt 7</div>
                    <div className="text-sm text-gray-600">5% khi nhận giấy chứng nhận quyền sở hữu</div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center p-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl text-white">
              <h4 className="text-xl font-bold mb-3">Sẵn Sàng Đầu Tư?</h4>
              <p className="mb-4 text-blue-100">
                Liên hệ ngay để được tư vấn chi tiết về chính sách và giá bán
              </p>
              <a 
                href="#contact" 
                className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Liên Hệ Tư Vấn Ngay
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PricingSection
