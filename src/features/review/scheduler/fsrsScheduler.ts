// src/features/review/scheduler/fsrsScheduler.ts — Lane D / D1
//
// The `Scheduler` (types.ts) implemented over ts-fsrs v5. This is the ONLY
// place in the module that imports ts-fsrs: every other layer speaks our own
// `SchedulerCardState` (ms-epoch, camelCase, string `state`). Conversion in
// both directions is isolated in `toFsrsCard` / `fromFsrsCard` below.
//
// Clock discipline: `nowMs` is the only clock. We never call Date.now() here.

import {
  fsrs,
  generatorParameters,
  createEmptyCard,
  Rating,
  State,
  type Card,
  type FSRSParameters,
  type Grade,
} from "ts-fsrs";

import type {
  CardLearningState,
  ReviewGrade,
  ReviewFlowId,
  ReviewLogEntry,
  Scheduler,
  SchedulerCardState,
  SchedulerReviewResult,
} from "@/features/review/types";

// ── Options ─────────────────────────────────────────────────────────────────

/**
 * Options for {@link createScheduler}. A subset of ts-fsrs's `FSRSParameters`
 * is exposed; everything is optional and falls back to ts-fsrs defaults.
 */
export interface FsrsSchedulerOptions {
  /** Override any ts-fsrs generator parameters (request_retention, w, …). */
  parameters?: Partial<FSRSParameters>;
}

// ── Grade <-> Rating mapping ─────────────────────────────────────────────────

const GRADE_TO_RATING: Record<ReviewGrade, Grade> = {
  again: Rating.Again, // 1
  hard: Rating.Hard, // 2
  good: Rating.Good, // 3
  easy: Rating.Easy, // 4
};

// ── State <-> CardLearningState mapping ──────────────────────────────────────

const STATE_TO_LEARNING: Record<State, CardLearningState> = {
  [State.New]: "new",
  [State.Learning]: "learning",
  [State.Review]: "review",
  [State.Relearning]: "relearning",
};

const LEARNING_TO_STATE: Record<CardLearningState, State> = {
  new: State.New,
  learning: State.Learning,
  review: State.Review,
  relearning: State.Relearning,
};

// ── Conversions (the single seam to ts-fsrs's Card shape) ────────────────────

/** ts-fsrs `Card` (Date-based, snake_case, numeric state) → our state. */
export function fromFsrsCard(card: Card): SchedulerCardState {
  return {
    due: card.due.getTime(),
    stability: card.stability,
    difficulty: card.difficulty,
    elapsedDays: card.elapsed_days,
    scheduledDays: card.scheduled_days,
    reps: card.reps,
    lapses: card.lapses,
    state: STATE_TO_LEARNING[card.state],
    lastReview: card.last_review ? card.last_review.getTime() : null,
  };
}

/** Our `SchedulerCardState` → a ts-fsrs `Card`. */
export function toFsrsCard(state: SchedulerCardState): Card {
  const card: Card = {
    due: new Date(state.due),
    stability: state.stability,
    difficulty: state.difficulty,
    elapsed_days: state.elapsedDays,
    scheduled_days: state.scheduledDays,
    // learning_steps is internal to ts-fsrs (short-term scheduler bookkeeping).
    // Our contract doesn't carry it; ts-fsrs tolerates 0 here and recomputes
    // it on the next review.
    learning_steps: 0,
    reps: state.reps,
    lapses: state.lapses,
    state: LEARNING_TO_STATE[state.state],
  };
  if (state.lastReview != null) {
    card.last_review = new Date(state.lastReview);
  }
  return card;
}

// ── Interval helper ──────────────────────────────────────────────────────────

const MS_PER_DAY = 86_400_000;

/**
 * Days until the resulting card is next due. We prefer ts-fsrs's
 * `scheduled_days`, but for short-term (sub-day learning) steps that value can
 * be 0 while `due` is minutes away; in that case we derive a fractional day
 * count from `due - nowMs` so previews/labels still reflect ordering.
 */
function intervalDaysFor(card: Card, nowMs: number): number {
  if (card.scheduled_days > 0) return card.scheduled_days;
  const deltaDays = (card.due.getTime() - nowMs) / MS_PER_DAY;
  return deltaDays > 0 ? deltaDays : 0;
}

// ── The Scheduler implementation ─────────────────────────────────────────────

class FsrsScheduler implements Scheduler {
  private readonly f: ReturnType<typeof fsrs>;

  constructor(params: FSRSParameters) {
    this.f = fsrs(params);
  }

  newCard(nowMs: number): SchedulerCardState {
    const card = createEmptyCard(new Date(nowMs));
    return fromFsrsCard(card);
  }

  review(
    state: SchedulerCardState,
    grade: ReviewGrade,
    nowMs: number,
    itemId: string,
    flow: ReviewFlowId,
  ): SchedulerReviewResult {
    const now = new Date(nowMs);
    const rating = GRADE_TO_RATING[grade];
    const { card: nextCard } = this.f.next(toFsrsCard(state), now, rating);

    const resultState = fromFsrsCard(nextCard);
    const intervalDays = intervalDaysFor(nextCard, nowMs);

    const log: ReviewLogEntry = {
      itemId,
      flow,
      grade,
      reviewedAt: nowMs,
      intervalDays,
      resultingState: resultState.state,
    };

    return { state: resultState, intervalDays, log };
  }

  preview(state: SchedulerCardState, nowMs: number): Record<ReviewGrade, number> {
    const now = new Date(nowMs);
    const record = this.f.repeat(toFsrsCard(state), now);

    const intervalFor = (grade: ReviewGrade): number =>
      intervalDaysFor(record[GRADE_TO_RATING[grade]].card, nowMs);

    return {
      again: intervalFor("again"),
      hard: intervalFor("hard"),
      good: intervalFor("good"),
      easy: intervalFor("easy"),
    };
  }
}

// ── Factory ──────────────────────────────────────────────────────────────────

/** Build a {@link Scheduler} backed by ts-fsrs. */
export function createScheduler(opts?: FsrsSchedulerOptions): Scheduler {
  // `enable_short_term: false` is load-bearing. ts-fsrs's short-term (sub-day)
  // learning steps track progress in an internal `learning_steps` counter on
  // the Card. Our `SchedulerCardState` contract (types.ts) carries no such
  // field — and must not, since the rest of the module schedules in whole-day
  // terms. If short-term steps were enabled, our toFsrsCard round-trip would
  // reset `learning_steps` to 0 on every review, trapping a card forever on
  // the first 10-minute step. Disabling short-term makes a graded new card go
  // straight to day-scale Review intervals, which is exactly the state our
  // contract can faithfully represent. Callers may still override.
  const params = generatorParameters({
    enable_short_term: false,
    ...opts?.parameters,
  });
  return new FsrsScheduler(params);
}
