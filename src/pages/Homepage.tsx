import { useHomepageConfig } from '@/hooks/useHomepageConfig';
import { HomepageSection } from '@/components/homepage/HomepageSection';
import { Button } from '@/components/ui/button';
import { ArrowRight, RotateCcw, Crown, Star, Gem, Sparkles, Rocket, Feather, Brain, Baby, GraduationCap, School, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { RoomSearch } from '@/components/RoomSearch';
import heroRainbowBg from '@/assets/hero-rainbow-bg.jpg';
import { ThemeToggle } from '@/components/ThemeToggle';
import { supabase } from '@/integrations/supabase/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Homepage = () => {
  const { config, loading, error } = useHomepageConfig();
  const navigate = useNavigate();
  const [headerBg, setHeaderBg] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#111827');
  const [user, setUser] = useState<any>(null);

  const handleResetConfig = () => {
    localStorage.removeItem('pinnedHomepageConfig');
    window.location.reload();
  };

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Enable smooth scrolling
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  // Adapt header color based on section in view
  useEffect(() => {
    if (!config) return;

    const observers = config.sections.map((section) => {
      const element = document.getElementById(section.id);
      if (!element) return null;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
              setHeaderBg(section.background_color);
              // Determine text color based on background brightness
              const rgb = parseInt(section.background_color.slice(1), 16);
              const r = (rgb >> 16) & 0xff;
              const g = (rgb >> 8) & 0xff;
              const b = (rgb >> 0) & 0xff;
              const brightness = (r * 299 + g * 587 + b * 114) / 1000;
              setTextColor(brightness > 128 ? '#111827' : '#ffffff');
            }
          });
        },
        { threshold: [0, 0.3, 0.5, 0.7, 1.0] }
      );

      observer.observe(element);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, [config]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-teal-50">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-md">
          <p className="text-red-500">Failed to load homepage content</p>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Rainbow Background */}
      <section 
        className="relative min-h-[70vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${heroRainbowBg})` }}
      >
        <div className="absolute inset-0 bg-black/10"></div>
        
        {/* Mercy Blade Logo - Top Center */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight drop-shadow-lg">
            <span className="inline-block animate-fade-in" style={{ color: '#E91E63' }}>M</span>
            <span className="inline-block animate-fade-in" style={{ color: '#9C27B0', animationDelay: '0.1s' }}>e</span>
            <span className="inline-block animate-fade-in" style={{ color: '#3F51B5', animationDelay: '0.2s' }}>r</span>
            <span className="inline-block animate-fade-in" style={{ color: '#2196F3', animationDelay: '0.3s' }}>c</span>
            <span className="inline-block animate-fade-in" style={{ color: '#00BCD4', animationDelay: '0.4s' }}>y</span>
            <span className="inline-block mx-2"></span>
            <span className="inline-block animate-fade-in" style={{ color: '#009688', animationDelay: '0.5s' }}>B</span>
            <span className="inline-block animate-fade-in" style={{ color: '#4CAF50', animationDelay: '0.6s' }}>l</span>
            <span className="inline-block animate-fade-in" style={{ color: '#8BC34A', animationDelay: '0.7s' }}>a</span>
            <span className="inline-block animate-fade-in" style={{ color: '#FFC107', animationDelay: '0.8s' }}>d</span>
            <span className="inline-block animate-fade-in" style={{ color: '#FF9800', animationDelay: '0.9s' }}>e</span>
          </h1>
        </div>

        {/* UI Controls - Top Right */}
        <div className="absolute top-8 right-8 z-20 flex items-center gap-2">
          <ThemeToggle />
          
          <Button
            onClick={handleResetConfig}
            size="sm"
            className="gap-2 bg-background/80 hover:bg-background/90 backdrop-blur-sm shadow-lg"
            title="Reset cached configuration"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          
          {!user ? (
            <Button
              onClick={() => navigate('/auth')}
              size="sm"
              className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg backdrop-blur-sm"
            >
              <span className="text-xs">Sign Up</span>
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1 border-2 bg-background/80 backdrop-blur-sm shadow-lg">
                  <span className="text-xs">Tier</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-popover z-50 animate-scale-in">
                <DropdownMenuLabel className="text-center font-bold animate-fade-in">
                  Explore Tiers / Khám Phá Gói
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  onClick={() => navigate('/rooms')}
                  className="cursor-pointer hover:bg-green-50 dark:hover:bg-green-900 transition-all duration-200"
                >
                  <Crown className="mr-2 h-4 w-4 text-green-600" />
                  <span className="text-sm font-semibold">Free</span>
                </DropdownMenuItem>

                <DropdownMenuItem 
                  onClick={() => navigate('/rooms-vip1')}
                  className="cursor-pointer hover:bg-yellow-50 dark:hover:bg-yellow-900 transition-all duration-200"
                >
                  <Star className="mr-2 h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-semibold">VIP1</span>
                </DropdownMenuItem>

                <DropdownMenuItem 
                  onClick={() => navigate('/rooms-vip2')}
                  className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900 transition-all duration-200"
                >
                  <Gem className="mr-2 h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold">VIP2</span>
                </DropdownMenuItem>

                <DropdownMenuItem 
                  onClick={() => navigate('/rooms-vip3')}
                  className="cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900 transition-all duration-200"
                >
                  <Sparkles className="mr-2 h-4 w-4 text-purple-600" />
                  <span className="text-sm font-semibold">VIP3</span>
                </DropdownMenuItem>

                <DropdownMenuItem 
                  onClick={() => navigate('/rooms-vip4')}
                  className="cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-900 transition-all duration-200"
                >
                  <Rocket className="mr-2 h-4 w-4 text-orange-600" />
                  <span className="text-sm font-semibold">VIP4</span>
                </DropdownMenuItem>

                <DropdownMenuItem 
                  onClick={() => navigate('/rooms-vip5')}
                  className="cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900 transition-all duration-200"
                >
                  <Feather className="mr-2 h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-semibold">VIP5</span>
                </DropdownMenuItem>

                <DropdownMenuItem 
                  onClick={() => navigate('/vip6')}
                  className="cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900 transition-all duration-200"
                >
                  <Brain className="mr-2 h-4 w-4 text-purple-600" />
                  <span className="text-sm font-semibold">VIP6</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem 
                  onClick={() => navigate('/kids-level1')}
                  className="cursor-pointer hover:bg-green-50 dark:hover:bg-green-900 transition-all duration-200"
                >
                  <Baby className="mr-2 h-4 w-4 text-green-600" />
                  <span className="text-sm">Kids L1</span>
                </DropdownMenuItem>

                <DropdownMenuItem 
                  onClick={() => navigate('/kids-level2')}
                  className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900 transition-all duration-200"
                >
                  <School className="mr-2 h-4 w-4 text-blue-600" />
                  <span className="text-sm">Kids L2</span>
                </DropdownMenuItem>

                <DropdownMenuItem 
                  onClick={() => navigate('/kids-level3')}
                  className="cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900 transition-all duration-200"
                >
                  <GraduationCap className="mr-2 h-4 w-4 text-purple-600" />
                  <span className="text-sm">Kids L3</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  onClick={() => navigate('/redeem-gift')}
                  className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-200"
                >
                  <Gift className="mr-2 h-4 w-4 text-purple-600" />
                  <span className="text-sm font-semibold">Redeem Gift</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  onClick={() => navigate('/subscribe')}
                  className="cursor-pointer hover:bg-primary/10 transition-all duration-200"
                >
                  <span className="text-sm font-semibold text-primary">Upgrade</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Main Text - Center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center">
          <h2 className="text-6xl md:text-8xl font-bold mb-4 text-foreground drop-shadow-[0_0_30px_rgba(255,255,255,0.8)]">
            English & Knowledge
          </h2>
          <p className="text-3xl md:text-4xl font-serif italic text-foreground/90 drop-shadow-[0_0_20px_rgba(255,255,255,0.6)]">
            Colors of Life
          </p>
        </div>
      </section>

      {/* Search box - top right corner */}
      <div className="fixed top-28 right-6 z-30 w-80">
        <RoomSearch />
      </div>

      {/* Main content - sections */}
      <main>
        {config.sections.map((section) => (
          <HomepageSection
            key={section.id}
            id={section.id}
            backgroundColor={section.background_color}
            headingColor={section.heading_color}
            accentColor={section.accent_color}
            title={section.title}
            body={section.body}
            audio={section.audio}
          />
        ))}
      </main>

      {/* Kids English VIP3 Section */}
      <section className="py-16 px-6" style={{ backgroundColor: "#F3E5F5" }}>
        <div className="max-w-4xl mx-auto space-y-8">
          <HomepageSection
            id="kids-english-vip3"
            backgroundColor="#F3E5F5"
            headingColor="#6A1B9A"
            accentColor="#AB47BC"
            title={{
              en: "🌟 Kids English — VIP3 Exclusive Bonus",
              vi: "🌟 Kids English — Quà Tặng Đặc Biệt Dành Riêng Cho VIP3"
            }}
        body={{
          en: `Kids English is a special, exclusive reward for VIP3 members.
It unlocks 3 full learning levels for children ages 4–13 — but even more importantly, it opens a powerful opportunity for parents to learn English together with their children through teaching.

There is a timeless teaching principle:
👉 "The fastest way to learn is to teach someone."

When you read vocabulary with your child, explain meanings, guide pronunciation, or play language games, your own brain forms deeper connections and faster recall. Teaching strengthens memory, builds confidence, and turns English learning into a natural, joyful routine.

Your child learns — and you learn too.
Every shared activity becomes a moment of growth, closeness, and gentle progress for the whole family.

Kids English is not just a program for children.
It is a gift for parents and children to grow together.`,
          vi: `Kids English là phần thưởng đặc biệt và độc quyền cho người dùng VIP3.
Bạn được mở toàn bộ 3 cấp độ học tiếng Anh cho trẻ từ 4–13 tuổi — và quan trọng hơn, bạn có cơ hội học tiếng Anh cùng con thông qua việc dạy con.

Trong giáo dục có một nguyên tắc rất mạnh mẽ:
👉 "Cách học nhanh nhất là dạy lại cho người khác."

Khi bạn đọc từ vựng với con, giải thích nghĩa, hướng dẫn phát âm, hoặc chơi trò chơi ngôn ngữ, não của bạn ghi nhớ nhanh hơn, sâu hơn và hình thành phản xạ tự nhiên. Việc dạy giúp tăng tập trung, cải thiện trí nhớ và biến tiếng Anh thành hoạt động nhẹ nhàng mỗi ngày.

Con học — và bạn cũng học.
Mỗi hoạt động chung trở thành một khoảnh khắc kết nối, trưởng thành và tiến bộ nhẹ nhàng của cả gia đình.

Kids English không chỉ là chương trình dành cho trẻ.
Đó là món quà để cha mẹ và con cùng lớn lên.`
        }}
        audio={{
          en: "kid_homepage.mp3",
          vi: "kid_homepage.mp3"
        }}
          />
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="py-12 px-6 bg-gradient-to-b from-teal-100 to-teal-200">
        <div className="max-w-[640px] mx-auto text-center space-y-6">
          <h3 className="text-xl font-semibold bg-[image:var(--gradient-rainbow)] bg-clip-text text-transparent">
            Ready to begin your journey?
          </h3>
          <p className="text-sm text-gray-700">
            Sẵn sàng bắt đầu hành trình của bạn?
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/tiers')}
            className="gap-2 bg-teal-600 hover:bg-teal-700 text-white"
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
