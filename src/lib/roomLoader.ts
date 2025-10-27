export type MergedEntry = {
  titleEn: string;
  essayEn: string;
  titleVi?: string;
  essayVi?: string;
  audio: string;
  slug?: string;
};

function toFileName(roomId: string, tier: string): string {
  // stress -> stress_vip3.json, mental-health -> mental_health_vip2.json
  const base = String(roomId || '').trim().toLowerCase().replace(/-/g, '_');
  const suffix = tier.toLowerCase();
  return `/${base}_${suffix}.json`;
}

function formatKeyword(keywords: string[]): string {
  // Take first keyword and capitalize properly
  if (!keywords || keywords.length === 0) return '';
  return keywords[0]
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export async function loadMergedRoom(roomId: string, tier: 'free' | 'vip1' | 'vip2' | 'vip3') {
  const fileName = toFileName(roomId, tier);
  
  try {
    const res = await fetch(fileName);
    if (!res.ok) {
      console.warn(`Failed to load ${fileName}`);
      return { merged: [], keywordMenu: { en: [], vi: [] } };
    }
    
    const data = await res.json();
    const entries = Array.isArray(data?.entries) ? data.entries : [];
    
    const merged: MergedEntry[] = entries.map((e: any) => ({
      titleEn: formatKeyword(e?.keywords || []),
      essayEn: String(e?.reply_en || ''),
      titleVi: formatKeyword(e?.keywords || []),
      essayVi: String(e?.reply_vi || ''),
      audio: String(e?.audio || ''),
      slug: String(e?.slug || ''),
    }));
    
    const keywordMenu = {
      en: merged.map(m => m.titleEn).filter(Boolean),
      vi: merged.map(m => m.titleVi).filter(Boolean),
    };
    
    return { merged, keywordMenu };
  } catch (error) {
    console.error(`Error loading room ${roomId} tier ${tier}:`, error);
    return { merged: [], keywordMenu: { en: [], vi: [] } };
  }
}
