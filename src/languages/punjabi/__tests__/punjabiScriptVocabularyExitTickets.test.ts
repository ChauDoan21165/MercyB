import { describe, expect, it } from "vitest";

import {
  PUNJABI_SCRIPT_VOCABULARY_EXIT_TICKETS,
  PUNJABI_SCRIPT_VOCABULARY_EXIT_TICKET_ITEMS,
  PUNJABI_SCRIPT_VOCABULARY_EXIT_TICKETS_SCOPE,
  type PunjabiScriptVocabularyExitTicketArea,
} from "@/languages/punjabi/scriptVocabularyExitTickets";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const REQUIRED_AREAS: ReadonlyArray<PunjabiScriptVocabularyExitTicketArea> = [
  "gurmukhi_recognition",
  "vowel_signs",
  "addak_tippi_bindi",
  "survival_signage",
  "service_words",
  "thematic_vocabulary",
  "high_frequency_verbs",
  "collocations",
  "romanization_bridge_reduction",
  "shahmukhi_awareness",
];

describe("Punjabi script vocabulary exit tickets", () => {
  it("is app-consumable sectioned TypeScript data", () => {
    expect(PUNJABI_SCRIPT_VOCABULARY_EXIT_TICKETS.length).toBe(REQUIRED_AREAS.length);
    for (const section of PUNJABI_SCRIPT_VOCABULARY_EXIT_TICKETS) {
      expect(section.title_vi.trim().length).toBeGreaterThan(0);
      expect(section.title_en.trim().length).toBeGreaterThan(0);
      expect(section.exitGoal_vi.trim().length).toBeGreaterThan(20);
      expect(section.exitGoal_en.trim().length).toBeGreaterThan(20);
      expect(section.items.length).toBeGreaterThan(0);
    }
  });

  it("covers all required exit-ticket areas", () => {
    const areas = new Set(PUNJABI_SCRIPT_VOCABULARY_EXIT_TICKETS.map((section) => section.area));
    for (const area of REQUIRED_AREAS) {
      expect(areas.has(area), `missing ${area}`).toBe(true);
    }
  });

  it("has enough compact exit-ticket items to be useful", () => {
    expect(PUNJABI_SCRIPT_VOCABULARY_EXIT_TICKET_ITEMS.length).toBeGreaterThanOrEqual(18);
    expect(PUNJABI_SCRIPT_VOCABULARY_EXIT_TICKET_ITEMS.length).toBeLessThanOrEqual(30);
  });

  it("uses Gurmukhi primary with bilingual prompts, answers, and success signals", () => {
    for (const item of PUNJABI_SCRIPT_VOCABULARY_EXIT_TICKET_ITEMS) {
      expect(GURMUKHI_RANGE.test(item.gurmukhi), `Gurmukhi for ${item.id}`).toBe(true);
      expect(item.prompt_vi.trim().length, `prompt vi for ${item.id}`).toBeGreaterThan(12);
      expect(item.prompt_en.trim().length, `prompt en for ${item.id}`).toBeGreaterThan(12);
      expect(item.answer_vi.trim().length, `answer vi for ${item.id}`).toBeGreaterThan(10);
      expect(item.answer_en.trim().length, `answer en for ${item.id}`).toBeGreaterThan(10);
      expect(item.success_vi.trim().length, `success vi for ${item.id}`).toBeGreaterThan(12);
      expect(item.success_en.trim().length, `success en for ${item.id}`).toBeGreaterThan(12);
    }
  });

  it("keeps ids unique and areas aligned", () => {
    const ids = new Set<string>();
    for (const section of PUNJABI_SCRIPT_VOCABULARY_EXIT_TICKETS) {
      for (const item of section.items) {
        expect(ids.has(item.id), `duplicate id: ${item.id}`).toBe(false);
        expect(item.area).toBe(section.area);
        ids.add(item.id);
      }
    }
  });

  it("includes romanization, traps, Canada-practical items, and final-proof/final-QA coverage", () => {
    const romanized = PUNJABI_SCRIPT_VOCABULARY_EXIT_TICKET_ITEMS.filter((item) => item.romanization);
    const traps = PUNJABI_SCRIPT_VOCABULARY_EXIT_TICKET_ITEMS.filter((item) => item.learnerTrap);
    const canada = PUNJABI_SCRIPT_VOCABULARY_EXIT_TICKET_ITEMS.filter((item) => item.canadaPractical);
    const finalProof = PUNJABI_SCRIPT_VOCABULARY_EXIT_TICKET_ITEMS.filter((item) => item.finalProof);
    const finalQA = PUNJABI_SCRIPT_VOCABULARY_EXIT_TICKET_ITEMS.filter((item) => item.finalQA);

    expect(romanized.length).toBeGreaterThanOrEqual(15);
    expect(traps.length).toBeGreaterThanOrEqual(8);
    expect(canada.length).toBeGreaterThanOrEqual(7);
    expect(finalProof.length).toBeGreaterThanOrEqual(3);
    expect(finalQA.length).toBeGreaterThanOrEqual(5);
  });

  it("covers the requested representative review domains", () => {
    const blob = PUNJABI_SCRIPT_VOCABULARY_EXIT_TICKET_ITEMS
      .map((item) => `${item.area} ${item.gurmukhi} ${item.romanization ?? ""} ${item.prompt_vi} ${item.prompt_en} ${item.answer_vi} ${item.answer_en} ${item.success_vi} ${item.success_en}`)
      .join(" ");

    expect(blob).toMatch(/ਕ \/ ਖ|ਤ \/ ਟ/);
    expect(blob).toMatch(/ਕਿ \/ ਕੀ|ਕੇ \/ ਕੈ \/ ਕੌ/);
    expect(blob).toMatch(/ਬੱਸ ਅੱਡਾ|ਮਾਂ|ਪੰਜਾਬ/);
    expect(blob).toMatch(/ਐਮਰਜੈਂਸੀ|ਨਿਕਾਸ|ਫਾਰਮੇਸੀ|ਫਾਰਮ/);
    expect(blob).toMatch(/ਦਵਾਈ|ਕਿਰਾਇਆ/);
    expect(blob).toMatch(/ਕਰਨਾ|ਲੈਣਾ/);
    expect(blob).toMatch(/ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ|ਗਲਤੀ ਠੀਕ ਕਰਨਾ/);
    expect(blob).toMatch(/phal\/fal|shahir\/shehar/);
  });

  it("keeps Shahmukhi as awareness only and native review deferred", () => {
    const shahmukhi = PUNJABI_SCRIPT_VOCABULARY_EXIT_TICKET_ITEMS.filter(
      (item) => item.area === "shahmukhi_awareness",
    );
    expect(shahmukhi.length).toBe(1);

    const blob = [
      PUNJABI_SCRIPT_VOCABULARY_EXIT_TICKETS_SCOPE.vi,
      PUNJABI_SCRIPT_VOCABULARY_EXIT_TICKETS_SCOPE.en,
      ...shahmukhi.map((item) => `${item.prompt_vi} ${item.prompt_en} ${item.answer_vi} ${item.answer_en}`),
    ]
      .join(" ")
      .toLowerCase();

    expect(blob).toMatch(/not a full shahmukhi course|không phải khóa shahmukhi đầy đủ/);
    expect(blob).toMatch(/native review .*deferred|native review được hoãn/);
    expect(blob).not.toMatch(/native reviewed|reviewed by native|đã được native review/);
  });

  it("states no pronunciation scoring or audio", () => {
    const blob = `${PUNJABI_SCRIPT_VOCABULARY_EXIT_TICKETS_SCOPE.vi} ${PUNJABI_SCRIPT_VOCABULARY_EXIT_TICKETS_SCOPE.en}`.toLowerCase();
    expect(blob).toMatch(/no pronunciation scoring|not pronunciation scoring|không phải phát âm chấm điểm/);
    expect(blob).not.toMatch(/audio|azure|supabase|auth|billing|rls/i);
  });
});
