/**
 * Global Spacing System (8px grid)
 * Consistent spacing scale across all components
 * 
 * Base unit: 4px
 * Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96
 */

export const spacing = {
  // Core scale (8px grid)
  xs: 'p-1',    // 4px
  sm: 'p-2',    // 8px
  md: 'p-3',    // 12px
  base: 'p-4',  // 16px
  lg: 'p-6',    // 24px
  xl: 'p-8',    // 32px
  '2xl': 'p-12', // 48px
  '3xl': 'p-16', // 64px
  '4xl': 'p-24', // 96px

  // Gaps (for flex/grid)
  gap: {
    xs: 'gap-1',    // 4px
    sm: 'gap-2',    // 8px
    md: 'gap-3',    // 12px
    base: 'gap-4',  // 16px
    lg: 'gap-6',    // 24px
    xl: 'gap-8',    // 32px
    '2xl': 'gap-12', // 48px
  },

  // Component-specific spacing presets
  card: {
    padding: 'p-6',      // 24px
    gap: 'gap-4',        // 16px
    margin: 'mb-6',      // 24px
  },

  section: {
    padding: 'py-12 px-6',  // 48px vertical, 24px horizontal
    gap: 'space-y-8',       // 32px between sections
  },

  grid: {
    gap: 'gap-4',           // 16px for room grids
    padding: 'p-4',         // 16px container padding
  },

  chat: {
    messagePadding: 'p-4',  // 16px
    messageGap: 'space-y-4', // 16px between messages
    containerPadding: 'p-6', // 24px
  },
} as const;
