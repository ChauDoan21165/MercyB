import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  // Fail fast in server logs; handler will still return 500 if called.
  // eslint-disable-next-line no-console
  console.error("[stripe] Missing STRIPE_SECRET_KEY");
}

const stripe = new Stripe(String(stripeSecretKey || ""), {
  // ✅ FIX: align with installed Stripe types (your build expects this literal)
  apiVersion: "2026-01-28.clover",
});

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const body = await req.json();
    const { user_id, tier } = body as {
      user_id: string;
      tier: "VIP1" | "VIP3" | "VIP9";
    };

    if (!user_id || !tier) {
      return new Response("Missing user_id or tier", { status: 400 });
    }

    const appUrl = process.env.APP_URL;
    if (!appUrl) {
      return new Response("Missing APP_URL", { status: 500 });
    }

    let priceId: string | undefined;

    if (tier === "VIP1") priceId = process.env.STRIPE_PRICE_VIP1;
    if (tier === "VIP3") priceId = process.env.STRIPE_PRICE_VIP3;
    if (tier === "VIP9") priceId = process.env.STRIPE_PRICE_VIP9;

    if (!priceId) {
      return new Response("Invalid tier or price not configured", {
        status: 400,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/billing/success`,
      cancel_url: `${appUrl}/billing/cancel`,
      metadata: {
        user_id,
        tier,
      },
    });

    return new Response(JSON.stringify({ checkout_url: session.url }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Stripe checkout error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}