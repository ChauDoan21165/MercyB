/**
 * Haptic Feedback Utilities
 * Provides tactile feedback for mobile interactions
 * Respects reduced-motion and accessibility settings
 */

import { A11Y_CONFIG } from "@/config/a11y";

/**
 * Check if haptics are supported and enabled
 */
export function isHapticsSupported(): boolean {
  return (
    A11Y_CONFIG.enableHaptics &&
    typeof navigator !== 'undefined' &&
    'vibrate' in navigator &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Trigger light haptic feedback (8ms)
 * Use for: button taps, toggles, selections
 */
export function hapticLight() {
  if (isHapticsSupported()) {
    navigator.vibrate(A11Y_CONFIG.hapticDuration);
  }
}

/**
 * Trigger medium haptic feedback (15ms)
 * Use for: room open, audio play, important actions
 */
export function hapticMedium() {
  if (isHapticsSupported()) {
    navigator.vibrate(15);
  }
}

/**
 * Trigger strong haptic feedback (25ms)
 * Use for: errors, warnings, critical actions
 */
export function hapticStrong() {
  if (isHapticsSupported()) {
    navigator.vibrate(25);
  }
}

/**
 * Trigger pattern haptic feedback
 * Use for: success confirmations, notifications
 */
export function hapticPattern(pattern: number[]) {
  if (isHapticsSupported()) {
    navigator.vibrate(pattern);
  }
}

/**
 * Success pattern: double tap
 */
export function hapticSuccess() {
  hapticPattern([8, 50, 8]);
}

/**
 * Error pattern: long buzz
 */
export function hapticError() {
  hapticPattern([25, 100, 25]);
}
