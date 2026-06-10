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

// Azure cold-start can exceed the mercy-tts edge function's 6.5s Azure timeout
// on the FIRST call, so the edge fn returns an ElevenLabs fallback
// (fallback_reason: "azure_timeout" / "azure_error"). On a surface that
// requires Azure (VI), that fallback is rejected and the UI shows
// "Giọng Mercy Azure chưa sẵn sàng" until the user manually retries — by which
// time Azure is warm. We retry ONCE transparently for exactly these transient
// reasons. C1 is preserved: we still only ever return Azure audio or null,
// never a browser/other-provider voice.
const TRANSIENT_AZURE_FALLBACK_REASONS = new Set(["azure_timeout", "azure_error"]);
const COLD_START_RETRY_DELAY_MS = 600;

export async function fetchCloudTtsUrl(
  args: FetchCloudTtsArgs,
): Promise<CloudTtsUrl | null> {
  const text = String(args?.text ?? "").trim();
  if (!text) return null;

  const language = normalizeCloudLanguage(args.language);
  const voice_id = args.voiceIdOverride || voiceIdFor(language);

  const attempt = async (): Promise<{
    result: CloudTtsUrl | null;
    retryable: boolean;
  }> => {
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
        return { result: null, retryable: false };
      }
      if (args.requiredProvider && data.provider !== args.requiredProvider) {
        console.warn("[mercyVoice] rejected non-required TTS provider", {
          requiredProvider: args.requiredProvider,
          provider: data.provider,
          fallbackReason: data.fallback_reason,
        });
        return {
          result: null,
          retryable: TRANSIENT_AZURE_FALLBACK_REASONS.has(
            String(data.fallback_reason ?? ""),
          ),
        };
      }
      return {
        result: {
          audioUrl: data.audioUrl,
          cached: !!data.cached,
          provider: data.provider,
          fallbackReason: data.fallback_reason,
        },
        retryable: false,
      };
    } catch (err) {
      console.warn("[mercyVoice] cloud request failed", err);
      return { result: null, retryable: false };
    }
  };

  const first = await attempt();
  if (first.result || !first.retryable) return first.result;

  // One transparent retry for an Azure cold-start fallback; a short delay lets
  // the Azure edge warm before the second call.
  await new Promise((resolve) => setTimeout(resolve, COLD_START_RETRY_DELAY_MS));
  console.info(
    "[mercyVoice] retrying required-Azure TTS after cold-start fallback",
  );
  return (await attempt()).result;
}
