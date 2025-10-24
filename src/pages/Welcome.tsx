import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Shield, LogOut, User, ArrowRight, Volume2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PointsDisplay } from "@/components/PointsDisplay";
import { useUserAccess } from "@/hooks/useUserAccess";
import { PromoCodeBanner } from "@/components/PromoCodeBanner";
import { UsernameSetup } from "@/components/UsernameSetup";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const Welcome = () => {
  const navigate = useNavigate();
  const { isAdmin, tier, canAccessVIP1, canAccessVIP2, canAccessVIP3 } = useUserAccess();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [showUsernameSetup, setShowUsernameSetup] = useState(false);
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

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
      },
      requiresAuth: true
    },
    {
      name: { vi: "VIP1", en: "VIP1" },
      price: "$2",
      period: { vi: "/tháng", en: "/month" },
      features: {
        en: ["Users can request one custom topic", "1 full room access/day", "🤖 AI Content"],
        vi: ["Người dùng có thể yêu cầu một chủ đề tùy chỉnh", "Truy cập tự do 1 phòng/ngày", "🤖 Nội dung tạo bởi AI"]
      },
      popular: true
    },
    {
      name: { vi: "VIP2", en: "VIP2" },
      price: "$4",
      period: { vi: "/tháng", en: "/month" },
      features: {
        en: ["Users can request two custom topics", "2 full rooms access/day", "🤖 AI Content"],
        vi: ["Người dùng có thể yêu cầu hai chủ đề tùy chỉnh", "Truy cập tự do 2 phòng/ngày", "🤖 Nội dung tạo bởi AI"]
      }
    },
    {
      name: { vi: "VIP3", en: "VIP3" },
      price: "$6",
      period: { vi: "/tháng", en: "/month" },
      features: {
        en: ["Users can request three custom topics", "3 rooms access/day", "AI Matchmaking", "Voice chat", "🤖 AI Content"],
        vi: ["Người dùng có thể yêu cầu ba chủ đề tùy chỉnh", "Truy cập 3 phòng/ngày", "Ghép đôi AI", "Chat bằng giọng nói", "🤖 Nội dung tạo bởi AI"]
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
        {/* Header with Home Page and User Info */}
        <div className="flex justify-between items-center mb-4">
          <Button 
            variant="outline"
            onClick={() => navigate("/intro")}
            className="border-2 border-primary/50 hover:bg-primary/10"
          >
            About / Giới Thiệu
          </Button>
          <div>
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
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16 space-y-6">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Mercy Blade
          </h1>
          
          {/* Intro Audio Button */}
          <div className="flex justify-center">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2"
              onClick={() => {
                if (audioRef.current) {
                  if (isPlaying) {
                    audioRef.current.pause();
                    setIsPlaying(false);
                  } else {
                    audioRef.current.play().catch(err => {
                      console.error('Audio playback error:', err);
                    });
                    setIsPlaying(true);
                  }
                }
              }}
            >
              <Volume2 className="w-5 h-5" /> 
              {isPlaying ? "Pause Intro Audio" : "Play Intro Audio"}
            </Button>
          </div>
          <audio 
            ref={audioRef} 
            src="/Mercy_Blade.mp3" 
            onEnded={() => setIsPlaying(false)}
            onPause={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
          />
          
          {/* Points Display */}
          <div className="max-w-md mx-auto">
            <PointsDisplay />
          </div>
          
          <div className="space-y-2 max-w-3xl mx-auto">
            <p className="text-xl font-semibold text-foreground/90">
              Overall human wellness app for health, life, and English learning
            </p>
            <p className="text-xl font-semibold text-foreground/90">
              Ứng dụng về sức khỏe tổng thể con người, cuộc sống và Tiếng Anh
            </p>
          </div>

          <Card className="max-w-4xl mx-auto mt-8 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
            <div className="p-8 space-y-6">
              <div className="space-y-3">
                <p className="text-base leading-relaxed text-foreground/90">
                  Mercy Blade is your compassionate companion on the journey of holistic development — from physical health, mental well-being, relationships, finances, to personal growth. The app provides concise, evidence-based, and easy-to-apply guidance to help you recover from burnout, build healthy habits, manage chronic conditions, and nurture confidence and inner peace. Whether you're looking to reduce stress, improve health, or develop yourself, Mercy Blade walks alongside you in a space full of understanding, encouragement, and non-judgment. (After some time using the app, we can help you find the most compatible learning buddy and potentially your soulmate.)
                </p>
                <p className="text-base leading-relaxed text-muted-foreground">
                  Mercy Blade là người bạn đồng hành đầy lòng trắc ẩn trên hành trình phát triển toàn diện của bạn — từ sức khỏe thể chất, tinh thần, mối quan hệ, tài chính cho đến sự trưởng thành cá nhân. Ứng dụng cung cấp những hướng dẫn ngắn gọn, dựa trên bằng chứng và dễ áp dụng, giúp bạn phục hồi sau kiệt sức, xây dựng thói quen lành mạnh, quản lý bệnh mạn tính, cũng như nuôi dưỡng sự tự tin và bình an nội tâm. Dù bạn đang tìm cách giảm căng thẳng, cải thiện sức khỏe hay phát triển bản thân, Mercy Blade luôn đồng hành trong một không gian đầy thấu hiểu, khích lệ và không phán xét. (Sau một thời gian sử dụng ứng dụng, chúng tôi có thể giúp bạn tìm được người bạn học tập phù hợp nhất và có thể là tri kỷ của bạn.)
                </p>
              </div>
            </div>
          </Card>

          <TooltipProvider>
            <div className="flex justify-center items-center gap-4 pt-8 flex-wrap">
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-primary hover:bg-primary/10 min-w-[200px]"
                onClick={() => navigate("/rooms")}
              >
                <span className="flex flex-col items-center">
                  <span className="text-base font-semibold">Free Rooms</span>
                  <span className="text-sm opacity-90">Phòng Miễn Phí</span>
                </span>
              </Button>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    size="lg"
                    variant="outline"
                    className="border-2 border-accent hover:bg-accent/10 min-w-[200px]"
                    onClick={() => canAccessVIP1 ? navigate("/rooms-vip1") : null}
                    disabled={!canAccessVIP1}
                  >
                    <span className="flex flex-col items-center">
                      <span className="text-base font-semibold">VIP1 Rooms</span>
                      <span className="text-sm opacity-90">Phòng VIP1</span>
                    </span>
                  </Button>
                </TooltipTrigger>
                {!canAccessVIP1 && (
                  <TooltipContent>
                    <p>Only for VIP1</p>
                  </TooltipContent>
                )}
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    size="lg"
                    variant="outline"
                    className="border-2 border-primary hover:bg-primary/10 min-w-[200px]"
                    onClick={() => canAccessVIP2 ? navigate("/rooms-vip2") : null}
                    disabled={!canAccessVIP2}
                  >
                    <span className="flex flex-col items-center">
                      <span className="text-base font-semibold">VIP2 Rooms</span>
                      <span className="text-sm opacity-90">Phòng VIP2</span>
                    </span>
                  </Button>
                </TooltipTrigger>
                {!canAccessVIP2 && (
                  <TooltipContent>
                    <p>Only for VIP2</p>
                  </TooltipContent>
                )}
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    size="lg"
                    variant="outline"
                    className="border-2 border-secondary hover:bg-secondary/10 min-w-[200px]"
                    onClick={() => canAccessVIP3 ? navigate("/rooms-vip3") : null}
                    disabled={!canAccessVIP3}
                  >
                    <span className="flex flex-col items-center">
                      <span className="text-base font-semibold">VIP3 Rooms</span>
                      <span className="text-sm opacity-90">Phòng VIP3</span>
                    </span>
                  </Button>
                </TooltipTrigger>
                {!canAccessVIP3 && (
                  <TooltipContent>
                    <p>Only for VIP3</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </div>
          </TooltipProvider>
          
          {/* VIP Custom Topic Info */}
          <div className="text-center mt-8 p-4 max-w-2xl mx-auto">
            <p className="text-sm text-muted-foreground">
              🌟 VIP members can request custom topics tailored to their needs
            </p>
            <p className="text-xs text-muted-foreground">
              Thành viên VIP có thể yêu cầu chủ đề tùy chỉnh theo nhu cầu
            </p>
          </div>
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
                className="relative p-6 transition-all hover:shadow-hover hover:scale-105 flex flex-col"
              >
                <div className="space-y-4 flex flex-col flex-grow">
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

                  <div className="space-y-3 pt-4 flex-grow">
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

                  <div className="mt-auto pt-4 flex justify-center">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          className={`w-14 h-14 rounded-full ${
                            index === 0 
                              ? "bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 hover:opacity-90" 
                              : index === 1
                              ? "bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-700 hover:opacity-90"
                              : index === 2
                              ? "bg-gradient-to-br from-yellow-400 via-yellow-600 to-yellow-800 hover:opacity-90"
                              : "bg-gradient-to-br from-yellow-500 via-yellow-700 to-yellow-900 hover:opacity-90"
                          }`}
                          size="icon"
                          disabled={tier.requiresAuth && !user}
                          onClick={() => {
                            if (index === 0) {
                              if (user) {
                                navigate("/rooms");
                              }
                            } else {
                              navigate(`/subscribe?tier=${tier.name.en.toLowerCase()}`);
                            }
                          }}
                        >
                          <ArrowRight className="w-6 h-6 text-white" />
                        </Button>
                      </TooltipTrigger>
                      {tier.requiresAuth && !user && (
                        <TooltipContent>
                          <p>Please register first / Vui lòng đăng ký trước</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Common Disclaimer */}
        <Card className="max-w-4xl mx-auto mt-12 p-3 bg-primary/5 dark:bg-primary/10 border-primary/20">
          <div className="space-y-1.5 text-xs text-muted-foreground leading-relaxed">
            <p>
              This app provides general wellness guidance and educational content. It is NOT a substitute for professional medical, psychological, or financial advice. If you are experiencing a medical emergency or mental health crisis, please contact emergency services immediately.
            </p>
            <p>
              Ứng dụng này cung cấp hướng dẫn sức khỏe tổng thể và nội dung giáo dục. Nó KHÔNG thay thế lời khuyên y tế, tâm lý hoặc tài chính chuyên nghiệp. Nếu bạn đang gặp cấp cứu y tế hoặc khủng hoảng sức khỏe tâm thần, vui lòng liên hệ dịch vụ cấp cứu ngay lập tức.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Welcome;
