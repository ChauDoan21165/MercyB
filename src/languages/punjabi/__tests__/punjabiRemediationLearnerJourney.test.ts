import { describe, expect, it } from "vitest";

import {
  PUNJABI_JOURNEY_FOCI,
  PUNJABI_JOURNEY_READINESS,
  PUNJABI_REMEDIATION_LEARNER_JOURNEY_NOTICE,
  punjabiRemediationLearnerJourneys,
  type PunjabiRemediationLearnerJourney,
} from "@/languages/punjabi/remediationLearnerJourney";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS = /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiRemediationLearnerJourneys - size and identity", () => {
  it("keeps a compact useful learner journey set", () => {
    expect(punjabiRemediationLearnerJourneys.length).toBeGreaterThanOrEqual(14);
    expect(punjabiRemediationLearnerJourneys.length).toBeLessThanOrEqual(45);
  });

  it("has unique journey ids", () => {
    const ids = punjabiRemediationLearnerJourneys.map((journey) => journey.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^journey-[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiRemediationLearnerJourneys - app fields", () => {
  const requiredText: (keyof PunjabiRemediationLearnerJourney)[] = [
    "observedMistake",
    "learnerState_vi",
    "learnerState_en",
    "repairStep_vi",
    "repairStep_en",
    "handoff_vi",
    "handoff_en",
    "model_pa",
    "model_en",
    "readinessCheck_vi",
    "readinessCheck_en",
    "commonTrap",
    "routeId",
    "canDoId",
    "reviewDeckId",
    "nextScenarioId",
  ];

  it("fills every required field for app consumption", () => {
    for (const journey of punjabiRemediationLearnerJourneys) {
      for (const key of requiredText) {
        const value = journey[key];
        expect(typeof value, `${journey.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${journey.id}.${key}`).toBeGreaterThan(0);
      }
    }
  });

  it("uses Gurmukhi primary models with romanization only as support", () => {
    for (const journey of punjabiRemediationLearnerJourneys) {
      expect(GURMUKHI_SCRIPT.test(journey.model_pa), `${journey.id}.model_pa`).toBe(true);
      expect(journey.model_pa).not.toBe(journey.model_roman);
    }
  });

  it("keeps Vietnamese and English learner guidance distinct", () => {
    for (const journey of punjabiRemediationLearnerJourneys) {
      expect(journey.learnerState_vi).not.toBe(journey.learnerState_en);
      expect(journey.repairStep_vi).not.toBe(journey.repairStep_en);
      expect(journey.handoff_vi).not.toBe(journey.handoff_en);
      expect(
        VIETNAMESE_MARKS.test(journey.learnerState_vi) ||
          VIETNAMESE_MARKS.test(journey.repairStep_vi) ||
          VIETNAMESE_MARKS.test(journey.handoff_vi),
        `${journey.id} should include Vietnamese text`,
      ).toBe(true);
    }
  });
});

describe("punjabiRemediationLearnerJourneys - journey coverage", () => {
  it("covers every requested remediation focus", () => {
    const present = new Set<PunjabiRemediationLearnerJourney["focus"]>();
    for (const journey of punjabiRemediationLearnerJourneys) {
      expect(PUNJABI_JOURNEY_FOCI).toContain(journey.focus);
      present.add(journey.focus);
    }
    for (const focus of PUNJABI_JOURNEY_FOCI) {
      expect(present.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("uses all readiness states and learner audiences", () => {
    const readiness = new Set<PunjabiRemediationLearnerJourney["readiness"]>();
    const audiences = new Set<PunjabiRemediationLearnerJourney["audience"]>();
    for (const journey of punjabiRemediationLearnerJourneys) {
      expect(PUNJABI_JOURNEY_READINESS).toContain(journey.readiness);
      readiness.add(journey.readiness);
      audiences.add(journey.audience);
    }
    for (const state of PUNJABI_JOURNEY_READINESS) {
      expect(readiness.has(state), `missing readiness ${state}`).toBe(true);
    }
    expect(audiences.has("vi")).toBe(true);
    expect(audiences.has("en")).toBe(true);
    expect(audiences.has("both")).toBe(true);
  });

  it("connects mistakes to routes, can-do statements, review decks, and scenario handoff", () => {
    for (const journey of punjabiRemediationLearnerJourneys) {
      expect(journey.routeId).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(journey.canDoId).toMatch(/^can-do-/);
      expect(journey.reviewDeckId).toMatch(/^final-/);
      expect(journey.nextScenarioId).toMatch(/^scenario-/);
    }
  });

  it("includes Canada-practical phrase-gap journeys", () => {
    const canadaJourneys = punjabiRemediationLearnerJourneys.filter((journey) => journey.canadaPractical);
    expect(canadaJourneys.length).toBeGreaterThanOrEqual(7);
    expect(canadaJourneys.some((journey) => journey.model_pa.includes("ਲਾਇਬ੍ਰੇਰੀ"))).toBe(true);
    expect(canadaJourneys.some((journey) => journey.model_pa.includes("ਅਰਜ਼ੀ"))).toBe(true);
    expect(canadaJourneys.some((journey) => journey.model_pa.includes("ਅਪਾਇੰਟਮੈਂਟ"))).toBe(true);
  });
});

describe("punjabiRemediationLearnerJourneys - guardrails", () => {
  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const serialized = `${PUNJABI_REMEDIATION_LEARNER_JOURNEY_NOTICE} ${JSON.stringify(
      punjabiRemediationLearnerJourneys,
    )}`.toLowerCase();
    expect(serialized).toContain("shahmukhi");
    expect(serialized).toContain("awareness");
    expect(serialized).toContain("not a full course");
  });

  it("does not claim native review, official placement, or A11 integration", () => {
    const notice = PUNJABI_REMEDIATION_LEARNER_JOURNEY_NOTICE.toLowerCase();
    expect(notice).toContain("wave 15 learner journey only");
    expect(notice).toContain("not a11 integration");
    expect(notice).toContain("study support only");
    expect(notice).toContain("not official placement");
    expect(notice).toContain("native review deferred");
    expect(notice).not.toContain("native reviewed");
  });
});
