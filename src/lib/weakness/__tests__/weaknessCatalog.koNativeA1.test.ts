import { describe, expect, it } from "vitest";

import { WEAKNESS_CATALOG } from "../weakness-catalog";

const A1_KOREAN_NATIVE_TAGS = [
  "ko_l1_3rd_person_s",
  "ko_l1_missing_article",
  "ko_l1_missing_be",
  "ko_l1_plural_s",
  "ko_l1_preposition_transfer",
] as const;

const KOREAN_SCRIPT = /[가-힣]/;

describe("WEAKNESS_CATALOG — Korean-native English A1 content wave 1", () => {
  it("adds Korean-native short labels and explanations to A1 weakness entries", () => {
    for (const tag of A1_KOREAN_NATIVE_TAGS) {
      const entry = WEAKNESS_CATALOG[tag];

      expect(entry.shortLabel.en, tag).toMatch(/[A-Za-z]{3,}/);
      expect(entry.longDescription.en, tag).toMatch(/[A-Za-z]{3,}/);
      expect(entry.shortLabel.ko, `${tag} shortLabel.ko`).toMatch(KOREAN_SCRIPT);
      expect(entry.longDescription.ko, `${tag} longDescription.ko`).toMatch(KOREAN_SCRIPT);
    }
  });

  it("keeps Korean content focused on learning English, not Korean as the target language", () => {
    const combined = A1_KOREAN_NATIVE_TAGS
      .map((tag) => `${WEAKNESS_CATALOG[tag].shortLabel.ko} ${WEAKNESS_CATALOG[tag].longDescription.ko}`)
      .join("\n");

    expect(combined).toMatch(/영어|동사|명사|주어|관사|전치사/);
    expect(combined).toMatch(/he\/she\/it|-s|a\/an\/the|in \/ on \/ at/);
  });
});
