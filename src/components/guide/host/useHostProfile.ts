// src/components/guide/host/useHostProfile.ts
// SAFE STUB — required by MercyAIHost import.
// PURPOSE: match MercyAIHost expected return shape (no DB, no side effects).

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type HostLastProgress = {
  roomId?: string;
  keyword?: string;
  next?: string;
};

export function useHostProfile(args: {
  isAdmin?: boolean;
  open?: boolean;
  lang?: "en" | "vi";
  authUserId?: string | null;
  authEmail?: string;
}) {
  const authEmail = String(args?.authEmail ?? "");
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Keep stable refs for safe no-op audio/voice.
  const speakingTimerRef = useRef<number | null>(null);

  const displayName = useMemo(() => {
    // very safe: prefer email prefix
    const e = authEmail.trim();
    if (!e) return "";
    const at = e.indexOf("@");
    return at > 0 ? e.slice(0, at) : e;
  }, [authEmail]);

  const canVoiceTest = false;

  // Minimal "progress": none (safe stub). Keep shape MercyAIHost expects.
  const lastProgress: HostLastProgress | null = null;

  const clearSpeakingTimer = useCallback(() => {
    if (speakingTimerRef.current !== null) window.clearTimeout(speakingTimerRef.current);
    speakingTimerRef.current = null;
  }, []);

  useEffect(() => {
    return () => clearSpeakingTimer();
  }, [clearSpeakingTimer]);

  const speak = useCallback(
    (_text: string) => {
      // SAFE STUB: no TTS; just simulate “speaking” briefly so UI doesn’t break.
      clearSpeakingTimer();
      setIsSpeaking(true);
      speakingTimerRef.current = window.setTimeout(() => {
        setIsSpeaking(false);
        speakingTimerRef.current = null;
      }, 600);
    },
    [clearSpeakingTimer]
  );

  const stopVoice = useCallback(() => {
    clearSpeakingTimer();
    setIsSpeaking(false);
  }, [clearSpeakingTimer]);

  return {
    displayName,
    canVoiceTest,
    lastProgress,
    speak,
    stopVoice,
    isSpeaking,
  };
}
