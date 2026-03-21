import { useCallback, useEffect, useRef, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

import { usePronunciationRecorder } from '@/hooks/usePronunciationRecorder';
import { supabase } from '@/lib/supabaseClient';
import { markEnglishActivity } from '@/services/companion';
import {
  FALLBACK_PRAISE,
  MAX_SPEAK_ATTEMPTS,
  PronunciationResult,
  SPEAK_SESSION_KEY,
  extractCandidateWordsFromPhrase,
  extractFirstSentence,
  normalizePronunciationResult,
} from '../shared';

interface UseSpeakPracticeParams {
  contentEn?: string;
  englishLevel?: string | null;
  preferredName?: string | null;
  addToTroubleWords: (
    word: string,
    score: number,
    tipEn?: string,
    tipVi?: string
  ) => void;
}

function normalizePhraseValue(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function getSpeechSynthesisSafe(): SpeechSynthesis | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return null;
  }

  return window.speechSynthesis;
}

export function useSpeakPractice({
  contentEn,
  englishLevel,
  preferredName,
  addToTroubleWords,
}: UseSpeakPracticeParams) {
  const recorder = usePronunciationRecorder();

  const [targetPhrase, setTargetPhraseState] = useState('');
  const targetPhraseRef = useRef('');
  const [isPlayingTarget, setIsPlayingTarget] = useState(false);
  const [pronunciationResult, setPronunciationResult] =
    useState<PronunciationResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [speakAttempts, setSpeakAttempts] = useState(0);
  const [speakLimitReached, setSpeakLimitReached] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [lastRecordedAudioUrl, setLastRecordedAudioUrl] = useState<string | null>(
    null
  );

  const setTargetPhrase: Dispatch<SetStateAction<string>> = useCallback(
    (value) => {
      if (typeof value === 'function') {
        setTargetPhraseState((prev) => {
          const next = normalizePhraseValue(value(prev));
          targetPhraseRef.current = next;
          return next;
        });
        return;
      }

      const next = normalizePhraseValue(value);
      targetPhraseRef.current = next;
      setTargetPhraseState(next);
    },
    []
  );

  const resolvePlaybackPhrase = useCallback(
    (phrase?: unknown) => {
      const directPhrase = typeof phrase === 'string' ? phrase.trim() : '';
      if (directPhrase) return directPhrase;

      const latestStoredPhrase = targetPhraseRef.current?.trim();
      if (latestStoredPhrase) return latestStoredPhrase;

      return normalizePhraseValue(targetPhrase).trim();
    },
    [targetPhrase]
  );

  useEffect(() => {
    if (contentEn && !targetPhrase) {
      setTargetPhrase(extractFirstSentence(contentEn));
    }
  }, [contentEn, targetPhrase, setTargetPhrase]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const stored = window.sessionStorage.getItem(SPEAK_SESSION_KEY);
    if (stored) {
      const attempts = parseInt(stored, 10);
      setSpeakAttempts(attempts);
      setSpeakLimitReached(attempts >= MAX_SPEAK_ATTEMPTS);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (lastRecordedAudioUrl) {
        URL.revokeObjectURL(lastRecordedAudioUrl);
      }
    };
  }, [lastRecordedAudioUrl]);

  useEffect(() => {
    return () => {
      getSpeechSynthesisSafe()?.cancel();
    };
  }, []);

  const handlePlayTarget = useCallback(
    (phrase?: unknown) => {
      const phraseToPlay = resolvePlaybackPhrase(phrase);
      if (!phraseToPlay || isPlayingTarget) return;

      const speechSynthesis = getSpeechSynthesisSafe();
      if (!speechSynthesis) return;

      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(phraseToPlay);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.onstart = () => setIsPlayingTarget(true);
      utterance.onend = () => setIsPlayingTarget(false);
      utterance.onerror = () => setIsPlayingTarget(false);

      speechSynthesis.speak(utterance);
    },
    [resolvePlaybackPhrase, isPlayingTarget]
  );

  const handlePlaySlow = useCallback(
    (phrase?: unknown) => {
      const phraseToPlay = resolvePlaybackPhrase(phrase);
      if (!phraseToPlay || isPlayingTarget) return;

      const speechSynthesis = getSpeechSynthesisSafe();
      if (!speechSynthesis) return;

      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(phraseToPlay);
      utterance.lang = 'en-US';
      utterance.rate = 0.65;
      utterance.onstart = () => setIsPlayingTarget(true);
      utterance.onend = () => setIsPlayingTarget(false);
      utterance.onerror = () => setIsPlayingTarget(false);

      speechSynthesis.speak(utterance);
    },
    [resolvePlaybackPhrase, isPlayingTarget]
  );

  const handleShadowCompare = useCallback(async () => {
    if (!lastRecordedAudioUrl || !targetPhrase || isComparing) return;

    const speechSynthesis = getSpeechSynthesisSafe();
    if (!speechSynthesis) return;

    setIsComparing(true);
    speechSynthesis.cancel();

    const nativeUtterance = new SpeechSynthesisUtterance(targetPhrase);
    nativeUtterance.lang = 'en-US';
    nativeUtterance.rate = 0.85;
    nativeUtterance.onstart = () => setIsPlayingTarget(true);

    nativeUtterance.onend = async () => {
      setIsPlayingTarget(false);
      await new Promise((resolve) => setTimeout(resolve, 500));

      const userAudio = new Audio(lastRecordedAudioUrl);

      userAudio.onended = () => {
        setIsComparing(false);
        setIsPlayingTarget(false);
      };

      userAudio.onerror = () => {
        setIsComparing(false);
        setIsPlayingTarget(false);
      };

      try {
        await userAudio.play();
      } catch (error) {
        console.error('Shadow compare playback failed:', error);
        setIsComparing(false);
        setIsPlayingTarget(false);
      }
    };

    nativeUtterance.onerror = () => {
      setIsComparing(false);
      setIsPlayingTarget(false);
    };

    speechSynthesis.speak(nativeUtterance);
  }, [lastRecordedAudioUrl, targetPhrase, isComparing]);

  const handleTroubleWordPractice = useCallback(
    (word: string) => {
      if (!word) return;

      getSpeechSynthesisSafe()?.cancel();
      setTargetPhrase(word);
      setPronunciationResult(null);
      setIsPlayingTarget(false);
      setIsComparing(false);

      if (lastRecordedAudioUrl) {
        URL.revokeObjectURL(lastRecordedAudioUrl);
        setLastRecordedAudioUrl(null);
      }
    },
    [lastRecordedAudioUrl, setTargetPhrase]
  );

  const handleVaultReplay = useCallback(
    (word: string) => {
      if (!word) return;

      setTargetPhrase(word);
      setPronunciationResult(null);
      setIsPlayingTarget(false);
      setIsComparing(false);

      const speechSynthesis = getSpeechSynthesisSafe();
      if (!speechSynthesis) return;

      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.7;
      utterance.onstart = () => setIsPlayingTarget(true);
      utterance.onend = () => setIsPlayingTarget(false);
      utterance.onerror = () => setIsPlayingTarget(false);
      speechSynthesis.speak(utterance);
    },
    [setTargetPhrase]
  );

  const handleRecordToggle = useCallback(async () => {
    if (recorder.status === 'recording') {
      await recorder.stopRecording();
      return;
    }

    getSpeechSynthesisSafe()?.cancel();
    setPronunciationResult(null);
    setIsPlayingTarget(false);
    setIsComparing(false);

    if (lastRecordedAudioUrl) {
      URL.revokeObjectURL(lastRecordedAudioUrl);
      setLastRecordedAudioUrl(null);
    }

    await recorder.startRecording();
  }, [recorder, lastRecordedAudioUrl]);

  const evaluatePronunciation = useCallback(async () => {
    if (!recorder.audioBlob || !targetPhrase) return;

    if (speakAttempts >= MAX_SPEAK_ATTEMPTS) {
      setSpeakLimitReached(true);
      return;
    }

    setIsEvaluating(true);

    try {
      const currentAudioBlob = recorder.audioBlob;
      const arrayBuffer = await currentAudioBlob.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(arrayBuffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ''
        )
      );

      const { data, error } = await supabase.functions.invoke(
        'guide-pronunciation-coach',
        {
          body: {
            audioBase64: base64,
            targetText: targetPhrase.slice(0, 120),
            englishLevel: englishLevel || 'beginner',
            preferredName,
            requestDetailedAnalysis: true,
          },
        }
      );

      if (error || !data?.ok) {
        throw new Error(data?.error || 'Failed to evaluate pronunciation');
      }

      const result = normalizePronunciationResult(
        data as Partial<PronunciationResult>,
        targetPhrase
      );
      setPronunciationResult(result);

      const focusItems = result.feedback?.focus_items ?? [];

      if (recorder.audioBlob) {
        if (lastRecordedAudioUrl) {
          URL.revokeObjectURL(lastRecordedAudioUrl);
        }
        const audioUrl = URL.createObjectURL(recorder.audioBlob);
        setLastRecordedAudioUrl(audioUrl);
      }

      focusItems.forEach((item) => {
        addToTroubleWords(
          item.word,
          result.score,
          item.tip_en || undefined,
          item.tip_vi || undefined
        );
      });

      if (focusItems.length === 0 && result.score < 70) {
        const candidates = extractCandidateWordsFromPhrase(targetPhrase);
        candidates.slice(0, 3).forEach((word) => {
          addToTroubleWords(word, result.score);
        });
      }

      const newAttempts = speakAttempts + 1;
      setSpeakAttempts(newAttempts);

      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(SPEAK_SESSION_KEY, String(newAttempts));
      }

      if (newAttempts >= MAX_SPEAK_ATTEMPTS) {
        setSpeakLimitReached(true);
      }

      void markEnglishActivity();
    } catch (err) {
      console.error('Pronunciation evaluation error:', err);

      setPronunciationResult({
        targetText: targetPhrase,
        transcribedText: '',
        score: 0,
        feedback: {
          praise_en: FALLBACK_PRAISE.en,
          praise_vi: FALLBACK_PRAISE.vi,
          focus_items: [],
          encouragement_en: '',
          encouragement_vi: '',
        },
      });

      const fallbackCandidates = extractCandidateWordsFromPhrase(targetPhrase);
      fallbackCandidates.slice(0, 2).forEach((word) => {
        addToTroubleWords(word, 0);
      });
    } finally {
      setIsEvaluating(false);
      recorder.reset();
    }
  }, [
    recorder.audioBlob,
    recorder,
    targetPhrase,
    englishLevel,
    preferredName,
    speakAttempts,
    lastRecordedAudioUrl,
    addToTroubleWords,
  ]);

  useEffect(() => {
    if (
      recorder.audioBlob &&
      recorder.status === 'idle' &&
      targetPhrase &&
      !isEvaluating
    ) {
      evaluatePronunciation();
    }
  }, [
    recorder.audioBlob,
    recorder.status,
    targetPhrase,
    isEvaluating,
    evaluatePronunciation,
  ]);

  const resetPlaybackState = useCallback(() => {
    getSpeechSynthesisSafe()?.cancel();
    setIsPlayingTarget(false);
    setIsComparing(false);
  }, []);

  const clearRecordedAudio = useCallback(() => {
    if (lastRecordedAudioUrl) {
      URL.revokeObjectURL(lastRecordedAudioUrl);
      setLastRecordedAudioUrl(null);
    }
  }, [lastRecordedAudioUrl]);

  const resetPracticeState = useCallback(() => {
    setPronunciationResult(null);
    setIsComparing(false);
    setIsPlayingTarget(false);
    clearRecordedAudio();
    recorder.reset();
  }, [clearRecordedAudio, recorder]);

  return {
    recorder,
    targetPhrase,
    setTargetPhrase,
    isPlayingTarget,
    pronunciationResult,
    isEvaluating,
    speakAttempts,
    speakLimitReached,
    isComparing,
    lastRecordedAudioUrl,
    handlePlayTarget,
    handlePlaySlow,
    handleShadowCompare,
    handleTroubleWordPractice,
    handleVaultReplay,
    handleRecordToggle,
    resetPlaybackState,
    resetPracticeState,
    clearRecordedAudio,
  };
}

export type UseSpeakPracticeResult = ReturnType<typeof useSpeakPractice>;
