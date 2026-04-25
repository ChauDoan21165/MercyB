// supabase/functions/ai-chat/__tests__/factSlotting.test.ts
//
// Step 7 (AI Teacher v2) — pure-function tests for the user-fact
// slotting helpers. Mirrors the categorizeUsers test pattern: edge
// function logic gets pulled into a standalone module so vitest can
// run it under jsdom without booting Deno.

import { describe, it, expect } from "vitest";

import {
  MAX_FACTS_IN_PROMPT,
  MIN_CONFIDENCE_FOR_PROMPT,
  confidenceBucket,
  formatUserFactsSection,
  selectTopFacts,
  type EdgeUserFact,
} from "../factSlotting";

const fact = (overrides: Partial<EdgeUserFact> = {}): EdgeUserFact => ({
  id: overrides.id ?? "f-default",
  fact_type: overrides.fact_type ?? "context",
  content: overrides.content ?? "default content",
  confidence: overrides.confidence ?? 0.8,
  last_referenced_at: overrides.last_referenced_at ?? null,
});

describe("confidenceBucket", () => {
  it("≥ 0.8 → high", () => {
    expect(confidenceBucket(0.8)).toBe("high");
    expect(confidenceBucket(1.0)).toBe("high");
  });

  it("0.5 ≤ c < 0.8 → medium", () => {
    expect(confidenceBucket(0.5)).toBe("medium");
    expect(confidenceBucket(0.79)).toBe("medium");
  });

  it("< 0.5 → low", () => {
    expect(confidenceBucket(0)).toBe("low");
    expect(confidenceBucket(0.49)).toBe("low");
  });
});

describe("selectTopFacts", () => {
  it("returns [] for an empty list", () => {
    expect(selectTopFacts([])).toEqual([]);
  });

  it("returns the single fact untouched when n > 1", () => {
    const f = fact({ id: "only" });
    expect(selectTopFacts([f])).toEqual([f]);
  });

  it("respects MAX_FACTS_IN_PROMPT default cap of 10", () => {
    const facts = Array.from({ length: 25 }, (_, i) =>
      fact({ id: `f-${i}`, confidence: 0.9 }),
    );
    expect(selectTopFacts(facts).length).toBe(MAX_FACTS_IN_PROMPT);
    expect(selectTopFacts(facts).length).toBe(10);
  });

  it("sorts by confidence DESC, dropping facts below 0.3", () => {
    const facts = [
      fact({ id: "low", confidence: 0.2 }),
      fact({ id: "med", confidence: 0.6 }),
      fact({ id: "hi", confidence: 0.95 }),
      fact({ id: "borderline-keep", confidence: MIN_CONFIDENCE_FOR_PROMPT }),
      fact({ id: "borderline-drop", confidence: 0.29 }),
    ];
    const ordered = selectTopFacts(facts).map((f) => f.id);
    expect(ordered).toEqual(["hi", "med", "borderline-keep"]);
  });

  it("breaks ties on confidence by last_referenced_at DESC (nulls last)", () => {
    const facts = [
      fact({
        id: "older-ref",
        confidence: 0.8,
        last_referenced_at: "2026-01-01T00:00:00Z",
      }),
      fact({
        id: "never-ref",
        confidence: 0.8,
        last_referenced_at: null,
      }),
      fact({
        id: "newer-ref",
        confidence: 0.8,
        last_referenced_at: "2026-04-01T00:00:00Z",
      }),
    ];
    const ordered = selectTopFacts(facts).map((f) => f.id);
    expect(ordered).toEqual(["newer-ref", "older-ref", "never-ref"]);
  });

  it("returns [] when n <= 0", () => {
    expect(selectTopFacts([fact()], 0)).toEqual([]);
    expect(selectTopFacts([fact()], -3)).toEqual([]);
  });
});

describe("formatUserFactsSection", () => {
  it("returns empty string for 0 facts (no header)", () => {
    expect(formatUserFactsSection([])).toBe("");
  });

  it("renders one fact as a single bullet with the correct bucket", () => {
    const out = formatUserFactsSection([
      fact({
        fact_type: "goal",
        content: "pass IELTS 7.5 by June",
        confidence: 0.9,
      }),
    ]);
    expect(out).toContain("## Things I remember about you");
    expect(out).toContain("- Goal: pass IELTS 7.5 by June  (high confidence)");
  });

  it("renders all 10 facts when given 10", () => {
    const facts = Array.from({ length: 10 }, (_, i) =>
      fact({
        id: `f-${i}`,
        content: `fact-${i}`,
        confidence: 0.9 - i * 0.05,
      }),
    );
    const out = formatUserFactsSection(facts);
    const bulletCount = out.split("\n").filter((l) => l.startsWith("- ")).length;
    expect(bulletCount).toBe(10);
  });

  it("uses the correct bucket label per fact", () => {
    const out = formatUserFactsSection([
      fact({
        fact_type: "preference",
        content: "wants short replies",
        confidence: 0.85,
      }),
      fact({
        fact_type: "context",
        content: "lives in Saigon",
        confidence: 0.6,
      }),
      fact({
        fact_type: "avoidance",
        content: "dislikes long lectures",
        confidence: 0.4,
      }),
    ]);
    expect(out).toContain("Preference: wants short replies  (high confidence)");
    expect(out).toContain("Context: lives in Saigon  (medium confidence)");
    expect(out).toContain("Avoidance: dislikes long lectures  (low confidence)");
  });

  it("renders the header guidance line so the model knows how to use facts", () => {
    const out = formatUserFactsSection([fact()]);
    expect(out).toContain("Use these facts to choose pacing");
    expect(out).toContain("Don't quote them");
  });
});

describe("end-to-end: select then format", () => {
  it("sorts and formats a mixed-confidence batch correctly", () => {
    const raw: EdgeUserFact[] = [
      fact({ id: "a", fact_type: "preference", content: "VN-first", confidence: 0.9 }),
      fact({ id: "b", fact_type: "goal",       content: "IELTS 7.5",  confidence: 0.95 }),
      fact({ id: "c", fact_type: "context",    content: "old",         confidence: 0.2 }), // dropped
      fact({ id: "d", fact_type: "avoidance",  content: "no slang",    confidence: 0.6 }),
    ];
    const top = selectTopFacts(raw);
    const out = formatUserFactsSection(top);

    // 'old' below the floor is gone.
    expect(out).not.toContain("old");
    // Highest confidence renders first.
    const lines = out.split("\n").filter((l) => l.startsWith("- "));
    expect(lines[0]).toContain("Goal: IELTS 7.5");
    expect(lines[1]).toContain("Preference: VN-first");
    expect(lines[2]).toContain("Avoidance: no slang");
    expect(lines.length).toBe(3);
  });
});
