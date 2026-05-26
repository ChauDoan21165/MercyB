/**
 * Mercy Blade Design System - Shadows
 * Unified shadow token system
 */

export const shadows = {
  none: 'none',
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  
  // Special shadows
  glow: '0 0 20px hsl(var(--primary) / 0.3)',
  glowLg: '0 0 40px hsl(var(--primary) / 0.4)',
  card: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  cardHover: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  modal: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
} as const;

/**
 * Tailwind shadow classes
 */
export const shadowClasses = {
  none: 'shadow-none',
  xs: 'shadow-xs',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl',
  inner: 'shadow-inner',
  glow: 'shadow-[0_0_20px_hsl(var(--primary)/0.3)]',
  glowLg: 'shadow-[0_0_40px_hsl(var(--primary)/0.4)]',
} as const;

/**
 * Component-specific shadow defaults
 */
export const componentShadows = {
  button: shadows.sm,
  buttonHover: shadows.md,
  card: shadows.card,
  cardHover: shadows.cardHover,
  modal: shadows.modal,
  dropdown: shadows.lg,
  toast: shadows.lg,
} as const;
