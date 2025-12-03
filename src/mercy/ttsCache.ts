/**
 * TTS Cache wrapper - ensures mercy audio exists before playing
 * Uses cached audio from library when available, only calls TTS for truly new content
 */

import { getMercyReply, type MercyReplyId } from './replies';

/**
 * Ensure mercy audio is available for a reply
 * Returns the audio path if available, undefined if not
 * 
 * For library replies: always uses cached path from JSON
 * For dynamic content: could call TTS (not implemented yet - returns undefined)
 */
export async function ensureMercyAudio(
  id: MercyReplyId,
  lang: 'en' | 'vi',
  _text?: string // text param for future dynamic TTS, currently unused
): Promise<string | undefined> {
  try {
    const reply = await getMercyReply(id);
    if (!reply) {
      console.warn(`Mercy reply not found: ${id}`);
      return undefined;
    }

    const audioPath = lang === 'en' ? reply.audio_en : reply.audio_vi;
    
    // For library replies, we trust the audio path exists
    // In the future, we could add a check to verify file exists
    // and call TTS generator if missing
    return audioPath;
  } catch (err) {
    console.error('Error ensuring mercy audio:', err);
    return undefined;
  }
}

/**
 * Check if audio likely exists for a mercy reply
 */
export async function hasMercyAudio(id: MercyReplyId, lang: 'en' | 'vi'): Promise<boolean> {
  const path = await ensureMercyAudio(id, lang);
  return !!path;
}

/**
 * Get both text and audio for a mercy reply
 */
export async function getMercyContent(
  id: MercyReplyId,
  lang: 'en' | 'vi'
): Promise<{ text: string; audio?: string } | null> {
  try {
    const reply = await getMercyReply(id);
    if (!reply) {
      return null;
    }

    return {
      text: lang === 'en' ? reply.text_en : reply.text_vi,
      audio: lang === 'en' ? reply.audio_en : reply.audio_vi,
    };
  } catch {
    return null;
  }
}

/**
 * Get bilingual content for a mercy reply
 */
export async function getMercyBilingualContent(
  id: MercyReplyId
): Promise<{
  text_en: string;
  text_vi: string;
  audio_en?: string;
  audio_vi?: string;
} | null> {
  try {
    const reply = await getMercyReply(id);
    if (!reply) {
      return null;
    }

    return {
      text_en: reply.text_en,
      text_vi: reply.text_vi,
      audio_en: reply.audio_en,
      audio_vi: reply.audio_vi,
    };
  } catch {
    return null;
  }
}
