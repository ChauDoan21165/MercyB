import { describe, expect, it } from "vitest";
import {
  punjabiB1ServiceConversations,
  type PunjabiB1ServiceDomain,
  type PunjabiServicePhrase,
} from "../serviceConversationsB1";

const GURMUKHI_RE = /[\u0A00-\u0A7F]/;
const LATIN_RE = /[a-z]/i;

const REQUIRED_DOMAINS: PunjabiB1ServiceDomain[] = [
  "clinic",
  "pharmacy",
  "bank",
  "school",
  "housing_repair",
  "workplace_supervisor",
  "public_office",
  "library_community_center",
  "transport_customer_service",
];

function expectPhrase(phrase: PunjabiServicePhrase) {
  expect(GURMUKHI_RE.test(phrase.pa)).toBe(true);
  expect(LATIN_RE.test(phrase.romanization)).toBe(true);
  expect(phrase.en.trim().length).toBeGreaterThan(0);
  expect(phrase.vi.trim().length).toBeGreaterThan(0);
}

describe("Punjabi B1 service conversations - batch", () => {
  it("has a compact useful set of B1 service conversations", () => {
    expect(punjabiB1ServiceConversations.length).toBeGreaterThanOrEqual(9);
    expect(punjabiB1ServiceConversations.length).toBeLessThanOrEqual(18);
  });

  it("has unique ids and marks every conversation B1", () => {
    const ids = punjabiB1ServiceConversations.map((conversation) => conversation.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const conversation of punjabiB1ServiceConversations) {
      expect(conversation.level).toBe("B1");
    }
  });

  it("covers all required service domains", () => {
    const seen = new Set(
      punjabiB1ServiceConversations.map((conversation) => conversation.domain),
    );

    for (const domain of REQUIRED_DOMAINS) {
      expect(seen.has(domain)).toBe(true);
    }
  });
});

describe("Punjabi B1 service conversations - learner content", () => {
  for (const conversation of punjabiB1ServiceConversations) {
    describe(conversation.id, () => {
      it("has bilingual title, situation, learner goal, and Canada context", () => {
        expect(conversation.title_en.trim().length).toBeGreaterThan(0);
        expect(conversation.title_vi.trim().length).toBeGreaterThan(0);
        expect(conversation.situation_en.trim().length).toBeGreaterThan(0);
        expect(conversation.situation_vi.trim().length).toBeGreaterThan(0);
        expect(conversation.learnerGoal_en.trim().length).toBeGreaterThan(0);
        expect(conversation.learnerGoal_vi.trim().length).toBeGreaterThan(0);
        expect(conversation.canadaContext.trim().length).toBeGreaterThan(0);
      });

      it("has key phrases with Gurmukhi, romanization, English, and Vietnamese", () => {
        expect(conversation.keyPhrases.length).toBeGreaterThanOrEqual(3);

        for (const phrase of conversation.keyPhrases) {
          expectPhrase(phrase);
        }
      });

      it("has a bilingual Gurmukhi service dialogue", () => {
        expect(conversation.conversation.length).toBeGreaterThanOrEqual(3);

        const speakers = new Set(conversation.conversation.map((line) => line.speaker));
        expect(speakers.has("learner")).toBe(true);
        expect(speakers.has("staff")).toBe(true);

        for (const line of conversation.conversation) {
          expectPhrase(line);
        }
      });

      it("has a bilingual follow-up task and common learner traps", () => {
        expect(conversation.followUpTask_en.trim().length).toBeGreaterThan(0);
        expect(conversation.followUpTask_vi.trim().length).toBeGreaterThan(0);
        expect(conversation.commonTraps.length).toBeGreaterThanOrEqual(1);

        for (const trap of conversation.commonTraps) {
          expect(trap.trap_en.trim().length).toBeGreaterThan(0);
          expect(trap.trap_vi.trim().length).toBeGreaterThan(0);
          expectPhrase(trap.better);
        }
      });

      it("marks medical and public-office examples as language support only", () => {
        const requiresSupportNote =
          conversation.domain === "clinic" ||
          conversation.domain === "pharmacy" ||
          conversation.domain === "public_office";

        if (!requiresSupportNote) return;

        expect(conversation.learnerGoal_en).toMatch(/language support only/i);
        expect(conversation.learnerGoal_vi).toMatch(/Chỉ hỗ trợ ngôn ngữ/i);
      });
    });
  }
});
