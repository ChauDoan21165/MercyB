/**
 * File: types.ts
 * Path: src/components/mercy-guide/types.ts
 */

import type { CompanionProfile } from '@/services/companion';

export * from './tabs/grammar-writing/types';

export interface MercyGuideProps {
  roomId?: string;
  roomTitle?: string;
  tier?: string;
  pathSlug?: string;
  tags?: string[];
  contentEn?: string;
  /**
   * Open the panel directly on this tab when the bubble is opened.
   * When unset, falls back to the existing default ("teacher" for adult,
   * "pronunciation" for kids).
   */
  initialTab?: MercyGuideTab;
  /**
   * Pre-fill the Speak-tab practice line with this string. Surfaces the
   * "Try one word — no signup" path on Home: open MercyGuide on the
   * pronunciation tab with a fixed starter line so anonymous users can
   * reach a score without picking content first.
   */
  initialPracticeLine?: string;
  /**
   * Bumping this id forces MercyGuide to (re)open on the requested
   * `initialTab`. Lets the same Home card retrigger the open flow even
   * when initialTab / initialPracticeLine values haven't changed across
   * clicks.
   */
  openRequestId?: number;
}

export type MercyGuideTab = 'teacher' | 'grammar' | 'pronunciation' | 'logic';
export type MercyTeacherMode = 'adult' | 'kids';
export type TroubleWordItem = string | { word?: string | null };

export type ExtendedCompanionProfile = CompanionProfile & {
  display_name?: string | null;
  first_name?: string | null;
  name?: string | null;
};

export type CheckInMessage = {
  en: string;
  vi: string;
};

export type PathHint = {
  en: string;
  vi: string;
};

export type MercyPromptStyle = 'mood' | 'daily_event' | 'reflection' | 'mixed';
export type MercyFeedbackStyle = 'gentle' | 'direct' | 'detailed';
export type MercyConfidenceLevel = 'low' | 'medium' | 'high';
export type LearningSupportMode = 'gentle' | 'guided' | 'immersion';

export type MercyLogicPatternMemory = {
  key: string;
  label: string;
  count: number;
  lastSeenAt: string;
};

export type StudentMercyMemory = {
  userKey: string;
  writing: {
    patterns: string[];
    strengths: string[];
    currentFocus: string[];
    recurringTopics: string[];
    commonWritingModes: string[];
    lastSubmittedText?: string;
    lastCorrectedText?: string;
    lastEnhancedText?: string;
  };
  logic: {
    vietlishPatterns: MercyLogicPatternMemory[];
    bridgesLearned: string[];
    currentLogicFocus: string[];
  };
  pronunciation: {
    troubleWords: string[];
    soundPatterns: string[];
    confidenceLevel?: MercyConfidenceLevel;
    lastPracticeLine?: string;
  };
  coaching: {
    preferredPromptStyle?: MercyPromptStyle;
    preferredFeedbackStyle?: MercyFeedbackStyle;
  };
  updatedAt: string;
};

export type StudentMercyMemoryUpdate = Partial<{
  writing: Partial<StudentMercyMemory['writing']>;
  logic: Partial<StudentMercyMemory['logic']>;
  pronunciation: Partial<StudentMercyMemory['pronunciation']>;
  coaching: Partial<StudentMercyMemory['coaching']>;
}>;

export type TeacherMemorySummaryItem = {
  label: string;
  type: 'strength' | 'focus' | 'logic' | 'pronunciation';
};