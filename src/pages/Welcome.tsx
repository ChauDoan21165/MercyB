import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PointsDisplay } from "@/components/PointsDisplay";
import { useUserAccess } from "@/hooks/useUserAccess";
import { PromoCodeBanner } from "@/components/PromoCodeBanner";

const Welcome = () => {
  const navigate = useNavigate();
  const { isAdmin } = useUserAccess();

  const tiers = [
    {
      name: { vi: "Miễn phí", en: "Free" },
      price: "$0",
      features: {
        en: ["10 random entries/day", "Achievement badges", "Learning streaks"],
        vi: ["10 mục ngẫu nhiên/ngày", "Huy hiệu thành tựu", "Chuỗi điểm thưởng"]
      }
    },
    {
      name: { vi: "VIP1", en: "VIP1" },
      price: "$2",
      period: { vi: "/tháng", en: "/month" },
      features: {
        en: ["Request 1 custom topic", "1 full room access/day", "All Free features"],
        vi: ["Yêu cầu 1 chủ đề", "Truy cập tự do 1 phòng/ngày", "Tất cả tính năng Miễn phí"]
      },
      popular: true
    },
    {
      name: { vi: "VIP2", en: "VIP2" },
      price: "$4",
      period: { vi: "/tháng", en: "/month" },
      features: {
        en: ["Request 2 custom topics", "2 full rooms access/day", "All VIP1 features"],
        vi: ["Yêu cầu 2 chủ đề", "Truy cập tự do 2 phòng/ngày", "Tất cả tính năng VIP1"]
      }
    },
    {
      name: { vi: "VIP3", en: "VIP3" },
      price: "$6",
      period: { vi: "/tháng", en: "/month" },
      features: {
        en: ["3 custom topics", "3 rooms access/day", "AI Matchmaking", "Voice chat", "Priority support"],
        vi: ["3 chủ đề tùy chỉnh", "Truy cập 3 phòng/ngày", "Ghép đôi AI", "Chat bằng giọng nói", "Hỗ trợ ưu tiên"]
      }
    }
  ];

  return (
    <div className="min-h-screen" style={{ background: 'hsl(var(--page-welcome))' }}>
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header with Sign In Button */}
        <div className="flex justify-end mb-4">
          <Button 
            variant="outline"
            onClick={() => navigate("/auth")}
          >
            Sign In / Đăng Nhập
          </Button>
        </div>

        {/* Promo Code Banner */}
        <PromoCodeBanner />

        {/* Hero Section */}
        <div className="text-center mb-16 space-y-6">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Mercy Blade
          </h1>
          
          {/* Points Display */}
          <div className="max-w-md mx-auto">
            <PointsDisplay />
          </div>
          
          <div className="space-y-2 max-w-3xl mx-auto">
            <p className="text-2xl font-semibold text-foreground/90">
              Wellness and knowledge app for learning health, life, and English
            </p>
            <p className="text-xl text-muted-foreground">
              Ứng Dụng Học Về Sức Khỏe, Cuộc Sống Và Tiếng Anh
            </p>
          </div>

          <Card className="max-w-4xl mx-auto mt-8 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
            <div className="p-8 space-y-6">
              <div className="space-y-3">
                <p className="text-base leading-relaxed text-foreground/90">
                  Mercy Blade is your compassionate companion for health and wellness journeys. It offers bite-sized, evidence-based guidance on topics like burnout recovery, habit building, and diabetes care, empowering you with practical steps and gentle encouragement. Whether managing stress or fostering confidence, Mercy Blade supports sustainable growth in a supportive, non-judgmental space.
                </p>
                <p className="text-base leading-relaxed text-muted-foreground">
                  Mercy Blade là người bạn đồng hành đầy lòng thương xót cho hành trình sức khỏe và phúc lợi. Nó cung cấp hướng dẫn ngắn gọn, dựa trên bằng chứng về các chủ đề như phục hồi kiệt sức, xây dựng thói quen và chăm sóc đái tháo đường, trao quyền cho bạn với các bước thực tế và khích lệ nhẹ nhàng. Dù quản lý căng thẳng hay nuôi dưỡng tự tin, Mercy Blade hỗ trợ tăng trưởng bền vững trong không gian hỗ trợ, không phán xét.
                </p>
              </div>
            </div>
          </Card>

          {/* Get Started Section - Free Users Onboarding */}
          <Card className="max-w-4xl mx-auto mt-8" style={{ backgroundColor: '#4CAF50' }}>
            <div className="p-8 space-y-6">
              <div className="text-center space-y-3">
                <h2 className="text-3xl font-bold text-white">
                  Get Started
                </h2>
                <p className="text-xl text-white/90">
                  Bắt Đầu Ngay
                </p>
                <p className="text-base text-white/80 max-w-2xl mx-auto">
                  Free users get 10 questions and 10 rooms daily. Learn how to maximize your experience!
                </p>
                <p className="text-sm text-white/70 max-w-2xl mx-auto">
                  Người dùng miễn phí nhận 10 câu hỏi và 10 phòng mỗi ngày. Học cách tối đa hóa trải nghiệm!
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
                <Button 
                  size="lg"
                  className="bg-white text-[#4CAF50] hover:bg-white/90 hover:shadow-hover transition-all min-w-[200px]"
                  onClick={() => navigate("/chat/onboarding-free-users")}
                >
                  <span className="flex flex-col items-center">
                    <span className="text-base font-semibold">Start Learning</span>
                    <span className="text-sm opacity-90">Bắt Đầu Học</span>
                  </span>
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10 min-w-[200px]"
                  onClick={() => navigate("/chat/user-profile-dashboard")}
                >
                  <span className="flex flex-col items-center">
                    <span className="text-base font-semibold">View Dashboard</span>
                    <span className="text-sm opacity-90">Xem Bảng Điều Khiển</span>
                  </span>
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10 min-w-[200px]"
                  onClick={() => navigate("/matchmaking")}
                >
                  <span className="flex flex-col items-center">
                    <span className="text-base font-semibold">Find Partner</span>
                    <span className="text-sm opacity-90">Tìm Bạn Học</span>
                  </span>
                </Button>
              </div>
            </div>
          </Card>

          <div className="flex justify-center items-center gap-4 pt-8 flex-wrap">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-hover transition-all min-w-[200px]"
              onClick={() => navigate("/rooms")}
            >
              <span className="flex flex-col items-center">
                <span className="text-base font-semibold">Explore Free Rooms</span>
                <span className="text-sm opacity-90">Khám Phá Phòng Miễn Phí</span>
              </span>
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 hover:bg-primary/10 min-w-[200px]"
              onClick={() => navigate("/all-rooms")}
            >
              <span className="flex flex-col items-center">
                <span className="text-base font-semibold">View All Rooms</span>
                <span className="text-sm opacity-90">Xem Tất Cả Phòng</span>
              </span>
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-accent hover:bg-accent/10 min-w-[200px]"
              onClick={() => navigate("/vip1")}
            >
              <span className="flex flex-col items-center">
                <span className="text-base font-semibold">VIP1 Rooms</span>
                <span className="text-sm opacity-90">Phòng VIP1</span>
              </span>
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-primary hover:bg-primary/10 min-w-[200px]"
              onClick={() => navigate("/vip2")}
            >
              <span className="flex flex-col items-center">
                <span className="text-base font-semibold">VIP2 Rooms</span>
                <span className="text-sm opacity-90">Phòng VIP2</span>
              </span>
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-secondary hover:bg-secondary/10 min-w-[200px]"
              onClick={() => navigate("/vip3")}
            >
              <span className="flex flex-col items-center">
                <span className="text-base font-semibold">VIP3 Rooms</span>
                <span className="text-sm opacity-90">Phòng VIP3</span>
              </span>
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-secondary hover:bg-secondary/10 min-w-[200px]"
              onClick={() => navigate("/vip-topic-request")}
            >
              <span className="flex flex-col items-center">
                <span className="text-base font-semibold">🌟 Request Custom Topic</span>
                <span className="text-sm opacity-90">Yêu Cầu Chủ Đề Riêng</span>
              </span>
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-secondary hover:bg-secondary/10 min-w-[200px]"
              onClick={() => navigate("/payment-test")}
            >
              <span className="flex flex-col items-center">
                <span className="text-base font-semibold">Test Payment</span>
                <span className="text-sm opacity-90">Test Thanh Toán</span>
              </span>
            </Button>
            {isAdmin && (
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-destructive hover:bg-destructive/10 min-w-[200px]"
                onClick={() => navigate("/admin/vip-rooms")}
              >
                <span className="flex flex-col items-center gap-1">
                  <span className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span className="text-base font-semibold">Admin Dashboard</span>
                  </span>
                  <span className="text-sm opacity-90">Quản Trị Viên</span>
                </span>
              </Button>
            )}
          </div>
        </div>

        {/* Subscription Tiers */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-foreground">
              Choose Your Plan
            </h2>
            <p className="text-lg text-muted-foreground">
              Chọn Gói Phù Hợp Với Bạn
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map((tier, index) => (
              <Card
                key={index}
                className={`relative p-6 transition-all hover:shadow-hover hover:scale-105 ${
                  tier.popular ? "border-2 border-primary shadow-soft" : ""
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-1 rounded-full text-xs font-semibold">
                    Popular / Phổ Biến
                  </div>
                )}
                
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-foreground">
                      {tier.name.en}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {tier.name.vi}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-primary">
                      {tier.price}
                    </span>
                    {tier.period && (
                      <span className="text-muted-foreground">
                        {tier.period.vi}
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 pt-4">
                    {tier.features.en.map((feature, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-foreground">{feature}</span>
                        </div>
                        <div className="pl-7 text-xs text-muted-foreground">
                          {tier.features.vi[idx]}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button
                    className={`w-full mt-6 ${
                      tier.popular
                        ? "bg-gradient-to-r from-primary to-accent"
                        : ""
                    }`}
                    variant={tier.popular ? "default" : "outline"}
                    onClick={() => navigate("/payment-test")}
                  >
                    <span className="flex flex-col">
                      <span className="text-sm">Choose Plan</span>
                      <span className="text-xs opacity-90">Chọn Gói</span>
                    </span>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-16 space-y-2">
          <p className="text-sm text-muted-foreground">
            Learn English vocabulary through real health content
          </p>
          <p className="text-xs text-muted-foreground">
            Học Từ Vựng Tiếng Anh Qua Nội Dung Sức Khỏe Thực Tế
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
