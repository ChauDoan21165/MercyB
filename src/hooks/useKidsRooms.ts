// Kids rooms data hook following Mercy Blade Design System v1.1

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { KIDS_TABLE, KidsLevelId } from '@/lib/constants';

export type KidsRoom = Database["public"]["Tables"]["kids_rooms"]["Row"];

export interface UseKidsRoomsResult {
  rooms: KidsRoom[];
  loading: boolean;
  error: Error | null;
  refresh: () => void;
}

export function useKidsRooms(levelId: KidsLevelId): UseKidsRoomsResult {
  const [rooms, setRooms] = useState<KidsRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from(KIDS_TABLE)
        .select('*')
        .eq('level_id', levelId)
        .eq('is_active', true)
        .order('display_order');

      if (fetchError) throw fetchError;
      setRooms(data || []);
    } catch (err) {
      console.error(`Error fetching Kids ${levelId} rooms:`, err);
      setError(err instanceof Error ? err : new Error('Failed to fetch rooms'));
    } finally {
      setLoading(false);
    }
  }, [levelId]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const refresh = useCallback(() => {
    fetchRooms();
  }, [fetchRooms]);

  return { rooms, loading, error, refresh };
}
