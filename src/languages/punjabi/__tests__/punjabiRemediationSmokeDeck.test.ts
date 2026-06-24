import { describe, expect, it } from "vitest";

import {
  PUNJABI_REMEDIATION_SMOKE_DECK_NOTICE,
  PUNJABI_SMOKE_DECK_FOCI,
  PUNJABI_SMOKE_DECK_RESULTS,
  punjabiRemediationSmokeDeck,
  type PunjabiRemediationSmokeDeckItem,
} from "@/languages/punjabi/remediationSmokeDeck";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS = /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiRemediationSmokeDeck - size and identity", () => {
  it("keeps a compact useful smoke deck", () => {
    expect(punjabiRemediationSmokeDeck.length).toBeGreaterThanOrEqual(14);
    expect(punjabiRemediationSmokeDeck.length).toBeLessThanOrEqual(40);
  });

  it("has unique smoke ids", () => {
    const ids = punjabiRemediationSmokeDeck.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^smoke-[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiRemediationSmokeDeck - app fields", () => {
  const requiredText: (keyof PunjabiRemediationSmokeDeckItem)[] = [
    "prompt_vi",
    "prompt_en",
    "check_pa",
    "check_en",
    "passSignal",
    "failSignal",
    "remediationRouteId",
    "qaNote_vi",
    "qaNote_en",
    "commonTrap",
  ];

  it("fills all smoke-check fields", () => {
    for (const item of punjabiRemediationSmokeDeck) {
      for (const key of requiredText) {
        const value = item[key];
        expect(typeof value, `${item.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${item.id}.${key}`).toBeGreaterThan(0);
      }
    }
  });

  it("uses Gurmukhi primary checks with romanization only as support", () => {
    for (const item of punjabiRemediationSmokeDeck) {
      expect(GURMUKHI_SCRIPT.test(item.check_pa), `${item.id}.check_pa`).toBe(true);
      expect(item.check_pa).not.toBe(item.check_roman);
    }
  });

  it("keeps Vietnamese and English QA guidance distinct", () => {
    for (const item of punjabiRemediationSmokeDeck) {
      expect(item.prompt_vi).not.toBe(item.prompt_en);
      expect(item.qaNote_vi).not.toBe(item.qaNote_en);
      expect(
        VIETNAMESE_MARKS.test(item.prompt_vi) || VIETNAMESE_MARKS.test(item.qaNote_vi),
        `${item.id} should include Vietnamese text`,
      ).toBe(true);
    }
  });
});

describe("punjabiRemediationSmokeDeck - coverage and readiness", () => {
  it("covers every requested smoke-deck focus", () => {
    const present = new Set<PunjabiRemediationSmokeDeckItem["focus"]>();
    for (const item of punjabiRemediationSmokeDeck) {
      expect(PUNJABI_SMOKE_DECK_FOCI).toContain(item.focus);
      present.add(item.focus);
    }
    for (const focus of PUNJABI_SMOKE_DECK_FOCI) {
      expect(present.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("uses all smoke outcomes and learner audiences", () => {
    const results = new Set<PunjabiRemediationSmokeDeckItem["expectedResult"]>();
    const audiences = new Set<PunjabiRemediationSmokeDeckItem["audience"]>();
    for (const item of punjabiRemediationSmokeDeck) {
      expect(PUNJABI_SMOKE_DECK_RESULTS).toContain(item.expectedResult);
      results.add(item.expectedResult);
      audiences.add(item.audience);
    }
    for (const result of PUNJABI_SMOKE_DECK_RESULTS) {
      expect(results.has(result), `missing result ${result}`).toBe(true);
    }
    expect(audiences.has("vi")).toBe(true);
    expect(audiences.has("en")).toBe(true);
    expect(audiences.has("both")).toBe(true);
  });

  it("links each smoke check to remediation routing", () => {
    for (const item of punjabiRemediationSmokeDeck) {
      expect(item.remediationRouteId).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(item.passSignal.length).toBeGreaterThan(8);
      expect(item.failSignal.length).toBeGreaterThan(8);
    }
  });

  it("includes Canada-practical final QA examples", () => {
    const canadaItems = punjabiRemediationSmokeDeck.filter((item) => item.canadaPractical);
    expect(canadaItems.length).toBeGreaterThanOrEqual(7);
    expect(canadaItems.some((item) => item.check_pa.includes("ਲਾਇਬ੍ਰੇਰੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.check_pa.includes("ਅਰਜ਼ੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.check_pa.includes("ਅਪਾਇੰਟਮੈਂਟ"))).toBe(true);
  });
});

describe("punjabiRemediationSmokeDeck - guardrails", () => {
  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const serialized = `${PUNJABI_REMEDIATION_SMOKE_DECK_NOTICE} ${JSON.stringify(
      punjabiRemediationSmokeDeck,
    )}`.toLowerCase();
    expect(serialized).toContain("shahmukhi");
    expect(serialized).toContain("awareness");
    expect(serialized).toContain("not a full course");
  });

  it("does not claim native review, official placement, or A11 integration", () => {
    const notice = PUNJABI_REMEDIATION_SMOKE_DECK_NOTICE.toLowerCase();
    expect(notice).toContain("wave 19 smoke deck only");
    expect(notice).toContain("not a11 integration");
    expect(notice).toContain("study support only");
    expect(notice).toContain("not official placement");
    expect(notice).toContain("native review deferred");
    expect(notice).not.toContain("native reviewed");
  });
});
