// Punjabi C2 exit ticket guards. These validate app-consumable structure and
// scope, not certification, official placement, or native review.

import { describe, expect, it } from "vitest";

import {
  C2_EXIT_TICKETS_DISCLAIMER,
  exitTicketsC2,
  exitTicketsC2ByFocus,
  type PunjabiC2ExitFocus,
  type PunjabiC2ExitTicket,
} from "@/languages/punjabi/exitTicketsC2";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const hasGurmukhi = (s: string) => GURMUKHI_RANGE.test(s);

const REQUIRED_FOCUSES: PunjabiC2ExitFocus[] = [
  "nuanced_disagreement",
  "negotiation",
  "diplomacy",
  "mediation",
  "deescalation",
  "sensitive_topic_framing",
  "audience_adaptation",
  "advanced_register",
  "community_discourse",
  "professional_discourse",
  "public_discourse",
];

describe("Punjabi C2 exit tickets - coverage", () => {
  it("ships compact app-consumable exit tickets", () => {
    expect(exitTicketsC2.length).toBeGreaterThanOrEqual(11);
    expect(exitTicketsC2.length).toBeLessThanOrEqual(13);
  });

  it("covers every required C2 exit focus", () => {
    const seen = new Set(exitTicketsC2.map((ticket) => ticket.focus));
    for (const focus of REQUIRED_FOCUSES) {
      expect(seen.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("has unique non-empty ids", () => {
    const ids = exitTicketsC2.map((ticket) => ticket.id);
    expect(ids.every((id) => id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("exitTicketsC2ByFocus returns only matching tickets", () => {
    for (const focus of REQUIRED_FOCUSES) {
      const subset = exitTicketsC2ByFocus(focus);
      expect(subset.length, focus).toBeGreaterThan(0);
      expect(subset.every((ticket) => ticket.focus === focus), focus).toBe(true);
    }
  });
});

describe("Punjabi C2 exit tickets - bilingual integrity", () => {
  it("each ticket has VI+EN situation and task", () => {
    for (const ticket of exitTicketsC2) {
      expect(ticket.title_vi.length, `${ticket.id} title_vi`).toBeGreaterThan(0);
      expect(ticket.title_en.length, `${ticket.id} title_en`).toBeGreaterThan(0);
      expect(ticket.situation_vi.length, `${ticket.id} situation_vi`).toBeGreaterThan(0);
      expect(ticket.situation_en.length, `${ticket.id} situation_en`).toBeGreaterThan(0);
      expect(ticket.task_vi.length, `${ticket.id} task_vi`).toBeGreaterThan(0);
      expect(ticket.task_en.length, `${ticket.id} task_en`).toBeGreaterThan(0);
    }
  });

  it("each target answer has Gurmukhi, romanization, Vietnamese, and English", () => {
    for (const ticket of exitTicketsC2) {
      expect(hasGurmukhi(ticket.target_gurmukhi), `${ticket.id} target_gurmukhi`).toBe(true);
      expect(ticket.target_romanization.length, `${ticket.id} target_romanization`).toBeGreaterThan(0);
      expect(ticket.target_vi.length, `${ticket.id} target_vi`).toBeGreaterThan(0);
      expect(ticket.target_en.length, `${ticket.id} target_en`).toBeGreaterThan(0);
    }
  });

  it("each quick phrase has Gurmukhi, romanization, VI, and EN", () => {
    for (const ticket of exitTicketsC2) {
      expect(ticket.quick_phrases.length, `${ticket.id} phrases`).toBeGreaterThanOrEqual(2);
      for (const phrase of ticket.quick_phrases) {
        expect(hasGurmukhi(phrase.gurmukhi), `${ticket.id} phrase Gurmukhi`).toBe(true);
        expect(phrase.romanization.length, `${ticket.id} phrase romanization`).toBeGreaterThan(0);
        expect(phrase.vi.length, `${ticket.id} phrase vi`).toBeGreaterThan(0);
        expect(phrase.en.length, `${ticket.id} phrase en`).toBeGreaterThan(0);
      }
    }
  });

  it("includes exit-ticket, final-proof, and final-QA style items", () => {
    const styles = new Set(exitTicketsC2.map((ticket) => ticket.style));
    expect(styles.has("exit_ticket")).toBe(true);
    expect(styles.has("final_proof")).toBe(true);
    expect(styles.has("final_qa")).toBe(true);
  });

  it("each ticket carries final proof signals", () => {
    for (const ticket of exitTicketsC2) {
      expect(ticket.final_proof.length, `${ticket.id} proof`).toBeGreaterThanOrEqual(1);
      for (const proof of ticket.final_proof) {
        expect(proof.proof_vi.length, `${ticket.id} proof_vi`).toBeGreaterThan(0);
        expect(proof.proof_en.length, `${ticket.id} proof_en`).toBeGreaterThan(0);
        expect(hasGurmukhi(proof.signal_gurmukhi), `${ticket.id} signal_gurmukhi`).toBe(true);
        expect(proof.signal_romanization.length, `${ticket.id} signal_romanization`).toBeGreaterThan(0);
      }
    }
  });

  it("includes learner traps and Canada-practical examples where useful", () => {
    expect(exitTicketsC2.filter((ticket) => ticket.learner_trap).length).toBeGreaterThanOrEqual(9);
    const canadaTickets = exitTicketsC2.filter((ticket) => ticket.canada_practical);
    expect(canadaTickets.length).toBeGreaterThanOrEqual(3);
    expect(JSON.stringify(canadaTickets).toLowerCase()).toContain("canada");
  });
});

describe("Punjabi C2 exit tickets - scope framing", () => {
  it("exposes study-support, deferred-review, Shahmukhi-awareness disclaimer", () => {
    expect(C2_EXIT_TICKETS_DISCLAIMER.vi.length).toBeGreaterThan(0);
    expect(C2_EXIT_TICKETS_DISCLAIMER.en.length).toBeGreaterThan(0);
    const disclaimer =
      `${C2_EXIT_TICKETS_DISCLAIMER.vi} ${C2_EXIT_TICKETS_DISCLAIMER.en}`.toLowerCase();
    expect(disclaimer).toContain("gurmukhi");
    expect(disclaimer).toContain("native review is deferred");
    expect(disclaimer).toContain("not certification");
    expect(disclaimer).toContain("official placement");
    expect(disclaimer).toContain("shahmukhi");
    expect(disclaimer).toContain("awareness");
    expect(disclaimer).not.toContain("full shahmukhi course");
  });

  it("does not claim native review, certification, official placement, or legal authority", () => {
    const blob = JSON.stringify(exitTicketsC2).toLowerCase();
    expect(blob).not.toContain("native-reviewed");
    expect(blob).not.toContain("native-certified");
    expect(blob).not.toContain("certified by a native");
    expect(blob).not.toContain("official placement");
    expect(blob).not.toContain("legal advice");
  });
});

const _typecheck: PunjabiC2ExitTicket[] = exitTicketsC2;
void _typecheck;
