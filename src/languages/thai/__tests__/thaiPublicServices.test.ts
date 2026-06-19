// src/languages/thai/__tests__/thaiPublicServices.test.ts
//
// Structural + content guards for the Thai public-services / bureaucracy pack.
// Validates the WAVE5 brief: 40–80 items, all required topics, Thai script +
// romanization, Vietnamese + English meanings, and a usage note in both
// languages on every item.

import { describe, it, expect } from "vitest";
import {
  thaiPublicServices,
  type ThaiPublicServiceTopic,
} from "../publicServices";

const THAI_RE = /[฀-๿]/;
const LATIN_RE = /[a-z]/i;

const REQUIRED_TOPICS: ThaiPublicServiceTopic[] = [
  "forms",
  "appointment",
  "queue",
  "id_passport",
  "immigration_office",
  "bank",
  "phone_plan",
  "address",
  "document_copies",
  "interpreter",
  "clarification",
];

describe("Thai public services — batch", () => {
  it("has 40–80 items", () => {
    expect(thaiPublicServices.length).toBeGreaterThanOrEqual(40);
    expect(thaiPublicServices.length).toBeLessThanOrEqual(80);
  });

  it("has unique ids", () => {
    const ids = thaiPublicServices.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("covers every required topic at least once", () => {
    const seen = new Set(thaiPublicServices.map((i) => i.topic));
    for (const t of REQUIRED_TOPICS) {
      expect(seen.has(t)).toBe(true);
    }
  });
});

describe("Thai public services — per-item content", () => {
  for (const item of thaiPublicServices) {
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
