import { useState, useEffect } from 'react';

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

// Default fallback config when JSON fails to load
const DEFAULT_CONFIG: HomepageConfig = {
  id: "homepage_fallback",
  name: "Mercy Blade Homepage",
  name_vi: "Trang Chủ Mercy Blade",
  layout: {
    mobile_first: true,
    section_spacing: "medium",
    max_width: "640px"
  },
  sections: []
};

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

        // Always prefer fresh JSON; fallback to pinned if fetch fails
        try {
          const response = await fetch(`/data/Mercy_Blade_home_page.json?t=${Date.now()}`, { 
            cache: 'no-store',
            headers: { 'Accept': 'application/json' }
          });
          if (!response.ok) {
            throw new Error(`Failed to load homepage config: ${response.status}`);
          }
          const contentType = response.headers.get('content-type');
          if (contentType && !contentType.includes('application/json')) {
            throw new Error('Response is not JSON');
          }
          const data = await response.json();
          setConfig(data);
        } catch (fetchErr) {
          console.warn('Failed to fetch homepage config:', fetchErr);
          // Try pinned config
          const pinned = localStorage.getItem('pinnedHomepageConfig');
          if (pinned) {
            console.warn('Using pinned homepage config');
            setConfig(JSON.parse(pinned));
          } else {
            // Use default fallback
            console.warn('Using default homepage config');
            setConfig(DEFAULT_CONFIG);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setConfig(DEFAULT_CONFIG);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  return { config, loading, error };
};
