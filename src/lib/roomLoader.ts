export type MergedEntry = {
  titleEn: string;
  essayEn: string;
  titleVi?: string;
  essayVi?: string;
  audio: string; // filename in /public root
};

function toTitleUnderscore(roomId: string): string {
  // stress -> Stress, mental-health -> Mental_Health
  const parts = String(roomId || '')
    .trim()
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase());
  return parts.join('_');
}

function tierToSuffix(tier: 'free' | 'vip1' | 'vip2' | 'vip3'): string {
  switch (tier) {
    case 'vip1': return 'VIP1';
    case 'vip2': return 'VIP2';
    case 'vip3': return 'VIP3';
    default: return 'Free';
  }
}

function norm(s: string) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export async function loadMergedRoom(roomId: string, tier: 'free' | 'vip1' | 'vip2' | 'vip3') {
  const base = toTitleUnderscore(roomId);
  const suf = tierToSuffix(tier);
  const enUrl = `/audio/en/${base}_${suf}.json`;
  const viUrl = `/audio/vn/${base}_${suf}.json`;

  const [enRes, viRes] = await Promise.all([
    fetch(enUrl).then(r => r.ok ? r.json() : { entries: [] }).catch(() => ({ entries: [] })),
    fetch(viUrl).then(r => r.ok ? r.json() : { entries: [] }).catch(() => ({ entries: [] })),
  ]);

  const viMap = new Map<string, { title: string; essay: string }>();
  const viEntries = Array.isArray(viRes?.entries) ? viRes.entries : [];
  for (const e of viEntries) {
    const t = e?.vi?.title ?? e?.title ?? '';
    const essay = e?.vi?.essay ?? e?.essay ?? '';
    if (t) viMap.set(norm(t), { title: String(t), essay: String(essay) });
  }

  const merged: MergedEntry[] = [];
  const enEntries = Array.isArray(enRes?.entries) ? enRes.entries : [];
  for (const e of enEntries) {
    const titleEn = String(e?.en?.title ?? e?.title ?? '');
    const essayEn = String(e?.en?.essay ?? e?.essay ?? '');
    const audio = String(e?.audio || '');
    const viMatch = viMap.get(norm(titleEn));
    merged.push({
      titleEn,
      essayEn,
      titleVi: viMatch?.title,
      essayVi: viMatch?.essay,
      audio,
    });
  }

  // Build keyword lists for convenience
  const keywordMenu = {
    en: merged.map(m => m.titleEn),
    vi: merged.map(m => m.titleVi || ''),
  };

  return { merged, keywordMenu };
}
