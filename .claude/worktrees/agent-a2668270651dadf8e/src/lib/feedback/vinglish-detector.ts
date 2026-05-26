/**
 * Vinglish (VN-EN code-switching) detector + gentle-modeling response builder.
 *
 * Why this module exists:
 *   Vietnamese diaspora learners speak half-half at home — "I want ăn cơm",
 *   "Chị go where?", "Em like coffee không?". Today Mercy treats those as
 *   wrong English and corrects them strictly. That's the wrong frame: the
 *   learner isn't failing English, they're code-switching naturally.
 *
 *   With this detector wired into generateTeachingTurn, Mercy can:
 *     1. Recognise the VN tokens in the input,
 *     2. Acknowledge them kindly ("Mình hiểu — bạn dùng cả tiếng Việt"),
 *     3. Gently model the full-English version as a suggestion, not a
 *        red-pen correction.
 *
 *   The toggle in profiles.vinglish_friendly_mode controls whether the
 *   gentle path activates; detection itself runs unconditionally so we
 *   can collect signal in analytics (the 'vinglish_detected' flag).
 *
 * Pure / no Deno or Supabase imports — testable under vitest as plain TS.
 */

// ── 1. VN signal sources ─────────────────────────────────────────────────

/**
 * Common VN tokens that appear in code-switched speech even WITHOUT
 * diacritics (people typing on EN keyboards skip the marks). These are
 * the most frequent particles / pronouns / verbs in everyday speech.
 *
 * Ordered roughly by frequency. Lowercase, ASCII-folded match.
 */
const VN_PLAIN_TOKENS: ReadonlySet<string> = new Set([
  // pronouns / address terms
  "anh", "chi", "em", "con", "ba", "me", "ma", "ong", "ba",
  "ban", "minh", "toi", "no", "ho",
  // particles / discourse markers
  "oi", "a", "nhe", "nha", "di", "do", "day", "kia",
  "thoi", "vay", "ha", "u", "uh", "u", "uh",
  // common verbs / adjectives in code-switching
  "duoc", "khong", "co", "la", "an", "uong", "ngu", "di",
  "muon", "thich", "biet", "hieu", "thay", "lam",
  // common nouns
  "com", "pho", "ca", "nuoc", "tien", "nha", "truong", "ban",
  // conjunctions / prepositions
  "nhung", "voi", "cho", "ve", "tu", "den",
]);

/**
 * VN diacritic regex. Any single character with a Vietnamese diacritic
 * mark is a near-certain VN signal — pure English doesn't use these.
 *
 * The sets cover the seven Vietnamese vowel families + đ.
 */
const VN_DIACRITIC_REGEX = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i;

/**
 * ASCII-fold a string: strip diacritics so a token written "đẹp" or "muốn"
 * matches the entries in VN_PLAIN_TOKENS. Uses Unicode normalisation
 * (NFD) + a regex strip; the trailing đ→d is special-cased because it's
 * not a combining mark.
 */
function asciiFold(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

/**
 * Tokenize on whitespace + drop punctuation that doesn't carry meaning.
 * Empty tokens are filtered out so confidence math doesn't divide by 0.
 */
function tokenize(text: string): string[] {
  return text
    .split(/\s+/)
    .map((t) => t.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, ""))
    .filter((t) => t.length > 0);
}

// ── 2. Detection result ──────────────────────────────────────────────────

export interface VinglishDetection {
  /** True iff at least one VN token (diacritic or plain) was found. */
  hasVNTokens: boolean;
  /** The actual VN tokens found, in input order, lowercase + as-typed. */
  vnTokens: string[];
  /** vnTokenCount / totalTokens, rounded to 2 decimals. 0..1. */
  confidence: number;
  /** Total non-empty tokens (rough word count). */
  totalTokens: number;
  /** Subset of vnTokens — count, kept for convenience. */
  vnTokenCount: number;
}

/**
 * Detect VN-EN code-switching in a piece of learner input.
 *
 * Definition of "VN token":
 *   1. Contains a Vietnamese diacritic (đẹp, ăn, được, …) — strongest
 *      signal; almost no false positives.
 *   2. ASCII-folded token is in VN_PLAIN_TOKENS (anh, oi, khong, com, …)
 *      — handles users typing without diacritics. Some false positives
 *      possible (e.g. "no" is both English "no" and VN "no" = "it"),
 *      tolerated because the cost of a missed signal is high.
 *
 * Examples:
 *   "I want ăn cơm" → vnTokens: ["ăn", "cơm"], confidence ≈ 0.5
 *   "Chị go where?" → vnTokens: ["chị"], confidence ≈ 0.33
 *   "I love coffee" → vnTokens: [], confidence: 0
 *   "anh oi an com khong" → vnTokens: all 5, confidence: 1.0
 */
export function detectVNEnglishCodeSwitch(text: string): VinglishDetection {
  const safe = (text ?? "").toString();
  const tokens = tokenize(safe);
  const vnTokens: string[] = [];

  for (const tok of tokens) {
    if (VN_DIACRITIC_REGEX.test(tok)) {
      vnTokens.push(tok.toLowerCase());
      continue;
    }
    const folded = asciiFold(tok);
    if (VN_PLAIN_TOKENS.has(folded)) {
      vnTokens.push(tok.toLowerCase());
    }
  }

  const totalTokens = tokens.length;
  const vnTokenCount = vnTokens.length;
  const confidence = totalTokens === 0
    ? 0
    : Math.round((vnTokenCount / totalTokens) * 100) / 100;

  return {
    hasVNTokens: vnTokenCount > 0,
    vnTokens,
    confidence,
    totalTokens,
    vnTokenCount,
  };
}

// ── 3. Default-toggle inference ──────────────────────────────────────────

/**
 * CEFR levels considered "beginner" — Vinglish-friendly mode is on by
 * default for these. Match exactly the strings used elsewhere in the
 * codebase (see placement test outputs).
 */
const BEGINNER_CEFR: ReadonlySet<string> = new Set(["pre_a1", "a1", "a2"]);

/**
 * Resolve whether Vinglish-friendly mode should be ON for a user, given
 * (a) the user's explicit toggle (NULL = no preference set) and
 * (b) their CEFR level.
 *
 * Rules:
 *   - explicit true  → always on
 *   - explicit false → always off
 *   - null + beginner CEFR → on
 *   - null + B1 or higher  → off
 *   - null + unknown CEFR  → on (safer default for new users)
 */
export function resolveVinglishFriendlyMode(args: {
  explicitToggle: boolean | null | undefined;
  cefrLevel: string | null | undefined;
}): boolean {
  if (args.explicitToggle === true) return true;
  if (args.explicitToggle === false) return false;

  const cefr = String(args.cefrLevel ?? "").toLowerCase();
  if (BEGINNER_CEFR.has(cefr)) return true;
  if (cefr === "b1" || cefr === "b2" || cefr === "c1" || cefr === "c2") return false;

  // Unknown level → default ON (safer for users we don't have a level for yet).
  return true;
}

// ── 4. Reverse-framing flag for the L1 detector caller ───────────────────

/**
 * When confidence > 0.5 the input is *mostly* Vietnamese with English
 * sprinkled in. In that case Mercy should reverse the framing: this is
 * a Vietnamese speaker trying English, not an English speaker making
 * mistakes. The L1 detector is not modified — its caller should check
 * this flag and skip the strict-correction path.
 *
 * 0.5 chosen empirically: at 0.5 the user wrote at least as many VN
 * tokens as English ones, which is the inflection where "correcting
 * their English" stops being the right interaction.
 */
export function shouldReverseFramingForL1(detection: VinglishDetection): boolean {
  return detection.confidence > 0.5;
}

// ── 5. Gentle-modeling response builder ──────────────────────────────────

export interface VinglishGuidance {
  /** Always true when this object is returned (callers check `!== null`). */
  detected: true;
  /** Tokens that triggered the detection — surfaced to analytics. */
  vnTokens: string[];
  /** Confidence (0..1) of the underlying detection. */
  confidence: number;
  /** Whether the input was VN-heavy enough to flip framing entirely. */
  framingFlipped: boolean;
  /**
   * Vietnamese-first message Mercy should display alongside (or instead
   * of) the strict English correction. Composed from a small template
   * set; never includes the learner's raw text verbatim (avoids echoing
   * back potentially sensitive content).
   */
  gentleResponse: string;
  /** Analytics tag set on the turn so we can A/B the change later. */
  analyticsTag: "vinglish_friendly";
}

/**
 * Compose the gentle-modeling response for a code-switched input. Returns
 * null when no VN tokens were detected — caller treats that as the
 * standard (English-correction) path.
 *
 * The text is intentionally short and warm. We never echo the raw
 * learner text inside Mercy's reply so a user who accidentally pasted
 * a phone number or address won't see it back in the response.
 */
export function buildVinglishGuidance(args: {
  learnerText: string | null | undefined;
  vinglishFriendlyEnabled: boolean;
}): VinglishGuidance | null {
  if (!args.vinglishFriendlyEnabled) return null;

  const detection = detectVNEnglishCodeSwitch(args.learnerText ?? "");
  if (!detection.hasVNTokens) return null;

  const flipped = shouldReverseFramingForL1(detection);
  const gentleResponse = flipped
    ? "Mình hiểu — bạn dùng tiếng Việt cũng được. Mercy ở đây để giúp bạn từ từ chuyển sang tiếng Anh, không vội nhé. Mình thử lại bằng tiếng Anh đơn giản nha."
    : "Mình hiểu — bạn pha tiếng Việt và tiếng Anh được, không sao cả. Mercy giúp bạn nói trọn câu bằng tiếng Anh, để bạn quen dần. Mình thử lại nhé.";

  return {
    detected: true,
    vnTokens: detection.vnTokens,
    confidence: detection.confidence,
    framingFlipped: flipped,
    gentleResponse,
    analyticsTag: "vinglish_friendly",
  };
}
