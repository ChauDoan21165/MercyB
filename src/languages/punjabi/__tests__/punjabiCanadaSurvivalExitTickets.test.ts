import { describe, expect, it } from "vitest";

import tickets, {
  PUNJABI_CANADA_SURVIVAL_EXIT_TICKET_SCOPE,
  PUNJABI_CANADA_SURVIVAL_EXIT_TICKETS,
  type PunjabiCanadaSurvivalExitTicketDomain,
} from "@/languages/punjabi/canadaSurvivalExitTickets";

const GURMUKHI_BLOCK = /[਀-੿]/;

const REQUIRED_DOMAINS: PunjabiCanadaSurvivalExitTicketDomain[] = [
  "clinic",
  "pharmacy",
  "school_childcare",
  "bank",
  "housing",
  "transport",
  "public_office",
  "forms_service_desk",
  "interpreter_request",
  "emergency_boundary",
  "workplace_safety",
];

describe("Punjabi Canada survival exit tickets", () => {
  it("exports app-consumable TypeScript data", () => {
    expect(tickets).toBe(PUNJABI_CANADA_SURVIVAL_EXIT_TICKETS);
    expect(Array.isArray(tickets)).toBe(true);
    expect(PUNJABI_CANADA_SURVIVAL_EXIT_TICKET_SCOPE.name).toContain("Exit Tickets");
  });

  it("covers all required Canada survival exit-ticket domains compactly", () => {
    expect(tickets.length).toBeGreaterThanOrEqual(REQUIRED_DOMAINS.length);
    expect(tickets.length).toBeLessThanOrEqual(18);

    const present = new Set(tickets.map((ticket) => ticket.domain));
    for (const domain of REQUIRED_DOMAINS) {
      expect(present.has(domain), `missing domain: ${domain}`).toBe(true);
    }
  });

  it("has unique ids and all requested ticket styles", () => {
    const ids = tickets.map((ticket) => ticket.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(tickets.some((ticket) => ticket.use === "exit_ticket")).toBe(true);
    expect(tickets.some((ticket) => ticket.use === "final_proof")).toBe(true);
    expect(tickets.some((ticket) => ticket.use === "final_qa")).toBe(true);
  });

  it("keeps Gurmukhi primary with romanization, Vietnamese, and English", () => {
    for (const ticket of tickets) {
      expect(ticket.expected_line_pa).toMatch(GURMUKHI_BLOCK);
      expect(ticket.romanization.length).toBeGreaterThan(4);
      expect(ticket.prompt_vi.length).toBeGreaterThan(20);
      expect(ticket.prompt_en.length).toBeGreaterThan(20);
      expect(ticket.meaning_vi.length).toBeGreaterThan(3);
      expect(ticket.meaning_en.length).toBeGreaterThan(3);
      expect(ticket.repair_hint_vi).toMatch(GURMUKHI_BLOCK);
      expect(ticket.repair_hint_en).toMatch(GURMUKHI_BLOCK);
      expect(ticket.canada_context_vi).toMatch(/Canada|Ở Canada|Dùng|Hữu ích|Câu này|Đây là/u);
      expect(ticket.canada_context_en).toMatch(/Canada|Use|Useful|This|In Canada/u);
      expect(ticket.pass_criteria_vi.length).toBeGreaterThanOrEqual(3);
      expect(ticket.pass_criteria_en.length).toBe(ticket.pass_criteria_vi.length);
    }
  });

  it("includes learner traps across practical situations", () => {
    const traps = tickets.filter((ticket) => ticket.learner_trap_vi && ticket.learner_trap_en);
    expect(traps.length).toBeGreaterThanOrEqual(10);
  });

  it("mentions Shahmukhi only as awareness and defers native review", () => {
    expect(PUNJABI_CANADA_SURVIVAL_EXIT_TICKET_SCOPE.scriptPolicy).toMatch(/Shahmukhi is awareness only/i);
    expect(PUNJABI_CANADA_SURVIVAL_EXIT_TICKET_SCOPE.reviewPolicy).toBe("Native review is deferred.");

    const allContent = JSON.stringify({
      scope: PUNJABI_CANADA_SURVIVAL_EXIT_TICKET_SCOPE,
      tickets,
    });
    expect(allContent).not.toMatch(/native reviewed|native-approved|Shahmukhi lesson|Shahmukhi course/i);
  });

  it("keeps forbidden integration and scoring concepts out of the tickets", () => {
    const allContent = JSON.stringify(tickets);
    expect(allContent).not.toMatch(/audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config/i);
  });
});
