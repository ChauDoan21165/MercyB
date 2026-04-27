// src/hooks/useMercyVoice.ts
//
// React surface for the cloud-first Mercy voice. Tries the ElevenLabs
// path (warm Vietnamese-accented voice when the elevenlabs_tts feature
// flag is on); on any failure — flag off, no API key, daily cap, network
// blip, playback error — invokes the caller's browser-TTS fallback so
// the speaker NEVER goes silent.
//
// Imperative non-React callers (lib/pronunciation/tts.ts) use the
// underlying helper at src/lib/mercyVoice.ts directly.
//
// API:
//   const { speak, cancel, supported } = useMercyVoice();
//   await speak({ text, language: 'vi', browserFallback: () => {…} });

import { useCallback, useRef } from "react";
import { fetchCloudTtsUrl } from "@/lib/mercyVoice";
import type { MercyLanguage } from "@/config/mercyVoices";

interface SpeakArgs {
  text: string;
  language: MercyLanguage;
  /**
   * Invoked when cloud TTS is unavailable (flag off, voice not
   * configured, edge function returned non-2xx, network error, or
   * audio playback failed). Should call into the caller's existing
   * browser-TTS path. Receives the original text untouched.
   */
  browserFallback: (text: string) => void | Promise<void>;
  /** Optional voice override. Defaults to the language's configured ID. */
  voiceIdOverride?: string;
  /**
   * Fired immediately before cloud playback starts. Not fired when the
   * browser fallback runs — the fallback owns its own playing state via
   * SpeechSynthesisUtterance.onstart/onend.
   */
  onCloudStart?: () => void;
  /** Fired after cloud playback ends (success path only). */
  onCloudEnd?: () => void;
}

interface SpeakResult {
  /** Whether playback came from ElevenLabs (true) or the browser fallback (false). */
  cloud: boolean;
  /** True when the response was served from the Storage cache (no $ spent). */
  cached?: boolean;
}

export interface UseMercyVoice {
  speak: (args: SpeakArgs) => Promise<SpeakResult>;
  cancel: () => void;
  supported: boolean;
}

export function useMercyVoice(): UseMercyVoice {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const cancel = useCallback(() => {
    const a = audioRef.current;
    if (a) {
      try {
        a.pause();
        a.src = "";
      } catch {
        // ignore — best effort
      }
      audioRef.current = null;
    }
  }, []);

  const speak = useCallback(
    async ({
      text,
      language,
      browserFallback,
      voiceIdOverride,
      onCloudStart,
      onCloudEnd,
    }: SpeakArgs): Promise<SpeakResult> => {
      const safeText = String(text ?? "").trim();
      if (!safeText) return { cloud: false };

      const cloud = await fetchCloudTtsUrl({
        text: safeText,
        language,
        voiceIdOverride,
      });

      if (!cloud) {
        await browserFallback(safeText);
        return { cloud: false };
      }

      // Stop any prior cloud playback before starting a new one.
      cancel();
      const audio = new Audio(cloud.audioUrl);
      audioRef.current = audio;

      onCloudStart?.();
      try {
        await new Promise<void>((resolve, reject) => {
          audio.onended = () => resolve();
          audio.onerror = () => reject(new Error("audio playback failed"));
          audio.play().catch(reject);
        });
        return { cloud: true, cached: cloud.cached };
      } catch (err) {
        console.warn("[useMercyVoice] cloud playback failed, falling back", err);
        await browserFallback(safeText);
        return { cloud: false };
      } finally {
        onCloudEnd?.();
      }
    },
    [cancel],
  );

  const supported =
    typeof window !== "undefined" &&
    typeof window.speechSynthesis !== "undefined";

  return { speak, cancel, supported };
}
