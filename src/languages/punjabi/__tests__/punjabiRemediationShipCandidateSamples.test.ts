import { describe, expect, it } from "vitest";

import {
  PUNJABI_REMEDIATION_SHIP_CANDIDATE_SAMPLES_NOTICE,
  PUNJABI_SHIP_CANDIDATE_CHECK_TYPES,
  PUNJABI_SHIP_CANDIDATE_FOCI,
  punjabiRemediationShipCandidateSamples,
  type PunjabiRemediationShipCandidateSample,
} from "@/languages/punjabi/remediationShipCandidateSamples";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS =
  /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiRemediationShipCandidateSamples - size and identity", () => {
  it("keeps a compact useful ship-candidate set", () => {
    expect(punjabiRemediationShipCandidateSamples.length).toBeGreaterThanOrEqual(14);
    expect(punjabiRemediationShipCandidateSamples.length).toBeLessThanOrEqual(45);
  });

  it("has unique ship-candidate ids", () => {
    const ids = punjabiRemediationShipCandidateSamples.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^ship-[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiRemediationShipCandidateSamples - app fields", () => {
  const requiredText: (keyof PunjabiRemediationShipCandidateSample)[] = [
    "shipRouteId",
    "candidate_pa",
    "candidate_en",
    "repair_pa",
    "repair_en",
    "shipReady_vi",
    "shipReady_en",
    "blockShip_vi",
    "blockShip_en",
    "shipCandidateCheck",
    "commonTrap",
  ];

  it("fills every required ship-candidate field", () => {
    for (const item of punjabiRemediationShipCandidateSamples) {
      for (const key of requiredText) {
        const value = item[key];
        expect(typeof value, `${item.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${item.id}.${key}`).toBeGreaterThan(0);
      }
      expect(item.sourceArtifactIds.length, `${item.id}.sourceArtifactIds`).toBeGreaterThan(0);
    }
  });

  it("uses Gurmukhi primary candidate and repair lines with romanization only as support", () => {
    for (const item of punjabiRemediationShipCandidateSamples) {
      expect(GURMUKHI_SCRIPT.test(item.candidate_pa), `${item.id}.candidate_pa`).toBe(true);
      expect(GURMUKHI_SCRIPT.test(item.repair_pa), `${item.id}.repair_pa`).toBe(true);
      expect(item.candidate_pa).not.toBe(item.candidate_roman);
      expect(item.repair_pa).not.toBe(item.repair_roman);
    }
  });

  it("keeps Vietnamese and English ship guidance distinct", () => {
    for (const item of punjabiRemediationShipCandidateSamples) {
      expect(item.shipReady_vi).not.toBe(item.shipReady_en);
      expect(item.blockShip_vi).not.toBe(item.blockShip_en);
      expect(
        VIETNAMESE_MARKS.test(item.shipReady_vi) || VIETNAMESE_MARKS.test(item.blockShip_vi),
        `${item.id} should include Vietnamese text`,
      ).toBe(true);
    }
  });
});

describe("punjabiRemediationShipCandidateSamples - coverage and readiness", () => {
  it("covers every requested ship-candidate focus", () => {
    const present = new Set<PunjabiRemediationShipCandidateSample["focus"]>();
    for (const item of punjabiRemediationShipCandidateSamples) {
      expect(PUNJABI_SHIP_CANDIDATE_FOCI).toContain(item.focus);
      present.add(item.focus);
    }
    for (const focus of PUNJABI_SHIP_CANDIDATE_FOCI) {
      expect(present.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("uses all check types and learner audiences", () => {
    const checkTypes = new Set<PunjabiRemediationShipCandidateSample["checkType"]>();
    const audiences = new Set<PunjabiRemediationShipCandidateSample["audience"]>();
    for (const item of punjabiRemediationShipCandidateSamples) {
      expect(PUNJABI_SHIP_CANDIDATE_CHECK_TYPES).toContain(item.checkType);
      checkTypes.add(item.checkType);
      audiences.add(item.audience);
      expect(item.shipRouteId).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(item.sourceArtifactIds.every((id) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id))).toBe(true);
    }
    for (const checkType of PUNJABI_SHIP_CANDIDATE_CHECK_TYPES) {
      expect(checkTypes.has(checkType), `missing check type ${checkType}`).toBe(true);
    }
    expect(audiences.has("vi")).toBe(true);
    expect(audiences.has("en")).toBe(true);
    expect(audiences.has("both")).toBe(true);
  });

  it("includes Canada-practical ship-candidate repair readiness", () => {
    const canadaItems = punjabiRemediationShipCandidateSamples.filter((item) => item.canadaPractical);
    expect(canadaItems.length).toBeGreaterThanOrEqual(8);
    expect(canadaItems.some((item) => item.repair_pa.includes("ਲਾਇਬ੍ਰੇਰੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.repair_pa.includes("ਅਰਜ਼ੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.repair_pa.includes("ਅਪਾਇੰਟਮੈਂਟ"))).toBe(true);
    for (const item of canadaItems) {
      expect(item.shipCandidateCheck.toLowerCase()).toContain("confirm");
      expect(item.blockShip_en.toLowerCase()).toContain("block ship");
    }
  });
});

describe("punjabiRemediationShipCandidateSamples - guardrails", () => {
  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const serialized = `${PUNJABI_REMEDIATION_SHIP_CANDIDATE_SAMPLES_NOTICE} ${JSON.stringify(
      punjabiRemediationShipCandidateSamples,
    )}`.toLowerCase();
    expect(serialized).toContain("shahmukhi");
    expect(serialized).toContain("awareness");
    expect(serialized).toContain("not a full course");
  });

  it("does not claim native review, official placement, or A11 integration", () => {
    const notice = PUNJABI_REMEDIATION_SHIP_CANDIDATE_SAMPLES_NOTICE.toLowerCase();
    expect(notice).toContain("wave 39 ship-candidate samples only");
    expect(notice).toContain("not a11 integration");
    expect(notice).toContain("study support only");
    expect(notice).toContain("not official placement");
    expect(notice).toContain("native review deferred");
    expect(notice).not.toContain("native reviewed");
  });
});
