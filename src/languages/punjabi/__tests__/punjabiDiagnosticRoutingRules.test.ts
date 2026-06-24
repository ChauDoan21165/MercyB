import { describe, expect, it } from "vitest";

import {
  PUNJABI_DIAGNOSTIC_ROUTING_NOTICE,
  PUNJABI_ROUTING_LEVELS,
  PUNJABI_ROUTING_SOURCES,
  punjabiDiagnosticRoutingRules,
  type PunjabiDiagnosticRoutingRule,
} from "@/languages/punjabi/diagnosticRoutingRules";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS = /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiDiagnosticRoutingRules - size and identity", () => {
  it("keeps a compact useful rule set", () => {
    expect(punjabiDiagnosticRoutingRules.length).toBeGreaterThanOrEqual(14);
    expect(punjabiDiagnosticRoutingRules.length).toBeLessThanOrEqual(50);
  });

  it("has unique kebab-case ids", () => {
    const ids = punjabiDiagnosticRoutingRules.map((rule) => rule.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiDiagnosticRoutingRules - app fields", () => {
  const requiredText: (keyof PunjabiDiagnosticRoutingRule)[] = [
    "observedSignal",
    "nextModule",
    "remediationDrill",
    "reviewLoop",
    "scriptSupport",
    "registerSupport",
    "example_pa",
    "example_en",
    "explanation_vi",
    "explanation_en",
  ];

  it("fills every required text field", () => {
    for (const rule of punjabiDiagnosticRoutingRules) {
      for (const key of requiredText) {
        const value = rule[key];
        expect(typeof value, `${rule.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${rule.id}.${key}`).toBeGreaterThan(0);
      }
    }
  });

  it("uses Gurmukhi primary in examples", () => {
    for (const rule of punjabiDiagnosticRoutingRules) {
      expect(GURMUKHI_SCRIPT.test(rule.example_pa), `${rule.id}.example_pa`).toBe(true);
    }
  });

  it("keeps Vietnamese and English explanations genuinely bilingual", () => {
    for (const rule of punjabiDiagnosticRoutingRules) {
      expect(rule.explanation_vi).not.toBe(rule.explanation_en);
      expect(VIETNAMESE_MARKS.test(rule.explanation_vi), `${rule.id} should include Vietnamese text`).toBe(true);
    }
  });
});

describe("punjabiDiagnosticRoutingRules - coverage and guardrails", () => {
  it("uses only valid levels and covers A1-C2", () => {
    const present = new Set<PunjabiDiagnosticRoutingRule["level"]>();
    for (const rule of punjabiDiagnosticRoutingRules) {
      expect(PUNJABI_ROUTING_LEVELS).toContain(rule.level);
      present.add(rule.level);
    }
    for (const level of PUNJABI_ROUTING_LEVELS) {
      expect(present.has(level), `missing level ${level}`).toBe(true);
    }
  });

  it("uses only valid likely sources and covers every source", () => {
    const present = new Set<PunjabiDiagnosticRoutingRule["likelySource"]>();
    for (const rule of punjabiDiagnosticRoutingRules) {
      expect(PUNJABI_ROUTING_SOURCES).toContain(rule.likelySource);
      present.add(rule.likelySource);
    }
    for (const source of PUNJABI_ROUTING_SOURCES) {
      expect(present.has(source), `missing source ${source}`).toBe(true);
    }
  });

  it("includes Canada-practical practice routes", () => {
    expect(punjabiDiagnosticRoutingRules.filter((rule) => rule.canadaPractical).length).toBeGreaterThanOrEqual(5);
  });

  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const notice = PUNJABI_DIAGNOSTIC_ROUTING_NOTICE.toLowerCase();
    expect(notice).toContain("shahmukhi");
    expect(notice).toContain("awareness");
    expect(notice).toContain("not a full course");
  });

  it("does not claim native review or official placement", () => {
    const notice = PUNJABI_DIAGNOSTIC_ROUTING_NOTICE.toLowerCase();
    expect(notice).toContain("study support only");
    expect(notice).toContain("not official placement");
    expect(notice).toContain("native review deferred");
    expect(notice).not.toContain("native reviewed");
  });
});
