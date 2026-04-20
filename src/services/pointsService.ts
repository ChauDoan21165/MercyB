// Path: src/services/pointsService.ts
// Simple accumulative points system for MercyBlade student effort tracking.

import { supabase } from '@/lib/supabaseClient';

export type PointEventType =
  | 'room_open'           // 5 pts — opened a room
  | 'keyword_click'       // 10 pts — clicked a keyword in library
  | 'audio_listen'        // 15 pts — listened to audio in room
  | 'reflection_save'     // 25 pts — saved a room reflection
  | 'room_complete'       // 50 pts — completed all keywords in a room
  | 'speak_attempt'       // 5 pts — attempted speaking
  | 'speak_match_low'     // 20 pts — 60-79% match
  | 'speak_match_mid'     // 40 pts — 80-94% match
  | 'speak_match_high'    // 80 pts — 95-100% match
  | 'grammar_analyze'     // 20 pts — ran grammar analysis
  | 'grammar_improve'     // 30 pts — sentence was improved by Mercy
  | 'daily_login'         // 10 pts — first action of the day
  | 'streak_bonus';       // multiplier event (not direct points)

export type PointEvent = {
  event: PointEventType;
  points: number;
  context?: string; // room_id, keyword, etc.
};

const POINT_VALUES: Record<PointEventType, number> = {
  room_open:        5,
  keyword_click:    10,
  audio_listen:     15,
  reflection_save:  25,
  room_complete:    50,
  speak_attempt:    5,
  speak_match_low:  20,
  speak_match_mid:  40,
  speak_match_high: 80,
  grammar_analyze:  20,
  grammar_improve:  30,
  daily_login:      10,
  streak_bonus:     0,
};

const STORAGE_KEY = 'mb.points';
const LAST_DAILY_KEY = 'mb.points.lastDaily';
const STREAK_KEY = 'mb.points.streak';

function getTodayStr(): string {
  return new Date().toISOString().split('T')[0];
}

function getYesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

// ── Local storage helpers ────────────────────────────────────────────────────

function getLocalPoints(): number {
  try {
    return parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10) || 0;
  } catch { return 0; }
}

function setLocalPoints(pts: number): void {
  try { localStorage.setItem(STORAGE_KEY, String(pts)); } catch {}
}

function getStreak(): number {
  try {
    return parseInt(localStorage.getItem(STREAK_KEY) || '1', 10) || 1;
  } catch { return 1; }
}

function updateStreak(): number {
  try {
    const last = localStorage.getItem(LAST_DAILY_KEY);
    const today = getTodayStr();
    const yesterday = getYesterdayStr();

    if (last === today) return getStreak(); // already updated today

    let streak = getStreak();
    if (last === yesterday) {
      streak = streak + 1; // continued streak
    } else if (last && last < yesterday) {
      streak = 1; // streak broken
    }

    localStorage.setItem(STREAK_KEY, String(streak));
    localStorage.setItem(LAST_DAILY_KEY, today);
    return streak;
  } catch { return 1; }
}

function isFirstActionToday(): boolean {
  try {
    return localStorage.getItem(LAST_DAILY_KEY) !== getTodayStr();
  } catch { return false; }
}

// ── Supabase sync ────────────────────────────────────────────────────────────

async function syncToSupabase(totalPoints: number, event: PointEventType, points: number, context?: string): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Upsert total points to profiles
    await supabase
      .from('profiles')
      .update({ total_points: totalPoints } as any)
      .eq('id', user.id);

    // Log the event to study_log as a points entry
    await supabase
      .from('study_log')
      .insert({
        user_id: user.id,
        topic_en: `points:${event}:${points}`,
        room_id: context || null,
        minutes: 0,
      } as any);

  } catch {
    // Fail silently — local points still work
  }
}

// ── Main API ─────────────────────────────────────────────────────────────────

export function awardPoints(event: PointEventType, context?: string): number {
  const basePoints = POINT_VALUES[event] || 0;
  if (basePoints === 0) return 0;

  // Check daily login bonus
  let bonus = 0;
  if (isFirstActionToday()) {
    bonus = POINT_VALUES.daily_login;
    updateStreak();
  }

  // Streak multiplier (2x for 7+ days, 1.5x for 3+ days)
  const streak = getStreak();
  const multiplier = streak >= 7 ? 2.0 : streak >= 3 ? 1.5 : 1.0;

  const earned = Math.round((basePoints + bonus) * multiplier);
  const current = getLocalPoints();
  const next = current + earned;

  setLocalPoints(next);

  // Sync to Supabase in background
  void syncToSupabase(next, event, earned, context);

  return earned;
}

export function awardSpeakPoints(matchScore: number, context?: string): number {
  // Always award attempt points
  awardPoints('speak_attempt', context);

  if (matchScore >= 95) return awardPoints('speak_match_high', context);
  if (matchScore >= 80) return awardPoints('speak_match_mid', context);
  if (matchScore >= 60) return awardPoints('speak_match_low', context);
  return 0;
}

export function getTotalPoints(): number {
  return getLocalPoints();
}

export function getStreakDays(): number {
  return getStreak();
}

export function getPointsDisplay(): string {
  const pts = getLocalPoints();
  if (pts >= 1_000_000) return `${(pts / 1_000_000).toFixed(1)}M`;
  if (pts >= 1_000) return `${(pts / 1_000).toFixed(1)}K`;
  return pts.toLocaleString();
}

export function getStreakEmoji(streak: number): string {
  if (streak >= 30) return '🔥🔥🔥';
  if (streak >= 14) return '🔥🔥';
  if (streak >= 7)  return '🔥';
  if (streak >= 3)  return '⚡';
  return '✨';
}

export async function loadPointsFromSupabase(): Promise<number | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data } = await supabase
      .from('profiles')
      .select('total_points')
      .eq('id', user.id)
      .single();

    const serverPoints = (data as any)?.total_points;
    if (typeof serverPoints === 'number' && serverPoints > getLocalPoints()) {
      setLocalPoints(serverPoints);
      return serverPoints;
    }
    return getLocalPoints();
  } catch {
    return getLocalPoints();
  }
}