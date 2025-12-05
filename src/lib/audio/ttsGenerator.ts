/**
 * TTS Audio Generator v1.0
 * Phase 5: Missing Audio Auto-Generation
 * 
 * Provides TTS generation interface for missing audio files.
 * Uses a pluggable provider pattern (OpenAI TTS, Google TTS, etc.)
 * 
 * For Phase 5, this is a stub that prepares the infrastructure.
 * Actual TTS calls are made via the edge function.
 */

import { getCanonicalAudioForRoom, normalizeRoomId, normalizeEntrySlug } from './globalConsistencyEngine';

// ============================================
// Types
// ============================================

export interface TTSRequest {
  roomId: string;
  entrySlug: string | number;
  text: string;
  language: 'en' | 'vi';
  voice?: string;
  model?: 'tts-1' | 'tts-1-hd';
}

export interface TTSResult {
  success: boolean;
  filename: string;
  audioUrl?: string;
  error?: string;
  generatedAt: string;
  provider: string;
  durationMs?: number;
}

export interface MissingAudioEntry {
  roomId: string;
  entrySlug: string | number;
  language: 'en' | 'vi';
  canonicalFilename: string;
  text?: string;
}

export interface AudioGenerationPlan {
  roomId: string;
  totalMissing: number;
  missingEn: MissingAudioEntry[];
  missingVi: MissingAudioEntry[];
  estimatedCost?: number;
}

// ============================================
// Generation Planning
// ============================================

/**
 * Create a generation plan for missing audio in a room
 */
export function createGenerationPlan(
  roomId: string,
  entries: Array<{
    slug?: string;
    id?: string | number;
    artifact_id?: string;
    copy_en?: string;
    copy_vi?: string;
    audio?: { en?: string; vi?: string } | string;
  }>,
  existingFiles: Set<string>
): AudioGenerationPlan {
  const missingEn: MissingAudioEntry[] = [];
  const missingVi: MissingAudioEntry[] = [];
  
  entries.forEach((entry, index) => {
    const slug = entry.slug || entry.artifact_id || entry.id || index;
    const canonical = getCanonicalAudioForRoom(roomId, slug);
    
    // Check EN
    if (!existingFiles.has(canonical.en.toLowerCase())) {
      missingEn.push({
        roomId,
        entrySlug: slug,
        language: 'en',
        canonicalFilename: canonical.en,
        text: entry.copy_en,
      });
    }
    
    // Check VI
    if (!existingFiles.has(canonical.vi.toLowerCase())) {
      missingVi.push({
        roomId,
        entrySlug: slug,
        language: 'vi',
        canonicalFilename: canonical.vi,
        text: entry.copy_vi,
      });
    }
  });
  
  return {
    roomId,
    totalMissing: missingEn.length + missingVi.length,
    missingEn,
    missingVi,
    estimatedCost: (missingEn.length + missingVi.length) * 0.015, // ~$0.015 per file
  };
}

/**
 * Generate missing audio for a single entry
 * This is a stub that calls the edge function
 */
export async function generateMissingAudio(
  request: TTSRequest,
  supabaseClient: any // SupabaseClient type
): Promise<TTSResult> {
  const canonical = getCanonicalAudioForRoom(request.roomId, request.entrySlug);
  const filename = canonical[request.language];
  
  try {
    const { data, error } = await supabaseClient.functions.invoke('generate-room-audio', {
      body: {
        text: request.text,
        language: request.language,
        voice: request.voice || (request.language === 'vi' ? 'nova' : 'alloy'),
        model: request.model || 'tts-1',
        filename,
        roomId: request.roomId,
      },
    });
    
    if (error) {
      return {
        success: false,
        filename,
        error: error.message || 'TTS generation failed',
        generatedAt: new Date().toISOString(),
        provider: 'openai',
      };
    }
    
    return {
      success: true,
      filename,
      audioUrl: data?.url,
      generatedAt: new Date().toISOString(),
      provider: 'openai',
      durationMs: data?.durationMs,
    };
  } catch (err) {
    return {
      success: false,
      filename,
      error: err instanceof Error ? err.message : 'Unknown error',
      generatedAt: new Date().toISOString(),
      provider: 'openai',
    };
  }
}

/**
 * Batch generate missing audio for a room
 */
export async function batchGenerateMissingAudio(
  plan: AudioGenerationPlan,
  supabaseClient: any,
  onProgress?: (completed: number, total: number, current: string) => void
): Promise<{
  successful: TTSResult[];
  failed: TTSResult[];
}> {
  const successful: TTSResult[] = [];
  const failed: TTSResult[] = [];
  
  const allMissing = [...plan.missingEn, ...plan.missingVi];
  const total = allMissing.length;
  
  for (let i = 0; i < allMissing.length; i++) {
    const entry = allMissing[i];
    
    if (onProgress) {
      onProgress(i, total, entry.canonicalFilename);
    }
    
    if (!entry.text) {
      failed.push({
        success: false,
        filename: entry.canonicalFilename,
        error: 'No text provided for TTS',
        generatedAt: new Date().toISOString(),
        provider: 'openai',
      });
      continue;
    }
    
    const result = await generateMissingAudio({
      roomId: entry.roomId,
      entrySlug: entry.entrySlug,
      text: entry.text,
      language: entry.language,
    }, supabaseClient);
    
    if (result.success) {
      successful.push(result);
    } else {
      failed.push(result);
    }
    
    // Rate limiting - 1 second between calls
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  if (onProgress) {
    onProgress(total, total, 'Complete');
  }
  
  return { successful, failed };
}

// ============================================
// Cross-Language Expansion
// ============================================

/**
 * Check if EN exists but VI is missing (or vice versa)
 * For auto-generating the missing language variant
 */
export function detectCrossLanguageGaps(
  roomId: string,
  entries: Array<{
    slug?: string;
    id?: string | number;
    artifact_id?: string;
    copy_en?: string;
    copy_vi?: string;
  }>,
  existingFiles: Set<string>
): {
  enExistsViMissing: MissingAudioEntry[];
  viExistsEnMissing: MissingAudioEntry[];
} {
  const enExistsViMissing: MissingAudioEntry[] = [];
  const viExistsEnMissing: MissingAudioEntry[] = [];
  
  entries.forEach((entry, index) => {
    const slug = entry.slug || entry.artifact_id || entry.id || index;
    const canonical = getCanonicalAudioForRoom(roomId, slug);
    
    const hasEn = existingFiles.has(canonical.en.toLowerCase());
    const hasVi = existingFiles.has(canonical.vi.toLowerCase());
    
    if (hasEn && !hasVi && entry.copy_vi) {
      enExistsViMissing.push({
        roomId,
        entrySlug: slug,
        language: 'vi',
        canonicalFilename: canonical.vi,
        text: entry.copy_vi,
      });
    }
    
    if (hasVi && !hasEn && entry.copy_en) {
      viExistsEnMissing.push({
        roomId,
        entrySlug: slug,
        language: 'en',
        canonicalFilename: canonical.en,
        text: entry.copy_en,
      });
    }
  });
  
  return { enExistsViMissing, viExistsEnMissing };
}
