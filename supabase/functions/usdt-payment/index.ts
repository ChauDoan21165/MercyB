import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface USDTPaymentRequest {
  tier_id: string;
  period: 'monthly' | 'yearly';
  network: 'trc20' | 'erc20' | 'bep20';
  transaction_hash?: string;
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

    const { tier_id, period, network, transaction_hash }: USDTPaymentRequest = await req.json();

    // Get tier details
    const { data: tier, error: tierError } = await supabase
      .from('subscription_tiers')
      .select('*')
      .eq('id', tier_id)
      .single();

    if (tierError || !tier) {
      console.error('Tier not found:', tierError);
      return new Response(
        JSON.stringify({ error: 'Invalid tier' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const amount = period === 'yearly' && tier.price_yearly ? tier.price_yearly : tier.price_monthly;

    // Get wallet address based on network
    let walletAddress = '';
    if (network === 'trc20') {
      walletAddress = Deno.env.get('USDT_WALLET_TRC20') || '';
    } else if (network === 'erc20') {
      walletAddress = Deno.env.get('USDT_WALLET_ERC20') || '';
    } else if (network === 'bep20') {
      walletAddress = Deno.env.get('USDT_WALLET_BEP20') || '';
    }

    if (!walletAddress) {
      console.error('Wallet address not configured for network:', network);
      return new Response(
        JSON.stringify({ error: 'USDT payment not available for this network' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If transaction_hash provided, verify payment (manual verification for now)
    if (transaction_hash) {
      console.log(`Verifying USDT transaction: ${transaction_hash}`);

      // Create pending transaction record
      const { data: transaction, error: txError } = await supabase
        .from('payment_transactions')
        .insert({
          user_id: user.id,
          tier_id: tier_id,
          amount: amount,
          payment_method: 'usdt',
          transaction_type: 'subscription',
          status: 'pending_verification',
          external_reference: transaction_hash,
          period_days: period === 'yearly' ? 365 : 30,
          metadata: { 
            network, 
            wallet_address: walletAddress,
            period,
          },
        })
        .select()
        .single();

      if (txError) {
        console.error('Error creating transaction record:', txError);
        return new Response(
          JSON.stringify({ error: 'Failed to record transaction' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`USDT transaction pending verification: ${transaction.id}`);

      return new Response(
        JSON.stringify({
          success: true,
          status: 'pending_verification',
          message: 'Transaction submitted for verification. You will be notified once confirmed.',
          transaction_id: transaction.id,
          transaction_hash: transaction_hash,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Return payment instructions
    console.log(`USDT payment initiated for user ${user.id}: ${amount} USDT on ${network}`);

    return new Response(
      JSON.stringify({
        success: true,
        payment_method: 'usdt',
        network: network,
        wallet_address: walletAddress,
        amount_usdt: amount,
        tier: tier.name,
        period: period,
        instructions: [
          `Send exactly ${amount} USDT to the address above`,
          `Use ${network.toUpperCase()} network`,
          'After sending, submit your transaction hash for verification',
          'Verification typically takes 5-15 minutes',
        ],
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in usdt-payment:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
