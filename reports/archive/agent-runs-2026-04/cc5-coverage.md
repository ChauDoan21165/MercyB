# CC5 — Micro-lessons Round 5 coverage report

**Branch:** `content/micro-lessons-new20`
**Schema:** existing `MicroLesson` (tag / title / concept / examples / practice / tip) — unchanged per Chau's brief.
**Total lessons after this PR:** 30 (10 original + 20 new).

---

## 1. Rule coverage map

The 35 catalog tags fall into three buckets:

### Lesson-covered after this PR (30 tags)

| # | Tag | Source | Topic bucket |
|---|---|---|---|
| 1 | `vi_l1_3rd_person_s` | original | subject-verb agreement |
| 2 | `vi_l1_past_ed` | original | verb tense (past) |
| 3 | `vi_l1_plural_s` | original | countable nouns |
| 4 | `vi_l1_missing_be` | original | copula |
| 5 | `vi_l1_missing_article` | original | articles |
| 6 | `vi_l1_to_verb_confusion` | original | infinitives |
| 7 | `vi_l1_double_past` | original | verb tense (past) |
| 8 | `vi_l1_comparative_double` | original | comparatives |
| 9 | `vi_l1_everyone_plural` | original | subject-verb agreement |
| 10 | `vi_l1_make_vs_do` | original | lexical choice |
| 11 | `vi_l1_question_no_aux` | **Round 5** | questions & negatives |
| 12 | `vi_l1_possessive_gender` | **Round 5** | pronouns |
| 13 | `vi_l1_preposition_transfer` | **Round 5** | prepositions |
| 14 | `vi_l1_countable` | **Round 5** | countable / uncountable |
| 15 | `vi_l1_can_no_infinitive` | **Round 5** | modals |
| 16 | `vi_l1_possessive_s_missing` | **Round 5** | possessives |
| 17 | `vi_l1_adjective_order` | **Round 5** | adjective syntax |
| 18 | `vi_l1_very_much_placement` | **Round 5** | adverb placement |
| 19 | `vi_l1_there_are_singular` | **Round 5** | existential agreement |
| 20 | `vi_l1_tag_question` | **Round 5** | questions & negatives |
| 21 | `vi_l1_past_perfect_missing` | **Round 5** | verb tense (past perfect) |
| 22 | `vi_l1_reported_speech` | **Round 5** | verb tense (backshift) |
| 23 | `vi_l1_since_vs_for` | **Round 5** | prepositions / time |
| 24 | `vi_l1_countable_much` | **Round 5** | countable + determiner |
| 25 | `vi_l1_some_vs_any` | **Round 5** | determiners |
| 26 | `vi_l1_reflexive_missing` | **Round 5** | reflexive pronouns |
| 27 | `vi_l1_conditional_mix` | **Round 5** | conditionals |
| 28 | `vi_l1_to_infinitive_after_ing` | **Round 5** | verb patterns |
| 29 | `vi_l1_passive_missing_be` | **Round 5** | passive voice |
| 30 | `vi_l1_relative_pronoun` | **Round 5** | relative clauses |

### Still uncovered after this PR (5 tags)

Deliberately left out — low-pedagogy-priority or better suited for CC3's incoming new rules:

- `vi_l1_used_to_vs_be_used_to`
- `vi_l1_another_vs_other`
- `vi_l1_look_vs_see_vs_watch`
- `vi_l1_by_vs_with`
- `vi_l1_time_expressions`

---

## 2. Topic distribution vs brief

The original brief specified an exact topic mix. The existing 35-rule catalog doesn't map cleanly onto some brief categories; here's the honest breakdown.

| Brief topic | Brief wants | This PR ships | Notes |
|---|---|---|---|
| Articles | 4 | 1 direct (`missing_article` already in original 10) + 3 determiner cousins (`countable`, `some_vs_any`, `there_are_singular`) | No 4 distinct article tags exist. Cousins tagged with closest rule — **re-tag after CC3's new rules**. |
| Verb tenses | 3 | 3 (`past_perfect_missing`, `reported_speech`, `conditional_mix`) | ✅ |
| Countable / uncountable | 2 | 2 (`countable`, `countable_much`) | ✅ |
| Pronunciation patterns (-ed, -s) | 2 | **0** | **Catalog has no phoneme-level rules** — the existing 35 are syntax/morphology. Defer to CC3's new rule set (likely Step 3 pronunciation excellence). |
| Questions & negatives | 2 | 2 (`question_no_aux`, `tag_question`) | ✅ |
| Prepositions | 2 | 2 (`preposition_transfer`, `since_vs_for`) | ✅ |
| Modal + perfect | 2 | 1 (`can_no_infinitive` — modal only) | No `should have` / `could have` rule exists in the 35; drop the "+ perfect" half. |
| Conditionals | 1 | 1 (`conditional_mix`) | ✅ |
| Phrasal verbs | 1 | **0** | **No phrasal verb rule exists in the catalog.** Defer. |
| Relative clauses | 1 | 1 (`relative_pronoun`) | ✅ |

**Shortfalls:** 2 pronunciation + 1 modal-perfect + 1 phrasal-verb + 2 article-cousins that want re-tagging = ~6 lessons that don't cleanly match the brief's bucket. Delivered 20 total regardless — all against real catalog tags, all pedagogically valuable for Vietnamese L1 learners.

---

## 3. Re-tag after CC3 merges

When CC3 ships its 25 new rule tags, three of my Round 5 lessons likely want to be re-pointed to more specific tags:

| Current tag | Current lesson | Likely better tag (TBD, pending CC3) |
|---|---|---|
| `vi_l1_countable` | "Uncountable nouns — no -s, no a/an" | New `vi_l1_zero_article_generic` or similar |
| `vi_l1_some_vs_any` | "Some in positives, any in negatives/questions" | New `vi_l1_determiner_some_any` if CC3 narrows it |
| `vi_l1_there_are_singular` | "There is vs there are" | No change expected — already specific |

None of these are bugs — the lessons are correct against their current tags. Re-tagging is a content-organization improvement, not a content-accuracy fix.

---

## 4. Content shape — schema compliance

Every Round 5 lesson matches the existing `MicroLesson` type exactly:

- ✅ `tag` — references existing `WeaknessTag`
- ✅ `title` — `{ en, vi }`, both non-empty
- ✅ `concept` — 2-3 sentences, bilingual, Vietnamese-teacher voice, tied to VN grammar contrast
- ✅ `examples` — 4 wrong/right pairs per lesson (within the 3-5 range the test enforces)
- ✅ `practice` — 6 items per lesson (within the 5-8 range the test enforces); every prompt has `___`
- ✅ `tip` — single-line bilingual mnemonic

**No new fields introduced.** No `cefr_level`, `duration_seconds`, `sections`, `quiz`, `vi_voiceover_text`, or `example_sentence_ids` — the richer structure from the original brief is deferred per Chau's call ("Richer lesson format deferred to Step 4 retention initiative").

---

## 5. Test surface

All micro-lesson invariants in `src/lib/weakness/__tests__/micro-lessons.test.ts` pass:

- 12/12 test cases green
- `EXPECTED_TAGS` updated to list all 30 tags
- Length assertion updated: `MICRO_LESSON_TAGS.length === 30`
- The "returns null for a catalog tag that has no lesson" negative test now uses `vi_l1_used_to_vs_be_used_to` (was `vi_l1_tag_question`, which this PR adds a lesson for)

`npm run typecheck` clean. `npm run build` clean.
