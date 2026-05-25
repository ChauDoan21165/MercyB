/**
 * Vietnamese L1 profile — Phase-1 ingest.
 *
 * Single read-only `L1Profile` for Vietnamese learners of English,
 * assembled mechanically from the four C-workstream taxonomy docs that
 * landed on origin/main:
 *
 *   docs/l1-taxonomies/spec.md            (C4 — canonical interface + §0 locks)
 *   docs/l1-taxonomies/vi-grammar.md      (C1 — 15 grammar families, 180 examples)
 *   docs/l1-taxonomies/vi-writing.md      (C2 — 12 writing families, 169 examples,
 *                                           10 needsReview markers preserved as
 *                                           a `needsReview: true` flag per dispatch
 *                                           override of the spec WritingPattern shape)
 *   docs/l1-taxonomies/vn-phoneme-gaps.md (C3 — 6 audit-grade phoneme gap categories;
 *                                           proposed entries live in
 *                                           src/lib/pronunciation/vn-phoneme-map.extension.proposed.ts
 *                                           and are NOT imported by the runtime profile)
 *
 * Hard rules (from the dispatch):
 *   - DO NOT re-author taxonomy content. Mechanical ingest only.
 *   - DO NOT modify vnL1Interference.ts, l1-error-detector.ts, or the
 *     existing rule-pack — they are consumed by reference via
 *     PhenomenonId per spec §4 decision 2.
 *   - DO NOT implement validateL1Profile() — separate dispatch per
 *     spec §6 Phase-1 (extends validateRulePack).
 *
 * Schema notes (deviations from spec §2 documented inline):
 *   - WritingPattern carries an extra optional `needsReview?: boolean`
 *     field. The dispatch explicitly required preserving C2's 10 needsReview
 *     markers on the affected families; spec §2 omits this field on
 *     WritingPattern (it lives on GrammarExplanation only). C4 reconciles
 *     in a follow-up.
 *   - PhonologyLayer carries an extra optional `gaps?: PhonemeGapCategory[]`
 *     field. The dispatch test gate asserts `phonology.gaps[].id` uniqueness;
 *     spec §2 PhonologyLayer omits it. C4 reconciles.
 *
 * Severity vocabulary: 'low' | 'medium' | 'high' (spec §0).
 * Tag namespace: snake_case throughout (spec §0).
 */

import {
  PHONEME_SUBSTITUTIONS,
  PHONEME_TIPS,
  PROBLEM_PAIRS_ED_ENDINGS,
  PROBLEM_PAIRS_R_L,
  PROBLEM_PAIRS_S_PLURALS,
  PROBLEM_PAIRS_TH_T,
  WORD_OVERRIDES,
  type PhonemeSubRule,
  type PhonemeTip,
  type ProblemPair,
} from "../pronunciation/vn-phoneme-map.js";
import { VN_RULE_PACK } from "../feedback/rule-packs/vi/index.js";
import {
  VN_L1_INTERFERENCE_PATTERNS,
  type VNL1Pattern,
} from "../../data/placement/vnL1Interference.js";

// ──────────────────────────────────────────────────────────────────────────
// Schema (spec §2 — inlined here because the three-file dispatch budget
// keeps types co-located with the profile literal; future extraction to
// `src/lib/l1-profiles/types.ts` is a follow-up dispatch).
// ──────────────────────────────────────────────────────────────────────────

export type CEFR = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type Severity = "low" | "medium" | "high";

export interface FeedbackLabel {
  en: string;
  vi: string;
}

export type PhenomenonId = string;

export interface GrammarFamilyExample {
  learnerProduces: string;
  targetForm: string;
  whyViL1?: string;
}

export interface GrammarFamily {
  id: string;
  descriptionEn: string;
  descriptionVi: string;
  severity: Severity;
  severityRationale: string;
  examples: GrammarFamilyExample[];
  ruleTags?: string[];
  phenomenon?: PhenomenonId;
}

export interface WritingPatternExample {
  incorrect: string;
  corrected: string;
  nativeGloss?: string;
  context?: string;
}

export interface WritingPattern {
  id: string;
  category:
    | "discourse"
    | "register"
    | "cohesion"
    | "paragraph-shape"
    | "pragmatics"
    | "genre";
  name: FeedbackLabel;
  description: FeedbackLabel;
  nativeRoot: string;
  examples: WritingPatternExample[];
  cefr: CEFR[];
  severity: Severity;
  genres: string[];
  remediation: string;
  /** Dispatch override — preserved from C2's 10 inline needsReview markers. */
  needsReview?: boolean;
  phenomenon?: PhenomenonId;
}

export interface PhonemeGapCategory {
  id: string;
  title: string;
  rationale: string;
  proposedEntryCount: number;
  needsReview?: boolean;
}

export interface PhonologyLayer {
  substitutions: PhonemeSubRule[];
  wordOverrides: Record<string, Array<{ variant: string; credit: number }>>;
  tips: PhonemeTip[];
  problemPairs: Record<string, ProblemPair[]>;
  /** Dispatch addition — C3 audit gap categories (not yet in the runtime map). */
  gaps?: PhonemeGapCategory[];
}

export interface GrammarLayer {
  /** The runtime detector pack — re-exported, not duplicated. */
  rulePack: typeof VN_RULE_PACK;
  families?: GrammarFamily[];
}

export interface WritingLayer {
  patterns: WritingPattern[];
}

export interface InterferenceMap {
  patterns: VNL1Pattern[];
}

export interface L1ProfileMetadata {
  nativeLangCode: string;
  nativeLangName: string;
  targetLangCode: string;
  version: string;
  lastReviewed: string;
  lastReviewedBy: string;
  citations: string[];
}

export interface L1Profile {
  meta: L1ProfileMetadata;
  interference: InterferenceMap;
  phonology?: PhonologyLayer;
  grammar?: GrammarLayer;
  writing?: WritingLayer;
}

export type VietnameseL1Profile = L1Profile;

// ──────────────────────────────────────────────────────────────────────────
// Grammar families — C1 vi-grammar.md (15 families, snake_case IDs per spec §0).
// ──────────────────────────────────────────────────────────────────────────

const grammarFamilies: GrammarFamily[] = [
  {
    id: "article_omission_overuse",
    descriptionEn:
      "Missing, overused, or mis-selected a/an/the. Vietnamese has no article system; definiteness is carried by classifiers, demonstratives, numerals, or context.",
    descriptionVi:
      "Thiếu, thừa, hoặc dùng sai a/an/the. Tiếng Việt không có hệ thống mạo từ; sự xác định được thể hiện qua loại từ, từ chỉ định, số đếm, hoặc ngữ cảnh.",
    severity: "medium",
    severityRationale:
      "Listeners parse around missing articles, but consistent omission is the single most visible Vietnamese-English marker in writing. Flag, don't lecture mid-conversation.",
    ruleTags: ["vi_l1_missing_article", "vi_l1_a_vs_an_vowel", "vi_l1_geographical_article", "vi_l1_no_article_generic", "vi_l1_superlative_the", "vi_l1_generic_plural"],
    phenomenon: "article_definiteness",
    examples: [
      { learnerProduces: "I bought book yesterday.", targetForm: "I bought a book yesterday.", whyViL1: "No article in `tôi mua sách hôm qua`." },
      { learnerProduces: "She is teacher.", targetForm: "She is a teacher.", whyViL1: "`cô ấy là giáo viên` — no `a` slot." },
      { learnerProduces: "I live in Hanoi for five year.", targetForm: "I have lived in Hanoi for five years.", whyViL1: "(also tense + plural — but article slot is empty too)" },
      { learnerProduces: "The Vietnam is beautiful country.", targetForm: "Vietnam is a beautiful country.", whyViL1: "Proper nouns get spurious `the` from over-correction." },
      { learnerProduces: "I love the music.", targetForm: "I love music.", whyViL1: "Abstract / mass nouns get spurious `the`." },
      { learnerProduces: "He is in hospital because he sick.", targetForm: "He is in the hospital because he is sick.", whyViL1: "Definite location dropped; British zero-article hospital is also confusing." },
      { learnerProduces: "My father is doctor and my mother is nurse.", targetForm: "My father is a doctor and my mother is a nurse.", whyViL1: "Professions need `a/an` in EN, bare noun in VI." },
      { learnerProduces: "She has long hair and beautiful smile.", targetForm: "She has long hair and a beautiful smile.", whyViL1: "First noun mass (correct), second noun count (needs `a`)." },
      { learnerProduces: "I want to be engineer.", targetForm: "I want to be an engineer.", whyViL1: "Same as `she is teacher`, plus the `a → an` rule." },
      { learnerProduces: "I read the book about Vietnamese history.", targetForm: "I read a book about Vietnamese history.", whyViL1: "First-mention indefinite, but learners default to `the` from translation drills." },
      { learnerProduces: "Please open the door, then close door again.", targetForm: "Please open the door, then close the door again.", whyViL1: "Definite reference dropped on repetition." },
      { learnerProduces: "I want one coffee.", targetForm: "I want a coffee.", whyViL1: "`một` translates to `one`, but the indefinite reading needs `a`." },
      { learnerProduces: "He is best student in our class.", targetForm: "He is the best student in our class.", whyViL1: "Superlatives obligatorily take `the`; VI uses `nhất` with no article." },
    ],
  },
  {
    id: "tense_adverb_flattening",
    descriptionEn:
      "Verbs stay in base form; time is carried entirely by adverbs (yesterday, tomorrow, already). Vietnamese marks time through đã/đang/sẽ/rồi or temporal adverbs, never through verb morphology.",
    descriptionVi:
      "Động từ giữ nguyên dạng; thời gian chỉ thể hiện qua trạng từ. Tiếng Việt báo thì qua đã/đang/sẽ hoặc từ chỉ thời gian, không qua biến hình động từ.",
    severity: "high",
    severityRationale:
      "Highest-impact transfer pattern. Touches every past, present perfect, and future utterance; reads as visibly broken to any English ear.",
    ruleTags: ["vi_l1_past_ed", "vi_l1_present_perfect_vs_past", "vi_l1_past_perfect_missing", "vi_l1_double_past"],
    phenomenon: "tense_unmarked",
    examples: [
      { learnerProduces: "I go to Da Nang last week.", targetForm: "I went to Da Nang last week.", whyViL1: "`tôi đi Đà Nẵng tuần trước` — past is in the adverb, not the verb." },
      { learnerProduces: "She cook dinner yesterday.", targetForm: "She cooked dinner yesterday.", whyViL1: "Same — `nấu` doesn't change." },
      { learnerProduces: "We meet two years ago.", targetForm: "We met two years ago.", whyViL1: "`gặp` is invariant." },
      { learnerProduces: "I watch a movie last night.", targetForm: "I watched a movie last night." },
      { learnerProduces: "He call me three time today.", targetForm: "He called me three times today.", whyViL1: "(also plural — `time → times`)" },
      { learnerProduces: "Tomorrow I go to my parents house.", targetForm: "Tomorrow I will go to my parents' house.", whyViL1: "Future also adverb-only; `sẽ` is optional in casual VI." },
      { learnerProduces: "Next week I start a new job.", targetForm: "Next week I will start a new job.", whyViL1: "Either future form acceptable; bare present is the L1 default." },
      { learnerProduces: "I already eat breakfast.", targetForm: "I have already eaten breakfast.", whyViL1: "`đã ăn rồi` flattens to bare verb when learner reaches for perfect." },
      { learnerProduces: "I live in Canada for three years.", targetForm: "I have lived in Canada for three years.", whyViL1: "Present-perfect-progressive is the clearest gap; VI has no perfect aspect." },
      { learnerProduces: "Yesterday I am very tired.", targetForm: "Yesterday I was very tired.", whyViL1: "Even `be` flattens when the adverb does the time work." },
      { learnerProduces: "She not come to class yesterday.", targetForm: "She didn't come to class yesterday.", whyViL1: "(also negation — see family 14)" },
      { learnerProduces: "When you arrive Hanoi?", targetForm: "When did you arrive in Hanoi?", whyViL1: "Question + past + preposition all collapse." },
      { learnerProduces: "Last year I learn English at evening class.", targetForm: "Last year I learned English in an evening class." },
      { learnerProduces: "He just finish his homework.", targetForm: "He has just finished his homework.", whyViL1: "`vừa làm xong` — both EN forms acceptable, learner produces neither." },
    ],
  },
  {
    id: "plural_s_omission",
    descriptionEn:
      "Count nouns stay singular after numerals, quantifiers, and in general plural contexts. Vietnamese marks plurality lexically with những/các/mấy or via numerals + classifiers.",
    descriptionVi:
      "Danh từ đếm được không thêm -s sau số đếm hoặc lượng từ. Tiếng Việt báo số nhiều bằng những/các/mấy hoặc bằng số đếm + loại từ, không qua hậu tố trên danh từ.",
    severity: "medium",
    severityRationale:
      "Frequent and visible, but rarely blocks meaning (the numeral or quantifier already gave the count). Worth correcting in writing; correct gently in speech.",
    ruleTags: ["vi_l1_plural_s"],
    phenomenon: "plural_unmarked",
    examples: [
      { learnerProduces: "I have two sister and one brother.", targetForm: "I have two sisters and one brother.", whyViL1: "`hai chị em` — number in the numeral, not the noun." },
      { learnerProduces: "Many student in my class come from Hue.", targetForm: "Many students in my class come from Hue." },
      { learnerProduces: "I work for five year in this company.", targetForm: "I have worked for five years in this company.", whyViL1: "(also tense — see family 2)" },
      { learnerProduces: "There are a lot of car on the road today.", targetForm: "There are a lot of cars on the road today." },
      { learnerProduces: "I bought three book at the bookstore.", targetForm: "I bought three books at the bookstore." },
      { learnerProduces: "All my friend like this restaurant.", targetForm: "All my friends like this restaurant." },
      { learnerProduces: "She has many friend from work.", targetForm: "She has many friends from work." },
      { learnerProduces: "I take English class every Tuesday.", targetForm: "I take an English class every Tuesday.", whyViL1: "Article + count both unsettled." },
      { learnerProduces: "Last weekend we visit three city.", targetForm: "Last weekend we visited three cities." },
      { learnerProduces: "My company has many office around Asia.", targetForm: "My company has many offices around Asia." },
      { learnerProduces: "Both of my parent are teachers.", targetForm: "Both of my parents are teachers." },
    ],
  },
  {
    id: "third_person_s_omission",
    descriptionEn:
      "Third-person singular present -s is dropped: she go, my brother have, it cost. Vietnamese verbs do not change for person or number.",
    descriptionVi:
      "Thiếu -s của động từ ở ngôi thứ ba số ít. Động từ tiếng Việt không đổi theo ngôi hay số.",
    severity: "high",
    severityRationale: "Persistent even in advanced learners; the existing detector already ships vi_l1_3rd_person_s + vi_l1_do_support_3ps.",
    ruleTags: ["vi_l1_3rd_person_s", "vi_l1_do_support_3ps"],
    phenomenon: "agreement_3sg",
    examples: [
      { learnerProduces: "She go to work by motorbike.", targetForm: "She goes to work by motorbike.", whyViL1: "`cô ấy đi làm` — no person agreement." },
      { learnerProduces: "My brother have a new job in Saigon.", targetForm: "My brother has a new job in Saigon." },
      { learnerProduces: "It depend on the weather.", targetForm: "It depends on the weather." },
      { learnerProduces: "He live in Ha Noi with his family.", targetForm: "He lives in Hanoi with his family." },
      { learnerProduces: "My mother cook very well.", targetForm: "My mother cooks very well." },
      { learnerProduces: "This bus stop in front of my house.", targetForm: "This bus stops in front of my house." },
      { learnerProduces: "She speak three language.", targetForm: "She speaks three languages.", whyViL1: "(also plural)" },
      { learnerProduces: "The teacher always give us homework.", targetForm: "The teacher always gives us homework." },
      { learnerProduces: "My friend work at a hotel near the lake.", targetForm: "My friend works at a hotel near the lake." },
      { learnerProduces: "He don't like spicy food.", targetForm: "He doesn't like spicy food.", whyViL1: "`does` carries the `-s`; `don't` is the L1-default negation." },
      { learnerProduces: "It cost about fifty thousand dong.", targetForm: "It costs about fifty thousand dong." },
      { learnerProduces: "She want to learn Korean next year.", targetForm: "She wants to learn Korean next year." },
      { learnerProduces: "He always tell me funny stories.", targetForm: "He always tells me funny stories." },
    ],
  },
  {
    id: "copula_be_deletion",
    descriptionEn:
      "be (is/am/are/was/were) is omitted before adjectives, nouns, or locations. Vietnamese adjectival predicates don't need a copula.",
    descriptionVi:
      "Bỏ động từ to be trước tính từ, danh từ, hoặc địa điểm. Câu vị ngữ tính từ tiếng Việt không cần to be.",
    severity: "high",
    severityRationale: "Sounds visibly broken even to a sympathetic listener and breaks the A1-A2 'I am from X / I am a Y' contract.",
    ruleTags: ["vi_l1_missing_be"],
    phenomenon: "copula_omission",
    examples: [
      { learnerProduces: "She very kind.", targetForm: "She is very kind.", whyViL1: "`cô ấy rất tốt` — adjective predicate, no copula." },
      { learnerProduces: "He doctor.", targetForm: "He is a doctor.", whyViL1: "(also article)" },
      { learnerProduces: "My house near the market.", targetForm: "My house is near the market.", whyViL1: "`nhà tôi gần chợ` — locative predicate, no copula." },
      { learnerProduces: "I very tired today.", targetForm: "I am very tired today." },
      { learnerProduces: "The weather very hot in summer.", targetForm: "The weather is very hot in summer." },
      { learnerProduces: "My brother an engineer at FPT.", targetForm: "My brother is an engineer at FPT." },
      { learnerProduces: "Today Monday.", targetForm: "Today is Monday.", whyViL1: "`hôm nay thứ Hai` — bare predicate." },
      { learnerProduces: "My favorite food pho.", targetForm: "My favourite food is pho." },
      { learnerProduces: "The children very hungry now.", targetForm: "The children are very hungry now.", whyViL1: "Plural agreement also drops with `be`." },
      { learnerProduces: "He is doctor and his wife is nurse.", targetForm: "He is a doctor and his wife is a nurse.", whyViL1: "Copula present, article missing (the inverse failure)." },
      { learnerProduces: "My English not good yet.", targetForm: "My English is not good yet." },
      { learnerProduces: "She a student at Hanoi University.", targetForm: "She is a student at Hanoi University." },
      { learnerProduces: "I am agree with you.", targetForm: "I agree with you.", whyViL1: "Over-correction: `be` inserted before a verb that needs no copula." },
      { learnerProduces: "I am think this idea is good.", targetForm: "I think this idea is good.", whyViL1: "Same over-correction with stative `think`." },
    ],
  },
  {
    id: "question_inversion_omission",
    descriptionEn:
      "Yes/no and wh-questions keep declarative order with rising intonation or sentence-final particles calqued into English. English requires auxiliary inversion or do-support.",
    descriptionVi:
      "Câu hỏi giữ trật tự câu khẳng định. Tiếng Việt dùng tiểu từ ...không? hoặc có...không và giữ từ để hỏi tại vị trí thông tin.",
    severity: "high",
    severityRationale: "Breaks the most basic interactional pattern at A1-B1.",
    ruleTags: ["vi_l1_question_no_aux", "vi_l1_embedded_question_order"],
    phenomenon: "question_no_inversion",
    examples: [
      { learnerProduces: "You like coffee?", targetForm: "Do you like coffee?", whyViL1: "`bạn thích cà phê không?` — particle at end, no aux." },
      { learnerProduces: "You where go?", targetForm: "Where are you going?", whyViL1: "Wh-in-situ; aux missing." },
      { learnerProduces: "She can speak English?", targetForm: "Can she speak English?", whyViL1: "Aux exists, just isn't fronted." },
      { learnerProduces: "Why you don't come yesterday?", targetForm: "Why didn't you come yesterday?", whyViL1: "(also tense + neg placement)" },
      { learnerProduces: "What time you finish work?", targetForm: "What time do you finish work?" },
      { learnerProduces: "How much this cost?", targetForm: "How much does this cost?" },
      { learnerProduces: "Where you live now?", targetForm: "Where do you live now?" },
      { learnerProduces: "Your mother she works in Hanoi?", targetForm: "Does your mother work in Hanoi?", whyViL1: "Subject doubling — VI topic-comment carryover." },
      { learnerProduces: "You have brother and sister?", targetForm: "Do you have any brothers or sisters?" },
      { learnerProduces: "When you start learn English?", targetForm: "When did you start learning English?", whyViL1: "(also tense + infinitive)" },
      { learnerProduces: "He is a doctor, right?", targetForm: "He is a doctor, isn't he?", whyViL1: "`phải không?` calques to `right?`." },
      { learnerProduces: "What you do for living?", targetForm: "What do you do for a living?" },
      { learnerProduces: "Why she look sad today?", targetForm: "Why does she look sad today?" },
    ],
  },
  {
    id: "preposition_selection_transfer",
    descriptionEn:
      "Wrong preposition for time, place, and verb-frame: in Monday, depend in, discuss about, married with. Vietnamese relational words don't map one-to-one to English prepositions.",
    descriptionVi:
      "Chọn sai giới từ chỉ thời gian, nơi chốn, hoặc trong khung động từ. Các từ chỉ quan hệ tiếng Việt không tương ứng 1-1 với giới từ tiếng Anh.",
    severity: "medium",
    severityRationale: "Medium for in/on/at; low for verb-frame choices. IELTS-prep level raises the bar — prepositions are weighted in writing scores.",
    ruleTags: ["vi_l1_preposition_transfer", "vi_l1_time_expressions", "vi_l1_by_vs_with"],
    phenomenon: "preposition_transfer",
    examples: [
      { learnerProduces: "I will see you in Monday.", targetForm: "I will see you on Monday.", whyViL1: "`vào thứ Hai` — `vào` is the same word for at/in/on." },
      { learnerProduces: "At the morning I drink coffee.", targetForm: "In the morning I drink coffee." },
      { learnerProduces: "I was born on 1995.", targetForm: "I was born in 1995." },
      { learnerProduces: "She lives in 12 Ly Thuong Kiet street.", targetForm: "She lives at 12 Ly Thuong Kiet Street.", whyViL1: "Street addresses take `at`, not `in`." },
      { learnerProduces: "It depends in the weather.", targetForm: "It depends on the weather.", whyViL1: "`phụ thuộc vào` — `vào` calques to `in`." },
      { learnerProduces: "We discussed about the new project.", targetForm: "We discussed the new project.", whyViL1: "`thảo luận về` calques; EN `discuss` is transitive." },
      { learnerProduces: "I listen music every night.", targetForm: "I listen to music every night.", whyViL1: "`nghe nhạc` — bare verb in VI." },
      { learnerProduces: "She married with a Korean man.", targetForm: "She married a Korean man.", whyViL1: "`kết hôn với` — `với` calques to `with`." },
      { learnerProduces: "I am interested on history.", targetForm: "I am interested in history." },
      { learnerProduces: "He is good in mathematics.", targetForm: "He is good at mathematics." },
      { learnerProduces: "I waited the bus for thirty minutes.", targetForm: "I waited for the bus for thirty minutes.", whyViL1: "`đợi xe buýt` — VI verb is transitive, EN needs `for`." },
      { learnerProduces: "She is angry to me.", targetForm: "She is angry with me." },
      { learnerProduces: "I go to home after work.", targetForm: "I go home after work.", whyViL1: "`về nhà` — `home` is a bare adverb in EN." },
      { learnerProduces: "We arrived to Hanoi at midnight.", targetForm: "We arrived in Hanoi at midnight.", whyViL1: "`arrive in` for cities; `to` is the L1 default." },
      { learnerProduces: "The teacher explained me the lesson.", targetForm: "The teacher explained the lesson to me.", whyViL1: "`giải thích cho tôi` — VI takes the indirect object directly." },
    ],
  },
  {
    id: "pronoun_gender_confusion",
    descriptionEn:
      "He and she are swapped when referring to the same person. Vietnamese third-person pronouns encode age, kinship, and social distance — but not gender as a separate axis.",
    descriptionVi:
      "Lẫn he/she khi nói về cùng một người. Đại từ ngôi thứ ba tiếng Việt mã hóa tuổi, vai vế, mức tôn trọng — không tách giới tính thành trục riêng.",
    severity: "medium",
    severityRationale: "Listeners catch the gender swap easily and re-map. Sounds like a slip rather than a structural fault, but persists into advanced levels.",
    ruleTags: ["vi_l1_possessive_gender"],
    phenomenon: "pronoun_gender_drift",
    examples: [
      { learnerProduces: "My mother is a teacher. He works at a primary school.", targetForm: "My mother is a teacher. She works at a primary school.", whyViL1: "`mẹ tôi` → reflexively `he` because `he` was the last 3sg learned." },
      { learnerProduces: "My older brother is married. She has two children.", targetForm: "My older brother is married. He has two children." },
      { learnerProduces: "My grandfather lives in Hue. She is eighty years old.", targetForm: "My grandfather lives in Hue. He is eighty years old." },
      { learnerProduces: "I have a younger sister. He is in high school.", targetForm: "I have a younger sister. She is in high school." },
      { learnerProduces: "My friend Linh is a doctor. He works at Bach Mai hospital.", targetForm: "My friend Linh is a doctor. She works at Bach Mai hospital.", whyViL1: "Linh is a female name; learner defaults to `he` for `friend`." },
      { learnerProduces: "Mr Nguyen is my teacher. She teaches English.", targetForm: "Mr Nguyen is my teacher. He teaches English." },
      { learnerProduces: "My wife is from Da Nang. He likes the beach.", targetForm: "My wife is from Da Nang. She likes the beach." },
      { learnerProduces: "Her brother told me that she will visit Hanoi.", targetForm: "Her brother told me that he will visit Hanoi.", whyViL1: "Pronoun jumps gender mid-sentence — referent tracking is unstable." },
      { learnerProduces: "My boss is very kind. He always smiles.", targetForm: "My boss is very kind. She always smiles.", whyViL1: "(when boss is female)" },
      { learnerProduces: "I called my dad. She said she will pick me up.", targetForm: "I called my dad. He said he will pick me up.", whyViL1: "Compounding error — gender flips mid-clause." },
    ],
  },
  {
    id: "count_noncount_confusion",
    descriptionEn:
      "Mass nouns get treated as count nouns: informations, advices, furnitures, homeworks. Vietnamese doesn't grammatically distinguish count from non-count.",
    descriptionVi:
      "Coi danh từ không đếm được như đếm được. Tiếng Việt không phân biệt đếm được / không đếm được về ngữ pháp.",
    severity: "low",
    severityRationale: "Low for spoken (intelligible, common ESL pattern). Medium for IELTS/TOEIC writing where each instance is a marked error.",
    ruleTags: ["vi_l1_countable", "vi_l1_countable_much", "vi_l1_many_with_uncount"],
    phenomenon: "mass_count_drift",
    examples: [
      { learnerProduces: "I need some informations about the visa.", targetForm: "I need some information about the visa." },
      { learnerProduces: "Thank you for your advices.", targetForm: "Thank you for your advice." },
      { learnerProduces: "We bought new furnitures for the office.", targetForm: "We bought new furniture for the office." },
      { learnerProduces: "He gave me a good advice.", targetForm: "He gave me a good piece of advice." },
      { learnerProduces: "I have a lot of homeworks tonight.", targetForm: "I have a lot of homework tonight." },
      { learnerProduces: "The hotel has many equipments for guests.", targetForm: "The hotel has a lot of equipment for guests." },
      { learnerProduces: "My boss gave me three feedbacks.", targetForm: "My boss gave me three pieces of feedback." },
      { learnerProduces: "I learned many new vocabularies today.", targetForm: "I learned a lot of new vocabulary today." },
      { learnerProduces: "She has many beautiful jewelleries.", targetForm: "She has a lot of beautiful jewellery." },
      { learnerProduces: "I want to give him an useful advice.", targetForm: "I want to give him useful advice." },
      { learnerProduces: "The traffic in Saigon are very bad.", targetForm: "The traffic in Saigon is very bad." },
      { learnerProduces: "I bought two breads at the bakery.", targetForm: "I bought two loaves of bread at the bakery." },
    ],
  },
  {
    id: "noun_phrase_word_order",
    descriptionEn:
      "Adjectives placed after the noun (a house big) or possession with of instead of 's (the book of me). Vietnamese is noun-first, modifier-after.",
    descriptionVi:
      "Đặt tính từ sau danh từ hoặc dùng of thay cho 's. Tiếng Việt là danh từ đứng trước, tính từ đứng sau.",
    severity: "high",
    severityRationale: "High for adjective-after-noun (sounds visibly broken). Low for `of`-possession (grammatical but unnatural).",
    ruleTags: ["vi_l1_adjective_order", "vi_l1_possessive_s_missing"],
    phenomenon: "np_word_order",
    examples: [
      { learnerProduces: "I live in a house big near the market.", targetForm: "I live in a big house near the market.", whyViL1: "`nhà to` — adjective postnominal." },
      { learnerProduces: "She has hair long and beautiful.", targetForm: "She has long, beautiful hair." },
      { learnerProduces: "He gave me a gift very special.", targetForm: "He gave me a very special gift." },
      { learnerProduces: "The book of me is on the table.", targetForm: "My book is on the table.", whyViL1: "`sách của tôi` calqued literally." },
      { learnerProduces: "The car of my brother is new.", targetForm: "My brother's car is new." },
      { learnerProduces: "The phone of her mother broke yesterday.", targetForm: "Her mother's phone broke yesterday." },
      { learnerProduces: "I want to buy a shirt blue and a hat red.", targetForm: "I want to buy a blue shirt and a red hat." },
      { learnerProduces: "She is a girl smart and kind.", targetForm: "She is a smart and kind girl." },
      { learnerProduces: "He bought a motorbike Japanese second-hand.", targetForm: "He bought a second-hand Japanese motorbike.", whyViL1: "Multiple postnominal adjectives stack in VI order." },
      { learnerProduces: "The husband of my sister is a teacher.", targetForm: "My sister's husband is a teacher." },
    ],
  },
  {
    id: "final_cluster_spelling_loss",
    descriptionEn:
      "Bare stems written where English requires past-tense, plural, or possessive suffix. The morpheme is gone from the learner's mental representation, not just their pronunciation.",
    descriptionVi:
      "Học viên viết theo cách họ phát âm — bỏ luôn -ed, -s, -'s khỏi chữ viết. Nguyên nhân gần là ngữ âm, hậu quả là ngữ pháp.",
    severity: "high",
    severityRationale: "High in writing (the morpheme is the grammatical signal itself); medium in speech (overlaps phoneme map).",
    ruleTags: ["vi_l1_past_ed", "vi_l1_plural_s", "vi_l1_possessive_s_missing"],
    phenomenon: "final_s_inaudible",
    examples: [
      { learnerProduces: "I walk to school yesterday.", targetForm: "I walked to school yesterday.", whyViL1: "`-ed` inaudible in own speech → omitted in writing." },
      { learnerProduces: "She ask me about my family last night.", targetForm: "She asked me about my family last night." },
      { learnerProduces: "I work at this company since 2019.", targetForm: "I have worked at this company since 2019.", whyViL1: "(also perfect — see family 2)" },
      { learnerProduces: "He live in Hanoi five year ago.", targetForm: "He lived in Hanoi five years ago.", whyViL1: "Multiple suffixes lost: `-d`, `-s`." },
      { learnerProduces: "We watch the football match last night.", targetForm: "We watched the football match last night." },
      { learnerProduces: "I miss the bus this morning.", targetForm: "I missed the bus this morning." },
      { learnerProduces: "She finish her work at 6 pm.", targetForm: "She finished her work at 6 pm." },
      { learnerProduces: "My friend car is parking outside.", targetForm: "My friend's car is parked outside.", whyViL1: "Possessive `-'s` and passive `-ed` both lost." },
      { learnerProduces: "The student name is Hoa.", targetForm: "The student's name is Hoa." },
      { learnerProduces: "I ate three cake at the birthday party.", targetForm: "I ate three cakes at the birthday party." },
      { learnerProduces: "He pass the IELTS test with 7.0.", targetForm: "He passed the IELTS test with 7.0." },
      { learnerProduces: "The room book by my company.", targetForm: "The room is booked by my company.", whyViL1: "Copula + `-ed` both missing." },
    ],
  },
  {
    id: "topic_comment_fronting",
    descriptionEn:
      "Topic fronted with a comma, then restated with a resumptive pronoun: My family, they live in Hue. Vietnamese is topic-prominent — fronted topic + comment-clause is the unmarked structure.",
    descriptionVi:
      "Đặt chủ đề ở đầu câu kèm dấu phẩy rồi nhắc lại trong câu bằng đại từ. Tiếng Việt thuộc loại chủ đề-bình luận.",
    severity: "medium",
    severityRationale: "Parseable but consistently odd to EN listeners. Costs IELTS speaking band; survives in conversation.",
    phenomenon: "topic_comment_fronting",
    examples: [
      { learnerProduces: "My family, they live in Hue.", targetForm: "My family lives in Hue.", whyViL1: "`gia đình tôi, họ sống ở Huế` — natural VI." },
      { learnerProduces: "This job, I don't like it.", targetForm: "I don't like this job." },
      { learnerProduces: "Vietnamese food, it is very delicious.", targetForm: "Vietnamese food is very delicious." },
      { learnerProduces: "About English, I study every day.", targetForm: "I study English every day." },
      { learnerProduces: "My older brother, he works in Singapore now.", targetForm: "My older brother works in Singapore now." },
      { learnerProduces: "Coffee, I drink three cups every morning.", targetForm: "I drink three cups of coffee every morning." },
      { learnerProduces: "The weather in Hanoi, it changes very fast.", targetForm: "The weather in Hanoi changes very fast." },
      { learnerProduces: "That movie, I watched it last week.", targetForm: "I watched that movie last week." },
      { learnerProduces: "My English teacher, she is very kind.", targetForm: "My English teacher is very kind." },
      { learnerProduces: "This restaurant, the food here is good.", targetForm: "The food here is good.", whyViL1: "Topic + locative resumptive `here` is the giveaway." },
      { learnerProduces: "My parents, they don't know I am here.", targetForm: "My parents don't know I am here." },
    ],
  },
  {
    id: "co_transfer_overgeneralisation",
    descriptionEn:
      "Vietnamese có covers existence, possession, availability, and occurrence; learners default to one English equivalent (usually have). Result: In my house has three bedrooms, There has many people.",
    descriptionVi:
      "Học viên dịch nguyên có thành have, vì có tiếng Việt bao trùm cả tồn tại, sở hữu, sẵn có, và xảy ra.",
    severity: "medium",
    severityRationale: "Causes characteristic 'Vietnamese English' sentences that natives can decode but find awkward.",
    ruleTags: ["vi_l1_there_are_singular"],
    phenomenon: "co_overmapping",
    examples: [
      { learnerProduces: "In my house has three bedrooms.", targetForm: "There are three bedrooms in my house.", whyViL1: "`trong nhà tôi có ba phòng ngủ` calqued." },
      { learnerProduces: "There has many people in the market.", targetForm: "There are many people in the market." },
      { learnerProduces: "My city has very beautiful.", targetForm: "My city is very beautiful.", whyViL1: "`thành phố tôi rất đẹp` — `có` slot doesn't exist; learner inserts `has`." },
      { learnerProduces: "In my class has thirty students.", targetForm: "There are thirty students in my class." },
      { learnerProduces: "Yesterday has a big rain.", targetForm: "Yesterday there was heavy rain." },
      { learnerProduces: "In Hanoi has many lakes.", targetForm: "There are many lakes in Hanoi." },
      { learnerProduces: "My company has free coffee every morning.", targetForm: "My company offers free coffee every morning." },
      { learnerProduces: "In summer has a lot of fruit.", targetForm: "There is a lot of fruit in summer." },
      { learnerProduces: "On the table have a book and two pen.", targetForm: "There are a book and two pens on the table." },
      { learnerProduces: "Tonight has a party at my friend house.", targetForm: "There is a party at my friend's house tonight." },
      { learnerProduces: "In this hotel have a swimming pool.", targetForm: "This hotel has a swimming pool." },
      { learnerProduces: "In my country has four seasons.", targetForm: "My country has four seasons." },
    ],
  },
  {
    id: "modal_verb_inflection",
    descriptionEn:
      "Learners apply -s to modals (he cans, she shoulds) or insert to after them (must to leave). Vietnamese modal-like words take a bare verb after them.",
    descriptionVi:
      "Học viên thêm -s vào modal hoặc chèn to sau modal. Từ tình thái tiếng Việt đi với động từ nguyên thể không có dấu hiệu nào.",
    severity: "high",
    severityRationale: "High at A1-A2 (core modals); medium at B1+ (cans/shoulds self-correct but must-to persists).",
    ruleTags: ["vi_l1_can_no_infinitive", "vi_l1_make_let_bare"],
    phenomenon: "modal_inflection_error",
    examples: [
      { learnerProduces: "He cans speak three languages.", targetForm: "He can speak three languages.", whyViL1: "`-s` over-applied; modal is invariant in EN." },
      { learnerProduces: "She shoulds study harder.", targetForm: "She should study harder." },
      { learnerProduces: "I must to leave at 6 pm.", targetForm: "I must leave at 6 pm.", whyViL1: "`phải đi` — no marker; learner inserts `to`." },
      { learnerProduces: "We can to go to the beach tomorrow.", targetForm: "We can go to the beach tomorrow." },
      { learnerProduces: "You should to drink more water.", targetForm: "You should drink more water." },
      { learnerProduces: "She doesn't can swim.", targetForm: "She can't swim.", whyViL1: "Auxiliary doubling — `does` plus `can`." },
      { learnerProduces: "He don't can come tonight.", targetForm: "He can't come tonight." },
      { learnerProduces: "I will can speak English well next year.", targetForm: "I will be able to speak English well next year.", whyViL1: "Two modals stacked." },
      { learnerProduces: "She musts work this weekend.", targetForm: "She must work this weekend." },
      { learnerProduces: "Mays I borrow your pen?", targetForm: "May I borrow your pen?" },
      { learnerProduces: "I can to help you with that.", targetForm: "I can help you with that." },
      { learnerProduces: "He needs to studies more.", targetForm: "He needs to study more.", whyViL1: "`to` + `-s` — infinitive form rule lost." },
    ],
  },
  {
    id: "negation_no_not_placement",
    descriptionEn:
      "Vietnamese không is placed directly before the verb and doesn't require any dummy auxiliary. Learners calque: I no want coffee, He not come yesterday.",
    descriptionVi:
      "Tiếng Việt dùng không đứng ngay trước động từ hoặc vị ngữ, không cần trợ động từ giả.",
    severity: "high",
    severityRationale: "High at A1-A2. Breaks the core present/past negation contract.",
    ruleTags: ["vi_l1_double_negative", "vi_l1_double_past"],
    phenomenon: "negation_no_aux",
    examples: [
      { learnerProduces: "I no want coffee.", targetForm: "I don't want coffee.", whyViL1: "`tôi không muốn cà phê` — `không` before verb." },
      { learnerProduces: "He not come yesterday.", targetForm: "He didn't come yesterday." },
      { learnerProduces: "I don't can swim.", targetForm: "I can't swim.", whyViL1: "Auxiliary doubling — `don't` + modal." },
      { learnerProduces: "She no like spicy food.", targetForm: "She doesn't like spicy food." },
      { learnerProduces: "We not have time today.", targetForm: "We don't have time today." },
      { learnerProduces: "He not went to school yesterday.", targetForm: "He didn't go to school yesterday.", whyViL1: "Negation correct slot, but tense double-marked." },
      { learnerProduces: "I no understand.", targetForm: "I don't understand." },
      { learnerProduces: "She doesn't has a car.", targetForm: "She doesn't have a car.", whyViL1: "`does` carries the `-s`; learner doubles it onto `has`." },
      { learnerProduces: "They no want to come.", targetForm: "They don't want to come." },
      { learnerProduces: "It not is true.", targetForm: "It is not true.", whyViL1: "Negation slot before copula instead of after." },
      { learnerProduces: "He didn't came home last night.", targetForm: "He didn't come home last night.", whyViL1: "`did` carries tense; learner double-marks past on the verb." },
    ],
  },
];

// Build the canonical tag set from the detector pack. Verified at module
// load (const assertion, not per-call) per dispatch hard-rule.
const VALID_RULE_TAGS: ReadonlySet<string> = (() => {
  const tags = new Set<string>();
  for (const e of VN_RULE_PACK.explanations) tags.add(e.tag);
  return tags;
})();

const _verifyGrammarRuleTagsAtLoad = (() => {
  const unknown: string[] = [];
  for (const fam of grammarFamilies) {
    for (const t of fam.ruleTags ?? []) {
      if (!VALID_RULE_TAGS.has(t)) unknown.push(`${fam.id}:${t}`);
    }
  }
  if (unknown.length > 0) {
    throw new Error(
      `vi.ts: grammar family ruleTags reference unknown detector tags: ${unknown.join(", ")}`,
    );
  }
  return true;
})();

// ──────────────────────────────────────────────────────────────────────────
// Writing patterns — C2 vi-writing.md (12 patterns, snake_case IDs, severity
// from author's tier line, needsReview preserved for 10 of 12).
// ──────────────────────────────────────────────────────────────────────────

const writingPatterns: WritingPattern[] = [
  {
    id: "vi_write_register",
    category: "register",
    name: { en: "Register / formality mismatch", vi: "Sai mức lịch sự / thể loại" },
    description: {
      en: "Vietnamese honorifics, kinship terms, and politeness particles encode register at the pronoun level. English encodes register at the genre + verb-choice + greeting level. Vietnamese learners either overshoot (Respected Sir, kindly do the needful) or undershoot (Hi teacher, send me the slides) — often inside the same email.",
      vi: "Tiếng Việt mã hoá mức lịch sự ở đại từ xưng hô (em / anh / chị / thầy / cô). Tiếng Anh mã hoá ở thể loại văn bản + chọn động từ + chào hỏi. Người Việt hay vượt mức hoặc xuống quá mức — và rất hay làm cả hai trong cùng một email.",
    },
    nativeRoot:
      "Tiếng Việt mã hoá mức lịch sự ở đại từ xưng hô. Tiếng Anh mã hoá ở thể loại văn bản + chọn động từ + chào hỏi. Người học dịch khung lịch sự VN sang khung sai trong tiếng Anh.",
    cefr: ["B1", "B2", "C1", "C2"],
    severity: "high",
    genres: ["email", "job_application", "university_email", "ielts_gt_letter"],
    remediation: "Teach the genre-first decomposition: who is the reader, what's the genre, then pick the EN salutation/sign-off conventions for that pair before translating any content.",
    examples: [
      { incorrect: "Dear Sir/Madam, I am Nguyen Van A, age 25, working at ABC company. I hope you are healthy. I am writing to apply for the job.", corrected: "Dear Hiring Manager, I'm applying for the Marketing Coordinator role. I have five years of experience at ABC and would bring…", nativeGloss: "VN business letters open with full self-ID + health check; translates literally" },
      { incorrect: "Respected Professor Smith, Kindly please grant me the permission to submit assignment late.", corrected: "Dear Professor Smith, I'm writing to ask for a two-day extension on the assignment because…", nativeGloss: "Kính gửi + kính mong stacked via Indian-English business templates" },
      { incorrect: "Hi teacher, gimme the slides pls, thanks teacher", corrected: "Hi Linh, could you send the slides from yesterday? Thanks!", nativeGloss: "thầy ơi kinship-term carryover + casual EN without genre awareness" },
      { incorrect: "Dear teacher Tran", corrected: "Dear Ms Tran", nativeGloss: "thầy Trân / cô Trân template; EN doesn't stack title + given + surname" },
      { incorrect: "I hope this email find you well. I am writing this letter to inform you that I would like to ask about the schedule.", corrected: "Hi Mai, quick question about Thursday's schedule —", nativeGloss: "Overshoot from formal-email templates; loses the question itself" },
      { incorrect: "Thank you teacher for read my essay. I am very appreciate.", corrected: "Thank you for reading my essay — I really appreciate it.", nativeGloss: "Cảm ơn thầy đã đọc bài em literal; appreciate treated as adjective" },
      { incorrect: "Sir, I want one coffee.", corrected: "Hi! One coffee, please — small, oat milk.", nativeGloss: "Anh ơi, cho em một ly cà phê translated with the formal pronoun by default", context: "barista app chat" },
      { incorrect: "Dear all members of the committee, I have the honour to present myself…", corrected: "Hi Linh, hope you're well —", nativeGloss: "Genre-recognition failure: GT informal letter treated as application letter", context: "IELTS GT casual letter" },
      { incorrect: "Looking forward your reply soonest.", corrected: "Looking forward to hearing from you.", nativeGloss: "Calque of mong sớm nhận được hồi âm; soonest lifted from Indian-English biz template" },
      { incorrect: "I hope you can understand my situation and sympathy with me.", corrected: "I'd really appreciate your understanding.", nativeGloss: "thông cảm → sympathy; over-explicit emotional request VN considers polite, EN reads as pressure" },
      { incorrect: "Greetings of the day to you, Sir.", corrected: "(no opening salutation in an essay)", nativeGloss: "Letter-template muscle memory overflowing into essay genre", context: "TOEFL essay opening" },
      { incorrect: "Hello professor I have one question. The exam is on Friday. The room is changed. Where is the new room.", corrected: "Hi Professor Lee — quick question: where is Friday's exam being held?", nativeGloss: "No email shape (subject line missing, no closing, four short bullets read like status update)" },
      { incorrect: "Best regards forever, your student Chau", corrected: "Best regards,", nativeGloss: "Trân trọng đời đời doesn't exist in EN sign-offs; loanword decoration" },
    ],
  },
  {
    id: "vi_write_cohesion_parataxis",
    category: "cohesion",
    name: { en: "Paragraph cohesion — parataxis vs explicit connectives", vi: "Liên kết đoạn — ghép câu kề nhau thay vì dùng từ nối" },
    description: {
      en: "Vietnamese narrative tolerates parataxis — clauses stacked side by side, logical relations inferred. English expository prose expects explicit connectives (however, therefore, in addition, as a result). A Vietlish paragraph reads as a list of facts; an English-flavoured paragraph reads as an argument moving forward.",
      vi: "Văn tiếng Việt cho phép ghép câu kề nhau — người đọc tự suy ra mối quan hệ. Văn nghị luận tiếng Anh đòi từ nối tường minh. Đoạn văn Vietlish nghe như một danh sách sự kiện; đoạn văn tiếng Anh tốt là một lập luận dịch chuyển về phía trước.",
    },
    nativeRoot:
      "Văn tiếng Việt cho phép ghép câu kề nhau — người đọc tự suy ra mối quan hệ logic. Văn nghị luận tiếng Anh đòi từ nối tường minh.",
    cefr: ["B1", "B2", "C1"],
    severity: "high",
    genres: ["ielts_task_2", "toefl_essay", "academic_essay"],
    remediation: "Train the explicit-connective set (however/therefore/in addition/as a result/by contrast/for instance) as paragraph-level moves; rewrite VN-style paragraph drafts inserting one connective per sentence boundary.",
    needsReview: true,
    examples: [
      { incorrect: "I went to school. The weather was nice. I met my friend. We talked about the exam. The exam was difficult.", corrected: "On the way to school, the weather was so nice that I lingered. I ran into a friend; we ended up talking about how difficult the exam had been.", nativeGloss: "VN narrative chains scenes by time-order — relations are implicit" },
      { incorrect: "Vietnam has many problems. Pollution is serious. Traffic is bad. Education is expensive.", corrected: "Vietnam faces several intertwined problems: pollution and traffic strain the cities, while the cost of education strains the household.", nativeGloss: "VN topic-sentence + listing pattern translated 1:1; English expects subordination" },
      { incorrect: "I want to study abroad. My parents do not have much money. I am working part-time.", corrected: "I want to study abroad, but my parents can't fully fund it, so I'm working part-time.", nativeGloss: "Causal chain muốn / nhưng / nên flattened to three independent sentences" },
      { incorrect: "Online learning is good. Online learning is bad.", corrected: "Online learning has clear benefits and yet carries equally clear costs.", nativeGloss: "The two-sided essay turn delivered as two unconnected claims" },
      { incorrect: "The economy is growing. Many people are poor.", corrected: "Despite sustained economic growth, large numbers of Vietnamese remain poor.", nativeGloss: "Concessive relationship mặc dù lost when split into two sentences" },
      { incorrect: "Firstly, I will discuss pollution. Secondly, I will discuss traffic. Thirdly, I will discuss education. Finally, I will conclude.", corrected: "Pollution and traffic both follow from the same source — uncontrolled urban growth — and education will, too, unless…", nativeGloss: "Mechanical firstly/secondly scaffolding from VN IELTS prep; English C1 readers find it juvenile" },
      { incorrect: "He studies hard. He gets good grade.", corrected: "He studies hard, so he gets good grades.", nativeGloss: "Result/consequence nên dropped because VN allows it to be inferred" },
      { incorrect: "The film was long. I enjoyed it.", corrected: "The film was long, but I enjoyed it.", nativeGloss: "Concessive tuy / nhưng dropped" },
      { incorrect: "Many students learn English. Few become fluent.", corrected: "Many students learn English; few, however, become fluent.", nativeGloss: "Contrastive relationship dropped; the however is doing the argumentative work" },
      { incorrect: "She is intelligent. She is kind. She is hardworking. She is my best friend.", corrected: "Intelligent, kind, and hardworking — she's my best friend.", nativeGloss: "Four predicate-only clauses; VN often lists attributes in parallel with no joiner" },
      { incorrect: "The temperature was 39 degrees. I could not sleep.", corrected: "The temperature hit 39 degrees, so sleep was impossible.", nativeGloss: "Vì… nên pattern; learners drop the nên when translating" },
      { incorrect: "I tried three times. I failed three times. I want to try again.", corrected: "I tried three times and failed each time, and yet I want to try again.", nativeGloss: "Persistence-after-failure relationship vẫn / vẫn còn not translated" },
      { incorrect: "Vietnamese food is famous. Pho is the most famous dish. Pho is made of beef and noodles. Foreigners like pho.", corrected: "Vietnamese food is internationally famous, and the dish that travels best is pho — a beef-and-noodle soup foreigners take to immediately.", nativeGloss: "Four atomic facts; the argument is implicit in VN, must be explicit in EN" },
      { incorrect: "I read the book. The book was interesting. The author is famous.", corrected: "I read the book — it was interesting, and the author is famous.", nativeGloss: "Same noun book repeated where it + connective would carry the thought" },
      { incorrect: "I disagree with him. His argument has logic. The conclusion is wrong.", corrected: "I disagree with him: his argument is internally logical, but the conclusion is wrong.", nativeGloss: "Concession-then-rebuttal pattern; VN learners deliver as flat list" },
    ],
  },
  {
    id: "vi_write_sentence_boundary",
    category: "paragraph-shape",
    name: { en: "Sentence-boundary errors — comma splices, run-ons, fragments", vi: "Ranh giới câu — dấu phẩy nối câu, câu chạy dài, câu cụt" },
    description: {
      en: "Comma splices, run-ons, fragments. Vietnamese punctuation is historically looser around the period/comma boundary — VN can chain clauses with commas where English requires a period or semicolon. VN also tolerates fragments as standalone sentences in narrative; English written prose wants a finite verb.",
      vi: "Tiếng Việt cho phép nối các mệnh đề bằng dấu phẩy thoải mái hơn tiếng Anh. Tiếng Việt cũng chấp nhận câu không có động từ trong văn kể.",
    },
    nativeRoot:
      "Dấu chấm câu tiếng Việt linh hoạt; người học viết tiếng Anh dễ dùng dấu phẩy ở chỗ phải dùng dấu chấm hoặc chấm phẩy.",
    cefr: ["A2", "B1", "B2"],
    severity: "high",
    genres: ["formal_writing", "academic_essay", "email"],
    remediation: "Drill the comma/period/semicolon decision tree on representative VN-learner comma-chains; teach the conjunctive-adverb rule for however/therefore/moreover.",
    examples: [
      { incorrect: "I went home, I was tired, I slept early.", corrected: "I went home. I was tired, so I slept early.", nativeGloss: "Comma-chain — VN narrative comfortable here" },
      { incorrect: "My mother is a teacher, she works in a school in Hanoi, the school is very old.", corrected: "My mother is a teacher. She works in an old school in Hanoi.", nativeGloss: "Three clauses joined with commas — VN descriptive chaining" },
      { incorrect: "Because I was tired.", corrected: "(attach to the previous sentence) …I went to bed early because I was tired.", nativeGloss: "Vì tôi mệt can stand alone as a turn in VN narrative" },
      { incorrect: "She is smart. And hardworking. And kind.", corrected: "She is smart, hardworking, and kind.", nativeGloss: "VN treats Và… / Còn… as legitimate sentence openers in casual writing" },
      { incorrect: "The exam was very difficult, however I passed.", corrected: "The exam was very difficult; however, I passed.", nativeGloss: "However used as a coordinator the way nhưng works" },
      { incorrect: "I love Hanoi, the food is good, the people are friendly, the weather is cool.", corrected: "I love Hanoi: the food is good, the people are friendly, and the weather is cool.", nativeGloss: "Colon + list would render the relationship; commas alone don't" },
      { incorrect: "In conclusion, every people should learn English, it is important for the future.", corrected: "In conclusion, everyone should learn English; it matters for the future.", nativeGloss: "The argumentative connection demands a strong break" },
      { incorrect: "Although the price is high. The quality is good.", corrected: "Although the price is high, the quality is good.", nativeGloss: "Mặc dù giá cao. Chất lượng tốt — VN accepts dependent clause as a one-line topic" },
      { incorrect: "My favorite season. Is autumn.", corrected: "My favorite season is autumn.", nativeGloss: "Subject and predicate split by period — likely line-break-driven (mobile chat habit)" },
      { incorrect: "I want to ask a question, can you help me?", corrected: "I want to ask a question. Can you help me?", nativeGloss: "Declarative + interrogative jammed with a comma" },
      { incorrect: "When I was a child. I lived in Da Nang.", corrected: "When I was a child, I lived in Da Nang.", nativeGloss: "Subordinate-first clause needs a comma, not a period" },
      { incorrect: "The book is on the table the table is in the kitchen.", corrected: "The book is on the table. The table is in the kitchen.", nativeGloss: "Pure run-on, no boundary at all — chat-typing habit" },
      { incorrect: "She said. That she was tired.", corrected: "She said that she was tired.", nativeGloss: "Period inside a single reported clause — line-break artifact" },
      { incorrect: "Lan, who is my best friend, she is from Hue.", corrected: "Lan, who is my best friend, is from Hue.", nativeGloss: "Subject Lan picked up by she after relative clause — comma-chain habit" },
    ],
  },
  {
    id: "vi_write_topic_comment",
    category: "discourse",
    name: { en: "Topic-comment leakage in writing", vi: "Cấu trúc chủ đề-bình luận trong văn viết" },
    description: {
      en: "Vietnamese is a topic-prominent language: a sentence often starts with the topic (As for X…, About X…, This problem,…), then comments on it. English uses topicalization sparingly. In writing, VN learners deliberately reach for topicalizers because they have time to construct the topic-frame consciously.",
      vi: "Tiếng Việt là ngôn ngữ chủ đề, hay mở đầu bằng chủ đề rồi mới nhận xét. Tiếng Anh ít làm vậy trong văn viết. Người học hay chủ động dùng cấu trúc chủ đề khi viết.",
    },
    nativeRoot:
      "Tiếng Việt là ngôn ngữ chủ đề; người học có thời gian xây câu nên cố ý dùng cấu trúc chủ đề trong văn viết.",
    cefr: ["A2", "B1", "B2"],
    severity: "medium",
    genres: ["ielts_task_2", "business_email", "academic_essay"],
    remediation: "Teach the EN SVO-default; reserve topicalization for explicit contrast or genuine framing; rewrite drafts converting topic+resumptive-pronoun back to SVO.",
    needsReview: true,
    examples: [
      { incorrect: "This problem, we need to solve it carefully.", corrected: "We need to solve this problem carefully.", nativeGloss: "Topic Vấn đề này… fronted; English prefers SVO" },
      { incorrect: "About the new policy, many people think it is unfair.", corrected: "Many people think the new policy is unfair.", nativeGloss: "Về chính sách mới… VN topicalizer transferred literally" },
      { incorrect: "Regarding to the meeting, I will not attend.", corrected: "I won't be able to attend the meeting.", nativeGloss: "Double error: regarding to is not English; topicalization unnecessary" },
      { incorrect: "As for me, I prefer coffee.", corrected: "I prefer coffee.", nativeGloss: "Còn tôi, tôi thích cà phê — VN topicalizes against implicit contrast" },
      { incorrect: "Talking about climate change, it is a big problem.", corrected: "Climate change is a big problem.", nativeGloss: "Nói về biến đổi khí hậu calque; topic-frame redundant in EN" },
      { incorrect: "In my opinion, I think education is important.", corrected: "I think education is important.", nativeGloss: "Double opinion marker — Theo tôi, tôi nghĩ normal in VN; EN picks one" },
      { incorrect: "My family, we live in Hue.", corrected: "My family lives in Hue.", nativeGloss: "Already in placement as topic-comment-fronting" },
      { incorrect: "For example the case of Vietnam, the GDP grows fast.", corrected: "Vietnam, for example, has seen fast GDP growth.", nativeGloss: "Example-marker fronted as topic" },
      { incorrect: "Concerning to your question, the answer is yes.", corrected: "To answer your question: yes.", nativeGloss: "Về câu hỏi của bạn + non-existent concerning to" },
      { incorrect: "What I want to say is that English is hard.", corrected: "English is hard.", nativeGloss: "VN topicalizes the speech act itself" },
      { incorrect: "The reason why I love Vietnam, it is because of the food.", corrected: "I love Vietnam because of the food.", nativeGloss: "Pseudo-cleft with resumptive it; doubled topic-frame" },
      { incorrect: "About IELTS Writing Task 2, it is the hardest part of the test.", corrected: "IELTS Writing Task 2 is the hardest part of the test.", nativeGloss: "About…it is — topic + pronoun pickup" },
      { incorrect: "Honestly speaking, I don't agree.", corrected: "Honestly, I don't agree.", nativeGloss: "Nói thật ra — VN softener; doubled marker reads anxious in EN" },
      { incorrect: "Generally speaking, in general, English grammar is difficult.", corrected: "English grammar is difficult.", nativeGloss: "Hedge-stacking from VN-trained IELTS templates" },
    ],
  },
  {
    id: "vi_write_reporting_verbs",
    category: "discourse",
    name: { en: "Reported speech and reporting-verb variety", vi: "Đa dạng động từ tường thuật" },
    description: {
      en: "Vocabulary + genre issue distinct from tense backshift. Vietnamese learners write academic and journalistic prose almost entirely with 'said' because Vietnamese nói/bảo covers a wide semantic range. English expects argue, suggest, claim, note, contend, insist, point out — each carrying different epistemic stance.",
      vi: "Khác với quy tắc lùi thì. Đây là vấn đề từ vựng + thể loại văn bản. Tiếng Việt dùng nói/bảo rất rộng; tiếng Anh viết học thuật phân biệt rõ argue, suggest, claim, note, contend, insist…",
    },
    nativeRoot:
      "Tiếng Việt dùng nói/bảo cho mọi lập trường. Tiếng Anh học thuật phân biệt mức độ chắc chắn và lập trường qua động từ tường thuật.",
    cefr: ["B2", "C1", "C2"],
    severity: "medium",
    genres: ["academic_essay", "ielts_task_2", "research_summary"],
    remediation: "Build a reporting-verb register table (neutral / strong / hedged / negative-stance) tied to IELTS Lexical Resource band; rewrite essays with one varied verb per source mention.",
    needsReview: true,
    examples: [
      { incorrect: "The author said that climate change is real.", corrected: "The author argues that climate change is real… She points out that… She contends that…", nativeGloss: "Tác giả nói works for all stances in VN; EN needs lexical variety" },
      { incorrect: "He told that the meeting is cancelled.", corrected: "He said the meeting is cancelled.", nativeGloss: "Told requires an indirect object in EN; bảo doesn't in VN" },
      { incorrect: "She said about the new policy.", corrected: "She commented on the new policy.", nativeGloss: "Nói về → said about; EN doesn't take that complement" },
      { incorrect: "The professor said his opinion.", corrected: "The professor gave his opinion.", nativeGloss: "Nói ý kiến — VN allows say to take an opinion-noun" },
      { incorrect: "The newspaper said the price increased.", corrected: "The newspaper reported that the price increased.", nativeGloss: "Print/news source — English reaches for report" },
      { incorrect: "He said me that the train is late.", corrected: "He told me the train is late.", nativeGloss: "Say doesn't take a personal indirect object" },
      { incorrect: "The boss said me to come early.", corrected: "The boss asked me to come early.", nativeGloss: "Said-me + infinitive: layered error" },
      { incorrect: "Lan said yes.", corrected: "Lan agreed.", nativeGloss: "Said yes registers as conversational; report-genre wants agreed/consented", context: "formal report" },
      { incorrect: "The study said that Vietnamese learners struggle with articles.", corrected: "The study found that Vietnamese learners struggle with articles.", nativeGloss: "Studies don't say in EN academic prose — they find/show/demonstrate" },
      { incorrect: "He said no.", corrected: "He refused.", nativeGloss: "Casual-only; in a report needs lexicalisation" },
      { incorrect: "The minister said that the policy is necessary.", corrected: "The minister insisted the policy was necessary.", nativeGloss: "Same verb across school chat and ministerial statement — VN one-size", context: "essay genre" },
      { incorrect: "I said him sorry.", corrected: "I apologised to him.", nativeGloss: "Tôi nói với anh ấy xin lỗi calque; English has a dedicated apology verb" },
      { incorrect: "The book says that…", corrected: "The book argues that / claims that / suggests that / shows that…", nativeGloss: "Variation expected at B2+; VN learner doesn't have the lexical set" },
    ],
  },
  {
    id: "vi_write_hedging",
    category: "pragmatics",
    name: { en: "Hedging and certainty calibration", vi: "Cân chỉnh mức độ chắc chắn" },
    description: {
      en: "English academic and professional writing calibrates certainty with a graded set of hedges (may, might, could, perhaps, tend to, often, generally, arguably). Vietnamese academic style splits between direct/unhedged (state-paper, opinion piece) and over-hedged (deferential letter). VN learners arrive at IELTS Task 2 with one of two opposite habits.",
      vi: "Tiếng Anh học thuật cần may / might / could / tend to để cân chỉnh mức chắc chắn. Tiếng Việt một mặt rất thẳng, mặt khác rất rào đón — người học IELTS thường lệch về một thái cực.",
    },
    nativeRoot:
      "Phong cách học thuật tiếng Việt chia hai cực: trực tiếp không rào đón (chính luận) và quá rào đón (thư từ kính trọng).",
    cefr: ["B2", "C1"],
    severity: "medium",
    genres: ["ielts_task_2", "academic_essay", "op_ed"],
    remediation: "Teach the graded hedge set (may/might/could/tend to/generally/arguably) and have learners rewrite over-asserted IELTS thesis statements with calibrated certainty.",
    needsReview: true,
    examples: [
      { incorrect: "Vietnam is the best country in the world.", corrected: "Vietnam, in many respects, is among the most distinctive countries in the world.", nativeGloss: "Direct VN tradition + nationalism; IELTS Task 2 expects hedged claim", context: "IELTS Task 2 thesis" },
      { incorrect: "All Vietnamese students love English.", corrected: "Many Vietnamese students tend to enjoy English.", nativeGloss: "Universal quantifier where many/most/tend to is needed" },
      { incorrect: "Technology is destroying our society.", corrected: "Technology may be eroding several aspects of social life.", nativeGloss: "Bare assertion; English C1 writing softens dramatic claims" },
      { incorrect: "It is 100% correct that climate change is real.", corrected: "Climate change is well-documented.", nativeGloss: "Percent-hedge from VN 100% đúng — not idiomatic EN" },
      { incorrect: "Maybe perhaps it could possibly be that some students might struggle.", corrected: "Some students may struggle.", nativeGloss: "Hedge-stack — over-corrected from always hedge lesson" },
      { incorrect: "In my humble opinion, with all due respect, I would like to suggest that…", corrected: "I'd like to suggest…", nativeGloss: "Stacked politeness from VN deference; English reads as anxious" },
      { incorrect: "I think that probably maybe English is hard.", corrected: "English can be hard.", nativeGloss: "Triple hedge nghĩ là / chắc là / có lẽ; pick one" },
      { incorrect: "It is certain that students will fail without practice.", corrected: "Students are likely to fail without practice.", nativeGloss: "Certainty over-claim; chắc chắn → certain" },
      { incorrect: "Everyone knows that pollution is bad.", corrected: "Pollution is widely recognised as harmful.", nativeGloss: "Ai cũng biết — universal-knowledge claim in VN; EN softens" },
      { incorrect: "The government must immediately solve this problem.", corrected: "The government should consider addressing this problem.", nativeGloss: "Modal-strength mismatch: phải ngay lập tức = must immediately lifts demand higher than EN op-ed allows" },
      { incorrect: "It is obvious that English is more useful than other languages.", corrected: "English is, arguably, more widely useful than other languages.", nativeGloss: "Rõ ràng là — VN essay opener; arguably is the calibrated EN form" },
      { incorrect: "The author is wrong.", corrected: "The author overstates the case.", nativeGloss: "Direct VN academic style; in EN a hedged disagreement is more credible" },
      { incorrect: "If we do not act now, the world will end.", corrected: "Without action, the consequences could be severe.", nativeGloss: "Apocalyptic claim — EN op-ed expects hedged consequence" },
    ],
  },
  {
    id: "vi_write_article_discourse",
    category: "discourse",
    name: { en: "Article use across a paragraph", vi: "Theo dõi mạo từ trong cả đoạn văn" },
    description: {
      en: "Distinct from per-sentence article-omission. The writing-specific pattern: a VN learner introduces a referent with 'a', then drops articles entirely, or introduces with 'the' (treating it as known to the reader because it's known to the writer), or switches mid-paragraph. The error is about tracking discourse referents across sentences.",
      vi: "Khác với quy tắc thiếu mạo từ trong từng câu. Lỗi viết là theo dõi đối tượng trong cả đoạn — giới thiệu bằng a rồi bỏ hoàn toàn ở câu sau, hoặc dùng the ngay từ đầu vì người viết biết nhưng người đọc chưa biết.",
    },
    nativeRoot:
      "Tiếng Việt không có hệ thống mạo từ phải đeo bám đối tượng qua các câu; sự xác định trong VN chỉ cần ngữ cảnh.",
    cefr: ["A2", "B1", "B2", "C1"],
    severity: "medium",
    genres: ["ielts_task_2", "academic_essay", "narrative_writing"],
    remediation: "Teach the new-referent → indefinite-a → subsequent-mention-the/it/pronoun cycle; drill on multi-sentence paragraphs with a single referent.",
    examples: [
      { incorrect: "I bought a book yesterday. Book was very interesting.", corrected: "I bought a book yesterday. The book was very interesting.", nativeGloss: "New referent → a; second mention → the. VN drops both because tracked by context" },
      { incorrect: "The dog ran into the room. Dog was wet.", corrected: "A dog ran into the room. The dog was wet.", nativeGloss: "Reverse error: starts with the before reader has met the referent" },
      { incorrect: "Yesterday I met a teacher. Teacher was very kind. We talked for an hour. Teacher gave me advice.", corrected: "Yesterday I met a teacher. She was very kind. We talked for an hour, and she gave me advice.", nativeGloss: "First mention OK; subsequent references repeat the noun without article" },
      { incorrect: "The Vietnam is a beautiful country.", corrected: "Vietnam is a beautiful country.", nativeGloss: "Already in placement; appears in writing as overcorrection" },
      { incorrect: "I have the dog. The dog is brown. I love the dog.", corrected: "I have a dog. He's brown, and I love him.", nativeGloss: "Triple the — overcorrection from a lesson on definiteness" },
      { incorrect: "My father is teacher. He works in school. The school is big.", corrected: "My father is a teacher. He works in a school — the school is big.", nativeGloss: "Mixed: article missing in introductions, appears once anchored" },
      { incorrect: "The pollution is a serious problem. The traffic is bad. The education is expensive.", corrected: "Pollution is a serious problem. Traffic is bad. Education is expensive.", nativeGloss: "The inserted before generic uncountable abstracts — over-application of definiteness" },
      { incorrect: "In introduction, I will discuss three points.", corrected: "In the introduction, I will discuss three points.", nativeGloss: "Genre-frame noun introduction dropped article" },
      { incorrect: "I want to discuss problem of unemployment. Problem affects young people.", corrected: "I want to discuss the problem of unemployment. The problem affects young people.", nativeGloss: "Specific-of-NP — must be definite — dropped" },
      { incorrect: "Last summer I went to beach. Beach was crowded.", corrected: "Last summer I went to the beach. It was crowded.", nativeGloss: "Geographic-specific definite the beach dropped; pronoun second time" },
      { incorrect: "She is best student.", corrected: "She is the best student.", nativeGloss: "Already in placement; recurs in essays" },
      { incorrect: "I read interesting article about Vietnam. Article was written by Vietnamese author. Author lives in Hanoi.", corrected: "I read an interesting article about Vietnam. It was written by a Vietnamese author who lives in Hanoi.", nativeGloss: "Three-sentence pattern showing all three errors at once" },
      { incorrect: "Internet is changing the world.", corrected: "The internet is changing the world.", nativeGloss: "Unique-referent definite the internet dropped — VN treats it as the bare name", context: "essay opener" },
      { incorrect: "I am writing about my family. Family is very important to me.", corrected: "I'm writing about my family. My family is very important to me.", nativeGloss: "Repetition of bare noun instead of possessive/pronoun re-mention" },
    ],
  },
  {
    id: "vi_write_tense_paragraph",
    category: "discourse",
    name: { en: "Tense consistency across a paragraph", vi: "Đồng nhất thì trong cả đoạn văn" },
    description: {
      en: "Distinct from per-sentence tense rules. The writing-specific pattern: a VN narrator sets the time once at the top (Yesterday…, Last summer…) and the verbs stop changing. English expects each verb to carry the tense; the Vietnamese learner's verbs sit in present or unmarked form throughout.",
      vi: "Tiếng Việt đặt mốc thời gian ở đầu câu / đầu đoạn — sau đó động từ không cần đổi. Tiếng Anh đòi mỗi động từ đều mang dấu thì.",
    },
    nativeRoot:
      "Tiếng Việt đánh mốc thời gian một lần ở đầu đoạn; sau đó động từ giữ nguyên. Tiếng Anh đòi từng động từ mang dấu thì.",
    cefr: ["A2", "B1", "B2"],
    severity: "high",
    genres: ["narrative_writing", "ielts_task_2", "personal_essay"],
    remediation: "Drill multi-sentence narratives with time set at the top; mark every verb in the paragraph and check each carries the matching tense.",
    needsReview: true,
    examples: [
      { incorrect: "Last summer I traveled to Da Nang. The beach is beautiful. We swim every morning. The food is delicious.", corrected: "Last summer I traveled to Da Nang. The beach was beautiful. We swam every morning, and the food was delicious.", nativeGloss: "Time set once (last summer); subsequent verbs left in present" },
      { incorrect: "Yesterday I go to school. The teacher gives us a test. The test is difficult. I do my best.", corrected: "Yesterday I went to school. The teacher gave us a test — it was difficult, but I did my best.", nativeGloss: "Same pattern, one-day window" },
      { incorrect: "When I was a child, I live in Hue. My family is poor. We work hard.", corrected: "When I was a child, I lived in Hue. My family was poor, and we worked hard.", nativeGloss: "Khi còn nhỏ → past frame; remaining verbs left in present" },
      { incorrect: "In my essay, I will discuss three points. First, technology was important. Second, education is important. Third, family will be important.", corrected: "In this essay, I will discuss three points: technology, education, and family — all important to modern life.", nativeGloss: "Three different tenses for three parallel points; tense-shift muddles parallel-structure cohesion" },
      { incorrect: "The author wrote that climate change is real. He argues it will get worse. He showed that we are too slow.", corrected: "The author argues that climate change is real, and insists that it will get worse — pointing out we have been too slow to respond.", nativeGloss: "Reporting-verb tense mixed with content-clause tense" },
      { incorrect: "Last week we have a meeting. The boss said the project is cancelled.", corrected: "Last week we had a meeting. The boss said the project had been cancelled.", nativeGloss: "Present-perfect have used as past; backshift in reported speech not applied" },
      { incorrect: "I am studying in Canada since 2024.", corrected: "I have been studying in Canada since 2024.", nativeGloss: "Continuing-state đang học từ 2024 needs present perfect continuous in EN" },
      { incorrect: "If I had money, I will buy a house.", corrected: "If I had money, I would buy a house.", nativeGloss: "Already in placement; appears in writing when learner forgets the if-frame mid-paragraph" },
      { incorrect: "Yesterday, the weather is good, so we go to the park, but it starts to rain, so we come home.", corrected: "Yesterday the weather was good, so we went to the park, but it started to rain, so we came home.", nativeGloss: "Four verbs left in present; the yesterday alone is doing the work" },
      { incorrect: "When I arrived at the airport, my friend already leave.", corrected: "When I arrived at the airport, my friend had already left.", nativeGloss: "Past perfect missing — narrative writing second clause" },
      { incorrect: "I was working at ABC. I do many projects. I get a promotion.", corrected: "I was working at ABC, doing many projects, and got a promotion.", nativeGloss: "Aspect collapses: past continuous → past simple → present simple" },
      { incorrect: "Today, the price is high. Yesterday, the price is also high.", corrected: "Today, the price is high. Yesterday it was also high.", nativeGloss: "Yesterday clause keeps present — common because is was reused mechanically" },
      { incorrect: "He has worked here for 10 years. He starts in 2014.", corrected: "He has worked here for 10 years. He started in 2014.", nativeGloss: "Aspect-collision when learner over-corrects after a present-perfect lesson" },
    ],
  },
  {
    id: "vi_write_possessive_relative",
    category: "discourse",
    name: { en: "Possessive and relative-clause structure in writing", vi: "Sở hữu và mệnh đề quan hệ trong văn viết" },
    description: {
      en: "Writing-specific failures distinct from sentence-level possessive-'s and relative-pronoun rules: 'the X of me' as default possessive (calque of của tôi), double-marked relative clauses (the man who his car is red), and resumptive pronouns (the man I met him) that survive in written prose because they sound complete to the writer.",
      vi: "Khác với quy tắc câu lẻ. Lỗi viết hay gặp: dùng the X of me thay vì my X; mệnh đề quan hệ gấp đôi chủ ngữ (the man who his car is red); đại từ lặp lại (the man I met him).",
    },
    nativeRoot:
      "Tiếng Việt dùng của X sau danh từ chính + cho phép giữ đại từ trong mệnh đề quan hệ; cả hai chuyển di sang câu viết tiếng Anh.",
    cefr: ["B1", "B2", "C1"],
    severity: "medium",
    genres: ["formal_writing", "academic_essay", "ielts_task_2"],
    remediation: "Drill the of-me → my-X conversion + the whose-replacement for double-marked relative clauses; remove resumptive pronouns from relative clauses.",
    examples: [
      { incorrect: "This is the book of me.", corrected: "This is my book.", nativeGloss: "Cuốn sách của tôi → of me; possessive 's not yet automatic" },
      { incorrect: "The car of my brother is red.", corrected: "My brother's car is red.", nativeGloss: "Same của X pattern in writing" },
      { incorrect: "The man who his car is red is my uncle.", corrected: "The man whose car is red is my uncle.", nativeGloss: "Ông mà xe của ông đỏ — VN retains the possessive pronoun in relative clause; EN collapses to whose" },
      { incorrect: "The girl which I love her is from Hue.", corrected: "The girl I love is from Hue.", nativeGloss: "Resumptive her + wrong relative pronoun (which for person)" },
      { incorrect: "The book what I bought yesterday is interesting.", corrected: "The book that I bought yesterday is interesting.", nativeGloss: "What used as relative pronoun — calque of VN cái mà" },
      { incorrect: "The man I met him at the conference is famous.", corrected: "The man I met at the conference is famous.", nativeGloss: "Resumptive him — VN allows the pronoun in relative-like clauses" },
      { incorrect: "My friend, his name is Tuan, is from Hanoi.", corrected: "My friend Tuan is from Hanoi.", nativeGloss: "Bạn tôi, tên là Tuấn, ở Hà Nội — VN appositive uses a full clause" },
      { incorrect: "The students which they are from Vietnam study hard.", corrected: "The students who are from Vietnam study hard.", nativeGloss: "Wrong relative + resumptive subject pronoun" },
      { incorrect: "The city where I was born in is Hue.", corrected: "The city where I was born is Hue.", nativeGloss: "Double-marking: relative adverb where + preposition in — only one allowed" },
      { incorrect: "The reason why I came is because I missed home.", corrected: "I came because I missed home.", nativeGloss: "Lý do tại sao mà…là vì… stacked subordinators — VN style" },
      { incorrect: "Vietnam, it is a country which is in Southeast Asia.", corrected: "Vietnam, a country in Southeast Asia,…", nativeGloss: "Topic-pickup it + heavy relative clause; appositive would be cleaner" },
      { incorrect: "My sister she lives in Saigon.", corrected: "My sister lives in Saigon.", nativeGloss: "Subject doubled — VN topic + comment leaking" },
      { incorrect: "The team that I am working with them is small.", corrected: "The team I work with is small.", nativeGloss: "Relative clause + resumptive object them" },
      { incorrect: "Tuan, my friend who he is a doctor, helped me.", corrected: "Tuan, my friend who is a doctor, helped me.", nativeGloss: "Appositive + relative clause with resumptive subject" },
    ],
  },
  {
    id: "vi_write_calques",
    category: "genre",
    name: { en: "False cognates and direct calques (writing-only)", vi: "Cụm dịch nguyên từ tiếng Việt (chỉ trong văn viết)" },
    description: {
      en: "Placement covers short calques at sentence level. The writing-specific surface: longer calques that survive because they form plausible English sentences. 'With the development of modern society', 'more and more', 'in nowadays', 'according to me' — appear in essay introductions and never spontaneously in native English.",
      vi: "Khác với calque ngắn ở từng câu. Lỗi viết là calque dài vẫn nghe ổn trong tiếng Anh — không bị bắt ngay nhưng đọc thấy Vietlish.",
    },
    nativeRoot:
      "Calque dài lấy từ phong cách báo chí và văn chính luận Việt Nam, vẫn hợp ngữ pháp trong tiếng Anh nhưng đọc thấy Vietlish.",
    cefr: ["A1", "A2", "B1", "B2", "C1"],
    severity: "medium",
    genres: ["ielts_task_2", "toefl_essay", "academic_essay"],
    remediation: "Build a banned-phrase list (with the development of / more and more / in nowadays / according to me) and rewrite essay openings without them.",
    needsReview: true,
    examples: [
      { incorrect: "With the development of modern society, English becomes more important.", corrected: "As modern society develops, English becomes increasingly important.", nativeGloss: "Cùng với sự phát triển của xã hội hiện đại — VN journalism boilerplate" },
      { incorrect: "More and more people are learning English nowadays.", corrected: "Increasingly, people are learning English.", nativeGloss: "Ngày càng nhiều + ngày nay — both calqued" },
      { incorrect: "In nowadays, the internet is everywhere.", corrected: "Today, the internet is everywhere.", nativeGloss: "Vào ngày nay — calque; in nowadays is not English" },
      { incorrect: "According to me, English is the most useful language.", corrected: "In my view, English is the most useful language.", nativeGloss: "Theo tôi → according to me; English reserves according to X for external sources" },
      { incorrect: "In the conclusion, I want to repeat that pollution is serious.", corrected: "In conclusion, pollution is serious.", nativeGloss: "Trong phần kết luận + tôi muốn nhắc lại — both calqued" },
      { incorrect: "I have a busy schedule, so I cannot arrange time to meet you.", corrected: "I'm busy, so I can't make time to meet.", nativeGloss: "Sắp xếp thời gian → arrange time — VN compound calque" },
      { incorrect: "Open the light, please.", corrected: "Turn on the light, please.", nativeGloss: "Already in placement; included for completeness" },
      { incorrect: "Close the wifi.", corrected: "Turn off the wifi.", nativeGloss: "Tắt wifi → close wifi" },
      { incorrect: "I will go home by walking.", corrected: "I'll walk home.", nativeGloss: "Đi bộ về nhà — by walking is over-literal" },
      { incorrect: "She graduated from university with the high mark.", corrected: "She graduated from university with high marks.", nativeGloss: "Tốt nghiệp với điểm cao — close, but the high mark reads odd" },
      { incorrect: "My father has the high position in the company.", corrected: "My father is in a senior position at the company.", nativeGloss: "Có chức vụ cao — calqued; the high position sounds like a job title" },
      { incorrect: "He gave me a lot of pressure.", corrected: "He put a lot of pressure on me.", nativeGloss: "Cho tôi áp lực — VN cho wants give in EN; English uses put pressure on" },
      { incorrect: "The salary is too low, cannot afford the life.", corrected: "The salary is too low to live on.", nativeGloss: "Không đủ sống — afford the life is a calque-collapse" },
      { incorrect: "Please feedback me your opinion.", corrected: "Please share your feedback.", nativeGloss: "Feedback as verb in VN business EN; English prefers noun" },
      { incorrect: "I will try my best to do well.", corrected: "I'll do my best.", nativeGloss: "Doubled effort marker — cố gắng hết sức để làm tốt" },
      { incorrect: "In my hometown, there are many beautiful sceneries.", corrected: "My hometown has many beautiful views.", nativeGloss: "Phong cảnh đẹp plural with -s, but scenery is uncountable" },
      { incorrect: "Recently in recent years, the economy is growing fast.", corrected: "In recent years, the economy has grown quickly.", nativeGloss: "Gần đây trong những năm gần đây — doubled time-frame, calqued" },
      { incorrect: "I want to share with you about my experience.", corrected: "I want to share my experience with you.", nativeGloss: "Chia sẻ với bạn về — preposition order calqued" },
    ],
  },
  {
    id: "vi_write_punctuation",
    category: "genre",
    name: { en: "Punctuation transfer", vi: "Chuyển di dấu câu" },
    description: {
      en: "Vietnamese punctuation conventions are similar to French (which influenced VN typography under colonial rule) and to mobile-chat informality. Systematic transfers include multiple exclamation marks, ellipsis-as-softener, space before colons/semicolons (French legacy), guillemets, and decimal-comma vs decimal-point conventions.",
      vi: "Dấu câu tiếng Việt chịu ảnh hưởng tiếng Pháp và thói quen chat. Các lỗi chuyển di hệ thống: nhiều dấu chấm than, dấu ba chấm thay cho ạ/nhé, khoảng trắng trước : và ;, dấu nháy kép kiểu « », dấu thập phân.",
    },
    nativeRoot:
      "Dấu câu tiếng Việt chịu ảnh hưởng tiếng Pháp (khoảng trắng trước : ; !) và thói quen chat (!!! , …).",
    cefr: ["A2", "B1", "B2", "C1"],
    severity: "medium",
    genres: ["professional_email", "cover_letter", "academic_essay"],
    remediation: "Drill EN punctuation conventions (no space before : ; ! ?; single ! in formal genres; straight quotes; comma/period decimal locale-correct for EN).",
    needsReview: true,
    examples: [
      { incorrect: "Thank you so much for your help!!!", corrected: "Thank you so much for your help.", nativeGloss: "VN chat habit; !!! reads as immature in formal genres", context: "job-application thank-you note" },
      { incorrect: "I think we should… reconsider… this plan… maybe later…", corrected: "I think we should reconsider this plan, perhaps later.", nativeGloss: "Ellipsis-as-softener — VN ạ / nhé / chắc là carried over" },
      { incorrect: "Dear Sir : I am writing to apply…", corrected: "Dear Sir, I am writing to apply…", nativeGloss: "Space before : — French/VN typographic legacy" },
      { incorrect: "He said \" I am tired \" and left.", corrected: "He said, \"I am tired,\" and left.", nativeGloss: "Space inside quotation marks + missing comma before quoted speech" },
      { incorrect: "The price is 1.500.000 VND.", corrected: "The price is 1,500,000 VND.", nativeGloss: "Thousands separator collision — VN uses ., EN uses ,", context: "EN copy" },
      { incorrect: "I bought 3,5 kg of rice.", corrected: "I bought 3.5 kg of rice.", nativeGloss: "Decimal comma vs point" },
      { incorrect: "The meeting is at 9 :30 am.", corrected: "The meeting is at 9:30 am.", nativeGloss: "Space before : in time" },
      { incorrect: "She is from Vietnam «my country»", corrected: "She is from Vietnam — my country.", nativeGloss: "French-style guillemets transferred; EN prefers parens or em-dash" },
      { incorrect: "This problem , we must solve.", corrected: "We must solve this problem.", nativeGloss: "Topicalising comma; English prefers em-dash if topic must be fronted" },
      { incorrect: "Hello !", corrected: "Hello!", nativeGloss: "Space before ! — French legacy" },
      { incorrect: "(I went home early.)", corrected: "(I went home early).", nativeGloss: "Period placement around parens — VN tradition vs EN convention" },
      { incorrect: "I love Vietnam ; it is my home.", corrected: "I love Vietnam; it is my home.", nativeGloss: "Space before semicolon" },
      { incorrect: "Subject : application for marketing role", corrected: "Subject: Application for marketing role", nativeGloss: "Email subject line — space before : + missing title-case" },
      { incorrect: "She said : \"I am tired.\"", corrected: "She said, \"I am tired.\"", nativeGloss: "Space-before-colon + colon-vs-comma — EN dialogue uses comma" },
    ],
  },
  {
    id: "vi_write_essay_structure",
    category: "paragraph-shape",
    name: { en: "Essay structure conventions (IELTS Task 2 / TOEFL independent)", vi: "Cấu trúc bài luận (IELTS Task 2 / TOEFL)" },
    description: {
      en: "VN learners arrive at IELTS Task 2 / TOEFL with a listing reflex: present a topic, list three sub-topics with a marker (Firstly… Secondly… Thirdly…), restate in conclusion. The Vietnamese academic essay tradition is comfortable with this structure; IELTS band descriptors at Band 7+ explicitly want argument, not enumeration.",
      vi: "Người học mang vào IELTS Task 2 thói quen liệt kê: nêu chủ đề, kể ba ý phụ, kết bằng nhắc lại mở bài. Truyền thống văn nghị luận Việt Nam chấp nhận cấu trúc này; IELTS Band 7+ đòi lập luận, không phải liệt kê.",
    },
    nativeRoot:
      "Văn nghị luận Việt Nam cho phép cấu trúc liệt kê (thứ nhất / thứ hai / thứ ba) — IELTS / TOEFL muốn lập luận thay vì liệt kê.",
    cefr: ["B1", "B2", "C1", "C2"],
    severity: "high",
    genres: ["ielts_task_2", "toefl_essay"],
    remediation: "Teach the position-thesis → content-rich topic sentence → analysed example → synthesised conclusion shape; remove mechanical Firstly/Secondly scaffolding.",
    needsReview: true,
    examples: [
      { incorrect: "In this essay, I will discuss three points: pollution, traffic, and education.", corrected: "Vietnam's three pressing problems — pollution, traffic, and education — share a single root: uncontrolled urban growth.", nativeGloss: "Topic statement vs position statement", context: "thesis" },
      { incorrect: "Firstly, pollution is a problem.", corrected: "Pollution, the most visible of these problems, has tripled in measured PM2.5 since 2015.", nativeGloss: "Mechanical Firstly + bare claim", context: "body topic sentence" },
      { incorrect: "For example, in Hanoi the air is very dirty.", corrected: "For example, Hanoi's air-quality index regularly exceeds 200, a level the WHO classifies as unsafe.", nativeGloss: "For example introduces but the analysis doesn't follow", context: "body content" },
      { incorrect: "In conclusion, I have discussed three points: pollution, traffic, and education. These are three problems of Vietnam.", corrected: "The three problems are not three problems — they're three faces of one. Addressing any of them in isolation will fail.", nativeGloss: "Restate-the-intro conclusion; English C1 wants synthesis", context: "conclusion" },
      { incorrect: "Online learning has many advantages. Online learning has many disadvantages.", corrected: "Online learning's advantages are now obvious — its costs less so. This essay weighs the two.", nativeGloss: "Listing both sides as flat claims; English wants the tension stated", context: "two-sided essay opening" },
      { incorrect: "(counter-argument absent — the essay only argues one side)", corrected: "Critics argue that traditional classrooms offer irreplaceable peer interaction. That objection is real, but…", nativeGloss: "VN essay tradition doesn't always require addressing counter-side; IELTS Band 7+ does", context: "counter-argument" },
      { incorrect: "Firstly, in my opinion, I think that maybe pollution might possibly be a serious problem.", corrected: "Pollution is a serious problem.", nativeGloss: "Compounded VN-essay habits: order marker + opinion marker + hedge", context: "hedge stack" },
      { incorrect: "For example, many people think this.", corrected: "For example, a 2024 survey of 1,200 Hanoi residents found 78% rating traffic the city's worst problem.", nativeGloss: "Many people think is not an example; IELTS Task 2 wants specifics", context: "generic example" },
      { incorrect: "So, in conclusion of this paragraph, pollution is bad.", corrected: "These figures suggest that pollution, more than any other factor, drives the city's worsening livability.", nativeGloss: "Two paragraph conclusions per essay — VN paragraph-essay habit", context: "pseudo-conclusion mid-body" },
      { incorrect: "Firstly… Secondly… Thirdly… Lastly… Finally…", corrected: "(remove markers entirely; let the content carry the structure)", nativeGloss: "One marker per paragraph max at C1; ideally zero", context: "stacked listing markers" },
      { incorrect: "The topic is whether students should wear uniforms. In this essay, I will discuss this topic.", corrected: "Students should wear uniforms, but only through the end of secondary school.", nativeGloss: "Genre-template restating prompt instead of taking a position", context: "thesis = topic restated" },
      { incorrect: "Education is very important. It is the foundation of society. Many countries have different education systems. In Vietnam, education is improving. In this essay, I will discuss the role of homework in modern education.", corrected: "Whether homework actually improves learning has become an open question — even in Vietnam, where two-hour nightly assignments are standard.", nativeGloss: "Five generic sentences before reaching the prompt; VN essay tradition warms up first", context: "cover-everything intro" },
      { incorrect: "As Ho Chi Minh said, \"Learning is a lifelong journey.\" This shows that education is important.", corrected: "(omit; aphorisms are not evidence in IELTS)", nativeGloss: "VN essay tradition opens with quoted authority; IELTS examiners discount this", context: "quotation-as-evidence" },
      { incorrect: "(starts on conclusion, drifts into new argument)", corrected: "(conclusion should not introduce new evidence)", nativeGloss: "VN essay tradition allows final paragraph to bring fresh angle; IELTS treats this as coherence error", context: "final paragraph drift" },
    ],
  },
];

// ──────────────────────────────────────────────────────────────────────────
// Phoneme gap categories — C3 vn-phoneme-gaps.md audit (6 categories).
// Proposed entries live in vn-phoneme-map.extension.proposed.ts; NOT
// imported into the runtime profile yet. This block records the audit
// categories with snake_case IDs.
// ──────────────────────────────────────────────────────────────────────────

const phonemeGapCategories: PhonemeGapCategory[] = [
  {
    id: "gap_southern_dialect_transfer",
    title: "Southern Vietnamese dialect transfer",
    rationale: "The existing map treats Vietnamese as one dialect. Southern /v/ → [j] (yery for very) is the single biggest dialect-attributable false negative the current scorer will produce.",
    proposedEntryCount: 8,
    needsReview: true,
  },
  {
    id: "gap_final_cluster_simplification",
    title: "Final consonant cluster simplification (beyond -s and -ed)",
    rationale: "Vietnamese permits zero clusters in coda position. Every English final cluster gets simplified — far beyond the -s/-ed cases the current map covers. Largest unaddressed gap.",
    proposedEntryCount: 18,
  },
  {
    id: "gap_vowel_quality_drift",
    title: "Vowel quality drift",
    rationale: "Vietnamese vowel inventory doesn't include the English /æ/-/ɛ/ contrast, /ɪ/-/iː/, /ʌ/-/ɑː/, /ʊ/-/uː/. Pair-collisions like ship/sheep, bed/bad, full/fool surface persistently.",
    proposedEntryCount: 14,
    needsReview: true,
  },
  {
    id: "gap_word_stress_placement",
    title: "Word stress placement",
    rationale: "Vietnamese is syllable-timed and tonal; English word-stress (photographer, important, information) is a learned habit. Existing map names this in prose but doesn't enumerate substitutions.",
    proposedEntryCount: 9,
    needsReview: true,
  },
  {
    id: "gap_connected_speech",
    title: "Connected speech (linking, weak forms, schwa reduction)",
    rationale: "VN learners speak English in citation form. Want-to, going-to, of-the linking + schwa reduction in unstressed function words is a B2+ ceiling pattern.",
    proposedEntryCount: 7,
  },
  {
    id: "gap_intonation_patterns",
    title: "Intonation patterns",
    rationale: "English question-rise, list-fall, contrastive-stress, focus-shift intonation differs from VN tonal contours. Advanced learners need explicit work after segmental pronunciation is acceptable.",
    proposedEntryCount: 4,
    needsReview: true,
  },
];

// ──────────────────────────────────────────────────────────────────────────
// Profile assembly.
// ──────────────────────────────────────────────────────────────────────────

const phonologyLayer: PhonologyLayer = {
  substitutions: PHONEME_SUBSTITUTIONS,
  wordOverrides: WORD_OVERRIDES,
  tips: PHONEME_TIPS,
  problemPairs: {
    th_t: PROBLEM_PAIRS_TH_T,
    r_l: PROBLEM_PAIRS_R_L,
    ed_endings: PROBLEM_PAIRS_ED_ENDINGS,
    s_plurals: PROBLEM_PAIRS_S_PLURALS,
  },
  gaps: phonemeGapCategories,
};

const grammarLayer: GrammarLayer = {
  rulePack: VN_RULE_PACK,
  families: grammarFamilies,
};

const writingLayer: WritingLayer = {
  patterns: writingPatterns,
};

const interferenceMap: InterferenceMap = {
  patterns: VN_L1_INTERFERENCE_PATTERNS,
};

const meta: L1ProfileMetadata = {
  nativeLangCode: "vi",
  nativeLangName: "Tiếng Việt",
  targetLangCode: "en",
  version: "1.0.0",
  lastReviewed: "2026-05-24",
  lastReviewedBy: "Chau Doan (founder)",
  citations: [
    "docs/l1-taxonomies/spec.md",
    "docs/l1-taxonomies/vi-grammar.md",
    "docs/l1-taxonomies/vi-writing.md",
    "docs/l1-taxonomies/vn-phoneme-gaps.md",
    "docs/placement-vn-l1-interference-taxonomy.md",
  ],
};

export const vietnameseL1Profile: L1Profile = {
  meta,
  interference: interferenceMap,
  phonology: phonologyLayer,
  grammar: grammarLayer,
  writing: writingLayer,
};

// Sanity: ensure module-load verification ran. Without referencing this
// const, TS-strict + unused-locals would strip the IIFE.
export const _moduleLoadVerification = _verifyGrammarRuleTagsAtLoad;

export default vietnameseL1Profile;
