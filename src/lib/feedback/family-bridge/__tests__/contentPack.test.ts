import { describe, expect, it } from "vitest";
import {
  FAMILY_BRIDGE_INTRO,
  PROGRESS_SHARE_COPY,
  FAMILY_BRIDGE_CTA_INVENTORY,
  getFamilyBridgeCta,
  getFamilyBridgeCtasForPlacement,
  getValidatedFamilyBridgeCtasForPlacement,
} from "../content-pack";

const VI_DIACRITIC = /[À-ỹ]/u;

describe("FAMILY_BRIDGE_INTRO", () => {
  it("has non-empty VN and EN strings", () => {
    expect(FAMILY_BRIDGE_INTRO.headlineVi.trim().length).toBeGreaterThan(0);
    expect(FAMILY_BRIDGE_INTRO.subheadVi.trim().length).toBeGreaterThan(0);
    expect(FAMILY_BRIDGE_INTRO.bodyVi.trim().length).toBeGreaterThan(0);
    expect(FAMILY_BRIDGE_INTRO.headlineEn.trim().length).toBeGreaterThan(0);
    expect(FAMILY_BRIDGE_INTRO.subheadEn.trim().length).toBeGreaterThan(0);
  });

  it("VN fields contain Vietnamese diacritics", () => {
    expect(FAMILY_BRIDGE_INTRO.headlineVi).toMatch(VI_DIACRITIC);
    expect(FAMILY_BRIDGE_INTRO.subheadVi).toMatch(VI_DIACRITIC);
    expect(FAMILY_BRIDGE_INTRO.bodyVi).toMatch(VI_DIACRITIC);
  });

  it("headline is within the 80-char budget", () => {
    expect(FAMILY_BRIDGE_INTRO.headlineVi.length).toBeLessThanOrEqual(80);
  });

  it("subhead is within the 140-char budget", () => {
    expect(FAMILY_BRIDGE_INTRO.subheadVi.length).toBeLessThanOrEqual(140);
  });
});

describe("PROGRESS_SHARE_COPY", () => {
  it("has at least 2 templates", () => {
    expect(PROGRESS_SHARE_COPY.length).toBeGreaterThanOrEqual(2);
  });

  it("every entry has unique id", () => {
    const ids = PROGRESS_SHARE_COPY.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every entry has non-empty VN and EN messages", () => {
    for (const entry of PROGRESS_SHARE_COPY) {
      expect(entry.labelVi.trim().length, `${entry.id} labelVi`).toBeGreaterThan(0);
      expect(entry.learnerMessageVi.trim().length, `${entry.id} learnerMessageVi`).toBeGreaterThan(0);
      expect(entry.recipientContextVi.trim().length, `${entry.id} recipientContextVi`).toBeGreaterThan(0);
      expect(entry.learnerMessageEn.trim().length, `${entry.id} learnerMessageEn`).toBeGreaterThan(0);
    }
  });

  it("VN message fields contain Vietnamese diacritics", () => {
    for (const entry of PROGRESS_SHARE_COPY) {
      expect(entry.learnerMessageVi, `${entry.id} learnerMessageVi diacritics`).toMatch(VI_DIACRITIC);
      expect(entry.recipientContextVi, `${entry.id} recipientContextVi diacritics`).toMatch(VI_DIACRITIC);
    }
  });

  it("all senderContext values are 'learner'", () => {
    for (const entry of PROGRESS_SHARE_COPY) {
      expect(entry.senderContext).toBe("learner");
    }
  });
});

describe("FAMILY_BRIDGE_CTA_INVENTORY", () => {
  it("has at least 6 CTAs", () => {
    expect(FAMILY_BRIDGE_CTA_INVENTORY.length).toBeGreaterThanOrEqual(6);
  });

  it("every CTA has a unique id", () => {
    const ids = FAMILY_BRIDGE_CTA_INVENTORY.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every CTA has non-empty labelVi, labelEn, trigger, action", () => {
    for (const cta of FAMILY_BRIDGE_CTA_INVENTORY) {
      expect(cta.labelVi.trim().length, `${cta.id} labelVi`).toBeGreaterThan(0);
      expect(cta.labelEn.trim().length, `${cta.id} labelEn`).toBeGreaterThan(0);
      expect(cta.trigger.trim().length, `${cta.id} trigger`).toBeGreaterThan(0);
      expect(cta.action.trim().length, `${cta.id} action`).toBeGreaterThan(0);
    }
  });

  it("VN label fields contain Vietnamese diacritics", () => {
    for (const cta of FAMILY_BRIDGE_CTA_INVENTORY) {
      expect(cta.labelVi, `${cta.id} labelVi diacritics`).toMatch(VI_DIACRITIC);
    }
  });

  it("all placements are valid FamilyCtaPlacement values", () => {
    const valid = new Set([
      "account-page",
      "after-lesson",
      "share-progress-page",
      "parent-view-empty",
      "parent-view-entitled",
      "onboarding-final-step",
    ]);
    for (const cta of FAMILY_BRIDGE_CTA_INVENTORY) {
      expect(valid.has(cta.placement), `${cta.id} unknown placement ${cta.placement}`).toBe(true);
    }
  });
});

describe("accessor helpers", () => {
  it("getFamilyBridgeCta returns the matching entry or undefined", () => {
    const found = getFamilyBridgeCta("cta-account-invite-family");
    expect(found).toBeDefined();
    expect(found?.id).toBe("cta-account-invite-family");
    expect(getFamilyBridgeCta("does-not-exist")).toBeUndefined();
  });

  it("getFamilyBridgeCtasForPlacement returns all matching CTAs", () => {
    const ctasForAccount = getFamilyBridgeCtasForPlacement("account-page");
    expect(ctasForAccount.length).toBeGreaterThanOrEqual(1);
    for (const c of ctasForAccount) {
      expect(c.placement).toBe("account-page");
    }
  });

  it("getValidatedFamilyBridgeCtasForPlacement returns only validated CTAs", () => {
    // All are validated:false in this draft batch — validated set is empty
    const validated = getValidatedFamilyBridgeCtasForPlacement("account-page");
    for (const c of validated) {
      expect(c.validated).toBe(true);
    }
  });
});
