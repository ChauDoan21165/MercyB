type JsonRecord = Record<string, unknown>;

function isRecord(x: unknown): x is JsonRecord {
  return !!x && typeof x === "object" && !Array.isArray(x);
}

function readRecord(record: JsonRecord | null, key: string): JsonRecord | null {
  if (!record) return null;
  const value = record[key];
  return isRecord(value) ? value : null;
}

function readValue(record: JsonRecord | null, key: string): unknown {
  return record?.[key];
}

function asArray(x: unknown): unknown[] {
  return Array.isArray(x) ? x : [];
}

function firstNonEmptyArray(...candidates: unknown[]): unknown[] {
  for (const c of candidates) {
    const arr = asArray(c);
    if (arr.length > 0) return arr;
  }
  return [];
}

export function resolveKeywords(room: unknown) {
  const roomRecord = isRecord(room) ? room : null;
  const keywords = readRecord(roomRecord, "keywords");
  const meta = readRecord(roomRecord, "meta");
  const en = firstNonEmptyArray(readValue(roomRecord, "keywords_en"), readValue(keywords, "en"), readValue(meta, "keywords_en"));
  const vi = firstNonEmptyArray(readValue(roomRecord, "keywords_vi"), readValue(keywords, "vi"), readValue(meta, "keywords_vi"));
  const ja = firstNonEmptyArray(readValue(roomRecord, "keywords_ja"), readValue(keywords, "ja"), readValue(meta, "keywords_ja"));
  return { en, vi, ja };
}

export function resolveEssay(room: unknown) {
  const roomRecord = isRecord(room) ? room : null;
  const essay = readRecord(roomRecord, "essay");
  const content = readRecord(roomRecord, "content");
  const contentEssay = readRecord(content, "essay");
  const en = readValue(essay, "en") || readValue(roomRecord, "essay_en") || readValue(contentEssay, "en") || readValue(content, "essay_en") || "";
  const vi = readValue(essay, "vi") || readValue(roomRecord, "essay_vi") || readValue(contentEssay, "vi") || readValue(content, "essay_vi") || "";
  const ja = readValue(essay, "ja") || readValue(roomRecord, "essay_ja") || readValue(contentEssay, "ja") || readValue(content, "essay_ja") || "";
  return { en, vi, ja };
}

function deepFindFirstObjectArray(root: unknown, maxDepth = 6): unknown[] {
  const seen = new WeakSet<object>();

  const looksUsefulArray = (arr: unknown[]) => {
    if (!Array.isArray(arr) || arr.length === 0) return false;
    const objCount = arr.slice(0, 8).filter((x) => x && typeof x === "object").length;
    if (objCount === 0) return false;

    const sample = arr.find(isRecord);
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

  const visit = (node: unknown, depth: number): unknown[] => {
    if (!node || depth > maxDepth) return [];

    if (Array.isArray(node)) {
      if (looksUsefulArray(node)) return node;
      for (const item of node) {
        const found = visit(item, depth + 1);
        if (found.length) return found;
      }
      return [];
    }

    if (isRecord(node)) {
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
          const found = visit(node[k], depth + 1);
          if (found.length) return found;
        }
      }

      for (const k of Object.keys(node)) {
        if (preferredKeys.includes(k)) continue;
        const v = node[k];
        if (!v || typeof v !== "object") continue;
        const found = visit(v, depth + 1);
        if (found.length) return found;
      }
    }

    return [];
  };

  return visit(root, 0);
}

function collectChildEntryArrays(node: unknown): unknown[][] {
  if (!isRecord(node)) return [];
  const content = readRecord(node, "content");
  const contentData = readRecord(content, "data");
  const contentPayload = readRecord(content, "payload");
  const payload = readRecord(node, "payload");
  const data = readRecord(node, "data");

  const buckets = [
    asArray(readValue(node, "entries")),
    asArray(readValue(node, "items")),
    asArray(readValue(node, "cards")),
    asArray(readValue(node, "blocks")),
    asArray(readValue(node, "steps")),
    asArray(readValue(node, "children")),
    asArray(readValue(node, "nodes")),
    asArray(readValue(node, "rows")),
    asArray(readValue(node, "cols")),
    asArray(readValue(node, "sections")),

    asArray(readValue(content, "entries")),
    asArray(readValue(content, "items")),
    asArray(readValue(content, "cards")),
    asArray(readValue(content, "blocks")),
    asArray(readValue(content, "steps")),
    asArray(readValue(content, "children")),
    asArray(readValue(content, "nodes")),
    asArray(readValue(content, "rows")),
    asArray(readValue(content, "cols")),
    asArray(readValue(content, "sections")),

    asArray(readValue(contentData, "entries")),
    asArray(readValue(contentData, "items")),
    asArray(readValue(contentData, "cards")),
    asArray(readValue(contentData, "blocks")),
    asArray(readValue(contentData, "steps")),
    asArray(readValue(contentData, "sections")),

    asArray(readValue(contentPayload, "entries")),
    asArray(readValue(contentPayload, "items")),
    asArray(readValue(contentPayload, "cards")),
    asArray(readValue(contentPayload, "blocks")),
    asArray(readValue(contentPayload, "steps")),
    asArray(readValue(contentPayload, "sections")),

    asArray(readValue(payload, "entries")),
    asArray(readValue(payload, "items")),
    asArray(readValue(payload, "cards")),
    asArray(readValue(payload, "blocks")),
    asArray(readValue(payload, "steps")),
    asArray(readValue(payload, "sections")),

    asArray(readValue(data, "entries")),
    asArray(readValue(data, "items")),
    asArray(readValue(data, "cards")),
    asArray(readValue(data, "blocks")),
    asArray(readValue(data, "steps")),
    asArray(readValue(data, "sections")),
  ];

  return buckets.filter((a) => Array.isArray(a) && a.length > 0);
}

function hasAnyChildArrays(node: unknown): boolean {
  if (!isRecord(node)) return false;
  return collectChildEntryArrays(node).length > 0;
}

function looksLikeLeafEntry(x: unknown): boolean {
  if (!isRecord(x)) return false;
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

  const title = readRecord(x, "title");
  return !!(x.keyword || x.id || x.slug || title?.en || x.title_en);
}

function flattenToLeafEntries(input: unknown[], maxDepth = 6): unknown[] {
  const out: unknown[] = [];

  const visit = (arr: unknown[], depth: number) => {
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

export function resolveTopContainers(room: unknown): unknown[] {
  const roomRecord = isRecord(room) ? room : null;
  const content = readRecord(roomRecord, "content");
  const data = readRecord(roomRecord, "data");
  const payload = readRecord(roomRecord, "payload");
  const direct = firstNonEmptyArray(
    readValue(roomRecord, "sections"),
    readValue(roomRecord, "blocks"),
    readValue(roomRecord, "items"),
    readValue(roomRecord, "cards"),
    readValue(roomRecord, "entries"),

    readValue(content, "sections"),
    readValue(content, "blocks"),
    readValue(content, "items"),
    readValue(content, "cards"),
    readValue(content, "entries"),

    readValue(data, "sections"),
    readValue(data, "blocks"),
    readValue(data, "items"),
    readValue(data, "cards"),
    readValue(data, "entries"),

    readValue(payload, "sections"),
    readValue(payload, "blocks"),
    readValue(payload, "items"),
    readValue(payload, "cards"),
    readValue(payload, "entries")
  );

  if (direct.length) return direct;
  return deepFindFirstObjectArray(room, 6);
}

export function extractJsonLeafEntries(room: unknown) {
  const tops = resolveTopContainers(room);
  return flattenToLeafEntries(tops, 6);
}

export function deriveKeywordsFromEntryList(entries: unknown[]): { en: string[]; vi: string[]; ja: string[] } {
  const raw: string[] = [];
  for (const e of asArray(entries)) {
    if (!isRecord(e)) continue;
    const title = readRecord(e, "title");
    const k = e.keyword || e.id || e.slug || title?.en || e.title_en || "";
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

  return { en: out, vi: out, ja: out };
}
