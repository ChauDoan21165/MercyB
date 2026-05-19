// supabase/functions/billing-stripe-change-plan/logic.ts
//
// Pure, side-effect-free decision helpers for the Stripe plan-change
// function. These were extracted verbatim from index.ts so the money-path
// branching — change-type inference, subscription updatability, the
// canceled/expired "force a fresh checkout instead of mutating a dead
// subscription" guard, and the Stripe id/url validators — can be
// unit-tested. index.ts re-imports them and is otherwise unchanged.
//
// Edge functions are excluded from tsconfig and eslint, so the only
// automated coverage for this logic is logic.test.ts. Keep these
// functions pure (no Deno, no network, no Supabase, no Stripe runtime)
// — `Stripe` is a type-only import and is erased at transform time.

import type Stripe from "npm:stripe@12.18.0";

export function asRecordOrNull(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

export function asNonEmptyStringOrNull(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function asBooleanOrNull(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null;
}

export function normalize(value: unknown): string {
  return String(value ?? "").toLowerCase().replace(/\s+/g, " ").trim();
}

export function isFreeTier(tier: { name?: string | null }): boolean {
  return normalize(tier.name) === "level0";
}

export function isStripePriceId(value: string | null): value is string {
  return !!value && /^price_[A-Za-z0-9]+$/.test(value);
}

export function isStripeCustomerId(value: string | null): value is string {
  return !!value && /^cus_[A-Za-z0-9]+$/.test(value);
}

export function isValidHttpUrl(value: string | null): value is string {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function getBearerToken(req: Request): string {
  const authHeader = req.headers.get("authorization") || "";
  return authHeader.toLowerCase().startsWith("bearer ")
    ? authHeader.slice(7).trim()
    : "";
}

export function getStringField(
  body: Record<string, unknown>,
  keys: string[],
): string | null {
  for (const key of keys) {
    const value = asNonEmptyStringOrNull(body[key]);
    if (value) return value;
  }
  return null;
}

export function getRequestOrigin(req: Request): string | null {
  const origin = asNonEmptyStringOrNull(req.headers.get("origin"));
  if (origin) return origin.replace(/\/+$/, "");

  const referer = asNonEmptyStringOrNull(req.headers.get("referer"));
  if (referer) {
    try {
      return new URL(referer).origin.replace(/\/+$/, "");
    } catch {
      return null;
    }
  }

  return null;
}

export function buildDefaultUrls(req: Request) {
  const origin = getRequestOrigin(req) ?? "http://127.0.0.1:3107";
  return {
    successUrl: `${origin}/billing/success`,
    cancelUrl: `${origin}/pricing`,
  };
}

export function isStripeSubscriptionUpdatable(
  subscription: Stripe.Subscription,
): boolean {
  return ["active", "trialing", "past_due", "unpaid"].includes(subscription.status);
}

export function shouldForceCheckoutForLifecycle(
  subscription: Stripe.Subscription,
): boolean {
  return (
    subscription.status === "canceled" ||
    subscription.status === "incomplete_expired" ||
    subscription.canceled_at != null ||
    subscription.ended_at != null
  );
}

export function getSubscriptionLifecycleSnapshot(subscription: Stripe.Subscription) {
  return {
    id: subscription.id,
    status: subscription.status,
    cancel_at_period_end: subscription.cancel_at_period_end ?? false,
    cancel_at: subscription.cancel_at ?? null,
    canceled_at: subscription.canceled_at ?? null,
    ended_at: subscription.ended_at ?? null,
    current_period_end: subscription.current_period_end ?? null,
    current_period_start: subscription.current_period_start ?? null,
    collection_method: subscription.collection_method ?? null,
    default_payment_method:
      typeof subscription.default_payment_method === "string"
        ? subscription.default_payment_method
        : subscription.default_payment_method?.id ?? null,
  };
}

export function getExistingRecurringItem(
  subscription: Stripe.Subscription,
): Stripe.SubscriptionItem | null {
  return (
    subscription.items.data.find((entry) => {
      const price = entry.price;
      return !!entry.id && !!price && !price.deleted && !!price.recurring;
    }) ?? null
  );
}

export function inferChangeType(params: {
  currentPrice: Stripe.Price;
  targetPrice: Stripe.Price;
}): "upgrade" | "downgrade" | "lateral" {
  const currentAmount = params.currentPrice.unit_amount ?? 0;
  const targetAmount = params.targetPrice.unit_amount ?? 0;

  if (targetAmount > currentAmount) return "upgrade";
  if (targetAmount < currentAmount) return "downgrade";
  return "lateral";
}
