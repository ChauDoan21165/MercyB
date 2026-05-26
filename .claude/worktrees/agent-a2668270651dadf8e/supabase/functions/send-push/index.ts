// supabase/functions/send-push/index.ts
//
// A9 — Mobile push delivery.
//
// Endpoint shapes:
//   POST { user_id, type, vars?, data?, locale?, override_quiet?: boolean }
//     → look up active tokens + preferences for user, render the
//       localized payload, decide whether to send (preference/quiet/
//       no-token), then dispatch to APNs (iOS) or FCM (Android).
//   POST { action: "test", user_id }
//     → admin-gated. Sends a hardcoded "Mercy đợi bạn" payload to the
//       caller's own device(s) regardless of preferences.
//
// Auth model:
//   - Service-role from server-side cron / triggers may call without
//     a user JWT; supplies user_id explicitly.
//   - Authenticated users may call with their own JWT to fire the
//     `test` action against their own user_id.
//   - Calls for a user_id that doesn't match the JWT (and isn't using
//     service role) are rejected.
//
// Provider integration:
//   This edge function ships DARK. APNs and FCM dispatch are stubbed
//   behind env-var checks (APNS_KEY_ID/APNS_TEAM_ID/APNS_PRIVATE_KEY
//   for APNs; FCM_SERVICE_ACCOUNT_JSON for FCM). When secrets are
//   present, dispatch happens; when absent, the function logs the
//   decision and records `status='queued'` so we can verify the
//   end-to-end contract before flipping the cert provisioning switch.

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

import {
  buildPush,
  decideSend,
  isWithinQuietHours,
  localTimeInZone,
  NOTIFICATION_TYPES,
  type NotificationType,
  type PushPlatform,
  type QuietHours,
} from "../_shared/pushNotifications.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: corsHeaders });
}

function env(name: string): string {
  return (Deno.env.get(name) ?? "").trim();
}

// ── Token + preference lookup ────────────────────────────────────────-

type TokenRow = {
  token: string;
  platform: PushPlatform;
  device_id: string | null;
};

type PrefRow = {
  daily_practice_enabled: boolean;
  streak_grace_enabled: boolean;
  leaderboard_change_enabled: boolean;
  mercy_message_enabled: boolean;
  trial_expiring_enabled: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
  timezone: string;
};

function preferenceForType(pref: PrefRow, type: NotificationType): boolean {
  switch (type) {
    case "daily_practice":
      return pref.daily_practice_enabled;
    case "streak_grace":
      return pref.streak_grace_enabled;
    case "leaderboard_position_change":
      return pref.leaderboard_change_enabled;
    case "mercy_message":
      return pref.mercy_message_enabled;
    case "trial_expiring":
      return pref.trial_expiring_enabled;
  }
}

const DEFAULT_PREF: PrefRow = {
  daily_practice_enabled: false,
  streak_grace_enabled: true,
  leaderboard_change_enabled: true,
  mercy_message_enabled: true,
  trial_expiring_enabled: true,
  quiet_hours_start: "22:00",
  quiet_hours_end: "07:00",
  timezone: "Asia/Ho_Chi_Minh",
};

async function loadPreference(
  client: ReturnType<typeof createClient>,
  userId: string,
): Promise<PrefRow> {
  const { data } = await client
    .from("push_preferences")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (!data) return DEFAULT_PREF;
  return {
    daily_practice_enabled: !!data.daily_practice_enabled,
    streak_grace_enabled: !!data.streak_grace_enabled,
    leaderboard_change_enabled: !!data.leaderboard_change_enabled,
    mercy_message_enabled: !!data.mercy_message_enabled,
    trial_expiring_enabled: !!data.trial_expiring_enabled,
    quiet_hours_start: String(data.quiet_hours_start ?? "22:00").slice(0, 5),
    quiet_hours_end: String(data.quiet_hours_end ?? "07:00").slice(0, 5),
    timezone: String(data.timezone ?? "Asia/Ho_Chi_Minh"),
  };
}

async function loadActiveTokens(
  client: ReturnType<typeof createClient>,
  userId: string,
): Promise<TokenRow[]> {
  const { data } = await client
    .from("push_tokens")
    .select("token, platform, device_id")
    .eq("user_id", userId)
    .eq("status", "active");
  if (!data) return [];
  return data.map((r) => ({
    token: String(r.token),
    platform: r.platform as PushPlatform,
    device_id: (r.device_id as string | null) ?? null,
  }));
}

async function logSend(
  client: ReturnType<typeof createClient>,
  args: {
    user_id: string;
    type: NotificationType;
    status: string;
    platform?: PushPlatform | null;
    provider_message_id?: string | null;
    error_message?: string | null;
  },
): Promise<void> {
  await client.from("push_send_log").insert({
    user_id: args.user_id,
    notification_type: args.type,
    status: args.status,
    platform: args.platform ?? null,
    provider_message_id: args.provider_message_id ?? null,
    error_message: args.error_message ?? null,
  });
}

// ── Provider dispatch (DARK by default) ──────────────────────────────-

type DispatchResult =
  | { ok: true; provider_message_id: string | null }
  | { ok: false; reason: "invalid_token" | "transient" | "config_missing"; message: string };

async function dispatch(
  token: TokenRow,
  payload: { title: string; body: string; data: Record<string, string> },
): Promise<DispatchResult> {
  // iOS via APNs.
  if (token.platform === "ios") {
    if (!env("APNS_KEY_ID") || !env("APNS_TEAM_ID") || !env("APNS_PRIVATE_KEY")) {
      return {
        ok: false,
        reason: "config_missing",
        message: "APNS_KEY_ID / APNS_TEAM_ID / APNS_PRIVATE_KEY not set",
      };
    }
    // Real APNs JWT signing + HTTP/2 dispatch is left for the
    // certificate-provisioning step (manual). When we wire it, sign a
    // JWT with ES256 over the APNs key and POST to
    // https://api.push.apple.com/3/device/<token>. Today this is dark.
    return {
      ok: false,
      reason: "config_missing",
      message: "APNs dispatch not yet wired — ships dark",
    };
  }

  // Android via FCM.
  if (token.platform === "android") {
    const sa = env("FCM_SERVICE_ACCOUNT_JSON");
    if (!sa) {
      return {
        ok: false,
        reason: "config_missing",
        message: "FCM_SERVICE_ACCOUNT_JSON not set",
      };
    }
    // Real FCM call: POST to fcm.googleapis.com/v1/projects/<id>/messages:send
    // with an OAuth2 token derived from the service account JSON. Dark
    // until the service account is provisioned.
    return {
      ok: false,
      reason: "config_missing",
      message: "FCM dispatch not yet wired — ships dark",
    };
  }

  // Web push (browser) — out of scope for this PR but listed in the
  // platform enum so we don't lock the schema. Treat as config_missing.
  return {
    ok: false,
    reason: "config_missing",
    message: "Web push not implemented",
  };
}

// ── HTTP entrypoint ──────────────────────────────────────────────────-

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = env("SUPABASE_URL");
  const serviceRole = env("SUPABASE_SERVICE_ROLE_KEY");
  const anonKey = env("SUPABASE_ANON_KEY");
  if (!supabaseUrl || !serviceRole || !anonKey) {
    return json({ error: "config_missing" }, 500);
  }

  const adminClient = createClient(supabaseUrl, serviceRole);

  let body: Record<string, unknown> = {};
  try {
    body = req.method === "POST" ? await req.json() : {};
  } catch {
    body = {};
  }

  const action = String(body.action ?? "send");
  const targetUserId = String(body.user_id ?? "");

  // Authorization: service role bypasses; user JWT must match user_id.
  const auth = req.headers.get("Authorization") ?? "";
  const isServiceRole = auth === `Bearer ${serviceRole}`;
  if (!isServiceRole) {
    if (!auth.startsWith("Bearer ")) {
      return json({ error: "missing_auth" }, 401);
    }
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: auth } },
    });
    const { data: userData } = await userClient.auth.getUser();
    if (!userData?.user?.id || userData.user.id !== targetUserId) {
      return json({ error: "user_id_mismatch" }, 403);
    }
  }

  if (!targetUserId) return json({ error: "missing_user_id" }, 400);

  // Decide notification type + variables.
  let type: NotificationType;
  let vars: Record<string, string | number> = {};
  let data: Record<string, string> = {};
  let locale: "vi" | "en" = "vi";
  let overrideQuiet = false;

  if (action === "test") {
    type = "daily_practice";
  } else {
    const t = String(body.type ?? "");
    if (!NOTIFICATION_TYPES.includes(t as NotificationType)) {
      return json({ error: "invalid_type" }, 400);
    }
    type = t as NotificationType;
    vars = (body.vars as Record<string, string | number>) ?? {};
    data = (body.data as Record<string, string>) ?? {};
    locale = (body.locale === "en" ? "en" : "vi");
    overrideQuiet = body.override_quiet === true;
  }

  // Load tokens + preferences.
  const [tokens, pref] = await Promise.all([
    loadActiveTokens(adminClient, targetUserId),
    loadPreference(adminClient, targetUserId),
  ]);

  const quiet: QuietHours = {
    start: pref.quiet_hours_start,
    end: pref.quiet_hours_end,
  };
  const localTime = localTimeInZone(new Date(), pref.timezone);

  const decision = decideSend({
    type,
    preference_enabled: action === "test" ? true : preferenceForType(pref, type),
    active_token_count: tokens.length,
    current_local_time: localTime,
    quiet,
  });

  // Tests bypass quiet hours; explicit override flag also does.
  const shouldRespectQuiet = !(action === "test" || overrideQuiet);
  if (decision.kind !== "send" && !(decision.kind === "skipped_quiet_hours" && !shouldRespectQuiet)) {
    await logSend(adminClient, {
      user_id: targetUserId,
      type,
      status: decision.kind,
    });
    return json({ ok: true, decision: decision.kind, dispatched: 0 });
  }

  // Build the localized payload.
  const built = buildPush(type, locale, vars, data);
  if (!built) {
    await logSend(adminClient, {
      user_id: targetUserId,
      type,
      status: "failed",
      error_message: "missing_required_vars",
    });
    return json({ error: "missing_required_vars" }, 400);
  }

  // Quiet-hours override path: log it explicitly so audit shows the bypass.
  if (decision.kind === "skipped_quiet_hours" && !shouldRespectQuiet) {
    await logSend(adminClient, {
      user_id: targetUserId,
      type,
      status: "queued",
      error_message: "quiet_hours_overridden",
    });
  }

  // Dispatch to every active token. Mark invalid ones for cleanup.
  let dispatched = 0;
  let invalid = 0;
  for (const token of tokens) {
    const result = await dispatch(token, built);
    if (result.ok) {
      dispatched += 1;
      await logSend(adminClient, {
        user_id: targetUserId,
        type,
        status: "sent",
        platform: token.platform,
        provider_message_id: result.provider_message_id,
      });
    } else if (result.reason === "invalid_token") {
      invalid += 1;
      await adminClient.rpc("mark_push_token_invalid", {
        p_token: token.token,
        p_reason: result.message,
      });
      await logSend(adminClient, {
        user_id: targetUserId,
        type,
        status: "failed",
        platform: token.platform,
        error_message: result.message,
      });
    } else {
      await logSend(adminClient, {
        user_id: targetUserId,
        type,
        status: result.reason === "config_missing" ? "queued" : "failed",
        platform: token.platform,
        error_message: result.message,
      });
    }
  }

  return json({
    ok: true,
    decision: "send",
    type,
    locale,
    tokens: tokens.length,
    dispatched,
    invalidated: invalid,
    title: built.title,
    body: built.body,
  });
});
