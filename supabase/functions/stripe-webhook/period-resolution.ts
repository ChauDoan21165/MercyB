// supabase/functions/stripe-webhook/period-resolution.ts
//
// Pure resolution of a subscription's current period start/end from any
// Stripe object shape (subscription object, subscription item, or invoice
// line). Extracted verbatim out of webhook-events.ts (which transitively
// imports Deno-only billing.ts + core.ts and so cannot be unit tested) for
// the same reason #715 extracted logic.ts/core.ts and subscription-insert.ts
// was extracted: this is money-path entitlement math and deserves a
// deterministic, dependency-free, vitest-importable test. No Deno / npm /
// _shared imports here — only self-contained pure helpers — so it is both
// `deno check`-clean and vitest-importable. `toIsoFromUnix`/`asRecord`/
// `getFirstLine`/`getFirstSubscriptionItem` are byte-for-byte the
// core.ts:153 / webhook-events.ts originals (the subscription-insert.ts
// "byte-for-byte the billing.ts original" precedent) so behaviour is
// identical; webhook-events.ts keeps its own copies for its other call
// sites and now imports getCurrentPeriodStart/getCurrentPeriodEnd from here.
//
// The ONLY behavioural change vs the pre-extraction code is the documented
// field-order fix inside getCurrentPeriodEnd (B5 class bug — see
// PR b11/period-end-field-order).

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

// Byte-for-byte core.ts:153 toIsoFromUnix. Stripe period fields are Unix
// SECONDS; this is the single, frozen seconds→ISO contract.
function toIsoFromUnix(value: unknown): string | null {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    return null;
  }

  return new Date(value * 1000).toISOString();
}

function getFirstSubscriptionItem(
  raw: Record<string, unknown>,
): Record<string, unknown> | null {
  const items = asRecord(raw.items);
  const data = Array.isArray(items?.data) ? items.data : [];
  return asRecord(data[0]);
}

function getFirstLine(
  raw: Record<string, unknown>,
): Record<string, unknown> | null {
  const lines = asRecord(raw.lines);
  const data = Array.isArray(lines?.data) ? lines.data : [];
  return asRecord(data[0]);
}

function getLinePeriodStart(raw: Record<string, unknown>): string | null {
  const line = getFirstLine(raw);
  const period = asRecord(line?.period);

  return toIsoFromUnix(period?.start) ?? null;
}

function getLinePeriodEnd(raw: Record<string, unknown>): string | null {
  const line = getFirstLine(raw);
  const period = asRecord(line?.period);

  return toIsoFromUnix(period?.end) ?? null;
}

function getItemCurrentPeriodStart(raw: Record<string, unknown>): string | null {
  const firstItem = getFirstSubscriptionItem(raw);

  return toIsoFromUnix(firstItem?.current_period_start) ?? null;
}

function getItemCurrentPeriodEnd(raw: Record<string, unknown>): string | null {
  const firstItem = getFirstSubscriptionItem(raw);

  return toIsoFromUnix(firstItem?.current_period_end) ?? null;
}

export function getCurrentPeriodStart(
  raw: Record<string, unknown>,
): string | null {
  // Deliberately UNCHANGED by the B5 fix. The fix is scoped to the period
  // END (that is the money-path symptom: the END lands in the past so the
  // entitlement reads as expired). getCurrentPeriodStart has the analogous
  // top-level-vs-line shape, but a start-side change is a separate,
  // consciously-reviewed PR — not folded into this surgical fix.
  return (
    toIsoFromUnix(raw.current_period_start) ??
    toIsoFromUnix(raw.period_start) ??
    getItemCurrentPeriodStart(raw) ??
    getLinePeriodStart(raw) ??
    toIsoFromUnix(raw.start_date) ??
    null
  );
}

export function getCurrentPeriodEnd(
  raw: Record<string, unknown>,
): string | null {
  // FIELD-ORDER FIX — B5 class bug. PR b11/period-end-field-order.
  // Discovered case: mylinh.nutrition's "paid but free" subscription
  // (event evt_1TV59K).
  //
  // Stripe gotcha: on a `billing_reason: "subscription_cycle"` RENEWAL
  // invoice, the top-level `period_end` is the boundary of the period that
  // JUST ENDED — NOT the new period. The new period lives in
  // `lines.data[0].period.end`. (Invoice objects also carry NO top-level
  // `current_period_end` and NO `items` — only `lines`.)
  //
  // The pre-fix order read `toIsoFromUnix(raw.period_end)` BEFORE
  // `getLinePeriodEnd(raw)`, so every monthly renewal wrote the just-ended
  // boundary as current_period_end. Silent: the freshness marker
  // (billing.ts:deriveObjectTimeMs) still advanced because it reads
  // lines, so the row "looked" fresh while the entitlement boundary it
  // wrote was already in the past → paid-but-free for every renewer.
  //
  // This precedence now MIRRORS deriveObjectTimeMs (the freshness marker):
  // [top-level current_period_*] → [items current_period_*] →
  // [lines period.*]. deriveObjectTimeMs never reads top-level
  // `period_end`; here it is kept ONLY as a last-resort fallback below the
  // line period (it is still correct on objects that lack lines).
  // Subscription objects carry a top-level `current_period_end`, so they
  // short-circuit at the first clause exactly as before — behaviour for
  // subscription objects is unchanged.
  return (
    toIsoFromUnix(raw.current_period_end) ??
    getItemCurrentPeriodEnd(raw) ??
    getLinePeriodEnd(raw) ??
    toIsoFromUnix(raw.period_end) ??
    toIsoFromUnix(raw.trial_end) ??
    null
  );
}
