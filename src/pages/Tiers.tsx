import { useTiersConfig } from '@/hooks/useTiersConfig';
import { TierSection } from '@/components/tiers/TierSection';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Tiers = () => {
  const { config, loading, error } = useTiersConfig();
  const navigate = useNavigate();

  // Enable smooth scrolling
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

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
          <p className="text-red-500">Failed to load tiers content</p>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Colorful Mercy Blade Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 py-4 px-6">
        <div className="max-w-[640px] mx-auto relative">
          {/* Back Button */}
          <Button
            onClick={() => navigate('/')}
            size="sm"
            className="absolute left-0 top-1/2 -translate-y-1/2 gap-2 bg-gray-900 hover:bg-gray-800 text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

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
          <p className="text-center text-sm text-gray-600 mt-2">{config.title.en}</p>
        </div>
      </header>

      {/* Main content - sections */}
      <main>
        {config.sections.map((section) => (
          <TierSection
            key={section.slug}
            id={section.slug}
            backgroundColor={section.background_color}
            titleEn={section.title.en}
            titleVi={section.title.vi}
            contentEn={section.content.en}
            contentVi={section.content.vi}
            audio={section.audio.en}
            price={section.price}
          />
        ))}
      </main>

      {/* Footer CTA */}
      <footer className="py-12 px-6 bg-gradient-to-b from-purple-100 to-purple-200">
        <div className="max-w-[640px] mx-auto text-center space-y-6">
          <h3 className="text-xl font-semibold text-gray-900">
            Ready to choose your tier?
          </h3>
          <Button
            size="lg"
            onClick={() => navigate('/auth')}
            className="gap-2 bg-purple-600 hover:bg-purple-700 text-white"
          >
            Sign Up Now <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default Tiers;
