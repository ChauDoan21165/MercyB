import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { chatJsonWithFailover } from "../_shared/aiProvider.ts";
import { getUserFromAuthHeader } from "../_shared/security.ts";
import { wrapHandler } from "../_shared/sentry.ts";
import { handleRequest } from "./core.ts";
import type { Deps } from "./types.ts";

const deps: Deps = {
  getUserFromAuthHeader: (req) => getUserFromAuthHeader(req),
  callAi: async (input) => {
    const result = await chatJsonWithFailover({
      systemPrompt: input.systemPrompt,
      userMessage: input.userMessage,
      messages: input.messages,
      maxTokens: input.maxTokens,
      temperature: input.temperature,
      timeoutMs: 12_000,
    });
    return { ok: result.ok, json: result.json, raw: result.raw };
  },
};

serve(wrapHandler("placement-v3-mercy-conversation", (req) => handleRequest(req, deps)));
