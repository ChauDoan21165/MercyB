/**
 * Mobile Haptic Feedback Utility
 * Provides subtle vibration for meaningful actions
 * 
 * Usage: haptics.light() for subtle feedback
 *        haptics.medium() for moderate feedback
 *        haptics.heavy() for strong feedback
 */

class Haptics {
  private isSupported: boolean;

  constructor() {
    this.isSupported = typeof window !== 'undefined' && 'vibrate' in navigator;
  }

  /**
   * Light haptic feedback (10ms)
   * Use for: subtle interactions, hover effects
   */
  light() {
    if (this.isSupported) {
      navigator.vibrate(10);
    }
  }

  /**
   * Medium haptic feedback (20ms)
   * Use for: button taps, toggles, selections
   */
  medium() {
    if (this.isSupported) {
      navigator.vibrate(20);
    }
  }

  /**
   * Heavy haptic feedback (30ms)
   * Use for: important actions, confirmations, errors
   */
  heavy() {
    if (this.isSupported) {
      navigator.vibrate(30);
    }
  }

  /**
   * Success pattern (short-long)
   * Use for: successful actions, completions
   */
  success() {
    if (this.isSupported) {
      navigator.vibrate([10, 50, 20]);
    }
  }

  /**
   * Error pattern (long-short-long)
   * Use for: errors, warnings
   */
  error() {
    if (this.isSupported) {
      navigator.vibrate([30, 50, 30]);
    }
  }

  /**
   * Check if haptics are supported
   */
  get supported(): boolean {
    return this.isSupported;
  }
}

export const haptics = new Haptics();
