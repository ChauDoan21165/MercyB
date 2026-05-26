// FILE: src/components/room/roomRenderer/keywordsBilingual.ts
// MB-BLUE-99.11v-split-keywords — 2026-01-19 (+0700)

import {
  entryMatchesKeyword,
  normalizeTextForKwMatch,
} from "@/components/room/RoomRendererUI";

import { entryKey } from "@/components/room/roomRenderer/helpers";

export type KwPair = { en: string; vi: string };

export function buildKeywordLookupFromEntries(entries: any[]) {
  const viByEn = new Map<string, string>();
  const enByVi = new Map<string, string>();

  const putPair = (enRaw: any, viRaw: any) => {
    const en = String(enRaw ?? "").trim();
    const vi = String(viRaw ?? "").trim();
    if (!en || !vi) return;

    const enN = normalizeTextForKwMatch(en);
    const viN = normalizeTextForKwMatch(vi);
    if (!enN || !viN) return;

    // refuse fake bilingual pairs
    if (enN === viN) return;

    if (!viByEn.has(enN)) viByEn.set(enN, vi);
    if (!enByVi.has(viN)) enByVi.set(viN, en);
  };

  for (const e of entries || []) {
    const enArr = Array.isArray(e?.keywords_en) ? e.keywords_en : [];
    const viArr = Array.isArray(e?.keywords_vi) ? e.keywords_vi : [];
    const n = Math.min(enArr.length, viArr.length);
    for (let i = 0; i < n; i++) putPair(enArr[i], viArr[i]);
  }

  return { viByEn, enByVi };
}

export function pickOneKeywordPairForEntry(
  entry: any,
  lookup: { viByEn: Map<string, string>; enByVi: Map<string, string> },
): KwPair | null {
  const enArr = Array.isArray(entry?.keywords_en) ? entry.keywords_en : [];
  const viArr = Array.isArray(entry?.keywords_vi) ? entry.keywords_vi : [];

  // 1) Prefer true paired i↔i where both exist and differ.
  {
    const n = Math.min(enArr.length, viArr.length);
    for (let i = 0; i < n; i++) {
      const en = String(enArr[i] ?? "").trim();
      const vi = String(viArr[i] ?? "").trim();
      if (!en || !vi) continue;
      if (normalizeTextForKwMatch(en) === normalizeTextForKwMatch(vi)) continue;
      return { en, vi };
    }
  }

  // 2) Only EN exists -> fill VI via lookup
  if (enArr.length > 0) {
    const en = String(enArr[0] ?? "").trim();
    if (!en) return null;

    const vi2 = lookup.viByEn.get(normalizeTextForKwMatch(en));
    let vi = String(vi2 ?? "").trim();
    if (vi && normalizeTextForKwMatch(vi) === normalizeTextForKwMatch(en)) vi = "";
    return { en, vi };
  }

  // 3) Only VI exists -> fill EN via lookup
  if (viArr.length > 0) {
    const vi = String(viArr[0] ?? "").trim();
    if (!vi) return null;

    const en2 = lookup.enByVi.get(normalizeTextForKwMatch(vi));
    let en = String(en2 ?? "").trim();
    if (en && normalizeTextForKwMatch(en) === normalizeTextForKwMatch(vi)) en = "";
    return { en, vi };
  }

  return null;
}

/**
 * Builds kw.en / kw.vi arrays with the LOCKED rules:
 * - Prefer ONE keyword pair PER ENTRY when entry keyword fields exist (prevents slug pills)
 * - Never show EN/EN (fake bilingual)
 * - Fallback to room keywords/derived keywords, but only keep those that match at least one entry
 * - Enforce “clean room”: at most ONE keyword per entry, trim to <= entryCount
 */
export function buildKeywordsForRoom(args: {
  entries: any[];
  kwRaw: { en: string[]; vi: string[] } | null | undefined;
  deriveKeywordsFromEntryList: (entries: any[]) => { en: string[]; vi: string[] };
}) {
  const entriesForCoverage = args.entries || [];
  const entryCount = entriesForCoverage.length;
  const kwRaw = args.kwRaw || { en: [], vi: [] };

  const lookup = buildKeywordLookupFromEntries(entriesForCoverage);

  // v3: per-entry keywords (best)
  if (entryCount > 0) {
    const perEntry = entriesForCoverage
      .map((e) => {
        const pair = pickOneKeywordPairForEntry(e, lookup);
        if (!pair) return null;

        let en = String(pair.en ?? "").trim();
        let vi = String(pair.vi ?? "").trim();

        if (en && vi && normalizeTextForKwMatch(en) === normalizeTextForKwMatch(vi)) vi = "";
        if (!en && !vi) return null;

        return { en, vi };
      })
      .filter(Boolean) as KwPair[];

    if (perEntry.length > 0) {
      const trimmed = perEntry.slice(0, Math.max(1, entryCount));
      return { en: trimmed.map((p) => p.en), vi: trimmed.map((p) => p.vi) };
    }
  }

  // fallback: room keywords or derived
  const hasReal = (kwRaw?.en?.length || 0) > 0 || (kwRaw?.vi?.length || 0) > 0;
  const base = hasReal
    ? kwRaw
    : entryCount > 0
      ? args.deriveKeywordsFromEntryList(entriesForCoverage)
      : { en: [], vi: [] };

  const maxLen = Math.max(base.en.length, base.vi.length);
  if (maxLen === 0) return base;
  if (entryCount === 0) return base;

  type Pair = { en: string; vi: string; matchKey: string; score: number };
  const pairs: Pair[] = [];

  for (let i = 0; i < maxLen; i++) {
    let en = String(base.en[i] ?? "").trim();
    let vi = String(base.vi[i] ?? "").trim();
    if (!en && !vi) continue;

    // fill missing side from real paired entry fields
    if (en && (!vi || normalizeTextForKwMatch(vi) === normalizeTextForKwMatch(en))) {
      const vi2 = lookup.viByEn.get(normalizeTextForKwMatch(en));
      if (vi2) vi = String(vi2).trim();
    } else if (vi && !en) {
      const en2 = lookup.enByVi.get(normalizeTextForKwMatch(vi));
      if (en2) en = String(en2).trim();
    }

    // refuse fake bilingual pairs
    if (en && vi && normalizeTextForKwMatch(en) === normalizeTextForKwMatch(vi)) vi = "";

    let matched: any = null;
    let matchedVia: "en" | "vi" | null = null;

    if (en) {
      matched = entriesForCoverage.find((e) => entryMatchesKeyword(e, en)) || null;
      if (matched) matchedVia = "en";
    }
    if (!matched && vi) {
      matched = entriesForCoverage.find((e) => entryMatchesKeyword(e, vi)) || null;
      if (matched) matchedVia = "vi";
    }
    if (!matched) continue;

    const k = entryKey(matched);

    const both = en && vi ? 1 : 0;
    const lenPenalty = Math.min(60, (en.length + vi.length) / 20);
    const preferEn = matchedVia === "en" ? 1 : 0;
    const score = both * 3 + preferEn * 2 - lenPenalty;

    pairs.push({ en, vi, matchKey: k, score });
  }

  if (pairs.length === 0) return base;

  const bestByEntry = new Map<string, Pair>();
  for (const p of pairs) {
    const cur = bestByEntry.get(p.matchKey);
    if (!cur || p.score > cur.score) bestByEntry.set(p.matchKey, p);
  }

  const uniqueOrdered: Pair[] = [];
  const used = new Set<string>();
  for (const p of pairs) {
    if (used.has(p.matchKey)) continue;
    const best = bestByEntry.get(p.matchKey);
    if (best) {
      used.add(p.matchKey);
      uniqueOrdered.push(best);
    }
  }

  const trimmed = uniqueOrdered.slice(0, Math.max(1, entryCount));
  const outEn = trimmed.map((p) => p.en);
  const outVi = trimmed.map((p) => p.vi);

  if (outEn.length === 0 && outVi.length === 0) return base;
  return { en: outEn, vi: outVi };
}
