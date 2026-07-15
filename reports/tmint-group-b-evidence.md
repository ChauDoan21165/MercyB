# TM-INT Group B VI Evidence

Batch: `tm-design-group-b-vi-20260715`

| TM-INT | Source | Export / tag | Module | Axis | Failable assertion | Output digest | Result |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TM-INT-10160 | VI-2 | `vi_l1_profession_article_copula` | `l1ErrorDetector` | `vi-profession-article-copula` | matched weaknessTag vi_l1_profession_article_copula for profession article/copula transfer | `sha256:1389d7e69b46ab407fa1deaee3a838ccb32872f095e13acc0595de47e54773e4` | evidence_passed |
| TM-INT-10161 | VI-3 | `vi_l1_progressive_be_drop` | `l1ErrorDetector` | `vi-progressive-be-drop` | matched weaknessTag vi_l1_progressive_be_drop for dropped progressive be | `sha256:9425385e42f50b3bc0f653ff336dd0618f321a1790bf22e58fdeebbf3e481a1e` | evidence_passed |
| TM-INT-10162 | VI-7 | `vi_l1_definite_article_remention` | `l1ErrorDetector` | `vi-definite-article-remention` | matched weaknessTag vi_l1_definite_article_remention for repeated noun the insertion | `sha256:d517c4a828296ab2c80954ef48c103a03ed8f000eb6a37024f772fdf009c6523` | evidence_passed |
| TM-INT-10163 | VI-11 | `vi_l1_noun_preposition_collocation` | `l1ErrorDetector` | `vi-noun-preposition-collocation` | matched weaknessTag vi_l1_noun_preposition_collocation for whitelisted reason for collocation | `sha256:6ccb49406477100d968f3b3f6444d89fe96c71336d302f27fdbc97e944b29f27` | evidence_passed |
| TM-INT-10164 | VI-12 | `vi_l1_say_tell_argument_frame` | `l1ErrorDetector` | `vi-say-tell-argument-frame` | matched weaknessTag vi_l1_say_tell_argument_frame for said me to told me | `sha256:21894339f3e5bfd59cee5f431d4525c24a2597fb985189c339e86e44d06bbc09` | evidence_passed |
| TM-INT-10165 | VI-13 | `vi_l1_learn_study_transfer` | `l1ErrorDetector` | `vi-learn-study-transfer` | matched weaknessTag vi_l1_learn_study_transfer for study how to cook to learn how to cook | `sha256:53bd692a2f25d398db9052dbb7da368931210af92702f1dd64ccc6fdd89be911` | evidence_passed |
| TM-INT-10166 | VI-14 | `vi_l1_know_meet_timeline` | `l1ErrorDetector` | `vi-know-meet-timeline` | matched weaknessTag vi_l1_know_meet_timeline for knew him yesterday to met him yesterday | `sha256:e12044e905b90367d0caf6cb7ef4042d5b6db665dd38d68cf54640bf4ee348e4` | evidence_passed |
| TM-INT-10167 | VI-15 | `vi_l1_verb_noun_collocation` | `l1ErrorDetector` | `vi-verb-noun-collocation` | matched weaknessTag vi_l1_verb_noun_collocation for eat medicine to take medicine | `sha256:5a506b4c10d3b79ff8f3e1d1f6c7182e5bee4683a1381db79a76214d96119b88` | evidence_passed |
| TM-INT-10168 | VI-16 | `vi_l1_appliance_open_close_transfer` | `l1ErrorDetector` | `vi-appliance-open-close-transfer` | matched weaknessTag vi_l1_appliance_open_close_transfer for open the light to turn on the light | `sha256:823d8ac634a3d73dccf689fcaee3edbbaf5c26dadaa9e383da62faafe65d24ad` | evidence_passed |
| TM-INT-10169 | VI-17 | `vi_l1_connector_stacking` | `l1ErrorDetector` | `vi-connector-stacking` | matched weaknessTag vi_l1_connector_stacking for because plus so connector stacking | `sha256:f46458c6c1924e0fb6cb9cba37ba30ead4093368bb4e1f439ceb56b71990c2ac` | evidence_passed |
| TM-INT-10170 | VI-19 | `vi_l1_elliptical_subject_transfer` | `l1ErrorDetector` | `vi-elliptical-subject-transfer` | matched weaknessTag vi_l1_elliptical_subject_transfer for because busy to because I was busy | `sha256:a4ab634190e6d53b85b6025e343dd95970e242a5ed4cd1b4b5e1f340967063e1` | evidence_passed |
| TM-INT-10171 | VI-22 | `selectFinalClusterFeedbackKey` | `vnEnPronunciationDrills` | `vi-final-cluster-simplification` | returned final_cluster_simplification for next heard as nex | `sha256:e5c390d8527afc09a2fabee5a22717963a2e5cb7430e9aa73ef89647a2971dfd` | evidence_passed |

All packets use one distinct probe and one distinct digest per TM-INT ID.

Registry intake: 12 rows added as `report_only`, 0 duplicate/collision blocks.

OBS-005 governor:
- Dry run: 12 would flip, 0 refused.
- Commit: 12 flipped, 0 refused, 0 module-audit disagreements.
- Verified count: 773 -> 785.
- Report-only count: 1974 -> 1974 after mint plus flip.

Registry backup: `/Users/chaudoanm3/ai-tutor-factory/backups/tm-design-group-b-vi/int_registry-20260715T224845Z.sqlite3`.

Evidence files:
- `evidence/tm-design-group-b-vi-20260715/OBS-004-evidence-packets/`
- `evidence/tm-design-group-b-vi-20260715/tm-int-observations.jsonl`
- `evidence/tm-design-group-b-vi-20260715/OBS-002-attributions.jsonl`
- `evidence/tm-design-group-b-vi-20260715/governor-dry-run.json`
- `evidence/tm-design-group-b-vi-20260715/governor-commit.json`
