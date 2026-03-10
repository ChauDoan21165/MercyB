import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

import { compareTranscript } from "../_shared/speech/compareTranscript.ts";
import { mapSpeechIntent } from "../_shared/speech/mapSpeechIntent.ts";
import { buildSpeechFeedback } from "../_shared/speech/buildSpeechFeedback.ts";
import type { SpeechAnalysisResponse } from "../_shared/speech/speechTypes.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const openAiApiKey = Deno.env.get("OPENAI_API_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!openAiApiKey) return jsonError("Missing OPENAI_API_KEY", 500);
    if (!supabaseUrl || !supabaseAnonKey) return jsonError("Missing Supabase environment variables", 500);

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: req.headers.get("Authorization") ?? "",
        },
      },
    });

    // 0. AUTH & ACCESS CHECK
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return jsonError("Unauthorized", 401);

    // Fetch user profile to check subscription status
    const { data: profile } = await supabase
      .from('profiles')
      .select('plan_type, access_expires_at')
      .eq('id', user.id)
      .single();

    const planType = profile?.plan_type || 'FREE';
    const expiresAt = profile?.access_expires_at ? new Date(profile.access_expires_at) : null;
    const isExpired = expiresAt && new Date() > expiresAt;

    // Gatekeeper: Free trial limit (e.g., if no expiry set yet or if date passed)
    if (planType === 'FREE' && (isExpired || !expiresAt)) {
      return jsonError("Your free trial has ended. Upgrade to 3-Month or Lifetime access to continue.", 403);
    }

    const formData = await req.formData();
    const audioFile = formData.get("audio");
    const roomId = String(formData.get("roomId") ?? "");
    const lineId = String(formData.get("lineId") ?? "");
    const targetText = String(formData.get("targetText") ?? "");
    
    const userOrigin = String(formData.get("userOrigin") ?? "OTHER");
    // Use the database plan type as the source of truth for the tier
    const tierLevel = planType; 

    if (!(audioFile instanceof File)) return jsonError("Missing audio file", 400);
    if (!targetText.trim()) return jsonError("Missing targetText", 400);

    // 1. Transcription via OpenAI
    const openAiForm = new FormData();
    openAiForm.append("file", audioFile);
    openAiForm.append("model", "whisper-1"); 

    const transcriptionResponse = await fetch(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${openAiApiKey}` },
        body: openAiForm,
      },
    );

    if (!transcriptionResponse.ok) {
      const errorText = await transcriptionResponse.text();
      return jsonError(`Transcription failed: ${errorText}`, 500);
    }

    const transcriptionJson = await transcriptionResponse.json();
    const transcript = String(transcriptionJson.text ?? "").trim();

    // 2. Run logic
    const comparison = compareTranscript(targetText, transcript);
    const intent = mapSpeechIntent(transcript, comparison);
    const message = buildSpeechFeedback(intent, comparison);

    // 3. Error Detection
    let errorCode = null;
    if (targetText.toLowerCase().endsWith('s') && !transcript.toLowerCase().endsWith('s')) {
      errorCode = 'MISSING_FINAL_S';
    } else if (targetText.toLowerCase().includes('r') && transcript.toLowerCase().includes('z')) {
      errorCode = 'R_Z_CONFUSION';
    }

    const response: SpeechAnalysisResponse = {
      transcript,
      normalizedTranscript: comparison.normalizedTranscript,
      normalizedTarget: comparison.normalizedTarget,
      matchScore: comparison.matchScore,
      missingWords: comparison.missingWords,
      extraWords: comparison.extraWords,
      intent,
      message,
    };

    // 4. Persistence
    await supabase.from("speech_attempts").insert({
      user_id: user.id,
      room_id: roomId || null,
      line_id: lineId || null,
      tier_level: tierLevel,
      target_text: targetText,
      transcript,
      normalized_target: comparison.normalizedTarget,
      normalized_transcript: comparison.normalizedTranscript,
      match_score: comparison.matchScore,
      missing_words: comparison.missingWords,
      extra_words: comparison.extraWords,
      feedback_message: message,
      error_code: errorCode,
      user_origin: userOrigin,
    });

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error(error);
    return jsonError(error instanceof Error ? error.message : "Unknown error", 500);
  }
});

function jsonError(message: string, status = 500): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}