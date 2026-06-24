import { describe, expect, it } from "vitest";

import {
  PUNJABI_FINAL_ERROR_DOMAINS,
  PUNJABI_FINAL_ERROR_SEVERITIES,
  PUNJABI_FINAL_ERROR_TAXONOMY_NOTICE,
  punjabiFinalErrorTaxonomy,
  type PunjabiFinalErrorTaxonomyEntry,
} from "@/languages/punjabi/finalErrorTaxonomy";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS = /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiFinalErrorTaxonomy - size and identity", () => {
  it("keeps a compact final taxonomy", () => {
    expect(punjabiFinalErrorTaxonomy.length).toBeGreaterThanOrEqual(15);
    expect(punjabiFinalErrorTaxonomy.length).toBeLessThanOrEqual(45);
  });

  it("has unique taxonomy ids", () => {
    const ids = punjabiFinalErrorTaxonomy.map((entry) => entry.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^taxonomy-[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiFinalErrorTaxonomy - app fields", () => {
  const requiredText: (keyof PunjabiFinalErrorTaxonomyEntry)[] = [
    "label_vi",
    "label_en",
    "diagnosticSignal",
    "model_pa",
    "model_en",
    "explanation_vi",
    "explanation_en",
    "commonTrap",
    "reviewAction_vi",
    "reviewAction_en",
    "remediationRouteId",
    "readinessCheck",
    "qualityGate",
  ];

  it("fills all required fields", () => {
    for (const entry of punjabiFinalErrorTaxonomy) {
      for (const key of requiredText) {
        const value = entry[key];
        expect(typeof value, `${entry.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${entry.id}.${key}`).toBeGreaterThan(0);
      }
    }
  });

  it("uses Gurmukhi primary models and optional Gurmukhi flawed examples", () => {
    for (const entry of punjabiFinalErrorTaxonomy) {
      expect(GURMUKHI_SCRIPT.test(entry.model_pa), `${entry.id}.model_pa`).toBe(true);
      expect(entry.model_pa).not.toBe(entry.model_roman);
      if (entry.flawedExample) {
        expect(GURMUKHI_SCRIPT.test(entry.flawedExample), `${entry.id}.flawedExample`).toBe(true);
      }
    }
  });

  it("keeps Vietnamese and English explanations distinct", () => {
    for (const entry of punjabiFinalErrorTaxonomy) {
      expect(entry.label_vi).not.toBe(entry.label_en);
      expect(entry.explanation_vi).not.toBe(entry.explanation_en);
      expect(entry.reviewAction_vi).not.toBe(entry.reviewAction_en);
      expect(
        VIETNAMESE_MARKS.test(entry.label_vi) ||
          VIETNAMESE_MARKS.test(entry.explanation_vi) ||
          VIETNAMESE_MARKS.test(entry.reviewAction_vi),
        `${entry.id} should include Vietnamese text`,
      ).toBe(true);
    }
  });
});

describe("punjabiFinalErrorTaxonomy - coverage and quality routing", () => {
  it("covers every final error domain", () => {
    const present = new Set<PunjabiFinalErrorTaxonomyEntry["domain"]>();
    for (const entry of punjabiFinalErrorTaxonomy) {
      expect(PUNJABI_FINAL_ERROR_DOMAINS).toContain(entry.domain);
      present.add(entry.domain);
    }
    for (const domain of PUNJABI_FINAL_ERROR_DOMAINS) {
      expect(present.has(domain), `missing domain ${domain}`).toBe(true);
    }
  });

  it("uses all severity levels and valid audiences", () => {
    const severities = new Set<PunjabiFinalErrorTaxonomyEntry["severity"]>();
    const audiences = new Set<PunjabiFinalErrorTaxonomyEntry["audience"]>();
    for (const entry of punjabiFinalErrorTaxonomy) {
      expect(PUNJABI_FINAL_ERROR_SEVERITIES).toContain(entry.severity);
      severities.add(entry.severity);
      audiences.add(entry.audience);
    }
    for (const severity of PUNJABI_FINAL_ERROR_SEVERITIES) {
      expect(severities.has(severity), `missing severity ${severity}`).toBe(true);
    }
    expect(audiences.has("vi")).toBe(true);
    expect(audiences.has("en")).toBe(true);
    expect(audiences.has("both")).toBe(true);
  });

  it("links each taxonomy entry to remediation and readiness review", () => {
    for (const entry of punjabiFinalErrorTaxonomy) {
      expect(entry.remediationRouteId).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(entry.readinessCheck.length).toBeGreaterThan(8);
      expect(entry.qualityGate.length).toBeGreaterThan(8);
    }
  });

  it("includes final-quality blocking items before scenario or role-play progression", () => {
    const blocking = punjabiFinalErrorTaxonomy.filter((entry) => entry.severity === "blocking");
    expect(blocking.length).toBeGreaterThanOrEqual(4);
    expect(blocking.some((entry) => entry.domain === "script")).toBe(true);
    expect(blocking.some((entry) => entry.domain === "romanization")).toBe(true);
    expect(blocking.some((entry) => entry.domain === "register")).toBe(true);
    expect(blocking.some((entry) => entry.domain === "canada-practical-communication-gaps")).toBe(true);
  });

  it("includes Canada-practical communication gap examples", () => {
    const canadaEntries = punjabiFinalErrorTaxonomy.filter((entry) => entry.canadaPractical);
    expect(canadaEntries.length).toBeGreaterThanOrEqual(7);
    expect(canadaEntries.some((entry) => entry.model_pa.includes("ਲਾਇਬ੍ਰੇਰੀ"))).toBe(true);
    expect(canadaEntries.some((entry) => entry.model_pa.includes("ਅਰਜ਼ੀ"))).toBe(true);
    expect(canadaEntries.some((entry) => entry.model_pa.includes("ਅਪਾਇੰਟਮੈਂਟ"))).toBe(true);
  });
});

describe("punjabiFinalErrorTaxonomy - guardrails", () => {
  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const serialized = `${PUNJABI_FINAL_ERROR_TAXONOMY_NOTICE} ${JSON.stringify(
      punjabiFinalErrorTaxonomy,
    )}`.toLowerCase();
    expect(serialized).toContain("shahmukhi");
    expect(serialized).toContain("awareness");
    expect(serialized).toContain("not a full course");
  });

  it("does not claim native review, official placement, or A11 integration", () => {
    const notice = PUNJABI_FINAL_ERROR_TAXONOMY_NOTICE.toLowerCase();
    expect(notice).toContain("wave 17 final error taxonomy only");
    expect(notice).toContain("not a11 integration");
    expect(notice).toContain("study support only");
    expect(notice).toContain("not official placement");
    expect(notice).toContain("native review deferred");
    expect(notice).not.toContain("native reviewed");
  });
});
