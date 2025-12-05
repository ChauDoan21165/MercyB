/**
 * Mercy Domain Map - Phase 7 + Phase 8 (Martial)
 * 
 * Maps room IDs and domains to categories for behavior customization.
 */

export type DomainCategory = 'english' | 'health' | 'strategy' | 'kids' | 'martial' | 'other';

/**
 * English domain patterns
 */
const ENGLISH_PATTERNS = [
  /^english_foundation_/i,
  /^ef[_-]/i,
  /^a1[_-]/i,
  /^a2[_-]/i,
  /^b1[_-]/i,
  /^b2[_-]/i,
  /_english$/i,
  /english_ladder/i,
  /vocabulary/i,
  /grammar/i,
  /pronunciation/i
];

/**
 * Health/healing domain patterns
 */
const HEALTH_PATTERNS = [
  /health/i,
  /healing/i,
  /mental/i,
  /anxiety/i,
  /stress/i,
  /therapy/i,
  /wellness/i,
  /crisis/i,
  /grief/i,
  /trauma/i
];

/**
 * Strategy domain patterns
 */
const STRATEGY_PATTERNS = [
  /strategy/i,
  /strategic/i,
  /leadership/i,
  /business/i,
  /executive/i,
  /vip[789]/i
];

/**
 * Kids domain patterns
 */
const KIDS_PATTERNS = [
  /^kids_/i,
  /kids_l[123]/i,
  /children/i,
  /toddler/i
];

/**
 * Martial arts domain patterns - Phase 8
 */
const MARTIAL_PATTERNS = [
  /martial/i,
  /combat/i,
  /karate/i,
  /judo/i,
  /aikido/i,
  /muay[_-]?thai/i,
  /boxing/i,
  /bjj/i,
  /kung[_-]?fu/i,
  /samurai/i,
  /sword/i,
  /blade/i,
  /kendo/i,
  /taekwondo/i,
  /wushu/i
];

/**
 * Martial arts tags
 */
const MARTIAL_TAGS = ['martial', 'martial_arts', 'combat_sport', 'dojo', 'fighting'];

/**
 * Check if room is in martial arts domain
 */
export function isMartialDomain(
  roomId?: string | null,
  roomDomain?: string | null,
  tags?: string[]
): boolean {
  const id = roomId?.toLowerCase() || '';
  const dom = roomDomain?.toLowerCase() || '';
  
  // Check domain string
  if (dom.includes('martial') || dom.includes('combat') || dom.includes('dojo')) {
    return true;
  }
  
  // Check room ID patterns
  for (const pattern of MARTIAL_PATTERNS) {
    if (pattern.test(id)) return true;
  }
  
  // Check tags
  if (tags) {
    for (const tag of tags) {
      const lowerTag = tag.toLowerCase();
      if (MARTIAL_TAGS.some(mt => lowerTag.includes(mt))) return true;
    }
  }
  
  return false;
}

/**
 * Get domain category from room ID and/or domain string
 */
export function getDomainCategory(
  roomId?: string | null,
  domain?: string | null,
  tags?: string[]
): DomainCategory {
  const id = roomId?.toLowerCase() || '';
  const dom = domain?.toLowerCase() || '';

  // Check domain string first (more reliable)
  if (dom === 'english' || dom === 'english foundation' || dom === 'english foundation ladder') {
    return 'english';
  }
  if (dom === 'health' || dom === 'healing' || dom === 'mental health') {
    return 'health';
  }
  if (dom === 'strategy' || dom === 'leadership' || dom === 'executive') {
    return 'strategy';
  }
  if (dom.includes('kids') || dom.includes('children')) {
    return 'kids';
  }
  
  // Check martial domain (before 'other')
  if (isMartialDomain(roomId, domain, tags)) {
    return 'martial';
  }

  // Check room ID patterns
  for (const pattern of ENGLISH_PATTERNS) {
    if (pattern.test(id)) return 'english';
  }

  for (const pattern of HEALTH_PATTERNS) {
    if (pattern.test(id)) return 'health';
  }

  for (const pattern of STRATEGY_PATTERNS) {
    if (pattern.test(id)) return 'strategy';
  }

  for (const pattern of KIDS_PATTERNS) {
    if (pattern.test(id)) return 'kids';
  }

  return 'other';
}

/**
 * Check if room is in English learning domain
 */
export function isEnglishDomain(
  roomId?: string | null,
  domain?: string | null
): boolean {
  return getDomainCategory(roomId, domain) === 'english';
}

/**
 * Check if room is in health/healing domain (for safety rails)
 */
export function isHealthDomain(
  roomId?: string | null,
  domain?: string | null
): boolean {
  return getDomainCategory(roomId, domain) === 'health';
}

/**
 * Check if room is kids domain
 */
export function isKidsDomain(
  roomId?: string | null,
  domain?: string | null
): boolean {
  return getDomainCategory(roomId, domain) === 'kids';
}

/**
 * Get domain-specific greeting style
 */
export function getDomainGreetingStyle(category: DomainCategory): {
  tone: string;
  maxLength: number;
} {
  switch (category) {
    case 'english':
      return { tone: 'encouraging, educational', maxLength: 120 };
    case 'health':
      return { tone: 'gentle, calming, non-clinical', maxLength: 100 };
    case 'strategy':
      return { tone: 'confident, focused', maxLength: 140 };
    case 'kids':
      return { tone: 'playful, simple, warm', maxLength: 80 };
    case 'martial':
      return { tone: 'calm, disciplined, focused', maxLength: 140 };
    default:
      return { tone: 'warm, friendly', maxLength: 140 };
  }
}
