/**
 * FILE: src/lib/mercy-host/index.ts
 * VERSION: index.ts v1.3
 *
 * Mercy Host Module - Public API
 * Phase 7: User Logs, English Teacher Mode
 * Phase 8: Martial Coach
 */

// Core
export * from './persona';
export * from './greetings';
export * from './mercyHost';
export * from './tierScripts';
export * from './voicePack';
export * from './avatarStyles';
export * from './types';
export * from './eventMap';
export * from './personalityRules';

// Engine
export type { RitualIntensity } from './engine';

// Phase 4: Stability
export * from './memory';
export * from './hostSignal';
export * from './heartbeat';
export * from './eventLimiter';
// NOTE:
// Removed wildcard export of "./validation"
// because ValidationResult is already exported from "./types"
// which causes TS2308 duplicate export errors.

// Phase 5: Emotion Engine
// NOTE:
// Removed wildcard export of "./emotionModel"
// because EmotionState is already exported from "./types".
export * from './safetyRails';

// Phase 6: Rituals & Ceremonies
export * from './rituals';
export * from './vipCeremonies';

// Phase 7: Logs, Domain Detection, Teacher
export * from './logs';

export {
  getDomainCategory,
  isEnglishDomain,
  isHealthDomain,
  isKidsDomain,
  isMartialDomain,
  type DomainCategory,
} from './domainMap';

export {
  getTeacherTip,
  getAllTipsForContext,
  validateTeacherTips,
  type TeacherContext,
  type TeacherTip,
} from './teacherScripts';

// Phase 8: Martial Coach
export {
  getMartialCoachTip,
  validateMartialCoachTips,
  getAllMartialTips,
  inferMartialDiscipline,
  type MartialCoachLevel,
  type MartialContext,
  type MartialCoachTip,
} from './martialCoachScripts';

// Types
export type { TeacherLevel, EnglishProgress } from './memorySchema';