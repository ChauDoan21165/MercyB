// VIP rooms data hook following Mercy Blade Design System v1.1

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { ROOMS_TABLE, VipTierId } from '@/lib/constants';

export type VipRoom = Database["public"]["Tables"]["rooms"]["Row"];

export interface UseVipRoomsResult {
  rooms: VipRoom[];
  loading: boolean;
  error: Error | null;
  refresh: () => void;
}

export function useVipRooms(tierId: VipTierId): UseVipRoomsResult {
  const [rooms, setRooms] = useState<VipRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from(ROOMS_TABLE)
        .select('*')
        .eq('tier', tierId.toLowerCase())
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setRooms(data || []);
    } catch (err) {
      console.error(`Error fetching ${tierId} rooms:`, err);
      setError(err instanceof Error ? err : new Error('Failed to fetch rooms'));
    } finally {
      setLoading(false);
    }
  }, [tierId]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const refresh = useCallback(() => {
    fetchRooms();
  }, [fetchRooms]);

  return { rooms, loading, error, refresh };
}
