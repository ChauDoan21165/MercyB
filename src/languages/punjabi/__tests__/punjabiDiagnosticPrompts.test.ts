import { describe, expect, it } from "vitest";

import {
  PUNJABI_DIAGNOSTIC_LEVELS,
  PUNJABI_DIAGNOSTIC_NOTICE,
  PUNJABI_DIAGNOSTIC_WEAKNESSES,
  punjabiDiagnosticPrompts,
  type PunjabiDiagnosticPrompt,
} from "@/languages/punjabi/diagnosticPrompts";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS = /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiDiagnosticPrompts - size and identity", () => {
  it("holds between 40 and 80 diagnostic prompts", () => {
    expect(punjabiDiagnosticPrompts.length).toBeGreaterThanOrEqual(40);
    expect(punjabiDiagnosticPrompts.length).toBeLessThanOrEqual(80);
  });

  it("has unique kebab-case ids", () => {
    const ids = punjabiDiagnosticPrompts.map((prompt) => prompt.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiDiagnosticPrompts - required fields", () => {
  const requiredText: (keyof PunjabiDiagnosticPrompt)[] = [
    "instruction_vi",
    "instruction_en",
    "expectedShape",
    "scoringHint",
  ];

  it("fills every required text field", () => {
    for (const prompt of punjabiDiagnosticPrompts) {
      for (const key of requiredText) {
        const value = prompt[key];
        expect(typeof value, `${prompt.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${prompt.id}.${key}`).toBeGreaterThan(0);
      }
    }
  });

  it("keeps Vietnamese and English instructions genuinely bilingual", () => {
    for (const prompt of punjabiDiagnosticPrompts) {
      expect(prompt.instruction_vi).not.toBe(prompt.instruction_en);
      expect(
        VIETNAMESE_MARKS.test(prompt.instruction_vi),
        `${prompt.id} should include Vietnamese text`,
      ).toBe(true);
    }
  });

  it("uses Gurmukhi in each prompt", () => {
    for (const prompt of punjabiDiagnosticPrompts) {
      expect(GURMUKHI_SCRIPT.test(JSON.stringify(prompt)), `${prompt.id} should include Gurmukhi`).toBe(true);
    }
  });
});

describe("punjabiDiagnosticPrompts - levels, weaknesses, and notice", () => {
  it("uses only valid levels and covers A1-C2", () => {
    const present = new Set<PunjabiDiagnosticPrompt["level"]>();
    for (const prompt of punjabiDiagnosticPrompts) {
      expect(PUNJABI_DIAGNOSTIC_LEVELS).toContain(prompt.level);
      present.add(prompt.level);
    }
    for (const level of PUNJABI_DIAGNOSTIC_LEVELS) {
      expect(present.has(level), `missing level ${level}`).toBe(true);
    }
  });

  it("uses only valid weakness tags and covers every required weakness", () => {
    const present = new Set<PunjabiDiagnosticPrompt["weakness"]>();
    for (const prompt of punjabiDiagnosticPrompts) {
      expect(PUNJABI_DIAGNOSTIC_WEAKNESSES).toContain(prompt.weakness);
      present.add(prompt.weakness);
    }
    for (const weakness of PUNJABI_DIAGNOSTIC_WEAKNESSES) {
      expect(present.has(weakness), `missing weakness ${weakness}`).toBe(true);
    }
  });

  it("states study support only, not official placement or certification", () => {
    const notice = PUNJABI_DIAGNOSTIC_NOTICE.toLowerCase();
    expect(notice).toContain("study support only");
    expect(notice).toContain("not official placement");
    expect(notice).toContain("certification");
    expect(notice).toContain("native review deferred");
  });
});
