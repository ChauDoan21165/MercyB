export const LPI_TARGET_FORM_DETECTOR_TAGS = new Set<string>([
  "vi_l1_3rd_person_s",
  "vi_l1_past_ed",
  "vi_l1_plural_s",
  "vi_l1_missing_be",
  "vi_l1_question_no_aux",
  "vi_l1_double_negative",
  "vi_l1_missing_article",
  "vi_l1_a_vs_an_vowel",
  "vi_l1_geographical_article",
  "vi_l1_no_article_generic",
  "vi_l1_superlative_the",
  "vi_l1_generic_plural",
  "vi_l1_preposition_transfer",
  "vi_l1_time_expressions",
  "vi_l1_by_vs_with",
  "vi_l1_possessive_gender",
  "vi_l1_there_are_singular",
  "en-vn-past-marker-regular-verb",
  "en-vn-numeral-quantifier-plural",
  "en-vn-although-even-though-but",
  "en-vn-because-so-doubling",
  "en-vn-copula-be-adjective",
  "en-vn-yesno-do-support",
]);

export function isLpiTargetFormDetectorTag(
  detectorTag: string | null | undefined,
): boolean {
  return Boolean(detectorTag && LPI_TARGET_FORM_DETECTOR_TAGS.has(detectorTag));
}
