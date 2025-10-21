import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Shield, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PointsDisplay } from "@/components/PointsDisplay";
import { useUserAccess } from "@/hooks/useUserAccess";
import { PromoCodeBanner } from "@/components/PromoCodeBanner";
import { UsernameSetup } from "@/components/UsernameSetup";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Welcome = () => {
  const navigate = useNavigate();
  const { isAdmin } = useUserAccess();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [showUsernameSetup, setShowUsernameSetup] = useState(false);
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);

  useEffect(() => {
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkUser();
    });
    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    setIsCheckingProfile(true);
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    
    if (user) {
      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      if (!error && profileData) {
        setProfile(profileData);
        
        // Only show username setup if username is null, undefined, or empty
        const hasUsername = profileData.username && profileData.username.trim().length > 0;
        setShowUsernameSetup(!hasUsername);
      } else {
        setShowUsernameSetup(false);
      }
    } else {
      setShowUsernameSetup(false);
    }
    
    setIsCheckingProfile(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    toast.success("Logged out successfully / Đăng xuất thành công");
  };

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
      {!isCheckingProfile && showUsernameSetup && (
        <UsernameSetup onComplete={() => {
          setShowUsernameSetup(false);
          checkUser();
        }} />
      )}
      
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header with User Info or Sign In Button */}
        <div className="flex justify-between items-center mb-4">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-accent to-primary hover:shadow-hover transition-all"
            onClick={() => navigate("/payment-test")}
          >
            <span className="flex flex-col items-center px-4">
              <span className="text-base font-semibold">💳 Upgrade / Subscribe</span>
              <span className="text-sm opacity-90">Nâng Cấp / Đăng Ký</span>
            </span>
          </Button>
          
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg">
                <User className="h-4 w-4 text-primary" />
                <span className="font-medium">
                  {profile?.username || user.email?.split('@')[0]}
                </span>
              </div>
              <Button 
                variant="outline"
                onClick={handleLogout}
                size="sm"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout / Đăng xuất
              </Button>
            </div>
          ) : (
            <Button 
              variant="outline"
              onClick={() => navigate("/auth")}
            >
              Sign In / Đăng Nhập
            </Button>
          )}
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
            <p className="text-xl font-semibold text-foreground/90">
              Wellness and knowledge app for learning health, life, and English
            </p>
            <p className="text-xl font-semibold text-foreground/90">
              Ứng Dụng Học Về Sức Khỏe, Cuộc Sống Và Tiếng Anh
            </p>
          </div>

          <Card className="max-w-4xl mx-auto mt-8 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
            <div className="p-8 space-y-6">
              <div className="space-y-3">
                <p className="text-base leading-relaxed text-foreground/90">
                  Mercy Blade is your compassionate companion on the journey of holistic development — from physical health, mental well-being, relationships, finances, to personal growth. The app provides concise, evidence-based, and easy-to-apply guidance to help you recover from burnout, build healthy habits, manage chronic conditions, and nurture confidence and inner peace. Whether you're looking to reduce stress, improve health, or develop yourself, Mercy Blade walks alongside you in a space full of understanding, encouragement, and non-judgment.
                </p>
                <p className="text-base leading-relaxed text-muted-foreground">
                  Mercy Blade là người bạn đồng hành đầy lòng trắc ẩn trên hành trình phát triển toàn diện của bạn — từ sức khỏe thể chất, tinh thần, mối quan hệ, tài chính cho đến sự trưởng thành cá nhân. Ứng dụng cung cấp những hướng dẫn ngắn gọn, dựa trên bằng chứng và dễ áp dụng, giúp bạn phục hồi sau kiệt sức, xây dựng thói quen lành mạnh, quản lý bệnh mạn tính, cũng như nuôi dưỡng sự tự tin và bình an nội tâm. Dù bạn đang tìm cách giảm căng thẳng, cải thiện sức khỏe hay phát triển bản thân, Mercy Blade luôn đồng hành trong một không gian đầy thấu hiểu, khích lệ và không phán xét.
                </p>
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
                <span className="text-base font-semibold">All Free Rooms</span>
                <span className="text-sm opacity-90">Tất Cả Phòng Miễn Phí</span>
              </span>
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-accent hover:bg-accent/10 min-w-[200px]"
              onClick={() => navigate("/rooms-vip1")}
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
              onClick={() => navigate("/rooms-vip2")}
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
              onClick={() => navigate("/rooms-vip3")}
            >
              <span className="flex flex-col items-center">
                <span className="text-base font-semibold">VIP3 Rooms</span>
                <span className="text-sm opacity-90">Phòng VIP3</span>
              </span>
            </Button>
          </div>
          
          {/* VIP Custom Topic Info */}
          <div className="text-center mt-8 p-4 max-w-2xl mx-auto">
            <p className="text-sm text-muted-foreground">
              🌟 VIP members can request custom topics tailored to their needs
            </p>
            <p className="text-xs text-muted-foreground">
              Thành viên VIP có thể yêu cầu chủ đề tùy chỉnh theo nhu cầu
            </p>
          </div>
          
          {isAdmin && (
            <div className="flex justify-center mt-4">
              <button
                className="w-2 h-2 rounded-full bg-muted-foreground/20 hover:bg-destructive/50 transition-colors cursor-pointer"
                onClick={() => navigate("/admin/vip-rooms")}
                aria-label="Admin"
              />
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="text-center mt-16 space-y-2">
          <p className="text-sm text-muted-foreground">
            Learn English vocabulary through real-world content about health, life, and personal development
          </p>
          <p className="text-xs text-muted-foreground">
            Học từ vựng tiếng Anh qua nội dung thực tế về sức khỏe, cuộc sống và phát triển bản thân
          </p>
        </div>

        {/* Subscription Tiers */}
        <div className="space-y-8 mt-16">
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
      </div>
    </div>
  );
};

export default Welcome;
