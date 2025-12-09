/**
 * Email Broadcast Edge Function
 * Allows admins (level >= 9) to send batch emails to users by tier or manual list.
 * 
 * Actions:
 * - preview: Returns recipient count and sample emails without sending
 * - send: Creates campaign, sends emails via Resend, logs events
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

// Helper to always return HTTP 200 with JSON
function send(data: Record<string, unknown>) {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: corsHeaders,
  });
}

interface BroadcastRequest {
  action: "preview" | "send";
  subject: string;
  body_html: string;
  audience_type: "vip2" | "vip3" | "all_vip" | "manual";
  manual_emails?: string[];
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // --- Auth: Manual JWT validation ---
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return send({ ok: false, error: "Missing or invalid Authorization header" });
    }
    const token = authHeader.replace("Bearer ", "");

    // Create anon client to validate user
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const anonClient = createClient(supabaseUrl, supabaseAnonKey);
    const { data: userData, error: userError } = await anonClient.auth.getUser(token);
    
    if (userError || !userData?.user) {
      console.error("Auth error:", userError);
      return send({ ok: false, error: "Invalid or expired session" });
    }

    const userId = userData.user.id;
    const userEmail = userData.user.email;
    console.log(`[email-broadcast] User authenticated: ${userEmail}`);

    // Create service client for DB operations
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // --- Check admin level ---
    const { data: adminData, error: adminError } = await adminClient
      .from("admin_users")
      .select("level")
      .eq("user_id", userId)
      .single();

    if (adminError || !adminData || adminData.level < 9) {
      console.error("Admin check failed:", adminError, adminData);
      return send({ ok: false, error: "Insufficient permissions. Admin level 9+ required." });
    }

    console.log(`[email-broadcast] Admin level verified: ${adminData.level}`);

    // --- Parse request ---
    const body: BroadcastRequest = await req.json();
    const { action, subject, body_html, audience_type, manual_emails } = body;

    if (!action || !subject || !body_html || !audience_type) {
      return send({ ok: false, error: "Missing required fields: action, subject, body_html, audience_type" });
    }

    // --- Get target emails based on audience ---
    let targetEmails: string[] = [];

    if (audience_type === "manual") {
      // Use provided emails
      if (!manual_emails || manual_emails.length === 0) {
        return send({ ok: false, error: "Manual emails list is required for audience_type='manual'" });
      }
      targetEmails = manual_emails.filter(e => e && e.includes("@"));
    } else {
      // Query subscription tiers to get tier IDs
      const tierNames: string[] = [];
      if (audience_type === "vip2") tierNames.push("VIP2");
      else if (audience_type === "vip3") tierNames.push("VIP3");
      else if (audience_type === "all_vip") {
        // Include all VIP tiers
        tierNames.push("VIP1", "VIP2", "VIP3", "VIP4", "VIP5", "VIP6", "VIP7", "VIP8", "VIP9");
      }

      // Get tier IDs
      const { data: tiers, error: tiersError } = await adminClient
        .from("subscription_tiers")
        .select("id, name")
        .in("name", tierNames);

      if (tiersError) {
        console.error("Tiers query error:", tiersError);
        return send({ ok: false, error: "Failed to query tiers" });
      }

      const tierIds = tiers?.map(t => t.id) || [];

      if (tierIds.length === 0) {
        return send({ ok: false, error: "No matching tiers found" });
      }

      // Get active subscriptions for these tiers
      const { data: subs, error: subsError } = await adminClient
        .from("user_subscriptions")
        .select("user_id")
        .in("tier_id", tierIds)
        .eq("status", "active");

      if (subsError) {
        console.error("Subscriptions query error:", subsError);
        return send({ ok: false, error: "Failed to query subscriptions" });
      }

      const userIds = subs?.map(s => s.user_id) || [];

      if (userIds.length === 0) {
        return send({ ok: true, total_recipients: 0, sample: [], message: "No active subscribers found for this audience" });
      }

      // Get user emails from profiles table
      const { data: profiles, error: profilesError } = await adminClient
        .from("profiles")
        .select("id, email")
        .in("id", userIds);

      if (profilesError) {
        console.error("Profiles query error:", profilesError);
        return send({ ok: false, error: "Failed to query user profiles" });
      }

      targetEmails = profiles?.filter(p => p.email).map(p => p.email!) || [];
    }

    // Deduplicate emails
    targetEmails = [...new Set(targetEmails)];

    console.log(`[email-broadcast] Target audience: ${audience_type}, Recipients: ${targetEmails.length}`);

    // --- Preview action ---
    if (action === "preview") {
      return send({
        ok: true,
        total_recipients: targetEmails.length,
        sample: targetEmails.slice(0, 5),
      });
    }

    // --- Send action ---
    if (targetEmails.length === 0) {
      return send({ ok: false, error: "No recipients to send to" });
    }

    // Create campaign record
    const { data: campaign, error: campaignError } = await adminClient
      .from("email_campaigns")
      .insert({
        created_by: userId,
        subject,
        body_html,
        audience_type,
        manual_emails: audience_type === "manual" ? manual_emails : null,
        status: "sending",
        total_recipients: targetEmails.length,
      })
      .select()
      .single();

    if (campaignError || !campaign) {
      console.error("Campaign creation error:", campaignError);
      return send({ ok: false, error: "Failed to create campaign record" });
    }

    console.log(`[email-broadcast] Campaign created: ${campaign.id}`);

    // Initialize Resend
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      await adminClient
        .from("email_campaigns")
        .update({ status: "failed", error_message: "RESEND_API_KEY not configured" })
        .eq("id", campaign.id);
      return send({ ok: false, error: "Email service not configured" });
    }

    const resend = new Resend(resendApiKey);

    // Send emails one by one (simple approach)
    let sentCount = 0;
    let lastError: string | null = null;

    console.log("[email-broadcast] Sending", {
      subject,
      audience_type,
      recipients: targetEmails.length,
    });

    for (const email of targetEmails) {
      try {
        const { data: emailData, error: sendError } = await resend.emails.send({
          from: EMAIL_CONFIG.from,
          to: [email],
          bcc: [EMAIL_CONFIG.bcc],
          subject: subject,
          html: body_html,
        });

        if (sendError) {
          console.error("[email-broadcast] Resend error", { email, error: sendError });
          lastError = sendError.message || "Resend error";

          // Log failed event
          await adminClient.from("email_events").insert({
            campaign_id: campaign.id,
            email,
            type: "campaign_send",
            status: "failed",
            error_message: sendError.message,
          });
        } else {
          sentCount++;
          console.log("[email-broadcast] Resend success", { email, id: emailData?.id });

          // Log success event
          await adminClient.from("email_events").insert({
            campaign_id: campaign.id,
            email,
            type: "campaign_send",
            status: "sent",
          });
        }
      } catch (err) {
        console.error("[email-broadcast] Exception sending", { email, error: err });
        lastError = err instanceof Error ? err.message : "Unknown error";

        await adminClient.from("email_events").insert({
          campaign_id: campaign.id,
          email,
          type: "campaign_send",
          status: "failed",
          error_message: lastError,
        });
      }
    }

    // Update campaign with final status
    const finalStatus = sentCount === targetEmails.length ? "sent" : (sentCount > 0 ? "sent" : "failed");
    
    await adminClient
      .from("email_campaigns")
      .update({
        status: finalStatus,
        sent_at: new Date().toISOString(),
        sent_count: sentCount,
        error_message: sentCount < targetEmails.length ? lastError : null,
      })
      .eq("id", campaign.id);

    console.log(`[email-broadcast] Campaign ${campaign.id} completed: ${sentCount}/${targetEmails.length} sent`);

    return send({
      ok: true,
      campaign_id: campaign.id,
      total_recipients: targetEmails.length,
      sent_count: sentCount,
    });

  } catch (err) {
    console.error("[email-broadcast] Unexpected error:", err);
    return send({ ok: false, error: err instanceof Error ? err.message : "Internal server error" });
  }
});
