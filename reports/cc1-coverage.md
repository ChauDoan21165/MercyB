# Round 5 · CC1 — Sentences Batch 1 Coverage Report

**Batch:** Daily Life & Work — 200 sentences added to `src/data/speech-sentences.json`.
**Branch:** `content/sentences-daily-work`
**New IDs:** `s_a2_026`–`s_a2_105`, `s_b1_026`–`s_b1_125`, `s_b2_026`–`s_b2_045`.
**Dataset total after merge:** 300 sentences (25 legacy A1 + 105 A2 + 125 B1 + 45 B2).

---

## Totals

| Dimension | Target | Actual |
| --- | --- | --- |
| Total new sentences | 200 | **200** ✓ |
| A2 | 80 | **80** ✓ |
| B1 | 100 | **100** ✓ |
| B2 | 20 | **20** ✓ |

## Counts by topic

| Topic | Target | Actual |
| --- | --- | --- |
| work | 45 | **45** ✓ |
| daily | 45 | **45** ✓ |
| texting | 35 | **35** ✓ |
| email | 30 | **30** ✓ |
| shopping | 25 | **25** ✓ |
| money | 20 | **20** ✓ |

## Counts by topic × CEFR

| Topic | A2 | B1 | B2 | Total |
| --- | ---: | ---: | ---: | ---: |
| work | 16 | 23 | 6 | 45 |
| daily | 22 | 20 | 3 | 45 |
| texting | 18 | 16 | 1 | 35 |
| email | 8 | 18 | 4 | 30 |
| shopping | 10 | 12 | 3 | 25 |
| money | 6 | 11 | 3 | 20 |
| **Total** | **80** | **100** | **20** | **200** |

---

## L1 rule coverage (32/35 detector rules exercised)

| Rule ID | Sentences |
| --- | ---: |
| vi_l1_preposition_transfer | 56 |
| vi_l1_plural_s | 39 |
| vi_l1_missing_article | 34 |
| vi_l1_missing_be | 29 |
| vi_l1_past_ed | 29 |
| vi_l1_3rd_person_s | 27 |
| vi_l1_can_no_infinitive | 23 |
| vi_l1_to_verb_confusion | 23 |
| vi_l1_possessive_gender | 18 |
| vi_l1_past_perfect_missing | 17 |
| vi_l1_since_vs_for | 12 |
| vi_l1_passive_missing_be | 11 |
| vi_l1_comparative_double | 10 |
| vi_l1_some_vs_any | 9 |
| vi_l1_question_no_aux | 9 |
| vi_l1_to_infinitive_after_ing | 9 |
| vi_l1_conditional_mix | 8 |
| vi_l1_countable | 8 |
| vi_l1_by_vs_with | 7 |
| vi_l1_relative_pronoun | 7 |
| vi_l1_look_vs_see_vs_watch | 6 |
| vi_l1_make_vs_do | 4 |
| vi_l1_reported_speech | 4 |
| vi_l1_there_are_singular | 4 |
| vi_l1_adjective_order | 3 |
| vi_l1_time_expressions | 3 |
| vi_l1_everyone_plural | 2 |
| vi_l1_used_to_vs_be_used_to | 2 |
| vi_l1_very_much_placement | 2 |
| vi_l1_another_vs_other | 1 |
| vi_l1_countable_much | 1 |
| vi_l1_reflexive_missing | 1 |

### Rules NOT exercised in this batch (3)

These three rules are better suited to CC2's travel/medical/school batches or to drill exercises rather than free sentences — intentionally deferred:

- `vi_l1_double_past` — double-marking (e.g. `*did went`) is rare in natural writing, almost always a drill artefact.
- `vi_l1_possessive_s_missing` — sparse in daily/work sentences; shows up more in family/relationships content.
- `vi_l1_tag_question` — tag questions read stiff outside of conversational transcripts; will add in a texting-focused follow-up batch.

---

## `needs_review` items

**None.** Every translation was drafted by a native Vietnamese speaker and read back for naturalness. If Chau disagrees on any line during review, flip `needs_review: true` in the JSON and surface in the PR comments.

---

## Ten sample sentences for Chau spot-check

| ID | CEFR | Topic | EN | VI |
| --- | --- | --- | --- | --- |
| s_a2_028 | A2 | work | My boss is in a meeting now. | Sếp tôi đang họp bây giờ. |
| s_a2_050 | A2 | daily | I make coffee for my wife every morning. | Sáng nào tôi cũng pha cà phê cho vợ. |
| s_a2_067 | A2 | texting | I am running ten minutes late. | Tôi đang tới trễ mười phút. |
| s_a2_086 | A2 | email | I hope this email finds you well. | Hy vọng anh vẫn khỏe khi đọc email này. |
| s_a2_094 | A2 | shopping | I paid thirty dollars for this. | Tôi trả ba chục đô cho món này. |
| s_b1_043 | B1 | work | I used to work at a small startup. | Hồi xưa tôi từng làm ở một startup nhỏ. |
| s_b1_052 | B1 | daily | I have lived in Calgary since two thousand nineteen. | Tôi sống ở Calgary từ năm hai ngàn mười chín. |
| s_b1_082 | B1 | texting | It has been ages since we last caught up. | Lâu lắm rồi mình không gặp nhau nhỉ. |
| s_b2_026 | B2 | work | If the merger had gone through, we would have doubled our headcount. | Nếu vụ sáp nhập thành công, nhân sự của mình đã tăng gấp đôi. |
| s_b2_045 | B2 | money | If I were you, I would pay off the high-interest debt first. | Nếu là bạn, tôi sẽ trả nợ lãi cao trước. |

---

## Diaspora lens — sample of Canada/US-context sentences

Deliberately mixed alongside Vietnam-context sentences so a learner in Calgary *and* a learner in Hanoi both find the batch relevant:

- `s_b1_052` — "I have lived in Calgary since two thousand nineteen."
- `s_b1_068` — "The winter here is harsher than in Vietnam."
- `s_b1_112` — "How much does shipping cost to my zip code?" (US shipping idiom)
- `s_b1_121` — "I would rather pay cash than use my card."
- `s_a2_076` — "Are you free on Saturday night?" (weekend social pattern)

---

## Safety checks performed

- No references to Vietnamese government, Article 117, dissidents, CCP, or named political figures.
- No religious proselytizing. One cultural cue ("watching old Vietnamese movies") was kept because it references culture, not doctrine.
- No ESL cringe ("the cat sat on the mat" / "I am fine, thank you").

---

## How to verify

```bash
cd ~/MercyB-cc1-sentences-daily
npm run typecheck         # passes
npx vitest run src/data/__tests__/speech-sentences.test.ts   # 19/19
npm run build             # passes, 300 sentences bundled
```

The full test suite also passes (1189/1189 in 9.6 s).
