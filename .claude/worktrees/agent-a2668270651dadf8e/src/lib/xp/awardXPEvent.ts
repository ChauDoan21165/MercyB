// src/lib/xp/awardXPEvent.ts
//
// Client wrapper for the public.award_xp_event RPC. The new entry
// point for event-typed XP. The legacy awardXp() in xpClient.ts is
// preserved for the existing daily-challenge flow; new callers should
// prefer this function.
//
// Idempotency, cooldown, and daily cap are enforced server-side, so
// callers can fire-and-forget without locking.

import { supabase } from "@/lib/supabaseClient";

import { publishXPAwarded } from "./awardXPEventBus";
import { defaultXPFor, type XPEventType } from "./eventTypes";

export type AwardXPReason =
  | "awarded"
  | "duplicate"
  | "cooldown"
  | "capped"
  | "disabled"
  | "invalid"
  | "rpc_error";

export interface AwardXPResult {
  ok: boolean;
  reason: AwardXPReason;
  awarded: number;
  total_xp: number;
  current_level: number;
  level_changed: boolean;
  previous_level: number;
  /** Set when reason === "rpc_error". */
  error_message?: string;
}

export interface AwardXPInput {
  event_type: XPEventType;
  /** Stable identifier of the thing that produced the event. Required
   *  when the event def's requires_source_id is true; null otherwise. */
  source_id?: string | null;
  /** Override the default XP from eventTypes.ts. Caller responsibility
   *  to keep this sane — the RPC clamps to [1, 500]. */
  xp_amount?: number;
  /** Multiplier applied server-side. Default 1.0. */
  multiplier?: number;
}

const FALLBACK_RESULT = (reason: AwardXPReason, message?: string): AwardXPResult => ({
  ok: false,
  reason,
  awarded: 0,
  total_xp: 0,
  current_level: 1,
  level_changed: false,
  previous_level: 1,
  error_message: message,
});

/** Award XP for an event. Server-side: idempotency keyed on
 *  (user_id, event_type, source_id), 1-hour cooldown per source, 500
 *  XP/day per event_type cap, no-op when user has gamification off. */
export async function awardXPEvent(
  input: AwardXPInput,
): Promise<AwardXPResult> {
  const xp = input.xp_amount ?? defaultXPFor(input.event_type);
  if (!Number.isFinite(xp) || xp <= 0) {
    return FALLBACK_RESULT("invalid", "non-positive xp_amount");
  }

  type RpcResponse = {
    data: Record<string, unknown> | null;
    error: { message: string } | null;
  };

  const result = (await (supabase as unknown as {
    rpc: (
      fn: string,
      args: Record<string, unknown>,
    ) => Promise<RpcResponse>;
  }).rpc("award_xp_event", {
    p_event_type: input.event_type,
    p_source_id: input.source_id ?? null,
    p_xp_amount: Math.round(xp),
    p_multiplier: input.multiplier ?? 1.0,
  })) as RpcResponse;

  if (result.error) {
    return FALLBACK_RESULT("rpc_error", result.error.message);
  }
  const row = result.data ?? {};
  const reason = String(row.reason ?? "rpc_error") as AwardXPReason;
  const awarded = Number(row.awarded ?? 0);
  const total_xp = Number(row.total_xp ?? 0);
  const current_level = Number(row.current_level ?? 1);
  const previous_level = Number(row.previous_level ?? current_level);
  const level_changed = Boolean(row.level_changed);

  if (reason === "awarded" && awarded > 0) {
    publishXPAwarded({
      awarded,
      total_xp,
      current_level,
      previous_level,
      level_changed,
    });
  }

  return {
    ok: reason === "awarded",
    reason,
    awarded,
    total_xp,
    current_level,
    level_changed,
    previous_level,
  };
}

/** Best-effort "fire and forget" — drops errors silently. Use from
 *  user-action handlers where blocking on XP would hurt the UX. */
export function awardXPEventBackground(input: AwardXPInput): void {
  void awardXPEvent(input).catch(() => {
    // Intentionally swallowed — XP is an enhancement, never a blocker.
  });
}
