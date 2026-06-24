import { describe, expect, it } from "vitest";

import {
  PUNJABI_REMEDIATION_AUDIENCES,
  PUNJABI_REMEDIATION_FOCI,
  PUNJABI_REMEDIATION_NOTICE,
  punjabiRemediationBank,
  type PunjabiRemediationEntry,
} from "@/languages/punjabi/remediationBank";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS = /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiRemediationBank - size and identity", () => {
  it("keeps a compact but useful bank", () => {
    expect(punjabiRemediationBank.length).toBeGreaterThanOrEqual(20);
    expect(punjabiRemediationBank.length).toBeLessThanOrEqual(60);
  });

  it("has unique kebab-case ids", () => {
    const ids = punjabiRemediationBank.map((entry) => entry.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiRemediationBank - app consumable fields", () => {
  const requiredText: (keyof PunjabiRemediationEntry)[] = [
    "title",
    "symptom",
    "whyItHappens_vi",
    "whyItHappens_en",
    "remediation_vi",
    "remediation_en",
    "model_pa",
    "model_en",
    "practicePrompt_vi",
    "practicePrompt_en",
  ];

  it("fills every required text field", () => {
    for (const entry of punjabiRemediationBank) {
      for (const key of requiredText) {
        const value = entry[key];
        expect(typeof value, `${entry.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${entry.id}.${key}`).toBeGreaterThan(0);
      }
    }
  });

  it("uses Gurmukhi primary in model sentences", () => {
    for (const entry of punjabiRemediationBank) {
      expect(GURMUKHI_SCRIPT.test(entry.model_pa), `${entry.id}.model_pa`).toBe(true);
    }
  });

  it("keeps Vietnamese and English explanations genuinely bilingual", () => {
    for (const entry of punjabiRemediationBank) {
      expect(entry.whyItHappens_vi).not.toBe(entry.whyItHappens_en);
      expect(entry.remediation_vi).not.toBe(entry.remediation_en);
      expect(
        VIETNAMESE_MARKS.test(entry.whyItHappens_vi) || VIETNAMESE_MARKS.test(entry.remediation_vi),
        `${entry.id} should include Vietnamese text`,
      ).toBe(true);
    }
  });
});

describe("punjabiRemediationBank - coverage and guardrails", () => {
  it("uses only valid focus tags and covers every required remediation focus", () => {
    const present = new Set<PunjabiRemediationEntry["focus"]>();
    for (const entry of punjabiRemediationBank) {
      expect(PUNJABI_REMEDIATION_FOCI).toContain(entry.focus);
      present.add(entry.focus);
    }
    for (const focus of PUNJABI_REMEDIATION_FOCI) {
      expect(present.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("uses only valid audience tags and includes Vietnamese and English transfer entries", () => {
    const present = new Set<PunjabiRemediationEntry["audience"]>();
    for (const entry of punjabiRemediationBank) {
      expect(PUNJABI_REMEDIATION_AUDIENCES).toContain(entry.audience);
      present.add(entry.audience);
    }
    expect(present.has("vi")).toBe(true);
    expect(present.has("en")).toBe(true);
    expect(present.has("both")).toBe(true);
  });

  it("includes Canada-practical public-service examples", () => {
    const canadaEntries = punjabiRemediationBank.filter((entry) => entry.canadaPractical);
    expect(canadaEntries.length).toBeGreaterThanOrEqual(4);
    expect(canadaEntries.some((entry) => entry.focus === "public-service-context")).toBe(true);
  });

  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const serialized = `${PUNJABI_REMEDIATION_NOTICE} ${JSON.stringify(punjabiRemediationBank)}`;
    const lower = serialized.toLowerCase();
    expect(lower).toContain("shahmukhi");
    expect(lower).toContain("awareness");
    expect(lower).toContain("not a full course");
  });

  it("does not claim native review", () => {
    const notice = PUNJABI_REMEDIATION_NOTICE.toLowerCase();
    expect(notice).toContain("native review deferred");
    expect(notice).not.toContain("native reviewed");
  });
});
