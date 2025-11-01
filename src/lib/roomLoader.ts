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

    if (filename) {
      const url = `/${encodeURI(filename)}`;
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`JSON not found for ${manifestKey} at ${url}`);
      jsonData = await resp.json();
    } else {
      // Compatibility fallback to old /data/{tier}/{room}.json structure
      const roomName = manifestKey.replace(/-/g, '_');
      const tierToken = manifestKey.endsWith('-free') ? 'free' : manifestKey.match(/-(vip\d)$/)?.[1] || normalizedTier;
      const tierPath = tierToken === 'free' ? 'free' : `vip${tierToken.replace('vip', '')}`;
      const url = `/data/${tierPath}/${roomName}.json`;
      const resp = await fetch(url);
      if (!resp.ok) throw new Error('JSON not found');
      jsonData = await resp.json();
    }

    // Extract keywords robustly - check both root level and entry level
    let keywordMenu: { en: string[]; vi: string[] } = { en: [], vi: [] };
    const kw = jsonData?.keywords;
    
    // First try root-level keywords
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
    
    // If no root keywords found, extract from entries
    if (keywordMenu.en.length === 0 && keywordMenu.vi.length === 0 && Array.isArray(jsonData?.entries)) {
      const enSet = new Set<string>();
      const viSet = new Set<string>();
      
      jsonData.entries.forEach((entry: any) => {
        // Check for keywords_en and keywords_vi
        if (Array.isArray(entry.keywords_en)) {
          entry.keywords_en.forEach((kw: string) => enSet.add(kw));
        }
        if (Array.isArray(entry.keywords_vi)) {
          entry.keywords_vi.forEach((kw: string) => viSet.add(kw));
        }
      });
      
      keywordMenu = {
        en: Array.from(enSet),
        vi: Array.from(viSet)
      };
    }

    // Build merged entries and normalize audio path to lowercase snake_case (no playback fallback anywhere)
    const merged = Array.isArray(jsonData?.entries) ? (jsonData.entries as any[]).map((entry: any, idx: number) => {
      let audioPath = entry?.audio ? String(entry.audio).replace(/^\//, '') : undefined;
      if (audioPath) {
        // Force lowercase snake_case: spaces/hyphens → underscores, remove capitals
        audioPath = audioPath.toLowerCase().replace(/[\s-]+/g, '_');
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
      audioBasePath: '/'
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
