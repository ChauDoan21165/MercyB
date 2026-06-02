// In-memory fakes implementing the Lane D contract interfaces. Used ONLY by the
// D4 session tests — deliberately NOT the real D1/D2/D3 modules, so the session
// logic is tested purely against the interface boundary.

import type {
  ContentAdapter,
  DailyCount,
  ReviewFlowId,
  ReviewGrade,
  ReviewItem,
  ReviewLogEntry,
  ReviewSettings,
  Scheduler,
  SchedulerCardState,
  SchedulerReviewResult,
  ReviewStore,
  StoredCard,
  CardLearningState,
} from "@/features/review/types";
import { DEFAULT_REVIEW_SETTINGS } from "@/features/review/types";

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Deterministic fake scheduler. newCard is due immediately (due === nowMs).
 * review pushes the due date out by a fixed per-grade interval so tests can
 * assert ordering / nextDueAt without depending on real FSRS math.
 */
export class FakeScheduler implements Scheduler {
  static readonly INTERVAL_DAYS: Record<ReviewGrade, number> = {
    again: 0, // stays due (relearning)
    hard: 1,
    good: 4,
    easy: 10,
  };

  newCard(nowMs: number): SchedulerCardState {
    return {
      due: nowMs,
      stability: 0,
      difficulty: 5,
      elapsedDays: 0,
      scheduledDays: 0,
      reps: 0,
      lapses: 0,
      state: "new",
      lastReview: null,
    };
  }

  review(
    state: SchedulerCardState,
    grade: ReviewGrade,
    nowMs: number,
    itemId: string,
    flow: ReviewFlowId,
  ): SchedulerReviewResult {
    const intervalDays = FakeScheduler.INTERVAL_DAYS[grade];
    const resultingState: CardLearningState =
      grade === "again" ? "relearning" : "review";
    const newState: SchedulerCardState = {
      ...state,
      due: nowMs + intervalDays * DAY_MS,
      reps: state.reps + 1,
      lapses: state.lapses + (grade === "again" ? 1 : 0),
      scheduledDays: intervalDays,
      state: resultingState,
      lastReview: nowMs,
    };
    return {
      state: newState,
      intervalDays,
      log: {
        itemId,
        flow,
        grade,
        reviewedAt: nowMs,
        intervalDays,
        resultingState,
      },
    };
  }

  preview(state: SchedulerCardState, _nowMs: number): Record<ReviewGrade, number> {
    void state;
    return { ...FakeScheduler.INTERVAL_DAYS };
  }
}

/** In-memory ReviewStore. */
export class FakeStore implements ReviewStore {
  cards = new Map<string, StoredCard>(); // key: `${flow}:${itemId}`
  logs: ReviewLogEntry[] = [];
  dailyCounts = new Map<string, DailyCount>(); // key: `${flow}:${day}`
  settings = new Map<ReviewFlowId, ReviewSettings>();

  private cardKey(flow: ReviewFlowId, itemId: string) {
    return `${flow}:${itemId}`;
  }
  private dayKey(flow: ReviewFlowId, day: string) {
    return `${flow}:${day}`;
  }

  async getCard(flow: ReviewFlowId, itemId: string) {
    return this.cards.get(this.cardKey(flow, itemId));
  }
  async getCards(flow: ReviewFlowId) {
    return [...this.cards.values()].filter((c) => c.flow === flow);
  }
  async getDueCards(flow: ReviewFlowId, nowMs: number) {
    return [...this.cards.values()].filter(
      (c) => c.flow === flow && c.state.due <= nowMs,
    );
  }
  async putCard(card: StoredCard) {
    this.cards.set(this.cardKey(card.flow, card.itemId), card);
  }

  async appendLog(entry: ReviewLogEntry) {
    this.logs.push(entry);
  }
  async getLog(flow: ReviewFlowId, sinceMs?: number) {
    return this.logs.filter(
      (l) => l.flow === flow && (sinceMs === undefined || l.reviewedAt >= sinceMs),
    );
  }

  async getDailyCount(flow: ReviewFlowId, day: string): Promise<DailyCount> {
    return (
      this.dailyCounts.get(this.dayKey(flow, day)) ?? {
        day,
        flow,
        newCards: 0,
        reviews: 0,
      }
    );
  }
  async incrementDailyCount(
    flow: ReviewFlowId,
    day: string,
    delta: { newCards?: number; reviews?: number },
  ) {
    const k = this.dayKey(flow, day);
    const cur = this.dailyCounts.get(k) ?? { day, flow, newCards: 0, reviews: 0 };
    this.dailyCounts.set(k, {
      day,
      flow,
      newCards: cur.newCards + (delta.newCards ?? 0),
      reviews: cur.reviews + (delta.reviews ?? 0),
    });
  }

  async getSettings(flow: ReviewFlowId): Promise<ReviewSettings> {
    return this.settings.get(flow) ?? { flow, ...DEFAULT_REVIEW_SETTINGS };
  }
  async putSettings(settings: ReviewSettings) {
    this.settings.set(settings.flow, settings);
  }

  async clear() {
    this.cards.clear();
    this.logs = [];
    this.dailyCounts.clear();
    this.settings.clear();
  }

  // ── test helper ─────────────────────────────────────────────────────────
  seedDaily(flow: ReviewFlowId, day: string, c: { newCards?: number; reviews?: number }) {
    this.dailyCounts.set(this.dayKey(flow, day), {
      day,
      flow,
      newCards: c.newCards ?? 0,
      reviews: c.reviews ?? 0,
    });
  }
}

/** In-memory ContentAdapter backed by a fixed item list per flow. */
export class FakeContent implements ContentAdapter {
  constructor(private byFlow: Partial<Record<ReviewFlowId, ReviewItem[]>> = {}) {}

  supportedFlows(): ReviewFlowId[] {
    return Object.keys(this.byFlow) as ReviewFlowId[];
  }
  async getItems(flow: ReviewFlowId): Promise<ReviewItem[]> {
    return this.byFlow[flow] ?? [];
  }
}

export function makeItem(
  flow: ReviewFlowId,
  slug: string,
  over: Partial<ReviewItem> = {},
): ReviewItem {
  return {
    id: `${flow}:vocab:${slug}`,
    flow,
    kind: "vocab",
    front: `front-${slug}`,
    back: `back-${slug}`,
    source: "test",
    ...over,
  };
}

export function storedCard(
  flow: ReviewFlowId,
  itemId: string,
  due: number,
  over: Partial<SchedulerCardState> = {},
): StoredCard {
  return {
    itemId,
    flow,
    introducedAt: due - DAY_MS,
    state: {
      due,
      stability: 1,
      difficulty: 5,
      elapsedDays: 0,
      scheduledDays: 1,
      reps: 1,
      lapses: 0,
      state: "review",
      lastReview: due - DAY_MS,
      ...over,
    },
  };
}

export const DAY = DAY_MS;
