import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

// ============= TYPES =============

export interface RoomIssue {
  code: string;
  severity: "error" | "warning" | "info";
  message: string;
  context?: string;
}

export interface RoomValidationResult {
  room_id: string;
  tier: string;
  slug?: string;
  issues: RoomIssue[];
  health_score: number;
  audio_coverage: number;
  json_missing?: boolean;
  json_invalid?: boolean;
  has_zero_audio?: boolean;
  is_low_health?: boolean;
}

export interface TierStats {
  total_rooms: number;
  rooms_zero_audio: number;
  rooms_low_health: number;
  rooms_missing_json: number;
}

export interface VipTrackGap {
  tier: string;
  title: string;
  total_rooms: number;
  min_required: number;
  issue: string;
}

export interface RoomHealthSummary {
  global: TierStats;
  byTier: Record<string, TierStats>;
  vip_track_gaps: VipTrackGap[];
  tier_counts: Record<string, number>;
  room_details?: RoomValidationResult[];
  fatal_error?: boolean;
  error_message?: string;
}

// ============= HOOK =============

interface UseRoomHealthOptions {
  tier?: string;
  autoFetch?: boolean;
}

interface UseRoomHealthReturn {
  data: RoomHealthSummary | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useRoomHealth(options: UseRoomHealthOptions = {}): UseRoomHealthReturn {
  const { tier, autoFetch = true } = options;
  
  const [data, setData] = useState<RoomHealthSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHealthData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const payload: any = {};
      if (tier && tier !== "all") {
        payload.tier = tier;
      }

      const { data: result, error: fnError } = await supabase.functions.invoke(
        "room-health-summary",
        {
          body: payload,
        }
      );

      if (fnError) {
        throw new Error(fnError.message || "Failed to fetch room health data");
      }

      if (result?.fatal_error) {
        throw new Error(result.error_message || "Edge function returned fatal error");
      }

      setData(result as RoomHealthSummary);
    } catch (err: any) {
      console.error("[useRoomHealth] Error:", err);
      setError(err.message || "Unknown error occurred");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [tier]);

  useEffect(() => {
    if (autoFetch) {
      fetchHealthData();
    }
  }, [autoFetch, fetchHealthData]);

  return {
    data,
    loading,
    error,
    refetch: fetchHealthData,
  };
}
