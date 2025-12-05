/**
 * Mercy Engine Validation Layer
 * 
 * Ensures all engine methods exist and respond correctly.
 */

import type { MercyEngine } from './engine';
import { getTierScript } from './tierScripts';
import { getVoiceLineByTrigger } from './voicePack';
import { getAnimationForEvent, MERCY_EVENTS } from './eventMap';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate that engine has all required methods
 */
export function validateEngine(engine: Partial<MercyEngine>): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required methods
  const requiredMethods = [
    'init',
    'greet',
    'onEnterRoom',
    'onReturnRoom',
    'onTierChange',
    'onEvent',
    'setEnabled',
    'setAvatarStyle',
    'setLanguage',
    'setUserName',
    'dismiss',
    'show',
    'trackAnalytics'
  ];

  requiredMethods.forEach(method => {
    if (typeof (engine as Record<string, unknown>)[method] !== 'function') {
      errors.push(`Missing required method: ${method}`);
    }
  });

  // Required state properties
  const requiredState = [
    'isEnabled',
    'presenceState',
    'avatarStyle',
    'language',
    'currentTier',
    'currentTone'
  ];

  requiredState.forEach(prop => {
    if ((engine as Record<string, unknown>)[prop] === undefined) {
      warnings.push(`Missing state property: ${prop}`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate all tiers have scripts
 */
export function validateTierScripts(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const allTiers = ['free', 'vip1', 'vip2', 'vip3', 'vip4', 'vip5', 'vip6', 'vip7', 'vip8', 'vip9'];

  allTiers.forEach(tier => {
    const script = getTierScript(tier);
    
    if (!script) {
      errors.push(`No script for tier: ${tier}`);
      return;
    }

    if (!script.tone) {
      errors.push(`No tone defined for tier: ${tier}`);
    }

    if (!script.greetings || script.greetings.length === 0) {
      errors.push(`No greetings for tier: ${tier}`);
    }

    if (!script.encouragements || script.encouragements.length === 0) {
      warnings.push(`No encouragements for tier: ${tier}`);
    }

    // Validate each greeting has both languages
    script.greetings?.forEach((greeting, idx) => {
      if (!greeting.en) {
        errors.push(`Tier ${tier} greeting[${idx}] missing EN`);
      }
      if (!greeting.vi) {
        errors.push(`Tier ${tier} greeting[${idx}] missing VI`);
      }
    });
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate voice pack covers all triggers
 */
export function validateVoicePack(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const triggers = ['room_enter', 'entry_complete', 'color_toggle', 'return_inactive', 'encouragement'] as const;

  triggers.forEach(trigger => {
    try {
      const line = getVoiceLineByTrigger(trigger);
      
      if (!line) {
        errors.push(`No voice line for trigger: ${trigger}`);
        return;
      }

      if (!line.en) {
        errors.push(`Voice line for ${trigger} missing EN text`);
      }
      if (!line.vi) {
        errors.push(`Voice line for ${trigger} missing VI text`);
      }

      // Audio paths are optional but warn if missing
      if (!line.audioEn) {
        warnings.push(`Voice line for ${trigger} missing EN audio path`);
      }
      if (!line.audioVi) {
        warnings.push(`Voice line for ${trigger} missing VI audio path`);
      }
    } catch (e) {
      errors.push(`Error getting voice line for trigger: ${trigger}`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate all events have animations
 */
export function validateEventMap(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  MERCY_EVENTS.forEach(event => {
    const animation = getAnimationForEvent(event);
    
    if (!animation) {
      warnings.push(`No animation mapped for event: ${event}`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Run full validation suite
 */
export function runFullValidation(engine?: Partial<MercyEngine>): {
  overall: boolean;
  engine: ValidationResult | null;
  tiers: ValidationResult;
  voicePack: ValidationResult;
  eventMap: ValidationResult;
} {
  const tierResult = validateTierScripts();
  const voiceResult = validateVoicePack();
  const eventResult = validateEventMap();
  const engineResult = engine ? validateEngine(engine) : null;

  const overall = 
    tierResult.valid && 
    voiceResult.valid && 
    eventResult.valid && 
    (engineResult?.valid ?? true);

  // Log errors to console in development
  if (!overall) {
    console.error('[Mercy Validation] Validation failed:');
    
    if (engineResult && !engineResult.valid) {
      console.error('Engine errors:', engineResult.errors);
    }
    if (!tierResult.valid) {
      console.error('Tier errors:', tierResult.errors);
    }
    if (!voiceResult.valid) {
      console.error('Voice errors:', voiceResult.errors);
    }
    if (!eventResult.valid) {
      console.error('Event errors:', eventResult.errors);
    }
  }

  return {
    overall,
    engine: engineResult,
    tiers: tierResult,
    voicePack: voiceResult,
    eventMap: eventResult
  };
}

/**
 * Soft fallback messages when something fails
 */
export const FALLBACK_MESSAGES = {
  en: "I'm here with you. Something didn't load, but I'll continue guiding you.",
  vi: "Mình ở đây với bạn. Có gì đó không tải được, nhưng mình sẽ tiếp tục hướng dẫn bạn."
};

/**
 * Get fallback message for errors
 */
export function getFallbackMessage(language: 'en' | 'vi'): string {
  return FALLBACK_MESSAGES[language];
}
