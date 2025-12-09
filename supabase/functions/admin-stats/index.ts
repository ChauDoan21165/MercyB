/**
 * Admin Stats Edge Function
 * 
 * ARCHITECTURE:
 * - Lovable Cloud = auth + users (profiles) + gift codes + user_tiers + payments
 * - Supabase rooms table = content backend (rooms, room_entries)
 * - This function aggregates stats from both sources using service role key
 * 
 * Returns: AdminStatsResponse
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AdminStatsResponse {
  ok: boolean;
  stats?: {
    totalUsers: number;
    activeToday: number;
    totalRooms: number;
    revenueMonth: number;
  };
  error?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[admin-stats] Starting stats fetch');

    // Service role client bypasses RLS for accurate counts
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // User client to verify authentication
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      console.error('[admin-stats] Auth error:', authError?.message);
      return new Response(
        JSON.stringify({ ok: false, error: 'Authentication required' } as AdminStatsResponse),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Verify user is admin
    const { data: isAdmin, error: roleError } = await supabaseAdmin.rpc('has_role', {
      _user_id: user.id,
      _role: 'admin'
    });

    if (roleError || !isAdmin) {
      console.error('[admin-stats] Not an admin:', user.id);
      return new Response(
        JSON.stringify({ ok: false, error: 'Admin access required' } as AdminStatsResponse),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      );
    }

    console.log('[admin-stats] Admin verified:', user.id);

    // Calculate date ranges
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Fetch all stats in parallel
    const [
      usersResult,
      roomsResult,
      revenueResult
    ] = await Promise.all([
      // Total users from profiles table (Cloud Users)
      supabaseAdmin.from('profiles').select('id', { count: 'exact', head: true }),
      
      // Total active rooms from Supabase rooms table
      supabaseAdmin.from('rooms').select('id', { count: 'exact', head: true }).eq('is_active', true),
      
      // Revenue this month from completed payment transactions
      supabaseAdmin.from('payment_transactions')
        .select('amount')
        .eq('status', 'completed')
        .gte('created_at', monthStart.toISOString())
    ]);

    // Calculate total users
    const totalUsers = usersResult.count || 0;

    // Active today - TODO: implement last_sign_in_at tracking
    // For MVP, return 0 as we don't have sign-in timestamps yet
    const activeToday = 0;

    // Total rooms
    const totalRooms = roomsResult.count || 0;

    // Revenue calculation
    const revenueMonth = (revenueResult.data || []).reduce((sum, tx) => 
      sum + (parseFloat(String(tx.amount)) || 0), 0
    );

    const stats = {
      totalUsers,
      activeToday,
      totalRooms,
      revenueMonth: Math.round(revenueMonth * 100) / 100,
    };

    console.log('[admin-stats] Stats fetched:', stats);

    return new Response(
      JSON.stringify({ ok: true, stats } as AdminStatsResponse),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('[admin-stats] Error:', error);
    return new Response(
      JSON.stringify({ 
        ok: false, 
        error: 'Failed to fetch stats'
      } as AdminStatsResponse),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
