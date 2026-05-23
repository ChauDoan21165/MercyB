/**
 * PB4 Mock Provider — Tests (PB4-T1 through T4-T12)
 *
 * Coverage: canned responses per mode, determinism, error simulation.
 */

import { describe, it, expect } from "vitest";
import {
  createMockProvider,
  generateMockResponse,
  getCannedResponse,
  simulateProviderCall,
} from "../mockProvider";
import type {
  MockProvider,
  MockProviderConfig,
  MockProviderResult,
} from "../mockProvider";
import type {
  TutorConversationMode,
  TutorResponse,
} from "../types";

// ─── Helpers ───────────────────────────────────────────────────────────

const config: MockProviderConfig = { seed: 42, errorRate: 0 };
const allModes: TutorConversationMode[] = [
  "general_chat", "sentence_correction", "writing_feedback",
  "pronunciation_coaching", "lesson_guidance",
];

// ─── PB4-T1: All 5 modes return canned responses ────────────────────

describe("getCannedResponse — mode coverage", () => {
  it("PB4-T1a: general_chat returns Vietnamese text", () => {
    const r = getCannedResponse("general_chat", "hello", 42, 0);
    expect(r.vi.length).toBeGreaterThan(10);
    expect(r.nextSteps.length).toBeGreaterThan(0);
  });

  it("PB4-T1b: sentence_correction returns corrected structure", () => {
    const r = getCannedResponse("sentence_correction", "i go yesterday", 42, 0);
    expect(r.vi.length).toBeGreaterThan(10);
    // Should have corrected sentence or be already-correct
    expect(r.vi.length).toBeGreaterThan(0);
  });

  it("PB4-T1c: writing_feedback returns pattern observation", () => {
    const r = getCannedResponse("writing_feedback", "long paragraph text here", 42, 0);
    expect(r.vi.length).toBeGreaterThan(10);
  });

  it("PB4-T1d: pronunciation_coaching returns coaching text", () => {
    const r = getCannedResponse("pronunciation_coaching", "three", 42, 0);
    expect(r.vi.length).toBeGreaterThan(10);
    // Should have practice sentence in pronunciation mode
    if (r.practiceSentence) {
      expect(r.practiceSentence.length).toBeGreaterThan(0);
    }
  });

  it("PB4-T1e: lesson_guidance returns lesson text", () => {
    const r = getCannedResponse("lesson_guidance", "past tense", 42, 0);
    expect(r.vi.length).toBeGreaterThan(10);
  });
});

// ─── PB4-T2: Each mode has ≥3 canned responses ─────────────────────

describe("canned response count", () => {
  it("PB4-T2: all modes have at least 3 responses via rotation", () => {
    for (const mode of allModes) {
      const responses = new Set<string>();
      // Call with different callCount to rotate through responses
      for (let i = 0; i < 20; i++) {
        const r = getCannedResponse(mode, `input_${i}`, 42, i);
        responses.add(r.vi);
      }
      expect(responses.size).toBeGreaterThanOrEqual(3);
    }
  });
});

// ─── PB4-T3: getCannedResponse is deterministic ─────────────────────

describe("getCannedResponse determinism", () => {
  it("PB4-T3: same input produces same response", () => {
    const r1 = getCannedResponse("general_chat", "hello", 42, 0);
    const r2 = getCannedResponse("general_chat", "hello", 42, 0);
    const r3 = getCannedResponse("general_chat", "hello", 42, 0);
    expect(r1).toEqual(r2);
    expect(r2).toEqual(r3);
  });

  it("PB4-T3b: different seed produces potentially different response", () => {
    const r1 = getCannedResponse("general_chat", "hello", 42, 0);
    const r2 = getCannedResponse("general_chat", "hello", 999, 0);
    // May be same or different — both valid, but function is deterministic per seed
    expect(r1.vi.length).toBeGreaterThan(0);
    expect(r2.vi.length).toBeGreaterThan(0);
  });
});

// ─── PB4-T4: generateMockResponse is deterministic ─────────────────

describe("generateMockResponse", () => {
  it("PB4-T4: deterministic for same request input", () => {
    const r1 = generateMockResponse("general_chat", "test input", 42, 0);
    const r2 = generateMockResponse("general_chat", "test input", 42, 0);
    expect(r1).toEqual(r2);
  });

  it("PB4-T4b: includes token counts", () => {
    const r = generateMockResponse("general_chat", "hello world", 42, 0);
    expect(r.inputTokens).toBeGreaterThan(0);
    expect(r.outputTokens).toBeGreaterThan(0);
  });
});

// ─── PB4-T5: simulateProviderCall deterministic ────────────────────

describe("simulateProviderCall", () => {
  it("PB4-T5: deterministic for same seed and requestId", () => {
    const p1 = createMockProvider({ seed: 42, errorRate: 0.5 });
    const p2 = createMockProvider({ seed: 42, errorRate: 0.5 });

    const r1 = simulateProviderCall(p1, "general_chat", "hello", "req_001");
    const r2 = simulateProviderCall(p2, "general_chat", "hello", "req_001");

    expect(r1).toEqual(r2);
  });
});

// ─── PB4-T6: errorRate 0 always succeeds ───────────────────────────

describe("error rate behavior", () => {
  it("PB4-T6: errorRate 0 always succeeds", () => {
    const p = createMockProvider({ seed: 42, errorRate: 0 });
    for (let i = 0; i < 20; i++) {
      const r = simulateProviderCall(p, "general_chat", "hello", `req_${i}`);
      expect(r.ok).toBe(true);
    }
  });

  // ─── PB4-T7: errorRate 1 always fails ───────────────────────────

  it("PB4-T7: errorRate 1 always fails", () => {
    const p = createMockProvider({ seed: 42, errorRate: 1 });
    for (let i = 0; i < 20; i++) {
      const r = simulateProviderCall(p, "general_chat", "hello", `req_${i}`);
      expect(r.ok).toBe(false);
    }
  });

  // ─── PB4-T8: fallback/error result shape is stable ──────────────

  it("PB4-T8: error result has stable shape", () => {
    const p = createMockProvider({ seed: 42, errorRate: 1 });
    const r = simulateProviderCall(p, "general_chat", "hello", "req_test");
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.errorKind).toBeTruthy();
      expect(r.messageVi.length).toBeGreaterThan(10);
      expect(r.requestId).toBe("req_test");
    }
  });

  it("PB4-T8b: success result has stable shape", () => {
    const p = createMockProvider({ seed: 42, errorRate: 0 });
    const r = simulateProviderCall(p, "general_chat", "hello", "req_test");
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.response.vi.length).toBeGreaterThan(10);
      expect(r.requestId).toBe("req_test");
      expect(r.tokensUsed.input).toBeGreaterThan(0);
      expect(r.tokensUsed.output).toBeGreaterThan(0);
    }
  });
});
