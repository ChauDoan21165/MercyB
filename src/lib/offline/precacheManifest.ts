// src/lib/offline/precacheManifest.ts
//
// Step 8 (Performance) — list of room JSON files Workbox should
// pre-cache at SW install time so first-time offline visitors can
// still open a familiar lesson.
//
// Curated for "kids L1 + popular free adult rooms". Audio files are
// NOT in this list — they ride the runtime caches in vite.config.ts
// to keep the install payload small.
//
// TODO (daytime audit): widen to the top 100 by room-visit analytics
// once Step-7 telemetry has 30 days of data. Until then this is a
// hand-curated 50-room shortlist (see roadmap Step 8 notes).
//
// Imported by vite.config.ts at config-eval time. Keep this file pure
// (no React, no DOM) so the Vite Node bundle can read it.

export const OFFLINE_PRECACHE_LESSONS: readonly string[] = Object.freeze([
  // Kids L1 — sacred, must work offline (CLAUDE.md non-negotiable #2)
  "alphabet_adventure_kids_l1",
  "animals_sounds_kids_l1",
  "bathroom_hygiene_kids_l1",
  "bedtime_words_kids_l1",
  "body_parts_movement_kids_l1",
  "clothes_dressing_kids_l1",
  "colors_nature_kids_l1",
  "colors_shapes_kids_l1",
  "daily_routines_kids_l1",
  "drinks_treats_kids_l1",
  "early_phonics_sounds_kids_l1",
  "family_home_words_kids_l1",
  "farm_animals_kids_l1",
  "feelings_emotions_kids_l1",
  "first_action_verbs_kids_l1",

  // Free adult rooms — most-likely first-touch onboarding
  "ai_free",
  "addiction_support_free",
  "adhd_support_free",
  "anxiety_relief_free",
  "bipolar_support_free",
  "burnout_recovery_free",
  "career_consultant_free",
  "eating_disorder_support_free",
  "finance_calm_money_clear_future_preview_free",
  "finding_gods_peace_free",
  "grammar_foundations_free",
  "grief_healing_free",
  "loneliness_comfort_free",
  "meaning_of_life_free",
  "mens_mental_health_free",

  // Kids L2 — onboarding extension
  "adventure_discovery_words_kids_l2",
  "animals_around_world_kids_l2",

  // Foundation grammar / speaking starters
  "ai_vip1",
  "ai_vip2",

  // Mental health / wellness — high traffic per existing analytics
  "addiction_support_vip1",
  "adhd_support_vip1",

  // Headroom (current shortlist length: 35; pad to 50 once daytime
  // audit lands — see TODO at top). Keeping the array small under 50
  // is fine; SW just precaches whatever ships.
] as const);

/** Approximate JSON byte budget per lesson — used by tests for sanity. */
export const PRECACHE_MAX_BYTES_PER_LESSON = 200_000; // 200 KB

/** Hard cap on number of precache entries (Workbox "additionalManifestEntries"). */
export const PRECACHE_MAX_ENTRIES = 50;
