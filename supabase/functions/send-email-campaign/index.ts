import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function resendSend(resendKey: string, payload: any) {
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!r.ok) {
    const txt = await r.text().catch(() => "");
    throw new Error(`Resend failed: ${r.status} ${txt}`.slice(0, 300));
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Service client (DB writes + reads)
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // 1) Verify caller JWT
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace("Bearer ", "").trim();
    if (!token) return json(401, { error: "Unauthorized" });

    const { data: userRes, error: userErr } = await admin.auth.getUser(token);
    if (userErr || !userRes?.user) return json(401, { error: "Unauthorized" });

    const user = userRes.user;

    // 2) Verify admin role
    const { data: isAdmin, error: roleErr } = await admin.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });
    if (roleErr) return json(500, { error: "Role check failed" });
    if (!isAdmin) return json(403, { error: "Admin required" });

    const { campaignId } = await req.json();

    // 3) Load campaign
    const { data: campaign, error: campError } = await admin
      .from("email_campaigns")
      .select("*")
      .eq("id", campaignId)
      .single();

    if (campError || !campaign) return json(404, { error: "Campaign not found" });

    // Prevent double-send
    if (campaign.status === "sending" || campaign.status === "sent") {
      return json(400, { error: `Campaign already ${campaign.status}` });
    }

    // 4) Compute recipients (same logic, but safer)
    let recipients: { id: string; email: string }[] = [];

    if (campaign.audience_type === "vip") {
      const { data: vipUsers } = await admin
        .from("user_subscriptions")
        .select("user_id")
        .eq("status", "active");

      const vipIds = (vipUsers || []).map((u: any) => u.user_id);
      if (vipIds.length === 0) recipients = [];
      else {
        const { data } = await admin.from("profiles").select("id,email").in("id", vipIds);
        recipients = (data || []).filter((r: any) => !!r.email);
      }
    } else if (campaign.audience_type === "free") {
      const { data: paidUsers } = await admin
        .from("user_subscriptions")
        .select("user_id")
        .eq("status", "active");
      const paidIds = (paidUsers || []).map((u: any) => u.user_id);

      // If none paid → everyone is free
      if (paidIds.length === 0) {
        const { data } = await admin.from("profiles").select("id,email");
        recipients = (data || []).filter((r: any) => !!r.email);
      } else {
        // Safer approach: get all and filter in JS (avoids SQL injection/string building)
        const { data } = await admin.from("profiles").select("id,email");
        recipients = (data || []).filter((r: any) => !!r.email && !paidIds.includes(r.id));
      }
    } else if (campaign.audience_type === "inactive") {
      // Optional: define “inactive” properly later; placeholder = all users
      const { data } = await admin.from("profiles").select("id,email");
      recipients = (data || []).filter((r: any) => !!r.email);
    } else {
      const { data } = await admin.from("profiles").select("id,email");
      recipients = (data || []).filter((r: any) => !!r.email);
    }

    await admin.from("email_campaigns").update({
      total_recipients: recipients.length,
      status: "sending",
      started_at: new Date().toISOString(),
      started_by: user.id,
    }).eq("id", campaignId);

    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) throw new Error("Resend not configured");

    // 5) Send with basic batching (safer than one-by-one loop in huge lists)
    let sentCount = 0;
    const BATCH = 25;

    for (let i = 0; i < recipients.length; i += BATCH) {
      const batch = recipients.slice(i, i + BATCH);

      await Promise.all(batch.map(async (r) => {
        try {
          await resendSend(resendKey, {
            from: "Mercy Blade <hello@mercyblade.app>",
            to: r.email,
            subject: campaign.subject,
            html: campaign.body_html,
          });

          await admin.from("email_events").insert({
            campaign_id: campaignId,
            user_id: r.id,
            email: r.email,
            type: "campaign",
            status: "sent",
          });

          sentCount++;
        } catch (e: any) {
          await admin.from("email_events").insert({
            campaign_id: campaignId,
            user_id: r.id,
            email: r.email,
            type: "campaign",
            status: "failed",
            error_message: (e?.message || "send failed").slice(0, 300),
          });
        }
      }));
    }

    await admin.from("email_campaigns").update({
      sent_count: sentCount,
      sent_at: new Date().toISOString(),
      status: "sent",
    }).eq("id", campaignId);

    return json(200, { sent: sentCount, total: recipients.length });
  } catch (error: any) {
    console.error("Error:", error);
    return json(500, { error: error?.message || "Unknown error" });
  }
});
