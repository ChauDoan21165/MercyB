import { useHomepageConfig } from '@/hooks/useHomepageConfig';
import { HomepageSection } from '@/components/homepage/HomepageSection';
import { Button } from '@/components/ui/button';
import { ArrowRight, LogIn, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

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
      {/* Colorful Mercy Blade Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 py-4 px-6">
        <div className="max-w-[640px] mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center tracking-tight">
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
          <p className="text-center text-sm text-gray-600 mt-2">All Colors of Life</p>
        </div>
      </header>

      {/* Reset Configuration Button */}
      <Button
        onClick={handleResetConfig}
        size="sm"
        className="fixed top-4 right-4 z-50 gap-2 shadow-lg bg-gray-900 hover:bg-gray-800 text-white"
        title="Reset cached configuration"
      >
        <RotateCcw className="w-4 h-4" />
        Reset
      </Button>

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

      {/* Footer CTA */}
      <footer className="py-12 px-6 bg-gradient-to-b from-teal-100 to-teal-200">
        <div className="max-w-[640px] mx-auto text-center space-y-6">
          <h3 className="text-xl font-semibold text-gray-900">
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
