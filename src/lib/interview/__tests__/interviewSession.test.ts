// src/lib/interview/__tests__/interviewSession.test.ts
//
// Unit tests for the scoreEssay stub. Database paths are not unit-
// tested here — they're integration concerns and require a live
// Supabase project. The stub is the only piece of pure logic in
// this module, and it ships a public API that the rest of the
// session orchestration depends on.

import { describe, expect, it } from "vitest";

import { __scoreEssayStubForTests } from "../interviewSession";

describe("scoreEssay stub", () => {
  it("returns zeroes and a coaching message for an empty answer", () => {
    const out = __scoreEssayStubForTests({ text: "" });
    expect(out.overall).toBe(0);
    expect(out.feedback_vi.length).toBeGreaterThan(0);
    expect(out.feedback_en.length).toBeGreaterThan(0);
  });

  it("flags a too-short answer with a mid-low score", () => {
    const out = __scoreEssayStubForTests({ text: "Yes I can" });
    expect(out.overall).toBeGreaterThan(0);
    expect(out.overall).toBeLessThan(0.5);
    expect(out.feedback_vi).toContain("ngắn");
  });

  it("returns a baseline solid score for a full-length answer", () => {
    const text =
      "I have worked in customer support for two years, mostly through email and chat, and I'm comfortable with ticketing tools.";
    const out = __scoreEssayStubForTests({ text });
    expect(out.overall).toBeGreaterThan(0.5);
    expect(out.l1WeaknessTag).toBeNull();
  });

  it("never throws on whitespace-only input", () => {
    expect(() => __scoreEssayStubForTests({ text: "    " })).not.toThrow();
    const out = __scoreEssayStubForTests({ text: "    " });
    expect(out.overall).toBe(0);
  });
});
