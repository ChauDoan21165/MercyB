import { describe, it, expect } from "vitest";
import type { ReviewFlowId } from "@/features/review/types";
import { buildQueue, dayKey } from "../queueBuilder";
import type { SessionDeps } from "../deps";
import {
  FakeScheduler,
  FakeStore,
  FakeContent,
  makeItem,
  storedCard,
  DAY,
} from "./fakes";

const FLOW: ReviewFlowId = "vi-en";
const NOW = Date.UTC(2026, 5, 1, 9, 0, 0); // fixed clock

function deps(content: FakeContent, store = new FakeStore()): {
  d: SessionDeps;
  store: FakeStore;
} {
  return {
    d: { scheduler: new FakeScheduler(), store, content },
    store,
  };
}

describe("buildQueue", () => {
  it("empty / unwired flow → empty queue, no throw", async () => {
    const { d } = deps(new FakeContent({}));
    await expect(buildQueue(d, FLOW, { nowMs: NOW })).resolves.toEqual([]);
  });

  it("places due cards before new cards", async () => {
    const items = [
      makeItem(FLOW, "a"),
      makeItem(FLOW, "b"),
      makeItem(FLOW, "c"),
    ];
    const { d, store } = deps(new FakeContent({ [FLOW]: items }));
    // 'b' already has a stored card that is due now.
    await store.putCard(storedCard(FLOW, items[1].id, NOW - DAY));

    const q = await buildQueue(d, FLOW, { nowMs: NOW });

    expect(q.map((c) => c.item.id)).toEqual([items[1].id, items[0].id, items[2].id]);
    expect(q[0].isNew).toBe(false);
    expect(q[1].isNew).toBe(true);
    expect(q[2].isNew).toBe(true);
  });

  it("does not surface a stored card that is not yet due as a new card", async () => {
    const items = [makeItem(FLOW, "a"), makeItem(FLOW, "b")];
    const { d, store } = deps(new FakeContent({ [FLOW]: items }));
    // 'a' has a future-due card → neither due nor eligible as new.
    await store.putCard(storedCard(FLOW, items[0].id, NOW + 5 * DAY));

    const q = await buildQueue(d, FLOW, { nowMs: NOW });
    expect(q.map((c) => c.item.id)).toEqual([items[1].id]);
    expect(q[0].isNew).toBe(true);
  });

  it("respects the daily new-card limit", async () => {
    const items = Array.from({ length: 10 }, (_, i) => makeItem(FLOW, `s${i}`));
    const store = new FakeStore();
    await store.putSettings({ flow: FLOW, dailyNewLimit: 3, dailyReviewLimit: 0 });
    const { d } = deps(new FakeContent({ [FLOW]: items }), store);

    const q = await buildQueue(d, FLOW, { nowMs: NOW });
    expect(q).toHaveLength(3);
    expect(q.every((c) => c.isNew)).toBe(true);
  });

  it("reduces the new budget by cards already introduced today", async () => {
    const items = Array.from({ length: 10 }, (_, i) => makeItem(FLOW, `s${i}`));
    const store = new FakeStore();
    await store.putSettings({ flow: FLOW, dailyNewLimit: 5, dailyReviewLimit: 0 });
    store.seedDaily(FLOW, dayKey(NOW), { newCards: 2 });
    const { d } = deps(new FakeContent({ [FLOW]: items }), store);

    const q = await buildQueue(d, FLOW, { nowMs: NOW });
    expect(q).toHaveLength(3); // 5 limit - 2 already today
  });

  it("opts.newLimit overrides settings.dailyNewLimit", async () => {
    const items = Array.from({ length: 10 }, (_, i) => makeItem(FLOW, `s${i}`));
    const store = new FakeStore();
    await store.putSettings({ flow: FLOW, dailyNewLimit: 20, dailyReviewLimit: 0 });
    const { d } = deps(new FakeContent({ [FLOW]: items }), store);

    const q = await buildQueue(d, FLOW, { nowMs: NOW, newLimit: 2 });
    expect(q).toHaveLength(2);
  });

  it("introduces no new cards when today's budget is exhausted", async () => {
    const items = [makeItem(FLOW, "a"), makeItem(FLOW, "b")];
    const store = new FakeStore();
    await store.putSettings({ flow: FLOW, dailyNewLimit: 3, dailyReviewLimit: 0 });
    store.seedDaily(FLOW, dayKey(NOW), { newCards: 3 });
    const { d } = deps(new FakeContent({ [FLOW]: items }), store);

    const q = await buildQueue(d, FLOW, { nowMs: NOW });
    expect(q).toEqual([]);
  });

  it("drops a due card whose item is missing from content (fail soft)", async () => {
    const items = [makeItem(FLOW, "present")];
    const { d, store } = deps(new FakeContent({ [FLOW]: items }));
    await store.putCard(storedCard(FLOW, items[0].id, NOW - DAY));
    // A stored due card with no corresponding content item.
    await store.putCard(storedCard(FLOW, `${FLOW}:vocab:ghost`, NOW - DAY));

    const q = await buildQueue(d, FLOW, { nowMs: NOW });
    expect(q.map((c) => c.item.id)).toEqual([items[0].id]);
  });
});
