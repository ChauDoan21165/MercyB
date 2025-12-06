import { useHomepageConfig } from '@/hooks/useHomepageConfig';
import { HomepageSection } from '@/components/homepage/HomepageSection';
import { ColorfulMercyBladeHeader } from '@/components/ColorfulMercyBladeHeader';
import { Button } from '@/components/ui/button';
import { ArrowRight, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CalmMindWidget } from '@/components/paths/CalmMindWidget';
import heroRainbowBg from '@/assets/hero-rainbow-clean.png';
import { PrimaryHero } from '@/components/layout/PrimaryHero';
import { CompanionBubble, MercyToggle } from '@/components/companion';
import { MercyDockIcon } from '@/components/companion/MercyDockIcon';
import { useHomeCompanion } from '@/hooks/useHomeCompanion';

interface HomepageSong {
  id: string;
  title_en: string;
  title_vi: string;
  audioSrc: string;
}

const SONGS_STORAGE_KEY = 'mercyBladeHomepageSongs';

const Homepage = () => {
  const { config, loading, error } = useHomepageConfig();
  const navigate = useNavigate();
  const [headerBg, setHeaderBg] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#111827');
  const companion = useHomeCompanion();
  
  // Default theme song
  const DEFAULT_THEME_SONG: HomepageSong = {
    id: 'default',
    title_en: 'The Song of Mercy Blade',
    title_vi: 'Khúc Ca Mercy Blade',
    audioSrc: '/audio/mercy_blade_theme.mp3'
  };

  // Load songs from localStorage (synced with admin Music Controller)
  const [homepageSongs, setHomepageSongs] = useState<HomepageSong[]>([DEFAULT_THEME_SONG]);
  
  useEffect(() => {
    const stored = localStorage.getItem(SONGS_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.length > 0) {
          setHomepageSongs(parsed);
        }
      } catch {
        // Keep default
      }
    }
  }, []);

  const handleResetConfig = () => {
    localStorage.removeItem('pinnedHomepageConfig');
    window.location.reload();
  };

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

  // Only show error if we have no config at all
  if (!config) {
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
      <ColorfulMercyBladeHeader
        showResetButton={true}
        onReset={handleResetConfig}
      />

      {/* Hero Section with Rainbow Background - Mobile responsive */}
      <PrimaryHero
        title="English & Knowledge"
        subtitle="Colors of Life"
        background={heroRainbowBg}
      />

      {/* Calm Mind 7-Day Path Widget */}
      <section className="py-8 px-6 bg-gradient-to-b from-white to-indigo-50/50 dark:from-background dark:to-indigo-950/20">
        <div className="max-w-[720px] mx-auto">
          <CalmMindWidget />
        </div>
      </section>

      {/* Main content - sections (excluding VIP9) */}
      <main>
        {config.sections
          .filter((section) => section.id !== 'vip9_strategic')
          .map((section) => (
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

      {/* English Pathway - Complete Journey (Foundation → A1 → A2 → B1 → B2 → C1 → C2) */}
      <section className="py-16 px-6" style={{ backgroundColor: "#E8F4F8" }}>
        <div className="max-w-4xl mx-auto space-y-8">
          <HomepageSection
            id="english-pathway-overview"
            backgroundColor="#E8F4F8"
            headingColor="#0C4A6E"
            accentColor="#0284C7"
            title={{
              en: "🌍 The Mercy Blade English Pathway",
              vi: "🌍 Lộ Trình Tiếng Anh Mercy Blade"
            }}
            body={{
              en: "The Mercy Blade English Pathway is a complete learning journey designed for Vietnamese learners who want to grow from absolute beginner to confident, high-level communicator. Every level is gentle, structured, and emotionally safe. You start with simple sounds, letters, and survival phrases, then grow into natural speaking, real listening, solid grammar, clear pronunciation, and advanced communication.\nThe pathway includes seven stages: English Foundation → A1 → A2 → B1 → B2 → C1 → C2.\nEach stage builds exactly on the one before it, so you never feel lost or overwhelmed. With short lessons, calm pronunciation coaching, and daily micro-practice, your English becomes clearer, stronger, and more natural step by step.\nWhether you are beginning from zero or aiming for advanced fluency, this pathway helps you progress with confidence, dignity, and consistency.",
              vi: "Lộ trình tiếng Anh của Mercy Blade là hành trình học trọn vẹn, dành riêng cho người học Việt Nam muốn phát triển từ mức hoàn toàn mới bắt đầu đến giao tiếp tự tin ở trình độ cao. Mỗi cấp độ đều nhẹ nhàng, có cấu trúc rõ ràng và an toàn về mặt cảm xúc. Bạn bắt đầu từ các âm cơ bản, bảng chữ cái và câu giao tiếp sinh tồn, rồi từng bước chuyển sang nói tự nhiên, nghe thực tế, ngữ pháp chắc chắn, phát âm rõ ràng và giao tiếp nâng cao.\nLộ trình gồm bảy giai đoạn: Nền tảng Tiếng Anh → A1 → A2 → B1 → B2 → C1 → C2.\nMỗi cấp độ được xây dựng dựa trên cấp độ trước, giúp bạn không bao giờ bị quá tải hay mất hướng. Với các bài học ngắn, hướng dẫn phát âm bình tĩnh và thói quen luyện tập mỗi ngày, tiếng Anh của bạn sẽ trở nên rõ ràng, mạnh mẽ và tự nhiên theo từng bước nhỏ.\nDù bạn bắt đầu từ con số 0 hay muốn đạt tới khả năng sử dụng tiếng Anh nâng cao, lộ trình này sẽ giúp bạn tiến bộ với sự tự tin, kiên trì và trọn vẹn phẩm giá."
            }}
            audio={{
              en: "Homepage_1.mp3",
              vi: "Homepage_1.mp3"
            }}
          />
          
          {/* CTA Button to English Pathway */}
          <div className="text-center mt-8">
            <Button
              size="lg"
              onClick={() => navigate('/english-pathway')}
              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Explore English Pathway <ArrowRight className="w-4 h-4" />
            </Button>
            <p className="text-sm text-gray-600 mt-3">
              Khám Phá Lộ Trình Tiếng Anh
            </p>
          </div>
        </div>
      </section>

      {/* Survival & Resilience VIP1 Bonus Section */}
      <section className="py-16 px-6" style={{ backgroundColor: "#F0F4F0" }}>
        <div className="max-w-4xl mx-auto space-y-8">
          <HomepageSection
            id="survival-resilience-vip1"
            backgroundColor="#F0F4F0"
            headingColor="#14532D"
            accentColor="#16A34A"
            title={{
              en: "🛡️ Survival & Resilience — Essential Literacy (VIP1 Bonus)",
              vi: "🛡️ Sinh Tồn & Kiên Cường — Kiến Thức Thiết Yếu (Phần Thưởng VIP1)"
            }}
            body={{
              en: "This Survival & Resilience module gives you the 15 most essential skills for staying safe, steady, and self-reliant when facing unpredictable weather or sudden disruptions. Instead of overwhelming you with complicated survival techniques, these lessons focus on simple, practical actions anyone can learn—parents, teenagers, elders, and people living alone. Each room includes six clear, detailed entries of around 200 words, helping you understand risks calmly, act with confidence, and protect the people you love. The goal is not fear, but readiness: making fundamental safety knowledge accessible to everyone through a gentle, structured, and realistic approach. With a small VIP1 upgrade, you gain lifelong tools that quietly strengthen your independence and inner stability.",
              vi: "Phần \"Sinh Tồn & Kiên Cường\" này mang đến 15 kỹ năng quan trọng nhất để bạn an toàn và vững vàng trước thời tiết khó lường hay những gián đoạn bất ngờ trong cuộc sống. Thay vì đưa ra các kỹ thuật sinh tồn phức tạp, các bài học này tập trung vào những hành động đơn giản, thực tế mà bất kỳ ai cũng có thể làm được—từ cha mẹ, thanh thiếu niên, người lớn tuổi đến người sống một mình. Mỗi phòng có sáu mục nội dung rõ ràng, chi tiết (khoảng 200 từ), giúp bạn hiểu rủi ro một cách bình tĩnh, hành động tự tin và bảo vệ những người bạn yêu thương. Mục tiêu không phải là gieo sợ hãi, mà là sự chuẩn bị: đưa kiến thức an toàn cơ bản đến mọi người theo cách nhẹ nhàng, có cấu trúc và thực tế. Với một nâng cấp nhỏ VIP1, bạn có được những kỹ năng trọn đời để tăng khả năng tự chủ và sự vững vàng nội tâm."
            }}
            audio={{
              en: "survival_resilience_homepage_en.mp3",
              vi: "survival_resilience_homepage_vi.mp3"
            }}
          />
        </div>
      </section>

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

      {/* VIP9 Strategic Section - Moved to Bottom */}
      {config.sections
        .filter((section) => section.id === 'vip9_strategic')
        .map((section) => (
          <section key={section.id} className="py-16 px-6" style={{ backgroundColor: section.background_color }}>
            <div className="max-w-4xl mx-auto">
              <HomepageSection
                id={section.id}
                backgroundColor={section.background_color}
                headingColor={section.heading_color}
                accentColor={section.accent_color}
                title={section.title}
                body={section.body}
                audio={section.audio}
              />
            </div>
          </section>
        ))}


      {/* Footer CTA */}
      <footer className="py-12 px-6 bg-gradient-to-b from-teal-100 to-teal-200">
        <div className="max-w-[640px] mx-auto text-center space-y-6">
          <h3 className="text-xl font-semibold bg-[image:var(--gradient-rainbow)] bg-clip-text text-transparent">
            Ready to begin your journey?
          </h3>
          <p className="text-sm text-gray-700">
            Sẵn sàng bắt đầu hành trình của bạn?
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="lg"
              onClick={() => navigate('/tiers')}
              className="gap-2 bg-teal-600 hover:bg-teal-700 text-white"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/redeem')}
              className="gap-2 border-teal-600 text-teal-700 hover:bg-teal-50"
            >
              <Gift className="w-4 h-4" />
              Redeem Gift Code / Nhập Mã Quà Tặng
            </Button>
          </div>
        </div>
      </footer>

      {/* Mercy Companion - Persistent Host */}
      <CompanionBubble
        text={companion.text}
        visible={companion.visible}
        onClose={companion.hide}
        title="Mercy"
      />
      {/* Dock icon when Mercy is closed */}
      <MercyDockIcon 
        visible={companion.showDock} 
        onClick={companion.show} 
      />
      <MercyToggle />
    </div>
  );
};

export default Homepage;
