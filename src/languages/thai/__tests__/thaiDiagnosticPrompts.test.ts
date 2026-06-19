// src/languages/thai/__tests__/thaiDiagnosticPrompts.test.ts
//
// Structural guard for the Thai diagnostic prompt bank. Study-support
// diagnostics only (no placement/certification claim, native review deferred)
// — these tests pin shape, level/weakness coverage, and bilingual
// completeness, not Thai correctness.

import { describe, it, expect } from "vitest";

import {
  thaiDiagnosticPrompts,
  THAI_DIAG_LEVELS,
  THAI_DIAG_WEAKNESSES,
  type ThaiDiagnosticPrompt,
} from "@/languages/thai/diagnosticPrompts";

// Matches any Thai-script character (Unicode block U+0E00–U+0E7F).
const THAI_SCRIPT = /[฀-๿]/;

describe("thaiDiagnosticPrompts — size & identity", () => {
  it("holds between 40 and 80 prompts", () => {
    expect(thaiDiagnosticPrompts.length).toBeGreaterThanOrEqual(40);
    expect(thaiDiagnosticPrompts.length).toBeLessThanOrEqual(80);
  });

  it("has unique, kebab-case ids", () => {
    const ids = thaiDiagnosticPrompts.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id, `id "${id}" should be kebab-case`).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("thaiDiagnosticPrompts — required fields", () => {
  const requiredText: (keyof ThaiDiagnosticPrompt)[] = [
    "instruction_vi",
    "instruction_en",
    "expectedShape",
    "scoringHint",
  ];

  it("every prompt has non-empty required text fields", () => {
    for (const p of thaiDiagnosticPrompts) {
      for (const key of requiredText) {
        const value = p[key];
        expect(typeof value, `${p.id}.${key} should be a string`).toBe("string");
        expect((value as string).trim().length, `${p.id}.${key} should be non-empty`).toBeGreaterThan(0);
      }
    }
  });

  it("Vietnamese and English instructions differ (genuinely bilingual)", () => {
    for (const p of thaiDiagnosticPrompts) {
      expect(p.instruction_vi).not.toBe(p.instruction_en);
    }
  });

  it("every prompt includes Thai script (in stimulus or expected shape)", () => {
    for (const p of thaiDiagnosticPrompts) {
      const hasThai =
        (p.prompt_th && THAI_SCRIPT.test(p.prompt_th)) ||
        THAI_SCRIPT.test(p.expectedShape);
      expect(hasThai, `${p.id} should contain Thai script`).toBe(true);
    }
  });

  it("lower-level (A1/A2) Thai stimuli include romanization", () => {
    for (const p of thaiDiagnosticPrompts) {
      if ((p.level === "A1" || p.level === "A2") && p.prompt_th) {
        expect(
          p.prompt_roman && p.prompt_roman.trim().length > 0,
          `${p.id} (lower level) should romanize its Thai stimulus`,
        ).toBe(true);
      }
    }
  });
});

describe("thaiDiagnosticPrompts — enums", () => {
  it("uses only valid levels", () => {
    for (const p of thaiDiagnosticPrompts) {
      expect(THAI_DIAG_LEVELS).toContain(p.level);
    }
  });

  it("uses only valid weakness tags", () => {
    for (const p of thaiDiagnosticPrompts) {
      expect(THAI_DIAG_WEAKNESSES).toContain(p.weakness);
    }
  });
});

describe("thaiDiagnosticPrompts — coverage", () => {
  it("covers all six CEFR levels", () => {
    const present = new Set(thaiDiagnosticPrompts.map((p) => p.level));
    for (const level of THAI_DIAG_LEVELS) {
      expect(present.has(level), `missing prompts for level ${level}`).toBe(true);
    }
  });

  it("covers every weakness category at least once", () => {
    const present = new Set(thaiDiagnosticPrompts.map((p) => p.weakness));
    for (const weakness of THAI_DIAG_WEAKNESSES) {
      expect(present.has(weakness), `missing coverage for weakness "${weakness}"`).toBe(true);
    }
  });
});
