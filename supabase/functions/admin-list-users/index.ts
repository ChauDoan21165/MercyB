import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { captureEdgeError } from "../_shared/sentry.ts";
import { adminListUsersRequestSchema } from "../_shared/adminSchemas.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ListUsersRequest type now sourced from the zod schema in
// _shared/adminSchemas.ts (A11b). Kept in the import block above.

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Verify authentication and admin role
    const { data: { user }, error: authError } = await supabase.auth.getUser();
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
    // Auth + admin role ALREADY passed above. Replaces the un-validated
    // `await req.json()` cast. Wraps the parse in try/catch so empty
    // bodies (no payload sent) default to `{}` and proceed with all
    // handler-side defaults — matching admin-list-registered-users's
    // pre-A11b resilience pattern. Pre-A11b admin-list-users crashed
    // (500) on empty body; the dispatch's "preserve existing valid-
    // payload behavior" rule still holds (an empty body was a broken
    // edge case, not a valid payload) and the fix is the natural
    // consequence of adding a real parse layer here.
    let parsedJson: unknown = {};
    try {
      parsedJson = await req.json();
    } catch {
      parsedJson = {};
    }
    const bodyParse = adminListUsersRequestSchema.safeParse(parsedJson);
    if (!bodyParse.success) {
      const topLevelKeys =
        parsedJson && typeof parsedJson === "object" && !Array.isArray(parsedJson)
          ? Object.keys(parsedJson as Record<string, unknown>)
          : [];
      await captureEdgeError(
        new Error("admin-list-users request failed zod validation"),
        {
          functionName: "admin-list-users",
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

    const { page = 1, limit = 50, search, tier } = bodyParse.data;
    console.log(`Admin listing users - page: ${page}, limit: ${limit}, search: ${search}, tier: ${tier}`);

    // Get profiles with subscriptions
    let query = supabase
      .from('profiles')
      .select(`
        *,
        user_subscriptions (
          status,
          current_period_end,
          subscription_tiers (
            name,
            name_vi
          )
        )
      `, { count: 'exact' });

    // Apply search filter
    if (search) {
      query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%,username.ilike.%${search}%`);
    }

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: users, error: usersError, count } = await query;

    if (usersError) {
      console.error('Error fetching users:', usersError);
      return new Response(
        JSON.stringify({ error: usersError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Filter by tier if specified
    let filteredUsers = users;
    if (tier && users) {
      filteredUsers = users.filter(u => {
        const subs = u.user_subscriptions as any[];
        return subs?.some(s => s.subscription_tiers?.name?.toLowerCase() === tier.toLowerCase());
      });
    }

    // Log admin access
    await supabase.rpc('log_admin_access', {
      _accessed_table: 'profiles',
      _action: 'list',
      _metadata: { page, limit, search, tier },
    });

    console.log(`Found ${count} users, returning page ${page}`);

    return new Response(
      JSON.stringify({
        success: true,
        users: filteredUsers || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error in admin-list-users:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
