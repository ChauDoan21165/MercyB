// save-room-json — admin-only file writer for /public/data/.
//
// SECURITY: this function previously accepted any caller, any filename,
// and any content. The fix layer:
//
//   1. Rejects requests without a valid Bearer JWT (401).
//   2. Rejects users below admin_level 9 via the `get_admin_level`
//      RPC (403).
//   3. Validates Content-Type is application/json (400).
//   4. Validates filename is in the explicit allowlist AND matches
//      a safe pattern that blocks path traversal (400).
//   5. Caps content at 1 MB (413).
//   6. Logs every attempt to api_request_logs with the user_id +
//      filename + status, regardless of success.
//
// Note: the allowlist in validation.ts ships empty because the fix
// audit found no current callers in src/ or scripts/. Adding a
// filename requires also updating reports/a2-c1-save-room-json-fix.md
// so the audit trail stays in sync.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

import { validatePayload, MAX_CONTENT_BYTES } from "./validation.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } },
  );

  // Capture for audit logging — populated as we work through the request.
  let actorUserId: string | null = null;
  let attemptedFilename: string | null = null;

  // The audit-log writer never throws; a logging failure must not
  // affect the user-visible response.
  const logAttempt = async (statusCode: number) => {
    try {
      await supabase.from("api_request_logs").insert({
        key_id: null, // no developer-API key; this is a JWT-auth call
        endpoint: "save-room-json",
        status_code: statusCode,
        ms: 0,
        anon_ip: null,
      });
      // Mirror the actor + filename in audit_logs (existing helper schema).
      // api_request_logs is keyed on developer-API; audit_logs is the
      // catch-all that the rest of the admin stack writes to. We write
      // both so the trail is visible from either table.
      await supabase.from("audit_logs").insert({
        type: "save_room_json_attempt",
        user_id: actorUserId,
        metadata: {
          filename: attemptedFilename,
          status_code: statusCode,
        },
      });
    } catch (err) {
      console.error("[save-room-json] audit-log failed:", err);
    }
  };

  try {
    // ── 1. Auth: extract user from Authorization header ─────────────────
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.replace(/^Bearer\s+/i, "").trim();
    if (!token) {
      await logAttempt(401);
      return json(401, { error: "Unauthorized — Bearer token required" });
    }

    const { data: userResult, error: userErr } = await supabase.auth.getUser(token);
    if (userErr || !userResult?.user) {
      await logAttempt(401);
      return json(401, { error: "Unauthorized — invalid token" });
    }

    actorUserId = userResult.user.id;

    // ── 2. Authorization: admin_level >= 9 ──────────────────────────────
    const { data: levelData, error: levelErr } = await supabase.rpc(
      "get_admin_level",
      { _user_id: actorUserId },
    );
    if (levelErr) {
      console.error("[save-room-json] get_admin_level error:", levelErr);
      await logAttempt(500);
      return json(500, { error: "Authorization check failed" });
    }
    const adminLevel = Number(levelData ?? 0);
    if (adminLevel < 9) {
      await logAttempt(403);
      return json(403, { error: "Forbidden — admin level 9 required" });
    }

    // ── 3. Validate request payload ─────────────────────────────────────
    const contentType = req.headers.get("content-type");
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      await logAttempt(400);
      return json(400, { error: "Invalid JSON body" });
    }

    const payload =
      body && typeof body === "object"
        ? (body as Record<string, unknown>)
        : {};
    attemptedFilename =
      typeof payload.filename === "string" ? payload.filename : null;

    const result = validatePayload({
      contentType,
      filename: payload.filename,
      content: payload.content,
    });
    if (!result.ok) {
      await logAttempt(result.status);
      return json(result.status, { error: result.error });
    }

    // ── 4. Write the file ───────────────────────────────────────────────
    const filepath = `./public/data/${result.value.filename}`;
    await Deno.writeTextFile(filepath, result.value.content);

    console.log(
      `[save-room-json] admin ${actorUserId} wrote ${result.value.filename}`,
    );
    await logAttempt(200);

    // Preserve the legacy success response shape so any consumer that
    // checks .success / .message / .path keeps working.
    return json(200, {
      success: true,
      message: `File ${result.value.filename} saved successfully`,
      path: filepath,
    });
  } catch (error) {
    console.error("[save-room-json] error:", error);
    await logAttempt(500);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return json(500, { error: errorMessage });
  }
});

// Re-export for tests.
export { MAX_CONTENT_BYTES };
