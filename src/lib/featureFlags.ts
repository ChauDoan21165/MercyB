// src/lib/featureFlags.ts — MB-BLUE-93.9 — 2025-12-24 (+0700)

/**
 * Global feature flags
 * RULE:
 * - Default OFF for any new visible system
 */

export const FEATURE_FLAGS = {
  MERCY_HOST_ENABLED: false, // flip to true when ready
  /**
   * Home page "Your focus areas" card that surfaces placement-test
   * weakness tags. Off until CC3's placement-test persistence lands
   * and manual QA passes.
   */
  FOCUS_AREAS_CARD_ENABLED: false,
};
