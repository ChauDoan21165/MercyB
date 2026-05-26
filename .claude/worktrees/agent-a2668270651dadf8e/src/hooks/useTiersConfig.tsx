import { useState, useEffect } from 'react';

interface TierSection {
  slug: string;
  background_color: string;
  title: {
    en: string;
    vi: string;
  };
  content: {
    en: string;
    vi: string;
  };
  audio: {
    en: string;
  };
  price?: {
    monthly: number;
    rooms_per_month: number;
    personalized_room?: boolean;
    career_coaching_mode?: boolean;
  };
}

interface TiersConfig {
  page_id: string;
  title: {
    en: string;
    vi: string;
  };
  description: {
    en: string;
    vi: string;
  };
  sections: TierSection[];
}

export const useTiersConfig = () => {
  const [config, setConfig] = useState<TiersConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch('/data/Tiers.json');
        if (!response.ok) {
          throw new Error('Failed to load tiers configuration');
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
