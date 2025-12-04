import { useState, useEffect } from 'react';
// Import bundled config directly - this will always work
import bundledConfig from '@/data/homepage-config.json';

interface HomepageSection {
  id: string;
  background_color: string;
  heading_color: string;
  accent_color: string;
  title: {
    en: string;
    vi: string;
  };
  body: {
    en: string;
    vi: string;
  };
  audio: {
    en: string;
    vi: string;
  };
}

interface HomepageConfig {
  id: string;
  name: string;
  name_vi: string;
  layout: {
    mobile_first: boolean;
    section_spacing: string;
    max_width: string;
  };
  sections: HomepageSection[];
}

export const useHomepageConfig = () => {
  const [config, setConfig] = useState<HomepageConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        // Attempt to reset pinned config via query flag
        const params = new URLSearchParams(window.location.search);
        if (params.get('reset') === '1' || params.get('unpin') === '1') {
          localStorage.removeItem('pinnedHomepageConfig');
        }

        // Try to fetch fresh config, but use bundled as fallback
        try {
          const response = await fetch(`/data/Mercy_Blade_home_page.json?t=${Date.now()}`, { 
            cache: 'no-store',
            headers: { 'Accept': 'application/json' }
          });
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          const text = await response.text();
          if (text.startsWith('<!') || text.startsWith('<html')) {
            throw new Error('Response is HTML');
          }
          const data = JSON.parse(text);
          setConfig(data);
        } catch (fetchErr) {
          console.warn('Using bundled homepage config:', fetchErr);
          // Use bundled config - this will always work
          setConfig(bundledConfig as HomepageConfig);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setConfig(bundledConfig as HomepageConfig);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  return { config, loading, error };
};
