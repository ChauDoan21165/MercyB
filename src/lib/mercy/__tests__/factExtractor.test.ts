import { describe, it, expect } from "vitest";
import { extractFactsFromMessage } from "../factExtractor";

describe("extractFactsFromMessage — edge cases", () => {
  it("returns [] for empty / whitespace / non-string", () => {
    expect(extractFactsFromMessage("")).toEqual([]);
    expect(extractFactsFromMessage("   ")).toEqual([]);
    // @ts-expect-error — defensive runtime guard
    expect(extractFactsFromMessage(null)).toEqual([]);
    // @ts-expect-error — defensive runtime guard
    expect(extractFactsFromMessage(123)).toEqual([]);
  });

  it("returns [] for messages with no fact-like patterns", () => {
    expect(extractFactsFromMessage("Hello, how are you?")).toEqual([]);
    expect(extractFactsFromMessage("Tell me about the weather")).toEqual([]);
  });
});

describe("goal extraction (EN)", () => {
  it("captures 'I want to ...'", () => {
    const r = extractFactsFromMessage("I want to pass IELTS 7.5 by June");
    expect(r).toHaveLength(1);
    expect(r[0]).toMatchObject({
      factType: "goal",
      confidence: 0.5,
    });
    expect(r[0].content).toContain("pass IELTS");
  });

  it("captures 'My goal is to ...'", () => {
    const r = extractFactsFromMessage("My goal is to move to Canada next year.");
    expect(r).toHaveLength(1);
    expect(r[0].factType).toBe("goal");
    expect(r[0].content.toLowerCase()).toContain("move to canada");
  });
});

describe("goal extraction (VN)", () => {
  it("captures 'tôi muốn ...'", () => {
    const r = extractFactsFromMessage("Tôi muốn đậu IELTS 7.0 trong năm nay.");
    expect(r.some((c) => c.factType === "goal")).toBe(true);
  });
});

describe("preference extraction", () => {
  it("captures 'I prefer ...'", () => {
    const r = extractFactsFromMessage("I prefer short replies, please.");
    expect(r.some((c) => c.factType === "preference" && c.content.includes("short replies"))).toBe(true);
  });

  it("captures 'I like ...'", () => {
    const r = extractFactsFromMessage("I really like learning with examples.");
    expect(r.some((c) => c.factType === "preference")).toBe(true);
  });

  it("captures VN 'tôi thích ...'", () => {
    const r = extractFactsFromMessage("Tôi thích học bằng ví dụ thực tế.");
    expect(r.some((c) => c.factType === "preference")).toBe(true);
  });
});

describe("avoidance extraction (runs first to beat 'I like')", () => {
  it("captures 'I don't like ...' as avoidance, not preference", () => {
    const r = extractFactsFromMessage("I don't like long lectures.");
    const types = r.map((c) => c.factType);
    expect(types).toContain("avoidance");
    // Should NOT also yield a 'preference' for "long lectures"
    expect(r.find((c) => c.factType === "preference" && /long lectures/i.test(c.content))).toBeUndefined();
  });

  it("captures 'I hate ...'", () => {
    const r = extractFactsFromMessage("I hate grammar drills.");
    expect(r.some((c) => c.factType === "avoidance" && /grammar drills/i.test(c.content))).toBe(true);
  });

  it("captures 'Please don't ...'", () => {
    const r = extractFactsFromMessage("Please don't show me Vietnamese translations.");
    expect(r.some((c) => c.factType === "avoidance")).toBe(true);
  });
});

describe("context extraction", () => {
  it("captures 'I work as a ...'", () => {
    const r = extractFactsFromMessage("I work as a nurse in a hospital.");
    expect(r.some((c) => c.factType === "context" && /nurse/i.test(c.content))).toBe(true);
  });

  it("captures 'I am a ...'", () => {
    const r = extractFactsFromMessage("I am a teacher with 10 years experience.");
    expect(r.some((c) => c.factType === "context" && /teacher/i.test(c.content))).toBe(true);
  });

  it("captures 'I live in ...'", () => {
    const r = extractFactsFromMessage("I live in Saigon.");
    expect(r.some((c) => c.factType === "context" && /saigon/i.test(c.content))).toBe(true);
  });

  it("captures 'I have N kids/children'", () => {
    const r = extractFactsFromMessage("I have 2 kids who study English at home.");
    expect(r.some((c) => c.factType === "context" && /2 kids/i.test(c.content))).toBe(true);
  });
});

describe("multiple facts in one message", () => {
  it("extracts goal + context from compound sentence", () => {
    const r = extractFactsFromMessage(
      "I work as a nurse and I want to pass IELTS 6.5 next month.",
    );
    const types = r.map((c) => c.factType).sort();
    expect(types).toContain("context");
    expect(types).toContain("goal");
  });

  it("dedupes identical candidates from a single message", () => {
    const r = extractFactsFromMessage(
      "I want to learn faster. I want to learn faster.",
    );
    expect(r.filter((c) => /learn faster/i.test(c.content))).toHaveLength(1);
  });
});

describe("output shape contract", () => {
  it("every candidate has confidence 0.5 and a non-empty matchedText", () => {
    const r = extractFactsFromMessage(
      "I work as a chef. I prefer slower lessons.",
    );
    for (const c of r) {
      expect(c.confidence).toBe(0.5);
      expect(c.matchedText.length).toBeGreaterThan(0);
      expect(c.content.length).toBeGreaterThan(0);
      expect(c.content.length).toBeLessThanOrEqual(200);
    }
  });
});
