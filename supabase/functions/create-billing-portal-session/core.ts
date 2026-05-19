// supabase/functions/create-billing-portal-session/core.ts
//
// Pure handler logic for create-billing-portal-session. Mirrors the
// redeem-access-code / mock-interview pattern: a `handleRequest(req, deps)`
// that can be unit-tested without Deno, Postgres, or a live Stripe key.
//
// index.ts keeps the env reads (STRIPE_SECRET_KEY / SUPABASE_* presence
// guards) and constructs the production Deps; this module owns the
// request lifecycle so the money-path branches (auth, subscription
// existence, customer resolution, Stripe failure) are exercised in CI.
//
// Response contract is byte-for-byte the pre-extraction behavior:
//   200 { url }
//   401 { error: "Missing Authorization Bearer token" }
//   401 { error: "Invalid JWT", detail }
//   404 { error: "No Stripe subscription found for user" }
//   404 { error: "No Stripe customer found for user" }
//   405 { error: "Method not allowed" }
//   500 { error: "Failed to resolve subscription", detail }
//   500 { error: "Internal error", detail }

export const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

export function getBearerToken(req: Request): string {
  const authHeader = req.headers.get("authorization") || "";
  return authHeader.toLowerCase().startsWith("bearer ")
    ? authHeader.slice(7).trim()
    : "";
}

export function asNonEmptyStringOrNull(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/**
 * Result of resolving the user's Stripe-provider subscription. `ok:false`
 * is a query/RLS failure (-> 500); `ok:true` with `hasSubscription:false`
 * is "no row" (-> 404).
 */
export type SubscriptionLookup =
  | { ok: true; hasSubscription: boolean }
  | { ok: false; error: string };

export interface Deps {
  /** Validate the bearer token; null if auth rejects it. */
  getUserFromToken(
    token: string,
  ): Promise<{ id: string } | null>;
  /** Look up an active/usable Stripe subscription for the user. */
  getSubscriptionLookup(userId: string): Promise<SubscriptionLookup>;
  /** Resolve the Stripe customer id (profiles.id then .user_id fallback). */
  getStripeCustomerId(userId: string): Promise<string | null>;
  /** Create the Stripe billing-portal session; returns the redirect url. */
  createPortalSession(
    customerId: string,
  ): Promise<{ url: string | null }>;
}

export async function handleRequest(
  req: Request,
  deps: Deps,
): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    const token = getBearerToken(req);
    if (!token) {
      return json({ error: "Missing Authorization Bearer token" }, 401);
    }

    const user = await deps.getUserFromToken(token);
    if (!user?.id) {
      return json(
        { error: "Invalid JWT", detail: "No user returned from auth" },
        401,
      );
    }

    const lookup = await deps.getSubscriptionLookup(user.id);
    if (!lookup.ok) {
      return json(
        { error: "Failed to resolve subscription", detail: lookup.error },
        500,
      );
    }

    if (!lookup.hasSubscription) {
      return json({ error: "No Stripe subscription found for user" }, 404);
    }

    const stripeCustomerId = asNonEmptyStringOrNull(
      await deps.getStripeCustomerId(user.id),
    );

    if (!stripeCustomerId) {
      return json({ error: "No Stripe customer found for user" }, 404);
    }

    const session = await deps.createPortalSession(stripeCustomerId);
    return json({ url: session.url });
  } catch (error) {
    return json(
      {
        error: "Internal error",
        detail: error instanceof Error ? error.message : String(error),
      },
      500,
    );
  }
}
