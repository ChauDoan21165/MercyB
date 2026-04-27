// Tap-to-play audio button for the per-phoneme correction tooltip in
// MercySpeakTab. One button speaks the phoneme as a teacher would
// ("th, like in think"), the other speaks the example word alone.
//
// Audio path:
//   1. useMercyVoice → ElevenLabs cloud TTS (when the elevenlabs_tts
//      flag is on for this user). Aggressively cached server-side; the
//      32-phoneme + 32-example-word vocabulary fits in a tiny cache and
//      hits ~100% on a learner's second tap.
//   2. Browser SpeechSynthesis fallback when cloud is unavailable —
//      provided by the `browserFallback` callback this component
//      builds and hands to useMercyVoice.
//
// Interaction:
//   - Single tap → play once at normal speed.
//   - Double tap (within 400ms) → play slowly via browser TTS (rate=0.5).
//     Cloud TTS doesn't expose a rate parameter, so the slow path
//     deliberately routes through the browser fallback.
//   - Tapping any PhonemePlayButton cancels the previous one's playback
//     (shared cancellation via the global SpeechSynthesis singleton +
//     useMercyVoice.cancel()). Caller doesn't need to coordinate.

import React, { useCallback, useRef, useState } from "react";
import { Loader2, Play } from "lucide-react";

import { useMercyVoice } from "@/hooks/useMercyVoice";

export type PhonemePlayButtonProps = {
  /** What to play (e.g. `think` or `the "th" sound, like in think`). */
  text: string;
  /**
   * BCP-47 voice language. EN-US is the right default for phoneme
   * coaching because the example words are English; the VI gloss is
   * shown visually but not played.
   */
  language?: "en" | "vi";
  /**
   * Accessible label override. If omitted, defaults to
   * `Phát âm "{text}" / Play "{text}"`. Keep this short for screen
   * readers — it's read on every focus.
   */
  ariaLabel?: string;
  /**
   * Optional className passthrough so callers can tune size / margin
   * without forking the component.
   */
  className?: string;
  /**
   * Optional title override. Defaults match aria-label.
   */
  title?: string;
};

export default function PhonemePlayButton({
  text,
  language = "en",
  ariaLabel,
  className = "",
  title,
}: PhonemePlayButtonProps) {
  const { speak, cancel } = useMercyVoice();
  const [state, setState] = useState<"idle" | "playing">("idle");
  const lastTapAtRef = useRef<number>(0);

  const browserFallbackForRate = useCallback(
    (rate: number) => (toSpeak: string) =>
      new Promise<void>((resolve) => {
        if (typeof window === "undefined" || !window.speechSynthesis) {
          resolve();
          return;
        }
        try {
          window.speechSynthesis.cancel();
          const u = new SpeechSynthesisUtterance(toSpeak);
          u.lang = language === "vi" ? "vi-VN" : "en-US";
          u.rate = Math.max(0.1, Math.min(2, rate));
          u.onend = () => resolve();
          u.onerror = () => resolve();
          window.speechSynthesis.speak(u);
        } catch {
          resolve();
        }
      }),
    [language],
  );

  const onClick = useCallback(async () => {
    const now = Date.now();
    const isDoubleTap = now - lastTapAtRef.current < 400;
    lastTapAtRef.current = now;

    // Cancel any in-flight playback (this button or another one).
    cancel();
    if (typeof window !== "undefined" && window.speechSynthesis) {
      try { window.speechSynthesis.cancel(); } catch { /* ignore */ }
    }

    setState("playing");
    try {
      if (isDoubleTap) {
        // Slow path — always browser TTS so we get the rate parameter.
        await browserFallbackForRate(0.5)(text);
      } else {
        await speak({
          text,
          language,
          browserFallback: browserFallbackForRate(0.95),
        });
      }
    } finally {
      setState("idle");
    }
  }, [browserFallbackForRate, cancel, language, speak, text]);

  const label =
    ariaLabel ?? `Phát âm "${text}" · Play "${text}"`;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={title ?? label}
      disabled={state === "playing"}
      className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-indigo-200 bg-white text-indigo-600 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-1 disabled:cursor-wait ${className}`}
    >
      {state === "playing" ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
      ) : (
        <Play className="h-3.5 w-3.5" aria-hidden />
      )}
    </button>
  );
}
