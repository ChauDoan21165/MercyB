import { useCallback, useEffect, useState } from "react";
import { startSession } from "@/lib/placement/v3/clientStub";
import type { PlacementV3Session } from "@/lib/placement/v3/types";

export function usePlacementSessionV3(autoStart = false) {
  const [session, setSession] = useState<PlacementV3Session | null>(null);
  const [loading, setLoading] = useState(autoStart);
  const [error, setError] = useState<string | null>(null);

  const start = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const next = await startSession();
      setSession(next);
      return next;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start placement test.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!autoStart) return;
    void start();
  }, [autoStart, start]);

  return { session, setSession, loading, error, start };
}

export default usePlacementSessionV3;
