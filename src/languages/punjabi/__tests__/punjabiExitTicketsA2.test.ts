// src/languages/punjabi/__tests__/punjabiExitTicketsA2.test.ts
//
// Structural guards for Punjabi A2 exit tickets. This is Wave 21 only, not A11
// integration. These verify app-consumable learner content only; native review
// is deferred.

import { describe, expect, it } from "vitest";

import { exitTicketsA2 } from "@/languages/punjabi/exitTicketsA2";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const hasGurmukhi = (s: string) => GURMUKHI.test(s);
const nonEmpty = (s: unknown): s is string => typeof s === "string" && s.trim().length > 0;

const REQUIRED_SCENARIOS = [
  "daily_routine",
  "appointments",
  "transport",
  "housing",
  "school",
  "childcare",
  "workplace_small_talk",
  "polite_problem_explanation",
  "short_message_comprehension",
  "interaction_repair",
] as const;

const STYLES = ["exit_ticket", "final_proof", "final_qa"] as const;

describe("Punjabi A2 exit tickets — batch shape", () => {
  it("ships compact tickets for all required scenarios", () => {
    expect(exitTicketsA2.length).toBeGreaterThanOrEqual(10);
    expect(exitTicketsA2.length).toBeLessThanOrEqual(14);

    const present = new Set(exitTicketsA2.map((ticket) => ticket.scenario));
    for (const scenario of REQUIRED_SCENARIOS) expect(present.has(scenario)).toBe(true);
  });

  it("has unique ids and valid scenarios/styles", () => {
    const ids = exitTicketsA2.map((ticket) => ticket.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const ticket of exitTicketsA2) {
      expect(REQUIRED_SCENARIOS.includes(ticket.scenario)).toBe(true);
      expect(STYLES.includes(ticket.style)).toBe(true);
    }
  });
});

describe("Punjabi A2 exit tickets — learner contract", () => {
  it("uses Gurmukhi expected answers with romanization and bilingual meaning", () => {
    for (const ticket of exitTicketsA2) {
      expect(nonEmpty(ticket.title_vi)).toBe(true);
      expect(nonEmpty(ticket.title_en)).toBe(true);
      expect(nonEmpty(ticket.prompt_vi)).toBe(true);
      expect(nonEmpty(ticket.prompt_en)).toBe(true);
      expect(hasGurmukhi(ticket.expected.pa)).toBe(true);
      expect(nonEmpty(ticket.expected.romanization)).toBe(true);
      expect(nonEmpty(ticket.expected.vi)).toBe(true);
      expect(nonEmpty(ticket.expected.en)).toBe(true);

      for (const alternate of ticket.accept_also ?? []) {
        expect(hasGurmukhi(alternate.pa)).toBe(true);
        expect(nonEmpty(alternate.romanization)).toBe(true);
        expect(nonEmpty(alternate.vi)).toBe(true);
        expect(nonEmpty(alternate.en)).toBe(true);
      }
    }
  });

  it("includes proof checks, explanations, pass signals, and traps", () => {
    for (const ticket of exitTicketsA2) {
      expect(nonEmpty(ticket.proof_check_vi)).toBe(true);
      expect(nonEmpty(ticket.proof_check_en)).toBe(true);
      expect(nonEmpty(ticket.explanation_vi)).toBe(true);
      expect(nonEmpty(ticket.explanation_en)).toBe(true);
      expect(nonEmpty(ticket.pass_signal_vi)).toBe(true);
      expect(nonEmpty(ticket.pass_signal_en)).toBe(true);
      expect(ticket.traps.length).toBeGreaterThanOrEqual(1);

      for (const trap of ticket.traps) {
        expect(nonEmpty(trap.trap_vi)).toBe(true);
        expect(nonEmpty(trap.trap_en)).toBe(true);
        expect(hasGurmukhi(trap.fix_pa)).toBe(true);
        expect(nonEmpty(trap.fix_romanization)).toBe(true);
      }
    }
  });

  it("includes Shahmukhi awareness only and Canada-practical coverage", () => {
    for (const ticket of exitTicketsA2) {
      expect(ticket.script_awareness_vi).toContain("Shahmukhi");
      expect(ticket.script_awareness_en).toContain("Shahmukhi");
      expect(ticket.script_awareness_en.toLowerCase()).toContain("not as a separate course");
    }

    const canadaTickets = exitTicketsA2.filter((ticket) => ticket.canada_practical_vi || ticket.canada_practical_en);
    expect(canadaTickets.length).toBeGreaterThanOrEqual(7);
    for (const ticket of canadaTickets) {
      expect(nonEmpty(ticket.canada_practical_vi)).toBe(true);
      expect(nonEmpty(ticket.canada_practical_en)).toBe(true);
    }
  });

  it("covers exit-ticket, final-proof, and final-QA styles", () => {
    const styles = new Set(exitTicketsA2.map((ticket) => ticket.style));
    expect(styles.has("exit_ticket")).toBe(true);
    expect(styles.has("final_proof")).toBe(true);
    expect(styles.has("final_qa")).toBe(true);
  });
});
