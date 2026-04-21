// Path: src/hooks/useAudioUrl.ts
// React hook that resolves an audio filename to a playable URL.
// Backed by src/lib/roomAudioResolver.ts (CC #1 territory).

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  resolveRoomAudioUrl,
  toAudioKey,
  tryResolveLocal,
} from '@/lib/roomAudioResolver';

export type UseAudioUrlResult = {
  /** Playable URL; null while loading OR when input is empty. */
  url: string | null;
  /** True only while an async Supabase sign-in-flight is pending. */
  loading: boolean;
  /** Non-null iff Supabase signing fell back to local. `url` still carries the local fallback. */
  error: Error | null;
  /** Drop the cached signed URL for this key and re-sign. Use on 403 self-heal. */
  refresh: () => void;
};

type InternalState = {
  url: string | null;
  loading: boolean;
  error: Error | null;
};

function seedState(filename: string | null | undefined): InternalState {
  const key = toAudioKey(filename);
  if (key === null) return { url: null, loading: false, error: null };

  const local = tryResolveLocal(key);
  if (local !== null) return { url: local, loading: false, error: null };

  return { url: null, loading: true, error: null };
}

export function useAudioUrl(
  filename: string | null | undefined,
): UseAudioUrlResult {
  const key = useMemo(() => toAudioKey(filename), [filename]);

  const [state, setState] = useState<InternalState>(() => seedState(filename));
  const [refreshTick, setRefreshTick] = useState(0);

  const runIdRef = useRef(0);
  const bustNextRef = useRef(false);

  useEffect(() => {
    const runId = ++runIdRef.current;

    if (key === null) {
      setState({ url: null, loading: false, error: null });
      return;
    }

    const local = tryResolveLocal(key);
    if (local !== null) {
      setState({ url: local, loading: false, error: null });
      return;
    }

    // Adult-room path — dispatch async sign. Preserve previous URL to avoid
    // black-out during refresh (the <audio> element keeps playing).
    setState((prev) => ({ url: prev.url, loading: true, error: null }));

    const bustCache = bustNextRef.current;
    bustNextRef.current = false;

    resolveRoomAudioUrl(key, bustCache ? { bustCache: true } : undefined)
      .then((result) => {
        if (runId !== runIdRef.current) return;
        if (result === null) {
          setState({ url: null, loading: false, error: null });
          return;
        }
        setState({
          url: result.url,
          loading: false,
          error: result.error ?? null,
        });
      })
      .catch((err: unknown) => {
        if (runId !== runIdRef.current) return;
        const error = err instanceof Error ? err : new Error(String(err));
        setState({ url: `/audio/${key}`, loading: false, error });
      });

    return () => {
      // Bump runId so any late-resolving promise from this effect is discarded.
      runIdRef.current += 1;
    };
  }, [key, refreshTick]);

  const refresh = useCallback(() => {
    bustNextRef.current = true;
    setRefreshTick((t) => t + 1);
  }, []);

  return useMemo(
    () => ({
      url: state.url,
      loading: state.loading,
      error: state.error,
      refresh,
    }),
    [state.url, state.loading, state.error, refresh],
  );
}
