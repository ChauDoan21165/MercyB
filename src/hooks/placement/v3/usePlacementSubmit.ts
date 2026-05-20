import { useCallback, useState } from "react";
import { submitResponse } from "@/lib/placement/v3/clientStub";
import type { PlacementV3ResponsePayload, PlacementV3SubmitResult } from "@/lib/placement/v3/types";

export function usePlacementSubmit() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastPayload, setLastPayload] = useState<PlacementV3ResponsePayload | null>(null);

  const submit = useCallback(async (payload: PlacementV3ResponsePayload) => {
    setSubmitting(true);
    setError(null);
    setLastPayload(payload);
    try {
      return await submitResponse(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit your answer.");
      return null;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const retry = useCallback(async (): Promise<PlacementV3SubmitResult | null> => {
    if (!lastPayload) return null;
    return submit(lastPayload);
  }, [lastPayload, submit]);

  return { submitting, error, submit, retry, canRetry: !!lastPayload };
}

export default usePlacementSubmit;
