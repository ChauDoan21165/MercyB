// src/features/gamification/store/__tests__/gamificationStore.test.ts
//
// F5 store tests. The repo's vitest runs under jsdom, which has NO indexedDB,
// so `typeof indexedDB === "undefined"` here. That lets us assert two things:
//   1. InMemoryGamificationStore behaves correctly (round-trip, clear, deep
//      copy isolation).
//   2. IndexedDbGamificationStore and the factory degrade gracefully when no
//      backing store exists — no throws, sane defaults, in-memory fallback.

import { describe, expect, it } from "vitest";

import { createDefaultState } from "../../defaults";
import type { GamificationState } from "../../types";
import { InMemoryGamificationStore } from "../InMemoryGamificationStore";
import { IndexedDbGamificationStore } from "../IndexedDbGamificationStore";
import { createGamificationStore } from "../createGamificationStore";

function nonDefaultState(): GamificationState {
  const s = createDefaultState();
  s.xp = { totalXp: 1234, level: 5 };
  s.streak = {
    current: 7,
    longest: 12,
    lastActiveDate: "2026-06-01",
    freezesAvailable: 1,
    freezeUsedDates: ["2026-05-20"],
  };
  s.dailyGoal.date = "2026-06-01";
  s.dailyGoal.progress = 8;
  s.dailyGoal.completedToday = false;
  s.achievements.unlocked = {
    first_lesson: { id: "first_lesson", unlockedAt: 1_700_000_000_000 },
  };
  return s;
}

describe("environment sanity", () => {
  it("jsdom has no indexedDB (these tests rely on the in-memory fallback)", () => {
    expect(typeof indexedDB).toBe("undefined");
  });
});

describe("InMemoryGamificationStore", () => {
  it("load() returns a default state when empty", async () => {
    const store = new InMemoryGamificationStore();
    const loaded = await store.load();
    expect(loaded).toEqual(createDefaultState());
  });

  it("save() then load() round-trips a non-default state", async () => {
    const store = new InMemoryGamificationStore();
    const state = nonDefaultState();
    await store.save(state);
    const loaded = await store.load();
    expect(loaded).toEqual(state);
  });

  it("clear() resets to default", async () => {
    const store = new InMemoryGamificationStore();
    await store.save(nonDefaultState());
    await store.clear();
    const loaded = await store.load();
    expect(loaded).toEqual(createDefaultState());
  });

  it("mutating the object returned by load() does not corrupt the store", async () => {
    const store = new InMemoryGamificationStore();
    const state = nonDefaultState();
    await store.save(state);

    const first = await store.load();
    first.xp.totalXp = 999_999;
    first.streak.freezeUsedDates.push("hacked");
    first.achievements.unlocked.tampered = { id: "tampered", unlockedAt: 0 };

    const second = await store.load();
    expect(second.xp.totalXp).toBe(1234);
    expect(second.streak.freezeUsedDates).toEqual(["2026-05-20"]);
    expect(second.achievements.unlocked.tampered).toBeUndefined();
  });

  it("mutating the saved object after save() does not corrupt the store", async () => {
    const store = new InMemoryGamificationStore();
    const state = nonDefaultState();
    await store.save(state);
    state.xp.totalXp = 42;
    const loaded = await store.load();
    expect(loaded.xp.totalXp).toBe(1234);
  });
});

describe("IndexedDbGamificationStore — no-IndexedDB environment", () => {
  it("isAvailable() is false when indexedDB is undefined", () => {
    const store = new IndexedDbGamificationStore();
    expect(store.isAvailable()).toBe(false);
  });

  it("load() resolves to a default state without throwing", async () => {
    const store = new IndexedDbGamificationStore();
    await expect(store.load()).resolves.toEqual(createDefaultState());
  });

  it("save() resolves without throwing (no-op)", async () => {
    const store = new IndexedDbGamificationStore();
    await expect(store.save(nonDefaultState())).resolves.toBeUndefined();
  });

  it("clear() resolves without throwing (no-op)", async () => {
    const store = new IndexedDbGamificationStore();
    await expect(store.clear()).resolves.toBeUndefined();
  });

  it("save() does not persist (no-op store still loads default)", async () => {
    const store = new IndexedDbGamificationStore();
    await store.save(nonDefaultState());
    await expect(store.load()).resolves.toEqual(createDefaultState());
  });
});

describe("createGamificationStore()", () => {
  it("returns a working store under jsdom (falls back to in-memory)", async () => {
    const store = createGamificationStore();
    await expect(store.load()).resolves.toEqual(createDefaultState());
  });

  it("the fallback store round-trips state (proving it's in-memory, not IDB no-op)", async () => {
    const store = createGamificationStore();
    const state = nonDefaultState();
    await store.save(state);
    const loaded = await store.load();
    expect(loaded).toEqual(state);
  });

  it("does not throw on construction or basic ops", async () => {
    expect(() => createGamificationStore()).not.toThrow();
    const store = createGamificationStore();
    await expect(store.clear()).resolves.toBeUndefined();
  });
});
