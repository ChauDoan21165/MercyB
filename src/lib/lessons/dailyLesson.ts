/**
 * Daily lesson rotation — picks one entry from DAILY_LESSONS for the
 * current calendar day. Same user + same day = same lesson, so a
 * learner who returns mid-day continues the lesson they started.
 *
 * The seed combines the date (YYYY-MM-DD) with a per-user salt so
 * different users see different rotations on the same day. Anonymous
 * visitors get a fixed starter lesson via getDailyLesson(undefined).
 */

import {
  DAILY_LESSONS,
  ANONYMOUS_STARTER_LESSON,
  type DailyLessonEntry,
} from "@/data/dailyLessons";

/** Local-time YYYY-MM-DD. Tests can override via the `now` argument. */
export function todayISO(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Deterministic 32-bit hash of a string. Same shape as
 * src/lib/xp/dailyChallenge.ts#dateSeed but kept local so this module
 * has no cross-feature dependencies.
 */
function hashString(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function getDailyLesson(
  userId?: string | null,
  now: Date = new Date(),
): DailyLessonEntry {
  if (DAILY_LESSONS.length === 0) {
    return ANONYMOUS_STARTER_LESSON;
  }
  if (!userId) {
    return ANONYMOUS_STARTER_LESSON;
  }
  const seed = hashString(`${userId}|${todayISO(now)}`);
  const index = seed % DAILY_LESSONS.length;
  return DAILY_LESSONS[index];
}

const COMPLETED_KEY_PREFIX = "mb.dailyLesson.lastStarted";

function completedStorageKey(userId: string | null | undefined): string {
  return `${COMPLETED_KEY_PREFIX}.${userId ?? "anon"}`;
}

/**
 * Records that the user tapped "Bắt đầu" today. We treat "started" as
 * sufficient signal for the dimmed-card state — it intentionally does
 * NOT touch the streak system. Streaks are owned by the server
 * (user_room_progress trigger), so they update naturally when the user
 * actually engages with the linked room.
 */
export function markDailyLessonStarted(
  userId: string | null | undefined,
  now: Date = new Date(),
): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(completedStorageKey(userId), todayISO(now));
  } catch {
    /* Safari private mode etc — ignore. */
  }
}

export function isDailyLessonCompletedToday(
  userId: string | null | undefined,
  now: Date = new Date(),
): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(completedStorageKey(userId)) === todayISO(now);
  } catch {
    return false;
  }
}
