import { describe, expect, it } from "vitest";

import {
  PHONEME_DRILL_PACKS,
  getDrillPackBySlug,
  getDrillPackForPhoneme,
  listDrillSlugs,
  type DrillSentence,
  type PhonemeDrillPack,
} from "../phoneme-drills";

// ── Registry shape ───────────────────────────────────────────────────────

describe("phoneme drill packs — registry", () => {
  it("ships the priority list of 24 packs", () => {
    expect(PHONEME_DRILL_PACKS.length).toBe(24);
  });

  it("has unique slugs across all packs", () => {
    const slugs = listDrillSlugs();
    const set = new Set(slugs);
    expect(set.size).toBe(slugs.length);
  });

  it("uses ASCII-safe slugs (route-safe)", () => {
    for (const slug of listDrillSlugs()) {
      // ASCII letters, digits, underscore. No diacritics, no IPA.
      expect(slug).toMatch(/^[a-z0-9_]+$/);
    }
  });
});

// ── Per-pack invariants ─────────────────────────────────────────────────

describe.each(PHONEME_DRILL_PACKS as readonly PhonemeDrillPack[])(
  "drill pack: %s",
  (pack) => {
    it("has exactly 10 sentences", () => {
      expect(pack.sentences.length).toBe(10);
    });

    it("has bilingual articulation tip (VI + EN)", () => {
      expect(pack.articulation_tip_vi.length).toBeGreaterThan(20);
      expect(pack.articulation_tip_en.length).toBeGreaterThan(20);
    });

    it("ships at least one VN substitution insight", () => {
      expect(pack.common_vn_substitutions.length).toBeGreaterThanOrEqual(1);
      for (const sub of pack.common_vn_substitutions) {
        expect(sub.wrong_ipa.length).toBeGreaterThan(0);
        expect(sub.why_vi.length).toBeGreaterThan(20);
      }
    });

    it("has bilingual labels", () => {
      expect(pack.phoneme_label_vi.length).toBeGreaterThan(0);
      expect(pack.phoneme_label_en.length).toBeGreaterThan(0);
      expect(pack.phoneme_ipa.length).toBeGreaterThan(0);
    });

    it("each sentence has bilingual text + at least one target word index", () => {
      for (const s of pack.sentences as readonly DrillSentence[]) {
        expect(s.sentence_en.length).toBeGreaterThan(0);
        expect(s.sentence_vi.length).toBeGreaterThan(0);
        expect(s.target_word_indices.length).toBeGreaterThanOrEqual(1);
      }
    });

    it("target_word_indices stay within the sentence's word range", () => {
      for (const s of pack.sentences as readonly DrillSentence[]) {
        const wordCount = s.sentence_en.split(/\s+/).length;
        for (const idx of s.target_word_indices) {
          expect(idx).toBeGreaterThanOrEqual(0);
          expect(idx).toBeLessThan(wordCount);
        }
      }
    });

    it("uses canonical_phoneme keys that are non-empty lowercase ASCII", () => {
      // Note: the heatmap reports the raw canonical-phoneme keys
      // emitted by `canonicalizePhoneme`, which is a SUPERSET of the
      // 32-symbol CANONICAL_PHONEMES list (Azure can return e.g. "v",
      // "g", "h" even though those aren't in the canonical bar-chart
      // ordering). So we only assert shape, not membership.
      expect(pack.canonical_phonemes.length).toBeGreaterThanOrEqual(1);
      for (const ck of pack.canonical_phonemes) {
        expect(ck.length).toBeGreaterThan(0);
        expect(ck).toMatch(/^[a-z]+$/);
      }
    });
  },
);

// ── Lookup helpers ──────────────────────────────────────────────────────

describe("getDrillPackBySlug", () => {
  it("returns the pack for a known slug", () => {
    const th = getDrillPackBySlug("th");
    expect(th).not.toBeNull();
    expect(th?.phoneme_ipa).toBe("/θ/");
  });

  it("returns null for an unknown slug", () => {
    expect(getDrillPackBySlug("xyz")).toBeNull();
  });
});

describe("getDrillPackForPhoneme", () => {
  it("maps a canonical key to the covering pack", () => {
    const pack = getDrillPackForPhoneme("th");
    expect(pack?.slug).toBe("th");
  });

  it("maps both halves of a pair pack to the same pack", () => {
    const ih = getDrillPackForPhoneme("ih");
    const iy = getDrillPackForPhoneme("iy");
    expect(ih?.slug).toBe("ih_iy");
    expect(iy?.slug).toBe("ih_iy");
  });

  it("returns null when no pack covers the phoneme", () => {
    // We don't ship a pack for an obscure or unmapped phoneme.
    expect(getDrillPackForPhoneme("zzz")).toBeNull();
  });
});
