import { useHomepageConfig } from '@/hooks/useHomepageConfig';
import { HomepageSection } from '@/components/homepage/HomepageSection';
import { Button } from '@/components/ui/button';
import { ArrowRight, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Homepage = () => {
  const { config, loading, error } = useHomepageConfig();
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
          <p className="text-red-500">Failed to load homepage content</p>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Fixed header with navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[640px] mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold text-gray-900">
            Mercy Blade
          </h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/auth')}
            className="gap-2 border-gray-300 text-gray-900 hover:bg-gray-100"
          >
            <LogIn className="w-4 h-4" />
            Login
          </Button>
        </div>
      </header>

      {/* Main content - sections */}
      <main className="pt-16">
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
      <footer className="py-12 px-6 bg-gradient-to-b from-teal-100 to-teal-200 dark:from-teal-900 dark:to-teal-950">
        <div className="max-w-[640px] mx-auto text-center space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Ready to begin your journey?
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Sẵn sàng bắt đầu hành trình của bạn?
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/auth')}
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
