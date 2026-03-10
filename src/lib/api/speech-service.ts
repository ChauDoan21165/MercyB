/**
 * Service: Speech Analysis
 * Path: src/speech/speech-service.ts
 * -----------------------------------------------------------------
 * This file lives in its own directory to maintain modularity. 
 * It manages the multi-part form data upload to Supabase Edge Functions.
 * -----------------------------------------------------------------
 */

import { supabase } from '../integrations/supabase'; // Adjust path to your client

export interface SpeechAnalysisRequest {
  blob: Blob;
  roomId: string;
  lineId: string;
  targetText: string;
  userOrigin: 'HANOI' | 'SAIGON' | 'OTHER';
  tierLevel: 'FREE' | 'VIP1' | 'VIP2' | 'VIP3';
}

/**
 * Sends audio blob and metadata to the 'speech-analyze' Edge Function.
 */
export async function analyzeSpeech({
  blob,
  roomId,
  lineId,
  targetText,
  userOrigin,
  tierLevel
}: SpeechAnalysisRequest) {
  const formData = new FormData();
  
  // 'audio' name must match what the Edge Function expects in its formData
  formData.append('audio', blob, 'recording.webm');
  formData.append('roomId', roomId);
  formData.append('lineId', lineId);
  formData.append('targetText', targetText);
  formData.append('userOrigin', userOrigin);
  formData.append('tierLevel', tierLevel);

  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error("Authentication required.");
  }

  // Uses the Supabase URL from your environment/client config
  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/speech-analyze`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        // Note: Do NOT set 'Content-Type': 'multipart/form-data' manually.
        // The browser needs to set the boundary itself for FormData.
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Speech analysis failed');
  }

  return await response.json();
}