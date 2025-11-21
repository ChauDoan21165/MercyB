import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface KidsLevel {
  id: string;
  name_en: string;
  name_vi: string;
  description_en: string | null;
  description_vi: string | null;
  age_range: string;
  price_monthly: number;
  color_theme: string;
  display_order: number;
  is_active: boolean;
}

export const useKidsLevels = () => {
  const [levels, setLevels] = useState<KidsLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadKidsLevels = async () => {
      try {
        const { data, error } = await supabase
          .from('kids_levels')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (error) throw error;
        setLevels(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load kids levels');
      } finally {
        setLoading(false);
      }
    };

    loadKidsLevels();
  }, []);

  return { levels, loading, error };
};
