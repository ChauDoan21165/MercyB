/**
 * Mercy Blade Design System - Spacing
 * Unified spacing scale (4px base grid)
 */

export const space = {
  0: '0',
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '0.75rem',   // 12px
  base: '1rem',    // 16px - default spacing
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
  '4xl': '6rem',   // 96px
} as const;

/**
 * Tailwind spacing classes
 */
export const spaceClasses = {
  // Padding
  p: {
    0: 'p-0',
    xs: 'p-1',
    sm: 'p-2',
    md: 'p-3',
    base: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
    '2xl': 'p-12',
    '3xl': 'p-16',
    '4xl': 'p-24',
  },
  px: {
    0: 'px-0',
    xs: 'px-1',
    sm: 'px-2',
    md: 'px-3',
    base: 'px-4',
    lg: 'px-6',
    xl: 'px-8',
    '2xl': 'px-12',
  },
  py: {
    0: 'py-0',
    xs: 'py-1',
    sm: 'py-2',
    md: 'py-3',
    base: 'py-4',
    lg: 'py-6',
    xl: 'py-8',
    '2xl': 'py-12',
  },
  // Gap
  gap: {
    0: 'gap-0',
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-3',
    base: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
    '2xl': 'gap-12',
  },
  // Margin
  m: {
    0: 'm-0',
    xs: 'm-1',
    sm: 'm-2',
    md: 'm-3',
    base: 'm-4',
    lg: 'm-6',
    xl: 'm-8',
    '2xl': 'm-12',
  },
  mb: {
    0: 'mb-0',
    xs: 'mb-1',
    sm: 'mb-2',
    md: 'mb-3',
    base: 'mb-4',
    lg: 'mb-6',
    xl: 'mb-8',
    '2xl': 'mb-12',
  },
} as const;

/**
 * Component-specific spacing defaults
 */
export const componentSpacing = {
  card: {
    padding: space.base,
    gap: space.base,
  },
  section: {
    padding: space['2xl'],
    gap: space.xl,
  },
  button: {
    padding: space.md,
    gap: space.sm,
  },
  modal: {
    padding: space.lg,
    gap: space.base,
  },
} as const;
