/**
 * Mercy Blade Color System
 * Standardized color tokens using CSS variables
 * 
 * Usage: Always use these tokens instead of arbitrary hex colors
 * Example: bg-brand-primary instead of bg-[#hexcode]
 */

export const colors = {
  // Brand colors (from index.css)
  brand: {
    primary: 'hsl(var(--primary))',
    primaryForeground: 'hsl(var(--primary-foreground))',
    secondary: 'hsl(var(--secondary))',
    secondaryForeground: 'hsl(var(--secondary-foreground))',
    accent: 'hsl(var(--accent))',
    accentForeground: 'hsl(var(--accent-foreground))',
  },

  // Surfaces
  surface: {
    background: 'hsl(var(--background))',
    foreground: 'hsl(var(--foreground))',
    card: 'hsl(var(--card))',
    cardForeground: 'hsl(var(--card-foreground))',
    popover: 'hsl(var(--popover))',
    popoverForeground: 'hsl(var(--popover-foreground))',
  },

  // Borders
  border: {
    default: 'hsl(var(--border))',
    input: 'hsl(var(--input))',
    ring: 'hsl(var(--ring))',
  },

  // Text
  text: {
    primary: 'hsl(var(--foreground))',
    secondary: 'hsl(var(--muted-foreground))',
    muted: 'hsl(var(--muted-foreground))',
  },

  // Semantic
  semantic: {
    destructive: 'hsl(var(--destructive))',
    destructiveForeground: 'hsl(var(--destructive-foreground))',
    muted: 'hsl(var(--muted))',
    mutedForeground: 'hsl(var(--muted-foreground))',
  },
} as const;

/**
 * Tailwind class names for color usage
 * Use these in className props
 */
export const colorClasses = {
  // Backgrounds
  bgPrimary: 'bg-primary',
  bgSecondary: 'bg-secondary',
  bgAccent: 'bg-accent',
  bgCard: 'bg-card',
  bgMuted: 'bg-muted',
  
  // Text
  textPrimary: 'text-foreground',
  textSecondary: 'text-muted-foreground',
  textAccent: 'text-accent-foreground',
  
  // Borders
  borderDefault: 'border-border',
  borderInput: 'border-input',
  
  // Hover states
  hoverPrimary: 'hover:bg-primary hover:text-primary-foreground',
  hoverSecondary: 'hover:bg-secondary hover:text-secondary-foreground',
  hoverAccent: 'hover:bg-accent hover:text-accent-foreground',
  hoverMuted: 'hover:bg-muted',
} as const;
