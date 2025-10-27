export type MergedEntry = {
  keywordEn: string;
  keywordVi: string;
  replyEn: string;
  replyVi: string;
  audio: string;
};

/**
 * Load room data from NEW structure:
 * - English: /public/audio/en/{room}_{tier}.json
 * - Vietnamese: /public/audio/vn/{room}_{tier}.json
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
  // Convert kebab-case to snake_case: stoicism-vip3 -> stoicism_vip3
  const roomName = String(roomId || '').trim().toLowerCase().replace(/-/g, '_');
  
  // Build file paths
  const enPath = `/audio/en/${roomName}.json`;
  const vnPath = `/audio/vn/${roomName}.json`;
  
  try {
    // Load English JSON
    const enRes = await fetch(enPath);
    if (!enRes.ok) {
      console.warn(`English JSON not found: ${enPath}`);
      return { merged: [], keywordMenu: { en: [], vi: [] } };
    }
    const enData = await enRes.json();
    
    // Load Vietnamese JSON (optional)
    let vnData: any = null;
    try {
      const vnRes = await fetch(vnPath);
      if (vnRes.ok) {
        vnData = await vnRes.json();
      }
    } catch (e) {
      console.info(`Vietnamese JSON not found (optional): ${vnPath}`);
    }
    
    // Extract top-level keywords
    const keywordsEn = Array.isArray(enData.keywords_en) ? enData.keywords_en : [];
    const keywordsVi = Array.isArray(vnData?.keywords_vi) ? vnData.keywords_vi : 
                       Array.isArray(enData.keywords_vi) ? enData.keywords_vi : 
                       keywordsEn;
    
    // Extract entries
    const entries = Array.isArray(enData.entries) ? enData.entries : [];
    
    // Build merged entries
    const merged: MergedEntry[] = entries.map((e: any) => {
      const keywordEn = String(e.keyword_en || '').trim();
      const keywordVi = String(e.keyword_vi || keywordEn).trim();
      const replyEn = String(e.reply_en || '').trim();
      const replyVi = String(e.reply_vi || '').trim();
      const audio = String(e.audio || '').trim();
      
      return { keywordEn, keywordVi, replyEn, replyVi, audio };
    });
    
    return {
      merged,
      keywordMenu: {
        en: keywordsEn,
        vi: keywordsVi
      }
    };
  } catch (error) {
    console.error(`Error loading room ${roomId} tier ${tier}:`, error);
    return { merged: [], keywordMenu: { en: [], vi: [] } };
  }
}
