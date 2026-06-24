import { describe, expect, it } from "vitest";

import {
  PUNJABI_GO_NO_GO_CHECK_TYPES,
  PUNJABI_GO_NO_GO_FOCI,
  PUNJABI_REMEDIATION_GO_NO_GO_SAMPLES_NOTICE,
  punjabiRemediationGoNoGoSamples,
  type PunjabiRemediationGoNoGoSample,
} from "@/languages/punjabi/remediationGoNoGoSamples";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS =
  /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiRemediationGoNoGoSamples - size and identity", () => {
  it("keeps a compact useful go/no-go set", () => {
    expect(punjabiRemediationGoNoGoSamples.length).toBeGreaterThanOrEqual(14);
    expect(punjabiRemediationGoNoGoSamples.length).toBeLessThanOrEqual(45);
  });

  it("has unique go/no-go ids", () => {
    const ids = punjabiRemediationGoNoGoSamples.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^gonogo-[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiRemediationGoNoGoSamples - app fields", () => {
  const requiredText: (keyof PunjabiRemediationGoNoGoSample)[] = [
    "routeId",
    "sample_pa",
    "sample_en",
    "recovery_pa",
    "recovery_en",
    "goCriteria_vi",
    "goCriteria_en",
    "noGoSignal_vi",
    "noGoSignal_en",
    "decisionCheck",
    "commonTrap",
  ];

  it("fills every required go/no-go field", () => {
    for (const item of punjabiRemediationGoNoGoSamples) {
      for (const key of requiredText) {
        const value = item[key];
        expect(typeof value, `${item.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${item.id}.${key}`).toBeGreaterThan(0);
      }
      expect(item.sourceArtifactIds.length, `${item.id}.sourceArtifactIds`).toBeGreaterThan(0);
    }
  });

  it("uses Gurmukhi primary samples and recovery lines with romanization only as support", () => {
    for (const item of punjabiRemediationGoNoGoSamples) {
      expect(GURMUKHI_SCRIPT.test(item.sample_pa), `${item.id}.sample_pa`).toBe(true);
      expect(GURMUKHI_SCRIPT.test(item.recovery_pa), `${item.id}.recovery_pa`).toBe(true);
      expect(item.sample_pa).not.toBe(item.sample_roman);
      expect(item.recovery_pa).not.toBe(item.recovery_roman);
    }
  });

  it("keeps Vietnamese and English decision guidance distinct", () => {
    for (const item of punjabiRemediationGoNoGoSamples) {
      expect(item.goCriteria_vi).not.toBe(item.goCriteria_en);
      expect(item.noGoSignal_vi).not.toBe(item.noGoSignal_en);
      expect(
        VIETNAMESE_MARKS.test(item.goCriteria_vi) || VIETNAMESE_MARKS.test(item.noGoSignal_vi),
        `${item.id} should include Vietnamese text`,
      ).toBe(true);
    }
  });
});

describe("punjabiRemediationGoNoGoSamples - coverage and release decision", () => {
  it("covers every requested go/no-go focus", () => {
    const present = new Set<PunjabiRemediationGoNoGoSample["focus"]>();
    for (const item of punjabiRemediationGoNoGoSamples) {
      expect(PUNJABI_GO_NO_GO_FOCI).toContain(item.focus);
      present.add(item.focus);
    }
    for (const focus of PUNJABI_GO_NO_GO_FOCI) {
      expect(present.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("uses all check types, learner audiences, and valid decisions", () => {
    const checkTypes = new Set<PunjabiRemediationGoNoGoSample["checkType"]>();
    const audiences = new Set<PunjabiRemediationGoNoGoSample["audience"]>();
    const decisions = new Set<PunjabiRemediationGoNoGoSample["decision"]>();
    for (const item of punjabiRemediationGoNoGoSamples) {
      expect(PUNJABI_GO_NO_GO_CHECK_TYPES).toContain(item.checkType);
      checkTypes.add(item.checkType);
      audiences.add(item.audience);
      decisions.add(item.decision);
      expect(["go", "no-go"]).toContain(item.decision);
      expect(item.routeId).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(item.sourceArtifactIds.every((id) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id))).toBe(true);
    }
    for (const checkType of PUNJABI_GO_NO_GO_CHECK_TYPES) {
      expect(checkTypes.has(checkType), `missing check type ${checkType}`).toBe(true);
    }
    expect(decisions.has("go")).toBe(true);
    expect(audiences.has("vi")).toBe(true);
    expect(audiences.has("en")).toBe(true);
    expect(audiences.has("both")).toBe(true);
  });

  it("includes Canada-practical go/no-go repair readiness", () => {
    const canadaItems = punjabiRemediationGoNoGoSamples.filter((item) => item.canadaPractical);
    expect(canadaItems.length).toBeGreaterThanOrEqual(8);
    expect(canadaItems.some((item) => item.recovery_pa.includes("ਲਾਇਬ੍ਰੇਰੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.recovery_pa.includes("ਅਰਜ਼ੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.recovery_pa.includes("ਅਪਾਇੰਟਮੈਂਟ"))).toBe(true);
    for (const item of canadaItems) {
      expect(item.decisionCheck.toLowerCase()).toContain("confirm");
      expect(item.noGoSignal_en.toLowerCase()).toContain("no-go");
    }
  });
});

describe("punjabiRemediationGoNoGoSamples - guardrails", () => {
  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const serialized = `${PUNJABI_REMEDIATION_GO_NO_GO_SAMPLES_NOTICE} ${JSON.stringify(
      punjabiRemediationGoNoGoSamples,
    )}`.toLowerCase();
    expect(serialized).toContain("shahmukhi");
    expect(serialized).toContain("awareness");
    expect(serialized).toContain("not a full course");
  });

  it("does not claim native review, official placement, or A11 integration", () => {
    const notice = PUNJABI_REMEDIATION_GO_NO_GO_SAMPLES_NOTICE.toLowerCase();
    expect(notice).toContain("wave 38 go/no-go samples only");
    expect(notice).toContain("not a11 integration");
    expect(notice).toContain("study support only");
    expect(notice).toContain("not official placement");
    expect(notice).toContain("native review deferred");
    expect(notice).not.toContain("native reviewed");
  });
});
