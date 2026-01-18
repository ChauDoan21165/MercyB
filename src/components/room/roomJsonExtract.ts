type AnyRoom = any;

function asArray(x: any) {
  return Array.isArray(x) ? x : [];
}

function firstNonEmptyArray(...candidates: any[]): any[] {
  for (const c of candidates) {
    const arr = asArray(c);
    if (arr.length > 0) return arr;
  }
  return [];
}

function isPlainObject(x: any) {
  return !!x && typeof x === "object" && !Array.isArray(x);
}

export function resolveKeywords(room: AnyRoom) {
  const en = firstNonEmptyArray(room?.keywords_en, room?.keywords?.en, room?.meta?.keywords_en);
  const vi = firstNonEmptyArray(room?.keywords_vi, room?.keywords?.vi, room?.meta?.keywords_vi);
  return { en, vi };
}

export function resolveEssay(room: AnyRoom) {
  const en = room?.essay?.en || room?.essay_en || room?.content?.essay?.en || room?.content?.essay_en || "";
  const vi = room?.essay?.vi || room?.essay_vi || room?.content?.essay?.vi || room?.content?.essay_vi || "";
  return { en, vi };
}

function deepFindFirstObjectArray(root: any, maxDepth = 6): any[] {
  const seen = new WeakSet<object>();

  const looksUsefulArray = (arr: any[]) => {
    if (!Array.isArray(arr) || arr.length === 0) return false;
    const objCount = arr.slice(0, 8).filter((x) => x && typeof x === "object").length;
    if (objCount === 0) return false;

    const sample = arr.find((x) => x && typeof x === "object") || {};
    const hasSignals = !!(
      sample?.audio ||
      sample?.mp3 ||
      sample?.text ||
      sample?.content ||
      sample?.title ||
      sample?.id ||
      sample?.slug
    );
    return hasSignals;
  };

  const visit = (node: any, depth: number): any[] => {
    if (!node || depth > maxDepth) return [];

    if (Array.isArray(node)) {
      if (looksUsefulArray(node)) return node;
      for (const item of node) {
        const found = visit(item, depth + 1);
        if (found.length) return found;
      }
      return [];
    }

    if (isPlainObject(node)) {
      if (seen.has(node)) return [];
      seen.add(node);

      const preferredKeys = [
        "entries",
        "items",
        "cards",
        "blocks",
        "sections",
        "steps",
        "children",
        "nodes",
        "rows",
        "cols",
        "data",
        "payload",
        "content",
      ];

      for (const k of preferredKeys) {
        if (k in node) {
          const found = visit((node as any)[k], depth + 1);
          if (found.length) return found;
        }
      }

      for (const k of Object.keys(node)) {
        if (preferredKeys.includes(k)) continue;
        const v = (node as any)[k];
        if (!v || typeof v !== "object") continue;
        const found = visit(v, depth + 1);
        if (found.length) return found;
      }
    }

    return [];
  };

  return visit(root, 0);
}

function collectChildEntryArrays(node: any): any[][] {
  if (!node || typeof node !== "object") return [];

  const buckets = [
    asArray(node?.entries),
    asArray(node?.items),
    asArray(node?.cards),
    asArray(node?.blocks),
    asArray(node?.steps),
    asArray(node?.children),
    asArray(node?.nodes),
    asArray(node?.rows),
    asArray(node?.cols),
    asArray(node?.sections),

    asArray(node?.content?.entries),
    asArray(node?.content?.items),
    asArray(node?.content?.cards),
    asArray(node?.content?.blocks),
    asArray(node?.content?.steps),
    asArray(node?.content?.children),
    asArray(node?.content?.nodes),
    asArray(node?.content?.rows),
    asArray(node?.content?.cols),
    asArray(node?.content?.sections),

    asArray(node?.content?.data?.entries),
    asArray(node?.content?.data?.items),
    asArray(node?.content?.data?.cards),
    asArray(node?.content?.data?.blocks),
    asArray(node?.content?.data?.steps),
    asArray(node?.content?.data?.sections),

    asArray(node?.content?.payload?.entries),
    asArray(node?.content?.payload?.items),
    asArray(node?.content?.payload?.cards),
    asArray(node?.content?.payload?.blocks),
    asArray(node?.content?.payload?.steps),
    asArray(node?.content?.payload?.sections),

    asArray(node?.payload?.entries),
    asArray(node?.payload?.items),
    asArray(node?.payload?.cards),
    asArray(node?.payload?.blocks),
    asArray(node?.payload?.steps),
    asArray(node?.payload?.sections),

    asArray(node?.data?.entries),
    asArray(node?.data?.items),
    asArray(node?.data?.cards),
    asArray(node?.data?.blocks),
    asArray(node?.data?.steps),
    asArray(node?.data?.sections),
  ];

  return buckets.filter((a) => Array.isArray(a) && a.length > 0);
}

function hasAnyChildArrays(node: any): boolean {
  if (!node || typeof node !== "object") return false;
  return collectChildEntryArrays(node).length > 0;
}

function looksLikeLeafEntry(x: any): boolean {
  if (!x || typeof x !== "object") return false;
  if (hasAnyChildArrays(x)) return false;

  if (x.audio || x.mp3 || x.audio_url || x.audioUrl || x.audios || x.audio_playlist || x.audioPlaylist) return true;

  const hasText =
    typeof x.text === "string" ||
    typeof x.content === "string" ||
    typeof x.content_en === "string" ||
    typeof x.content_vi === "string" ||
    typeof x.copy_en === "string" ||
    typeof x.copy_vi === "string";

  if (hasText) return true;

  return !!(x.keyword || x.id || x.slug || x.title?.en || x.title_en);
}

function flattenToLeafEntries(input: any[], maxDepth = 6): any[] {
  const out: any[] = [];

  const visit = (arr: any[], depth: number) => {
    for (const x of asArray(arr)) {
      if (!x || typeof x !== "object") continue;

      const children = collectChildEntryArrays(x);
      if (children.length && depth < maxDepth) {
        for (const c of children) visit(c, depth + 1);
        continue;
      }

      if (looksLikeLeafEntry(x)) out.push(x);
    }
  };

  visit(input, 0);
  return out;
}

export function resolveTopContainers(room: AnyRoom): any[] {
  const direct = firstNonEmptyArray(
    room?.sections,
    room?.blocks,
    room?.items,
    room?.cards,
    room?.entries,

    room?.content?.sections,
    room?.content?.blocks,
    room?.content?.items,
    room?.content?.cards,
    room?.content?.entries,

    room?.data?.sections,
    room?.data?.blocks,
    room?.data?.items,
    room?.data?.cards,
    room?.data?.entries,

    room?.payload?.sections,
    room?.payload?.blocks,
    room?.payload?.items,
    room?.payload?.cards,
    room?.payload?.entries
  );

  if (direct.length) return direct;
  return deepFindFirstObjectArray(room, 6);
}

export function extractJsonLeafEntries(room: AnyRoom) {
  const tops = resolveTopContainers(room);
  return flattenToLeafEntries(tops, 6);
}

export function deriveKeywordsFromEntryList(entries: any[]): { en: string[]; vi: string[] } {
  const raw: string[] = [];
  for (const e of asArray(entries)) {
    const k = e?.keyword || e?.id || e?.slug || e?.title?.en || e?.title_en || "";
    const txt = String(k || "").trim();
    if (txt) raw.push(txt);
  }

  const seen = new Set<string>();
  const out: string[] = [];
  for (const s of raw) {
    const low = s.toLowerCase();
    if (seen.has(low)) continue;
    seen.add(low);
    out.push(s);
  }

  return { en: out, vi: out };
}
