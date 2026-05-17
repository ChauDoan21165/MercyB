// deno-lint-ignore-file no-import-prefix
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  computeTrialStatus,
  type CanonicalStatus,
  normalizeEntitlement,
  toIsoString,
} from "./entitlement.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

// Gift-code subscriptions live in the legacy `user_subscriptions`
// table — they're created by the redeem-access-code RPC and never
// reach the unified `subscriptions` table that this function queries
// above. Without this fallback, a user with a perfectly valid gift
// redemption sees Free / Inactive on /account.
//
// Runs with the admin (service-role) client because the frontend's
// anon-keyed read of `user_subscriptions` was hitting an RLS edge that
// is hard to reproduce from outside the request (suspected role/AAL
// conflict). Service-role bypasses RLS entirely.
//
// Identification rule: `is_gift_redemption = true` AND `status =
// 'active'` AND `current_period_end > now()`. The redeem RPC always
// populates `current_period_end` (either +days or +100 years for
// lifetime), so dropping null-tolerance is safe.
async function fetchActiveGiftSubscription(
  client: ReturnType<typeof createClient>,
  userId: string,
): Promise<{ current_period_end: string | null } | null> {
  const nowIso = new Date().toISOString();
  const { data, error } = await client
    .from("user_subscriptions")
    .select("current_period_end")
    .eq("user_id", userId)
    .eq("status", "active")
    .eq("is_gift_redemption", true)
    .gt("current_period_end", nowIso)
    .order("current_period_end", { ascending: false, nullsFirst: false })
    .limit(1)
    .maybeSingle();
  if (error || !data) return null;
  return {
    current_period_end: toIsoString(
      (data as { current_period_end?: unknown }).current_period_end,
    ),
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "GET" && req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
      return json(
        {
          error:
            "Missing SUPABASE_URL, SUPABASE_ANON_KEY, or SUPABASE_SERVICE_ROLE_KEY",
        },
        500,
      );
    }

    const authorization = req.headers.get("Authorization") ?? "";
    if (!authorization) {
      return json({ error: "Unauthorized" }, 401);
    }

    const authClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: authorization,
        },
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const {
      data: { user },
      error: userError,
    } = await authClient.auth.getUser();

    if (userError || !user) {
      return json({ error: "Unauthorized" }, 401);
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const { data: subscriptions, error: subscriptionsError } = await adminClient
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("app_id", "mercy_blade");

    if (subscriptionsError) {
      return json({ error: subscriptionsError.message }, 500);
    }

    let profileCreatedAt: unknown = null;
    let profileTrialExtensionDays: unknown = 0;
    try {
      const { data: profile } = await adminClient
        .from("profiles")
        .select("created_at, trial_extension_days")
        .eq("id", user.id)
        .maybeSingle();
      profileCreatedAt = profile?.created_at ?? null;
      profileTrialExtensionDays = profile?.trial_extension_days ?? 0;
    } catch {
      // fail open: missing profile → grandfathered
    }

    let entitlement = normalizeEntitlement(subscriptions ?? []);

    // Fallback: gift-code redemptions don't write to `subscriptions`,
    // they live in `user_subscriptions`. If the unified table doesn't
    // produce a premium entitlement, check there before declaring the
    // user non-premium.
    if (!entitlement.is_premium) {
      const giftSub = await fetchActiveGiftSubscription(adminClient, user.id);
      if (giftSub) {
        entitlement = {
          is_premium: true,
          source: "gift_code",
          status: "active" as CanonicalStatus,
          expires_at: giftSub.current_period_end,
        };
      }
    }

    const trial = computeTrialStatus(
      profileCreatedAt,
      entitlement.is_premium,
      profileTrialExtensionDays,
    );

    return json({ ...entitlement, ...trial });
  } catch (error) {
    return json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});
