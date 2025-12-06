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

// Valid gift code tiers
type GiftTier = 'VIP1' | 'VIP2' | 'VIP3' | 'VIP4' | 'VIP5' | 'VIP6' | 'VIP7' | 'VIP8' | 'VIP9';
const ALLOWED_TIERS: GiftTier[] = ['VIP1', 'VIP2', 'VIP3', 'VIP4', 'VIP5', 'VIP6', 'VIP7', 'VIP8', 'VIP9'];

// Duration to days mapping
const DURATION_DAYS: Record<string, number> = {
  '1_month': 30,
  '3_months': 90,
  '6_months': 180,
  '12_months': 365,
};

function getExpiryDate(duration?: string): string {
  const now = new Date();
  const days = DURATION_DAYS[duration || '12_months'] ?? 365;
  now.setDate(now.getDate() + days);
  return now.toISOString();
}

// Generate gift code in format VIPX-XXXX-XXXX-XXXX
function generateGiftCode(tier: GiftTier): string {
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
    const authHeader = req.headers.get('Authorization');
    console.log('[generate-gift-code] Auth header present:', !!authHeader);
    
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Extract JWT token from Authorization header
    const token = authHeader.replace('Bearer ', '');
    
    // Create client with user's auth for getting user info
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Get user from auth - pass the token directly
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    console.log('[generate-gift-code] Auth result:', { userId: user?.id, authError: authError?.message });
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - invalid token' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Check if user is admin using auth client (respects RLS)
    const { data: userRole, error: roleError } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    console.log('[generate-gift-code] Role check:', { userRole, roleError: (roleError as any)?.message });

    if (!userRole) {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      );
    }

    // Admin client for DB inserts (bypasses RLS)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON body' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    const { tier, count = 1, duration, notes } = body;
    console.log('[generate-gift-code] Request body:', { tier, count, duration, notes });

    if (!tier || !ALLOWED_TIERS.includes(tier as GiftTier)) {
      return new Response(
        JSON.stringify({ error: 'Valid tier (VIP1–VIP9) is required' }),
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

      // Try to generate a unique code using admin client
      while (attempts < maxAttempts) {
        const { data: existing } = await supabaseAdmin
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

      // Insert the code using admin client
      const { error: insertError } = await supabaseAdmin
        .from('gift_codes')
        .insert({
          code,
          tier,
          code_expires_at: getExpiryDate(duration),
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
