import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { disableSupabaseSync, isSupabaseSyncDisabled } from "@/services/pointsService";

export const usePoints = () => {
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPoints();
  }, []);

  const fetchPoints = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("user_points")
        .select("total_points")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      setTotalPoints(data?.total_points || 0);
    } catch (error) {
      console.error("Error fetching points:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const awardPoints = async (
    points: number,
    transactionType: string,
    description?: string,
    roomId?: string
  ) => {
    if (isSupabaseSyncDisabled()) return;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.rpc("award_points", {
        _user_id: user.id,
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
