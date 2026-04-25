// src/lib/interview/interviewSession.ts
//
// Step 7 (AI Teacher v2) — orchestrator for a mock-interview session.
//
// Responsibilities:
//   - startSession: create an interview_sessions row tied to the user
//     and a scenario slug.
//   - submitAnswer: append the user's answer for question N into
//     `answers` jsonb, run scoreEssay (currently a stub — A3's writing
//     rubric PR will replace it), and upsert per-question feedback.
//   - getSessionFeedback: project the saved row into structured per-
//     question feedback for the summary screen.
//
// Design notes:
//   - We use jsonb arrays for `answers` because the schema is small,
//     append-only per session, and we want zero migrations when we
//     extend the per-answer payload later.
//   - Errors degrade gracefully — every public function returns a
//     tagged result, never throws. Mock interview is a "nice to have"
//     surface; a Supabase outage must not crash the page.
//   - All Supabase access is concentrated here so the page components
//     stay declarative.
//
// scoreEssay stub:
//   The real implementation (A3 — writing rubric) returns a numeric
//   grammar/clarity/relevance breakdown plus an L1 weakness tag.
//   Until that lands, the stub returns sensible defaults — enough for
//   the UI to render a credible feedback block. When A3's PR merges,
//   swap the stub import for `@/lib/writing/scoreEssay` and the call
//   sites here stay identical.

import { supabase } from "@/lib/supabaseClient";
import {
  getScenarioBySlug,
  type InterviewScenario,
} from "@/data/mock-interviews/scenarios";

// ── Types ─────────────────────────────────────────────────────────────────

export type EssayScore = {
  /** 0..1 overall score. */
  overall: number;
  grammar: number;
  clarity: number;
  relevance: number;
  /** L1-rule tag if a known Vietnamese-transfer mistake is detected. */
  l1WeaknessTag: string | null;
  /** Short bilingual summary the UI surfaces verbatim. */
  feedback_vi: string;
  feedback_en: string;
};

export type InterviewAnswer = {
  questionIndex: number;
  /** What the learner typed (or transcribed). */
  text: string;
  /** Wall-clock submission time (used for rate-limiting in future). */
  submittedAt: string;
  /** Score from `scoreEssay`. Frozen on submit so re-renders are stable. */
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
};

// ── scoreEssay STUB (replaced when A3's writing-rubric PR lands) ─────────

/**
 * Stub for A3's `scoreEssay`. Returns deterministic defaults so the
 * UI has something credible to render. Remove this and import the
 * real `scoreEssay` from `@/lib/writing/scoreEssay` once it ships.
 *
 * Heuristics in the stub (just to make the score move with input):
 *   - Empty / very short answer → low score.
 *   - Answer with at least one full sentence → mid score.
 *   - Otherwise → solid baseline so the UI doesn't look broken.
 */
const scoreEssay = (input: { text: string }): EssayScore => {
  const trimmed = (input.text ?? "").trim();
  const wordCount = trimmed ? trimmed.split(/\s+/).length : 0;

  if (wordCount === 0) {
    return {
      overall: 0,
      grammar: 0,
      clarity: 0,
      relevance: 0,
      l1WeaknessTag: null,
      feedback_vi: "Em chưa nhập câu trả lời. Hãy thử lại nhé.",
      feedback_en: "No answer was submitted. Try again.",
    };
  }
  if (wordCount < 10) {
    return {
      overall: 0.35,
      grammar: 0.4,
      clarity: 0.3,
      relevance: 0.4,
      l1WeaknessTag: null,
      feedback_vi:
        "Câu trả lời còn ngắn — phỏng vấn thực tế cần thêm ví dụ cụ thể.",
      feedback_en: "Answer is short — a real interview wants a concrete example.",
    };
  }
  return {
    overall: 0.7,
    grammar: 0.7,
    clarity: 0.75,
    relevance: 0.7,
    l1WeaknessTag: null,
    feedback_vi:
      "Câu trả lời ổn về độ dài. Khi A3 ship rubric chấm điểm thật, em sẽ thấy phản hồi chi tiết hơn.",
    feedback_en:
      "Solid length. When A3's writing rubric lands, you'll see a deeper breakdown.",
  };
};

// ── Helpers ──────────────────────────────────────────────────────────────

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
    // 1. Read current session so we can validate the question index
    //    against the scenario length and merge answers locally.
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

    const score = scoreEssay({ text: userAnswer });
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

    // 2. Persist. Use update (not insert) — session row already exists.
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

    return { session, scenario, perQuestion };
  } catch {
    return null;
  }
}

// ── Test-only ────────────────────────────────────────────────────────────

/**
 * Test-only: expose the stub so it can be referenced in unit tests.
 * Will be removed when A3's real `scoreEssay` lands.
 */
export const __scoreEssayStubForTests = scoreEssay;
