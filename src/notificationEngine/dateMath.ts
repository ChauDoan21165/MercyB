// src/notificationEngine/dateMath.ts
//
// Local calendar-date math for streak-save eligibility. Streaks are reckoned
// per LOCAL calendar day in the user's IANA timezone — NEVER via
// `new Date().toISOString().slice(0,10)` (that is UTC and silently breaks the
// day boundary for Vietnam, UTC+7). All arithmetic is calendar-based so it is
// DST-immune.

export interface LocalStudyDates {
  /** `YYYY-MM-DD` for "today" in the resolved timezone. */
  todayLocal: string;
  /** `YYYY-MM-DD` for "yesterday" in the resolved timezone. */
  yesterdayLocal: string;
  /** The IANA timezone actually used (after fallback resolution). */
  timezone: string;
}

const DEFAULT_TZ = "Asia/Ho_Chi_Minh";

function isValidTimeZone(tz: string | null | undefined): tz is string {
  if (!tz) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

function deviceTimeZone(): string | undefined {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || undefined;
  } catch {
    return undefined;
  }
}

/** Fallback order: supplied tz → device tz → Asia/Ho_Chi_Minh. */
export function resolveTimezone(timezone?: string | null): string {
  if (isValidTimeZone(timezone)) return timezone;
  const device = deviceTimeZone();
  if (isValidTimeZone(device)) return device;
  return DEFAULT_TZ;
}

/** Format an instant as `YYYY-MM-DD` in the given IANA timezone. */
function formatLocalYmd(date: Date, timeZone: string): string {
  // en-CA renders ISO-style YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/** Add/subtract whole calendar days from a `YYYY-MM-DD` string (DST-immune). */
function addCalendarDays(ymd: string, delta: number): string {
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + delta);
  const yy = dt.getUTCFullYear();
  const mm = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(dt.getUTCDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

/**
 * Local "today"/"yesterday" `YYYY-MM-DD` computed in the IANA `timezone`.
 * `timezone` falls back to device tz, then Asia/Ho_Chi_Minh, when missing/invalid.
 */
export function getLocalStudyDates(
  timezone?: string | null,
  now: Date = new Date(),
): LocalStudyDates {
  const tz = resolveTimezone(timezone);
  const todayLocal = formatLocalYmd(now, tz);
  const yesterdayLocal = addCalendarDays(todayLocal, -1);
  return { todayLocal, yesterdayLocal, timezone: tz };
}
