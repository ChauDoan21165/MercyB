// src/lib/weakness/__tests__/weakness-catalog.test.ts
//
// Validates the weakness catalog invariants. Mirror of the pattern used
// by src/lib/placement/__tests__/cefrToRoom.test.ts — reads public/data
// from disk at test time so CI fails loudly if a mapped room is renamed
// or removed.

import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  ALL_WEAKNESS_TAGS,
  WEAKNESS_CATALOG,
  getWeaknessEntry,
  isKnownWeaknessTag,
  resolveWeaknessTags,
} from "../weakness-catalog";

const PUBLIC_DATA = resolve(__dirname, "../../../../public/data");

describe("WEAKNESS_CATALOG shape", () => {
  it("contains the expected total count (65)", () => {
    expect(ALL_WEAKNESS_TAGS.length).toBe(65);
  });

  it("exposes every tag in ALL_WEAKNESS_TAGS", () => {
    const catalogKeys = Object.keys(WEAKNESS_CATALOG).sort();
    const allTags = [...ALL_WEAKNESS_TAGS].sort();
    expect(catalogKeys).toEqual(allTags);
  });

  it("has no duplicate tags", () => {
    const uniq = new Set(ALL_WEAKNESS_TAGS);
    expect(uniq.size).toBe(ALL_WEAKNESS_TAGS.length);
  });

  it("has non-empty bilingual strings + examples for every tag", () => {
    for (const tag of ALL_WEAKNESS_TAGS) {
      const entry = WEAKNESS_CATALOG[tag];
      expect(entry.shortLabel.en.trim().length).toBeGreaterThan(0);
      expect(entry.shortLabel.vi.trim().length).toBeGreaterThan(0);
      expect(entry.longDescription.en.trim().length).toBeGreaterThan(0);
      expect(entry.longDescription.vi.trim().length).toBeGreaterThan(0);
      expect(entry.exampleWrong.trim().length).toBeGreaterThan(0);
      expect(entry.exampleRight.trim().length).toBeGreaterThan(0);
    }
  });

  it("keeps entry.tag in sync with its record key", () => {
    for (const tag of ALL_WEAKNESS_TAGS) {
      expect(WEAKNESS_CATALOG[tag].tag).toBe(tag);
    }
  });

  it("linkedRoomId is either null or a non-empty string", () => {
    for (const tag of ALL_WEAKNESS_TAGS) {
      const id = WEAKNESS_CATALOG[tag].linkedRoomId;
      if (id !== null) {
        expect(typeof id).toBe("string");
        expect(id.trim().length).toBeGreaterThan(0);
      }
    }
  });
});

describe("mapped rooms exist on disk", () => {
  // Clone of cefrToRoom.test.ts intent: fail CI if a mapped room is
  // renamed. Entries with linkedRoomId === null are intentional
  // "no existing room yet" markers and are skipped.
  for (const tag of ALL_WEAKNESS_TAGS) {
    const entry = WEAKNESS_CATALOG[tag];
    if (entry.linkedRoomId === null) continue;
    it(`${tag} → ${entry.linkedRoomId}.json exists`, () => {
      const path = resolve(PUBLIC_DATA, `${entry.linkedRoomId}.json`);
      expect(existsSync(path)).toBe(true);

      // Defensive: the file should parse as JSON. If it's corrupt, the
      // Home card would navigate to a room that crashes — catch here.
      const raw = readFileSync(path, "utf8");
      expect(() => JSON.parse(raw)).not.toThrow();
    });
  }
});

describe("isKnownWeaknessTag", () => {
  it("returns true for every known tag", () => {
    for (const tag of ALL_WEAKNESS_TAGS) {
      expect(isKnownWeaknessTag(tag)).toBe(true);
    }
  });

  it("returns false for unknown strings", () => {
    expect(isKnownWeaknessTag("")).toBe(false);
    expect(isKnownWeaknessTag("vi_l1_made_up")).toBe(false);
    expect(isKnownWeaknessTag("anything")).toBe(false);
  });

  it("returns false for non-string values", () => {
    expect(isKnownWeaknessTag(null)).toBe(false);
    expect(isKnownWeaknessTag(undefined)).toBe(false);
    expect(isKnownWeaknessTag(42)).toBe(false);
    expect(isKnownWeaknessTag({})).toBe(false);
    expect(isKnownWeaknessTag([])).toBe(false);
  });
});

describe("getWeaknessEntry", () => {
  it("returns the matching entry for each known tag", () => {
    for (const tag of ALL_WEAKNESS_TAGS) {
      const entry = getWeaknessEntry(tag);
      expect(entry).not.toBeNull();
      expect(entry!.tag).toBe(tag);
    }
  });

  it("returns null for unknown tags", () => {
    expect(getWeaknessEntry("")).toBeNull();
    expect(getWeaknessEntry("vi_l1_ghost_tag")).toBeNull();
  });
});

describe("resolveWeaknessTags", () => {
  it("preserves input order", () => {
    const resolved = resolveWeaknessTags([
      "vi_l1_past_ed",
      "vi_l1_3rd_person_s",
      "vi_l1_plural_s",
    ]);
    expect(resolved.map((e) => e.tag)).toEqual([
      "vi_l1_past_ed",
      "vi_l1_3rd_person_s",
      "vi_l1_plural_s",
    ]);
  });

  it("drops unknown tags without crashing", () => {
    const resolved = resolveWeaknessTags([
      "vi_l1_3rd_person_s",
      "vi_l1_unknown_future",
      "vi_l1_past_ed",
    ]);
    expect(resolved.map((e) => e.tag)).toEqual([
      "vi_l1_3rd_person_s",
      "vi_l1_past_ed",
    ]);
  });

  it("deduplicates repeat tags", () => {
    const resolved = resolveWeaknessTags([
      "vi_l1_plural_s",
      "vi_l1_plural_s",
      "vi_l1_3rd_person_s",
    ]);
    expect(resolved.map((e) => e.tag)).toEqual([
      "vi_l1_plural_s",
      "vi_l1_3rd_person_s",
    ]);
  });

  it("returns empty array for empty input", () => {
    expect(resolveWeaknessTags([])).toEqual([]);
  });
});
