// Step 9 (Monetization) — trial-expiry email funnel.
//
// Counter-side to the trial_extension_days column from PR #referral_grant.
// Runs daily (cron or admin-invoked) and queues a 3-stage email funnel:
//   D-3 — friendly reminder ("Mercy is excited to teach you")
//   D-1 — gentle urgency ("trial wraps in 24h")
//   D+1 — re-engagement ("here's what you missed")
//
// IMPORTANT: this function does NOT call any email vendor. Like the
// existing email-reengagement skeleton, it only writes 'pending' rows to
// email_sends_log. The vendor wiring (Resend / Postmark) is deferred to
// a daytime sender pass — see reports/a6-trial-expiry-runbook.md.
//
// Endpoint: POST /trial-expiry-emails
// Auth:     admin level >= 9 (mirrors email-reengagement)
// Response: { ok, scanned, buckets, queued, already_queued, skipped, sent: 0 }

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import {
  TRIAL_STAGE_TO_CAMPAIGN,
  categorizeForTrialExpiry,
  type TrialUserRow,
} from "./categorizeForTrialExpiry.ts";

import dMinus3Template from "./templates/trial-d-3.json" with { type: "json" };
import dMinus1Template from "./templates/trial-d-1.json" with { type: "json" };
import dPlus1Template from "./templates/trial-plus-1.json" with { type: "json" };

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
  trial_expiry_d_minus_3: dMinus3Template,
  trial_expiry_d_minus_1: dMinus1Template,
  trial_expiry_d_plus_1: dPlus1Template,
} as const;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // ── Auth: admin level >= 9 ───────────────────────────────────────────
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

    // ── Scan profiles ────────────────────────────────────────────────────
    // Pull only the columns categorizeForTrialExpiry needs. We DO NOT
    // pull full_name / phone / any extra PII — keeps the queue payload
    // lean and reduces blast radius if a future log row inadvertently
    // captures the row.
    const { data: profiles, error: profilesError } = await adminClient
      .from("profiles")
      .select("id, email, preferred_name, created_at, is_premium, trial_extension_days");

    if (profilesError) {
      console.error("[trial-expiry-emails] profiles query failed:", profilesError);
      return send({ ok: false, error: "Failed to query profiles" });
    }

    const rows = (profiles ?? []) as TrialUserRow[];
    const now = new Date();
    const buckets = categorizeForTrialExpiry(rows, now);

    // ── Queue pending rows (DO NOT SEND) ─────────────────────────────────
    const queueable: { user: TrialUserRow; campaign: string }[] = [
      ...buckets.d_minus_3.map((u) => ({ user: u, campaign: TRIAL_STAGE_TO_CAMPAIGN.D_minus_3 })),
      ...buckets.d_minus_1.map((u) => ({ user: u, campaign: TRIAL_STAGE_TO_CAMPAIGN.D_minus_1 })),
      ...buckets.d_plus_1.map((u) => ({ user: u, campaign: TRIAL_STAGE_TO_CAMPAIGN.D_plus_1 })),
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
          campaign_type: "trial_expiry",
          status: "pending",
        });

      if (insertError) {
        if (insertError.code === "23505") {
          alreadyQueued++;
          continue;
        }
        console.warn("[trial-expiry-emails] insert failed", {
          user_id: user.id,
          campaign,
          error: insertError,
        });
      } else {
        queued++;
      }
    }

    // Templates referenced so tree-shakers don't drop the imports — the
    // production sender pass will read them by campaign id.
    void TEMPLATES;

    return send({
      ok: true,
      scanned: rows.length,
      buckets: {
        d_minus_3: buckets.d_minus_3.length,
        d_minus_1: buckets.d_minus_1.length,
        d_plus_1: buckets.d_plus_1.length,
      },
      queued,
      already_queued: alreadyQueued,
      skipped: buckets.skipped.length,
      sent: 0,
      note: "Skeleton mode: rows written to email_sends_log as 'pending' with campaign_type='trial_expiry'. No emails were sent. See reports/a6-trial-expiry-runbook.md.",
    });
  } catch (err) {
    console.error("[trial-expiry-emails] unexpected error:", err);
    return send({
      ok: false,
      error: err instanceof Error ? err.message : "Internal server error",
    });
  }
});
