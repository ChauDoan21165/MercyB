import { describe, expect, it } from "vitest";

import punjabiExitTicketsB2, {
  punjabiExitTicketsB2 as namedPunjabiExitTicketsB2,
  type PunjabiExitTicketsB2Focus,
  type PunjabiExitTicketsB2Topic,
} from "../exitTicketsB2";

const gurmukhiPattern = /[\u0A00-\u0A7F]/u;
const nativeReviewClaimPattern =
  /\b(native[- ]reviewed|reviewed by native|native approved|native speaker reviewed)\b/i;
const forbiddenSystemsPattern =
  /\b(audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config)\b/i;

const requiredFocuses: PunjabiExitTicketsB2Focus[] = [
  "structured_opinion",
  "comparison",
  "counterpoint",
  "recommendation",
  "workplace_fairness",
];

const requiredTopics: PunjabiExitTicketsB2Topic[] = [
  "settlement",
  "education",
  "healthcare_access",
  "housing",
  "transport",
  "public_service",
  "work",
];

describe("punjabiExitTicketsB2", () => {
  it("exports the same compact app-consumable exit tickets as default and named exports", () => {
    expect(punjabiExitTicketsB2).toBe(namedPunjabiExitTicketsB2);
    expect(punjabiExitTicketsB2.length).toBeGreaterThanOrEqual(11);
    expect(punjabiExitTicketsB2.length).toBeLessThanOrEqual(18);
  });

  it("covers B2 exit focuses and practical topics", () => {
    for (const focus of requiredFocuses) {
      expect(
        punjabiExitTicketsB2.some((ticket) => ticket.exitFocus === focus),
        `missing focus ${focus}`,
      ).toBe(true);
    }

    for (const topic of requiredTopics) {
      expect(
        punjabiExitTicketsB2.some((ticket) => ticket.topic === topic),
        `missing topic ${topic}`,
      ).toBe(true);
    }
  });

  it("keeps Gurmukhi primary with romanization plus Vietnamese and English support", () => {
    for (const ticket of punjabiExitTicketsB2) {
      expect(ticket.level).toBe("B2");
      expect(ticket.id).toMatch(/^pa_b2_exit_/);
      expect(ticket.exitTicket_gurmukhi).toMatch(gurmukhiPattern);
      expect(ticket.sampleExit_gurmukhi).toMatch(gurmukhiPattern);
      expect(ticket.exitTicket_romanization).not.toMatch(gurmukhiPattern);
      expect(ticket.sampleExit_romanization).not.toMatch(gurmukhiPattern);
      expect(ticket.exitTicket_vi.length).toBeGreaterThan(40);
      expect(ticket.exitTicket_en.length).toBeGreaterThan(40);
      expect(ticket.sampleExit_vi.length).toBeGreaterThan(40);
      expect(ticket.sampleExit_en.length).toBeGreaterThan(40);
    }
  });

  it("includes exit-ticket, final-proof, and final-QA style fields", () => {
    for (const ticket of punjabiExitTicketsB2) {
      expect(ticket.exitTicket_en).toContain("proving");
      expect(ticket.finalProof_vi.length).toBeGreaterThanOrEqual(3);
      expect(ticket.finalProof_en.length).toBe(ticket.finalProof_vi.length);
      expect(ticket.finalQa_vi.length).toBeGreaterThanOrEqual(3);
      expect(ticket.finalQa_en.length).toBe(ticket.finalQa_vi.length);
      expect(ticket.learnerTrap_vi.length).toBeGreaterThan(20);
      expect(ticket.learnerTrap_en.length).toBeGreaterThan(20);
    }
  });

  it("includes Canada-practical examples where useful", () => {
    const examples = punjabiExitTicketsB2.filter(
      (ticket) => ticket.canadaPracticalExample_vi && ticket.canadaPracticalExample_en,
    );

    expect(examples.length).toBeGreaterThanOrEqual(6);
  });

  it("keeps script awareness and deferred review within the allowed scope", () => {
    const serialized = JSON.stringify(punjabiExitTicketsB2);
    const shahmukhiMentions = serialized.match(/Shahmukhi/g) ?? [];

    expect(shahmukhiMentions.length).toBeLessThanOrEqual(1);
    expect(serialized).toContain("awareness only");
    expect(serialized).toContain("deferred");
    expect(serialized).not.toMatch(nativeReviewClaimPattern);
    expect(serialized).not.toMatch(forbiddenSystemsPattern);
  });
});
