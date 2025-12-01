/**
 * Mercy Blade Design System Tokens
 * Canonical design tokens for typography, spacing, z-index, shadows, and more
 */

/**
 * Typography Scale
 * Use these tokens instead of direct text-* classes
 */
export const typography = {
  // Display headings (hero sections)
  'display-xl': 'text-6xl font-bold leading-tight tracking-tight',
  'display-lg': 'text-5xl font-bold leading-tight tracking-tight',
  'display-md': 'text-4xl font-bold leading-tight tracking-tight',
  
  // Headings
  'heading-xl': 'text-3xl font-bold leading-snug tracking-tight',
  'heading-lg': 'text-2xl font-semibold leading-snug tracking-tight',
  'heading-md': 'text-xl font-semibold leading-normal',
  'heading-sm': 'text-lg font-medium leading-normal',
  
  // Body text
  'body-lg': 'text-base font-normal leading-relaxed',
  'body-base': 'text-sm font-normal leading-relaxed',
  'body-sm': 'text-xs font-normal leading-normal',
  
  // Labels and captions
  'label': 'text-sm font-medium leading-tight',
  'caption': 'text-xs font-medium leading-tight uppercase tracking-wide',
} as const;

/**
 * Z-Index Scale
 * Use these tokens instead of arbitrary z-* values
 */
export const zIndex = {
  'base': 'z-0',
  'dropdown': 'z-10',
  'sticky': 'z-20',
  'modal-backdrop': 'z-30',
  'modal': 'z-40',
  'popover': 'z-50',
  'toast': 'z-60',
  'tooltip': 'z-70',
} as const;

/**
 * Shadow Scale
 * Canonical shadow tokens
 */
export const shadows = {
  'sm': 'shadow-sm',
  'base': 'shadow-md',
  'lg': 'shadow-lg',
  'xl': 'shadow-xl',
  'glow': 'shadow-glow',
} as const;

/**
 * Border Radius Scale
 */
export const radius = {
  'sm': 'rounded-md',
  'base': 'rounded-lg',
  'lg': 'rounded-xl',
  'full': 'rounded-full',
} as const;

/**
 * Spacing Scale (use instead of hardcoded spacing)
 */
export const spacing = {
  'xs': 'p-1',
  'sm': 'p-2',
  'md': 'p-3',
  'base': 'p-4',
  'lg': 'p-6',
  'xl': 'p-8',
  '2xl': 'p-12',
} as const;

export const spacingMargin = {
  'xs': 'mb-1',
  'sm': 'mb-2',
  'md': 'mb-3',
  'base': 'mb-4',
  'lg': 'mb-6',
  'xl': 'mb-8',
  '2xl': 'mb-12',
} as const;

/**
 * Grid Breakpoints
 * Canonical grid column counts
 */
export const gridBreakpoints = {
  default: 'grid-cols-1',
  sm: 'sm:grid-cols-2',
  md: 'md:grid-cols-3',
  lg: 'lg:grid-cols-4',
  xl: 'xl:grid-cols-5',
  '2xl': '2xl:grid-cols-6',
} as const;

export const GRID_CLASSES = `grid ${gridBreakpoints.default} ${gridBreakpoints.sm} ${gridBreakpoints.md} ${gridBreakpoints.lg} ${gridBreakpoints.xl} ${gridBreakpoints['2xl']} gap-4`;

/**
 * Touch Target Size (44px minimum for accessibility)
 */
export const touchTarget = 'min-h-[44px] min-w-[44px]';

/**
 * Interaction States
 */
export const interactionStates = {
  hover: 'hover:bg-accent hover:text-accent-foreground transition-colors duration-200',
  focus: 'focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none',
  disabled: 'disabled:opacity-50 disabled:pointer-events-none',
  loading: 'opacity-50 cursor-wait pointer-events-none',
} as const;
