import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Auth check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Admin check using user_roles table
    const { data: roleData } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (!roleData) {
      return new Response(
        JSON.stringify({ error: 'Forbidden' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const method = req.method;

    if (method === 'GET') {
      // Get first of current month
      const now = new Date();
      const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // Get all usage for current month
      const { data: usage } = await supabaseAdmin
        .from('ai_usage_events')
        .select('user_id, cost_usd, model, tokens_input, tokens_output')
        .gte('created_at', firstOfMonth.toISOString());

      // Get global settings
      const { data: settings } = await supabaseAdmin
        .from('ai_settings')
        .select('*')
        .single();

      // Calculate totals
      const perUser: Record<string, number> = {};
      const perModel: Record<string, { calls: number; tokens: number; cost: number }> = {};
      let totalSpent = 0;
      let totalCalls = 0;
      let totalTokens = 0;

      (usage ?? []).forEach((u) => {
        const cost = Number(u.cost_usd) || 0;
        const tokens = (u.tokens_input || 0) + (u.tokens_output || 0);
        
        // Per user
        if (u.user_id) {
          perUser[u.user_id] = (perUser[u.user_id] ?? 0) + cost;
        }
        
        // Per model
        const model = u.model || 'unknown';
        if (!perModel[model]) {
          perModel[model] = { calls: 0, tokens: 0, cost: 0 };
        }
        perModel[model].calls++;
        perModel[model].tokens += tokens;
        perModel[model].cost += cost;
        
        totalSpent += cost;
        totalCalls++;
        totalTokens += tokens;
      });

      const monthlyBudget = settings?.monthly_budget_usd ?? 50;

      return new Response(
        JSON.stringify({
          is_ai_enabled: settings?.is_ai_enabled ?? true,
          monthly_budget_usd: monthlyBudget,
          total_spent_usd: totalSpent,
          remaining_usd: monthlyBudget - totalSpent,
          total_calls: totalCalls,
          total_tokens: totalTokens,
          per_user: perUser,
          per_model: perModel,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (method === 'POST') {
      const body = await req.json();
      const { is_ai_enabled, monthly_budget_usd } = body;

      // Get the single settings row
      const { data: existingSettings } = await supabaseAdmin
        .from('ai_settings')
        .select('id')
        .limit(1)
        .single();

      if (!existingSettings) {
        return new Response(
          JSON.stringify({ error: 'Settings not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data, error } = await supabaseAdmin
        .from('ai_settings')
        .update({
          ...(is_ai_enabled !== undefined ? { is_ai_enabled } : {}),
          ...(monthly_budget_usd !== undefined ? { monthly_budget_usd } : {}),
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingSettings.id)
        .select()
        .single();

      if (error) {
        console.error('Failed to update settings:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to update settings' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`[ai-dashboard] Admin ${user.id} updated AI settings:`, { is_ai_enabled, monthly_budget_usd });

      return new Response(
        JSON.stringify(data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('ai-dashboard error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
