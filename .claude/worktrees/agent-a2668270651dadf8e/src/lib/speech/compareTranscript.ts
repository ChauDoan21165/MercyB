// PATH: src/lib/speech/compareTranscript.ts

import type { SpeechComparisonResult, SpeechIntent } from './speechTypes';

export interface CompareTranscriptOptions {
  caseSensitive?: boolean;
  stripPunctuation?: boolean;
  collapseWhitespace?: boolean;
  treatNumbersAsWords?: boolean;
}

const DEFAULT_OPTIONS: Required<CompareTranscriptOptions> = {
  caseSensitive: false,
  stripPunctuation: true,
  collapseWhitespace: true,
  treatNumbersAsWords: true,
};

const NUMBER_WORDS: Record<string, string> = {
  '0': 'zero',
  '1': 'one',
  '2': 'two',
  '3': 'three',
  '4': 'four',
  '5': 'five',
  '6': 'six',
  '7': 'seven',
  '8': 'eight',
  '9': 'nine',
  '10': 'ten',
  '11': 'eleven',
  '12': 'twelve',
  '13': 'thirteen',
  '14': 'fourteen',
  '15': 'fifteen',
  '16': 'sixteen',
  '17': 'seventeen',
  '18': 'eighteen',
  '19': 'nineteen',
  '20': 'twenty',
};

function mergeOptions(
  options?: CompareTranscriptOptions
): Required<CompareTranscriptOptions> {
  return {
    ...DEFAULT_OPTIONS,
    ...(options ?? {}),
  };
}

function normalizeApostrophes(value: string): string {
  return value.replace(/[’‘`]/g, "'");
}

function normalizeDashes(value: string): string {
  return value.replace(/[–—]/g, '-');
}

function stripPunctuationKeepingWordBoundaries(value: string): string {
  return value
    .replace(/[^a-zA-Z0-9'\s-]/g, ' ')
    .replace(/-/g, ' ');
}

function normalizeNumberToken(token: string): string {
  return NUMBER_WORDS[token] ?? token;
}

export function normalizeTranscript(
  value: string | null | undefined,
  options?: CompareTranscriptOptions
): string {
  const merged = mergeOptions(options);

  let text = String(value ?? '');
  text = normalizeApostrophes(text);
  text = normalizeDashes(text);

  if (!merged.caseSensitive) text = text.toLowerCase();
  if (merged.stripPunctuation) text = stripPunctuationKeepingWordBoundaries(text);
  if (merged.collapseWhitespace) text = text.replace(/\s+/g, ' ').trim();

  return text;
}

export function tokenizeTranscript(
  value: string | null | undefined,
  options?: CompareTranscriptOptions
): string[] {
  const merged = mergeOptions(options);
  const normalized = normalizeTranscript(value, merged);

  if (!normalized) return [];

  return normalized
    .split(' ')
    .map((token) => token.trim())
    .filter(Boolean)
    .map((token) => (merged.treatNumbersAsWords ? normalizeNumberToken(token) : token));
}

function buildLcsMatrix(expected: string[], actual: string[]): number[][] {
  const rows = expected.length + 1;
  const cols = actual.length + 1;
  const matrix = Array.from({ length: rows }, () => Array(cols).fill(0));

  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      if (expected[i - 1] === actual[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1] + 1;
      } else {
        matrix[i][j] = Math.max(matrix[i - 1][j], matrix[i][j - 1]);
      }
    }
  }

  return matrix;
}

function backtrackMatches(
  expected: string[],
  actual: string[],
  matrix: number[][]
): Array<{ expectedIndex: number; actualIndex: number }> {
  const matches: Array<{ expectedIndex: number; actualIndex: number }> = [];
  let i = expected.length;
  let j = actual.length;

  while (i > 0 && j > 0) {
    if (expected[i - 1] === actual[j - 1]) {
      matches.push({ expectedIndex: i - 1, actualIndex: j - 1 });
      i -= 1;
      j -= 1;
      continue;
    }

    if (matrix[i - 1][j] >= matrix[i][j - 1]) {
      i -= 1;
    } else {
      j -= 1;
    }
  }

  return matches.reverse();
}

function percent(part: number, total: number): number {
  if (total <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((part / total) * 100)));
}

function buildFeedbackMessage(
  intent: SpeechIntent,
  matchScore: number,
  missingWords: string[],
  extraWords: string[]
): string {
  switch (intent) {
    case 'SUCCESS_CLOSE':
      return 'Very close — try once more a little more clearly.';
    case 'SUCCESS':
      return 'Nice job — that matched well.';
    case 'RETRY_WORD':
      return missingWords.length > 0
        ? `Try that word again: ${missingWords[0]}.`
        : 'Try the target word again.';
    case 'RETRY_PHRASE':
      return 'Good try — say the full phrase again.';
    case 'RETRY_SLOW':
      return 'Try again more slowly, one word at a time.';
    case 'NO_SPEECH':
      return 'I could not hear speech. Please try again.';
    default:
      return extraWords.length > 0 || missingWords.length > 0
        ? 'Try again and match the target more closely.'
        : `Match score: ${matchScore}.`;
  }
}

function deriveIntent(
  normalizedTranscript: string,
  normalizedTarget: string,
  matchScore: number,
  missingWords: string[],
  extraWords: string[]
): SpeechIntent {
  if (!normalizedTranscript) return 'NO_SPEECH';
  if (normalizedTranscript === normalizedTarget) return 'SUCCESS';
  if (matchScore >= 85) return 'SUCCESS_CLOSE';
  if (missingWords.length <= 1 && extraWords.length === 0) return 'RETRY_WORD';
  if (matchScore >= 50) return 'RETRY_PHRASE';
  return 'RETRY_SLOW';
}

export function compareTranscript(
  targetTranscript: string | null | undefined,
  actualTranscript: string | null | undefined,
  options?: CompareTranscriptOptions
): SpeechComparisonResult {
  const merged = mergeOptions(options);

  const normalizedTranscript = normalizeTranscript(actualTranscript, merged);
  const normalizedTarget = normalizeTranscript(targetTranscript, merged);

  const transcriptWords = tokenizeTranscript(actualTranscript, merged);
  const targetWords = tokenizeTranscript(targetTranscript, merged);

  const matrix = buildLcsMatrix(targetWords, transcriptWords);
  const matches = backtrackMatches(targetWords, transcriptWords, matrix);

  const matchedTargetIndexes = new Set(matches.map((m) => m.expectedIndex));
  const matchedActualIndexes = new Set(matches.map((m) => m.actualIndex));

  const missingWords = targetWords.filter((_, index) => !matchedTargetIndexes.has(index));
  const extraWords = transcriptWords.filter((_, index) => !matchedActualIndexes.has(index));

  const matchScore = percent(matches.length, Math.max(targetWords.length, 1));
  const intent = deriveIntent(
    normalizedTranscript,
    normalizedTarget,
    matchScore,
    missingWords,
    extraWords
  );

  const message = buildFeedbackMessage(intent, matchScore, missingWords, extraWords);

  return {
    transcript: String(actualTranscript ?? ''),
    normalizedTranscript,
    normalizedTarget,
    matchScore,
    missingWords,
    extraWords,
    intent,
    message,
  };
}

export function compareTranscripts(
  targetTranscript: string | null | undefined,
  actualTranscript: string | null | undefined,
  options?: CompareTranscriptOptions
): SpeechComparisonResult {
  return compareTranscript(targetTranscript, actualTranscript, options);
}

export function getTranscriptAccuracy(
  targetTranscript: string | null | undefined,
  actualTranscript: string | null | undefined,
  options?: CompareTranscriptOptions
): number {
  return compareTranscript(targetTranscript, actualTranscript, options).matchScore;
}

export default compareTranscript;