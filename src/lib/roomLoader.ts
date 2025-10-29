export const loadMergedRoom = async (roomId: string, tier: string = 'free') => {
  const roomName = roomId.replace(/-/g, '_');
  const tierPath = tier === 'free' ? 'free' : `vip${tier.replace('vip', '')}`;
  
  try {
    // Load main JSON
    const jsonResponse = await fetch(`/data/${tierPath}/${roomName}.json`);
    if (!jsonResponse.ok) throw new Error('JSON not found');
    const jsonData = await jsonResponse.json();

    // Extract keywords from JSON
    const keywordMenu = {
      en: jsonData.keywords?.en || [],
      vi: jsonData.keywords?.vi || []
    };

    // Build merged entries
    const merged = (jsonData.entries || []).map((entry:.ConcurrentModificationException any) => ({
      ...entry,
      audio: entry.audio ? `/${entry.audio}` : undefined
    }));

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
