/**
 * OpenAI TTS Utility
 * Generates MP3 audio from text using OpenAI's TTS API
 */

export interface TtsParams {
  text: string;
  voice?: 'nova' | 'alloy' | 'echo' | 'fable' | 'onyx' | 'shimmer';
  language: 'en' | 'vi';
  model?: 'tts-1' | 'tts-1-hd';
}

export interface TtsResult {
  audioBuffer: ArrayBuffer;
  contentType: string;
}

/**
 * Generate TTS audio using OpenAI API
 * Returns the audio buffer for storage
 */
export async function generateTtsAudio(params: TtsParams): Promise<TtsResult> {
  const { text, voice = 'nova', model = 'tts-1' } = params;
  
  const apiKey = Deno.env.get('OPENAI_API_KEY');
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  if (!text || text.trim().length === 0) {
    throw new Error('Text cannot be empty');
  }

  // Limit text length to avoid excessive API costs
  if (text.length > 4096) {
    throw new Error('Text too long (max 4096 characters)');
  }

  console.log(`[TTS] Generating audio: voice=${voice}, model=${model}, text_length=${text.length}`);

  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      input: text,
      voice,
      response_format: 'mp3',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[TTS] OpenAI API error: ${response.status}`, errorText);
    throw new Error(`OpenAI TTS failed: ${response.status} - ${errorText}`);
  }

  const audioBuffer = await response.arrayBuffer();
  console.log(`[TTS] Generated ${audioBuffer.byteLength} bytes of audio`);

  return {
    audioBuffer,
    contentType: 'audio/mpeg',
  };
}

/**
 * Select appropriate voice based on language
 * Vietnamese content uses 'nova' (clearer pronunciation)
 * English content uses 'alloy' (natural American accent)
 */
export function selectVoiceForLanguage(language: 'en' | 'vi'): 'nova' | 'alloy' {
  return language === 'vi' ? 'nova' : 'alloy';
}
