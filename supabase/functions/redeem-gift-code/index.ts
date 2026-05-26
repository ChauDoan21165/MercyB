// supabase/functions/redeem-gift-code/index.ts
//
// Deno entrypoint. Wires the production Supabase client + Sentry into
// the pure handler in core.ts. Unit tests live in __tests__/core.test.ts
// and use injected Deps so they don't need Deno or Postgres.
//
// verify_jwt = false (supabase/config.toml) — auth is checked manually
// in getUserFromAuthHeader. Do not remove the manual check.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { captureEdgeError } from "../_shared/sentry.ts";
import {
  type AuthedUser,
  type Deps,
  handleRequest,
  type RedeemOutcome,
} from "./core.ts";

const admin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
);

const deps: Deps = {
  async getUserFromAuthHeader(authHeader): Promise<AuthedUser | null> {
    if (!authHeader) return null;
    const token = authHeader.replace(/^Bearer\s+/i, "");

    // User-level client carrying the caller's token, so getUser
    // validates the JWT against this project (anon key + Authorization).
    const userClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: { headers: { Authorization: authHeader } },
        auth: { autoRefreshToken: false, persistSession: false },
      },
    );

    const { data, error } = await userClient.auth.getUser(token);
    if (error || !data?.user) {
      console.error("[redeem-gift-code] Auth failed:", error?.message);
      return null;
    }
    return { id: data.user.id, email: data.user.email ?? null };
  },

  async redeemGift(user, code): Promise<RedeemOutcome> {
    // --- LOOKUP CODE ---
    const { data: gift, error: lookupError } = await admin
      .from("gift_codes")
      .select("*")
      .eq("code", code)
      .eq("is_active", true)
      .is("used_at", null)
      .single();

    if (lookupError || !gift) {
      return { ok: false, kind: "not_found" };
    }

    // EXPIRED?
    if (
      gift.code_expires_at &&
      new Date(gift.code_expires_at) < new Date()
    ) {
      return { ok: false, kind: "expired" };
    }

    // ALREADY REDEEMED SAME TIER?
    const { data: alreadyUsed } = await admin
      .from("gift_codes")
      .select("id")
      .eq("used_by", user.id)
      .eq("tier", gift.tier)
      .maybeSingle();

    if (alreadyUsed) {
      return { ok: false, kind: "already_redeemed", tier: gift.tier };
    }

    const now = new Date().toISOString();

    // --- UPDATE USER TIERS ---
    await admin.from("user_tiers").upsert({
      user_id: user.id,
      tier: gift.tier,
      updated_at: now,
    });

    // --- RESOLVE subscription_tiers ROW ---
    const end = new Date();
    end.setFullYear(end.getFullYear() + 1);

    // Gift codes use "Level 3" etc.; the tiers table may carry the
    // normalized "Level 3 II". Try exact, then normalized.
    let tierLookupName = String(gift.tier).toUpperCase();
    if (tierLookupName === "Level 3") {
      tierLookupName = "Level 3 II";
    }

    let tierRow: { id: string } | null = null;
    const { data: exactMatch } = await admin
      .from("subscription_tiers")
      .select("id")
      .eq("name", gift.tier)
      .maybeSingle();

    if (exactMatch) {
      tierRow = exactMatch;
    } else {
      const { data: normalizedMatch } = await admin
        .from("subscription_tiers")
        .select("id")
        .eq("name", tierLookupName)
        .maybeSingle();
      tierRow = normalizedMatch;
    }

    if (!tierRow) {
      console.error(
        "[redeem-gift-code] Tier not found in subscription_tiers:",
        gift.tier,
        tierLookupName,
      );
      return { ok: false, kind: "tier_not_configured", tier: gift.tier };
    }

    // Delete-then-insert (avoids upsert key issues), exactly as before.
    await admin.from("user_subscriptions").delete().eq("user_id", user.id);

    const { error: subError } = await admin
      .from("user_subscriptions")
      .insert({
        user_id: user.id,
        tier_id: tierRow.id,
        status: "active",
        current_period_start: now,
        current_period_end: end.toISOString(),
        updated_at: now,
      });

    if (subError) {
      console.error(
        "[redeem-gift-code] Subscription insert error:",
        subError,
      );
      return {
        ok: false,
        kind: "write_failed",
        tier: gift.tier,
        giftId: gift.id,
        detail: subError.message ?? "insert failed",
      };
    }

    // --- POST-WRITE ENTITLEMENT VERIFICATION (the B22 guard) ----------
    // Re-read with the SAME predicate the entitlement read path uses
    // (src/lib/gift/fetchActiveGiftSubscription.ts). If the row we just
    // wrote is not visible there, the customer would get nothing — that
    // is the silent failure we must NOT paper over with ok:true.
    const { data: verifyRow, error: verifyError } = await admin
      .from("user_subscriptions")
      .select("id")
      .eq("user_id", user.id)
      .eq("status", "active")
      .eq("is_gift_redemption", true)
      .gt("current_period_end", now)
      .maybeSingle();

    if (verifyError) {
      console.error(
        "[redeem-gift-code] Entitlement verify query failed:",
        verifyError,
      );
      return {
        ok: false,
        kind: "write_failed",
        tier: gift.tier,
        giftId: gift.id,
        detail: `verify query: ${verifyError.message ?? "unknown"}`,
      };
    }

    if (!verifyRow) {
      // Insert "succeeded" but the row is invisible to the entitlement
      // read path (today: is_gift_redemption defaults false). Money-loss
      // condition — fail loud, leave the code unspent.
      return {
        ok: false,
        kind: "not_propagated",
        tier: gift.tier,
        giftId: gift.id,
      };
    }

    return {
      ok: true,
      tier: gift.tier,
      giftId: gift.id,
      userEmail: user.email,
    };
  },

  async finalizeRedemption(user, giftId, tier): Promise<void> {
    const now = new Date().toISOString();

    // --- MARK CODE AS USED ---
    try {
      await admin
        .from("gift_codes")
        .update({
          used_by: user.id,
          used_by_email: user.email,
          used_at: now,
          is_active: false,
          updated_at: now,
        })
        .eq("id", giftId);
    } catch (err) {
      console.error("[redeem-gift-code] Mark-used failed:", err);
    }

    // --- LOG TO AUDIT (non-blocking) ---
    try {
      await admin.from("audit_logs").insert({
        admin_id: user.id,
        action: "gift_code_redeemed",
        target_id: giftId,
        target_type: "gift_code",
        metadata: { tier, user_email: user.email },
      });
    } catch (auditErr) {
      console.error(
        "[redeem-gift-code] Audit log failed (non-blocking):",
        auditErr,
      );
    }

    // --- CONFIRMATION EMAIL (fire-and-forget) ---
    try {
      const emailResponse = await fetch(
        `${Deno.env.get("SUPABASE_URL")}/functions/v1/send-redeem-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // send-redeem-email enforces a sender allowlist on the
            // service-role credential (open-relay fix, A9 2026-05-18).
            "Authorization": `Bearer ${
              Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
            }`,
          },
          body: JSON.stringify({ email: user.email, tier }),
        },
      );
      const emailResult = await emailResponse.json();
      if (!emailResult?.ok) {
        console.error(
          "[redeem-gift-code] Email failed:",
          emailResult?.error,
        );
      }
    } catch (emailErr) {
      console.error(
        "[redeem-gift-code] Email error (non-blocking):",
        emailErr,
      );
    }
  },

  async captureError(error, ctx): Promise<void> {
    await captureEdgeError(error, {
      functionName: "redeem-gift-code",
      userId: ctx.userId,
      tags: ctx.tags,
      extra: ctx.extra,
    });
  },
};

Deno.serve((req) => handleRequest(req, deps));
