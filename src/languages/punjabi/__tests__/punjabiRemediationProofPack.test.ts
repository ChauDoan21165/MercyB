import { describe, expect, it } from "vitest";

import {
  PUNJABI_PROOF_PACK_EVIDENCE_TYPES,
  PUNJABI_PROOF_PACK_FOCI,
  PUNJABI_REMEDIATION_PROOF_PACK_NOTICE,
  punjabiRemediationProofPack,
  type PunjabiRemediationProofPackItem,
} from "@/languages/punjabi/remediationProofPack";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS = /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiRemediationProofPack - size and identity", () => {
  it("keeps a compact useful proof-pack set", () => {
    expect(punjabiRemediationProofPack.length).toBeGreaterThanOrEqual(14);
    expect(punjabiRemediationProofPack.length).toBeLessThanOrEqual(45);
  });

  it("has unique proof-pack ids", () => {
    const ids = punjabiRemediationProofPack.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^proof-[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiRemediationProofPack - app fields", () => {
  const requiredText: (keyof PunjabiRemediationProofPackItem)[] = [
    "remediationRouteId",
    "proof_pa",
    "proof_en",
    "claim_vi",
    "claim_en",
    "repairEvidence",
    "ownerReviewPrompt_vi",
    "ownerReviewPrompt_en",
    "finalQaCheck",
    "commonTrap",
  ];

  it("fills every required proof-pack field", () => {
    for (const item of punjabiRemediationProofPack) {
      for (const key of requiredText) {
        const value = item[key];
        expect(typeof value, `${item.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${item.id}.${key}`).toBeGreaterThan(0);
      }
      expect(item.sourceArtifactIds.length, `${item.id}.sourceArtifactIds`).toBeGreaterThan(0);
    }
  });

  it("uses Gurmukhi primary proof lines with romanization only as support", () => {
    for (const item of punjabiRemediationProofPack) {
      expect(GURMUKHI_SCRIPT.test(item.proof_pa), `${item.id}.proof_pa`).toBe(true);
      expect(item.proof_pa).not.toBe(item.proof_roman);
    }
  });

  it("keeps Vietnamese and English learner guidance distinct", () => {
    for (const item of punjabiRemediationProofPack) {
      expect(item.claim_vi).not.toBe(item.claim_en);
      expect(item.ownerReviewPrompt_vi).not.toBe(item.ownerReviewPrompt_en);
      expect(
        VIETNAMESE_MARKS.test(item.claim_vi) || VIETNAMESE_MARKS.test(item.ownerReviewPrompt_vi),
        `${item.id} should include Vietnamese text`,
      ).toBe(true);
    }
  });
});

describe("punjabiRemediationProofPack - coverage and final review", () => {
  it("covers every requested proof-pack focus", () => {
    const present = new Set<PunjabiRemediationProofPackItem["focus"]>();
    for (const item of punjabiRemediationProofPack) {
      expect(PUNJABI_PROOF_PACK_FOCI).toContain(item.focus);
      present.add(item.focus);
    }
    for (const focus of PUNJABI_PROOF_PACK_FOCI) {
      expect(present.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("uses all proof-pack evidence types and learner audiences", () => {
    const evidenceTypes = new Set<PunjabiRemediationProofPackItem["evidenceType"]>();
    const audiences = new Set<PunjabiRemediationProofPackItem["audience"]>();
    for (const item of punjabiRemediationProofPack) {
      expect(PUNJABI_PROOF_PACK_EVIDENCE_TYPES).toContain(item.evidenceType);
      evidenceTypes.add(item.evidenceType);
      audiences.add(item.audience);
    }
    for (const evidenceType of PUNJABI_PROOF_PACK_EVIDENCE_TYPES) {
      expect(evidenceTypes.has(evidenceType), `missing evidence type ${evidenceType}`).toBe(true);
    }
    expect(audiences.has("vi")).toBe(true);
    expect(audiences.has("en")).toBe(true);
    expect(audiences.has("both")).toBe(true);
  });

  it("links every item to remediation, proof artifacts, owner review, and final QA", () => {
    for (const item of punjabiRemediationProofPack) {
      expect(item.remediationRouteId).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(item.sourceArtifactIds.every((id) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id))).toBe(true);
      expect(item.repairEvidence.length).toBeGreaterThan(12);
      expect(item.ownerReviewPrompt_en.toLowerCase()).toMatch(/check|confirm/);
      expect(item.finalQaCheck.toLowerCase()).toContain("confirm");
    }
  });

  it("includes Canada-practical proof items for real learner gaps", () => {
    const canadaItems = punjabiRemediationProofPack.filter((item) => item.canadaPractical);
    expect(canadaItems.length).toBeGreaterThanOrEqual(7);
    expect(canadaItems.some((item) => item.proof_pa.includes("ਲਾਇਬ੍ਰੇਰੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.proof_pa.includes("ਅਰਜ਼ੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.proof_pa.includes("ਅਪਾਇੰਟਮੈਂਟ"))).toBe(true);
  });
});

describe("punjabiRemediationProofPack - guardrails", () => {
  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const serialized = `${PUNJABI_REMEDIATION_PROOF_PACK_NOTICE} ${JSON.stringify(
      punjabiRemediationProofPack,
    )}`.toLowerCase();
    expect(serialized).toContain("shahmukhi");
    expect(serialized).toContain("awareness");
    expect(serialized).toContain("not a full course");
  });

  it("does not claim native review, official placement, or A11 integration", () => {
    const notice = PUNJABI_REMEDIATION_PROOF_PACK_NOTICE.toLowerCase();
    expect(notice).toContain("wave 22 proof pack only");
    expect(notice).toContain("not a11 integration");
    expect(notice).toContain("study support only");
    expect(notice).toContain("not official placement");
    expect(notice).toContain("native review deferred");
    expect(notice).not.toContain("native reviewed");
  });
});
