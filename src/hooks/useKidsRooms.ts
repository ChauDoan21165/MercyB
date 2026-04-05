// PATH: src/hooks/useKidsRooms.ts

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Database } from "@/integrations/supabase/types";
import { KIDS_TABLE, type KidsLevelId } from "@/lib/constants";

// Temporary unblocking type until DB schema is updated
export type KidsRoom = any;

export interface UseKidsRoomsResult {
  rooms: KidsRoom[];
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

export function useKidsRooms(levelId: KidsLevelId): UseKidsRoomsResult {
  const [rooms, setRooms] = useState<KidsRoom[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRooms = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const query = supabase
        .from("kids_rooms")
        .select("*")
        .eq("level_id", levelId)
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      setRooms((data ?? []) as KidsRoom[]);
    } catch (err: unknown) {
      console.error(`Error fetching Kids ${levelId} rooms:`, err);
      setError(
        err instanceof Error ? err : new Error("Failed to fetch rooms"),
      );
      setRooms([]);
    } finally {
      setLoading(false);
    }
  }, [levelId]);

  useEffect(() => {
    void fetchRooms();
  }, [fetchRooms]);

  const refresh = useCallback(async (): Promise<void> => {
    await fetchRooms();
  }, [fetchRooms]);

  return { rooms, loading, error, refresh };
}