// src/features/gamification/flag.ts
//
// Single read-point for the module's compile-time gate. Everything in the
// module that has a user-facing effect (route, nav item, side effects) must
// check this first. Default OFF — see src/lib/featureFlags.ts.

import { FEATURE_FLAGS } from "@/lib/featureFlags";

export function isGamificationEnabled(): boolean {
  return FEATURE_FLAGS.FEATURE_GAMIFICATION === true;
}
