import { describe, expect, it } from "vitest";

import {
  PUNJABI_EXIT_TICKET_FOCI,
  PUNJABI_EXIT_TICKET_PROOFS,
  PUNJABI_REMEDIATION_EXIT_TICKETS_NOTICE,
  punjabiRemediationExitTickets,
  type PunjabiRemediationExitTicket,
} from "@/languages/punjabi/remediationExitTickets";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS = /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiRemediationExitTickets - size and identity", () => {
  it("keeps a compact useful exit-ticket set", () => {
    expect(punjabiRemediationExitTickets.length).toBeGreaterThanOrEqual(14);
    expect(punjabiRemediationExitTickets.length).toBeLessThanOrEqual(45);
  });

  it("has unique exit-ticket ids", () => {
    const ids = punjabiRemediationExitTickets.map((ticket) => ticket.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^exit-[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiRemediationExitTickets - app fields", () => {
  const requiredText: (keyof PunjabiRemediationExitTicket)[] = [
    "ticketPrompt_vi",
    "ticketPrompt_en",
    "target_pa",
    "target_en",
    "passCriteria",
    "retryIf",
    "explanation_vi",
    "explanation_en",
    "remediationRouteId",
    "finalQaUse",
    "commonTrap",
  ];

  it("fills every required exit-ticket field", () => {
    for (const ticket of punjabiRemediationExitTickets) {
      for (const key of requiredText) {
        const value = ticket[key];
        expect(typeof value, `${ticket.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${ticket.id}.${key}`).toBeGreaterThan(0);
      }
    }
  });

  it("uses Gurmukhi primary targets with romanization only as support", () => {
    for (const ticket of punjabiRemediationExitTickets) {
      expect(GURMUKHI_SCRIPT.test(ticket.target_pa), `${ticket.id}.target_pa`).toBe(true);
      expect(ticket.target_pa).not.toBe(ticket.target_roman);
    }
  });

  it("keeps Vietnamese and English learner guidance distinct", () => {
    for (const ticket of punjabiRemediationExitTickets) {
      expect(ticket.ticketPrompt_vi).not.toBe(ticket.ticketPrompt_en);
      expect(ticket.explanation_vi).not.toBe(ticket.explanation_en);
      expect(
        VIETNAMESE_MARKS.test(ticket.ticketPrompt_vi) || VIETNAMESE_MARKS.test(ticket.explanation_vi),
        `${ticket.id} should include Vietnamese text`,
      ).toBe(true);
    }
  });
});

describe("punjabiRemediationExitTickets - coverage and final QA", () => {
  it("covers every requested exit-ticket focus", () => {
    const present = new Set<PunjabiRemediationExitTicket["focus"]>();
    for (const ticket of punjabiRemediationExitTickets) {
      expect(PUNJABI_EXIT_TICKET_FOCI).toContain(ticket.focus);
      present.add(ticket.focus);
    }
    for (const focus of PUNJABI_EXIT_TICKET_FOCI) {
      expect(present.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("uses all proof types and learner audiences", () => {
    const proofs = new Set<PunjabiRemediationExitTicket["proofType"]>();
    const audiences = new Set<PunjabiRemediationExitTicket["audience"]>();
    for (const ticket of punjabiRemediationExitTickets) {
      expect(PUNJABI_EXIT_TICKET_PROOFS).toContain(ticket.proofType);
      proofs.add(ticket.proofType);
      audiences.add(ticket.audience);
    }
    for (const proof of PUNJABI_EXIT_TICKET_PROOFS) {
      expect(proofs.has(proof), `missing proof ${proof}`).toBe(true);
    }
    expect(audiences.has("vi")).toBe(true);
    expect(audiences.has("en")).toBe(true);
    expect(audiences.has("both")).toBe(true);
  });

  it("links every exit ticket to remediation and final QA use", () => {
    for (const ticket of punjabiRemediationExitTickets) {
      expect(ticket.remediationRouteId).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(ticket.passCriteria.length).toBeGreaterThan(8);
      expect(ticket.retryIf.length).toBeGreaterThan(8);
      expect(ticket.finalQaUse.toLowerCase()).toMatch(/confirm|block/);
    }
  });

  it("includes Canada-practical exit tickets", () => {
    const canadaTickets = punjabiRemediationExitTickets.filter((ticket) => ticket.canadaPractical);
    expect(canadaTickets.length).toBeGreaterThanOrEqual(7);
    expect(canadaTickets.some((ticket) => ticket.target_pa.includes("ਲਾਇਬ੍ਰੇਰੀ"))).toBe(true);
    expect(canadaTickets.some((ticket) => ticket.target_pa.includes("ਅਰਜ਼ੀ"))).toBe(true);
    expect(canadaTickets.some((ticket) => ticket.target_pa.includes("ਅਪਾਇੰਟਮੈਂਟ"))).toBe(true);
  });
});

describe("punjabiRemediationExitTickets - guardrails", () => {
  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const serialized = `${PUNJABI_REMEDIATION_EXIT_TICKETS_NOTICE} ${JSON.stringify(
      punjabiRemediationExitTickets,
    )}`.toLowerCase();
    expect(serialized).toContain("shahmukhi");
    expect(serialized).toContain("awareness");
    expect(serialized).toContain("not a full course");
  });

  it("does not claim native review, official placement, or A11 integration", () => {
    const notice = PUNJABI_REMEDIATION_EXIT_TICKETS_NOTICE.toLowerCase();
    expect(notice).toContain("wave 21 exit tickets only");
    expect(notice).toContain("not a11 integration");
    expect(notice).toContain("study support only");
    expect(notice).toContain("not official placement");
    expect(notice).toContain("native review deferred");
    expect(notice).not.toContain("native reviewed");
  });
});
