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
  vip1: 'linear-gradient(135deg, hsl(346 77% 50%), hsl(340 82% 52%))',
  vip2: 'linear-gradient(135deg, hsl(217 91% 60%), hsl(198 93% 60%))',
  vip3: 'linear-gradient(135deg, hsl(142 76% 36%), hsl(158 64% 52%))',
  vip4: 'linear-gradient(135deg, hsl(280 65% 60%), hsl(262 83% 58%))',
  vip5: 'linear-gradient(135deg, hsl(32 95% 44%), hsl(25 95% 53%))',
  vip6: 'linear-gradient(135deg, hsl(340 82% 52%), hsl(280 65% 60%))',
  vip7: 'linear-gradient(135deg, hsl(198 93% 60%), hsl(217 91% 60%))',
  vip8: 'linear-gradient(135deg, hsl(25 95% 53%), hsl(32 95% 44%))',
  vip9: 'linear-gradient(135deg, hsl(222 47% 11%), hsl(215 28% 17%))',
  kids: 'linear-gradient(135deg, hsl(262 83% 58%), hsl(280 65% 60%))',
  free: 'linear-gradient(135deg, hsl(214 95% 54%), hsl(217 91% 60%))',

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
  if (tierLower.includes('vip1')) return gradients.vip1;
  if (tierLower.includes('vip2')) return gradients.vip2;
  if (tierLower.includes('vip3')) return gradients.vip3;
  if (tierLower.includes('vip4')) return gradients.vip4;
  if (tierLower.includes('vip5')) return gradients.vip5;
  if (tierLower.includes('vip6')) return gradients.vip6;
  if (tierLower.includes('vip7')) return gradients.vip7;
  if (tierLower.includes('vip8')) return gradients.vip8;
  if (tierLower.includes('vip9')) return gradients.vip9;
  if (tierLower.includes('kids')) return gradients.kids;
  if (tierLower.includes('free')) return gradients.free;
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
