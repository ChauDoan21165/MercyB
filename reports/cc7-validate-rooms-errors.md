# CC7 — `validate-rooms-ci.js` strict-mode failures (69 files)

**Captured:** 2026-04-24 from `fix/ci-cleanup-cc7` @ `d3adc43b`
**Command:** `VITE_MB_VALIDATION_MODE=strict node scripts/validate-rooms-ci.js`
**Context:** this is the validator that now *runs* (post ESM port) on `.github/workflows/validate-json.yml`. The 69 failures below are real data-vs-schema drift — not caused by CC7's workflow cleanup. They are pre-existing content-library state that the broken validator has been quietly masking (via `require() is not defined`) on every CI run for months.

## Totals

- **476** room files scanned (`public/data/*.json`)
- **407** pass strict-mode
- **69** fail strict-mode

## Grouped by error type

| # | Error | Root cause | Files |
|---|---|---|---|
| 63 | `Entry count N outside allowed range [2-8] (strict mode)` | Content shipped with entry counts outside the strict-mode schema (min 2, max 8) | See breakdown below |
| 5 | `Entry 1 missing audio field (required in strict mode)` | Strict mode requires every entry to have an `audio` (or legacy `audio_en` / `audioEn`) field; five rooms have at least one entry without it | `creativity_challenges_kids_l2.json`, `feelings_social_kids_l2.json`, `little_scientist_kids_l2.json`, `sleep_improvement_vip3.json`, `user_profile_dashboard.json` |
| 1 | `Missing bilingual title fields (required in strict mode)` | The auto-generated `registry.json` (a build artifact, not a room) has no `title.en` / `title.vi`. It should probably be excluded from validation rather than "fixed" — same class of false positive as `matchmaker_traits.json` / `user_profile_dashboard.json` below | `registry.json` |

## Entry-count breakdown (63 files)

| Count | Files | What's going on |
|---|---|---|
| 0 | 1 | Empty `entries` array — `guide_articles_en_vi.json` (looks like a meta/index file, not a learning room) |
| 1 | 24 | Single-entry rooms — mostly `*_vip3.json`, `*_free.json`, and "all_entries" aggregator files; strict mode requires ≥2 |
| 9 | 24 | Nine-entry rooms — mostly VIP9 grand-strategy volumes (alexander, genghis, julius_caesar, etc.); one past the max |
| 10 | 8 | VIP6 "bonus" and VIP3_ii "mastery" rooms; two past the max |
| 12 | 2 | `strategy_in_life_1_vip3`, `strategy_in_life_foundations_ii_vip3` |
| 13 | 1 | `matchmaker_traits.json` (not a room — it's a matchmaker trait catalog, almost certainly a false positive) |
| 15 | 3 | `strategy_in_life_2_vip3`, `strategy_in_life_advanced_tactics_ii_vip3`, `trigger_point_release_vip1` |

## Entry-count failures — full file list

**count = 0** (1)
- `guide_articles_en_vi.json`

**count = 1** (24)
- `anxiety_relief_vip3.json`
- `burnout_recovery_vip3.json`
- `career_consultant_free.json`
- `confidence_building_vip2.json`
- `depression_support_vip3.json`
- `english_foundation_ef01.json`
- `finance_calm_money_clear_future_preview_free.json`
- `finance_calm_money_sub1_nervous_system_vip3.json`
- `finance_calm_money_sub2_money_basics_vip3.json`
- `finance_calm_money_sub3_growing_money_vip3.json`
- `finance_calm_money_sub5_growing_bigger_vip3.json`
- `finance_calm_money_sub6_legacy_peace_vip3.json`
- `individual_strategic_mastery_vip9.json`
- `mens_mental_health_vip3.json`
- `mercy_blade_bridge_of_hearts_free.json`
- `nutrition_free.json`
- `productivity_and_focus_vip3.json`
- `productivity_systems_all_entries_vip2.json`
- `public_speaking_all_entries_vip3.json`
- `say_my_name_mercy_blade_vip1.json`
- `social_anxiety_vip3.json`
- `stress_vip3.json`
- `wealth_wisdom_vip3_preview_free.json`
- `weight_loss_and_fitness_vip3.json`

**count = 9** (24)
- `alexander_the_great_vip9_vol1.json`
- `alexander_the_great_vip9_vol2.json`
- `english_specialization_mastery_vip3_ii.json`
- `genghis_khan_vip9_vol1.json`
- `genghis_khan_vip9_vol2.json`
- `genghis_khan_vip9_vol3.json`
- `grammar_native_logic_vip3_ii.json`
- `hannibal_barca_grand_strategy_vip9_vol1.json`
- `hannibal_barca_grand_strategy_vip9_vol2.json`
- `julius_caesar_vip9_vol1.json`
- `julius_caesar_vip9_vol1_copy.json`
- `julius_caesar_vip9_vol2.json`
- `kautilya_grand_strategy_vip9_vol1.json`
- `kautilya_grand_strategy_vip9_vol2.json`
- `life_systems_and_stability_vip2.json`
- `master_english_grammar_high_roi_vip3.json`
- `master_english_high_efficiency_vip3_ii.json`
- `public_speaking_advanced_pressure_vip3.json`
- `scipio_africanus_vip9_vol1.json`
- `scipio_africanus_vip9_vol2.json`
- `scipio_africanus_vip9_vol3.json`
- `vip3_ii_english_specialization_mastery_vip3.json`
- `zhuge_liang_grand_strategy_vip9_vol2.json`
- `zhuge_liang_grand_strategy_vip9_vol3.json`

**count = 10** (8)
- `advanced_persuasion_strategic_influence_vip6_bonus.json`
- `critical_thinking_mastery_vip6_bonus.json`
- `english_specialization_mastery_module2_vip3_ii.json`
- `master_english_high_efficiency_vip3.json`
- `psychological_self_mastery_vip6_bonus.json`
- `psychology_of_power_inner_authority_vip6_bonus.json`
- `strategic_decision_making_vip6_bonus.json`
- `strategic_emotional_reading_hidden_signals_vip6_bonus.json`

**count = 12** (2)
- `strategy_in_life_1_vip3.json`
- `strategy_in_life_foundations_ii_vip3.json`

**count = 13** (1)
- `matchmaker_traits.json`

**count = 15** (3)
- `strategy_in_life_2_vip3.json`
- `strategy_in_life_advanced_tactics_ii_vip3.json`
- `trigger_point_release_vip1.json`

## Interpretation

These 69 files fall into three categories:

1. **False positives — not learning rooms at all** (3 files): `registry.json` (build artifact), `matchmaker_traits.json` (trait catalog), `user_profile_dashboard.json` (dashboard schema), arguably `guide_articles_en_vi.json` (meta file). These should be on the validator's ignore list; their presence in `public/data/` is historical. The sibling script `scripts/validate-room-registry.js` already has `IGNORE_FILES` to exclude them — `validate-rooms-ci.js` doesn't.

2. **Legitimate schema drift — content longer than strict allows** (~35 files): VIP9 grand-strategy volumes (most `*_vip9_vol*.json` files have 9 entries), VIP6 bonus content (10 entries), `strategy_in_life_*` series (12–15 entries). The strict mode caps at 8 — but the content library has been shipping these for months without issue, which means either (a) the strict cap is wrong, or (b) the runtime validator (`roomJsonResolver.ts`) is lenient and only `validate-rooms-ci.js` enforces 8. Worth checking whether strict needs to move to e.g. 15 to match reality, or whether some of those rooms should actually be split.

3. **Legitimate schema drift — content shorter than strict allows** (~24 files): single-entry rooms — mostly "preview" or "all_entries aggregator" patterns, plus some short `*_vip3` rooms that appear to have been planned for more content. Strict min is 2. Either the cap needs to move to 1 or these rooms need at least one more entry each.

The 5 "missing audio field" errors are a separate class — those are real content bugs (a room's first entry skipped audio generation).

## Recommendation (not in CC7's scope to land)

- **Quickest unblock:** extend `validate-rooms-ci.js` IGNORE_FILES to match `validate-room-registry.js`'s list, and relax the strict bounds from `[2, 8]` to something like `[1, 15]` to match shipped reality. That drops the failure count from 69 to ~5 (just the missing-audio cases, which are real fixes).
- **Principled fix:** audit what the actual canonical schema should be and either (a) fix content to match, or (b) fix the validator to match content. Probably a Round 6 task.

## Full raw output (all 476 files, ✅ and ❌)

```
🔍 CI ROOM VALIDATION
Mode: strict
Directory: /Users/admin/MercyB/public/data

Found 476 JSON files to validate

✅ addiction_support_free.json
✅ addiction_support_vip1.json
✅ addiction_support_vip2.json
✅ addiction_support_vip3.json
✅ adhd_support_free.json
✅ adhd_support_vip1.json
✅ adhd_support_vip2.json
✅ adhd_support_vip3.json
✅ adventure_discovery_words_kids_l2.json
❌ advanced_persuasion_strategic_influence_vip6_bonus.json
   Entry count 10 outside allowed range [2-8] (strict mode)

✅ ai_free.json
✅ ai_vip1.json
✅ ai_vip2.json
✅ ai_vip3.json
❌ alexander_the_great_vip9_vol1.json
   Entry count 9 outside allowed range [2-8] (strict mode)

❌ alexander_the_great_vip9_vol2.json
   Entry count 9 outside allowed range [2-8] (strict mode)

✅ alexander_the_great_vip9_vol3.json
✅ alphabet_adventure_kids_l1.json
✅ animals_around_world_kids_l2.json
✅ animals_sounds_kids_l1.json
✅ anxiety_relief_free.json
✅ anxiety_relief_vip1.json
✅ anxiety_relief_vip2.json
❌ anxiety_relief_vip3.json
   Entry count 1 outside allowed range [2-8] (strict mode)

✅ art_creativity_words_kids_l2.json
✅ bathroom_hygiene_kids_l1.json
✅ bedtime_words_kids_l1.json
✅ beginner_grammar_power_kids_l3.json
✅ bipolar_support_free.json
✅ bipolar_support_vip1.json
✅ bipolar_support_vip2.json
✅ bipolar_support_vip3.json
✅ bismarck_vip9_vol1.json
✅ bismarck_vip9_vol2.json
✅ bismarck_vip9_vol3.json
✅ body_parts_movement_kids_l1.json
✅ burnout_recovery_free.json
✅ burnout_recovery_vip1.json
✅ burnout_recovery_vip2.json
❌ burnout_recovery_vip3.json
   Entry count 1 outside allowed range [2-8] (strict mode)

❌ career_consultant_free.json
   Entry count 1 outside allowed range [2-8] (strict mode)

✅ charisma_mechanics_presence_engineering_vip5_bonus.json
✅ classroom_english_kids_l2.json
✅ clausewitz_grand_strategy_vip9_vol1.json
✅ clausewitz_grand_strategy_vip9_vol2.json
✅ clausewitz_grand_strategy_vip9_vol3.json
✅ clothes_dressing_kids_l1.json
✅ cognitive_clarity_and_mental_load_vip2.json
✅ colors_nature_kids_l1.json
✅ colors_shapes_kids_l1.json
✅ community_helpers_kids_l2.json
❌ confidence_building_vip2.json
   Entry count 1 outside allowed range [2-8] (strict mode)

✅ conflict_navigation_emotional_deescalation_vip5_bonus.json
✅ conversation_starters_kids_l3.json
✅ conversational_influence_social_framing_vip5_bonus.json
✅ corporate_analytics_strategy_vip9.json
✅ corporate_conflict_navigation_vip9.json
✅ corporate_crisis_strategy_vip9.json
✅ corporate_cross_functional_vip9.json
✅ corporate_execution_systems_vip9.json
✅ corporate_foresight_vip9.json
✅ corporate_global_strategy_vip9.json
✅ corporate_governance_vip9.json
✅ corporate_innovation_engines_vip9.json
✅ corporate_leadership_leverage_vip9.json
✅ corporate_long_cycle_planning_vip9.json
✅ corporate_negotiation_vip9.json
✅ corporate_positioning_vip9.json
✅ corporate_resource_allocation_vip9.json
✅ corporate_scaling_strategy_vip9.json
✅ corporate_talent_architecture_vip9.json
✅ corporate_team_culture_vip9.json
✅ countries_cultures_kids_l3.json
✅ courage_to_begin_vip4.json
✅ creative_writing_basics_kids_l3.json
❌ creativity_challenges_kids_l2.json
   Entry 1 missing audio field (required in strict mode)

✅ critical_thinking_basics_kids_l3.json
❌ critical_thinking_mastery_vip6_bonus.json
   Entry count 10 outside allowed range [2-8] (strict mode)

✅ curiosity_big_questions_kids_l3_kidslevel3.json
✅ cyrus_the_great_vip9_vol2.json
✅ cyrus_the_great_vip9_vol3.json
✅ cyrus_v1.json
✅ cyrus_v3.json
✅ daily_conversations_kids_l2.json
✅ daily_routines_kids_l1.json
✅ debate_basics_kids_l3.json
✅ debate_fallacies_vip2.json
✅ deep_work_and_focus_vip2.json
✅ depression_support_vip1.json
❌ depression_support_vip3.json
   Entry count 1 outside allowed range [2-8] (strict mode)

✅ digital_literacy_words_kids_l3.json
✅ drinks_treats_kids_l1.json
✅ early_phonics_sounds_kids_l1.json
✅ earth_environment_kids_l3.json
✅ eating_disorder_support_free.json
✅ eating_disorder_support_vip1.json
✅ eating_disorder_support_vip2.json
✅ eating_disorder_support_vip3.json
✅ emotions_self_expression_kids_l3.json
✅ english_a1_a101.json
…  (all 100+ english_a1/a2/b1/c1/c2 files pass — trimmed for readability)
❌ english_foundation_ef01.json
   Entry count 1 outside allowed range [2-8] (strict mode)

✅ english_foundation_ef11.json
❌ english_specialization_mastery_module2_vip3_ii.json
   Entry count 10 outside allowed range [2-8] (strict mode)

❌ english_specialization_mastery_vip3_ii.json
   Entry count 9 outside allowed range [2-8] (strict mode)

✅ environment_nature_kids_l2.json
❌ feelings_social_kids_l2.json
   Entry 1 missing audio field (required in strict mode)

❌ finance_calm_money_clear_future_preview_free.json
   Entry count 1 outside allowed range [2-8] (strict mode)

❌ finance_calm_money_sub1_nervous_system_vip3.json
   Entry count 1 outside allowed range [2-8] (strict mode)

❌ finance_calm_money_sub2_money_basics_vip3.json
   Entry count 1 outside allowed range [2-8] (strict mode)

❌ finance_calm_money_sub3_growing_money_vip3.json
   Entry count 1 outside allowed range [2-8] (strict mode)

❌ finance_calm_money_sub5_growing_bigger_vip3.json
   Entry count 1 outside allowed range [2-8] (strict mode)

❌ finance_calm_money_sub6_legacy_peace_vip3.json
   Entry count 1 outside allowed range [2-8] (strict mode)

❌ genghis_khan_vip9_vol1.json
   Entry count 9 outside allowed range [2-8] (strict mode)

❌ genghis_khan_vip9_vol2.json
   Entry count 9 outside allowed range [2-8] (strict mode)

❌ genghis_khan_vip9_vol3.json
   Entry count 9 outside allowed range [2-8] (strict mode)

❌ grammar_native_logic_vip3_ii.json
   Entry count 9 outside allowed range [2-8] (strict mode)

❌ guide_articles_en_vi.json
   Entry count 0 outside allowed range [2-8] (strict mode)

❌ hannibal_barca_grand_strategy_vip9_vol1.json
   Entry count 9 outside allowed range [2-8] (strict mode)

❌ hannibal_barca_grand_strategy_vip9_vol2.json
   Entry count 9 outside allowed range [2-8] (strict mode)

❌ individual_strategic_mastery_vip9.json
   Entry count 1 outside allowed range [2-8] (strict mode)

❌ julius_caesar_vip9_vol1.json
   Entry count 9 outside allowed range [2-8] (strict mode)

❌ julius_caesar_vip9_vol1_copy.json
   Entry count 9 outside allowed range [2-8] (strict mode)

❌ julius_caesar_vip9_vol2.json
   Entry count 9 outside allowed range [2-8] (strict mode)

❌ kautilya_grand_strategy_vip9_vol1.json
   Entry count 9 outside allowed range [2-8] (strict mode)

❌ kautilya_grand_strategy_vip9_vol2.json
   Entry count 9 outside allowed range [2-8] (strict mode)

❌ life_systems_and_stability_vip2.json
   Entry count 9 outside allowed range [2-8] (strict mode)

❌ little_scientist_kids_l2.json
   Entry 1 missing audio field (required in strict mode)

❌ master_english_grammar_high_roi_vip3.json
   Entry count 9 outside allowed range [2-8] (strict mode)

❌ master_english_high_efficiency_vip3.json
   Entry count 10 outside allowed range [2-8] (strict mode)

❌ master_english_high_efficiency_vip3_ii.json
   Entry count 9 outside allowed range [2-8] (strict mode)

❌ matchmaker_traits.json
   Entry count 13 outside allowed range [2-8] (strict mode)

❌ mens_mental_health_vip3.json
   Entry count 1 outside allowed range [2-8] (strict mode)

❌ mercy_blade_bridge_of_hearts_free.json
   Entry count 1 outside allowed range [2-8] (strict mode)

❌ nutrition_free.json
   Entry count 1 outside allowed range [2-8] (strict mode)

❌ productivity_and_focus_vip3.json
   Entry count 1 outside allowed range [2-8] (strict mode)

❌ productivity_systems_all_entries_vip2.json
   Entry count 1 outside allowed range [2-8] (strict mode)

❌ psychological_self_mastery_vip6_bonus.json
   Entry count 10 outside allowed range [2-8] (strict mode)

❌ psychology_of_power_inner_authority_vip6_bonus.json
   Entry count 10 outside allowed range [2-8] (strict mode)

❌ public_speaking_advanced_pressure_vip3.json
   Entry count 9 outside allowed range [2-8] (strict mode)

❌ public_speaking_all_entries_vip3.json
   Entry count 1 outside allowed range [2-8] (strict mode)

❌ registry.json
   Missing bilingual title fields (required in strict mode)

❌ say_my_name_mercy_blade_vip1.json
   Entry count 1 outside allowed range [2-8] (strict mode)

❌ scipio_africanus_vip9_vol1.json
   Entry count 9 outside allowed range [2-8] (strict mode)

❌ scipio_africanus_vip9_vol2.json
   Entry count 9 outside allowed range [2-8] (strict mode)

❌ scipio_africanus_vip9_vol3.json
   Entry count 9 outside allowed range [2-8] (strict mode)

❌ sleep_improvement_vip3.json
   Entry 1 missing audio field (required in strict mode)

❌ social_anxiety_vip3.json
   Entry count 1 outside allowed range [2-8] (strict mode)

❌ strategic_decision_making_vip6_bonus.json
   Entry count 10 outside allowed range [2-8] (strict mode)

❌ strategic_emotional_reading_hidden_signals_vip6_bonus.json
   Entry count 10 outside allowed range [2-8] (strict mode)

❌ strategy_in_life_1_vip3.json
   Entry count 12 outside allowed range [2-8] (strict mode)

❌ strategy_in_life_2_vip3.json
   Entry count 15 outside allowed range [2-8] (strict mode)

❌ strategy_in_life_advanced_tactics_ii_vip3.json
   Entry count 15 outside allowed range [2-8] (strict mode)

❌ strategy_in_life_foundations_ii_vip3.json
   Entry count 12 outside allowed range [2-8] (strict mode)

❌ stress_vip3.json
   Entry count 1 outside allowed range [2-8] (strict mode)

❌ trigger_point_release_vip1.json
   Entry count 15 outside allowed range [2-8] (strict mode)

❌ user_profile_dashboard.json
   Entry 1 missing audio field (required in strict mode)

❌ vip3_ii_english_specialization_mastery_vip3.json
   Entry count 9 outside allowed range [2-8] (strict mode)

❌ wealth_wisdom_vip3_preview_free.json
   Entry count 1 outside allowed range [2-8] (strict mode)

❌ weight_loss_and_fitness_vip3.json
   Entry count 1 outside allowed range [2-8] (strict mode)

❌ zhuge_liang_grand_strategy_vip9_vol2.json
   Entry count 9 outside allowed range [2-8] (strict mode)

❌ zhuge_liang_grand_strategy_vip9_vol3.json
   Entry count 9 outside allowed range [2-8] (strict mode)

============================================================
VALIDATION SUMMARY (strict mode)
============================================================
Total files: 476
Valid: 407
Failed: 69

❌ VALIDATION FAILED - 69 files have errors
```
