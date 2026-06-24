import { describe, expect, it } from "vitest";

import { WEAKNESS_CATALOG } from "../weakness-catalog";

const A1_THAI_NATIVE_TAGS = [
  "vi_l1_3rd_person_s",
  "vi_l1_past_ed",
  "vi_l1_plural_s",
  "vi_l1_missing_be",
  "vi_l1_question_no_aux",
  "vi_l1_missing_article",
  "vi_l1_to_verb_confusion",
  "vi_l1_can_no_infinitive",
  "vi_l1_there_are_singular",
  "vi_l1_everyone_plural",
] as const;

const THAI_SCRIPT = /[ก-๙]/;

describe("WEAKNESS_CATALOG — Thai-native English A1 content wave 1", () => {
  it("adds Thai-native short labels and explanations to A1 weakness entries", () => {
    for (const tag of A1_THAI_NATIVE_TAGS) {
      const entry = WEAKNESS_CATALOG[tag];

      expect(entry.shortLabel.en, tag).toMatch(/[A-Za-z]{3,}/);
      expect(entry.longDescription.en, tag).toMatch(/[A-Za-z]{3,}/);
      expect(entry.shortLabel.th, `${tag} shortLabel.th`).toMatch(THAI_SCRIPT);
      expect(entry.longDescription.th, `${tag} longDescription.th`).toMatch(THAI_SCRIPT);
    }
  });

  it("keeps Thai content focused on learning English, not Thai as the target language", () => {
    const combined = A1_THAI_NATIVE_TAGS
      .map((tag) => `${WEAKNESS_CATALOG[tag].shortLabel.th} ${WEAKNESS_CATALOG[tag].longDescription.th}`)
      .join("\n");

    expect(combined).toMatch(/ภาษาอังกฤษ|กริยา|คำนาม|ประธาน/);
    expect(combined).toMatch(/he\/she\/it|There is|There are|want to|can/);
  });
});
