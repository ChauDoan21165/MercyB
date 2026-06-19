// src/languages/thai/__tests__/thaiQualityNotes.test.ts
//
// Guard for the Thai QA metadata. Pins the honesty disclaimers (no native
// review, no audio scoring, tone/romanization caveats), bilingual coverage,
// the module inventory, risk flags, and the "pure data only" contract.

import { describe, it, expect } from "vitest";

import {
  thaiQualityMetadata,
  thaiQualityNotes,
  thaiModules,
  thaiRiskFlags,
  THAI_QUALITY_NOTE_IDS,
  THAI_RISK_SEVERITIES,
} from "@/languages/thai/qualityNotes";

describe("thaiQualityMetadata — honesty flags", () => {
  it("never claims native review", () => {
    expect(thaiQualityMetadata.nativeReviewClaimed).toBe(false);
    expect(thaiQualityMetadata.reviewState).toBe("draft-native-review-deferred");
  });

  it("declares no audio/pronunciation scoring and no certification", () => {
    expect(thaiQualityMetadata.audioPronunciationScoring).toBe(false);
    expect(thaiQualityMetadata.officialCertification).toBe(false);
  });

  it("promises bilingual (vi + en) support", () => {
    expect(thaiQualityMetadata.bilingualSupport.vi).toBe(true);
    expect(thaiQualityMetadata.bilingualSupport.en).toBe(true);
  });

  it("has a bilingual scope that differs across languages", () => {
    expect(thaiQualityMetadata.scope_vi.trim().length).toBeGreaterThan(0);
    expect(thaiQualityMetadata.scope_en.trim().length).toBeGreaterThan(0);
    expect(thaiQualityMetadata.scope_vi).not.toBe(thaiQualityMetadata.scope_en);
  });
});

describe("thaiQualityNotes — required coverage", () => {
  it("includes every required note id", () => {
    const ids = new Set(thaiQualityNotes.map((n) => n.id));
    for (const required of THAI_QUALITY_NOTE_IDS) {
      expect(ids.has(required), `missing quality note "${required}"`).toBe(true);
    }
  });

  it("each note is genuinely bilingual and non-empty", () => {
    for (const n of thaiQualityNotes) {
      for (const key of ["title_vi", "title_en", "detail_vi", "detail_en"] as const) {
        expect(n[key].trim().length, `${n.id}.${key}`).toBeGreaterThan(0);
      }
      expect(n.title_vi).not.toBe(n.title_en);
      expect(n.detail_vi).not.toBe(n.detail_en);
    }
  });
});

describe("thaiModules — inventory", () => {
  it("lists the core Thai data modules", () => {
    const exports = new Set(thaiModules.map((m) => m.export));
    for (const required of [
      "thaiErrorPatterns",
      "thaiExamTasks",
      "thaiDiagnosticPrompts",
      "thaiQualityMetadata",
    ]) {
      expect(exports.has(required), `missing module entry for ${required}`).toBe(true);
    }
  });

  it("each module entry is bilingual with a file path", () => {
    for (const m of thaiModules) {
      expect(m.file).toMatch(/^src\/languages\/thai\/.+\.ts$/);
      expect(m.summary_vi.trim().length).toBeGreaterThan(0);
      expect(m.summary_en.trim().length).toBeGreaterThan(0);
      expect(m.summary_vi).not.toBe(m.summary_en);
    }
  });
});

describe("thaiRiskFlags — risk register", () => {
  it("has at least one flag, each with a valid severity and bilingual text", () => {
    expect(thaiRiskFlags.length).toBeGreaterThanOrEqual(1);
    for (const f of thaiRiskFlags) {
      expect(THAI_RISK_SEVERITIES).toContain(f.severity);
      expect(f.flag_vi.trim().length).toBeGreaterThan(0);
      expect(f.flag_en.trim().length).toBeGreaterThan(0);
      expect(f.flag_vi).not.toBe(f.flag_en);
    }
  });

  it("flags unique ids", () => {
    const ids = thaiRiskFlags.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("qualityNotes module — pure data only", () => {
  it("exports data structures, not functions", () => {
    expect(typeof thaiQualityMetadata).toBe("object");
    expect(Array.isArray(thaiQualityNotes)).toBe(true);
    expect(Array.isArray(thaiModules)).toBe(true);
    expect(Array.isArray(thaiRiskFlags)).toBe(true);
    for (const value of [thaiQualityMetadata, thaiQualityNotes, thaiModules, thaiRiskFlags]) {
      expect(typeof value).not.toBe("function");
    }
  });
});
