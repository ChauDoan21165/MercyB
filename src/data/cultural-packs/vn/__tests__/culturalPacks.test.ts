// src/data/cultural-packs/vn/__tests__/culturalPacks.test.ts
//
// Step 10 — locks shape + content invariants for the eight shipped
// VN cultural packs. The Zod schema does the heavy lifting on shape;
// these tests catch regressions on counts, IDs, and the small set of
// content rules the brief calls out (no streak shaming, no exoticism,
// regional variations mentioned where relevant, etc.).

import { describe, it, expect } from "vitest";

import {
  CULTURAL_PACK_IDS,
  VN_CULTURAL_PACKS,
  getVnCulturalPack,
  isCulturalPackId,
  type CulturalPack,
} from "../culturalPackSchema";

describe("CULTURAL_PACK_IDS", () => {
  it("ships exactly 8 packs", () => {
    expect(CULTURAL_PACK_IDS.length).toBe(8);
  });

  it("uses lowercase-kebab IDs only", () => {
    for (const id of CULTURAL_PACK_IDS) {
      expect(id).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it("contains the original seven pack ids from the Step 10 brief", () => {
    const required = [
      "tet-lunar-new-year",
      "family-titles",
      "weddings",
      "funerals",
      "ancestor-veneration",
      "pho-and-food",
      "doctor-translator",
    ];
    for (const id of required) {
      expect(CULTURAL_PACK_IDS).toContain(id);
    }
  });

  it("contains the daily-life pack added in the option-B expansion", () => {
    expect(CULTURAL_PACK_IDS).toContain("daily-life");
  });
});

describe("VN_CULTURAL_PACKS shape", () => {
  it("has one pack per id", () => {
    for (const id of CULTURAL_PACK_IDS) {
      const pack = VN_CULTURAL_PACKS[id];
      expect(pack, `pack missing for ${id}`).toBeDefined();
      expect(pack.id).toBe(id);
    }
  });

  it("every pack has 15-25 phrases", () => {
    for (const id of CULTURAL_PACK_IDS) {
      const pack = VN_CULTURAL_PACKS[id];
      expect(pack.phrases.length, `${id} phrase count`).toBeGreaterThanOrEqual(15);
      expect(pack.phrases.length, `${id} phrase count`).toBeLessThanOrEqual(25);
    }
  });

  it("every pack has 2-3 dialogues", () => {
    for (const id of CULTURAL_PACK_IDS) {
      const pack = VN_CULTURAL_PACKS[id];
      expect(pack.dialogues.length, `${id} dialogue count`).toBeGreaterThanOrEqual(2);
      expect(pack.dialogues.length, `${id} dialogue count`).toBeLessThanOrEqual(3);
    }
  });

  it("every pack carries a non-empty bilingual title + summary", () => {
    for (const id of CULTURAL_PACK_IDS) {
      const pack = VN_CULTURAL_PACKS[id];
      expect(pack.title_vn.length).toBeGreaterThan(0);
      expect(pack.title_en.length).toBeGreaterThan(0);
      expect(pack.summary_vn.length).toBeGreaterThan(0);
      expect(pack.summary_en.length).toBeGreaterThan(0);
    }
  });

  it("every phrase has all required fields populated", () => {
    for (const id of CULTURAL_PACK_IDS) {
      const pack = VN_CULTURAL_PACKS[id];
      pack.phrases.forEach((p, i) => {
        expect(p.id, `${id}.phrases[${i}].id`).toMatch(/^[a-z0-9-]+$/);
        expect(p.vn_moment.trim().length).toBeGreaterThan(0);
        expect(p.context.trim().length).toBeGreaterThan(0);
        expect(p.english.trim().length).toBeGreaterThan(0);
        expect(p.cultural_note.trim().length).toBeGreaterThan(0);
      });
    }
  });

  it("phrase IDs are unique within each pack", () => {
    for (const id of CULTURAL_PACK_IDS) {
      const pack = VN_CULTURAL_PACKS[id];
      const ids = pack.phrases.map((p) => p.id);
      expect(new Set(ids).size, `${id} duplicate phrase ids`).toBe(ids.length);
    }
  });

  it("every dialogue has at least 2 lines", () => {
    for (const id of CULTURAL_PACK_IDS) {
      const pack = VN_CULTURAL_PACKS[id];
      pack.dialogues.forEach((d, i) => {
        expect(d.lines.length, `${id}.dialogues[${i}] line count`).toBeGreaterThanOrEqual(2);
        expect(d.title.trim().length).toBeGreaterThan(0);
        expect(d.setting.trim().length).toBeGreaterThan(0);
      });
    }
  });
});

describe("Tone guardrails", () => {
  it("funerals + ancestor packs use 'sacred' tone", () => {
    expect(VN_CULTURAL_PACKS["funerals"].tone).toBe("sacred");
    expect(VN_CULTURAL_PACKS["ancestor-veneration"].tone).toBe("sacred");
  });

  it("doctor-translator uses 'practical' tone", () => {
    expect(VN_CULTURAL_PACKS["doctor-translator"].tone).toBe("practical");
  });

  it("Tết and weddings are 'festive'", () => {
    expect(VN_CULTURAL_PACKS["tet-lunar-new-year"].tone).toBe("festive");
    expect(VN_CULTURAL_PACKS["weddings"].tone).toBe("festive");
  });

  it("daily-life pack uses 'practical' tone", () => {
    expect(VN_CULTURAL_PACKS["daily-life"].tone).toBe("practical");
  });
});

describe("Regional notes", () => {
  it("Tết pack mentions both Hà Nội and Sài Gòn customs", () => {
    const note = VN_CULTURAL_PACKS["tet-lunar-new-year"].regional_note;
    expect(note).toMatch(/Hà Nội|Hanoi|Bắc/);
    expect(note).toMatch(/Sài Gòn|Saigon|Nam/);
  });

  it("family-titles pack notes regional variation", () => {
    const note = VN_CULTURAL_PACKS["family-titles"].regional_note;
    expect(note.length).toBeGreaterThan(0);
  });
});

describe("getVnCulturalPack / isCulturalPackId helpers", () => {
  it("returns each shipped pack by id", () => {
    for (const id of CULTURAL_PACK_IDS) {
      const pack = getVnCulturalPack(id);
      expect(pack, `lookup ${id}`).not.toBeNull();
      expect(pack!.id).toBe(id);
    }
  });

  it("returns null for unknown ids", () => {
    expect(getVnCulturalPack("not-a-pack")).toBeNull();
    expect(getVnCulturalPack("")).toBeNull();
  });

  it("isCulturalPackId is a type guard for shipped ids", () => {
    expect(isCulturalPackId("tet-lunar-new-year")).toBe(true);
    expect(isCulturalPackId("family-titles")).toBe(true);
    expect(isCulturalPackId("not-a-pack")).toBe(false);
    expect(isCulturalPackId("")).toBe(false);
  });
});
