// Pure-logic module for the per-conversation OpenAI spend cap.
//
// Extracted from ai-chat/index.ts so the decision rule has a unit-test
// surface that doesn't need a Supabase client. The edge function passes
// the already-fetched values in; this module decides whether to gate.
//
// Fail-open posture: when the function can't determine the answer
// (missing input, infrastructure error caught upstream), it returns
// `allow`. Cost protection is a backstop, not a substitute for sane
// client behaviour. We'd rather let a runaway conversation through and
// catch it on the next request than break Mercy entirely on a Postgres
// blip.

export const DEFAULT_CONVERSATION_COST_CAP_VND = 1200;

export type CostCapInput = {
  /** Optional conversation grouping key from the request. */
  conversationId: string | null | undefined;
  /** Cumulative VND already spent on this conversation prior to this turn. */
  cumulativeCostVnd: number;
  /** Cap value resolved from env / feature flag. */
  capVnd: number;
  /** Master kill-switch — when false, every request is allowed. */
  capEnabled: boolean;
  /** Admin level >= 9 bypasses the cap regardless of cost. */
  isAdmin: boolean;
};

export type CostCapDecision =
  | { kind: "allow"; reason: "ok" | "no_conversation_id" | "cap_disabled" | "admin_bypass" }
  | {
      kind: "block";
      reason: "cap_exceeded";
      /** The cumulative cost as observed at decision time. */
      observedCostVnd: number;
      capVnd: number;
    };

/**
 * Decide whether the next ai-chat turn should be blocked. Pure: no I/O.
 *
 * Order of checks matches the brief:
 *   1. Admin bypass (level 9+) → allow.
 *   2. Master flag off          → allow.
 *   3. Missing conversationId   → allow (we can't enforce a per-thread
 *                                 cap without a thread). Logged in the
 *                                 caller so volume is visible.
 *   4. Cumulative cost ≤ cap    → allow.
 *   5. Otherwise                → block with cap_exceeded.
 */
export function decideConversationCostCap(input: CostCapInput): CostCapDecision {
  if (input.isAdmin) {
    return { kind: "allow", reason: "admin_bypass" };
  }
  if (!input.capEnabled) {
    return { kind: "allow", reason: "cap_disabled" };
  }
  const cid = (input.conversationId ?? "").trim();
  if (cid.length === 0) {
    return { kind: "allow", reason: "no_conversation_id" };
  }
  if (
    !Number.isFinite(input.cumulativeCostVnd) ||
    !Number.isFinite(input.capVnd) ||
    input.capVnd <= 0
  ) {
    // Defensive: bad inputs treat as allow rather than block. A misconfigured
    // cap (negative, NaN) shouldn't lock everyone out.
    return { kind: "allow", reason: "ok" };
  }
  if (input.cumulativeCostVnd > input.capVnd) {
    return {
      kind: "block",
      reason: "cap_exceeded",
      observedCostVnd: input.cumulativeCostVnd,
      capVnd: input.capVnd,
    };
  }
  return { kind: "allow", reason: "ok" };
}

/**
 * Resolve the cap value from environment.
 *
 * Reads CONVERSATION_COST_CAP_VND. Accepts integers and decimals; falls
 * back to DEFAULT_CONVERSATION_COST_CAP_VND when missing or unparseable.
 * Negative values fall through to the default — a misconfigured secret
 * shouldn't disable enforcement silently.
 */
export function resolveCapVndFromEnv(envValue: string | null | undefined): number {
  if (envValue == null) return DEFAULT_CONVERSATION_COST_CAP_VND;
  const trimmed = String(envValue).trim();
  if (trimmed.length === 0) return DEFAULT_CONVERSATION_COST_CAP_VND;
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_CONVERSATION_COST_CAP_VND;
  }
  return parsed;
}

/**
 * Body shape returned by ai-chat when the cap fires. Stable contract —
 * the client uses `error_code === "CONVERSATION_COST_CAP_EXCEEDED"` to
 * distinguish this from other 402s (e.g. existing limit_reached from
 * checkAiBudget).
 */
export type CapExceededResponseBody = {
  ok: false;
  error_code: "CONVERSATION_COST_CAP_EXCEEDED";
  error_message_vi: string;
  error_message_en: string;
  current_cost_vnd: number;
  cap_vnd: number;
  suggested_action: "start_new_conversation";
};

export function buildCapExceededResponseBody(args: {
  observedCostVnd: number;
  capVnd: number;
}): CapExceededResponseBody {
  return {
    ok: false,
    error_code: "CONVERSATION_COST_CAP_EXCEEDED",
    error_message_vi:
      "Cuộc trò chuyện này đã đạt giới hạn. Bạn có thể bắt đầu cuộc trò chuyện mới với Mercy.",
    error_message_en:
      "This conversation has reached the limit. You can start a new conversation with Mercy.",
    current_cost_vnd: Math.round(args.observedCostVnd * 100) / 100,
    cap_vnd: args.capVnd,
    suggested_action: "start_new_conversation",
  };
}
