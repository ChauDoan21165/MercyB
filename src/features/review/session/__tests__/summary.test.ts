import { describe, it, expect } from "vitest";
import type { ReviewFlowId } from "@/features/review/types";
import { buildQueue } from "../queueBuilder";
import { gradeCard, startSession } from "../gradingLoop";
import { summarize } from "../summary";
import type { SessionDeps } from "../deps";
import { FakeScheduler, FakeStore, FakeContent, makeItem, storedCard, DAY } from "./fakes";

const FLOW: ReviewFlowId = "vi-en";
const NOW = Date.UTC(2026, 5, 1, 9, 0, 0);

function makeDeps(content: FakeContent, store = new FakeStore()) {
  const d: SessionDeps = { scheduler: new FakeScheduler(), store, content };
  return { d, store };
}

describe("summarize", () => {
  it("reports reviewed = sum of grades + the grade tally", async () => {
    const items = [makeItem(FLOW, "a"), makeItem(FLOW, "b"), makeItem(FLOW, "c")];
    const { d, store } = makeDeps(new FakeContent({ [FLOW]: items }));
    let state = startSession(FLOW, await buildQueue(d, FLOW, { nowMs: NOW }));
    state = await gradeCard(d, state, "good", NOW);
    state = await gradeCard(d, state, "easy", NOW);
    state = await gradeCard(d, state, "good", NOW);

    const summary = await summarize(d, state, NOW);
    expect(summary.reviewed).toBe(3);
    expect(summary.newIntroduced).toBe(3);
    expect(summary.grades).toMatchObject({ good: 2, easy: 1 });
    expect(summary.flow).toBe(FLOW);
    void store;
  });

  it("nextDueAt = earliest future due across stored cards", async () => {
    const items = [makeItem(FLOW, "a"), makeItem(FLOW, "b")];
    const { d, store } = makeDeps(new FakeContent({ [FLOW]: items }));
    let state = startSession(FLOW, await buildQueue(d, FLOW, { nowMs: NOW }));
    // grade a → "hard" (1 day), b → "easy" (10 days). Earliest future = +1 day.
    state = await gradeCard(d, state, "hard", NOW);
    state = await gradeCard(d, state, "easy", NOW);

    const summary = await summarize(d, state, NOW);
    expect(summary.nextDueAt).toBe(NOW + 1 * DAY);
    void store;
  });

  it("nextDueAt is null when no stored card is due in the future", async () => {
    const items = [makeItem(FLOW, "a")];
    const { d, store } = makeDeps(new FakeContent({ [FLOW]: items }));
    // A card graded "again" stays due now (interval 0) → not in the future.
    let state = startSession(FLOW, await buildQueue(d, FLOW, { nowMs: NOW }));
    state = await gradeCard(d, state, "again", NOW);

    const summary = await summarize(d, state, NOW);
    expect(summary.nextDueAt).toBeNull();
    void store;
  });

  it("ignores past-due cards and picks the nearest future one", async () => {
    const items = [makeItem(FLOW, "a"), makeItem(FLOW, "b"), makeItem(FLOW, "c")];
    const store = new FakeStore();
    // pre-existing cards: one past-due, two future at different distances.
    await store.putCard(storedCard(FLOW, items[0].id, NOW - 2 * DAY));
    await store.putCard(storedCard(FLOW, items[1].id, NOW + 7 * DAY));
    await store.putCard(storedCard(FLOW, items[2].id, NOW + 3 * DAY));
    const { d } = makeDeps(new FakeContent({ [FLOW]: items }), store);

    const state = startSession(FLOW, []);
    const summary = await summarize(d, state, NOW);
    expect(summary.reviewed).toBe(0);
    expect(summary.nextDueAt).toBe(NOW + 3 * DAY);
  });

  it("empty session over an empty flow → zero reviewed, null nextDueAt", async () => {
    const { d } = makeDeps(new FakeContent({}));
    const state = startSession(FLOW, []);
    const summary = await summarize(d, state, NOW);
    expect(summary).toMatchObject({ reviewed: 0, newIntroduced: 0, nextDueAt: null });
  });
});
