import { describe, it, expect } from "vitest";
import type { ReviewFlowId } from "@/features/review/types";
import { buildQueue, dayKey } from "../queueBuilder";
import { gradeCard, startSession, emptyGrades } from "../gradingLoop";
import type { SessionDeps } from "../deps";
import { FakeScheduler, FakeStore, FakeContent, makeItem, storedCard, DAY } from "./fakes";

const FLOW: ReviewFlowId = "vi-en";
const NOW = Date.UTC(2026, 5, 1, 9, 0, 0);

function makeDeps(content: FakeContent, store = new FakeStore()) {
  const d: SessionDeps = { scheduler: new FakeScheduler(), store, content };
  return { d, store };
}

describe("gradeCard", () => {
  it("advances the index, writes a log, and increments counts", async () => {
    const items = [makeItem(FLOW, "a"), makeItem(FLOW, "b")];
    const { d, store } = makeDeps(new FakeContent({ [FLOW]: items }));
    const queue = await buildQueue(d, FLOW, { nowMs: NOW });
    let state = startSession(FLOW, queue);

    state = await gradeCard(d, state, "good", NOW);

    expect(state.index).toBe(1);
    expect(state.grades.good).toBe(1);
    expect(state.newIntroduced).toBe(1); // both cards are new
    expect(store.logs).toHaveLength(1);
    expect(store.logs[0]).toMatchObject({
      itemId: items[0].id,
      flow: FLOW,
      grade: "good",
      reviewedAt: NOW,
    });

    const daily = await store.getDailyCount(FLOW, dayKey(NOW));
    expect(daily).toMatchObject({ reviews: 1, newCards: 1 });

    // Card was persisted with its post-review due date.
    const persisted = await store.getCard(FLOW, items[0].id);
    expect(persisted?.state.due).toBe(NOW + 4 * DAY); // "good" → 4 days
  });

  it("does not count newCards for a card that was already in review (due card)", async () => {
    const items = [makeItem(FLOW, "a")];
    const { d, store } = makeDeps(new FakeContent({ [FLOW]: items }));
    await store.putCard(storedCard(FLOW, items[0].id, NOW - DAY));
    const queue = await buildQueue(d, FLOW, { nowMs: NOW });
    expect(queue[0].isNew).toBe(false);

    let state = startSession(FLOW, queue);
    state = await gradeCard(d, state, "again", NOW);

    expect(state.newIntroduced).toBe(0);
    expect(state.grades.again).toBe(1);
    const daily = await store.getDailyCount(FLOW, dayKey(NOW));
    expect(daily).toMatchObject({ reviews: 1, newCards: 0 });
  });

  it("does not mutate the input state object", async () => {
    const items = [makeItem(FLOW, "a")];
    const { d } = makeDeps(new FakeContent({ [FLOW]: items }));
    const queue = await buildQueue(d, FLOW, { nowMs: NOW });
    const state = startSession(FLOW, queue);

    const next = await gradeCard(d, state, "easy", NOW);
    expect(state.index).toBe(0);
    expect(state.grades).toEqual(emptyGrades());
    expect(next).not.toBe(state);
  });

  it("is a no-op when the session is already complete", async () => {
    const items = [makeItem(FLOW, "a")];
    const { d, store } = makeDeps(new FakeContent({ [FLOW]: items }));
    const queue = await buildQueue(d, FLOW, { nowMs: NOW });
    let state = startSession(FLOW, queue);
    state = await gradeCard(d, state, "good", NOW); // index now 1 == length

    const after = await gradeCard(d, state, "good", NOW);
    expect(after).toBe(state);
    expect(store.logs).toHaveLength(1); // no extra log
  });

  it("accumulates grades and counts across a full session", async () => {
    const items = [makeItem(FLOW, "a"), makeItem(FLOW, "b"), makeItem(FLOW, "c")];
    const { d, store } = makeDeps(new FakeContent({ [FLOW]: items }));
    const queue = await buildQueue(d, FLOW, { nowMs: NOW });
    let state = startSession(FLOW, queue);

    state = await gradeCard(d, state, "good", NOW);
    state = await gradeCard(d, state, "good", NOW);
    state = await gradeCard(d, state, "easy", NOW);

    expect(state.index).toBe(3);
    expect(state.grades).toMatchObject({ good: 2, easy: 1 });
    expect(state.newIntroduced).toBe(3);
    const daily = await store.getDailyCount(FLOW, dayKey(NOW));
    expect(daily).toMatchObject({ reviews: 3, newCards: 3 });
  });
});
