import { describe, expect, it } from "vitest";

import {
  PUNJABI_FINAL_REMEDIATION_NOTICE,
  PUNJABI_FINAL_ROUTE_AUDIENCES,
  PUNJABI_FINAL_ROUTE_FOCI,
  PUNJABI_READINESS_GATES,
  punjabiFinalRemediationRouting,
  type PunjabiFinalRemediationRoute,
} from "@/languages/punjabi/finalRemediationRouting";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS = /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiFinalRemediationRouting - size and identity", () => {
  it("keeps a compact useful final routing set", () => {
    expect(punjabiFinalRemediationRouting.length).toBeGreaterThanOrEqual(14);
    expect(punjabiFinalRemediationRouting.length).toBeLessThanOrEqual(50);
  });

  it("has unique kebab-case ids", () => {
    const ids = punjabiFinalRemediationRouting.map((route) => route.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiFinalRemediationRouting - app fields", () => {
  const requiredText: (keyof PunjabiFinalRemediationRoute)[] = [
    "observedError",
    "readinessCheck",
    "remediationBankRef",
    "reviewLoop",
    "scriptSupport",
    "registerSupport",
    "repairTask_vi",
    "repairTask_en",
    "model_pa",
    "model_en",
    "explanation_vi",
    "explanation_en",
  ];

  it("fills every required text field", () => {
    for (const route of punjabiFinalRemediationRouting) {
      for (const key of requiredText) {
        const value = route[key];
        expect(typeof value, `${route.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${route.id}.${key}`).toBeGreaterThan(0);
      }
    }
  });

  it("uses Gurmukhi primary in model text", () => {
    for (const route of punjabiFinalRemediationRouting) {
      expect(GURMUKHI_SCRIPT.test(route.model_pa), `${route.id}.model_pa`).toBe(true);
    }
  });

  it("keeps Vietnamese and English repair text genuinely bilingual", () => {
    for (const route of punjabiFinalRemediationRouting) {
      expect(route.repairTask_vi).not.toBe(route.repairTask_en);
      expect(route.explanation_vi).not.toBe(route.explanation_en);
      expect(
        VIETNAMESE_MARKS.test(route.repairTask_vi) || VIETNAMESE_MARKS.test(route.explanation_vi),
        `${route.id} should include Vietnamese text`,
      ).toBe(true);
    }
  });
});

describe("punjabiFinalRemediationRouting - coverage and guardrails", () => {
  it("uses only valid foci and covers every final route focus", () => {
    const present = new Set<PunjabiFinalRemediationRoute["focus"]>();
    for (const route of punjabiFinalRemediationRouting) {
      expect(PUNJABI_FINAL_ROUTE_FOCI).toContain(route.focus);
      present.add(route.focus);
    }
    for (const focus of PUNJABI_FINAL_ROUTE_FOCI) {
      expect(present.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("uses only valid audiences and includes Vietnamese and English-specific routes", () => {
    const present = new Set<PunjabiFinalRemediationRoute["audience"]>();
    for (const route of punjabiFinalRemediationRouting) {
      expect(PUNJABI_FINAL_ROUTE_AUDIENCES).toContain(route.audience);
      present.add(route.audience);
    }
    expect(present.has("vi")).toBe(true);
    expect(present.has("en")).toBe(true);
    expect(present.has("both")).toBe(true);
  });

  it("uses all readiness gate states", () => {
    const present = new Set(punjabiFinalRemediationRouting.map((route) => route.readinessGate));
    for (const gate of PUNJABI_READINESS_GATES) {
      expect(present.has(gate), `missing readiness gate ${gate}`).toBe(true);
    }
  });

  it("includes Canada-practical repair tasks", () => {
    expect(punjabiFinalRemediationRouting.filter((route) => route.canadaPractical).length).toBeGreaterThanOrEqual(5);
  });

  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const notice = PUNJABI_FINAL_REMEDIATION_NOTICE.toLowerCase();
    expect(notice).toContain("shahmukhi");
    expect(notice).toContain("awareness");
    expect(notice).toContain("not a full course");
  });

  it("does not claim native review, official placement, or A11 integration", () => {
    const notice = PUNJABI_FINAL_REMEDIATION_NOTICE.toLowerCase();
    expect(notice).toContain("study support only");
    expect(notice).toContain("not official placement");
    expect(notice).toContain("native review deferred");
    expect(notice).toContain("not a11 integration");
    expect(notice).not.toContain("native reviewed");
  });
});
