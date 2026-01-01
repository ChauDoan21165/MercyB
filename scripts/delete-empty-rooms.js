// MB-BLUE-102.1 — 2026-01-01 (+0700)
// DELETE EMPTY ROOMS — AUTHORITATIVE
//
// Deletes ONLY the rooms detected as EMPTY by check-empty-rooms.js
// Source of truth = hardcoded list (no runtime guessing)

import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "public", "data");

const EMPTY_ROOMS = [
  "anxiety_relief_vip4_vip4.json",
  "bipolar_support_vip4_vip4.json",
  "bridge_to_reality_vip4.json",
  "build_skills_vip4_career_3.json",
  "build_skills_vip4_career_3_ii.json",
  "calm_body_calm_money_vip3_sub1.json",
  "calm_mind_7.json",
  "career_community_vip4.json",
  "choosing_your_path_vip4.json",

  "confidence_vip1_vip1.json",
  "confidence_vip3.json",
  "debate_skill_vip2_bonus.json",
  "discover_self_vip4_career_1.json",

  "diverse_desires_and_belonging_vip3_sub5_sex.json",
  "diverse_desires_vip3_sub5_vip3.json",
  "emotional_growth_vip3_vip3.json",

  "english_specialization_mastery_vip3_ii_module2_vip3.json",
  "english_writing_deepdive_part5_vip3ii_vip3.json",
  "english_writing_deepdive_part8_vip3ii_vip3.json",
  "english_writing_mastery_vip3_vip3.json",

  "erotic_wisdom_for_life_vip3_sub_6_sex.json",

  "explore_world_vip4_career_i_2.json",
  "explore_world_vip4_career_ii_2.json",

  "finance_calm_money_sub4_vip3.json",
  "finance_glory_vip3.json",
  "find_what_you_love_vip4.json",

  "god_with_us_vip1_vip1.json",
  "god_with_us_vip3_vip3.json",

  "grow_wealth_vip4_career_6.json",
  "growing_bigger_vip3_5_vip3.json",
  "growing_bigger_when_ready_vip3_5_finance.json",

  "keep_soul_calm_vip3_vip3.json",
  "know_yourself_deeply_vip4.json",

  "launch_career_vip4_career_4_ii.json",
  "legacy_and_impact_vip4.json",
  "legacy_and_long_term_peace_vip3_6_finance.json",
  "legacy_peace_vip3_6_vip3.json",

  "meaning_of_life_vip2_vip2.json",
  "meaning_of_life_vip4_vip4.json",
  "meaning_of_life_vip5_vip5.json",
  "meaning_of_life_vip6_vip6.json",

  "mental_sharpness_vip3.json",

  "mercy_blade_english_free.json",
  "mercy_blade_english_vip3.json",
  "mercy_blade_home_free.json",
  "mercy_blade_room_v1_vip3.json",

  "nutrition_vip1_vip1.json",
  "nutrition_vip3.json",

  "overcome_storm_vip3.json",

  "philosophy_of_everyday_vip1_vip1.json",
  "philosophy_of_everyday_vip3.json",

  "protecting_what_matters_vip3_4_finance.json",

  "quiet_growth_simple_investing_vip3_3_finance.json",
  "quiet_growth_vip3_3_vip3.json",

  "relational_erotic_vip3_sub2_vip3.json",

  "schizophrenia_understanding_vip1_vip1.json",
  "see_your_money_clearly_vip3_2_finance.json",

  "sexuality_culture_vip3_vip3.json",
  "sexuality_curiosity_culture_vip3_vip3.json",

  "stoicism_vip1_vip1.json",
  "stoicism_vip3_vip3.json",

  "strategy_in_life_3_vip3.json",
  "strategy_in_life_mastery_legacy_vip3.json",
  "strategy_in_life_mastery_legacy_vip3_ii.json",
  "strategy_life_advanced_tactics_ii_vip3_vip3.json",
  "strategy_life_advanced_tactics_vip3_vip3.json",
  "strategy_life_foundations_vip3_vip3.json",
  "strategy_tactics_ii_vip3_vip3.json",

  "weight_loss_fitness_vip3.json",
  "women_health_free.json",
];

let deleted = 0;

for (const file of EMPTY_ROOMS) {
  const p = path.join(DATA_DIR, file);
  if (fs.existsSync(p)) {
    fs.unlinkSync(p);
    deleted++;
    console.log(`✔ deleted ${file}`);
  } else {
    console.warn(`⚠ missing (skipped): ${file}`);
  }
}

console.log(`\n[delete-empty-rooms] DONE — deleted ${deleted} files`);
