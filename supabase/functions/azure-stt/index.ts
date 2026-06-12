// supabase/functions/azure-stt/index.ts
//
// Deno entry for FREE-FORM Azure speech-to-text. Wires production deps (real
// fetch, AZURE_SPEECH_* env, the recognition URL) and delegates to
// `handleRequest` in core.ts (split so vitest can exercise core under Node).
//
// JWT-gated like azure-phoneme — only an authenticated learner may spend Azure
// recognition. Pattern mirrors azure-phoneme/index.ts. PhraseList biasing is a
// Phase-B follow-up (needs the Speech SDK; the REST endpoint cannot bias).

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getUserFromAuthHeader } from "../_shared/security.ts";
import { wrapHandler } from "../_shared/sentry.ts";
import { corsHeaders, handleRequest, json, type Deps } from "./core.ts";

const AZURE_REGION = Deno.env.get("AZURE_SPEECH_REGION") ?? "canadacentral";
const AZURE_KEY = Deno.env.get("AZURE_SPEECH_KEY") ?? "";

// Free-form recognition URL — same short-audio endpoint as azure-phoneme but
// WITHOUT the Pronunciation-Assessment header / ReferenceText (set in core).
function buildAzureUrl(language: string): string {
  return (
    `https://${AZURE_REGION}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1` +
    `?language=${encodeURIComponent(language)}&format=detailed`
  );
}

const productionDeps: Deps = {
  fetch: (input, init) => fetch(input, init),
  azureKey: AZURE_KEY,
  azureUrlForLanguage: buildAzureUrl,
};

serve(
  wrapHandler("azure-stt", async (req) => {
    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }
    // JWT gate: authenticated learners only (Azure recognition costs money).
    const user = await getUserFromAuthHeader(req);
    if (!user) {
      return json({ ok: false, use_local: true, reason: "bad_request" }, 401);
    }
    return handleRequest(req, productionDeps);
  }),
);
