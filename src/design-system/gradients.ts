/**
 * Mercy Blade Design System - Gradients
 * Unified gradient token system
 */

export const gradients = {
  // Core gradients
  ocean: 'linear-gradient(135deg, hsl(217 91% 60%), hsl(198 93% 60%))',
  sky: 'linear-gradient(135deg, hsl(198 93% 60%), hsl(262 83% 58%))',
  mystic: 'linear-gradient(135deg, hsl(280 65% 60%), hsl(340 82% 52%))',
  sunset: 'linear-gradient(135deg, hsl(32 95% 44%), hsl(346 77% 50%))',
  forest: 'linear-gradient(135deg, hsl(142 76% 36%), hsl(158 64% 52%))',
  royal: 'linear-gradient(135deg, hsl(280 65% 60%), hsl(217 91% 60%))',
  fire: 'linear-gradient(135deg, hsl(25 95% 53%), hsl(346 77% 50%))',
  
  // VIP tier gradients
  level1: 'linear-gradient(135deg, hsl(346 77% 50%), hsl(340 82% 52%))',
  level2: 'linear-gradient(135deg, hsl(217 91% 60%), hsl(198 93% 60%))',
  level3: 'linear-gradient(135deg, hsl(142 76% 36%), hsl(158 64% 52%))',
  level4: 'linear-gradient(135deg, hsl(280 65% 60%), hsl(262 83% 58%))',
  level5: 'linear-gradient(135deg, hsl(32 95% 44%), hsl(25 95% 53%))',
  level6: 'linear-gradient(135deg, hsl(340 82% 52%), hsl(280 65% 60%))',
  level7: 'linear-gradient(135deg, hsl(198 93% 60%), hsl(217 91% 60%))',
  level8: 'linear-gradient(135deg, hsl(25 95% 53%), hsl(32 95% 44%))',
  level9: 'linear-gradient(135deg, hsl(222 47% 11%), hsl(215 28% 17%))',
  kids: 'linear-gradient(135deg, hsl(262 83% 58%), hsl(280 65% 60%))',
  level0: 'linear-gradient(135deg, hsl(214 95% 54%), hsl(217 91% 60%))',

  // Subtle background gradients
  subtle: 'linear-gradient(180deg, hsl(var(--background)), hsl(var(--muted)))',
  cardGlow: 'linear-gradient(135deg, hsl(var(--card)) 0%, hsl(var(--muted)) 100%)',
  
  // Special effects
  shimmer: 'linear-gradient(90deg, transparent, hsl(0 0% 100% / 0.3), transparent)',
  glow: 'radial-gradient(circle at 50% 0%, hsl(var(--primary) / 0.15), transparent)',
} as const;

/**
 * Get gradient by tier
 */
export const getVipTierGradient = (tier: string): string => {
  const tierLower = tier.toLowerCase();
  if (tierLower.includes('level1')) return gradients.level1;
  if (tierLower.includes('level2')) return gradients.level2;
  if (tierLower.includes('level3')) return gradients.level3;
  if (tierLower.includes('level4')) return gradients.level4;
  if (tierLower.includes('level5')) return gradients.level5;
  if (tierLower.includes('level6')) return gradients.level6;
  if (tierLower.includes('level7')) return gradients.level7;
  if (tierLower.includes('level8')) return gradients.level8;
  if (tierLower.includes('level9')) return gradients.level9;
  if (tierLower.includes('kids')) return gradients.kids;
  if (tierLower.includes('level0')) return gradients.level0;
  return gradients.ocean;
};

/**
 * Tailwind gradient classes
 */
export const gradientClasses = {
  ocean: 'bg-gradient-to-br from-blue-500 to-cyan-500',
  sky: 'bg-gradient-to-br from-cyan-500 to-purple-500',
  mystic: 'bg-gradient-to-br from-purple-500 to-pink-500',
  sunset: 'bg-gradient-to-br from-orange-500 to-red-500',
  forest: 'bg-gradient-to-br from-green-600 to-emerald-500',
  royal: 'bg-gradient-to-br from-purple-500 to-blue-500',
  fire: 'bg-gradient-to-br from-amber-500 to-red-500',
} as const;
