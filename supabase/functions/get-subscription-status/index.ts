import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { buildEntitlementSnapshot } from "./core.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      },
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("Authentication failed:", authError);
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Getting subscription status for user: ${user.id}`);

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("premium_status,premium_expires_at,premium_source")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      throw profileError;
    }

    // B13 Phase 3 PR-B: route the entitlement decision through the
    // shared expiry-aware derive (`core.ts:buildEntitlementSnapshot`).
    // Pre-PR-B, `isPremium = premiumStatus === "active"` ignored
    // `premium_expires_at` and granted premium to expired-but-active
    // rows. R2 of the four-reader repoint.
    const entitlement = buildEntitlementSnapshot(profile, new Date());
    const premiumStatus = entitlement.status;
    const premiumExpiresAt = entitlement.expires_at;
    const premiumSource = entitlement.source;
    const isPremium = entitlement.is_premium;

    const { data: adminRole } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    const isAdmin = !!adminRole;

    const { data: usage } = await supabase
      .from("subscription_usage")
      .select("*")
      .eq("user_id", user.id)
      .eq("usage_date", new Date().toISOString().split("T")[0])
      .maybeSingle();

    const { data: kidsSubscription } = await supabase
      .from("kids_subscriptions")
      .select(
        `
        *,
        kids_levels (
          id,
          name_en,
          name_vi,
          price_monthly
        )
      `,
      )
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();

    const result = {
      success: true,
      user: {
        id: user.id,
        email: user.email,
      },
      entitlement: {
        status: premiumStatus,
        expires_at: premiumExpiresAt,
        source: premiumSource,
        is_premium: isPremium,
      },
      subscription: isPremium
        ? {
            status: premiumStatus,
            current_period_end: premiumExpiresAt,
            provider: premiumSource,
          }
        : null,
      kidsSubscription: kidsSubscription || null,
      isAdmin,
      tier: isPremium ? "premium" : "level0",
      usage: {
        roomsAccessed: usage?.rooms_accessed || 0,
        customTopicsRequested: usage?.custom_topics_requested || 0,
        limits: {
          roomsPerDay: 0,
          customTopics: 0,
        },
      },
      benefits: {
        prioritySupport: isPremium,
        unlimitedAccess: isAdmin,
      },
      deprecated: true,
    };

    console.log(
      `Subscription status retrieved: premium_status=${premiumStatus}, isAdmin=${isAdmin}`,
    );

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in get-subscription-status:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});