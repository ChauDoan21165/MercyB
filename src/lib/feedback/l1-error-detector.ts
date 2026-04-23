/**
 * Vietnamese L1-interference error detector.
 *
 * When a Vietnamese learner makes an English error that follows a known
 * L1-transfer pattern, return bilingual feedback that explains WHY using
 * the Vietnamese-English contrast — not a generic "wrong answer" string.
 *
 * Pure regex + rule-based. Deterministic. No LLM. No network.
 * Perf budget: < 5 ms per detectL1Error() call.
 *
 * Architecture:
 *   - Each rule is a pure function (userTokens, expectedTokens, ctx) => RuleHit | null.
 *   - Rules run in a fixed priority order (RULE_REGISTRY below).
 *   - First match wins — we never show more than one L1 message to a learner,
 *     even if multiple patterns could technically apply.
 *   - If no rule matches, return {matched:false, ...} so the caller can fall
 *     back to existing generic grammar feedback (graceful degradation —
 *     L1 detector enhances, never removes).
 *
 * Feedback strings are approved native-speaker drafts locked in RULE_STRINGS.
 * Do NOT edit them casually — changes need Chau's review (he is the Vietnamese
 * native speaker and sets the teacher voice).
 *
 * Single-detection priority order (implementation sequence for v1.0):
 *   1. vi_l1_3rd_person_s         structural
 *   2. vi_l1_past_ed              structural
 *   3. vi_l1_plural_s             structural
 *   4. vi_l1_missing_be           structural
 *   5. vi_l1_question_no_aux      structural
 *   6. vi_l1_missing_article      usage
 *   --- 7. vi_l1_tense_shift_compound  DEFERRED (too high FP risk for v1.0) ---
 *   8. vi_l1_possessive_gender    usage
 *   9. vi_l1_preposition_transfer vocab
 *  10. vi_l1_countable            vocab
 */

export type L1WeaknessTag =
  | 'vi_l1_3rd_person_s'
  | 'vi_l1_past_ed'
  | 'vi_l1_plural_s'
  | 'vi_l1_missing_be'
  | 'vi_l1_question_no_aux'
  | 'vi_l1_missing_article'
  | 'vi_l1_possessive_gender'
  | 'vi_l1_preposition_transfer'
  | 'vi_l1_countable';

export type L1FeedbackText = {
  en: string;
  vi: string;
};

export type L1DetectionInput = {
  userAnswer: string;
  expectedAnswer: string;
  questionContext?: {
    subjectGender?: 'male' | 'female' | null;
    timeframe?: 'past' | 'present' | 'future' | null;
    isQuestion?: boolean;
  };
};

export type L1DetectionResult =
  | { matched: true; weaknessTag: L1WeaknessTag; feedback: L1FeedbackText }
  | { matched: false; weaknessTag: null; feedback: null };

// ────────────────────────────────────────────────────────────────────────────
// Feedback string registry — approved by Chau (native Vietnamese speaker)
// ────────────────────────────────────────────────────────────────────────────

type StringTemplate = {
  en: string;
  vi: string;
};

const RULE_STRINGS: Record<L1WeaknessTag, StringTemplate> = {
  vi_l1_3rd_person_s: {
    en: 'In English, verbs change after **she**, **he**, or **it** — we add **-s**. Vietnamese keeps the verb the same. Try: *{FIX}*.',
    vi: 'Trong tiếng Anh, động từ đi với **she / he / it** phải thêm **-s**. Tiếng Việt mình không có quy tắc này. Thử: *{FIX}*.',
  },
  vi_l1_past_ed: {
    en: 'When you use a past-time word like **yesterday** or **last week**, English also changes the verb — add **-ed**. Vietnamese leaves the verb alone. *work* → *worked*. Try: *{FIX}*.',
    vi: 'Tiếng Việt mình chỉ cần nói **hôm qua** là đủ. Tiếng Anh còn phải thêm **-ed** vào động từ. *work* → *worked*. Thử: *{FIX}*.',
  },
  vi_l1_plural_s: {
    en: 'English marks plurals on the noun itself — add **-s**. In tư duy Việt, \'hai quyển sách\' lets the number do the work, so the noun stays the same. English needs both. Try: *{FIX}*.',
    vi: 'Trong tư duy Việt, \'hai quyển sách\' là đủ — danh từ không đổi. Tiếng Anh phải thêm **-s** vào chính danh từ. Thử: *{FIX}*.',
  },
  vi_l1_missing_be: {
    en: "Vietnamese says 'tôi mệt' — adjective alone is fine. English needs a **be**-verb: **am / is / are**. Try: *{FIX}*.",
    vi: "Tiếng Việt mình nói 'tôi mệt' là xong. Tiếng Anh cần thêm **am / is / are** giữa chủ ngữ và tính từ. Thử: *{FIX}*.",
  },
  vi_l1_question_no_aux: {
    en: 'Vietnamese makes a question by adding **không** at the end. English moves a helper verb — **do**, **does**, or **did** — to the front. Try: *{FIX}*.',
    vi: 'Tiếng Việt mình thêm **không** cuối câu là thành câu hỏi. Tiếng Anh phải đưa **do / does / did** lên đầu. Thử: *{FIX}*.',
  },
  vi_l1_missing_article: {
    en: 'Vietnamese has no articles. English usually needs **a**, **an**, or **the** before a noun. Example: **the book** (a specific one), **a book** (any one). Try: *{FIX}*.',
    vi: 'Tiếng Việt mình không có mạo từ. Tiếng Anh thường cần **a / an / the** trước danh từ. Ví dụ: **the book** (cuốn sách đó), **a book** (một cuốn sách). Thử: *{FIX}*.',
  },
  vi_l1_possessive_gender: {
    en: 'Vietnamese uses **của anh ấy** or **của cô ấy** — same structure regardless of the owner. English changes the possessive word itself: **his** for a man, **her** for a woman. Try: *{FIX}*.',
    vi: 'Tiếng Việt mình dùng **của anh ấy** hoặc **của cô ấy** — cấu trúc giống nhau. Tiếng Anh đổi từ sở hữu theo giới tính: **his** cho nam, **her** cho nữ. Thử: *{FIX}*.',
  },
  vi_l1_preposition_transfer: {
    en: "English prepositions don't translate one-to-one from Vietnamese. Here, swap **{USER_PREP}** for **{FIX_PREP}**. Try: *{FIX}*.",
    vi: 'Mỗi giới từ tiếng Anh có cách dùng riêng, không dịch trực tiếp từ tiếng Việt được. Chỗ này đổi **{USER_PREP}** thành **{FIX_PREP}**. Thử: *{FIX}*.',
  },
  vi_l1_countable: {
    en: "In English some nouns don't count — **advice**, **information**, **furniture**, **news**. No **a / an** and no plural **-s**. Vietnamese counts them normally. Try: *{FIX}*.",
    vi: 'Tiếng Anh có những danh từ không đếm được — **advice**, **information**, **furniture**, **news**. Không dùng **a / an**, không thêm **-s**. Tiếng Việt mình đếm bình thường. Thử: *{FIX}*.',
  },
};

// ────────────────────────────────────────────────────────────────────────────
// Tokenization + tiny utilities
// ────────────────────────────────────────────────────────────────────────────

function tokenize(s: string): string[] {
  // Lowercase, keep trailing "?" so question detection works, strip other punctuation.
  return s
    .toLowerCase()
    .replace(/[.,;:!"'()[\]{}]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function stripTrailingQmark(tokens: string[]): string[] {
  if (tokens.length === 0) return tokens;
  const last = tokens[tokens.length - 1];
  if (last === '?' || last.endsWith('?')) {
    return [...tokens.slice(0, -1), last.replace(/\?+$/, '')].filter(Boolean);
  }
  return tokens;
}

function hasQuestionMark(s: string): boolean {
  return /\?\s*$/.test(s);
}

function fillTemplate(
  template: StringTemplate,
  replacements: Record<string, string>,
): L1FeedbackText {
  const apply = (s: string) =>
    Object.entries(replacements).reduce(
      (acc, [k, v]) => acc.split(`{${k}}`).join(v),
      s,
    );
  return { en: apply(template.en), vi: apply(template.vi) };
}

// ────────────────────────────────────────────────────────────────────────────
// Morphology helpers
// ────────────────────────────────────────────────────────────────────────────

const THIRD_PERSON_SUBJECTS = new Set(['she', 'he', 'it']);

/** Returns true if `plus` is a valid 3rd-person-s form of `base` (heuristic). */
function isThirdPersonSForm(base: string, plus: string): boolean {
  if (!base || !plus || base === plus) return false;
  if (plus === base + 's') return true;            // work → works
  if (plus === base + 'es') return true;           // go → goes, watch → watches
  if (base.endsWith('y') && plus === base.slice(0, -1) + 'ies') return true; // study → studies
  // Irregular "has" from "have"
  if (base === 'have' && plus === 'has') return true;
  // Irregular "does" / "goes" already covered by +es
  return false;
}

const PAST_TIME_MARKERS = new Set([
  'yesterday',
  'ago',
  'last',  // "last week/month/year/night/Monday..."
]);

/** True if tokens contain a past-time marker. Checks whole-word membership. */
function hasPastTimeMarker(tokens: string[]): boolean {
  return tokens.some((t) => PAST_TIME_MARKERS.has(t));
}

const IRREGULAR_PAST: Record<string, string> = {
  go: 'went',
  eat: 'ate',
  see: 'saw',
  come: 'came',
  take: 'took',
  give: 'gave',
  buy: 'bought',
  think: 'thought',
  say: 'said',
  tell: 'told',
  make: 'made',
  have: 'had',
  get: 'got',
  drink: 'drank',
  find: 'found',
  know: 'knew',
  run: 'ran',
  write: 'wrote',
  read: 'read',
};

/** True if `past` is a valid past-tense form of `base` (regular OR irregular). */
function isPastForm(base: string, past: string): boolean {
  if (!base || !past || base === past) return false;
  if (past === base + 'ed') return true;                                 // work → worked
  if (past === base + 'd') return true;                                  // live → lived
  if (base.endsWith('y') && past === base.slice(0, -1) + 'ied') return true; // try → tried
  if (IRREGULAR_PAST[base] === past) return true;
  return false;
}

const NUMBER_WORDS_GT1 = new Set([
  'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'many', 'several', 'few', 'some', 'both',
]);

function isPluralQuantifier(token: string): boolean {
  if (NUMBER_WORDS_GT1.has(token)) return true;
  // Numeric literal > 1
  const n = Number(token);
  if (Number.isFinite(n) && n >= 2) return true;
  return false;
}

/** True if `plural` is a valid plural form of `singular` (heuristic). */
function isPluralForm(singular: string, plural: string): boolean {
  if (!singular || !plural || singular === plural) return false;
  if (plural === singular + 's') return true;
  if (plural === singular + 'es') return true;
  if (singular.endsWith('y') && plural === singular.slice(0, -1) + 'ies') return true;
  // Irregular plurals — whitelist common ones
  const IRREGULAR_PLURAL: Record<string, string> = {
    child: 'children',
    man: 'men',
    woman: 'women',
    person: 'people',
    foot: 'feet',
    tooth: 'teeth',
    mouse: 'mice',
  };
  return IRREGULAR_PLURAL[singular] === plural;
}

const BE_VERBS = new Set(['am', 'is', 'are', 'was', 'were']);

const AUX_QUESTION_STARTERS = new Set([
  'do', 'does', 'did',
  'is', 'am', 'are', 'was', 'were',
  'can', 'could', 'will', 'would', 'should', 'shall', 'may', 'might', 'must',
  'have', 'has', 'had',
  'where', 'when', 'why', 'who', 'whom', 'whose', 'what', 'which', 'how',
]);

const ARTICLES = new Set(['a', 'an', 'the']);

const POSSESSIVE_GENDERED = new Set(['his', 'her']);

/**
 * Small curated table of Vietnamese L1 → English preposition mismatches.
 * Each pair is (wrong-choice learners often make, correct-choice).
 * Context-specific — these aren't universal swaps, but are high-frequency
 * errors in the Vietnamese → English transfer.
 */
const PREPOSITION_MISMATCHES: Array<{ wrong: string; right: string }> = [
  { wrong: 'in',     right: 'on' },        // "in Monday" → "on Monday"
  { wrong: 'on',     right: 'in' },        // "on Hanoi" → "in Hanoi"
  { wrong: 'at',     right: 'in' },        // "at Vietnam" → "in Vietnam"
  { wrong: 'in',     right: 'at' },        // "in school" → "at school"
  { wrong: 'listen', right: 'listen to' }, // "listen music" — treated specially
  { wrong: 'wait',   right: 'wait for' },
  { wrong: 'look',   right: 'look at' },
];

const UNCOUNTABLE_NOUNS = new Set([
  'advice',
  'information',
  'furniture',
  'news',
  'equipment',
  'homework',
  'luggage',
  'baggage',
  'research',
  'knowledge',
  'music',
  'money',
]);

// ────────────────────────────────────────────────────────────────────────────
// Rule implementations (pure functions — no I/O, no side effects)
// ────────────────────────────────────────────────────────────────────────────

type RuleHit = {
  tag: L1WeaknessTag;
  replacements: Record<string, string>;
};

type Rule = (args: {
  userTokens: string[];
  expectedTokens: string[];
  userText: string;
  expectedText: string;
  ctx: NonNullable<L1DetectionInput['questionContext']>;
}) => RuleHit | null;

/** 1. Missing third-person -s. */
const ruleThirdPersonS: Rule = ({ userTokens, expectedTokens, expectedText }) => {
  const len = Math.min(userTokens.length, expectedTokens.length);
  for (let i = 1; i < len; i++) {
    const prev = userTokens[i - 1];
    if (!THIRD_PERSON_SUBJECTS.has(prev)) continue;
    const userVerb = userTokens[i];
    const expectedVerb = expectedTokens[i];
    if (isThirdPersonSForm(userVerb, expectedVerb)) {
      return {
        tag: 'vi_l1_3rd_person_s',
        replacements: { FIX: expectedText },
      };
    }
  }
  return null;
};

/** 2. Missing past -ed when a past-time marker is present. */
const rulePastEd: Rule = ({ userTokens, expectedTokens, expectedText }) => {
  if (!hasPastTimeMarker(userTokens) && !hasPastTimeMarker(expectedTokens)) {
    return null;
  }
  const len = Math.min(userTokens.length, expectedTokens.length);
  for (let i = 0; i < len; i++) {
    if (isPastForm(userTokens[i], expectedTokens[i])) {
      return { tag: 'vi_l1_past_ed', replacements: { FIX: expectedText } };
    }
  }
  return null;
};

/** 3. Plural -s missing after a plural quantifier. */
const rulePluralS: Rule = ({ userTokens, expectedTokens, expectedText }) => {
  const len = Math.min(userTokens.length, expectedTokens.length);
  for (let i = 1; i < len; i++) {
    const prev = userTokens[i - 1];
    if (!isPluralQuantifier(prev)) continue;
    if (isPluralForm(userTokens[i], expectedTokens[i])) {
      return { tag: 'vi_l1_plural_s', replacements: { FIX: expectedText } };
    }
  }
  return null;
};

/** 4. Missing be-verb between subject and adjective/NP. */
const ruleMissingBe: Rule = ({ userTokens, expectedTokens, expectedText }) => {
  // Heuristic: expected has a be-verb at position p where user lacks one.
  // Align by first-mismatch index, then check if inserting a be-verb in user
  // at that position yields expected (length off by exactly 1, the missing
  // token is a be-verb).
  if (expectedTokens.length !== userTokens.length + 1) return null;

  for (let i = 0; i < expectedTokens.length; i++) {
    if (!BE_VERBS.has(expectedTokens[i])) continue;
    // Check that user matches expected with expectedTokens[i] removed.
    const withoutBe = expectedTokens.slice(0, i).concat(expectedTokens.slice(i + 1));
    if (
      withoutBe.length === userTokens.length &&
      withoutBe.every((t, j) => t === userTokens[j])
    ) {
      return { tag: 'vi_l1_missing_be', replacements: { FIX: expectedText } };
    }
  }
  return null;
};

/** 5. Question formed without fronted auxiliary (subject-verb declarative order). */
const ruleQuestionNoAux: Rule = ({ userText, expectedText, userTokens, expectedTokens, ctx }) => {
  // Only fire when the user themselves wrote a question (trailing "?" or
  // explicit ctx.isQuestion). If only the expected answer is a question,
  // the learner may not have understood the question-form requirement yet
  // — better to let higher-priority rules (missing_be, missing_aux shape
  // errors) handle it, or fall through to generic feedback.
  const isQuestion = ctx.isQuestion === true || hasQuestionMark(userText);
  if (!isQuestion) return null;

  const firstUser = stripTrailingQmark(userTokens)[0];
  const firstExpected = stripTrailingQmark(expectedTokens)[0];
  if (!firstUser || !firstExpected) return null;
  if (AUX_QUESTION_STARTERS.has(firstUser)) return null;         // already starts with aux
  if (!AUX_QUESTION_STARTERS.has(firstExpected)) return null;    // expected also isn't aux-led → not this rule

  return { tag: 'vi_l1_question_no_aux', replacements: { FIX: expectedText } };
};

/** 6. Missing article (a/an/the) where expected has one. */
const ruleMissingArticle: Rule = ({ userTokens, expectedTokens, expectedText }) => {
  // Expected must have at least one more article than user.
  const userArticleCount = userTokens.filter((t) => ARTICLES.has(t)).length;
  const expectedArticleCount = expectedTokens.filter((t) => ARTICLES.has(t)).length;
  if (expectedArticleCount <= userArticleCount) return null;

  // Confirm length diff is reasonable (≤ diff in article count + small slack).
  if (expectedTokens.length - userTokens.length < 1) return null;

  return { tag: 'vi_l1_missing_article', replacements: { FIX: expectedText } };
};

/** 8. Possessive gender swap (his/her confusion). */
const rulePossessiveGender: Rule = ({ userTokens, expectedTokens, expectedText }) => {
  const len = Math.min(userTokens.length, expectedTokens.length);
  for (let i = 0; i < len; i++) {
    const u = userTokens[i];
    const e = expectedTokens[i];
    if (u === e) continue;
    if (POSSESSIVE_GENDERED.has(u) && POSSESSIVE_GENDERED.has(e) && u !== e) {
      return { tag: 'vi_l1_possessive_gender', replacements: { FIX: expectedText } };
    }
  }
  return null;
};

/** 9. Preposition transfer — swap from a small curated mismatch table. */
const rulePrepositionTransfer: Rule = ({ userTokens, expectedTokens, expectedText }) => {
  const len = Math.min(userTokens.length, expectedTokens.length);

  // Simple 1:1 swap (in ↔ on ↔ at).
  for (let i = 0; i < len; i++) {
    const u = userTokens[i];
    const e = expectedTokens[i];
    if (u === e) continue;
    for (const m of PREPOSITION_MISMATCHES) {
      if (m.wrong.includes(' ')) continue;           // skip multi-word entries here
      if (u === m.wrong && e === m.right) {
        return {
          tag: 'vi_l1_preposition_transfer',
          replacements: { FIX: expectedText, USER_PREP: m.wrong, FIX_PREP: m.right },
        };
      }
    }
  }

  // Multi-word case: "listen music" → "listen to music" (user omitted the
  // preposition). These entries have the extra word in `right` (e.g. "listen"
  // → "listen to"), so we key the multi-word branch off `right` containing a
  // space, not `wrong`.
  const userJoined = userTokens.join(' ');
  const expectedJoined = expectedTokens.join(' ');
  for (const m of PREPOSITION_MISMATCHES) {
    if (!m.right.includes(' ')) continue;
    const wrongPhrase = m.wrong;                     // e.g. "listen"
    const rightPhrase = m.right;                     // e.g. "listen to"
    if (userJoined.includes(wrongPhrase) && expectedJoined.includes(rightPhrase)) {
      // Confirm user MISSES the preposition from the right phrase.
      const extraPrep = rightPhrase.slice(wrongPhrase.length).trim();
      if (
        extraPrep &&
        !userJoined.includes(` ${extraPrep} `) &&
        !userJoined.endsWith(` ${extraPrep}`)
      ) {
        return {
          tag: 'vi_l1_preposition_transfer',
          replacements: {
            FIX: expectedText,
            USER_PREP: wrongPhrase,
            FIX_PREP: rightPhrase,
          },
        };
      }
    }
  }
  return null;
};

/** 10. Uncountable noun used with a/an or with plural -s. */
const ruleCountable: Rule = ({ userTokens, expectedTokens, expectedText }) => {
  // Find uncountable noun in user where preceded by a/an OR given plural -s,
  // but expected has the noun bare or singular.
  for (let i = 0; i < userTokens.length; i++) {
    const raw = userTokens[i];

    // Derive the lemma. Plurals can be formed with +s OR +es (researches /
    // analyses / businesses), so try stripping both and see if either maps
    // back to an uncountable head word.
    let lemma = raw;
    if (raw.endsWith('es') && UNCOUNTABLE_NOUNS.has(raw.slice(0, -2))) {
      lemma = raw.slice(0, -2);
    } else if (raw.endsWith('s') && UNCOUNTABLE_NOUNS.has(raw.slice(0, -1))) {
      lemma = raw.slice(0, -1);
    }
    if (!UNCOUNTABLE_NOUNS.has(lemma)) continue;

    const prev = i > 0 ? userTokens[i - 1] : '';
    const userHasA = prev === 'a' || prev === 'an';
    const userHasS = raw !== lemma;

    if (!userHasA && !userHasS) continue;

    // Check expected: uncountable noun present AND NOT preceded by a/an AND
    // NOT used as a plural (no +s / +es form in the expected tokens).
    const expectedHas = expectedTokens.includes(lemma);
    if (!expectedHas) continue;
    const expectedIdx = expectedTokens.indexOf(lemma);
    const expectedPrev = expectedIdx > 0 ? expectedTokens[expectedIdx - 1] : '';
    const expectedIsCorrect =
      expectedPrev !== 'a' &&
      expectedPrev !== 'an' &&
      !expectedTokens.includes(lemma + 's') &&
      !expectedTokens.includes(lemma + 'es');
    if (!expectedIsCorrect) continue;

    return { tag: 'vi_l1_countable', replacements: { FIX: expectedText } };
  }
  return null;
};

// ────────────────────────────────────────────────────────────────────────────
// Registry — fixed priority order. First match wins.
// ────────────────────────────────────────────────────────────────────────────

const RULE_REGISTRY: Rule[] = [
  ruleThirdPersonS,        // 1
  rulePastEd,              // 2
  rulePluralS,             // 3
  ruleMissingBe,           // 4
  ruleQuestionNoAux,       // 5
  ruleMissingArticle,      // 6
  rulePossessiveGender,    // 8
  rulePrepositionTransfer, // 9
  ruleCountable,           // 10
];

// ────────────────────────────────────────────────────────────────────────────
// Public entry point
// ────────────────────────────────────────────────────────────────────────────

export function detectL1Error(input: L1DetectionInput): L1DetectionResult {
  const userText = String(input.userAnswer ?? '').trim();
  const expectedText = String(input.expectedAnswer ?? '').trim();
  const ctx = input.questionContext ?? {};

  if (!userText || !expectedText) {
    return { matched: false, weaknessTag: null, feedback: null };
  }
  // If answers are identical after normalization, nothing to detect.
  if (userText.toLowerCase() === expectedText.toLowerCase()) {
    return { matched: false, weaknessTag: null, feedback: null };
  }

  const userTokens = tokenize(userText);
  const expectedTokens = tokenize(expectedText);

  for (const rule of RULE_REGISTRY) {
    const hit = rule({ userTokens, expectedTokens, userText, expectedText, ctx });
    if (hit) {
      return {
        matched: true,
        weaknessTag: hit.tag,
        feedback: fillTemplate(RULE_STRINGS[hit.tag], hit.replacements),
      };
    }
  }
  return { matched: false, weaknessTag: null, feedback: null };
}
