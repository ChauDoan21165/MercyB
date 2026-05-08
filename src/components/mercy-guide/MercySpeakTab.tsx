import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle, Copy, Mic, RotateCcw, Square, Volume2, PlayCircle, Eraser,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import ShareScoreButton from '@/components/share/ShareScoreButton';
import WaveformComparison from '@/components/pronunciation/WaveformComparison';
import RetakeComparison from '@/components/pronunciation/RetakeComparison';

import { appendAttempt, type AttemptRecord } from '@/lib/pronunciation/sessionAttempts';
import { captureWaveform, type Waveform } from '@/lib/pronunciation/audioComparison';
import { fetchCloudTtsUrl } from '@/lib/mercyVoice';
import { awardSpeakPoints } from '@/services/pointsService';
import { resolveRoomAudioUrl } from '@/lib/roomAudioResolver';
import { deriveWordChips } from './wordChips';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';
import { useMercyVoice } from '@/hooks/useMercyVoice';
import { scoreCloud } from '@/lib/pronunciation/cloudScorer';
import { useStreamingPronunciation } from '@/lib/pronunciation/useStreamingPronunciation';
import StreamingFeedback from '@/components/pronunciation/StreamingFeedback';
import { breadcrumbSpeakAttempt } from '@/lib/monitoring/breadcrumbs';
import { captureError } from '@/lib/monitoring/captureException';
import type { WordScore } from '@/lib/pronunciation/scorer';
import {
  GENERIC_LOW_HINT,
  LOW_PHONEME_THRESHOLD,
  getPhonemeHint,
} from '@/lib/pronunciation/phonemeHints';
import PhonemePlayButton from '@/components/speech/PhonemePlayButton';
import { supabase } from '@/lib/supabaseClient';

import type { StudentMercyMemoryUpdate, LearningSupportMode } from './types';
import type {
  SpeechRecognitionLike as BaseSpeechRecognitionLike,
  SpeechRecognitionErrorEventLike,
  SpeechRecognitionAlternativeLike,
  SpeechRecognitionResultLike,
} from '@/types/speech-recognition';

// ====================== KIDS HELPERS ======================
import {
  KIDS_OBJECTS,
  getKidsObjectByKey,
  getKidsObjectFromSentence,
  isLikelyKidsSentence,
  playKidsUiSound,
  makePageLessonGetter,
  cleanText,
  normalizeForCompare,
} from './kids/kidsDataHelpers';

import { getPage4LessonByKey } from './kids/kidPage4Data';
import { getPage5LessonByKey } from './kids/kidPage5Data';
import { getPage6LessonByKey } from './kids/kidPage6Data';
import { getPage7LessonByKey } from './kids/kidPage7Data';
import { getPage8LessonByKey } from './kids/kidPage8Data';
import { getPage9LessonByKey } from './kids/kidPage9Data';
import { getKidPage11Item } from './kids/kidPage11Data';
import { getKidPage12Item } from './kids/kidPage12Data';
import { getKidPage13Item } from './kids/kidPage13Data';
import { getKidPage14Item } from './kids/kidPage14Data';
import { getKidPage15Item } from './kids/kidPage15Data';
import { getKidPage16Item } from './kids/kidPage16Data';
import { getKidPage17Item } from './kids/kidPage17Data';
import { getKidPage18Item } from './kids/kidPage18Data';
import { getKidPage19Item } from './kids/kidPage19Data';
import { getKidPage20Item } from './kids/kidPage20Data';
import { getKidPage21Item } from './kids/kidPage21Data';
import { getKidPage22Item } from './kids/kidPage22Data';
import { getKidPage23Item } from './kids/kidPage23Data';
import { getKidPage24Item } from './kids/kidPage24Data';
import { getKidPage25Item } from './kids/kidPage25Data';
import { getKidPage26Item } from './kids/kidPage26Data';
import { getKidPage27Item } from './kids/kidPage27Data';
import { KID_PAGE_28_ITEMS } from './kids/kidPage28Data';
import { KID_PAGE_29_ITEMS } from './kids/kidPage29Data';
import { KID_PAGE_30_ITEMS } from './kids/kidPage30Data';
import { KID_PAGE_31_ITEMS } from './kids/kidPage31Data';
import { KID_PAGE_32_ITEMS } from './kids/kidPage32Data';
import { KID_PAGE_33_ITEMS } from './kids/kidPage33Data';
import { KID_PAGE_34_ITEMS } from './kids/kidPage34Data';

// Page lesson getters
const getPage11LessonByKey = makePageLessonGetter(11, getKidPage11Item);
const getPage12LessonByKey = makePageLessonGetter(12, getKidPage12Item);
const getPage13LessonByKey = makePageLessonGetter(13, getKidPage13Item);
const getPage14LessonByKey = makePageLessonGetter(14, getKidPage14Item);
const getPage15LessonByKey = makePageLessonGetter(15, getKidPage15Item);
const getPage16LessonByKey = makePageLessonGetter(16, getKidPage16Item);
const getPage17LessonByKey = makePageLessonGetter(17, getKidPage17Item);
const getPage18LessonByKey = makePageLessonGetter(18, getKidPage18Item);
const getPage19LessonByKey = makePageLessonGetter(19, getKidPage19Item);
const getPage20LessonByKey = makePageLessonGetter(20, getKidPage20Item);
const getPage21LessonByKey = makePageLessonGetter(21, getKidPage21Item);
const getPage22LessonByKey = makePageLessonGetter(22, getKidPage22Item);
const getPage23LessonByKey = makePageLessonGetter(23, getKidPage23Item);
const getPage24LessonByKey = makePageLessonGetter(24, getKidPage24Item);
const getPage25LessonByKey = makePageLessonGetter(25, getKidPage25Item);
const getPage26LessonByKey = makePageLessonGetter(26, getKidPage26Item);
const getPage27LessonByKey = makePageLessonGetter(27, getKidPage27Item);
const getPage28LessonByKey = makePageLessonGetter(28, (k) => KID_PAGE_28_ITEMS.find(i => i.key === k));
const getPage29LessonByKey = makePageLessonGetter(29, (k) => KID_PAGE_29_ITEMS.find(i => i.key === k));
const getPage30LessonByKey = makePageLessonGetter(30, (k) => KID_PAGE_30_ITEMS.find(i => i.key === k));
const getPage31LessonByKey = makePageLessonGetter(31, (k) => KID_PAGE_31_ITEMS.find(i => i.key === k));
const getPage32LessonByKey = makePageLessonGetter(32, (k) => KID_PAGE_32_ITEMS.find(i => i.key === k));
const getPage33LessonByKey = makePageLessonGetter(33, (k) => KID_PAGE_33_ITEMS.find(i => i.key === k));
const getPage34LessonByKey = makePageLessonGetter(34, (k) => KID_PAGE_34_ITEMS.find(i => i.key === k));

type SpeechRecognitionLike = BaseSpeechRecognitionLike & { abort?: () => void };

type PronunciationLaunchPayload = {
  sourceText: string;
  correctedText?: string;
  enhancedText?: string;
};

type MercySpeakTabProps = {
  roomId?: string;
  roomTitle?: string;
  contentEn?: string;
  profile?: { preferred_name?: string | null; english_level?: string | null } | null;
  troubleWords?: Array<string | { word?: string | null }>;
  launchPayload?: PronunciationLaunchPayload | null;
  pendingPayload?: PronunciationLaunchPayload | null;
  pendingPronunciationPayload?: PronunciationLaunchPayload | null;
  onMemoryUpdate?: (patch: StudentMercyMemoryUpdate) => void;
  onOpenEnglishLogic?: () => void;
  learningSupportMode?: LearningSupportMode;
  isKidsMode?: boolean;
  kidsModeAgeBand?: string | null;
  preferTapAndRepeat?: boolean;
  teacherLabel?: string | null;
  selectedKidsObjectKey?: string | null;
  initialPracticeLine?: string;
};

type PracticeVariant = 'custom' | 'corrected' | 'enhanced' | 'source';

export function MercySpeakTab({
  roomId,
  contentEn,
  troubleWords,
  launchPayload,
  pendingPayload,
  pendingPronunciationPayload,
  onMemoryUpdate,
  onOpenEnglishLogic,
  isKidsMode = false,
  selectedKidsObjectKey,
  initialPracticeLine,
}: MercySpeakTabProps) {
  const payload = useMemo(() => pendingPronunciationPayload ?? pendingPayload ?? launchPayload ?? null, [launchPayload, pendingPayload, pendingPronunciationPayload]);

  const rawSourceText = cleanText(payload?.sourceText);
  const rawCorrectedText = cleanText(payload?.correctedText);
  const rawEnhancedText = cleanText(payload?.enhancedText);

  const rawKidsCandidateText = useMemo(() => rawEnhancedText || rawCorrectedText || rawSourceText, [rawCorrectedText, rawEnhancedText, rawSourceText]);

  // ====================== KIDS LOGIC ======================
  const kidsLesson = useMemo(() => {
    if (!isKidsMode) return null;
    return (
      getPage34LessonByKey(selectedKidsObjectKey) ??
      getPage33LessonByKey(selectedKidsObjectKey) ??
      getPage32LessonByKey(selectedKidsObjectKey) ??
      getPage31LessonByKey(selectedKidsObjectKey) ??
      getPage30LessonByKey(selectedKidsObjectKey) ??
      getPage29LessonByKey(selectedKidsObjectKey) ??
      getPage28LessonByKey(selectedKidsObjectKey) ??
      getPage27LessonByKey(selectedKidsObjectKey) ??
      getPage26LessonByKey(selectedKidsObjectKey) ??
      getPage25LessonByKey(selectedKidsObjectKey) ??
      getPage24LessonByKey(selectedKidsObjectKey) ??
      getPage23LessonByKey(selectedKidsObjectKey) ??
      getPage22LessonByKey(selectedKidsObjectKey) ??
      getPage21LessonByKey(selectedKidsObjectKey) ??
      getPage20LessonByKey(selectedKidsObjectKey) ??
      getPage19LessonByKey(selectedKidsObjectKey) ??
      getPage18LessonByKey(selectedKidsObjectKey) ??
      getPage17LessonByKey(selectedKidsObjectKey) ??
      getPage16LessonByKey(selectedKidsObjectKey) ??
      getPage15LessonByKey(selectedKidsObjectKey) ??
      getPage14LessonByKey(selectedKidsObjectKey) ??
      getPage13LessonByKey(selectedKidsObjectKey) ??
      getPage12LessonByKey(selectedKidsObjectKey) ??
      getPage11LessonByKey(selectedKidsObjectKey) ??
      getPage9LessonByKey(selectedKidsObjectKey) ??
      getPage8LessonByKey(selectedKidsObjectKey) ??
      getPage7LessonByKey(selectedKidsObjectKey) ??
      getPage6LessonByKey(selectedKidsObjectKey) ??
      getPage5LessonByKey(selectedKidsObjectKey) ??
      getPage4LessonByKey(selectedKidsObjectKey) ??
      getPage2LessonByKey(selectedKidsObjectKey) ??
      getPage3LessonByKey(selectedKidsObjectKey)
    );
  }, [isKidsMode, selectedKidsObjectKey]);

  const kidsObject = useMemo(() => {
    if (!isKidsMode) return null;
    if (kidsLesson) return null;
    const selected = getKidsObjectByKey(selectedKidsObjectKey);
    if (selected) return selected;
    if (isLikelyKidsSentence(rawKidsCandidateText)) return getKidsObjectFromSentence(rawKidsCandidateText);
    return KIDS_OBJECTS[0];
  }, [isKidsMode, kidsLesson, rawKidsCandidateText, selectedKidsObjectKey]);

  const kidsPracticeText = useMemo(() => {
    if (!isKidsMode) return '';
    return kidsLesson?.sentence ?? kidsObject?.sentence ?? KIDS_OBJECTS[0].sentence;
  }, [isKidsMode, kidsLesson, kidsObject]);

  // ... [All your existing state, effects, handlers stay exactly the same from here]

  const sourceText = isKidsMode ? kidsPracticeText : rawSourceText;
  const correctedText = isKidsMode ? kidsPracticeText : rawCorrectedText;
  const enhancedText = isKidsMode ? kidsPracticeText : rawEnhancedText;

  const defaultPracticeText = useMemo(() => {
    const seed = cleanText(initialPracticeLine ?? '');
    if (seed) return seed;
    if (isKidsMode) return kidsPracticeText;
    // fallback logic...
    const enhanced = cleanText(payload?.enhancedText);
    const corrected = cleanText(payload?.correctedText);
    const source = cleanText(payload?.sourceText);
    return enhanced || corrected || source || cleanText(contentEn) || '';
  }, [initialPracticeLine, isKidsMode, kidsPracticeText, payload, contentEn]);

  // Rest of your component (states, effects, functions, render) remains unchanged
  // Only the kids-related logic at the top was moved to helpers.

  // [Paste the rest of your original component body here if needed, but since it's very long, 
  // you can keep your current file and just replace the top imports + kids useMemo parts]

  // For now, run git status and let's check the diff
}

export default MercySpeakTab;
