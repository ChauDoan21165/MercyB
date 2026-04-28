import { describe, expect, it } from "vitest";

import {
  applyReview,
  clampEase,
  DAY_MS,
  DEFAULT_EASE,
  freshCard,
  MIN_EASE,
  type CardState,
  type Rating,
} from "../sm2";

const NOW = 1_700_000_000_000;

function fresh(): CardState {
  return freshCard(NOW);
}

function mature(overrides: Partial<CardState> = {}): CardState {
  return {
    repetitions: 5,
    interval_days: 30,
    ease: 2.5,
    next_review_at: NOW,
    ...overrides,
  };
}

// ── Fresh card (reps=0) — every rating ──────────────────────────────────

describe("applyReview — fresh card (reps=0)", () => {
  it("rating 0 (again): keeps reps=0, interval=0, schedules tomorrow", () => {
    const next = applyReview(fresh(), 0, NOW);
    expect(next.repetitions).toBe(0);
    expect(next.interval_days).toBe(0);
    expect(next.next_review_at).toBe(NOW + DAY_MS);
    expect(next.ease).toBe(DEFAULT_EASE);
  });

  it("rating 3 (hard): interval=1 (floor), reps=1, ease drops by 0.15", () => {
    const next = applyReview(fresh(), 3, NOW);
    expect(next.interval_days).toBe(1);
    expect(next.repetitions).toBe(1);
    expect(next.ease).toBeCloseTo(2.35, 2);
  });

  it("rating 4 (good): interval=1, reps=1, ease unchanged", () => {
    const next = applyReview(fresh(), 4, NOW);
    expect(next.interval_days).toBe(1);
    expect(next.repetitions).toBe(1);
    expect(next.ease).toBe(DEFAULT_EASE);
  });

  it("rating 5 (easy) on reps=0: interval still rounds to 1, ease bumps", () => {
    // goodInterval is 1 for reps=0; easy multiplies by 1.3 → round(1.3) = 1.
    const next = applyReview(fresh(), 5, NOW);
    expect(next.interval_days).toBe(1);
    expect(next.repetitions).toBe(1);
    expect(next.ease).toBeCloseTo(2.65, 2);
  });
});

// ── Graduating card (reps=1, interval=1) ────────────────────────────────

describe("applyReview — graduating card (reps=1)", () => {
  const card: CardState = {
    repetitions: 1,
    interval_days: 1,
    ease: DEFAULT_EASE,
    next_review_at: NOW,
  };

  it("rating 4: interval steps to 6 days at the 1→6 boundary", () => {
    const next = applyReview(card, 4, NOW);
    expect(next.interval_days).toBe(6);
    expect(next.repetitions).toBe(2);
    expect(next.next_review_at).toBe(NOW + 6 * DAY_MS);
  });

  it("rating 5: gets the 1.3x bonus over good (6 → 8)", () => {
    const next = applyReview(card, 5, NOW);
    expect(next.interval_days).toBe(8); // round(6 * 1.3) = 8
    expect(next.repetitions).toBe(2);
    expect(next.ease).toBeCloseTo(2.65, 2);
  });

  it("rating 3: interval = max(1, round(1 * 1.2)) = 1", () => {
    const next = applyReview(card, 3, NOW);
    expect(next.interval_days).toBe(1);
    expect(next.repetitions).toBe(2);
  });
});

// ── Mature card (reps>2) — every rating ────────────────────────────────

describe("applyReview — mature card", () => {
  it("rating 4 (good): interval = round(prev * ease) = round(30 * 2.5) = 75", () => {
    const next = applyReview(mature({ interval_days: 30, ease: 2.5 }), 4, NOW);
    expect(next.interval_days).toBe(75);
    expect(next.repetitions).toBe(6);
    expect(next.ease).toBe(2.5); // unchanged
  });

  it("rating 5 (easy): interval = round(75 * 1.3) = 98, ease += 0.15", () => {
    const next = applyReview(mature({ interval_days: 30, ease: 2.5 }), 5, NOW);
    expect(next.interval_days).toBe(98); // round(round(30*2.5) * 1.3) = round(75*1.3) = 98
    expect(next.ease).toBeCloseTo(2.65, 2);
    expect(next.repetitions).toBe(6);
  });

  it("rating 3 (hard): interval = round(prev * 1.2), ease drops 0.15", () => {
    const next = applyReview(mature({ interval_days: 30, ease: 2.5 }), 3, NOW);
    expect(next.interval_days).toBe(36); // round(30*1.2) = 36
    expect(next.ease).toBeCloseTo(2.35, 2);
  });

  it("rating 0 (lapse): reps→0, interval→0, schedules tomorrow", () => {
    const next = applyReview(mature({ interval_days: 30, ease: 2.5 }), 0, NOW);
    expect(next.repetitions).toBe(0);
    expect(next.interval_days).toBe(0);
    expect(next.next_review_at).toBe(NOW + DAY_MS);
    expect(next.ease).toBe(2.5); // unchanged on lapse
  });
});

// ── Ease-factor bounds ─────────────────────────────────────────────────

describe("applyReview — ease bounds", () => {
  it("rating 3 floors ease at 1.3 even after multiple drops", () => {
    let card: CardState = { ...mature(), ease: 1.4 };
    card = applyReview(card, 3, NOW); // 1.4 - 0.15 = 1.25 → floor 1.3
    expect(card.ease).toBeCloseTo(MIN_EASE, 2);
    card = applyReview(card, 3, NOW); // already 1.3 → stays 1.3
    expect(card.ease).toBeCloseTo(MIN_EASE, 2);
  });

  it("rating 0 floors ease at 1.3 (input below floor is repaired)", () => {
    const next = applyReview({ ...mature(), ease: 1.0 }, 0, NOW);
    expect(next.ease).toBeCloseTo(MIN_EASE, 2);
  });

  it("rating 5 has no upper bound; ease accumulates", () => {
    let card: CardState = mature({ ease: 2.5 });
    for (let i = 0; i < 5; i += 1) {
      card = applyReview(card, 5, NOW);
    }
    // 2.5 + 0.15*5 = 3.25
    expect(card.ease).toBeCloseTo(3.25, 2);
  });

  it("rating 4 leaves ease untouched", () => {
    const next = applyReview(mature({ ease: 2.5 }), 4, NOW);
    expect(next.ease).toBe(2.5);
  });
});

// ── Interval lower bound ────────────────────────────────────────────────

describe("applyReview — interval lower bound", () => {
  it("hard on a tiny interval still produces at least 1 day", () => {
    const next = applyReview(
      { repetitions: 0, interval_days: 0, ease: 2.5, next_review_at: NOW },
      3,
      NOW,
    );
    expect(next.interval_days).toBeGreaterThanOrEqual(1);
  });

  it("good on reps>=2 with a 0-day interval still produces ≥1 day", () => {
    const next = applyReview(
      { repetitions: 5, interval_days: 0, ease: 2.5, next_review_at: NOW },
      4,
      NOW,
    );
    expect(next.interval_days).toBeGreaterThanOrEqual(1);
  });
});

// ── Lapse → recovery sequences ──────────────────────────────────────────

describe("applyReview — lapse + recovery sequences", () => {
  it("again then easy in succession resets reps then bumps to graduating", () => {
    let card: CardState = mature({ repetitions: 4, interval_days: 20, ease: 2.5 });
    card = applyReview(card, 0, NOW); // reps→0, interval→0, ease unchanged
    expect(card.repetitions).toBe(0);
    expect(card.ease).toBe(2.5);
    card = applyReview(card, 5, NOW + DAY_MS); // fresh again, easy
    expect(card.repetitions).toBe(1);
    expect(card.interval_days).toBe(1);
    expect(card.ease).toBeCloseTo(2.65, 2);
  });

  it("again→good→good produces 0→1→6 day intervals", () => {
    let card: CardState = mature({ repetitions: 6, interval_days: 90 });
    card = applyReview(card, 0, NOW);
    expect(card.interval_days).toBe(0);
    card = applyReview(card, 4, NOW);
    expect(card.interval_days).toBe(1);
    card = applyReview(card, 4, NOW);
    expect(card.interval_days).toBe(6);
  });
});

// ── next_review_at always derives from interval (except lapse) ──────────

describe("applyReview — schedule derivation", () => {
  it("advances next_review_at to nowMs + interval_days * DAY_MS", () => {
    const next = applyReview(mature(), 4, NOW);
    expect(next.next_review_at).toBe(NOW + next.interval_days * DAY_MS);
  });

  it("lapse schedules at nowMs + 1 day regardless of stored interval", () => {
    const next = applyReview(mature({ interval_days: 90 }), 0, NOW);
    expect(next.next_review_at).toBe(NOW + DAY_MS);
    expect(next.interval_days).toBe(0);
  });
});

// ── freshCard ────────────────────────────────────────────────────────────

describe("freshCard", () => {
  it("starts at reps=0, interval=0, default ease, due now", () => {
    const c = freshCard(NOW);
    expect(c.repetitions).toBe(0);
    expect(c.interval_days).toBe(0);
    expect(c.ease).toBe(DEFAULT_EASE);
    expect(c.next_review_at).toBe(NOW);
  });
});

// ── clampEase ────────────────────────────────────────────────────────────

describe("clampEase", () => {
  it("returns DEFAULT_EASE for non-finite input", () => {
    expect(clampEase(Number.NaN)).toBe(DEFAULT_EASE);
    expect(clampEase(Infinity)).toBe(DEFAULT_EASE);
  });

  it("floors at MIN_EASE", () => {
    expect(clampEase(0.5)).toBe(MIN_EASE);
    expect(clampEase(1.0)).toBe(MIN_EASE);
  });

  it("passes high values through (no upper cap)", () => {
    expect(clampEase(5)).toBe(5);
  });
});

// ── Determinism — same input always produces same output ─────────────────

describe("applyReview — determinism", () => {
  const cases: ReadonlyArray<{ rating: Rating; description: string }> = [
    { rating: 0, description: "again" },
    { rating: 3, description: "hard" },
    { rating: 4, description: "good" },
    { rating: 5, description: "easy" },
  ];

  it.each(cases)(
    "rating $rating ($description) is pure on (state, rating, now)",
    ({ rating }) => {
      const card = mature();
      const a = applyReview(card, rating, NOW);
      const b = applyReview(card, rating, NOW);
      expect(a).toEqual(b);
    },
  );
});
