// src/languages/thai/__tests__/thaiIntegrationAuditNotes.test.ts
//
// Guard for the Thai integration audit notes (for the future A11 agent).
// Pins honest status flags, the module inventory, forbidden claims, known
// limitations, pre-MR checks, and the required risk register. Pure-data
// contract enforced.

import { describe, it, expect } from "vitest";

import {
  thaiIntegrationAuditMeta,
  thaiExpectedModuleFiles,
  thaiForbiddenClaims,
  thaiKnownLimitations,
  thaiPreMrChecks,
  thaiAuditRiskFlags,
  THAI_AUDIT_RISK_IDS,
  THAI_AUDIT_SEVERITIES,
} from "@/languages/thai/integrationAuditNotes";

describe("thaiIntegrationAuditMeta — honest status", () => {
  it("declares not native-reviewed, no audio, no certification", () => {
    expect(thaiIntegrationAuditMeta.nativeReviewed).toBe(false);
    expect(thaiIntegrationAuditMeta.audioSupported).toBe(false);
    expect(thaiIntegrationAuditMeta.officialCertification).toBe(false);
  });

  it("promises bilingual support and has a bilingual scope", () => {
    expect(thaiIntegrationAuditMeta.bilingualSupport.vi).toBe(true);
    expect(thaiIntegrationAuditMeta.bilingualSupport.en).toBe(true);
    expect(thaiIntegrationAuditMeta.scope_vi.trim().length).toBeGreaterThan(0);
    expect(thaiIntegrationAuditMeta.scope_en.trim().length).toBeGreaterThan(0);
    expect(thaiIntegrationAuditMeta.scope_vi).not.toBe(thaiIntegrationAuditMeta.scope_en);
  });
});

describe("thaiExpectedModuleFiles — inventory", () => {
  it("lists the five Thai content modules A11 must wire", () => {
    const ids = new Set(thaiExpectedModuleFiles.map((m) => m.id));
    for (const required of [
      "errorPatterns",
      "examPractice",
      "diagnosticPrompts",
      "qualityNotes",
      "mistakeRepairDrills",
    ]) {
      expect(ids.has(required), `missing expected module ${required}`).toBe(true);
    }
  });

  it("each entry references a thai module path and is bilingual", () => {
    for (const m of thaiExpectedModuleFiles) {
      expect(m.text_vi).toMatch(/src\/languages\/thai\/.+\.ts/);
      expect(m.text_en).toMatch(/src\/languages\/thai\/.+\.ts/);
      expect(m.text_vi).not.toBe(m.text_en);
    }
  });
});

describe("audit lists — bilingual & non-empty", () => {
  const lists = {
    forbiddenClaims: thaiForbiddenClaims,
    knownLimitations: thaiKnownLimitations,
  };

  for (const [name, list] of Object.entries(lists)) {
    it(`${name} is non-empty and genuinely bilingual`, () => {
      expect(list.length).toBeGreaterThanOrEqual(1);
      for (const item of list) {
        expect(item.text_vi.trim().length, `${name}.${item.id}.text_vi`).toBeGreaterThan(0);
        expect(item.text_en.trim().length, `${name}.${item.id}.text_en`).toBeGreaterThan(0);
        expect(item.text_vi).not.toBe(item.text_en);
      }
    });
  }
});

describe("thaiPreMrChecks — A11 gate", () => {
  it("has checks with valid severity and bilingual text", () => {
    expect(thaiPreMrChecks.length).toBeGreaterThanOrEqual(1);
    for (const c of thaiPreMrChecks) {
      expect(THAI_AUDIT_SEVERITIES).toContain(c.severity);
      expect(c.check_vi.trim().length).toBeGreaterThan(0);
      expect(c.check_en.trim().length).toBeGreaterThan(0);
      expect(c.check_vi).not.toBe(c.check_en);
    }
  });
});

describe("thaiAuditRiskFlags — required risk register", () => {
  it("covers all required risk ids", () => {
    const ids = new Set(thaiAuditRiskFlags.map((f) => f.id));
    for (const required of THAI_AUDIT_RISK_IDS) {
      expect(ids.has(required), `missing risk flag "${required}"`).toBe(true);
    }
  });

  it("each flag has a valid severity and bilingual text", () => {
    for (const f of thaiAuditRiskFlags) {
      expect(THAI_AUDIT_SEVERITIES).toContain(f.severity);
      expect(f.flag_vi.trim().length).toBeGreaterThan(0);
      expect(f.flag_en.trim().length).toBeGreaterThan(0);
      expect(f.flag_vi).not.toBe(f.flag_en);
    }
  });
});

describe("integrationAuditNotes module — pure data only", () => {
  it("exports data structures, not functions", () => {
    expect(typeof thaiIntegrationAuditMeta).toBe("object");
    for (const value of [
      thaiExpectedModuleFiles,
      thaiForbiddenClaims,
      thaiKnownLimitations,
      thaiPreMrChecks,
      thaiAuditRiskFlags,
    ]) {
      expect(Array.isArray(value)).toBe(true);
      expect(typeof value).not.toBe("function");
    }
  });
});
