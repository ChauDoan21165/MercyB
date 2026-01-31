import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const APP_ID = "mercy_blade"; // or import from config

export type UserProgressRow = {
  app_id: string;
  entity_type: "room" | "path";
  room_id: string | null;
  path_id: string | null;
  entry_id: string | null;
  keyword_en: string | null;
  progress_pct: number | null;
  repeat_count: number | null;
  current_day: number | null;
  completed_days: any | null;
  last_study_at: string | null;
  minutes_7d: number;
  minutes_30d: number;
};

export function useUserProgress() {
  const [data, setData] = useState<UserProgressRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);

      const { data, error } = await supabase
        .from("v_user_progress_current")
        .select(`
          app_id,
          entity_type,
          room_id,
          path_id,
          entry_id,
          keyword_en,
          progress_pct,
          repeat_count,
          current_day,
          completed_days,
          last_study_at,
          minutes_7d,
          minutes_30d,
          updated_at
        `)
        .eq("app_id", APP_ID)
        .order("updated_at", { ascending: false });

      if (!alive) return;

      if (error) {
        setError(error.message);
        setData([]);
      } else {
        setData(data ?? []);
        setError(null);
      }

      setLoading(false);
    }

    load();
    return () => {
      alive = false;
    };
  }, []);

  return { data, loading, error };
}
