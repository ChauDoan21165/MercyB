// supabase/functions/redeem-access-code/index.ts
//
// Deno entrypoint. Wires the production Supabase client into the
// pure handler in core.ts. Unit tests live in __tests__/core.test.ts
// and use injected Deps so they don't need Deno or Postgres.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.1";
import { handleRequest, type Deps, type RedeemRpcResult } from "./core.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
);

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
};

Deno.serve((req) => handleRequest(req, deps));
