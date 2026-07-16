# TM-INT Group D Evidence

Batch: `tm-design-group-d-20260716`

| TM-INT | Source | Export / tag | Module | Axis | Failable assertion | Output digest | Result |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TM-INT-10177 | D-G1 | `vi_l1_modal_overinflection` | `l1ErrorDetector` | `vi-modal-overinflection` | positive returns vi_l1_modal_overinflection and the correct modal form does not return that tag | `sha256:3c28d5ec5418825d9ff81672ee0a3d56ddc7c91454d1d490349fa14502d7c5fe` | evidence_passed |
| TM-INT-10178 | D-G2 | `vi_l1_phrasal_verb_transfer` | `l1ErrorDetector` | `vi-phrasal-verb-transfer` | all three whitelisted phrasal-transfer pairs return vi_l1_phrasal_verb_transfer and a non-whitelisted wake use does not | `sha256:87d707c549a15d6dbff0a9465d5dd5e5c3831d7412910c89bb9379facab9e58f` | evidence_passed |
| TM-INT-10179 | D-G3 | `vi_l1_very_verb_calque` | `l1ErrorDetector` | `vi-very-verb-calque` | very plus verb returns vi_l1_very_verb_calque while really plus verb and very plus adjective do not | `sha256:922a46f73e22d4c51e371c6ecce452dc78b675ad5028cbb2d6c4bb6d7d0fa545` | evidence_passed |
| TM-INT-10180 | D-G4 | `vi_l1_overexplicit_reference` | `l1ErrorDetector` | `vi-overexplicit-reference` | repeated name chain returns vi_l1_overexplicit_reference and a single mention does not | `sha256:4f4d4a66c35518f7b69a6c59c26d323fd5fc80259f48d035ba90a1006bdcee37` | evidence_passed |
| TM-INT-10181 | D-G5 | `vi_l1_time_reference_overmarking` | `l1ErrorDetector` | `vi-time-reference-overmarking` | three repeated yesterday markers return vi_l1_time_reference_overmarking and a single initial marker does not | `sha256:4afeced8998d4798aa995caa5fa173fdad0e76aada382e8acf7036bcc8f17fb5` | evidence_passed |
| TM-INT-10182 | D-R1 | `detectRegisterErrorWithContext` | `registerDetector` | `register-direct-request-transfer` | professional request context returns en_l1_register_direct_request_transfer; instruction and context-free calls abstain | `sha256:a5cc58c8cbe415841821674e35b90e86b86b6b7cc95b04919037f2094d5c4257` | evidence_passed |
| TM-INT-10183 | D-R2 | `detectRegisterErrorWithContext` | `registerDetector` | `register-apology-explanation-order` | reason-first professional apology returns en_l1_register_apology_explanation_order and apology-first text abstains | `sha256:f7995ddc34697de836f0232386f76538f687b38dadd0ded121b2de1b5b946b20` | evidence_passed |
| TM-INT-10184 | D-R3 | `detectRegisterErrorWithContext` | `registerDetector` | `register-refusal-softening-gap` | professional refusal context returns en_l1_register_refusal_softening_gap and casual refusal context abstains | `sha256:977d81c8f548d8c8c91e950946af472c869a7f1f78e662b5c0d45afaf6a6d3eb` | evidence_passed |
| TM-INT-10185 | D-P1 | `selectFinalStopVoicingFeedbackKey` | `vnEnPronunciationDrills` | `pron-final-stop-voicing` | bag heard as back returns final_stop_voicing and bag heard as bag returns null | `sha256:3a488a14307fb82f7cb599231e08f3d88a4989fd9c048afe7f88a22cc1b80014` | evidence_passed |
| TM-INT-10186 | D-P2 | `selectDiphthongReductionFeedbackKey` | `vnEnPronunciationDrills` | `pron-diphthong-reduction` | boat heard as bot returns diphthong_reduction and unrelated boat/bet returns null | `sha256:d375bc12c4ec3b45796b36095ac7e33ec258ef73b6b35286e45047824e60249a` | evidence_passed |
| TM-INT-10187 | D-P3 | `selectVWFeedbackKey` | `vnEnPronunciationDrills` | `pron-v-w-confusion` | very heard as wery or yery returns v_w_confusion and correct very returns null | `sha256:e18284f8542d35c6d5e5bbb70bbe65bf96d9ad60c0bb91eb68a202b21269e225` | evidence_passed |
| TM-INT-10188 | D-P4 | `selectFinalLFeedbackKey` | `vnEnPronunciationDrills` | `pron-final-l-deletion` | feel heard as fee returns final_l_deletion and feel heard as feel returns null | `sha256:0ef16b91958514f84d6297d37c2f0e942243fb63f8036571f5019217da4fa609` | evidence_passed |

All packets use one distinct probe and one distinct digest per TM-INT ID.

## Registry Results

- Registry backup before writes: `/Users/chaudoanm3/ai-tutor-factory/backups/tm-design-group-d/int_registry-20260716T143911Z.sqlite3`
- Intake: 12 rows added as `report_only`, 0 duplicate blocks, 0 unresolved collisions.
- OBS-005 dry-run: `flip_count=12`, `refuse_count=0`, `module_audit_disagreement_count=0`.
- OBS-005 commit: `flip_count=12`, `refuse_count=0`, `module_audit_disagreement_count=0`.
- Registry counts: total `2764 -> 2776`, verified `790 -> 802`, report_only `1974 -> 1974`.

Governor output files:

- `evidence/tm-design-group-d-20260716/governor-dry-run.json`
- `evidence/tm-design-group-d-20260716/governor-commit.json`
- `evidence/tm-design-group-d-20260716/registry-intake.json`
