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
  
  // Build file paths: try both Title Case and lowercase patterns
  const titleCasePath = `/${roomName}_${tierSuffix}.json`;
  const lowercasePath = `/${roomNameParts.join('_')}_${extractedTier}.json`;
  
  try {
    // Try multiple path patterns and fall back to Free tier if needed
    const pathsToTry: string[] = [];
    const underscore = roomNameParts.join('_');
    const kebab = roomNameParts.join('-');

    // Current tier patterns
    pathsToTry.push(
      `/${roomName}_${tierSuffix}.json`,               // Title Case + Suffix (Free/VIPx)
      `/${underscore}_${extractedTier}.json`,          // underscore + lowercase tier
      `/tiers/${extractedTier}/${underscore}/${underscore}_${extractedTier}.json`, // nested underscore
      `/tiers/${extractedTier}/${kebab}/${kebab}_${extractedTier}.json`            // nested kebab
    );

    // Free tier fallback if not already free
    if (extractedTier !== 'free') {
      pathsToTry.push(
        `/${roomName}_Free.json`,
        `/${underscore}_free.json`,
        `/tiers/free/${underscore}/${underscore}_free.json`,
        `/tiers/free/${kebab}/${kebab}_free.json`
      );
    }

    let res: Response | null = null;
    let data: any = null;

    for (const p of pathsToTry) {
      try {
        const r = await fetch(p);
        if (r.ok) {
          res = r;
          data = await r.json();
          break;
        }
      } catch {}
    }

    if (!res || !data) {
      console.warn(`JSON not found. Tried: ${pathsToTry.join(', ')}`);
      return { merged: [], keywordMenu: { en: [], vi: [] }, audioBasePath: '/' };
    }
    
    // Extract entries first
    const entries = Array.isArray(data.entries) ? data.entries : [];
    
    // Extract keywords - try top-level first, then collect from entries
    let keywordsEn = Array.isArray(data.keywords_en) ? data.keywords_en : [];
    let keywordsVi = Array.isArray(data.keywords_vi) ? data.keywords_vi : [];
    
    // If no top-level keywords, collect unique keywords from all entries
    if (keywordsEn.length === 0 && entries.length > 0) {
      const uniqueEn = new Set<string>();
      const uniqueVi = new Set<string>();
      
      entries.forEach((e: any) => {
        const entryKeywordsEn = Array.isArray(e.keywords_en) ? e.keywords_en : [];
        const entryKeywordsVi = Array.isArray(e.keywords_vi) ? e.keywords_vi : [];
        
        entryKeywordsEn.forEach(k => uniqueEn.add(k));
        entryKeywordsVi.forEach(k => uniqueVi.add(k));
      });
      
      keywordsEn = Array.from(uniqueEn);
      keywordsVi = Array.from(uniqueVi);
    }
    
    // If still no keywords, derive from slugs/titles
    if (keywordsEn.length === 0 && entries.length > 0) {
      const derived = new Set<string>();
      const derivedVi = new Set<string>();
      entries.forEach((e: any) => {
        const en = e.slug || e.id || e.title?.en || e.title || '';
        const vi = e.title?.vi || en;
        if (en) derived.add(String(en));
        if (vi) derivedVi.add(String(vi));
      });
      keywordsEn = Array.from(derived);
      if (derivedVi.size > 0) {
        keywordsVi = Array.from(derivedVi);
      }
    }
    
    // Fallback: if still no Vietnamese keywords, use English
    if (keywordsVi.length === 0) {
      keywordsVi = keywordsEn;
    }
    
    // Build merged entries - handle multiple JSON structures
    const merged: MergedEntry[] = entries.map((e: any) => {
      const keywordEn = String(
        e.keyword_en || e.keywords_en?.[0] || e.slug || e.id || e.title?.en || e.title || ''
      ).trim();
      const keywordVi = String(
        e.keyword_vi || e.keywords_vi?.[0] || e.title?.vi || keywordEn
      ).trim();
      
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
      
      // Handle audio: can be string or object with .en field
      let audioRaw = '';
      if (typeof e.audio === 'string') {
        audioRaw = e.audio;
      } else if (e.audio?.en) {
        audioRaw = e.audio.en;
      }
      
      // Normalize audio path: preserve subfolders, ensure leading slash
      const audio = audioRaw.trim() 
        ? (audioRaw.startsWith('/') ? audioRaw : `/${audioRaw}`)
        : '';
      
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
