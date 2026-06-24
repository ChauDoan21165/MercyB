import { describe, expect, it } from "vitest";

import {
  PUNJABI_ASSESSMENT_AREAS,
  PUNJABI_ASSESSMENT_LEVELS,
  PUNJABI_ASSESSMENT_NOTICE,
  punjabiAssessmentRubrics,
  type PunjabiAssessmentRubric,
} from "@/languages/punjabi/assessmentRubrics";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS = /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiAssessmentRubrics - size and identity", () => {
  it("keeps a compact but useful rubric set", () => {
    expect(punjabiAssessmentRubrics.length).toBeGreaterThanOrEqual(8);
    expect(punjabiAssessmentRubrics.length).toBeLessThanOrEqual(30);
  });

  it("has unique kebab-case ids", () => {
    const ids = punjabiAssessmentRubrics.map((rubric) => rubric.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiAssessmentRubrics - app consumable fields", () => {
  const requiredText: (keyof PunjabiAssessmentRubric)[] = [
    "title",
    "learnerTask_vi",
    "learnerTask_en",
    "feedback_vi",
    "feedback_en",
    "remediationRoute",
  ];

  it("fills every required rubric text field", () => {
    for (const rubric of punjabiAssessmentRubrics) {
      for (const key of requiredText) {
        const value = rubric[key];
        expect(typeof value, `${rubric.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${rubric.id}.${key}`).toBeGreaterThan(0);
      }
      expect(rubric.commonTraps.length, `${rubric.id}.commonTraps`).toBeGreaterThan(0);
    }
  });

  it("has emerging, developing, and proficient bands with bilingual descriptors", () => {
    for (const rubric of punjabiAssessmentRubrics) {
      const levels = rubric.bands.map((band) => band.level);
      expect(levels).toEqual([...PUNJABI_ASSESSMENT_LEVELS]);
      for (const band of rubric.bands) {
        expect(band.descriptor_vi).not.toBe(band.descriptor_en);
        expect(VIETNAMESE_MARKS.test(band.descriptor_vi), `${rubric.id}.${band.level}`).toBe(true);
        expect(GURMUKHI_SCRIPT.test(band.evidence_pa), `${rubric.id}.${band.level}.evidence_pa`).toBe(true);
        expect(band.evidence_en.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("keeps Vietnamese and English task/feedback text distinct", () => {
    for (const rubric of punjabiAssessmentRubrics) {
      expect(rubric.learnerTask_vi).not.toBe(rubric.learnerTask_en);
      expect(rubric.feedback_vi).not.toBe(rubric.feedback_en);
      expect(VIETNAMESE_MARKS.test(rubric.learnerTask_vi) || VIETNAMESE_MARKS.test(rubric.feedback_vi)).toBe(true);
    }
  });
});

describe("punjabiAssessmentRubrics - coverage and guardrails", () => {
  it("uses only valid areas and covers every required assessment area", () => {
    const present = new Set<PunjabiAssessmentRubric["area"]>();
    for (const rubric of punjabiAssessmentRubrics) {
      expect(PUNJABI_ASSESSMENT_AREAS).toContain(rubric.area);
      present.add(rubric.area);
    }
    for (const area of PUNJABI_ASSESSMENT_AREAS) {
      expect(present.has(area), `missing area ${area}`).toBe(true);
    }
  });

  it("includes Canada-practical examples", () => {
    expect(punjabiAssessmentRubrics.filter((rubric) => rubric.canadaPractical).length).toBeGreaterThanOrEqual(4);
  });

  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const notice = PUNJABI_ASSESSMENT_NOTICE.toLowerCase();
    expect(notice).toContain("shahmukhi");
    expect(notice).toContain("awareness");
    expect(notice).toContain("not a full course");
  });

  it("does not claim native review or official certification", () => {
    const notice = PUNJABI_ASSESSMENT_NOTICE.toLowerCase();
    expect(notice).toContain("study support only");
    expect(notice).toContain("not official certification");
    expect(notice).toContain("native review deferred");
    expect(notice).not.toContain("native reviewed");
  });
});
