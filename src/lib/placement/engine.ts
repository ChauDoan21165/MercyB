// src/lib/placement/engine.ts
//
// MercyBlade placement-test adaptive engine — v0.
//
// Pure TypeScript. Deterministic. No runtime AI. No I/O. Takes a pool of
// questions and a sequence of answers, returns the final CEFR estimate
// and a full per-question response log ready to persist to Supabase.
//
// Design decisions (per Chau's Phase 1 + Phase 2 approvals):
// - Starting estimate: 3.0 (B1 — mid-scale)
// - Step schedule shrinks each question so the estimate settles
// - Minimum 8 questions, maximum 15, target 12
// - Early-convergence stop: after min=8, if last 3 deltas all have
//   |delta| ≤ 0.3, commit current estimate
// - Question selection: closest in difficulty to current estimate,
//   with id ordering as deterministic tiebreak (so tests are stable)
// - Estimate clamped to [0.5, 6.5] so floor/ceiling users don't drift
//   into invalid CEFR buckets
// - Finish-early: allowed at Q8+; commits current estimate
// - No per-question right/wrong feedback surfaced (UI never reads the
//   `correct` field during the test; it only appears on the results
//   screen and in the persistence payload)
// - viRevealed reading discount (Option A): a correct answer on a
//   reading-comprehension item where the learner revealed the parallel
//   Vietnamese translation is NOT evidence of English ability at the
//   item's difficulty — needing the L1 crutch is evidence the learner
//   is BELOW it. The response log still records `correct: true` (they
//   did pick the right English option, so weakness/SRS signal is
//   preserved and no false weakness is flagged); only the level
//   estimate is discounted. In this fixed-step ladder the faithful
//   analog of "credit at a lower level than the item targets" is a
//   downward step, identical in magnitude to a wrong answer. MC items
//   are unaffected (their options are English-only, vi === en — there
//   is no translation to lean on), so the discount is gated on
//   type === 'reading_comprehension'.

import { PLACEMENT_QUESTIONS, type CEFR, type PlacementQuestion } from './questions';

export type ResultCEFR = CEFR | 'pre_a1';

export type QuestionResponse = {
  questionId: string;
  cefr: CEFR;
  difficulty: number;
  selectedOptionId: 'a' | 'b' | 'c' | 'd' | null;
  correct: boolean;
  viRevealed: boolean;
  elapsedMs: number;
  /** Copied from the question's weaknessTag when present. Present on every
   *  response so the persisted log is self-describing; also drives the
   *  derivation of EngineSnapshot.weaknessFlags on commit. */
  weaknessTag?: string;
};

export type EngineSnapshot = {
  /** The question to show the user right now, or null when isDone. */
  currentQuestion: PlacementQuestion | null;
  /** 1-indexed ordinal of currentQuestion, or the total count when done. */
  questionCount: number;
  /** Fixed target for the progress bar; bar fills as questionCount / estimatedTotal. */
  estimatedTotal: number;
  /** True once the user has answered at least `minQuestions` and is not yet done. */
  canFinishEarly: boolean;
  /** True once the engine has committed a final CEFR. */
  isDone: boolean;
  /** Immutable copy of the per-question responses gathered so far. */
  responses: QuestionResponse[];
  /** Current numeric estimate, 0.5..6.5. Never surfaced to the user during the test. */
  estimate: number;
  /** Set once isDone becomes true. */
  finalCefr: ResultCEFR | null;
  /**
   * Diagnostic tags for questions the user was asked AND got wrong
   * (only questions with a weaknessTag contribute). Empty array until
   * isDone. Used on the Results screen for targeted tips and in Wave 2
   * for SRS review scheduling. Deduplicated, preserves ask order.
   */
  weaknessFlags: string[];
};

export type EngineOptions = {
  initialEstimate?: number;
  pool?: PlacementQuestion[];
  minQuestions?: number;
  maxQuestions?: number;
  targetQuestions?: number;
};

export type SubmitParams = {
  selectedOptionId: 'a' | 'b' | 'c' | 'd' | null;
  viRevealed?: boolean;
  elapsedMs?: number;
};

export interface PlacementEngine {
  getState(): EngineSnapshot;
  submit(params: SubmitParams): void;
  /** Commits the current estimate. No-op if questionCount < minQuestions or already done. */
  finishEarly(): void;
}

const DEFAULT_STEP_SCHEDULE: number[] = [
  1.0, // after Q1
  0.8, // after Q2
  0.6, // after Q3
  0.5, // after Q4
  0.4, // after Q5
  0.35, // after Q6
  0.3, // after Q7
  0.25, // after Q8
  0.22, // after Q9
  0.2, // after Q10
  0.2, // after Q11
  0.2, // after Q12
  0.18, // after Q13
  0.15, // after Q14
  0.12, // after Q15 (no effect; hard stop already)
];

const MIN_ESTIMATE = 0.5;
const MAX_ESTIMATE = 6.5;
const CONVERGENCE_DELTA = 0.3;
const CONVERGENCE_WINDOW = 3;

/**
 * Map a numeric estimate (clamped 0.5..6.5) to a CEFR bucket. Bands are
 * 1.0 wide and centered on each integer difficulty. Boundary behavior
 * (exactly on 1.5, 2.5, …) rounds up to the higher band, consistent
 * with Math.round semantics for half-integers.
 */
export function mapEstimateToCefr(estimate: number): ResultCEFR {
  if (estimate < 0.75) return 'pre_a1';
  if (estimate < 1.5) return 'A1';
  if (estimate < 2.5) return 'A2';
  if (estimate < 3.5) return 'B1';
  if (estimate < 4.5) return 'B2';
  if (estimate < 5.5) return 'C1';
  return 'C2';
}

function clamp(value: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, value));
}

function pickNextQuestion(
  unasked: PlacementQuestion[],
  estimate: number,
): PlacementQuestion | null {
  if (unasked.length === 0) return null;
  // Sort by distance to estimate (ascending), then by id ascending for a
  // deterministic tiebreak. Tiebreak by id keeps unit tests stable.
  const sorted = [...unasked].sort((a, b) => {
    const da = Math.abs(a.difficulty - estimate);
    const db = Math.abs(b.difficulty - estimate);
    if (da !== db) return da - db;
    if (a.id < b.id) return -1;
    if (a.id > b.id) return 1;
    return 0;
  });
  return sorted[0];
}

export function createPlacementEngine(
  opts: EngineOptions = {},
): PlacementEngine {
  const {
    initialEstimate = 3,
    pool = PLACEMENT_QUESTIONS,
    minQuestions = 8,
    maxQuestions = 15,
    targetQuestions = 12,
  } = opts;

  let estimate = initialEstimate;
  let answeredCount = 0;
  let currentQuestion: PlacementQuestion | null = null;
  let isDone = false;
  let finalCefr: ResultCEFR | null = null;
  let weaknessFlags: string[] = [];
  const responses: QuestionResponse[] = [];
  const recentDeltas: number[] = [];

  // Prime the first question.
  currentQuestion = pickNextQuestion(pool, estimate);
  if (!currentQuestion) {
    // Empty pool — complete immediately with the initial estimate.
    isDone = true;
    finalCefr = mapEstimateToCefr(estimate);
  }

  function unaskedPool(): PlacementQuestion[] {
    const askedIds = new Set(responses.map((r) => r.questionId));
    if (currentQuestion) askedIds.add(currentQuestion.id);
    return pool.filter((q) => !askedIds.has(q.id));
  }

  function shouldStop(): boolean {
    if (answeredCount >= maxQuestions) return true;
    if (answeredCount >= targetQuestions) return true;
    if (
      answeredCount >= minQuestions &&
      recentDeltas.length >= CONVERGENCE_WINDOW
    ) {
      const window = recentDeltas.slice(-CONVERGENCE_WINDOW);
      if (window.every((d) => Math.abs(d) <= CONVERGENCE_DELTA)) return true;
    }
    return false;
  }

  function commitFinal(): void {
    isDone = true;
    finalCefr = mapEstimateToCefr(estimate);
    currentQuestion = null;
    // Derive weaknessFlags: tagged questions the user got wrong. Preserve
    // ask order and dedupe defensively (today each tag appears on exactly
    // one question, but future additions may reuse tags).
    const seen = new Set<string>();
    weaknessFlags = [];
    for (const r of responses) {
      if (r.correct) continue;
      const tag = r.weaknessTag;
      if (!tag) continue;
      if (seen.has(tag)) continue;
      seen.add(tag);
      weaknessFlags.push(tag);
    }
  }

  return {
    getState(): EngineSnapshot {
      // While still testing, questionCount is the 1-indexed position of
      // currentQuestion: equal to answeredCount + 1 whenever a question is
      // on screen. After completion, it's the total answered.
      const visibleCount = isDone
        ? answeredCount
        : answeredCount + (currentQuestion ? 1 : 0);

      return {
        currentQuestion,
        questionCount: visibleCount,
        estimatedTotal: targetQuestions,
        canFinishEarly: !isDone && answeredCount >= minQuestions,
        isDone,
        responses: responses.slice(),
        estimate,
        finalCefr,
        weaknessFlags: weaknessFlags.slice(),
      };
    },

    submit(params: SubmitParams): void {
      if (isDone || !currentQuestion) return;

      const { selectedOptionId, viRevealed = false, elapsedMs = 0 } = params;
      const answered = currentQuestion;

      const correct =
        selectedOptionId !== null &&
        selectedOptionId === answered.correctOptionId;

      responses.push({
        questionId: answered.id,
        cefr: answered.cefr,
        difficulty: answered.difficulty,
        selectedOptionId,
        correct,
        viRevealed,
        elapsedMs,
        weaknessTag: answered.weaknessTag,
      });

      // Step schedule is indexed by questions-already-answered. On the
      // first submit, answeredCount is 0 → SCHEDULE[0] = 1.0.
      const scheduleIndex = Math.min(
        answeredCount,
        DEFAULT_STEP_SCHEDULE.length - 1,
      );
      const step = DEFAULT_STEP_SCHEDULE[scheduleIndex];

      // viRevealed reading discount (Option A — see header). A correct
      // reading answer obtained after revealing the Vietnamese passage is
      // scored DOWN (evidence the learner is below this item), not up.
      // `correct` stays true in the pushed response above, so the audit
      // log, weaknessFlags, and Wave-2 SRS are untouched; only the
      // level-estimate delta below is affected.
      const viReadingCrutch =
        correct &&
        viRevealed &&
        answered.type === 'reading_comprehension';
      const countsUp = correct && !viReadingCrutch;

      const previousEstimate = estimate;
      const delta = countsUp ? step : -step;
      estimate = clamp(estimate + delta, MIN_ESTIMATE, MAX_ESTIMATE);
      recentDeltas.push(estimate - previousEstimate);

      answeredCount += 1;
      currentQuestion = null;

      if (shouldStop()) {
        commitFinal();
        return;
      }

      currentQuestion = pickNextQuestion(unaskedPool(), estimate);
      if (!currentQuestion) {
        // Pool exhausted before the stopping rules — commit what we have.
        commitFinal();
      }
    },

    finishEarly(): void {
      if (isDone) return;
      if (answeredCount < minQuestions) return;
      commitFinal();
    },
  };
}
