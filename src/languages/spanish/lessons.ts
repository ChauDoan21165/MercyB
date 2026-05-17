// src/languages/spanish/lessons.ts
//
// Spanish-for-English-speakers module — type system + curriculum metadata.
//
// FIRST language vertical in MercyBlade whose source/UI language is English
// rather than Vietnamese. Lesson titles, tips, and cultural notes are
// authored in English (the learner's L1); Spanish is the target. The shared
// <LessonRenderer> opts into English chrome via `uiLanguage="en"` (PR-A).
//
// Lesson data follows the lazy-registry pattern from french/lessons.ts:
// per-level lessons-{level}.ts files load on demand via
// fetchLessonsBatch in the page component. These stubs preserve the
// exported API surface for backward compat with any direct importers.

import type { LessonAudioLevel } from "@/lib/lessonAudio";

// ── CEFR + category metadata ────────────────────────────────────────────

export type SpanishCefrLevel = Extract<
  LessonAudioLevel,
  "A1" | "A2" | "B1" | "B2" | "C1" | "C2"
>;

export type SpanishCategoryId =
  // A1 — getting started
  | "greetings"
  | "ser_estar_intro"
  | "gendered_nouns"
  | "present_tense"
  | "numbers"
  | "time_dates"
  | "family"
  | "food_basics"
  | "questions"
  // A2 — elementary
  | "past_tense_intro"
  | "reflexive_verbs"
  | "object_pronouns"
  | "comparatives"
  | "weather"
  | "daily_routine"
  | "shopping"
  | "directions"
  // B1 — intermediate
  | "preterite_vs_imperfect"
  | "subjunctive_intro"
  | "future_conditional"
  | "por_vs_para"
  | "travel"
  | "work"
  | "health"
  | "opinions"
  // B2 — upper-intermediate
  | "subjunctive_mastery"
  | "passive_voice"
  | "idioms"
  | "business_spanish"
  | "news_comprehension"
  | "debate_basics"
  // C1 — advanced
  | "advanced_subjunctive"
  | "register_shifts"
  | "literary_tenses"
  | "rhetoric"
  | "professional_writing"
  // C2 — mastery
  | "idiomatic_mastery"
  | "sociolinguistics"
  | "satire_irony"
  | "advanced_debate"
  | "literary_analysis";

export type SpanishCategoryMeta = {
  id: SpanishCategoryId;
  title: string;       // English — used by SpanishLessonsPage section headers
  description: string; // English — short tooltip / subtitle
  level: SpanishCefrLevel;
  expected_count: number;
};

// Curriculum design — expected_count sums to 110 across 41 categories
// spanning all six CEFR levels. All six levels are now populated (109
// lessons shipped; see SPANISH_TOTAL_LESSONS). expected_count is the
// original planning target and is not read at runtime; the page just
// renders whatever lessons exist regardless of the planned total.
export const SPANISH_CATEGORIES: ReadonlyArray<SpanishCategoryMeta> = [
  // A1 — 16 lessons across 9 categories
  { id: "greetings", level: "A1", title: "Greetings & introductions", description: "Hola, buenos días, mucho gusto — first 30 seconds of every conversation.", expected_count: 2 },
  { id: "ser_estar_intro", level: "A1", title: "Ser vs estar — the introduction", description: "Two verbs that both mean 'to be' in English. Get the distinction now, save yourself years.", expected_count: 2 },
  { id: "gendered_nouns", level: "A1", title: "Gender & articles", description: "Every Spanish noun is masculine or feminine. Learn the articles, not the words.", expected_count: 2 },
  { id: "present_tense", level: "A1", title: "Present tense", description: "Regular -ar/-er/-ir conjugations plus the most common irregulars.", expected_count: 2 },
  { id: "numbers", level: "A1", title: "Numbers", description: "0-100, prices, and Spain's weird thirty-pattern that breaks the rule.", expected_count: 2 },
  { id: "time_dates", level: "A1", title: "Time & dates", description: "¿Qué hora es? — telling time, days of the week, months.", expected_count: 1 },
  { id: "family", level: "A1", title: "Family", description: "Padre, madre, hermano. Why you say tu madre even talking to your friend.", expected_count: 1 },
  { id: "food_basics", level: "A1", title: "Food & ordering", description: "Café con leche, una caña, la cuenta. Survival vocabulary for any cafe.", expected_count: 2 },
  { id: "questions", level: "A1", title: "Question words", description: "Qué, cómo, cuándo, dónde — and the upside-down ¿ that throws everyone.", expected_count: 2 },
  // A2 — ~18 lessons across 8 categories
  { id: "past_tense_intro", level: "A2", title: "Past tense — preterite intro", description: "The 'something happened once' tense. The most-used past tense in spoken Spanish.", expected_count: 2 },
  { id: "reflexive_verbs", level: "A2", title: "Reflexive verbs", description: "Me llamo, me ducho — verbs that act on yourself. Surprisingly common.", expected_count: 2 },
  { id: "object_pronouns", level: "A2", title: "Direct & indirect object pronouns", description: "Lo, la, le, se — the tiny words that change everything.", expected_count: 2 },
  { id: "comparatives", level: "A2", title: "Comparisons", description: "Más que, menos que, tan como — comparing things.", expected_count: 2 },
  { id: "weather", level: "A2", title: "Weather & seasons", description: "Hace frío, está lloviendo. Notice — already two different verbs for weather.", expected_count: 2 },
  { id: "daily_routine", level: "A2", title: "Daily routine", description: "What you do every day — reflexive verbs in the wild.", expected_count: 2 },
  { id: "shopping", level: "A2", title: "Shopping", description: "¿Cuánto cuesta? Bargaining (LatAm), fixed prices (Spain), sizes & colors.", expected_count: 3 },
  { id: "directions", level: "A2", title: "Directions", description: "A la derecha, todo recto. Getting lost in Madrid is a Spanish lesson.", expected_count: 3 },
  // B1 — ~22 lessons across 8 categories
  { id: "preterite_vs_imperfect", level: "B1", title: "Preterite vs imperfect", description: "Two past tenses. The hardest grammar decision in Spanish — explained without the textbook fog.", expected_count: 3 },
  { id: "subjunctive_intro", level: "B1", title: "Subjunctive — first encounter", description: "Doubt, emotion, wishes. Why ojalá always triggers subjunctive.", expected_count: 3 },
  { id: "future_conditional", level: "B1", title: "Future & conditional", description: "Iré, iría. Plus the speculative future (es la una — must be one o'clock).", expected_count: 3 },
  { id: "por_vs_para", level: "B1", title: "Por vs para", description: "Both mean 'for'. They are not interchangeable. Real rules, not made-up mnemonics.", expected_count: 3 },
  { id: "travel", level: "B1", title: "Travel", description: "Booking, airports, complaints, getting around. Spain-tourist-friendly + LatAm border-crossing differences.", expected_count: 3 },
  { id: "work", level: "B1", title: "Work", description: "Job interviews, office Spanish, talking to clients. Usted vs tú in professional settings.", expected_count: 3 },
  { id: "health", level: "B1", title: "Health", description: "Doctor visits, pharmacy, body parts. Me duele la cabeza vs Tengo dolor de cabeza — both are correct.", expected_count: 2 },
  { id: "opinions", level: "B1", title: "Opinions & arguments", description: "Creo que, no creo que. Subjunctive after negative belief — the rule that catches everyone.", expected_count: 2 },
  // B2 — ~18 lessons across 6 categories
  { id: "subjunctive_mastery", level: "B2", title: "Subjunctive mastery", description: "Compound tenses, sequence of tenses, si-clauses — the full machinery.", expected_count: 3 },
  { id: "passive_voice", level: "B2", title: "Passive voice", description: "Spanish prefers active voice. Three ways to do passive when you need it.", expected_count: 3 },
  { id: "idioms", level: "B2", title: "Idioms", description: "Estar como una cabra, tomar el pelo. Idioms native speakers actually use.", expected_count: 3 },
  { id: "business_spanish", level: "B2", title: "Business Spanish", description: "Email register, meetings, negotiation. Iberian vs Latin American business culture.", expected_count: 3 },
  { id: "news_comprehension", level: "B2", title: "News comprehension", description: "Reading El País, RTVE, Univision. Headline conventions, political vocabulary.", expected_count: 3 },
  { id: "debate_basics", level: "B2", title: "Debate basics", description: "Disagreeing politely, conceding a point, arguing in a register that won't get you sidelined.", expected_count: 3 },
  // C1 — ~18 lessons across 5 categories
  { id: "advanced_subjunctive", level: "C1", title: "Advanced subjunctive", description: "Subjunctive in relative clauses, after concession, in formal/literary register.", expected_count: 4 },
  { id: "register_shifts", level: "C1", title: "Register shifts", description: "Code-switching between vos/tú/usted, formal correspondence, slang awareness.", expected_count: 4 },
  { id: "literary_tenses", level: "C1", title: "Literary tenses", description: "Pretérito anterior, future subjunctive — tenses you'll see in print, never hear spoken.", expected_count: 4 },
  { id: "rhetoric", level: "C1", title: "Rhetoric", description: "Persuasion, argumentation, the structure of a Spanish-language op-ed.", expected_count: 3 },
  { id: "professional_writing", level: "C1", title: "Professional writing", description: "Reports, proposals, formal correspondence. Tone calibration for high-stakes contexts.", expected_count: 3 },
  // C2 — ~18 lessons across 5 categories
  { id: "idiomatic_mastery", level: "C2", title: "Idiomatic mastery", description: "Regional idioms, dated expressions, idiom families. The 'how Spanish actually feels' layer.", expected_count: 4 },
  { id: "sociolinguistics", level: "C2", title: "Sociolinguistics", description: "Class markers, regional accents, gendered language debates, Spanglish.", expected_count: 4 },
  { id: "satire_irony", level: "C2", title: "Satire & irony", description: "El Mundo Today, Quevedo, the Spanish tradition of biting humor.", expected_count: 4 },
  { id: "advanced_debate", level: "C2", title: "Advanced debate", description: "Live political debate registers, simultaneous-interpretation Spanish, academic argumentation.", expected_count: 3 },
  { id: "literary_analysis", level: "C2", title: "Literary analysis", description: "Reading García Márquez, Borges, Cervantes. Analytical vocabulary, period-appropriate language.", expected_count: 3 },
];

// ── Lesson shape ────────────────────────────────────────────────────────

export type SpanishSentence = {
  spanish: string;
  english: string;
  pronunciation: string;
  pronunciation_focus?: string[];
  note?: string;
};

export type SpanishGender = "m" | "f" | "mf" | "n";

export type SpanishRegional = {
  region: string; // e.g. "Spain", "Mexico", "Argentina", "LatAm general"
  form: string;
  note?: string;
};

export type SpanishVocabEntry = {
  word: string;
  english: string;
  pronunciation: string;
  part_of_speech: string;
  gender?: SpanishGender;
  plural?: string;
  regional?: SpanishRegional[];
};

export type SpanishDialogueLine = {
  speaker: string;
  spanish: string;
  english: string;
  pronunciation: string;
  register?: "formal" | "neutral" | "informal";
};

export type SpanishGrammarExample = {
  spanish: string;
  english: string;
};

export type SpanishGrammarPoint = {
  point: string;
  explanation: string;
  examples?: SpanishGrammarExample[];
};

export type SpanishRegionalVariant = {
  meaning: string;     // English description of what the word means
  peninsular: string;  // Spain form
  latam: string;       // LatAm form
  note?: string;
};

export type SpanishIdiomGloss = {
  idiom: string;
  literal: string;
  figurative: string;
  usage: string;
  region?: string;
};

export type SpanishExerciseItem = {
  prompt: string;
  answer: string;
};

export type SpanishExercise =
  | { type: "fill_blank"; instruction: string; items: SpanishExerciseItem[] }
  | { type: "matching"; instruction: string; items: SpanishExerciseItem[] }
  | { type: "translation"; instruction: string; items: SpanishExerciseItem[] };

export type SpanishLesson = {
  id: string;
  level: SpanishCefrLevel;
  category: SpanishCategoryId;
  title: string;        // English title shown to the learner
  subtitle?: string;    // optional Spanish subtitle (e.g. native-language teaser)
  intro?: string;       // optional intro paragraph in English
  sentences: SpanishSentence[];
  vocabulary?: SpanishVocabEntry[];
  dialogue?: SpanishDialogueLine[];
  dialogue_long?: SpanishDialogueLine[];
  grammar?: SpanishGrammarPoint[];
  exercises?: SpanishExercise[];
  cultural_note?: string;
  tip?: string;
  register_note?: string;
  regional_variants?: SpanishRegionalVariant[];
  idiom_glosses?: SpanishIdiomGloss[];
  roleplay_prompts?: string[];
};

// ── Lazy lesson registry ────────────────────────────────────────────────
//
// Mirrors src/languages/french/lessons.ts. All six lessons-{level}.ts
// files are fully populated; these loader functions stay []-returning
// stubs by design. The page resolves lessons via fetchLessonsBatch
// (Supabase) at runtime — these locals are just the API surface
// preserved for any direct importers.

const _cache = new Map<string, SpanishLesson[]>();

export async function loadSpanishLessonsForLevel(
  _level: SpanishCefrLevel,
): Promise<SpanishLesson[]> {
  return [];
}

export async function loadAllSpanishLessons(): Promise<SpanishLesson[]> {
  return [];
}

export function getCachedSpanishLessons(): SpanishLesson[] {
  const all: SpanishLesson[] = [];
  for (const arr of _cache.values()) all.push(...arr);
  return all;
}

export function getCachedSpanishLessonsByLevel(
  level: SpanishCefrLevel,
): SpanishLesson[] {
  return _cache.get(level) ?? [];
}

export function getSpanishLessonsByCategory(
  category: SpanishCategoryId,
): SpanishLesson[] {
  const out: SpanishLesson[] = [];
  for (const arr of _cache.values()) {
    for (const l of arr) if (l.category === category) out.push(l);
  }
  return out;
}

export function getSpanishLessonById(id: string): SpanishLesson | undefined {
  for (const arr of _cache.values()) {
    const found = arr.find((l) => l.id === id);
    if (found) return found;
  }
  return undefined;
}

// Actual shipped lesson count across all six levels (A1 14 + A2 15 +
// B1 20 + B2 25 + C1 20 + C2 15). Per-level lessons-{level}.ts files are
// the runtime source of truth; this constant feeds the page hero subtitle.
export const SPANISH_TOTAL_LESSONS = 109;
