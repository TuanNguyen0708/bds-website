import { Button } from '@/components/ui/button'
import BackgroundSlider from './BackgroundSlider'

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 sm:pt-16">
      {/* Background Image Slider */}
      <BackgroundSlider />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="grid  gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white leading-tight drop-shadow-lg">
                Giải pháp
                <span className="text-blue-200 block">Bất động sản</span>
                Toàn diện
              </h1>
              <p className="text-lg sm:text-xl text-gray-100 max-w-2xl mx-auto lg:mx-0 drop-shadow-md">
                Chúng tôi cung cấp các dịch vụ tư vấn, môi giới và đầu tư bất động sản chuyên nghiệp, 
                giúp bạn đưa ra quyết định thông minh trong lĩnh vực bất động sản.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 shadow-lg">
                Tìm hiểu thêm
              </Button>
              <Button size="lg" variant="outline" className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 border-2 border-white text-white hover:bg-white hover:text-gray-900 shadow-lg">
                Liên hệ tư vấn
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 sm:pt-8">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-blue-200 drop-shadow-md">500+</div>
                <div className="text-xs sm:text-sm text-gray-100 drop-shadow-md">Giao dịch thành công</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-blue-200 drop-shadow-md">1000+</div>
                <div className="text-xs sm:text-sm text-gray-100 drop-shadow-md">Khách hàng hài lòng</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-blue-200 drop-shadow-md">10+</div>
                <div className="text-xs sm:text-sm text-gray-100 drop-shadow-md">Năm kinh nghiệm</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default HeroSection
