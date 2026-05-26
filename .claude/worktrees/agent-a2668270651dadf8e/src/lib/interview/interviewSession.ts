// src/lib/interview/interviewSession.ts
//
// Step 7 (AI Teacher v2) — orchestrator for a mock-interview session.
//
// Responsibilities:
//   - startSession: create an interview_sessions row tied to the user
//     and a scenario slug.
//   - submitAnswer: append the user's answer for question N into
//     `answers` jsonb, score it with the writing-feedback rubric, and
//     persist the per-answer feedback alongside the raw rubric so the
//     summary page can render dimension-level breakdowns.
//   - getSessionFeedback: project the saved row into structured per-
//     question feedback for the summary screen, plus an aggregated
//     rubric, top-3 issue list across all answers, and 1–2 micro-lesson
//     suggestions tied to those issues.
//
// Design notes:
//   - The `EssayScore` shape is preserved so the persisted jsonb
//     remains backwards-compatible with sessions written before the
//     real rubric wiring. The rubric is added as an OPTIONAL field on
//     the score so legacy rows still load.
//   - `interview_sessions` schema is unchanged — answers stays jsonb.
//   - Errors degrade gracefully — every public function returns a
//     tagged result, never throws.
//   - All Supabase access is concentrated here so the page components
//     stay declarative.
//
// Spoken-style leniency:
//   The rubric was designed for written essays. Interview answers are
//   short and conversational, so we cap the structure-dimension floor
//   at 2 before blending it into the overall — a 60-word spoken reply
//   shouldn't be punished for having no "in conclusion" closer.

import { supabase } from "@/lib/supabaseClient";
import {
  getScenarioBySlug,
  type InterviewScenario,
} from "@/data/mock-interviews/scenarios";
import { scoreEssay } from "@/lib/writing-feedback/scoreEssay";
import { emptyRubric, type WritingRubric } from "@/lib/writing-feedback/rubric";
import type { L1WeaknessTag } from "@/lib/feedback/l1-error-detector";
import {
  MICRO_LESSONS,
  type MicroLesson,
} from "@/lib/weakness/micro-lessons";
import type { WeaknessTag } from "@/lib/weakness/weakness-catalog";

// ── Types ─────────────────────────────────────────────────────────────────

export type EssayScore = {
  /** 0..1 overall score (blended dimensions, with spoken-style leniency). */
  overall: number;
  grammar: number;
  clarity: number;
  relevance: number;
  /** First L1 issue surfaced by the rubric, if any. */
  l1WeaknessTag: L1WeaknessTag | null;
  /** Short bilingual summary the UI surfaces verbatim. */
  feedback_vi: string;
  feedback_en: string;
  /**
   * Full per-answer rubric. Optional only because rows written before
   * this PR don't have it; new submissions always populate it.
   */
  rubric?: WritingRubric;
};

export type InterviewAnswer = {
  questionIndex: number;
  /** What the learner typed (or transcribed). */
  text: string;
  /** Wall-clock submission time (used for rate-limiting in future). */
  submittedAt: string;
  /** Score from the writing rubric. Frozen on submit so re-renders are stable. */
  score: EssayScore;
};

export type InterviewSession = {
  id: string;
  user_id: string;
  scenario_slug: string;
  started_at: string;
  completed_at: string | null;
  answers: InterviewAnswer[];
  overall_score: number | null;
};

export type StartSessionResult =
  | { ok: true; session: InterviewSession; scenario: InterviewScenario }
  | { ok: false; error: "scenario_not_found" | "not_signed_in" | "db_error" };

export type SubmitAnswerResult =
  | { ok: true; session: InterviewSession; answer: InterviewAnswer }
  | { ok: false; error: "session_not_found" | "invalid_question" | "db_error" };

export type MicroLessonSuggestion = {
  tag: WeaknessTag;
  title_vi: string;
  title_en: string;
};

export type SessionFeedback = {
  session: InterviewSession;
  scenario: InterviewScenario;
  perQuestion: Array<{
    questionIndex: number;
    prompt_vi: string;
    prompt_en: string;
    userAnswer: string;
    score: EssayScore;
    sample_answer_vi: string;
    sample_answer_en: string;
    what_to_listen_for: string[];
    common_mistakes_vi: string[];
  }>;
  /**
   * Mean-of-dimensions rubric across answered questions. Empty rubric
   * when no answers have been submitted yet.
   */
  aggregatedRubric: WritingRubric;
  /** Up to 3 most-common L1 grammar issues across answers, in count order. */
  topIssues: L1WeaknessTag[];
  /**
   * 1–2 micro-lesson cards tied to topIssues. Only includes tags that
   * exist in MICRO_LESSONS — unknown tags are skipped silently.
   */
  microLessonSuggestions: MicroLessonSuggestion[];
};

// ── Rubric → EssayScore adapter (pure) ────────────────────────────────────

/**
 * Spoken-style structure leniency: short interview answers shouldn't be
 * punished hard for missing "in conclusion" closers or multi-paragraph
 * structure. We floor the structure dimension at 2 before blending it
 * into the overall, so a perfectly clear 60-word reply still scores well.
 */
const STRUCTURE_FLOOR_FOR_SPOKEN = 2;

/**
 * Pure adapter that maps the writing rubric onto the persisted
 * EssayScore shape. Exported so unit tests can pin behaviour without
 * spinning up Supabase.
 */
export function rubricToEssayScore(
  text: string,
  rubric: WritingRubric,
): EssayScore {
  const trimmed = (text ?? "").trim();
  if (!trimmed) {
    return {
      overall: 0,
      grammar: 0,
      clarity: 0,
      relevance: 0,
      l1WeaknessTag: null,
      feedback_vi: "Em chưa nhập câu trả lời. Hãy thử lại nhé.",
      feedback_en: "No answer was submitted. Try again.",
      rubric,
    };
  }

  // Spoken-style leniency: cap the structure penalty.
  const lenientStructure = Math.max(
    rubric.structure.score,
    STRUCTURE_FLOOR_FOR_SPOKEN,
  );
  const blendedSum =
    rubric.grammar.score +
    rubric.vocabulary.score +
    lenientStructure +
    rubric.spelling_punctuation.score +
    rubric.coherence.score;
  const overall = clamp01(blendedSum / 25); // five dims × 5

  const grammar = clamp01(rubric.grammar.score / 5);
  const clarity = clamp01(rubric.coherence.score / 5);
  // No "expected answer" exists for free-form interviews, so we treat
  // vocabulary range as the closest stand-in for relevance — a learner
  // who reaches for richer words is usually closer to the prompt than
  // someone repeating "good, good, good".
  const relevance = clamp01(rubric.vocabulary.score / 5);

  const firstIssue = rubric.grammar.issues[0] ?? null;
  const issueCount = rubric.grammar.issues.length;
  const spellingErrorCount = rubric.spelling_punctuation.errors.length;

  const { feedback_vi, feedback_en } = buildFeedback({
    overall,
    issueCount,
    spellingErrorCount,
    firstIssue,
    notes: rubric.coherence.notes,
  });

  return {
    overall,
    grammar,
    clarity,
    relevance,
    l1WeaknessTag: firstIssue,
    feedback_vi,
    feedback_en,
    rubric,
  };
}

function buildFeedback(args: {
  overall: number;
  issueCount: number;
  spellingErrorCount: number;
  firstIssue: L1WeaknessTag | null;
  notes: string[];
}): { feedback_vi: string; feedback_en: string } {
  const { overall, issueCount, spellingErrorCount, firstIssue, notes } = args;

  if (overall >= 0.85 && issueCount === 0 && spellingErrorCount === 0) {
    return {
      feedback_vi: "Câu trả lời rất tốt — rõ ràng, đúng ngữ pháp, có ví dụ.",
      feedback_en: "Strong answer — clear, accurate, and concrete.",
    };
  }
  if (overall >= 0.65) {
    const note = notes[0] ?? "";
    return {
      feedback_vi: note
        ? `Khá tốt. ${note}`
        : "Khá tốt — tiếp tục luyện để câu trả lời tự nhiên hơn.",
      feedback_en:
        "Solid answer — keep practising for a more natural delivery.",
    };
  }
  if (overall >= 0.4) {
    const issuesPart = firstIssue
      ? ` Để ý lỗi ${labelForTag(firstIssue)}.`
      : "";
    return {
      feedback_vi: `Tạm ổn nhưng còn vài chỗ chỉnh được.${issuesPart}`,
      feedback_en: firstIssue
        ? `Okay — watch out for "${firstIssue}" in your next attempt.`
        : "Okay — try expanding your answer with one concrete example.",
    };
  }
  return {
    feedback_vi:
      "Câu trả lời cần luyện thêm — thử trả lời dài hơn và chắc ngữ pháp.",
    feedback_en:
      "More practice needed — aim for a longer answer with cleaner grammar.",
  };
}

function labelForTag(tag: L1WeaknessTag): string {
  // Short VN labels for the UI feedback line. Only the few tags that
  // appear most often need polished labels — others fall through to
  // the raw tag string, which is still readable.
  const map: Partial<Record<L1WeaknessTag, string>> = {
    vi_l1_3rd_person_s: "thiếu -s ngôi 3 (he/she/it)",
    vi_l1_past_ed: "thiếu -ed quá khứ",
    vi_l1_plural_s: "thiếu -s số nhiều",
    vi_l1_missing_be: "thiếu động từ to be",
    vi_l1_question_no_aux: "câu hỏi thiếu trợ động từ",
    vi_l1_missing_article: "thiếu mạo từ a/an/the",
    vi_l1_can_no_infinitive: "sau modal phải dùng động từ nguyên thể",
    vi_l1_double_past: "thì quá khứ kép (did + V-ed)",
    vi_l1_a_vs_an_vowel: "a vs an trước nguyên âm",
    vi_l1_comparative_double: "so sánh kép (more better)",
  };
  return map[tag] ?? tag;
}

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

// ── Aggregation helpers (pure) ────────────────────────────────────────────

/**
 * Mean rubric across the answered questions. Returns `emptyRubric()`
 * when no answers have a rubric attached. Issues + spelling errors are
 * concatenated then deduplicated. Notes are concatenated as-is — the
 * UI is responsible for rendering them sensibly.
 */
export function aggregateRubric(
  answers: readonly InterviewAnswer[],
): WritingRubric {
  const withRubric = answers
    .map((a) => a.score.rubric)
    .filter((r): r is WritingRubric => !!r);
  if (withRubric.length === 0) return emptyRubric();

  const mean = (pick: (r: WritingRubric) => number) =>
    withRubric.reduce((s, r) => s + pick(r), 0) / withRubric.length;

  const dedup = <T>(arr: T[]): T[] => Array.from(new Set(arr));

  const issues = dedup(withRubric.flatMap((r) => r.grammar.issues));
  const errors = dedup(withRubric.flatMap((r) => r.spelling_punctuation.errors));
  const vocabNotes = dedup(withRubric.flatMap((r) => r.vocabulary.notes));
  const coherenceNotes = dedup(withRubric.flatMap((r) => r.coherence.notes));

  // The aggregated CEFR estimate is the floor across the answers — the
  // weakest answer caps the session estimate.
  const cefrOrder = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
  const lowestCefr = withRubric.reduce<typeof cefrOrder[number]>(
    (lo, r) => {
      const idx = cefrOrder.indexOf(r.vocabulary.level_estimate);
      const loIdx = cefrOrder.indexOf(lo);
      return idx < loIdx ? r.vocabulary.level_estimate : lo;
    },
    "C2",
  );

  // toDimensionScore lives in rubric.ts; we re-implement its clamp inline
  // to avoid importing for one-off rounding.
  const toScore = (n: number) => Math.max(0, Math.min(5, Math.round(n))) as
    | 0 | 1 | 2 | 3 | 4 | 5;

  return {
    grammar: {
      score: toScore(mean((r) => r.grammar.score)),
      issues,
    },
    vocabulary: {
      score: toScore(mean((r) => r.vocabulary.score)),
      level_estimate: lowestCefr,
      notes: vocabNotes,
    },
    structure: {
      score: toScore(mean((r) => r.structure.score)),
      has_intro: withRubric.some((r) => r.structure.has_intro),
      has_conclusion: withRubric.some((r) => r.structure.has_conclusion),
      paragraph_count: withRubric.reduce(
        (s, r) => s + r.structure.paragraph_count,
        0,
      ),
    },
    spelling_punctuation: {
      score: toScore(mean((r) => r.spelling_punctuation.score)),
      errors,
    },
    coherence: {
      score: toScore(mean((r) => r.coherence.score)),
      notes: coherenceNotes,
    },
  };
}

/**
 * Top-N L1 grammar issues across the session, ranked by frequency.
 * Ties are broken by first appearance (questionIndex order) so the
 * "study this first" suggestion is stable for a given submission.
 */
export function topIssuesAcross(
  answers: readonly InterviewAnswer[],
  limit = 3,
): L1WeaknessTag[] {
  const counts = new Map<L1WeaknessTag, { count: number; first: number }>();
  for (const a of answers) {
    const issues = a.score.rubric?.grammar.issues ?? [];
    for (const tag of issues) {
      const prev = counts.get(tag);
      if (prev) {
        prev.count += 1;
      } else {
        counts.set(tag, { count: 1, first: a.questionIndex });
      }
    }
  }
  const sorted = Array.from(counts.entries()).sort((a, b) => {
    if (b[1].count !== a[1].count) return b[1].count - a[1].count;
    return a[1].first - b[1].first;
  });
  return sorted.slice(0, limit).map(([tag]) => tag);
}

/**
 * Look up micro-lesson suggestions for a list of L1 tags. Returns at
 * most 2 suggestions — more than that and the summary screen starts
 * feeling like a lecture. Tags that don't have a MICRO_LESSONS entry
 * are skipped silently.
 */
export function microLessonsForTags(
  tags: readonly L1WeaknessTag[],
  limit = 2,
): MicroLessonSuggestion[] {
  const out: MicroLessonSuggestion[] = [];
  for (const tag of tags) {
    if (out.length >= limit) break;
    // L1WeaknessTag and WeaknessTag share the same string values for
    // the tags MICRO_LESSONS covers; the cast is intentional and the
    // lookup is safe because of the union.
    const lesson: MicroLesson | undefined =
      MICRO_LESSONS[tag as WeaknessTag];
    if (!lesson) continue;
    out.push({
      tag: lesson.tag,
      title_vi: lesson.title.vi,
      title_en: lesson.title.en,
    });
  }
  return out;
}

// ── Storage helpers ──────────────────────────────────────────────────────

function isInterviewAnswer(value: unknown): value is InterviewAnswer {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.questionIndex === "number" &&
    typeof v.text === "string" &&
    typeof v.submittedAt === "string" &&
    !!v.score &&
    typeof v.score === "object"
  );
}

function parseAnswers(raw: unknown): InterviewAnswer[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(isInterviewAnswer);
}

function rowToSession(row: Record<string, unknown>): InterviewSession {
  return {
    id: String(row.id ?? ""),
    user_id: String(row.user_id ?? ""),
    scenario_slug: String(row.scenario_slug ?? ""),
    started_at: String(row.started_at ?? ""),
    completed_at: row.completed_at ? String(row.completed_at) : null,
    answers: parseAnswers(row.answers),
    overall_score:
      typeof row.overall_score === "number" ? row.overall_score : null,
  };
}

function computeOverall(answers: readonly InterviewAnswer[]): number | null {
  if (answers.length === 0) return null;
  const sum = answers.reduce((acc, a) => acc + a.score.overall, 0);
  return sum / answers.length;
}

// ── Public API ───────────────────────────────────────────────────────────

/**
 * Start a session for the given user and scenario. The caller passes
 * the user id explicitly (we don't read it inside this module so the
 * functions remain pure-ish and easy to test).
 */
export async function startSession(
  userId: string,
  scenarioSlug: string,
): Promise<StartSessionResult> {
  if (!userId) return { ok: false, error: "not_signed_in" };
  const scenario = getScenarioBySlug(scenarioSlug);
  if (!scenario) return { ok: false, error: "scenario_not_found" };

  try {
    const { data, error } = await supabase
      .from("interview_sessions")
      .insert({
        user_id: userId,
        scenario_slug: scenarioSlug,
        answers: [],
      })
      .select("*")
      .single();
    if (error || !data) return { ok: false, error: "db_error" };
    return {
      ok: true,
      session: rowToSession(data as Record<string, unknown>),
      scenario,
    };
  } catch {
    return { ok: false, error: "db_error" };
  }
}

/**
 * Submit (or replace) the answer for a single question. Re-submitting
 * the same questionIndex overwrites the previous attempt — the UI
 * lets the learner edit before moving on. `overall_score` and
 * `completed_at` are recomputed each call.
 */
export async function submitAnswer(
  sessionId: string,
  questionIndex: number,
  userAnswer: string,
): Promise<SubmitAnswerResult> {
  if (!sessionId) return { ok: false, error: "session_not_found" };

  try {
    const { data: row, error: readErr } = await supabase
      .from("interview_sessions")
      .select("*")
      .eq("id", sessionId)
      .single();
    if (readErr || !row) return { ok: false, error: "session_not_found" };

    const session = rowToSession(row as Record<string, unknown>);
    const scenario = getScenarioBySlug(session.scenario_slug);
    if (!scenario) return { ok: false, error: "session_not_found" };
    if (questionIndex < 0 || questionIndex >= scenario.questions.length) {
      return { ok: false, error: "invalid_question" };
    }

    const rubric = scoreEssay(userAnswer);
    const score = rubricToEssayScore(userAnswer, rubric);
    const newAnswer: InterviewAnswer = {
      questionIndex,
      text: userAnswer,
      submittedAt: new Date().toISOString(),
      score,
    };

    const merged: InterviewAnswer[] = [
      ...session.answers.filter((a) => a.questionIndex !== questionIndex),
      newAnswer,
    ].sort((a, b) => a.questionIndex - b.questionIndex);

    const overall = computeOverall(merged);
    const completed = merged.length === scenario.questions.length;

    const { data: updated, error: updateErr } = await supabase
      .from("interview_sessions")
      .update({
        answers: merged,
        overall_score: overall,
        completed_at: completed ? new Date().toISOString() : null,
      })
      .eq("id", sessionId)
      .select("*")
      .single();
    if (updateErr || !updated) return { ok: false, error: "db_error" };

    return {
      ok: true,
      session: rowToSession(updated as Record<string, unknown>),
      answer: newAnswer,
    };
  } catch {
    return { ok: false, error: "db_error" };
  }
}

/**
 * Project a saved session into structured per-question feedback for
 * the summary screen. Returns `null` if the session can't be loaded
 * or the scenario was deleted out from under it.
 */
export async function getSessionFeedback(
  sessionId: string,
): Promise<SessionFeedback | null> {
  if (!sessionId) return null;
  try {
    const { data, error } = await supabase
      .from("interview_sessions")
      .select("*")
      .eq("id", sessionId)
      .single();
    if (error || !data) return null;

    const session = rowToSession(data as Record<string, unknown>);
    const scenario = getScenarioBySlug(session.scenario_slug);
    if (!scenario) return null;

    const perQuestion = scenario.questions.map((q, i) => {
      const answer = session.answers.find((a) => a.questionIndex === i);
      return {
        questionIndex: i,
        prompt_vi: q.prompt_vi,
        prompt_en: q.prompt_en,
        userAnswer: answer?.text ?? "",
        score:
          answer?.score ??
          ({
            overall: 0,
            grammar: 0,
            clarity: 0,
            relevance: 0,
            l1WeaknessTag: null,
            feedback_vi: "Câu hỏi chưa được trả lời.",
            feedback_en: "Not answered yet.",
          } as EssayScore),
        sample_answer_vi: q.sample_answer_vi,
        sample_answer_en: q.sample_answer_en,
        what_to_listen_for: q.what_to_listen_for,
        common_mistakes_vi: q.common_mistakes_vi,
      };
    });

    const aggregatedRubric = aggregateRubric(session.answers);
    const topIssues = topIssuesAcross(session.answers, 3);
    const microLessonSuggestions = microLessonsForTags(topIssues, 2);

    return {
      session,
      scenario,
      perQuestion,
      aggregatedRubric,
      topIssues,
      microLessonSuggestions,
    };
  } catch {
    return null;
  }
}
