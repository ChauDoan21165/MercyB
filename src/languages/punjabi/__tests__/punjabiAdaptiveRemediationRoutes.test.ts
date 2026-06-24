import { describe, expect, it } from "vitest";

import {
  PUNJABI_ADAPTIVE_AUDIENCES,
  PUNJABI_ADAPTIVE_NOTICE,
  PUNJABI_ADAPTIVE_ROUTE_FOCI,
  punjabiAdaptiveRemediationRoutes,
  type PunjabiAdaptiveRoute,
} from "@/languages/punjabi/adaptiveRemediationRoutes";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS = /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiAdaptiveRemediationRoutes - size and identity", () => {
  it("keeps a compact useful route set", () => {
    expect(punjabiAdaptiveRemediationRoutes.length).toBeGreaterThanOrEqual(16);
    expect(punjabiAdaptiveRemediationRoutes.length).toBeLessThanOrEqual(50);
  });

  it("has unique kebab-case ids", () => {
    const ids = punjabiAdaptiveRemediationRoutes.map((route) => route.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiAdaptiveRemediationRoutes - app fields", () => {
  const requiredText: (keyof PunjabiAdaptiveRoute)[] = [
    "observedMistake",
    "likelyCause_vi",
    "likelyCause_en",
    "routeName",
    "repairDrill_vi",
    "repairDrill_en",
    "model_pa",
    "model_en",
  ];

  it("fills required route text fields", () => {
    for (const route of punjabiAdaptiveRemediationRoutes) {
      for (const key of requiredText) {
        const value = route[key];
        expect(typeof value, `${route.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${route.id}.${key}`).toBeGreaterThan(0);
      }
      expect(route.nextStepIds.length, `${route.id}.nextStepIds`).toBeGreaterThan(0);
    }
  });

  it("uses Gurmukhi primary in model text", () => {
    for (const route of punjabiAdaptiveRemediationRoutes) {
      expect(GURMUKHI_SCRIPT.test(route.model_pa), `${route.id}.model_pa`).toBe(true);
    }
  });

  it("keeps Vietnamese and English explanations genuinely bilingual", () => {
    for (const route of punjabiAdaptiveRemediationRoutes) {
      expect(route.likelyCause_vi).not.toBe(route.likelyCause_en);
      expect(route.repairDrill_vi).not.toBe(route.repairDrill_en);
      expect(
        VIETNAMESE_MARKS.test(route.likelyCause_vi) || VIETNAMESE_MARKS.test(route.repairDrill_vi),
        `${route.id} should include Vietnamese text`,
      ).toBe(true);
    }
  });
});

describe("punjabiAdaptiveRemediationRoutes - coverage and guardrails", () => {
  it("uses only valid focus tags and covers every required focus", () => {
    const present = new Set<PunjabiAdaptiveRoute["focus"]>();
    for (const route of punjabiAdaptiveRemediationRoutes) {
      expect(PUNJABI_ADAPTIVE_ROUTE_FOCI).toContain(route.focus);
      present.add(route.focus);
    }
    for (const focus of PUNJABI_ADAPTIVE_ROUTE_FOCI) {
      expect(present.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("uses only valid audiences and includes Vietnamese and English specific routes", () => {
    const present = new Set<PunjabiAdaptiveRoute["audience"]>();
    for (const route of punjabiAdaptiveRemediationRoutes) {
      expect(PUNJABI_ADAPTIVE_AUDIENCES).toContain(route.audience);
      present.add(route.audience);
    }
    expect(present.has("vi")).toBe(true);
    expect(present.has("en")).toBe(true);
    expect(present.has("both")).toBe(true);
  });

  it("includes Canada-practical examples", () => {
    expect(punjabiAdaptiveRemediationRoutes.filter((route) => route.canadaPractical).length).toBeGreaterThanOrEqual(5);
  });

  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const serialized = `${PUNJABI_ADAPTIVE_NOTICE} ${JSON.stringify(punjabiAdaptiveRemediationRoutes)}`.toLowerCase();
    expect(serialized).toContain("shahmukhi");
    expect(serialized).toContain("awareness");
    expect(serialized).toContain("not a full course");
  });

  it("does not claim native review or official placement", () => {
    const notice = PUNJABI_ADAPTIVE_NOTICE.toLowerCase();
    expect(notice).toContain("study support only");
    expect(notice).toContain("not official placement");
    expect(notice).toContain("native review deferred");
    expect(notice).not.toContain("native reviewed");
  });
});
