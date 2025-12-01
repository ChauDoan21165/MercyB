/**
 * Unified Typography System
 * Consistent font sizes, weights, and line heights across the app
 * 
 * Scale: 12/14/16/20/24/32/40/48/64
 * Weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
 */

export const typography = {
  // Display (Hero titles)
  display: {
    xl: 'text-6xl font-bold leading-tight tracking-tight', // 64px
    lg: 'text-5xl font-bold leading-tight tracking-tight', // 48px
    md: 'text-4xl font-bold leading-tight tracking-tight', // 40px
  },

  // Headings
  h1: 'text-3xl font-bold leading-snug tracking-tight', // 32px
  h2: 'text-2xl font-semibold leading-snug tracking-tight', // 24px
  h3: 'text-xl font-semibold leading-normal', // 20px
  h4: 'text-lg font-medium leading-normal', // 18px

  // Body text
  body: {
    lg: 'text-base font-normal leading-relaxed', // 16px
    md: 'text-sm font-normal leading-relaxed', // 14px
    sm: 'text-xs font-normal leading-normal', // 12px
  },

  // Specialized
  subtitle: 'text-lg font-medium leading-normal text-muted-foreground',
  caption: 'text-xs font-medium leading-tight text-muted-foreground uppercase tracking-wide',
  label: 'text-sm font-medium leading-tight',
  
  // Room-specific
  roomTitle: 'text-2xl font-bold leading-snug tracking-tight',
  roomSubtitle: 'text-base font-medium leading-normal text-muted-foreground',
  
  // Chat-specific
  chatMessage: 'text-base font-normal leading-relaxed',
  chatTimestamp: 'text-xs font-normal leading-tight text-muted-foreground',
  
  // Button text
  buttonLg: 'text-base font-semibold leading-none',
  buttonMd: 'text-sm font-medium leading-none',
  buttonSm: 'text-xs font-medium leading-none',
} as const;

export type TypographyVariant = keyof typeof typography;
