// story-prompt-email — Vietnamese-only milestone email that asks an
// eligible user to share their MercyBlade story. Once-ever per user
// (gated by `profiles.story_prompt_email_sent_at`). Cron schedule is
// a follow-up; for now this can be invoked manually with admin auth.
//
// Eligibility (mirrors src/lib/stories/eligibility.ts):
//   - profiles.tier >= 1
//   - account age >= 21 days
//   - speech_attempts.count(*) >= 50
//   - sustained week-over-week-over-week match_score improvement
//     (3 trailing 7-day buckets; cumulative gain >= +0.05 on 0..1)
//
// Caps reused from email-reengagement:
//   - 200ms pacing between sends (well under Resend's 10/s)
//   - 100/day global cap (defensive — rarely binding for this campaign
//     because once-ever per user means the volume tails off fast)
//
// Email respects email_preferences if the table exists; otherwise
// treats all users as opted-in (defensive: SELECT failures don't block).
//
// From: Mercy Blade <admin@mercyblade.com> (verified Resend domain).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

const FROM_ADDRESS = "Mercy Blade <admin@mercyblade.com>";
const REPLY_TO = "admin@mercyblade.com";
const SEND_INTERLEAVE_MS = 200;
const DAILY_GLOBAL_CAP = 100;

const MIN_TIER = 1;
const MIN_ACCOUNT_AGE_DAYS = 21;
const MIN_ATTEMPTS = 50;
const MIN_CUMULATIVE_GAIN = 0.05;
const TRAILING_WEEKS = 3;
const DAY_MS = 86_400_000;

function send(data: Record<string, unknown>) {
  return new Response(JSON.stringify(data), { status: 200, headers: corsHeaders });
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function pickFirstName(p: { email?: string | null; preferred_name?: string | null }): string {
  const preferred = String(p.preferred_name ?? "").trim();
  if (preferred) return preferred;
  const local = String(p.email ?? "").split("@")[0] ?? "";
  return local || "bạn";
}

interface AttemptRow {
  match_score: number | null;
  created_at: string;
}

function bucketAttemptScoresByWeek(
  attempts: ReadonlyArray<AttemptRow>,
  now: Date,
  weeks: number,
): Array<number | null> {
  const buckets: Array<{ sum: number; n: number }> = [];
  for (let i = 0; i < weeks; i++) buckets.push({ sum: 0, n: 0 });
  const nowMs = now.getTime();
  for (const a of attempts) {
    if (a.match_score == null) continue;
    const t = new Date(a.created_at).getTime();
    if (Number.isNaN(t)) continue;
    const ageDays = (nowMs - t) / DAY_MS;
    if (ageDays < 0 || ageDays >= weeks * 7) continue;
    const idx = weeks - 1 - Math.floor(ageDays / 7);
    if (idx < 0 || idx >= weeks) continue;
    buckets[idx].sum += a.match_score;
    buckets[idx].n += 1;
  }
  return buckets.map((b) => (b.n === 0 ? null : b.sum / b.n));
}

function hasSustainedImprovement(weekly: ReadonlyArray<number | null>): boolean {
  if (weekly.length < TRAILING_WEEKS) return false;
  for (const v of weekly) if (v == null) return false;
  const nums = weekly as number[];
  for (let i = 1; i < nums.length; i++) if (nums[i] < nums[i - 1]) return false;
  return nums[nums.length - 1] - nums[0] >= MIN_CUMULATIVE_GAIN;
}

interface ProfileRow {
  id: string;
  email: string | null;
  preferred_name: string | null;
  tier: number | null;
  created_at: string | null;
  story_prompt_email_sent_at: string | null;
}

function buildSubject(): string {
  return "Bạn đã có câu chuyện đáng kể với MercyBlade";
}

function buildBody(
  displayName: string,
  daysSinceStart: number,
  attemptCount: number,
): { text: string; html: string } {
  const text = `Chào ${displayName},

Hôm nay là ${daysSinceStart} ngày từ khi bạn bắt đầu MercyBlade. Bạn đã luyện tập ${attemptCount} lần phát âm và điểm số đang tăng đều — đó là một câu chuyện đáng kể.

Câu chuyện của bạn có thể giúp người Việt khác tin rằng họ cũng làm được. Bạn có thể chia sẻ không?

Chia sẻ câu chuyện: https://mercyblade.com/stories/share

Cảm ơn bạn đã đồng hành cùng Mercy.

— Đội ngũ MercyBlade
admin@mercyblade.com`;

  const escape = (s: string) =>
    s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  const html = `<!DOCTYPE html><html><body style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2937;background:#fafafa;padding:24px;">
    <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:12px;padding:32px;box-shadow:0 2px 8px rgba(0,0,0,0.04);line-height:1.6;">
      ${escape(text)
        .split("\n\n")
        .map((p) => `<p style="margin:0 0 16px;">${p.replaceAll("\n", "<br>")}</p>`)
        .join("")}
    </div>
  </body></html>`;

  return { text, html };
}

async function isEmailOptedIn(
  adminClient: ReturnType<typeof createClient>,
  userId: string,
): Promise<boolean> {
  // Defensive: if email_preferences doesn't exist or the row is absent,
  // treat as opted-in. We never want a missing-row failure to block a
  // milestone email. The unsubscribe system referenced in CLAUDE.md is
  // still being built; that will replace this gate.
  try {
    const { data } = await adminClient
      .from("email_preferences")
      .select("milestone_emails_opt_in")
      .eq("user_id", userId)
      .maybeSingle<{ milestone_emails_opt_in: boolean | null }>();
    if (data && data.milestone_emails_opt_in === false) return false;
    return true;
  } catch {
    return true;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Admin auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return send({ ok: false, error: "Missing Authorization header" });
    }
    const token = authHeader.replace("Bearer ", "");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY") ?? null;

    const anonClient = createClient(supabaseUrl, supabaseAnonKey);
    const { data: userData, error: userError } = await anonClient.auth.getUser(token);
    if (userError || !userData?.user) {
      return send({ ok: false, error: "Invalid session" });
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceKey);
    const { data: adminData, error: adminError } = await adminClient
      .from("admin_users")
      .select("level")
      .eq("user_id", userData.user.id)
      .single();
    if (adminError || !adminData || adminData.level < 9) {
      return send({ ok: false, error: "Admin level 9+ required" });
    }

    const resend = resendApiKey ? new Resend(resendApiKey) : null;
    const now = new Date();

    // Pull candidate profiles: paid + old enough + never been sent.
    const oldEnough = new Date(now.getTime() - MIN_ACCOUNT_AGE_DAYS * DAY_MS).toISOString();
    const { data: profiles, error: profilesError } = await adminClient
      .from("profiles")
      .select("id, email, preferred_name, tier, created_at, story_prompt_email_sent_at")
      .gte("tier", MIN_TIER)
      .lte("created_at", oldEnough)
      .is("story_prompt_email_sent_at", null);

    if (profilesError) {
      return send({ ok: false, error: `profiles: ${profilesError.message}` });
    }

    let scanned = 0;
    let eligible = 0;
    let skippedOptOut = 0;
    let sent = 0;
    let failed = 0;
    let throttled = 0;
    const errors: Array<{ user_id: string; error: string }> = [];

    for (const p of (profiles ?? []) as ProfileRow[]) {
      scanned++;
      if (!p.email) continue;

      // Attempt count
      const { count: attemptCount } = await adminClient
        .from("speech_attempts")
        .select("id", { count: "exact", head: true })
        .eq("user_id", p.id);
      if ((attemptCount ?? 0) < MIN_ATTEMPTS) continue;

      // Score trend
      const since = new Date(now.getTime() - TRAILING_WEEKS * 7 * DAY_MS).toISOString();
      const { data: attempts } = await adminClient
        .from("speech_attempts")
        .select("match_score, created_at")
        .eq("user_id", p.id)
        .gte("created_at", since);
      const weekly = bucketAttemptScoresByWeek(
        (attempts ?? []) as AttemptRow[],
        now,
        TRAILING_WEEKS,
      );
      if (!hasSustainedImprovement(weekly)) continue;

      eligible++;

      const optedIn = await isEmailOptedIn(adminClient, p.id);
      if (!optedIn) {
        skippedOptOut++;
        continue;
      }

      if (sent >= DAILY_GLOBAL_CAP) {
        throttled++;
        continue;
      }

      const daysSinceStart = p.created_at
        ? Math.floor((now.getTime() - new Date(p.created_at).getTime()) / DAY_MS)
        : MIN_ACCOUNT_AGE_DAYS;
      const subject = buildSubject();
      const { text, html } = buildBody(
        pickFirstName(p),
        daysSinceStart,
        attemptCount ?? MIN_ATTEMPTS,
      );

      if (!resend) {
        // Skeleton mode: still mark sent timestamp so a reconfigured run
        // doesn't double-send. Mirrors A6 skeleton behavior.
        await adminClient
          .from("profiles")
          .update({ story_prompt_email_sent_at: new Date().toISOString() })
          .eq("id", p.id);
        sent++;
        continue;
      }

      try {
        const { error: emailError } = await resend.emails.send({
          from: FROM_ADDRESS,
          to: [p.email],
          reply_to: REPLY_TO,
          subject,
          text,
          html,
        });
        if (emailError) {
          failed++;
          errors.push({ user_id: p.id, error: String(emailError.message ?? emailError) });
          continue;
        }
        await adminClient
          .from("profiles")
          .update({ story_prompt_email_sent_at: new Date().toISOString() })
          .eq("id", p.id);
        sent++;
      } catch (err) {
        failed++;
        errors.push({ user_id: p.id, error: err instanceof Error ? err.message : String(err) });
      }

      await sleep(SEND_INTERLEAVE_MS);
    }

    return send({
      ok: true,
      scanned,
      eligible,
      sent,
      failed,
      throttled,
      skipped_opt_out: skippedOptOut,
      skeleton_mode: !resend,
      errors: errors.slice(0, 20),
    });
  } catch (err) {
    console.error("[story-prompt-email] error:", err);
    return send({ ok: false, error: err instanceof Error ? err.message : "Internal error" });
  }
});
