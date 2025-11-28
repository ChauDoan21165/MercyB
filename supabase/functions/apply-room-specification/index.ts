import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Verify user is admin
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: roles, error: roleError } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (roleError || !roles) {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { specificationId, scope, targetId, action } = await req.json();

    console.log('Apply room specification:', { specificationId, scope, targetId, action, userId: user.id });

    if (action === 'create') {
      // Create new specification
      const { data: spec, error: specError } = await supabaseClient
        .from('room_specifications')
        .insert({
          name: targetId.name,
          description: targetId.description,
          use_color_theme: targetId.use_color_theme,
          created_by: user.id,
        })
        .select()
        .single();

      if (specError) {
        console.error('Error creating specification:', specError);
        return new Response(JSON.stringify({ error: specError.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ success: true, specification: spec }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'apply') {
      // Get the specification
      const { data: spec, error: specError } = await supabaseClient
        .from('room_specifications')
        .select('*')
        .eq('id', specificationId)
        .single();

      if (specError || !spec) {
        return new Response(JSON.stringify({ error: 'Specification not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Create assignment
      const { error: assignError } = await supabaseClient
        .from('room_specification_assignments')
        .insert({
          specification_id: specificationId,
          scope,
          target_id: targetId,
          applied_by: user.id,
        });

      if (assignError) {
        console.error('Error creating assignment:', assignError);
        return new Response(JSON.stringify({ error: assignError.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log(`Applied specification ${specificationId} to ${scope}:${targetId || 'app'}`);

      return new Response(JSON.stringify({ success: true, specification: spec }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'list') {
      // List all specifications
      const { data: specs, error: listError } = await supabaseClient
        .from('room_specifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (listError) {
        console.error('Error listing specifications:', listError);
        return new Response(JSON.stringify({ error: listError.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ specifications: specs }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'get-active') {
      // Get active specification for a target
      const { data: assignment, error: getError } = await supabaseClient
        .from('room_specification_assignments')
        .select('*, room_specifications(*)')
        .eq('scope', scope)
        .eq('target_id', targetId || '')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (getError && getError.code !== 'PGRST116') {
        console.error('Error getting active specification:', getError);
      }

      return new Response(
        JSON.stringify({ 
          specification: assignment?.room_specifications || null 
        }), 
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in apply-room-specification:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});