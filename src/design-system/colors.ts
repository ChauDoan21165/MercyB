/**
 * Mercy Blade Design System - Colors
 * Centralized color token system with semantic naming
 * All colors use HSL format for easy theming
 */

export const colors = {
  // Core brand colors
  primary: 'hsl(var(--primary))',
  primaryForeground: 'hsl(var(--primary-foreground))',
  secondary: 'hsl(var(--secondary))',
  secondaryForeground: 'hsl(var(--secondary-foreground))',
  accent: 'hsl(var(--accent))',
  accentForeground: 'hsl(var(--accent-foreground))',

  // Surface colors
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  card: 'hsl(var(--card))',
  cardForeground: 'hsl(var(--card-foreground))',
  popover: 'hsl(var(--popover))',
  popoverForeground: 'hsl(var(--popover-foreground))',
  muted: 'hsl(var(--muted))',
  mutedForeground: 'hsl(var(--muted-foreground))',

  // Border colors
  border: 'hsl(var(--border))',
  input: 'hsl(var(--input))',
  ring: 'hsl(var(--ring))',

  // Semantic colors
  destructive: 'hsl(var(--destructive))',
  destructiveForeground: 'hsl(var(--destructive-foreground))',
  success: 'hsl(142 76% 36%)',
  successForeground: 'hsl(0 0% 100%)',
  warning: 'hsl(38 92% 50%)',
  warningForeground: 'hsl(0 0% 0%)',
  error: 'hsl(var(--destructive))',
  errorForeground: 'hsl(var(--destructive-foreground))',

  // VIP Tier colors (semantic colors for each tier)
  vip1: {
    primary: 'hsl(346 77% 50%)', // Deep red
    foreground: 'hsl(0 0% 100%)',
    background: 'hsl(346 77% 97%)',
  },
  vip2: {
    primary: 'hsl(217 91% 60%)', // Royal blue
    foreground: 'hsl(0 0% 100%)',
    background: 'hsl(217 91% 97%)',
  },
  vip3: {
    primary: 'hsl(142 76% 36%)', // Emerald green
    foreground: 'hsl(0 0% 100%)',
    background: 'hsl(142 76% 97%)',
  },
  vip4: {
    primary: 'hsl(280 65% 60%)', // Purple
    foreground: 'hsl(0 0% 100%)',
    background: 'hsl(280 65% 97%)',
  },
  vip5: {
    primary: 'hsl(32 95% 44%)', // Orange
    foreground: 'hsl(0 0% 100%)',
    background: 'hsl(32 95% 97%)',
  },
  vip6: {
    primary: 'hsl(340 82% 52%)', // Magenta
    foreground: 'hsl(0 0% 100%)',
    background: 'hsl(340 82% 97%)',
  },
  vip7: {
    primary: 'hsl(198 93% 60%)', // Cyan
    foreground: 'hsl(0 0% 100%)',
    background: 'hsl(198 93% 97%)',
  },
  vip8: {
    primary: 'hsl(25 95% 53%)', // Amber
    foreground: 'hsl(0 0% 0%)',
    background: 'hsl(25 95% 97%)',
  },
  vip9: {
    primary: 'hsl(222 47% 11%)', // Dark slate (executive)
    foreground: 'hsl(0 0% 100%)',
    background: 'hsl(222 47% 97%)',
  },
  kids: {
    primary: 'hsl(262 83% 58%)', // Playful purple
    foreground: 'hsl(0 0% 100%)',
    background: 'hsl(262 83% 97%)',
  },
  free: {
    primary: 'hsl(214 95% 54%)', // Bright blue
    foreground: 'hsl(0 0% 100%)',
    background: 'hsl(214 95% 97%)',
  },
} as const;

/**
 * VIP tier color mapping helper
 */
export const getVipTierColor = (tier: string) => {
  const tierLower = tier.toLowerCase();
  if (tierLower.includes('vip1')) return colors.vip1;
  if (tierLower.includes('vip2')) return colors.vip2;
  if (tierLower.includes('vip3')) return colors.vip3;
  if (tierLower.includes('vip4')) return colors.vip4;
  if (tierLower.includes('vip5')) return colors.vip5;
  if (tierLower.includes('vip6')) return colors.vip6;
  if (tierLower.includes('vip7')) return colors.vip7;
  if (tierLower.includes('vip8')) return colors.vip8;
  if (tierLower.includes('vip9')) return colors.vip9;
  if (tierLower.includes('kids')) return colors.kids;
  if (tierLower.includes('free')) return colors.free;
  return colors.primary;
};

/**
 * Tailwind CSS variable mapping
 */
export const cssVars = {
  primary: 'var(--primary)',
  primaryForeground: 'var(--primary-foreground)',
  secondary: 'var(--secondary)',
  secondaryForeground: 'var(--secondary-foreground)',
  accent: 'var(--accent)',
  accentForeground: 'var(--accent-foreground)',
  background: 'var(--background)',
  foreground: 'var(--foreground)',
  card: 'var(--card)',
  cardForeground: 'var(--card-foreground)',
  border: 'var(--border)',
  input: 'var(--input)',
  ring: 'var(--ring)',
  muted: 'var(--muted)',
  mutedForeground: 'var(--muted-foreground)',
  destructive: 'var(--destructive)',
  destructiveForeground: 'var(--destructive-foreground)',
} as const;
