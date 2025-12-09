import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
};

function send(data: object) {
  return new Response(JSON.stringify(data), { headers: corsHeaders, status: 200 });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 200 });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Manual auth check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.log('[admin-management] No auth header');
      return send({ ok: false, error: 'Not authenticated' });
    }

    const token = authHeader.replace('Bearer ', '');
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    const { data: userData, error: authError } = await supabaseAuth.auth.getUser(token);
    if (authError || !userData?.user) {
      console.log('[admin-management] Auth failed:', authError?.message);
      return send({ ok: false, error: 'Not authenticated' });
    }

    const user = userData.user;
    console.log(`[admin-management] User: ${user.email}`);

    // Use service role for admin operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get requestor's admin level
    const { data: requestorAdmin, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (adminError || !requestorAdmin) {
      console.log('[admin-management] Not an admin');
      return send({ ok: false, error: 'Not an admin' });
    }

    console.log(`[admin-management] Admin level: ${requestorAdmin.level}`);

    // Parse body
    let body: Record<string, unknown> = {};
    try {
      body = await req.json();
    } catch {
      // Empty body OK for list
    }

    const action = body.action as string || 'list';
    console.log(`[admin-management] Action: ${action}`);

    switch (action) {
      case 'list': {
        const { data: admins, error } = await supabase
          .from('admin_users')
          .select('*')
          .order('level', { ascending: false });

        if (error) {
          return send({ ok: false, error: error.message });
        }

        // Filter to show admins at lower levels + self
        const visibleAdmins = admins?.filter(a => a.level < requestorAdmin.level || a.user_id === user.id) || [];
        
        return send({
          ok: true,
          admins: visibleAdmins.map(a => ({
            ...a,
            is_current_user: a.user_id === user.id,
            can_manage: a.level < requestorAdmin.level && a.level < 10,
          })),
          my_level: requestorAdmin.level,
        });
      }

      case 'my-role': {
        return send({
          ok: true,
          admin: requestorAdmin,
          permissions: {
            canEditSystem: requestorAdmin.level >= 9,
            canCreateAdmins: requestorAdmin.level >= 9,
            canManageLevels: Array.from({ length: requestorAdmin.level - 1 }, (_, i) => i + 1),
          }
        });
      }

      case 'create': {
        const email = body.email as string;
        const level = (body.level as number) || 1;

        if (!email) {
          return send({ ok: false, error: 'Email is required' });
        }

        console.log(`[admin-management] Creating admin: ${email} at level ${level}`);

        // Only level 9+ can create admins
        if (requestorAdmin.level < 9) {
          return send({ ok: false, error: 'Only Level 9+ can create admins' });
        }

        // Cannot create at or above own level
        if (level >= requestorAdmin.level) {
          return send({ ok: false, error: 'Cannot create admin at or above your level' });
        }

        // Only Admin Master can create level 9
        if (level === 9 && requestorAdmin.level !== 10) {
          return send({ ok: false, error: 'Only Admin Master can create Level 9 admins' });
        }

        // Check if already an admin
        const { data: existing } = await supabase
          .from('admin_users')
          .select('id')
          .eq('email', email)
          .single();

        if (existing) {
          return send({ ok: false, error: 'User is already an admin' });
        }

        // Find user by email using auth.admin.listUsers
        const { data: authUsers } = await supabase.auth.admin.listUsers();
        const targetUser = authUsers?.users?.find(u => u.email === email);

        if (!targetUser) {
          return send({ ok: false, error: 'User not found. They must sign up first.' });
        }

        // Create the admin
        const { data: newAdmin, error: createError } = await supabase
          .from('admin_users')
          .insert({
            user_id: targetUser.id,
            email: email,
            level: level,
            created_by: requestorAdmin.id
          })
          .select()
          .single();

        if (createError) {
          console.log('[admin-management] Create error:', createError.message);
          return send({ ok: false, error: createError.message });
        }

        // Also add to user_roles for has_role() compatibility
        await supabase
          .from('user_roles')
          .upsert({ user_id: targetUser.id, role: 'admin' }, { onConflict: 'user_id,role' });

        // Log the action
        await supabase.from('admin_logs').insert({
          actor_admin_id: requestorAdmin.id,
          target_admin_id: newAdmin.id,
          action: 'create',
          new_level: level,
          metadata: { email }
        });

        console.log(`[admin-management] Created admin ${email} at level ${level}`);
        return send({ ok: true, message: `Admin ${email} created at level ${level}`, admin: newAdmin });
      }

      case 'update_level': {
        const admin_id = body.admin_id as string;
        const new_level = body.new_level as number;

        if (!admin_id || new_level === undefined) {
          return send({ ok: false, error: 'admin_id and new_level are required' });
        }

        console.log(`[admin-management] Updating admin ${admin_id} to level ${new_level}`);

        // Get target admin
        const { data: targetAdmin, error: targetError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('id', admin_id)
          .single();

        if (targetError || !targetAdmin) {
          return send({ ok: false, error: 'Admin not found' });
        }

        // Cannot modify Admin Master
        if (targetAdmin.level === 10) {
          return send({ ok: false, error: 'Cannot modify Admin Master' });
        }

        // Must be higher level than target
        if (requestorAdmin.level <= targetAdmin.level) {
          return send({ ok: false, error: 'Cannot modify admin at or above your level' });
        }

        // Cannot set to or above own level
        if (new_level >= requestorAdmin.level) {
          return send({ ok: false, error: 'Cannot set level at or above your own' });
        }

        // Only Admin Master can set to level 9
        if (new_level === 9 && requestorAdmin.level !== 10) {
          return send({ ok: false, error: 'Only Admin Master can set Level 9' });
        }

        const oldLevel = targetAdmin.level;

        // Update
        const { error: updateError } = await supabase
          .from('admin_users')
          .update({ level: new_level })
          .eq('id', admin_id);

        if (updateError) {
          return send({ ok: false, error: updateError.message });
        }

        // Log the action
        await supabase.from('admin_logs').insert({
          actor_admin_id: requestorAdmin.id,
          target_admin_id: admin_id,
          action: new_level > oldLevel ? 'promote' : 'demote',
          old_level: oldLevel,
          new_level: new_level
        });

        console.log(`[admin-management] Updated ${targetAdmin.email} from level ${oldLevel} to ${new_level}`);
        return send({ ok: true, message: `Level changed from ${oldLevel} to ${new_level}` });
      }

      case 'delete': {
        const admin_id = body.admin_id as string;

        if (!admin_id) {
          return send({ ok: false, error: 'admin_id is required' });
        }

        console.log(`[admin-management] Deleting admin ${admin_id}`);

        // Get target admin
        const { data: targetAdmin, error: targetError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('id', admin_id)
          .single();

        if (targetError || !targetAdmin) {
          return send({ ok: false, error: 'Admin not found' });
        }

        // Cannot delete Admin Master
        if (targetAdmin.level === 10) {
          return send({ ok: false, error: 'Cannot delete Admin Master' });
        }

        // Must be higher level than target
        if (requestorAdmin.level <= targetAdmin.level) {
          return send({ ok: false, error: 'Cannot delete admin at or above your level' });
        }

        // Delete the admin
        const { error: deleteError } = await supabase
          .from('admin_users')
          .delete()
          .eq('id', admin_id);

        if (deleteError) {
          return send({ ok: false, error: deleteError.message });
        }

        // Also remove from user_roles
        await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', targetAdmin.user_id)
          .eq('role', 'admin');

        // Log the action
        await supabase.from('admin_logs').insert({
          actor_admin_id: requestorAdmin.id,
          target_admin_id: admin_id,
          action: 'delete',
          old_level: targetAdmin.level,
          metadata: { email: targetAdmin.email }
        });

        console.log(`[admin-management] Deleted admin ${targetAdmin.email}`);
        return send({ ok: true, message: `Admin ${targetAdmin.email} removed` });
      }

      default:
        return send({ ok: false, error: `Unknown action: ${action}` });
    }
  } catch (error: unknown) {
    console.error('[admin-management] Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return send({ ok: false, error: message });
  }
});
