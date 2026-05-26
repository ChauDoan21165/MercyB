import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.1";
import { generateTtsAudio, selectVoiceForLanguage } from "../_shared/openai-tts.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, mb-admin-token',
};

type WarmthCategory =
  | 'firstImpression'
  | 'roomEntry'
  | 'audioStart'
  | 'afterAudio'
  | 'reflectionIntro'
  | 'reflectionThanks'
  | 'returnAfterGap'
  | 'welcome';

interface GenerateWarmthAudioRequest {
  category: WarmthCategory;
  language: 'en' | 'vi';
  text: string;
  filename: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify admin token for security
    const adminToken = req.headers.get('mb-admin-token');
    const expectedToken = Deno.env.get('MB_ADMIN_TOKEN');
    
    if (!expectedToken) {
      console.error('[generate-warmth-audio] MB_ADMIN_TOKEN not configured');
      return new Response(
        JSON.stringify({ ok: false, error: 'Server misconfiguration' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (adminToken !== expectedToken) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const body: GenerateWarmthAudioRequest = await req.json();
    const { category, language, text, filename } = body;

    // Validate required fields
    if (!category || !language || !text || !filename) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Missing required fields: category, language, text, filename' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[generate-warmth-audio] Generating: category=${category}, lang=${language}, filename=${filename}`);

    // Generate TTS audio
    const selectedVoice = selectVoiceForLanguage(language);
    const { audioBuffer } = await generateTtsAudio({
      text,
      voice: selectedVoice,
      language,
      model: 'tts-1',
    });

    // Initialize Supabase admin client for storage
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Determine storage path based on category
    let storagePath: string;
    if (category === 'welcome') {
      storagePath = `welcome/${filename}`;
    } else {
      storagePath = `warmth/${filename}`;
    }

    // Upload to Supabase Storage (audio bucket)
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('audio')
      .upload(storagePath, audioBuffer, {
        contentType: 'audio/mpeg',
        upsert: true, // Replace if exists
      });

    if (uploadError) {
      console.error('[generate-warmth-audio] Storage upload error:', uploadError);
      return new Response(
        JSON.stringify({ ok: false, error: `Storage upload failed: ${uploadError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('audio')
      .getPublicUrl(storagePath);

    const publicUrl = urlData.publicUrl;
    console.log(`[generate-warmth-audio] Uploaded successfully: ${publicUrl}`);

    return new Response(
      JSON.stringify({
        ok: true,
        filePath: `/audio/${storagePath}`,
        publicUrl,
        filename,
        category,
        language,
        bytesGenerated: audioBuffer.byteLength,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[generate-warmth-audio] Error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
