/**
 * Vietnamese L1 profile — structural tests.
 *
 * Per dispatch hard rules: assert shape, snake_case discipline, severity
 * vocabulary, uniqueness, needsReview preservation, and parity with the
 * existing vnL1Interference.ts count. No taxonomy authoring; this file
 * only verifies the ingest contract.
 */

import { describe, expect, it } from "vitest";

import { VN_L1_INTERFERENCE_PATTERNS } from "../../../data/placement/vnL1Interference.js";
import {
  vietnameseL1Profile,
  type L1Profile,
} from "../vi.js";

const SEVERITY_VOCAB = new Set(["low", "medium", "high"]);
const SNAKE_RE = /^[a-z][a-z0-9_]*$/;
const CONTAINS_HYPHEN = /-/;
const ALLOWED_SEVERITY_KEYS = new Set([
  "severity",
]);

describe("vietnameseL1Profile — meta", () => {
  it("identifies as the Vietnamese L1 (vi → en)", () => {
    expect(vietnameseL1Profile.meta.nativeLangCode).toBe("vi");
    expect(vietnameseL1Profile.meta.targetLangCode).toBe("en");
  });

  it("declares a semver version", () => {
    expect(vietnameseL1Profile.meta.version).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it("records a last-reviewed date in ISO format", () => {
    expect(vietnameseL1Profile.meta.lastReviewed).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("cites the four taxonomy docs that feed the ingest", () => {
    const cites = vietnameseL1Profile.meta.citations.join("\n");
    expect(cites).toContain("spec.md");
    expect(cites).toContain("vi-grammar.md");
    expect(cites).toContain("vi-writing.md");
    expect(cites).toContain("vn-phoneme-gaps.md");
  });
});

describe("vietnameseL1Profile — interference map (cross-link via PhenomenonId, not duplicated)", () => {
  it("re-exports VN_L1_INTERFERENCE_PATTERNS by reference", () => {
    // Identity check: the profile holds the same array object, not a copy.
    expect(vietnameseL1Profile.interference.patterns).toBe(
      VN_L1_INTERFERENCE_PATTERNS,
    );
  });

  it("matches the count of patterns in vnL1Interference.ts", () => {
    expect(vietnameseL1Profile.interference.patterns.length).toBe(
      VN_L1_INTERFERENCE_PATTERNS.length,
    );
  });

  it("every interference pattern uses snake_case IDs", () => {
    for (const p of vietnameseL1Profile.interference.patterns) {
      expect(p.id).toMatch(SNAKE_RE);
    }
  });

  it("every interference pattern uses the locked severity vocabulary", () => {
    for (const p of vietnameseL1Profile.interference.patterns) {
      expect(SEVERITY_VOCAB.has(p.severity)).toBe(true);
    }
  });
});

describe("vietnameseL1Profile — grammar families", () => {
  const families = vietnameseL1Profile.grammar?.families ?? [];

  it("ships C1's 15 families", () => {
    expect(families.length).toBe(15);
  });

  it("every grammar family id is unique and snake_case", () => {
    const seen = new Set<string>();
    for (const fam of families) {
      expect(fam.id).toMatch(SNAKE_RE);
      expect(fam.id).not.toMatch(CONTAINS_HYPHEN);
      expect(seen.has(fam.id)).toBe(false);
      seen.add(fam.id);
    }
  });

  it("every grammar family carries the locked severity vocabulary", () => {
    for (const fam of families) {
      expect(SEVERITY_VOCAB.has(fam.severity)).toBe(true);
    }
  });

  it("every grammar family carries a non-empty bilingual description", () => {
    for (const fam of families) {
      expect(fam.descriptionEn.length).toBeGreaterThan(0);
      expect(fam.descriptionVi.length).toBeGreaterThan(0);
    }
  });

  it("every grammar family carries at least 8 paired examples", () => {
    for (const fam of families) {
      expect(fam.examples.length).toBeGreaterThanOrEqual(8);
      for (const ex of fam.examples) {
        expect(ex.learnerProduces.length).toBeGreaterThan(0);
        expect(ex.targetForm.length).toBeGreaterThan(0);
      }
    }
  });

  it("ruleTags only reference detector tags present in the runtime pack", () => {
    const validTags = new Set(
      vietnameseL1Profile.grammar?.rulePack.explanations.map((e) => e.tag) ?? [],
    );
    for (const fam of families) {
      for (const t of fam.ruleTags ?? []) {
        expect(validTags.has(t)).toBe(true);
      }
    }
  });
});

describe("vietnameseL1Profile — writing patterns", () => {
  const patterns = vietnameseL1Profile.writing?.patterns ?? [];

  it("ships C2's 12 writing patterns", () => {
    expect(patterns.length).toBe(12);
  });

  it("every writing pattern id is unique and snake_case", () => {
    const seen = new Set<string>();
    for (const p of patterns) {
      expect(p.id).toMatch(SNAKE_RE);
      expect(p.id).not.toMatch(CONTAINS_HYPHEN);
      expect(seen.has(p.id)).toBe(false);
      seen.add(p.id);
    }
  });

  it("every writing pattern carries the locked severity vocabulary", () => {
    for (const p of patterns) {
      expect(SEVERITY_VOCAB.has(p.severity)).toBe(true);
    }
  });

  it("preserves needsReview: true on the 10 C2-marked patterns", () => {
    const flagged = patterns.filter((p) => p.needsReview === true);
    // C2 doc has 10 needsReview markers in sections §2, §4, §5, §6, §8, §10, §11 (×3), §12.
    // The §11 doc has 3 inline/blockquote markers under one family (vi_write_punctuation) →
    // collapses to 1 family-level flag. Same for §12 (multiple markers on one family).
    // Family-level flag count: 8 of 12 patterns.
    expect(flagged.length).toBeGreaterThanOrEqual(7);
    expect(flagged.length).toBeLessThanOrEqual(10);
  });

  it("every writing pattern carries a non-empty bilingual name + description", () => {
    for (const p of patterns) {
      expect(p.name.en.length).toBeGreaterThan(0);
      expect(p.name.vi.length).toBeGreaterThan(0);
      expect(p.description.en.length).toBeGreaterThan(0);
      expect(p.description.vi.length).toBeGreaterThan(0);
    }
  });

  it("every writing pattern lists at least one CEFR band + one genre", () => {
    for (const p of patterns) {
      expect(p.cefr.length).toBeGreaterThan(0);
      expect(p.genres.length).toBeGreaterThan(0);
    }
  });
});

describe("vietnameseL1Profile — phonology gaps", () => {
  const gaps = vietnameseL1Profile.phonology?.gaps ?? [];

  it("ships C3's 6 audit gap categories", () => {
    expect(gaps.length).toBe(6);
  });

  it("every phonology gap id is unique and snake_case", () => {
    const seen = new Set<string>();
    for (const g of gaps) {
      expect(g.id).toMatch(SNAKE_RE);
      expect(g.id).not.toMatch(CONTAINS_HYPHEN);
      expect(seen.has(g.id)).toBe(false);
      seen.add(g.id);
    }
  });
});

describe("vietnameseL1Profile — namespace discipline (no kebab-case anywhere)", () => {
  it("no string field in grammar families uses kebab-case for IDs/tags/phenomena", () => {
    const families = vietnameseL1Profile.grammar?.families ?? [];
    for (const fam of families) {
      expect(fam.id).not.toMatch(CONTAINS_HYPHEN);
      if (fam.phenomenon) expect(fam.phenomenon).not.toMatch(CONTAINS_HYPHEN);
      for (const t of fam.ruleTags ?? []) {
        expect(t).not.toMatch(CONTAINS_HYPHEN);
      }
    }
  });

  it("no string field in writing patterns uses kebab-case for IDs/phenomena/genres", () => {
    const patterns = vietnameseL1Profile.writing?.patterns ?? [];
    for (const p of patterns) {
      expect(p.id).not.toMatch(CONTAINS_HYPHEN);
      if (p.phenomenon) expect(p.phenomenon).not.toMatch(CONTAINS_HYPHEN);
      for (const g of p.genres) {
        expect(g).not.toMatch(CONTAINS_HYPHEN);
      }
      // category is a fixed spec enum that includes "paragraph-shape" — exempt
      // by design (the category field is from the spec, not a profile-ingested
      // tag namespace). Documented in spec §2 WritingPattern.category.
    }
  });

  it("no phonology gap id uses kebab-case", () => {
    const gaps = vietnameseL1Profile.phonology?.gaps ?? [];
    for (const g of gaps) {
      expect(g.id).not.toMatch(CONTAINS_HYPHEN);
    }
  });
});

describe("vietnameseL1Profile — no 'med' severity anywhere", () => {
  function* allSeverityValues(profile: L1Profile): Generator<string> {
    for (const p of profile.interference.patterns) yield p.severity;
    for (const f of profile.grammar?.families ?? []) yield f.severity;
    for (const w of profile.writing?.patterns ?? []) yield w.severity;
  }

  it("uses only 'low' | 'medium' | 'high' — never 'med'", () => {
    for (const s of allSeverityValues(vietnameseL1Profile)) {
      expect(s).not.toBe("med");
      expect(SEVERITY_VOCAB.has(s)).toBe(true);
    }
  });
});

describe("vietnameseL1Profile — phonology layer is re-exported by reference", () => {
  it("includes the four problem-pair drill sets from vn-phoneme-map.ts", () => {
    const pp = vietnameseL1Profile.phonology?.problemPairs ?? {};
    expect(Object.keys(pp)).toEqual(
      expect.arrayContaining(["th_t", "r_l", "ed_endings", "s_plurals"]),
    );
  });

  it("carries the runtime rule pack on the grammar layer", () => {
    expect(vietnameseL1Profile.grammar?.rulePack.l1Code).toBe("vi");
  });
});
