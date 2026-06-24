import { describe, expect, it } from "vitest";

import {
  PUNJABI_GOLDEN_SAMPLE_FOCI,
  PUNJABI_GOLDEN_SAMPLE_READINESS,
  PUNJABI_REMEDIATION_GOLDEN_SAMPLES_NOTICE,
  punjabiRemediationGoldenSamples,
  type PunjabiRemediationGoldenSample,
} from "@/languages/punjabi/remediationGoldenSamples";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS = /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiRemediationGoldenSamples - size and identity", () => {
  it("keeps a compact useful golden-sample set", () => {
    expect(punjabiRemediationGoldenSamples.length).toBeGreaterThanOrEqual(14);
    expect(punjabiRemediationGoldenSamples.length).toBeLessThanOrEqual(45);
  });

  it("has unique golden-sample ids", () => {
    const ids = punjabiRemediationGoldenSamples.map((sample) => sample.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^golden-[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiRemediationGoldenSamples - app fields", () => {
  const requiredText: (keyof PunjabiRemediationGoldenSample)[] = [
    "golden_pa",
    "golden_en",
    "explanation_vi",
    "explanation_en",
    "qaCheck_vi",
    "qaCheck_en",
    "integrationSignal",
    "remediationRouteId",
    "commonTrap",
  ];

  it("fills all required fields", () => {
    for (const sample of punjabiRemediationGoldenSamples) {
      for (const key of requiredText) {
        const value = sample[key];
        expect(typeof value, `${sample.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${sample.id}.${key}`).toBeGreaterThan(0);
      }
    }
  });

  it("uses Gurmukhi primary golden and flawed samples", () => {
    for (const sample of punjabiRemediationGoldenSamples) {
      expect(GURMUKHI_SCRIPT.test(sample.golden_pa), `${sample.id}.golden_pa`).toBe(true);
      expect(sample.golden_pa).not.toBe(sample.golden_roman);
      if (sample.flawed_pa) {
        expect(GURMUKHI_SCRIPT.test(sample.flawed_pa), `${sample.id}.flawed_pa`).toBe(true);
      }
    }
  });

  it("keeps Vietnamese and English QA guidance distinct", () => {
    for (const sample of punjabiRemediationGoldenSamples) {
      expect(sample.explanation_vi).not.toBe(sample.explanation_en);
      expect(sample.qaCheck_vi).not.toBe(sample.qaCheck_en);
      expect(
        VIETNAMESE_MARKS.test(sample.explanation_vi) || VIETNAMESE_MARKS.test(sample.qaCheck_vi),
        `${sample.id} should include Vietnamese text`,
      ).toBe(true);
    }
  });
});

describe("punjabiRemediationGoldenSamples - coverage and readiness", () => {
  it("covers every requested golden-sample focus", () => {
    const present = new Set<PunjabiRemediationGoldenSample["focus"]>();
    for (const sample of punjabiRemediationGoldenSamples) {
      expect(PUNJABI_GOLDEN_SAMPLE_FOCI).toContain(sample.focus);
      present.add(sample.focus);
    }
    for (const focus of PUNJABI_GOLDEN_SAMPLE_FOCI) {
      expect(present.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("uses all readiness states and learner audiences", () => {
    const readiness = new Set<PunjabiRemediationGoldenSample["readiness"]>();
    const audiences = new Set<PunjabiRemediationGoldenSample["audience"]>();
    for (const sample of punjabiRemediationGoldenSamples) {
      expect(PUNJABI_GOLDEN_SAMPLE_READINESS).toContain(sample.readiness);
      readiness.add(sample.readiness);
      audiences.add(sample.audience);
    }
    for (const state of PUNJABI_GOLDEN_SAMPLE_READINESS) {
      expect(readiness.has(state), `missing readiness ${state}`).toBe(true);
    }
    expect(audiences.has("vi")).toBe(true);
    expect(audiences.has("en")).toBe(true);
    expect(audiences.has("both")).toBe(true);
  });

  it("links each sample to remediation and integration readiness", () => {
    for (const sample of punjabiRemediationGoldenSamples) {
      expect(sample.remediationRouteId).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(sample.integrationSignal.length).toBeGreaterThan(10);
    }
  });

  it("includes Canada-practical golden samples", () => {
    const canadaSamples = punjabiRemediationGoldenSamples.filter((sample) => sample.canadaPractical);
    expect(canadaSamples.length).toBeGreaterThanOrEqual(7);
    expect(canadaSamples.some((sample) => sample.golden_pa.includes("ਲਾਇਬ੍ਰੇਰੀ"))).toBe(true);
    expect(canadaSamples.some((sample) => sample.golden_pa.includes("ਅਰਜ਼ੀ"))).toBe(true);
    expect(canadaSamples.some((sample) => sample.golden_pa.includes("ਅਪਾਇੰਟਮੈਂਟ"))).toBe(true);
  });
});

describe("punjabiRemediationGoldenSamples - guardrails", () => {
  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const serialized = `${PUNJABI_REMEDIATION_GOLDEN_SAMPLES_NOTICE} ${JSON.stringify(
      punjabiRemediationGoldenSamples,
    )}`.toLowerCase();
    expect(serialized).toContain("shahmukhi");
    expect(serialized).toContain("awareness");
    expect(serialized).toContain("not a full course");
  });

  it("does not claim native review, official placement, or A11 integration", () => {
    const notice = PUNJABI_REMEDIATION_GOLDEN_SAMPLES_NOTICE.toLowerCase();
    expect(notice).toContain("wave 18 golden samples only");
    expect(notice).toContain("not a11 integration");
    expect(notice).toContain("study support only");
    expect(notice).toContain("not official placement");
    expect(notice).toContain("native review deferred");
    expect(notice).not.toContain("native reviewed");
  });
});
