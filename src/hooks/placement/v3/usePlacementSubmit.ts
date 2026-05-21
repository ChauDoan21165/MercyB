import { useCallback, useRef, useState } from "react";
import { submitResponse } from "@/lib/placement/v3/clientStub";
import type { PlacementV3ResponsePayload, PlacementV3SubmitResult } from "@/lib/placement/v3/types";

const LAST_PAYLOAD_KEY = "mb.placement.v3.last-submit-payload";

function readLastPayload(): PlacementV3ResponsePayload | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(LAST_PAYLOAD_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PlacementV3ResponsePayload;
  } catch {
    return null;
  }
}

function persistLastPayload(payload: PlacementV3ResponsePayload | null) {
  if (typeof window === "undefined") return;
  if (!payload) {
    window.sessionStorage.removeItem(LAST_PAYLOAD_KEY);
    return;
  }
  window.sessionStorage.setItem(LAST_PAYLOAD_KEY, JSON.stringify(payload));
}

export function usePlacementSubmit() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastPayload, setLastPayload] = useState<PlacementV3ResponsePayload | null>(() => readLastPayload());
  const inFlight = useRef<Promise<PlacementV3SubmitResult | null> | null>(null);

  const submit = useCallback(async (payload: PlacementV3ResponsePayload) => {
    if (inFlight.current) return inFlight.current;
    setSubmitting(true);
    setError(null);
    setLastPayload(payload);
    persistLastPayload(payload);
    const request = submitResponse(payload)
      .then((result) => {
        setLastPayload(null);
        persistLastPayload(null);
        return result;
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Could not submit your answer.");
        return null;
      })
      .finally(() => {
        inFlight.current = null;
        setSubmitting(false);
      });
    inFlight.current = request;
    return request;
  }, []);

  const retry = useCallback(async (): Promise<PlacementV3SubmitResult | null> => {
    if (!lastPayload) return null;
    return submit(lastPayload);
  }, [lastPayload, submit]);

  return { submitting, error, submit, retry, canRetry: !!lastPayload };
}

export default usePlacementSubmit;
