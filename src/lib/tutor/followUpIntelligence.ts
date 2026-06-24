/**
 * Teacher Mercy — Follow-Up Question Intelligence Layer
 *
 * Evaluates whether a follow-up question sounds like a human teacher:
 *   - ONE question (never a barrage)
 *   - CONNECTED to the learner's answer (not a random pivot)
 *   - SPECIFIC to the learner's context (not a generic rote line)
 *   - USEFUL for practice (opens a productive learning path)
 *
 * This module does NOT generate follow-ups — speakFollowups.ts and
 * l1FollowUpLoop.ts handle generation. This module EVALUATES quality:
 * given a learner's input and Mercy's follow-up question, it scores
 * the question on the three dimensions above and returns a verdict.
 *
 * Cross-language note: learners typically type in English (or mixed
 * EN/VI), while Mercy responds in Vietnamese. The connection scorer
 * uses a bilingual EN→VI content-word bridge so "market" in the
 * learner's text connects to "chợ" in Mercy's question.
 *
 * Pure functions — no I/O, no side effects, deterministic.
 * Vietnamese-first: stopword lists and patterns cover both VI and EN.
 */

// ─── Types ────────────────────────────────────────────────────────────────

export type FollowUpQualityVerdict =
  | "excellent"
  | "good"
  | "acceptable"
  | "poor";

export type FollowUpQualityResult = {
  /** Overall verdict. */
  verdict: FollowUpQualityVerdict;
  /** Is the question connected to the learner's input? */
  connected: boolean;
  /** Connection score 0–1 (content-word overlap, cross-lingual). */
  connectionScore: number;
  /** Content words shared between learner text and question (after EN→VI bridging). */
  sharedWords: string[];
  /** Is the question specific to this learner's context? */
  specific: boolean;
  /** Is the question useful for further practice? */
  usefulForPractice: boolean;
  /** Does the response contain at most one question? */
  respectsOneQuestionMax: boolean;
  /** Number of questions detected in the follow-up text. */
  questionCount: number;
  /** Human-readable explanation in Vietnamese. */
  detailVi: string;
  /** Machine-readable reason code for telemetry. */
  reasonCode: string;
};

// ─── Stop Words ──────────────────────────────────────────────────────────

const VI_FUNCTION_WORDS = new Set([
  "và", "hoặc", "nhưng", "nếu", "thì", "vì", "nên", "khi", "trong",
  "của", "cho", "với", "về", "từ", "đến", "tại", "ở", "để", "bằng",
  "là", "có", "đã", "sẽ", "đang", "không", "chưa", "cũng", "rất",
  "một", "hai", "ba", "bốn", "năm", "những", "các", "mỗi", "này",
  "đó", "kia", "ấy", "tôi", "bạn", "anh", "chị", "em", "nó", "họ",
  "mình", "ta", "chúng", "ai", "gì", "nào", "sao", "thế", "bao",
  "vậy", "nhé", "nhỉ", "ạ", "ơi", "hả", "huh", "ừ", "dạ",
  // Common VI question words (not content-bearing on their own)
  "phải", "đúng", "được", "muốn", "biết", "thấy", "nghĩ", "nói",
]);

const EN_FUNCTION_WORDS = new Set([
  "a", "an", "the", "some", "my", "your", "his", "her", "our", "their",
  "at", "to", "in", "of", "on", "with", "about", "from", "for", "by",
  "i", "you", "he", "she", "it", "we", "they", "me", "him", "us", "them",
  "this", "that", "these", "those", "mine", "yours", "its",
  "am", "is", "are", "was", "were", "be", "been", "being",
  "do", "does", "did", "have", "has", "had", "will", "would",
  "can", "could", "shall", "should", "may", "might", "must",
  "go", "going", "went", "get", "got", "getting", "make", "made",
  "like", "liked", "want", "wanted", "need", "needed",
  "and", "but", "or", "if", "so", "because", "when", "while",
  "then", "than", "as", "there", "here", "very", "really", "just",
  "what", "where", "why", "who", "how", "which", "whose",
  "not", "no", "yes", "okay", "ok", "please", "more", "much", "many",
  "good", "bad", "nice", "big", "small", "old", "new", "great",
  "thing", "things", "stuff", "time", "way", "lot", "bit",
  "today", "yesterday", "tomorrow", "now", "day", "night",
]);

// ─── EN → VI Content-Word Bridge ─────────────────────────────────────────
//
// Learners type in English; Mercy responds in Vietnamese. Exact word
// overlap fails cross-lingually. This bridge maps common English content
// words to their Vietnamese equivalents so "market" ↔ "chợ" connects.
// It is intentionally a small, curated map — not a general translator.
// Unknown words degrade gracefully: the question can still pass via
// specificity + practice-utility if the learner input is short.

const EN_VI_CONTENT_BRIDGE: Record<string, readonly string[]> = {
  "market": ["chợ", "siêu thị"],
  "supermarket": ["siêu thị", "chợ"],
  "work": ["làm", "công việc", "việc"],
  "job": ["công việc", "việc", "nghề"],
  "bank": ["ngân hàng"],
  "movie": ["phim"],
  "film": ["phim"],
  "pizza": ["pizza"],
  "doctor": ["bác sĩ", "bệnh viện"],
  "hospital": ["bệnh viện"],
  "dinner": ["ăn", "bữa tối", "cơm", "món"],
  "lunch": ["ăn", "bữa trưa", "cơm", "món"],
  "breakfast": ["ăn", "bữa sáng", "sáng"],
  "food": ["ăn", "món", "đồ ăn", "thức ăn"],
  "eat": ["ăn"],
  "ate": ["ăn"],
  "family": ["gia đình", "nhà"],
  "grandmother": ["bà"],
  "grandfather": ["ông"],
  "mother": ["mẹ", "má"],
  "father": ["bố", "ba", "cha"],
  "brother": ["anh", "em trai"],
  "sister": ["chị", "em gái"],
  "rain": ["mưa"],
  "beach": ["biển", "bãi biển"],
  "coffee": ["cà phê", "cafe"],
  "tea": ["trà", "chè"],
  "school": ["trường", "học", "lớp"],
  "class": ["lớp", "học"],
  "teacher": ["cô", "thầy", "giáo viên", "dạy"],
  "teach": ["dạy"],
  "student": ["học sinh", "sinh viên"],
  "house": ["nhà", "ngôi nhà"],
  "home": ["nhà"],
  "car": ["xe", "ô tô"],
  "bicycle": ["xe đạp"],
  "bike": ["xe đạp"],
  "book": ["sách", "cuốn sách", "quyển sách"],
  "phone": ["điện thoại"],
  "computer": ["máy tính"],
  "music": ["nhạc", "âm nhạc"],
  "song": ["bài hát", "nhạc"],
  "football": ["bóng đá"],
  "soccer": ["bóng đá"],
  "sport": ["thể thao"],
  "travel": ["du lịch", "đi"],
  "trip": ["chuyến đi", "du lịch"],
  "friend": ["bạn", "bạn bè"],
  "dog": ["chó"],
  "cat": ["mèo"],
  "pet": ["thú cưng", "vật nuôi"],
  "hat": ["mũ", "nón"],
  "clothes": ["quần áo", "đồ"],
  "shopping": ["mua sắm", "mua"],
  "buy": ["mua"],
  "bought": ["mua"],
  "sell": ["bán"],
  "play": ["chơi"],
  "read": ["đọc"],
  "write": ["viết"],
  "study": ["học", "học tập"],
  "learn": ["học"],
  "cook": ["nấu", "nấu ăn"],
  "swim": ["bơi", "bơi lội"],
  "swimming": ["bơi", "bơi lội"],
  "run": ["chạy"],
  "walk": ["đi bộ"],
  "sleep": ["ngủ"],
  "morning": ["sáng", "buổi sáng"],
  "afternoon": ["chiều", "buổi chiều"],
  "evening": ["tối", "buổi tối"],
  "night": ["đêm", "tối"],
  "weekend": ["cuối tuần"],
  "yesterday": ["hôm qua"],
  "today": ["hôm nay"],
  "tomorrow": ["ngày mai"],
  "visit": ["thăm", "đi", "ghé"],
  "visited": ["thăm", "đi", "ghé"],
  "vegetable": ["rau"],
  "vegetables": ["rau"],
  "fruit": ["trái cây", "hoa quả"],
  "fruits": ["trái cây", "hoa quả"],
  "fish": ["cá"],
  "meat": ["thịt"],
  "rice": ["cơm", "gạo"],
  "water": ["nước"],
  "drink": ["uống", "nước"],
  "party": ["tiệc", "buổi tiệc"],
  "birthday": ["sinh nhật"],
  "gift": ["quà"],
  "present": ["quà"],
  "holiday": ["nghỉ", "kỳ nghỉ", "lễ"],
  "vacation": ["nghỉ", "kỳ nghỉ", "du lịch"],
  "weather": ["thời tiết"],
  "sunny": ["nắng", "trời nắng"],
  "cold": ["lạnh"],
  "hot": ["nóng"],
  "city": ["thành phố"],
  "country": ["nước", "đất nước", "quê"],
  "village": ["làng", "quê"],
  "language": ["tiếng", "ngôn ngữ"],
  "english": ["tiếng anh"],
  "vietnamese": ["tiếng việt"],
  "restaurant": ["nhà hàng", "quán"],
  "shop": ["cửa hàng", "tiệm", "quán"],
  "store": ["cửa hàng", "tiệm", "siêu thị"],
  "hospital_place": ["bệnh viện"],
  "park": ["công viên"],
  "garden": ["vườn"],
  "room": ["phòng"],
  "bedroom": ["phòng ngủ"],
  "kitchen": ["bếp", "nhà bếp"],
  "office": ["văn phòng"],
  "airport": ["sân bay"],
  "station": ["ga", "trạm", "bến"],
  "bus": ["xe buýt"],
  "train": ["tàu", "tàu hỏa", "xe lửa"],
  "plane": ["máy bay"],
  "taxi": ["taxi"],
  "color": ["màu"],
  "colour": ["màu"],
  "size": ["cỡ", "kích cỡ", "size"],
  "price": ["giá"],
  "money": ["tiền"],
};

/**
 * Bridge English content words to potential Vietnamese equivalents.
 * Multi-word VI phrases are split into individual tokens so they match
 * against tokenized question text (e.g., "bệnh viện" → ["bệnh", "viện"]).
 * Unknown EN words are silently skipped.
 */
function bridgeEnToVi(enWords: string[]): string[] {
  const viCandidates: string[] = [];
  for (const word of enWords) {
    const viWords = EN_VI_CONTENT_BRIDGE[word];
    if (viWords) {
      for (const viWord of viWords) {
        // Split multi-word VI phrases into individual tokens
        viCandidates.push(...viWord.split(/\s+/));
      }
    }
  }
  return viCandidates;
}

// ─── Generic / Rote Question Detection ───────────────────────────────────

/**
 * Questions that are clearly generic — they could be asked to ANY learner
 * with zero context. A human teacher wouldn't ask these as follow-ups
 * because they don't connect to what the learner just said.
 */
const GENERIC_QUESTION_PATTERNS: ReadonlyArray<{
  pattern: RegExp;
  label: string;
}> = [
  // English generic questions
  { pattern: /\bhow are you\b/i, label: "generic_greeting_en" },
  { pattern: /\bwhat(?:'s| is) your name\b/i, label: "generic_name_en" },
  { pattern: /\bwhere (?:are|do) you (?:from|live)\b/i, label: "generic_origin_en" },
  { pattern: /\bhow old are you\b/i, label: "generic_age_en" },
  { pattern: /\bdo you (?:like|speak) english\b/i, label: "generic_english_en" },
  { pattern: /\bwhat(?:'s| is) your (?:job|favorite)\b/i, label: "generic_job_en" },
  { pattern: /\bcan you repeat that\b/i, label: "generic_repeat_en" },
  { pattern: /\bdo you understand\b/i, label: "generic_understand_en" },
  { pattern: /\bis that (?:clear|ok(?:ay)?)\??$/i, label: "generic_check_en" },
  { pattern: /\bany questions\??$/i, label: "generic_any_questions_en" },
  { pattern: /\bwhat else\??$/i, label: "generic_what_else_en" },
  // Vietnamese generic questions — use sentence-start anchoring so "bạn"
  // as the subject ("you") is distinguished from "của bạn" ("your").
  // Example: "Bạn sống ở đâu?" (generic) vs "Bà của bạn sống ở đâu?" (legit follow-up).
  { pattern: /(?:^|[.?!]\s+)\bbạn (?:có )?khỏe không\b/i, label: "generic_greeting_vi" },
  { pattern: /(?:^|[.?!]\s+)\bbạn tên (?:là )?gì(?:$|[\s?!.,；。？])/i, label: "generic_name_vi" },
  { pattern: /(?:^|[.?!]\s+)\bbạn (?:đến từ|ở|sống ở) đâu(?:$|[\s?!.,；。？])/i, label: "generic_origin_vi" },
  { pattern: /(?:^|[.?!]\s+)\bbạn bao nhiêu tuổi(?:$|[\s?!.,；。？])/i, label: "generic_age_vi" },
  { pattern: /(?:^|[.?!]\s+)\bbạn (?:có )?thích tiếng anh không\b/i, label: "generic_english_vi" },
  { pattern: /(?:^|[.?!]\s+)\bbạn (?:có )?hiểu không\b/i, label: "generic_understand_vi" },
  { pattern: /(?:^|[.?!]\s+)\bbạn nói lại (?:được|nhé|câu đó)/i, label: "generic_repeat_vi" },
  { pattern: /(?:^|[.?!]\s+)\bcó câu hỏi (?:gì|nào) không\b/i, label: "generic_any_questions_vi" },
  { pattern: /(?:^|[.?!]\s+)\bbạn muốn (?:hỏi|luyện) (?:gì|thêm gì)/i, label: "generic_what_next_vi" },
  // Generic conversation pivots (not follow-ups)
  { pattern: /\bdo you want to practice another sentence\b/i, label: "generic_pivot_en" },
  { pattern: /\bbạn muốn (?:thử|luyện) (?:câu|bài) khác\b/i, label: "generic_pivot_vi" },
];

/**
 * Yes/no questions that are structurally closed — they invite a one-word
 * answer rather than language production.
 */
const YES_NO_QUESTION_STARTERS_EN = new Set([
  "do you", "did you", "are you", "is it", "was it", "were you",
  "have you", "has it", "will you", "would you", "can you",
  "could you", "should you", "does it", "did it",
]);

const YES_NO_QUESTION_STARTERS_VI = new Set([
  "bạn có", "anh có", "chị có", "có phải", "có đúng",
]);

// ─── Content Word Extraction ─────────────────────────────────────────────

function extractContentWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 2)
    .filter((w) => !VI_FUNCTION_WORDS.has(w))
    .filter((w) => !EN_FUNCTION_WORDS.has(w));
}

function jaccardSimilarity(a: string[], b: string[]): number {
  const setA = new Set(a);
  const setB = new Set(b);
  if (setA.size === 0 && setB.size === 0) return 0;
  let intersection = 0;
  for (const word of setA) {
    if (setB.has(word)) intersection++;
  }
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

// ─── Question Counting ───────────────────────────────────────────────────

const QUESTION_MARKERS = ["?", "？"];

function countQuestions(text: string): number {
  let count = 0;
  for (const char of text) {
    if (QUESTION_MARKERS.includes(char)) count++;
  }
  return count;
}

// ─── Core Assessment Functions ───────────────────────────────────────────

/**
 * Check if a follow-up question is connected to the learner's text.
 *
 * Uses cross-lingual matching: English content words from the learner's
 * text are bridged to Vietnamese equivalents, then compared against
 * Vietnamese content words in the follow-up question. This handles the
 * common case where the learner types in English and Mercy responds in
 * Vietnamese.
 *
 * Also checks direct word overlap (for when both are in the same language,
 * or for loanwords like "pizza", "coffee", etc.).
 *
 * Threshold: Jaccard similarity ≥ 0.08. For very short learner input
 * (≤ 3 content words), the threshold drops to 0.04.
 * For empty learner input, connection is always false.
 */
export function assessConnection(
  learnerText: string,
  followUpQuestion: string,
): { connected: boolean; score: number; sharedWords: string[] } {
  const learnerWords = extractContentWords(learnerText);
  const questionWords = extractContentWords(followUpQuestion);

  // Empty learner input → can't be connected
  if (learnerWords.length === 0) {
    return { connected: false, score: 0, sharedWords: [] };
  }

  // Direct overlap (same language, loanwords, etc.)
  const directScore = jaccardSimilarity(learnerWords, questionWords);

  // Cross-lingual: bridge EN learner words → VI equivalents, match against VI question
  const viBridged = bridgeEnToVi(learnerWords);
  const crossScore = jaccardSimilarity(viBridged, questionWords);

  // Use the better of the two scores
  const score = Math.max(directScore, crossScore);

  // Collect shared words for diagnostics
  const directShared = learnerWords.filter((w) => questionWords.includes(w));
  const crossShared = viBridged.filter((w) => questionWords.includes(w));
  const sharedWords = [...new Set([...directShared, ...crossShared])];

  const threshold = learnerWords.length <= 3 ? 0.04 : 0.08;

  return {
    connected: score >= threshold,
    score: Math.round(score * 100) / 100,
    sharedWords,
  };
}

/**
 * Check if a follow-up question is specific to the learner's context.
 * Returns false if the question matches any generic/rote pattern.
 */
export function assessSpecificity(
  followUpQuestion: string,
): { specific: boolean; matchedGenericPattern: string | null } {
  for (const entry of GENERIC_QUESTION_PATTERNS) {
    if (entry.pattern.test(followUpQuestion)) {
      return { specific: false, matchedGenericPattern: entry.label };
    }
  }
  return { specific: true, matchedGenericPattern: null };
}

/**
 * Assess whether a follow-up question is useful for further practice.
 *
 * A useful question:
 *   - Is open-ended (not just yes/no)
 *   - Invites the learner to produce NEW language
 *   - Extends the current topic rather than pivoting away
 */
export function assessPracticeUtility(
  followUpQuestion: string,
): { useful: boolean; isOpenEnded: boolean; reason: string } {
  const trimmed = followUpQuestion.trim().toLowerCase();

  if (!trimmed) {
    return { useful: false, isOpenEnded: false, reason: "empty_question" };
  }

  // Check if it starts as a yes/no question in English
  const enWords = trimmed.split(/\s+/);
  const firstTwoEn = enWords.slice(0, 2).join(" ");
  const firstThreeEn = enWords.slice(0, 3).join(" ");

  if (
    YES_NO_QUESTION_STARTERS_EN.has(firstTwoEn) ||
    YES_NO_QUESTION_STARTERS_EN.has(firstThreeEn)
  ) {
    if (trimmed.length < 35) {
      return { useful: false, isOpenEnded: false, reason: "yes_no_question_too_short" };
    }
    return { useful: true, isOpenEnded: false, reason: "yes_no_with_elaboration_context" };
  }

  // Check Vietnamese yes/no starters
  for (const starter of YES_NO_QUESTION_STARTERS_VI) {
    if (trimmed.startsWith(starter)) {
      if (trimmed.length < 25) {
        return { useful: false, isOpenEnded: false, reason: "yes_no_question_vi_too_short" };
      }
      return { useful: true, isOpenEnded: false, reason: "yes_no_vi_with_elaboration_context" };
    }
  }

  // Open-ended WH-questions
  const whStartersEn = ["what", "why", "how", "where", "when", "who", "which", "whose"];
  const whStartersVi = ["tại sao", "vì sao", "như thế nào", "làm sao", "thế nào"];

  if (whStartersEn.some((w) => trimmed.startsWith(w))) {
    return { useful: true, isOpenEnded: true, reason: "open_ended_wh_question" };
  }
  if (whStartersVi.some((w) => trimmed.startsWith(w))) {
    return { useful: true, isOpenEnded: true, reason: "open_ended_wh_question" };
  }

  // Vietnamese open-ended patterns — use explicit whitespace/punctuation
  // boundaries instead of \b (JS \b only recognises ASCII word chars; it
  // treats Vietnamese letters like "ì" as non-word, so \bgì\b never matches).
  const viOpenIndicators = ["gì", "nào", "sao", "như thế nào", "kể thêm", "mô tả", "giải thích"];
  if (viOpenIndicators.some((w) => trimmed.includes(w))) {
    return { useful: true, isOpenEnded: true, reason: "open_ended_vi_question" };
  }

  // Imperative prompts ("Tell me more about…", "Kể thêm về…")
  const imperativePrompts = [
    /\btell me\b/, /\bdescribe\b/, /\bexplain\b/, /\bkể\b/, /\btả\b/,
  ];
  if (imperativePrompts.some((p) => p.test(trimmed))) {
    return { useful: true, isOpenEnded: true, reason: "imperative_practice_prompt" };
  }

  // Fallback: ends with ? and has reasonable length
  if (trimmed.length >= 20 && QUESTION_MARKERS.some((m) => trimmed.endsWith(m))) {
    return { useful: true, isOpenEnded: true, reason: "question_with_substance" };
  }

  return { useful: false, isOpenEnded: false, reason: "not_clearly_useful_for_practice" };
}

// ─── Public API ──────────────────────────────────────────────────────────

/**
 * Assess follow-up question quality against the human-teacher standard.
 *
 * Pure function — deterministic, no I/O, no side effects.
 *
 * @param learnerText — what the learner just said/wrote
 * @param followUpQuestion — Mercy's follow-up question (just the question)
 * @returns FollowUpQualityResult with verdict and per-dimension scores
 */
export function assessFollowUpQuality(
  learnerText: string,
  followUpQuestion: string,
): FollowUpQualityResult {
  const connection = assessConnection(learnerText, followUpQuestion);
  const specificity = assessSpecificity(followUpQuestion);
  const practiceUtility = assessPracticeUtility(followUpQuestion);
  const questionCount = countQuestions(followUpQuestion);
  const respectsOneQuestionMax = questionCount <= 1;

  // ── Verdict Logic ──
  //   1. > 1 question → "poor" (barrage)
  //   2. generic AND disconnected → "poor"
  //   3. connected + specific + useful → "excellent"
  //   4. connected + specific → "good"
  //   5. (connected or specific) AND useful → "acceptable"
  //   6. connected only (not specific, not useful) → "acceptable"
  //   7. otherwise → "poor"

  let verdict: FollowUpQualityVerdict;
  let reasonCode: string;

  if (!respectsOneQuestionMax) {
    verdict = "poor";
    reasonCode = "question_barrage";
  } else if (!specificity.specific && !connection.connected) {
    verdict = "poor";
    reasonCode = "generic_and_disconnected";
  } else if (connection.connected && specificity.specific && practiceUtility.useful) {
    verdict = "excellent";
    reasonCode = "connected_specific_useful";
  } else if (connection.connected && specificity.specific) {
    verdict = "good";
    reasonCode = "connected_and_specific";
  } else if ((connection.connected || specificity.specific) && practiceUtility.useful) {
    verdict = "acceptable";
    reasonCode = "partially_connected_or_specific_but_useful";
  } else if (connection.connected) {
    verdict = "acceptable";
    reasonCode = "connected_but_not_specific_or_useful";
  } else {
    verdict = "poor";
    reasonCode = "not_connected";
  }

  // ── Detail in Vietnamese ──
  const parts: string[] = [];

  if (!respectsOneQuestionMax) {
    parts.push(`${questionCount} câu hỏi — chỉ nên có 1 câu.`);
  }
  if (!connection.connected) {
    parts.push(
      `Câu hỏi không liên quan đến điều người học vừa nói (điểm kết nối: ${connection.score}).`,
    );
  } else {
    const sharedLabel = connection.sharedWords.length > 0
      ? connection.sharedWords.slice(0, 3).join(", ")
      : "ngữ cảnh";
    parts.push(`Câu hỏi có liên quan đến "${sharedLabel}" từ câu của người học.`);
  }
  if (!specificity.specific) {
    parts.push(`Câu hỏi chung chung (${specificity.matchedGenericPattern}).`);
  }
  if (!practiceUtility.useful) {
    parts.push(`Câu hỏi không mở ra cơ hội luyện tập mới (${practiceUtility.reason}).`);
  }

  return {
    verdict,
    connected: connection.connected,
    connectionScore: connection.score,
    sharedWords: connection.sharedWords,
    specific: specificity.specific,
    usefulForPractice: practiceUtility.useful,
    respectsOneQuestionMax,
    questionCount,
    detailVi: parts.length > 0 ? parts.join(" ") : "Câu hỏi tiếp nối tốt — tự nhiên và hữu ích.",
    reasonCode,
  };
}

/**
 * Quick check: is this a high-quality follow-up?
 * Returns true only for "excellent" or "good" verdicts.
 */
export function isGoodFollowUp(
  learnerText: string,
  followUpQuestion: string,
): boolean {
  const result = assessFollowUpQuality(learnerText, followUpQuestion);
  return result.verdict === "excellent" || result.verdict === "good";
}

/**
 * Quick check: is this follow-up at least acceptable?
 */
export function isAcceptableFollowUp(
  learnerText: string,
  followUpQuestion: string,
): boolean {
  const result = assessFollowUpQuality(learnerText, followUpQuestion);
  return result.verdict !== "poor";
}

/**
 * Evaluate follow-up quality from the full response vi text.
 * Extracts the follow-up question and assesses it.
 *
 * Note: question counting runs on the FULL response text to catch barrages
 * (assessFollowUpFromResponse checks all questions in the full text).
 */
export function assessFollowUpFromResponse(
  learnerText: string,
  responseVi: string,
): FollowUpQualityResult {
  // Count questions in the FULL response (catches barrages)
  const totalQuestions = countQuestions(responseVi);

  // Extract the first follow-up question sentence for quality assessment
  const questionMatch = responseVi.match(/[^.!?？]*[?？]/);
  const followUpQuestion = questionMatch ? questionMatch[0].trim() : "";

  if (!followUpQuestion) {
    return {
      verdict: "poor",
      connected: false,
      connectionScore: 0,
      sharedWords: [],
      specific: false,
      usefulForPractice: false,
      respectsOneQuestionMax: totalQuestions <= 1,
      questionCount: totalQuestions,
      detailVi: "Không tìm thấy câu hỏi tiếp nối trong phản hồi.",
      reasonCode: "no_question_found",
    };
  }

  // Assess quality of the extracted question, but use the FULL text's
  // question count for the barrage check
  const result = assessFollowUpQuality(learnerText, followUpQuestion);

  // Override question count and barrage check with full-response values
  return {
    ...result,
    questionCount: totalQuestions,
    respectsOneQuestionMax: totalQuestions <= 1,
    // Re-evaluate verdict if the barrage status changed
    verdict: totalQuestions > 1
      ? "poor"
      : result.verdict,
    reasonCode: totalQuestions > 1
      ? "question_barrage"
      : result.reasonCode,
    detailVi: totalQuestions > 1
      ? `${totalQuestions} câu hỏi trong phản hồi — chỉ nên có 1 câu.`
      : result.detailVi,
  };
}

// ─── Catalog ─────────────────────────────────────────────────────────────

export const FOLLOW_UP_INTELLIGENCE_DIMENSIONS = [
  {
    id: "connection" as const,
    titleVi: "Liên kết với câu người học",
    titleEn: "Connected to learner input",
    descriptionVi: "Câu hỏi chia sẻ từ khóa nội dung với câu người học vừa nói.",
  },
  {
    id: "specificity" as const,
    titleVi: "Cụ thể, không chung chung",
    titleEn: "Specific, not generic",
    descriptionVi: "Câu hỏi gắn với ngữ cảnh của người học, không phải câu hỏi mẫu chung.",
  },
  {
    id: "practice_utility" as const,
    titleVi: "Hữu ích cho luyện tập",
    titleEn: "Useful for practice",
    descriptionVi: "Câu hỏi mở ra cơ hội người học sản xuất ngôn ngữ mới, không chỉ trả lời có/không.",
  },
  {
    id: "one_question_max" as const,
    titleVi: "Tối đa một câu hỏi",
    titleEn: "One question maximum",
    descriptionVi: "Không dồn dập nhiều câu hỏi cùng lúc — đúng một câu.",
  },
];
