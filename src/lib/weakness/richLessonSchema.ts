// src/lib/weakness/richLessonSchema.ts
//
// Step 4 (Retention) — richer micro-lesson format.
//
// The legacy MicroLesson shape (title / concept / examples / practice /
// tip) was good for a content-count round but flat for retention UX. The
// rich format breaks the lesson into five teacher-warm sections so the
// dialog can present a story arc — Hook → Why → Pattern → Practice →
// Takeaway — and ends with a 5-question self-test quiz.
//
// Backwards-compatible by design:
//   - `fromMicroLesson(ml)` adapts every existing MicroLesson into a
//     RichLesson without losing information, so the dialog can render
//     either shape from a single code path.
//   - Old MicroLessons remain the source of truth for the full catalog.
//     RichLesson content is opt-in per tag (pilot lessons live in
//     `src/data/rich-lessons-pilot.json`; full migration deferred).
//
// `voiceover_url` is reserved for the Vietnamese TTS slot called out in
// the Step 4 brief — populated in a later round. Schema fixes the field
// now so consumers can plumb the URL through without another shape bump.

import type { BilingualText, WeaknessTag } from "./weakness-catalog";
import type { MicroLesson } from "./micro-lessons";

/** Number of self-test quiz questions every RichLesson must carry. */
export const RICH_LESSON_QUIZ_LENGTH = 5;

export interface RichLessonSection {
  en: string;
  vi: string;
  /** Optional Japanese-native English explanation — for ja-native learners. */
  ja?: string;
  /** Optional Indonesian-native English explanation — for id-native learners. */
  id?: string;
  /** Optional Thai-native English explanation — for th-native learners. */
  th?: string;
  /** Optional Hindi-native English explanation — for hi-native learners. */
  hi?: string;
  /** Optional Urdu-native English explanation — for ur-native learners. */
  ur?: string;
  /** Optional Korean-native English explanation — for ko-native learners. */
  ko?: string;
  /** Optional Chinese-native English explanation — for zh-native learners. */
  zh?: string;
}

export interface RichLessonSections {
  /** 1–2 sentence opener that hooks the learner — usually a familiar mistake. */
  hook: RichLessonSection;
  /** "Why is this hard for Vietnamese speakers?" — the cross-language contrast. */
  why: RichLessonSection;
  /** The rule, plainly stated, with the canonical wrong → right contrast. */
  pattern: RichLessonSection;
  /** Guided practice paragraph — what the learner should try saying out loud. */
  practice: RichLessonSection;
  /** One-line memory hook the learner walks away with. */
  takeaway: RichLessonSection;
}

export interface RichLessonQuizQuestion {
  /** The question text in EN + VI. */
  question: BilingualText;
  /**
   * Multiple-choice options. Empty / undefined means free-form fill-in.
   * When present, `correctAnswer` MUST be one of the entries.
   */
  options?: string[];
  /** Correct answer string (for free-form, the expected fill). */
  correctAnswer: string;
  /** Optional teaching aside shown after the learner submits. */
  explanation?: BilingualText;
}

export interface RichLesson {
  /** Must match a tag in WEAKNESS_CATALOG. */
  tag: WeaknessTag;
  /** Card / dialog header — same surface as WEAKNESS_CATALOG.shortLabel. */
  title: BilingualText;
  /** The five teacher-warm sections. */
  sections: RichLessonSections;
  /** Exactly RICH_LESSON_QUIZ_LENGTH self-test questions. */
  quiz: RichLessonQuizQuestion[];
  /** Optional Vietnamese TTS voiceover URL — populated in a later round. */
  voiceover_url?: string;
}

/**
 * Adapt a legacy MicroLesson into the RichLesson shape so old content
 * still renders in the new five-section UI without authoring effort.
 *
 * The mapping is deliberately mechanical (no "AI rewriting") so the
 * adapter is deterministic and round-trippable in tests:
 *   - hook        ← first wrong/right example pair, framed as "sound familiar?"
 *   - why         ← concept (the cross-language contrast)
 *   - pattern     ← title + first example note (or first wrong→right pair)
 *   - practice    ← stock instruction + a preview of the practice prompts
 *   - takeaway    ← tip
 *   - quiz        ← first 5 practice items, free-form
 */
export function fromMicroLesson(ml: MicroLesson): RichLesson {
  const firstExample = ml.examples[0];
  const exampleNote = firstExample?.note;

  const hook: RichLessonSection = {
    en: firstExample
      ? `Sound familiar? "${firstExample.wrong}" — actually it should be "${firstExample.right}".`
      : ml.title.en,
    vi: firstExample
      ? `Nghe quen không? "${firstExample.wrong}" — đúng phải là "${firstExample.right}".`
      : ml.title.vi,
  };

  const why: RichLessonSection = {
    en: ml.concept.en,
    vi: ml.concept.vi,
  };

  const pattern: RichLessonSection = {
    en: exampleNote
      ? `${ml.title.en}. ${exampleNote.en}`
      : firstExample
        ? `${ml.title.en}. Wrong: "${firstExample.wrong}" → Right: "${firstExample.right}".`
        : ml.title.en,
    vi: exampleNote
      ? `${ml.title.vi}. ${exampleNote.vi}`
      : firstExample
        ? `${ml.title.vi}. Sai: "${firstExample.wrong}" → Đúng: "${firstExample.right}".`
        : ml.title.vi,
  };

  const practicePreview = ml.practice
    .slice(0, 3)
    .map((p) => p.prompt)
    .join(" ");
  const practice: RichLessonSection = {
    en: practicePreview
      ? `Try filling in these blanks out loud before scrolling: ${practicePreview}`
      : "Say the sentence out loud before reading the answer.",
    vi: practicePreview
      ? `Thử điền vào chỗ trống và nói thành tiếng trước khi xem đáp án: ${practicePreview}`
      : "Hãy nói câu thành tiếng trước khi xem đáp án.",
  };

  const takeaway: RichLessonSection = {
    en: ml.tip.en,
    vi: ml.tip.vi,
  };

  const quiz: RichLessonQuizQuestion[] = buildQuizFromPractice(ml);

  return {
    tag: ml.tag,
    title: { en: ml.title.en, vi: ml.title.vi },
    sections: { hook, why, pattern, practice, takeaway },
    quiz,
  };
}

/**
 * Build a 5-question free-form quiz from a MicroLesson's practice items.
 * MICRO_LESSONS guarantees 5–8 practice items per lesson, so this always
 * produces RICH_LESSON_QUIZ_LENGTH questions for any valid input.
 */
function buildQuizFromPractice(ml: MicroLesson): RichLessonQuizQuestion[] {
  const items = ml.practice.slice(0, RICH_LESSON_QUIZ_LENGTH);
  const out: RichLessonQuizQuestion[] = items.map((p) => ({
    question: {
      en: p.prompt,
      vi: `Điền vào chỗ trống: ${p.prompt}`,
      th: `เติมคำในช่องว่าง: ${p.prompt}`,
    },
    correctAnswer: p.answer,
  }));

  // Defensive: if a (malformed) MicroLesson somehow had < 5 practice
  // items, pad with a fallback quiz item built from the concept so the
  // shape invariant holds. Real MICRO_LESSONS data is guarded by tests.
  while (out.length < RICH_LESSON_QUIZ_LENGTH) {
    out.push({
      question: {
        en: `Quick check: ${ml.title.en}.`,
        vi: `Ôn nhanh: ${ml.title.vi}.`,
        th: `ทบทวนเร็ว: ${ml.title.en}.`,
      },
      correctAnswer: ml.examples[0]?.right ?? ml.title.en,
    });
  }

  return out;
}

/**
 * Type-guard for telling a RichLesson apart from a legacy MicroLesson at
 * runtime. The dialog uses this to pick a rendering path.
 */
export function isRichLesson(value: unknown): value is RichLesson {
  if (!value || typeof value !== "object") return false;
  const v = value as Partial<RichLesson>;
  return (
    typeof v.tag === "string" &&
    !!v.sections &&
    typeof v.sections === "object" &&
    !!v.sections.hook &&
    !!v.sections.why &&
    !!v.sections.pattern &&
    !!v.sections.practice &&
    !!v.sections.takeaway &&
    Array.isArray(v.quiz)
  );
}
