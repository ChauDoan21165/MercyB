import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  const tiers = [
    {
      name: { vi: "Miễn phí", en: "Free" },
      price: "$0",
      features: {
        vi: ["10 bài học ngẫu nhiên/ngày", "Huy hiệu thành tựu", "Theo dõi chuỗi học tập"],
        en: ["10 random entries/day", "Achievement badges", "Learning streaks"]
      }
    },
    {
      name: { vi: "VIP1", en: "VIP1" },
      price: "$2",
      period: { vi: "/tháng", en: "/month" },
      features: {
        vi: ["1 chủ đề được cá nhân hóa", "1 phòng đầy đủ/ngày", "Tất cả tính năng Miễn phí"],
        en: ["1 tailored topic", "1 full room/day", "All Free features"]
      },
      popular: true
    },
    {
      name: { vi: "VIP2", en: "VIP2" },
      price: "$4",
      period: { vi: "/tháng", en: "/month" },
      features: {
        vi: ["2 chủ đề được cá nhân hóa", "2 phòng đầy đủ/ngày", "Tất cả tính năng VIP1"],
        en: ["2 tailored topics", "2 full rooms/day", "All VIP1 features"]
      }
    },
    {
      name: { vi: "VIP3", en: "VIP3" },
      price: "$6",
      period: { vi: "/tháng", en: "/month" },
      features: {
        vi: ["3 chủ đề được cá nhân hóa", "3 phòng đầy đủ/ngày", "Ưu tiên hỗ trợ"],
        en: ["3 tailored topics", "3 full rooms/day", "Priority support"]
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-6">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Mercy Blade
          </h1>
          
          <div className="space-y-2 max-w-3xl mx-auto">
            <p className="text-2xl font-semibold text-foreground/90">
              Ứng dụng học về sức khỏe, cuộc sống và tiếng Anh
            </p>
            <p className="text-xl text-muted-foreground">
              Wellness and knowledge app for learning health, life, and English
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-hover transition-all"
              onClick={() => navigate("/rooms")}
            >
              <span className="flex flex-col items-start">
                <span className="text-sm">Khám phá các phòng</span>
                <span className="text-xs opacity-90">Explore Rooms</span>
              </span>
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-2"
              onClick={() => navigate("/rooms")}
            >
              <span className="flex flex-col items-start">
                <span className="text-sm">Bắt đầu học</span>
                <span className="text-xs opacity-90">Start Learning</span>
              </span>
            </Button>
          </div>
        </div>

        {/* Subscription Tiers */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-foreground">
              Chọn gói phù hợp với bạn
            </h2>
            <p className="text-lg text-muted-foreground">
              Choose your plan
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
                    Phổ biến / Popular
                  </div>
                )}
                
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-foreground">
                      {tier.name.vi}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {tier.name.en}
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
                    {tier.features.vi.map((feature, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-foreground">{feature}</span>
                        </div>
                        <div className="pl-7 text-xs text-muted-foreground">
                          {tier.features.en[idx]}
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
                  >
                    <span className="flex flex-col">
                      <span className="text-sm">Chọn gói</span>
                      <span className="text-xs opacity-90">Choose Plan</span>
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
            Học từ vựng tiếng Anh qua nội dung sức khỏe thực tế
          </p>
          <p className="text-xs text-muted-foreground">
            Learn English vocabulary through real health content
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
