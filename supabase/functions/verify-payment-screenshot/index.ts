import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { imageUrl, tierId, username, expectedAmount } = await req.json()

    if (!imageUrl || !tierId || !username) {
      throw new Error('Missing required fields')
    }

    // Validate username
    if (username.length > 100) {
      throw new Error('Username must be less than 100 characters')
    }

    // Validate expectedAmount
    if (expectedAmount && (isNaN(expectedAmount) || expectedAmount <= 0)) {
      throw new Error('Invalid expected amount')
    }

    // Check user suspension status
    const { data: modStatus } = await supabaseClient
      .from('user_moderation_status')
      .select('is_suspended')
      .eq('user_id', user.id)
      .single();

    if (modStatus?.is_suspended) {
      return new Response(
        JSON.stringify({ error: 'Account suspended for policy violations' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create service role client for storage access
    const supabaseServiceClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Extract file path from URL
    const urlParts = imageUrl.split('/storage/v1/object/public/payment-proofs/')
    if (urlParts.length < 2) {
      throw new Error('Invalid storage URL')
    }
    const filePath = urlParts[1]

    // Download the image using service role
    const { data: imageData, error: downloadError } = await supabaseServiceClient.storage
      .from('payment-proofs')
      .download(filePath)

    if (downloadError || !imageData) {
      console.error('Download error:', downloadError)
      throw new Error('Failed to download image')
    }
    
    const imageBuffer = await imageData.arrayBuffer()
    const base64Image = btoa(String.fromCharCode(...new Uint8Array(imageBuffer)))

    console.log('Analyzing payment screenshot with OCR...')

    // Use Lovable AI vision to extract text from screenshot
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured')
    }

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are a payment verification assistant. Extract transaction details from PayPal payment screenshots. Return ONLY valid JSON with these fields: transaction_id, amount (numeric), date (ISO format), payer_email, payer_name, confidence (0-1). If information is unclear or missing, set confidence lower.'
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Extract PayPal transaction details from this screenshot. Expected amount: $${expectedAmount}. Look for: transaction ID, amount paid, date, payer email/name.`
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: 500
      }),
    })

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text()
      console.error('AI API error:', errorText)
      throw new Error('Failed to analyze screenshot')
    }

    const aiData = await aiResponse.json()
    const content = aiData.choices?.[0]?.message?.content
    
    if (!content) {
      throw new Error('No response from AI')
    }

    console.log('AI Response:', content)

    // Parse JSON response
    let extracted
    try {
      // Remove markdown code blocks if present
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/)
      const jsonString = jsonMatch ? jsonMatch[1] : content
      extracted = JSON.parse(jsonString)
    } catch (e) {
      console.error('Failed to parse AI response:', content)
      throw new Error('Failed to parse extracted data')
    }

    const confidence = extracted.confidence || 0
    const extractedAmount = parseFloat(extracted.amount || '0')
    
    // Auto-approve if high confidence and amount matches
    let status = 'pending'
    let verificationMethod = 'pending'
    
    if (confidence >= 0.85 && Math.abs(extractedAmount - expectedAmount) < 0.01) {
      status = 'auto_approved'
      verificationMethod = 'ocr_auto'
      
      // Create subscription immediately
      const { error: subError } = await supabaseClient
        .from('user_subscriptions')
        .insert({
          user_id: user.id,
          tier_id: tierId,
          status: 'active',
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year
        })
      
      if (subError) {
        console.error('Failed to create subscription:', subError)
      }
    }

    // Save submission record
    const { error: insertError } = await supabaseClient
      .from('payment_proof_submissions')
      .insert({
        user_id: user.id,
        tier_id: tierId,
        screenshot_url: imageUrl,
        username: username,
        extracted_transaction_id: extracted.transaction_id,
        extracted_amount: extractedAmount,
        extracted_date: extracted.date,
        extracted_email: extracted.payer_email || extracted.payer_name,
        ocr_confidence: confidence,
        status: status,
        verification_method: verificationMethod,
        verified_at: status === 'auto_approved' ? new Date().toISOString() : null
      })

    if (insertError) {
      console.error('Failed to save submission:', insertError)
      throw insertError
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        status: status,
        extracted: extracted,
        confidence: confidence,
        message: status === 'auto_approved' 
          ? 'Payment verified! Your subscription is now active.' 
          : 'Payment submitted for admin review. You will be notified once approved.'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Verification error:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})