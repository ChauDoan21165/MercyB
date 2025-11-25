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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Database metrics with tier breakdown
    const { count: roomsCount } = await supabase.from('rooms').select('*', { count: 'exact', head: true });
    const { data: rooms } = await supabase.from('rooms').select('entries, tier');
    const totalEntries = rooms?.reduce((sum, room: any) => sum + (Array.isArray(room.entries) ? room.entries.length : 0), 0) || 0;
    
    // Rooms by tier
    const roomsByTier: Record<string, number> = {};
    rooms?.forEach((room: any) => {
      const tier = room.tier || 'free';
      roomsByTier[tier] = (roomsByTier[tier] || 0) + 1;
    });

    // Kids entries
    const { count: kidsEntriesCount } = await supabase.from('kids_entries').select('*', { count: 'exact', head: true });

    // Storage metrics - all 4 buckets
    const { data: audioFiles } = await supabase.storage.from('room-audio').list();
    const { data: uploadFiles } = await supabase.storage.from('room-audio-uploads').list();
    const { data: avatarFiles } = await supabase.storage.from('avatars').list();
    const { data: paymentFiles } = await supabase.storage.from('payment-proofs').list();
    
    const storageBuckets = [
      { name: 'audios', count: audioFiles?.length || 0, public: false },
      { name: 'avatars', count: avatarFiles?.length || 0, public: true },
      { name: 'uploads', count: uploadFiles?.length || 0, public: false },
      { name: 'payment-proofs', count: paymentFiles?.length || 0, public: false },
    ];

    // User metrics
    const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    const { count: activeSubscriptions } = await supabase
      .from('user_subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    // Active sessions (concurrent users approximation)
    const { count: recentSessions } = await supabase
      .from('user_sessions')
      .select('*', { count: 'exact', head: true })
      .gte('last_activity', new Date(Date.now() - 5 * 60 * 1000).toISOString()); // Last 5 minutes

    // VIP9 domains
    const { data: vip9Rooms } = await supabase
      .from('rooms')
      .select('domain')
      .ilike('tier', '%vip9%');
    
    const vip9Domains: Record<string, number> = {};
    vip9Rooms?.forEach((room: any) => {
      if (room.domain) {
        vip9Domains[room.domain] = (vip9Domains[room.domain] || 0) + 1;
      }
    });

    // Edge function call stats (today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { count: ttsCallsToday } = await supabase
      .from('tts_usage_log')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString());

    // Moderation queue
    const { count: moderationQueue } = await supabase
      .from('user_moderation_violations')
      .select('*', { count: 'exact', head: true })
      .eq('action_taken', 'pending');

    const metrics = {
      infrastructure: {
        totalRooms: roomsCount || 0,
        totalTiers: Object.keys(roomsByTier).length,
        totalEntries: totalEntries + (kidsEntriesCount || 0),
        totalUsers: usersCount || 0,
        concurrentUsers: recentSessions || 0,
        roomsByTier,
      },
      edgeFunctions: {
        total: 6,
        functions: [
          { name: 'sync-rooms', callsToday: 0, status: 'active' },
          { name: 'tts', callsToday: ttsCallsToday || 0, status: 'active' },
          { name: 'paypal', callsToday: 0, status: 'active' },
          { name: 'moderation', callsToday: 0, status: 'active' },
          { name: 'chat-room', callsToday: 0, status: 'active' },
          { name: 'matchmaking', callsToday: 0, status: 'active' },
        ]
      },
      storage: {
        buckets: storageBuckets,
        totalFiles: storageBuckets.reduce((sum, b) => sum + b.count, 0),
      },
      vip9: {
        domains: vip9Domains,
        totalRooms: vip9Rooms?.length || 0,
      },
      health: {
        databaseConnected: true,
        moderationQueueLength: moderationQueue || 0,
      },
      timestamp: new Date().toISOString(),
    };

    return new Response(JSON.stringify(metrics), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
