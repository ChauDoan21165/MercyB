import {
  punjabiB1ExitTickets,
  type PunjabiB1ExitTicketFocus,
  type PunjabiExitTicketLine,
} from "../exitTicketsB1";

const requiredFocuses: PunjabiB1ExitTicketFocus[] = [
  "explain_situation",
  "retell_event",
  "clarify_next_step",
  "service_conversation",
  "workplace_issue",
  "housing_issue",
  "school_community_task",
  "follow_up_message",
  "register_aware_request",
];

const hasGurmukhi = (text: string) => /[\u0A00-\u0A7F]/u.test(text);
const hasLatin = (text: string) => /[A-Za-z]/.test(text);

const expectLine = (line: PunjabiExitTicketLine) => {
  expect(line.pa).toBeTruthy();
  expect(hasGurmukhi(line.pa)).toBe(true);
  expect(line.romanization).toBeTruthy();
  expect(hasLatin(line.romanization)).toBe(true);
  expect(line.en).toBeTruthy();
  expect(line.vi).toBeTruthy();
};

describe("punjabiB1ExitTickets", () => {
  it("is a compact app-consumable B1 exit-ticket set with unique ids", () => {
    expect(punjabiB1ExitTickets.length).toBeGreaterThanOrEqual(9);
    expect(punjabiB1ExitTickets.length).toBeLessThanOrEqual(12);
    expect(new Set(punjabiB1ExitTickets.map((ticket) => ticket.id)).size).toBe(
      punjabiB1ExitTickets.length,
    );
    expect(punjabiB1ExitTickets.every((ticket) => ticket.level === "B1")).toBe(
      true,
    );
  });

  it("covers every Wave 21 exit-ticket focus", () => {
    const actualFocuses = new Set(
      punjabiB1ExitTickets.map((ticket) => ticket.focus),
    );
    for (const focus of requiredFocuses) {
      expect(actualFocuses.has(focus)).toBe(true);
    }
  });

  it("keeps advice-sensitive tickets inside language support", () => {
    const serializedTickets = JSON.stringify(punjabiB1ExitTickets);

    expect(serializedTickets).toContain("Language practice only");
    expect(serializedTickets).toContain("Language support only");
    expect(serializedTickets).toContain("not medical advice");
    expect(serializedTickets).toContain("not legal or financial advice");
    expect(serializedTickets).toContain("Chỉ luyện ngôn ngữ");
    expect(serializedTickets).toContain("Chỉ hỗ trợ ngôn ngữ");
  });

  it.each(punjabiB1ExitTickets)(
    "$id includes bilingual task text and Canada-practical context",
    (ticket) => {
      expect(ticket.title_en).toBeTruthy();
      expect(ticket.title_vi).toBeTruthy();
      expect(ticket.exitTask_en).toBeTruthy();
      expect(ticket.exitTask_vi).toBeTruthy();
      expect(ticket.canadaContext).toMatch(/Canada|Canadian/i);
    },
  );

  it.each(punjabiB1ExitTickets)(
    "$id includes Gurmukhi-primary ready phrases with romanization",
    (ticket) => {
      expect(ticket.readyPhrases.length).toBeGreaterThanOrEqual(3);
      for (const line of ticket.readyPhrases) {
        expectLine(line);
      }
    },
  );

  it.each(punjabiB1ExitTickets)(
    "$id includes final-proof prompts and model answer",
    (ticket) => {
      expect(ticket.finalProof.prompt_en).toBeTruthy();
      expect(ticket.finalProof.prompt_vi).toBeTruthy();
      expectLine(ticket.finalProof.modelAnswer);
      expect(ticket.finalProof.passCriteria_en.length).toBeGreaterThanOrEqual(
        3,
      );
      expect(ticket.finalProof.passCriteria_vi).toHaveLength(
        ticket.finalProof.passCriteria_en.length,
      );
    },
  );

  it.each(punjabiB1ExitTickets)(
    "$id includes common traps and better language",
    (ticket) => {
      expect(ticket.commonTraps.length).toBeGreaterThanOrEqual(1);
      for (const trap of ticket.commonTraps) {
        expect(trap.trap_en).toBeTruthy();
        expect(trap.trap_vi).toBeTruthy();
        expectLine(trap.better);
      }
    },
  );

  it.each(punjabiB1ExitTickets)(
    "$id includes final-QA notes for exit-ticket proof",
    (ticket) => {
      expect(ticket.finalQa_en).toMatch(/QA|proof|checks|verify/i);
      expect(ticket.finalQa_vi).toBeTruthy();
    },
  );

  it("mentions Shahmukhi only as awareness and defers native review", () => {
    const serializedTickets = JSON.stringify(punjabiB1ExitTickets);

    expect(serializedTickets).toContain("Shahmukhi");
    expect(serializedTickets).toContain("awareness only");
    expect(serializedTickets).toContain("Native review is deferred");
    expect(serializedTickets).not.toContain("native-reviewed");
    expect(serializedTickets).not.toContain("native approved");
  });
});
