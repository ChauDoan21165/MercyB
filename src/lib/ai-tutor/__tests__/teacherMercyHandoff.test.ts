import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  TEACHER_MERCY_PENDING_REFLECTION_KEY,
  readAndClearPendingReflection,
  writePendingReflection,
} from "../teacherMercyHandoff";

beforeEach(() => {
  window.sessionStorage.clear();
  window.localStorage.clear();
});

afterEach(() => {
  window.sessionStorage.clear();
});

const PAYLOAD = {
  roomId: "english_a1_intro",
  roomTitle: "Intro / Giới thiệu",
  keyword: "hello",
  reflectionText: "Today I learned about my family.",
};

describe("teacherMercyHandoff", () => {
  it("round-trips a written reflection", () => {
    expect(writePendingReflection(PAYLOAD)).toBe(true);
    expect(readAndClearPendingReflection()).toEqual(PAYLOAD);
  });

  it("is single-use: reading clears the bridge", () => {
    writePendingReflection(PAYLOAD);
    expect(readAndClearPendingReflection()).not.toBeNull();
    // Second read finds nothing — no stale re-prefill on refresh.
    expect(readAndClearPendingReflection()).toBeNull();
    expect(window.sessionStorage.getItem(TEACHER_MERCY_PENDING_REFLECTION_KEY)).toBeNull();
  });

  it("returns null when there is no hand-off", () => {
    expect(readAndClearPendingReflection()).toBeNull();
  });

  it("does not write (and does not throw) for empty or whitespace reflection text", () => {
    expect(writePendingReflection({ ...PAYLOAD, reflectionText: "" })).toBe(false);
    expect(writePendingReflection({ ...PAYLOAD, reflectionText: "   " })).toBe(false);
    expect(readAndClearPendingReflection()).toBeNull();
  });

  it("trims the stored reflection text", () => {
    writePendingReflection({ ...PAYLOAD, reflectionText: "  hello world  " });
    expect(readAndClearPendingReflection()?.reflectionText).toBe("hello world");
  });

  it("normalizes missing optional fields to null", () => {
    writePendingReflection({
      roomId: null,
      roomTitle: null,
      keyword: null,
      reflectionText: "minimal",
    });
    expect(readAndClearPendingReflection()).toEqual({
      roomId: null,
      roomTitle: null,
      keyword: null,
      reflectionText: "minimal",
    });
  });

  it("returns null and clears on malformed JSON", () => {
    window.sessionStorage.setItem(TEACHER_MERCY_PENDING_REFLECTION_KEY, "{not json");
    expect(readAndClearPendingReflection()).toBeNull();
    expect(window.sessionStorage.getItem(TEACHER_MERCY_PENDING_REFLECTION_KEY)).toBeNull();
  });

  it("returns null when stored payload carries no reflection text", () => {
    window.sessionStorage.setItem(
      TEACHER_MERCY_PENDING_REFLECTION_KEY,
      JSON.stringify({ roomId: "x", roomTitle: null, keyword: null, reflectionText: "" }),
    );
    expect(readAndClearPendingReflection()).toBeNull();
  });
});
