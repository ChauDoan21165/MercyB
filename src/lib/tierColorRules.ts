/**
 * Mercy Blade Color Theme Rules
 * 
 * CORE RULE:
 * - VIP1-VIP3: Colorful (rainbow healing aesthetic)
 * - VIP6-VIP9: Strict black & white (serious/professional)
 * - Header/logo/tier badges/music player/kids UI/admin tools: Always rainbow
 */

import { TierId } from './constants/tiers';

export type ColorMode = 'colorful' | 'monochrome';

/**
 * Determine if a tier uses colorful or monochrome theme
 */
export function getTierColorMode(tierId: TierId): ColorMode {
  // VIP6-VIP9 are serious tiers - monochrome only
  if (['vip6', 'vip7', 'vip8', 'vip9'].includes(tierId)) {
    return 'monochrome';
  }
  
  // VIP1-VIP5, Kids, Free - colorful
  return 'colorful';
}

/**
 * Check if tier should use colorful theme
 */
export function isColorfulTier(tierId: TierId): boolean {
  return getTierColorMode(tierId) === 'colorful';
}

/**
 * Check if tier should use monochrome theme
 */
export function isMonochromeTier(tierId: TierId): boolean {
  return getTierColorMode(tierId) === 'monochrome';
}

/**
 * Essay highlight colors for colorful tiers (VIP1-VIP3)
 * Used for highlighting emotional/healing/spiritual terms
 */
export const COLORFUL_HIGHLIGHT_CLASSES = {
  joy: 'bg-yellow-100 text-yellow-700',
  warmth: 'bg-orange-100 text-orange-700',
  peace: 'bg-green-100 text-green-700',
  strength: 'bg-blue-100 text-blue-700',
  awareness: 'bg-purple-100 text-purple-700',
  gratitude: 'bg-pink-100 text-pink-700',
  honesty: 'bg-cyan-100 text-cyan-700',
  freedom: 'bg-teal-100 text-teal-700',
  action: 'bg-lime-100 text-lime-700',
  connection: 'bg-rose-100 text-rose-700',
} as const;

/**
 * Monochrome highlight styles for serious tiers (VIP6-VIP9)
 * Only gray highlight, bold, italic, underline allowed
 */
export const MONOCHROME_HIGHLIGHT_CLASS = 'bg-gray-100 text-gray-900 font-medium';

/**
 * Get appropriate highlight class based on tier
 */
export function getHighlightClass(tierId: TierId, emotionType?: keyof typeof COLORFUL_HIGHLIGHT_CLASSES): string {
  if (isMonochromeTier(tierId)) {
    return MONOCHROME_HIGHLIGHT_CLASS;
  }
  
  if (emotionType && COLORFUL_HIGHLIGHT_CLASSES[emotionType]) {
    return COLORFUL_HIGHLIGHT_CLASSES[emotionType];
  }
  
  // Default colorful highlight
  return 'bg-blue-100 text-blue-700';
}

/**
 * Card styling based on tier color mode
 */
export function getCardStyles(tierId: TierId) {
  const isColorful = isColorfulTier(tierId);
  
  return {
    background: isColorful ? 'bg-white/70 backdrop-blur-md' : 'bg-white',
    border: isColorful ? 'border border-gray-200' : 'border border-gray-300',
    shadow: isColorful ? 'shadow-md hover:shadow-lg' : 'shadow-sm hover:shadow-md',
    text: isColorful ? 'text-foreground' : 'text-black',
  };
}

/**
 * Keyword pill styling based on tier color mode
 */
export function getKeywordPillStyles(tierId: TierId) {
  const isColorful = isColorfulTier(tierId);
  
  return {
    base: isColorful
      ? 'bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700 border-purple-200'
      : 'bg-white text-black border-gray-300 font-semibold',
    hover: isColorful
      ? 'hover:from-pink-200 hover:to-purple-200'
      : 'hover:bg-gray-50',
  };
}
