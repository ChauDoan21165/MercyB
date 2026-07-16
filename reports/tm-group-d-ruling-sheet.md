# TM Group D Ruling Sheet

Date: 2026-07-16
Compiler: C2.1
Scope: research/spec selection only. No implementation. No registry writes.

Inputs:

- `docs/placement-vn-l1-interference-taxonomy.md`
- `src/lib/feedback/l1-error-detector.ts`
- `src/lib/feedback/registerDetector.ts`
- `src/lib/pronunciation/vn-phoneme-map.ts`
- `src/lib/pronunciation/vnEnPronunciationDrills.ts`
- `src/lib/stage-3a/adapters/pronunciationAdapter.ts`
- Prior ruling format: `reports/tm-design-ruling-sheet.md`

Current direct VN->EN runtime detector inventory: 76 `vi_l1_*` tags in `src/lib/feedback/l1-error-detector.ts`.

Fence note: candidates below avoid `src/lib/tutor/**`. Anything needing tutor feedback-move policy, correction timing, or session state is parked.

## Coverage Diff

Taxonomy patterns with no corresponding implemented detector/tag, or only partial content support:

| Taxonomy pattern | Current coverage | Gap verdict |
|---|---|---|
| `voiced-final-stop-devoicing` | `FINAL_CONSONANT_DRILLS` has final stop pairs; no dedicated pain axis or selector key for voiced-final-stop loss. | Candidate D-P1. |
| `diphthong-monophthong-reduction` | Some vowel drift variants exist in `WORD_OVERRIDES`; no dedicated pain axis, drill bank, or selector. | Candidate D-P2. |
| `r-l-w-position-confusion` | `R_L` axis covers r/l; `v -> y/b` variants exist; no dedicated v/w or final-l pain axis. | Candidate D-P3/D-P4. |
| `modal-verb-inflection` | `vi_l1_can_no_infinitive` catches inflected main verb after a modal; no rule for inflected modal itself (`he cans`, `she shoulds`). | Candidate D-G1. |
| `phrasal-verb-avoidance` | `vi_l1_phrasal_pronoun_order` covers pronoun placement after phrasal verbs, not lexical avoidance/omission. | Candidate D-G2. |
| `literal-vietnamese-calques` | Group B covers `open/close` appliances and medicine collocations; no runtime tag for degree-adverb calque `very like`. | Candidate D-G3. |
| `false-friend-loanword-overreach` | No detector. | Park: THIN EVIDENCE unless whitelist is owner-approved. |
| `idiom-literal-interpretation` | Speech sentence content has idiom notes; no detector. | Park: broad and low severity; needs whitelist. |
| `over-explicit-pronoun-reference` | `vi_l1_subject_gender` and topic-comment rules are adjacent; no cohesion/reference-chain detector. | Candidate D-G4. |
| `topic-comment-paragraph-shape` | Sentence-level `vi_l1_topic_comment_fronting` exists; no paragraph-shape scorer rule. | Park: writing scorer contract needed. |
| `connector-overuse-and-stacking` | Group B `vi_l1_connector_stacking` catches paired `because...so` / `although...but`; no broader overuse detector. | Park: high FP without writing scorer semantics. |
| `time-reference-overmarking` | Tense/time expression rules exist; no repeated-time-adverb narrative detector. | Candidate D-G5. |
| `indirect-main-point-delay` | No detector. | Park: semantic email/writing contract needed. |
| `direct-request-transfer` | `registerDetector` intentionally abstains on context-required direct-command cases. | Candidate D-R1 via expected-answer/context export. |
| `formality-calibration` | `registerDetector` covers over-formal openers, third-person self, casual professional openers, and slang apology. | Keep as covered for surface-visible cases; park context-only forms. |
| `apology-explanation-before-responsibility` | `registerDetector` only catches slang apology; no apology sequencing rule. | Candidate D-R2. |
| `refusal-softening-gap` | `registerDetector` explicitly parks bare refusal to superior as context-required. | Candidate D-R3 only if API accepts scenario/context; otherwise park. |
| `greeting-small-talk-transfer` | No detector. | Park: context-required and low severity. |

Patterns already substantially covered and not selected for Group D: final cluster reduction, TH substitution, inaudible `-s/-ed`, word stress, flat intonation, 3rd person `-s`, past tense, plural `-s`, possessive `-s`, comparatives, articles, copula `be`, question order, relative clauses, negation, `there is/co`, topic-comment sentence fronting, preposition selection, learn/study, know/meet, say/tell, noun-preposition collocations, appliance/medicine collocations, repeated definite article, progressive `be` drop, and subject ellipsis.

## Group D - Recommended Keep/Commission

These are the recommended Group D items. Each has a distinct failable assertion and an attach surface outside `src/lib/tutor/**`.

| ID | Recommendation | Taxonomy anchor | Value | Proposed surface/module | One-line failable spec |
|---|---|---|---|---|---|
| D-G1 | COMMISSION | `modal-verb-inflection` | High A1-B1 grammar; visible in advice/ability/obligation. | `detectL1Error` / new `vi_l1_modal_overinflection` rule in `src/lib/feedback/l1-error-detector.ts`. | `detectL1Error({ userAnswer: "He cans speak English.", expectedAnswer: "He can speak English." })` returns `vi_l1_modal_overinflection`, while `"He can speak English."` does not fire. |
| D-G2 | COMMISSION | `phrasal-verb-avoidance` | Medium; everyday spoken English, useful for cohort survival phrases. | `detectL1Error` / new whitelist rule `vi_l1_phrasal_verb_transfer`. | With expected-answer context, `"I wake at six."` -> `"I get up at six."`, `"Wear your jacket."` -> `"Put on your jacket."`, and `"She cares her brother."` -> `"She looks after her brother."` fire distinct phrasal-transfer assertions. |
| D-G3 | COMMISSION | `literal-vietnamese-calques` | High-frequency A1-A2 preference calque not covered by Group B. | `detectL1Error` / new `vi_l1_very_verb_calque`. | `"I very like this song."` vs `"I really like this song."` fires `vi_l1_very_verb_calque`; `"I really like this song."` and `"This song is very good."` do not. |
| D-G4 | COMMISSION | `over-explicit-pronoun-reference` | Medium; writing/cohesion issue with a crisp repeated-name surface. | New small export near feedback/writing surfaces, e.g. `detectReferenceChainOveruse(input)`, or `detectL1Error` if pairwise expected text is enough. | `"Lan is my friend. Lan works with me. Lan is kind."` vs `"Lan is my friend. She works with me. She is kind."` fires `vi_l1_overexplicit_reference`; a single mention does not. |
| D-G5 | COMMISSION | `time-reference-overmarking` | Low/medium; easy narrative cleanup, low implementation cost. | New whitelist rule in `detectL1Error` or writing feedback helper. | `"Yesterday I went to work. Yesterday I met my boss. Yesterday I came home late."` vs a version with later time references removed fires `vi_l1_time_reference_overmarking`; one initial `yesterday` does not. |
| D-R1 | COMMISSION | `direct-request-transfer` | High professional/cohort value; request politeness is learner-visible. | New context-aware register export, e.g. `detectRegisterErrorWithContext({ learnerText, expectedText, scenario })`; do not broaden current context-free `detectRegisterError`. | In a request scenario, `"You send me the file."` vs `"Could you send me the file?"` fires `en_l1_register_direct_request_transfer`; an imperative in an instruction context abstains. |
| D-R2 | COMMISSION | `apology-explanation-before-responsibility` | Medium/high workplace value; deterministic if apology target is expected. | Context-aware register or writing-feedback helper. | `"The traffic was terrible, so I am late."` vs `"I'm sorry I'm late. The traffic was terrible."` fires apology-order transfer; a text already starting with `sorry/apologies` does not. |
| D-R3 | PARK unless context API is accepted | `refusal-softening-gap` | Medium professional value, but unsafe without scenario/addressee context. | Same context-aware register export as D-R1 if commissioned. | In a professional refusal scenario, `"No, I don't go."` vs `"Thanks for asking, but I can't this week."` fires refusal-softening; casual friend refusal without expected text abstains. |
| D-P1 | COMMISSION | `voiced-final-stop-devoicing` | Medium pronunciation; final stop voicing changes meaning (`bag/back`, `bad/bat`). | `src/lib/pronunciation/vnEnPronunciationDrills.ts` or `vn-phoneme-map.ts`: export `selectFinalStopVoicingFeedbackKey`. | `selectFinalStopVoicingFeedbackKey("bag", "back")` returns `final_stop_voicing`; `selectFinalStopVoicingFeedbackKey("bag", "bag")` returns null. |
| D-P2 | COMMISSION | `diphthong-monophthong-reduction` | Medium A1-B1 pronunciation; high-frequency words (`boat`, `face`, `late`). | Pronunciation map/drill selector: `selectDiphthongReductionFeedbackKey` plus minimal drill bank if needed. | `selectDiphthongReductionFeedbackKey("boat", "bot")` returns `diphthong_reduction`; unrelated vowel substitutions return null. |
| D-P3 | COMMISSION | `r-l-w-position-confusion` | Medium; current R/L axis misses v/w/y-glide routing. | Pronunciation pain-axis extension or selector: `selectVWFeedbackKey`. | Target `"very"` with heard `"wery"` or `"yery"` returns `v_w_confusion`; target `"very"` heard `"very"` returns null. |
| D-P4 | COMMISSION | `r-l-w-position-confusion` | Medium; final dark-l deletion is content-covered but not a first-class axis. | Pronunciation selector: `selectFinalLFeedbackKey` using existing L drills. | Target `"feel"` with heard `"fee"` returns `final_l_deletion`; target `"feel"` heard `"feel"` returns null. |

## Parked / Not Group D

| Taxonomy pattern | Recommendation | Reason |
|---|---|---|
| `false-friend-loanword-overreach` | PARK | [THIN EVIDENCE] The taxonomy supports the class, but no owner-approved whitelist/oracle exists yet. A broad detector would be noisy. |
| `literal-idiom-interpretation` | PARK | Low severity and broad. Needs a curated idiom whitelist before it can be failable without overreach. |
| `topic-comment-paragraph-shape` | PARK | Requires paragraph-level writing scorer contract, not a sentence detector. |
| `connector-overuse-and-stacking` broader than paired connectors | PARK | Group B covers crisp paired connectors. Broader "too many connectors" needs writing scorer semantics. |
| `indirect-main-point-delay` | PARK | Needs email/writing discourse contract; otherwise no public oracle knows the intended main point. |
| `greeting-small-talk-transfer` | PARK | Context-required and low severity; surface text alone cannot distinguish greeting from real question. |
| Context-free direct requests/refusals | PARK | `registerDetector` correctly abstains without addressee/scenario context. Group D should add a context-aware export if Chau commissions D-R1/D-R3. |

## Ruling Notes

- Group D should be a mixed round: 5 text grammar/lexical/discourse items, 2 context-aware register/pragmatics items, and 4 pronunciation-selector items.
- Pronunciation items are not grammar detectors. Their public oracles should be selector functions or pain-axis mappings, not `vi_l1_*` text tags unless Chau wants a unified namespace later.
- Shared-digest rule reminder: any future evidence packet can cover multiple Group D IDs only if it contains a distinct input/output assertion per ID.
- No Group D item requires `src/lib/tutor/**`. If a later implementation brief drifts into tutor timing, feedback-move selection, or UI correction policy, it belongs with parked Group C, not this round.
