// src/pages/api/stripe/create-checkout-session.ts

import Stripe from "stripe";

type Tier = "VIP1" | "VIP3" | "VIP9";

type CheckoutRequestBody = {
  user_id?: string;
  tier?: Tier;
};

type ExistingSubscription = {
  status: string;
};

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  // eslint-disable-next-line no-console
  console.error("[stripe] Missing STRIPE_SECRET_KEY");
}

const stripe = new Stripe(String(stripeSecretKey || ""), {
  apiVersion: "2026-01-28.clover",
});

const ACTIVE_SUBSCRIPTION_STATUSES = new Set([
  "active",
  "trialing",
  "past_due",
]);

function jsonResponse(
  body: Record<string, unknown>,
  status = 200,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function getPriceIdForTier(tier: Tier): string | undefined {
  if (tier === "VIP1") return process.env.STRIPE_PRICE_VIP1;
  if (tier === "VIP3") return process.env.STRIPE_PRICE_VIP3;
  if (tier === "VIP9") return process.env.STRIPE_PRICE_VIP9;
  return undefined;
}

function getCanonicalAppUrl(): string | null {
  const raw = process.env.APP_URL;
  if (!raw) return null;

  try {
    const url = new URL(raw);
    return url.origin;
  } catch {
    return null;
  }
}

/**
 * Replace this with your real server-side auth/session resolution.
 *
 * Best practice:
 * - derive the authenticated user from a verified server session
 * - do NOT trust a raw user_id from the client body long-term
 *
 * For now, this preserves current behavior so the route remains drop-in compatible.
 */
async function getAuthenticatedUserId(
  req: Request,
  body: CheckoutRequestBody,
): Promise<string | null> {
  const userId = typeof body.user_id === "string" ? body.user_id.trim() : "";
  if (!userId) return null;

  // TODO:
  // Replace the fallback above with verified auth/session lookup.
  // Example target:
  //   const user = await getUserFromServerSession(req)
  //   return user?.id ?? null

  return userId;
}

/**
 * Replace with real DB lookup.
 * This should check whether the user already has an active/trialing/past_due subscription.
 */
async function getActiveSubscription(
  userId: string,
): Promise<ExistingSubscription | null> {
  void userId;
  return null;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: { Allow: "POST" },
    });
  }

  if (!stripeSecretKey) {
    return new Response("Missing STRIPE_SECRET_KEY", { status: 500 });
  }

  try {
    const body = (await req.json()) as CheckoutRequestBody;
    const tier = body.tier;

    if (!tier) {
      return new Response("Missing tier", { status: 400 });
    }

    if (tier !== "VIP1" && tier !== "VIP3" && tier !== "VIP9") {
      return new Response("Invalid tier", { status: 400 });
    }

    const userId = await getAuthenticatedUserId(req, body);
    if (!userId) {
      return new Response("Missing or invalid authenticated user", {
        status: 401,
      });
    }

    const appUrl = getCanonicalAppUrl();
    if (!appUrl) {
      return new Response("Missing or invalid APP_URL", { status: 500 });
    }

    const priceId = getPriceIdForTier(tier);
    if (!priceId) {
      return new Response("Price not configured for tier", { status: 400 });
    }

    const existing = await getActiveSubscription(userId);
    if (
      existing &&
      typeof existing.status === "string" &&
      ACTIVE_SUBSCRIPTION_STATUSES.has(existing.status)
    ) {
      return jsonResponse(
        {
          error: "ALREADY_SUBSCRIBED",
        },
        409,
      );
    }

    const metadata = {
      user_id: userId,
      tier,
      price_id: priceId,
      source: "src/pages/api/stripe/create-checkout-session.ts",
    };

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/billing/success?checkout=success`,
      cancel_url: `${appUrl}/billing/cancel`,
      metadata,
      subscription_data: {
        metadata,
      },
    });

    if (!session.url) {
      // eslint-disable-next-line no-console
      console.error("[stripe] Checkout session created without URL", {
        userId,
        tier,
        sessionId: session.id,
      });

      return new Response("Failed to create checkout URL", { status: 500 });
    }

    return jsonResponse({ checkout_url: session.url }, 200);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Stripe checkout error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}