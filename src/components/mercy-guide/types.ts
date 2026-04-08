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
}

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