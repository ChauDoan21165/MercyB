/**
 * Mercy Blade Design System - Border Radius
 * Standardized border radius tokens
 */

export const radius = {
  none: '0',
  xs: '0.25rem',   // 4px
  sm: '0.375rem',  // 6px
  md: '0.5rem',    // 8px - default for most UI
  lg: '0.75rem',   // 12px - cards, modals
  xl: '1rem',      // 16px - large cards
  '2xl': '1.5rem', // 24px - hero elements
  full: '9999px',  // pill/circle
} as const;

/**
 * Tailwind radius classes
 */
export const radiusClasses = {
  none: 'rounded-none',
  xs: 'rounded',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
} as const;

/**
 * Component-specific radius defaults
 */
export const componentRadius = {
  button: radius.md,
  card: radius.lg,
  input: radius.md,
  modal: radius.xl,
  tag: radius.full,
  badge: radius.sm,
  avatar: radius.full,
  image: radius.lg,
} as const;
