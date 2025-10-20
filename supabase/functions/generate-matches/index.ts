import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { userId } = await req.json();

    // Get user's knowledge profile
    const { data: userProfile } = await supabaseClient
      .from('user_knowledge_profile')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!userProfile) {
      return new Response(
        JSON.stringify({ error: 'User profile not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get all VIP3 users' profiles (excluding current user)
    const { data: otherProfiles } = await supabaseClient
      .from('user_knowledge_profile')
      .select(`
        *,
        user_subscriptions!inner(
          user_id,
          subscription_tiers!inner(name)
        )
      `)
      .neq('user_id', userId);

    if (!otherProfiles || otherProfiles.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No other users to match with yet' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate match scores using AI
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    const matchPromises = otherProfiles.map(async (otherProfile) => {
      const prompt = `Analyze compatibility between two users based on their profiles and generate a match score from 0 to 1.

User 1 Profile:
- Interests: ${JSON.stringify(userProfile.interests)}
- Completed Topics: ${JSON.stringify(userProfile.completed_topics)}
- Traits: ${JSON.stringify(userProfile.traits)}

User 2 Profile:
- Interests: ${JSON.stringify(otherProfile.interests)}
- Completed Topics: ${JSON.stringify(otherProfile.completed_topics)}
- Traits: ${JSON.stringify(otherProfile.traits)}

Return a JSON object with:
- match_score (0.00 to 1.00)
- common_interests (array of strings)
- complementary_traits (array of strings)
- match_reason (object with explanation)`;

      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [{ role: 'user', content: prompt }],
          tools: [{
            type: 'function',
            function: {
              name: 'calculate_match',
              description: 'Calculate match score between two users',
              parameters: {
                type: 'object',
                properties: {
                  match_score: { type: 'number' },
                  common_interests: { type: 'array', items: { type: 'string' } },
                  complementary_traits: { type: 'array', items: { type: 'string' } },
                  match_reason: { type: 'object' }
                },
                required: ['match_score', 'common_interests', 'complementary_traits', 'match_reason']
              }
            }
          }],
          tool_choice: { type: 'function', function: { name: 'calculate_match' } }
        }),
      });

      const aiResult = await response.json();
      const toolCall = aiResult.choices?.[0]?.message?.tool_calls?.[0];
      
      if (toolCall) {
        const matchData = JSON.parse(toolCall.function.arguments);
        return {
          userId: otherProfile.user_id,
          ...matchData
        };
      }
      
      return null;
    });

    const matches = (await Promise.all(matchPromises)).filter(m => m !== null && m.match_score > 0.5);

    // Insert match suggestions into database
    const insertPromises = matches.map(match => 
      supabaseClient.from('matchmaking_suggestions').insert({
        user_id: userId,
        suggested_user_id: match.userId,
        match_score: match.match_score,
        match_reason: match.match_reason,
        common_interests: match.common_interests,
        complementary_traits: match.complementary_traits
      })
    );

    await Promise.all(insertPromises);

    return new Response(
      JSON.stringify({ 
        success: true, 
        matches_generated: matches.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating matches:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
