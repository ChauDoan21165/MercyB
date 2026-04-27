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
export const ENGLISH_VOICE_ID = "placeholder";

export const VOICE_SETTINGS = {
  stability: 0.5,
  similarity_boost: 0.75,
} as const;

export type MercyLanguage = "vi" | "en";

export function voiceIdFor(language: MercyLanguage): string {
  return language === "vi" ? VIETNAMESE_VOICE_ID : ENGLISH_VOICE_ID;
}

export function isVoiceConfigured(language: MercyLanguage): boolean {
  const id = voiceIdFor(language);
  return !!id && id !== "placeholder";
}
