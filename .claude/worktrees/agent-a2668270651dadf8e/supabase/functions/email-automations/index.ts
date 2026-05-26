/**
 * Email Automations Edge Function
 * Handles automated welcome emails and expiry reminders.
 * 
 * Called by daily cron job or manually for testing.
 * 
 * Automations:
 * 1. Welcome Email: Send to new Level 2/Level 3 subscribers who haven't received welcome email yet
 * 2. Expiry Warning: Send reminder 7 days before subscription ends
 * 
 * Always returns HTTP 200 with { ok: boolean, ... } pattern
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

// Email configuration - matches send-redeem-email exactly
const EMAIL_CONFIG = {
  from: "Mercy Blade <onboarding@resend.dev>",
  bcc: "cd12536@gmail.com",
  siteUrl: "https://mercyblade.com",
};

// Trial gate constants — MUST match me-entitlement/index.ts
const TRIAL_DAYS = 3;
const GRANDFATHER_CUTOFF_ISO = "2026-04-22T00:00:00Z";
const MS_PER_DAY = 24 * 60 * 60 * 1000;

// New trial emails use the canonical admin@mercyblade.com sender
// (per Chau's sending-address rule; existing welcome/expiry templates
// remain on the legacy resend.dev sandbox address pending a separate
// migration).
const TRIAL_EMAIL_FROM = "Mercy Blade <admin@mercyblade.com>";

function getTrialEndingSoonHtml(): string {
  return `<!DOCTYPE html>
<html>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #1f2937; line-height: 1.6;">
    <p>Chào bạn,</p>
    <p>Bản dùng thử 3 ngày miễn phí tại Mercy Blade của bạn sẽ kết thúc trong vòng 24 giờ tới.</p>
    <p>Bạn đã bắt đầu hành trình học tiếng Anh cùng Teacher Mercy. Để tiếp tục truy cập toàn bộ phòng học, Speak và Grammar, hãy nâng cấp gói ngay hôm nay.</p>
    <p style="margin: 24px 0;">
      <a href="https://mercyblade.com/pricing" style="display: inline-block; background: #f59e0b; color: #fff; padding: 12px 22px; border-radius: 9999px; text-decoration: none; font-weight: 600;">Xem gói</a>
    </p>
    <p>Nếu cần hỗ trợ, bạn chỉ cần trả lời email này.</p>
    <p style="margin-top: 32px;">Chau<br/>Mercy Blade</p>
  </body>
</html>`;
}

function getTrialExpiredHtml(): string {
  return `<!DOCTYPE html>
<html>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #1f2937; line-height: 1.6;">
    <p>Chào bạn,</p>
    <p>Bản dùng thử 3 ngày của bạn tại Mercy Blade đã kết thúc. Tài khoản vẫn còn đó — chỉ cần nâng cấp để mở lại phòng học.</p>
    <p style="margin: 24px 0;">
      <a href="https://mercyblade.com/pricing" style="display: inline-block; background: #f59e0b; color: #fff; padding: 12px 22px; border-radius: 9999px; text-decoration: none; font-weight: 600;">Xem gói</a>
    </p>
    <p>Nếu bạn thấy Mercy Blade chưa phù hợp, không cần làm gì cả — tài khoản sẽ được giữ nguyên.</p>
    <p style="margin-top: 32px;">Chau<br/>Mercy Blade</p>
  </body>
</html>`;
}

// Helper to always return HTTP 200 with JSON
function send(data: Record<string, unknown>) {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: corsHeaders,
  });
}

// Welcome email HTML template
function getWelcomeEmailHtml(tierName: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
  <div style="background-color: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <h1 style="color: #1a1a1a; margin-bottom: 24px;">🎉 Welcome to ${tierName}!</h1>
    
    <p style="color: #333; font-size: 16px; line-height: 1.6;">
      Thank you for upgrading to <strong>${tierName}</strong> on Mercy Blade!
    </p>
    
    <p style="color: #333; font-size: 16px; line-height: 1.6;">
      You now have access to exclusive content and features. Here's what you can explore:
    </p>
    
    <ul style="color: #555; font-size: 15px; line-height: 1.8;">
      <li>Premium healing rooms and guided sessions</li>
      <li>Advanced learning content</li>
      <li>Priority support</li>
      <li>Exclusive community features</li>
    </ul>
    
    <div style="margin: 32px 0;">
      <a href="https://mercyblade.link" 
         style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600;">
        Start Exploring →
      </a>
    </div>
    
    <p style="color: #666; font-size: 14px; margin-top: 32px;">
      If you have any questions, feel level0 to reach out to our support team.
    </p>
    
    <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">
    
    <p style="color: #999; font-size: 12px;">
      Mercy Blade – Your journey to wellness starts here.
    </p>
  </div>
</body>
</html>
  `;
}

// Expiry warning email HTML template
function getExpiryWarningHtml(tierName: string, expiryDate: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
  <div style="background-color: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <h1 style="color: #1a1a1a; margin-bottom: 24px;">⏰ Your ${tierName} Subscription Expires Soon</h1>
    
    <p style="color: #333; font-size: 16px; line-height: 1.6;">
      Your <strong>${tierName}</strong> subscription will expire on <strong>${expiryDate}</strong>.
    </p>
    
    <p style="color: #333; font-size: 16px; line-height: 1.6;">
      Don't lose access to your premium content! Renew now to continue enjoying:
    </p>
    
    <ul style="color: #555; font-size: 15px; line-height: 1.8;">
      <li>All your favorite healing rooms</li>
      <li>Premium learning materials</li>
      <li>Your saved progress and notes</li>
      <li>Priority support access</li>
    </ul>
    
    <div style="margin: 32px 0;">
      <a href="https://mercyblade.link/subscribe" 
         style="display: inline-block; background-color: #dc2626; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600;">
        Renew Now →
      </a>
    </div>
    
    <p style="color: #666; font-size: 14px; margin-top: 32px;">
      Need help? Contact our support team anytime.
    </p>
    
    <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">
    
    <p style="color: #999; font-size: 12px;">
      Mercy Blade – Your journey to wellness continues.
    </p>
  </div>
</body>
</html>
  `;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse optional body for action (supports "run_daily" from cron)
    let action = "run_daily";
    try {
      const body = await req.json();
      if (body?.action) {
        action = body.action;
      }
    } catch {
      // No body or invalid JSON is fine, default to run_daily
    }

    console.log(`[email-automations] Starting with action: ${action}`);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      return send({ ok: false, error: "RESEND_API_KEY not configured" });
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceKey);
    const resend = new Resend(resendApiKey);

    let welcomeEmailsSent = 0;
    let expiryWarningsSent = 0;
    const errors: string[] = [];

    // --- 1. WELCOME EMAILS ---
    // Find active Level 2/Level 3 subscribers who haven't received welcome email
    console.log("[email-automations] Processing welcome emails...");

    // Get Level 2 and Level 3 tier IDs
    const { data: vipTiers, error: tiersError } = await adminClient
      .from("subscription_tiers")
      .select("id, name")
      .in("name", ["Level 2", "Level 3"]);

    if (tiersError) {
      console.error("Tiers query error:", tiersError);
      errors.push(`Tiers query failed: ${tiersError.message}`);
    }

    const tierMap = new Map(vipTiers?.map(t => [t.id, t.name]) || []);
    const vipTierIds = Array.from(tierMap.keys());

    if (vipTierIds.length > 0) {
      // Get active subscriptions for Level 2/Level 3
      const { data: activeSubs, error: subsError } = await adminClient
        .from("user_subscriptions")
        .select("user_id, tier_id")
        .in("tier_id", vipTierIds)
        .eq("status", "active");

      if (subsError) {
        console.error("Subscriptions query error:", subsError);
        errors.push(`Subscriptions query failed: ${subsError.message}`);
      }

      if (activeSubs && activeSubs.length > 0) {
        // For each subscription, check if welcome email was already sent
        for (const sub of activeSubs) {
          const tierName = tierMap.get(sub.tier_id) || "Premium";

          // Check if welcome email already sent for this user+tier
          const { data: existingEvent } = await adminClient
            .from("email_events")
            .select("id")
            .eq("user_id", sub.user_id)
            .eq("type", "welcome_vip")
            .eq("tier", tierName)
            .limit(1);

          if (existingEvent && existingEvent.length > 0) {
            continue; // Already sent
          }

          // Get user email from profiles
          const { data: profile } = await adminClient
            .from("profiles")
            .select("email")
            .eq("id", sub.user_id)
            .single();

          if (!profile?.email) {
            console.log(`No email found for user ${sub.user_id}`);
            continue;
          }

          // Send welcome email
          try {
            const { data: emailData, error: sendError } = await resend.emails.send({
              from: EMAIL_CONFIG.from,
              to: [profile.email],
              bcc: [EMAIL_CONFIG.bcc],
              subject: `Welcome to ${tierName} - Mercy Blade`,
              html: getWelcomeEmailHtml(tierName),
            });

            if (sendError) {
              console.error(`Failed to send welcome email to ${profile.email}:`, sendError);
              await adminClient.from("email_events").insert({
                user_id: sub.user_id,
                email: profile.email,
                type: "welcome_vip",
                tier: tierName,
                status: "failed",
                error_message: sendError.message,
              });
            } else {
              welcomeEmailsSent++;
              await adminClient.from("email_events").insert({
                user_id: sub.user_id,
                email: profile.email,
                type: "welcome_vip",
                tier: tierName,
                status: "sent",
              });
              console.log(`Welcome email sent to ${profile.email} for ${tierName}`);
            }
          } catch (err) {
            console.error(`Exception sending welcome email:`, err);
          }
        }
      }
    }

    // --- 2. EXPIRY WARNING EMAILS ---
    // Find subscriptions expiring in exactly 7 days
    console.log("[email-automations] Processing expiry warnings...");

    const today = new Date();
    const sevenDaysLater = new Date(today);
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
    
    // Format for date comparison (start and end of that day)
    const targetDateStart = sevenDaysLater.toISOString().split("T")[0] + "T00:00:00.000Z";
    const targetDateEnd = sevenDaysLater.toISOString().split("T")[0] + "T23:59:59.999Z";

    const { data: expiringSubs, error: expiringError } = await adminClient
      .from("user_subscriptions")
      .select("user_id, tier_id, current_period_end")
      .eq("status", "active")
      .gte("current_period_end", targetDateStart)
      .lte("current_period_end", targetDateEnd);

    if (expiringError) {
      console.error("Expiring subs query error:", expiringError);
      errors.push(`Expiring subscriptions query failed: ${expiringError.message}`);
    }

    if (expiringSubs && expiringSubs.length > 0) {
      // Get all tier names
      const allTierIds = [...new Set(expiringSubs.map(s => s.tier_id))];
      const { data: allTiers } = await adminClient
        .from("subscription_tiers")
        .select("id, name")
        .in("id", allTierIds);
      
      const allTierMap = new Map(allTiers?.map(t => [t.id, t.name]) || []);

      for (const sub of expiringSubs) {
        // Check if warning already sent
        const { data: existingWarning } = await adminClient
          .from("email_events")
          .select("id")
          .eq("user_id", sub.user_id)
          .eq("type", "vip_expiry_warning")
          .gte("created_at", today.toISOString().split("T")[0]) // Today
          .limit(1);

        if (existingWarning && existingWarning.length > 0) {
          continue; // Already sent today
        }

        // Get user email
        const { data: profile } = await adminClient
          .from("profiles")
          .select("email")
          .eq("id", sub.user_id)
          .single();

        if (!profile?.email) {
          continue;
        }

        const tierName = allTierMap.get(sub.tier_id) || "Premium";
        const expiryDate = new Date(sub.current_period_end).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        try {
          const { data: emailData, error: sendError } = await resend.emails.send({
            from: EMAIL_CONFIG.from,
            to: [profile.email],
            bcc: [EMAIL_CONFIG.bcc],
            subject: `Your ${tierName} subscription expires in 7 days`,
            html: getExpiryWarningHtml(tierName, expiryDate),
          });

          if (sendError) {
            console.error(`Failed to send expiry warning to ${profile.email}:`, sendError);
            await adminClient.from("email_events").insert({
              user_id: sub.user_id,
              email: profile.email,
              type: "vip_expiry_warning",
              tier: tierName,
              status: "failed",
              error_message: sendError.message,
            });
          } else {
            expiryWarningsSent++;
            await adminClient.from("email_events").insert({
              user_id: sub.user_id,
              email: profile.email,
              type: "vip_expiry_warning",
              tier: tierName,
              status: "sent",
            });
            console.log(`Expiry warning sent to ${profile.email} for ${tierName}`);
          }
        } catch (err) {
          console.error(`Exception sending expiry warning:`, err);
        }
      }
    }

    // --- 3. TRIAL NUDGE EMAILS (Vietnamese) ---
    // Free-tier users whose 3-day trial ends in the next 24 hours
    // (trial_ending_soon) or ended within the last 24 hours (trial_expired).
    // Grandfathered users are excluded by the created_at >= cutoff filter.
    // Premium users (any active subscription) are excluded explicitly.
    console.log("[email-automations] Processing trial nudges...");

    let trialEndingSoonSent = 0;
    let trialExpiredSent = 0;

    try {
      const nowMs = Date.now();
      const cutoffMs = new Date(GRANDFATHER_CUTOFF_ISO).getTime();

      // Window bounds for created_at:
      //   trial ends in [now, now+24h]  →  created_at in [now-3d, now+1d-3d]
      //   trial ended in [now-24h, now] →  created_at in [now-3d-1d, now-3d]
      // Pre-filter candidates to a single superset window for one DB call:
      //   created_at in [now - 4 days, now - 2 days] AND >= cutoff.
      const superMinMs = nowMs - (TRIAL_DAYS + 1) * MS_PER_DAY;
      const superMaxMs = nowMs - (TRIAL_DAYS - 1) * MS_PER_DAY;
      const lowerBoundMs = Math.max(superMinMs, cutoffMs);

      if (lowerBoundMs <= superMaxMs) {
        // Authoritative dedup gate: profiles.trial_expiry_notified_at.
        // The email_events check below is kept as defence-in-depth,
        // but the profiles-column filter is what stops a user from
        // ever receiving more than one trial-expiry email across runs.
        // A previous bug shipped 10+ emails to the same trial users
        // because the email_events dedup was bypassed under concurrent
        // cron invocations (no atomic claim). Filtering at the SQL
        // layer removes the candidate from the pool before any send
        // call — much harder to race.
        const { data: candidates, error: candidatesError } = await adminClient
          .from("profiles")
          .select("id, email, created_at, trial_expiry_notified_at")
          .gte("created_at", new Date(lowerBoundMs).toISOString())
          .lte("created_at", new Date(superMaxMs).toISOString())
          .is("trial_expiry_notified_at", null);

        if (candidatesError) {
          errors.push(`Trial-candidates query failed: ${candidatesError.message}`);
        } else if (candidates && candidates.length > 0) {
          // Exclude premium users (any active subscription)
          const candidateIds = candidates.map((p) => p.id);
          const { data: activeSubs } = await adminClient
            .from("user_subscriptions")
            .select("user_id")
            .in("user_id", candidateIds)
            .eq("status", "active");
          const premiumIds = new Set(
            (activeSubs ?? []).map((s: { user_id: string }) => s.user_id),
          );

          const endingSoon: Array<{ id: string; email: string }> = [];
          const justExpired: Array<{ id: string; email: string }> = [];

          for (const p of candidates) {
            if (!p.email || premiumIds.has(p.id)) continue;
            const createdAtMs = new Date(p.created_at).getTime();
            if (!Number.isFinite(createdAtMs)) continue;
            const trialEndMs = createdAtMs + TRIAL_DAYS * MS_PER_DAY;
            const delta = trialEndMs - nowMs;
            if (delta > 0 && delta <= MS_PER_DAY) {
              endingSoon.push({ id: p.id, email: p.email });
            } else if (delta <= 0 && delta >= -MS_PER_DAY) {
              justExpired.push({ id: p.id, email: p.email });
            }
          }

          const sendTrialEmail = async (
            targets: Array<{ id: string; email: string }>,
            type: string,
            subject: string,
            html: string,
          ): Promise<number> => {
            let sent = 0;
            for (const t of targets) {
              const { data: existing } = await adminClient
                .from("email_events")
                .select("id")
                .eq("user_id", t.id)
                .eq("type", type)
                .limit(1);
              if (existing && existing.length > 0) continue;

              try {
                const { error: sendError } = await resend.emails.send({
                  from: TRIAL_EMAIL_FROM,
                  to: [t.email],
                  bcc: [EMAIL_CONFIG.bcc],
                  subject,
                  html,
                });
                if (sendError) {
                  await adminClient.from("email_events").insert({
                    user_id: t.id,
                    email: t.email,
                    type,
                    status: "failed",
                    error_message: sendError.message,
                  });
                } else {
                  sent++;
                  await adminClient.from("email_events").insert({
                    user_id: t.id,
                    email: t.email,
                    type,
                    status: "sent",
                  });
                  // Mark the profile as notified. Single column gates BOTH
                  // trial_ending_soon and trial_expired — a user receives
                  // at most one trial-expiry email, ever. This is stricter
                  // than the old "one per type" behaviour but is the right
                  // bias for now: the user-facing bug was email spam, and
                  // the marketing value of sending BOTH D-1 and D+1 to the
                  // same user is small compared to the trust damage of
                  // duplicate sends. If the D-1/D+1 split is needed later,
                  // promote this to two columns.
                  const { error: markErr } = await adminClient
                    .from("profiles")
                    .update({ trial_expiry_notified_at: new Date().toISOString() })
                    .eq("id", t.id);
                  if (markErr) {
                    console.error(
                      "[email-automations] failed to mark trial_expiry_notified_at",
                      { user_id: t.id, type, error: markErr.message },
                    );
                  }
                }
              } catch (err) {
                console.error(`Exception sending ${type}:`, err);
              }
            }
            return sent;
          };

          trialEndingSoonSent = await sendTrialEmail(
            endingSoon,
            "trial_ending_soon",
            "24 giờ cuối của bản dùng thử miễn phí – Mercy Blade",
            getTrialEndingSoonHtml(),
          );
          trialExpiredSent = await sendTrialEmail(
            justExpired,
            "trial_expired",
            "Bản dùng thử đã kết thúc – nâng cấp để tiếp tục",
            getTrialExpiredHtml(),
          );
        }
      }
    } catch (err) {
      console.error("[email-automations] Trial nudge block crashed:", err);
      errors.push(`Trial nudges failed: ${err instanceof Error ? err.message : "unknown"}`);
    }

    console.log(`[email-automations] Complete: ${welcomeEmailsSent} welcome, ${expiryWarningsSent} expiry warnings, ${trialEndingSoonSent} trial-ending-soon, ${trialExpiredSent} trial-expired`);

    return send({
      ok: true,
      welcome_emails_sent: welcomeEmailsSent,
      expiry_warnings_sent: expiryWarningsSent,
      trial_ending_soon_sent: trialEndingSoonSent,
      trial_expired_sent: trialExpiredSent,
      errors: errors.length > 0 ? errors : undefined,
    });

  } catch (err) {
    console.error("[email-automations] Unexpected error:", err);
    return send({ ok: false, error: err instanceof Error ? err.message : "Internal server error" });
  }
});
