// supabase/functions/admin-list-registered-users/index.ts
//
// User-first admin user list. Pulls every Supabase Auth signup via
// admin.auth.admin.listUsers(), then defensively merges in profile +
// subscription rows so admins can see ALL registered users — including
// signups that never got a `profiles` row (failed signup trigger,
// anonymous accounts, legacy data).
//
// Pairs with (does not replace) the existing admin-list-users edge
// function, which is profiles-first and is still used by the Subscribers
// tab. Keep both.
//
// Pattern mirrors admin-stats: bearer-token getUser → profiles role
// check → service-role query for the actual data.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { captureEdgeError } from "../_shared/sentry.ts";
import { adminListRegisteredUsersRequestSchema } from "../_shared/adminSchemas.ts";

type SubscriptionStatus = "active" | "trialing" | "free" | "unknown";

interface RegisteredUser {
  id: string;
  email: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  provider: string | null;
  has_profile: boolean;
  is_admin: boolean;
  subscription_status: SubscriptionStatus;
  current_period_end: string | null;
}

interface ListBody {
  page?: number;
  perPage?: number;
}

function corsHeaders(origin: string | null) {
  return {
    "Access-Control-Allow-Origin": origin ?? "*",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
}

function json(data: unknown, status: number, extraHeaders: Record<string, string>) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...extraHeaders },
  });
}

function getBearerToken(req: Request): string | null {
  const h = req.headers.get("authorization") || req.headers.get("Authorization");
  if (!h) return null;
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m?.[1] ?? null;
}

function clampPerPage(value: unknown): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return 100;
  // listUsers caps at 1000; keep a sane page size for UI tables.
  return Math.max(1, Math.min(500, Math.floor(n)));
}

function clampPage(value: unknown): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return 1;
  return Math.max(1, Math.floor(n));
}

function normalizeSubscriptionStatus(raw: unknown): SubscriptionStatus {
  const s = String(raw ?? "").trim().toLowerCase();
  if (s === "active") return "active";
  if (s === "trialing" || s === "trial") return "trialing";
  return "unknown";
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  const CORS = corsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }
  if (req.method !== "POST") {
    return json({ ok: false, error: "Method not allowed" }, 405, CORS);
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceRole) {
      return json(
        { ok: false, error: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env" },
        500,
        CORS,
      );
    }

    const token = getBearerToken(req);
    if (!token) {
      return json({ ok: false, error: "Missing authorization header" }, 401, CORS);
    }

    const admin = createClient(supabaseUrl, serviceRole, {
      auth: { persistSession: false },
    });

    // ── Auth + admin gate ─────────────────────────────────────────────
    const { data: userData, error: userErr } = await admin.auth.getUser(token);
    if (userErr || !userData?.user) {
      return json({ ok: false, error: "Unauthorized (invalid session)" }, 401, CORS);
    }

    const { data: profile, error: profileErr } = await admin
      .from("profiles")
      .select("id, role, is_admin")
      .eq("id", userData.user.id)
      .maybeSingle();

    if (profileErr) {
      return json(
        { ok: false, error: `profiles lookup failed: ${profileErr.message}` },
        403,
        CORS,
      );
    }
    const isAdmin =
      Boolean((profile as { is_admin?: boolean } | null)?.is_admin) ||
      (profile as { role?: string } | null)?.role === "admin";
    if (!isAdmin) {
      return json({ ok: false, error: "Forbidden (not admin)" }, 403, CORS);
    }

    // ── Read pagination ────────────────────────────────────────────────
    // ── A11b: request-payload runtime validation ────────────────────────
    // Auth + admin gate ALREADY passed above. Replaces the un-validated
    // `as ListBody` cast. Empty body still defaults to {} (preserving
    // existing behavior); malformed JSON is still tolerated (try/catch
    // returns {}); only structurally bad shapes (e.g. page="2", perPage
    // negative) get rejected with 400 + Sentry beacon. clampPerPage /
    // clampPage remain in place — they handle the upper-bound clamp at
    // 500 (handler-side policy) on top of the schema's max 1000
    // (Supabase Auth API hard ceiling).
    let parsedJson: unknown = {};
    try {
      parsedJson = await req.json();
    } catch {
      parsedJson = {};
    }
    const bodyParse = adminListRegisteredUsersRequestSchema.safeParse(parsedJson);
    if (!bodyParse.success) {
      const topLevelKeys =
        parsedJson && typeof parsedJson === "object" && !Array.isArray(parsedJson)
          ? Object.keys(parsedJson as Record<string, unknown>)
          : [];
      await captureEdgeError(
        new Error("admin-list-registered-users request failed zod validation"),
        {
          functionName: "admin-list-registered-users",
          userId: userData.user.id,
          extra: {
            stage: "request-zod",
            zodIssues: bodyParse.error.issues.map((iss) => ({
              path: iss.path.join("."),
              code: iss.code,
              message: iss.message,
            })),
            topLevelKeys,
          },
          tags: { admin: "true", stage: "request-zod" },
        },
      );
      return json(
        { ok: false, error: "Request body failed validation" },
        400,
        CORS,
      );
    }
    const body: ListBody = bodyParse.data;
    const page = clampPage(body.page);
    const perPage = clampPerPage(body.perPage);

    // ── Pull this page of auth.users ──────────────────────────────────
    const { data: pageData, error: pageErr } = await admin.auth.admin.listUsers({
      page,
      perPage,
    });
    if (pageErr) {
      return json(
        { ok: false, error: `auth listUsers failed: ${pageErr.message}` },
        500,
        CORS,
      );
    }

    const authUsers = pageData?.users ?? [];
    const userIds = authUsers.map((u) => u.id);

    // ── Defensive batch joins ─────────────────────────────────────────
    // profiles + user_subscriptions are two cheap IN-list queries. Either
    // can be empty / errored — we never let one missing row break the
    // whole list. Failures fall through to has_profile=false /
    // subscription_status='unknown'.

    const profileMap = new Map<string, { is_admin: boolean }>();
    if (userIds.length > 0) {
      try {
        const { data: profileRows, error: profilesErr } = await admin
          .from("profiles")
          .select("id, is_admin, role")
          .in("id", userIds);
        if (!profilesErr && Array.isArray(profileRows)) {
          for (const row of profileRows as Array<{
            id: string;
            is_admin?: boolean | null;
            role?: string | null;
          }>) {
            profileMap.set(row.id, {
              is_admin: Boolean(row.is_admin) || row.role === "admin",
            });
          }
        }
      } catch {
        // leave profileMap empty; downstream marks has_profile=false
      }
    }

    const subscriptionMap = new Map<
      string,
      { status: SubscriptionStatus; current_period_end: string | null }
    >();
    if (userIds.length > 0) {
      try {
        const { data: subRows, error: subsErr } = await admin
          .from("user_subscriptions")
          .select("user_id, status, current_period_end")
          .in("user_id", userIds);
        if (!subsErr && Array.isArray(subRows)) {
          // If a user has multiple subscriptions, prefer active > trialing.
          for (const row of subRows as Array<{
            user_id: string;
            status: string | null;
            current_period_end: string | null;
          }>) {
            const status = normalizeSubscriptionStatus(row.status);
            const existing = subscriptionMap.get(row.user_id);
            if (
              !existing ||
              (existing.status !== "active" && status === "active") ||
              (existing.status === "unknown" && status !== "unknown")
            ) {
              subscriptionMap.set(row.user_id, {
                status,
                current_period_end: row.current_period_end,
              });
            }
          }
        }
      } catch {
        // leave subscriptionMap empty; downstream marks free/unknown
      }
    }

    // ── Merge + project ──────────────────────────────────────────────
    const users: RegisteredUser[] = authUsers.map((u) => {
      const profile = profileMap.get(u.id);
      const sub = subscriptionMap.get(u.id);

      const subscription_status: SubscriptionStatus = sub
        ? sub.status
        : "free"; // no subscription row = free user

      return {
        id: u.id,
        email: u.email ?? null,
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at ?? null,
        provider:
          (u.app_metadata as { provider?: string } | undefined)?.provider ??
          null,
        has_profile: Boolean(profile),
        is_admin: Boolean(profile?.is_admin),
        subscription_status,
        current_period_end: sub?.current_period_end ?? null,
      };
    });

    // listUsers doesn't return a totalCount; we infer hasMore from page fill.
    const hasMore = authUsers.length === perPage;

    return json(
      {
        ok: true,
        users,
        pagination: { page, perPage, hasMore, returned: users.length },
      },
      200,
      CORS,
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return json({ ok: false, error: msg }, 500, { ...CORS });
  }
});
