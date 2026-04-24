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
 * Single-detection priority order (v1.1 adds rules 11–21):
 *   1. vi_l1_3rd_person_s         structural
 *   2. vi_l1_past_ed              structural
 *   3. vi_l1_plural_s             structural
 *   4. vi_l1_missing_be           structural
 *   5. vi_l1_question_no_aux      structural
 *   6. vi_l1_missing_article      usage
 *   --- 7. vi_l1_tense_shift_compound  DEFERRED (too high FP risk) ---
 *   8. vi_l1_possessive_gender    usage
 *   9. vi_l1_preposition_transfer vocab
 *  10. vi_l1_countable            vocab
 *  11. vi_l1_to_verb_confusion    structural (v1.1)
 *  12. vi_l1_can_no_infinitive    structural (v1.1)
 *  13. vi_l1_double_past          structural (v1.1)
 *  14. vi_l1_possessive_s_missing usage      (v1.1)
 *  15. vi_l1_comparative_double   morphology (v1.1)
 *  16. vi_l1_adjective_order      structural (v1.1)
 *  17. vi_l1_very_much_placement  word-order (v1.1)
 *  18. vi_l1_there_are_singular   agreement  (v1.1)
 *  19. vi_l1_everyone_plural      agreement  (v1.1)
 *  20. vi_l1_make_vs_do           collocation(v1.1)
 *  21. vi_l1_tag_question         style      (v1.1)
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
  | 'vi_l1_countable'
  | 'vi_l1_to_verb_confusion'
  | 'vi_l1_can_no_infinitive'
  | 'vi_l1_double_past'
  | 'vi_l1_possessive_s_missing'
  | 'vi_l1_comparative_double'
  | 'vi_l1_adjective_order'
  | 'vi_l1_very_much_placement'
  | 'vi_l1_there_are_singular'
  | 'vi_l1_everyone_plural'
  | 'vi_l1_make_vs_do'
  | 'vi_l1_tag_question';

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

  // ── v1.1 rules ─────────────────────────────────────────────────────────

  vi_l1_to_verb_confusion: {
    en: "After verbs like **want**, **need**, **try**, **hope**, English inserts **to** before the next verb. Tiếng Việt mình nói 'tôi muốn đi' — một mạch. English takes the extra step. Try: *{FIX}*.",
    vi: "Sau các động từ như **want / need / try / hope**, tiếng Anh cần **to** trước động từ tiếp theo. Tiếng Việt mình nói 'tôi muốn đi' thẳng một mạch — tiếng Anh cần thêm bước. Thử: *{FIX}*.",
  },
  vi_l1_can_no_infinitive: {
    en: 'After a modal — **can**, **could**, **will**, **should** — English keeps the next verb in its bare form. No **-s**, no **-ed**, no **-ing**. Vietnamese keeps verbs unchanged too, so let the modal carry the meaning. Try: *{FIX}*.',
    vi: 'Sau trợ động từ **can / could / will / should**, tiếng Anh giữ động từ ở dạng gốc — không thêm **-s**, **-ed**, **-ing**. Tiếng Việt mình cũng để động từ nguyên. Thử: *{FIX}*.',
  },
  vi_l1_double_past: {
    en: "English marks past tense **once**. If you already said **did** or **didn't**, the main verb stays bare. *I didn't went* → *I didn't go*. Try: *{FIX}*.",
    vi: "Tiếng Anh chỉ đánh dấu quá khứ **một lần**. **did / didn't** đã là quá khứ rồi, nên động từ chính giữ nguyên dạng gốc. *I didn't went* → *I didn't go*. Thử: *{FIX}*.",
  },
  vi_l1_possessive_s_missing: {
    en: "Vietnamese says 'nhà của mẹ' or just 'nhà mẹ' — two nouns can touch. English puts **'s** between them: *my mother's house*. Try: *{FIX}*.",
    vi: "Tiếng Việt mình nói 'nhà của mẹ' hoặc 'nhà mẹ' — hai danh từ ghép được. Tiếng Anh thêm **'s** vào giữa: *my mother's house*. Thử: *{FIX}*.",
  },
  vi_l1_comparative_double: {
    en: 'Use **more** OR the **-er** ending — never both. *more better* → *better*. *more faster* → *faster*. Try: *{FIX}*.',
    vi: 'Tiếng Anh dùng **more** HOẶC đuôi **-er**, không dùng cả hai cùng lúc. *more better* → *better*. *more faster* → *faster*. Thử: *{FIX}*.',
  },
  vi_l1_adjective_order: {
    en: "In English, adjectives come **before** the noun — *red car*, not *car red*. Tiếng Việt mình đặt tính từ sau danh từ ('xe đỏ'); English flips the order. Try: *{FIX}*.",
    vi: "Trong tiếng Anh, tính từ đứng **trước** danh từ — *red car*, không phải *car red*. Tiếng Việt mình đặt tính từ sau ('xe đỏ'), tiếng Anh đảo ngược lại. Thử: *{FIX}*.",
  },
  vi_l1_very_much_placement: {
    en: 'In English, **very much** usually comes after the verb or object, not before it. *I very much like it* → *I like it very much*. Try: *{FIX}*.',
    vi: 'Trong tiếng Anh, **very much** thường đứng sau động từ hoặc tân ngữ, không đứng trước. *I very much like it* → *I like it very much*. Thử: *{FIX}*.',
  },
  vi_l1_there_are_singular: {
    en: '**There is** goes with singular — *a book*, *an apple*, *one cat*. **There are** is only for plural. Try: *{FIX}*.',
    vi: '**There is** đi với số ít — *a book*, *an apple*, *one cat*. **There are** chỉ dùng cho số nhiều. Thử: *{FIX}*.',
  },
  vi_l1_everyone_plural: {
    en: "Words like **everyone**, **someone**, **nobody** look plural but take a **singular** verb in English — *everyone **is** here*, not *are*. Try: *{FIX}*.",
    vi: "Các từ **everyone / someone / nobody** nghe như số nhiều nhưng tiếng Anh đi với động từ **số ít** — *everyone **is** here*, không phải *are*. Thử: *{FIX}*.",
  },
  vi_l1_make_vs_do: {
    en: "**Make** and **do** both translate to **làm** in Vietnamese, but English picks one based on the noun. Here, **{WRONG}** should be **{RIGHT}**. Try: *{FIX}*.",
    vi: "**Make** và **do** đều dịch là **làm** trong tiếng Việt, nhưng tiếng Anh chọn từ nào tùy danh từ đi kèm. Chỗ này **{WRONG}** → **{RIGHT}**. Thử: *{FIX}*.",
  },
  vi_l1_tag_question: {
    en: "Vietnamese tags a question with 'không?' at the end. English builds a **tag question** that mirrors the main verb: *you like coffee, **don't you**?* Try: *{FIX}*.",
    vi: "Tiếng Việt mình thêm 'không?' cuối câu để hỏi lại. Tiếng Anh dùng **tag question** khớp với động từ chính: *you like coffee, **don't you**?* Thử: *{FIX}*.",
  },
};

// ────────────────────────────────────────────────────────────────────────────
// Tokenization + tiny utilities
// ────────────────────────────────────────────────────────────────────────────

/**
 * Collapse common negation / auxiliary contractions into single-token forms
 * so downstream rules can treat "didn't", "doesn't", "isn't", etc. as one
 * unit instead of the apostrophe getting stripped into two tokens. Applied
 * once at entry; every rule sees the normalised text.
 *
 * Also handles curly apostrophes (’ vs ') because ASR output and copy-paste
 * from iOS tend to inject them silently.
 */
function normalizeContractions(s: string): string {
  return s
    .replace(/\bdidn[’']t\b/gi, 'didnt')
    .replace(/\bdoesn[’']t\b/gi, 'doesnt')
    .replace(/\bdon[’']t\b/gi, 'dont')
    .replace(/\bcan[’']t\b/gi, 'cant')
    .replace(/\bwon[’']t\b/gi, 'wont')
    .replace(/\bshouldn[’']t\b/gi, 'shouldnt')
    .replace(/\bwouldn[’']t\b/gi, 'wouldnt')
    .replace(/\bcouldn[’']t\b/gi, 'couldnt')
    .replace(/\bisn[’']t\b/gi, 'isnt')
    .replace(/\baren[’']t\b/gi, 'arent')
    .replace(/\bwasn[’']t\b/gi, 'wasnt')
    .replace(/\bweren[’']t\b/gi, 'werent')
    .replace(/\bhasn[’']t\b/gi, 'hasnt')
    .replace(/\bhaven[’']t\b/gi, 'havent')
    .replace(/\bhadn[’']t\b/gi, 'hadnt');
}

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
  'dont', 'doesnt', 'didnt',                            // normalised contractions
  'is', 'am', 'are', 'was', 'were',
  'isnt', 'arent', 'wasnt', 'werent',
  'can', 'could', 'will', 'would', 'should', 'shall', 'may', 'might', 'must',
  'cant', 'couldnt', 'wouldnt', 'shouldnt', 'wont',
  'have', 'has', 'had',
  'hasnt', 'havent', 'hadnt',
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

// ── v1.1 data ───────────────────────────────────────────────────────────────

/** Verbs that take a bare infinitive marker `to` before the next verb. */
const TO_TRIGGER_VERBS = new Set([
  'want', 'need', 'try', 'decide', 'hope', 'plan', 'learn',
  'like', 'love', 'hate', 'start', 'begin', 'continue',
  'offer', 'refuse', 'forget', 'prefer', 'choose', 'agree',
  'manage', 'afford', 'promise', 'intend', 'expect',
]);

/** Modals after which the main verb must stay bare. */
const MODAL_VERBS = new Set([
  'can', 'could', 'will', 'would', 'should', 'shall',
  'may', 'might', 'must',
]);

/** do-support auxiliaries that mark tense / polarity — main verb must then stay bare. */
const DO_AUX_SET = new Set([
  'do', 'does', 'did',
  'dont', 'doesnt', 'didnt',
]);

/** Tight list of English adjectives we trust enough to flag order errors. */
const COMMON_ADJECTIVES = new Set([
  'red', 'blue', 'green', 'yellow', 'black', 'white', 'brown', 'pink', 'purple', 'orange',
  'big', 'small', 'tall', 'short', 'long', 'wide', 'narrow', 'thick', 'thin',
  'new', 'old', 'young', 'modern', 'ancient',
  'happy', 'sad', 'angry', 'tired', 'hungry',
  'beautiful', 'ugly', 'nice', 'pretty', 'cute',
  'good', 'bad', 'great', 'terrible',
  'hot', 'cold', 'warm', 'cool',
  'fast', 'slow', 'quiet', 'loud',
  'heavy', 'light', 'cheap', 'expensive',
]);

/** Matching tight-set of nouns for rule 16. Kept small to limit FPs. */
const COMMON_NOUNS = new Set([
  'car', 'house', 'book', 'dress', 'shirt', 'bag', 'phone', 'computer',
  'table', 'chair', 'flower', 'dog', 'cat', 'bird', 'pen', 'fish',
  'girl', 'boy', 'man', 'woman', 'baby', 'teacher', 'student', 'doctor',
  'city', 'room', 'tree', 'ball', 'cup', 'plate', 'window', 'door',
]);

/** Indefinite pronouns that look plural but take a singular verb. */
const INDEF_PRONOUNS = new Set([
  'everyone', 'everybody', 'someone', 'somebody',
  'anyone', 'anybody', 'nobody',
  'everything', 'something', 'anything', 'nothing',
]);

/** Irregular comparatives for rule 15 (double-comparative detection). */
const IRREGULAR_COMPARATIVES = new Set(['better', 'worse', 'further', 'farther', 'elder']);

/**
 * Make / do / have collocations that Vietnamese learners commonly confuse
 * because all three translate to `làm` (or near-variants). Each pair is
 * (wrong VERB choice, right VERB choice, REST of the phrase). The rule
 * walks the learner's text through every conjugation of the wrong verb
 * (make → made/makes/making, do → did/does/doing/done) so past-tense and
 * progressive mistakes get caught too.
 */
const MAKE_FORMS = ['make', 'made', 'makes', 'making'];
const DO_FORMS   = ['do', 'did', 'does', 'doing', 'done'];
const HAVE_FORMS = ['have', 'had', 'has', 'having'];

function verbForms(verb: 'make' | 'do' | 'have'): readonly string[] {
  if (verb === 'make') return MAKE_FORMS;
  if (verb === 'do') return DO_FORMS;
  return HAVE_FORMS;
}

const MAKE_DO_COLLOCATIONS: Array<{
  wrongVerb: 'make' | 'do' | 'have';
  rightVerb: 'make' | 'do' | 'have';
  rest: string;
}> = [
  { wrongVerb: 'do',   rightVerb: 'make', rest: 'a mistake' },
  { wrongVerb: 'do',   rightVerb: 'make', rest: 'mistake' },
  { wrongVerb: 'make', rightVerb: 'do',   rest: 'homework' },
  { wrongVerb: 'make', rightVerb: 'do',   rest: 'a homework' },
  { wrongVerb: 'do',   rightVerb: 'make', rest: 'a decision' },
  { wrongVerb: 'make', rightVerb: 'do',   rest: 'exercise' },
  { wrongVerb: 'make', rightVerb: 'do',   rest: 'exercises' },
  { wrongVerb: 'make', rightVerb: 'do',   rest: 'sport' },
  { wrongVerb: 'make', rightVerb: 'do',   rest: 'sports' },
  { wrongVerb: 'make', rightVerb: 'do',   rest: 'business' },
  { wrongVerb: 'do',   rightVerb: 'make', rest: 'an effort' },
  { wrongVerb: 'do',   rightVerb: 'make', rest: 'effort' },
  { wrongVerb: 'do',   rightVerb: 'make', rest: 'a plan' },
  { wrongVerb: 'make', rightVerb: 'do',   rest: 'research' },
  { wrongVerb: 'do',   rightVerb: 'have', rest: 'a party' },
];

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
  /** Contraction-normalised user text (apostrophes stripped). */
  userText: string;
  /** Contraction-normalised expected text. */
  expectedText: string;
  /** ORIGINAL user input before normalisation — prefer for display. */
  rawUser: string;
  /** ORIGINAL expected answer before normalisation — use in FIX replacements. */
  rawExpected: string;
  ctx: NonNullable<L1DetectionInput['questionContext']>;
}) => RuleHit | null;

/** 1. Missing third-person -s. */
const ruleThirdPersonS: Rule = ({ userTokens, expectedTokens, rawExpected }) => {
  const len = Math.min(userTokens.length, expectedTokens.length);
  for (let i = 1; i < len; i++) {
    const prev = userTokens[i - 1];
    if (!THIRD_PERSON_SUBJECTS.has(prev)) continue;
    const userVerb = userTokens[i];
    const expectedVerb = expectedTokens[i];
    if (isThirdPersonSForm(userVerb, expectedVerb)) {
      return {
        tag: 'vi_l1_3rd_person_s',
        replacements: { FIX: rawExpected },
      };
    }
  }
  return null;
};

/** 2. Missing past -ed when a past-time marker is present. */
const rulePastEd: Rule = ({ userTokens, expectedTokens, rawExpected }) => {
  if (!hasPastTimeMarker(userTokens) && !hasPastTimeMarker(expectedTokens)) {
    return null;
  }
  const len = Math.min(userTokens.length, expectedTokens.length);
  for (let i = 0; i < len; i++) {
    if (isPastForm(userTokens[i], expectedTokens[i])) {
      return { tag: 'vi_l1_past_ed', replacements: { FIX: rawExpected } };
    }
  }
  return null;
};

/** 3. Plural -s missing after a plural quantifier. */
const rulePluralS: Rule = ({ userTokens, expectedTokens, rawExpected }) => {
  const len = Math.min(userTokens.length, expectedTokens.length);
  for (let i = 1; i < len; i++) {
    const prev = userTokens[i - 1];
    if (!isPluralQuantifier(prev)) continue;
    if (isPluralForm(userTokens[i], expectedTokens[i])) {
      return { tag: 'vi_l1_plural_s', replacements: { FIX: rawExpected } };
    }
  }
  return null;
};

/** 4. Missing be-verb between subject and adjective/NP. */
const ruleMissingBe: Rule = ({ userTokens, expectedTokens, rawExpected }) => {
  if (expectedTokens.length !== userTokens.length + 1) return null;

  for (let i = 0; i < expectedTokens.length; i++) {
    if (!BE_VERBS.has(expectedTokens[i])) continue;
    const withoutBe = expectedTokens.slice(0, i).concat(expectedTokens.slice(i + 1));
    if (
      withoutBe.length === userTokens.length &&
      withoutBe.every((t, j) => t === userTokens[j])
    ) {
      return { tag: 'vi_l1_missing_be', replacements: { FIX: rawExpected } };
    }
  }
  return null;
};

/** 5. Question formed without fronted auxiliary. */
const ruleQuestionNoAux: Rule = ({ userText, rawExpected, userTokens, expectedTokens, ctx }) => {
  const isQuestion = ctx.isQuestion === true || hasQuestionMark(userText);
  if (!isQuestion) return null;

  const firstUser = stripTrailingQmark(userTokens)[0];
  const firstExpected = stripTrailingQmark(expectedTokens)[0];
  if (!firstUser || !firstExpected) return null;
  if (AUX_QUESTION_STARTERS.has(firstUser)) return null;
  if (!AUX_QUESTION_STARTERS.has(firstExpected)) return null;

  return { tag: 'vi_l1_question_no_aux', replacements: { FIX: rawExpected } };
};

/** 6. Missing article (a/an/the). */
const ruleMissingArticle: Rule = ({ userTokens, expectedTokens, rawExpected }) => {
  const userArticleCount = userTokens.filter((t) => ARTICLES.has(t)).length;
  const expectedArticleCount = expectedTokens.filter((t) => ARTICLES.has(t)).length;
  if (expectedArticleCount <= userArticleCount) return null;
  if (expectedTokens.length - userTokens.length < 1) return null;
  return { tag: 'vi_l1_missing_article', replacements: { FIX: rawExpected } };
};

/** 8. Possessive gender swap (his/her). */
const rulePossessiveGender: Rule = ({ userTokens, expectedTokens, rawExpected }) => {
  const len = Math.min(userTokens.length, expectedTokens.length);
  for (let i = 0; i < len; i++) {
    const u = userTokens[i];
    const e = expectedTokens[i];
    if (u === e) continue;
    if (POSSESSIVE_GENDERED.has(u) && POSSESSIVE_GENDERED.has(e) && u !== e) {
      return { tag: 'vi_l1_possessive_gender', replacements: { FIX: rawExpected } };
    }
  }
  return null;
};

/** 9. Preposition transfer. */
const rulePrepositionTransfer: Rule = ({ userTokens, expectedTokens, rawExpected }) => {
  const len = Math.min(userTokens.length, expectedTokens.length);

  for (let i = 0; i < len; i++) {
    const u = userTokens[i];
    const e = expectedTokens[i];
    if (u === e) continue;
    for (const m of PREPOSITION_MISMATCHES) {
      if (m.wrong.includes(' ')) continue;
      if (u === m.wrong && e === m.right) {
        return {
          tag: 'vi_l1_preposition_transfer',
          replacements: { FIX: rawExpected, USER_PREP: m.wrong, FIX_PREP: m.right },
        };
      }
    }
  }

  const userJoined = userTokens.join(' ');
  const expectedJoined = expectedTokens.join(' ');
  for (const m of PREPOSITION_MISMATCHES) {
    if (!m.right.includes(' ')) continue;
    const wrongPhrase = m.wrong;
    const rightPhrase = m.right;
    if (userJoined.includes(wrongPhrase) && expectedJoined.includes(rightPhrase)) {
      const extraPrep = rightPhrase.slice(wrongPhrase.length).trim();
      if (
        extraPrep &&
        !userJoined.includes(` ${extraPrep} `) &&
        !userJoined.endsWith(` ${extraPrep}`)
      ) {
        return {
          tag: 'vi_l1_preposition_transfer',
          replacements: {
            FIX: rawExpected,
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
const ruleCountable: Rule = ({ userTokens, expectedTokens, rawExpected }) => {
  for (let i = 0; i < userTokens.length; i++) {
    const raw = userTokens[i];

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

    return { tag: 'vi_l1_countable', replacements: { FIX: rawExpected } };
  }
  return null;
};

// ── v1.1 rules ─────────────────────────────────────────────────────────────

/** 11. Missing `to` between a trigger verb and the following verb. */
const ruleToVerbConfusion: Rule = ({ userTokens, expectedTokens, rawExpected }) => {
  // Expected must be exactly one token longer (the extra `to`).
  if (expectedTokens.length !== userTokens.length + 1) return null;

  for (let i = 0; i < expectedTokens.length; i++) {
    if (expectedTokens[i] !== 'to') continue;
    if (i === 0) continue;
    const prev = expectedTokens[i - 1];
    if (!TO_TRIGGER_VERBS.has(prev)) continue;

    // Confirm that removing the `to` at this position matches the user exactly.
    const withoutTo = expectedTokens.slice(0, i).concat(expectedTokens.slice(i + 1));
    if (
      withoutTo.length === userTokens.length &&
      withoutTo.every((t, j) => t === userTokens[j])
    ) {
      return { tag: 'vi_l1_to_verb_confusion', replacements: { FIX: rawExpected } };
    }
  }
  return null;
};

/** 12. Inflected verb after a modal (should be bare). */
const ruleCanNoInfinitive: Rule = ({ userTokens, expectedTokens, rawExpected }) => {
  if (userTokens.length !== expectedTokens.length) return null;
  for (let i = 1; i < userTokens.length; i++) {
    const prev = userTokens[i - 1];
    if (!MODAL_VERBS.has(prev)) continue;
    const u = userTokens[i];
    const e = expectedTokens[i];
    if (u === e) continue;
    // user inflected, expected bare
    if (
      isThirdPersonSForm(e, u) ||
      isPastForm(e, u) ||
      u === e + 'ing'
    ) {
      return { tag: 'vi_l1_can_no_infinitive', replacements: { FIX: rawExpected } };
    }
  }
  return null;
};

/** 13. Double past marking — do-support + past-form verb.
 *  Scans up to 4 tokens AFTER the do-auxiliary because in questions the
 *  subject sits between ("does he likes" → "does he like"). */
const ruleDoublePast: Rule = ({ userTokens, expectedTokens, rawExpected }) => {
  if (userTokens.length !== expectedTokens.length) return null;
  for (let auxIdx = 0; auxIdx < userTokens.length; auxIdx++) {
    if (!DO_AUX_SET.has(userTokens[auxIdx])) continue;
    const scanEnd = Math.min(userTokens.length, auxIdx + 5);
    for (let i = auxIdx + 1; i < scanEnd; i++) {
      const u = userTokens[i];
      const e = expectedTokens[i];
      if (u === e) continue;
      if (isPastForm(e, u) || isThirdPersonSForm(e, u)) {
        return { tag: 'vi_l1_double_past', replacements: { FIX: rawExpected } };
      }
    }
  }
  return null;
};

/** 14. Possessive 's missing. Regex-on-raw-text since tokenize strips apostrophes. */
const rulePossessiveSMissing: Rule = ({ userText, rawExpected, expectedText }) => {
  const expectedMatch = /\b(\w+)[’']s\s+(\w+)/i.exec(expectedText);
  if (!expectedMatch) return null;
  const possessor = expectedMatch[1];
  const possessed = expectedMatch[2];
  // User has the two words side-by-side WITHOUT 's — and NOT with 's.
  const userHasPair = new RegExp(
    `\\b${possessor}\\s+${possessed}\\b`,
    'i',
  ).test(userText);
  const userHasPossessive = new RegExp(
    `\\b${possessor}[’']s\\s+${possessed}\\b`,
    'i',
  ).test(userText);
  if (userHasPair && !userHasPossessive) {
    return { tag: 'vi_l1_possessive_s_missing', replacements: { FIX: rawExpected } };
  }
  return null;
};

/** 15. Double comparative: `more` + comparative form. */
const ruleComparativeDouble: Rule = ({ userTokens, expectedTokens, rawExpected }) => {
  // User has exactly one extra token (the redundant "more").
  if (userTokens.length !== expectedTokens.length + 1) return null;
  for (let i = 0; i < userTokens.length - 1; i++) {
    if (userTokens[i] !== 'more') continue;
    const next = userTokens[i + 1];
    const looksComparative =
      (next.endsWith('er') && next.length > 3) || IRREGULAR_COMPARATIVES.has(next);
    if (!looksComparative) continue;
    // Confirm removing this "more" yields the expected tokens.
    const withoutMore = userTokens.slice(0, i).concat(userTokens.slice(i + 1));
    if (
      withoutMore.length === expectedTokens.length &&
      withoutMore.every((t, j) => t === expectedTokens[j])
    ) {
      return { tag: 'vi_l1_comparative_double', replacements: { FIX: rawExpected } };
    }
  }
  return null;
};

/** 16. Adjective order — noun + adjective swapped to adjective + noun. */
const ruleAdjectiveOrder: Rule = ({ userTokens, expectedTokens, rawExpected }) => {
  if (userTokens.length !== expectedTokens.length) return null;
  for (let i = 0; i < userTokens.length - 1; i++) {
    const u1 = userTokens[i];
    const u2 = userTokens[i + 1];
    const e1 = expectedTokens[i];
    const e2 = expectedTokens[i + 1];
    if (
      COMMON_NOUNS.has(u1) &&
      COMMON_ADJECTIVES.has(u2) &&
      COMMON_ADJECTIVES.has(e1) &&
      COMMON_NOUNS.has(e2) &&
      e1 === u2 &&
      e2 === u1
    ) {
      return { tag: 'vi_l1_adjective_order', replacements: { FIX: rawExpected } };
    }
  }
  return null;
};

/** 17. "very much" placed before a verb instead of after it. */
const ruleVeryMuchPlacement: Rule = ({ userTokens, expectedTokens, rawExpected }) => {
  const findVeryMuch = (tokens: string[]): number => {
    for (let i = 0; i < tokens.length - 1; i++) {
      if (tokens[i] === 'very' && tokens[i + 1] === 'much') return i;
    }
    return -1;
  };
  const userIdx = findVeryMuch(userTokens);
  if (userIdx < 0) return null;
  const expectedIdx = findVeryMuch(expectedTokens);
  if (expectedIdx < 0) return null;

  // "very much" appears earlier in the user answer than in the expected
  // answer → misplaced toward the beginning (the classic VN pattern).
  if (userIdx < expectedIdx) {
    return { tag: 'vi_l1_very_much_placement', replacements: { FIX: rawExpected } };
  }
  return null;
};

/** 18. "there are" used with a singular (a/an/one). */
const ruleThereAreSingular: Rule = ({ userText, rawExpected, expectedText }) => {
  if (!/\bthere\s+are\s+(a|an|one)\b/i.test(userText)) return null;
  if (!/\bthere\s+is\s+(a|an|one)\b/i.test(expectedText)) return null;
  return { tag: 'vi_l1_there_are_singular', replacements: { FIX: rawExpected } };
};

/** 19. Indefinite pronoun + plural-looking verb. */
const ruleEveryonePlural: Rule = ({ userTokens, expectedTokens, rawExpected }) => {
  if (userTokens.length !== expectedTokens.length) return null;
  const PLURAL_TO_SINGULAR: Record<string, string[]> = {
    are:  ['is'],
    were: ['was'],
    have: ['has'],
    do:   ['does'],
  };
  for (let i = 0; i < userTokens.length - 1; i++) {
    if (!INDEF_PRONOUNS.has(userTokens[i])) continue;
    const u = userTokens[i + 1];
    const e = expectedTokens[i + 1];
    if (u === e) continue;
    const accept = PLURAL_TO_SINGULAR[u];
    if (accept && accept.includes(e)) {
      return { tag: 'vi_l1_everyone_plural', replacements: { FIX: rawExpected } };
    }
    // Bare verb → -s form (e.g. "everyone like" → "everyone likes").
    if (isThirdPersonSForm(u, e)) {
      return { tag: 'vi_l1_everyone_plural', replacements: { FIX: rawExpected } };
    }
  }
  return null;
};

/** 20. Make / do / have collocation confusion — walks verb conjugations. */
const ruleMakeVsDo: Rule = ({ userText, rawExpected, expectedText }) => {
  const userLower = userText.toLowerCase();
  const expectedLower = expectedText.toLowerCase();

  for (const pair of MAKE_DO_COLLOCATIONS) {
    const wrongForms = verbForms(pair.wrongVerb);
    const rightForms = verbForms(pair.rightVerb);

    // Find the first wrong-form + rest that appears in user.
    let userHit: { form: string } | null = null;
    for (const f of wrongForms) {
      if (userLower.includes(`${f} ${pair.rest}`)) {
        userHit = { form: f };
        break;
      }
    }
    if (!userHit) continue;

    // Expected must show a matching right-form + rest.
    let expectedHit: { form: string } | null = null;
    for (const f of rightForms) {
      if (expectedLower.includes(`${f} ${pair.rest}`)) {
        expectedHit = { form: f };
        break;
      }
    }
    if (!expectedHit) continue;

    return {
      tag: 'vi_l1_make_vs_do',
      replacements: {
        FIX: rawExpected,
        WRONG: `${userHit.form} ${pair.rest}`,
        RIGHT: `${expectedHit.form} ${pair.rest}`,
      },
    };
  }
  return null;
};

/** 21. Tag question rendered as ", no?" / ", yes?". */
const ruleTagQuestion: Rule = ({ userText, rawExpected, expectedText }) => {
  if (!/,\s*(no|yes)\s*\?\s*$/i.test(userText)) return null;
  // Guard: if the expected answer also ends with ", no?", this is evidently
  // the target form — don't flag it.
  if (/,\s*(no|yes)\s*\?\s*$/i.test(expectedText)) return null;
  return { tag: 'vi_l1_tag_question', replacements: { FIX: rawExpected } };
};

// ────────────────────────────────────────────────────────────────────────────
// Registry — fixed priority order. First match wins.
// ────────────────────────────────────────────────────────────────────────────

const RULE_REGISTRY: Rule[] = [
  ruleThirdPersonS,          // 1
  rulePastEd,                // 2
  rulePluralS,               // 3
  ruleMissingBe,             // 4
  ruleQuestionNoAux,         // 5
  ruleMissingArticle,        // 6
  rulePossessiveGender,      // 8
  rulePrepositionTransfer,   // 9
  ruleCountable,             // 10
  ruleToVerbConfusion,       // 11
  ruleCanNoInfinitive,       // 12
  ruleDoublePast,            // 13
  rulePossessiveSMissing,    // 14
  ruleComparativeDouble,     // 15
  ruleAdjectiveOrder,        // 16
  ruleVeryMuchPlacement,     // 17
  ruleThereAreSingular,      // 18
  ruleEveryonePlural,        // 19
  ruleMakeVsDo,              // 20
  ruleTagQuestion,           // 21
];

// ────────────────────────────────────────────────────────────────────────────
// Public entry point
// ────────────────────────────────────────────────────────────────────────────

export function detectL1Error(input: L1DetectionInput): L1DetectionResult {
  const rawUser = String(input.userAnswer ?? '').trim();
  const rawExpected = String(input.expectedAnswer ?? '').trim();
  const ctx = input.questionContext ?? {};

  if (!rawUser || !rawExpected) {
    return { matched: false, weaknessTag: null, feedback: null };
  }

  // Normalise common contractions so tokenizer doesn't split "didn't" into
  // ["didn", "t"]. Applied once at entry — every rule sees the same shape.
  const userText = normalizeContractions(rawUser);
  const expectedText = normalizeContractions(rawExpected);

  if (userText.toLowerCase() === expectedText.toLowerCase()) {
    return { matched: false, weaknessTag: null, feedback: null };
  }

  const userTokens = tokenize(userText);
  const expectedTokens = tokenize(expectedText);

  for (const rule of RULE_REGISTRY) {
    const hit = rule({
      userTokens,
      expectedTokens,
      userText,
      expectedText,
      rawUser,
      rawExpected,
      ctx,
    });
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
