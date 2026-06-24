export {
  RUSSIAN_CATEGORIES,
  RUSSIAN_LANGUAGE_META,
  RUSSIAN_LEVEL_COUNTS,
  RUSSIAN_TOTAL_LESSONS,
  getLessonById,
  getLessonsByCategory,
  loadAllLessons,
  loadLessonsForLevel,
} from "./lessons";
export type {
  RussianCategoryId,
  RussianCefrLevel,
  RussianDialogueLine,
  RussianExercise,
  RussianLesson,
  RussianSentence,
  RussianVocabEntry,
} from "./lessons";
export { normalizeRussianLesson } from "./normalize";

// --- Standalone content batches (A1–C2 + survival) ---
// These ship as self-contained modules and are intentionally NOT wired into the
// level loader in `lessons.ts` (which keeps B2/C1/C2 at 0 so the foundation
// batch and its tests stay unchanged). They are surfaced here so the full
// Russian content set is discoverable through the language module.
export { lessons as russianA1CoreLessons } from "./lessons-a1-core";
export { lessons as russianA2CoreLessons } from "./lessons-a2-core";
export { lessons as russianB1CoreLessons } from "./lessons-b1-core";
export { lessons as russianB2CoreLessons } from "./lessons-b2-core";
export { lessons as russianC1ReadingListeningLessons } from "./lessons-c1-reading-listening";
export { lessons as russianC1SpeakingWritingLessons } from "./lessons-c1-speaking-writing";
export { lessons as russianC2DiscourseLessons } from "./lessons-c2-discourse";
export { lessons as russianC2DomainsLessons } from "./lessons-c2-domains";
export {
  lessons as russianSurvivalLessons,
  SURVIVAL_LESSON_COUNT,
} from "./lessons-survival";

// --- Language-level data: vocabulary ---
export {
  RUSSIAN_VOCABULARY,
  RUSSIAN_VOCABULARY_COUNT,
  RUSSIAN_VOCABULARY_TOPICS,
  getRussianVocabularyByLevel,
  getRussianVocabularyByTopic,
} from "./vocabulary";
export type {
  RussianVocabItem,
  RussianVocabLevel,
  RussianVocabTopic,
} from "./vocabulary";

// --- Language-level data: Vietnamese-learner error patterns ---
export {
  RUSSIAN_ERROR_BUCKETS,
  RUSSIAN_ERROR_PATTERNS,
  RUSSIAN_ERROR_PATTERN_COUNT,
  getRussianErrorPatternsByBucket,
} from "./errorPatterns";
export type {
  RussianErrorBucket,
  RussianErrorPattern,
} from "./errorPatterns";
