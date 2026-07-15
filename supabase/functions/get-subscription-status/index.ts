import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { buildEntitlementSnapshot } from "./core.ts";
import {
  buildProfileProjection,
  profileProjectionNeedsSync,
} from "../_shared/entitlementProjection.ts";

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
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const supabaseServiceRoleKey =
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
      return new Response(
        JSON.stringify({
          error:
            "Missing SUPABASE_URL, SUPABASE_ANON_KEY, or SUPABASE_SERVICE_ROLE_KEY",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: req.headers.get("Authorization")! },
      },
    });

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

    const adminClient = createClient(supabaseUrl, supabaseServiceRoleKey);

    const { data: subscriptions, error: subscriptionsError } = await adminClient
      .from("subscriptions")
      .select(
        "id,status,current_period_end,current_period_end_at,provider,updated_at"
      )
      .eq("user_id", user.id)
      .eq("app_id", "mercy_blade");

    if (subscriptionsError) {
      throw subscriptionsError;
    }

    const { data: profile, error: profileError } = await adminClient
      .from("profiles")
      .select("premium_status,premium_expires_at,premium_source,tier")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      throw profileError;
    }

    const entitlement = buildEntitlementSnapshot(
      subscriptions ?? [],
      new Date()
    );
    const premiumStatus = entitlement.status;
    const premiumExpiresAt = entitlement.expires_at;
    const premiumSource = entitlement.source;
    const isPremium = entitlement.is_premium;

    const projection = buildProfileProjection(entitlement);
    if (profileProjectionNeedsSync(profile, projection)) {
      const { error: projectionError } = await adminClient
        .from("profiles")
        .update(projection)
        .eq("id", user.id);
      if (projectionError) {
        console.warn(
          "[get-subscription-status] projection sync skipped:",
          projectionError.message
        );
      }
    }

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
      `
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
      `Subscription status retrieved: premium_status=${premiumStatus}, isAdmin=${isAdmin}`
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
      }
    );
  }
});
