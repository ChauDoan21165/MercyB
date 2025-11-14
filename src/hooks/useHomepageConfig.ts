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
  audio?: {
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
        const response = await fetch('/data/Mercy_Blade_home_page.json');
        if (!response.ok) {
          throw new Error('Failed to load homepage config');
        }
        const data = await response.json();
        setConfig(data);
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
