// src/lib/founder/__tests__/founderContent.test.ts

import { describe, expect, it } from "vitest";

import {
  FOUNDER_MILESTONES,
  FOUNDER_QUOTES,
  FOUNDER_STRUGGLES,
  quotesForContext,
} from "../founderContent";

const VALID_CONTEXTS = [
  "pricing",
  "blog-footer",
  "landing",
  "onboarding",
  "general",
];

describe("FOUNDER_QUOTES", () => {
  it("ships at least 10 quotes", () => {
    expect(FOUNDER_QUOTES.length).toBeGreaterThanOrEqual(10);
  });

  it("each quote is bilingual + valid context", () => {
    for (const q of FOUNDER_QUOTES) {
      expect(q.id.trim().length).toBeGreaterThan(0);
      expect(q.vi.trim().length).toBeGreaterThan(0);
      expect(q.en.trim().length).toBeGreaterThan(0);
      expect(VALID_CONTEXTS).toContain(q.context);
    }
  });

  it("quote ids are unique", () => {
    const seen = new Set<string>();
    for (const q of FOUNDER_QUOTES) {
      expect(seen.has(q.id)).toBe(false);
      seen.add(q.id);
    }
  });

  it("VN and EN strings are not byte-identical (avoids accidental missing translation)", () => {
    for (const q of FOUNDER_QUOTES) {
      expect(q.vi).not.toBe(q.en);
    }
  });
});

describe("quotesForContext fallback", () => {
  it("returns at least one quote for every valid context", () => {
    for (const ctx of ["pricing", "blog-footer", "landing", "onboarding", "general"] as const) {
      expect(quotesForContext(ctx).length).toBeGreaterThan(0);
    }
  });

  it("includes 'general' quotes in every non-general context", () => {
    const generalIds = new Set(
      FOUNDER_QUOTES.filter((q) => q.context === "general").map((q) => q.id),
    );
    const pricingPool = quotesForContext("pricing").map((q) => q.id);
    for (const id of generalIds) {
      expect(pricingPool).toContain(id);
    }
  });
});

describe("FOUNDER_MILESTONES", () => {
  it("ships at least 5 milestones", () => {
    expect(FOUNDER_MILESTONES.length).toBeGreaterThanOrEqual(5);
  });

  it("each milestone is bilingual on every text field", () => {
    for (const m of FOUNDER_MILESTONES) {
      expect(m.id.trim().length).toBeGreaterThan(0);
      expect(m.when_vi.trim().length).toBeGreaterThan(0);
      expect(m.when_en.trim().length).toBeGreaterThan(0);
      expect(m.vi.trim().length).toBeGreaterThan(0);
      expect(m.en.trim().length).toBeGreaterThan(0);
    }
  });

  it("milestone ids are unique", () => {
    const seen = new Set<string>();
    for (const m of FOUNDER_MILESTONES) {
      expect(seen.has(m.id)).toBe(false);
      seen.add(m.id);
    }
  });

  it("does NOT invent year-specific dates (no 4-digit years in when_* labels)", () => {
    // The brief locks us to publicly-known beats. Specific years
    // (e.g. 2018, 2022) are NOT yet documented and shouldn't be
    // introduced here. The 'when' labels stay relative.
    for (const m of FOUNDER_MILESTONES) {
      expect(m.when_vi).not.toMatch(/\b(19|20)\d{2}\b/);
      expect(m.when_en).not.toMatch(/\b(19|20)\d{2}\b/);
    }
  });
});

describe("FOUNDER_STRUGGLES", () => {
  it("ships at least 5 vignettes", () => {
    expect(FOUNDER_STRUGGLES.length).toBeGreaterThanOrEqual(5);
  });

  it("each vignette is fully bilingual + has both title + body", () => {
    for (const s of FOUNDER_STRUGGLES) {
      expect(s.id.trim().length).toBeGreaterThan(0);
      expect(s.title_vi.trim().length).toBeGreaterThan(0);
      expect(s.title_en.trim().length).toBeGreaterThan(0);
      expect(s.vi.trim().length).toBeGreaterThan(20);
      expect(s.en.trim().length).toBeGreaterThan(20);
    }
  });

  it("includes the canonical 'i-am-go' beat (anchors the about page)", () => {
    const ids = FOUNDER_STRUGGLES.map((s) => s.id);
    expect(ids).toContain("i-am-go");
  });

  it("any l1_tag is a valid vi_l1_* prefix", () => {
    for (const s of FOUNDER_STRUGGLES) {
      if (s.l1_tag) {
        expect(s.l1_tag).toMatch(/^vi_l1_/);
      }
    }
  });
});
