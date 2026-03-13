/**
 * Path: src/components/mercy-guide/hooks/useDailyCoach.ts
 */

import { useCallback, useEffect, useMemo, useState } from 'react';

type DailyCoachState = 'idle' | 'intro' | 'feedback' | 'complete';

interface CompanionProfileLike {
  preferred_name?: string;
  learning_goal?: string;
  english_level?: string;
}

interface TroubleWordLike {
  word?: string;
  text?: string;
  phrase?: string;
  example?: string;
}

interface PronunciationResultLike {
  score?: number;
  overallScore?: number;
  focusWord?: string;
  focusTip?: string;
  praise?: string;
  summary?: string;
  feedback?: {
    focusWord?: string;
    focusTip?: string;
    praise?: string;
    summary?: string;
  };
}

interface SpeakPracticeLike {
  setTargetPhrase: (phrase: string) => void;
  resetPracticeState: () => void;
  pronunciationResult: PronunciationResultLike | null;
}

interface UseDailyCoachParams {
  profile?: CompanionProfileLike;
  contentEn?: string;
  troubleWords?: TroubleWordLike[] | string[];
  speakPractice: SpeakPracticeLike;
  onOpenSpeak: () => void;
}

const STORAGE_KEY_PREFIX = 'mercy-daily-coach';
const FALLBACK_PHRASES = [
  'I can speak slowly and clearly.',
  'I am practicing English with confidence.',
  'I can do one small step today.',
  'My voice matters.',
  'I can try again with calm focus.',
];

function getTodayKey() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function getStorageKey(profile?: CompanionProfileLike) {
  const name = (profile?.preferred_name || 'guest').trim().toLowerCase() || 'guest';
  return `${STORAGE_KEY_PREFIX}:${name}:${getTodayKey()}`;
}

function loadCompletedToday(profile?: CompanionProfileLike) {
  try {
    return localStorage.getItem(getStorageKey(profile)) === 'done';
  } catch {
    return false;
  }
}

function saveCompletedToday(profile?: CompanionProfileLike) {
  try {
    localStorage.setItem(getStorageKey(profile), 'done');
  } catch {
    // ignore storage failures
  }
}

function clearCompletedToday(profile?: CompanionProfileLike) {
  try {
    localStorage.removeItem(getStorageKey(profile));
  } catch {
    // ignore storage failures
  }
}

function normalizePhrase(text: string) {
  return text.replace(/\s+/g, ' ').trim();
}

function ensureSentence(text: string) {
  const value = normalizePhrase(text);
  if (!value) return '';
  return /[.!?]$/.test(value) ? value : `${value}.`;
}

function uniquePhrases(phrases: string[]) {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const phrase of phrases) {
    const normalized = normalizePhrase(phrase);
    if (!normalized) continue;

    const key = normalized.toLowerCase();
    if (seen.has(key)) continue;

    seen.add(key);
    result.push(ensureSentence(normalized));
  }

  return result;
}

function getTroubleWordPhrase(item: TroubleWordLike | string) {
  if (typeof item === 'string') {
    const value = normalizePhrase(item);
    if (!value) return '';
    return value.split(/\s+/).length <= 4 ? `I can say ${value}` : value;
  }

  const phrase =
    normalizePhrase(item.phrase || '') ||
    normalizePhrase(item.example || '') ||
    normalizePhrase(item.text || '') ||
    normalizePhrase(item.word || '');

  if (!phrase) return '';
  return phrase.split(/\s+/).length <= 4 ? `I can say ${phrase}` : phrase;
}

function getTroubleWordCandidates(troubleWords?: TroubleWordLike[] | string[]) {
  if (!Array.isArray(troubleWords)) return [];
  return troubleWords.map(getTroubleWordPhrase).filter(Boolean);
}

function getContentCandidates(contentEn?: string) {
  if (!contentEn) return [];

  const cleaned = contentEn.replace(/\s+/g, ' ').trim();
  if (!cleaned) return [];

  return cleaned
    .split(/(?<=[.!?])\s+/)
    .map((part) => normalizePhrase(part))
    .filter((part) => {
      const words = part.split(/\s+/).filter(Boolean);
      return words.length >= 4 && words.length <= 18;
    });
}

function getPhraseCandidates(
  troubleWords?: TroubleWordLike[] | string[],
  contentEn?: string
) {
  return uniquePhrases([
    ...getTroubleWordCandidates(troubleWords),
    ...getContentCandidates(contentEn),
    ...FALLBACK_PHRASES,
  ]);
}

function getPhraseSource(
  phrase: string,
  troubleWords?: TroubleWordLike[] | string[],
  contentEn?: string
) {
  const normalized = normalizePhrase(phrase).toLowerCase();

  if (
    getTroubleWordCandidates(troubleWords).some(
      (candidate) => normalizePhrase(candidate).toLowerCase() === normalized
    )
  ) {
    return 'From your trouble words';
  }

  if (
    getContentCandidates(contentEn).some(
      (candidate) => normalizePhrase(candidate).toLowerCase() === normalized
    )
  ) {
    return 'From today’s lesson';
  }

  return 'Daily practice';
}

function getPersonalLine(profile?: CompanionProfileLike) {
  const name = normalizePhrase(profile?.preferred_name || '');
  const goal = normalizePhrase(profile?.learning_goal || '');
  const level = normalizePhrase(profile?.english_level || '');

  if (name && goal) return `${name}, this line supports your goal: ${goal}.`;
  if (name && level) return `${name}, this is a good ${level.toLowerCase()} speaking line for today.`;
  if (name) return `${name}, let’s practice one strong sentence today.`;
  return 'Say this once clearly, then once with confidence.';
}

function getScore(result: PronunciationResultLike | null | undefined): number {
  if (!result) return 0;
  if (typeof result.score === 'number') return Math.round(result.score);
  if (typeof result.overallScore === 'number') return Math.round(result.overallScore);
  return 0;
}

function getFocusWord(result: PronunciationResultLike | null | undefined, phrase: string) {
  if (result?.focusWord) return result.focusWord;
  if (result?.feedback?.focusWord) return result.feedback.focusWord;

  return (
    phrase
      .replace(/[^\w\s'-]/g, '')
      .split(/\s+/)
      .find((word) => word.length >= 5) || ''
  );
}

function getFocusTip(result: PronunciationResultLike | null | undefined, focusWord?: string) {
  if (result?.focusTip) return result.focusTip;
  if (result?.feedback?.focusTip) return result.feedback.focusTip;
  if (focusWord) return `Say “${focusWord}” a little slower and finish each sound clearly.`;
  return 'Slow down a little and keep each word clear from start to finish.';
}

function getPraise(result: PronunciationResultLike | null | undefined, score: number) {
  if (result?.praise) return result.praise;
  if (result?.feedback?.praise) return result.feedback.praise;
  if (result?.summary) return result.summary;
  if (result?.feedback?.summary) return result.feedback.summary;

  if (score >= 92) {
    return 'Beautiful work. Your delivery sounded clear and confident.';
  }

  if (score >= 84) {
    return 'Nice job. Your sentence is getting smoother and clearer.';
  }

  return 'Good effort. One more careful try will make this stronger.';
}

export function useDailyCoach({
  profile,
  contentEn,
  troubleWords,
  speakPractice,
  onOpenSpeak,
}: UseDailyCoachParams) {
  const [manualState, setManualState] = useState<Exclude<DailyCoachState, 'feedback'>>(() =>
    loadCompletedToday(profile) ? 'complete' : 'idle'
  );
  const [retryCount, setRetryCount] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);

  const phraseCandidates = useMemo(
    () => getPhraseCandidates(troubleWords, contentEn),
    [troubleWords, contentEn]
  );

  const phrase =
    phraseCandidates[phraseIndex] ||
    phraseCandidates[0] ||
    FALLBACK_PHRASES[0];

  const source = useMemo(
    () => getPhraseSource(phrase, troubleWords, contentEn),
    [phrase, troubleWords, contentEn]
  );

  const personalLine = useMemo(() => getPersonalLine(profile), [profile]);

  const pronunciationResult = speakPractice.pronunciationResult;

  const state: DailyCoachState =
    manualState === 'complete'
      ? 'complete'
      : pronunciationResult
        ? 'feedback'
        : manualState;

  const score = useMemo(
    () => getScore(pronunciationResult),
    [pronunciationResult]
  );

  const focusWord = useMemo(
    () => getFocusWord(pronunciationResult, phrase),
    [pronunciationResult, phrase]
  );

  const focusTip = useMemo(
    () => getFocusTip(pronunciationResult, focusWord),
    [pronunciationResult, focusWord]
  );

  const praise = useMemo(
    () => getPraise(pronunciationResult, score),
    [pronunciationResult, score]
  );

  const canRetry = retryCount < 1;

  useEffect(() => {
    setManualState(loadCompletedToday(profile) ? 'complete' : 'idle');
  }, [profile?.preferred_name]);

  useEffect(() => {
    setPhraseIndex((current) => {
      if (phraseCandidates.length === 0) return 0;
      return current >= phraseCandidates.length ? 0 : current;
    });
  }, [phraseCandidates]);

  useEffect(() => {
    if (manualState === 'complete') return;

    const nextScore = getScore(pronunciationResult);
    if (nextScore >= 95) {
      saveCompletedToday(profile);
      setManualState('complete');
    }
  }, [manualState, pronunciationResult, profile]);

  const startSpeaking = useCallback(() => {
    speakPractice.resetPracticeState();
    speakPractice.setTargetPhrase(phrase);
    setManualState('intro');
    onOpenSpeak();
  }, [onOpenSpeak, phrase, speakPractice]);

  const changePhrase = useCallback(() => {
    setPhraseIndex((current) => (current + 1) % Math.max(phraseCandidates.length, 1));
    setRetryCount(0);
    speakPractice.resetPracticeState();
    setManualState('idle');
  }, [phraseCandidates.length, speakPractice]);

  const tryOnceMore = useCallback(() => {
    if (!canRetry) return;

    setRetryCount(1);
    speakPractice.resetPracticeState();
    speakPractice.setTargetPhrase(phrase);
    setManualState('intro');
    onOpenSpeak();
  }, [canRetry, onOpenSpeak, phrase, speakPractice]);

  const finishToday = useCallback(() => {
    saveCompletedToday(profile);
    setManualState('complete');
  }, [profile]);

  const practiceAnother = useCallback(() => {
    clearCompletedToday(profile);
    setRetryCount(0);
    setPhraseIndex((current) => (current + 1) % Math.max(phraseCandidates.length, 1));
    speakPractice.resetPracticeState();
    setManualState('idle');
  }, [phraseCandidates.length, profile, speakPractice]);

  return {
    state,
    phrase,
    source,
    personalLine,
    retryCount,
    score,
    focusWord,
    focusTip,
    praise,
    canRetry,
    startSpeaking,
    changePhrase,
    tryOnceMore,
    finishToday,
    practiceAnother,
  };
}