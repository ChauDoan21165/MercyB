import { useTiersConfig } from '@/hooks/useTiersConfig';
import { TierSection } from '@/components/tiers/TierSection';
import { ColorfulMercyBladeHeader } from '@/components/ColorfulMercyBladeHeader';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
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
      <ColorfulMercyBladeHeader
        subtitle={config.title.en}
        showBackButton={true}
      />

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
          <p className="text-sm text-gray-700">
            Create your account and select a payment plan
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/subscribe')}
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
