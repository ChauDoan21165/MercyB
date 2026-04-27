// src/lib/onboarding/firstLesson.ts
//
// First-lesson route selection based on the four onboarding inputs:
// primary_goal, profession, english_level, and (implicit) the route
// surfaces that already exist in the app today.
//
// The function is pure — no I/O, no Supabase, no React. Tests live
// next to it and exhaustively cover the routing matrix. The output is
// always a valid in-app route string that the OnboardingPage can hand
// directly to react-router-dom's `navigate()`.
//
// Design principles:
//   1. ALWAYS return a real route — never null. If everything is
//      missing or unmatched, fall back to "/" (Home), which has its
//      own first-step content (Today's Lesson, Try one word, etc.).
//   2. Prefer the deepest sensible match. Career + profession ->
//      profession-pack route; career without profession -> generic
//      Career rooms. Exam tracks -> their content-pack landing.
//   3. The "level" hint biases the pack route to a starter sub-page
//      where one exists, but defaults to the pack landing otherwise.
//      (Pack landings already let users pick their own band.)
//
// Routes referenced here all exist in src/router/AppRouter.tsx as of
// 2026-04-27. New profession packs that ship later can extend
// PROFESSION_ROUTE without touching call sites.

import type {
  OnboardingGoal,
  OnboardingLevel,
  OnboardingProfession,
} from "./types";

/** Map of profession → its content-pack landing route (open, no auth). */
const PROFESSION_ROUTE: Record<OnboardingProfession, string> = {
  restaurant: "/professions/restaurant",
  nail_tech: "/professions/nail-technician",
  customer_service: "/professions/customer-service",
  healthcare: "/professions/healthcare",
  tech: "/professions/tech",
  driver: "/professions/drivers",
  hospitality: "/professions/hospitality",
  // No dedicated pack for "other" — fall through to Library so the
  // user can browse the full room catalogue.
  other: "/rooms",
};

/** Exam-prep landing routes — open marketing surfaces, not the
 *  premium-gated practice routes. These are the same routes the Home
 *  cards link to, so the experience is consistent. */
const EXAM_ROUTE: Record<
  Exclude<OnboardingGoal, "career" | "general" | "travel">,
  string
> = {
  ielts: "/exam-prep/ielts/speaking",
  vstep: "/exam/vstep/speaking",
  toeic: "/exam-prep/toeic",
};

export interface PickFirstLessonInput {
  goal: OnboardingGoal | null;
  profession: OnboardingProfession | null;
  level: OnboardingLevel | null;
}

export interface PickFirstLessonResult {
  /** The route to navigate to after onboarding. */
  route: string;
  /** Why this route was chosen — for telemetry + debugging. */
  reason:
    | "profession_pack"
    | "career_no_profession"
    | "exam_landing"
    | "travel_default"
    | "general_default"
    | "skip_or_unknown";
}

/**
 * Pick the user's first lesson from their onboarding inputs.
 *
 * Decision order:
 *   1. Career goal + profession → profession-pack landing.
 *   2. Career goal, no profession → /rooms (browse generic work
 *      rooms; the user can pick a profession when they're ready).
 *   3. IELTS / VSTEP / TOEIC → corresponding exam-prep landing.
 *   4. Travel → /rooms (travel-themed rooms exist; we surface the
 *      Library so the user can pick what fits).
 *   5. General learning → /  (Home with TodaysLessonCard + recs).
 *   6. Anything missing (skip flow) → /  (Home).
 *
 * The `level` argument is accepted for future-proofing — current
 * routes don't need it because each pack landing has its own band
 * filter. The function signature won't change when routes start
 * caring about level later.
 */
export function pickFirstLesson(input: PickFirstLessonInput): PickFirstLessonResult {
  const { goal, profession } = input;

  // Suppress lint: level isn't read yet but is part of the contract.
  void input.level;

  if (goal === "career") {
    if (profession) {
      return {
        route: PROFESSION_ROUTE[profession],
        reason: "profession_pack",
      };
    }
    return { route: "/rooms", reason: "career_no_profession" };
  }

  if (goal === "ielts" || goal === "vstep" || goal === "toeic") {
    return { route: EXAM_ROUTE[goal], reason: "exam_landing" };
  }

  if (goal === "travel") {
    return { route: "/rooms", reason: "travel_default" };
  }

  if (goal === "general") {
    return { route: "/", reason: "general_default" };
  }

  return { route: "/", reason: "skip_or_unknown" };
}
