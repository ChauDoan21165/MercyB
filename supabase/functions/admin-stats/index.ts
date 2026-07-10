// supabase/functions/admin-stats/index.ts
/**
 * MercyBlade Blue Launch Map — v83.5 (AUTHORITATIVE)
 * Generated: 2025-12-22 (+0700)
 * Reporter: teacher GPT
 *
 * PURPOSE:
 * Admin KPI Edge Function.
 * Must:
 * - Handle CORS for localhost + production
 * - Require Authorization Bearer token
 * - Verify user
 * - Enforce admin role
 * - Return deterministic JSON shape
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type Stats = {
  totalUsers: number;
  activeToday: number;
  totalRooms: number;
  revenueMonth: number;
};

function json(data: unknown, status = 200, extraHeaders: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...extraHeaders,
    },
  });
}

function corsHeaders(origin: string | null) {
  const o = origin ?? "*";
  return {
    "Access-Control-Allow-Origin": o,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Credentials": "true",
    Vary: "Origin",
  };
}

function getBearerToken(req: Request): string | null {
  const h = req.headers.get("authorization") || req.headers.get("Authorization");
  if (!h) return null;

  const m = h.match(/^Bearer\s+(.+)$/i);
  return m?.[1] ?? null;
}

async function countRegisteredAuthUsers(admin: ReturnType<typeof createClient>): Promise<number> {
  const perPage = 1000;
  let page = 1;
  let total = 0;

  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({
      page,
      perPage,
    });

    if (error) {
      throw new Error(`auth users count failed: ${error.message}`);
    }

    const users = data?.users ?? [];
    total += users.length;

    if (users.length < perPage) break;

    page += 1;
  }

  return total;
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
        CORS
      );
    }

    const token = getBearerToken(req);
    if (!token) {
      return json({ ok: false, error: "Missing authorization header" }, 401, CORS);
    }

    const admin = createClient(supabaseUrl, serviceRole, {
      auth: { persistSession: false },
    });

    const { data: userData, error: userErr } = await admin.auth.getUser(token);
    if (userErr || !userData?.user) {
      return json({ ok: false, error: "Unauthorized (invalid session)" }, 401, CORS);
    }

    const userId = userData.user.id;

    const { data: profile, error: profileErr } = await admin
      .from("profiles")
      .select("id, role, is_admin")
      .eq("id", userId)
      .maybeSingle();

    if (profileErr) {
      return json(
        { ok: false, error: `profiles lookup failed: ${profileErr.message}` },
        403,
        CORS
      );
    }

    const isAdmin = Boolean((profile as any)?.is_admin) || (profile as any)?.role === "admin";
    if (!isAdmin) {
      return json({ ok: false, error: "Forbidden (not admin)" }, 403, CORS);
    }

    const totalUsersRaw = await countRegisteredAuthUsers(admin);
    // Exclude the Tier-3 synthetic learner (a real auth user + profiles row)
    // from the headline user count. is_synthetic lives on profiles, not
    // auth.users, so subtract the synthetic profile count from the auth total.
    const { count: syntheticCount } = await admin
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("is_synthetic", true);
    const totalUsers = Math.max(0, totalUsersRaw - (syntheticCount ?? 0));

    const activeToday = 0;
    const totalRooms = 0;
    const revenueMonth = 0;

    const stats: Stats = {
      totalUsers,
      activeToday,
      totalRooms,
      revenueMonth,
    };

    return json({ ok: true, stats }, 200, CORS);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return json({ ok: false, error: msg }, 500, CORS);
  }
});