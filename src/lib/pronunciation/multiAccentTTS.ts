// src/lib/pronunciation/multiAccentTTS.ts
//
// Accent-aware reference-audio playback. Tries the ElevenLabs cloud
// path first (per-accent voice id from `mercyVoices.ts`), falls back
// to `window.speechSynthesis` with the right BCP-47 locale. The cloud
// path handles word-level reference clips for the AccentBadge "tap to
// hear" UI, drill cards, and Mock Interview prompts.
//
// Per-(word, accent) cache lives in-memory (no localStorage —
// avoids privacy creep around audio caching). The mercy-tts edge
// function owns its own Supabase Storage cache, so a cache miss here
// is at most one round-trip when the same word/accent has been spoken
// before in any session.

import {
  isAccentVoiceConfigured,
  voiceIdForAccent,
} from "@/config/mercyVoices";
import { ACCENT_METADATA, type Accent } from "@/data/pronunciation/multiAccentReferences";
import { fetchCloudTtsUrl } from "@/lib/mercyVoice";

type CacheKey = `${Accent}:${string}`;
const inFlight = new Map<CacheKey, Promise<string | null>>();
const resolvedCache = new Map<CacheKey, string>();

/**
 * Play a reference audio clip for a word in the requested accent.
 * Returns a Promise that resolves once playback ends (success path) or
 * immediately when the browser-TTS fallback is chosen (we don't await
 * speechSynthesis end events because they're unreliable across mobile
 * Safari WebViews).
 *
 * Inject `audioFactory` for tests so we don't need a live Audio API.
 */
export async function playReferenceAudio(
  word: string,
  accent: Accent,
  options?: {
    audioFactory?: (src: string) => HTMLAudioElement;
    speakWithBrowser?: (text: string, lang: string) => void;
  },
): Promise<{ source: "cloud" | "browser" | "none"; reason?: string; error: string | null }> {
  const trimmed = String(word ?? "").trim();
  if (!trimmed) return { source: "none", reason: "empty_word", error: "empty_word" };

  // 1. Try the cloud path when an ElevenLabs voice is configured for
  //    this accent. When the IDs are still placeholders we skip
  //    straight to browser TTS — saves one wasted round-trip.
  if (isAccentVoiceConfigured("en", accent)) {
    const url = await getOrFetchCloudUrl(trimmed, accent);
    if (url) {
      try {
        const audio = options?.audioFactory
          ? options.audioFactory(url)
          : new Audio(url);
        await new Promise<void>((resolve) => {
          audio.onended = () => resolve();
          audio.onerror = () => resolve();
          audio.play().catch(() => resolve());
        });
        return { source: "cloud", error: null };
      } catch {
        /* fall through to browser TTS */
      }
    }
  }

  // 2. Browser fallback. SpeechSynthesisUtterance with the BCP-47
  //    locale gives the user the best available native pronunciation.
  //    English accent locales only — never a Vietnamese voice path.
  const locale = ACCENT_METADATA[accent]?.locale ?? "en-US";
  if (options?.speakWithBrowser) {
    options.speakWithBrowser(trimmed, locale);
    return { source: "browser", error: null };
  }
  if (typeof window !== "undefined" && typeof window.speechSynthesis !== "undefined") {
    try {
      const utt = new SpeechSynthesisUtterance(trimmed);
      utt.lang = locale;
      window.speechSynthesis.speak(utt);
      return { source: "browser", error: null };
    } catch {
      return { source: "none", reason: "speech_synthesis_failed", error: "speech_synthesis_failed" };
    }
  }
  return { source: "none", reason: "no_audio_path", error: "no_audio_path" };
}

async function getOrFetchCloudUrl(
  word: string,
  accent: Accent,
): Promise<string | null> {
  const key: CacheKey = `${accent}:${word.toLowerCase()}`;
  const cached = resolvedCache.get(key);
  if (cached) return cached;

  const existing = inFlight.get(key);
  if (existing) return existing;

  const promise = fetchCloudTtsUrl({
    text: word,
    language: "en",
    voiceIdOverride: voiceIdForAccent("en", accent),
  })
    .then((res) => {
      if (res?.audioUrl) {
        resolvedCache.set(key, res.audioUrl);
        return res.audioUrl;
      }
      return null;
    })
    .catch(() => null)
    .finally(() => {
      inFlight.delete(key);
    });
  inFlight.set(key, promise);
  return promise;
}

/** Test-only: drop the in-memory cache so vitest cases stay isolated. */
export function __resetMultiAccentTTSCacheForTests(): void {
  inFlight.clear();
  resolvedCache.clear();
}
