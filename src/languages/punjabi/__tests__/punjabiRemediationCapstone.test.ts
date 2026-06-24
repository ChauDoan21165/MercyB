import { describe, expect, it } from "vitest";

import {
  PUNJABI_CAPSTONE_AUDIENCES,
  PUNJABI_CAPSTONE_FOCI,
  PUNJABI_REMEDIATION_CAPSTONE_NOTICE,
  punjabiRemediationCapstone,
  type PunjabiRemediationCapstoneItem,
} from "@/languages/punjabi/remediationCapstone";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS = /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiRemediationCapstone - size and identity", () => {
  it("keeps a compact useful capstone set", () => {
    expect(punjabiRemediationCapstone.length).toBeGreaterThanOrEqual(15);
    expect(punjabiRemediationCapstone.length).toBeLessThanOrEqual(50);
  });

  it("has unique kebab-case ids", () => {
    const ids = punjabiRemediationCapstone.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiRemediationCapstone - app fields", () => {
  const requiredText: (keyof PunjabiRemediationCapstoneItem)[] = [
    "checkpointTitle",
    "learnerTask_vi",
    "learnerTask_en",
    "stimulus_pa",
    "expected_pa",
    "expected_en",
    "diagnosisCue",
    "routeIfMissed",
    "feedback_vi",
    "feedback_en",
  ];

  it("fills every required text field", () => {
    for (const item of punjabiRemediationCapstone) {
      for (const key of requiredText) {
        const value = item[key];
        expect(typeof value, `${item.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${item.id}.${key}`).toBeGreaterThan(0);
      }
    }
  });

  it("uses Gurmukhi primary in stimuli and expected responses", () => {
    for (const item of punjabiRemediationCapstone) {
      expect(GURMUKHI_SCRIPT.test(item.stimulus_pa), `${item.id}.stimulus_pa`).toBe(true);
      expect(GURMUKHI_SCRIPT.test(item.expected_pa), `${item.id}.expected_pa`).toBe(true);
    }
  });

  it("keeps Vietnamese and English learner tasks and feedback genuinely bilingual", () => {
    for (const item of punjabiRemediationCapstone) {
      expect(item.learnerTask_vi).not.toBe(item.learnerTask_en);
      expect(item.feedback_vi).not.toBe(item.feedback_en);
      expect(
        VIETNAMESE_MARKS.test(item.learnerTask_vi) || VIETNAMESE_MARKS.test(item.feedback_vi),
        `${item.id} should include Vietnamese text`,
      ).toBe(true);
    }
  });
});

describe("punjabiRemediationCapstone - coverage and guardrails", () => {
  it("uses only valid foci and covers every capstone focus", () => {
    const present = new Set<PunjabiRemediationCapstoneItem["focus"]>();
    for (const item of punjabiRemediationCapstone) {
      expect(PUNJABI_CAPSTONE_FOCI).toContain(item.focus);
      present.add(item.focus);
    }
    for (const focus of PUNJABI_CAPSTONE_FOCI) {
      expect(present.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("uses only valid audiences and includes Vietnamese and English-specific items", () => {
    const present = new Set<PunjabiRemediationCapstoneItem["audience"]>();
    for (const item of punjabiRemediationCapstone) {
      expect(PUNJABI_CAPSTONE_AUDIENCES).toContain(item.audience);
      present.add(item.audience);
    }
    expect(present.has("vi")).toBe(true);
    expect(present.has("en")).toBe(true);
    expect(present.has("both")).toBe(true);
  });

  it("includes Canada-practical capstone checkpoints", () => {
    expect(punjabiRemediationCapstone.filter((item) => item.canadaPractical).length).toBeGreaterThanOrEqual(5);
  });

  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const serialized = `${PUNJABI_REMEDIATION_CAPSTONE_NOTICE} ${JSON.stringify(punjabiRemediationCapstone)}`.toLowerCase();
    expect(serialized).toContain("shahmukhi");
    expect(serialized).toContain("awareness");
    expect(serialized).toContain("not a full course");
  });

  it("does not claim native review or official certification", () => {
    const notice = PUNJABI_REMEDIATION_CAPSTONE_NOTICE.toLowerCase();
    expect(notice).toContain("study support only");
    expect(notice).toContain("not official certification");
    expect(notice).toContain("native review deferred");
    expect(notice).not.toContain("native reviewed");
  });
});
