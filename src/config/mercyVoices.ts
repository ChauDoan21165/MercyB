// src/config/mercyVoices.ts
//
// Voice IDs and settings for the ElevenLabs cloud TTS path
// (supabase/functions/mercy-tts + src/hooks/useMercyVoice).
//
// VOICE_SETTINGS is intentionally duplicated in
// supabase/functions/mercy-tts/index.ts (no module sharing across the
// Deno function boundary). Keep them in sync if either changes.
//
// US voice ID is the canonical "primary" voice from the rotation pool
// already used by the bulk audio generators (scripts/build-audio-manifest.ts
// VOICE_IDS[0], scripts/generate-ielts-speaking-audio.ts VOICE_BAND_7).
// Reusing the same voice keeps the Speak-tab cloud TTS consistent with
// the thousands of pre-generated lesson clips users already hear in
// the app — same character voice across the product.
//
// uk / au / ca are intentionally left as "placeholder" — the rotation
// pool wasn't tagged by accent and we don't have ground truth for which
// pool member matches which accent. Leaving them placeholder makes
// isAccentVoiceConfigured("en", "uk"|"au"|"ca") return false, which
// causes the multi-accent TTS path to skip cleanly to browser TTS
// instead of speaking with the wrong accent. Replace these only after
// listening + confirming the accent match.
//
// VIETNAMESE_VOICE_ID is also left as "placeholder". No production
// surface today calls fetchCloudTtsUrl({language:'vi'}) — Vietnamese
// audio is pre-generated via FPT.AI in scripts/generate-vietnamese-audio.ts.
// If/when on-demand Vietnamese TTS is needed, replace with a voice
// from the ElevenLabs library that pronounces Vietnamese cleanly.

export const VIETNAMESE_VOICE_ID = "placeholder";

/**
 * Per-accent ElevenLabs voice IDs.
 *
 * `us` is the canonical primary voice used by the bulk audio generators.
 * Other accents stay as "placeholder" — isAccentVoiceConfigured returns
 * false for them, so multi-accent TTS falls back to browser TTS rather
 * than speaking in the wrong accent. Picking guidance for future fills:
 *   uk — RP / standard British, clear consonants
 *   au — General Australian (not strong outback)
 *   ca — General Canadian (often interchangeable with US in casting)
 */
export const ENGLISH_VOICE_IDS = {
  us: "hpp4J3VqNfWAUOO0d1Us",
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

export type MercyLanguage = "en" | "fr" | "zh" | "de" | "ja" | "ko" | "es" | "vi";
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
