import { describe, expect, it } from "vitest";
import { cefrToNumeric, extractSignalsFromTurn } from "../signalExtractor";
import { signalSamples } from "./fixtures/signalSamples";

describe("signalExtractor", () => {
  it.each(signalSamples)("extracts expected level for $id", (sample) => {
    const signal = extractSignalsFromTurn(sample.text, sample.prompt ?? "Tell me about your day.");
    expect(cefrToNumeric(signal.estimated_cefr_this_turn)).toBeLessThanOrEqual(cefrToNumeric(sample.expected) + 1);
    expect(cefrToNumeric(signal.estimated_cefr_this_turn)).toBeGreaterThanOrEqual(Math.max(1, cefrToNumeric(sample.expected) - 1));
  });

  it("extracts A1 simple-vocab signal and grammar gaps", () => {
    const signal = extractSignalsFromTurn("I go school. I tired. Speaking difficult.");
    expect(signal.estimated_cefr_this_turn).toBe("A1");
    expect(signal.notable_gaps.join(" ")).toMatch(/missing be|short answer/);
  });

  it("extracts B1 mid-level signal", () => {
    const signal = extractSignalsFromTurn("I practiced every night because the speakers were fast, and after two months I understood the main idea.");
    expect(["A2", "B1", "B2"]).toContain(signal.estimated_cefr_this_turn);
    expect(signal.notable_strengths).toContain("connects ideas with reasons or contrast");
  });

  it("extracts advanced signal", () => {
    const signal = extractSignalsFromTurn("The silence is rational rather than laziness because students are rewarded for accuracy before they are allowed to communicate.");
    expect(cefrToNumeric(signal.estimated_cefr_this_turn)).toBeGreaterThanOrEqual(4);
  });

  it("notes self-correction as strength", () => {
    const signal = extractSignalsFromTurn("I go, sorry, I went to the interview and explained my plan clearly.");
    expect(signal.notable_strengths.join(" ")).toMatch(/self-correct/);
  });

  it("notes off-topic turn as comprehension gap", () => {
    const signal = extractSignalsFromTurn("Blue coffee table yes.", "Tell me about your job.");
    expect(signal.off_topic).toBe(true);
    expect(signal.notable_gaps).toContain("possible comprehension gap");
  });

  it("detects Vietnamese L1 pattern IDs", () => {
    const signal = extractSignalsFromTurn("Many student in Vietnam learn grammar but he go quiet.");
    expect(signal.l1_interference_flags.map((f) => f.patternId)).toContain("l1_plural_s");
  });

  it("flags embedded Vietnamese code-switch", () => {
    const signal = extractSignalsFromTurn("I go to work bằng xe máy because traffic is heavy.");
    expect(signal.code_switch_detected).toBe(true);
  });

  it("handles empty turn gracefully", () => {
    const signal = extractSignalsFromTurn("");
    expect(signal.insufficient_signal).toBe(true);
    expect(signal.confidence).toBeLessThan(0.2);
  });
});
