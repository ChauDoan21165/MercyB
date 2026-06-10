// src/lib/mercyVoice.ts
//
// Cloud-TTS helper used by both the React hook (src/hooks/useMercyVoice.ts)
// and imperative call sites (src/lib/pronunciation/tts.ts). Single
// responsibility: ask the mercy-tts edge function for a playable
// audio URL.
//
// Returns null on any failure — flag off, no provider key, daily cap hit,
// network blip. Callers are expected to fall back
// to the existing browser-TTS path on null. Never throws on the
// happy path; never lets the speaker go silent.

import { supabase } from "@/lib/supabaseClient";
import { voiceIdFor, type MercyLanguage } from "@/config/mercyVoices";

interface FetchCloudTtsArgs {
  text: string;
  language: MercyLanguage;
  /** Override the language's configured voice ID. */
  voiceIdOverride?: string;
  /** Refuse fallback-provider audio for surfaces that require Azure voice. */
  requiredProvider?: CloudTtsUrl["provider"];
}

export interface CloudTtsUrl {
  audioUrl: string;
  cached: boolean;
  provider?: "azure" | "elevenlabs";
  fallbackReason?: string;
}

function normalizeCloudLanguage(language: string): MercyLanguage {
  const base = String(language || "en").trim().toLowerCase().split("-")[0];
  return (["en", "fr", "zh", "de", "ja", "ko", "es", "vi"].includes(base) ? base : "en") as MercyLanguage;
}

export async function fetchCloudTtsUrl(
  args: FetchCloudTtsArgs,
): Promise<CloudTtsUrl | null> {
  const text = String(args?.text ?? "").trim();
  if (!text) return null;

  const language = normalizeCloudLanguage(args.language);
  const voice_id = args.voiceIdOverride || voiceIdFor(language);

  try {
    const { data, error } = await supabase.functions.invoke<{
      audioUrl?: string;
      cached?: boolean;
      provider?: "azure" | "elevenlabs";
      fallback_reason?: string;
      code?: string;
      error?: string;
    }>("mercy-tts", {
      body: { text, voice_id, language },
    });
    if (error || !data?.audioUrl) {
      const reason = data?.fallback_reason || data?.code || error?.message;
      if (reason) console.warn("[mercyVoice] cloud unavailable", reason);
      return null;
    }
    if (args.requiredProvider && data.provider !== args.requiredProvider) {
      console.warn("[mercyVoice] rejected non-required TTS provider", {
        requiredProvider: args.requiredProvider,
        provider: data.provider,
        fallbackReason: data.fallback_reason,
      });
      return null;
    }
    return {
      audioUrl: data.audioUrl,
      cached: !!data.cached,
      provider: data.provider,
      fallbackReason: data.fallback_reason,
    };
  } catch (err) {
    console.warn("[mercyVoice] cloud request failed", err);
    return null;
  }
}
