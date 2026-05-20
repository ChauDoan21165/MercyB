import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { captureEdgeError } from "../_shared/sentry.ts";
import { adminPublishRoomRequestSchema } from "../_shared/adminSchemas.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// PublishRoomRequest type now sourced from the zod schema in
// _shared/adminSchemas.ts (A11b). Kept in the import block above.

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Verify authentication and admin role
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      console.error('Authentication failed:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check admin role
    const { data: adminRole } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (!adminRole) {
      console.error('Admin access denied');
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ── A11b: request-payload runtime validation ────────────────────────
    // Auth + admin role ALREADY passed above. Validate the request body
    // shape; on parse failure return 400 + Sentry beacon with PII-
    // scrubbed details (zod issues + top-level keys only — NEVER the
    // raw body, which carries the target room_id).
    let parsedJson: unknown;
    try {
      parsedJson = await req.json();
    } catch (parseErr) {
      await captureEdgeError(parseErr, {
        functionName: "admin-publish-room",
        userId: user.id,
        extra: { stage: "request-parse-json" },
        tags: { admin: "true", stage: "request-parse-json" },
      });
      return new Response(
        JSON.stringify({ error: 'Invalid JSON body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const bodyParse = adminPublishRoomRequestSchema.safeParse(parsedJson);
    if (!bodyParse.success) {
      const topLevelKeys =
        parsedJson && typeof parsedJson === "object" && !Array.isArray(parsedJson)
          ? Object.keys(parsedJson as Record<string, unknown>)
          : [];
      await captureEdgeError(
        new Error("admin-publish-room request failed zod validation"),
        {
          functionName: "admin-publish-room",
          userId: user.id,
          extra: {
            stage: "request-zod",
            zodIssues: bodyParse.error.issues.map((iss) => ({
              path: iss.path.join("."),
              code: iss.code,
              message: iss.message,
            })),
            topLevelKeys,
          },
          tags: { admin: "true", stage: "request-zod" },
        },
      );
      return new Response(
        JSON.stringify({ error: 'Request body failed validation' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const { room_id } = bodyParse.data;
    console.log(`Admin publishing room: ${room_id}`);

    // Update room to mark as published (remove is_demo flag or add published field)
    const { data: room, error: updateError } = await supabase
      .from('rooms')
      .update({
        is_demo: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', room_id)
      .select()
      .single();

    if (updateError) {
      console.error('Error publishing room:', updateError);
      return new Response(
        JSON.stringify({ error: updateError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log admin action
    await supabase.rpc('log_admin_access', {
      _accessed_table: 'rooms',
      _action: 'publish',
      _metadata: { room_id },
    });

    console.log(`Room ${room_id} published successfully`);

    return new Response(
      JSON.stringify({
        success: true,
        room,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error in admin-publish-room:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
