/**
 * Pure derivation of the "Lặp lại / Repeat" word chip row in the
 * Speaking section. Extracted from MercySpeakTab.tsx so the logic is
 * unit-testable without mounting the whole 1300-line component.
 *
 * The chip row was originally kids-only and accidentally removed in
 * commit 48ff1ad0. Restored + extended to adult mode in 2026-04-25.
 *
 * Rules:
 *   - If trouble words are known (admin tags / detector hits / memory),
 *     show those — they're the highest-signal practice items.
 *   - Otherwise, derive a deduplicated word list from the practice text.
 *   - Cap: 4 chips for kids (their lines are short, screen is small),
 *          8 chips for adults.
 */

/**
 * Mirrors the in-file `normalizeForCompare` from MercySpeakTab —
 * lowercase + strip common punctuation + collapse whitespace. Inlined
 * here to keep the helper standalone (no cross-file refactor).
 */
function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[.,!?;:()[\]"''`-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function deriveWordChips(
  troubleWords: readonly string[],
  practiceText: string,
  isKidsMode: boolean,
): string[] {
  const limit = isKidsMode ? 4 : 8;
  if (troubleWords.length > 0) {
    return troubleWords.slice(0, limit);
  }
  return normalize(practiceText)
    .split(/\s+/)
    .filter(Boolean)
    .filter((word, index, array) => array.indexOf(word) === index)
    .slice(0, limit);
}
