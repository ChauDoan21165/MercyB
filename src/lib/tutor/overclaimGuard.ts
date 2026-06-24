/**
 * Teacher Mercy — Fake-Certainty and Overclaim Guard (O1-O8)
 *
 * O1-O8 gate chain that scans Teacher Mercy's response text BEFORE it reaches
 * the learner, detecting patterns of fake certainty, overclaiming, and
 * unwarranted authority.
 *
 * A strong human teacher knows what she doesn't know. She hedges appropriately,
 * admits uncertainty, and never invents statistics or guarantees outcomes.
 * This guard enforces that — catching the LLM tendencies to:
 *   - Use absolute language ("always", "never", "100%")
 *   - Invent statistics ("90% of learners…")
 *   - Overpromise results ("you'll never make this mistake again")
 *   - Claim to know the learner's internal state ("you're confused")
 *   - Present exception-prone rules as universal truths
 *   - Position herself as an infallible authority
 *
 * O1-O8 Gate Chain (short-circuits on first non-null decision):
 *   O1 — Absolute Certainty Language: detects "luôn luôn", "không bao giờ", "100%", etc.
 *   O2 — Fake Statistics / Made-Up Data: detects invented percentages, "research shows"
 *   O3 — Overpromising Outcomes: detects "sẽ không bao giờ sai nữa", "bảo đảm"
 *   O4 — Claiming Learner Internal State: detects "bạn đang bối rối", "bạn nghĩ rằng"
 *   O5 — Missing Hedge on Exception-Prone Rules: rules stated without hedging
 *   O6 — Overclaiming Rule Scope: "tất cả động từ", "mọi danh từ"
 *   O7 — Claiming "No Exceptions": direct claims that a rule has no exceptions
 *   O8 — Overclaiming Teacher Authority: "cô biết chắc", "cô đảm bảo", "tin cô đi"
 *
 * Default: PASS (no overclaiming detected)
 *
 * Design principles:
 *   1. Pure functions — no I/O, no side effects, deterministic.
 *   2. Vietnamese-first — all detail messages and patterns in Vietnamese.
 *   3. Short-circuit — first blocking decision wins; no wasted computation.
 *   4. Pattern-based — each gate uses regex patterns tuned to Vietnamese tutor speech.
 *   5. Non-destructive — never modifies the response; only decides pass/flag/revise/block.
 *
 * Pure functions — no I/O, no side effects, deterministic.
 */

// ─── Overclaim Guard Types ──────────────────────────────────────────────────

/**
 * What the overclaim guard decides about the response.
 *
 * PASS               — no overclaiming detected; response is honest and appropriately hedged.
 * FLAG               — minor overclaim patterns found; show but log for human review.
 * REVISE             — significant overclaiming; rewrite the affected sentences before showing.
 * BLOCK              — dangerous overclaim (fake statistics, guarantees); must not show.
 */
export type OverclaimDecision = "PASS" | "FLAG" | "REVISE" | "BLOCK";

/**
 * Result of a single overclaim gate check.
 */
export type OverclaimGateResult = {
  /** Gate identifier (O1-O8). */
  gateId: string;
  /** Vietnamese title for this gate. */
  titleVi: string;
  /** English title for this gate. */
  titleEn: string;
  /** Whether this gate passed (no issues found). */
  passed: boolean;
  /** The decision from this gate, if it fired. null = pass through. */
  decision: OverclaimDecision | null;
  /** Vietnamese explanation of the finding. */
  detailVi: string;
  /** English explanation for telemetry/logging. */
  detailEn: string;
  /** Machine-readable reason code. */
  reasonCode: string;
  /** The specific matched text snippet that triggered this gate (if any). */
  matchedSnippet: string | null;
};

/**
 * Input for the overclaim guard.
 */
export type OverclaimGuardInput = {
  /** The tutor's Vietnamese explanation / response text to scan. */
  explanationVi: string;
  /** The learner's raw text (for context — e.g., O4 checks against learner input). */
  learnerText?: string;
  /** The learner's CEFR level (null if unknown). Used by O5 for rule-appropriateness. */
  cefrLevel?: string | null;
};

/**
 * Aggregate result of the overclaim guard gate chain.
 */
export type OverclaimGuardResult = {
  /** The final decision: PASS, FLAG, REVISE, or BLOCK. */
  decision: OverclaimDecision;
  /** Whether the response is safe to show (PASS or FLAG). */
  canShow: boolean;
  /** Whether the response needs revision before showing. */
  needsRevision: boolean;
  /** Whether the response is blocked (must not show). */
  isBlocked: boolean;
  /** Per-gate results in evaluation order (O1-O8). */
  gates: OverclaimGateResult[];
  /** Count of gates that passed. */
  passedCount: number;
  /** Count of gates that fired (returned a non-null decision). */
  firedCount: number;
  /** The gate that made the final decision (O1-O8), or null if defaulted. */
  decidingGate: string | null;
  /** Vietnamese summary suitable for display or logging. */
  summaryVi: string;
  /** English summary for telemetry. */
  summaryEn: string;
  /** All matched snippets across all firing gates, for review. */
  allMatchedSnippets: string[];
};

// ─── Gate IDs ────────────────────────────────────────────────────────────────

const GATE_IDS = {
  O1: "O1_ABSOLUTE_CERTAINTY",
  O2: "O2_FAKE_STATISTICS",
  O3: "O3_OVERPROMISING_OUTCOMES",
  O4: "O4_CLAIMING_LEARNER_STATE",
  O5: "O5_MISSING_HEDGE",
  O6: "O6_OVERCLAIMING_SCOPE",
  O7: "O7_NO_EXCEPTIONS_CLAIM",
  O8: "O8_OVERCLAIMING_AUTHORITY",
} as const;

// ─── Pattern Definitions ─────────────────────────────────────────────────────

/**
 * O1 — Absolute Certainty Language
 *
 * English grammar rules ALMOST ALWAYS have exceptions. When Teacher Mercy uses
 * absolute language, she's almost certainly wrong. These patterns catch
 * universal quantifiers and absolute adverbs that shouldn't appear in grammar
 * explanations.
 *
 * Severity: REVISE (unless combined with appropriate hedging in the same sentence).
 */
const O1_ABSOLUTE_PATTERNS: ReadonlyArray<{
  pattern: RegExp;
  label: string;
}> = [
  // Vietnamese absolute language
  { pattern: /luôn\s+luôn/i, label: "luôn luôn" },
  { pattern: /không\s+bao\s+giờ/i, label: "không bao giờ" },
  { pattern: /tất\s+cả\s+các\s+trường\s+hợp/i, label: "tất cả các trường hợp" },
  { pattern: /mọi\s+lúc/i, label: "mọi lúc" },
  { pattern: /mọi\s+trường\s+hợp/i, label: "mọi trường hợp" },
  { pattern: /tuyệt\s+đối\s+(?:luôn|không)/i, label: "tuyệt đối" },
  { pattern: /100%\s*(?:đúng|chính\s+xác|luôn)/i, label: "100% (khẳng định tuyệt đối)" },
  { pattern: /không\s+có\s+một\s+ngoại\s+lệ\s+nào/i, label: "không có một ngoại lệ nào" },
  { pattern: /bất\s+kỳ\s+(?:ai|cái\s+gì|khi\s+nào)\s+cũng/i, label: "bất kỳ…cũng (khẳng định tuyệt đối)" },
  // English absolute language in Vietnamese responses (mixed-language)
  { pattern: /\balways\b(?!.*\b(?:usually|often|sometimes|generally)\b)/i, label: "always (không hedge)" },
  { pattern: /\bnever\b(?!.*\b(?:usually|often|sometimes|generally|rarely)\b)/i, label: "never (không hedge)" },
  { pattern: /\bevery\s+single\s+time\b/i, label: "every single time" },
];

/**
 * O2 — Fake Statistics / Made-Up Data
 *
 * Teacher Mercy has no access to learner statistics, research databases, or
 * empirical studies. Any numbers, percentages, or appeals to "research" are
 * invented by the LLM and must be flagged.
 *
 * Severity: BLOCK (fake data is misinformation).
 */
const O2_FAKE_STATS_PATTERNS: ReadonlyArray<{
  pattern: RegExp;
  label: string;
}> = [
  { pattern: /\d{1,3}%\s*(?:người\s+học|học\s+viên|người\s+Việt|học\s+sinh)/i, label: "X% người học (số liệu bịa)" },
  { pattern: /khoảng\s+\d{1,3}%\s+(?:người|học|trường\s+hợp)/i, label: "khoảng X% (số liệu bịa)" },
  { pattern: /hơn\s+\d{1,3}%\s+(?:người|học|trường\s+hợp)/i, label: "hơn X% (số liệu bịa)" },
  { pattern: /theo\s+nghiên\s+cứu/i, label: "theo nghiên cứu (không có nguồn)" },
  { pattern: /nghiên\s+cứu\s+cho\s+thấy/i, label: "nghiên cứu cho thấy (không có nguồn)" },
  { pattern: /số\s+liệu\s+cho\s+thấy/i, label: "số liệu cho thấy (không có nguồn)" },
  { pattern: /thống\s+kê\s+(?:cho\s+thấy|chỉ\s+ra)/i, label: "thống kê cho thấy (không có nguồn)" },
  { pattern: /(?:hầu\s+hết|đa\s+số|phần\s+lớn)\s+(?:người\s+Việt|học\s+viên)\s+(?:đều\s+)?(?:mắc|gặp|bị|sai)/i, label: "đa số người Việt mắc… (khẳng định không bằng chứng)" },
  { pattern: /studies?\s+(?:show|prove|demonstrate)/i, label: "studies show (không có nguồn)" },
  { pattern: /research\s+(?:shows?|proves?|indicates?)/i, label: "research shows (không có nguồn)" },
];

/**
 * O3 — Overpromising Outcomes
 *
 * A good teacher never guarantees learning outcomes. Promises like "you'll never
 * make this mistake again" or "this rule will fix everything" are dishonest —
 * learning is gradual and non-linear.
 *
 * Severity: REVISE (overpromising erodes trust when the promise inevitably breaks).
 */
const O3_OVERPROMISE_PATTERNS: ReadonlyArray<{
  pattern: RegExp;
  label: string;
}> = [
  { pattern: /sẽ\s+không\s+bao\s+giờ\s+sai\s+(?:nữa|lại)/i, label: "sẽ không bao giờ sai nữa" },
  { pattern: /sẽ\s+không\s+bao\s+giờ\s+mắc\s+lỗi/i, label: "sẽ không bao giờ mắc lỗi" },
  { pattern: /sẽ\s+thành\s+thạo\s+(?:ngay|sau\s+bài\s+này)/i, label: "sẽ thành thạo ngay" },
  { pattern: /sẽ\s+giỏi\s+(?:ngay|tức\s+thì|lập\s+tức)/i, label: "sẽ giỏi ngay" },
  { pattern: /bảo\s+đảm\s+(?:rằng\s+)?(?:bạn\s+sẽ|sẽ)/i, label: "bảo đảm bạn sẽ" },
  { pattern: /đảm\s+bảo\s+(?:rằng\s+)?(?:bạn\s+sẽ|sẽ)/i, label: "đảm bảo bạn sẽ" },
  { pattern: /cam\s+đoan\s+(?:rằng\s+)?(?:bạn\s+sẽ|sẽ)/i, label: "cam đoan bạn sẽ" },
  { pattern: /chỉ\s+cần\s+nhớ\s+quy\s+tắc\s+này\s+là\s+đủ/i, label: "chỉ cần nhớ quy tắc này là đủ" },
  { pattern: /quy\s+tắc\s+này\s+(?:sẽ\s+)?giúp\s+bạn\s+(?:luôn|không\s+bao\s+giờ)/i, label: "quy tắc này giúp bạn luôn…" },
  { pattern: /sau\s+bài\s+này\s+bạn\s+sẽ\s+(?:nói|viết)(?:\s+tiếng\s+Anh)?\s+(?:như\s+người\s+bản\s+xứ|hoàn\s+hảo|chuẩn)/i, label: "sau bài này bạn sẽ nói như người bản xứ" },
  { pattern: /guarantee\b/i, label: "guarantee (bảo đảm kết quả)" },
];

/**
 * O4 — Claiming Knowledge of Learner's Internal State
 *
 * A human teacher can observe confusion, but Teacher Mercy is working from text
 * input only. Claims about what the learner "is thinking", "is feeling", or
 * "doesn't understand" are projections, not observations. They feel invasive
 * and presumptuous.
 *
 * Exception: when the learner explicitly states their feeling ("Em thấy khó hiểu"),
 * acknowledging it is appropriate. This gate only fires when the tutor asserts
 * internal state WITHOUT the learner having expressed it.
 *
 * Severity: FLAG (presumptuous but not dangerous — flag for review).
 */
const O4_LEARNER_STATE_PATTERNS: ReadonlyArray<{
  pattern: RegExp;
  label: string;
}> = [
  { pattern: /bạn\s+đang\s+bối\s+rối/i, label: "bạn đang bối rối" },
  { pattern: /bạn\s+đang\s+cảm\s+thấy\s+(?:tự\s+ti|kém|chán|nản|lo|lắng|sợ)/i, label: "bạn đang cảm thấy…" },
  { pattern: /bạn\s+không\s+tự\s+tin/i, label: "bạn không tự tin" },
  { pattern: /bạn\s+(?:đang\s+)?nghĩ\s+rằng/i, label: "bạn nghĩ rằng…" },
  { pattern: /bạn\s+(?:cảm\s+thấy|thấy)\s+(?:rằng\s+)?mình\s+(?:dở|kém|yếu)/i, label: "bạn cảm thấy mình dở/kém" },
  { pattern: /bạn\s+đang\s+loay\s+hoay/i, label: "bạn đang loay hoay" },
  { pattern: /bạn\s+chưa\s+nắm\s+được/i, label: "bạn chưa nắm được (khẳng định)" },
  { pattern: /bạn\s+đang\s+gặp\s+khó\s+khăn\s+với/i, label: "bạn đang gặp khó khăn với" },
  { pattern: /bạn\s+đang\s+bị\s+(?:rối|nhầm|lú)/i, label: "bạn đang bị rối/nhầm/lú" },
  { pattern: /bạn\s+thấy\s+(?:khó|nản|mệt)\s+(?:quá|vô\s+cùng|rất)/i, label: "bạn thấy khó/nản/mệt" },
];

/**
 * O5 — Missing Hedge on Exception-Prone Rules
 *
 * When Teacher Mercy states a grammar rule, she should hedge appropriately
 * because English grammar rules almost always have exceptions. This gate
 * detects rule-stating language (e.g., "quy tắc là", "công thức là") that is
 * NOT accompanied by hedging language (e.g., "thường", "đa số", "hầu hết").
 *
 * Not all rules need hedging — basic rules at A1/A2 level may be stated
 * more directly. This gate applies a stricter standard for B1+ content.
 *
 * Severity: FLAG (add hedging — minor revision).
 */
const O5_RULE_CLAIMING_PATTERNS: ReadonlyArray<{
  pattern: RegExp;
  label: string;
}> = [
  { pattern: /quy\s+tắc\s+(?:này\s+)?(?:là|rất\s+đơn\s+giản|là\s+thế\s+này)/i, label: "quy tắc là" },
  { pattern: /công\s+thức\s+(?:này\s+)?(?:là|luôn\s+là)/i, label: "công thức là" },
  { pattern: /(?:bạn|em|mình)\s+(?:phải\s+luôn|luôn\s+phải)/i, label: "luôn phải" },
  { pattern: /bắt\s+buộc\s+phải/i, label: "bắt buộc phải" },
  { pattern: /cứ\s+(?:có|gặp|thấy)\s+.+\s+là\s+phải/i, label: "cứ…là phải (quy tắc tuyệt đối)" },
  { pattern: /lúc\s+nào\s+cũng\s+phải/i, label: "lúc nào cũng phải" },
];

const O5_HEDGING_PATTERNS: ReadonlyArray<RegExp> = [
  /thường(?:\s+(?:thì|là|thường))?/i,
  /đa\s+số/i,
  /hầu\s+hết/i,
  /phần\s+lớn/i,
  /có\s+thể/i,
  /thường\s+thường/i,
  /đôi\s+khi/i,
  /thỉnh\s+thoảng/i,
  /nói\s+chung/i,
  /nhìn\s+chung/i,
  /về\s+cơ\s+bản/i,
  /đa\s+phần/i,
  /có\s+lẽ/i,
  /dường\s+như/i,
  /hình\s+như/i,
  /thường\s+là\s+như\s+(?:vậy|thế)/i,
  /không\s+phải\s+lúc\s+nào\s+cũng/i,
];

/**
 * O6 — Overclaiming Rule Scope
 *
 * Claims that a rule applies to an entire category without acknowledging
 * sub-categories or exceptions. These universal quantifiers over a whole
 * grammatical category are almost always false.
 *
 * Severity: REVISE (the claim is likely wrong — narrow the scope).
 */
const O6_SCOPE_OVERCLAIM_PATTERNS: ReadonlyArray<{
  pattern: RegExp;
  label: string;
}> = [
  { pattern: /tất\s+cả\s+(?:các\s+)?động\s+từ/i, label: "tất cả động từ" },
  { pattern: /mọi\s+động\s+từ/i, label: "mọi động từ" },
  { pattern: /tất\s+cả\s+(?:các\s+)?danh\s+từ/i, label: "tất cả danh từ" },
  { pattern: /mọi\s+danh\s+từ/i, label: "mọi danh từ" },
  { pattern: /tất\s+cả\s+(?:các\s+)?tính\s+từ/i, label: "tất cả tính từ" },
  { pattern: /bất\s+kỳ\s+câu\s+nào(?:\s+cũng)?/i, label: "bất kỳ câu nào" },
  { pattern: /không\s+phân\s+biệt(?:\s+(?:loại|trường\s+hợp|thì|ngữ\s+cảnh))?/i, label: "không phân biệt" },
  { pattern: /bất\s+kể\s+(?:loại|thì|ngữ\s+cảnh)/i, label: "bất kể…" },
  { pattern: /all\s+verbs?\b/i, label: "all verbs (phạm vi tuyệt đối)" },
  { pattern: /all\s+nouns?\b/i, label: "all nouns (phạm vi tuyệt đối)" },
];

/**
 * O7 — Claiming "No Exceptions"
 *
 * Direct claims that an English grammar rule has no exceptions. This is almost
 * always false — English is notorious for exceptions. The strongest appropriate
 * claim is "hầu như không có ngoại lệ" (almost no exceptions).
 *
 * Severity: REVISE (the claim is factually incorrect).
 */
const O7_NO_EXCEPTIONS_PATTERNS: ReadonlyArray<{
  pattern: RegExp;
  label: string;
}> = [
  { pattern: /(?<!hầu\s+như\s+)không\s+có\s+ngoại\s+lệ/i, label: "không có ngoại lệ" },
  { pattern: /(?<!hầu\s+như\s+)không\s+có\s+bất\s+kỳ\s+ngoại\s+lệ/i, label: "không có bất kỳ ngoại lệ nào" },
  { pattern: /luôn\s+luôn\s+đúng/i, label: "luôn luôn đúng" },
  { pattern: /luôn\s+đúng\s+trong\s+mọi\s+trường\s+hợp/i, label: "luôn đúng trong mọi trường hợp" },
  { pattern: /không\s+bao\s+giờ\s+thay\s+đổi/i, label: "không bao giờ thay đổi" },
  { pattern: /tuyệt\s+đối\s+không\s+thay\s+đổi/i, label: "tuyệt đối không thay đổi" },
  { pattern: /\bno\s+exceptions?\b/i, label: "no exceptions" },
  { pattern: /always\s+true\b/i, label: "always true" },
];

/**
 * O8 — Overclaiming Teacher Authority
 *
 * While Teacher Mercy should speak with confidence, she should not position
 * herself as an infallible oracle. Claims of certainty about the learner's
 * future, appeals to her own authority, or "trust me" language undermine
 * the collaborative teacher-student relationship.
 *
 * Severity: FLAG (tone issue — not factually wrong, but erodes the right dynamic).
 */
const O8_AUTHORITY_OVERCLAIM_PATTERNS: ReadonlyArray<{
  pattern: RegExp;
  label: string;
}> = [
  { pattern: /cô\s+biết\s+chắc(?:\s+là|rằng)?/i, label: "cô biết chắc" },
  { pattern: /cô\s+đảm\s+bảo(?:\s+là|rằng)?/i, label: "cô đảm bảo" },
  { pattern: /cô\s+chắc\s+chắn(?:\s+là|rằng)?/i, label: "cô chắc chắn" },
  { pattern: /tin\s+cô\s+đi/i, label: "tin cô đi" },
  { pattern: /cứ\s+tin\s+cô/i, label: "cứ tin cô" },
  { pattern: /cô\s+đã\s+dạy\s+(?:hàng\s+ngàn|hàng\s+nghìn|rất\s+nhiều)/i, label: "cô đã dạy hàng ngàn…" },
  { pattern: /kinh\s+nghiệm\s+(?:của\s+)?cô\s+(?:là|cho\s+thấy)/i, label: "kinh nghiệm của cô" },
  { pattern: /cô\s+chưa\s+từng\s+thấy\s+ai/i, label: "cô chưa từng thấy ai…" },
  { pattern: /cô\s+có\s+thể\s+khẳng\s+định/i, label: "cô có thể khẳng định" },
  { pattern: /trust\s+me\b/i, label: "trust me" },
  { pattern: /I(?:'ve| have)\s+(?:taught|seen|worked with)\s+(?:thousands?|countless|so many)/i, label: "I've taught thousands (phóng đại)" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Check if text contains any hedging language.
 */
function hasHedging(text: string): boolean {
  return O5_HEDGING_PATTERNS.some((p) => p.test(text));
}

/**
 * Extract a short snippet around a match for diagnostic purposes.
 */
function extractSnippet(text: string, pattern: RegExp, contextChars: number = 40): string {
  const match = pattern.exec(text);
  if (!match) return "";

  const idx = match.index;
  const start = Math.max(0, idx - contextChars);
  const end = Math.min(text.length, idx + match[0].length + contextChars);
  let snippet = text.slice(start, end);
  if (start > 0) snippet = "…" + snippet;
  if (end < text.length) snippet = snippet + "…";
  return snippet;
}

/**
 * Check a list of patterns against the text.
 * Returns the first match found, or null if none match.
 */
function findFirstMatch(
  text: string,
  patterns: ReadonlyArray<{ pattern: RegExp; label: string }>,
): { label: string; snippet: string } | null {
  for (const { pattern, label } of patterns) {
    if (pattern.test(text)) {
      return { label, snippet: extractSnippet(text, pattern) };
    }
  }
  return null;
}

/**
 * Check all patterns and return all matches found.
 */
function findAllMatches(
  text: string,
  patterns: ReadonlyArray<{ pattern: RegExp; label: string }>,
): Array<{ label: string; snippet: string }> {
  const matches: Array<{ label: string; snippet: string }> = [];
  for (const { pattern, label } of patterns) {
    // Reset lastIndex for global regexes
    pattern.lastIndex = 0;
    if (pattern.test(text)) {
      matches.push({ label, snippet: extractSnippet(text, pattern) });
    }
  }
  return matches;
}

// ─── O1 — Absolute Certainty Language ────────────────────────────────────────

/**
 * O1: Does the response use absolute certainty language?
 *
 * Absolute words like "luôn luôn", "không bao giờ", "100%" are almost always
 * wrong in the context of English grammar. This gate detects them and flags
 * the response for revision.
 *
 * The check is somewhat lenient — it looks for absolute language anywhere
 * in the text, because a single absolute claim can mislead the learner even
 * if the rest of the response is well-hedged.
 */
function evaluateAbsoluteCertainty(explanationVi: string): OverclaimGateResult {
  const match = findFirstMatch(explanationVi, O1_ABSOLUTE_PATTERNS);

  if (match) {
    return {
      gateId: GATE_IDS.O1,
      titleVi: "Ngôn ngữ tuyệt đối",
      titleEn: "Absolute certainty language",
      passed: false,
      decision: "REVISE",
      detailVi: `Phát hiện ngôn ngữ khẳng định tuyệt đối: "${match.label}". Trong tiếng Anh, hầu hết quy tắc ngữ pháp đều có ngoại lệ. Cần diễn đạt mềm dẻo hơn (thêm "thường", "đa số", "hầu hết").`,
      detailEn: `Absolute certainty language detected: "${match.label}". Most English grammar rules have exceptions. Add hedging ("usually", "most", "generally").`,
      reasonCode: "o1_absolute_language",
      matchedSnippet: match.snippet,
    };
  }

  return {
    gateId: GATE_IDS.O1,
    titleVi: "Ngôn ngữ tuyệt đối",
    titleEn: "Absolute certainty language",
    passed: true,
    decision: null,
    detailVi: "Không phát hiện ngôn ngữ khẳng định tuyệt đối.",
    detailEn: "No absolute certainty language detected.",
    reasonCode: "o1_no_absolute_language",
    matchedSnippet: null,
  };
}

// ─── O2 — Fake Statistics / Made-Up Data ─────────────────────────────────────

/**
 * O2: Does the response contain invented statistics, "research", or data?
 *
 * Teacher Mercy has no access to empirical data. Any numbers, percentages,
 * or appeals to "research" / "studies" are LLM hallucinations and must be
 * blocked — they are misinformation, not just stylistic issues.
 */
function evaluateFakeStatistics(explanationVi: string): OverclaimGateResult {
  const match = findFirstMatch(explanationVi, O2_FAKE_STATS_PATTERNS);

  if (match) {
    return {
      gateId: GATE_IDS.O2,
      titleVi: "Số liệu bịa đặt",
      titleEn: "Fake statistics / made-up data",
      passed: false,
      decision: "BLOCK",
      detailVi: `Phát hiện số liệu hoặc dẫn chứng không có thật: "${match.label}". Teacher Mercy không có quyền truy cập dữ liệu thống kê — đây là thông tin bịa đặt. Phải viết lại, bỏ phần số liệu/nghiên cứu.`,
      detailEn: `Fake statistic or unsupported claim detected: "${match.label}". Teacher Mercy has no access to empirical data — this is hallucinated. Must rewrite without invented numbers/research.`,
      reasonCode: "o2_fake_statistics",
      matchedSnippet: match.snippet,
    };
  }

  return {
    gateId: GATE_IDS.O2,
    titleVi: "Số liệu bịa đặt",
    titleEn: "Fake statistics / made-up data",
    passed: true,
    decision: null,
    detailVi: "Không phát hiện số liệu hoặc dẫn chứng bịa đặt.",
    detailEn: "No fake statistics or unsupported research claims detected.",
    reasonCode: "o2_no_fake_stats",
    matchedSnippet: null,
  };
}

// ─── O3 — Overpromising Outcomes ─────────────────────────────────────────────

/**
 * O3: Does the response overpromise learning outcomes?
 *
 * "Bạn sẽ không bao giờ sai nữa", "bảo đảm bạn sẽ giỏi" — these promises
 * are dishonest. Learning is gradual and non-linear. Overpromising erodes
 * trust when the learner inevitably makes the mistake again.
 */
function evaluateOverpromising(explanationVi: string): OverclaimGateResult {
  const match = findFirstMatch(explanationVi, O3_OVERPROMISE_PATTERNS);

  if (match) {
    return {
      gateId: GATE_IDS.O3,
      titleVi: "Hứa quá kết quả",
      titleEn: "Overpromising outcomes",
      passed: false,
      decision: "REVISE",
      detailVi: `Phát hiện lời hứa quá mức về kết quả học tập: "${match.label}". Việc học là quá trình — không nên bảo đảm kết quả. Cần viết lại với kỳ vọng thực tế hơn.`,
      detailEn: `Overpromising language detected: "${match.label}". Learning is gradual — don't guarantee outcomes. Rewrite with realistic expectations.`,
      reasonCode: "o3_overpromising",
      matchedSnippet: match.snippet,
    };
  }

  return {
    gateId: GATE_IDS.O3,
    titleVi: "Hứa quá kết quả",
    titleEn: "Overpromising outcomes",
    passed: true,
    decision: null,
    detailVi: "Không phát hiện lời hứa quá mức về kết quả.",
    detailEn: "No overpromising language detected.",
    reasonCode: "o3_no_overpromise",
    matchedSnippet: null,
  };
}

// ─── O4 — Claiming Knowledge of Learner's Internal State ─────────────────────

/**
 * O4: Does the response assert what the learner is thinking or feeling?
 *
 * "Bạn đang bối rối", "bạn cảm thấy tự ti" — these are mind-reading claims.
 * From text input alone, Teacher Mercy cannot know the learner's internal state.
 * Better to ask ("Bạn có thấy phần này hơi khó không?") than to assert.
 *
 * Severity: FLAG (presumptuous but not dangerous).
 */
function evaluateClaimingLearnerState(explanationVi: string): OverclaimGateResult {
  const match = findFirstMatch(explanationVi, O4_LEARNER_STATE_PATTERNS);

  if (match) {
    return {
      gateId: GATE_IDS.O4,
      titleVi: "Đoán trạng thái người học",
      titleEn: "Claiming learner internal state",
      passed: false,
      decision: "FLAG",
      detailVi: `Phát hiện câu khẳng định về trạng thái nội tâm của người học: "${match.label}". Không nên đoán cảm xúc/suy nghĩ của người học — nên hỏi thay vì khẳng định.`,
      detailEn: `Claim about learner's internal state detected: "${match.label}". Don't assert what the learner thinks/feels — ask instead.`,
      reasonCode: "o4_claiming_learner_state",
      matchedSnippet: match.snippet,
    };
  }

  return {
    gateId: GATE_IDS.O4,
    titleVi: "Đoán trạng thái người học",
    titleEn: "Claiming learner internal state",
    passed: true,
    decision: null,
    detailVi: "Không phát hiện câu đoán trạng thái nội tâm người học.",
    detailEn: "No claims about learner internal state detected.",
    reasonCode: "o4_no_state_claim",
    matchedSnippet: null,
  };
}

// ─── O5 — Missing Hedge on Exception-Prone Rules ─────────────────────────────

/**
 * O5: When the response states a grammar rule, does it include appropriate hedging?
 *
 * This gate looks for rule-stating language (e.g., "quy tắc là", "công thức là")
 * and checks whether the same sentence or adjacent context contains hedging
 * language (e.g., "thường", "đa số", "hầu hết"). If a rule is stated without
 * hedging, the response should be flagged.
 *
 * Note: This gate only fires when BOTH (a) a rule-claiming pattern is found
 * AND (b) no hedging language is present in the text. If there's no rule-claiming
 * language, or if hedging is present, the gate passes.
 */
function evaluateMissingHedge(explanationVi: string): OverclaimGateResult {
  const matches = findAllMatches(explanationVi, O5_RULE_CLAIMING_PATTERNS);

  if (matches.length === 0) {
    return {
      gateId: GATE_IDS.O5,
      titleVi: "Thiếu ngôn ngữ dè dặt",
      titleEn: "Missing hedge on rules",
      passed: true,
      decision: null,
      detailVi: "Không phát hiện câu nêu quy tắc cần kiểm tra hedge.",
      detailEn: "No rule-claiming language detected to check for hedging.",
      reasonCode: "o5_no_rule_claim",
      matchedSnippet: null,
    };
  }

  // Check if any hedging language exists in the text
  if (hasHedging(explanationVi)) {
    return {
      gateId: GATE_IDS.O5,
      titleVi: "Thiếu ngôn ngữ dè dặt",
      titleEn: "Missing hedge on rules",
      passed: true,
      decision: null,
      detailVi: "Có nêu quy tắc nhưng đã kèm ngôn ngữ dè dặt phù hợp (\"thường\", \"đa số\",…).",
      detailEn: "Rules stated with appropriate hedging language present.",
      reasonCode: "o5_hedging_present",
      matchedSnippet: null,
    };
  }

  // Rule-claiming language found but no hedging
  const matchLabels = matches.map((m) => m.label).join(", ");
  const firstSnippet = matches[0].snippet;

  return {
    gateId: GATE_IDS.O5,
    titleVi: "Thiếu ngôn ngữ dè dặt",
    titleEn: "Missing hedge on rules",
    passed: false,
    decision: "FLAG",
    detailVi: `Phát hiện câu nêu quy tắc không có ngôn ngữ dè dặt: "${matchLabels}". Nên thêm "thường", "đa số", "hầu hết" — quy tắc tiếng Anh hiếm khi tuyệt đối.`,
    detailEn: `Rule-claiming language without hedging: "${matchLabels}". Add "usually", "most", "generally" — English rules rarely absolute.`,
    reasonCode: "o5_missing_hedge",
    matchedSnippet: firstSnippet,
  };
}

// ─── O6 — Overclaiming Rule Scope ────────────────────────────────────────────

/**
 * O6: Does the response overclaim the scope of a grammar rule?
 *
 * Claims like "tất cả động từ", "mọi danh từ", "bất kỳ câu nào" assert
 * universal scope. These are almost always false — there's always a subclass
 * or exception. The response should narrow the scope.
 */
function evaluateOverclaimingScope(explanationVi: string): OverclaimGateResult {
  const match = findFirstMatch(explanationVi, O6_SCOPE_OVERCLAIM_PATTERNS);

  if (match) {
    return {
      gateId: GATE_IDS.O6,
      titleVi: "Phạm vi quy tắc quá rộng",
      titleEn: "Overclaiming rule scope",
      passed: false,
      decision: "REVISE",
      detailVi: `Phát hiện khẳng định phạm vi quá rộng: "${match.label}". Không có quy tắc nào áp dụng cho "tất cả" từ loại. Cần thu hẹp phạm vi hoặc thêm ngoại lệ.`,
      detailEn: `Overclaimed rule scope detected: "${match.label}". No rule applies to "all" words of a category. Narrow the scope or add exceptions.`,
      reasonCode: "o6_overclaiming_scope",
      matchedSnippet: match.snippet,
    };
  }

  return {
    gateId: GATE_IDS.O6,
    titleVi: "Phạm vi quy tắc quá rộng",
    titleEn: "Overclaiming rule scope",
    passed: true,
    decision: null,
    detailVi: "Không phát hiện khẳng định phạm vi quy tắc quá rộng.",
    detailEn: "No overclaimed rule scope detected.",
    reasonCode: "o6_scope_ok",
    matchedSnippet: null,
  };
}

// ─── O7 — Claiming "No Exceptions" ───────────────────────────────────────────

/**
 * O7: Does the response claim that a grammar rule has no exceptions?
 *
 * "Không có ngoại lệ", "luôn luôn đúng trong mọi trường hợp" — these are
 * factually incorrect claims about English grammar. Even the most reliable
 * rules (e.g., article usage, past tense formation) have exceptions.
 */
function evaluateNoExceptionsClaim(explanationVi: string): OverclaimGateResult {
  const match = findFirstMatch(explanationVi, O7_NO_EXCEPTIONS_PATTERNS);

  if (match) {
    return {
      gateId: GATE_IDS.O7,
      titleVi: "Khẳng định không có ngoại lệ",
      titleEn: "Claiming no exceptions",
      passed: false,
      decision: "REVISE",
      detailVi: `Phát hiện khẳng định "không có ngoại lệ": "${match.label}". Trong tiếng Anh, hầu như quy tắc nào cũng có ngoại lệ. Cần sửa thành "hầu như không có ngoại lệ" hoặc liệt kê ngoại lệ.`,
      detailEn: `"No exceptions" claim detected: "${match.label}". English grammar almost always has exceptions. Change to "almost no exceptions" or list them.`,
      reasonCode: "o7_no_exceptions_claim",
      matchedSnippet: match.snippet,
    };
  }

  return {
    gateId: GATE_IDS.O7,
    titleVi: "Khẳng định không có ngoại lệ",
    titleEn: "Claiming no exceptions",
    passed: true,
    decision: null,
    detailVi: "Không phát hiện khẳng định \"không có ngoại lệ\".",
    detailEn: 'No "no exceptions" claims detected.',
    reasonCode: "o7_no_exceptions_ok",
    matchedSnippet: null,
  };
}

// ─── O8 — Overclaiming Teacher Authority ─────────────────────────────────────

/**
 * O8: Does the response overclaim teacher authority?
 *
 * "Cô biết chắc", "cô đảm bảo", "tin cô đi" — these position Teacher Mercy
 * as an infallible oracle rather than a collaborative guide. A strong teacher
 * earns trust through quality explanations, not appeals to authority.
 */
function evaluateOverclaimingAuthority(explanationVi: string): OverclaimGateResult {
  const match = findFirstMatch(explanationVi, O8_AUTHORITY_OVERCLAIM_PATTERNS);

  if (match) {
    return {
      gateId: GATE_IDS.O8,
      titleVi: "Lạm dụng uy tín",
      titleEn: "Overclaiming teacher authority",
      passed: false,
      decision: "FLAG",
      detailVi: `Phát hiện ngôn ngữ lạm dụng uy tín giáo viên: "${match.label}". Niềm tin nên đến từ chất lượng giải thích, không phải từ lời khẳng định uy quyền. Cân nhắc viết lại.`,
      detailEn: `Authority-overclaiming language detected: "${match.label}". Trust should come from explanation quality, not authority claims. Consider rewriting.`,
      reasonCode: "o8_overclaiming_authority",
      matchedSnippet: match.snippet,
    };
  }

  return {
    gateId: GATE_IDS.O8,
    titleVi: "Lạm dụng uy tín",
    titleEn: "Overclaiming teacher authority",
    passed: true,
    decision: null,
    detailVi: "Không phát hiện ngôn ngữ lạm dụng uy tín.",
    detailEn: "No authority-overclaiming language detected.",
    reasonCode: "o8_authority_ok",
    matchedSnippet: null,
  };
}

// ─── Gate Chain ──────────────────────────────────────────────────────────────

/**
 * The ordered list of overclaim guard gates.
 * Evaluated in O1→O8 order with short-circuit: the first gate that returns
 * a non-null decision ends the chain.
 *
 * Priority ordering:
 *   O2 (FAKE STATS) — BLOCK first; misinformation is the worst offense
 *   O1 (ABSOLUTE LANGUAGE) — REVISE; misleading certainty
 *   O3 (OVERPROMISING) — REVISE; dishonest promises
 *   O6 (OVERCLAIMING SCOPE) — REVISE; likely false claims
 *   O7 (NO EXCEPTIONS) — REVISE; factually incorrect
 *   O4 (CLAIMING LEARNER STATE) — FLAG; presumptuous
 *   O5 (MISSING HEDGE) — FLAG; stylistic improvement
 *   O8 (OVERCLAIMING AUTHORITY) — FLAG; tone issue
 */
function buildGateChain(
  input: OverclaimGuardInput,
): ReadonlyArray<() => OverclaimGateResult> {
  return [
    // O1 — Absolute certainty language (REVISE)
    () => evaluateAbsoluteCertainty(input.explanationVi),
    // O2 — Fake statistics (BLOCK — most severe)
    () => evaluateFakeStatistics(input.explanationVi),
    // O3 — Overpromising outcomes (REVISE)
    () => evaluateOverpromising(input.explanationVi),
    // O4 — Claiming learner state (FLAG)
    () => evaluateClaimingLearnerState(input.explanationVi),
    // O5 — Missing hedge (FLAG)
    () => evaluateMissingHedge(input.explanationVi),
    // O6 — Overclaiming scope (REVISE)
    () => evaluateOverclaimingScope(input.explanationVi),
    // O7 — No exceptions claim (REVISE)
    () => evaluateNoExceptionsClaim(input.explanationVi),
    // O8 — Overclaiming authority (FLAG)
    () => evaluateOverclaimingAuthority(input.explanationVi),
  ];
}

// ─── Summary Builders ────────────────────────────────────────────────────────

function buildSummaryVi(
  decision: OverclaimDecision,
  decidingGate: string | null,
  gates: OverclaimGateResult[],
): string {
  const gateLabel = decidingGate ? ` (cổng ${decidingGate})` : "";

  switch (decision) {
    case "PASS":
      return `Đạt${gateLabel} — phản hồi trung thực, không phát hiện khẳng định quá mức hay giả vờ chắc chắn.`;
    case "FLAG":
      return `Gắn cờ${gateLabel} — có dấu hiệu khẳng định quá mức nhẹ, nên xem lại trước khi gửi.`;
    case "REVISE":
      return `Cần chỉnh sửa${gateLabel} — phát hiện khẳng định quá mức đáng kể, cần viết lại phần bị ảnh hưởng.`;
    case "BLOCK":
      return `Chặn${gateLabel} — phát hiện thông tin bịa đặt hoặc khẳng định nguy hiểm, không được hiển thị.`;
  }
}

function buildSummaryEn(
  decision: OverclaimDecision,
  decidingGate: string | null,
  gates: OverclaimGateResult[],
): string {
  const gateLabel = decidingGate ? ` (gate ${decidingGate})` : "";

  switch (decision) {
    case "PASS":
      return `Passed${gateLabel} — response is honest, no overclaiming or fake certainty detected.`;
    case "FLAG":
      return `Flagged${gateLabel} — minor overclaim patterns found, review before sending.`;
    case "REVISE":
      return `Needs revision${gateLabel} — significant overclaiming detected, rewrite affected parts.`;
    case "BLOCK":
      return `Blocked${gateLabel} — fake data or dangerous overclaim detected, must not show.`;
  }
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Run the overclaim guard on a tutor response BEFORE showing it to the learner.
 *
 * This is the main entry point. It runs the O1-O8 gate chain and returns a
 * clear decision: PASS, FLAG, REVISE, or BLOCK.
 *
 * The gate chain short-circuits: the first gate that fires (returns a non-null
 * decision) ends the chain. O2 (fake statistics) can BLOCK; O1/O3/O6/O7 can
 * REVISE; O4/O5/O8 can FLAG. If no gate fires, the default is PASS.
 *
 * Pure function — deterministic, no I/O, no side effects.
 *
 * @param input — the tutor response text and optional context
 * @returns An OverclaimGuardResult with the final decision and per-gate details.
 */
export function guardOverclaim(input: OverclaimGuardInput): OverclaimGuardResult {
  const gateFns = buildGateChain(input);

  // Run gates in order, short-circuit on first non-null decision
  const gates: OverclaimGateResult[] = [];
  let finalDecision: OverclaimDecision = "PASS";
  let decidingGate: string | null = null;

  for (const gateFn of gateFns) {
    const result = gateFn();
    gates.push(result);

    if (result.decision !== null) {
      finalDecision = result.decision;
      decidingGate = result.gateId;
      break;
    }
  }

  const passedCount = gates.filter((g) => g.passed).length;
  const firedCount = gates.filter((g) => g.decision !== null).length;

  // Collect all matched snippets across the chain
  const allMatchedSnippets = gates
    .map((g) => g.matchedSnippet)
    .filter((s): s is string => s !== null);

  return {
    decision: finalDecision,
    canShow: finalDecision === "PASS" || finalDecision === "FLAG",
    needsRevision: finalDecision === "REVISE",
    isBlocked: finalDecision === "BLOCK",
    gates,
    passedCount,
    firedCount,
    decidingGate,
    summaryVi: buildSummaryVi(finalDecision, decidingGate, gates),
    summaryEn: buildSummaryEn(finalDecision, decidingGate, gates),
    allMatchedSnippets,
  };
}

/**
 * Quick guard check with just the explanation text.
 *
 * Convenience wrapper for the common case where you only have the
 * explanation text and don't need learner context.
 */
export function guardOverclaimQuick(explanationVi: string): OverclaimGuardResult {
  return guardOverclaim({ explanationVi });
}

// ─── Telemetry Formatter ─────────────────────────────────────────────────────

/**
 * Format an overclaim guard result into a structured telemetry record.
 * Contains no learner PII — only gate IDs, decisions, and reason codes.
 */
export function formatOverclaimTelemetry(result: OverclaimGuardResult): Record<string, unknown> {
  return {
    decision: result.decision,
    canShow: result.canShow,
    needsRevision: result.needsRevision,
    isBlocked: result.isBlocked,
    decidingGate: result.decidingGate,
    passedCount: result.passedCount,
    firedCount: result.firedCount,
    matchedSnippetCount: result.allMatchedSnippets.length,
    gateResults: Object.fromEntries(
      result.gates.map((g) => [
        g.gateId,
        {
          passed: g.passed,
          decision: g.decision,
          reasonCode: g.reasonCode,
          hasSnippet: g.matchedSnippet !== null,
        },
      ]),
    ),
  };
}

// ─── Catalogs ────────────────────────────────────────────────────────────────

export const OVERCLAIM_DECISION_CATALOG: ReadonlyArray<{
  decision: OverclaimDecision;
  titleEn: string;
  titleVi: string;
  descriptionVi: string;
}> = [
  {
    decision: "PASS",
    titleEn: "Pass",
    titleVi: "Đạt",
    descriptionVi: "Phản hồi trung thực, không có dấu hiệu khẳng định quá mức hoặc giả vờ chắc chắn.",
  },
  {
    decision: "FLAG",
    titleEn: "Flag",
    titleVi: "Gắn cờ",
    descriptionVi: "Có dấu hiệu khẳng định quá mức nhẹ — hiển thị được nhưng nên ghi nhận để xem lại.",
  },
  {
    decision: "REVISE",
    titleEn: "Revise",
    titleVi: "Cần chỉnh sửa",
    descriptionVi: "Phát hiện khẳng định quá mức đáng kể — cần viết lại phần bị ảnh hưởng trước khi hiển thị.",
  },
  {
    decision: "BLOCK",
    titleEn: "Block",
    titleVi: "Chặn",
    descriptionVi: "Phát hiện thông tin bịa đặt hoặc khẳng định nguy hiểm — không được hiển thị cho người học.",
  },
];

export const OVERCLAIM_GATE_CATALOG: ReadonlyArray<{
  gateId: string;
  titleVi: string;
  titleEn: string;
  severity: "FLAG" | "REVISE" | "BLOCK";
  descriptionVi: string;
}> = [
  {
    gateId: GATE_IDS.O1,
    titleVi: "Ngôn ngữ tuyệt đối",
    titleEn: "Absolute certainty language",
    severity: "REVISE",
    descriptionVi: "Phát hiện từ ngữ tuyệt đối (\"luôn luôn\", \"không bao giờ\", \"100%\"). Trong tiếng Anh, hầu hết quy tắc đều có ngoại lệ.",
  },
  {
    gateId: GATE_IDS.O2,
    titleVi: "Số liệu bịa đặt",
    titleEn: "Fake statistics / made-up data",
    severity: "BLOCK",
    descriptionVi: "Phát hiện số liệu, phần trăm, hoặc dẫn chứng \"nghiên cứu\" không có thật. Teacher Mercy không có quyền truy cập dữ liệu thực nghiệm.",
  },
  {
    gateId: GATE_IDS.O3,
    titleVi: "Hứa quá kết quả",
    titleEn: "Overpromising outcomes",
    severity: "REVISE",
    descriptionVi: "Phát hiện lời hứa quá mức về kết quả học tập (\"sẽ không bao giờ sai nữa\", \"bảo đảm\"). Học là quá trình — không nên bảo đảm.",
  },
  {
    gateId: GATE_IDS.O4,
    titleVi: "Đoán trạng thái người học",
    titleEn: "Claiming learner internal state",
    severity: "FLAG",
    descriptionVi: "Phát hiện câu khẳng định về cảm xúc/suy nghĩ của người học. Nên hỏi thay vì khẳng định.",
  },
  {
    gateId: GATE_IDS.O5,
    titleVi: "Thiếu ngôn ngữ dè dặt",
    titleEn: "Missing hedge on rules",
    severity: "FLAG",
    descriptionVi: "Phát hiện câu nêu quy tắc không kèm ngôn ngữ dè dặt (\"thường\", \"đa số\"). Nên thêm hedge vì quy tắc tiếng Anh hiếm khi tuyệt đối.",
  },
  {
    gateId: GATE_IDS.O6,
    titleVi: "Phạm vi quy tắc quá rộng",
    titleEn: "Overclaiming rule scope",
    severity: "REVISE",
    descriptionVi: "Phát hiện khẳng định phạm vi quá rộng (\"tất cả động từ\", \"mọi danh từ\"). Cần thu hẹp phạm vi hoặc thêm ngoại lệ.",
  },
  {
    gateId: GATE_IDS.O7,
    titleVi: "Khẳng định không có ngoại lệ",
    titleEn: "Claiming no exceptions",
    severity: "REVISE",
    descriptionVi: "Phát hiện khẳng định \"không có ngoại lệ\". Tiếng Anh hầu như luôn có ngoại lệ — cần sửa thành \"hầu như không có ngoại lệ\".",
  },
  {
    gateId: GATE_IDS.O8,
    titleVi: "Lạm dụng uy tín",
    titleEn: "Overclaiming teacher authority",
    severity: "FLAG",
    descriptionVi: "Phát hiện ngôn ngữ lạm dụng uy tín (\"cô biết chắc\", \"tin cô đi\"). Niềm tin nên đến từ chất lượng giải thích.",
  },
];
