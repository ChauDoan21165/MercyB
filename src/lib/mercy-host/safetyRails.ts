/**
 * Mercy Safety Rails - Phase 5
 * 
 * Crisis/heavy room detection and safe response enforcement.
 */

import type { EmotionState } from './emotionModel';

// Tags/domains where Mercy must be extra gentle
export const CRISIS_TAGS = [
  'crisis',
  'suicidal_ideation',
  'suicide',
  'trauma',
  'grief',
  'depression',
  'anxiety',
  'abuse',
  'self_harm',
  'loss',
  'mental_health',
  'healing'
];

// Safe emotion band for crisis rooms
export const SAFE_EMOTIONS: EmotionState[] = ['neutral', 'low_mood'];

// Disallowed emotions in crisis rooms
export const DISALLOWED_CRISIS_EMOTIONS: EmotionState[] = [
  'celebrating',
  'focused'
];

/**
 * Check if a room is a crisis/heavy room
 */
export function isCrisisRoom(tags?: string[], domain?: string): boolean {
  if (!tags && !domain) return false;
  
  const allTags = [...(tags || [])];
  if (domain) allTags.push(domain.toLowerCase());
  
  return allTags.some(tag => 
    CRISIS_TAGS.some(crisisTag => 
      tag.toLowerCase().includes(crisisTag)
    )
  );
}

/**
 * Force emotion into safe band for crisis rooms
 */
export function enforceSafeEmotion(emotion: EmotionState, isCrisis: boolean): EmotionState {
  if (!isCrisis) return emotion;
  
  // If emotion is disallowed, force to neutral or low_mood_supportive
  if (DISALLOWED_CRISIS_EMOTIONS.includes(emotion)) {
    return 'neutral';
  }
  
  // Map high-energy emotions to calmer ones
  if (emotion === 'stressed') return 'low_mood';
  if (emotion === 'confused') return 'neutral';
  if (emotion === 'returning_after_gap') return 'neutral';
  
  return emotion;
}

/**
 * Check if a script trigger is safe for crisis rooms
 */
export function isSafeTrigger(trigger: string, isCrisis: boolean): boolean {
  if (!isCrisis) return true;
  
  // Disallow celebratory/hype triggers in crisis rooms
  const unsafeTriggers = [
    'celebrating',
    'milestone_complete',
    'tier_unlock',
    'vip_upgrade',
    'achievement'
  ];
  
  return !unsafeTriggers.includes(trigger);
}

/**
 * Get safe fallback message for crisis rooms
 */
export function getSafeFallback(language: 'en' | 'vi'): { en: string; vi: string } {
  return {
    en: "I'm here with you. Take all the time you need.",
    vi: "Mình ở đây với bạn. Hãy dành thời gian bạn cần."
  };
}

/**
 * Validate that a script is appropriate for crisis rooms
 */
export function validateCrisisScript(text: string): boolean {
  // Check for inappropriate words/phrases in crisis context
  const inappropriatePatterns = [
    /celebrate/i,
    /amazing/i,
    /incredible/i,
    /awesome/i,
    /fantastic/i,
    /great job/i,
    /tuyệt vời/i,
    /xuất sắc/i,
    /ăn mừng/i
  ];
  
  return !inappropriatePatterns.some(pattern => pattern.test(text));
}
