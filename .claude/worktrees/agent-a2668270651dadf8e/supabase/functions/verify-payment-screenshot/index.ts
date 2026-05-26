import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { auditLog } from "../_shared/audit.ts"
import { rateLimit, getClientIP } from "../_shared/rateLimit.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type VerifyPaymentBody = {
  imageUrl?: unknown
  tierId?: unknown
}

type ParsedOcr = {
  transaction_id?: unknown
  amount?: unknown
  date?: unknown
  payer_email?: unknown
  payer_name?: unknown
  confidence?: unknown
}

function asNonEmptyString(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function extractPaymentProofPath(imageUrl: string): string | null {
  const trimmed = imageUrl.trim()
  if (!trimmed) return null

  const markers = [
    '/storage/v1/object/public/payment-proofs/',
    '/storage/v1/object/sign/payment-proofs/',
    '/storage/v1/object/payment-proofs/',
  ]

  for (const marker of markers) {
    const idx = trimmed.indexOf(marker)
    if (idx >= 0) {
      return trimmed.slice(idx + marker.length).replace(/^\/+/, '')
    }
  }

  if (trimmed.startsWith('payment-proofs/')) {
    return trimmed.slice('payment-proofs/'.length).replace(/^\/+/, '')
  }

  if (!trimmed.includes('://')) {
    return trimmed.replace(/^\/+/, '')
  }

  try {
    const url = new URL(trimmed)
    const match = url.pathname.match(/\/storage\/v1\/object\/(?:public|sign)\/payment-proofs\/(.+)$/)
    return match?.[1]?.replace(/^\/+/, '') ?? null
  } catch {
    return null
  }
}

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100
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
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } },
    )

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    try {
      const clientIP = getClientIP(req)
      await rateLimit(`verify-payment:${user.id}:${clientIP}`, 5, 300_000)
    } catch (error) {
      if (error instanceof Error && error.message === 'RATE_LIMIT_EXCEEDED') {
        return new Response(
          JSON.stringify({ error: 'Too many payment submissions. Please wait a few minutes.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        )
      }
    }

    const body = (await req.json().catch(() => ({}))) as VerifyPaymentBody
    const imageUrl = asNonEmptyString(body.imageUrl)
    const tierId = asNonEmptyString(body.tierId)

    if (!imageUrl || !tierId) {
      throw new Error('Missing required fields')
    }

    const { data: modStatus } = await supabaseClient
      .from('user_moderation_status')
      .select('is_suspended')
      .eq('user_id', user.id)
      .single()

    if (modStatus?.is_suspended) {
      return new Response(
        JSON.stringify({ error: 'Account suspended for policy violations' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const { data: tierRow, error: tierError } = await supabaseClient
      .from('subscription_tiers')
      .select('id, price_monthly, is_active')
      .eq('id', tierId)
      .eq('is_active', true)
      .maybeSingle()

    if (tierError || !tierRow) {
      return new Response(
        JSON.stringify({ error: 'Invalid or inactive tier' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const trustedExpectedAmountRaw = Number(tierRow.price_monthly)
    const trustedExpectedAmount = Number.isFinite(trustedExpectedAmountRaw)
      ? roundMoney(trustedExpectedAmountRaw)
      : null

    const { data: profileRow } = await supabaseClient
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .maybeSingle()

    const resolvedUsername =
      asNonEmptyString((profileRow as { username?: unknown } | null)?.username) ??
      asNonEmptyString(user.email) ??
      user.id

    const filePath = extractPaymentProofPath(imageUrl)
    if (!filePath) {
      throw new Error('Invalid storage URL')
    }

    const fileOwnerId = filePath.split('/')[0]?.trim() || ''
    const ownsProof = fileOwnerId === user.id

    const supabaseServiceClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    let extracted: ParsedOcr | null = null
    let confidence = 0
    let extractedAmount = 0
    let proofAnalyzed = false

    if (ownsProof) {
      const { data: imageData, error: downloadError } = await supabaseServiceClient.storage
        .from('payment-proofs')
        .download(filePath)

      if (downloadError || !imageData) {
        console.error('Payment proof download failed')
      } else {
        const imageBuffer = await imageData.arrayBuffer()
        const base64Image = btoa(String.fromCharCode(...new Uint8Array(imageBuffer)))
        const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')

        if (!LOVABLE_API_KEY) {
          console.error('LOVABLE_API_KEY not configured')
        } else {
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
                  content: 'You are a payment verification assistant. Extract transaction details from PayPal payment screenshots. Return ONLY valid JSON with these fields: transaction_id, amount (numeric), date (ISO format), payer_email, payer_name, confidence (0-1). If information is unclear or missing, set confidence lower.',
                },
                {
                  role: 'user',
                  content: [
                    {
                      type: 'text',
                      text: `Extract PayPal transaction details from this screenshot. Expected amount: $${trustedExpectedAmount ?? 0}. Look for: transaction ID, amount paid, date, payer email/name.`,
                    },
                    {
                      type: 'image_url',
                      image_url: {
                        url: `data:image/jpeg;base64,${base64Image}`,
                      },
                    },
                  ],
                },
              ],
              max_tokens: 500,
            }),
          })

          if (!aiResponse.ok) {
            const errorText = await aiResponse.text()
            console.error('AI API error:', errorText)
          } else {
            const aiData = await aiResponse.json()
            const content = aiData.choices?.[0]?.message?.content

            if (typeof content === 'string' && content.trim()) {
              try {
                const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/)
                const jsonString = jsonMatch ? jsonMatch[1] : content
                const parsed = JSON.parse(jsonString) as ParsedOcr
                extracted = parsed
                confidence = Number(parsed.confidence ?? 0)
                extractedAmount = Number(parsed.amount ?? 0)
                proofAnalyzed = true
              } catch {
                console.error('Failed to parse OCR response')
              }
            }
          }
        }
      }
    }

    let status = 'pending'
    let verificationMethod = 'pending'

    if (
      ownsProof &&
      proofAnalyzed &&
      trustedExpectedAmount !== null &&
      confidence >= 0.85 &&
      Math.abs(extractedAmount - trustedExpectedAmount) < 0.01
    ) {
      status = 'auto_approved'
      verificationMethod = 'ocr_auto'

      const { error: subError } = await supabaseClient
        .from('user_subscriptions')
        .insert({
          user_id: user.id,
          tier_id: tierId,
          status: 'active',
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        })

      if (subError) {
        console.error('Failed to create subscription:', subError)
      } else {
        await auditLog({
          type: 'MANUAL_PAYMENT_AUTO_APPROVED',
          user_id: user.id,
          metadata: {
            tier_id: tierId,
            extracted_amount: extractedAmount,
            expected_amount: trustedExpectedAmount,
            confidence,
            transaction_id: extracted?.transaction_id ? String(extracted.transaction_id) : null,
          },
        })
      }
    }

    const { error: insertError } = await supabaseClient
      .from('payment_proof_submissions')
      .insert({
        user_id: user.id,
        tier_id: tierId,
        screenshot_url: imageUrl,
        username: resolvedUsername,
        extracted_transaction_id: extracted?.transaction_id ? String(extracted.transaction_id) : null,
        extracted_amount: extractedAmount || null,
        extracted_date: extracted?.date ? String(extracted.date) : null,
        extracted_email: extracted?.payer_email ? String(extracted.payer_email) : (extracted?.payer_name ? String(extracted.payer_name) : null),
        ocr_confidence: proofAnalyzed ? confidence : 0,
        status,
        verification_method: verificationMethod,
        verified_at: status === 'auto_approved' ? new Date().toISOString() : null,
      })

    if (insertError) {
      console.error('Failed to save submission:', insertError)
      throw insertError
    }

    return new Response(
      JSON.stringify({
        success: true,
        status,
        extracted,
        confidence,
        message: status === 'auto_approved'
          ? 'Payment verified! Your subscription is now active.'
          : 'Payment submitted for admin review. You will be notified once approved.',
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
