import { describe, expect, it } from "vitest";

import {
  PUNJABI_OWNER_ACCEPTANCE_CHECK_TYPES,
  PUNJABI_OWNER_ACCEPTANCE_FOCI,
  PUNJABI_REMEDIATION_OWNER_ACCEPTANCE_SAMPLES_NOTICE,
  punjabiRemediationOwnerAcceptanceSamples,
  type PunjabiRemediationOwnerAcceptanceSample,
} from "@/languages/punjabi/remediationOwnerAcceptanceSamples";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS =
  /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiRemediationOwnerAcceptanceSamples - size and identity", () => {
  it("keeps a compact useful owner-acceptance set", () => {
    expect(punjabiRemediationOwnerAcceptanceSamples.length).toBeGreaterThanOrEqual(14);
    expect(punjabiRemediationOwnerAcceptanceSamples.length).toBeLessThanOrEqual(45);
  });

  it("has unique owner-acceptance ids", () => {
    const ids = punjabiRemediationOwnerAcceptanceSamples.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^owner-[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiRemediationOwnerAcceptanceSamples - app fields", () => {
  const requiredText: (keyof PunjabiRemediationOwnerAcceptanceSample)[] = [
    "ownerAcceptanceRouteId",
    "prompt_pa",
    "prompt_en",
    "ownerAcceptedRepair_pa",
    "ownerAcceptedRepair_en",
    "ownerAcceptanceCriteria_vi",
    "ownerAcceptanceCriteria_en",
    "rejectionSignal_vi",
    "rejectionSignal_en",
    "ownerAcceptanceCheck",
    "commonTrap",
  ];

  it("fills every required owner-acceptance field", () => {
    for (const item of punjabiRemediationOwnerAcceptanceSamples) {
      for (const key of requiredText) {
        const value = item[key];
        expect(typeof value, `${item.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${item.id}.${key}`).toBeGreaterThan(0);
      }
      expect(item.sourceArtifactIds.length, `${item.id}.sourceArtifactIds`).toBeGreaterThan(0);
    }
  });

  it("uses Gurmukhi primary prompt and accepted repair lines with romanization only as support", () => {
    for (const item of punjabiRemediationOwnerAcceptanceSamples) {
      expect(GURMUKHI_SCRIPT.test(item.prompt_pa), `${item.id}.prompt_pa`).toBe(true);
      expect(GURMUKHI_SCRIPT.test(item.ownerAcceptedRepair_pa), `${item.id}.ownerAcceptedRepair_pa`).toBe(true);
      expect(item.prompt_pa).not.toBe(item.prompt_roman);
      expect(item.ownerAcceptedRepair_pa).not.toBe(item.ownerAcceptedRepair_roman);
    }
  });

  it("keeps Vietnamese and English owner-acceptance guidance distinct", () => {
    for (const item of punjabiRemediationOwnerAcceptanceSamples) {
      expect(item.ownerAcceptanceCriteria_vi).not.toBe(item.ownerAcceptanceCriteria_en);
      expect(item.rejectionSignal_vi).not.toBe(item.rejectionSignal_en);
      expect(
        VIETNAMESE_MARKS.test(item.ownerAcceptanceCriteria_vi) || VIETNAMESE_MARKS.test(item.rejectionSignal_vi),
        `${item.id} should include Vietnamese text`,
      ).toBe(true);
    }
  });
});

describe("punjabiRemediationOwnerAcceptanceSamples - coverage and owner-acceptance readiness", () => {
  it("covers every requested owner-acceptance focus", () => {
    const present = new Set<PunjabiRemediationOwnerAcceptanceSample["focus"]>();
    for (const item of punjabiRemediationOwnerAcceptanceSamples) {
      expect(PUNJABI_OWNER_ACCEPTANCE_FOCI).toContain(item.focus);
      present.add(item.focus);
    }
    for (const focus of PUNJABI_OWNER_ACCEPTANCE_FOCI) {
      expect(present.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("uses all check types and learner audiences", () => {
    const checkTypes = new Set<PunjabiRemediationOwnerAcceptanceSample["checkType"]>();
    const audiences = new Set<PunjabiRemediationOwnerAcceptanceSample["audience"]>();
    for (const item of punjabiRemediationOwnerAcceptanceSamples) {
      expect(PUNJABI_OWNER_ACCEPTANCE_CHECK_TYPES).toContain(item.checkType);
      checkTypes.add(item.checkType);
      audiences.add(item.audience);
      expect(item.ownerAcceptanceRouteId).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(item.sourceArtifactIds.every((id) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id))).toBe(true);
    }
    for (const checkType of PUNJABI_OWNER_ACCEPTANCE_CHECK_TYPES) {
      expect(checkTypes.has(checkType), `missing check type ${checkType}`).toBe(true);
    }
    expect(audiences.has("vi")).toBe(true);
    expect(audiences.has("en")).toBe(true);
    expect(audiences.has("both")).toBe(true);
  });

  it("includes Canada-practical owner-acceptance repair readiness", () => {
    const canadaItems = punjabiRemediationOwnerAcceptanceSamples.filter((item) => item.canadaPractical);
    expect(canadaItems.length).toBeGreaterThanOrEqual(8);
    expect(canadaItems.some((item) => item.ownerAcceptedRepair_pa.includes("ਲਾਇਬ੍ਰੇਰੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.ownerAcceptedRepair_pa.includes("ਅਰਜ਼ੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.ownerAcceptedRepair_pa.includes("ਅਪਾਇੰਟਮੈਂਟ"))).toBe(true);
    for (const item of canadaItems) {
      expect(item.ownerAcceptanceCheck.toLowerCase()).toContain("confirm");
      expect(item.rejectionSignal_en.toLowerCase()).toContain("reject");
    }
  });
});

describe("punjabiRemediationOwnerAcceptanceSamples - guardrails", () => {
  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const serialized = `${PUNJABI_REMEDIATION_OWNER_ACCEPTANCE_SAMPLES_NOTICE} ${JSON.stringify(
      punjabiRemediationOwnerAcceptanceSamples,
    )}`.toLowerCase();
    expect(serialized).toContain("shahmukhi");
    expect(serialized).toContain("awareness");
    expect(serialized).toContain("not a full course");
  });

  it("does not claim native review, official placement, or A11 integration", () => {
    const notice = PUNJABI_REMEDIATION_OWNER_ACCEPTANCE_SAMPLES_NOTICE.toLowerCase();
    expect(notice).toContain("wave 41 owner-acceptance samples only");
    expect(notice).toContain("not a11 integration");
    expect(notice).toContain("study support only");
    expect(notice).toContain("not official placement");
    expect(notice).toContain("native review deferred");
    expect(notice).not.toContain("native reviewed");
  });
});
