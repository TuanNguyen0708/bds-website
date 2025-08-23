import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AboutSection = () => {
  const achievements = [
    { number: "500+", label: "Giao dịch thành công" },
    { number: "1000+", label: "Khách hàng hài lòng" },
    { number: "10+", label: "Năm kinh nghiệm" },
    { number: "50+", label: "Đối tác tin cậy" },
  ];

  const values = [
    {
      icon: (
        <svg
          className="w-8 h-8 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: "Uy tín",
      description: "Cam kết thực hiện đúng những gì đã hứa với khách hàng",
    },
    {
      icon: (
        <svg
          className="w-8 h-8 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      title: "Chuyên nghiệp",
      description: "Đội ngũ nhân viên được đào tạo bài bản, có kinh nghiệm",
    },
    {
      icon: (
        <svg
          className="w-8 h-8 text-purple-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      ),
      title: "Tận tâm",
      description: "Luôn đặt lợi ích của khách hàng lên hàng đầu",
    },
  ];

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Về Phu Nguyen Land
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Phu Nguyen Land là công ty tư vấn bất động sản hàng đầu với hơn
                10 năm kinh nghiệm trong lĩnh vực môi giới, tư vấn và đầu tư bất
                động sản. Chúng tôi tự hào đã giúp hàng nghìn khách hàng tìm
                được ngôi nhà mơ ước và đưa ra những quyết định đầu tư thông
                minh.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Với đội ngũ chuyên gia giàu kinh nghiệm và hệ thống dịch vụ toàn
                diện, chúng tôi cam kết mang đến những giải pháp tối ưu nhất cho
                mọi nhu cầu bất động sản của bạn.
              </p>
            </div>

            {/* Values */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Giá trị cốt lõi
              </h3>
              <div className="grid gap-4">
                {values.map((value, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">{value.icon}</div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {value.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {value.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Tìm hiểu thêm về chúng tôi
            </Button>
          </div>

          {/* Right Content */}
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6">
              {achievements.map((achievement, index) => (
                <Card
                  key={index}
                  className="text-center border-0 shadow-lg bg-white"
                >
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {achievement.number}
                    </div>
                    <div className="text-sm text-gray-600">
                      {achievement.label}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Team Image Placeholder */}
            <Card className="border-0 shadow-xl bg-white overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-blue-600 rounded-full mx-auto flex items-center justify-center">
                      <svg
                        className="w-10 h-10 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">
                        Đội ngũ chuyên gia
                      </h4>
                      <p className="text-gray-600">
                        Hơn 50 chuyên gia giàu kinh nghiệm
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
