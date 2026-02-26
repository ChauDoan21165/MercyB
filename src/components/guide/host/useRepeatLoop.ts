// src/components/guide/host/useRepeatLoop.ts
// SAFE STUB — required by MercyAIHost import.
// Minimal API so app boots; no audio side effects here.

import { useCallback, useMemo, useState } from "react";

export type RepeatStep = "idle" | "listen" | "play" | "your_turn" | "compare" | "done";

export type RepeatTarget = {
  // content
  text_en?: string;
  text_vi?: string;
  audio_url?: string;

  // identifiers (snake_case is canonical)
  room_id?: string;
  entry_id?: string;
  keyword?: string;

  // aliases (camelCase) — MercyAIHost uses these in a few places
  roomId?: string;
  entryId?: string;
};

export function useRepeatLoop(_args?: unknown) {
  const [repeatTarget, setRepeatTarget] = useState<RepeatTarget | null>(null);
  const [repeatStep, setRepeatStep] = useState<RepeatStep>("idle");
  const [repeatCount, setRepeatCount] = useState(0);

  const clearRepeat = useCallback(() => {
    setRepeatTarget(null);
    setRepeatStep("idle");
    setRepeatCount(0);
  }, []);

  const startRepeat = useCallback((target: RepeatTarget) => {
    setRepeatTarget(target || null);
    // MercyAIHost expects a "listen" phase before play/your_turn
    setRepeatStep("listen");
    setRepeatCount(0);
  }, []);

  const ackRepeat = useCallback(() => {
    // Host may call this when user confirms they repeated.
    setRepeatCount((c) => c + 1);
    setRepeatStep("your_turn");
  }, []);

  const api = useMemo(
    () => ({
      repeatTarget,
      repeatStep,
      repeatCount,

      setRepeatTarget,
      setRepeatStep,
      setRepeatCount,

      clearRepeat,
      startRepeat,
      ackRepeat,
    }),
    [repeatTarget, repeatStep, repeatCount, clearRepeat, startRepeat, ackRepeat]
  );

  return api;
}