// supabase/functions/stripe-webhook/idempotency.ts
//
// Atomic webhook idempotency: claim-before-process.
//
// The handler used to do check-then-process: a read of stripe_webhook_events,
// then (much later, after the subscription grant) a mark-processed upsert. Two
// concurrent deliveries of the same event_id (Stripe retries on a slow 200)
// both passed the read before either marked it, so the grant / tier-recompute
// ran twice. See reports/RECON-stripe-idempotency.md (audit N4, HIGH).
//
// The fix: claim the event_id with an INSERT ... ON CONFLICT DO NOTHING BEFORE
// any side-effect. Exactly one concurrent delivery wins the insert; the rest
// observe the conflict and no-op. supabase-js `.upsert(v, { onConflict,
// ignoreDuplicates: true })` compiles to ON CONFLICT DO NOTHING; `.select()`
// then returns ONLY the rows this statement actually inserted, so an empty
// result set is an unambiguous "another delivery already owns this event".
//
// This module is intentionally standalone (no Deno.serve, no core.ts) so it is
// unit-testable under vitest, matching the existing event-types/stripe-signature
// test pattern.

import type {
  Database,
  DBClient,
  StripeWebhookEvent,
} from "./types.ts";

/**
 * PostgREST raises PGRST205 when the table is absent from the schema cache.
 * The pre-fix code treated a missing stripe_webhook_events table as
 * "process anyway" (fail-open) rather than hard-failing the webhook. That
 * degradation contract is preserved — losing the idempotency guard must never
 * be worse than blocking a real Stripe delivery.
 */
export function isMissingStripeWebhookEventsTable(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;

  const maybe = error as { code?: string; message?: unknown };

  return (
    maybe.code === "PGRST205" &&
    String(maybe.message ?? "").includes("public.stripe_webhook_events")
  );
}

export type StripeWebhookEventClaim =
  | { status: "claimed" }
  | { status: "duplicate" }
  | { status: "table-missing" };

/**
 * Atomically claim an event_id before processing.
 *
 * - `claimed`       — this delivery inserted the row; it owns the event and
 *                      must process it.
 * - `duplicate`     — the row already existed; another delivery owns it. The
 *                      caller must no-op and return 200.
 * - `table-missing` — stripe_webhook_events is absent; fail open and process
 *                      without the guard (preserves prior behavior).
 *
 * A genuine (non-conflict, non-missing-table) DB error is rethrown so the
 * caller fails the request and Stripe redelivers.
 */
export async function claimStripeWebhookEvent(
  supabase: DBClient,
  event: Pick<StripeWebhookEvent, "id" | "type" | "livemode">,
): Promise<StripeWebhookEventClaim> {
  const payload: Database["public"]["Tables"]["stripe_webhook_events"]["Insert"] = {
    event_id: event.id,
    type: event.type,
    livemode: typeof event.livemode === "boolean" ? event.livemode : null,
    processed_at: null,
    error: null,
  };

  const { data, error } = await supabase
    .from("stripe_webhook_events")
    .upsert(payload, { onConflict: "event_id", ignoreDuplicates: true })
    .select("event_id");

  if (error) {
    if (isMissingStripeWebhookEventsTable(error)) {
      console.warn(
        "stripe-webhook stripe_webhook_events table missing; processing without idempotency claim",
        error,
      );
      return { status: "table-missing" };
    }

    throw error;
  }

  // ignoreDuplicates:true → ON CONFLICT DO NOTHING. With .select(), `data`
  // contains only rows this statement inserted. Empty ⟺ the row pre-existed
  // ⟺ a concurrent/earlier delivery already owns this event_id.
  const inserted = Array.isArray(data) && data.length > 0;

  return inserted ? { status: "claimed" } : { status: "duplicate" };
}

/**
 * Release a claim so Stripe's redelivery can re-claim and reprocess.
 *
 * Called ONLY on the retryable-error path: the handler threw, the request
 * returns 500, Stripe will redeliver. Without this delete the claim row would
 * block that legitimate retry forever and the event would be silently dropped
 * (worse than the original race). Best-effort: if the delete itself fails the
 * retry simply degrades to being treated as a duplicate — never worse than
 * pre-fix behavior, never a double-grant.
 */
export async function releaseStripeWebhookEventClaim(
  supabase: DBClient,
  eventId: string,
): Promise<void> {
  const { error } = await supabase
    .from("stripe_webhook_events")
    .delete()
    .eq("event_id", eventId);

  if (error && !isMissingStripeWebhookEventsTable(error)) {
    console.error(
      "stripe-webhook failed to release idempotency claim after retryable error",
      { event_id: eventId, error },
    );
  }
}
