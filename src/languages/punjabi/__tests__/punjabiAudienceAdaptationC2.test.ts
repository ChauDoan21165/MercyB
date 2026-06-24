// Punjabi C2 audience adaptation guards. These validate app-consumable
// structure and scope, not certification, official placement, or native review.

import { describe, expect, it } from "vitest";

import {
  C2_AUDIENCE_ADAPTATION_DISCLAIMER,
  audienceAdaptationC2,
  audienceAdaptationC2ByAudience,
  type PunjabiC2Audience,
  type PunjabiC2AudienceAdaptation,
} from "@/languages/punjabi/audienceAdaptationC2";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const hasGurmukhi = (s: string) => GURMUKHI_RANGE.test(s);

const REQUIRED_AUDIENCES: PunjabiC2Audience[] = [
  "elder",
  "peer",
  "supervisor",
  "public_service_worker",
  "community_audience",
  "formal_meeting",
  "tense_conversation",
  "sensitive_topic_discussion",
];

describe("Punjabi C2 audience adaptation — coverage", () => {
  it("ships a compact app-consumable audience adaptation pack", () => {
    expect(audienceAdaptationC2.length).toBeGreaterThanOrEqual(8);
    expect(audienceAdaptationC2.length).toBeLessThanOrEqual(14);
  });

  it("covers every required audience", () => {
    const seen = new Set(audienceAdaptationC2.map((entry) => entry.audience));
    for (const audience of REQUIRED_AUDIENCES) {
      expect(seen.has(audience), `missing audience ${audience}`).toBe(true);
    }
  });

  it("has unique non-empty ids", () => {
    const ids = audienceAdaptationC2.map((entry) => entry.id);
    expect(ids.every((id) => id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("audienceAdaptationC2ByAudience returns only matching entries", () => {
    for (const audience of REQUIRED_AUDIENCES) {
      const subset = audienceAdaptationC2ByAudience(audience);
      expect(subset.length, audience).toBeGreaterThan(0);
      expect(subset.every((entry) => entry.audience === audience), audience).toBe(true);
    }
  });
});

describe("Punjabi C2 audience adaptation — bilingual integrity", () => {
  it("each entry has VI+EN scenario and adaptation goal", () => {
    for (const entry of audienceAdaptationC2) {
      expect(entry.title_vi.length, `${entry.id} title_vi`).toBeGreaterThan(0);
      expect(entry.title_en.length, `${entry.id} title_en`).toBeGreaterThan(0);
      expect(entry.scenario_vi.length, `${entry.id} scenario_vi`).toBeGreaterThan(0);
      expect(entry.scenario_en.length, `${entry.id} scenario_en`).toBeGreaterThan(0);
      expect(entry.adaptation_goal_vi.length, `${entry.id} goal_vi`).toBeGreaterThan(0);
      expect(entry.adaptation_goal_en.length, `${entry.id} goal_en`).toBeGreaterThan(0);
    }
  });

  it("each register shift has Gurmukhi, romanization, Vietnamese, and English", () => {
    for (const entry of audienceAdaptationC2) {
      expect(hasGurmukhi(entry.register_shift.adapted_gurmukhi), `${entry.id} adapted_gurmukhi`).toBe(true);
      expect(entry.register_shift.adapted_romanization.length, `${entry.id} adapted_romanization`).toBeGreaterThan(0);
      expect(entry.register_shift.adapted_vi.length, `${entry.id} adapted_vi`).toBeGreaterThan(0);
      expect(entry.register_shift.adapted_en.length, `${entry.id} adapted_en`).toBeGreaterThan(0);
      expect(entry.register_shift.too_direct_vi.length, `${entry.id} too_direct_vi`).toBeGreaterThan(0);
      expect(entry.register_shift.too_direct_en.length, `${entry.id} too_direct_en`).toBeGreaterThan(0);
    }
  });

  it("each key phrase has Gurmukhi, romanization, VI, and EN", () => {
    for (const entry of audienceAdaptationC2) {
      expect(entry.key_phrases.length, `${entry.id} key phrases`).toBeGreaterThanOrEqual(2);
      for (const phrase of entry.key_phrases) {
        expect(hasGurmukhi(phrase.gurmukhi), `${entry.id} phrase Gurmukhi`).toBe(true);
        expect(phrase.romanization.length, `${entry.id} phrase romanization`).toBeGreaterThan(0);
        expect(phrase.vi.length, `${entry.id} phrase vi`).toBeGreaterThan(0);
        expect(phrase.en.length, `${entry.id} phrase en`).toBeGreaterThan(0);
      }
    }
  });

  it("includes navigation, review, remediation, and readiness style items", () => {
    const modes = new Set(audienceAdaptationC2.map((entry) => entry.mode));
    expect(modes.has("navigation")).toBe(true);
    expect(modes.has("review")).toBe(true);
    expect(modes.has("remediation")).toBe(true);
    expect(modes.has("readiness")).toBe(true);
    for (const entry of audienceAdaptationC2) {
      expect(entry.checkpoints.length, `${entry.id} checkpoints`).toBeGreaterThanOrEqual(1);
      expect(entry.route.remediation_vi.length, `${entry.id} remediation_vi`).toBeGreaterThan(0);
      expect(entry.route.remediation_en.length, `${entry.id} remediation_en`).toBeGreaterThan(0);
    }
  });

  it("includes learner traps and Canada-practical examples where useful", () => {
    expect(audienceAdaptationC2.filter((entry) => entry.learner_trap).length).toBeGreaterThanOrEqual(6);
    const canadaEntries = audienceAdaptationC2.filter((entry) => entry.canada_practical);
    expect(canadaEntries.length).toBeGreaterThanOrEqual(2);
    expect(JSON.stringify(canadaEntries).toLowerCase()).toContain("canada");
  });
});

describe("Punjabi C2 audience adaptation — scope framing", () => {
  it("exposes study-support, deferred-review, Shahmukhi-awareness disclaimer", () => {
    expect(C2_AUDIENCE_ADAPTATION_DISCLAIMER.vi.length).toBeGreaterThan(0);
    expect(C2_AUDIENCE_ADAPTATION_DISCLAIMER.en.length).toBeGreaterThan(0);
    const disclaimer =
      `${C2_AUDIENCE_ADAPTATION_DISCLAIMER.vi} ${C2_AUDIENCE_ADAPTATION_DISCLAIMER.en}`.toLowerCase();
    expect(disclaimer).toContain("gurmukhi");
    expect(disclaimer).toContain("native review is deferred");
    expect(disclaimer).toContain("not certification");
    expect(disclaimer).toContain("official placement");
    expect(disclaimer).toContain("shahmukhi");
    expect(disclaimer).toContain("awareness");
    expect(disclaimer).not.toContain("full shahmukhi course");
  });

  it("does not claim native review, certification, or official placement in entries", () => {
    const blob = JSON.stringify(audienceAdaptationC2).toLowerCase();
    expect(blob).not.toContain("native-reviewed");
    expect(blob).not.toContain("native-certified");
    expect(blob).not.toContain("certified by a native");
    expect(blob).not.toContain("official placement");
  });
});

const _typecheck: PunjabiC2AudienceAdaptation[] = audienceAdaptationC2;
void _typecheck;
