import {
  punjabiB1LearnerProofPack,
  type PunjabiB1LearnerProofFocus,
  type PunjabiLearnerProofLine,
} from "../learnerProofPackB1";

const requiredFocuses: PunjabiB1LearnerProofFocus[] = [
  "explain_situation",
  "retell_event",
  "clarify_next_step",
  "follow_up_message",
  "service_conversation",
  "workplace_issue",
  "housing_issue",
  "school_community_task",
  "register_aware_request",
];

const hasGurmukhi = (text: string) => /[\u0A00-\u0A7F]/u.test(text);
const hasLatin = (text: string) => /[A-Za-z]/.test(text);

const expectLine = (line: PunjabiLearnerProofLine) => {
  expect(line.pa).toBeTruthy();
  expect(hasGurmukhi(line.pa)).toBe(true);
  expect(line.romanization).toBeTruthy();
  expect(hasLatin(line.romanization)).toBe(true);
  expect(line.en).toBeTruthy();
  expect(line.vi).toBeTruthy();
};

describe("punjabiB1LearnerProofPack", () => {
  it("is a compact app-consumable B1 proof pack with unique ids", () => {
    expect(punjabiB1LearnerProofPack.length).toBeGreaterThanOrEqual(9);
    expect(punjabiB1LearnerProofPack.length).toBeLessThanOrEqual(12);
    expect(
      new Set(punjabiB1LearnerProofPack.map((card) => card.id)).size,
    ).toBe(punjabiB1LearnerProofPack.length);
    expect(
      punjabiB1LearnerProofPack.every((card) => card.level === "B1"),
    ).toBe(true);
  });

  it("covers every Wave 22 learner-proof focus", () => {
    const actualFocuses = new Set(
      punjabiB1LearnerProofPack.map((card) => card.focus),
    );
    for (const focus of requiredFocuses) {
      expect(actualFocuses.has(focus)).toBe(true);
    }
  });

  it("keeps language-support guardrails visible", () => {
    const serializedPack = JSON.stringify(punjabiB1LearnerProofPack);

    expect(serializedPack).toContain("Language practice only");
    expect(serializedPack).toContain("language practice only");
    expect(serializedPack).toContain("not medical advice");
    expect(serializedPack).toContain("not legal or financial advice");
    expect(serializedPack).toContain("Shahmukhi");
    expect(serializedPack).toContain("awareness only");
    expect(serializedPack).toContain("Native review is deferred");
  });

  it.each(punjabiB1LearnerProofPack)(
    "$id includes bilingual situation text and Canada-practical context",
    (card) => {
      expect(card.title_en).toBeTruthy();
      expect(card.title_vi).toBeTruthy();
      expect(card.situation_en).toBeTruthy();
      expect(card.situation_vi).toBeTruthy();
      expect(card.canadaContext).toMatch(/Canada|Canadian/i);
    },
  );

  it.each(punjabiB1LearnerProofPack)(
    "$id includes Gurmukhi-primary ready lines with romanization",
    (card) => {
      expect(card.readyLines.length).toBeGreaterThanOrEqual(3);
      for (const line of card.readyLines) {
        expectLine(line);
      }
    },
  );

  it.each(punjabiB1LearnerProofPack)(
    "$id includes learner proof prompts and model answer",
    (card) => {
      expect(card.learnerProof.prompt_en).toBeTruthy();
      expect(card.learnerProof.prompt_vi).toBeTruthy();
      expectLine(card.learnerProof.proofAnswer);
      expect(card.learnerProof.proofSignals_en.length).toBeGreaterThanOrEqual(3);
      expect(card.learnerProof.proofSignals_vi).toHaveLength(
        card.learnerProof.proofSignals_en.length,
      );
    },
  );

  it.each(punjabiB1LearnerProofPack)(
    "$id includes common traps and better alternatives",
    (card) => {
      expect(card.commonTraps.length).toBeGreaterThanOrEqual(1);
      for (const trap of card.commonTraps) {
        expect(trap.trap_en).toBeTruthy();
        expect(trap.trap_vi).toBeTruthy();
        expectLine(trap.better);
      }
    },
  );

  it.each(punjabiB1LearnerProofPack)(
    "$id includes owner-review and final-QA notes",
    (card) => {
      expect(card.ownerReview_en).toMatch(/owner review|review/i);
      expect(card.ownerReview_vi).toBeTruthy();
      expect(card.finalQa_en).toMatch(/QA|proof|checks|verify/i);
      expect(card.finalQa_vi).toBeTruthy();
    },
  );
});
