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
 * - (Optional) enforce admin role
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
  // Allow localhost + your deployed domains.
  // Keep this permissive during dev; tighten later.
  const o = origin ?? "*";
  return {
    "Access-Control-Allow-Origin": o,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Credentials": "true",
    "Vary": "Origin",
  };
}

function getBearerToken(req: Request): string | null {
  const h = req.headers.get("authorization") || req.headers.get("Authorization");
  if (!h) return null;
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m?.[1] ?? null;
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

    // Admin (service-role) client to verify user + read DB
    const admin = createClient(supabaseUrl, serviceRole, {
      auth: { persistSession: false },
      global: {
        headers: {
          // Pass through the user's JWT so auth.getUser(token) works
          Authorization: `Bearer ${token}`,
        },
      },
    });

    // 1) Verify user
    const { data: userData, error: userErr } = await admin.auth.getUser(token);
    if (userErr || !userData?.user) {
      return json({ ok: false, error: "Unauthorized (invalid session)" }, 401, CORS);
    }

    const userId = userData.user.id;

    // 2) OPTIONAL: enforce admin role (choose ONE style and keep it consistent)
    // If you don't have these columns yet, comment this block out for now.
    const { data: profile, error: profileErr } = await admin
      .from("profiles")
      .select("id, role, is_admin")
      .eq("id", userId)
      .maybeSingle();

    if (profileErr) {
      // If profiles table doesn't exist or schema mismatch, return explicit error
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

    // 3) Stats (minimal placeholders; replace as your schema stabilizes)
    // Total Users: easiest via auth admin API is not exposed here reliably without extra calls,
    // so we use profiles count as MVP.
    const { count: totalUsers, error: usersErr } = await admin
      .from("profiles")
      .select("*", { count: "exact", head: true });

    if (usersErr) {
      return json({ ok: false, error: `profiles count failed: ${usersErr.message}` }, 500, CORS);
    }

    // Active Today: if you have activity table, swap this out.
    const activeToday = 0;

    // Total Rooms: use your generated manifest length on client usually,
    // but if you have a rooms table, count here.
    const totalRooms = 0;

    // Revenue: placeholder until payments table exists
    const revenueMonth = 0;

    const stats: Stats = {
      totalUsers: Number(totalUsers ?? 0),
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
