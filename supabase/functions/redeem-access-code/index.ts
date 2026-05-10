// supabase/functions/redeem-access-code/index.ts
//
// Deno entrypoint. Wires the production Supabase client into the
// pure handler in core.ts. Unit tests live in __tests__/core.test.ts
// and use injected Deps so they don't need Deno or Postgres.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.1";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { handleRequest, renderWelcomeEmailHtml, type Deps, type RedeemRpcResult } from "./core.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
);

const FROM_ADDRESS = "MercyBlade <noreply@mercyblade.com>";

const deps: Deps = {
  async getUserFromAuthHeader(authHeader) {
    if (!authHeader) return null;
    const token = authHeader.replace(/^Bearer\s+/i, "");
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) return null;
    return { id: data.user.id };
  },

  async redeemAtomic(userId, code): Promise<RedeemRpcResult> {
    const { data, error } = await supabase.rpc("redeem_access_code_atomic", {
      p_user_id: userId,
      p_code: code,
    });

    if (error) {
      console.error("[redeem-access-code] RPC error:", error);
      // The RPC raises stable codes like 'CODE_NOT_FOUND' as the error
      // message; surface that verbatim so core.ts can translate.
      return {
        ok: false,
        pgCode: error.code ?? null,
        message: error.message ?? "Unknown RPC error",
      };
    }

    const row = Array.isArray(data) ? data[0] : data;
    if (!row) {
      return { ok: false, pgCode: null, message: "RPC returned no row" };
    }

    return {
      ok: true,
      row: {
        tier_name: row.tier_name,
        days: row.days,
        is_lifetime: row.is_lifetime,
        valid_until: row.valid_until,
      },
    };
  },

  async sendWelcomeEmail(userId, row) {
    try {
      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
      if (userError || !userData?.user?.email) {
        console.warn("[redeem-access-code] cannot send welcome email — no email for user", userId);
        return;
      }

      const resendApiKey = Deno.env.get("RESEND_API_KEY");
      if (!resendApiKey) {
        console.warn("[redeem-access-code] RESEND_API_KEY not configured — skipping welcome email");
        return;
      }

      const resend = new Resend(resendApiKey);
      await resend.emails.send({
        from: FROM_ADDRESS,
        to: [userData.user.email],
        subject: "Chào mừng bạn đến với MercyBlade! / Welcome to MercyBlade!",
        html: renderWelcomeEmailHtml(row),
      });
    } catch (err) {
      console.error("[redeem-access-code] welcome email failed:", err);
    }
  },
};

Deno.serve((req) => handleRequest(req, deps));