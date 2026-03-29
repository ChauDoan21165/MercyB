import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

import { usePronunciationRecorder } from '@/hooks/usePronunciationRecorder';
import { supabase } from '@/lib/supabaseClient';
import { markEnglishActivity } from '@/services/companion';
import {
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

type PlaybackMode = 'normal' | 'slow' | null;

function normalizePhraseValue(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function getSpeechSynthesisSafe(): SpeechSynthesis | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return null;
  }

  return window.speechSynthesis;
}

function getFriendlyRecordError(error: unknown): string {
  const raw =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : 'Unable to start recording.';

  const normalized = raw.toLowerCase();

  if (
    normalized.includes('permission') ||
    normalized.includes('notallowed') ||
    normalized.includes('denied')
  ) {
    return [
      'Microphone access is blocked.',
      'Please allow microphone permission in your browser, then try again.',
      'Quyền dùng micro đang bị chặn. Hãy cho phép micro trong trình duyệt rồi thử lại.',
    ].join('\n');
  }

  if (
    normalized.includes('notfound') ||
    normalized.includes('no microphone') ||
    normalized.includes('device')
  ) {
    return [
      'No microphone was found.',
      'Please connect a microphone or check your input device settings.',
      'Không tìm thấy micro. Hãy kiểm tra thiết bị thu âm rồi thử lại.',
    ].join('\n');
  }

  if (
    normalized.includes('secure') ||
    normalized.includes('https') ||
    normalized.includes('insecure')
  ) {
    return [
      'Recording requires a secure page.',
      'Open this on HTTPS or localhost to use the microphone.',
      'Thu âm cần trang bảo mật HTTPS hoặc localhost.',
    ].join('\n');
  }

  return raw;
}

function delay(ms: number) {
  return new Promise<void>((resolve) => {
    if (typeof window === 'undefined') {
      resolve();
      return;
    }

    window.setTimeout(resolve, ms);
  });
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
  const [activePlaybackMode, setActivePlaybackMode] = useState<PlaybackMode>(null);
  const [pronunciationResult, setPronunciationResult] =
    useState<PronunciationResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [speakAttempts, setSpeakAttempts] = useState(0);
  const [speakLimitReached, setSpeakLimitReached] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [localRecordedAudioUrl, setLocalRecordedAudioUrl] = useState<string | null>(
    null
  );

  const recorderLastRecordedAudioUrl =
    'lastRecordedAudioUrl' in recorder ? recorder.lastRecordedAudioUrl ?? null : null;

  const lastRecordedAudioUrl = recorderLastRecordedAudioUrl ?? localRecordedAudioUrl;

  const setRecorderError = useCallback(
    (message: string | null) => {
      if (typeof recorder.setError === 'function') {
        recorder.setError(message);
      }
    },
    [recorder]
  );

  const clearRecordedAudio = useCallback(() => {
    if (typeof recorder.clearRecordedAudio === 'function') {
      recorder.clearRecordedAudio();
      return;
    }

    if (localRecordedAudioUrl) {
      URL.revokeObjectURL(localRecordedAudioUrl);
      setLocalRecordedAudioUrl(null);
    }
  }, [localRecordedAudioUrl, recorder]);

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

  const trimmedTargetPhrase = useMemo(
    () => normalizePhraseValue(targetPhrase).trim(),
    [targetPhrase]
  );

  const resolvePlaybackPhrase = useCallback(
    (phrase?: unknown) => {
      const directPhrase = typeof phrase === 'string' ? phrase.trim() : '';
      if (directPhrase) return directPhrase;

      const latestStoredPhrase = targetPhraseRef.current?.trim();
      if (latestStoredPhrase) return latestStoredPhrase;

      return trimmedTargetPhrase;
    },
    [trimmedTargetPhrase]
  );

  useEffect(() => {
    if (contentEn && !trimmedTargetPhrase) {
      setTargetPhrase(extractFirstSentence(contentEn));
    }
  }, [contentEn, trimmedTargetPhrase, setTargetPhrase]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const stored = window.sessionStorage.getItem(SPEAK_SESSION_KEY);
    if (stored) {
      const attempts = parseInt(stored, 10);
      if (!Number.isNaN(attempts)) {
        setSpeakAttempts(attempts);
        setSpeakLimitReached(attempts >= MAX_SPEAK_ATTEMPTS);
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      if (localRecordedAudioUrl) {
        URL.revokeObjectURL(localRecordedAudioUrl);
      }
    };
  }, [localRecordedAudioUrl]);

  useEffect(() => {
    return () => {
      getSpeechSynthesisSafe()?.cancel();
    };
  }, []);

  const handlePlayTarget = useCallback(
    async (phrase?: unknown) => {
      const phraseToPlay = resolvePlaybackPhrase(phrase);
      if (!phraseToPlay || isPlayingTarget) return;

      if (typeof recorder.playReference === 'function') {
        try {
          setIsPlayingTarget(true);
          setActivePlaybackMode('normal');
          await recorder.playReference(phraseToPlay, 0.9);
        } finally {
          setIsPlayingTarget(false);
          setActivePlaybackMode(null);
        }
        return;
      }

      const speechSynthesis = getSpeechSynthesisSafe();
      if (!speechSynthesis) return;

      speechSynthesis.cancel();

      await new Promise<void>((resolve) => {
        const utterance = new SpeechSynthesisUtterance(phraseToPlay);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        utterance.onstart = () => {
          setIsPlayingTarget(true);
          setActivePlaybackMode('normal');
        };
        utterance.onend = () => {
          setIsPlayingTarget(false);
          setActivePlaybackMode(null);
          resolve();
        };
        utterance.onerror = () => {
          setIsPlayingTarget(false);
          setActivePlaybackMode(null);
          resolve();
        };

        speechSynthesis.speak(utterance);
      });
    },
    [resolvePlaybackPhrase, isPlayingTarget, recorder]
  );

  const handlePlaySlow = useCallback(
    async (phrase?: unknown) => {
      const phraseToPlay = resolvePlaybackPhrase(phrase);
      if (!phraseToPlay || isPlayingTarget) return;

      if (typeof recorder.playReference === 'function') {
        try {
          setIsPlayingTarget(true);
          setActivePlaybackMode('slow');
          await recorder.playReference(phraseToPlay, 0.65);
        } finally {
          setIsPlayingTarget(false);
          setActivePlaybackMode(null);
        }
        return;
      }

      const speechSynthesis = getSpeechSynthesisSafe();
      if (!speechSynthesis) return;

      speechSynthesis.cancel();

      await new Promise<void>((resolve) => {
        const utterance = new SpeechSynthesisUtterance(phraseToPlay);
        utterance.lang = 'en-US';
        utterance.rate = 0.65;
        utterance.onstart = () => {
          setIsPlayingTarget(true);
          setActivePlaybackMode('slow');
        };
        utterance.onend = () => {
          setIsPlayingTarget(false);
          setActivePlaybackMode(null);
          resolve();
        };
        utterance.onerror = () => {
          setIsPlayingTarget(false);
          setActivePlaybackMode(null);
          resolve();
        };

        speechSynthesis.speak(utterance);
      });
    },
    [resolvePlaybackPhrase, isPlayingTarget, recorder]
  );

  const playRecordedAudioFallback = useCallback(async () => {
    if (!lastRecordedAudioUrl) return;

    await new Promise<void>((resolve, reject) => {
      try {
        const audio = new Audio(lastRecordedAudioUrl);
        audio.onended = () => resolve();
        audio.onerror = () => reject(new Error('Recorded playback failed.'));
        void audio.play().catch(reject);
      } catch (error) {
        reject(error);
      }
    });
  }, [lastRecordedAudioUrl]);

  const handleShadowCompare = useCallback(async () => {
    if (!lastRecordedAudioUrl || !trimmedTargetPhrase || isComparing) return;

    if (typeof recorder.compareWithReference === 'function') {
      try {
        setIsComparing(true);
        setIsPlayingTarget(true);
        setActivePlaybackMode('normal');
        await recorder.compareWithReference(trimmedTargetPhrase, 0.85, 500);
      } catch (error) {
        console.error('Shadow compare playback failed:', error);
      } finally {
        setIsComparing(false);
        setIsPlayingTarget(false);
        setActivePlaybackMode(null);
      }
      return;
    }

    const speechSynthesis = getSpeechSynthesisSafe();
    if (!speechSynthesis) return;

    setIsComparing(true);
    speechSynthesis.cancel();

    try {
      await new Promise<void>((resolve) => {
        const nativeUtterance = new SpeechSynthesisUtterance(trimmedTargetPhrase);
        nativeUtterance.lang = 'en-US';
        nativeUtterance.rate = 0.85;
        nativeUtterance.onstart = () => {
          setIsPlayingTarget(true);
          setActivePlaybackMode('normal');
        };
        nativeUtterance.onend = () => {
          setIsPlayingTarget(false);
          setActivePlaybackMode(null);
          resolve();
        };
        nativeUtterance.onerror = () => {
          setIsPlayingTarget(false);
          setActivePlaybackMode(null);
          resolve();
        };
        speechSynthesis.speak(nativeUtterance);
      });

      await delay(500);
      await playRecordedAudioFallback();
    } catch (error) {
      console.error('Shadow compare playback failed:', error);
    } finally {
      setIsComparing(false);
      setIsPlayingTarget(false);
      setActivePlaybackMode(null);
    }
  }, [
    isComparing,
    lastRecordedAudioUrl,
    playRecordedAudioFallback,
    recorder,
    trimmedTargetPhrase,
  ]);

  const handleTroubleWordPractice = useCallback(
    async (word: string) => {
      if (!word) return;

      getSpeechSynthesisSafe()?.cancel();
      setTargetPhrase(word);
      setPronunciationResult(null);
      setIsPlayingTarget(false);
      setIsComparing(false);
      setActivePlaybackMode(null);

      if (!recorderLastRecordedAudioUrl && localRecordedAudioUrl) {
        URL.revokeObjectURL(localRecordedAudioUrl);
        setLocalRecordedAudioUrl(null);
      }

      const speechSynthesis = getSpeechSynthesisSafe();
      if (!speechSynthesis) return;

      if (typeof recorder.playReference === 'function') {
        try {
          setIsPlayingTarget(true);
          setActivePlaybackMode('normal');
          await recorder.playReference(word, 0.72);
        } finally {
          setIsPlayingTarget(false);
          setActivePlaybackMode(null);
        }
        return;
      }

      speechSynthesis.cancel();

      await new Promise<void>((resolve) => {
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = 'en-US';
        utterance.rate = 0.72;
        utterance.onstart = () => {
          setIsPlayingTarget(true);
          setActivePlaybackMode('normal');
        };
        utterance.onend = () => {
          setIsPlayingTarget(false);
          setActivePlaybackMode(null);
          resolve();
        };
        utterance.onerror = () => {
          setIsPlayingTarget(false);
          setActivePlaybackMode(null);
          resolve();
        };
        speechSynthesis.speak(utterance);
      });
    },
    [localRecordedAudioUrl, recorder, recorderLastRecordedAudioUrl, setTargetPhrase]
  );

  const handleVaultReplay = useCallback(
    async (word: string) => {
      if (!word) return;

      setTargetPhrase(word);
      setPronunciationResult(null);
      setIsPlayingTarget(false);
      setIsComparing(false);
      setActivePlaybackMode(null);

      if (typeof recorder.playReference === 'function') {
        try {
          setIsPlayingTarget(true);
          setActivePlaybackMode('normal');
          await recorder.playReference(word, 0.7);
        } finally {
          setIsPlayingTarget(false);
          setActivePlaybackMode(null);
        }
        return;
      }

      const speechSynthesis = getSpeechSynthesisSafe();
      if (!speechSynthesis) return;

      speechSynthesis.cancel();
      await new Promise<void>((resolve) => {
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = 'en-US';
        utterance.rate = 0.7;
        utterance.onstart = () => {
          setIsPlayingTarget(true);
          setActivePlaybackMode('normal');
        };
        utterance.onend = () => {
          setIsPlayingTarget(false);
          setActivePlaybackMode(null);
          resolve();
        };
        utterance.onerror = () => {
          setIsPlayingTarget(false);
          setActivePlaybackMode(null);
          resolve();
        };
        speechSynthesis.speak(utterance);
      });
    },
    [recorder, setTargetPhrase]
  );

  const canRecord =
    !isEvaluating &&
    !speakLimitReached &&
    recorder.status !== 'processing';

  const recordDisabledReason = useMemo(() => {
    if (speakLimitReached) {
      return 'You have reached the speaking limit for this session.';
    }

    if (isEvaluating) {
      return 'Your last recording is being evaluated.';
    }

    if (recorder.status === 'processing') {
      return 'Your recording is still processing.';
    }

    return null;
  }, [isEvaluating, recorder.status, speakLimitReached]);

  const handleRecordToggle = useCallback(async () => {
    if (recorder.status === 'recording') {
      await recorder.stopRecording();
      return;
    }

    if (!trimmedTargetPhrase) {
      setRecorderError(
        [
          'Please enter a word or short sentence first.',
          'Vui lòng nhập một từ hoặc câu ngắn trước nhé.',
        ].join('\n')
      );
      return;
    }

    if (!canRecord) {
      if (recordDisabledReason) {
        setRecorderError(recordDisabledReason);
      }
      return;
    }

    getSpeechSynthesisSafe()?.cancel();
    setPronunciationResult(null);
    setIsPlayingTarget(false);
    setIsComparing(false);
    setActivePlaybackMode(null);

    clearRecordedAudio();

    setRecorderError(null);

    try {
      await recorder.startRecording();
    } catch (error) {
      console.error('Failed to start recording:', error);
      setRecorderError(getFriendlyRecordError(error));
    }
  }, [
    recorder,
    trimmedTargetPhrase,
    canRecord,
    recordDisabledReason,
    clearRecordedAudio,
    setRecorderError,
  ]);

  const evaluatePronunciation = useCallback(async () => {
    if (!recorder.audioBlob || !trimmedTargetPhrase) return;

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
            targetText: trimmedTargetPhrase.slice(0, 120),
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
        trimmedTargetPhrase
      );
      setPronunciationResult(result);

      const focusItems = result.feedback?.focus_items ?? [];

      if (recorder.audioBlob && !recorderLastRecordedAudioUrl) {
        if (localRecordedAudioUrl) {
          URL.revokeObjectURL(localRecordedAudioUrl);
        }
        const audioUrl = URL.createObjectURL(recorder.audioBlob);
        setLocalRecordedAudioUrl(audioUrl);
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
        const candidates = extractCandidateWordsFromPhrase(trimmedTargetPhrase);
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

      setPronunciationResult(null);

      setRecorderError(
        [
          'Pronunciation scoring is temporarily unavailable.',
          'You can still use Listen and Compare.',
          'Chấm điểm phát âm tạm thời chưa dùng được.',
          'Bạn vẫn có thể dùng Listen và Compare.',
        ].join('\n')
      );

      const fallbackCandidates =
        extractCandidateWordsFromPhrase(trimmedTargetPhrase);
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
    trimmedTargetPhrase,
    englishLevel,
    preferredName,
    speakAttempts,
    recorderLastRecordedAudioUrl,
    localRecordedAudioUrl,
    addToTroubleWords,
    setRecorderError,
  ]);

  useEffect(() => {
    if (
      recorder.audioBlob &&
      recorder.status === 'idle' &&
      trimmedTargetPhrase &&
      !isEvaluating
    ) {
      evaluatePronunciation();
    }
  }, [
    recorder.audioBlob,
    recorder.status,
    trimmedTargetPhrase,
    isEvaluating,
    evaluatePronunciation,
  ]);

  const resetPlaybackState = useCallback(() => {
    getSpeechSynthesisSafe()?.cancel();
    setIsPlayingTarget(false);
    setIsComparing(false);
    setActivePlaybackMode(null);
  }, []);

  const resetPracticeState = useCallback(() => {
    setPronunciationResult(null);
    setIsComparing(false);
    setIsPlayingTarget(false);
    setActivePlaybackMode(null);
    clearRecordedAudio();
    recorder.reset();
  }, [clearRecordedAudio, recorder]);

  return {
    recorder,
    targetPhrase,
    setTargetPhrase,
    trimmedTargetPhrase,
    canRecord,
    recordDisabledReason,
    isPlayingTarget,
    activePlaybackMode,
    isNormalPlaybackActive: isPlayingTarget && activePlaybackMode === 'normal',
    isSlowPlaybackActive: isPlayingTarget && activePlaybackMode === 'slow',
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