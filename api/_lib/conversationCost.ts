// Cost telemetry and free-tier entitlement for AI conversation turns.
//
// Two responsibilities:
//   1. logConversationTurnCost — INSERT to ai_usage_events after each turn
//      (cost accounting, not user tracking; consent-irrelevant).
//   2. checkFreeConversationTurns — resolve the "free_conversation_turns"
//      feature flag and count this week's usage so non-premium users can get
//      N turns/week when the flag is ON (DEFAULT OFF → today's 403 behavior).
//
// Both use the service-role key (bypasses RLS) so they never block on the
// user's auth context. If the service-role key is absent both operations
// fail silently / return flagOn:false — the flag stays OFF and no gate breaks.

import { createClient } from "@supabase/supabase-js";

export const FREE_TURNS_PER_WEEK = 5;
const FLAG_KEY = "free_conversation_turns";

export type TurnCostPayload = {
  userId: string;
  model: string;
  tokensInput: number;
  tokensOutput: number;
  estimatedUsd: number;
};

export type FreeAccessResult =
  | { flagOn: false }
  | { flagOn: true; allowed: true; remaining: number }
  | { flagOn: true; allowed: false };

function makeAdminClient(supabaseUrl: string, serviceKey: string) {
  return createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
}

export async function logConversationTurnCost(
  payload: TurnCostPayload,
  opts: { supabaseUrl: string; serviceKey: string },
): Promise<void> {
  if (!opts.supabaseUrl || !opts.serviceKey) {
    console.warn("[conversation] cost log skipped: no service-role key");
    return;
  }
  const client = makeAdminClient(opts.supabaseUrl, opts.serviceKey);
  const { error } = await client.from("ai_usage_events").insert({
    user_id: payload.userId,
    model: payload.model,
    tokens_input: payload.tokensInput,
    tokens_output: payload.tokensOutput,
    cost_usd: payload.estimatedUsd,
    endpoint: "ai-conversation-turn",
  });
  if (error) {
    console.warn("[conversation] ai_usage_events insert failed:", error.message);
  }
}

export async function checkFreeConversationTurns(
  userId: string,
  opts: { supabaseUrl: string; serviceKey: string },
): Promise<FreeAccessResult> {
  if (!opts.supabaseUrl || !opts.serviceKey) return { flagOn: false };

  const client = makeAdminClient(opts.supabaseUrl, opts.serviceKey);

  const { data: flagData, error: flagError } = await client
    .from("feature_flags")
    .select("is_enabled, enabled_user_ids")
    .eq("flag_key", FLAG_KEY)
    .maybeSingle();

  if (flagError || !flagData) return { flagOn: false };

  const cohort: string[] = Array.isArray(flagData.enabled_user_ids)
    ? (flagData.enabled_user_ids as string[])
    : [];
  const flagOn = cohort.includes(userId) || !!flagData.is_enabled;
  if (!flagOn) return { flagOn: false };

  // ISO week start: Monday 00:00 UTC
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setUTCDate(now.getUTCDate() - ((now.getUTCDay() + 6) % 7));
  weekStart.setUTCHours(0, 0, 0, 0);

  const { count, error: countError } = await client
    .from("ai_usage_events")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("endpoint", "ai-conversation-turn")
    .gte("created_at", weekStart.toISOString());

  if (countError) {
    console.warn("[freeConversationTurns] count query failed:", countError.message);
    return { flagOn: true, allowed: true, remaining: FREE_TURNS_PER_WEEK }; // fail open
  }

  const used = count ?? 0;
  const remaining = Math.max(0, FREE_TURNS_PER_WEEK - used);
  return remaining > 0
    ? { flagOn: true, allowed: true, remaining }
    : { flagOn: true, allowed: false };
}
