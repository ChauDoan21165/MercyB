import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Generate random alphanumeric code
function generateCodeSegment(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Generate gift code in format VIP2-XXXX-XXXX-XXXX or VIP3-XXXX-XXXX-XXXX
function generateGiftCode(tier: 'VIP2' | 'VIP3'): string {
  const segment1 = generateCodeSegment(4);
  const segment2 = generateCodeSegment(4);
  const segment3 = generateCodeSegment(4);
  return `${tier}-${segment1}-${segment2}-${segment3}`;
}

Deno.serve(async (req) => {
  console.log('[generate-gift-code] Request received:', req.method);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get user from auth
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    console.log('[generate-gift-code] Auth result:', { userId: user?.id, authError: authError?.message });
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Check if user is admin
    const { data: userRole } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (!userRole) {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      );
    }

    const body = await req.json();
    const { tier, count = 1, code_expires_at, notes } = body;
    console.log('[generate-gift-code] Request body:', { tier, count, notes, code_expires_at });

    if (!tier || !['VIP2', 'VIP3'].includes(tier)) {
      return new Response(
        JSON.stringify({ error: 'Valid tier (VIP2 or VIP3) is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    if (count < 1 || count > 100) {
      return new Response(
        JSON.stringify({ error: 'Count must be between 1 and 100' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const generatedCodes: string[] = [];
    const failedCodes: string[] = [];

    for (let i = 0; i < count; i++) {
      let code = generateGiftCode(tier);
      let attempts = 0;
      const maxAttempts = 10;

      // Try to generate a unique code
      while (attempts < maxAttempts) {
        const { data: existing } = await supabaseClient
          .from('gift_codes')
          .select('id')
          .eq('code', code)
          .single();

        if (!existing) {
          break; // Code is unique
        }

        code = generateGiftCode(tier);
        attempts++;
      }

      if (attempts >= maxAttempts) {
        failedCodes.push(code);
        continue;
      }

      // Insert the code
      const { error: insertError } = await supabaseClient
        .from('gift_codes')
        .insert({
          code,
          tier,
          code_expires_at: code_expires_at || null,
          is_active: true,
          created_by: user.id,
          notes: notes || null,
        });

      if (insertError) {
        console.error('[generate-gift-code] Insert error:', insertError);
        failedCodes.push(code);
      } else {
        generatedCodes.push(code);
      }
    }

    console.log('[generate-gift-code] Generation complete:', { generated: generatedCodes.length, failed: failedCodes.length });
    
    return new Response(
      JSON.stringify({
        success: true,
        generated: generatedCodes.length,
        failed: failedCodes.length,
        codes: generatedCodes,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('Error in generate-gift-code:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
