// src/languages/punjabi/__tests__/punjabiScriptReadinessGate.test.ts
//
// Structural guards for the Punjabi script readiness gate.
// Native linguistic review is intentionally deferred.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_SCRIPT_READINESS_GATE,
  PUNJABI_SCRIPT_READINESS_GATE_ITEMS,
  PUNJABI_SCRIPT_READINESS_GATE_SCOPE,
  type PunjabiReadinessArea,
} from "@/languages/punjabi/scriptReadinessGate";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const REQUIRED_AREAS: ReadonlyArray<PunjabiReadinessArea> = [
  "gurmukhi_letters",
  "vowel_signs",
  "addak_tippi_bindi",
  "survival_signage",
  "vocabulary_categories",
  "high_frequency_verbs",
  "romanization_bridge",
  "shahmukhi_awareness",
  "readiness_checkpoint",
];

describe("Punjabi script readiness gate", () => {
  it("is app-consumable sectioned TypeScript data", () => {
    expect(PUNJABI_SCRIPT_READINESS_GATE.length).toBe(REQUIRED_AREAS.length);
    for (const section of PUNJABI_SCRIPT_READINESS_GATE) {
      expect(section.title_vi.trim().length).toBeGreaterThan(0);
      expect(section.title_en.trim().length).toBeGreaterThan(0);
      expect(section.readinessGoal_vi.trim().length).toBeGreaterThan(25);
      expect(section.readinessGoal_en.trim().length).toBeGreaterThan(25);
      expect(section.items.length).toBeGreaterThan(0);
    }
  });

  it("covers all Wave 11 readiness areas", () => {
    const areas = new Set(PUNJABI_SCRIPT_READINESS_GATE.map((section) => section.area));
    for (const area of REQUIRED_AREAS) {
      expect(areas.has(area), `missing ${area}`).toBe(true);
    }
  });

  it("has compact but useful gate coverage", () => {
    expect(PUNJABI_SCRIPT_READINESS_GATE_ITEMS.length).toBeGreaterThanOrEqual(22);
    expect(PUNJABI_SCRIPT_READINESS_GATE_ITEMS.length).toBeLessThanOrEqual(60);
  });

  it("uses Gurmukhi primary with bilingual readiness routing", () => {
    for (const item of PUNJABI_SCRIPT_READINESS_GATE_ITEMS) {
      expect(GURMUKHI_RANGE.test(item.gurmukhi), `Gurmukhi for ${item.id}`).toBe(true);
      expect(item.task_vi.trim().length, `task vi for ${item.id}`).toBeGreaterThan(15);
      expect(item.task_en.trim().length, `task en for ${item.id}`).toBeGreaterThan(15);
      expect(item.ready_if_vi.trim().length, `ready vi for ${item.id}`).toBeGreaterThan(25);
      expect(item.ready_if_en.trim().length, `ready en for ${item.id}`).toBeGreaterThan(25);
      expect(item.route_if_missed_vi.trim().length, `route vi for ${item.id}`).toBeGreaterThan(20);
      expect(item.route_if_missed_en.trim().length, `route en for ${item.id}`).toBeGreaterThan(20);
    }
  });

  it("keeps ids unique and areas aligned", () => {
    const ids = new Set<string>();
    for (const section of PUNJABI_SCRIPT_READINESS_GATE) {
      for (const item of section.items) {
        expect(ids.has(item.id), `duplicate id: ${item.id}`).toBe(false);
        expect(item.area).toBe(section.area);
        ids.add(item.id);
      }
    }
  });

  it("includes romanization, learner traps, Canada examples, and checkpoints", () => {
    const romanized = PUNJABI_SCRIPT_READINESS_GATE_ITEMS.filter((item) => item.romanization);
    const traps = PUNJABI_SCRIPT_READINESS_GATE_ITEMS.filter((item) => item.learnerTrap);
    const canada = PUNJABI_SCRIPT_READINESS_GATE_ITEMS.filter((item) => item.canadaPractical);
    const checkpoints = PUNJABI_SCRIPT_READINESS_GATE_ITEMS.filter((item) => item.checkpoint);
    expect(romanized.length).toBeGreaterThanOrEqual(20);
    expect(traps.length).toBeGreaterThanOrEqual(10);
    expect(canada.length).toBeGreaterThanOrEqual(10);
    expect(checkpoints.length).toBeGreaterThanOrEqual(5);
    expect(checkpoints.some((item) => item.gurmukhi === "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ")).toBe(true);
  });

  it("checks addak, tippi, and bindi awareness", () => {
    const markItems = PUNJABI_SCRIPT_READINESS_GATE_ITEMS.filter((item) => item.area === "addak_tippi_bindi");
    const blob = markItems.map((item) => `${item.gurmukhi} ${item.task_vi} ${item.task_en} ${item.ready_if_vi} ${item.ready_if_en}`).join(" ");
    expect(blob).toMatch(/addak|ਅੱਡਕ|ੱ/i);
    expect(blob).toMatch(/tippi|ਟਿੱਪੀ|ੰ/i);
    expect(blob).toMatch(/bindi|ਬਿੰਦੀ|ਂ/i);
  });

  it("includes survival signage, vocabulary, verbs, and romanization bridge routing", () => {
    const blob = PUNJABI_SCRIPT_READINESS_GATE_ITEMS
      .map((item) => `${item.area} ${item.gurmukhi} ${item.romanization ?? ""} ${item.route_if_missed_vi} ${item.route_if_missed_en}`)
      .join(" ");
    expect(blob).toMatch(/ਐਮਰਜੈਂਸੀ|ਨਿਕਾਸ|ਫਾਰਮੇਸੀ/);
    expect(blob).toMatch(/ਦਵਾਈ|ਕਿਰਾਇਆ|ਸਕੂਲ/);
    expect(blob).toMatch(/ਕਰਨਾ|ਲੈਣਾ|ਸਮਝਣਾ/);
    expect(blob).toMatch(/phal\/fal|vadda\/wadda|shahir\/shehar/);
    expect(blob).toMatch(/Gurmukhi|romanization/);
  });

  it("keeps Shahmukhi awareness only and native review deferred", () => {
    const shahmukhi = PUNJABI_SCRIPT_READINESS_GATE_ITEMS.filter((item) => item.area === "shahmukhi_awareness");
    expect(shahmukhi.length).toBe(1);
    const blob = [
      PUNJABI_SCRIPT_READINESS_GATE_SCOPE.vi,
      PUNJABI_SCRIPT_READINESS_GATE_SCOPE.en,
      ...shahmukhi.map((item) => `${item.route_if_missed_vi} ${item.route_if_missed_en}`),
    ].join(" ").toLowerCase();
    expect(blob).toMatch(/not a full shahmukhi course|không phải khóa shahmukhi đầy đủ/);
    expect(blob).toMatch(/native review .*deferred|native review được hoãn/);
    expect(blob).not.toMatch(/native reviewed|reviewed by native/);
  });

  it("does not introduce audio or pronunciation scoring", () => {
    expect(PUNJABI_SCRIPT_READINESS_GATE_SCOPE.noAudioOrScoring).toBe(true);
    const blob = JSON.stringify(PUNJABI_SCRIPT_READINESS_GATE).toLowerCase();
    expect(blob).not.toMatch(/pronunciation scoring|azure|audio/);
  });
});
