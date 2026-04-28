// SM-2 spaced-repetition algorithm — pure on (state, rating, nowMs).
//
// Tunables follow the brief:
//   rating 0 (again): repetitions=0, interval_days=0, next=tomorrow,
//                     ease unchanged but floored at 1.3.
//   rating 3 (hard) : interval = max(1, round(prev * 1.2)),
//                     ease = max(1.3, ease - 0.15), reps += 1.
//   rating 4 (good) : reps=0 → 1d, reps=1 → 6d, else round(prev * ease).
//                     Ease unchanged. reps += 1.
//   rating 5 (easy) : same shape as good; mature branch multiplied by
//                     1.3 and ease += 0.15. reps += 1.
//
// Notes
//   - For rating 0 we deliberately store interval_days=0 (the "lapsed"
//     marker) while still scheduling next_review_at = +1 day. The
//     scheduler reads next_review_at; the 0 in interval_days survives
//     so review_log can show "this card lapsed."
//   - For the "good" mature case the brief says `prev * ease`. We
//     enforce a floor of 1 so a card with prev=0 never schedules in
//     the past after a successful review.
//   - For "easy" the 1.3 multiplier and the ease bump are independent
//     additive boosts; we apply them on top of the "good" ladder.

export type Rating = 0 | 3 | 4 | 5;

export type CardState = {
  /** Successful-review counter. Reset to 0 on rating 0; +1 on 3/4/5. */
  repetitions: number;
  /** Days until the next scheduled review. Always ≥ 0. */
  interval_days: number;
  /** Ease factor. Floored at 1.3. No hard upper bound. */
  ease: number;
  /** Epoch ms for the next scheduled review. */
  next_review_at: number;
};

export const MIN_EASE = 1.3;
export const DEFAULT_EASE = 2.5;
export const DAY_MS = 24 * 60 * 60 * 1000;

/** Build a fresh card scheduled to review immediately. */
export function freshCard(nowMs: number = Date.now()): CardState {
  return {
    repetitions: 0,
    interval_days: 0,
    ease: DEFAULT_EASE,
    next_review_at: nowMs,
  };
}

/** Apply one review rating. Pure: no I/O, no clocks beyond nowMs. */
export function applyReview(
  state: CardState,
  rating: Rating,
  nowMs: number,
): CardState {
  const prevReps = state.repetitions;
  const prevInterval = state.interval_days;
  const prevEase = state.ease;

  if (rating === 0) {
    return {
      repetitions: 0,
      interval_days: 0,
      ease: Math.max(MIN_EASE, prevEase),
      next_review_at: nowMs + DAY_MS,
    };
  }

  if (rating === 3) {
    const nextEase = Math.max(MIN_EASE, prevEase - 0.15);
    const nextInterval = Math.max(1, Math.round(prevInterval * 1.2));
    return {
      repetitions: prevReps + 1,
      interval_days: nextInterval,
      ease: nextEase,
      next_review_at: nowMs + nextInterval * DAY_MS,
    };
  }

  // rating 4 (good) or 5 (easy) — same reps ladder, easy gets bonus.
  const goodInterval =
    prevReps === 0
      ? 1
      : prevReps === 1
      ? 6
      : Math.max(1, Math.round(prevInterval * prevEase));

  if (rating === 4) {
    return {
      repetitions: prevReps + 1,
      interval_days: goodInterval,
      ease: prevEase,
      next_review_at: nowMs + goodInterval * DAY_MS,
    };
  }

  // rating === 5 (easy)
  const nextEase = prevEase + 0.15;
  const easyInterval = Math.max(1, Math.round(goodInterval * 1.3));
  return {
    repetitions: prevReps + 1,
    interval_days: easyInterval,
    ease: nextEase,
    next_review_at: nowMs + easyInterval * DAY_MS,
  };
}

/** Clamp helper — kept exported because the repository uses it on writes. */
export function clampEase(ease: number): number {
  if (!Number.isFinite(ease)) return DEFAULT_EASE;
  return Math.max(MIN_EASE, ease);
}
