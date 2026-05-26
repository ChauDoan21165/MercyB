// Triggers + cooldown for proactive progress mentions in Mercy chat.
//
// The pattern: client-side regex over the user's message detects an
// "this is the moment" signal (frustration, win, "am I improving?",
// asking for practice recommendation). When matched AND cooldown
// allows AND we have progress context, the chat layer sends the
// progress block to the edge function for prompt injection.
//
// Cooldown: at least 5 user messages OR 30 minutes between mentions.
// Stored in localStorage so the cooldown survives a page reload (a
// soft reload shouldn't reset the cap and let Mercy spam progress).

import type { ProgressContext } from "./progressContext";

const COOLDOWN_MS = 30 * 60 * 1000;
const COOLDOWN_MESSAGE_COUNT = 5;
const STATE_KEY_PREFIX = "mercy.progress.lastMention.v1.";

export type ProgressMentionState = {
  lastMentionAt: number;
  /** Total user messages observed since last mention. Resets on mention. */
  messagesSinceLastMention: number;
};

const EMPTY_STATE: ProgressMentionState = {
  lastMentionAt: 0,
  messagesSinceLastMention: 0,
};

// ── Trigger classification (pure) ────────────────────────────────────────

export type TriggerKind =
  | "frustration"   // "khó quá", "I can't do this", "tôi tệ quá"
  | "self_check"    // "am I getting better?", "tôi giỏi không?"
  | "practice_ask"  // "what should I practice?", "hôm nay luyện gì?"
  | "low_score"     // most-recent attempt below threshold
  | null;

// Note on \b: JS regex \b only treats ASCII chars as "word" characters,
// so it breaks across Vietnamese diacritics ("\\bkhó quá\\b" doesn't
// match "khó quá"). VN patterns drop \b entirely; EN-only patterns
// keep it to avoid matching inside larger ASCII words.
const FRUSTRATION_PATTERNS: RegExp[] = [
  /khó quá/i,
  /tôi tệ/i,
  /\bi can('|')?t do this\b/i,
  /\bnot good enough\b/i,
  /tôi không thể/i,
  /\bgiving up\b/i,
  /bỏ cuộc/i,
  /so khó/i,
];

const SELF_CHECK_PATTERNS: RegExp[] = [
  /\bam i (getting )?(better|improving)\b/i,
  /tôi giỏi không/i,
  /tôi tiến bộ/i,
  /\bhow am i doing\b/i,
  /tôi học có tốt không/i,
];

const PRACTICE_ASK_PATTERNS: RegExp[] = [
  /\bwhat should i practice\b/i,
  /hôm nay luyện (cái )?gì/i,
  /nên (tập|luyện) gì/i,
  /\bsuggest .*(practice|drill)\b/i,
  /cho tôi (bài tập|gì để luyện)/i,
];

/** When the most-recent attempt scored below this, count as low-score signal. */
export const LOW_SCORE_THRESHOLD = 60;

export function classifyTrigger(
  userMessage: string,
  recentAttemptScore: number | null = null,
): TriggerKind {
  const msg = (userMessage ?? "").trim();
  if (!msg) {
    return scoreToTrigger(recentAttemptScore);
  }
  if (matchesAny(msg, FRUSTRATION_PATTERNS)) return "frustration";
  if (matchesAny(msg, SELF_CHECK_PATTERNS)) return "self_check";
  if (matchesAny(msg, PRACTICE_ASK_PATTERNS)) return "practice_ask";
  return scoreToTrigger(recentAttemptScore);
}

function scoreToTrigger(recentAttemptScore: number | null): TriggerKind {
  if (
    recentAttemptScore !== null &&
    Number.isFinite(recentAttemptScore) &&
    recentAttemptScore < LOW_SCORE_THRESHOLD
  ) {
    return "low_score";
  }
  return null;
}

function matchesAny(s: string, patterns: RegExp[]): boolean {
  for (const p of patterns) {
    if (p.test(s)) return true;
  }
  return false;
}

// ── Cooldown (localStorage-backed) ───────────────────────────────────────

export function readMentionState(userId: string): ProgressMentionState {
  if (!userId || typeof localStorage === "undefined") return { ...EMPTY_STATE };
  try {
    const raw = localStorage.getItem(STATE_KEY_PREFIX + userId);
    if (!raw) return { ...EMPTY_STATE };
    const parsed = JSON.parse(raw) as Partial<ProgressMentionState>;
    return {
      lastMentionAt: typeof parsed.lastMentionAt === "number" ? parsed.lastMentionAt : 0,
      messagesSinceLastMention:
        typeof parsed.messagesSinceLastMention === "number" ? parsed.messagesSinceLastMention : 0,
    };
  } catch {
    return { ...EMPTY_STATE };
  }
}

function writeMentionState(userId: string, state: ProgressMentionState): void {
  if (!userId || typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(STATE_KEY_PREFIX + userId, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

/**
 * Whether enough has elapsed since the last mention to send another.
 * Pure on (state, now) so callers can test deterministically.
 */
export function isCooldownPassed(
  state: ProgressMentionState,
  now: number = Date.now(),
): boolean {
  if (state.lastMentionAt === 0) return true;
  if (state.messagesSinceLastMention >= COOLDOWN_MESSAGE_COUNT) return true;
  if (now - state.lastMentionAt >= COOLDOWN_MS) return true;
  return false;
}

/**
 * Top-level decision. Combines trigger detection + cooldown gate +
 * "do we have data" gate. Returns true when the chat layer should
 * send progressContext on this turn AND show the 📊 badge after.
 */
export function shouldProactivelyMentionProgress(args: {
  userMessage: string;
  recentAttemptScore?: number | null;
  context: ProgressContext | null;
  state: ProgressMentionState;
  now?: number;
}): boolean {
  if (!args.context) return false;
  const trigger = classifyTrigger(args.userMessage, args.recentAttemptScore ?? null);
  if (trigger === null) return false;
  return isCooldownPassed(args.state, args.now ?? Date.now());
}

/**
 * Persist the fact that we just sent a mention. Called by the chat
 * layer right before invoking the edge function.
 */
export function recordProgressMention(userId: string, now: number = Date.now()): ProgressMentionState {
  const next: ProgressMentionState = {
    lastMentionAt: now,
    messagesSinceLastMention: 0,
  };
  writeMentionState(userId, next);
  return next;
}

/**
 * Increment the running message counter (called for every user
 * message regardless of whether progress was sent). The counter
 * unlocks the cooldown after COOLDOWN_MESSAGE_COUNT messages even
 * if 30 minutes haven't passed.
 */
export function incrementMessageCounter(userId: string): ProgressMentionState {
  const cur = readMentionState(userId);
  const next: ProgressMentionState = {
    ...cur,
    messagesSinceLastMention: cur.messagesSinceLastMention + 1,
  };
  writeMentionState(userId, next);
  return next;
}

export const PROGRESS_TRIGGERS_INTERNAL = {
  COOLDOWN_MS,
  COOLDOWN_MESSAGE_COUNT,
};
