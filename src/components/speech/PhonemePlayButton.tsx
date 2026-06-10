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
import { Loader2, Play, RotateCw } from "lucide-react";

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
  // C1: single-tap uses cloud TTS only. On a cloud miss we surface a VN error +
  // retry instead of silently substituting a browser voice. (Double-tap keeps
  // the deliberate slow-replay browser path.)
  const [errored, setErrored] = useState(false);
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

    setErrored(false);
    setState("playing");
    try {
      if (isDoubleTap) {
        // Slow path — always browser TTS so we get the rate parameter.
        await browserFallbackForRate(0.5)(text);
      } else {
        // C1: cloud only. If Mercy's voice didn't play, surface a retry —
        // never quietly read the word in a robotic device voice.
        const res = await speak({ text, language });
        if (!res.spoken) setErrored(true);
      }
    } finally {
      setState("idle");
    }
  }, [browserFallbackForRate, cancel, language, speak, text]);

  const label =
    ariaLabel ?? `Phát âm "${text}" · Play "${text}"`;
  const buttonLabel = errored
    ? `Không phát được — bấm để thử lại · Couldn't play — tap to retry`
    : label;

  return (
    <span className="inline-flex items-center gap-1">
      <button
        type="button"
        onClick={onClick}
        aria-label={buttonLabel}
        title={title ?? buttonLabel}
        disabled={state === "playing"}
        className={`relative inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border bg-white shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-wait ${
          errored
            ? "border-rose-300 text-rose-600 hover:border-rose-400 hover:bg-rose-50 focus-visible:ring-rose-400"
            : "border-indigo-200 text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 focus-visible:ring-indigo-400"
        } ${className}`}
      >
        {/* Invisible ≥44px hit area (Apple HIG / WCAG 2.5.5) — keeps the
            dense per-phoneme circle visually 28px without shrinking the tap
            zone. Child of the button so the click bubbles; aria-hidden so
            it adds nothing for screen readers. */}
        <span
          aria-hidden
          className="absolute left-1/2 top-1/2 h-11 w-11 -translate-x-1/2 -translate-y-1/2"
        />
        {state === "playing" ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
        ) : errored ? (
          <RotateCw className="h-3.5 w-3.5" aria-hidden />
        ) : (
          <Play className="h-3.5 w-3.5" aria-hidden />
        )}
      </button>
      {errored ? (
        <span role="alert" className="whitespace-nowrap text-[10px] font-semibold text-rose-600">
          Không phát được · bấm lại
        </span>
      ) : null}
    </span>
  );
}
