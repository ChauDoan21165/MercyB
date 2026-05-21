import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { chatJsonWithFailover } from "../_shared/aiProvider.ts";
import { wrapHandler } from "../_shared/sentry.ts";
import {
  handleRequest,
  type Deps,
} from "./core.ts";
import {
  scorePronunciationWithAzure,
  type PhonemeBridgeDeps,
} from "./phonemeBridge.ts";
import type {
  AiCallInput,
  AiCallResult,
  GradeSpeakingRequest,
} from "./types.ts";

const OPENAI_MODEL = "gpt-4o-mini";
const GEMINI_MODEL = "gemini-2.5-flash";

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const functionBaseUrl =
  Deno.env.get("SUPABASE_FUNCTIONS_URL") ??
  `${supabaseUrl.replace(/\/$/, "")}/functions/v1`;
const audioBucket = Deno.env.get("PLACEMENT_V3_AUDIO_BUCKET") ?? "placement-audio";
const supabase = createClient(supabaseUrl, serviceRoleKey);

async function callAi(input: AiCallInput): Promise<AiCallResult> {
  const result = await chatJsonWithFailover({
    systemPrompt: input.systemPrompt,
    userMessage: input.userMessage,
    maxTokens: input.maxTokens,
    temperature: input.temperature,
    openaiModel: OPENAI_MODEL,
    geminiModel: GEMINI_MODEL,
    timeoutMs: 20_000,
  });
  const model =
    result.provider === "gemini"
      ? GEMINI_MODEL
      : result.provider === "openai"
        ? OPENAI_MODEL
        : "";
  return {
    ok: result.ok,
    json: result.json,
    raw: result.raw,
    provider: result.provider,
    model,
    latencyMs: result.latencyMs,
  };
}

const phonemeDeps: PhonemeBridgeDeps = {
  fetch,
  functionBaseUrl,
  serviceRoleKey,
  async loadAudioBytes(audioStoragePath) {
    const parsed = parseStoragePath(audioStoragePath);
    const { data, error } = await supabase.storage
      .from(parsed.bucket)
      .download(parsed.path);
    if (error || !data) return null;
    return {
      bytes: new Uint8Array(await data.arrayBuffer()),
      contentType: data.type || "audio/wav",
    };
  },
};

function parseStoragePath(value: string): { bucket: string; path: string } {
  const trimmed = value.trim().replace(/^\/+/, "");
  const [maybeBucket, ...rest] = trimmed.split("/");
  if (maybeBucket && rest.length > 0 && maybeBucket !== "public") {
    return { bucket: maybeBucket, path: rest.join("/") };
  }
  return { bucket: audioBucket, path: trimmed };
}

serve(
  wrapHandler("placement-v3-grade-speaking", async (req) => {
    const authHeader = req.headers.get("Authorization") ?? "";
    const userAccessToken = authHeader.replace(/^Bearer\s+/i, "").trim();
    const deps: Deps = {
      callAi,
      scorePronunciation(request: GradeSpeakingRequest) {
        return scorePronunciationWithAzure(request, {
          ...phonemeDeps,
          userAccessToken,
        });
      },
    };
    return handleRequest(req, deps);
  }),
);
