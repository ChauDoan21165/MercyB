/**
 * Mercy Host Event Map
 * 
 * Maps engine events to animations and behaviors.
 */

export type MercyEventType = 
  | 'room_enter'
  | 'room_exit'
  | 'entry_click'
  | 'entry_complete'
  | 'color_toggle'
  | 'tier_unlock'
  | 'vip_upgrade'
  | 'achievement'
  | 'first_visit'
  | 'return_inactive'
  | 'scroll_reflection'
  | 'favorite_add'
  | 'audio_play'
  | 'audio_complete';

export type MercyAnimationType = 
  | 'halo'
  | 'shimmer'
  | 'spark'
  | 'ripple'
  | 'glow'
  | null;

/**
 * Event to Animation mapping
 */
const EVENT_ANIMATION_MAP: Record<MercyEventType, MercyAnimationType> = {
  room_enter: 'halo',
  room_exit: null,
  entry_click: 'spark',
  entry_complete: 'shimmer',
  color_toggle: 'glow',
  tier_unlock: 'spark',
  vip_upgrade: 'shimmer',
  achievement: 'spark',
  first_visit: 'glow',
  return_inactive: 'ripple',
  scroll_reflection: 'halo',
  favorite_add: 'spark',
  audio_play: 'halo',
  audio_complete: 'shimmer'
};

/**
 * Get animation for event (with fallback for unrecognized events)
 */
export function getAnimationForEvent(event: MercyEventType | string): MercyAnimationType {
  if (event in EVENT_ANIMATION_MAP) {
    return EVENT_ANIMATION_MAP[event as MercyEventType];
  }
  
  // Log unrecognized event
  console.warn(`[MercyEventMap] Unrecognized event: ${event}, using fallback animation`);
  return 'halo'; // Fallback animation
}

/**
 * Event priority for overlapping events
 */
const EVENT_PRIORITY: Record<MercyEventType, number> = {
  vip_upgrade: 10,
  tier_unlock: 9,
  achievement: 8,
  first_visit: 7,
  room_enter: 6,
  return_inactive: 5,
  entry_complete: 4,
  entry_click: 3,
  color_toggle: 2,
  audio_complete: 2,
  audio_play: 1,
  scroll_reflection: 1,
  favorite_add: 1,
  room_exit: 0
};

/**
 * Get higher priority event
 */
export function getHigherPriorityEvent(
  eventA: MercyEventType,
  eventB: MercyEventType
): MercyEventType {
  return EVENT_PRIORITY[eventA] >= EVENT_PRIORITY[eventB] ? eventA : eventB;
}

/**
 * Should event trigger voice?
 */
export function shouldTriggerVoice(event: MercyEventType): boolean {
  return [
    'room_enter',
    'entry_complete',
    'color_toggle',
    'tier_unlock',
    'vip_upgrade',
    'return_inactive'
  ].includes(event);
}

/**
 * Get voice trigger type for event (with fallback for unrecognized)
 */
export function getVoiceTriggerForEvent(
  event: MercyEventType | string
): 'room_enter' | 'entry_complete' | 'color_toggle' | 'return_inactive' | 'encouragement' | null {
  switch (event) {
    case 'room_enter':
    case 'first_visit':
      return 'room_enter';
    case 'entry_complete':
    case 'audio_complete':
      return 'entry_complete';
    case 'color_toggle':
      return 'color_toggle';
    case 'return_inactive':
      return 'return_inactive';
    case 'tier_unlock':
    case 'vip_upgrade':
    case 'achievement':
      return 'encouragement';
    default:
      // Log unrecognized event
      if (typeof event === 'string' && !Object.keys(EVENT_ANIMATION_MAP).includes(event)) {
        console.warn(`[MercyEventMap] Unrecognized event for voice: ${event}, using comfort fallback`);
      }
      return 'encouragement'; // Fallback to comfort/encouragement
  }
}
