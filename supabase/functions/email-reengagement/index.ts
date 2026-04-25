// Real send wires via Resend (or alternative vendor) in a production round.
// This skeleton intentionally does NOT call any email vendor SDK. It only
// identifies users, picks templates, and writes pending rows to
// public.email_sends_log for human review before any send is enabled.
//
// See reports/a6-email-runbook.md for the production wiring plan and the
// open vendor decision (Resend vs Postmark).
//
// Endpoint:
//   GET /reengagement/check
//
// Auth:
//   Requires admin level >= 9 (mirrors email-broadcast). Same JWT pattern.
//
// Response (HTTP 200, always):
//   { ok: true,  scanned: N, queued: { warm: N, cool: N, cold: N }, skipped: N }
//   { ok: false, error: "..." }

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import {
  categorizeUsers,
  campaignFor,
  type UserActivityRow,
} from "./categorizeUsers.ts";

import warmTemplate from "./templates/warm.json" with { type: "json" };
import coolTemplate from "./templates/cool.json" with { type: "json" };
import coldTemplate from "./templates/cold.json" with { type: "json" };

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

function send(data: Record<string, unknown>) {
  return new Response(JSON.stringify(data), { status: 200, headers: corsHeaders });
}

const TEMPLATES = {
  reengagement_7d: warmTemplate,
  reengagement_14d: coolTemplate,
  reengagement_30d: coldTemplate,
} as const;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // ── Auth: admin level >= 9 ─────────────────────────────────────────────
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return send({ ok: false, error: "Missing or invalid Authorization header" });
    }
    const token = authHeader.replace("Bearer ", "");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const anonClient = createClient(supabaseUrl, supabaseAnonKey);
    const { data: userData, error: userError } = await anonClient.auth.getUser(token);

    if (userError || !userData?.user) {
      return send({ ok: false, error: "Invalid or expired session" });
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    const { data: adminData, error: adminError } = await adminClient
      .from("admin_users")
      .select("level")
      .eq("user_id", userData.user.id)
      .single();

    if (adminError || !adminData || adminData.level < 9) {
      return send({ ok: false, error: "Insufficient permissions. Admin level 9+ required." });
    }

    // ── Scan profiles ──────────────────────────────────────────────────────
    const { data: profiles, error: profilesError } = await adminClient
      .from("profiles")
      .select("id, email, last_active_at");

    if (profilesError) {
      console.error("[email-reengagement] profiles query failed:", profilesError);
      return send({ ok: false, error: "Failed to query profiles" });
    }

    const rows: UserActivityRow[] = (profiles ?? []) as UserActivityRow[];
    const now = new Date();
    const buckets = categorizeUsers(rows, now);

    // ── Queue pending rows (DO NOT SEND) ───────────────────────────────────
    // Each emailable user gets one INSERT into email_sends_log with
    // status='pending'. The unique partial index on (user_id, campaign) WHERE
    // status='pending' makes re-runs idempotent — a user already queued for a
    // given campaign won't be queued again until the prior row is
    // sent/failed/skipped.
    const queueable: { user: UserActivityRow; campaign: string }[] = [
      ...buckets.warm.map(u => ({ user: u, campaign: "reengagement_7d" })),
      ...buckets.cool.map(u => ({ user: u, campaign: "reengagement_14d" })),
      ...buckets.cold.map(u => ({ user: u, campaign: "reengagement_30d" })),
    ];

    let queued = 0;
    let alreadyQueued = 0;
    for (const { user, campaign } of queueable) {
      const { error: insertError } = await adminClient
        .from("email_sends_log")
        .insert({
          user_id: user.id,
          email: user.email,
          campaign,
          status: "pending",
        });

      if (insertError) {
        // Unique-constraint hit means a pending row already exists for this
        // (user, campaign) — that's expected idempotency, not a failure.
        if (insertError.code === "23505") {
          alreadyQueued++;
          continue;
        }
        console.warn("[email-reengagement] insert failed", { user_id: user.id, campaign, error: insertError });
      } else {
        queued++;
      }
    }

    // Templates are loaded but unused in skeleton mode; reference them so
    // the production wiring is obvious and tree-shakers don't drop the imports.
    void TEMPLATES;
    void campaignFor;

    return send({
      ok: true,
      scanned: rows.length,
      buckets: {
        warm: buckets.warm.length,
        cool: buckets.cool.length,
        cold: buckets.cold.length,
      },
      queued,
      already_queued: alreadyQueued,
      skipped: buckets.skipped.length,
      sent: 0,
      note: "Skeleton mode: rows written to email_sends_log as 'pending'. No emails were sent. See reports/a6-email-runbook.md.",
    });
  } catch (err) {
    console.error("[email-reengagement] unexpected error:", err);
    return send({
      ok: false,
      error: err instanceof Error ? err.message : "Internal server error",
    });
  }
});
