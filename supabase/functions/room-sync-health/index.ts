import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RoomSyncStatus {
  roomId: string;
  title: string;
  tier: string;
  lastSyncedAt: string;
  entryCount: number;
  status: 'synced' | 'unknown' | 'empty';
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🏥 Health check requested');

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all rooms from database
    const { data: rooms, error } = await supabase
      .from('rooms')
      .select('id, title_en, title_vi, tier, updated_at, entries')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching rooms:', error);
      throw error;
    }

    console.log(`📊 Found ${rooms?.length || 0} rooms in database`);

    // Process room sync status
    const syncStatuses: RoomSyncStatus[] = (rooms || []).map(room => {
      const entryCount = Array.isArray(room.entries) ? room.entries.length : 0;
      
      let status: 'synced' | 'unknown' | 'empty' = 'synced';
      if (entryCount === 0) {
        status = 'empty';
      } else if (!room.updated_at) {
        status = 'unknown';
      }

      return {
        roomId: room.id,
        title: room.title_en || room.title_vi || 'Untitled',
        tier: room.tier || 'free',
        lastSyncedAt: room.updated_at || 'Never',
        entryCount,
        status,
      };
    });

    // Calculate summary statistics
    const totalRooms = syncStatuses.length;
    const syncedRooms = syncStatuses.filter(r => r.status === 'synced').length;
    const emptyRooms = syncStatuses.filter(r => r.status === 'empty').length;
    const unknownRooms = syncStatuses.filter(r => r.status === 'unknown').length;

    // Get tier breakdown
    const tierBreakdown = syncStatuses.reduce((acc, room) => {
      acc[room.tier] = (acc[room.tier] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Find rooms that need attention
    const roomsNeedingAttention = syncStatuses.filter(r => r.status === 'empty' || r.status === 'unknown');

    const response = {
      timestamp: new Date().toISOString(),
      summary: {
        totalRooms,
        syncedRooms,
        emptyRooms,
        unknownRooms,
        healthScore: totalRooms > 0 ? Math.round((syncedRooms / totalRooms) * 100) : 0,
      },
      tierBreakdown,
      rooms: syncStatuses,
      roomsNeedingAttention,
      recommendations: generateRecommendations(syncStatuses),
    };

    console.log(`✅ Health check complete: ${syncedRooms}/${totalRooms} rooms synced`);

    return new Response(JSON.stringify(response, null, 2), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('❌ Health check failed:', error);
    
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

function generateRecommendations(rooms: RoomSyncStatus[]): string[] {
  const recommendations: string[] = [];
  
  const emptyRooms = rooms.filter(r => r.status === 'empty');
  if (emptyRooms.length > 0) {
    recommendations.push(
      `🔴 ${emptyRooms.length} room(s) have no entries. Run auto-sync or import JSON data.`
    );
  }

  const unknownRooms = rooms.filter(r => r.status === 'unknown');
  if (unknownRooms.length > 0) {
    recommendations.push(
      `🟡 ${unknownRooms.length} room(s) have never been synced. Consider running initial sync.`
    );
  }

  if (emptyRooms.length === 0 && unknownRooms.length === 0) {
    recommendations.push('✅ All rooms are synced and healthy!');
  }

  // Check for recently updated rooms
  const recentlyUpdated = rooms.filter(r => {
    if (!r.lastSyncedAt || r.lastSyncedAt === 'Never') return false;
    const syncDate = new Date(r.lastSyncedAt);
    const hoursSinceSync = (Date.now() - syncDate.getTime()) / (1000 * 60 * 60);
    return hoursSinceSync < 1;
  });

  if (recentlyUpdated.length > 0) {
    recommendations.push(`🔄 ${recentlyUpdated.length} room(s) updated in the last hour.`);
  }

  return recommendations;
}
