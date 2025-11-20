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

    // Database metrics
    const { count: roomsCount } = await supabase.from('rooms').select('*', { count: 'exact', head: true });
    const { data: rooms } = await supabase.from('rooms').select('entries');
    const totalEntries = rooms?.reduce((sum, room: any) => sum + (Array.isArray(room.entries) ? room.entries.length : 0), 0) || 0;
    const totalJsonSize = JSON.stringify(rooms || []).length;

    // Storage metrics
    const { data: audioFiles } = await supabase.storage.from('room-audio').list();
    const audioCount = audioFiles?.length || 0;
    
    const { data: uploadFiles } = await supabase.storage.from('room-audio-uploads').list();
    const uploadCount = uploadFiles?.length || 0;

    // Get table count
    const { data: tables } = await supabase.from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    const tableCount = tables?.length || 0;

    // User and subscription metrics
    const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    const { count: activeSubscriptions } = await supabase
      .from('user_subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    // AI usage tracking (from TTS logs as proxy)
    const { count: aiCallsCount } = await supabase.from('tts_usage_log').select('*', { count: 'exact', head: true });

    // Security metrics
    const { count: securityEvents } = await supabase.from('security_events').select('*', { count: 'exact', head: true });
    const { count: blockedUsers } = await supabase
      .from('user_security_status')
      .select('*', { count: 'exact', head: true })
      .eq('is_blocked', true);

    // Feedback and moderation
    const { count: feedbackCount } = await supabase.from('feedback').select('*', { count: 'exact', head: true });
    const { count: moderationViolations } = await supabase.from('user_moderation_violations').select('*', { count: 'exact', head: true });

    const metrics = {
      database: {
        totalRooms: roomsCount || 0,
        totalEntries,
        jsonSizeBytes: totalJsonSize,
        tablesCount: tableCount,
        usersCount: usersCount || 0,
        activeSubscriptions: activeSubscriptions || 0,
      },
      storage: {
        audioFiles: audioCount,
        uploadFiles: uploadCount,
        totalFiles: audioCount + uploadCount,
      },
      ai: {
        totalCalls: aiCallsCount || 0,
      },
      security: {
        totalEvents: securityEvents || 0,
        blockedUsers: blockedUsers || 0,
      },
      moderation: {
        feedbackMessages: feedbackCount || 0,
        violations: moderationViolations || 0,
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
