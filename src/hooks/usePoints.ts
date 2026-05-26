import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/providers/AuthProvider";
import { disableSupabaseSync, isSupabaseSyncDisabled } from "@/services/pointsService";

export const usePoints = () => {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPoints = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase
        .from("user_points")
        .select("total_points")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;
      setTotalPoints(data?.total_points || 0);
    } catch (error) {
      console.error("Error fetching points:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void fetchPoints();
  }, [fetchPoints]);

  const awardPoints = async (
    points: number,
    transactionType: string,
    description?: string,
    roomId?: string
  ) => {
    if (isSupabaseSyncDisabled()) return;
    if (!userId) return;
    try {
      const { error } = await supabase.rpc("award_points", {
        _user_id: userId,
        _points: points,
        _transaction_type: transactionType,
        _description: description,
        _room_id: roomId,
      });

      if (error) {
        disableSupabaseSync(`award_points → ${error.message ?? error.code ?? 'unknown error'}`);
        return;
      }
      await fetchPoints(); // Refresh points after awarding
    } catch (error) {
      disableSupabaseSync(`award_points threw: ${String((error as Error)?.message ?? error)}`);
    }
  };

  return { totalPoints, isLoading, awardPoints, refreshPoints: fetchPoints };
};
