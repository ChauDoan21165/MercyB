// supabase/functions/mock-interview/index.ts
//
// Day-of Deno entry. Wires production Deps (admin client + JWT helper +
// real Postgres reads) and delegates to `handleRequest` in core.ts.
// Same pattern as azure-phoneme.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

import {
  createSupabaseAdminClient,
  getUserFromAuthHeader,
} from "../_shared/security.ts";
import { wrapHandler } from "../_shared/sentry.ts";
import { isPremiumEntitled } from "../_shared/premiumEntitlement.ts";

import { handleRequest, type Deps, type UserProfile } from "./core.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// ── Real-deps implementations ──────────────────────────────────────────

/**
 * Tier + trial + paid detection.
 *
 * `isPaid` is the real paid signal: `profiles.premium_status` /
 * `premium_expires_at` via the shared `isPremiumEntitled` helper
 * (active/trialing within expiry, or past_due/grace_period dunning
 * regardless of expiry — B13 caveat #3). The old `tier` numeric read
 * is DEAD — `profiles.tier` is TEXT, so `typeof tier === "number"`
 * was always false → the gate's `tier >= 2` paid branch never fired
 * and a premium user who paid AFTER trial (status 'active', not
 * 'trialing') was dropped to the free 1/week limit (B5/B17).
 *
 * `isTrialing` is kept distinct so the gate can label the allow
 * reason 'trialing' (different UX copy) vs 'paid'.
 */
async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("tier, is_premium, premium_status, premium_expires_at")
      .eq("id", userId)
      .maybeSingle();
    if (error || !data) return null;
    const row = data as {
      tier?: string | number | null;
      is_premium?: boolean | null;
      premium_status?: string | null;
      premium_expires_at?: string | null;
    };
    return {
      tier: typeof row.tier === "number" ? row.tier : 0,
      isTrialing:
        row.is_premium === true && row.premium_status === "trialing",
      isPaid: isPremiumEntitled({
        premium_status: row.premium_status ?? null,
        premium_expires_at: row.premium_expires_at ?? null,
        tier: row.tier ?? null,
      }),
    };
  } catch (err) {
    console.warn("[mock-interview] fetchUserProfile threw:", err);
    return null;
  }
}

async function resolveAdminLevel(userId: string): Promise<number> {
  try {
    const { data, error } = await supabase.rpc("get_admin_level", {
      p_user_id: userId,
    });
    if (error || typeof data !== "number") return 0;
    return data;
  } catch {
    return 0;
  }
}

async function countSessionsThisWeek(
  userId: string,
  weekStartIsoUtc: string,
): Promise<number> {
  const { count, error } = await supabase
    .from("mock_interview_sessions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("started_at", weekStartIsoUtc);
  if (error) {
    console.warn("[mock-interview] countSessionsThisWeek error:", error.message);
    // Fail-OPEN — never block the user on a count blip. Returning 0
    // means the gate will allow the session through; the `started_at`
    // index is hot anyway so this should be rare.
    return 0;
  }
  return count ?? 0;
}

async function insertSession(
  userId: string,
  scenarioId: string,
): Promise<string> {
  const { data, error } = await supabase
    .from("mock_interview_sessions")
    .insert({ user_id: userId, scenario_id: scenarioId, status: "active" })
    .select("id")
    .single();
  if (error || !data?.id) {
    throw new Error(`insertSession: ${error?.message ?? "no row returned"}`);
  }
  return String(data.id);
}

async function markSessionCompleted(
  sessionId: string,
  userId: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from("mock_interview_sessions")
    .update({ completed_at: new Date().toISOString(), status: "completed" })
    .eq("id", sessionId)
    .eq("user_id", userId)
    .select("id")
    .maybeSingle();
  if (error) {
    console.warn("[mock-interview] markSessionCompleted error:", error.message);
    return false;
  }
  return data !== null;
}

const productionDeps: Deps = {
  getUserFromAuthHeader: (req) => getUserFromAuthHeader(req),
  fetchUserProfile,
  resolveAdminLevel,
  countSessionsThisWeek,
  insertSession,
  markSessionCompleted,
};

serve(wrapHandler("mock-interview", (req) => handleRequest(req, productionDeps)));
