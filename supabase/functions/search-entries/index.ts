import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SearchRequest {
  query: string;
  tier?: string;
  limit?: number;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('Authentication failed:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { query, tier, limit = 50 }: SearchRequest = await req.json();
    console.log(`Searching entries - query: ${query}, tier: ${tier}, limit: ${limit}`);

    if (!query || query.trim().length < 2) {
      return new Response(
        JSON.stringify({ error: 'Query must be at least 2 characters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get all rooms
    let roomsQuery = supabase.from('rooms').select('id, title_en, title_vi, tier, domain, entries, keywords');
    
    if (tier) {
      roomsQuery = roomsQuery.eq('tier', tier);
    }

    const { data: rooms, error: roomError } = await roomsQuery;

    if (roomError) {
      console.error('Error fetching rooms:', roomError);
      return new Response(
        JSON.stringify({ error: roomError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Search through entries with ranking
    const searchTerm = query.toLowerCase();
    const results: any[] = [];

    rooms?.forEach((room) => {
      const entries = room.entries as any[] || [];
      
      entries.forEach((entry: any) => {
        let score = 0;
        const matchedFields: string[] = [];

        // Search in keywords_en and keywords_vi
        const keywordsEn = entry.keywords_en || [];
        const keywordsVi = entry.keywords_vi || [];
        
        keywordsEn.forEach((keyword: string) => {
          if (keyword.toLowerCase().includes(searchTerm)) {
            score += 10;
            matchedFields.push('keywords_en');
          }
        });

        keywordsVi.forEach((keyword: string) => {
          if (keyword.toLowerCase().includes(searchTerm)) {
            score += 10;
            matchedFields.push('keywords_vi');
          }
        });

        // Search in copy_en and copy_vi
        if (entry.copy_en && entry.copy_en.toLowerCase().includes(searchTerm)) {
          score += 5;
          matchedFields.push('copy_en');
        }

        if (entry.copy_vi && entry.copy_vi.toLowerCase().includes(searchTerm)) {
          score += 5;
          matchedFields.push('copy_vi');
        }

        // Search in room title
        if (room.title_en.toLowerCase().includes(searchTerm)) {
          score += 3;
          matchedFields.push('room_title');
        }

        // Search in room keywords
        const roomKeywords = room.keywords || [];
        roomKeywords.forEach((keyword: string) => {
          if (keyword.toLowerCase().includes(searchTerm)) {
            score += 2;
            matchedFields.push('room_keywords');
          }
        });

        if (score > 0) {
          results.push({
            room_id: room.id,
            room_title_en: room.title_en,
            room_title_vi: room.title_vi,
            tier: room.tier,
            domain: room.domain,
            entry_id: entry.id || entry.slug || entry.artifact_id,
            keywords_en: entry.keywords_en,
            keywords_vi: entry.keywords_vi,
            copy_en: entry.copy_en?.substring(0, 200),
            copy_vi: entry.copy_vi?.substring(0, 200),
            audio: entry.audio,
            score,
            matched_fields: [...new Set(matchedFields)],
          });
        }
      });
    });

    // Sort by score descending
    results.sort((a, b) => b.score - a.score);

    // Limit results
    const limitedResults = results.slice(0, limit);

    console.log(`Found ${results.length} matching entries, returning ${limitedResults.length}`);

    return new Response(
      JSON.stringify({
        success: true,
        query,
        total: results.length,
        results: limitedResults,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error in search-entries:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
