import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ListRoomsRequest {
  tier?: string;
  domain?: string;
  search?: string;
  page?: number;
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

    const { tier, domain, search, page = 1, limit = 50 }: ListRoomsRequest = await req.json();
    console.log(`Listing rooms - tier: ${tier}, domain: ${domain}, search: ${search}, page: ${page}`);

    let query = supabase
      .from('rooms')
      .select('id, title_en, title_vi, tier, domain, keywords', { count: 'exact' });

    // Apply filters
    if (tier) {
      query = query.ilike('tier', `%${tier}%`);
    }

    if (domain) {
      query = query.ilike('domain', `%${domain}%`);
    }

    if (search) {
      query = query.or(`title_en.ilike.%${search}%,title_vi.ilike.%${search}%,keywords.cs.{${search}}`);
    }

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    // Order by title
    query = query.order('title_en', { ascending: true });

    const { data: rooms, error: roomError, count } = await query;

    if (roomError) {
      console.error('Error fetching rooms:', roomError);
      return new Response(
        JSON.stringify({ error: roomError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${count} rooms, returning page ${page} (${rooms?.length} items)`);

    return new Response(
      JSON.stringify({
        success: true,
        rooms: rooms || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error in list-rooms:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
