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

    // Verify VIP3 access
    const { data: subscription } = await supabaseClient
      .from('user_subscriptions')
      .select('tier_id, subscription_tiers(name)')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle()

    const tierName = (subscription?.subscription_tiers as any)?.name?.toLowerCase()
    if (!tierName?.includes('vip3')) {
      return new Response(
        JSON.stringify({ error: 'VIP3 subscription required for text-to-speech' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { text, voice, roomSlug, entrySlug } = await req.json()

    if (!text) {
      throw new Error('Text is required')
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
      // Return existing audio URL
      const { data: urlData } = supabaseClient
        .storage
        .from('room-audio')
        .getPublicUrl(fileName)
      
      console.log('Returning cached audio:', fileName)
      return new Response(
        JSON.stringify({ audioUrl: urlData.publicUrl, cached: true }),
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

    // Get public URL
    const { data: urlData } = supabaseClient
      .storage
      .from('room-audio')
      .getPublicUrl(fileName)

    console.log('Audio generated and stored:', fileName)

    return new Response(
      JSON.stringify({ audioUrl: urlData.publicUrl, cached: false }),
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
