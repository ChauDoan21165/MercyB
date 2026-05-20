import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { chatJsonWithFailover } from "../_shared/aiProvider.ts";
import { wrapHandler } from "../_shared/sentry.ts";
import {
  handleRequest,
  type AiCallInput,
  type AiCallResult,
  type Deps,
} from "./core.ts";

const OPENAI_MODEL = "gpt-4o-mini";
const GEMINI_MODEL = "gemini-2.5-flash";

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

const productionDeps: Deps = { callAi };

serve(
  wrapHandler("placement-v3-grade-writing", async (req) => {
    return handleRequest(req, productionDeps);
  }),
);

