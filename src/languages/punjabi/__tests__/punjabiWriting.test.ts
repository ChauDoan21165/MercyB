import { describe, expect, it } from "vitest";

import punjabiWritingPrompts, {
  punjabiWritingPrompts as named,
  type PunjabiWritingPrompt,
} from "../writing";

const GURMUKHI_RE = /[ਗ-ੴ]/u;
const hasGurmukhi = (value: string) => GURMUKHI_RE.test(value);

const ALL_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
const REQUIRED_FORMS = [
  "form",
  "message",
  "email",
  "complaint",
  "work_note",
  "school_note",
  "healthcare_explanation",
  "public_office",
] as const;

const serialized = JSON.stringify(punjabiWritingPrompts);

describe("Punjabi writing practice batch", () => {
  it("exports the same app-ready array by default and name", () => {
    expect(punjabiWritingPrompts).toBe(named);
    expect(Array.isArray(punjabiWritingPrompts)).toBe(true);
  });

  it("ships 30-60 prompts across A1-C2", () => {
    expect(punjabiWritingPrompts.length).toBeGreaterThanOrEqual(30);
    expect(punjabiWritingPrompts.length).toBeLessThanOrEqual(60);

    const seenLevels = new Set(punjabiWritingPrompts.map((prompt) => prompt.level));
    for (const level of ALL_LEVELS) {
      expect(seenLevels.has(level)).toBe(true);
    }
  });

  it("uses unique ids and covers required writing situations", () => {
    const ids = punjabiWritingPrompts.map((prompt) => prompt.id);
    expect(new Set(ids).size).toBe(ids.length);

    const seenForms = new Set(punjabiWritingPrompts.map((prompt) => prompt.form));
    for (const form of REQUIRED_FORMS) {
      expect(seenForms.has(form)).toBe(true);
    }
  });

  it.each(punjabiWritingPrompts.map((prompt) => [prompt.id, prompt] as const))(
    "%s includes prompt, expected shape, model answer, hints, and mistakes",
    (_id, prompt: PunjabiWritingPrompt) => {
      expect(prompt.prompt_vi.trim().length).toBeGreaterThan(8);
      expect(prompt.prompt_en.trim().length).toBeGreaterThan(8);
      expect(prompt.expectedAnswerShape_vi.trim().length).toBeGreaterThan(8);
      expect(prompt.expectedAnswerShape_en.trim().length).toBeGreaterThan(8);

      expect(hasGurmukhi(prompt.model_gurmukhi)).toBe(true);
      expect(prompt.model_romanization.trim().length).toBeGreaterThan(8);
      expect(hasGurmukhi(prompt.model_romanization)).toBe(false);
      expect(prompt.model_vi.trim().length).toBeGreaterThan(8);
      expect(prompt.model_en.trim().length).toBeGreaterThan(8);

      expect(prompt.structureHints_vi.length).toBeGreaterThan(0);
      expect(prompt.structureHints_en.length).toBe(prompt.structureHints_vi.length);
      expect(prompt.commonMistakes_vi.length).toBeGreaterThan(0);
      expect(prompt.commonMistakes_en.length).toBe(prompt.commonMistakes_vi.length);
    },
  );

  it("keeps Gurmukhi primary and supports Vietnamese and English learners", () => {
    expect(hasGurmukhi(serialized)).toBe(true);
    expect(serialized).toMatch(/tiếng Việt|Vietnamese|Việt|English|Anh/i);
    expect(serialized).toMatch(/romanization|Gurmukhi/i);
  });

  it("covers the requested domains and does not expand Shahmukhi into a course", () => {
    expect(serialized).toMatch(/message|tin nhắn|ਨੋਟ|Nhắn/i);
    expect(serialized).toMatch(/form|mẫu|ਫਾਰਮ|Điền/i);
    expect(serialized).toMatch(/email|ਈਮੇਲ|Kính gửi|Dear/i);
    expect(serialized).toMatch(/complaint|khiếu nại|ਸ਼ਿਕਾਇਤ|ਰਿਫੰਡ/i);
    expect(serialized).toMatch(/work|công việc|ਸ਼ਿਫਟ|ਮੀਟਿੰਗ/i);
    expect(serialized).toMatch(/school|trường|ਅਧਿਆਪਕ|ਹੋਮਵਰਕ/i);
    expect(serialized).toMatch(/health|bác sĩ|ਦਵਾਈ|ਲੱਛਣ/i);
    expect(serialized).toMatch(/public office|cơ quan|ਅਰਜ਼ੀ|ਦਸਤਾਵੇਜ਼/i);

    const shahmukhiMatches = serialized.match(/Shahmukhi/g) ?? [];
    expect(shahmukhiMatches.length).toBeLessThanOrEqual(1);
  });

  it("does not claim native review, audio, pronunciation scoring, Azure, or Supabase coverage", () => {
    expect(serialized).not.toMatch(
      /native[- ](?:certified|verified|approved|reviewed)|verified by native|native speaker approved|audio|pronunciation score|Azure|Supabase/i,
    );
  });
});
