// supabase/functions/writing-feedback/index.ts
//
// Deno entry. Wires production `Deps` (Supabase admin client,
// `chatJsonWithFailover`, env-var reads) and delegates to
// `handleRequest` in `core.ts`. The split exists so vitest can import
// `core.ts` under Node and exercise the request handler with fake deps.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

import { getUserFromAuthHeader } from "../_shared/security.ts";
import { rateLimit } from "../_shared/rateLimit.ts";
import { wrapHandler } from "../_shared/sentry.ts";
import { chatJsonWithFailover } from "../_shared/aiProvider.ts";

import {
  handleRequest,
  type AiCallInput,
  type AiCallResult,
  type Deps,
  type PromptContext,
} from "./core.ts";

// The static prompt dataset is shipped with the bundle. The edge fn
// imports the same module so server-side validation matches what the
// client sees.
import { WRITING_PROMPTS } from "../../../src/data/writing-prompts/prompts.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const PROMPTS_BY_ID = new Map<string, PromptContext>(
  WRITING_PROMPTS.map((p) => [
    p.id,
    {
      id: p.id,
      title_en: p.title_en,
      scenario_en: p.scenario_en,
      target_words_min: p.target_words_min,
      target_words_max: p.target_words_max,
    },
  ]),
);

async function logCall(params: {
  userId: string;
  promptId: string;
  submissionLen: number;
  timeSpentSeconds: number;
  score: number | null;
  status: "ok" | "ai_error" | "validation_error" | "rate_limited";
}): Promise<void> {
  try {
    const { error } = await supabase.from("ai_call_logs").insert({
      surface: "writing-feedback",
      user_id: params.userId,
      metadata: {
        prompt_id: params.promptId,
        submission_len: params.submissionLen,
        time_spent_seconds: params.timeSpentSeconds,
        score: params.score,
      },
      status: params.status,
    });
    if (error) {
      console.log(
        `[writing-feedback] log status=${params.status} prompt=${params.promptId} score=${params.score}`,
      );
    }
  } catch {
    console.log(
      `[writing-feedback] log fallback status=${params.status} prompt=${params.promptId}`,
    );
  }
}

async function callAi(input: AiCallInput): Promise<AiCallResult> {
  const result = await chatJsonWithFailover({
    systemPrompt: input.systemPrompt,
    userMessage: input.userMessage,
    maxTokens: input.maxTokens,
    temperature: 0.3,
  });
  return { ok: result.ok, json: result.json, raw: result.raw };
}

const productionDeps: Deps = {
  getUserFromAuthHeader: (req) => getUserFromAuthHeader(req),
  rateLimit: (key, max, windowMs) => rateLimit(key, max, windowMs),
  getPromptById: (id) => PROMPTS_BY_ID.get(id) ?? null,
  callAi,
  logCall,
};

serve(
  wrapHandler("writing-feedback", async (req) => {
    return handleRequest(req, productionDeps);
  }),
);
