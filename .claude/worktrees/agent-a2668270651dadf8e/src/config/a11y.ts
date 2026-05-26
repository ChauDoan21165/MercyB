/**
 * Global Accessibility Configuration
 * Centralized settings for accessibility features across the app
 */

export const A11Y_CONFIG = {
  // Feature flags
  enableFocusRing: true,
  enableReducedMotion: true,
  enableHighContrast: true,
  enableScreenReaderModes: true,

  // Touch targets (WCAG 2.1 AA)
  minTouchTargetSize: 44, // pixels

  // Focus management
  focusRingColor: '#4BB7FF',
  focusRingWidth: 2,
  focusRingOffset: 2,

  // Haptic feedback
  enableHaptics: true,
  hapticDuration: 8, // milliseconds

  // Skip links
  skipToContentId: 'main-content',

  // ARIA live regions
  liveRegionPolite: 'polite' as const,
  liveRegionAssertive: 'assertive' as const,
} as const;

/**
 * Get accessibility configuration based on system/OS preferences
 */
export function getA11YConfig() {
  if (typeof window === 'undefined') {
    return A11Y_CONFIG;
  }

  return {
    ...A11Y_CONFIG,
    
    // Check if user prefers reduced motion
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    
    // Check if user prefers high contrast
    prefersHighContrast: window.matchMedia('(prefers-contrast: high)').matches,
    
    // Check if user prefers dark mode
    prefersDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
  };
}

/**
 * Hook to access a11y config with reactive updates
 */
export function useA11YConfig() {
  const [config, setConfig] = React.useState(getA11YConfig);

  React.useEffect(() => {
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
    
    const updateConfig = () => setConfig(getA11YConfig());
    
    reducedMotionQuery.addEventListener('change', updateConfig);
    highContrastQuery.addEventListener('change', updateConfig);
    
    return () => {
      reducedMotionQuery.removeEventListener('change', updateConfig);
      highContrastQuery.removeEventListener('change', updateConfig);
    };
  }, []);

  return config;
}

// Import React for hook
import * as React from 'react';
