// deno-lint-ignore-file no-import-prefix
// Permanently deletes a user's account and all associated data.
// Required for Apple App Store guideline 5.1.1(v) and GDPR Article 17.
//
// Flow:
//   1. Validate Authorization header → fetch user via anon client.
//   2. Iterate USER_DATA_MANIFEST (see user-data-manifest.ts) to either
//      DELETE personal data or ANONYMIZE retained audit/financial rows.
//   3. Delete profiles row (parent of many FKs).
//   4. Delete auth.users row — cascade catches anything the manifest
//      missed (defense in depth).
//
// The manifest is enforced by scripts/check-delete-account-coverage.mjs
// which fails CI when a new user-identifying table lands without a
// classification.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  getAnonymizeEntries,
  getDeleteEntries,
} from "./user-data-manifest.ts";
import {
  evaluateDeleteAccountAal,
  readAalFromJwt,
} from "./aal-gate.ts";
import { scrubEmailAuditByRecipient } from "./email-audit-recipient-scrub.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

type WipeReport = {
  deleted: Array<{ table: string; column: string }>;
  anonymized: Array<{ table: string; column: string }>;
  errors: Array<{ table: string; column: string; action: string; message: string }>;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
    return json({ error: "Server is missing Supabase env vars" }, 500);
  }

  const authorization = req.headers.get("Authorization") ?? "";
  if (!authorization) return json({ error: "Unauthorized" }, 401);

  try {
    const authClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authorization } },
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const {
      data: { user },
      error: userError,
    } = await authClient.auth.getUser();

    if (userError || !user) return json({ error: "Unauthorized" }, 401);

    const userId = user.id;
    const admin = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // ── aal=2 gate (issue #233) ─────────────────────────────────
    // Account deletion is irreversible AND runs under service-role,
    // which bypasses the `require_aal2_when_factor_present` RLS rule.
    // Re-assert it here as defense in depth: a user who has a verified
    // second factor must be at aal=2 (i.e. have re-entered their TOTP)
    // before we wipe anything. Users with no MFA factor are unaffected
    // (they have no way to reach aal=2 — see aal-gate.ts).
    const bearer = authorization.replace(/^Bearer\s+/i, "").trim();
    const aal = readAalFromJwt(bearer);

    let hasVerifiedFactor = false;
    let factorLookupFailed = false;
    try {
      const { data: factorData, error: factorError } =
        await admin.auth.admin.mfa.listFactors({ userId });
      if (factorError) throw factorError;
      hasVerifiedFactor = Boolean(
        factorData?.factors?.some(
          (f) => f.status === "verified" && f.factor_type === "totp",
        ),
      );
    } catch {
      // Fail CLOSED for an irreversible operation: if we cannot
      // confirm whether the user has a second factor, do not proceed.
      factorLookupFailed = true;
    }

    const denial = evaluateDeleteAccountAal({
      aal,
      hasVerifiedFactor,
      factorLookupFailed,
    });
    if (denial) return json(denial.payload, denial.status);

    const report: WipeReport = { deleted: [], anonymized: [], errors: [] };

    // ── Pass 1: DELETE personal-data rows ───────────────────────
    // Each (table, column) is handled independently — errors are recorded
    // but do not stop subsequent passes. The auth.users deletion at the
    // end will cascade whatever remains.
    for (const { table, column } of getDeleteEntries()) {
      const { error } = await admin.from(table).delete().eq(column, userId);
      if (error) {
        report.errors.push({
          table,
          column,
          action: "delete",
          message: error.message,
        });
      } else {
        report.deleted.push({ table, column });
      }
    }

    // ── Pass 2: ANONYMIZE financial / audit / security rows ─────
    // Rows are retained (tax / legal audit / abuse-prevention memory)
    // but the user-identifying column is nulled. When a manifest entry
    // declares `scrub_columns`, those fields are overwritten in the same
    // UPDATE so free-text (e.g. feedback.message, security_events.ip_address,
    // jsonb payloads containing emails) cannot leak after erasure.
    for (const { table, column, scrub_columns } of getAnonymizeEntries()) {
      const payload: Record<string, string | null> = { [column]: null };
      if (scrub_columns) {
        for (const [k, v] of Object.entries(scrub_columns)) {
          payload[k] = v;
        }
      }
      const { error } = await admin.from(table).update(payload).eq(column, userId);
      if (error) {
        report.errors.push({
          table,
          column,
          action: "anonymize",
          message: error.message,
        });
      } else {
        report.anonymized.push({ table, column });
      }
    }

    // ── Pass 2b: scrub email_audit where the deleted user was the RECIPIENT ──
    // GAP A close (reports/PRIVACY-b1-anonymize-audit-A4c.md / #819): the
    // manifest's anonymize entry on email_audit filters with
    // .eq("admin_user_id", userId) — it only catches rows where the deleted
    // user was the admin SENDER. For rows where they were a RECIPIENT (any
    // feedback reply / 2FA email), recipient_email + subject must be
    // scrubbed by EMAIL match, not user_id. Captures user.email NOW while
    // the auth.users row is still readable — by Pass 4 the lookup is gone.
    // Non-fatal: failures land in report.errors and the core deletion
    // continues (audit rows are secondary to user-data erasure).
    {
      const scrubResult = await scrubEmailAuditByRecipient(admin, user.email);
      if (scrubResult.kind === "error") {
        report.errors.push({
          table: "email_audit",
          column: "recipient_email",
          action: "anonymize_recipient",
          message: scrubResult.message,
        });
      } else if (scrubResult.kind === "scrubbed") {
        report.anonymized.push({
          table: "email_audit",
          column: "recipient_email",
        });
      }
    }

    // ── Pass 3: DELETE profiles (parent of many FKs) ────────────
    {
      const { error } = await admin.from("profiles").delete().eq("id", userId);
      if (error) {
        report.errors.push({
          table: "profiles",
          column: "id",
          action: "delete",
          message: error.message,
        });
      }
    }

    // ── Pass 4: DELETE auth.users — cascade catches stragglers ──
    const { error: authDeleteError } = await admin.auth.admin.deleteUser(userId);
    if (authDeleteError) {
      return json(
        {
          error: `Failed to delete auth user: ${authDeleteError.message}`,
          report,
        },
        500,
      );
    }

    return json({ success: true, report });
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      500,
    );
  }
});
