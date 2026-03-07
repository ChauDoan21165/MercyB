/**
 * Mercy Repetition Guard
 *
 * Purpose
 * -------
 * Help Mercy avoid sounding repetitive across nearby turns.
 *
 * This tracks short-term phrasing patterns such as:
 * - openings
 * - encouragement lines
 * - correction wording
 * - humor lines
 *
 * Design rules
 * ------------
 * - short-term only; this is not long-term memory
 * - prefer gentle nudges over hard blocking
 * - exact/near-exact repeats matter most
 * - storage should be safe with graceful fallback
 */

export type RepetitionChannel =
  | 'opening'
  | 'acknowledgement'
  | 'teaching'
  | 'action'
  | 'encouragement'
  | 'humor'
  | 'full_reply';

export interface RepetitionRecord {
  channel: RepetitionChannel;
  text: string;
  normalized: string;
  timestamp: number;
}

export interface RepetitionGuardState {
  userId: string;
  records: RepetitionRecord[];
  lastUpdatedAt: number;
}

export interface RepetitionCheckInput {
  userId?: string | null;
  channel: RepetitionChannel;
  text: string;
}

export interface RepetitionCheckResult {
  isRepeated: boolean;
  isNearRepeated: boolean;
  repeatCount: number;
  recentMatches: RepetitionRecord[];
  suggestion: 'allow' | 'soft_avoid' | 'avoid';
}

const STORE_PREFIX = 'mercy_repetition_guard_';
const MAX_RECORDS = 40;
const RECENT_WINDOW_MS = 1000 * 60 * 20;
const memoryFallback = new Map<string, RepetitionGuardState>();

function now(): number {
  return Date.now();
}

function key(userId?: string | null): string {
  return STORE_PREFIX + (userId || 'default');
}

function storageAvailable(): boolean {
  try {
    return typeof sessionStorage !== 'undefined';
  } catch {
    return false;
  }
}

function cleanText(text: string): string {
  return String(text ?? '')
    .replace(/\s+/g, ' ')
    .replace(/\s([,.!?;:])/g, '$1')
    .trim();
}

function normalizeText(text: string): string {
  return cleanText(text)
    .toLowerCase()
    .replace(/["'`]/g, '')
    .replace(/[.,!?;:()\-–—]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenSet(text: string): Set<string> {
  return new Set(
    normalizeText(text)
      .split(' ')
      .map((t) => t.trim())
      .filter(Boolean)
  );
}

function overlapRatio(a: string, b: string): number {
  const aSet = tokenSet(a);
  const bSet = tokenSet(b);

  if (aSet.size === 0 || bSet.size === 0) return 0;

  let overlap = 0;
  for (const token of aSet) {
    if (bSet.has(token)) overlap += 1;
  }

  return overlap / Math.max(aSet.size, bSet.size);
}

function isNearRepeat(a: string, b: string): boolean {
  if (!a || !b) return false;
  if (normalizeText(a) === normalizeText(b)) return true;
  return overlapRatio(a, b) >= 0.72;
}

function isRecent(timestamp: number): boolean {
  return now() - timestamp <= RECENT_WINDOW_MS;
}

export function createEmptyRepetitionGuardState(
  userId?: string | null
): RepetitionGuardState {
  return {
    userId: userId || 'default',
    records: [],
    lastUpdatedAt: now(),
  };
}

export function loadRepetitionGuardState(
  userId?: string | null
): RepetitionGuardState {
  const k = key(userId);

  if (storageAvailable()) {
    try {
      const raw = sessionStorage.getItem(k);
      if (!raw) return createEmptyRepetitionGuardState(userId);

      const parsed = JSON.parse(raw) as RepetitionGuardState;

      return {
        userId: parsed.userId || userId || 'default',
        records: Array.isArray(parsed.records) ? parsed.records : [],
        lastUpdatedAt:
          typeof parsed.lastUpdatedAt === 'number' ? parsed.lastUpdatedAt : now(),
      };
    } catch {
      return createEmptyRepetitionGuardState(userId);
    }
  }

  return memoryFallback.get(k) || createEmptyRepetitionGuardState(userId);
}

export function saveRepetitionGuardState(state: RepetitionGuardState): void {
  const k = key(state.userId);

  if (storageAvailable()) {
    try {
      sessionStorage.setItem(k, JSON.stringify(state));
      return;
    } catch {
      // fall through
    }
  }

  memoryFallback.set(k, state);
}

export function clearRepetitionGuardState(userId?: string | null): void {
  const k = key(userId);

  if (storageAvailable()) {
    try {
      sessionStorage.removeItem(k);
    } catch {
      // ignore
    }
  }

  memoryFallback.delete(k);
}

export function recordRepetitionSample(input: RepetitionCheckInput): RepetitionGuardState {
  const state = loadRepetitionGuardState(input.userId);
  const record: RepetitionRecord = {
    channel: input.channel,
    text: cleanText(input.text),
    normalized: normalizeText(input.text),
    timestamp: now(),
  };

  const recentRecords = state.records.filter((r) => isRecent(r.timestamp));
  const nextState: RepetitionGuardState = {
    userId: state.userId || input.userId || 'default',
    records: [record, ...recentRecords].slice(0, MAX_RECORDS),
    lastUpdatedAt: record.timestamp,
  };

  saveRepetitionGuardState(nextState);
  return nextState;
}

export function checkRepetition(input: RepetitionCheckInput): RepetitionCheckResult {
  const state = loadRepetitionGuardState(input.userId);
  const cleaned = cleanText(input.text);
  const normalized = normalizeText(cleaned);

  const candidates = state.records.filter(
    (r) => r.channel === input.channel && isRecent(r.timestamp)
  );

  const exactMatches = candidates.filter((r) => r.normalized === normalized);
  const nearMatches = candidates.filter(
    (r) => r.normalized !== normalized && isNearRepeat(r.text, cleaned)
  );

  const isRepeated = exactMatches.length > 0;
  const isNearRepeated = nearMatches.length > 0;
  const repeatCount = exactMatches.length + nearMatches.length;

  let suggestion: 'allow' | 'soft_avoid' | 'avoid' = 'allow';

  if (exactMatches.length >= 2) {
    suggestion = 'avoid';
  } else if (isRepeated || isNearRepeated) {
    suggestion = 'soft_avoid';
  }

  return {
    isRepeated,
    isNearRepeated,
    repeatCount,
    recentMatches: [...exactMatches, ...nearMatches].slice(0, 5),
    suggestion,
  };
}

export function shouldAvoidRepetition(input: RepetitionCheckInput): boolean {
  const result = checkRepetition(input);
  return result.suggestion === 'avoid';
}

export function shouldSoftAvoidRepetition(input: RepetitionCheckInput): boolean {
  const result = checkRepetition(input);
  return result.suggestion === 'soft_avoid' || result.suggestion === 'avoid';
}

export function pickLeastRepeatedCandidate(args: {
  userId?: string | null;
  channel: RepetitionChannel;
  candidates: string[];
}): string {
  const cleanedCandidates = args.candidates.map(cleanText).filter(Boolean);
  if (cleanedCandidates.length === 0) return '';

  let best = cleanedCandidates[0]!;
  let bestScore = Number.POSITIVE_INFINITY;

  for (const candidate of cleanedCandidates) {
    const result = checkRepetition({
      userId: args.userId,
      channel: args.channel,
      text: candidate,
    });

    const score =
      result.repeatCount +
      (result.isRepeated ? 3 : 0) +
      (result.isNearRepeated ? 1 : 0);

    if (score < bestScore) {
      best = candidate;
      bestScore = score;
    }
  }

  return best;
}

export function getRecentRepeatedChannels(
  userId?: string | null
): RepetitionChannel[] {
  const state = loadRepetitionGuardState(userId);
  const recent = state.records.filter((r) => isRecent(r.timestamp));
  const counts = new Map<RepetitionChannel, number>();

  for (const record of recent) {
    counts.set(record.channel, (counts.get(record.channel) || 0) + 1);
  }

  return Array.from(counts.entries())
    .filter(([, count]) => count >= 2)
    .map(([channel]) => channel);
}