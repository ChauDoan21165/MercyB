import { describe, expect, it } from "vitest";

import * as thaiB2Core from "../lessons-b2-core";

const serialized = JSON.stringify(thaiB2Core);

function collectArrayItems(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;

  if (value && typeof value === "object") {
    return Object.values(value as Record<string, unknown>).flatMap((child) =>
      Array.isArray(child) ? child : [],
    );
  }

  return [];
}

const exportedItems = Object.values(thaiB2Core).flatMap(collectArrayItems);

describe("Thai B2 core lesson batch", () => {
  it("exports substantial app-ready Thai B2 learning data", () => {
    expect(Object.keys(thaiB2Core).length).toBeGreaterThan(0);
    expect(serialized.length).toBeGreaterThan(3000);
    expect(exportedItems.length).toBeGreaterThanOrEqual(8);
  });

  it("includes Thai script content", () => {
    expect(/[ก-๛]/u.test(serialized)).toBe(true);
  });

  it("includes bilingual learner support for Vietnamese and English users", () => {
    expect(/Vietnamese|Tiếng Việt|tiengViet|vietnamese|explanationVi|viExplanation|người Việt/i.test(serialized)).toBe(true);
    expect(/English|Tiếng Anh|tiengAnh|english|explanationEn|enExplanation/i.test(serialized)).toBe(true);
  });

  it("does not claim native certification or pronunciation scoring", () => {
    expect(serialized).not.toMatch(/native[- ](?:certified|verified|approved)|verified by native|native speaker approved|pronunciation score|Azure/i);
  });
});
