import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { detectBilingualSaliencePivot, type BilingualSaliencePivot } from "@/lib/tutor/bilingualSalienceDetector";
import {
  buildConstrainedPivotPrompt,
  checkPivotCandidate,
  decidePivotResponse,
  type PivotPromptInput,
} from "@/lib/tutor/pivotPromptSafety";

function salience(input: string): BilingualSaliencePivot {
  const pivot = detectBilingualSaliencePivot(input);
  expect(pivot).not.toBeNull();
  return pivot as BilingualSaliencePivot;
}

const basePromptInput: PivotPromptInput = {
  currentLearnerReply: "My wife burned the fish after work.",
  selectedSaliencePivot: salience("My wife burned the fish after work."),
  sessionTurns: [
    { role: "assistant", text: "What do you usually do in the morning?" },
    { role: "learner", text: "I drink coffee." },
    { role: "assistant", text: "What did you do after work?" },
    { role: "learner", text: "My wife burned the fish." },
    { role: "assistant", text: "What did you eat instead?" },
  ],
};

describe("pivotPromptSafety", () => {
  it("builds a constrained prompt with the current reply and last 3 turns only", () => {
    const prompt = buildConstrainedPivotPrompt(basePromptInput);

    expect(prompt).toContain("Current learner reply: My wife burned the fish after work.");
    expect(prompt).toContain("assistant: What did you do after work?");
    expect(prompt).toContain("learner: My wife burned the fish.");
    expect(prompt).toContain("assistant: What did you eat instead?");
    expect(prompt).not.toContain("What do you usually do in the morning?");
    expect(prompt).not.toContain("I drink coffee.");
    expect(prompt).toContain("Write 1-2 short sentences.");
    expect(prompt).toContain("Ask exactly one natural follow-up question.");
    expect(prompt).toContain("Use simple English for a Vietnamese learner.");
    expect(prompt).toContain("Do not introduce a new topic.");
    expect(prompt).toContain("Do not use hollow praise");
  });

  it("includes the salience token from the Layer 1 output shape", () => {
    const prompt = buildConstrainedPivotPrompt(basePromptInput);

    expect(prompt).toContain("Salience token: burned");
  });

  it("preserves B/C/B salience decisions in the prompt", () => {
    const highStakesPrompt = buildConstrainedPivotPrompt({
      ...basePromptInput,
      currentLearnerReply: "My father passed away.",
      selectedSaliencePivot: salience("My father passed away."),
    });
    const contradictionPrompt = buildConstrainedPivotPrompt({
      ...basePromptInput,
      currentLearnerReply: "Actually, I stayed home.",
      selectedSaliencePivot: salience("Actually, I stayed home."),
    });
    const ordinaryPrompt = buildConstrainedPivotPrompt(basePromptInput);

    expect(highStakesPrompt).toContain("Salience signal type: high_stakes");
    expect(highStakesPrompt).toContain("Salience high stakes: yes");
    expect(contradictionPrompt).toContain("Salience signal type: contradiction");
    expect(contradictionPrompt).toContain("Salience high stakes: no");
    expect(ordinaryPrompt).toContain("Salience signal type: ordinary_salience");
    expect(ordinaryPrompt).toContain("Salience high stakes: no");
  });

  it("accepts a valid mocked candidate response", () => {
    const result = checkPivotCandidate("The fish burned after work. What did you eat instead?");

    expect(result).toEqual({
      ok: true,
      text: "The fish burned after work. What did you eat instead?",
    });
  });

  it("rejects a mocked candidate with more than 30 words", () => {
    const result = checkPivotCandidate(
      "The fish burned after work, and that sounds like a busy evening, so can you slowly explain every step from cooking to eating and cleaning the kitchen, then describe how everyone felt afterward?",
    );

    expect(result).toEqual({ ok: false, reason: "too_long" });
  });

  it("rejects a mocked candidate that says As an AI", () => {
    const result = checkPivotCandidate("As an AI, I can ask about your dinner.");

    expect(result).toEqual({ ok: false, reason: "as_ai" });
  });

  it("rejects hollow praise in mocked candidates", () => {
    expect(checkPivotCandidate("Great job, the fish burned. What did you eat?")).toEqual({
      ok: false,
      reason: "hollow_praise",
    });
    expect(checkPivotCandidate("Nice, the fish burned. What did you eat?")).toEqual({
      ok: false,
      reason: "hollow_praise",
    });
  });

  it("rejects candidates with more than one follow-up question", () => {
    expect(checkPivotCandidate("The fish burned. What did you eat? Did everyone feel okay?")).toEqual({
      ok: false,
      reason: "multiple_questions",
    });
  });

  it("rejects a repeated previous assistant response", () => {
    const result = checkPivotCandidate(
      "What did you eat instead?",
      " What did you eat instead? ",
    );

    expect(result).toEqual({ ok: false, reason: "repeated_previous_assistant" });
  });

  it("rejects missing ending punctuation", () => {
    const result = checkPivotCandidate("The fish burned after work");

    expect(result).toEqual({ ok: false, reason: "missing_punctuation" });
  });

  it("uses the pivot response when the mocked candidate is valid", () => {
    const decision = decidePivotResponse({
      promptInput: basePromptInput,
      candidate: "The fish burned after work. What did you eat instead?",
    });

    expect(decision).toEqual({
      source: "pivot",
      text: "The fish burned after work. What did you eat instead?",
    });
  });

  it("returns deterministic fallback on invalid mocked candidate", () => {
    const decision = decidePivotResponse({
      promptInput: basePromptInput,
      candidate: "Great job, tell me everything about dinner.",
    });

    expect(decision).toEqual({
      source: "deterministic_fallback",
      text: "I understand burned. What happened next?",
      rejectReason: "hollow_praise",
    });
  });

  it("returns deterministic fallback on timeout or failure", () => {
    const decision = decidePivotResponse({
      promptInput: basePromptInput,
      failed: true,
    });

    expect(decision).toEqual({
      source: "deterministic_fallback",
      text: "I understand burned. What happened next?",
      rejectReason: "timeout_or_failure",
    });
  });

  it("has no provider, secret, pronunciation, or network dependency", () => {
    const source = readFileSync("src/lib/tutor/pivotPromptSafety.ts", "utf8");

    expect(source).not.toMatch(/openai|anthropic|provider|secret|azure|pronunciation|fetch\(/i);
  });
});
