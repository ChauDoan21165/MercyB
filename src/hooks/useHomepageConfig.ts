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
        let data: HomepageConfig | null = null;
        try {
          const response = await fetch(`/data/Mercy_Blade_home_page.json?t=${Date.now()}`, { cache: 'no-store' });
          if (!response.ok) {
            throw new Error('Failed to load homepage config');
          }
          data = await response.json();
          setConfig(data);
        } catch (fetchErr) {
          const pinned = localStorage.getItem('pinnedHomepageConfig');
          if (pinned) {
            console.warn('Using pinned homepage config due to fetch error');
            setConfig(JSON.parse(pinned));
          } else {
            throw fetchErr instanceof Error ? fetchErr : new Error('Unknown error');
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  return { config, loading, error };
};
