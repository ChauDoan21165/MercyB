import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  __clearGraduationStateForTests,
  applyDrillSession,
  GRADUATION_SCORE_FLOOR,
  isGraduated,
  markCelebrationShown,
  progressFor,
  readGraduationState,
  recordDrillSession,
  writeGraduationState,
  type PhonemeGraduationProgress,
} from "../drillGraduation";

const TEST_USER = "user-grad-1";

const EMPTY: PhonemeGraduationProgress = {
  consecutiveStrongSessions: 0,
  lastSessionAt: 0,
  lastSessionAvg: null,
  graduatedAt: null,
  celebrationShown: false,
};

beforeEach(() => {
  if (typeof localStorage !== "undefined") localStorage.clear();
});

afterEach(() => {
  __clearGraduationStateForTests(TEST_USER);
});

// ── Pure transition: applyDrillSession ──────────────────────────────────

describe("applyDrillSession", () => {
  it("starts the streak from a single strong session", () => {
    const r = applyDrillSession(EMPTY, { sessionAvg: 85, now: 1000 });
    expect(r.next.consecutiveStrongSessions).toBe(1);
    expect(r.justGraduated).toBe(false);
  });

  it("resets the streak when a session falls below the floor", () => {
    const after2Strong: PhonemeGraduationProgress = {
      ...EMPTY,
      consecutiveStrongSessions: 2,
    };
    const r = applyDrillSession(after2Strong, { sessionAvg: 70, now: 1000 });
    expect(r.next.consecutiveStrongSessions).toBe(0);
    expect(r.justGraduated).toBe(false);
  });

  it("graduates on the third consecutive strong session", () => {
    let cur = EMPTY;
    cur = applyDrillSession(cur, { sessionAvg: 82, now: 1 }).next;
    cur = applyDrillSession(cur, { sessionAvg: 88, now: 2 }).next;
    const final = applyDrillSession(cur, { sessionAvg: 81, now: 3 });
    expect(final.justGraduated).toBe(true);
    expect(final.next.graduatedAt).toBe(3);
    expect(isGraduated(final.next)).toBe(true);
  });

  it("does NOT re-graduate once already graduated", () => {
    const graduated: PhonemeGraduationProgress = {
      ...EMPTY,
      consecutiveStrongSessions: 4,
      graduatedAt: 100,
    };
    const r = applyDrillSession(graduated, { sessionAvg: 95, now: 200 });
    expect(r.justGraduated).toBe(false);
    expect(r.next.graduatedAt).toBe(100); // unchanged
  });

  it("uses the configured score floor (80) as the boundary", () => {
    const atFloor = applyDrillSession(EMPTY, {
      sessionAvg: GRADUATION_SCORE_FLOOR,
      now: 1,
    });
    expect(atFloor.next.consecutiveStrongSessions).toBe(1);
    const below = applyDrillSession(EMPTY, {
      sessionAvg: GRADUATION_SCORE_FLOOR - 1,
      now: 1,
    });
    expect(below.next.consecutiveStrongSessions).toBe(0);
  });
});

// ── markCelebrationShown ────────────────────────────────────────────────

describe("markCelebrationShown", () => {
  it("flips celebrationShown true once and is idempotent", () => {
    const a = markCelebrationShown(EMPTY);
    expect(a.celebrationShown).toBe(true);
    const b = markCelebrationShown(a);
    expect(b).toBe(a); // identity-stable on idempotent call
  });
});

// ── Storage round-trip ──────────────────────────────────────────────────

describe("recordDrillSession + readGraduationState", () => {
  it("persists progress to localStorage and reads it back", () => {
    const r = recordDrillSession({
      userId: TEST_USER,
      phonemeSlug: "th",
      sessionAvg: 90,
      now: 5000,
    });
    expect(r.progress.consecutiveStrongSessions).toBe(1);
    const reloaded = readGraduationState(TEST_USER);
    expect(reloaded.byPhoneme.th.consecutiveStrongSessions).toBe(1);
    expect(reloaded.byPhoneme.th.lastSessionAt).toBe(5000);
  });

  it("graduates after three persisted strong sessions", () => {
    recordDrillSession({ userId: TEST_USER, phonemeSlug: "th", sessionAvg: 82, now: 1 });
    recordDrillSession({ userId: TEST_USER, phonemeSlug: "th", sessionAvg: 88, now: 2 });
    const r3 = recordDrillSession({
      userId: TEST_USER,
      phonemeSlug: "th",
      sessionAvg: 81,
      now: 3,
    });
    expect(r3.justGraduated).toBe(true);
    const reloaded = readGraduationState(TEST_USER);
    expect(reloaded.byPhoneme.th.graduatedAt).toBe(3);
  });

  it("tracks per-phoneme state independently", () => {
    recordDrillSession({ userId: TEST_USER, phonemeSlug: "th", sessionAvg: 90, now: 1 });
    recordDrillSession({ userId: TEST_USER, phonemeSlug: "r", sessionAvg: 50, now: 2 });
    const state = readGraduationState(TEST_USER);
    expect(state.byPhoneme.th.consecutiveStrongSessions).toBe(1);
    expect(state.byPhoneme.r.consecutiveStrongSessions).toBe(0);
  });
});

// ── progressFor returns a non-null fresh record by default ──────────────

describe("progressFor", () => {
  it("returns an empty progress when phoneme isn't yet tracked", () => {
    const state = readGraduationState(TEST_USER);
    const p = progressFor(state, "th");
    expect(p.consecutiveStrongSessions).toBe(0);
    expect(p.graduatedAt).toBeNull();
  });
});

// ── Sanitizer: malformed storage doesn't crash the app ──────────────────

describe("readGraduationState — sanitizer", () => {
  it("survives a corrupted JSON blob in localStorage", () => {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem("mercy.drill.graduation.v1." + TEST_USER, "not-json");
    const state = readGraduationState(TEST_USER);
    expect(state).toEqual({ byPhoneme: {} });
  });

  it("drops fields with the wrong type", () => {
    writeGraduationState(TEST_USER, {
      // @ts-expect-error — deliberate bad shape for the sanitizer
      byPhoneme: { th: { consecutiveStrongSessions: "lots", graduatedAt: "yes" } },
    });
    const state = readGraduationState(TEST_USER);
    expect(state.byPhoneme.th.consecutiveStrongSessions).toBe(0);
    expect(state.byPhoneme.th.graduatedAt).toBeNull();
  });
});
