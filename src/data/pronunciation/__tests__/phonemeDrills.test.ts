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
  it("ships the priority list of 25 packs", () => {
    expect(PHONEME_DRILL_PACKS.length).toBe(25);
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
      // phoneme_ipa is required for pack_kind === 'phoneme' (default).
      // Stress / intonation packs may omit it — the unit they teach
      // isn't a single phoneme.
      const kind = pack.pack_kind ?? "phoneme";
      if (kind === "phoneme") {
        expect(pack.phoneme_ipa, pack.slug).toBeTruthy();
        expect(pack.phoneme_ipa!.length, pack.slug).toBeGreaterThan(0);
      }
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

// ── pack_kind discriminator + stress pack ───────────────────────────────

describe("pack_kind discriminator", () => {
  it("defaults to 'phoneme' for the 24 original packs (kind omitted)", () => {
    const phonemePacks = PHONEME_DRILL_PACKS.filter(
      (p) => (p.pack_kind ?? "phoneme") === "phoneme",
    );
    expect(phonemePacks.length).toBe(24);
  });

  it("ships exactly one stress pack", () => {
    const stressPacks = PHONEME_DRILL_PACKS.filter(
      (p) => p.pack_kind === "stress",
    );
    expect(stressPacks.length).toBe(1);
    expect(stressPacks[0].slug).toBe("stress_2_3_syllable");
  });

  it("the stress pack is reachable via getDrillPackBySlug", () => {
    const pack = getDrillPackBySlug("stress_2_3_syllable");
    expect(pack).not.toBeNull();
    expect(pack?.pack_kind).toBe("stress");
    expect(pack?.sentences.length).toBe(10);
  });

  it("the stress pack omits phoneme_ipa (unit isn't a phoneme)", () => {
    const pack = getDrillPackBySlug("stress_2_3_syllable");
    expect(pack?.phoneme_ipa).toBeUndefined();
  });
});
