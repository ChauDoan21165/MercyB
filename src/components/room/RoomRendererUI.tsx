import React, { useMemo, useState } from "react";
import TalkingFacePlayButton from "@/components/audio/TalkingFacePlayButton";

export const KW_CLASSES = [
  "mb-kw-0",
  "mb-kw-1",
  "mb-kw-2",
  "mb-kw-3",
  "mb-kw-4",
  "mb-kw-5",
  "mb-kw-6",
  "mb-kw-7",
] as const;

// can be a CSS class (mb-kw-0...) OR a hex color (#RRGGBB)
export type KeywordColorMap = Map<string, string>;

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeKwKey(s: string) {
  return String(s || "")
    .trim()
    .toLowerCase()
    .replace(/[\s\-_]+/g, " ");
}

export function normalizeTextForKwMatch(s: string) {
  const base = String(s || "")
    .toLowerCase()
    .trim()
    .replace(/[\s\-_]+/g, " ")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!base) return "";

  const words = base.split(" ").map((w) => {
    if (w.length < 4) return w;
    if (w.endsWith("ies") && w.length >= 5) return w.slice(0, -3) + "y";
    if (w.endsWith("es") && w.length >= 5) {
      const root = w.slice(0, -2);
      if (/(s|x|z|ch|sh)$/.test(root)) return root;
    }
    if (w.endsWith("s") && !w.endsWith("ss")) return w.slice(0, -1);
    return w;
  });

  return words.join(" ");
}

// ------------------------------
// Verb-only auto highlight (v1)
// - pick ~N EN verbs + ~N VI verbs (heuristics)
// - fallback to first N meaningful words if no verbs detected
// - pair by index (0↔0,1↔1...) to share color
// - deterministic colors
// - dark rainbow palette (echo Mercy Blade, not exact)
// ------------------------------

const MB_DARK_RAINBOW = [
  "#B91C1C", // deep red
  "#C2410C", // orange
  "#A16207", // gold
  "#047857", // green/teal
  "#1D4ED8", // blue
  "#6D28D9", // purple
];

function stableHash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function tokenizeWords(s: string) {
  return String(s || "")
    .replace(/['’]/g, "")
    .split(/[^A-Za-zÀ-ỹ]+/g)
    .map((w) => w.trim())
    .filter(Boolean);
}

function uniqNormalizedKeepOrder(arr: string[]) {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const x of arr) {
    const raw = String(x || "").trim();
    if (!raw) continue;
    const n = normalizeTextForKwMatch(raw);
    if (!n) continue;
    if (seen.has(n)) continue;
    seen.add(n);
    out.push(raw);
  }
  return out;
}

const EN_STOP = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "but",
  "to",
  "of",
  "in",
  "on",
  "at",
  "for",
  "with",
  "from",
  "as",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "i",
  "you",
  "we",
  "they",
  "he",
  "she",
  "it",
  "this",
  "that",
  "these",
  "those",
  "my",
  "your",
  "our",
  "their",
  "not",
  "no",
  "yes",
  "do",
  "does",
  "did",
  "done",
  "will",
  "can",
  "could",
  "should",
  "would",
  "may",
  "might",
  "must",
]);

const EN_COMMON_VERBS = new Set([
  "be",
  "have",
  "do",
  "make",
  "go",
  "get",
  "take",
  "see",
  "know",
  "think",
  "feel",
  "learn",
  "teach",
  "use",
  "help",
  "need",
  "want",
  "try",
  "keep",
  "stay",
  "work",
  "live",
  "survive",
  "choose",
  "start",
  "stop",
  "build",
  "grow",
  "change",
  "protect",
  "avoid",
]);

function pickFirstMeaningfulEnWords(textEn: string, max = 7) {
  const raw = tokenizeWords(textEn);
  const out: string[] = [];
  for (const w of raw) {
    const lw = w.toLowerCase();
    if (EN_STOP.has(lw)) continue;
    if (lw.length < 3) continue;
    out.push(w);
    if (out.length >= max * 2) break;
  }
  return uniqNormalizedKeepOrder(out).slice(0, max);
}

function pickEnVerbs(textEn: string, max = 7) {
  const raw = tokenizeWords(textEn);
  const out: string[] = [];

  for (let i = 0; i < raw.length; i++) {
    const w = raw[i];
    const lw = w.toLowerCase();
    if (EN_STOP.has(lw)) continue;
    if (lw.length < 3) continue;

    const prev = i > 0 ? raw[i - 1].toLowerCase() : "";

    const looksVerb =
      prev === "to" ||
      EN_COMMON_VERBS.has(lw) ||
      lw.endsWith("ing") ||
      lw.endsWith("ed") ||
      lw.endsWith("en");

    if (!looksVerb) continue;

    out.push(w);
    if (out.length >= max * 3) break;
  }

  const picked = uniqNormalizedKeepOrder(out).slice(0, max);
  if (picked.length > 0) return picked;

  // ✅ fallback: still highlight something
  return pickFirstMeaningfulEnWords(textEn, max);
}

const VI_STOP = new Set([
  "là",
  "và",
  "hoặc",
  "nhưng",
  "thì",
  "mà",
  "của",
  "trong",
  "trên",
  "ở",
  "cho",
  "với",
  "từ",
  "như",
  "đó",
  "này",
  "kia",
  "tôi",
  "bạn",
  "chúng",
  "họ",
  "anh",
  "chị",
  "em",
  "nó",
  "mình",
  "không",
  "có",
  "đã",
  "đang",
  "sẽ",
  "rất",
  "cũng",
  "nên",
  "phải",
  "cần",
  "muốn",
]);

// NOTE: tokenizeWords splits multi-word phrases, so this list is mainly single tokens.
const VI_COMMON_VERBS = new Set([
  "làm",
  "đi",
  "đến",
  "ở",
  "học",
  "dạy",
  "nghĩ",
  "cảm",
  "biết",
  "hiểu",
  "giúp",
  "cần",
  "muốn",
  "thử",
  "giữ",
  "sống",
  "tránh",
  "xây",
  "tạo",
  "thay",
  "chọn",
  "bảo",
  "vệ",
  "sinh",
  "tồn",
  "vượt",
  "gây",
]);

function pickFirstMeaningfulViWords(textVi: string, max = 7) {
  const raw = tokenizeWords(textVi);
  const out: string[] = [];
  for (const w of raw) {
    const lw = w.toLowerCase();
    if (VI_STOP.has(lw)) continue;
    if (lw.length < 2) continue;
    out.push(w);
    if (out.length >= max * 2) break;
  }
  return uniqNormalizedKeepOrder(out).slice(0, max);
}

function pickViVerbs(textVi: string, max = 7) {
  const raw = tokenizeWords(textVi);
  const out: string[] = [];

  for (let i = 0; i < raw.length; i++) {
    const w = raw[i];
    const lw = w.toLowerCase();
    if (VI_STOP.has(lw)) continue;
    if (lw.length < 2) continue;

    const prev = i > 0 ? raw[i - 1].toLowerCase() : "";
    const followsModal =
      prev === "đã" ||
      prev === "đang" ||
      prev === "sẽ" ||
      prev === "cần" ||
      prev === "phải" ||
      prev === "nên" ||
      prev === "muốn";

    const looksVerb = followsModal || VI_COMMON_VERBS.has(lw);
    if (!looksVerb) continue;

    out.push(w);
    if (out.length >= max * 3) break;
  }

  const picked = uniqNormalizedKeepOrder(out).slice(0, max);
  if (picked.length > 0) return picked;

  // ✅ fallback: still highlight something
  return pickFirstMeaningfulViWords(textVi, max);
}

export function buildEntryVerbColorMap(entry: any, maxPairs = 7): KeywordColorMap {
  const enText = String(entry?.copy?.en ?? entry?.content?.en ?? entry?.copy_en ?? entry?.content_en ?? "").trim();
  const viText = String(entry?.copy?.vi ?? entry?.content?.vi ?? entry?.copy_vi ?? entry?.content_vi ?? "").trim();

  const enVerbs = pickEnVerbs(enText, maxPairs);
  const viVerbs = pickViVerbs(viText, maxPairs);

  const entryKey = String(entry?.id || entry?.slug || "entry").trim() || "entry";

  const pairs = Math.min(maxPairs, Math.max(enVerbs.length, viVerbs.length));
  const map: KeywordColorMap = new Map();

  for (let i = 0; i < pairs; i++) {
    const en = String(enVerbs[i] ?? "").trim();
    const vi = String(viVerbs[i] ?? "").trim();
    if (!en && !vi) continue;

    const seed = `${entryKey}|v1|${i}|${en}|${vi}`;
    const color = MB_DARK_RAINBOW[stableHash(seed) % MB_DARK_RAINBOW.length];

    if (en) map.set(normalizeKwKey(en), color);
    if (vi) map.set(normalizeKwKey(vi), color);
  }

  return map;
}

export function buildKeywordColorMap(
  enKeywords: string[],
  viKeywords: string[],
  maxPairs = 7
): KeywordColorMap {
  const map: KeywordColorMap = new Map();

  const maxLen = Math.max(enKeywords.length, viKeywords.length);
  const n = Math.min(maxPairs, maxLen);

  let colorIdx = 0;

  for (let i = 0; i < n; i++) {
    const en = String(enKeywords[i] ?? "").trim();
    const vi = String(viKeywords[i] ?? "").trim();
    if (!en && !vi) continue;

    const cls = KW_CLASSES[colorIdx % KW_CLASSES.length];
    colorIdx++;

    if (en) map.set(normalizeKwKey(en), cls);
    if (vi) map.set(normalizeKwKey(vi), cls);
  }

  return map;
}

export function highlightByColorMap(text: string, colorMap: KeywordColorMap) {
  const t = String(text || "");
  if (!t.trim()) return t;
  if (!colorMap || colorMap.size === 0) return t;

  const isHex = (v: string) => /^#[0-9a-f]{6}$/i.test(String(v || "").trim());

  const ordered = Array.from(colorMap.keys()).sort((a, b) => b.length - a.length);

  const keyToVariantPattern = (k: string) => {
    const parts = k.split(" ").filter(Boolean).map(escapeRegExp);
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0];
    return parts.join("[\\s\\-_]+");
  };

  const pattern = ordered.map(keyToVariantPattern).filter(Boolean).join("|");
  if (!pattern) return t;

  const re = new RegExp(
    `(^|[^\\p{L}\\p{N}_])(${pattern})(?=[^\\p{L}\\p{N}_]|$)`,
    "giu"
  );

  const parts: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;

  while ((m = re.exec(t))) {
    const start = m.index;
    const full = m[0] || "";
    const prefix = m[1] || "";
    const match = m[2] || "";
    const end = start + full.length;

    if (start > last) parts.push(t.slice(last, start));
    if (prefix) parts.push(prefix);

    const v = colorMap.get(normalizeKwKey(match)) || KW_CLASSES[0];

    if (isHex(v)) {
      parts.push(
        <span
          key={`${start}-${end}`}
          className="mb-kw"
          style={{ color: v, fontWeight: 850, backgroundColor: "transparent" }}
        >
          {match}
        </span>
      );
    } else {
      parts.push(
        <span key={`${start}-${end}`} className={`mb-kw ${v}`}>
          {match}
        </span>
      );
    }

    last = end;
  }

  if (last < t.length) parts.push(t.slice(last));
  return <span className="whitespace-pre-line leading-relaxed">{parts}</span>;
}

// -------------------------
// Entry helpers (used by RoomRenderer + ActiveEntry)
// -------------------------

function stripImplicitAudioLines(text: string): string {
  if (!text) return "";
  const lines = String(text).split("\n");
  const out: string[] = [];
  const timeLine = /^\s*\d{1,2}:\d{2}\s*\/\s*\d{1,2}:\d{2}\s*$/;

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i] ?? "";
    const t = raw.trim();
    if (t.toLowerCase().includes(".mp3")) {
      const next = (lines[i + 1] ?? "").trim();
      if (timeLine.test(next)) i++;
      continue;
    }
    if (timeLine.test(t)) continue;
    out.push(raw);
  }
  return out.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

function normalizeEntryTextEN(entry: any): string {
  const candidates = [
    entry?.copy?.en,
    entry?.text?.en,
    entry?.body?.en,
    entry?.content?.en,
    entry?.description?.en,
    entry?.summary?.en,
    entry?.copy_en,
    entry?.text_en,
    entry?.body_en,
    entry?.content_en,
    entry?.description_en,
    entry?.summary_en,
  ];
  for (const c of candidates) {
    if (typeof c === "string" && c.trim()) return stripImplicitAudioLines(c);
  }
  if (typeof entry?.text === "string" && entry.text.trim()) return stripImplicitAudioLines(entry.text);
  if (typeof entry?.content === "string" && entry.content.trim()) return stripImplicitAudioLines(entry.content);
  return "";
}

function normalizeEntryTextVI(entry: any): string {
  const candidates = [
    entry?.copy?.vi,
    entry?.text?.vi,
    entry?.body?.vi,
    entry?.content?.vi,
    entry?.description?.vi,
    entry?.summary?.vi,
    entry?.copy_vi,
    entry?.text_vi,
    entry?.body_vi,
    entry?.content_vi,
    entry?.description_vi,
    entry?.summary_vi,
  ];
  for (const c of candidates) {
    if (typeof c === "string" && c.trim()) return stripImplicitAudioLines(c);
  }
  return "";
}

export function entryMatchesKeyword(entry: any, kw: string): boolean {
  const kRaw = String(kw || "").trim();
  if (!kRaw) return false;

  const k = normalizeTextForKwMatch(kRaw);

  const meta = normalizeTextForKwMatch(String(entry?.id || entry?.slug || ""));
  const title = normalizeTextForKwMatch(
    String(
      entry?.title?.en ||
        entry?.title_en ||
        entry?.heading?.en ||
        entry?.heading_en ||
        entry?.id ||
        entry?.slug ||
        ""
    )
  );

  const en = normalizeTextForKwMatch(normalizeEntryTextEN(entry));
  const vi = normalizeTextForKwMatch(normalizeEntryTextVI(entry));

  return meta.includes(k) || title.includes(k) || en.includes(k) || vi.includes(k);
}

function prettifyEntryId(id: string): string {
  const s = String(id || "").trim();
  if (!s) return "";
  if (/^[a-z0-9_]+$/.test(s) && s.includes("_")) {
    return s
      .split("_")
      .filter(Boolean)
      .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
      .join(" ");
  }
  if (/^[a-z]+$/.test(s)) return s[0].toUpperCase() + s.slice(1);
  return s;
}

function pickEntryHeading(entry: any, index: number) {
  return (
    entry?.title?.en ||
    entry?.heading?.en ||
    entry?.title_en ||
    entry?.heading_en ||
    entry?.name?.en ||
    entry?.name_en ||
    prettifyEntryId(entry?.id || entry?.slug || "") ||
    `Entry ${index + 1}`
  );
}

function isUglyHeading(h: string) {
  const s = String(h || "").trim();
  if (!s) return true;
  const looksSlug = /^[a-z0-9_-]+$/.test(s) && (s.includes("-") || s.includes("_"));
  const tooIdLike = /_(vip[1-9]|free)\b/i.test(s);
  return looksSlug || tooIdLike;
}

// -------------------------
// Audio helpers for ActiveEntry
// -------------------------

function normalizeAudioSrc(src: string): string {
  const s = String(src || "").trim();
  if (!s) return "";
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  const p = s.replace(/^\/+/, "");
  if (p.startsWith("audio/")) return `/${p}`;
  return `/audio/${p.split("/").pop() || p}`;
}

function pickAudio(entry: any): string {
  const candidates: any[] = [];
  candidates.push(entry?.audio, entry?.audio_en, entry?.audio_vi);
  candidates.push(entry?.audioRef, entry?.audio_ref);
  candidates.push(entry?.audioUrl, entry?.audio_url);
  candidates.push(entry?.mp3, entry?.mp3_en, entry?.mp3_vi);

  for (const c of candidates) {
    if (!c) continue;
    if (typeof c === "string") {
      const norm = normalizeAudioSrc(c);
      if (norm) return norm;
    } else if (typeof c === "object") {
      const s = String(c?.en || c?.vi || c?.src || c?.url || "").trim();
      const norm = normalizeAudioSrc(s);
      if (norm) return norm;
    }
  }
  return "";
}

function pickAudioList(entry: any): string[] {
  const out: string[] = [];

  const push = (v: any) => {
    if (!v) return;

    if (Array.isArray(v)) {
      for (const item of v) push(item);
      return;
    }

    if (typeof v === "object") {
      const s = String(v?.en || v?.vi || v?.src || v?.url || "").trim();
      if (s) push(s);
      return;
    }

    if (typeof v === "string") {
      const s = v.trim();
      if (!s) return;

      const parts = s.includes(" ") ? s.split(/\s+/g) : s.includes(",") ? s.split(",") : [s];
      for (const p of parts) {
        const norm = normalizeAudioSrc(String(p || "").trim());
        if (norm) out.push(norm);
      }
    }
  };

  push(entry?.audio_playlist);
  push(entry?.audioPlaylist);
  push(entry?.audio_list);
  push(entry?.audioList);
  push(entry?.audios);

  if (out.length === 0) push(entry?.audio);
  if (out.length === 0) {
    const one = pickAudio(entry);
    if (one) out.push(one);
  }

  const seen = new Set<string>();
  return out.filter((s) => {
    const k = s.toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

function audioLabelFromSrc(src: string): string {
  const s = String(src || "").trim();
  return s ? s.split("/").pop() || s : "";
}

// -------------------------
// MercyGuideCorner (UI shell only)
// -------------------------

export function MercyGuideCorner({
  disabled,
  roomTitle,
  activeKeyword,
  onClearKeyword,
  onScrollToAudio,
}: {
  disabled: boolean;
  roomTitle: string;
  activeKeyword: string | null;
  onClearKeyword?: () => void;
  onScrollToAudio?: () => void;
}) {
  const [open, setOpen] = useState(false);
  if (disabled) return null;

  const hasStep = !!(activeKeyword && String(activeKeyword).trim());

  return (
    <div className="mb-guideCorner">
      <button
        type="button"
        className="mb-guideBtn"
        onClick={() => setOpen((v) => !v)}
        title="Mercy Guide (UI shell)"
      >
        🙂 <span className="hidden sm:inline">Guide</span>
      </button>

      {open && (
        <div className="mb-guidePanel" role="dialog" aria-label="Mercy Guide">
          <div className="mb-guideTitle">
            Mercy Guide
            <button type="button" className="mb-guideClose" onClick={() => setOpen(false)}>
              ✕
            </button>
          </div>

          <div className="mb-guideBody">
            <div className="mb-guideLine">
              <b>Room:</b> {roomTitle || "Room"}
            </div>

            <div className="mb-guideLine">
              <b>Step:</b>{" "}
              {hasStep ? (
                <>
                  You chose <b>{activeKeyword}</b> — read EN → listen → compare VI.
                </>
              ) : (
                <>Click a keyword to start. Then you’ll see EN → audio → VI.</>
              )}
            </div>

            {hasStep ? (
              <div className="mb-guideActions" role="group" aria-label="Guide actions">
                <button
                  type="button"
                  className="mb-guideActionBtn"
                  onClick={onScrollToAudio}
                  disabled={!onScrollToAudio}
                  title="Scroll to the audio player"
                >
                  🔊 Audio
                </button>
                <button
                  type="button"
                  className="mb-guideActionBtn"
                  onClick={onClearKeyword}
                  disabled={!onClearKeyword}
                  title="Clear keyword"
                >
                  ⟲ Clear
                </button>
              </div>
            ) : null}

            <div className="mb-guideHint">
              (Later we can connect this panel to the real “teacher GPT” API behind one button.)
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------
// ActiveEntry (BOX 4)
// -------------------------

export function ActiveEntry({
  entry,
  index,
  enKeywords,
  viKeywords,
  audioAnchorRef,
}: {
  entry: any;
  index: number;
  enKeywords: string[];
  viKeywords: string[];
  audioAnchorRef?: React.RefObject<HTMLDivElement>;
}) {
  const rawHeading = pickEntryHeading(entry, index);
  const heading = isUglyHeading(rawHeading) ? "" : rawHeading;

  const en = normalizeEntryTextEN(entry);
  const vi = normalizeEntryTextVI(entry);

  const entryKwColorMap = useMemo(() => {
    const pairs: { en: string; vi: string }[] = [];
    const maxLen = Math.max(enKeywords.length, viKeywords.length);

    for (let i = 0; i < maxLen; i++) {
      const enK = String(enKeywords[i] ?? "").trim();
      const viK = String(viKeywords[i] ?? "").trim();
      if (!enK && !viK) continue;

      const hit = (enK && entryMatchesKeyword(entry, enK)) || (viK && entryMatchesKeyword(entry, viK));
      if (!hit) continue;

      pairs.push({ en: enK, vi: viK });
      if (pairs.length >= 7) break; // ✅ 7 highlights for long text
    }

    const enTop = pairs.map((p) => p.en).filter(Boolean);
    const viTop = pairs.map((p) => p.vi).filter(Boolean);

    return buildKeywordColorMap(enTop, viTop, 7); // ✅ 7
  }, [entry, enKeywords, viKeywords]);

  const verbColorMap = useMemo(() => buildEntryVerbColorMap(entry, 7), [entry]); // ✅ 7 verbs/meaningful words

  const mergedColorMap = useMemo(() => {
    // verbs win over keyword classes if overlap
    return new Map<string, string>([...entryKwColorMap.entries(), ...verbColorMap.entries()]);
  }, [entryKwColorMap, verbColorMap]);

  const audioList = pickAudioList(entry);

  return (
    <div>
      {heading ? <h3 className="text-2xl md:text-3xl font-serif font-bold mt-1 leading-tight">{heading}</h3> : null}

      {en ? (
        <div className="mt-4 text-[15px] md:text-base mb-entryText">
          {highlightByColorMap(en, mergedColorMap)}
        </div>
      ) : null}

      {audioList.length ? (
        <div ref={audioAnchorRef as any} className="mt-4 mb-audioClamp">
          <div className="flex flex-col gap-2">
            {audioList.map((src, i) => {
              const base = audioLabelFromSrc(src);
              const label = audioList.length > 1 ? `${base} (${i + 1}/${audioList.length})` : base;
              return (
                <TalkingFacePlayButton
                  key={`${src}-${i}`}
                  src={src}
                  label={label}
                  className="w-full"
                  fullWidthBar
                />
              );
            })}
          </div>
        </div>
      ) : null}

      {vi ? (
        <div className="mt-4 text-[15px] md:text-base mb-entryText">
          {highlightByColorMap(vi, mergedColorMap)}
        </div>
      ) : null}
    </div>
  );
}
