import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get auth user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ ok: false, error: 'Invalid token' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get requestor's admin level
    const { data: requestorAdmin, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (adminError || !requestorAdmin) {
      return new Response(JSON.stringify({ ok: false, error: 'Not an admin' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { action, ...body } = await req.json();

    switch (action) {
      case 'list': {
        // Return admins with level < requestor's level, plus self
        const { data: admins, error } = await supabase
          .from('admin_users')
          .select('*')
          .or(`level.lt.${requestorAdmin.level},user_id.eq.${user.id}`)
          .order('level', { ascending: false });

        if (error) {
          return new Response(JSON.stringify({ ok: false, error: error.message }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        return new Response(JSON.stringify({ ok: true, admins, myLevel: requestorAdmin.level }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'my-role': {
        // Return the requestor's admin info
        return new Response(JSON.stringify({ 
          ok: true, 
          admin: requestorAdmin,
          permissions: {
            canEditSystem: requestorAdmin.level >= 9,
            canCreateAdmins: requestorAdmin.level >= 9,
            canManageLevels: Array.from({ length: requestorAdmin.level - 1 }, (_, i) => i + 1),
          }
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'create': {
        const { email, level } = body;
        
        // Only level 9+ can create admins
        if (requestorAdmin.level < 9) {
          return new Response(JSON.stringify({ ok: false, error: 'Insufficient permissions. Only Level 9+ can create admins.' }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // Cannot create admin at or above own level (except Admin Master)
        if (level >= requestorAdmin.level && requestorAdmin.level < 10) {
          return new Response(JSON.stringify({ ok: false, error: 'Cannot create admin at or above your level' }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // Find the user by email
        const { data: targetUser, error: userError } = await supabase
          .from('profiles')
          .select('id, email')
          .eq('email', email)
          .single();

        if (userError || !targetUser) {
          return new Response(JSON.stringify({ ok: false, error: 'User not found with that email' }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // Check if already an admin
        const { data: existingAdmin } = await supabase
          .from('admin_users')
          .select('id')
          .eq('user_id', targetUser.id)
          .single();

        if (existingAdmin) {
          return new Response(JSON.stringify({ ok: false, error: 'User is already an admin' }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // Create the admin
        const { data: newAdmin, error: createError } = await supabase
          .from('admin_users')
          .insert({
            user_id: targetUser.id,
            email: email,
            level: level,
            created_by: user.id
          })
          .select()
          .single();

        if (createError) {
          return new Response(JSON.stringify({ ok: false, error: createError.message }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // Log the action
        await supabase.from('admin_logs').insert({
          actor_admin_id: requestorAdmin.id,
          target_admin_id: newAdmin.id,
          action: 'create',
          new_level: level,
          metadata: { email }
        });

        return new Response(JSON.stringify({ ok: true, admin: newAdmin }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'promote': {
        const { adminId, newLevel } = body;

        // Get target admin
        const { data: targetAdmin, error: targetError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('id', adminId)
          .single();

        if (targetError || !targetAdmin) {
          return new Response(JSON.stringify({ ok: false, error: 'Admin not found' }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // Cannot promote to level 9+ unless Admin Master
        if (newLevel >= 9 && requestorAdmin.level < 10) {
          return new Response(JSON.stringify({ ok: false, error: 'Only Admin Master can promote to Level 9+' }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // Cannot promote to or above own level
        if (newLevel >= requestorAdmin.level) {
          return new Response(JSON.stringify({ ok: false, error: 'Cannot promote to or above your level' }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // Must be higher level than target
        if (requestorAdmin.level <= targetAdmin.level) {
          return new Response(JSON.stringify({ ok: false, error: 'Cannot promote admin at or above your level' }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        const oldLevel = targetAdmin.level;

        // Update the admin
        const { error: updateError } = await supabase
          .from('admin_users')
          .update({ level: newLevel })
          .eq('id', adminId);

        if (updateError) {
          return new Response(JSON.stringify({ ok: false, error: updateError.message }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // Log the action
        await supabase.from('admin_logs').insert({
          actor_admin_id: requestorAdmin.id,
          target_admin_id: adminId,
          action: 'promote',
          old_level: oldLevel,
          new_level: newLevel
        });

        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'demote': {
        const { adminId, newLevel } = body;

        // Get target admin
        const { data: targetAdmin, error: targetError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('id', adminId)
          .single();

        if (targetError || !targetAdmin) {
          return new Response(JSON.stringify({ ok: false, error: 'Admin not found' }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // Cannot demote Admin Master
        if (targetAdmin.level === 10) {
          return new Response(JSON.stringify({ ok: false, error: 'Cannot demote Admin Master' }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // Must be higher level than target
        if (requestorAdmin.level <= targetAdmin.level) {
          return new Response(JSON.stringify({ ok: false, error: 'Cannot demote admin at or above your level' }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // New level must be less than current
        if (newLevel >= targetAdmin.level) {
          return new Response(JSON.stringify({ ok: false, error: 'New level must be lower than current level' }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        const oldLevel = targetAdmin.level;

        // Update the admin
        const { error: updateError } = await supabase
          .from('admin_users')
          .update({ level: newLevel })
          .eq('id', adminId);

        if (updateError) {
          return new Response(JSON.stringify({ ok: false, error: updateError.message }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // Log the action
        await supabase.from('admin_logs').insert({
          actor_admin_id: requestorAdmin.id,
          target_admin_id: adminId,
          action: 'demote',
          old_level: oldLevel,
          new_level: newLevel
        });

        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'delete': {
        const { adminId } = body;

        // Get target admin
        const { data: targetAdmin, error: targetError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('id', adminId)
          .single();

        if (targetError || !targetAdmin) {
          return new Response(JSON.stringify({ ok: false, error: 'Admin not found' }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // Cannot delete Admin Master
        if (targetAdmin.level === 10) {
          return new Response(JSON.stringify({ ok: false, error: 'Cannot delete Admin Master' }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // Must be higher level than target
        if (requestorAdmin.level <= targetAdmin.level) {
          return new Response(JSON.stringify({ ok: false, error: 'Cannot delete admin at or above your level' }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // Delete the admin
        const { error: deleteError } = await supabase
          .from('admin_users')
          .delete()
          .eq('id', adminId);

        if (deleteError) {
          return new Response(JSON.stringify({ ok: false, error: deleteError.message }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // Log the action
        await supabase.from('admin_logs').insert({
          actor_admin_id: requestorAdmin.id,
          target_admin_id: adminId,
          action: 'delete',
          old_level: targetAdmin.level,
          metadata: { email: targetAdmin.email }
        });

        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      default:
        return new Response(JSON.stringify({ ok: false, error: 'Unknown action' }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
  } catch (error: unknown) {
    console.error('Admin management error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ ok: false, error: message }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
