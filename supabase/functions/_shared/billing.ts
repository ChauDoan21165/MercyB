// deno-lint-ignore-file no-import-prefix

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

export type BillingProvider = "stripe" | "apple" | "google";
export type EntitlementSource = BillingProvider | null;
export type EntitlementStatus =
  | "active"
  | "trialing"
  | "grace_period"
  | "past_due"
  | "paused"
  | "expired"
  | "revoked"
  | "inactive";

export type EntitlementResponse = {
  is_premium: boolean;
  source: EntitlementSource;
  status: EntitlementStatus;
  expires_at: string | null;
};

export type AuthenticatedUser = {
  id: string;
  email: string | null;
};

export const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, stripe-signature",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

export function ok200(body = "ok") {
  return new Response(body, {
    status: 200,
    headers: corsHeaders,
  });
}

export function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

export function env(key: string): string {
  return (Deno.env.get(key) ?? "").trim();
}

export function asNonEmptyStringOrNull(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function normalizeEntitlementStatus(value: unknown): EntitlementStatus {
  const normalized = asNonEmptyStringOrNull(value)?.toLowerCase() ?? "inactive";

  switch (normalized) {
    case "active":
    case "trialing":
    case "grace_period":
    case "past_due":
    case "paused":
    case "expired":
    case "revoked":
    case "inactive":
      return normalized;
    default:
      return "inactive";
  }
}

export function toEntitlementResponse(row: {
  source?: unknown;
  status?: unknown;
  expires_at?: unknown;
} | null): EntitlementResponse {
  const sourceRaw = asNonEmptyStringOrNull(row?.source);
  const source: EntitlementSource =
    sourceRaw === "stripe" || sourceRaw === "apple" || sourceRaw === "google"
      ? sourceRaw
      : null;

  const status = normalizeEntitlementStatus(row?.status);
  const expires_at = asNonEmptyStringOrNull(row?.expires_at);

  const is_premium =
    status === "active" ||
    status === "trialing" ||
    status === "grace_period" ||
    status === "past_due";

  return {
    is_premium,
    source,
    status,
    expires_at,
  };
}

function adaptEntitlementRow(row: Record<string, unknown>): EntitlementResponse {
  return toEntitlementResponse({
    source: row.source ?? row.provider ?? row.premium_source ?? null,
    status: row.status ?? row.premium_status ?? null,
    expires_at: row.expires_at ?? row.current_period_end ??
      row.premium_expires_at ?? null,
  });
}

function createClientForAuth(authHeader: string) {
  const supabaseUrl = env("SUPABASE_URL");
  const anonKey = env("SUPABASE_ANON_KEY");

  if (!supabaseUrl || !anonKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY");
  }

  return createClient(supabaseUrl, anonKey, {
    global: {
      headers: {
        Authorization: authHeader,
      },
    },
    auth: {
      persistSession: false,
    },
  });
}

export function createAdminClient() {
  const supabaseUrl = env("SUPABASE_URL");
  const serviceKey = env("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(supabaseUrl, serviceKey, {
    auth: {
      persistSession: false,
    },
  });
}

export async function requireUser(
  req: Request,
): Promise<{ user: AuthenticatedUser } | { error: Response }> {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    return { error: json({ error: "Missing authorization header" }, 401) };
  }

  const supabase = createClientForAuth(authHeader);
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return { error: json({ error: "Unauthorized" }, 401) };
  }

  return {
    user: {
      id: data.user.id,
      email: data.user.email ?? null,
    },
  };
}

async function tryReadEntitlementFromTable(
  admin: ReturnType<typeof createAdminClient>,
  tableName: string,
  userId: string,
): Promise<EntitlementResponse | null> {
  const byUserId = await admin
    .from(tableName)
    .select("*")
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();

  if (!byUserId.error && byUserId.data) {
    return adaptEntitlementRow(byUserId.data as Record<string, unknown>);
  }

  const byId = await admin
    .from(tableName)
    .select("*")
    .eq("id", userId)
    .limit(1)
    .maybeSingle();

  if (!byId.error && byId.data) {
    return adaptEntitlementRow(byId.data as Record<string, unknown>);
  }

  return null;
}

export async function readEntitlementForUser(
  userId: string,
): Promise<EntitlementResponse> {
  const admin = createAdminClient();
  const candidates = [
    "user_entitlements_v",
    "user_entitlements",
    "my_entitlements_v1",
    "my_entitlements",
  ];

  for (const tableName of candidates) {
    const result = await tryReadEntitlementFromTable(admin, tableName, userId);
    if (result) return result;
  }

  return {
    is_premium: false,
    source: null,
    status: "inactive",
    expires_at: null,
  };
}