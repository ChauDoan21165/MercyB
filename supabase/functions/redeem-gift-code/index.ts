import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

// Always return HTTP 200 so Supabase SDK never throws
function send(data: object) {
  return new Response(JSON.stringify(data), {
    headers: corsHeaders,
    status: 200,
  });
}

Deno.serve(async (req) => {
  console.log("[redeem-gift-code] Request received:", req.method);
  
  // CORS preflight
  if (req.method === "OPTIONS") {
    console.log("[redeem-gift-code] CORS preflight, returning 200");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // --- AUTH CHECK ---
    const authHeader = req.headers.get("Authorization");
    console.log("[redeem-gift-code] Auth header present:", !!authHeader);
    console.log("[redeem-gift-code] Auth header preview:", authHeader?.slice(0, 50));
    
    if (!authHeader) {
      return send({ ok: false, error: "Please log in to redeem a gift code." });
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.replace("Bearer ", "");
    
    // Create client with service role to validate the user token
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    
    console.log("[redeem-gift-code] SUPABASE_URL:", supabaseUrl);
    console.log("[redeem-gift-code] Token length:", token.length);

    // Create user-level client with the token
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Get user from the provided token
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    console.log("[redeem-gift-code] getUser result - user:", user?.id, user?.email);
    console.log("[redeem-gift-code] getUser error:", authError?.message, authError?.status);
    
    if (authError || !user) {
      console.error("[redeem-gift-code] Auth failed:", authError);
      return send({ ok: false, error: "Session expired. Please log in again." });
    }

    // Admin client (bypass RLS)
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // --- READ BODY ---
    let body;
    try {
      body = await req.json();
    } catch {
      return send({ ok: false, error: "Invalid request format." });
    }

    const code = body?.code?.trim()?.toUpperCase();
    if (!code) return send({ ok: false, error: "Gift code is required." });

    // --- LOOKUP CODE ---
    const { data: gift, error: lookupError } = await admin
      .from("gift_codes")
      .select("*")
      .eq("code", code)
      .eq("is_active", true)
      .is("used_at", null)
      .single();

    if (lookupError || !gift) {
      return send({ ok: false, error: "Gift code not found or already used." });
    }

    // EXPIRED?
    if (gift.code_expires_at && new Date(gift.code_expires_at) < new Date()) {
      return send({ ok: false, error: "This gift code has expired." });
    }

    // ALREADY REDEEMED SAME TIER?
    const { data: alreadyUsed } = await admin
      .from("gift_codes")
      .select("id")
      .eq("used_by", user.id)
      .eq("tier", gift.tier)
      .maybeSingle();

    if (alreadyUsed) {
      return send({ ok: false, error: `You have already redeemed a ${gift.tier} code.` });
    }

    const now = new Date().toISOString();

    // --- UPDATE USER TIERS ---
    await admin.from("user_tiers").upsert({
      user_id: user.id,
      tier: gift.tier,
      updated_at: now,
    });

    // --- UPDATE SUBSCRIPTIONS ---
    const end = new Date();
    end.setFullYear(end.getFullYear() + 1);

    const { data: tierRow, error: tierLookupError } = await admin
      .from("subscription_tiers")
      .select("id")
      .eq("name", gift.tier)
      .single();

    console.log("[redeem-gift-code] Tier lookup:", gift.tier, "->", tierRow?.id, "error:", tierLookupError?.message);

    if (!tierRow) {
      console.error("[redeem-gift-code] Tier not found in subscription_tiers:", gift.tier);
      return send({ ok: false, error: `Tier ${gift.tier} is not configured. Please contact support.` });
    }

    // Delete existing subscription first, then insert new one (to avoid upsert key issues)
    await admin
      .from("user_subscriptions")
      .delete()
      .eq("user_id", user.id);

    const { error: subError } = await admin.from("user_subscriptions").insert({
      user_id: user.id,
      tier_id: tierRow.id,
      status: "active",
      current_period_start: now,
      current_period_end: end.toISOString(),
      updated_at: now,
    });

    if (subError) {
      console.error("[redeem-gift-code] Subscription insert error:", subError);
    } else {
      console.log("[redeem-gift-code] Subscription created for tier:", gift.tier, tierRow.id);
    }

    // --- MARK CODE AS USED ---
    await admin
      .from("gift_codes")
      .update({
        used_by: user.id,
        used_by_email: user.email,
        used_at: now,
        is_active: false,
        updated_at: now,
      })
      .eq("id", gift.id);

    // --- LOG TO AUDIT ---
    try {
      await admin.from("audit_logs").insert({
        admin_id: user.id,
        action: "gift_code_redeemed",
        target_id: gift.id,
        target_type: "gift_code",
        metadata: {
          code: code,
          tier: gift.tier,
          user_email: user.email,
        },
      });
      console.log("[redeem-gift-code] Audit log created");
    } catch (auditErr) {
      console.error("[redeem-gift-code] Audit log failed (non-blocking):", auditErr);
    }

    // --- SEND CONFIRMATION EMAIL (fire-and-forget, never fails redemption) ---
    try {
      const emailPayload = {
        email: user.email,
        tier: gift.tier,
      };
      console.log("[redeem-gift-code] Sending confirmation email:", emailPayload);
      
      const emailResponse = await fetch(
        `${Deno.env.get("SUPABASE_URL")}/functions/v1/send-redeem-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
          },
          body: JSON.stringify(emailPayload),
        }
      );
      const emailResult = await emailResponse.json();
      if (emailResult.ok) {
        console.log("[redeem-gift-code] Email sent successfully:", emailResult.emailId);
      } else {
        console.error("[redeem-gift-code] Email failed:", emailResult.error);
      }
    } catch (emailErr) {
      console.error("[redeem-gift-code] Email error (non-blocking):", emailErr);
    }

    // SUCCESS RESPONSE
    return send({
      ok: true,
      tier: gift.tier,
      message: `Welcome to ${gift.tier}! Your access is now active.`,
    });

  } catch (err) {
    console.error("Redeem error:", err);
    return send({ ok: false, error: "Unexpected server error. Try again later." });
  }
});
