/**
 * Mercy Host Engine Types
 *
 * Shared TypeScript interfaces for the Mercy Host system.
 *
 * Goals:
 * - centralize shared types
 * - avoid circular imports
 * - support both UI host + teaching brain modules
 */

import type { ReactNode } from 'react';
import type { MercyAvatarStyle } from './avatarStyles';
import type { VoiceLine } from './voicePack';

/* -------------------------------------------------------------------------- */
/* Language                                                                   */
/* -------------------------------------------------------------------------- */

export type Language = 'en' | 'vi';

/* -------------------------------------------------------------------------- */
/* Core Host Events                                                           */
/* -------------------------------------------------------------------------- */

export type MercyEvent =
  | 'room_enter'
  | 'entry_complete'
  | 'entry_click'
  | 'color_toggle'
  | 'return_inactive'
  | 'scroll_reflection';

/* -------------------------------------------------------------------------- */
/* Teaching Brain                                                             */
/* -------------------------------------------------------------------------- */

export type TeachingMode =
  | 'explain'
  | 'correct'
  | 'encourage'
  | 'challenge'
  | 'drill'
  | 'recap'
  | 'review';

export type ToneStyle =
  | 'calm'
  | 'warm'
  | 'playful'
  | 'firm';

export type CorrectionStyle =
  | 'gentle'
  | 'direct'
  | 'contrastive';

export type DifficultyDirection =
  | 'up'
  | 'down'
  | 'hold';

/* -------------------------------------------------------------------------- */
/* Learner State                                                              */
/* -------------------------------------------------------------------------- */

export type LearnerClarity =
  | 'clear'
  | 'shaky'
  | 'lost';

export type LearnerMomentum =
  | 'slow'
  | 'steady'
  | 'flowing';

export type LearnerConfidence =
  | 'low'
  | 'medium'
  | 'high';

export type LearnerAffect =
  | 'neutral'
  | 'playful'
  | 'frustrated';

export interface LearnerState {
  clarity: LearnerClarity;
  confidence: LearnerConfidence;
  momentum: LearnerMomentum;
  affect: LearnerAffect;
}

/* -------------------------------------------------------------------------- */
/* Emotion System                                                             */
/* -------------------------------------------------------------------------- */

export type EmotionState =
  | 'neutral'
  | 'focused'
  | 'confused'
  | 'stressed'
  | 'low_mood'
  | 'celebrating'
  | 'returning_after_gap';

/* -------------------------------------------------------------------------- */
/* Bilingual Output                                                           */
/* -------------------------------------------------------------------------- */

export interface BilingualLine {
  en: string;
  vi: string;
}

/* -------------------------------------------------------------------------- */
/* Teaching Correction Input                                                  */
/* -------------------------------------------------------------------------- */

export interface CorrectionInput {
  mistake: string;
  fix: string;
}

/* -------------------------------------------------------------------------- */
/* Mercy Host Engine State                                                    */
/* -------------------------------------------------------------------------- */

export interface MercyHostState {
  tier: string;
  tone: string;
  avatarStyle: MercyAvatarStyle;
  userName: string | null;
  language: Language;
  isGreetingVisible: boolean;
  currentVoiceLine: VoiceLine | null;
  isPlaying: boolean;
}

/* -------------------------------------------------------------------------- */
/* Mercy Host Engine Actions                                                  */
/* -------------------------------------------------------------------------- */

export interface MercyHostActions {
  greet: () => void;
  dismiss: () => void;
  reopen: () => void;
  playVoice: (trigger: VoiceLine['trigger']) => void;
  stopVoice: () => void;
  respondToEvent: (event: MercyEvent) => void;
  setAvatarStyle: (style: MercyAvatarStyle) => void;
}

/* -------------------------------------------------------------------------- */
/* Full Engine Interface                                                      */
/* -------------------------------------------------------------------------- */

export interface MercyHostEngine extends MercyHostState, MercyHostActions {
  avatar: ReactNode;
  animation: ReactNode;
  greetingText: BilingualLine | null;
}

/* -------------------------------------------------------------------------- */
/* Host Initialization Config                                                 */
/* -------------------------------------------------------------------------- */

export interface MercyHostConfig {
  roomId: string;
  roomTitle: string;
  roomTier?: string;
  language?: Language;
  enableVoice?: boolean;
  enableAnimations?: boolean;
}

/* -------------------------------------------------------------------------- */
/* Storage Helper                                                             */
/* -------------------------------------------------------------------------- */

export interface StorageRecord<T> {
  value: T;
  updatedAt: number;
}

/* -------------------------------------------------------------------------- */
/* Validation                                                                 */
/* -------------------------------------------------------------------------- */

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}