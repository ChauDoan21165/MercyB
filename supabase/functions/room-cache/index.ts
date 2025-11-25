import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// In-memory cache with TTL
let roomsCache: {
  data: any[];
  timestamp: number;
} | null = null;

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const now = Date.now();
    
    // Return cached data if still fresh
    if (roomsCache && (now - roomsCache.timestamp) < CACHE_TTL) {
      return new Response(
        JSON.stringify({ 
          rooms: roomsCache.data,
          cached: true,
          age: Math.floor((now - roomsCache.timestamp) / 1000)
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Cache-Control': `public, max-age=${Math.floor(CACHE_TTL / 1000)}`
          }
        }
      );
    }

    // Fetch fresh data from database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: rooms, error } = await supabase
      .from('rooms')
      .select('id, title_en, title_vi, tier, schema_id')
      .order('title_en');

    if (error) throw error;

    // Transform to minimal format
    const minimalRooms = (rooms || []).map(room => ({
      id: room.id,
      nameEn: room.title_en || room.id,
      nameVi: room.title_vi || '',
      tier: room.tier || 'free',
      hasData: true // Assume all DB rooms have data
    }));

    // Update cache
    roomsCache = {
      data: minimalRooms,
      timestamp: now
    };

    return new Response(
      JSON.stringify({ 
        rooms: minimalRooms,
        cached: false,
        count: minimalRooms.length
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Cache-Control': `public, max-age=${Math.floor(CACHE_TTL / 1000)}`
        }
      }
    );

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
