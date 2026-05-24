// src/lib/ai-tutor/useTtsSpeaker.ts
// Browser SpeechSynthesis speaker for AI Tutor responses.
// No audio upload, no raw audio storage, no external TTS provider.

import { useCallback, useEffect, useRef, useState } from "react";

export interface UseTtsSpeakerResult {
  /** Whether browser SpeechSynthesis is supported. */
  supported: boolean;
  /** Whether currently speaking. */
  speaking: boolean;
  /** Speak the given text with the best available voice for the language. */
  speak: (text: string, lang: string) => void;
  /** Stop speaking immediately. */
  stop: () => void;
  /** Error message, if any. */
  error: string | null;
}

function bestVoice(lang: string): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  // Prefer exact lang match, then prefix match (e.g. "en" matches "en-US", "en-GB")
  const exact = voices.find((v) => v.lang === lang);
  if (exact) return exact;
  const prefix = voices.find((v) => v.lang.startsWith(lang.split("-")[0]));
  if (prefix) return prefix;
  return voices[0] ?? null;
}

export function useTtsSpeaker(): UseTtsSpeakerResult {
  const [supported] = useState(() => {
    if (typeof window === "undefined") return false;
    return typeof window.speechSynthesis !== "undefined";
  });
  const [speaking, setSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Workaround Chrome bug: speechSynthesis pauses after ~15s of inactivity.
  // Keep it alive by periodically calling .resume().
  useEffect(() => {
    if (!supported) return;
    const id = setInterval(() => {
      try { window.speechSynthesis.resume(); } catch { /* ignore */ }
    }, 5000);
    return () => clearInterval(id);
  }, [supported]);

  const speak = useCallback((text: string, lang: string) => {
    if (!supported) {
      setError("Speech playback is not supported in this browser.");
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang;
      u.rate = 0.85;
      u.volume = 1.0;
      const voice = bestVoice(lang);
      if (voice) u.voice = voice;

      u.onstart = () => setSpeaking(true);
      u.onend = () => setSpeaking(false);
      u.onerror = (_event) => {
        setSpeaking(false);
        setError("Speech playback failed. Please try again.");
      };

      utteranceRef.current = u;
      window.speechSynthesis.speak(u);
      setError(null);
    } catch {
      setError("Speech playback failed. Please try again.");
    }
  }, [supported]);

  const stop = useCallback(() => {
    if (!supported) return;
    try {
      window.speechSynthesis.cancel();
      utteranceRef.current = null;
    } catch { /* ignore */ }
    setSpeaking(false);
  }, [supported]);

  // Cleanup on unmount
  useEffect(() => {
    return () => { try { window.speechSynthesis?.cancel(); } catch { /* ignore */ } };
  }, []);

  return { supported, speaking, speak, stop, error };
}
