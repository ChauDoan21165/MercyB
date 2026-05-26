// Skill-graduation tracking. After three consecutive drill sessions
// with average score ≥ 80 for a phoneme, the user "graduates" that
// phoneme — a one-time celebration card fires and Mercy chat will
// reference the milestone next time it talks about progress.
//
// State lives in localStorage, keyed by user id, because:
//   - Graduation is an achievement; we don't want a private-mode user
//     to lose it on close.
//   - It's a small, slowly-growing record (≤ 32 phonemes).
//   - Server persistence is unnecessary today — we'll lift this into
//     `profiles.graduated_phonemes[]` if/when we need cross-device sync.
//
// Functions are pure on (state, sessionAvg, now). The async storage
// shell at the bottom is the only side-effecting layer.

const STATE_KEY_PREFIX = "mercy.drill.graduation.v1.";
const GRADUATION_CONSECUTIVE_REQUIRED = 3;
export const GRADUATION_SCORE_FLOOR = 80;

export type PhonemeGraduationProgress = {
  /**
   * Number of CONSECUTIVE drill sessions with avg ≥ floor. Resets to
   * zero when a session falls below the floor.
   */
  consecutiveStrongSessions: number;
  /** Epoch ms of the most recent drill session ingested. */
  lastSessionAt: number;
  /** Average score of the most recent session (0..100). */
  lastSessionAvg: number | null;
  /** Set when graduation has fired. Stays true forever. */
  graduatedAt: number | null;
  /**
   * Whether the celebration card has been shown to the user. Set true
   * the first time the drill page renders the graduation panel; lets
   * us avoid replaying confetti on every revisit.
   */
  celebrationShown: boolean;
};

export type GraduationState = {
  /** Per-phoneme-slug progress. */
  byPhoneme: Record<string, PhonemeGraduationProgress>;
};

const EMPTY_STATE: GraduationState = { byPhoneme: {} };

const EMPTY_PROGRESS: PhonemeGraduationProgress = {
  consecutiveStrongSessions: 0,
  lastSessionAt: 0,
  lastSessionAvg: null,
  graduatedAt: null,
  celebrationShown: false,
};

// ── Pure transitions (exported for tests) ───────────────────────────────

/**
 * Apply the result of one completed drill session to the per-phoneme
 * progress. Returns the next progress object plus whether THIS call is
 * the moment of graduation (caller can fire telemetry / show card).
 *
 * Already-graduated phonemes don't ungraduate — the field is sticky.
 * `consecutiveStrongSessions` keeps incrementing past 3 so we can
 * surface "5 strong drills in a row" later if we want.
 */
export function applyDrillSession(
  cur: PhonemeGraduationProgress,
  args: { sessionAvg: number; now: number },
): { next: PhonemeGraduationProgress; justGraduated: boolean } {
  const isStrong = args.sessionAvg >= GRADUATION_SCORE_FLOOR;
  const consecutive = isStrong ? cur.consecutiveStrongSessions + 1 : 0;
  const reachedFloor = consecutive >= GRADUATION_CONSECUTIVE_REQUIRED;
  const justGraduated = reachedFloor && cur.graduatedAt === null;
  const next: PhonemeGraduationProgress = {
    consecutiveStrongSessions: consecutive,
    lastSessionAt: args.now,
    lastSessionAvg: Math.round(args.sessionAvg),
    graduatedAt: cur.graduatedAt ?? (reachedFloor ? args.now : null),
    celebrationShown: cur.celebrationShown,
  };
  return { next, justGraduated };
}

/**
 * Mark the celebration as shown. Idempotent — calling on an
 * already-shown progress returns the same object.
 */
export function markCelebrationShown(
  cur: PhonemeGraduationProgress,
): PhonemeGraduationProgress {
  if (cur.celebrationShown) return cur;
  return { ...cur, celebrationShown: true };
}

/**
 * Convenience predicate. Useful in UI logic ("show graduation banner?").
 */
export function isGraduated(cur: PhonemeGraduationProgress | null | undefined): boolean {
  return Boolean(cur?.graduatedAt);
}

/**
 * Sub-selector. Returns the existing per-phoneme progress, or a fresh
 * empty record. Always non-null so callers can chain without branching.
 */
export function progressFor(
  state: GraduationState,
  phonemeSlug: string,
): PhonemeGraduationProgress {
  return state.byPhoneme[phonemeSlug] ?? { ...EMPTY_PROGRESS };
}

// ── Storage shell ───────────────────────────────────────────────────────

export function readGraduationState(userId: string): GraduationState {
  if (!userId || typeof localStorage === "undefined") return cloneEmpty();
  try {
    const raw = localStorage.getItem(STATE_KEY_PREFIX + userId);
    if (!raw) return cloneEmpty();
    const parsed = JSON.parse(raw) as Partial<GraduationState>;
    if (!parsed || typeof parsed !== "object") return cloneEmpty();
    const out: GraduationState = { byPhoneme: {} };
    if (parsed.byPhoneme && typeof parsed.byPhoneme === "object") {
      for (const [slug, val] of Object.entries(parsed.byPhoneme)) {
        out.byPhoneme[slug] = sanitizeProgress(val);
      }
    }
    return out;
  } catch {
    return cloneEmpty();
  }
}

export function writeGraduationState(userId: string, state: GraduationState): void {
  if (!userId || typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(STATE_KEY_PREFIX + userId, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

/**
 * Apply a completed session to localStorage. Returns the next
 * per-phoneme progress AND a `justGraduated` flag for the caller to
 * trigger UI side-effects.
 */
export function recordDrillSession(args: {
  userId: string;
  phonemeSlug: string;
  sessionAvg: number;
  now?: number;
}): { progress: PhonemeGraduationProgress; justGraduated: boolean } {
  const now = args.now ?? Date.now();
  const state = readGraduationState(args.userId);
  const cur = progressFor(state, args.phonemeSlug);
  const { next, justGraduated } = applyDrillSession(cur, {
    sessionAvg: args.sessionAvg,
    now,
  });
  state.byPhoneme[args.phonemeSlug] = next;
  writeGraduationState(args.userId, state);
  return { progress: next, justGraduated };
}

/** Test-only: blow away the state for a user. */
export function __clearGraduationStateForTests(userId: string): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.removeItem(STATE_KEY_PREFIX + userId);
  } catch {
    /* ignore */
  }
}

// ── Internal ────────────────────────────────────────────────────────────

function cloneEmpty(): GraduationState {
  return { byPhoneme: {} };
}

function sanitizeProgress(raw: unknown): PhonemeGraduationProgress {
  if (!raw || typeof raw !== "object") return { ...EMPTY_PROGRESS };
  const r = raw as Record<string, unknown>;
  return {
    consecutiveStrongSessions:
      typeof r.consecutiveStrongSessions === "number" && r.consecutiveStrongSessions >= 0
        ? Math.floor(r.consecutiveStrongSessions)
        : 0,
    lastSessionAt:
      typeof r.lastSessionAt === "number" && r.lastSessionAt >= 0 ? r.lastSessionAt : 0,
    lastSessionAvg:
      typeof r.lastSessionAvg === "number" && Number.isFinite(r.lastSessionAvg)
        ? Math.round(r.lastSessionAvg)
        : null,
    graduatedAt:
      typeof r.graduatedAt === "number" && r.graduatedAt > 0 ? r.graduatedAt : null,
    celebrationShown: r.celebrationShown === true,
  };
}
