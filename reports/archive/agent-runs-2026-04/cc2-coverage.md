# CC2 · Round 5 · Sentences Batch 2 — Coverage

**File:** `src/data/bilingual-sentences.json`
**Schema:** `src/data/bilingualSentencesSchema.ts`
**Test:** `src/data/__tests__/bilingual-sentences.test.ts`
**Total sentences:** 200 (bs_001 … bs_200)

## Topic × CEFR matrix

|               | A2 | B1 | B2 | C1 | **Total** |
|---------------|----|----|----|----|-----------|
| Travel        | 10 | 14 | 14 | 2  | **40**    |
| Medical       | 10 | 14 | 14 | 2  | **40**    |
| Immigration   | 5  | 8  | 14 | 8  | **35**    |
| School        | 8  | 12 | 13 | 2  | **35**    |
| News          | 3  | 6  | 15 | 6  | **30**    |
| Relationships | 4  | 6  | 10 | 0  | **20**    |
| **Total**     | **40** | **60** | **80** | **20** | **200** |

Both axes match the content-brief targets exactly; enforced by `bilingual-sentences.test.ts`.

## `needs_review` policy

- **Medical (40) + Immigration (35) = 75** sentences carry `needs_review: true` — Chau personally verifies before merge (high-stakes domains per the brief).
- **News / Relationships:** `needs_review: true` only on sentences with a judgment call in translation (idiom, thuật ngữ pháp lý y tế, etc.). Listed below.
- **Travel / School:** no `needs_review` flags; the translations are standard.

Non-medical / non-immigration sentences flagged via `vn_note`:

| id      | topic         | reason                                                              |
|---------|---------------|---------------------------------------------------------------------|
| bs_158  | news          | Humanitarian framing of flooding — content-policy boundary noted.   |
| bs_196  | relationships | `agree to disagree` idiom — translation is an adaptive paraphrase.  |

## L1 rule-id coverage

Every `l1_rule_ids[]` entry is a `vi_l1_*` slug from `WEAKNESS_CATALOG` (35-tag catalog as of commit `3c0c3da8`). Coverage breakdown by rule:

| Rule                              | Sentences tagged |
|-----------------------------------|------------------|
| vi_l1_3rd_person_s                | 20 |
| vi_l1_past_ed                     | 27 |
| vi_l1_plural_s                    | 30 |
| vi_l1_missing_be                  | 4  |
| vi_l1_question_no_aux             | 4  |
| vi_l1_missing_article             | 18 |
| vi_l1_possessive_gender           | 2  |
| vi_l1_preposition_transfer        | 3  |
| vi_l1_countable                   | 0  |
| vi_l1_to_verb_confusion           | 23 |
| vi_l1_can_no_infinitive           | 9  |
| vi_l1_double_past                 | 0  |
| vi_l1_possessive_s_missing        | 8  |
| vi_l1_comparative_double          | 9  |
| vi_l1_adjective_order             | 7  |
| vi_l1_very_much_placement         | 4  |
| vi_l1_there_are_singular          | 1  |
| vi_l1_everyone_plural             | 0  |
| vi_l1_make_vs_do                  | 5  |
| vi_l1_tag_question                | 0  |
| vi_l1_past_perfect_missing        | 4  |
| vi_l1_reported_speech             | 6  |
| vi_l1_since_vs_for                | 6  |
| vi_l1_countable_much              | 1  |
| vi_l1_some_vs_any                 | 5  |
| vi_l1_reflexive_missing           | 1  |
| vi_l1_conditional_mix             | 8  |
| vi_l1_to_infinitive_after_ing     | 5  |
| vi_l1_passive_missing_be          | 10 |
| vi_l1_relative_pronoun            | 6  |
| vi_l1_used_to_vs_be_used_to       | 1  |
| vi_l1_another_vs_other            | 1  |
| vi_l1_look_vs_see_vs_watch        | 2  |
| vi_l1_by_vs_with                  | 2  |
| vi_l1_time_expressions            | 3  |

Counts are approximate (computed on the JSON at write-time; slight drift is expected if sentences are re-tagged during Chau review). Totals exceed 200 because many sentences carry 2 rule tags — the brief's schema allows an array.

Under-covered rules (0 hits — Travel/Medical/Immigration/School/News/Relationships don't naturally exercise these) are acceptable for Batch 2; CC1's 200 sentences across work/daily/texting/email/shopping/money should pick up `vi_l1_double_past`, `vi_l1_tag_question`, `vi_l1_everyone_plural`, and `vi_l1_countable` more naturally.

## Content-policy guardrails

Encoded as regex tripwires in `bilingual-sentences.test.ts`:
- **Vietnam-political block-list**: `communist party`, `CCP`, `Xi Jinping`, `Trung Cộng`, `Hoàng Sa`, `Trường Sa`, `dissident`, `protest(er|ers|s)`, `Đảng Cộng sản`. Test fails CI if any future edit introduces these.
- **Adult-intimate block-list**: `sex(ual|y|ually)?`, `nude`, `naked`, `intimate`. Relationships topic capped at dating-app small-talk.
- `bs_158` ("flood in central Vietnam displaced thousands of families") is the only sentence touching Vietnam-at-all; it's humanitarian framing, no political actor named.

## Coordination notes

- **Schema:** brand-new file (`bilingual-sentences.json` + `bilingualSentencesSchema.ts`). Does **not** modify the locked `speech-sentences.json` (pronunciation-drill library).
- **L1 rule IDs:** CC3's `shared/l1-rule-ids-round5` branch was not yet published when this PR was authored. Rule IDs reference the current `vi_l1_*` catalog. When CC3 publishes their round-5 rule slugs, I'll re-tag in a follow-up commit.
- **CC1 territory respected:** no sentences in work / daily / texting / email / shopping / money.
- **No changes** to L1 rules, micro-lessons, existing 100 speech sentences, or any non-content code.
