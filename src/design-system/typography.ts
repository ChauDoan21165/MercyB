/**
 * Mercy Blade Design System - Typography
 * Unified typography scale and styles
 */

export const fontSize = {
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  base: '1rem',     // 16px
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '2rem',    // 32px
  '4xl': '2.5rem',  // 40px
  '5xl': '3rem',    // 48px
  '6xl': '4rem',    // 64px
} as const;

export const fontWeight = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export const lineHeight = {
  none: '1',
  tight: '1.25',
  snug: '1.375',
  normal: '1.5',
  relaxed: '1.625',
  loose: '2',
} as const;

/**
 * Typography styles
 */
export const text = {
  xs: `text-xs`,
  sm: `text-sm`,
  base: `text-base`,
  lg: `text-lg`,
  xl: `text-xl`,
  '2xl': `text-2xl`,
  '3xl': `text-3xl`,
  '4xl': `text-4xl`,
} as const;

export const heading = {
  sm: `text-xl font-semibold leading-snug`,      // H4
  md: `text-2xl font-semibold leading-snug`,     // H3
  lg: `text-3xl font-bold leading-tight`,        // H2
  xl: `text-4xl font-bold leading-tight`,        // H1
  xxl: `text-5xl font-bold leading-tight`,       // Display
} as const;

/**
 * Tailwind typography classes
 */
export const typographyClasses = {
  // Display headings
  display: {
    xl: 'text-6xl font-bold leading-tight tracking-tight',
    lg: 'text-5xl font-bold leading-tight tracking-tight',
    md: 'text-4xl font-bold leading-tight tracking-tight',
  },
  // Standard headings
  h1: 'text-3xl font-bold leading-snug tracking-tight',
  h2: 'text-2xl font-semibold leading-snug tracking-tight',
  h3: 'text-xl font-semibold leading-normal',
  h4: 'text-lg font-medium leading-normal',
  // Body text
  body: {
    lg: 'text-base font-normal leading-relaxed',
    md: 'text-sm font-normal leading-relaxed',
    sm: 'text-xs font-normal leading-normal',
  },
  // Specialized
  label: 'text-sm font-medium leading-tight',
  caption: 'text-xs font-medium leading-tight text-muted-foreground uppercase tracking-wide',
  subtitle: 'text-lg font-medium leading-normal text-muted-foreground',
} as const;

/**
 * Component-specific typography
 */
export const componentTypography = {
  button: {
    lg: 'text-base font-semibold',
    md: 'text-sm font-medium',
    sm: 'text-xs font-medium',
  },
  card: {
    title: 'text-lg font-semibold',
    description: 'text-sm text-muted-foreground',
  },
  modal: {
    title: 'text-2xl font-bold',
    description: 'text-base text-muted-foreground',
  },
} as const;
