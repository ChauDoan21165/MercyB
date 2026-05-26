/**
 * Mercy Blade Design System
 * Centralized design tokens and utilities
 * 
 * Import from this file throughout the app:
 * import { colors, spacing, typography } from '@/design-system';
 */

export * from './colors';
export * from './gradients';
export * from './spacing';
export * from './typography';
export * from './shadows';
export * from './radius';

// Re-export commonly used utilities
import { colors, getVipTierColor } from './colors';
import { gradients, getVipTierGradient } from './gradients';
import { space, spaceClasses, componentSpacing } from './spacing';
import { fontSize, fontWeight, text, heading, typographyClasses } from './typography';
import { shadows, shadowClasses, componentShadows } from './shadows';
import { radius, radiusClasses, componentRadius } from './radius';

export const theme = {
  colors,
  gradients,
  space,
  fontSize,
  fontWeight,
  shadows,
  radius,
} as const;

export const classes = {
  space: spaceClasses,
  text,
  heading,
  typography: typographyClasses,
  shadow: shadowClasses,
  radius: radiusClasses,
} as const;

export const components = {
  spacing: componentSpacing,
  typography: typographyClasses,
  shadows: componentShadows,
  radius: componentRadius,
} as const;

export const utils = {
  getVipTierColor,
  getVipTierGradient,
} as const;
