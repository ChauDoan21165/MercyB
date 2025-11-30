import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useFeatureFlag = (key: string) => {
  const [enabled, setEnabled] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchFlag = async () => {
      try {
        const { data, error } = await supabase
          .from("feature_flags")
          .select("is_enabled")
          .eq("flag_key", key)
          .single();

        if (error) {
          // If missing, default to false — no crash in production
          console.warn("Feature flag error:", error.message);
        } else if (isMounted && data) {
          setEnabled(!!data.is_enabled);
        }
      } catch (err) {
        console.error("Error fetching feature flag:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFlag();

    return () => {
      isMounted = false;
    };
  }, [key]);

  return { enabled, loading };
};
