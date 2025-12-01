/**
 * Global Spacing System (4px grid)
 * Consistent spacing scale across all components
 * 
 * Base unit: 4px
 * Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 96
 */

export const spacing = {
  // Core scale (4px grid) - STANDARDIZED
  xs: 'p-1',     // 4px
  sm: 'p-2',     // 8px
  md: 'p-3',     // 12px
  base: 'p-4',   // 16px
  lg: 'p-6',     // 24px
  xl: 'p-8',     // 32px
  '2xl': 'p-12', // 48px
  '3xl': 'p-16', // 64px
  '4xl': 'p-24', // 96px

  // Gaps (for flex/grid) - STANDARDIZED
  gap: {
    xs: 'gap-1',    // 4px
    sm: 'gap-2',    // 8px
    md: 'gap-3',    // 12px
    base: 'gap-4',  // 16px
    lg: 'gap-6',    // 24px
    xl: 'gap-8',    // 32px
    '2xl': 'gap-12', // 48px
  },

  // Margins - STANDARDIZED
  margin: {
    xs: 'mb-1',     // 4px
    sm: 'mb-2',     // 8px
    md: 'mb-3',     // 12px
    base: 'mb-4',   // 16px
    lg: 'mb-6',     // 24px
    xl: 'mb-8',     // 32px
    '2xl': 'mb-12', // 48px
  },

  // Component-specific spacing presets
  card: {
    padding: 'p-4',      // 16px (standardized from p-6)
    gap: 'gap-4',        // 16px
    margin: 'mb-4',      // 16px (standardized from mb-6)
  },

  section: {
    padding: 'py-12 px-4',  // 48px vertical, 16px horizontal (standardized)
    gap: 'space-y-8',       // 32px between sections
  },

  grid: {
    gap: 'gap-4',           // 16px for room grids
    padding: 'p-4',         // 16px container padding
  },

  chat: {
    messagePadding: 'p-4',      // 16px
    messageGap: 'space-y-4',    // 16px between messages
    containerPadding: 'p-4',    // 16px (standardized from p-6)
  },
  
  // Safe area support for mobile (iPhone notch)
  safeArea: {
    top: 'pt-[env(safe-area-inset-top)]',
    bottom: 'pb-[env(safe-area-inset-bottom)]',
    left: 'pl-[env(safe-area-inset-left)]',
    right: 'pr-[env(safe-area-inset-right)]',
  },
} as const;
