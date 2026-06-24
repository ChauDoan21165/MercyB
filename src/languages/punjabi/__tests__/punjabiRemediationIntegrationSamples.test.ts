import { describe, expect, it } from "vitest";

import {
  PUNJABI_INTEGRATION_SAMPLE_FOCI,
  PUNJABI_INTEGRATION_SAMPLE_USES,
  PUNJABI_REMEDIATION_INTEGRATION_SAMPLES_NOTICE,
  punjabiRemediationIntegrationSamples,
  type PunjabiRemediationIntegrationSample,
} from "@/languages/punjabi/remediationIntegrationSamples";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS = /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiRemediationIntegrationSamples - size and identity", () => {
  it("keeps a compact useful integration sample set", () => {
    expect(punjabiRemediationIntegrationSamples.length).toBeGreaterThanOrEqual(14);
    expect(punjabiRemediationIntegrationSamples.length).toBeLessThanOrEqual(45);
  });

  it("has unique integration ids", () => {
    const ids = punjabiRemediationIntegrationSamples.map((sample) => sample.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^integration-[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiRemediationIntegrationSamples - app fields", () => {
  const requiredText: (keyof PunjabiRemediationIntegrationSample)[] = [
    "sourceDeckId",
    "routeId",
    "evidence_pa",
    "evidence_en",
    "learnerPrompt_vi",
    "learnerPrompt_en",
    "expectedRepair",
    "finalQaSignal",
    "integrationNote_vi",
    "integrationNote_en",
    "commonTrap",
  ];

  it("fills all required integration fields", () => {
    for (const sample of punjabiRemediationIntegrationSamples) {
      for (const key of requiredText) {
        const value = sample[key];
        expect(typeof value, `${sample.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${sample.id}.${key}`).toBeGreaterThan(0);
      }
    }
  });

  it("uses Gurmukhi primary evidence with romanization only as support", () => {
    for (const sample of punjabiRemediationIntegrationSamples) {
      expect(GURMUKHI_SCRIPT.test(sample.evidence_pa), `${sample.id}.evidence_pa`).toBe(true);
      expect(sample.evidence_pa).not.toBe(sample.evidence_roman);
    }
  });

  it("keeps Vietnamese and English integration guidance distinct", () => {
    for (const sample of punjabiRemediationIntegrationSamples) {
      expect(sample.learnerPrompt_vi).not.toBe(sample.learnerPrompt_en);
      expect(sample.integrationNote_vi).not.toBe(sample.integrationNote_en);
      expect(
        VIETNAMESE_MARKS.test(sample.learnerPrompt_vi) || VIETNAMESE_MARKS.test(sample.integrationNote_vi),
        `${sample.id} should include Vietnamese text`,
      ).toBe(true);
    }
  });
});

describe("punjabiRemediationIntegrationSamples - coverage and wiring", () => {
  it("covers every requested integration-sample focus", () => {
    const present = new Set<PunjabiRemediationIntegrationSample["focus"]>();
    for (const sample of punjabiRemediationIntegrationSamples) {
      expect(PUNJABI_INTEGRATION_SAMPLE_FOCI).toContain(sample.focus);
      present.add(sample.focus);
    }
    for (const focus of PUNJABI_INTEGRATION_SAMPLE_FOCI) {
      expect(present.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("uses all integration sample uses and learner audiences", () => {
    const uses = new Set<PunjabiRemediationIntegrationSample["use"]>();
    const audiences = new Set<PunjabiRemediationIntegrationSample["audience"]>();
    for (const sample of punjabiRemediationIntegrationSamples) {
      expect(PUNJABI_INTEGRATION_SAMPLE_USES).toContain(sample.use);
      uses.add(sample.use);
      audiences.add(sample.audience);
    }
    for (const use of PUNJABI_INTEGRATION_SAMPLE_USES) {
      expect(uses.has(use), `missing use ${use}`).toBe(true);
    }
    expect(audiences.has("vi")).toBe(true);
    expect(audiences.has("en")).toBe(true);
    expect(audiences.has("both")).toBe(true);
  });

  it("links each integration sample to source deck and route identifiers", () => {
    for (const sample of punjabiRemediationIntegrationSamples) {
      expect(sample.sourceDeckId).toMatch(/^smoke-/);
      expect(sample.routeId).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(sample.expectedRepair.length).toBeGreaterThan(8);
      expect(sample.finalQaSignal.length).toBeGreaterThan(8);
    }
  });

  it("includes Canada-practical wiring samples", () => {
    const canadaSamples = punjabiRemediationIntegrationSamples.filter((sample) => sample.canadaPractical);
    expect(canadaSamples.length).toBeGreaterThanOrEqual(7);
    expect(canadaSamples.some((sample) => sample.evidence_pa.includes("ਲਾਇਬ੍ਰੇਰੀ"))).toBe(true);
    expect(canadaSamples.some((sample) => sample.evidence_pa.includes("ਅਰਜ਼ੀ"))).toBe(true);
    expect(canadaSamples.some((sample) => sample.evidence_pa.includes("ਅਪਾਇੰਟਮੈਂਟ"))).toBe(true);
  });
});

describe("punjabiRemediationIntegrationSamples - guardrails", () => {
  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const serialized = `${PUNJABI_REMEDIATION_INTEGRATION_SAMPLES_NOTICE} ${JSON.stringify(
      punjabiRemediationIntegrationSamples,
    )}`.toLowerCase();
    expect(serialized).toContain("shahmukhi");
    expect(serialized).toContain("awareness");
    expect(serialized).toContain("not a full course");
  });

  it("does not claim native review, official placement, or A11 integration", () => {
    const notice = PUNJABI_REMEDIATION_INTEGRATION_SAMPLES_NOTICE.toLowerCase();
    expect(notice).toContain("wave 20 integration samples only");
    expect(notice).toContain("not a11 integration");
    expect(notice).toContain("study support only");
    expect(notice).toContain("not official placement");
    expect(notice).toContain("native review deferred");
    expect(notice).not.toContain("native reviewed");
  });
});
