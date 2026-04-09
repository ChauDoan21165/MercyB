// supabase/functions/verify-checkout-session/index.ts

import Stripe from "https://esm.sh/stripe@12.18.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-10-16",
});

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

Deno.serve(async (req) => {
  try {
    const { session_id } = await req.json();

    if (!session_id) {
      return new Response(
        JSON.stringify({ error: "Missing session_id" }),
        { status: 400 },
      );
    }

    // 1. Get session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["customer", "subscription"],
    });

    if (session.payment_status !== "paid") {
      return new Response(
        JSON.stringify({ error: "Payment not completed" }),
        { status: 400 },
      );
    }

    const customerId =
      typeof session.customer === "string"
        ? session.customer
        : session.customer?.id;

    if (!customerId) {
      throw new Error("Missing Stripe customer");
    }

    const email = session.customer_details?.email;

    if (!email) {
      throw new Error("Missing customer email");
    }

    // 2. Find user by email
    const { data: userData, error: userError } =
      await supabaseAdmin.auth.admin.listUsers();

    if (userError) throw userError;

    const user = userData.users.find((u) => u.email === email);

    if (!user) {
      throw new Error("User not found for this checkout");
    }

    const userId = user.id;

    // 3. Update profile (SAFE UPDATE ONLY)
    await supabaseAdmin
      .from("profiles")
      .update({
        stripe_customer_id: customerId,
      })
      .eq("id", userId);

    // 4. Upsert subscription (IDEMPOTENT)
    await supabaseAdmin
      .from("subscriptions")
      .upsert(
        {
          user_id: userId,
          stripe_customer_id: customerId,
          status: "active",
          source: "stripe",
        },
        {
          onConflict: "user_id",
        },
      );

    return new Response(
      JSON.stringify({
        ok: true,
        message: "Subscription activated",
      }),
      { status: 200 },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: "Verification failed",
        detail: err instanceof Error ? err.message : err,
      }),
      { status: 500 },
    );
  }
});