// src/config/mercyVoices.ts
//
// Voice IDs and settings for the ElevenLabs cloud TTS path
// (supabase/functions/mercy-tts + src/hooks/useMercyVoice).
//
// Chau picks the actual voice IDs from
// https://elevenlabs.io/app/voice-library after signing up for the
// Creator plan, then replaces the 'placeholder' strings below. While
// the IDs are 'placeholder' the cloud path returns 4xx and the hook
// falls back to window.speechSynthesis automatically — so it is safe
// to merge this file with placeholders.
//
// VOICE_SETTINGS is intentionally duplicated in
// supabase/functions/mercy-tts/index.ts (no module sharing across the
// Deno function boundary). Keep them in sync if either changes.

export const VIETNAMESE_VOICE_ID = "placeholder";

/**
 * Per-accent ElevenLabs voice IDs. Defaults all to "placeholder" so the
 * cloud TTS path returns a 4xx and the hook falls back to
 * window.speechSynthesis with the right BCP-47 lang code. Chau replaces
 * each value with a real voice id from
 * https://elevenlabs.io/app/voice-library after picking a voice that
 * matches the accent.
 *
 * Picking guidance (for Chau):
 *   us — General American, neutral newscaster register
 *   uk — RP / standard British, clear consonants
 *   au — General Australian (not strong outback)
 *   ca — General Canadian (often interchangeable with US in casting)
 */
export const ENGLISH_VOICE_IDS = {
  us: "placeholder",
  uk: "placeholder",
  au: "placeholder",
  ca: "placeholder",
} as const;

/**
 * Backward-compat: existing callers ask for "english" without an
 * accent. They get the US voice — which matches the existing default
 * accent and prior behaviour. Removing this would break PR #149's TTS
 * call sites; better to leave it as a stable alias.
 */
export const ENGLISH_VOICE_ID = ENGLISH_VOICE_IDS.us;

export const VOICE_SETTINGS = {
  stability: 0.5,
  similarity_boost: 0.75,
} as const;

export type MercyLanguage = "vi" | "en";
export type EnglishAccent = "us" | "uk" | "au" | "ca";

export function voiceIdFor(language: MercyLanguage): string {
  return language === "vi" ? VIETNAMESE_VOICE_ID : ENGLISH_VOICE_ID;
}

/**
 * Accent-aware variant. For language='vi' the accent is ignored and
 * the Vietnamese voice id is returned (Vietnamese accent training is
 * out of scope for this PR).
 */
export function voiceIdForAccent(
  language: MercyLanguage,
  accent: EnglishAccent,
): string {
  if (language === "vi") return VIETNAMESE_VOICE_ID;
  return ENGLISH_VOICE_IDS[accent] ?? ENGLISH_VOICE_IDS.us;
}

export function isVoiceConfigured(language: MercyLanguage): boolean {
  const id = voiceIdFor(language);
  return !!id && id !== "placeholder";
}

export function isAccentVoiceConfigured(
  language: MercyLanguage,
  accent: EnglishAccent,
): boolean {
  const id = voiceIdForAccent(language, accent);
  return !!id && id !== "placeholder";
}
