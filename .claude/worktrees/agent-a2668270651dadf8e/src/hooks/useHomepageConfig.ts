// src/hooks/useHomepageConfig.ts
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

// Default fallback config (minimal)
const FALLBACK_CONFIG: HomepageConfig = {
  id: 'default',
  name: 'Mercy Blade',
  name_vi: 'Mercy Blade',
  layout: {
    mobile_first: true,
    section_spacing: '2rem',
    max_width: '1200px',
  },
  sections: [],
};

function isHomepageConfig(value: unknown): value is HomepageConfig {
  if (!value || typeof value !== 'object') return false;

  const config = value as Partial<HomepageConfig>;

  return (
    typeof config.id === 'string' &&
    typeof config.name === 'string' &&
    typeof config.name_vi === 'string' &&
    !!config.layout &&
    typeof config.layout === 'object' &&
    typeof config.layout.mobile_first === 'boolean' &&
    typeof config.layout.section_spacing === 'string' &&
    typeof config.layout.max_width === 'string' &&
    Array.isArray(config.sections)
  );
}

export const useHomepageConfig = () => {
  const [config, setConfig] = useState<HomepageConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadConfig = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        if (params.get('reset') === '1' || params.get('unpin') === '1') {
          localStorage.removeItem('pinnedHomepageConfig');
        }

        const { loadRoomJson } = await import('@/lib/roomJsonResolver');
        const data = await loadRoomJson('mercy_blade_home_page');

        if (!isHomepageConfig(data)) {
          throw new Error('Invalid homepage config shape');
        }

        if (!isMounted) return;
        setConfig(data);
        setError(null);
      } catch (err) {
        console.warn('Using fallback homepage config:', err);

        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Unknown error');
        setConfig(FALLBACK_CONFIG);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadConfig();

    return () => {
      isMounted = false;
    };
  }, []);

  return { config, loading, error };
};