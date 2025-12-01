/**
 * Global Animation Configuration
 * Central source of truth for all animation timings and easing
 */

export const ANIMATION_CONFIG = {
  // Duration presets (in seconds)
  duration: {
    short: 0.15,
    medium: 0.25,
    long: 0.4,
  },

  // Easing curves
  easing: {
    default: "easeOut",
    soft: "easeInOut",
    sharp: "easeIn",
  },

  // Spring physics
  spring: {
    stiffness: 140,
    damping: 18,
  },

  // Performance thresholds
  performance: {
    fpsThreshold: 30, // Below this, reduce animations
    maxStaggerItems: 200, // Max items for stagger animations
  },

  // Stagger delays
  stagger: {
    fast: 0.03,
    medium: 0.05,
    slow: 0.1,
  },
} as const;
