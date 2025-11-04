import { PUBLIC_ROOM_MANIFEST } from "./roomManifest";

export const loadMergedRoom = async (roomId: string, tier: string = 'free') => {
  // Normalize key to include tier suffix
  const hasTier = /(\-|_)(free|vip1|vip2|vip3)$/.test(roomId);
  const normalizedTier = ['free','vip1','vip2','vip3'].includes(tier) ? tier : 'free';
  const manifestKey = hasTier ? roomId.replace(/_/g, '-') : `${roomId.replace(/_/g, '-')}-${normalizedTier}`;

  try {
    // Prefer manifest mapping in public root
    const filename = PUBLIC_ROOM_MANIFEST[manifestKey];
    let jsonData: any = null;

    // Try multiple filename candidates to handle casing/spacing differences
    const candidates: string[] = [];
    if (filename) candidates.push(`/${encodeURI(filename)}`);

    // Derive from manifestKey (e.g., meaning-of-life-free -> meaning_of_life_free.json)
    const base = manifestKey.replace(/-/g, '_');
    candidates.push(`/${base}.json`);
    candidates.push(`/${base.toLowerCase()}.json`);

    // TitleCase variant: Meaning_Of_Life_Free.json
    const titleCase = base
      .split('_')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join('_');
    candidates.push(`/${titleCase}.json`);

    // Attempt to fetch each candidate
    for (const path of candidates) {
      try {
        const resp = await fetch(path);
        if (!resp.ok) continue;
        // Guard: JSON parse may fail if HTML returned
        const text = await resp.text();
        try {
          jsonData = JSON.parse(text);
          break;
        } catch {
          // not valid JSON, try next candidate
          continue;
        }
      } catch {
        // try next
      }
    }

    if (!jsonData) {
      throw new Error(`JSON not found for ${manifestKey} in candidates: ${candidates.join(', ')}`);
    }

    // Extract keywords robustly - check both root level and entry level
    let keywordMenu: { en: string[]; vi: string[] } = { en: [], vi: [] };
    
    // Try root-level keywords in multiple formats
    // Format 1: keywords_en / keywords_vi (separate properties)
    if (Array.isArray(jsonData?.keywords_en) || Array.isArray(jsonData?.keywords_vi)) {
      keywordMenu = {
        en: Array.isArray(jsonData.keywords_en) ? jsonData.keywords_en : [],
        vi: Array.isArray(jsonData.keywords_vi) ? jsonData.keywords_vi : []
      };
    }
    // Format 2: keywords.en / keywords.vi (nested object)
    else {
      const kw = jsonData?.keywords;
      if (kw) {
        if (Array.isArray(kw.en) || Array.isArray(kw.vi)) {
          keywordMenu = {
            en: Array.isArray(kw.en) ? kw.en : [],
            vi: Array.isArray(kw.vi) ? kw.vi : []
          };
        } else if (typeof kw === 'object') {
          // Flatten grouped keywords into simple lists
          const enList: string[] = [];
          const viList: string[] = [];
          Object.values(kw).forEach((g: any) => {
            if (Array.isArray(g?.en)) enList.push(...g.en);
            if (Array.isArray(g?.vi)) viList.push(...g.vi);
          });
          keywordMenu = { en: enList, vi: viList };
        }
      }
    }
    
    // If no root keywords found, extract concise menu from entries
    if (keywordMenu.en.length === 0 && keywordMenu.vi.length === 0 && Array.isArray(jsonData?.entries)) {
      const enList: string[] = [];
      const viList: string[] = [];

      (jsonData.entries as any[])
        // Prefer entries that have audio files to avoid non-functional keywords
        .filter((e: any) => !!e?.audio)
        .forEach((entry: any) => {
          const en = Array.isArray(entry.keywords_en) && entry.keywords_en.length > 0
            ? String(entry.keywords_en[0])
            : String(entry.title || entry.slug || '').trim();
          const vi = Array.isArray(entry.keywords_vi) && entry.keywords_vi.length > 0
            ? String(entry.keywords_vi[0])
            : '';
          if (en) {
            enList.push(en);
            viList.push(vi);
          }
        });

      keywordMenu = { en: enList, vi: viList };
    }

    // Build merged entries and normalize audio path to /audio/ directory
    const merged = Array.isArray(jsonData?.entries) ? (jsonData.entries as any[]).map((entry: any, idx: number) => {
      let audioPath = entry?.audio ? String(entry.audio).replace(/^\//, '') : undefined;
      if (audioPath) {
        // Ensure audio files are in /audio/ directory
        if (!audioPath.startsWith('audio/')) {
          audioPath = `audio/${audioPath}`;
        }
      }
      
      // Extract primary keyword (first keyword from arrays) for matching
      const keywordEn = Array.isArray(entry.keywords_en) && entry.keywords_en.length > 0 
        ? entry.keywords_en[0] 
        : entry.title || `entry-${idx}`;
      const keywordVi = Array.isArray(entry.keywords_vi) && entry.keywords_vi.length > 0 
        ? entry.keywords_vi[0] 
        : '';
      
      // Extract essay/reply content
      const replyEn = entry.reply_en || entry.essay_en || entry.content_en || entry.copy?.en || entry.essay?.en || '';
      const replyVi = entry.reply_vi || entry.essay_vi || entry.content_vi || entry.copy?.vi || entry.essay?.vi || '';
      
      return {
        ...entry,
        audio: audioPath ? `/${audioPath}` : undefined,
        keywordEn,
        keywordVi,
        replyEn,
        replyVi
      };
    }) : [];

    return {
      merged,
      keywordMenu,
      audioBasePath: '/audio/'
    };
  } catch (error) {
    console.error('Failed to load room:', error);
    return {
      merged: [],
      keywordMenu: { en: [], vi: [] },
      audioBasePath: '/'
    };
  }
};
