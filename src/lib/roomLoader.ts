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

    // Extract keywords robustly
    let keywordMenu: { en: string[]; vi: string[] } = { en: [], vi: [] };
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

    // Build merged entries and normalize audio path to lowercase snake_case (no playback fallback anywhere)
    const merged = Array.isArray(jsonData?.entries) ? (jsonData.entries as any[]).map((entry: any) => {
      let audioPath = entry?.audio ? String(entry.audio).replace(/^\//, '') : undefined;
      if (audioPath) {
        // Force lowercase snake_case: spaces/hyphens → underscores, remove capitals
        audioPath = audioPath.toLowerCase().replace(/[\s-]+/g, '_');
      }
      return {
        ...entry,
        audio: audioPath ? `/${audioPath}` : undefined,
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
