// src/lib/mercy/intentDetection.ts
//
// Pure intent classifier for the unified Mercy chat. Given a learner's
// message (English or Vietnamese), return what kind of help they're
// asking for so the chat can render the right inline UI:
//
//   - pronunciation : "How do I say X?", "phát âm sao", record-audio uploads
//   - grammar_check : "is this correct", "đúng chưa", "fix this"
//   - lesson_request: "next lesson", "teach me X", "bài tiếp theo"
//   - encouragement : "I'm stuck", "this is hard", "tôi nản"
//   - chat          : default — plain conversation
//
// Pure function: same input → same output, no I/O, no state. Easy to
// unit test, easy to reason about.
//
// Confidence is exposed so the chat can decide whether to ask a
// clarifying question (low confidence) or commit to an inline mode
// (high confidence). Below ~0.6 the chat should treat the message as
// general chat with a soft offer ("Want me to check pronunciation?")
// rather than auto-launching a recording UI.

export type MercyIntent =
  | "pronunciation"
  | "grammar_check"
  | "lesson_request"
  | "encouragement"
  | "chat";

export type IntentResult = {
  intent: MercyIntent;
  /** [0, 1]. Caller should ask a clarifying question below ~0.6. */
  confidence: number;
  /**
   * For pronunciation: the word/phrase the user wants to say.
   * For grammar_check: the sentence to check.
   * For lesson_request: the topic, if extractable.
   * Empty string when nothing useful can be extracted.
   */
  target: string;
  /** Detected language of the input, best effort. */
  language: "vi" | "en" | "mixed";
};

// ── Language detection (light-weight) ────────────────────────────────────

const VIETNAMESE_DIACRITIC_REGEX =
  /[ăâđêôơưàáảãạằắẳẵặầấẩẫậèéẻẽẹềếểễệìíỉĩịòóỏõọồốổỗộờớởỡợùúủũụừứửữựỳýỷỹỵ]/i;

const VIETNAMESE_KEYWORDS = [
  "phát âm",
  "đúng chưa",
  "đúng không",
  "sai chưa",
  "bài tiếp",
  "dạy mình",
  "dạy em",
  "giải thích",
  "tôi nản",
  "khó quá",
  "không hiểu",
  "giúp mình",
  "giúp em",
  "tiếng anh",
  "câu này",
  "thử lại",
];

export function detectLanguage(text: string): "vi" | "en" | "mixed" {
  const lower = text.toLowerCase();
  const hasDiacritic = VIETNAMESE_DIACRITIC_REGEX.test(text);
  const hasKeyword = VIETNAMESE_KEYWORDS.some((k) => lower.includes(k));
  const hasVN = hasDiacritic || hasKeyword;

  // 'mixed' = VN markers plus a clearly-English token (quoted English word
  // or a parenthesised English span). Pure Vietnamese sentences are written
  // in Latin letters too, so bare ASCII presence is not a reliable signal.
  const hasQuotedEnglish = /["'""]\s*[A-Za-z][A-Za-z\s'-]{1,40}\s*["'""]/.test(text);
  if (hasVN && hasQuotedEnglish) return "mixed";
  if (hasVN) return "vi";
  return "en";
}

// ── Pattern packs ────────────────────────────────────────────────────────

const PRONUNCIATION_PATTERNS: ReadonlyArray<RegExp> = [
  /\bhow (?:do|can|should) (?:i|you) (?:say|pronounce)\b/i,
  /\bhow (?:to|do you) pronounce\b/i,
  /\bteach me how to say\b/i,
  /\bhow is .+ pronounced\b/i,
  /(?:^|[.!?]\s+)\s*say\s+["'][^"']+["']/i, // imperative "Say 'nail polish'"
  /\bpronunciation of\b/i,
  /phát âm/i,
  /đọc (?:sao|thế nào|làm sao)/i,
  /nói (?:sao|thế nào|làm sao)/i,
];

const GRAMMAR_PATTERNS: ReadonlyArray<RegExp> = [
  /\bis (?:this|that|the sentence|it) (?:correct|right|grammatical)\b/i,
  /\bcorrect (?:this|the sentence|my)\b/i,
  /\bcheck (?:my|this|the) (?:grammar|sentence|writing)\b/i,
  /\bdid i (?:say|write) (?:this|that) (?:correctly|right)\b/i,
  /\bfix (?:this|my|the) (?:sentence|grammar)\b/i,
  /\bwhat'?s wrong with\b/i,
  /\bhow do i (?:fix|correct)\b/i,
  /đúng (?:chưa|không|không em|không ạ)/i,
  /sai (?:chưa|chỗ nào|ở đâu)/i,
  /sửa (?:câu|giùm|hộ|cho)/i,
  /kiểm tra (?:câu|ngữ pháp)/i,
  /câu này (?:đúng|sai)/i,
];

const LESSON_PATTERNS: ReadonlyArray<RegExp> = [
  /\bnext lesson\b/i,
  /\bwhat (?:do|should) (?:i|we) (?:study|learn|do) next\b/i,
  /\bteach me\b(?!\s+how (?:to|do you) (?:say|pronounce))/i,
  /\bcan we (?:do|start|practice)\b/i,
  /\b(?:start|begin) (?:a|the|my) (?:lesson|exercise|practice)\b/i,
  /\bgive me (?:a|an) (?:exercise|lesson|practice)\b/i,
  /\b(?:ielts|toeic|vstep) (?:speaking|writing|reading|listening)\b/i,
  /\bmock interview\b/i,
  /bài (?:tiếp theo|kế tiếp|sau)/i,
  /dạy (?:mình|em|tôi)/i,
  /học (?:gì|cái gì) (?:tiếp|tiếp theo)/i,
  /luyện (?:gì|cái gì)/i,
];

const ENCOURAGEMENT_PATTERNS: ReadonlyArray<RegExp> = [
  /\bi'?m (?:stuck|struggling|tired|frustrated|giving up|done|so confused)\b/i,
  /\bthis is (?:so|too|really) (?:hard|difficult|frustrating)\b/i,
  /\bi (?:can'?t|cannot) do this\b/i,
  /\bi don'?t (?:understand|get it)\b/i,
  /\bi feel (?:lost|confused|hopeless)\b/i,
  /\bwhy is this so hard\b/i,
  /tôi (?:nản|chán|mệt|bỏ cuộc)/i,
  /khó quá/i,
  /không hiểu (?:gì|hết)/i,
  /em (?:nản|chán|mệt)/i,
  /chán (?:quá|nản)/i,
  /(?:em|mình|tôi) (?:không|chẳng) (?:làm được|hiểu)/i,
];

// ── Target extractors ────────────────────────────────────────────────────

const QUOTED_TARGET_REGEX = /["'""]([^"'""]{1,80})["'""]/;
const WORD_AFTER_SAY_REGEX =
  /\b(?:say|pronounce|đọc|phát âm|nói)\s+(?:the word|the phrase|từ|chữ|cụm từ)?\s*["']?([A-Za-zÀ-ỹ][A-Za-zÀ-ỹ\s'-]{0,80}?)["']?\s*[?.!]?$/i;
const SENTENCE_AFTER_COLON =
  /(?:correct|fix|check|sửa|kiểm tra)[^:]*:\s*(.+?)\s*$/i;

function extractPronunciationTarget(text: string): string {
  const quoted = text.match(QUOTED_TARGET_REGEX);
  if (quoted?.[1]) return quoted[1].trim();
  const after = text.match(WORD_AFTER_SAY_REGEX);
  if (after?.[1]) return after[1].trim();
  return "";
}

function extractGrammarTarget(text: string): string {
  const colon = text.match(SENTENCE_AFTER_COLON);
  if (colon?.[1]) return colon[1].trim();
  const quoted = text.match(QUOTED_TARGET_REGEX);
  if (quoted?.[1]) return quoted[1].trim();
  return "";
}

function extractLessonTopic(text: string): string {
  // "teach me <topic>" / "dạy mình <topic>" / "next lesson on <topic>"
  const m =
    text.match(/\bteach me (?:about\s+|how to\s+)?(.+?)\s*[?.!]?$/i) ||
    text.match(/\bnext lesson(?:\s+on|\s+about)?\s+(.+?)\s*[?.!]?$/i) ||
    text.match(/dạy (?:mình|em|tôi)\s+(.+?)\s*[?.!]?$/i) ||
    text.match(/\b(ielts|toeic|vstep)\s+(speaking|writing|reading|listening)\b/i);
  if (!m) return "";
  if (m.length === 3) return `${m[1]} ${m[2]}`.toLowerCase();
  return (m[1] || "").trim();
}

// ── Public entry ─────────────────────────────────────────────────────────

function anyMatch(patterns: ReadonlyArray<RegExp>, text: string): boolean {
  for (const p of patterns) if (p.test(text)) return true;
  return false;
}

function countMatches(patterns: ReadonlyArray<RegExp>, text: string): number {
  let n = 0;
  for (const p of patterns) if (p.test(text)) n += 1;
  return n;
}

/**
 * Classify a learner message into a Mercy intent.
 *
 * Confidence rules:
 *   - 0.9 — multiple patterns match for one intent
 *   - 0.75 — single strong pattern + extractable target
 *   - 0.6 — single pattern, no target
 *   - 0.0 — no pattern (intent = chat)
 */
export function detectIntent(input: string): IntentResult {
  const raw = (input ?? "").trim();
  if (!raw) {
    return { intent: "chat", confidence: 0, target: "", language: "en" };
  }
  // For intent purposes, a quoted English token is the subject (the word
  // the learner is asking about), not code-switching. Strip it before
  // sniffing language so "Phát âm 'thirsty' sao em?" reads as 'vi'.
  const stripped = raw.replace(/["'""][^"'""]+["'""]/g, " ");
  const language = detectLanguage(stripped);

  const pronCount = countMatches(PRONUNCIATION_PATTERNS, raw);
  const gramCount = countMatches(GRAMMAR_PATTERNS, raw);
  const lessonCount = countMatches(LESSON_PATTERNS, raw);
  const encCount = countMatches(ENCOURAGEMENT_PATTERNS, raw);

  // Pick the highest-scoring intent. Ties go to a stable priority:
  // grammar > pronunciation > lesson > encouragement.
  const buckets: Array<{ intent: MercyIntent; count: number; priority: number }> = [
    { intent: "grammar_check", count: gramCount, priority: 4 },
    { intent: "pronunciation", count: pronCount, priority: 3 },
    { intent: "lesson_request", count: lessonCount, priority: 2 },
    { intent: "encouragement", count: encCount, priority: 1 },
  ];

  buckets.sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    return b.priority - a.priority;
  });

  const winner = buckets[0];
  if (winner.count === 0) {
    return { intent: "chat", confidence: 0, target: "", language };
  }

  let target = "";
  switch (winner.intent) {
    case "pronunciation":
      target = extractPronunciationTarget(raw);
      break;
    case "grammar_check":
      target = extractGrammarTarget(raw);
      break;
    case "lesson_request":
      target = extractLessonTopic(raw);
      break;
    default:
      target = "";
  }

  let confidence: number;
  if (winner.count >= 2) confidence = 0.9;
  else if (target) confidence = 0.75;
  else confidence = 0.6;

  return { intent: winner.intent, confidence, target, language };
}

// ── Helper for tests / debug ─────────────────────────────────────────────

export const __INTERNAL = {
  PRONUNCIATION_PATTERNS,
  GRAMMAR_PATTERNS,
  LESSON_PATTERNS,
  ENCOURAGEMENT_PATTERNS,
  extractPronunciationTarget,
  extractGrammarTarget,
  extractLessonTopic,
};
