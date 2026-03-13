import { useCallback, useEffect, useState } from 'react';
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
  addToTroubleWords: (word: string, score: number, tipEn?: string, tipVi?: string) => void;
}

export function useSpeakPractice({
  contentEn,
  englishLevel,
  preferredName,
  addToTroubleWords,
}: UseSpeakPracticeParams) {
  const recorder = usePronunciationRecorder();

  const [targetPhrase, setTargetPhrase] = useState('');
  const [isPlayingTarget, setIsPlayingTarget] = useState(false);
  const [pronunciationResult, setPronunciationResult] =
    useState<PronunciationResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [speakAttempts, setSpeakAttempts] = useState(0);
  const [speakLimitReached, setSpeakLimitReached] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [lastRecordedAudioUrl, setLastRecordedAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    if (contentEn && !targetPhrase) {
      setTargetPhrase(extractFirstSentence(contentEn));
    }
  }, [contentEn, targetPhrase]);

  useEffect(() => {
    const stored = sessionStorage.getItem(SPEAK_SESSION_KEY);
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
      window.speechSynthesis.cancel();
    };
  }, []);

  const handlePlayTarget = useCallback(() => {
    if (!targetPhrase || isPlayingTarget) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(targetPhrase);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.onstart = () => setIsPlayingTarget(true);
    utterance.onend = () => setIsPlayingTarget(false);
    utterance.onerror = () => setIsPlayingTarget(false);

    window.speechSynthesis.speak(utterance);
  }, [targetPhrase, isPlayingTarget]);

  const handlePlaySlow = useCallback(() => {
    if (!targetPhrase || isPlayingTarget) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(targetPhrase);
    utterance.lang = 'en-US';
    utterance.rate = 0.65;
    utterance.onstart = () => setIsPlayingTarget(true);
    utterance.onend = () => setIsPlayingTarget(false);
    utterance.onerror = () => setIsPlayingTarget(false);

    window.speechSynthesis.speak(utterance);
  }, [targetPhrase, isPlayingTarget]);

  const handleShadowCompare = useCallback(async () => {
    if (!lastRecordedAudioUrl || !targetPhrase || isComparing) return;

    setIsComparing(true);
    window.speechSynthesis.cancel();

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

    window.speechSynthesis.speak(nativeUtterance);
  }, [lastRecordedAudioUrl, targetPhrase, isComparing]);

  const handleTroubleWordPractice = useCallback(
    (word: string) => {
      if (!word) return;

      window.speechSynthesis.cancel();
      setTargetPhrase(word);
      setPronunciationResult(null);
      setIsPlayingTarget(false);
      setIsComparing(false);

      if (lastRecordedAudioUrl) {
        URL.revokeObjectURL(lastRecordedAudioUrl);
        setLastRecordedAudioUrl(null);
      }
    },
    [lastRecordedAudioUrl]
  );

  const handleVaultReplay = useCallback((word: string) => {
    if (!word) return;

    setTargetPhrase(word);
    setPronunciationResult(null);
    setIsPlayingTarget(false);
    setIsComparing(false);

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.7;
    utterance.onstart = () => setIsPlayingTarget(true);
    utterance.onend = () => setIsPlayingTarget(false);
    utterance.onerror = () => setIsPlayingTarget(false);
    window.speechSynthesis.speak(utterance);
  }, []);

  const handleRecordToggle = useCallback(async () => {
    if (recorder.status === 'recording') {
      await recorder.stopRecording();
    } else {
      window.speechSynthesis.cancel();
      setPronunciationResult(null);
      setIsPlayingTarget(false);
      setIsComparing(false);

      if (lastRecordedAudioUrl) {
        URL.revokeObjectURL(lastRecordedAudioUrl);
        setLastRecordedAudioUrl(null);
      }

      await recorder.startRecording();
    }
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
      sessionStorage.setItem(SPEAK_SESSION_KEY, String(newAttempts));

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
    window.speechSynthesis.cancel();
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