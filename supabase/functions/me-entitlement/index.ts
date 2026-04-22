// deno-lint-ignore-file no-import-prefix
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

type CanonicalSource = "stripe" | "apple" | "google" | null;
type CanonicalStatus =
  | "active"
  | "trialing"
  | "grace_period"
  | "past_due"
  | "paused"
  | "expired"
  | "revoked"
  | "inactive";

type SubscriptionRow = Record<string, unknown>;

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function asNonEmptyString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function toIsoString(value: unknown): string | null {
  const raw = asNonEmptyString(value);
  if (!raw) return null;

  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function getExpiresAt(row: SubscriptionRow): string | null {
  return (
    toIsoString(row.expires_at) ??
    toIsoString(row.current_period_end) ??
    toIsoString(row.period_end) ??
    toIsoString(row.ends_at) ??
    toIsoString(row.expired_at) ??
    null
  );
}

function getSortTimestamp(row: SubscriptionRow): number {
  const candidates = [
    row.updated_at,
    row.current_period_end,
    row.expires_at,
    row.period_end,
    row.ends_at,
    row.created_at,
  ];

  for (const value of candidates) {
    const iso = toIsoString(value);
    if (iso) return new Date(iso).getTime();
  }

  return 0;
}

function normalizeSource(row: SubscriptionRow): CanonicalSource {
  const raw = (
    asNonEmptyString(row.source) ??
    asNonEmptyString(row.provider) ??
    asNonEmptyString(row.platform) ??
    asNonEmptyString(row.store)
  )?.toLowerCase();

  switch (raw) {
    case "stripe":
      return "stripe";
    case "apple":
    case "app_store":
    case "appstore":
    case "apple_app_store":
      return "apple";
    case "google":
    case "google_play":
    case "googleplay":
    case "play_store":
    case "play":
    case "android":
      return "google";
    default:
      return null;
  }
}

function normalizeStatus(row: SubscriptionRow): CanonicalStatus {
  const raw = (
    asNonEmptyString(row.status) ??
    asNonEmptyString(row.subscription_status) ??
    asNonEmptyString(row.state)
  )?.toLowerCase();

  const expiresAt = getExpiresAt(row);
  const expiresAtMs = expiresAt ? new Date(expiresAt).getTime() : null;
  const now = Date.now();

  switch (raw) {
    case "active":
      return "active";
    case "trialing":
    case "trial":
      return "trialing";
    case "grace_period":
    case "grace":
    case "in_grace_period":
      return "grace_period";
    case "past_due":
    case "past-due":
    case "unpaid":
      return "past_due";
    case "paused":
    case "pause":
    case "on_hold":
      return "paused";
    case "revoked":
    case "refunded":
    case "refund":
    case "chargeback":
      return "revoked";
    case "expired":
      return "expired";
    case "inactive":
    case "incomplete":
    case "incomplete_expired":
      return "inactive";
    case "canceled":
    case "cancelled":
    case "ended":
    case "terminated":
      if (expiresAtMs !== null && expiresAtMs > now) return "active";
      return "expired";
    default:
      if (expiresAtMs !== null && expiresAtMs <= now) return "expired";
      return "inactive";
  }
}

function isPremiumStatus(status: CanonicalStatus): boolean {
  return (
    status === "active" ||
    status === "trialing" ||
    status === "grace_period" ||
    status === "past_due"
  );
}

function statusRank(status: CanonicalStatus): number {
  switch (status) {
    case "active":
      return 70;
    case "trialing":
      return 60;
    case "grace_period":
      return 50;
    case "past_due":
      return 40;
    case "paused":
      return 30;
    case "expired":
      return 20;
    case "revoked":
      return 10;
    case "inactive":
    default:
      return 0;
  }
}

function compareRows(a: SubscriptionRow, b: SubscriptionRow): number {
  const aStatus = normalizeStatus(a);
  const bStatus = normalizeStatus(b);

  const byStatus = statusRank(bStatus) - statusRank(aStatus);
  if (byStatus !== 0) return byStatus;

  const aExpires = getExpiresAt(a);
  const bExpires = getExpiresAt(b);
  const aExpiresMs = aExpires ? new Date(aExpires).getTime() : 0;
  const bExpiresMs = bExpires ? new Date(bExpires).getTime() : 0;

  if (bExpiresMs !== aExpiresMs) return bExpiresMs - aExpiresMs;

  const byTimestamp = getSortTimestamp(b) - getSortTimestamp(a);
  if (byTimestamp !== 0) return byTimestamp;

  const aId = String(a.id ?? "");
  const bId = String(b.id ?? "");
  return aId.localeCompare(bId);
}

function normalizeEntitlement(rows: SubscriptionRow[]) {
  const best = [...rows].sort(compareRows)[0];

  if (!best) {
    return {
      is_premium: false,
      source: null,
      status: "inactive" as CanonicalStatus,
      expires_at: null,
    };
  }

  const status = normalizeStatus(best);
  const source = normalizeSource(best);
  const expiresAt = getExpiresAt(best);

  return {
    is_premium: isPremiumStatus(status),
    source,
    status,
    expires_at: expiresAt,
  };
}

// ── Trial window (Phase 2) ───────────────────────────────────────────────────
// Free-tier users get exactly TRIAL_DAYS of access from profiles.created_at.
// Users created before GRANDFATHER_CUTOFF_ISO are grandfathered (no expiry).
// Premium users bypass the trial gate entirely.
const TRIAL_DAYS = 3;
const GRANDFATHER_CUTOFF_ISO = "2026-04-22T00:00:00Z";

function computeTrialStatus(
  createdAtRaw: unknown,
  isPremium: boolean,
): { trial_expires_at: string | null; is_trial_expired: boolean } {
  if (isPremium) {
    return { trial_expires_at: null, is_trial_expired: false };
  }

  const createdAtIso = toIsoString(createdAtRaw);
  if (!createdAtIso) {
    // No profile row or unparseable created_at: fail open (grandfathered).
    // Avoids locking out legitimate users on data-integrity edge cases.
    return { trial_expires_at: null, is_trial_expired: false };
  }

  const createdAtMs = new Date(createdAtIso).getTime();
  const cutoffMs = new Date(GRANDFATHER_CUTOFF_ISO).getTime();

  if (createdAtMs < cutoffMs) {
    return { trial_expires_at: null, is_trial_expired: false };
  }

  const trialEndsMs = createdAtMs + TRIAL_DAYS * 24 * 60 * 60 * 1000;
  return {
    trial_expires_at: new Date(trialEndsMs).toISOString(),
    is_trial_expired: Date.now() > trialEndsMs,
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
    try {
      const { data: profile } = await adminClient
        .from("profiles")
        .select("created_at")
        .eq("id", user.id)
        .maybeSingle();
      profileCreatedAt = profile?.created_at ?? null;
    } catch {
      // fail open: missing profile → grandfathered
    }

    const entitlement = normalizeEntitlement(subscriptions ?? []);
    const trial = computeTrialStatus(profileCreatedAt, entitlement.is_premium);

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