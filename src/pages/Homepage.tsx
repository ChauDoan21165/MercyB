import { useHomepageConfig } from '@/hooks/useHomepageConfig';
import { HomepageSection } from '@/components/homepage/HomepageSection';
import { ColorfulMercyBladeHeader } from '@/components/ColorfulMercyBladeHeader';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { RoomSearch } from '@/components/RoomSearch';
import heroRainbowBg from '@/assets/hero-rainbow-bg.jpg';

const Homepage = () => {
  const { config, loading, error } = useHomepageConfig();
  const navigate = useNavigate();
  const [headerBg, setHeaderBg] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#111827');

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
      <ColorfulMercyBladeHeader
        showResetButton={true}
        onReset={handleResetConfig}
      />

      {/* Hero Section with Rainbow Background */}
      <section 
        className="relative w-full min-h-[60vh] md:min-h-[70vh] bg-cover bg-top md:bg-[center_20%] flex flex-col items-center justify-center px-4 sm:px-6 md:px-8"
        style={{ 
          backgroundImage: `url(${heroRainbowBg})`
        }}
      >
        <div className="absolute inset-0 bg-black/10"></div>
      </section>

      {/* Search box - top right corner */}
      <div className="fixed top-28 right-6 z-30 w-80">
        <RoomSearch />
      </div>

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
              en: "Everyone deserves basic safety skills, especially now as weather becomes more unpredictable and disruptions happen without warning. This Survival & Resilience bonus for VIP1 gathers 100 simple, practical lessons anyone can learn — no special equipment, no complex training. Each room offers clear actions you can take today, deeper understanding for long-term confidence, and family-friendly guidance for children and elders. The goal is not fear, but calm readiness: helping more people stay safe, stay steady, and stay capable during difficult moments. For only a small upgrade, you gain lifetime skills that strengthen your independence and protect the people you love.",
              vi: "Ai cũng xứng đáng có những kỹ năng an toàn cơ bản, nhất là khi thời tiết ngày càng khó lường và các biến cố có thể xảy ra bất ngờ. Phần bổ sung \"Sinh Tồn & Kiên Cường\" dành cho VIP1 tập hợp 100 bài học đơn giản, thực tế mà bất cứ ai cũng có thể học — không cần dụng cụ đặc biệt, không cần huấn luyện phức tạp. Mỗi phòng cung cấp hành động rõ ràng có thể làm ngay, kiến thức sâu hơn để bạn tự tin lâu dài, và hướng dẫn thân thiện cho trẻ em lẫn người lớn tuổi. Mục tiêu không phải gieo sợ hãi, mà mang lại sự bình tĩnh và chủ động: giúp nhiều người hơn được an toàn, vững vàng và tự chủ trong lúc khó khăn. Chỉ với một khoản nâng cấp nhỏ, bạn nhận được những kỹ năng trọn đời để bảo vệ chính mình và những người bạn yêu thương."
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
