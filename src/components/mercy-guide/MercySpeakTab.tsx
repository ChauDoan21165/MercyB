/**
 * Path: src/components/mercy-guide/MercySpeakTab.tsx
 * File: MercySpeakTab.tsx
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  Copy,
  Mic,
  RotateCcw,
  Square,
  Volume2,
  PlayCircle,
  BookOpenText,
  Wand2,
  Eraser,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
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

type KidsBuddy = {
  key: string;
  emoji: string;
  label: string;
  idleLine: string;
  goodLine: string;
  greatLine: string;
  retryLine: string;
};

const KIDS_OBJECT_KEYS = [
  'airplane',
  'apple',
  'bag',
  'ball',
  'banana',
  'bathtub',
  'bed',
  'bicycle',
  'bird',
  'blanket',
  'boat',
  'book',
  'bottle',
  'bus',
  'cat',
  'chair',
  'clock',
  'cloud',
  'cup',
  'dog',
  'doll',
  'door',
  'duck',
  'fish',
  'flower',
  'hat',
  'house',
  'key',
  'leaf',
  'milk',
  'moon',
  'orange',
  'pencil',
  'phone',
  'pillow',
  'plate',
  'rainbow',
  'shirt',
  'shoes',
  'soap',
  'sock',
  'spoon',
  'star',
  'sun',
  'table',
  'teddy-bear',
  'toothbrush',
  'toy-car',
  'tree',
  'window',
  'ant',
  'baby-bib',
  'backpack',
  'balloon',
  'bee',
  'bell',
  'block',
  'butterfly',
  'cake',
  'candle',
  'carrot',
  'cookie',
  'cow',
  'crayon',
  'dinosaur',
  'elephant',
  'envelope',
  'frog',
  'gift-box',
  'grapes',
  'hammer',
  'helicopter',
  'ice-cream',
  'jar',
  'kite',
  'lamp',
  'lion',
  'lollipop',
  'monkey',
  'mouse',
  'mushroom',
  'pear',
  'pig',
  'pizza',
  'rabbit',
  'rocket',
  'sandwich',
  'sheep',
  'strawberry',
  'train',
  'truck',
  'turtle',
  'watermelon',
  'whistle',
  'mitten',
  'scarf',
  'drum',
  'bear-face',
  'juice-box',
  'juice',
] as const;

const KIDS_UNCOUNTABLE_KEYS = new Set<string>([
  'milk',
  'soap',
  'juice',
  'ice-cream',
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

const KIDS_BUDDIES: KidsBuddy[] = [
  {
    key: 'dog',
    emoji: '🐶',
    label: 'Dog',
    idleLine: 'Let’s say it together.',
    goodLine: 'Good job!',
    greatLine: 'Amazing!',
    retryLine: 'Let’s try again.',
  },
  {
    key: 'cat',
    emoji: '🐱',
    label: 'Cat',
    idleLine: 'Ready when you are.',
    goodLine: 'Nice voice!',
    greatLine: 'So clear!',
    retryLine: 'Slow and steady.',
  },
  {
    key: 'rabbit',
    emoji: '🐰',
    label: 'Rabbit',
    idleLine: 'Hop in and say it.',
    goodLine: 'Great try!',
    greatLine: 'You did it!',
    retryLine: 'One more hop.',
  },
  {
    key: 'bear',
    emoji: '🐻',
    label: 'Bear',
    idleLine: 'Big calm voice.',
    goodLine: 'That was good.',
    greatLine: 'Strong and clear!',
    retryLine: 'Try with me.',
  },
  {
    key: 'panda',
    emoji: '🐼',
    label: 'Panda',
    idleLine: 'Listen, then say it.',
    goodLine: 'Very close!',
    greatLine: 'Beautiful!',
    retryLine: 'Let’s do it softly.',
  },
  {
    key: 'fox',
    emoji: '🦊',
    label: 'Fox',
    idleLine: 'Quick ears on.',
    goodLine: 'Nice work!',
    greatLine: 'Smart speaking!',
    retryLine: 'Listen first.',
  },
  {
    key: 'lion',
    emoji: '🦁',
    label: 'Lion',
    idleLine: 'Use your brave voice.',
    goodLine: 'Brave try!',
    greatLine: 'Roar, that was great!',
    retryLine: 'Try a big clear voice.',
  },
  {
    key: 'elephant',
    emoji: '🐘',
    label: 'Elephant',
    idleLine: 'Slow and clear.',
    goodLine: 'That was steady.',
    greatLine: 'Wonderful job!',
    retryLine: 'Slowly again.',
  },
  {
    key: 'monkey',
    emoji: '🐵',
    label: 'Monkey',
    idleLine: 'Let’s have fun.',
    goodLine: 'You’re close!',
    greatLine: 'Yay, perfect!',
    retryLine: 'Again with Mercy.',
  },
];

function toKidsLabel(key: string): string {
  return key
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function startsWithVowelSound(text: string): boolean {
  return /^[aeiou]/i.test(text.trim());
}

function toKidsSentence(key: string): string {
  const lowerLabel = toKidsLabel(key).toLowerCase();

  if (KIDS_UNCOUNTABLE_KEYS.has(key)) {
    return `This is ${lowerLabel}.`;
  }

  return `This is ${startsWithVowelSound(lowerLabel) ? 'an' : 'a'} ${lowerLabel}.`;
}

function toKidsAliases(key: string): string[] {
  const normalized = key.replace(/-/g, ' ');
  const label = toKidsLabel(key).toLowerCase();
  const extra = KIDS_EXTRA_ALIASES[key] ?? [];

  return Array.from(new Set([key, normalized, label, ...extra]));
}

const KIDS_OBJECTS: KidsObjectCard[] = KIDS_OBJECT_KEYS.map((key) => ({
  key,
  label: toKidsLabel(key),
  sentence: toKidsSentence(key),
  imageSrc: `/images/mercy-kids/${key}.jpg`,
  aliases: toKidsAliases(key),
}));

function getKidsBuddyByKey(key?: string | null): KidsBuddy {
  return KIDS_BUDDIES.find((item) => item.key === key) ?? KIDS_BUDDIES[0];
}

function playKidsCelebrationSound(level: 'good' | 'great') {
  if (typeof window === 'undefined') return;

  const AudioContextCtor =
    window.AudioContext ||
    (window as Window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;

  if (!AudioContextCtor) return;

  const ctx = new AudioContextCtor();
  void ctx.resume?.();

  const notes =
    level === 'great' ? [659.25, 783.99, 987.77] : [659.25, 783.99];

  notes.forEach((frequency, index) => {
    const start = ctx.currentTime + 0.02 + index * 0.09;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, start);

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.06, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.18);

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start(start);
    oscillator.stop(start + 0.2);
  });

  window.setTimeout(() => {
    void ctx.close().catch(() => undefined);
  }, 700);
}

function cleanText(value?: string | null): string {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

function normalizeForCompare(value: string): string {
  return cleanText(value)
    .toLowerCase()
    .replace(/[.,!?;:()[\]"'’`-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
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

  const found = KIDS_OBJECTS.find((item) =>
    item.aliases.some((alias) => normalized.includes(alias)),
  );

  return found ?? KIDS_OBJECTS[0];
}

function getKidsObjectByKey(key?: string | null): KidsObjectCard | null {
  if (!key) return null;
  return KIDS_OBJECTS.find((item) => item.key === key) ?? null;
}

function extractTroubleWords(
  troubleWords?: Array<string | { word?: string | null }>,
): string[] {
  if (!Array.isArray(troubleWords)) return [];

  return troubleWords
    .map((item) => {
      if (typeof item === 'string') return cleanText(item);
      if (item && typeof item === 'object') return cleanText(item.word);
      return '';
    })
    .filter(Boolean)
    .slice(0, 8);
}

function buildWordFeedback(target: string, spoken: string, isKidsMode: boolean): string[] {
  const targetWords = normalizeForCompare(target).split(' ').filter(Boolean);
  const spokenWords = normalizeForCompare(spoken).split(' ').filter(Boolean);

  if (!targetWords.length || !spokenWords.length) return [];

  const missing = targetWords.filter((word) => !spokenWords.includes(word));
  const extras = spokenWords.filter((word) => !targetWords.includes(word));

  const notes: string[] = [];

  if (missing.length > 0) {
    notes.push(
      isKidsMode
        ? `Try these words again: ${missing.slice(0, 4).join(', ')}`
        : `Try saying these more clearly: ${missing.slice(0, 5).join(', ')}`,
    );
  }

  if (!isKidsMode && extras.length > 0) {
    notes.push(`Extra words: ${extras.slice(0, 5).join(', ')}`);
  }

  return notes;
}

function calculateMatchScore(target: string, spoken: string): number {
  const targetWords = normalizeForCompare(target).split(' ').filter(Boolean);
  const spokenWords = normalizeForCompare(spoken).split(' ').filter(Boolean);

  if (!targetWords.length) return 0;
  if (!spokenWords.length) return 0;

  let matched = 0;
  const remainingSpoken = [...spokenWords];

  for (const word of targetWords) {
    const index = remainingSpoken.indexOf(word);
    if (index >= 0) {
      matched += 1;
      remainingSpoken.splice(index, 1);
    }
  }

  return Math.max(0, Math.min(100, Math.round((matched / targetWords.length) * 100)));
}

function detectTroubleWords(transcript: string, target: string): string[] {
  const transcriptWords = new Set(
    normalizeForCompare(transcript).split(/\s+/).filter(Boolean),
  );

  return normalizeForCompare(target)
    .split(/\s+/)
    .filter(Boolean)
    .filter((word, index, array) => array.indexOf(word) === index)
    .filter((word) => !transcriptWords.has(word))
    .slice(0, 5);
}

function filterTroubleWordsForPractice(
  troubleWords: string[],
  practiceText: string,
): string[] {
  const practiceWordSet = new Set(
    normalizeForCompare(practiceText).split(/\s+/).filter(Boolean),
  );

  if (!practiceWordSet.size) return [];

  return troubleWords.filter((word) => practiceWordSet.has(normalizeForCompare(word)));
}

function buildStressHint(target: string): string | null {
  const words = cleanText(target).split(/\s+/).filter(Boolean);
  if (words.length < 3) return null;

  const emphasized = words.map((word, index) => {
    if (index === 1 || index === words.length - 1) {
      return word.toUpperCase();
    }
    return word;
  });

  return emphasized.join(' ');
}

function getConfidenceLevel(score: number): 'low' | 'medium' | 'high' {
  if (score >= 85) return 'high';
  if (score >= 60) return 'medium';
  return 'low';
}

function getCoachMessage(score: number, hasTranscript: boolean, isKidsMode: boolean): string {
  if (isKidsMode) {
    if (!hasTranscript) {
      return 'Tap play, listen, then say it with Mercy.';
    }

    if (score >= 85) {
      return 'Great job. Say it one more time.';
    }

    if (score >= 60) {
      return 'Good try. Say it slowly with Mercy again.';
    }

    return 'Nice try. Listen once more, then say it slowly.';
  }

  if (!hasTranscript) {
    return 'Listen first, then say it slowly.';
  }

  if (score >= 85) {
    return 'Very good. You are close to the natural sentence.';
  }

  if (score >= 60) {
    return 'Good progress. Slow down and match Mercy’s words more closely.';
  }

  return 'Start slower. Match the exact words first.';
}

function getVariantButtonClass(active: boolean) {
  return active
    ? 'border-[#FFD4C6] bg-gradient-to-r from-[#FFF0E9] to-[#FFF8F4] text-[#D66A4E] shadow-[0_8px_20px_rgba(255,138,101,0.12)]'
    : 'border-slate-200 bg-white/92 text-slate-600 hover:border-[#FFD4C6] hover:bg-[#FFF8F4] hover:text-[#D66A4E]';
}

function getMetricTone(score: number) {
  if (score >= 85) {
    return {
      ring: 'border-emerald-200 bg-emerald-50/80',
      text: 'text-emerald-700',
      bar: 'from-emerald-400 to-teal-400',
    };
  }

  if (score >= 60) {
    return {
      ring: 'border-amber-200 bg-amber-50/80',
      text: 'text-amber-700',
      bar: 'from-amber-400 to-orange-400',
    };
  }

  return {
    ring: 'border-rose-200 bg-rose-50/80',
    text: 'text-rose-700',
    bar: 'from-rose-400 to-orange-400',
  };
}

function getRecognitionErrorMessage(error?: string): string {
  switch (error) {
    case 'not-allowed':
    case 'service-not-allowed':
      return 'Microphone access was blocked. Please allow microphone access and try again.';
    case 'no-speech':
      return 'No speech was detected. Try again and speak a little closer to the microphone.';
    case 'audio-capture':
      return 'No microphone was found for speech recognition.';
    case 'network':
      return 'Speech recognition had a network problem. Please try again.';
    case 'aborted':
      return 'Speech recognition was stopped.';
    default:
      return error ? `Speech recognition failed: ${error}.` : 'Speech recognition failed.';
  }
}

function buildFallbackPracticeText(
  payload: PronunciationLaunchPayload | null,
  contentEn?: string,
): string {
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
  void roomId;
  void roomTitle;
  void speakPractice;
  void profile;
  void learningSupportMode;
  void kidsModeAgeBand;
  void teacherLabel;

  const payload = useMemo(
    () => pendingPronunciationPayload ?? pendingPayload ?? launchPayload ?? null,
    [launchPayload, pendingPayload, pendingPronunciationPayload],
  );

  const rawSourceText = cleanText(payload?.sourceText);
  const rawCorrectedText = cleanText(payload?.correctedText);
  const rawEnhancedText = cleanText(payload?.enhancedText);

  const rawKidsCandidateText = useMemo(
    () => rawEnhancedText || rawCorrectedText || rawSourceText,
    [rawCorrectedText, rawEnhancedText, rawSourceText],
  );

  const kidsObject = useMemo(() => {
    if (!isKidsMode) return null;

    const selectedObject = getKidsObjectByKey(selectedKidsObjectKey);
    if (selectedObject) {
      return selectedObject;
    }

    if (isLikelyKidsSentence(rawKidsCandidateText)) {
      return getKidsObjectFromSentence(rawKidsCandidateText);
    }

    return KIDS_OBJECTS[0];
  }, [isKidsMode, rawKidsCandidateText, selectedKidsObjectKey]);

  const kidsPracticeText = useMemo(() => {
    if (!isKidsMode) return '';
    return kidsObject?.sentence ?? KIDS_OBJECTS[0].sentence;
  }, [isKidsMode, kidsObject]);

  const sourceText = isKidsMode ? kidsPracticeText : rawSourceText;
  const correctedText = isKidsMode ? kidsPracticeText : rawCorrectedText;
  const enhancedText = isKidsMode ? kidsPracticeText : rawEnhancedText;

  const defaultPracticeText = useMemo(() => {
    if (isKidsMode) {
      return kidsPracticeText;
    }
    return buildFallbackPracticeText(payload, contentEn);
  }, [contentEn, isKidsMode, kidsPracticeText, payload]);

  const initialVariant: PracticeVariant = isKidsMode
    ? 'custom'
    : enhancedText
      ? 'enhanced'
      : correctedText
        ? 'corrected'
        : sourceText
          ? 'source'
          : 'custom';

  const [variant, setVariant] = useState<PracticeVariant>(initialVariant);
  const [customText, setCustomText] = useState(defaultPracticeText);
  const [copySuccess, setCopySuccess] = useState(false);

  const [transcript, setTranscript] = useState('');
  const [recognitionError, setRecognitionError] = useState('');
  const [isListening, setIsListening] = useState(false);

  const [recordingError, setRecordingError] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState('');

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedBuddyKey, setSelectedBuddyKey] = useState<string>(
    KIDS_BUDDIES[0].key,
  );

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaChunksRef = useRef<BlobPart[]>([]);
  const activeStreamRef = useRef<MediaStream | null>(null);
  const lastKidsCelebrationRef = useRef('');

  const speechWindow =
    typeof window !== 'undefined'
      ? (window as BrowserWindowWithSpeechRecognition)
      : undefined;

  const supportsRecognition =
    typeof window !== 'undefined' &&
    Boolean(speechWindow?.SpeechRecognition || speechWindow?.webkitSpeechRecognition);

  const supportsSpeechSynthesis =
    typeof window !== 'undefined' && typeof window.speechSynthesis !== 'undefined';

  const supportsMediaRecording =
    typeof window !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    Boolean(navigator.mediaDevices?.getUserMedia) &&
    typeof MediaRecorder !== 'undefined';

  useEffect(() => {
    setCustomText(defaultPracticeText);
    setVariant(initialVariant);
  }, [defaultPracticeText, initialVariant]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }

      try {
        recognitionRef.current?.abort?.();
      } catch {
        // ignore cleanup errors
      }
      recognitionRef.current = null;

      try {
        if (
          mediaRecorderRef.current &&
          mediaRecorderRef.current.state !== 'inactive'
        ) {
          mediaRecorderRef.current.stop();
        }
      } catch {
        // ignore cleanup errors
      }
      mediaRecorderRef.current = null;

      if (recordedAudioUrl) {
        URL.revokeObjectURL(recordedAudioUrl);
      }

      if (activeStreamRef.current) {
        activeStreamRef.current.getTracks().forEach((track) => track.stop());
        activeStreamRef.current = null;
      }
    };
  }, [recordedAudioUrl]);

  useEffect(() => {
    if (typeof window === 'undefined' || !copySuccess) return;

    const timer = window.setTimeout(() => {
      setCopySuccess(false);
    }, 1600);

    return () => window.clearTimeout(timer);
  }, [copySuccess]);

  const practiceText = useMemo(() => {
    if (isKidsMode) {
      return kidsPracticeText;
    }

    const base = cleanText(customText);

    if (variant === 'enhanced' && enhancedText) return enhancedText;
    if (variant === 'corrected' && correctedText) return correctedText;
    if (variant === 'source' && sourceText) return sourceText;
    return base;
  }, [
    correctedText,
    customText,
    enhancedText,
    isKidsMode,
    kidsPracticeText,
    sourceText,
    variant,
  ]);

  const memoryTroubleWords = useMemo(
    () => extractTroubleWords(troubleWords),
    [troubleWords],
  );

  const scopedMemoryTroubleWords = useMemo(
    () => filterTroubleWordsForPractice(memoryTroubleWords, practiceText),
    [memoryTroubleWords, practiceText],
  );

  const matchScore = useMemo(
    () => calculateMatchScore(practiceText, transcript),
    [practiceText, transcript],
  );

  const generatedTroubleWords = useMemo(
    () => detectTroubleWords(transcript, practiceText),
    [practiceText, transcript],
  );

  const displayedTroubleWords = useMemo(() => {
    if (generatedTroubleWords.length > 0) {
      return generatedTroubleWords;
    }

    return scopedMemoryTroubleWords;
  }, [generatedTroubleWords, scopedMemoryTroubleWords]);

  const kidsWordChips = useMemo(() => {
    if (!isKidsMode) return [];

    if (displayedTroubleWords.length > 0) {
      return displayedTroubleWords;
    }

    return normalizeForCompare(practiceText)
      .split(/\s+/)
      .filter(Boolean)
      .filter((word, index, array) => array.indexOf(word) === index)
      .slice(0, 4);
  }, [displayedTroubleWords, isKidsMode, practiceText]);

  const feedbackNotes = useMemo(() => {
    if (!practiceText || !transcript) return [];

    const notes = buildWordFeedback(practiceText, transcript, isKidsMode);
    const stressHint = buildStressHint(practiceText);

    if (stressHint && !isKidsMode) {
      notes.push(`Stress: ${stressHint}`);
    }

    return notes;
  }, [isKidsMode, practiceText, transcript]);

  const coachMessage = useMemo(
    () => getCoachMessage(matchScore, Boolean(transcript), isKidsMode),
    [isKidsMode, matchScore, transcript],
  );

  const selectedBuddy = useMemo(
    () => getKidsBuddyByKey(selectedBuddyKey),
    [selectedBuddyKey],
  );

  const kidsBuddyReaction = useMemo(() => {
    if (!isKidsMode) return null;

    if (isListening) {
      return {
        title: `${selectedBuddy.label} is listening`,
        message: 'Say it with a big clear voice.',
        motionClass: 'animate-pulse',
        ringClass: 'border-sky-200 bg-sky-50/90',
        textClass: 'text-sky-700',
      };
    }

    if (isSpeaking) {
      return {
        title: `${selectedBuddy.label} says listen first`,
        message: 'Listen with Mercy, then say it together.',
        motionClass: 'animate-pulse',
        ringClass: 'border-teal-200 bg-teal-50/90',
        textClass: 'text-teal-700',
      };
    }

    if (!transcript) {
      return {
        title: `${selectedBuddy.label} is ready`,
        message: selectedBuddy.idleLine,
        motionClass: '',
        ringClass: 'border-slate-200 bg-white/92',
        textClass: 'text-slate-700',
      };
    }

    if (matchScore >= 90) {
      return {
        title: `${selectedBuddy.label} is cheering`,
        message: selectedBuddy.greatLine,
        motionClass: 'animate-bounce',
        ringClass: 'border-emerald-200 bg-emerald-50/90',
        textClass: 'text-emerald-700',
      };
    }

    if (matchScore >= 75) {
      return {
        title: `${selectedBuddy.label} is smiling`,
        message: selectedBuddy.goodLine,
        motionClass: 'animate-pulse',
        ringClass: 'border-amber-200 bg-amber-50/90',
        textClass: 'text-amber-700',
      };
    }

    if (matchScore >= 55) {
      return {
        title: `${selectedBuddy.label} says keep going`,
        message: 'Good try. Let’s do one more.',
        motionClass: '',
        ringClass: 'border-amber-200 bg-amber-50/80',
        textClass: 'text-amber-700',
      };
    }

    return {
      title: `${selectedBuddy.label} says listen first`,
      message: selectedBuddy.retryLine,
      motionClass: '',
      ringClass: 'border-rose-200 bg-rose-50/80',
      textClass: 'text-rose-700',
    };
  }, [isKidsMode, isListening, isSpeaking, matchScore, selectedBuddy, transcript]);

  const nextStepMessage = useMemo(() => {
    if (isKidsMode) {
      if (!practiceText) {
        return 'Choose one short line, then tap play and say it with Mercy.';
      }

      if (!transcript) {
        return 'Tap play. Listen. Say it with Mercy.';
      }

      if (matchScore >= 80) {
        return 'Great. Say it one more time with a big clear voice.';
      }

      if (matchScore >= 60) {
        return 'Good try. Listen once more and say it again slowly.';
      }

      return 'Listen first, then say the same words slowly.';
    }

    if (!practiceText) {
      return 'Start with one sentence.';
    }

    if (!transcript) {
      return 'Say it once, then open Logic if needed.';
    }

    if (matchScore >= 80) {
      return 'Good. Now open Logic to see why it changed.';
    }

    if (matchScore >= 60) {
      return 'Try once more slowly, then open Logic.';
    }

    return 'Try again slowly, then open Logic.';
  }, [isKidsMode, matchScore, practiceText, transcript]);

  useEffect(() => {
    if (!transcript || !practiceText || !onMemoryUpdate) return;

    onMemoryUpdate({
      pronunciation: {
        troubleWords: generatedTroubleWords,
        lastPracticeLine: practiceText,
        confidenceLevel: getConfidenceLevel(matchScore),
      },
    });
  }, [generatedTroubleWords, matchScore, onMemoryUpdate, practiceText, transcript]);

  useEffect(() => {
    if (!isKidsMode) return;

    if (!transcript || isListening) {
      if (!transcript) {
        lastKidsCelebrationRef.current = '';
      }
      return;
    }

    const attemptKey = `${normalizeForCompare(practiceText)}__${normalizeForCompare(transcript)}`;
    if (lastKidsCelebrationRef.current === attemptKey) return;

    lastKidsCelebrationRef.current = attemptKey;

    if (matchScore >= 90) {
      playKidsCelebrationSound('great');
      return;
    }

    if (matchScore >= 70) {
      playKidsCelebrationSound('good');
    }
  }, [isKidsMode, isListening, matchScore, practiceText, transcript]);

  function stopActiveStream() {
    if (activeStreamRef.current) {
      activeStreamRef.current.getTracks().forEach((track) => track.stop());
      activeStreamRef.current = null;
    }
  }

  function revokeRecordedAudioUrl() {
    if (recordedAudioUrl) {
      URL.revokeObjectURL(recordedAudioUrl);
      setRecordedAudioUrl('');
    }
  }

  function handleSpeak(textOverride?: string) {
    const speechText = cleanText(textOverride) || practiceText;
    if (!speechText || !supportsSpeechSynthesis || typeof window === 'undefined') return;

    try {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(speechText);
      utterance.lang = 'en-US';
      utterance.rate = isKidsMode ? 0.8 : 0.92;
      utterance.pitch = isKidsMode ? 1.05 : 1;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch {
      setIsSpeaking(false);
    }
  }

  function stopSpeaking() {
    if (!supportsSpeechSynthesis || typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }

  async function handleCopy() {
    if (!practiceText || typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
      return;
    }

    try {
      await navigator.clipboard.writeText(practiceText);
      setCopySuccess(true);
    } catch {
      setCopySuccess(false);
    }
  }

  function stopListening() {
    setIsListening(false);

    try {
      recognitionRef.current?.stop();
    } catch {
      try {
        recognitionRef.current?.abort?.();
      } catch {
        // ignore stop errors
      }
    }
  }

  function startListening() {
    if (!supportsRecognition || !practiceText || isListening || !speechWindow) return;

    setRecognitionError('');
    setTranscript('');

    const RecognitionCtor =
      speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;

    if (!RecognitionCtor) return;

    try {
      recognitionRef.current?.abort?.();
    } catch {
      // ignore replacement errors
    }

    const recognition = new RecognitionCtor();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEventLike) => {
      setRecognitionError(getRecognitionErrorMessage(event?.error));
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const combined = Array.from(event.results)
        .map((result: SpeechRecognitionResultLike) =>
          Array.from(
            { length: result.length },
            (_, index) => result[index] as SpeechRecognitionAlternativeLike,
          )
            .map((item) => item?.transcript || '')
            .join(' '),
        )
        .join(' ');

      setTranscript(cleanText(combined));
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch {
      setRecognitionError('Speech recognition could not start. Please try again.');
      setIsListening(false);
    }
  }

  async function startRecording() {
    if (!supportsMediaRecording || isRecording || typeof navigator === 'undefined') return;

    setRecordingError('');

    try {
      revokeRecordedAudioUrl();
      stopActiveStream();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      activeStreamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      mediaChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          mediaChunksRef.current.push(event.data);
        }
      };

      recorder.onerror = () => {
        setRecordingError('Recording failed. Please try again.');
        setIsRecording(false);
        stopActiveStream();
      };

      recorder.onstop = () => {
        setIsRecording(false);

        const hasAudio = mediaChunksRef.current.length > 0;
        if (!hasAudio) {
          setRecordingError('No recording was captured. Please try again.');
          stopActiveStream();
          return;
        }

        const blob = new Blob(mediaChunksRef.current, { type: 'audio/webm' });
        const nextUrl = URL.createObjectURL(blob);
        setRecordedAudioUrl(nextUrl);
        stopActiveStream();
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch {
      setRecordingError('Microphone access was blocked or unavailable.');
      setIsRecording(false);
      stopActiveStream();
    }
  }

  function stopRecording() {
    try {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== 'inactive'
      ) {
        mediaRecorderRef.current.stop();
      }
    } catch {
      setRecordingError('Recording could not be stopped cleanly. Please try again.');
      setIsRecording(false);
      stopActiveStream();
    }
  }

  function handleResetAttempt() {
    setTranscript('');
    setRecognitionError('');
    setRecordingError('');
    setCopySuccess(false);

    stopListening();
    stopSpeaking();

    if (isRecording) {
      stopRecording();
    }

    revokeRecordedAudioUrl();
  }

  function handleClearPracticeLine() {
    handleResetAttempt();
    setCustomText('');
    setVariant('custom');
  }

  const matchTone = getMetricTone(matchScore);
  const hasResolvedPayload = Boolean(sourceText || correctedText || enhancedText);
  const transcriptLabel = 'You said';
  const troubleLabel = isKidsMode ? 'Try these words again' : 'Watch these trouble words';
  const primaryButtonClass = isKidsMode
    ? 'h-12 rounded-2xl border-0 bg-gradient-to-r from-[#4FC5C7] to-[#38AEB6] px-4 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(56,174,182,0.24)] hover:brightness-[1.03] disabled:opacity-60'
    : 'h-11 rounded-2xl border-0 bg-gradient-to-r from-[#4FC5C7] to-[#38AEB6] px-4 text-white shadow-[0_10px_20px_rgba(56,174,182,0.24)] hover:brightness-[1.03] disabled:opacity-60';
  const outlineButtonClass = isKidsMode
    ? 'h-12 rounded-2xl border-[#F2D8CA] bg-white px-4 text-sm font-semibold text-slate-800 shadow-sm hover:bg-[#FFF8F4] disabled:opacity-60'
    : 'h-11 rounded-2xl border-[#F2D8CA] bg-white px-4 text-slate-800 shadow-sm hover:bg-[#FFF8F4] disabled:opacity-60';
  const shouldShowAdultWhyCard = Boolean(
    !isKidsMode && sourceText && correctedText && sourceText !== correctedText,
  );
  const shouldShowLogicButton = Boolean(
    !isKidsMode &&
      onOpenEnglishLogic &&
      (Boolean(transcript) ||
        shouldShowAdultWhyCard ||
        Boolean(correctedText) ||
        Boolean(enhancedText))
  );
  const confidenceLabel = getConfidenceLevel(matchScore).toUpperCase();
  const showAdultFeedbackCard = Boolean(!isKidsMode && transcript);

  if (isKidsMode) {
    return (
      <div className="flex h-full min-h-0 flex-col overflow-hidden bg-gradient-to-br from-[#FFF8F3] via-[#FFFDFC] to-[#F7FAFF]">
        <div className="flex h-full min-h-0 flex-col p-2 md:p-3">
          <div className="flex h-full min-h-0 flex-col gap-3 rounded-[28px] border border-white/80 bg-white/92 p-3 shadow-[0_10px_28px_rgba(148,163,184,0.06)] md:p-4">
            <div>
              <h3 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-[42px] md:leading-[1.02]">
                {kidsObject?.label ?? KIDS_OBJECTS[0].label}
              </h3>

              <p className="mt-1.5 text-xl leading-8 text-slate-700 md:text-[1.75rem] md:leading-10">
                {practiceText}
              </p>
            </div>

            <div className="grid min-h-0 gap-3 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-4">
              <div className="flex items-center justify-center rounded-[24px] border border-[#FFD7C8] bg-gradient-to-br from-[#FFF6F0] via-white to-[#F8FBFF] p-3 shadow-[0_12px_26px_rgba(255,138,101,0.10)] md:p-4">
                <img
                  src={kidsObject?.imageSrc ?? KIDS_OBJECTS[0].imageSrc}
                  alt={kidsObject?.label ?? KIDS_OBJECTS[0].label}
                  className="h-44 w-44 scale-[1.08] object-contain md:h-56 md:w-56 xl:h-64 xl:w-64"
                />
              </div>

              <div className="flex min-h-0 flex-col gap-3 overflow-y-auto pr-1">
                <div className="rounded-[18px] border border-[#DCE7F7] bg-gradient-to-r from-[#F8FBFF] to-white p-3 shadow-sm">
                  <div className="overflow-x-auto">
                    <div className="flex min-w-max gap-2 pr-1">
                      {KIDS_BUDDIES.map((buddy) => {
                        const active = buddy.key === selectedBuddy.key;
                        const motionClass =
                          active && matchScore >= 90
                            ? 'animate-bounce'
                            : active && (isListening || isSpeaking)
                              ? 'animate-pulse'
                              : '';

                        return (
                          <button
                            key={buddy.key}
                            type="button"
                            onClick={() => setSelectedBuddyKey(buddy.key)}
                            className={`flex min-w-[68px] flex-col items-center rounded-2xl border px-2 py-2 text-center shadow-sm transition ${
                              active
                                ? 'border-[#BFD5F7] bg-white text-slate-900 ring-2 ring-[#DCE7F7]'
                                : 'border-transparent bg-white/70 text-slate-600 hover:border-[#DCE7F7] hover:bg-white'
                            }`}
                          >
                            <span className={`text-2xl ${motionClass}`}>{buddy.emoji}</span>
                            <span className="mt-1 text-[11px] font-semibold">{buddy.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {(recognitionError || recordingError || !supportsRecognition || !supportsMediaRecording) ? (
                  <div className="space-y-1.5">
                    {!supportsRecognition ? (
                      <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                          <p>Speech recognition is not available in this browser.</p>
                        </div>
                      </div>
                    ) : null}

                    {!supportsMediaRecording ? (
                      <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                          <p>Voice recording is not available in this browser.</p>
                        </div>
                      </div>
                    ) : null}

                    {recognitionError ? (
                      <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                          <p>{recognitionError}</p>
                        </div>
                      </div>
                    ) : null}

                    {recordingError ? (
                      <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                          <p>{recordingError}</p>
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : null}

                <div className="grid gap-2 sm:grid-cols-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSpeak()}
                    disabled={!practiceText}
                    className="h-12 justify-center rounded-[18px] border-teal-200 bg-gradient-to-r from-[#6EC6C8] to-[#5DAFB6] px-4 text-sm font-semibold text-white shadow-[0_10px_18px_rgba(93,175,182,0.22)] hover:brightness-[1.03] disabled:opacity-60"
                  >
                    <Volume2 className="mr-2 h-4 w-4" />
                    Teacher Mercy
                  </Button>

                  {!isListening ? (
                    <Button
                      type="button"
                      onClick={startListening}
                      disabled={!supportsRecognition || !practiceText}
                      className="h-12 rounded-2xl border-0 bg-gradient-to-r from-[#43C59E] to-[#18A874] px-4 text-sm font-semibold text-white shadow-[0_10px_18px_rgba(24,168,116,0.20)] hover:brightness-[1.03] disabled:opacity-60"
                    >
                      <Mic className="mr-2 h-4 w-4" />
                      Say with mic
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={stopListening}
                      className="h-12 rounded-2xl px-4 text-sm font-semibold shadow-[0_10px_18px_rgba(239,68,68,0.16)]"
                    >
                      <Square className="mr-2 h-4 w-4" />
                      Stop
                    </Button>
                  )}

                  {!isRecording ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={startRecording}
                      disabled={!supportsMediaRecording}
                      className="h-12 rounded-2xl border-[#BFE8EA] bg-[#F4FEFE] px-4 text-sm font-semibold text-[#137E86] shadow-sm hover:bg-[#ECFCFD] disabled:opacity-60"
                    >
                      <PlayCircle className="mr-2 h-4 w-4" />
                      Record
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={stopRecording}
                      className="h-12 rounded-2xl border-[#F2D8CA] bg-white px-4 text-sm font-semibold text-slate-800 shadow-sm hover:bg-[#FFF8F4]"
                    >
                      <Square className="mr-2 h-4 w-4" />
                      Stop record
                    </Button>
                  )}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResetAttempt}
                    className="h-12 rounded-2xl border-[#F2E7DE] bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm hover:bg-[#FFF8F4]"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                </div>

                <div className="grid gap-3 xl:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)]">
                  <div className="rounded-[18px] border border-slate-200 bg-gradient-to-br from-[#FFF9F3] to-white p-3 shadow-sm">
                    <div className="flex items-center justify-between gap-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                      <span>Teacher Mercy</span>
                      <span>100%</span>
                    </div>

                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full w-full rounded-full bg-gradient-to-r from-[#6EC6C8] to-[#5DAFB6]" />
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                      <span>You</span>
                      <span>{transcript ? `${matchScore}%` : '0%'}</span>
                    </div>

                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r transition-all duration-500 ${matchTone.bar}`}
                        style={{ width: `${transcript ? matchScore : 0}%` }}
                      />
                    </div>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {coachMessage}
                    </p>

                    <div
                      className={`mt-3 flex items-center gap-3 rounded-[18px] border p-3 shadow-sm ${kidsBuddyReaction?.ringClass ?? 'border-slate-200 bg-white'} ${kidsBuddyReaction?.textClass ?? 'text-slate-700'}`}
                    >
                      <div
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/85 text-3xl shadow-sm ${kidsBuddyReaction?.motionClass ?? ''}`}
                      >
                        {selectedBuddy.emoji}
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-semibold">{kidsBuddyReaction?.title}</p>
                        <p className="mt-1 text-sm leading-6 text-slate-600">
                          {kidsBuddyReaction?.message ?? coachMessage}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[18px] border border-[#F1E5DB] bg-gradient-to-br from-[#FFF9F3] to-white p-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <PlayCircle className="h-4 w-4 text-emerald-600" />
                      <p className="text-sm font-semibold text-slate-900">Play my voice</p>
                    </div>

                    {recordedAudioUrl ? (
                      <audio className="mt-2 w-full" controls src={recordedAudioUrl}>
                        Your browser does not support audio playback.
                      </audio>
                    ) : (
                      <div className="mt-3 rounded-2xl border border-dashed border-[#D9E6EA] bg-white/80 p-3">
                        <p className="text-sm font-medium text-slate-700">
                          Tap <span className="font-semibold">Record</span>, then hear your own voice here.
                        </p>

                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full transition-all ${
                              isRecording
                                ? 'w-full animate-pulse bg-gradient-to-r from-emerald-400 to-teal-400'
                                : 'w-0 bg-transparent'
                            }`}
                          />
                        </div>

                        <p className="mt-2 text-xs text-slate-500">
                          {isRecording ? 'Recording now…' : 'Your playback will appear after recording.'}
                        </p>
                      </div>
                    )}

                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {nextStepMessage}
                    </p>
                  </div>
                </div>

                {kidsWordChips.length > 0 ? (
                  <div className="rounded-[18px] border border-[#F1E5DB] bg-white/92 p-3 shadow-sm">
                    <p className="text-sm font-semibold text-slate-900">
                      Try these words again
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {kidsWordChips.map((word) => (
                        <button
                          key={word}
                          type="button"
                          onClick={() => handleSpeak(word)}
                          className="rounded-full border border-[#F2DDD0] bg-gradient-to-r from-[#FFF5EF] to-white px-3 py-1.5 text-sm font-semibold text-[#875E4B] shadow-sm transition hover:border-[#F0C8B3] hover:bg-[#FFF8F4]"
                        >
                          {word}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-gradient-to-br from-[#FFF8F3] via-[#FFFDFC] to-[#F7FAFF]">
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 md:px-5 md:py-5">
        <div className="space-y-3">
          <div className="rounded-3xl border border-white/80 bg-white/92 p-4 shadow-[0_10px_28px_rgba(148,163,184,0.06)]">
            {!hasResolvedPayload && !practiceText ? (
              <div className="mb-3 rounded-2xl border border-amber-200 bg-amber-50/70 px-4 py-3 text-sm leading-6 text-amber-800">
                Mercy does not have a sentence loaded yet. Type one below, or open Grammar first.
              </div>
            ) : null}

            <textarea
              value={customText}
              onChange={(e) => {
                setCustomText(e.target.value);
                setVariant('custom');
              }}
              placeholder="Type the sentence you want to practice speaking..."
              className="w-full min-h-[92px] resize-y rounded-[22px] border border-[#F0E2D7] bg-gradient-to-br from-[#FFF9F2] to-white p-4 text-base leading-7 text-slate-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_8px_20px_rgba(255,138,101,0.05)] outline-none transition focus:border-[#F7B79E] focus:ring-2 focus:ring-[#FFD8C7]"
            />

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSpeak()}
                disabled={!practiceText}
                className="h-11 rounded-2xl border-teal-200 bg-gradient-to-r from-[#6EC6C8] to-[#5DAFB6] px-4 text-white shadow-[0_8px_18px_rgba(93,175,182,0.22)] hover:brightness-[1.03] disabled:opacity-60"
              >
                <Volume2 className="mr-2 h-4 w-4" />
                Play
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={stopSpeaking}
                disabled={!isSpeaking}
                className="h-11 rounded-2xl border-[#F2D8CA] bg-white px-4 text-slate-800 shadow-sm hover:bg-[#FFF8F4] disabled:opacity-60"
              >
                <Square className="mr-2 h-4 w-4" />
                Stop
              </Button>

              {!isListening ? (
                <Button
                  type="button"
                  onClick={startListening}
                  disabled={!supportsRecognition || !practiceText}
                  className={primaryButtonClass}
                >
                  <Mic className="mr-2 h-4 w-4" />
                  Speak
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={stopListening}
                  className="h-11 rounded-2xl px-4 shadow-[0_12px_24px_rgba(239,68,68,0.18)]"
                >
                  <Square className="mr-2 h-4 w-4" />
                  Stop
                </Button>
              )}

              {!isRecording ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={startRecording}
                  disabled={!supportsMediaRecording}
                  className="h-11 rounded-2xl border-[#BFE8EA] bg-[#F4FEFE] px-4 text-[#137E86] shadow-sm hover:bg-[#ECFCFD] disabled:opacity-60"
                >
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Record
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={stopRecording}
                  className={outlineButtonClass}
                >
                  <Square className="mr-2 h-4 w-4" />
                  Stop rec
                </Button>
              )}

              <div
                className={`flex h-11 items-center overflow-hidden rounded-2xl border px-2 shadow-sm transition ${
                  isRecording
                    ? 'border-emerald-300 bg-emerald-50/90 animate-pulse'
                    : recordedAudioUrl
                      ? 'border-emerald-200 bg-emerald-50/80'
                      : 'border-slate-200 bg-white/70'
                }`}
              >
                <PlayCircle
                  className={`mr-2 h-4 w-4 shrink-0 ${
                    isRecording || recordedAudioUrl ? 'text-emerald-600' : 'text-slate-400'
                  }`}
                />
                {recordedAudioUrl ? (
                  <audio className="h-8 w-[150px] md:w-[170px]" controls src={recordedAudioUrl}>
                    Your browser does not support audio playback.
                  </audio>
                ) : (
                  <div className="flex items-center">
                    <div className="h-2 w-[90px] rounded-full bg-white/90 md:w-[120px]">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isRecording
                            ? 'w-full animate-pulse bg-gradient-to-r from-emerald-400 to-teal-400'
                            : 'w-0 bg-transparent'
                        }`}
                      />
                    </div>
                  </div>
                )}
              </div>

              <Button
                type="button"
                onClick={preferTapAndRepeat ? () => handleSpeak() : startListening}
                disabled={
                  preferTapAndRepeat
                    ? !practiceText
                    : !supportsRecognition || !practiceText || isListening
                }
                className="h-11 rounded-2xl border-0 bg-gradient-to-r from-[#4FC5C7] to-[#38AEB6] px-4 text-white shadow-[0_10px_20px_rgba(56,174,182,0.24)] hover:brightness-[1.03] disabled:opacity-60"
              >
                {preferTapAndRepeat ? <Volume2 className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
                Try again
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleResetAttempt}
                className="h-11 rounded-2xl border-[#F2E7DE] bg-white px-4 text-slate-700 shadow-sm hover:bg-[#FFF8F4]"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleCopy}
                disabled={!practiceText}
                className="h-11 rounded-2xl border-[#F2E7DE] bg-white px-4 text-slate-700 shadow-sm hover:bg-[#FFF8F4] disabled:opacity-60"
              >
                <Copy className="mr-2 h-4 w-4 shrink-0" />
                <span className="flex flex-col items-start leading-none">
                  <span className="text-sm font-semibold">{copySuccess ? 'Copied' : 'Copy'}</span>
                  <span className="mt-1 text-[10px] font-medium text-slate-500">save for later</span>
                </span>
              </Button>

              <div className="ml-auto flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setVariant('custom')}
                  className={`rounded-2xl border px-3 py-2 text-sm font-semibold transition-all ${getVariantButtonClass(
                    variant === 'custom',
                  )}`}
                >
                  Custom
                </button>

                {correctedText ? (
                  <button
                    type="button"
                    onClick={() => {
                      setVariant('corrected');
                      setCustomText(correctedText);
                    }}
                    className={`rounded-2xl border px-3 py-2 text-sm font-semibold transition-all ${getVariantButtonClass(
                      variant === 'corrected',
                    )}`}
                  >
                    Corrected
                  </button>
                ) : null}

                {enhancedText ? (
                  <button
                    type="button"
                    onClick={() => {
                      setVariant('enhanced');
                      setCustomText(enhancedText);
                    }}
                    className={`rounded-2xl border px-3 py-2 text-sm font-semibold transition-all ${getVariantButtonClass(
                      variant === 'enhanced',
                    )}`}
                  >
                    Enhanced
                  </button>
                ) : null}

                {sourceText ? (
                  <button
                    type="button"
                    onClick={() => {
                      setVariant('source');
                      setCustomText(sourceText);
                    }}
                    className={`rounded-2xl border px-3 py-2 text-sm font-semibold transition-all ${getVariantButtonClass(
                      variant === 'source',
                    )}`}
                  >
                    Original
                  </button>
                ) : null}

                <button
                  type="button"
                  onClick={handleClearPracticeLine}
                  className="rounded-2xl border border-slate-200 bg-white/92 px-3 py-2 text-sm font-semibold text-slate-600 transition-all hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                >
                  <span className="inline-flex items-center gap-2">
                    <Eraser className="h-4 w-4" />
                    Clear
                  </span>
                </button>

                {shouldShowLogicButton ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onOpenEnglishLogic}
                    className="h-11 rounded-2xl border-violet-200 bg-white text-violet-700 shadow-sm hover:bg-violet-50"
                  >
                    <BookOpenText className="mr-2 h-4 w-4" />
                    Understand why
                  </Button>
                ) : null}
              </div>
            </div>

            {!supportsRecognition ? (
              <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                <div className="flex items-start gap-2">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>
                    This browser does not expose speech recognition here. Audio playback still works.
                  </p>
                </div>
              </div>
            ) : null}

            {!supportsMediaRecording ? (
              <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                <div className="flex items-start gap-2">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>This browser does not support in-page voice recording here.</p>
                </div>
              </div>
            ) : null}

            {recognitionError ? (
              <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                <div className="flex items-start gap-2">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>{recognitionError}</p>
                </div>
              </div>
            ) : null}

            {recordingError ? (
              <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                <div className="flex items-start gap-2">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>{recordingError}</p>
                </div>
              </div>
            ) : null}
          </div>

          <div className="grid gap-3 md:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[22px] border border-white/80 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {transcriptLabel}
              </p>
              <p className="mt-2 min-h-[72px] text-sm leading-6 text-slate-700">
                {transcript || 'Your transcript will appear here after you speak.'}
              </p>
            </div>

            <div
              className={`rounded-[22px] border p-4 shadow-sm ${
                transcript
                  ? matchTone.ring
                  : 'border-[#F1E5DB] bg-gradient-to-br from-[#FFF9F3] to-white'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-[44px] font-semibold leading-none text-slate-900">
                  {transcript ? `${matchScore}%` : '--'}
                </p>

                {transcript ? (
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${matchTone.text}`}
                  >
                    {confidenceLabel}
                  </span>
                ) : null}
              </div>

              <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/90">
                <div
                  className={`h-full rounded-full bg-gradient-to-r transition-all duration-500 ${matchTone.bar}`}
                  style={{ width: `${transcript ? matchScore : 0}%` }}
                />
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-600">{coachMessage}</p>
            </div>
          </div>

          {showAdultFeedbackCard ? (
            <div className="rounded-[22px] border border-white/80 bg-white p-4 shadow-sm">
              {feedbackNotes.length > 0 ? (
                <div className="space-y-1.5">
                  {feedbackNotes.map((note) => (
                    <p key={note} className="text-sm leading-6 text-slate-700">
                      {note}
                    </p>
                  ))}
                </div>
              ) : null}

              {displayedTroubleWords.length > 0 ? (
                <div className={feedbackNotes.length > 0 ? 'mt-3' : ''}>
                  <div className="flex items-center gap-2">
                    <Wand2 className="h-4 w-4 text-[#E76F51]" />
                    <p className="text-sm font-semibold text-slate-900">{troubleLabel}</p>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {displayedTroubleWords.map((word) => (
                      <span
                        key={word}
                        className="rounded-full border border-[#F2DDD0] bg-gradient-to-r from-[#FFF5EF] to-white px-3 py-1 text-xs font-medium text-[#875E4B] shadow-sm"
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              <p className={`${feedbackNotes.length > 0 || displayedTroubleWords.length > 0 ? 'mt-3' : ''} text-sm leading-6 text-slate-600`}>
                {nextStepMessage}
              </p>
            </div>
          ) : null}

          {shouldShowAdultWhyCard ? (
            <div className="rounded-[22px] border border-white/80 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <BookOpenText className="h-4 w-4 text-violet-600" />
                <p className="text-sm font-semibold text-slate-900">Original → better</p>
              </div>

              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div className="rounded-[20px] border border-[#F1E5DB] bg-gradient-to-br from-[#FFF9F3] to-white p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Original
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{sourceText}</p>
                </div>

                <div className="rounded-[20px] border border-[#F1E5DB] bg-gradient-to-br from-[#FFF9F3] to-white p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Better
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {enhancedText || correctedText}
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default MercySpeakTab;