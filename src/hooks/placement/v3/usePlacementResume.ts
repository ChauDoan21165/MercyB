import { useCallback, useEffect, useState } from "react";
import { resumeSession } from "@/lib/placement/v3/clientStub";
import type { PlacementV3Session } from "@/lib/placement/v3/types";

export function usePlacementResume() {
  const [session, setSession] = useState<PlacementV3Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setSession(await resumeSession());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not check for an unfinished test.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { session, loading, error, refresh };
}

export default usePlacementResume;
