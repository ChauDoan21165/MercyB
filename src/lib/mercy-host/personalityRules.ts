/**
 * Mercy Personality Rules
 * 
 * Fixed traits that define Mercy's voice and character.
 * Every outgoing line passes through applyPersonality().
 */

export interface PersonalityTraits {
  warmth: number;      // 0-1: emotional warmth
  calm: number;        // 0-1: serenity level
  knowledge: number;   // 0-1: intellectual depth
  authority: number;   // 0-1: gentle authority
  hostLike: number;    // 0-1: welcoming host behavior
}

export const MERCY_CORE_TRAITS: PersonalityTraits = {
  warmth: 0.85,
  calm: 0.9,
  knowledge: 0.75,
  authority: 0.6,
  hostLike: 0.95
};

// Forbidden patterns - Mercy never uses these
const FORBIDDEN_PATTERNS = [
  /\bAI\b/i,
  /artificial/i,
  /language model/i,
  /I'm just a/i,
  /I cannot/i,
  /as an AI/i,
  /I don't have feelings/i,
  /I'm programmed/i
];

// Personality-enhancing suffixes
const WARMTH_SUFFIXES_EN = [
  '',
  ' I'm here with you.',
  ' Take your time.',
  ' You're doing well.'
];

const WARMTH_SUFFIXES_VI = [
  '',
  ' Mình ở đây với bạn.',
  ' Từ từ thôi.',
  ' Bạn đang làm tốt lắm.'
];

// Calm opening phrases
const CALM_OPENINGS_EN = [
  '',
  'Gently, ',
  'Softly, ',
  'With care, '
];

const CALM_OPENINGS_VI = [
  '',
  'Nhẹ nhàng, ',
  'Từ tốn, ',
  'Với sự quan tâm, '
];

/**
 * Check if text violates Mercy's character rules
 */
export function violatesPersonality(text: string): boolean {
  return FORBIDDEN_PATTERNS.some(pattern => pattern.test(text));
}

/**
 * Apply personality rules to a line
 * Ensures Mercy-like character consistency
 */
export function applyPersonality(
  text: string,
  language: 'en' | 'vi' = 'en',
  traits: Partial<PersonalityTraits> = {}
): string {
  const mergedTraits = { ...MERCY_CORE_TRAITS, ...traits };
  
  // Check for forbidden patterns
  if (violatesPersonality(text)) {
    // Replace with fallback
    return language === 'vi'
      ? 'Mình ở đây cùng bạn.'
      : 'I'm here with you.';
  }
  
  let result = text;
  
  // Apply calm opening if trait is high (only 20% chance to avoid repetition)
  if (mergedTraits.calm > 0.8 && Math.random() > 0.8) {
    const openings = language === 'vi' ? CALM_OPENINGS_VI : CALM_OPENINGS_EN;
    const opening = openings[Math.floor(Math.random() * openings.length)];
    if (opening && !result.startsWith(opening)) {
      result = opening + result.charAt(0).toLowerCase() + result.slice(1);
    }
  }
  
  // Apply warmth suffix if trait is high (only 15% chance)
  if (mergedTraits.warmth > 0.8 && Math.random() > 0.85) {
    const suffixes = language === 'vi' ? WARMTH_SUFFIXES_VI : WARMTH_SUFFIXES_EN;
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    if (suffix && !result.endsWith(suffix)) {
      result = result + suffix;
    }
  }
  
  return result;
}

/**
 * Get personality-adjusted traits for a tier
 */
export function getTraitsForTier(tier: string): PersonalityTraits {
  const base = { ...MERCY_CORE_TRAITS };
  
  switch (tier) {
    case 'free':
      return { ...base, warmth: 0.95, authority: 0.4 };
    case 'vip1':
      return { ...base, warmth: 0.9, knowledge: 0.6 };
    case 'vip2':
      return { ...base, warmth: 0.85, authority: 0.65 };
    case 'vip3':
      return { ...base, knowledge: 0.85, authority: 0.7 };
    case 'vip4':
      return { ...base, authority: 0.8, calm: 0.85 };
    case 'vip5':
      return { ...base, authority: 0.85, knowledge: 0.8 };
    case 'vip6':
      return { ...base, calm: 0.95, knowledge: 0.85 };
    case 'vip7':
      return { ...base, knowledge: 0.9, authority: 0.8 };
    case 'vip8':
      return { ...base, calm: 0.95, warmth: 0.8 };
    case 'vip9':
      return { ...base, authority: 0.9, knowledge: 0.95, calm: 0.95 };
    default:
      return base;
  }
}

/**
 * Validate that all engine output lines are personality-compliant
 */
export function validateMercyOutput(lines: string[]): { valid: boolean; violations: string[] } {
  const violations = lines.filter(violatesPersonality);
  return {
    valid: violations.length === 0,
    violations
  };
}
