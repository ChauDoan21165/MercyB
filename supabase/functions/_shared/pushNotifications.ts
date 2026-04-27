// supabase/functions/_shared/pushNotifications.ts
//
// A9 — Shared push-notification types, localized copy, and quiet-hours
// logic. Used by the send-push edge function. The client side has its
// own type-only twin at src/lib/push/types.ts; keep the shape in sync.
//
// Voice rules:
//   - Vietnamese-first (vi). English (en) is provided for diaspora
//     users and admin/QA. The send-push function picks the locale per
//     user when we wire it; first ship sends VI as primary body and
//     EN as a small-text subtitle in the data payload.

export type PushPlatform = "ios" | "android" | "web";
export type PushTokenStatus = "active" | "invalid" | "revoked";

export type NotificationType =
  | "daily_practice"
  | "streak_grace"
  | "leaderboard_position_change"
  | "mercy_message"
  | "trial_expiring";

export type LocalizedCopy = {
  vi: { title: string; body: string };
  en: { title: string; body: string };
};

/** All canonical notification types. Adding a new type means: extend
 *  this list, add localized copy below, extend the preferences table
 *  in a follow-up migration. */
export const NOTIFICATION_TYPES: ReadonlyArray<NotificationType> = [
  "daily_practice",
  "streak_grace",
  "leaderboard_position_change",
  "mercy_message",
  "trial_expiring",
];

/** Default copy keyed by notification type. Variables are interpolated
 *  by interpolate() below — `{{name}}` style. Keep the variable list
 *  per type in sync with the trigger that fires it. */
export const NOTIFICATION_COPY: Readonly<
  Record<NotificationType, LocalizedCopy>
> = {
  daily_practice: {
    vi: {
      title: "Mercy đợi bạn 5 phút",
      body: "Một bài luyện ngắn — vừa đủ để giữ thói quen. Mở app khi bạn rảnh nhé.",
    },
    en: {
      title: "Mercy is waiting — 5 minutes",
      body: "One short drill, just enough to hold the habit. Open the app when you have a minute.",
    },
  },
  streak_grace: {
    vi: {
      title: "Còn vài giờ để giữ chuỗi {{streak}} ngày",
      body: "Mở app làm một câu là chuỗi của bạn vẫn nguyên vẹn.",
    },
    en: {
      title: "A few hours to save your {{streak}}-day streak",
      body: "One sentence keeps it alive. Open the app when you can.",
    },
  },
  leaderboard_position_change: {
    vi: {
      title: "Bạn đã lên hạng {{rank}}",
      body: "Trên bảng xếp hạng tuần này. Tiếp tục để giữ vị trí nhé.",
    },
    en: {
      title: "You moved up to #{{rank}}",
      body: "On this week's leaderboard. Keep going to hold the spot.",
    },
  },
  mercy_message: {
    vi: {
      title: "Mercy có lời nhắn cho bạn",
      body: "{{preview}}",
    },
    en: {
      title: "Mercy has a note for you",
      body: "{{preview}}",
    },
  },
  trial_expiring: {
    vi: {
      title: "Trial còn 24 giờ",
      body: "Bạn còn một ngày để dùng MercyBlade Premium. Tiếp tục với gói trả phí?",
    },
    en: {
      title: "Trial ends in 24 hours",
      body: "One day left on Premium. Keep going with a paid plan?",
    },
  },
};

/** Per-type default for preferences. daily_practice is the only opt-in
 *  default; the rest are opt-out by default. Mirror this in the
 *  push_preferences DEFAULT clauses (migration 20260518). */
export const NOTIFICATION_DEFAULTS: Readonly<
  Record<NotificationType, boolean>
> = {
  daily_practice: false,
  streak_grace: true,
  leaderboard_position_change: true,
  mercy_message: true,
  trial_expiring: true,
};

// ── Variable interpolation ───────────────────────────────────────────-

/** Replace `{{key}}` tokens. Unknown keys are left in place — the
 *  edge function logs a warning and skips the send. */
export function interpolate(
  template: string,
  vars: Record<string, string | number | undefined>,
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    const v = vars[key];
    return v === undefined || v === null ? match : String(v);
  });
}

export function hasUnresolvedTokens(s: string): boolean {
  return /\{\{\w+\}\}/.test(s);
}

// ── Quiet hours ──────────────────────────────────────────────────────-

export type QuietHours = {
  /** "HH:MM" 24-hour, user local time. */
  start: string;
  /** "HH:MM" 24-hour, user local time. */
  end: string;
};

/** Convert "HH:MM" to minutes-from-midnight. */
function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map((s) => parseInt(s, 10));
  if (!Number.isFinite(h) || !Number.isFinite(m)) return Number.NaN;
  return h * 60 + m;
}

/** True if the given local time falls inside the quiet window.
 *  Handles wrap-around (e.g., start=22:00, end=07:00 means 22:00–07:00
 *  is quiet, 07:00–22:00 is awake). */
export function isWithinQuietHours(
  localTime: string,
  quiet: QuietHours,
): boolean {
  const t = toMinutes(localTime);
  const start = toMinutes(quiet.start);
  const end = toMinutes(quiet.end);
  if ([t, start, end].some((n) => Number.isNaN(n))) return false;
  if (start === end) return false; // empty window
  if (start < end) {
    return t >= start && t < end;
  }
  // Wraps midnight.
  return t >= start || t < end;
}

/** Convert a UTC instant to "HH:MM" in the given IANA timezone. */
export function localTimeInZone(
  instant: Date,
  timezone: string,
): string {
  // Intl gives us the parts; we format ourselves so the result matches
  // toMinutes() above.
  try {
    const fmt = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: timezone,
    });
    const parts = fmt.formatToParts(instant);
    const h = parts.find((p) => p.type === "hour")?.value ?? "00";
    const m = parts.find((p) => p.type === "minute")?.value ?? "00";
    // Some locales return "24" for hour=0; normalize.
    const hh = h === "24" ? "00" : h.padStart(2, "0");
    return `${hh}:${m.padStart(2, "0")}`;
  } catch {
    // Bad timezone string → treat as UTC. Best-effort.
    return instant.toISOString().slice(11, 16);
  }
}

// ── Pre-send decision (pure) ─────────────────────────────────────────-

export type SendDecisionInput = {
  type: NotificationType;
  preference_enabled: boolean;
  active_token_count: number;
  current_local_time: string;
  quiet: QuietHours;
};

export type SendDecision =
  | { kind: "send" }
  | { kind: "skipped_pref" }
  | { kind: "skipped_no_token" }
  | { kind: "skipped_quiet_hours" };

/** Decide whether a given push should fire right now. Pure — no I/O,
 *  no DB. Tested independently of the network layer. */
export function decideSend(input: SendDecisionInput): SendDecision {
  if (!input.preference_enabled) return { kind: "skipped_pref" };
  if (input.active_token_count <= 0) return { kind: "skipped_no_token" };
  if (isWithinQuietHours(input.current_local_time, input.quiet)) {
    return { kind: "skipped_quiet_hours" };
  }
  return { kind: "send" };
}

// ── Build the localized payload ──────────────────────────────────────-

export type BuiltPush = {
  title: string;
  body: string;
  data: Record<string, string>;
};

/** Build the platform-agnostic push body. Returns null if any required
 *  variable is missing (caller logs and skips). */
export function buildPush(
  type: NotificationType,
  locale: "vi" | "en",
  vars: Record<string, string | number | undefined>,
  data: Record<string, string> = {},
): BuiltPush | null {
  const copy = NOTIFICATION_COPY[type]?.[locale];
  if (!copy) return null;
  const title = interpolate(copy.title, vars);
  const body = interpolate(copy.body, vars);
  if (hasUnresolvedTokens(title) || hasUnresolvedTokens(body)) return null;
  return {
    title,
    body,
    data: { ...data, type, locale },
  };
}
