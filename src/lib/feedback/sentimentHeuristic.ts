/**
 * Submit-time sentiment + topic-tag heuristic for the feedback widget.
 *
 * "Best-effort": never throws, never blocks submission. Returns null
 * sentiment when input is too short to read; tags is always an array
 * (may be empty). Admin can override both during triage — that's why
 * the column constraint allows NULL sentiment and the tags column has
 * a `{}` default.
 *
 * Pure module — no Supabase, no DOM. Testable under vitest as plain TS.
 */

// ── 1. Sentiment lexicons ───────────────────────────────────────────────

// Lowercase, ASCII-folded matching. Bilingual (VN + EN). Order doesn't
// matter; we count hits per bucket.
const POSITIVE_WORDS: ReadonlyArray<string> = [
  // EN
  "love", "great", "awesome", "amazing", "perfect", "excellent",
  "good", "nice", "thanks", "helpful", "clear", "easy", "fun",
  "smart", "smooth", "wonderful", "impressive", "favorite",
  // VN (ASCII-folded)
  "tot", "hay", "tuyet", "thich", "cam on", "cam-on", "yeu",
  "de", "vui", "hieu", "ro", "muot",
];

const NEGATIVE_WORDS: ReadonlyArray<string> = [
  // EN
  "bug", "broken", "crash", "slow", "lag", "stuck", "error",
  "wrong", "bad", "hate", "annoying", "confusing", "expensive",
  "frustrating", "useless", "fail", "failed", "issue", "problem",
  "doesn't work", "not work", "can't", "cannot", "unable",
  // VN (ASCII-folded)
  "loi", "hong", "cham", "khong duoc", "khong-duoc", "te",
  "kho hieu", "kho-hieu", "buc", "phien", "te qua",
];

// ── 2. Topic-tag patterns ────────────────────────────────────────────────

// Each tag fires when ANY of its triggers appears (substring match,
// ASCII-folded lower). Triggers are short on purpose — long phrases
// rarely match free-form text. Order doesn't matter.
const TAG_TRIGGERS: ReadonlyArray<{ tag: string; triggers: ReadonlyArray<string> }> = [
  { tag: "audio_quality",  triggers: ["audio", "voice", "sound", "tts", "phat am", "am thanh", "tieng", "robotic"] },
  { tag: "pricing",        triggers: ["price", "pricing", "cost", "expensive", "cheap", "subscription", "free trial", "tien", "gia", "dat"] },
  { tag: "mercy_voice",    triggers: ["mercy voice", "mercy sound", "mercy talk", "mercy noi", "giong mercy"] },
  { tag: "kids_mode",      triggers: ["kid", "kids", "child", "children", "tre em", "tre con"] },
  { tag: "performance",    triggers: ["slow", "lag", "freeze", "crash", "load", "loading", "cham", "ngung", "treo"] },
  { tag: "translation",    triggers: ["translate", "translation", "viet", "vietnamese", "tieng viet", "english", "tieng anh"] },
  { tag: "lessons",        triggers: ["lesson", "lessons", "drill", "exercise", "bai hoc", "luyen tap"] },
  { tag: "ui_ux",          triggers: ["button", "screen", "page", "design", "layout", "navigation", "menu", "giao dien"] },
  { tag: "auth",           triggers: ["login", "sign in", "sign up", "password", "account", "dang nhap", "tai khoan"] },
  { tag: "billing",        triggers: ["payment", "billing", "charge", "refund", "stripe", "thanh toan", "hoan tien"] },
  { tag: "bug",            triggers: ["bug", "broken", "error", "crash", "loi", "hong"] },
  { tag: "feature_request",triggers: ["please add", "wish", "would be nice", "feature", "could you", "co the them", "uoc gi"] },
];

// ── 3. ASCII-fold + tokenisation ────────────────────────────────────────

function asciiFold(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

function countMatches(haystack: string, needles: ReadonlyArray<string>): number {
  let n = 0;
  for (const needle of needles) {
    if (haystack.includes(needle)) n++;
  }
  return n;
}

// ── 4. Public API ───────────────────────────────────────────────────────

export type Sentiment = "positive" | "neutral" | "negative" | "mixed";

export interface SentimentResult {
  /** Inferred sentiment, or null when input is too short to call. */
  sentiment: Sentiment | null;
  /** Topic tags (may be empty array). */
  tags: string[];
  /** Raw debug counts — useful in tests + admin triage UI. */
  debug: {
    positiveHits: number;
    negativeHits: number;
    /** Length of input AFTER trim, for the "too short" gate. */
    trimmedLength: number;
  };
}

/**
 * Best-effort sentiment + topic-tag classification for free-form
 * feedback text. Never throws, returns sentiment=null for short input.
 */
export function classifyFeedbackSentiment(message: string | null | undefined): SentimentResult {
  const raw = (message ?? "").toString();
  const trimmed = raw.trim();
  const folded = asciiFold(trimmed);

  const positiveHits = countMatches(folded, POSITIVE_WORDS);
  const negativeHits = countMatches(folded, NEGATIVE_WORDS);

  let sentiment: Sentiment | null;
  if (trimmed.length < 4) {
    // Too short — admin will read it during triage.
    sentiment = null;
  } else if (positiveHits === 0 && negativeHits === 0) {
    sentiment = "neutral";
  } else if (positiveHits > 0 && negativeHits > 0) {
    sentiment = "mixed";
  } else if (positiveHits > 0) {
    sentiment = "positive";
  } else {
    sentiment = "negative";
  }

  // Topic tags — collect all that fire.
  const tags: string[] = [];
  for (const { tag, triggers } of TAG_TRIGGERS) {
    for (const trig of triggers) {
      if (folded.includes(trig)) {
        tags.push(tag);
        break;
      }
    }
  }

  return {
    sentiment,
    tags,
    debug: {
      positiveHits,
      negativeHits,
      trimmedLength: trimmed.length,
    },
  };
}
