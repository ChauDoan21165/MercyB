// src/languages/thai/__tests__/thaiHousingUtilities.test.ts
//
// Structural + content guards for the Thai housing & utilities pack.
// Validates the WAVE6 brief: 50–100 items, all required topics, Thai script +
// romanization, Vietnamese + English meanings, and a usage note in both
// languages on every item.

import { describe, it, expect } from "vitest";
import {
  thaiHousingUtilities,
  type ThaiHousingTopic,
} from "../housingUtilities";

const THAI_RE = /[฀-๿]/;
const LATIN_RE = /[a-z]/i;

const REQUIRED_TOPICS: ThaiHousingTopic[] = [
  "rent",
  "lease",
  "deposit",
  "repair",
  "water",
  "electricity",
  "internet",
  "noise",
  "neighbor",
  "landlord",
  "moving",
  "address",
  "delivery",
];

describe("Thai housing & utilities — batch", () => {
  it("has 50–100 items", () => {
    expect(thaiHousingUtilities.length).toBeGreaterThanOrEqual(50);
    expect(thaiHousingUtilities.length).toBeLessThanOrEqual(100);
  });

  it("has unique ids", () => {
    const ids = thaiHousingUtilities.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("covers every required topic at least once", () => {
    const seen = new Set(thaiHousingUtilities.map((i) => i.topic));
    for (const t of REQUIRED_TOPICS) {
      expect(seen.has(t)).toBe(true);
    }
  });
});

describe("Thai housing & utilities — per-item content", () => {
  for (const item of thaiHousingUtilities) {
    describe(item.id, () => {
      it("has Thai script + romanization", () => {
        expect(THAI_RE.test(item.th)).toBe(true);
        expect(LATIN_RE.test(item.rtgs)).toBe(true);
      });

      it("has Vietnamese + English meanings", () => {
        expect(item.en.trim().length).toBeGreaterThan(0);
        expect(item.vi.trim().length).toBeGreaterThan(0);
      });

      it("has a usage note in vi + en", () => {
        expect(item.note_en.trim().length).toBeGreaterThan(0);
        expect(item.note_vi.trim().length).toBeGreaterThan(0);
      });
    });
  }
});
