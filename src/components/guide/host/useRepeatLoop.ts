// src/components/guide/host/useRepeatLoop.ts
// SAFE STUB — required by MercyAIHost import.
// Minimal API so app boots; no audio side effects here.
// Improved for Mercy Host repeat coaching.

import { useCallback, useMemo, useState } from "react";

export type RepeatStep = "idle" | "listen" | "play" | "your_turn" | "compare" | "done";

export type RepeatTarget = {
  // content
  text_en?: string;
  text_vi?: string;
  audio_url?: string;

  // identifiers (snake_case canonical)
  room_id?: string;
  entry_id?: string;
  keyword?: string;

  // aliases (camelCase) — MercyAIHost uses these in places
  roomId?: string;
  entryId?: string;
};

function normalizeTarget(t?: RepeatTarget | null): RepeatTarget | null {
  if (!t) return null;

  const roomId = t.roomId ?? t.room_id;
  const entryId = t.entryId ?? t.entry_id;

  return {
    ...t,
    roomId,
    entryId,
    room_id: roomId,
    entry_id: entryId,
  };
}

export function useRepeatLoop(_args?: unknown) {
  const [repeatTarget, setRepeatTargetRaw] = useState<RepeatTarget | null>(null);
  const [repeatStep, setRepeatStep] = useState<RepeatStep>("idle");
  const [repeatCount, setRepeatCount] = useState(0);

  const setRepeatTarget = useCallback((t: RepeatTarget | null) => {
    setRepeatTargetRaw(normalizeTarget(t));
  }, []);

  const clearRepeat = useCallback(() => {
    setRepeatTargetRaw(null);
    setRepeatStep("idle");
    setRepeatCount(0);
  }, []);

  const startRepeat = useCallback((target: RepeatTarget) => {
    const t = normalizeTarget(target);

    setRepeatTargetRaw(t);

    // MercyHost expects a listen phase first
    setRepeatStep("listen");

    setRepeatCount(0);
  }, []);

  const ackRepeat = useCallback(() => {
    setRepeatCount((c) => {
      const next = Math.min(3, c + 1);
      return next;
    });

    setRepeatStep("your_turn");
  }, []);

  // Optional helper for future lesson / coaching logic
  const nextRepeatStep = useCallback(() => {
    setRepeatStep((s) => {
      if (s === "listen") return "play";
      if (s === "play") return "your_turn";
      if (s === "your_turn") return "compare";
      if (s === "compare") return "your_turn";
      return s;
    });
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
      nextRepeatStep,
    }),
    [
      repeatTarget,
      repeatStep,
      repeatCount,
      setRepeatTarget,
      clearRepeat,
      startRepeat,
      ackRepeat,
      nextRepeatStep,
    ]
  );

  return api;
}