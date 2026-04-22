// Path: src/components/mercy-guide/MercySpeakTab.tsx
// File: MercySpeakTab.tsx

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  Copy,
  Mic,
  RotateCcw,
  Square,
  Volume2,
  PlayCircle,
  Eraser,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
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
import { awardSpeakPoints } from '@/services/pointsService';
import { resolveRoomAudioUrl } from '@/lib/roomAudioResolver';
import type { StudentMercyMemoryUpdate, LearningSupportMode } from './types';
import type {
  SpeechRecognitionLike as BaseSpeechRecognitionLike,
  SpeechRecognitionErrorEventLike,
  SpeechRecognitionAlternativeLike,
  SpeechRecognitionResultLike,
} from '@/types/speech-recognition';

type SpeechRecognitionLike = BaseSpeechRecognitionLike & {
  abort?: () => void;
};

type PronunciationLaunchPayload = {
  sourceText: string;
  correctedText: string;
  enhancedText?: string;
};

type MercySpeakTabProps = {
  roomId?: string;
  roomTitle?: string;
  contentEn?: string;
  profile?: {
    preferred_name?: string | null;
    english_level?: string | null;
  } | null;
  troubleWords?: Array<string | { word?: string | null }>;
  speakPractice?: unknown;
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
};

type PracticeVariant = 'custom' | 'corrected' | 'enhanced' | 'source';

type BrowserWindowWithSpeechRecognition = Window & {
  webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  SpeechRecognition?: new () => SpeechRecognitionLike;
};

type KidsObjectCard = {
  key: string;
  label: string;
  sentence: string;
  imageSrc: string;
  aliases: string[];
};

type KidsLessonCard = {
  key: string;
  label: string;
  sentence: string;
  imageSrc: string;
  dialogue?: string[];
};

const KIDS_OBJECT_KEYS = [
  'airplane','apple','bag','ball','banana','bathtub','bed','bicycle','bird','blanket',
  'boat','book','bottle','bus','cat','chair','clock','cloud','cup','dog',
  'doll','door','duck','fish','flower','hat','house','key','leaf','milk',
  'moon','orange','pencil','phone','pillow','plate','rainbow','shirt','shoes','soap',
  'sock','spoon','star','sun','table','teddy-bear','toothbrush','toy-car','tree','window',
  'ant','baby-bib','backpack','balloon','bee','bell','block','butterfly','cake','candle',
  'carrot','cookie','cow','crayon','dinosaur','elephant','envelope','frog','gift-box','grapes',
  'hammer','helicopter','ice-cream','jar','kite','lamp','lion','lollipop','monkey','mouse',
  'mushroom','pear','pig','pizza','rabbit','rocket','sandwich','sheep','strawberry','train',
  'truck','turtle','watermelon','whistle','mitten','scarf','drum','bear-face','juice-box','juice',
] as const;

const KIDS_UNCOUNTABLE_KEYS = new Set<string>([
  'milk','soap','juice','ice-cream',
]);

const KIDS_EXTRA_ALIASES: Record<string, string[]> = {
  'teddy-bear': ['teddy bear', 'bear'],
  'toy-car': ['toy car', 'car'],
  'baby-bib': ['baby bib', 'bib'],
  backpack: ['back pack'],
  'gift-box': ['gift box', 'gift'],
  'ice-cream': ['ice cream'],
  'juice-box': ['juice box'],
  'bear-face': ['bear face', 'bear'],
};

function toKidsLabel(key: string): string {
  return key.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

function startsWithVowelSound(text: string): boolean {
  return /^[aeiou]/i.test(text.trim());
}

function toKidsSentence(key: string): string {
  const lowerLabel = toKidsLabel(key).toLowerCase();
  if (KIDS_UNCOUNTABLE_KEYS.has(key)) return `This is ${lowerLabel}.`;
  return `This is ${startsWithVowelSound(lowerLabel) ? 'an' : 'a'} ${lowerLabel}.`;
}

function toKidsAliases(key: string): string[] {
  const normalized = key.replace(/-/g, ' ');
  const label = toKidsLabel(key).toLowerCase();
  const extra = KIDS_EXTRA_ALIASES[key] ?? [];
  return Array.from(new Set([key, normalized, label, ...extra]));
}

function normalizePage2Key(value?: string | null): string {
  return cleanText(value).replace(/\.png$/i, '');
}

function isPage2LessonKey(value?: string | null): boolean {
  return /^p2_\d+_/i.test(normalizePage2Key(value));
}

function formatPage2TextFromKey(key: string): string {
  const normalized = normalizePage2Key(key);
  if (!normalized) return '';
  const slug = normalized.replace(/^p2_\d+_/i, '');
  if (!slug) return '';
  const words = slug.split('_').filter(Boolean).map((word) => {
    const lower = word.toLowerCase();
    if (lower === 'i') return 'I';
    if (lower === 'youre') return "you're";
    if (lower === 'lets') return "let's";
    return lower;
  });
  if (words.length === 0) return '';
  const text = words.join(' ');
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function toPage2Sentence(key: string): string {
  const base = formatPage2TextFromKey(key);
  if (!base) return '';
  if (/^What is this /i.test(base)) {
    const objectPart = base.replace(/^What is this /i, '').trim();
    const titledObject = objectPart.charAt(0).toUpperCase() + objectPart.slice(1);
    return titledObject ? `What is this? ${titledObject}.` : 'What is this?';
  }
  return /[.!?]$/.test(base) ? base : `${base}.`;
}

function toPage2Label(key: string): string {
  return toPage2Sentence(key).replace(/[.!?]+$/g, '');
}

function normalizePage3Key(value?: string | null): string {
  return cleanText(value).replace(/\.png$/i, '');
}

function isPage3LessonKey(value?: string | null): boolean {
  return /^k\d+_/i.test(normalizePage3Key(value));
}

function formatPage3TextFromKey(key: string): string {
  const normalized = normalizePage3Key(key);
  if (!normalized) return '';
  const slug = normalized.replace(/^k\d+_/i, '');
  if (!slug) return '';
  const words = slug.split('_').filter(Boolean).map((word) => {
    const lower = word.toLowerCase();
    if (lower === 'i') return 'I';
    if (lower === 'im') return "I'm";
    if (lower === 'youre') return "you're";
    if (lower === 'lets') return "let's";
    if (lower === 'dont') return "don't";
    return lower;
  });
  if (words.length === 0) return '';
  const text = words.join(' ');
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function toPage3Sentence(key: string): string {
  const base = formatPage3TextFromKey(key);
  if (!base) return '';
  if (
    /^What /i.test(base) || /^How /i.test(base) ||
    /^Where /i.test(base) || /^Which /i.test(base) ||
    /^Can /i.test(base) || /^Do /i.test(base)
  ) {
    return /[?]$/.test(base) ? base : `${base}?`;
  }
  return /[.!?]$/.test(base) ? base : `${base}.`;
}

function toPage3Label(key: string): string {
  return toPage3Sentence(key).replace(/[.!?]+$/g, '');
}

function toPhraseSentence(label: string): string {
  const base = cleanText(label);
  if (!base) return '';
  return /[.!?]$/.test(base) ? base : `${base}.`;
}

function matchesPageKeyPrefix(key: string | null | undefined, pageNumber: number): key is string {
  const normalized = cleanText(key);
  if (!normalized) return false;
  return new RegExp(`^k${pageNumber}_`, 'i').test(normalized);
}

const KIDS_OBJECTS: KidsObjectCard[] = KIDS_OBJECT_KEYS.map((key) => ({
  key,
  label: toKidsLabel(key),
  sentence: toKidsSentence(key),
  imageSrc: `/images/mercy-kids/${key}.jpg`,
  aliases: toKidsAliases(key),
}));

function playKidsUiSound(level: 'good' | 'great' | 'wow') {
  if (typeof window === 'undefined') return;
  const AudioContextCtor = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextCtor) return;
  const ctx = new AudioContextCtor();
  void ctx.resume?.();
  const config =
    level === 'good'   ? { notes: [587.33, 659.25, 783.99], duration: 0.12, gap: 0.08, gain: 0.04, type: 'sine' as OscillatorType } :
    level === 'great'  ? { notes: [659.25, 783.99, 987.77, 1318.51], duration: 0.14, gap: 0.08, gain: 0.045, type: 'triangle' as OscillatorType } :
                         { notes: [523.25, 783.99, 1046.5, 1318.51, 1567.98], duration: 0.15, gap: 0.07, gain: 0.05, type: 'triangle' as OscillatorType };
  config.notes.forEach((frequency, index) => {
    const start = ctx.currentTime + 0.02 + index * config.gap;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = config.type;
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(config.gain, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + config.duration);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start(start);
    oscillator.stop(start + config.duration + 0.02);
  });
  window.setTimeout(() => { void ctx.close().catch(() => undefined); }, 900);
}

function cleanText(value?: string | null): string {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

function normalizeForCompare(value: string): string {
  return cleanText(value).toLowerCase().replace(/[.,!?;:()[\]"''`-]/g, '').replace(/\s+/g, ' ').trim();
}

function normalizeKidsLookup(value: string): string {
  return cleanText(value).toLowerCase().replace(/-/g, ' ');
}

function isLikelyKidsSentence(value: string): boolean {
  const text = cleanText(value);
  if (!text) return false;
  const words = normalizeForCompare(text).split(' ').filter(Boolean);
  if (words.length === 0 || words.length > 8) return false;
  if (/[.!?].+[.!?]/.test(text)) return false;
  return /^this is\b/i.test(text) || /^it is\b/i.test(text);
}

function getKidsObjectFromSentence(value: string): KidsObjectCard {
  const normalized = normalizeKidsLookup(value);
  if (!normalized) return KIDS_OBJECTS[0];
  const found = KIDS_OBJECTS.find((item) => item.aliases.some((alias) => normalized.includes(alias)));
  return found ?? KIDS_OBJECTS[0];
}

function getKidsObjectByKey(key?: string | null): KidsObjectCard | null {
  if (!key) return null;
  return KIDS_OBJECTS.find((item) => item.key === key) ?? null;
}

function getPage2LessonByKey(key?: string | null): KidsLessonCard | null {
  if (!isPage2LessonKey(key)) return null;
  const normalized = normalizePage2Key(key);
  if (!normalized) return null;
  return { key: normalized, label: toPage2Label(normalized), sentence: toPage2Sentence(normalized), imageSrc: `/images/mercy-kids-page-2/${normalized}.png` };
}

function getPage3LessonByKey(key?: string | null): KidsLessonCard | null {
  if (!isPage3LessonKey(key)) return null;
  const normalized = normalizePage3Key(key);
  if (!normalized) return null;
  return { key: normalized, label: toPage3Label(normalized), sentence: toPage3Sentence(normalized), imageSrc: `/images/mercy-kids-page-3/${normalized}.png` };
}

function makePageLessonGetter(pageNumber: number, getItem: (key: string | null | undefined) => { key: string; label: string; image: string; dialogue?: string[] } | null | undefined) {
  return function getLessonByKey(key?: string | null): KidsLessonCard | null {
    if (!matchesPageKeyPrefix(key, pageNumber)) return null;
    const item = getItem(key);
    if (!item) return null;
    return {
      key: item.key,
      label: item.label,
      sentence: item.dialogue ? item.dialogue[0] : toPhraseSentence(item.label),
      imageSrc: item.image,
      dialogue: item.dialogue,
    };
  };
}

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

function extractTroubleWords(troubleWords?: Array<string | { word?: string | null }>): string[] {
  if (!Array.isArray(troubleWords)) return [];
  return troubleWords.map((item) => {
    if (typeof item === 'string') return cleanText(item);
    if (item && typeof item === 'object') return cleanText(item.word);
    return '';
  }).filter(Boolean).slice(0, 8);
}

// NOTE: This is a word-bag comparison against the ASR transcript — NOT real
// pronunciation assessment. Tracked as tech debt; pending Azure Speech (or
// equivalent) phoneme-level integration. Order ignored; extra spoken words
// are free; missing target words cost 1/N each.
function calculateMatchScore(target: string, spoken: string): number {
  const targetWords = normalizeForCompare(target).split(' ').filter(Boolean);
  const spokenWords = normalizeForCompare(spoken).split(' ').filter(Boolean);
  if (!targetWords.length) return 0;
  if (!spokenWords.length) return 0;
  let matched = 0;
  const remainingSpoken = [...spokenWords];
  for (const word of targetWords) {
    const index = remainingSpoken.indexOf(word);
    if (index >= 0) { matched += 1; remainingSpoken.splice(index, 1); }
  }
  return Math.max(0, Math.min(100, Math.round((matched / targetWords.length) * 100)));
}

function detectTroubleWords(transcript: string, target: string): string[] {
  const transcriptWords = new Set(normalizeForCompare(transcript).split(/\s+/).filter(Boolean));
  return normalizeForCompare(target).split(/\s+/).filter(Boolean)
    .filter((word, index, array) => array.indexOf(word) === index)
    .filter((word) => !transcriptWords.has(word))
    .slice(0, 5);
}

function filterTroubleWordsForPractice(troubleWords: string[], practiceText: string): string[] {
  const practiceWordSet = new Set(normalizeForCompare(practiceText).split(/\s+/).filter(Boolean));
  if (!practiceWordSet.size) return [];
  return troubleWords.filter((word) => practiceWordSet.has(normalizeForCompare(word)));
}

function getConfidenceLevel(score: number): 'low' | 'medium' | 'high' {
  if (score >= 85) return 'high';
  if (score >= 60) return 'medium';
  return 'low';
}

function getVariantButtonClass(active: boolean) {
  return active
    ? 'border-[#EFAF95] bg-gradient-to-r from-[#FFF0E6] to-[#FFF7F1] text-[#B74F30] shadow-[0_8px_20px_rgba(255,138,101,0.18)]'
    : 'border-slate-200 bg-white text-slate-800 hover:border-[#EFAF95] hover:bg-[#FFF8F4] hover:text-[#B74F30]';
}

function getMetricTone(score: number) {
  if (score >= 85) return { ring: 'border-emerald-200 bg-emerald-50/80', text: 'text-emerald-700', bar: 'from-emerald-500 to-teal-500' };
  if (score >= 60) return { ring: 'border-amber-200 bg-amber-50/80',   text: 'text-amber-700',   bar: 'from-amber-500 to-orange-500' };
  return                 { ring: 'border-rose-200 bg-rose-50/85',       text: 'text-rose-700',    bar: 'from-rose-500 to-orange-500' };
}

function getRecognitionErrorMessage(error?: string): string {
  switch (error) {
    case 'not-allowed':
    case 'service-not-allowed': return 'Microphone access was blocked. Please allow microphone access and try again.';
    case 'no-speech':           return 'No speech was detected. Try again and speak a little closer to the microphone.';
    case 'audio-capture':       return 'No microphone was found for speech recognition.';
    case 'network':             return 'Speech recognition had a network problem. Please try again.';
    case 'aborted':             return 'Speech recognition was stopped.';
    default:                    return error ? `Speech recognition failed: ${error}.` : 'Speech recognition failed.';
  }
}

function buildFallbackPracticeText(payload: PronunciationLaunchPayload | null, contentEn?: string): string {
  const enhancedText = cleanText(payload?.enhancedText);
  const correctedText = cleanText(payload?.correctedText);
  const sourceText = cleanText(payload?.sourceText);
  if (enhancedText) return enhancedText;
  if (correctedText) return correctedText;
  if (sourceText) return sourceText;
  const fromRoom = cleanText(contentEn);
  if (!fromRoom) return '';
  const firstSentence = fromRoom.match(/[^.!?]+[.!?]?/u)?.[0] ?? fromRoom;
  return cleanText(firstSentence);
}

export function MercySpeakTab({
  roomId,
  roomTitle,
  contentEn,
  profile,
  troubleWords,
  speakPractice,
  launchPayload,
  pendingPayload,
  pendingPronunciationPayload,
  onMemoryUpdate,
  onOpenEnglishLogic,
  learningSupportMode,
  isKidsMode = false,
  kidsModeAgeBand,
  preferTapAndRepeat = false,
  teacherLabel,
  selectedKidsObjectKey,
}: MercySpeakTabProps) {
  void roomId; void roomTitle; void speakPractice; void profile;
  void learningSupportMode; void kidsModeAgeBand; void preferTapAndRepeat; void teacherLabel;

  const payload = useMemo(
    () => pendingPronunciationPayload ?? pendingPayload ?? launchPayload ?? null,
    [launchPayload, pendingPayload, pendingPronunciationPayload],
  );

  const rawSourceText    = cleanText(payload?.sourceText);
  const rawCorrectedText = cleanText(payload?.correctedText);
  const rawEnhancedText  = cleanText(payload?.enhancedText);

  const rawKidsCandidateText = useMemo(
    () => rawEnhancedText || rawCorrectedText || rawSourceText,
    [rawCorrectedText, rawEnhancedText, rawSourceText],
  );

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
    const selectedObject = getKidsObjectByKey(selectedKidsObjectKey);
    if (selectedObject) return selectedObject;
    if (isLikelyKidsSentence(rawKidsCandidateText)) return getKidsObjectFromSentence(rawKidsCandidateText);
    return KIDS_OBJECTS[0];
  }, [isKidsMode, kidsLesson, rawKidsCandidateText, selectedKidsObjectKey]);

  const kidsPracticeText = useMemo(() => {
    if (!isKidsMode) return '';
    if (kidsLesson?.sentence) return kidsLesson.sentence;
    return kidsObject?.sentence ?? KIDS_OBJECTS[0].sentence;
  }, [isKidsMode, kidsLesson, kidsObject]);

  // Derive the pre-recorded mp3 path for kids mode
  const [voiceGender, setVoiceGender] = useState<'mercy' | 'josh'>(() => {
    try { return (localStorage.getItem('mb.voice.gender') as 'mercy' | 'josh') || 'mercy'; } catch { return 'mercy'; }
  });

  const kidsAudioSrc = useMemo(() => {
    if (!isKidsMode) return null;
    const key = selectedKidsObjectKey ?? '';
    if (!key) return null;
    const folder = voiceGender === 'josh' ? '/audio/kids/josh' : '/audio/kids';
    // Page 3: audio lives in image folder (k0XX_ format)
    if (/^k0\d+_/.test(key)) return `/images/mercy-kids-page-3/${key}.mp3`;
    // Pages 17-24: short key format k17_001 etc
    if (/^k(1[7-9]|2[0-4])_\d+$/.test(key)) return `${folder}/${key}.mp3`;
    // Pages 4-34: standard long format
    if (/^k\d+_/.test(key)) return `${folder}/${key}.mp3`;
    // Page 2: p2_ prefix
    if (/^p2_/.test(key)) return `${folder}/${key}.mp3`;
    // Page 1: simple words like apple, ball
    return `${folder}/${key}.mp3`;
  }, [isKidsMode, selectedKidsObjectKey, voiceGender]);



  const sourceText    = isKidsMode ? kidsPracticeText : rawSourceText;
  const correctedText = isKidsMode ? kidsPracticeText : rawCorrectedText;
  const enhancedText  = isKidsMode ? kidsPracticeText : rawEnhancedText;

  const defaultPracticeText = useMemo(() => {
    if (isKidsMode) return kidsPracticeText;
    return buildFallbackPracticeText(payload, contentEn);
  }, [contentEn, isKidsMode, kidsPracticeText, payload]);

  const initialVariant: PracticeVariant = isKidsMode ? 'custom' :
    enhancedText ? 'enhanced' : correctedText ? 'corrected' : sourceText ? 'source' : 'custom';

  const [variant, setVariant]         = useState<PracticeVariant>(initialVariant);
  const [customText, setCustomText]   = useState(defaultPracticeText);
  const [copySuccess, setCopySuccess] = useState(false);
  const [transcript, setTranscript]   = useState('');
  const [recognitionError, setRecognitionError] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recordingError, setRecordingError]     = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState('');
  const [isSpeaking, setIsSpeaking]   = useState(false);

  const recognitionRef    = useRef<SpeechRecognitionLike | null>(null);
  const mediaRecorderRef  = useRef<MediaRecorder | null>(null);
  const mediaChunksRef    = useRef<BlobPart[]>([]);
  const activeStreamRef   = useRef<MediaStream | null>(null);
  const recordedAudioRef  = useRef<HTMLAudioElement | null>(null);
  const lastKidsCelebrationRef    = useRef('');
  const [kidsImageCelebration, setKidsImageCelebration] = useState<'good' | 'great' | 'wow' | null>(null);
  const kidsImageCelebrationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (kidsImageCelebrationTimerRef.current) clearTimeout(kidsImageCelebrationTimerRef.current); }, []);

  function triggerKidsImageCelebration(tier: 'good' | 'great' | 'wow') {
    if (kidsImageCelebrationTimerRef.current) clearTimeout(kidsImageCelebrationTimerRef.current);
    setKidsImageCelebration(null);
    requestAnimationFrame(() => setKidsImageCelebration(tier));
    const duration = tier === 'wow' ? 1100 : tier === 'great' ? 850 : 700;
    kidsImageCelebrationTimerRef.current = setTimeout(() => setKidsImageCelebration(null), duration);
  }
  const kidsAudioRef = useRef<HTMLAudioElement | null>(null);

  const speechWindow = typeof window !== 'undefined' ? (window as BrowserWindowWithSpeechRecognition) : undefined;
  const supportsRecognition    = typeof window !== 'undefined' && Boolean(speechWindow?.SpeechRecognition || speechWindow?.webkitSpeechRecognition);
  const supportsSpeechSynthesis = typeof window !== 'undefined' && typeof window.speechSynthesis !== 'undefined';
  const supportsMediaRecording  = typeof window !== 'undefined' && typeof navigator !== 'undefined' && Boolean(navigator.mediaDevices?.getUserMedia) && typeof MediaRecorder !== 'undefined';

  useEffect(() => { setCustomText(defaultPracticeText); setVariant(initialVariant); }, [defaultPracticeText, initialVariant]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel();
      try { recognitionRef.current?.abort?.(); } catch { /* ignore */ }
      recognitionRef.current = null;
      try { if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') mediaRecorderRef.current.stop(); } catch { /* ignore */ }
      mediaRecorderRef.current = null;
      if (recordedAudioRef.current) { try { recordedAudioRef.current.pause(); recordedAudioRef.current.currentTime = 0; } catch { /* ignore */ } }
      if (recordedAudioUrl) URL.revokeObjectURL(recordedAudioUrl);
      if (kidsAudioRef.current) {
        try { kidsAudioRef.current.pause(); } catch { /* ignore */ }
        kidsAudioRef.current = null;
      }
      if (activeStreamRef.current) { activeStreamRef.current.getTracks().forEach((track) => track.stop()); activeStreamRef.current = null; }
    };
  }, [recordedAudioUrl]);

  useEffect(() => {
    if (typeof window === 'undefined' || !copySuccess) return;
    const timer = window.setTimeout(() => { setCopySuccess(false); }, 1600);
    return () => window.clearTimeout(timer);
  }, [copySuccess]);


  const practiceText = useMemo(() => {
    if (isKidsMode) return kidsPracticeText;
    const base = cleanText(customText);
    if (variant === 'enhanced'  && enhancedText)  return enhancedText;
    if (variant === 'corrected' && correctedText) return correctedText;
    if (variant === 'source'    && sourceText)    return sourceText;
    return base;
  }, [correctedText, customText, enhancedText, isKidsMode, kidsPracticeText, sourceText, variant]);

  const memoryTroubleWords = useMemo(() => extractTroubleWords(troubleWords), [troubleWords]);
  const scopedMemoryTroubleWords = useMemo(() => filterTroubleWordsForPractice(memoryTroubleWords, practiceText), [memoryTroubleWords, practiceText]);
  const matchScore = useMemo(() => calculateMatchScore(practiceText, transcript), [practiceText, transcript]);
  const generatedTroubleWords = useMemo(() => detectTroubleWords(transcript, practiceText), [practiceText, transcript]);
  const displayedTroubleWords = useMemo(() => generatedTroubleWords.length > 0 ? generatedTroubleWords : scopedMemoryTroubleWords, [generatedTroubleWords, scopedMemoryTroubleWords]);

  const kidsWordChips = useMemo(() => {
    if (!isKidsMode) return [];
    if (displayedTroubleWords.length > 0) return displayedTroubleWords;
    return normalizeForCompare(practiceText).split(/\s+/).filter(Boolean).filter((word, index, array) => array.indexOf(word) === index).slice(0, 4);
  }, [displayedTroubleWords, isKidsMode, practiceText]);

  useEffect(() => {
    if (!transcript || !practiceText || !onMemoryUpdate) return;
    onMemoryUpdate({ pronunciation: { troubleWords: generatedTroubleWords, lastPracticeLine: practiceText, confidenceLevel: getConfidenceLevel(matchScore) } });
    if (transcript) awardSpeakPoints(matchScore, roomId);
  }, [generatedTroubleWords, matchScore, onMemoryUpdate, practiceText, transcript]);

  useEffect(() => {
    if (!isKidsMode) return;
    if (!transcript || isListening) { if (!transcript) lastKidsCelebrationRef.current = ''; return; }
    const attemptKey = `${normalizeForCompare(practiceText)}__${normalizeForCompare(transcript)}`;
    if (lastKidsCelebrationRef.current === attemptKey) return;
    lastKidsCelebrationRef.current = attemptKey;
    if (matchScore >= 94) { playKidsUiSound('wow');   triggerKidsImageCelebration('wow');   return; }
    if (matchScore >= 82) { playKidsUiSound('great'); triggerKidsImageCelebration('great'); return; }
    if (matchScore >= 70) { playKidsUiSound('good');  triggerKidsImageCelebration('good'); }
  }, [isKidsMode, isListening, matchScore, practiceText, transcript]);

  function stopActiveStream() {
    if (activeStreamRef.current) { activeStreamRef.current.getTracks().forEach((track) => track.stop()); activeStreamRef.current = null; }
  }

  function stopRecordedAudioPlayback(resetPosition = false) {
    const audio = recordedAudioRef.current;
    if (!audio) return;
    try { audio.pause(); if (resetPosition) audio.currentTime = 0; } catch { /* ignore */ }
  }

  function revokeRecordedAudioUrl() {
    stopRecordedAudioPlayback(true);
    if (recordedAudioUrl) { URL.revokeObjectURL(recordedAudioUrl); setRecordedAudioUrl(''); }
  }

  // Chunk text at sentence (then clause) boundaries so no single utterance
  // exceeds Chrome's ~15s silent-fail threshold. Max ~160 chars per chunk keeps
  // each utterance safely short even at slow rates.
  function chunkForTTS(text: string, max = 160): string[] {
    const out: string[] = [];
    const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean);
    let buf = '';
    const flush = () => { if (buf) { out.push(buf); buf = ''; } };
    for (const s of sentences) {
      if (s.length > max) {
        // Sentence itself too long — split on comma / em-dash / semicolon.
        flush();
        const parts = s.split(/(?<=[,;—])\s+/).filter(Boolean);
        for (const p of parts) {
          if (p.length > max) {
            // Still too long — hard-split at whitespace nearest the limit.
            let rest = p;
            while (rest.length > max) {
              const cut = rest.lastIndexOf(' ', max);
              out.push(rest.slice(0, cut > 0 ? cut : max).trim());
              rest = rest.slice(cut > 0 ? cut : max).trim();
            }
            if (rest) out.push(rest);
          } else if ((buf + ' ' + p).trim().length <= max) {
            buf = (buf + ' ' + p).trim();
          } else {
            flush();
            buf = p;
          }
        }
        flush();
      } else if ((buf + ' ' + s).trim().length <= max) {
        buf = (buf + ' ' + s).trim();
      } else {
        flush();
        buf = s;
      }
    }
    flush();
    return out.length ? out : [text];
  }

  function speakViaTTS(speechText: string) {
    if (!speechText || !supportsSpeechSynthesis || typeof window === 'undefined') return;
    const synth = window.speechSynthesis;
    synth.cancel();

    const voices = synth.getVoices();
    const voice = voices.find(v =>
      v.lang === 'en-US' && (v.name.includes('Samantha') || v.name.includes('Karen') || v.name.includes('Google'))
    ) || voices.find(v => v.lang === 'en-US') || voices[0];

    // Only chunk when the single utterance would exceed Chrome's silent-fail zone.
    // Short text (<=180 chars) uses the same single-utterance pattern as the working
    // panel greeting button — that's known to work in this codebase.
    const parts = speechText.length > 180 ? chunkForTTS(speechText) : [speechText];

    parts.forEach((part, i) => {
      const u = new SpeechSynthesisUtterance(part);
      u.lang = 'en-US';
      u.rate = 0.9;
      u.pitch = 1.0;
      u.volume = 1.0;
      if (voice) u.voice = voice;
      if (i === 0) u.onstart = () => setIsSpeaking(true);
      if (i === parts.length - 1) u.onend = () => setIsSpeaking(false);
      u.onerror = (e: any) => {
        console.warn('[Speak] TTS error', e?.error ?? e?.type ?? 'unknown');
        setIsSpeaking(false);
      };
      synth.speak(u);
    });
  }

  async function handleSpeak(textOverride?: string) {
    const speechText = cleanText(textOverride) || practiceText;
    if (!speechText || typeof window === 'undefined') return;
    stopRecordedAudioPlayback(true);

    // Kids mode: try pre-recorded ElevenLabs mp3 first (now served from Supabase for
    // kids/* and kids/josh/* keys; /images/mercy-kids-page-3/* stays local).
    // Only use mp3 when playing the main phrase (no textOverride = tapping Mercy button)
    // For individual word chips (textOverride set), fall through to TTS
    if (isKidsMode && !textOverride && kidsAudioSrc) {
      // Stop any currently playing audio
      if (kidsAudioRef.current) {
        try { kidsAudioRef.current.pause(); kidsAudioRef.current.currentTime = 0; } catch { /* ignore */ }
      }
      const resolved = await resolveRoomAudioUrl(kidsAudioSrc);
      if (!resolved?.url) { speakViaTTS(speechText); return; }
      const freshAudio = new Audio();
      kidsAudioRef.current = freshAudio;
      freshAudio.src = resolved.url;
      freshAudio.onplay = () => setIsSpeaking(true);
      freshAudio.onended = () => setIsSpeaking(false);
      freshAudio.onerror = () => { setIsSpeaking(false); speakViaTTS(speechText); };
      freshAudio.play().catch(() => { setIsSpeaking(false); speakViaTTS(speechText); });
      return;
    }

    // Adult mode or word chip: use browser TTS
    speakViaTTS(speechText);
  }

  function stopSpeaking() {
    // Stop pre-recorded kids audio if playing
    if (kidsAudioRef.current) {
      try { kidsAudioRef.current.pause(); kidsAudioRef.current.currentTime = 0; } catch { /* ignore */ }
    }
    if (supportsSpeechSynthesis && typeof window !== 'undefined') {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }

  async function handlePlayRecording() {
    if (!recordedAudioUrl || isRecording) return;
    const audio = recordedAudioRef.current;
    if (!audio) return;
    stopSpeaking();
    try {
      // iOS Safari quirk: must reload before play if src changed
      if (audio.src !== recordedAudioUrl) {
        audio.src = recordedAudioUrl;
      }
      audio.load();
      audio.currentTime = 0;
      await audio.play();
      setRecordingError('');
    } catch (err) {
      console.error('[MercySpeak] Playback failed:', err);
      setRecordingError('Recorded audio could not be played.');
    }
  }

  async function handleCopy() {
    if (!practiceText || typeof navigator === 'undefined' || !navigator.clipboard?.writeText) return;
    try { await navigator.clipboard.writeText(practiceText); setCopySuccess(true); } catch { setCopySuccess(false); }
  }

  function stopListening() {
    setIsListening(false);
    try { recognitionRef.current?.stop(); } catch { try { recognitionRef.current?.abort?.(); } catch { /* ignore */ } }
  }

  function startListening() {
    if (!supportsRecognition || !practiceText || isListening || !speechWindow) return;
    stopRecordedAudioPlayback();
    setRecognitionError('');
    setTranscript('');
    const RecognitionCtor = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
    if (!RecognitionCtor) return;
    try { recognitionRef.current?.abort?.(); } catch { /* ignore */ }
    const recognition = new RecognitionCtor();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous     = false;
    recognition.onstart = () => { setIsListening(true); };
    recognition.onerror = (event: SpeechRecognitionErrorEventLike) => { setRecognitionError(getRecognitionErrorMessage(event?.error)); setIsListening(false); };
    recognition.onend   = () => { setIsListening(false); };
    recognition.onresult = (event) => {
      const combined = Array.from(event.results).map((result: SpeechRecognitionResultLike) =>
        Array.from({ length: result.length }, (_, index) => result[index] as SpeechRecognitionAlternativeLike).map((item) => item?.transcript || '').join(' ')
      ).join(' ');
      setTranscript(cleanText(combined));
    };
    recognitionRef.current = recognition;
    try { recognition.start(); } catch { setRecognitionError('Speech recognition could not start. Please try again.'); setIsListening(false); }
  }

  async function startRecording() {
    if (!supportsMediaRecording || isRecording || typeof navigator === 'undefined') return;
    stopRecordedAudioPlayback(true);
    setRecordingError('');
    try {
      revokeRecordedAudioUrl();
      stopActiveStream();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      activeStreamRef.current = stream;
      // Pick a mime type the browser actually supports. iOS Safari wants mp4/aac,
      // Chrome/Firefox want webm/opus. Let the browser pick from this ordered list.
      const preferredTypes = [
        'audio/mp4;codecs=mp4a.40.2',
        'audio/mp4',
        'audio/aac',
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus',
      ];
      const supportedType = preferredTypes.find((t) =>
        typeof MediaRecorder !== 'undefined' && typeof MediaRecorder.isTypeSupported === 'function'
          ? MediaRecorder.isTypeSupported(t)
          : false
      ) || '';
      const recorder = supportedType
        ? new MediaRecorder(stream, { mimeType: supportedType })
        : new MediaRecorder(stream);
      mediaChunksRef.current = [];
      recorder.ondataavailable = (event) => { if (event.data.size > 0) mediaChunksRef.current.push(event.data); };
      recorder.onerror = (event) => {
        console.error('[MercySpeak] Recorder error:', event);
        setRecordingError('Recording failed. Please try again.');
        setIsRecording(false);
        stopActiveStream();
      };
      recorder.onstop = () => {
        setIsRecording(false);
        if (!mediaChunksRef.current.length) { setRecordingError('No recording was captured. Please try again.'); stopActiveStream(); return; }
        // Use the recorder's actual mime type so the Blob matches what was encoded.
        const blobType = recorder.mimeType || supportedType || 'audio/webm';
        const blob = new Blob(mediaChunksRef.current, { type: blobType });
        setRecordedAudioUrl(URL.createObjectURL(blob));
        stopActiveStream();
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch { setRecordingError('Microphone access was blocked or unavailable.'); setIsRecording(false); stopActiveStream(); }
  }

  function stopRecording() {
    try { if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') mediaRecorderRef.current.stop(); }
    catch { setRecordingError('Recording could not be stopped cleanly. Please try again.'); setIsRecording(false); stopActiveStream(); }
  }

  function handleResetAttempt() {
    setTranscript(''); setRecognitionError(''); setRecordingError(''); setCopySuccess(false);
    stopListening(); stopSpeaking(); stopRecordedAudioPlayback(true);
    if (isRecording) stopRecording();
    revokeRecordedAudioUrl();
  }

  function handleClearPracticeLine() {
    handleResetAttempt();
    setCustomText('');
    setVariant('custom');
  }

  const matchTone        = getMetricTone(matchScore);
  const canOpenLogic     = Boolean(!isKidsMode && onOpenEnglishLogic);
  const confidenceLabel  = getConfidenceLevel(matchScore).toUpperCase();
  const transcriptLabel  = 'Your transcript';

  if (isKidsMode) {
    return (
      <div className="flex h-full min-h-0 flex-col overflow-hidden bg-gradient-to-br from-[#FFF8F3] via-[#FFFDFC] to-[#F7FAFF]">
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-2 py-2 md:px-3 md:py-3">
          <div className="flex min-h-full flex-col gap-2 rounded-[28px] border border-white/80 bg-white/92 px-3 pb-3 pt-1.5 shadow-[0_10px_28px_rgba(148,163,184,0.06)] md:px-4 md:pb-4 md:pt-2">
            <div className="min-w-0">
              <div className="flex flex-col gap-2">
                {(() => {
                  const headingLabel = kidsLesson?.label ?? kidsObject?.label ?? KIDS_OBJECTS[0].label;
                  const normalize = (s: string) => s.replace(/[.!?,;:\s]+$/g, '').trim().toLowerCase();
                  const dialogue = (kidsLesson as any)?.dialogue as string[] | undefined;
                  const hasDialogue = Array.isArray(dialogue) && dialogue.length > 1;
                  const sentenceDiffersFromLabel =
                    !!practiceText && normalize(practiceText) !== normalize(headingLabel);
                  return (
                    <>
                      <h3 className="text-[1.9rem] font-semibold tracking-tight text-slate-900 md:text-[2.65rem] md:leading-[1.02]">
                        {headingLabel}
                      </h3>
                      {hasDialogue ? (
                        <div className="flex flex-col gap-1.5">
                          {dialogue!.map((line, i) => (
                            <p key={i} className={`text-[0.95rem] leading-6 md:text-[1.05rem] md:leading-7 ${i % 2 === 0 ? 'text-slate-700 font-medium' : 'text-[#C05830] font-medium pl-3 border-l-2 border-[#FFB39A]'}`}>
                              {line}
                            </p>
                          ))}
                        </div>
                      ) : sentenceDiffersFromLabel ? (
                        <p className="text-[1.05rem] font-medium leading-7 text-slate-700 md:text-[1.35rem] md:leading-8">
                          {practiceText}
                        </p>
                      ) : null}
                    </>
                  );
                })()}
              </div>
            </div>

            <style>{`
@keyframes mercyKidCelebrate {
  0%   { transform: scale(1)    rotate(0deg); }
  20%  { transform: scale(1.12) rotate(-8deg); }
  40%  { transform: scale(0.94) rotate(6deg); }
  60%  { transform: scale(1.08) rotate(-4deg); }
  80%  { transform: scale(0.98) rotate(2deg); }
  100% { transform: scale(1)    rotate(0deg); }
}
`}</style>
            <div
              onClick={() => { playKidsUiSound('good'); triggerKidsImageCelebration('good'); }}
              className="flex min-h-[260px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-[24px] border border-[#F4DDD1] bg-gradient-to-br from-[#FFF6F0] via-white to-[#F8FBFF] p-0 shadow-[0_8px_18px_rgba(255,138,101,0.06)] md:min-h-[340px]"
              style={{
                animation: kidsImageCelebration
                  ? `mercyKidCelebrate ${kidsImageCelebration === 'wow' ? '900ms' : kidsImageCelebration === 'great' ? '700ms' : '600ms'} cubic-bezier(.34,1.56,.64,1)`
                  : undefined,
                boxShadow: kidsImageCelebration
                  ? `0 0 0 ${kidsImageCelebration === 'wow' ? '24px' : kidsImageCelebration === 'great' ? '18px' : '14px'} ${kidsImageCelebration === 'wow' ? 'rgba(255,99,132,0.35)' : kidsImageCelebration === 'great' ? 'rgba(255,193,7,0.45)' : 'rgba(110,198,200,0.45)'}`
                  : undefined,
                transition: 'box-shadow 200ms ease-out',
              }}
            >
              <img
                src={kidsLesson?.imageSrc ?? kidsObject?.imageSrc ?? KIDS_OBJECTS[0].imageSrc}
                alt={kidsLesson?.label ?? kidsObject?.label ?? KIDS_OBJECTS[0].label}
                className="h-full w-full scale-[1.04] object-contain"
              />
            </div>

            {(recognitionError || recordingError || !supportsRecognition) ? (
              <div className="space-y-1.5">
                {!supportsRecognition ? <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800"><div className="flex items-start gap-2"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /><p>Speech recognition is not available in this browser.</p></div></div> : null}
                {recognitionError ? <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800"><div className="flex items-start gap-2"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /><p>{recognitionError}</p></div></div> : null}
                {recordingError   ? <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800"><div className="flex items-start gap-2"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /><p>{recordingError}</p></div></div>   : null}
              </div>
            ) : null}

            <div className="grid grid-cols-5 gap-1.5">
              <div className="flex flex-col gap-1">
                <Button type="button" variant="outline" onClick={() => handleSpeak()} disabled={!practiceText}
                  className={`h-[42px] min-w-0 rounded-[14px] px-1 py-1 text-white shadow-sm hover:brightness-[1.03] disabled:opacity-60 ${voiceGender === 'josh' ? 'border-blue-300 bg-gradient-to-r from-[#5B8DEF] to-[#3B6FD4]' : 'border-teal-200 bg-gradient-to-r from-[#6EC6C8] to-[#5DAFB6]'}`}>
                  <span className="flex flex-col items-center justify-center gap-0.5 leading-none">
                    <Volume2 className="h-3.5 w-3.5 shrink-0" />
                    <span className="text-[9px] font-semibold">{voiceGender === 'josh' ? 'Josh' : 'Mercy'}</span>
                  </span>
                </Button>
                <div className="flex gap-0.5">
                  <button type="button"
                    onClick={() => { setVoiceGender('mercy'); try { localStorage.setItem('mb.voice.gender','mercy'); } catch {} }}
                    className={`flex-1 rounded-full text-[9px] font-bold py-0.5 transition ${voiceGender === 'mercy' ? 'bg-[#5DAFB6] text-white' : 'bg-slate-100 text-slate-400'}`}>♀</button>
                  <button type="button"
                    onClick={() => { setVoiceGender('josh'); try { localStorage.setItem('mb.voice.gender','josh'); } catch {} }}
                    className={`flex-1 rounded-full text-[9px] font-bold py-0.5 transition ${voiceGender === 'josh' ? 'bg-[#3B6FD4] text-white' : 'bg-slate-100 text-slate-400'}`}>♂</button>
                </div>
              </div>
              {!isListening ? (
                <Button type="button" onClick={startListening} disabled={!supportsRecognition || !practiceText} className="h-[54px] min-w-0 rounded-[16px] border-0 bg-gradient-to-r from-[#43C59E] to-[#18A874] px-1 py-1 text-white shadow-[0_10px_18px_rgba(24,168,116,0.20)] hover:brightness-[1.03] disabled:opacity-60">
                  <span className="flex flex-col items-center justify-center gap-1 leading-none"><Mic className="h-4 w-4 shrink-0" /><span className="text-[10px] font-semibold">You</span></span>
                </Button>
              ) : (
                <Button type="button" variant="destructive" onClick={stopListening} className="h-[54px] min-w-0 rounded-[16px] px-1 py-1 shadow-[0_10px_18px_rgba(239,68,68,0.16)]">
                  <span className="flex flex-col items-center justify-center gap-1 leading-none"><Square className="h-4 w-4 shrink-0" /><span className="text-[10px] font-semibold">Stop</span></span>
                </Button>
              )}
              {!isRecording ? (
                <Button type="button" variant="outline" onClick={startRecording} disabled={!supportsMediaRecording} className="h-[54px] min-w-0 rounded-[16px] border-[#BFE8EA] bg-[#F4FEFE] px-1 py-1 text-[#137E86] shadow-sm hover:bg-[#ECFCFD] disabled:opacity-60">
                  <span className="flex flex-col items-center justify-center gap-1 leading-none"><Mic className="h-4 w-4 shrink-0" /><span className="text-[10px] font-semibold">Record</span></span>
                </Button>
              ) : (
                <Button type="button" variant="outline" onClick={stopRecording} className="h-[54px] min-w-0 rounded-[16px] border-[#F2D8CA] bg-white px-1 py-1 text-slate-800 shadow-sm hover:bg-[#FFF8F4]">
                  <span className="flex flex-col items-center justify-center gap-1 leading-none"><Square className="h-4 w-4 shrink-0" /><span className="text-[10px] font-semibold">Stop</span></span>
                </Button>
              )}
              <Button type="button" variant="outline" onClick={handlePlayRecording} disabled={!recordedAudioUrl || isRecording} className="h-[54px] min-w-0 rounded-[16px] border-[#E2E8F0] bg-white px-1 py-1 text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50">
                <span className="flex flex-col items-center justify-center gap-1 leading-none"><PlayCircle className="h-4 w-4 shrink-0" /><span className="text-[10px] font-semibold">Play</span></span>
              </Button>
              <Button type="button" variant="outline" onClick={handleResetAttempt} className="h-[54px] min-w-0 rounded-[16px] border-[#F2E7DE] bg-white px-1 py-1 text-slate-700 shadow-sm hover:bg-[#FFF8F4]">
                <span className="flex flex-col items-center justify-center gap-1 leading-none"><RotateCcw className="h-4 w-4 shrink-0" /><span className="text-[10px] font-semibold">Reset</span></span>
              </Button>
            </div>

            <div className="rounded-[16px] border border-slate-200 bg-gradient-to-br from-[#FFF9F3] to-white p-2.5 shadow-sm">
              <div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">You</span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{transcript ? `${matchScore}%` : '0%'}</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className={`h-full rounded-full bg-gradient-to-r transition-all duration-500 ${matchTone.bar}`} style={{ width: `${transcript ? matchScore : 0}%` }} />
                </div>
              </div>

              <audio ref={recordedAudioRef} className="hidden" src={recordedAudioUrl || undefined} preload="metadata">Your browser does not support audio playback.</audio>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-gradient-to-br from-[#FFF8F3] via-[#FFFDFC] to-[#F7FAFF]">
      <div className="min-h-0 flex-1 overflow-y-auto px-2.5 py-3 md:px-3 md:py-4">
        <div className="space-y-3">
          <textarea
            value={customText}
            onChange={(e) => { setCustomText(e.target.value); setVariant('custom'); }}
            placeholder="Type the sentence you want to practice speaking..."
            className="min-h-[220px] w-full resize-y rounded-[20px] md:rounded-[26px] border border-[#E5CDB9] bg-gradient-to-br from-[#FFF9F2] to-white p-4 md:p-6 text-base leading-7 md:text-[1.1rem] md:leading-10 text-slate-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.92),0_8px_20px_rgba(255,138,101,0.05)] outline-none transition placeholder:text-slate-600 focus:border-[#EFA98B] focus:ring-2 focus:ring-[#FFD3BF] md:min-h-[304px]"
          />

          <div className="grid grid-cols-5 gap-2.5">
            <Button type="button" variant="outline" onClick={() => handleSpeak()} disabled={!practiceText} className="h-[58px] min-w-0 rounded-[20px] border-[#147A81] bg-gradient-to-r from-[#126C73] to-[#0E545B] px-2 py-1 text-white shadow-[0_10px_22px_rgba(18,108,115,0.30)] hover:brightness-[1.04] disabled:opacity-60">
              <span className="flex flex-col items-center justify-center gap-1 leading-none"><Volume2 className="h-4.5 w-4.5 shrink-0" /><span className="text-[11px] font-semibold">Mercy</span></span>
            </Button>
            {!isListening ? (
              <Button type="button" onClick={startListening} disabled={!supportsRecognition || !practiceText} className="h-[58px] min-w-0 rounded-[20px] border-0 bg-gradient-to-r from-[#147A53] to-[#0F6242] px-2 py-1 text-white shadow-[0_10px_22px_rgba(20,122,83,0.28)] hover:brightness-[1.04] disabled:opacity-60">
                <span className="flex flex-col items-center justify-center gap-1 leading-none"><Mic className="h-4.5 w-4.5 shrink-0" /><span className="text-[11px] font-semibold">You</span></span>
              </Button>
            ) : (
              <Button type="button" variant="destructive" onClick={stopListening} className="h-[58px] min-w-0 rounded-[20px] px-2 py-1 shadow-[0_10px_18px_rgba(239,68,68,0.16)]">
                <span className="flex flex-col items-center justify-center gap-1 leading-none"><Square className="h-4.5 w-4.5 shrink-0" /><span className="text-[11px] font-semibold">Stop</span></span>
              </Button>
            )}
            {!isRecording ? (
              <Button type="button" variant="outline" onClick={startRecording} disabled={!supportsMediaRecording} className="h-[58px] min-w-0 rounded-[20px] border-[#99D6DE] bg-[#F1FEFF] px-2 py-1 text-[#0A6673] shadow-sm hover:bg-[#E9FBFD] disabled:opacity-60">
                <span className="flex flex-col items-center justify-center gap-1 leading-none"><Mic className="h-4.5 w-4.5 shrink-0" /><span className="text-[11px] font-semibold">Record</span></span>
              </Button>
            ) : (
              <Button type="button" variant="outline" onClick={stopRecording} className="h-[58px] min-w-0 rounded-[20px] border-[#F2D8CA] bg-white px-2 py-1 text-slate-900 shadow-sm hover:bg-[#FFF8F4]">
                <span className="flex flex-col items-center justify-center gap-1 leading-none"><Square className="h-4.5 w-4.5 shrink-0" /><span className="text-[11px] font-semibold">Stop</span></span>
              </Button>
            )}
            <Button type="button" variant="outline" onClick={handlePlayRecording} disabled={!recordedAudioUrl || isRecording} className="h-[58px] min-w-0 rounded-[20px] border-[#B0BDD0] bg-white px-2 py-1 text-slate-700 shadow-sm hover:bg-slate-100 disabled:opacity-40">
              <span className="flex flex-col items-center justify-center gap-1 leading-none"><PlayCircle className="h-4.5 w-4.5 shrink-0" /><span className="text-[11px] font-semibold">Play</span></span>
            </Button>
            <Button type="button" variant="outline" onClick={handleResetAttempt} className="h-[58px] min-w-0 rounded-[20px] border-[#C8B8A8] bg-white px-2 py-1 text-slate-700 shadow-sm hover:bg-[#FFF4EE]">
              <span className="flex flex-col items-center justify-center gap-1 leading-none"><RotateCcw className="h-4.5 w-4.5 shrink-0" /><span className="text-[11px] font-semibold">Reset</span></span>
            </Button>
          </div>

          <div className="grid grid-cols-4 gap-2.5">
            <Button type="button" variant="outline" onClick={handleCopy} disabled={!practiceText} className="h-[58px] min-w-0 rounded-[20px] border-[#C8B8A8] bg-white px-2 py-1 text-slate-700 shadow-sm hover:bg-[#FFF4EE] disabled:opacity-50">
              <span className="flex flex-col items-center justify-center gap-1 leading-none"><Copy className="h-4.5 w-4.5 shrink-0" /><span className="text-[11px] font-semibold">{copySuccess ? 'Copied' : 'Copy'}</span></span>
            </Button>
            <button type="button" onClick={() => setVariant('custom')} className={`h-[58px] min-w-0 rounded-[20px] border px-2 py-1 text-[11px] font-semibold transition-all ${getVariantButtonClass(variant === 'custom')}`}>
              <span className="flex h-full items-center justify-center text-center leading-tight">Custom</span>
            </button>
            <button type="button" onClick={handleClearPracticeLine} className="h-[58px] min-w-0 rounded-[20px] border border-slate-300 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 transition-all hover:border-rose-400 hover:bg-rose-50 hover:text-rose-700">
              <span className="flex h-full flex-col items-center justify-center gap-1 leading-none"><Eraser className="h-4.5 w-4.5 shrink-0" /><span>Clear</span></span>
            </button>
            <Button type="button" variant="outline" onClick={() => { if (onOpenEnglishLogic) onOpenEnglishLogic(); }} disabled={!canOpenLogic} className="h-[58px] min-w-0 rounded-[20px] border-[#FFB39A] bg-[#FFF5EF] px-2 py-1 text-[#C05830] shadow-sm hover:bg-[#FFE8D8] disabled:opacity-50">
              <span className="flex h-full flex-col items-center justify-center leading-[1.04]"><span className="text-[10px] font-semibold">Understand</span><span className="text-[10px] font-semibold">why</span></span>
            </Button>
          </div>

          {!supportsRecognition ? <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800"><div className="flex items-start gap-2"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /><p>This browser does not expose speech recognition here. Audio playback still works.</p></div></div> : null}
          {!supportsMediaRecording ? <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800"><div className="flex items-start gap-2"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /><p>This browser does not support in-page voice recording here.</p></div></div> : null}
          {recognitionError ? <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800"><div className="flex items-start gap-2"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /><p>{recognitionError}</p></div></div> : null}
          {recordingError   ? <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800"><div className="flex items-start gap-2"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /><p>{recordingError}</p></div></div>   : null}

          <div className={`rounded-[20px] md:rounded-[24px] border p-3 md:p-4 shadow-sm ${transcript ? matchTone.ring : 'border-[#F1E5DB] bg-gradient-to-br from-[#FFF9F3] to-white'}`}>
            <div className="flex items-start justify-between gap-3">
              <p className="text-[2.05rem] font-semibold leading-none text-slate-950">{transcript ? `${matchScore}%` : '--'}</p>
              {transcript ? <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${matchTone.text}`}>{confidenceLabel}</span> : null}
            </div>
            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/90">
              <div className={`h-full rounded-full bg-gradient-to-r transition-all duration-500 ${matchTone.bar}`} style={{ width: `${transcript ? matchScore : 0}%` }} />
            </div>
          </div>

          <div className="rounded-[20px] md:rounded-[24px] border border-white/80 bg-white p-3 md:p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-700">{transcriptLabel}</p>
            <p className="mt-2 min-h-[60px] text-sm leading-8 text-slate-950">{transcript || 'Your transcript will appear here after you speak.'}</p>
          </div>

          <audio ref={recordedAudioRef} className="hidden" src={recordedAudioUrl || undefined} preload="metadata">Your browser does not support audio playback.</audio>
        </div>
      </div>
    </div>
  );
}

export default MercySpeakTab;
