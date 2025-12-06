import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Check if requester is admin
    const { data: requesterRole } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (!requesterRole) {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      );
    }

    // Admin client for privileged operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    // LIST ADMINS
    if (req.method === 'GET' && action === 'list') {
      const { data: admins, error } = await supabaseAdmin
        .from('user_roles')
        .select('user_id, role, created_at')
        .eq('role', 'admin');

      if (error) {
        console.error('[manage-admins] List error:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to fetch admins' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }

      // Get user details from auth.users
      const adminDetails = await Promise.all(
        (admins || []).map(async (admin) => {
          const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(admin.user_id);
          const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('email, full_name')
            .eq('id', admin.user_id)
            .single();
          
          return {
            user_id: admin.user_id,
            email: authUser?.user?.email || profile?.email || 'Unknown',
            full_name: profile?.full_name || null,
            created_at: admin.created_at,
            is_current_user: admin.user_id === user.id,
          };
        })
      );

      return new Response(
        JSON.stringify({ admins: adminDetails }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ADD ADMIN
    if (req.method === 'POST' && action === 'add') {
      const { email } = await req.json();
      
      if (!email || typeof email !== 'string') {
        return new Response(
          JSON.stringify({ error: 'Email is required' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }

      // Find user by email
      const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();
      if (listError) {
        console.error('[manage-admins] List users error:', listError);
        return new Response(
          JSON.stringify({ error: 'Failed to search users' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }

      const targetUser = users.users.find(u => u.email?.toLowerCase() === email.toLowerCase());
      if (!targetUser) {
        return new Response(
          JSON.stringify({ error: 'User not found with that email' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        );
      }

      // Check if already admin
      const { data: existingRole } = await supabaseAdmin
        .from('user_roles')
        .select('role')
        .eq('user_id', targetUser.id)
        .eq('role', 'admin')
        .single();

      if (existingRole) {
        return new Response(
          JSON.stringify({ error: 'User is already an admin' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }

      // Add admin role
      const { error: insertError } = await supabaseAdmin
        .from('user_roles')
        .insert({ user_id: targetUser.id, role: 'admin' });

      if (insertError) {
        console.error('[manage-admins] Insert error:', insertError);
        return new Response(
          JSON.stringify({ error: 'Failed to add admin role' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }

      return new Response(
        JSON.stringify({ success: true, message: `${email} is now an admin` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // REMOVE ADMIN
    if (req.method === 'POST' && action === 'remove') {
      const { user_id: targetUserId } = await req.json();
      
      if (!targetUserId) {
        return new Response(
          JSON.stringify({ error: 'User ID is required' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }

      // Prevent self-removal
      if (targetUserId === user.id) {
        return new Response(
          JSON.stringify({ error: 'You cannot remove yourself as admin' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }

      // Remove admin role
      const { error: deleteError } = await supabaseAdmin
        .from('user_roles')
        .delete()
        .eq('user_id', targetUserId)
        .eq('role', 'admin');

      if (deleteError) {
        console.error('[manage-admins] Delete error:', deleteError);
        return new Response(
          JSON.stringify({ error: 'Failed to remove admin role' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Admin role removed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );

  } catch (error) {
    console.error('[manage-admins] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
