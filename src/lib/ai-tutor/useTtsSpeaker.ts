// src/lib/ai-tutor/useTtsSpeaker.ts
// Cloud-first speaker for AI Tutor responses.
// Primary path: existing server-side mercy-tts function via fetchCloudTtsUrl.
// Fallback path: browser SpeechSynthesis. No audio upload, no raw audio storage,
// no client-side provider secrets.

import { useCallback, useEffect, useRef, useState } from "react";
import { fetchCloudTtsUrl } from "@/lib/mercyVoice";
import type { TutorTarget } from "@/lib/ai-tutor/tutorUiCopy";
import type { MercyLanguage } from "@/config/mercyVoices";

export interface UseTtsSpeakerResult {
  /** Whether any playback path is available. */
  supported: boolean;
  /** Whether currently speaking. */
  speaking: boolean;
  /** Whether the server-side Mercy voice is being prepared. */
  preparing: boolean;
  /** True after a cloud failure falls back to device voice. */
  usingBrowserFallback: boolean;
  /** Speak the given text with the best available voice for the language. */
  speak: (text: string, lang: string, target?: TutorTarget) => Promise<void>;
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
    return typeof window.speechSynthesis !== "undefined" || typeof window.Audio !== "undefined";
  });
  const [speaking, setSpeaking] = useState(false);
  const [preparing, setPreparing] = useState(false);
  const [usingBrowserFallback, setUsingBrowserFallback] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const requestRef = useRef(0);

  // Workaround Chrome bug: speechSynthesis pauses after ~15s of inactivity.
  // Keep it alive by periodically calling .resume().
  useEffect(() => {
    if (!supported) return;
    const id = setInterval(() => {
      try { window.speechSynthesis.resume(); } catch { /* ignore */ }
    }, 5000);
    return () => clearInterval(id);
  }, [supported]);

  const speakViaBrowser = useCallback((text: string, lang: string) => {
    if (typeof window === "undefined" || typeof window.speechSynthesis === "undefined") {
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
  }, []);

  const stop = useCallback(() => {
    requestRef.current += 1;
    const audio = audioRef.current;
    if (audio) {
      try {
        audio.pause();
        audio.src = "";
      } catch { /* ignore */ }
      audioRef.current = null;
    }
    try {
      window.speechSynthesis?.cancel();
      utteranceRef.current = null;
    } catch { /* ignore */ }
    setPreparing(false);
    setSpeaking(false);
  }, []);

  const speak = useCallback(async (text: string, lang: string, target: TutorTarget = "en") => {
    const safeText = String(text ?? "").trim();
    if (!safeText) return;
    if (!supported) {
      setError("Speech playback is not supported in this browser.");
      return;
    }

    const requestId = requestRef.current + 1;
    requestRef.current = requestId;
    setError(null);
    setUsingBrowserFallback(false);
    setPreparing(true);

    const cloudLanguage: MercyLanguage = target === "vi" ? "vi" : "en";
    const cloud = await fetchCloudTtsUrl({
      text: safeText,
      language: cloudLanguage,
    });

    if (requestRef.current !== requestId) return;

    if (cloud?.audioUrl && typeof window !== "undefined" && typeof window.Audio !== "undefined") {
      try {
        const audio = new Audio(cloud.audioUrl);
        audioRef.current = audio;
        await new Promise<void>((resolve, reject) => {
          audio.onplay = () => {
            setPreparing(false);
            setSpeaking(true);
          };
          audio.onended = () => resolve();
          audio.onerror = () => reject(new Error("audio playback failed"));
          audio.play().catch(reject);
        });
        if (requestRef.current === requestId) {
          setSpeaking(false);
          audioRef.current = null;
        }
        return;
      } catch (err) {
        console.warn("[ai-tutor-tts] Mercy voice unavailable, falling back", err);
      }
    }

    if (requestRef.current !== requestId) return;
    setPreparing(false);
    setUsingBrowserFallback(true);
    speakViaBrowser(safeText, lang);
  }, [speakViaBrowser, supported]);

  // Cleanup on unmount
  useEffect(() => stop, [stop]);

  return { supported, speaking, preparing, usingBrowserFallback, speak, stop, error };
}
