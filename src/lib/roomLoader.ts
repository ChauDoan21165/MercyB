export type MergedEntry = {
  keywordEn: string;
  keywordVi: string;
  replyEn: string;
  replyVi: string;
  audio: string;
};

export type MergedRoomData = {
  merged: MergedEntry[];
  keywordMenu: {
    en: string[];
    vi: string[];
  };
  audioBasePath: string;
};

/**
 * Load room data from flat public structure:
 * - Path: /public/{Room Name}_{TIER}.json (e.g., "God With Us_VIP3.json")
 * - Audio: /public/*.mp3 (all in root)
 * 
 * JSON format:
 * {
 *   "keywords_en": ["Gratitude", "Inner Peace"],
 *   "keywords_vi": ["Lòng Biết Ơn", "Bình An"],
 *   "entries": [
 *     {
 *       "keyword_en": "Gratitude",
 *       "keyword_vi": "Lòng Biết Ơn",
 *       "reply_en": "English essay...",
 *       "reply_vi": "Vietnamese essay...",
 *       "audio": "Gratitude_VIP3.mp3"
 *     }
 *   ]
 * }
 */
export async function loadMergedRoom(roomId: string, tier: 'free' | 'vip1' | 'vip2' | 'vip3') {
  // Convert roomId (kebab-case) to Room Name format with spaces
  // e.g., "god-with-us" -> "God With Us"
  const parts = String(roomId || '').trim().toLowerCase().split('-');
  const lastPart = parts[parts.length - 1];
  const extractedTier = ['free', 'vip1', 'vip2', 'vip3'].includes(lastPart) ? lastPart : tier;
  const roomNameParts = lastPart === extractedTier ? parts.slice(0, -1) : parts;
  
  // Convert to Title Case with spaces: "god-with-us" -> "God With Us"
  const roomName = roomNameParts
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  // Convert tier to uppercase format: vip3 -> VIP3, free -> Free
  const tierSuffix = extractedTier === 'free' ? 'Free' : extractedTier.toUpperCase();
  
  // Build file path: /Room Name_TIER.json (flat in public root)
  const jsonPath = `/${roomName}_${tierSuffix}.json`;
  
  try {
    // Load JSON from flat public structure
    const res = await fetch(jsonPath);
    if (!res.ok) {
      console.warn(`JSON not found: ${jsonPath}`);
      return { merged: [], keywordMenu: { en: [], vi: [] }, audioBasePath: '/' };
    }
    const data = await res.json();
    
    // Extract top-level keywords
    const keywordsEn = Array.isArray(data.keywords_en) ? data.keywords_en : [];
    const keywordsVi = Array.isArray(data.keywords_vi) ? data.keywords_vi : keywordsEn;
    
    // Extract entries
    const entries = Array.isArray(data.entries) ? data.entries : [];
    
    // Build merged entries - handle multiple JSON structures
    const merged: MergedEntry[] = entries.map((e: any) => {
      const keywordEn = String(e.keyword_en || e.keywords_en?.[0] || '').trim();
      const keywordVi = String(e.keyword_vi || e.keywords_vi?.[0] || keywordEn).trim();
      
      // Try multiple field paths for content: copy.en, reply_en, essay.en, content.en, body.en
      const replyEn = String(
        e.reply_en || 
        e.copy?.en || 
        e.essay?.en || 
        e.content?.en || 
        e.body?.en ||
        e.copy_en ||
        e.essay_en ||
        e.content_en ||
        ''
      ).trim();
      
      const replyVi = String(
        e.reply_vi || 
        e.copy?.vi || 
        e.essay?.vi || 
        e.content?.vi || 
        e.body?.vi ||
        e.copy_vi ||
        e.essay_vi ||
        e.content_vi ||
        ''
      ).trim();
      
      const audio = String(e.audio || '').trim();
      
      return { keywordEn, keywordVi, replyEn, replyVi, audio };
    });
    
    return {
      merged,
      keywordMenu: {
        en: keywordsEn,
        vi: keywordsVi
      },
      audioBasePath: '/' // All audio files in public root
    };
  } catch (error) {
    console.error(`Error loading room ${roomId} tier ${tier}:`, error);
    return { merged: [], keywordMenu: { en: [], vi: [] }, audioBasePath: '/' };
  }
}
