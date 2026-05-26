/**
 * Mercy Repetition Guard
 *
 * Purpose
 * -------
 * Help Mercy avoid sounding repetitive across nearby turns.
 *
 * This tracks short-term phrasing patterns such as:
 * - openings
 * - acknowledgements
 * - teaching lines
 * - action lines
 * - encouragement lines
 * - humor lines
 * - full replies
 *
 * Design rules
 * ------------
 * - short-term only; this is not long-term memory
 * - prefer gentle nudges over hard blocking
 * - exact/near-exact repeats matter most
 * - storage should be safe with graceful fallback
 * - channels can have different sensitivity levels
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
  strongestSimilarity: number;
}

export interface PickLeastRepeatedCandidateArgs {
  userId?: string | null;
  channel: RepetitionChannel;
  candidates: string[];
}

export interface RecordReplyPartsInput {
  userId?: string | null;
  opening?: string;
  acknowledgement?: string;
  teaching?: string;
  action?: string;
  encouragement?: string;
  humor?: string;
  fullReply?: string;
}

const STORE_PREFIX = 'mercy_repetition_guard_';
const MAX_RECORDS = 60;
const DEFAULT_RECENT_WINDOW_MS = 1000 * 60 * 20;
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
    .replace(/[.,!?;:()[\]{}\-–—_/\\]/g, ' ')
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

function prefixSimilarity(a: string, b: string): number {
  const aTokens = normalizeText(a).split(' ').filter(Boolean);
  const bTokens = normalizeText(b).split(' ').filter(Boolean);

  const maxComparable = Math.min(aTokens.length, bTokens.length, 6);
  if (maxComparable === 0) return 0;

  let sharedPrefix = 0;
  for (let i = 0; i < maxComparable; i += 1) {
    if (aTokens[i] === bTokens[i]) {
      sharedPrefix += 1;
    } else {
      break;
    }
  }

  return sharedPrefix / maxComparable;
}

function channelWindowMs(channel: RepetitionChannel): number {
  switch (channel) {
    case 'full_reply':
      return 1000 * 60 * 30;
    case 'humor':
      return 1000 * 60 * 35;
    case 'opening':
    case 'encouragement':
      return 1000 * 60 * 25;
    case 'acknowledgement':
    case 'teaching':
    case 'action':
    default:
      return DEFAULT_RECENT_WINDOW_MS;
  }
}

function nearRepeatThreshold(channel: RepetitionChannel): number {
  switch (channel) {
    case 'humor':
      return 0.62;
    case 'opening':
      return 0.7;
    case 'encouragement':
      return 0.68;
    case 'action':
      return 0.72;
    case 'teaching':
      return 0.76;
    case 'acknowledgement':
      return 0.72;
    case 'full_reply':
    default:
      return 0.82;
  }
}

function avoidThreshold(channel: RepetitionChannel): number {
  switch (channel) {
    case 'humor':
      return 1;
    case 'opening':
    case 'encouragement':
      return 2;
    case 'action':
    case 'acknowledgement':
      return 2;
    case 'teaching':
      return 2;
    case 'full_reply':
    default:
      return 1;
  }
}

function isRecent(timestamp: number, channel?: RepetitionChannel): boolean {
  const windowMs = channel ? channelWindowMs(channel) : DEFAULT_RECENT_WINDOW_MS;
  return now() - timestamp <= windowMs;
}

function pruneRecords(records: RepetitionRecord[]): RepetitionRecord[] {
  const recent = records.filter((r) => isRecent(r.timestamp, r.channel));
  return recent.slice(0, MAX_RECORDS);
}

function dedupeConsecutiveRecords(records: RepetitionRecord[]): RepetitionRecord[] {
  if (records.length <= 1) return records;

  const deduped: RepetitionRecord[] = [];
  for (const record of records) {
    const last = deduped[deduped.length - 1];
    if (
      last &&
      last.channel === record.channel &&
      last.normalized === record.normalized
    ) {
      continue;
    }
    deduped.push(record);
  }

  return deduped;
}

function similarityScore(
  a: string,
  b: string,
  channel: RepetitionChannel
): number {
  const normalizedA = normalizeText(a);
  const normalizedB = normalizeText(b);

  if (!normalizedA || !normalizedB) return 0;
  if (normalizedA === normalizedB) return 1;

  const overlap = overlapRatio(normalizedA, normalizedB);
  const prefix = prefixSimilarity(normalizedA, normalizedB);

  if (channel === 'opening' || channel === 'encouragement') {
    return Math.max(overlap, prefix * 0.95);
  }

  if (channel === 'humor') {
    return Math.max(overlap * 0.9, prefix);
  }

  return Math.max(overlap, prefix * 0.85);
}

function isNearRepeat(
  a: string,
  b: string,
  channel: RepetitionChannel
): boolean {
  return similarityScore(a, b, channel) >= nearRepeatThreshold(channel);
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
        records: pruneRecords(Array.isArray(parsed.records) ? parsed.records : []),
        lastUpdatedAt:
          typeof parsed.lastUpdatedAt === 'number' ? parsed.lastUpdatedAt : now(),
      };
    } catch {
      return createEmptyRepetitionGuardState(userId);
    }
  }

  const fallbackState = memoryFallback.get(k);
  if (!fallbackState) {
    return createEmptyRepetitionGuardState(userId);
  }

  return {
    ...fallbackState,
    records: pruneRecords(fallbackState.records),
  };
}

export function saveRepetitionGuardState(state: RepetitionGuardState): void {
  const normalizedState: RepetitionGuardState = {
    userId: state.userId || 'default',
    records: dedupeConsecutiveRecords(pruneRecords(state.records)),
    lastUpdatedAt: state.lastUpdatedAt || now(),
  };

  const k = key(normalizedState.userId);

  if (storageAvailable()) {
    try {
      sessionStorage.setItem(k, JSON.stringify(normalizedState));
      return;
    } catch {
      // fall through
    }
  }

  memoryFallback.set(k, normalizedState);
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

export function recordRepetitionSample(
  input: RepetitionCheckInput
): RepetitionGuardState {
  const cleaned = cleanText(input.text);
  const normalized = normalizeText(cleaned);
  if (!normalized) {
    return loadRepetitionGuardState(input.userId);
  }

  const state = loadRepetitionGuardState(input.userId);
  const record: RepetitionRecord = {
    channel: input.channel,
    text: cleaned,
    normalized,
    timestamp: now(),
  };

  const nextState: RepetitionGuardState = {
    userId: state.userId || input.userId || 'default',
    records: [record, ...state.records].slice(0, MAX_RECORDS),
    lastUpdatedAt: record.timestamp,
  };

  saveRepetitionGuardState(nextState);
  return nextState;
}

export function recordReplyParts(input: RecordReplyPartsInput): RepetitionGuardState {
  let state = loadRepetitionGuardState(input.userId);

  const orderedParts: Array<[RepetitionChannel, string | undefined]> = [
    ['opening', input.opening],
    ['acknowledgement', input.acknowledgement],
    ['teaching', input.teaching],
    ['action', input.action],
    ['encouragement', input.encouragement],
    ['humor', input.humor],
    ['full_reply', input.fullReply],
  ];

  for (const [channel, text] of orderedParts) {
    if (!text || !cleanText(text)) continue;
    state = recordRepetitionSample({
      userId: state.userId,
      channel,
      text,
    });
  }

  return state;
}

export function checkRepetition(
  input: RepetitionCheckInput
): RepetitionCheckResult {
  const state = loadRepetitionGuardState(input.userId);
  const cleaned = cleanText(input.text);
  const normalized = normalizeText(cleaned);

  if (!normalized) {
    return {
      isRepeated: false,
      isNearRepeated: false,
      repeatCount: 0,
      recentMatches: [],
      suggestion: 'allow',
      strongestSimilarity: 0,
    };
  }

  const candidates = state.records.filter(
    (r) => r.channel === input.channel && isRecent(r.timestamp, r.channel)
  );

  const exactMatches = candidates.filter((r) => r.normalized === normalized);

  const nearMatches = candidates.filter(
    (r) => r.normalized !== normalized && isNearRepeat(r.text, cleaned, input.channel)
  );

  let strongestSimilarity = 0;
  for (const candidate of candidates) {
    strongestSimilarity = Math.max(
      strongestSimilarity,
      similarityScore(candidate.text, cleaned, input.channel)
    );
  }

  const isRepeated = exactMatches.length > 0;
  const isNearRepeated = nearMatches.length > 0;
  const repeatCount = exactMatches.length + nearMatches.length;

  let suggestion: 'allow' | 'soft_avoid' | 'avoid' = 'allow';

  if (exactMatches.length >= avoidThreshold(input.channel)) {
    suggestion = 'avoid';
  } else if (
    exactMatches.length > 0 ||
    nearMatches.length > 0 ||
    strongestSimilarity >= nearRepeatThreshold(input.channel)
  ) {
    suggestion = 'soft_avoid';
  }

  if (
    input.channel === 'full_reply' &&
    (exactMatches.length >= 1 || strongestSimilarity >= nearRepeatThreshold('full_reply'))
  ) {
    suggestion = 'avoid';
  }

  return {
    isRepeated,
    isNearRepeated,
    repeatCount,
    recentMatches: [...exactMatches, ...nearMatches].slice(0, 5),
    suggestion,
    strongestSimilarity,
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

export function pickLeastRepeatedCandidate(
  args: PickLeastRepeatedCandidateArgs
): string {
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
      result.repeatCount * 4 +
      (result.isRepeated ? 6 : 0) +
      (result.isNearRepeated ? 2 : 0) +
      result.strongestSimilarity * 3;

    if (score < bestScore) {
      best = candidate;
      bestScore = score;
    }
  }

  return best;
}

export function pickLeastRepeatedCandidateOrFallback(
  args: PickLeastRepeatedCandidateArgs & { fallback?: string }
): string {
  const cleanedCandidates = args.candidates.map(cleanText).filter(Boolean);
  if (cleanedCandidates.length === 0) {
    return cleanText(args.fallback || '');
  }

  return pickLeastRepeatedCandidate(args);
}

export function getRecentRepeatedChannels(
  userId?: string | null
): RepetitionChannel[] {
  const state = loadRepetitionGuardState(userId);
  const recent = state.records.filter((r) => isRecent(r.timestamp, r.channel));
  const counts = new Map<RepetitionChannel, number>();

  for (const record of recent) {
    counts.set(record.channel, (counts.get(record.channel) || 0) + 1);
  }

  return Array.from(counts.entries())
    .filter(([channel, count]) => count >= avoidThreshold(channel))
    .map(([channel]) => channel);
}

export function getRecentChannelRecords(
  userId: string | null | undefined,
  channel: RepetitionChannel
): RepetitionRecord[] {
  const state = loadRepetitionGuardState(userId);
  return state.records.filter(
    (record) => record.channel === channel && isRecent(record.timestamp, channel)
  );
}