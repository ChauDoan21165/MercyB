# Confusable-stress FP candidates — Slice 2 (B4)

Per-slice fragment (kept separate from the shared rollback doc to avoid add/add conflicts; the consolidation pass folds all slice fragments later).

Slice 2 rules: `en-step6-at-clock-time`, `en-step6-in-month-year`, `en-step6-enter-concrete-place`.
Method: live engine (`correctWithTutorRules`), real input → output captured. FPs are **surfaced as candidates only** — rules NOT modified, cases NOT added as passing negatives.

## FP candidate

### `en-step6-at-clock-time` — over-permissive clock-time pattern (invalid times)

| input | engine output | issue |
| --- | --- | --- |
| `We meet 25:00.` | `We meet at 25:00.` | The rule fires and inserts `at` before an **invalid clock time**. `CLOCK_TIME_PATTERN` (`\d{1,2}:\d{2}`) accepts out-of-range hours/minutes (e.g. `25:00`, `19:99`), so any `<verb> <1-2 digits>:<2 digits>` triggers regardless of validity. The inserted `at` is grammatical, but the rule over-triggers on non-times. |

- **Class:** over-broad anchor (the `\d{1,2}:\d{2}` / `\d{1,2}\s*(AM|PM)` formats are not range-bounded).
- **Lane A candidate fix (not applied here):** bound hours `0?[0-9]|1[0-9]|2[0-3]` (or `1-12` for AM/PM) and minutes `[0-5]\d`. B4 does not fix rules; surfaced for the consolidation/Lane-A pass.

## Noted (NOT an FP — fires with correct output)

### `en-step6-enter-concrete-place` — fires inside a question, output correct

| input | engine output | note |
| --- | --- | --- |
| `Did you enter into the room?` | `Did you enter the room?` | The rule has no question guard, but `enter into the room` is the same concrete-place calque inside a question and `enter the room` is the correct fix. Output is grammatical, so this is **not** a false positive and **not** added as a negative (the rule legitimately fires). Recorded only so the consolidation pass knows it was checked. |

## Clean-abstain negatives added this slice (for reference)

All verified `unchanged` on the live engine and added to the respective fixtures (one MR): at-clock-time +4 (different-verb, intervening-object, question, clock-as-noun-modifier); in-month-year +5 (different-context-verb, token-not-at-end, future-year guard, question, non-year token); enter-concrete-place +3 (different-preposition `in`, intervening adverb, non-whitelist concrete place).
