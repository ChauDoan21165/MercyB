/**
 * Admin Security Health — Edge Function
 *
 * Called by /admin dashboard to surface missing configuration.
 * Requires authentication: either a valid admin-user JWT OR the
 * x-admin-secret header matching ADMIN_SECRET.
 *
 * Returns { checks: [...], overall: "ok" | "warn" | "fail" }
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const ADMIN_USER_ID = "9957f25a-7b58-4a17-a3f2-4b91e63e69ae";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-admin-secret",
  "Content-Type": "application/json",
};

interface CheckResult {
  name: string;
  status: "ok" | "warn" | "fail";
  detail: string;
}

function send(data: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: corsHeaders });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // ── Auth ──────────────────────────────────────────────────────
    const adminSecret = Deno.env.get("ADMIN_SECRET");
    const xSecret = req.headers.get("x-admin-secret");
    const authHeader = req.headers.get("Authorization") ?? "";

    let authorized = false;

    // Option 1: x-admin-secret header
    if (adminSecret && xSecret === adminSecret) {
      authorized = true;
    }

    // Option 2: admin user JWT
    if (!authorized && authHeader.startsWith("Bearer ")) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
      const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
      if (supabaseUrl && supabaseAnonKey) {
        const client = createClient(supabaseUrl, supabaseAnonKey);
        const { data } = await client.auth.getUser(authHeader.replace("Bearer ", ""));
        if (data?.user?.id === ADMIN_USER_ID) {
          authorized = true;
        }
      }
    }

    if (!authorized) {
      return send({ error: "Unauthorized" }, 401);
    }

    // ── Checks ────────────────────────────────────────────────────
    const checks: CheckResult[] = [];

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    // If service key is missing, we can still do env checks but not DB checks
    const dbAvailable = Boolean(supabaseUrl && supabaseServiceKey);
    let adminClient: ReturnType<typeof createClient> | null = null;
    if (dbAvailable) {
      adminClient = createClient(supabaseUrl, supabaseServiceKey, {
        auth: { persistSession: false },
      });
    }

    // Helper: check RLS on a table via the check_rls_enabled RPC.
    // Requires the SQL function created by the migration at:
    // supabase/migrations_manual/20260511000000_create_check_rls_function.sql
    const checkRls = async (table: string): Promise<CheckResult> => {
      if (!adminClient) {
        return { name: `RLS enabled on ${table}`, status: "fail", detail: "Cannot connect to database" };
      }
      try {
        const { data, error } = await adminClient
          .rpc("check_rls_enabled", { table_name: table })
          .maybeSingle();

        if (error) {
          return {
            name: `RLS enabled on ${table}`,
            status: "fail",
            detail: error.message || "RPC not deployed. Run migrations_manual/20260511000000_create_check_rls_function.sql",
          };
        }

        const rlsOn = data === true || (data as any)?.check_rls_enabled === true;
        return {
          name: `RLS enabled on ${table}`,
          status: rlsOn ? "ok" : "fail",
          detail: rlsOn ? "Enabled" : "NOT enabled",
        };
      } catch (e: any) {
        return { name: `RLS enabled on ${table}`, status: "fail", detail: e.message };
      }
    };

    // Check RLS on key tables (the historical hardcoded list).
    const rlsTables = ["lessons", "user_subscriptions", "access_codes"];
    for (const table of rlsTables) {
      checks.push(await checkRls(table));
    }

    // Dynamic check: every public table that holds a `user_id` column
    // must have RLS enabled. Catches new user-data tables that ship
    // without RLS — a class of regression the hardcoded list above
    // can't see. Requires the helper RPC at
    // supabase/migrations/20260511190000_list_user_data_tables_rls_status.sql.
    if (adminClient) {
      try {
        const { data, error } = await adminClient.rpc(
          "list_user_data_tables_rls_status",
        );
        if (error) {
          checks.push({
            name: "RLS on all user_id tables",
            status: "fail",
            detail:
              error.message ||
              "list_user_data_tables_rls_status RPC not deployed",
          });
        } else {
          const rows = (data ?? []) as Array<{
            table_name: string;
            rls_enabled: boolean;
          }>;
          const offenders = rows.filter((r) => r.rls_enabled === false);
          checks.push({
            name: "RLS on all user_id tables",
            status: offenders.length === 0 ? "ok" : "fail",
            detail:
              offenders.length === 0
                ? `All ${rows.length} user-data tables have RLS enabled`
                : `RLS DISABLED on: ${offenders.map((o) => o.table_name).join(", ")} (${offenders.length} of ${rows.length})`,
          });
        }
      } catch (e) {
        checks.push({
          name: "RLS on all user_id tables",
          status: "fail",
          detail:
            e instanceof Error ? e.message : "Unexpected error",
        });
      }
    } else {
      checks.push({
        name: "RLS on all user_id tables",
        status: "fail",
        detail: "Cannot connect to database",
      });
    }

    // Check environment secrets
    const envChecks = [
      { name: "ELEVENLABS_API_KEY set", key: "ELEVENLABS_API_KEY" },
      { name: "RESEND_API_KEY set", key: "RESEND_API_KEY" },
      { name: "CRON_SECRET set", key: "CRON_SECRET" },
    ];
    for (const ec of envChecks) {
      const val = Deno.env.get(ec.key);
      checks.push({
        name: ec.name,
        status: val && val !== "placeholder" ? "ok" : "fail",
        detail: val && val !== "placeholder" ? "Configured" : "Missing or placeholder",
      });
    }

    // Check lessons table population
    if (adminClient) {
      try {
        const { count, error } = await adminClient
          .from("lessons")
          .select("*", { count: "exact", head: true });
        if (error) {
          checks.push({ name: "lessons table populated", status: "fail", detail: `Query error: ${error.message}` });
        } else {
          const c = count ?? 0;
          checks.push({
            name: "lessons table populated",
            status: c > 0 ? "ok" : "warn",
            detail: `count: ${c}`,
          });
        }
      } catch (e: any) {
        checks.push({ name: "lessons table populated", status: "fail", detail: `Error: ${e.message}` });
      }
    } else {
      checks.push({ name: "lessons table populated", status: "fail", detail: "Cannot connect to database" });
    }

    // Compute overall
    const hasFail = checks.some((c) => c.status === "fail");
    const hasWarn = checks.some((c) => c.status === "warn");
    const overall = hasFail ? "fail" : hasWarn ? "warn" : "ok";

    return send({ checks, overall });
  } catch (err) {
    console.error("[admin-security-health] Unexpected error:", err);
    return send({
      checks: [],
      overall: "fail",
      error: err instanceof Error ? err.message : "Internal server error",
    }, 500);
  }
});
