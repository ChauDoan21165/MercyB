import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

/**
 * Bank Transfer Orders Edge Function
 * Handles: create, list-mine, attach-screenshot
 * Always returns HTTP 200 with { ok, error?, data? }
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

function send(data: object) {
  return new Response(JSON.stringify(data), {
    headers: corsHeaders,
    status: 200,
  });
}

// Generate unique transfer note: MB-{tierCode}-{userIdLast4}-{shortRandom}
function generateTransferNote(tier: string, userId: string): string {
  const tierCode = tier.replace(/[^A-Z0-9]/gi, '').substring(0, 4).toUpperCase();
  const userLast4 = userId.replace(/-/g, '').slice(-4).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `MB-${tierCode}-${userLast4}-${random}`;
}

Deno.serve(async (req) => {
  console.log("[bank-transfer-orders] Request:", req.method);

  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // --- AUTH CHECK ---
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.log("[bank-transfer-orders] No auth header");
      return send({ ok: false, error: "Please log in to continue." });
    }

    const token = authHeader.replace("Bearer ", "");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Client for auth validation
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token);
    
    if (authError || !user) {
      console.error("[bank-transfer-orders] Auth failed:", authError?.message);
      return send({ ok: false, error: "Session expired. Please log in again." });
    }

    console.log("[bank-transfer-orders] Authenticated user:", user.id, user.email);

    // Admin client for DB operations
    const admin = createClient(
      supabaseUrl,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // --- PARSE BODY ---
    let body;
    try {
      body = await req.json();
    } catch {
      return send({ ok: false, error: "Invalid request format." });
    }

    const action = body?.action;
    console.log("[bank-transfer-orders] Action:", action, "User:", user.id);

    // ==================== LIST-MINE ====================
    if (action === "list-mine") {
      const { data: orders, error } = await admin
        .from("bank_transfer_orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("[bank-transfer-orders] list-mine error:", error);
        return send({ ok: false, error: "Failed to fetch orders." });
      }

      return send({ ok: true, orders });
    }

    // ==================== CREATE ====================
    if (action === "create") {
      const { tier, amount_vnd } = body;
      
      if (!tier || !amount_vnd) {
        return send({ ok: false, error: "Missing tier or amount." });
      }

      // Check for existing pending order for same tier
      const { data: existing } = await admin
        .from("bank_transfer_orders")
        .select("id")
        .eq("user_id", user.id)
        .eq("tier", tier)
        .eq("status", "pending")
        .maybeSingle();

      if (existing) {
        return send({ ok: false, error: "You already have a pending order for this tier." });
      }

      const transferNote = generateTransferNote(tier, user.id);

      const { data: order, error } = await admin
        .from("bank_transfer_orders")
        .insert({
          user_id: user.id,
          tier,
          amount_vnd,
          transfer_note: transferNote,
          status: "pending",
        })
        .select()
        .single();

      if (error) {
        console.error("[bank-transfer-orders] create error:", error);
        return send({ ok: false, error: "Failed to create order." });
      }

      console.log("[bank-transfer-orders] Created order:", order.id, transferNote);
      return send({ ok: true, order });
    }

    // ==================== ATTACH-SCREENSHOT ====================
    if (action === "attach-screenshot") {
      const { order_id, screenshot_url } = body;
      
      if (!order_id || !screenshot_url) {
        return send({ ok: false, error: "Missing order_id or screenshot_url." });
      }

      // Verify ownership and pending status
      const { data: order } = await admin
        .from("bank_transfer_orders")
        .select("*")
        .eq("id", order_id)
        .eq("user_id", user.id)
        .eq("status", "pending")
        .single();

      if (!order) {
        return send({ ok: false, error: "Order not found or not pending." });
      }

      const { error } = await admin
        .from("bank_transfer_orders")
        .update({ screenshot_url, updated_at: new Date().toISOString() })
        .eq("id", order_id);

      if (error) {
        console.error("[bank-transfer-orders] attach-screenshot error:", error);
        return send({ ok: false, error: "Failed to attach screenshot." });
      }

      console.log("[bank-transfer-orders] Screenshot attached to order:", order_id);
      return send({ ok: true, message: "Screenshot attached successfully." });
    }

    // ==================== ADMIN: LIST-ALL ====================
    if (action === "list-all") {
      // Check admin level
      const { data: adminUser } = await admin
        .from("admin_users")
        .select("level")
        .eq("user_id", user.id)
        .single();

      if (!adminUser || adminUser.level < 9) {
        console.log("[bank-transfer-orders] Non-admin tried list-all:", user.id);
        return send({ ok: false, error: "Not authorized." });
      }

      const statusFilter = body.status || "pending";
      
      let query = admin
        .from("bank_transfer_orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data: orders, error } = await query;

      if (error) {
        console.error("[bank-transfer-orders] list-all error:", error);
        return send({ ok: false, error: "Failed to fetch orders." });
      }

      // Get user emails for each order
      const userIds = [...new Set(orders?.map(o => o.user_id) || [])];
      const usersMap: Record<string, string> = {};
      
      for (const uid of userIds) {
        const { data: userData } = await admin.auth.admin.getUserById(uid);
        if (userData?.user?.email) {
          usersMap[uid] = userData.user.email;
        }
      }

      const ordersWithEmail = orders?.map(o => ({
        ...o,
        user_email: usersMap[o.user_id] || "Unknown"
      }));

      return send({ ok: true, orders: ordersWithEmail });
    }

    // ==================== ADMIN: APPROVE ====================
    if (action === "approve") {
      const { order_id } = body;
      
      // Check admin level
      const { data: adminUser } = await admin
        .from("admin_users")
        .select("id, level")
        .eq("user_id", user.id)
        .single();

      if (!adminUser || adminUser.level < 9) {
        return send({ ok: false, error: "Not authorized." });
      }

      // Get the order
      const { data: order } = await admin
        .from("bank_transfer_orders")
        .select("*")
        .eq("id", order_id)
        .eq("status", "pending")
        .single();

      if (!order) {
        return send({ ok: false, error: "Order not found or already processed." });
      }

      const now = new Date().toISOString();

      // Update order status
      await admin
        .from("bank_transfer_orders")
        .update({
          status: "approved",
          approved_by_admin_id: adminUser.id,
          approved_at: now,
          updated_at: now,
        })
        .eq("id", order_id);

      // Grant VIP access (same pattern as gift codes)
      // Update user_tiers
      await admin.from("user_tiers").upsert({
        user_id: order.user_id,
        tier: order.tier,
        updated_at: now,
      });

      // Update user_subscriptions
      const end = new Date();
      end.setFullYear(end.getFullYear() + 1);

      const { data: tierRow } = await admin
        .from("subscription_tiers")
        .select("id")
        .eq("name", order.tier)
        .single();

      if (tierRow) {
        await admin.from("user_subscriptions").upsert({
          user_id: order.user_id,
          tier_id: tierRow.id,
          status: "active",
          current_period_start: now,
          current_period_end: end.toISOString(),
          updated_at: now,
        });
      }

      // Log admin action
      await admin.from("admin_logs").insert({
        actor_admin_id: adminUser.id,
        action: "approve_bank_transfer",
        metadata: {
          order_id,
          user_id: order.user_id,
          tier: order.tier,
          amount_vnd: order.amount_vnd,
        },
      });

      // Send confirmation email (fire-and-forget)
      try {
        const { data: userData } = await admin.auth.admin.getUserById(order.user_id);
        if (userData?.user?.email) {
          await fetch(
            `${Deno.env.get("SUPABASE_URL")}/functions/v1/send-redeem-email`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
              },
              body: JSON.stringify({
                email: userData.user.email,
                tier: order.tier,
                method: "bank_transfer",
              }),
            }
          );
        }
      } catch (emailErr) {
        console.error("[bank-transfer-orders] Email error:", emailErr);
      }

      console.log("[bank-transfer-orders] Approved order:", order_id);
      return send({ ok: true, message: "Order approved and VIP access granted." });
    }

    // ==================== ADMIN: REJECT ====================
    if (action === "reject") {
      const { order_id, reason } = body;
      
      // Check admin level
      const { data: adminUser } = await admin
        .from("admin_users")
        .select("id, level")
        .eq("user_id", user.id)
        .single();

      if (!adminUser || adminUser.level < 9) {
        return send({ ok: false, error: "Not authorized." });
      }

      const { data: order } = await admin
        .from("bank_transfer_orders")
        .select("*")
        .eq("id", order_id)
        .eq("status", "pending")
        .single();

      if (!order) {
        return send({ ok: false, error: "Order not found or already processed." });
      }

      const now = new Date().toISOString();

      await admin
        .from("bank_transfer_orders")
        .update({
          status: "rejected",
          rejection_reason: reason || "Payment could not be verified.",
          approved_by_admin_id: adminUser.id,
          approved_at: now,
          updated_at: now,
        })
        .eq("id", order_id);

      // Log admin action
      await admin.from("admin_logs").insert({
        actor_admin_id: adminUser.id,
        action: "reject_bank_transfer",
        metadata: {
          order_id,
          user_id: order.user_id,
          tier: order.tier,
          reason,
        },
      });

      console.log("[bank-transfer-orders] Rejected order:", order_id, reason);
      return send({ ok: true, message: "Order rejected." });
    }

    return send({ ok: false, error: `Unknown action: ${action}` });

  } catch (err: unknown) {
    console.error("[bank-transfer-orders] Unexpected error:", err);
    return send({ ok: false, error: "Server error. Please try again." });
  }
});
