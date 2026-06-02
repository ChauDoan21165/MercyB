import "fake-indexeddb/auto";

import { beforeEach, describe, expect, it } from "vitest";

import {
  DEFAULT_REVIEW_SETTINGS,
  type DailyCount,
  type ReviewFlowId,
  type ReviewLogEntry,
  type ReviewSettings,
  type ReviewStore,
  type SchedulerCardState,
  type StoredCard,
} from "@/features/review/types";
import { createReviewStore } from "../indexedDbStore";

const FLOW: ReviewFlowId = "vi-en";
const OTHER_FLOW: ReviewFlowId = "en-es";

function makeState(due: number): SchedulerCardState {
  return {
    due,
    stability: 1,
    difficulty: 5,
    elapsedDays: 0,
    scheduledDays: 1,
    reps: 0,
    lapses: 0,
    state: "new",
    lastReview: null,
  };
}

function makeCard(itemId: string, due: number, flow: ReviewFlowId = FLOW): StoredCard {
  return {
    itemId,
    flow,
    state: makeState(due),
    introducedAt: 1000,
  };
}

function makeLog(
  itemId: string,
  reviewedAt: number,
  flow: ReviewFlowId = FLOW,
): ReviewLogEntry {
  return {
    itemId,
    flow,
    grade: "good",
    reviewedAt,
    intervalDays: 3,
    resultingState: "review",
  };
}

let store: ReviewStore;
let dbCounter = 0;

beforeEach(() => {
  // Unique db per test for full isolation.
  store = createReviewStore(`review-test-${Date.now()}-${dbCounter++}`);
});

describe("indexedDbStore — cards", () => {
  it("round-trips a card (put → get)", async () => {
    const card = makeCard("vi-en:vocab:hello", 5000);
    await store.putCard(card);
    const got = await store.getCard(FLOW, "vi-en:vocab:hello");
    expect(got).toEqual(card);
  });

  it("returns undefined for a missing card", async () => {
    expect(await store.getCard(FLOW, "nope")).toBeUndefined();
  });

  it("getCards returns only the requested flow's cards", async () => {
    await store.putCard(makeCard("a", 1, FLOW));
    await store.putCard(makeCard("b", 2, FLOW));
    await store.putCard(makeCard("c", 3, OTHER_FLOW));
    const cards = await store.getCards(FLOW);
    expect(cards.map((c) => c.itemId).sort()).toEqual(["a", "b"]);
  });

  it("getDueCards returns only cards with due <= now", async () => {
    const now = 10_000;
    await store.putCard(makeCard("past", now - 1));
    await store.putCard(makeCard("exact", now));
    await store.putCard(makeCard("future", now + 1));
    const due = await store.getDueCards(FLOW, now);
    expect(due.map((c) => c.itemId).sort()).toEqual(["exact", "past"]);
  });

  it("putCard upserts on the composite key", async () => {
    await store.putCard(makeCard("x", 1));
    await store.putCard(makeCard("x", 999));
    const got = await store.getCard(FLOW, "x");
    expect(got?.state.due).toBe(999);
    expect((await store.getCards(FLOW)).length).toBe(1);
  });
});

describe("indexedDbStore — log", () => {
  it("appendLog + getLog round-trips, ordered by reviewedAt", async () => {
    await store.appendLog(makeLog("a", 300));
    await store.appendLog(makeLog("b", 100));
    await store.appendLog(makeLog("c", 200));
    const log = await store.getLog(FLOW);
    expect(log.map((e) => e.itemId)).toEqual(["b", "c", "a"]);
  });

  it("getLog scopes to the flow", async () => {
    await store.appendLog(makeLog("a", 100, FLOW));
    await store.appendLog(makeLog("b", 200, OTHER_FLOW));
    const log = await store.getLog(FLOW);
    expect(log.map((e) => e.itemId)).toEqual(["a"]);
  });

  it("getLog applies the sinceMs filter (inclusive)", async () => {
    await store.appendLog(makeLog("old", 100));
    await store.appendLog(makeLog("edge", 200));
    await store.appendLog(makeLog("new", 300));
    const log = await store.getLog(FLOW, 200);
    expect(log.map((e) => e.itemId)).toEqual(["edge", "new"]);
  });

  it("getLog returns [] when empty", async () => {
    expect(await store.getLog(FLOW)).toEqual([]);
  });
});

describe("indexedDbStore — daily counts", () => {
  const DAY = "2026-06-01";

  it("getDailyCount returns a zeroed count when none stored", async () => {
    const got = await store.getDailyCount(FLOW, DAY);
    const expected: DailyCount = {
      day: DAY,
      flow: FLOW,
      newCards: 0,
      reviews: 0,
    };
    expect(got).toEqual(expected);
  });

  it("incrementDailyCount accumulates across calls", async () => {
    await store.incrementDailyCount(FLOW, DAY, { newCards: 2 });
    await store.incrementDailyCount(FLOW, DAY, { reviews: 5 });
    await store.incrementDailyCount(FLOW, DAY, { newCards: 1, reviews: 3 });
    const got = await store.getDailyCount(FLOW, DAY);
    expect(got).toEqual({ day: DAY, flow: FLOW, newCards: 3, reviews: 8 });
  });

  it("daily counts are keyed by (flow, day)", async () => {
    await store.incrementDailyCount(FLOW, DAY, { reviews: 1 });
    await store.incrementDailyCount(OTHER_FLOW, DAY, { reviews: 9 });
    await store.incrementDailyCount(FLOW, "2026-06-02", { reviews: 4 });
    expect((await store.getDailyCount(FLOW, DAY)).reviews).toBe(1);
    expect((await store.getDailyCount(OTHER_FLOW, DAY)).reviews).toBe(9);
    expect((await store.getDailyCount(FLOW, "2026-06-02")).reviews).toBe(4);
  });
});

describe("indexedDbStore — settings", () => {
  it("getSettings returns defaults when none stored", async () => {
    const got = await store.getSettings(FLOW);
    expect(got).toEqual({ flow: FLOW, ...DEFAULT_REVIEW_SETTINGS });
  });

  it("putSettings overrides the defaults", async () => {
    const custom: ReviewSettings = {
      flow: FLOW,
      dailyNewLimit: 50,
      dailyReviewLimit: 100,
    };
    await store.putSettings(custom);
    expect(await store.getSettings(FLOW)).toEqual(custom);
    // Other flow still defaults.
    expect(await store.getSettings(OTHER_FLOW)).toEqual({
      flow: OTHER_FLOW,
      ...DEFAULT_REVIEW_SETTINGS,
    });
  });
});

describe("indexedDbStore — clear", () => {
  it("empties every store", async () => {
    await store.putCard(makeCard("a", 1));
    await store.appendLog(makeLog("a", 1));
    await store.incrementDailyCount(FLOW, "2026-06-01", { reviews: 1 });
    await store.putSettings({
      flow: FLOW,
      dailyNewLimit: 1,
      dailyReviewLimit: 1,
    });

    await store.clear();

    expect(await store.getCards(FLOW)).toEqual([]);
    expect(await store.getLog(FLOW)).toEqual([]);
    expect(await store.getDailyCount(FLOW, "2026-06-01")).toEqual({
      day: "2026-06-01",
      flow: FLOW,
      newCards: 0,
      reviews: 0,
    });
    expect(await store.getSettings(FLOW)).toEqual({
      flow: FLOW,
      ...DEFAULT_REVIEW_SETTINGS,
    });
  });
});
