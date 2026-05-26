// PATH: supabase/functions/adult-content-url/index.ts

import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Content-Type": "application/json",
};

type SubscriptionRow = {
  status?: string | null;
  tier?: string | null;
};

function normalizeTier(value: unknown): string {
  return String(value ?? "").trim().toLowerCase();
}

function normalizeStatus(value: unknown): string {
  return String(value ?? "").trim().toLowerCase();
}

function isActiveSubscriptionStatus(status: string): boolean {
  return status === "active" || status === "trialing";
}

function isLegacyVipTier(tier: string): boolean {
  return /^vip[1-9]$/.test(tier);
}

function isPaidBillingTier(tier: string): boolean {
  return tier === "premium_month" || tier === "premium_year";
}

function isPaidAdultTier(tier: string): boolean {
  // New policy:
  // - premium_month / premium_year unlock the whole adult app
  // - keep legacy VIP tiers working too
  return isPaidBillingTier(tier) || isLegacyVipTier(tier);
}

function isSafeStorageKey(key: string): boolean {
  if (!key) return false;
  if (key.includes("..")) return false;
  if (key.startsWith("/")) return false;
  return true;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const key = url.searchParams.get("key"); // e.g. "level3/sacred_body_curious_self_vip3_sub2_sex.json"

    if (!key) {
      return new Response(JSON.stringify({ error: "missing_key" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    if (!isSafeStorageKey(key)) {
      return new Response(JSON.stringify({ error: "invalid_key" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !anonKey || !serviceRoleKey) {
      return new Response(JSON.stringify({ error: "server_misconfigured" }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    // Logged-in user client (RLS applies)
    const supabase = createClient(supabaseUrl, anonKey, {
      global: {
        headers: {
          Authorization: req.headers.get("Authorization") ?? "",
        },
      },
    });

    // 1) Require login
    const { data: authData, error: authErr } = await supabase.auth.getUser();
    if (authErr || !authData?.user) {
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
        headers: corsHeaders,
      });
    }

    const userId = authData.user.id;

    // 2) Require adult confirmed
    const { data: profile, error: profErr } = await supabase
      .from("profiles")
      .select("is_adult_confirmed")
      .eq("id", userId)
      .single();

    if (profErr) {
      return new Response(JSON.stringify({ error: "profile_lookup_failed" }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    if (!profile?.is_adult_confirmed) {
      return new Response(JSON.stringify({ error: "adult_not_confirmed" }), {
        status: 403,
        headers: corsHeaders,
      });
    }

    // 3) Check entitlement
    const { data: sub, error: subErr } = await supabase
      .from("subscriptions")
      .select("status, tier")
      .eq("user_id", userId)
      .single<SubscriptionRow>();

    const tier = normalizeTier(sub?.tier);
    const status = normalizeStatus(sub?.status);

    const hasAccess =
      !subErr &&
      !!sub &&
      isActiveSubscriptionStatus(status) &&
      isPaidAdultTier(tier);

    if (!hasAccess) {
      return new Response(
        JSON.stringify({
          error: "not_entitled",
          status,
          tier,
        }),
        {
          status: 402,
          headers: corsHeaders,
        },
      );
    }

    // 4) Generate signed URL to private bucket object
    const admin = createClient(supabaseUrl, serviceRoleKey);

    const { data: signed, error: signErr } = await admin.storage
      .from("adult-content")
      .createSignedUrl(key, 60);

    if (signErr || !signed?.signedUrl) {
      return new Response(JSON.stringify({ error: "signing_failed" }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    return new Response(
      JSON.stringify({
        signedUrl: signed.signedUrl,
        access: {
          granted: true,
          tier,
          status,
          paidAccessModel: "monthly_or_yearly_unlocks_all_vip_rooms",
        },
      }),
      {
        status: 200,
        headers: corsHeaders,
      },
    );
  } catch (_e) {
    return new Response(JSON.stringify({ error: "server_error" }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});