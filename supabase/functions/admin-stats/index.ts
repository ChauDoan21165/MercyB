/**
 * Admin Stats Edge Function
 * 
 * ARCHITECTURE NOTE:
 * - Lovable Cloud = auth + users (profiles table) + payments + subscriptions
 * - Supabase = content backend (rooms, room_entries only)
 * - This function aggregates stats from both sources
 * 
 * Returns live statistics for the admin dashboard:
 * - totalUsers: count from profiles table
 * - usersThisWeek: users created in last 7 days
 * - activeToday: users with recent activity (TODO: implement last_seen tracking)
 * - totalRooms: count from rooms table
 * - activeSubscriptions: count of active subscriptions
 * - revenueMonth: sum of completed transactions this month (TODO if payment_transactions has amount)
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
    usersThisWeek: number;
    activeToday: number;
    totalRooms: number;
    activeSubscriptions: number;
    revenueMonth: number;
  };
  error?: string;
  source?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[admin-stats] Starting stats fetch');

    // Use service role key to bypass RLS for accurate counts
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Also create user client to verify admin access
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

    // Fetch all stats in parallel using service role (bypasses RLS)
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [
      usersResult,
      roomsResult,
      subscriptionsResult,
      revenueResult
    ] = await Promise.all([
      // Total users from profiles table
      supabaseAdmin.from('profiles').select('id, created_at'),
      
      // Total active rooms
      supabaseAdmin.from('rooms').select('id', { count: 'exact', head: true }).eq('is_active', true),
      
      // Active subscriptions (current period not ended)
      supabaseAdmin.from('user_subscriptions')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'active')
        .gt('current_period_end', now.toISOString()),
      
      // Revenue this month from completed payment transactions
      supabaseAdmin.from('payment_transactions')
        .select('amount')
        .eq('status', 'completed')
        .gte('created_at', monthStart.toISOString())
    ]);

    // Calculate user stats
    const users = usersResult.data || [];
    const totalUsers = users.length;
    const usersThisWeek = users.filter(u => 
      u.created_at && new Date(u.created_at) >= weekAgo
    ).length;

    // Active today - TODO: implement proper last_seen tracking
    // For now, just count users created today as a placeholder
    const activeToday = users.filter(u => 
      u.created_at && new Date(u.created_at) >= todayStart
    ).length;

    // Revenue calculation
    const revenueMonth = (revenueResult.data || []).reduce((sum, tx) => 
      sum + (parseFloat(String(tx.amount)) || 0), 0
    );

    const stats = {
      totalUsers,
      usersThisWeek,
      activeToday,
      totalRooms: roomsResult.count || 0,
      activeSubscriptions: subscriptionsResult.count || 0,
      revenueMonth: Math.round(revenueMonth * 100) / 100, // Round to 2 decimals
    };

    console.log('[admin-stats] Stats fetched:', stats);

    return new Response(
      JSON.stringify({ 
        ok: true, 
        stats,
        source: 'Lovable Cloud (users) + Supabase (rooms)'
      } as AdminStatsResponse),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('[admin-stats] Error:', error);
    return new Response(
      JSON.stringify({ 
        ok: false, 
        error: 'Failed to fetch stats: ' + (error instanceof Error ? error.message : 'Unknown error')
      } as AdminStatsResponse),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
