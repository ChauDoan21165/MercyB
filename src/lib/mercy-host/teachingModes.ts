/**
 * Mercy Teaching Modes
 *
 * Canonical teaching modes for Mercy Host.
 *
 * Purpose:
 * - keep teaching intent explicit and reusable
 * - separate "what Mercy is doing" from tone/personality
 * - give planners and scripts a shared vocabulary
 * - allow planner + strategies to reason about teaching intent
 */

export type ToneStyle = 'calm' | 'warm' | 'playful' | 'firm';

export type TeachingMode =
  | 'explain'
  | 'correct'
  | 'encourage'
  | 'challenge'
  | 'drill'
  | 'recap'
  | 'review';

export type TeachingModeCategory =
  | 'instruction'
  | 'correction'
  | 'practice'
  | 'reinforcement';

export interface TeachingModeProfile {
  mode: TeachingMode;
  label: string;
  category: TeachingModeCategory;

  /**
   * Short description of the teacher goal
   */
  goal: string;

  /**
   * Default tone if planner does not override
   */
  defaultTone: ToneStyle;

  /**
   * Delivery hints
   */
  shouldBeBrief: boolean;
  shouldUseHumorByDefault: boolean;
  acknowledgeEffortByDefault: boolean;
  addNextStepByDefault: boolean;
}

export const TEACHING_MODE_PROFILES: Record<
  TeachingMode,
  TeachingModeProfile
> = {
  explain: {
    mode: 'explain',
    label: 'Explain',
    category: 'instruction',
    goal: 'Clarify the rule, pattern, or concept.',
    defaultTone: 'calm',
    shouldBeBrief: false,
    shouldUseHumorByDefault: false,
    acknowledgeEffortByDefault: false,
    addNextStepByDefault: true,
  },

  correct: {
    mode: 'correct',
    label: 'Correct',
    category: 'correction',
    goal: 'Fix the most useful mistake and guide retry.',
    defaultTone: 'calm',
    shouldBeBrief: true,
    shouldUseHumorByDefault: false,
    acknowledgeEffortByDefault: true,
    addNextStepByDefault: true,
  },

  encourage: {
    mode: 'encourage',
    label: 'Encourage',
    category: 'reinforcement',
    goal: 'Reinforce momentum and confidence.',
    defaultTone: 'warm',
    shouldBeBrief: true,
    shouldUseHumorByDefault: false,
    acknowledgeEffortByDefault: true,
    addNextStepByDefault: true,
  },

  challenge: {
    mode: 'challenge',
    label: 'Challenge',
    category: 'practice',
    goal: 'Raise difficulty slightly and keep momentum alive.',
    defaultTone: 'firm',
    shouldBeBrief: true,
    shouldUseHumorByDefault: false,
    acknowledgeEffortByDefault: false,
    addNextStepByDefault: true,
  },

  drill: {
    mode: 'drill',
    label: 'Drill',
    category: 'practice',
    goal: 'Build repetition and automaticity through focused practice.',
    defaultTone: 'firm',
    shouldBeBrief: true,
    shouldUseHumorByDefault: false,
    acknowledgeEffortByDefault: false,
    addNextStepByDefault: true,
  },

  recap: {
    mode: 'recap',
    label: 'Recap',
    category: 'reinforcement',
    goal: 'Summarize what was learned and reinforce retention.',
    defaultTone: 'calm',
    shouldBeBrief: false,
    shouldUseHumorByDefault: false,
    acknowledgeEffortByDefault: true,
    addNextStepByDefault: true,
  },

  review: {
    mode: 'review',
    label: 'Review',
    category: 'practice',
    goal: 'Revisit weak material before moving forward.',
    defaultTone: 'calm',
    shouldBeBrief: false,
    shouldUseHumorByDefault: false,
    acknowledgeEffortByDefault: true,
    addNextStepByDefault: true,
  },
};

/**
 * Get profile for a teaching mode
 */
export function getTeachingModeProfile(
  mode: TeachingMode
): TeachingModeProfile {
  return TEACHING_MODE_PROFILES[mode];
}

/**
 * Safe lookup (avoids undefined crashes)
 */
export function getTeachingModeProfileSafe(
  mode?: TeachingMode | null
): TeachingModeProfile {
  if (!mode || !TEACHING_MODE_PROFILES[mode]) {
    return TEACHING_MODE_PROFILES.encourage;
  }

  return TEACHING_MODE_PROFILES[mode];
}

/**
 * List all teaching mode profiles
 */
export function getAllTeachingModeProfiles(): TeachingModeProfile[] {
  return Object.values(TEACHING_MODE_PROFILES);
}

/**
 * Mode classification helpers
 */

export function isInstructionMode(mode: TeachingMode): boolean {
  return TEACHING_MODE_PROFILES[mode].category === 'instruction';
}

export function isCorrectionMode(mode: TeachingMode): boolean {
  return TEACHING_MODE_PROFILES[mode].category === 'correction';
}

export function isPracticeMode(mode: TeachingMode): boolean {
  return TEACHING_MODE_PROFILES[mode].category === 'practice';
}

export function isReinforcementMode(mode: TeachingMode): boolean {
  return TEACHING_MODE_PROFILES[mode].category === 'reinforcement';
}

/**
 * Planner helper:
 * Suggest a natural follow-up mode
 */
export function suggestNextMode(mode: TeachingMode): TeachingMode {
  switch (mode) {
    case 'explain':
      return 'drill';

    case 'correct':
      return 'drill';

    case 'drill':
      return 'challenge';

    case 'challenge':
      return 'encourage';

    case 'review':
      return 'drill';

    case 'recap':
      return 'encourage';

    default:
      return 'encourage';
  }
}