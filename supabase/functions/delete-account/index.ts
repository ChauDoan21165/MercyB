// deno-lint-ignore-file no-import-prefix
// Permanently deletes a user's account and all associated data.
// Required for Apple App Store guideline 5.1.1(v) and GDPR Article 17.
//
// Flow:
//   1. Validate Authorization header → fetch user via anon client.
//   2. Delete or anonymize data the user owns across tables (best-effort).
//   3. Delete the auth.users row via service role admin API — this is the
//      part rightToBeForgotten.ts cannot do from the browser.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

    // Best-effort data cleanup. Errors are collected but don't block the
    // overall deletion — auth user removal is the critical step.
    const errors: string[] = [];

    const tablesOwnedByUser: Array<{ table: string; column: string }> = [
      { table: "favorite_tracks",      column: "user_id" },
      { table: "user_points",          column: "user_id" },
      { table: "user_sessions",        column: "user_id" },
      { table: "teacher_memory",       column: "user_id" },
      { table: "user_notebook_items",  column: "user_id" },
    ];

    for (const t of tablesOwnedByUser) {
      const { error } = await admin.from(t.table).delete().eq(t.column, userId);
      if (error) errors.push(`${t.table}: ${error.message}`);
    }

    // Anonymize feedback (keep row so analytics aren't broken).
    {
      const { error } = await admin
        .from("feedback")
        .update({ user_id: null, message: "[DELETED BY USER REQUEST]" })
        .eq("user_id", userId);
      if (error) errors.push(`feedback: ${error.message}`);
    }

    // Mark subscription as deleted for financial records; don't hard-delete.
    {
      const { error } = await admin
        .from("user_subscriptions")
        .update({ status: "deleted", updated_at: new Date().toISOString() })
        .eq("user_id", userId);
      if (error) errors.push(`user_subscriptions: ${error.message}`);
    }

    // Delete profile last (FKs from other tables may reference it).
    {
      const { error } = await admin.from("profiles").delete().eq("id", userId);
      if (error) errors.push(`profiles: ${error.message}`);
    }

    // Critical step — remove the auth user. Only service role can do this.
    const { error: authDeleteError } = await admin.auth.admin.deleteUser(userId);
    if (authDeleteError) {
      return json(
        { error: `Failed to delete auth user: ${authDeleteError.message}`, warnings: errors },
        500,
      );
    }

    return json({ success: true, warnings: errors });
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      500,
    );
  }
});
