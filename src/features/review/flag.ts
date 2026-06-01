// src/features/review/flag.ts — the module's single gate.
//
// Re-exports the compile-time flag from the canonical featureFlags registry so
// feature code imports it from within the feature dir (portable, one import
// site to change if the flag mechanism ever moves). Default OFF.

import { FEATURE_FLAGS } from "@/lib/featureFlags";

export const FEATURE_REVIEW: boolean = FEATURE_FLAGS.REVIEW_ENABLED;
