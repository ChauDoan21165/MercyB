import { describe, expect, it } from "vitest";

import punjabiGoldenSamplesB2, {
  punjabiGoldenSamplesB2 as namedPunjabiGoldenSamplesB2,
  type PunjabiGoldenSampleB2,
  type PunjabiGoldenSampleB2Skill,
  type PunjabiGoldenSampleB2Topic,
} from "../goldenSamplesB2";

const gurmukhiPattern = /[\u0A00-\u0A7F]/u;
const nativeReviewClaimPattern =
  /\b(native[- ]reviewed|reviewed by native|native approved|native speaker reviewed)\b/i;
const forbiddenSystemsPattern =
  /\b(audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config)\b/i;

const requiredSkills: PunjabiGoldenSampleB2Skill[] = [
  "structured_opinion",
  "comparison",
  "counterpoint",
  "recommendation",
  "workplace_fairness",
];

const requiredTopics: PunjabiGoldenSampleB2Topic[] = [
  "settlement",
  "education",
  "healthcare",
  "housing",
  "transport",
  "public_service",
  "work",
];

const bySkill = (skill: PunjabiGoldenSampleB2Skill): PunjabiGoldenSampleB2[] =>
  punjabiGoldenSamplesB2.filter((sample) => sample.skill === skill);

const byTopic = (topic: PunjabiGoldenSampleB2Topic): PunjabiGoldenSampleB2[] =>
  punjabiGoldenSamplesB2.filter((sample) => sample.topic === topic);

describe("punjabiGoldenSamplesB2", () => {
  it("exports the same compact app-consumable sample bank as default and named exports", () => {
    expect(punjabiGoldenSamplesB2).toBe(namedPunjabiGoldenSamplesB2);
    expect(punjabiGoldenSamplesB2.length).toBeGreaterThanOrEqual(11);
    expect(punjabiGoldenSamplesB2.length).toBeLessThanOrEqual(18);
  });

  it("covers the required B2 skills and practical topics", () => {
    for (const skill of requiredSkills) {
      expect(bySkill(skill).length, `missing skill ${skill}`).toBeGreaterThan(0);
    }

    for (const topic of requiredTopics) {
      expect(byTopic(topic).length, `missing topic ${topic}`).toBeGreaterThan(0);
    }
  });

  it("keeps Gurmukhi primary while supporting Vietnamese and English learners", () => {
    for (const sample of punjabiGoldenSamplesB2) {
      expect(sample.level).toBe("B2");
      expect(sample.id).toMatch(/^pa_b2_golden_/);
      expect(sample.prompt_gurmukhi).toMatch(gurmukhiPattern);
      expect(sample.goldenAnswer_gurmukhi).toMatch(gurmukhiPattern);
      expect(sample.prompt_romanization).not.toMatch(gurmukhiPattern);
      expect(sample.goldenAnswer_romanization).not.toMatch(gurmukhiPattern);
      expect(sample.prompt_vi.length).toBeGreaterThan(20);
      expect(sample.prompt_en.length).toBeGreaterThan(20);
      expect(sample.goldenAnswer_vi.length).toBeGreaterThan(80);
      expect(sample.goldenAnswer_en.length).toBeGreaterThan(80);
    }
  });

  it("includes final-QA and integration-readiness style checks", () => {
    for (const sample of punjabiGoldenSamplesB2) {
      expect(sample.finalQa_vi.length).toBeGreaterThanOrEqual(3);
      expect(sample.finalQa_en.length).toBe(sample.finalQa_vi.length);
      expect(sample.integrationReadiness_vi.length).toBeGreaterThan(20);
      expect(sample.integrationReadiness_en.length).toBeGreaterThan(20);
      expect(sample.learnerTraps_vi.length).toBeGreaterThan(0);
      expect(sample.learnerTraps_en.length).toBe(sample.learnerTraps_vi.length);
    }
  });

  it("includes Canada-practical examples where useful", () => {
    const canadaExamples = punjabiGoldenSamplesB2.filter(
      (sample) => sample.canadaPracticalExample_vi && sample.canadaPracticalExample_en,
    );

    expect(canadaExamples.length).toBeGreaterThanOrEqual(6);
  });

  it("keeps Shahmukhi as awareness only and defers review without claiming it", () => {
    const serialized = JSON.stringify(punjabiGoldenSamplesB2);
    const shahmukhiMentions = serialized.match(/Shahmukhi/g) ?? [];

    expect(shahmukhiMentions.length).toBeLessThanOrEqual(1);
    expect(serialized).toContain("awareness only");
    expect(serialized).toContain("deferred");
    expect(serialized).not.toMatch(nativeReviewClaimPattern);
    expect(serialized).not.toMatch(forbiddenSystemsPattern);
  });
});
