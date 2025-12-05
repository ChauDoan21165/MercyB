/**
 * Mercy Host - Main Module
 * 
 * Central logic for Mercy's hosting behavior across all rooms.
 */

import { FALLBACK_NAMES } from './persona';
import { 
  getGreetingByTier, 
  formatGreeting, 
  getRandomGreeting,
  COLOR_MODE_RESPONSES,
  type GreetingTemplate 
} from './greetings';

export interface MercyHostContext {
  userName: string | null;
  userTier: string;
  roomId: string;
  roomTitle: string;
  language: 'en' | 'vi';
}

export interface MercyGreeting {
  text: string;
  textAlt: string; // alternate language
  isVip: boolean;
}

/**
 * Generate room entry greeting
 */
export function generateRoomGreeting(context: MercyHostContext): MercyGreeting {
  const { userName, userTier, roomTitle, language } = context;
  
  // Use fallback if no name
  const name = userName || (language === 'vi' ? FALLBACK_NAMES.vi : FALLBACK_NAMES.en);
  const altName = userName || (language === 'vi' ? FALLBACK_NAMES.en : FALLBACK_NAMES.vi);
  
  // Get tier-appropriate greeting
  const template = getGreetingByTier(userTier);
  
  // Format for both languages
  const text = formatGreeting(template, name, roomTitle, language);
  const textAlt = formatGreeting(template, altName, roomTitle, language === 'vi' ? 'en' : 'vi');
  
  const isVip = ['vip3', 'vip4', 'vip5', 'vip6', 'vip7', 'vip8', 'vip9'].includes(userTier);
  
  return { text, textAlt, isVip };
}

/**
 * Generate color mode switch response
 * Returns null 70% of the time to avoid being overwhelming
 */
export function generateColorModeResponse(language: 'en' | 'vi'): string | null {
  // Only respond 30% of the time
  if (Math.random() > 0.3) {
    return null;
  }
  
  const template = getRandomGreeting(COLOR_MODE_RESPONSES);
  return language === 'vi' ? template.vi : template.en;
}

/**
 * Get session key for tracking greeting shown state
 */
export function getGreetingSessionKey(roomId: string): string {
  return `mercy_greeting_shown_${roomId}`;
}

/**
 * Check if greeting was already shown for this room in current session
 */
export function wasGreetingShown(roomId: string): boolean {
  try {
    return sessionStorage.getItem(getGreetingSessionKey(roomId)) === 'true';
  } catch {
    return false;
  }
}

/**
 * Mark greeting as shown for this room
 */
export function markGreetingShown(roomId: string): void {
  try {
    sessionStorage.setItem(getGreetingSessionKey(roomId), 'true');
  } catch {
    // Ignore storage errors
  }
}

// Re-export types and utilities
export type { GreetingTemplate };
export { FALLBACK_NAMES };
