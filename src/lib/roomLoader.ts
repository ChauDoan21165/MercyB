export type MergedEntry = {
  titleEn: string;
  essayEn: string;
  titleVi?: string;
  essayVi?: string;
  audio: string;
  slug?: string;
};

function toFileName(roomId: string, tier: string): string {
  // Example: roomId 'sleep-improvement-vip3' + tier 'vip3' -> '/sleep_improvement_vip3.json'
  const raw = String(roomId || '').trim().toLowerCase().replace(/-/g, '_');
  // Remove trailing _vipX or _free if present in roomId
  const cleaned = raw.replace(/_(vip[123]|free)$/, '');
  const suffix = String(tier || 'free').toLowerCase();
  return `/${cleaned}_${suffix}.json`;
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
  // Build candidate filenames for robustness (e.g., sleep_improvement -> sleep)
  const raw = String(roomId || '').trim().toLowerCase().replace(/-/g, '_');
  const cleaned = raw.replace(/_(vip[123]|free)$/, '');
  const primary = cleaned.split('_')[0];
  const suffix = String(tier || 'free').toLowerCase();
  const candidates = Array.from(new Set([
    `/${cleaned}_${suffix}.json`,
    `/${primary}_${suffix}.json`,
  ]));
  
  try {
    let data: any = null;
    let usedUrl = '';
    for (const url of candidates) {
      const res = await fetch(url);
      if (res.ok) {
        data = await res.json();
        usedUrl = url;
        break;
      }
    }
    if (!data) {
      console.warn(`Failed to load any of: ${candidates.join(', ')}`);
      return { merged: [], keywordMenu: { en: [], vi: [] } };
    }
    
    const entries = Array.isArray(data?.entries) ? data.entries : [];

    const merged: MergedEntry[] = entries.map((e: any) => {
      const titleEn = e?.en?.title || e?.title?.en || e?.title || formatKeyword(e?.keywords || []) || String(e?.slug || '').replace(/[-_]/g, ' ');
      const titleVi = e?.vi?.title || e?.title?.vi || titleEn;
      const essayEn = e?.en?.essay || e?.content?.en || e?.reply_en || e?.essay_en || '';
      const essayVi = e?.vi?.essay || e?.content?.vi || e?.reply_vi || e?.essay_vi || '';
      const audio = String(e?.audio || '');
      const slug = String(e?.slug || '');
      return { titleEn, essayEn: String(essayEn), titleVi, essayVi: String(essayVi), audio, slug };
    });
    
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
