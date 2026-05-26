/**
 * Mercy Brain - decides which cached reply to use based on context
 */

import type { MercyReplyId } from './replies';

export type MercyContext = {
  // Time-based
  lastActiveAt?: Date | null;
  isFirstVisit?: boolean;
  
  // Study-related
  hasStudiedToday?: boolean;
  hasStudiedYesterday?: boolean;
  consecutiveDays?: number;
  
  // Mood
  currentMood?: 'light' | 'ok' | 'heavy' | 'anxious' | null;
  recentHeavyMoods?: boolean; // ≥2 of last 3 logs were heavy/anxious
  
  // Session
  justCompletedSession?: boolean;
  justCompletedPath?: boolean;
  
  // English practice
  isEnglishPractice?: boolean;
  pronunciationScore?: number; // 0-100
  
  // Path
  hasIncompletePath?: boolean;
};

/**
 * Get the appropriate greeting reply based on context
 */
export function getGreetingReplyId(ctx: MercyContext): MercyReplyId {
  if (ctx.isFirstVisit) {
    return 'greeting_first_time';
  }

  if (!ctx.lastActiveAt) {
    return 'greeting_first_time';
  }

  const now = new Date();
  const hoursSinceActive = (now.getTime() - ctx.lastActiveAt.getTime()) / (1000 * 60 * 60);

  // More than 3 days = long break
  if (hoursSinceActive > 72) {
    return 'greeting_return_long_break';
  }

  // Within 24 hours = short break
  return 'greeting_return_short_break';
}

/**
 * Get praise reply based on context
 */
export function getPraiseReplyId(ctx: MercyContext): MercyReplyId {
  if (ctx.justCompletedSession || ctx.justCompletedPath) {
    return 'praise_completed_session';
  }

  if (ctx.consecutiveDays && ctx.consecutiveDays >= 2) {
    return 'praise_consistency';
  }

  return 'praise_show_up';
}

/**
 * Get breathing-related reply
 */
export function getBreathingReplyId(phase: 'intro' | 'complete'): MercyReplyId {
  return phase === 'intro' ? 'breathing_intro' : 'breathing_complete';
}

/**
 * Get calm/encouragement reply based on mood
 */
export function getCalmReplyId(ctx: MercyContext): MercyReplyId {
  if (ctx.currentMood === 'heavy' || ctx.currentMood === 'anxious' || ctx.recentHeavyMoods) {
    return 'calm_heavy_mood';
  }
  return 'calm_encouragement';
}

/**
 * Get suggestion reply
 */
export function getSuggestionReplyId(ctx: MercyContext): MercyReplyId {
  if (ctx.hasIncompletePath) {
    return 'suggestion_continue_path';
  }
  return 'suggestion_calm_mind';
}

/**
 * Get end of session reply
 */
export function getEndSessionReplyId(ctx: MercyContext): MercyReplyId {
  if (ctx.justCompletedSession || ctx.justCompletedPath) {
    return 'end_session_proud';
  }
  return 'end_session_gentle';
}

/**
 * Get English coach reply
 */
export function getEnglishCoachReplyId(): MercyReplyId {
  return 'english_coach_start';
}

/**
 * Get pronunciation praise reply based on score
 */
export function getPronunciationPraiseReplyId(score?: number): MercyReplyId {
  if (score !== undefined && score >= 70) {
    return 'pronunciation_praise_good';
  }
  return 'pronunciation_praise_try';
}

/**
 * Get teacher/recap reply for yesterday/today summary
 */
export function getTeacherReplyId(ctx: MercyContext): MercyReplyId {
  if (ctx.hasStudiedYesterday) {
    return 'teacher_yesterday_studied';
  }
  if (ctx.hasStudiedToday) {
    return 'teacher_today_start';
  }
  return 'teacher_no_yesterday';
}

/**
 * Build context from available data
 */
export function buildMercyContext(data: {
  lastActiveAt?: string | Date | null;
  isFirstVisit?: boolean;
  studiedToday?: boolean;
  studiedYesterday?: boolean;
  consecutiveDays?: number;
  currentMood?: string | null;
  recentHeavyMoods?: boolean;
  completedSession?: boolean;
  completedPath?: boolean;
  hasIncompletePath?: boolean;
}): MercyContext {
  return {
    lastActiveAt: data.lastActiveAt ? new Date(data.lastActiveAt) : null,
    isFirstVisit: data.isFirstVisit ?? false,
    hasStudiedToday: data.studiedToday ?? false,
    hasStudiedYesterday: data.studiedYesterday ?? false,
    consecutiveDays: data.consecutiveDays ?? 0,
    currentMood: data.currentMood as MercyContext['currentMood'],
    recentHeavyMoods: data.recentHeavyMoods ?? false,
    justCompletedSession: data.completedSession ?? false,
    justCompletedPath: data.completedPath ?? false,
    hasIncompletePath: data.hasIncompletePath ?? false,
  };
}
