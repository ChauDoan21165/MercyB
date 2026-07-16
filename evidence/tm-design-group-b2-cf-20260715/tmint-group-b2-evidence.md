# TM-INT Group B2 CF Evidence

Batch: `tm-design-group-b2-cf-20260715`

| TM-INT | Source | Export | Module | Axis | Failable assertion | Output digest | Result |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TM-INT-10172 | CF-013 | `selectWrittenFeedbackFocus` | `writingFeedbackFocus` | `cf-focused-written-target-family` | primary.id is article-1 and reason is active_target_family despite a higher-severity tense candidate | `sha256:20407cf03cc51d5cecb72b51e3fde3c2b8d7b763050b40bc7e6aabc1df75e6be` | evidence_passed |
| TM-INT-10173 | CF-014 | `buildWrittenMetalinguisticFeedback` | `writtenMetalinguisticFeedback` | `cf-written-repeated-grammar-metalinguistic` | kind is metalinguistic_explanation with an article rule label and corrected example | `sha256:a653e54a008afb94871b2076442de29751b5ba9ba88cbfddccb96979179b2ca7` | evidence_passed |
| TM-INT-10174 | CF-015 | `splitCorrectionForSpeech` | `correctionSpeechPayload` | `cf-audio-compact-correction-cue` | audio output is compact, within maxSpokenChars, and keeps full explanation in textDetail | `sha256:b3277df2db551a1fc09c67d0c613f358a4bb53c8883b9e363a5d8035dcb6000d` | evidence_passed |
| TM-INT-10175 | CF-018 | `selectRepresentativeWrittenErrors` | `representativeWrittenErrors` | `cf-written-representative-error-instance` | one article instance is selected, two are suppressed, and a same-pattern cue is present | `sha256:571ef3c2c4170950ea1d62af25c763c92875346c01419a3754948df9890ee589` | evidence_passed |
| TM-INT-10176 | CF-023 | `parseCorrectiveFeedbackMove/serializeCorrectiveFeedbackMove` | `correctionFeedbackTaxonomy` | `cf-feedback-move-taxonomy-validation` | known recast serializes successfully and unknown nice_hint returns unknown_feedback_move | `sha256:990d7c46bb99b1c8fab3a0cc2e42a87f7c10fa4272433959b2513545c06fd9c9` | evidence_passed |

All packets use one distinct probe and one distinct digest per TM-INT ID.

Registry intake: 5 rows added as `report_only`, 0 duplicate/collision blocks.

OBS-005 governor:
- Dry run: 5 would flip, 0 refused.
- Commit: 5 flipped, 0 refused, 0 module-audit disagreements.
- Verified count: 785 -> 790.
- Report-only count: 1974 -> 1974 after mint plus flip.

Registry backup: `/Users/chaudoanm3/ai-tutor-factory/backups/tm-design-group-b2-cf/int_registry-20260716T010233Z.sqlite3`.

Evidence files:
- `evidence/tm-design-group-b2-cf-20260715/OBS-004-evidence-packets/`
- `evidence/tm-design-group-b2-cf-20260715/tm-int-observations.jsonl`
- `evidence/tm-design-group-b2-cf-20260715/OBS-002-attributions.jsonl`
- `evidence/tm-design-group-b2-cf-20260715/governor-dry-run.json`
- `evidence/tm-design-group-b2-cf-20260715/governor-commit.json`
