// src/hooks/useMercyVoice.ts
//
// React surface for the cloud-first Mercy voice (ElevenLabs path, warm
// Vietnamese-accented voice when the elevenlabs_tts feature flag is on).
//
// Contract C1 (docs/PRODUCT-CONTRACT.md): when cloud TTS is unavailable the
// hook NEVER silently substitutes a robotic browser voice. It reports the
// failure (`spoken: false` + a `error` message) so the calling surface can
// render an explicit error + retry control — mirroring the Teacher-Mercy
// engine contract in src/lib/ai-tutor/useTtsSpeaker.ts /
// src/lib/teacher-mercy/voiceEngine.ts. Re-pressing the play control is the
// retry.
//
// Imperative non-React callers (lib/pronunciation/tts.ts) use the
// underlying helper at src/lib/mercyVoice.ts directly.
//
// API:
//   const { speak, cancel, supported } = useMercyVoice();
//   const { spoken, error } = await speak({ text, language: 'vi' });
//   if (!spoken && error) showRetry(error);

import { useCallback, useRef } from "react";
import { fetchCloudTtsUrl } from "@/lib/mercyVoice";
import type { MercyLanguage } from "@/config/mercyVoices";

// Vietnamese-first, kept identical to voiceEngine.BROWSER_TTS_ERROR_MESSAGE so
// the retry copy is consistent across every voice surface.
const CLOUD_VOICE_UNAVAILABLE_MESSAGE =
  "Không nghe thấy? Kiểm tra âm lượng hoặc thử bấm lại.";

interface SpeakArgs {
  text: string;
  language: MercyLanguage;
  /**
   * @deprecated No longer invoked. Contract C1 forbids a silent browser-TTS
   * fallback; on cloud failure the hook now returns `{ spoken: false, error }`
   * and the calling surface is responsible for rendering an explicit retry.
   * The param is retained only for source compatibility with existing callers
   * and is ignored.
   */
  browserFallback?: (text: string) => void | Promise<void>;
  /** Optional voice override. Defaults to the language's configured ID. */
  voiceIdOverride?: string;
  /** Fired immediately before cloud playback starts. */
  onCloudStart?: () => void;
  /** Fired after cloud playback ends (success path only). */
  onCloudEnd?: () => void;
}

interface SpeakResult {
  /** True only when ElevenLabs cloud audio actually played. */
  cloud: boolean;
  /** True when the response was served from the Storage cache (no $ spent). */
  cached?: boolean;
  /**
   * True only if Mercy was actually heard (cloud audio played). False on any
   * failure — the hook never falls back to a browser voice, so `spoken: false`
   * means the surface should show the retry affordance.
   */
  spoken: boolean;
  /** A learner-facing (Vietnamese-first) retry message on failure, else null. */
  error: string | null;
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
      voiceIdOverride,
      onCloudStart,
      onCloudEnd,
    }: SpeakArgs): Promise<SpeakResult> => {
      const safeText = String(text ?? "").trim();
      if (!safeText) return { cloud: false, spoken: false, error: null };

      const cloud = await fetchCloudTtsUrl({
        text: safeText,
        language,
        voiceIdOverride,
      });

      if (!cloud) {
        // Cloud unavailable (flag off, no key, daily cap, network blip).
        // C1: do NOT speak in a browser voice — report so the caller retries.
        return { cloud: false, spoken: false, error: CLOUD_VOICE_UNAVAILABLE_MESSAGE };
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
        return { cloud: true, cached: cloud.cached, spoken: true, error: null };
      } catch (err) {
        // Playback failed mid-stream. C1: report, never browser-fallback.
        console.warn("[useMercyVoice] cloud playback failed", err);
        return { cloud: false, spoken: false, error: CLOUD_VOICE_UNAVAILABLE_MESSAGE };
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
