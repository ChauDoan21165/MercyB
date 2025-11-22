import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { validateInput, ttsRequestSchema } from "../shared/validation.ts";
import { checkRateLimit, checkFeatureFlag } from "../shared/rate-limit.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verify authentication
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

    // Check feature flag
    const isTTSEnabled = await checkFeatureFlag(supabaseClient, "tts_enabled");
    if (!isTTSEnabled) {
      return new Response(
        JSON.stringify({ error: "Text-to-speech is temporarily disabled" }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate input
    const body = await req.json();
    const validatedData = validateInput(ttsRequestSchema, body);
    const { text, voice, roomSlug, entrySlug } = validatedData;

    // Enhanced rate limiting check
    const rateLimitCheck = await checkRateLimit(supabaseClient, user.id, "text-to-speech");
    if (!rateLimitCheck.allowed) {
      return new Response(
        JSON.stringify({ error: rateLimitCheck.error }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify VIP3+ access
    const { data: subscription } = await supabaseClient
      .from('user_subscriptions')
      .select('tier_id, subscription_tiers(name)')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle()

    const tierName = (subscription?.subscription_tiers as any)?.name?.toLowerCase()
    if (!tierName?.includes('vip3') && !tierName?.includes('vip4')) {
      return new Response(
        JSON.stringify({ error: 'VIP3+ subscription required for text-to-speech / Cần đăng ký VIP3 trở lên để sử dụng chuyển văn bản thành giọng nói' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate unique filename based on room and entry
    const fileName = `${roomSlug}/${entrySlug}_${voice || 'alloy'}.mp3`
    
    // Check if audio file already exists in storage
    const { data: existingFile } = await supabaseClient
      .storage
      .from('room-audio')
      .list(roomSlug, {
        search: `${entrySlug}_${voice || 'alloy'}.mp3`
      })

    if (existingFile && existingFile.length > 0) {
      // Return existing audio with signed URL (24 hour expiry)
      const { data: urlData, error: urlError } = await supabaseClient
        .storage
        .from('room-audio')
        .createSignedUrl(fileName, 86400) // 24 hours
      
      if (urlError) {
        console.error('Signed URL error:', urlError)
        throw new Error('Failed to generate audio URL')
      }
      
      console.log('Returning cached audio:', fileName)
      return new Response(
        JSON.stringify({ audioUrl: urlData.signedUrl, cached: true }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    // Audio doesn't exist, generate new one
    console.log('Generating new audio for:', fileName)
    
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured')
    }

    // Extract only English text (before the Vietnamese part)
    const englishText = text.split('\n\n')[0] || text

    // Generate speech from text using OpenAI
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: englishText,
        voice: voice || 'alloy',
        response_format: 'mp3',
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Failed to generate speech')
    }

    // Get audio buffer
    const arrayBuffer = await response.arrayBuffer()
    const audioBlob = new Uint8Array(arrayBuffer)

    // Upload to storage
    const { error: uploadError } = await supabaseClient
      .storage
      .from('room-audio')
      .upload(fileName, audioBlob, {
        contentType: 'audio/mpeg',
        upsert: false
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      throw new Error(`Failed to store audio: ${uploadError.message}`)
    }

    // Get signed URL (24 hour expiry)
    const { data: urlData, error: urlError } = await supabaseClient
      .storage
      .from('room-audio')
      .createSignedUrl(fileName, 86400) // 24 hours

    if (urlError) {
      console.error('Signed URL error:', urlError)
      throw new Error('Failed to generate audio URL')
    }

    // Log usage for rate limiting
    await supabaseClient.from('tts_usage_log').insert({
      user_id: user.id,
      text_length: englishText.length,
      voice: voice || 'alloy'
    })

    console.log('Audio generated and stored:', fileName)

    return new Response(
      JSON.stringify({ audioUrl: urlData.signedUrl, cached: false }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('TTS Error:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})