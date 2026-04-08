/**
 * Path: src/components/mercy-guide/MercySpeakTab.tsx
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Copy,
  Mic,
  RotateCcw,
  Square,
  Volume2,
  PlayCircle,
  Radio,
  Sparkles,
  BookOpenText,
  Wand2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { StudentMercyMemoryUpdate } from './types';
import type {
  SpeechRecognitionLike,
  SpeechRecognitionErrorEventLike,
  SpeechRecognitionAlternativeLike,
  SpeechRecognitionResultLike,
} from '@/types/speech-recognition';

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
};

type PracticeVariant = 'custom' | 'corrected' | 'enhanced' | 'source';

type BrowserWindowWithSpeechRecognition = Window & {
  webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  SpeechRecognition?: new () => SpeechRecognitionLike;
};

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

function getFallbackPracticeText(contentEn?: string): string {
  const cleaned = cleanText(
    contentEn?.split('\n').find((line) => cleanText(line).length > 20) ?? '',
  );

  if (cleaned) {
    return cleaned;
  }

  return 'Yesterday, I bought a hat because I will be attending a big party next.';
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

function buildWordFeedback(target: string, spoken: string): string[] {
  const targetWords = normalizeForCompare(target).split(' ').filter(Boolean);
  const spokenWords = normalizeForCompare(spoken).split(' ').filter(Boolean);

  if (!targetWords.length || !spokenWords.length) return [];

  const missing = targetWords.filter((word) => !spokenWords.includes(word));
  const extras = spokenWords.filter((word) => !targetWords.includes(word));

  const notes: string[] = [];

  if (missing.length > 0) {
    notes.push(`Try saying these more clearly: ${missing.slice(0, 5).join(', ')}`);
  }

  if (extras.length > 0) {
    notes.push(`Your speech added extra words: ${extras.slice(0, 5).join(', ')}`);
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

function getCoachMessage(score: number, hasTranscript: boolean): string {
  if (!hasTranscript) {
    return 'Listen first, then say the sentence slowly and clearly.';
  }

  if (score >= 85) {
    return 'Very good. You are close to the natural sentence.';
  }

  if (score >= 60) {
    return 'Good progress. Slow down and match Mercy’s wording more closely.';
  }

  return 'Start slower. Focus on matching the exact words before trying to sound fast.';
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

export function MercySpeakTab({
  contentEn,
  profile,
  troubleWords,
  speakPractice,
  launchPayload,
  pendingPayload,
  pendingPronunciationPayload,
  onMemoryUpdate,
  onOpenEnglishLogic,
}: MercySpeakTabProps) {
  const payload =
    pendingPronunciationPayload ?? pendingPayload ?? launchPayload ?? null;

  const sourceText = cleanText(payload?.sourceText);
  const correctedText = cleanText(payload?.correctedText);
  const enhancedText = cleanText(payload?.enhancedText);

  const defaultPracticeText = useMemo(() => {
    if (enhancedText) return enhancedText;
    if (correctedText) return correctedText;
    if (sourceText) return sourceText;
    return getFallbackPracticeText(contentEn);
  }, [contentEn, correctedText, enhancedText, sourceText]);

  const [variant, setVariant] = useState<PracticeVariant>(
    enhancedText ? 'enhanced' : correctedText ? 'corrected' : sourceText ? 'source' : 'custom',
  );
  const [customText, setCustomText] = useState(defaultPracticeText);
  const [copySuccess, setCopySuccess] = useState(false);

  const [transcript, setTranscript] = useState('');
  const [recognitionError, setRecognitionError] = useState('');
  const [isListening, setIsListening] = useState(false);

  const [recordingError, setRecordingError] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState('');

  const [isSpeaking, setIsSpeaking] = useState(false);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaChunksRef = useRef<BlobPart[]>([]);
  const activeStreamRef = useRef<MediaStream | null>(null);

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
    setVariant(
      enhancedText ? 'enhanced' : correctedText ? 'corrected' : sourceText ? 'source' : 'custom',
    );
  }, [correctedText, defaultPracticeText, enhancedText, sourceText]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }

      if (recordedAudioUrl) {
        URL.revokeObjectURL(recordedAudioUrl);
      }

      if (activeStreamRef.current) {
        activeStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [recordedAudioUrl]);

  useEffect(() => {
    if (!copySuccess) return;

    const timer = window.setTimeout(() => {
      setCopySuccess(false);
    }, 1600);

    return () => window.clearTimeout(timer);
  }, [copySuccess]);

  const practiceText = useMemo(() => {
    const base = cleanText(customText);

    if (variant === 'enhanced' && enhancedText) return enhancedText;
    if (variant === 'corrected' && correctedText) return correctedText;
    if (variant === 'source' && sourceText) return sourceText;
    return base;
  }, [customText, correctedText, enhancedText, sourceText, variant]);

  const troubleWordList = useMemo(
    () => extractTroubleWords(troubleWords),
    [troubleWords],
  );

  const matchScore = useMemo(
    () => calculateMatchScore(practiceText, transcript),
    [practiceText, transcript],
  );

  const generatedTroubleWords = useMemo(
    () => detectTroubleWords(transcript, practiceText),
    [practiceText, transcript],
  );

  const feedbackNotes = useMemo(() => {
    if (!practiceText || !transcript) return [];

    const notes = buildWordFeedback(practiceText, transcript);
    const stressHint = buildStressHint(practiceText);

    if (stressHint) {
      notes.push(`Focus on stress: ${stressHint}`);
    }

    return notes;
  }, [practiceText, transcript]);

  const coachMessage = useMemo(
    () => getCoachMessage(matchScore, Boolean(transcript)),
    [matchScore, transcript],
  );

  const nextStepMessage = useMemo(() => {
    if (!transcript) {
      return 'After you say the sentence, Mercy will help you understand why this English structure sounds more natural.';
    }

    if (matchScore >= 80) {
      return 'Good. Your mouth is learning the sentence. Now open Logic and see why natural English changed the structure.';
    }

    if (matchScore >= 60) {
      return 'You are close. Try once more slowly, then open Logic to understand the English pattern behind the sentence.';
    }

    return 'Try again slowly, then open Logic to see the English thinking pattern more clearly.';
  }, [matchScore, transcript]);

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

  function handleSpeak() {
    if (!practiceText || !supportsSpeechSynthesis) return;

    if (typeof window !== 'undefined' && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(practiceText);
    utterance.lang = 'en-US';
    utterance.rate = 0.92;
    utterance.pitch = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }

  function stopSpeaking() {
    if (!supportsSpeechSynthesis) return;
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
    recognitionRef.current?.stop();
  }

  function startListening() {
    if (!supportsRecognition || !practiceText || isListening || !speechWindow) return;

    setRecognitionError('');
    setTranscript('');

    const RecognitionCtor =
      speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;

    if (!RecognitionCtor) return;

    const recognition = new RecognitionCtor();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEventLike) => {
      setRecognitionError(event?.error || 'Speech recognition failed.');
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
    recognition.start();
  }

  async function startRecording() {
    if (!supportsMediaRecording || isRecording) return;

    setRecordingError('');

    try {
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
      };

      recorder.onstop = () => {
        setIsRecording(false);

        const blob = new Blob(mediaChunksRef.current, { type: 'audio/webm' });
        const nextUrl = URL.createObjectURL(blob);

        if (recordedAudioUrl) {
          URL.revokeObjectURL(recordedAudioUrl);
        }

        setRecordedAudioUrl(nextUrl);

        if (activeStreamRef.current) {
          activeStreamRef.current.getTracks().forEach((track) => track.stop());
          activeStreamRef.current = null;
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch {
      setRecordingError('Microphone access was blocked or unavailable.');
      setIsRecording(false);
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
  }

  function handleResetAttempt() {
    setTranscript('');
    setRecognitionError('');
    setRecordingError('');

    if (recordedAudioUrl) {
      URL.revokeObjectURL(recordedAudioUrl);
      setRecordedAudioUrl('');
    }
  }

  const levelLabel = profile?.english_level || 'intermediate';
  const matchTone = getMetricTone(matchScore);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-gradient-to-br from-[#FFF8F3] via-[#FFFDFC] to-[#F7FAFF]">
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 md:px-5 md:py-5">
        <div className="space-y-4">
          <div className="rounded-3xl border border-white/80 bg-white/92 p-5 shadow-[0_10px_28px_rgba(148,163,184,0.06)]">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-[#EEF4FF] p-1.5">
                <Radio className="h-4 w-4 text-[#2563EB]" />
              </div>
              <p className="text-sm font-semibold text-slate-900">Practice the same sentence aloud</p>
            </div>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Say the sentence slowly first. Match the wording and rhythm before trying to speak faster.
            </p>

            <div className="mt-4 rounded-[22px] border border-[#F4E6D9] bg-gradient-to-r from-[#FFF9F1] via-white to-[#FFF7F2] p-4 shadow-[0_10px_28px_rgba(255,138,101,0.08)]">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Best line to practice
              </p>
              <p className="mt-2 text-base leading-7 text-slate-800">
                {enhancedText || correctedText || sourceText || defaultPracticeText}
              </p>
            </div>

            <div className="mt-4 rounded-[22px] border border-emerald-100 bg-gradient-to-r from-emerald-50/80 via-white to-teal-50/60 p-4 shadow-[0_8px_24px_rgba(16,185,129,0.08)]">
              <div className="flex items-start gap-2.5">
                <div className="rounded-full bg-white/90 p-1.5 shadow-sm">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Mercy’s speaking goal</p>
                  <p className="mt-1 text-sm leading-6 text-slate-700">
                    Do not rush. First let your mouth learn the natural sentence. Then you can open Logic and understand why it sounds better.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/80 bg-white/92 p-5 shadow-[0_10px_28px_rgba(148,163,184,0.06)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">Practice line</p>
                <p className="text-xs text-slate-500">
                  Mercy loads the improved sentence automatically, but you can switch or edit it.
                </p>
              </div>

              <div className="rounded-full border border-[#EBD7CA] bg-gradient-to-r from-[#FFF6F0] to-[#FFFDFC] px-3 py-1 text-xs font-semibold capitalize text-[#9A6A57] shadow-sm">
                {levelLabel}
              </div>
            </div>

            <textarea
              value={customText}
              onChange={(e) => {
                setCustomText(e.target.value);
                setVariant('custom');
              }}
              placeholder="Type the sentence you want to practice speaking..."
              className="mt-4 min-h-[120px] w-full resize-y rounded-[22px] border border-[#F0E2D7] bg-gradient-to-br from-[#FFF9F2] to-white p-4 text-base leading-7 text-slate-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_8px_20px_rgba(255,138,101,0.05)] outline-none transition focus:border-[#F7B79E] focus:ring-2 focus:ring-[#FFD8C7]"
            />

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setVariant('custom')}
                className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition-all ${getVariantButtonClass(
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
                  className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition-all ${getVariantButtonClass(
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
                  className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition-all ${getVariantButtonClass(
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
                  className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition-all ${getVariantButtonClass(
                    variant === 'source',
                  )}`}
                >
                  Original
                </button>
              ) : null}
            </div>

            <div className="mt-4">
              <div className="rounded-[24px] border border-[#F0E2D7] bg-gradient-to-r from-[#FFF8F3] via-white to-[#FFFDFC] p-2 shadow-[0_10px_26px_rgba(255,138,101,0.06)]">
                <div className="grid gap-2 md:grid-cols-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSpeak}
                    disabled={!practiceText}
                    className="h-14 justify-start rounded-[18px] border-teal-200 bg-gradient-to-r from-[#6EC6C8] to-[#5DAFB6] px-4 text-left text-white shadow-[0_10px_20px_rgba(93,175,182,0.26)] hover:brightness-[1.03] disabled:opacity-60"
                  >
                    <span className="mr-3 rounded-full bg-white/15 p-2 shadow-[0_0_0_4px_rgba(255,255,255,0.08)]">
                      <Volume2 className="h-4 w-4" />
                    </span>
                    <span className="flex flex-col items-start">
                      <span className="text-sm font-semibold">
                        {isSpeaking ? 'Replay Mercy audio' : 'Play Mercy audio'}
                      </span>
                      <span className="text-[11px] font-medium text-white/85">
                        Hear the warm Mercy model first
                      </span>
                    </span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={stopSpeaking}
                    disabled={!isSpeaking}
                    className="h-14 justify-start rounded-[18px] border-[#F2D8CA] bg-white px-4 text-left text-slate-800 shadow-sm hover:bg-[#FFF8F4] disabled:opacity-60"
                  >
                    <span className="mr-3 rounded-full bg-[#FFE8DE] p-2">
                      <Square className="h-4 w-4 text-[#E76F51]" />
                    </span>
                    <span className="flex flex-col items-start">
                      <span className="text-sm font-semibold">Stop audio</span>
                      <span className="text-[11px] font-medium text-slate-500">
                        Pause Mercy playback
                      </span>
                    </span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCopy}
                    disabled={!practiceText}
                    className="h-14 justify-start rounded-[18px] border-[#F2E7DE] bg-white px-4 text-left text-slate-700 shadow-sm hover:bg-[#FFF8F4] disabled:opacity-60"
                  >
                    <span className="mr-3 rounded-full bg-[#F8F1EB] p-2">
                      <Copy className="h-4 w-4 text-slate-600" />
                    </span>
                    <span className="flex flex-col items-start">
                      <span className="text-sm font-semibold">{copySuccess ? 'Copied' : 'Copy text'}</span>
                      <span className="text-[11px] font-medium text-slate-500">
                        Save the line to practice later
                      </span>
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/80 bg-white/92 p-5 shadow-[0_10px_28px_rgba(148,163,184,0.06)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">Speak and compare</p>
                <p className="text-xs text-slate-500">
                  Press the microphone, read the practice line aloud, then compare your spoken words.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {!isListening ? (
                  <Button
                    type="button"
                    onClick={startListening}
                    disabled={!supportsRecognition || !practiceText}
                    className="h-12 rounded-2xl border-0 bg-gradient-to-r from-[#4FC5C7] to-[#38AEB6] px-4 text-white shadow-[0_12px_24px_rgba(56,174,182,0.28)] hover:brightness-[1.03] disabled:opacity-60"
                  >
                    <span className="mr-2 rounded-full bg-white/15 p-1.5 shadow-[0_0_0_4px_rgba(255,255,255,0.08)]">
                      <Mic className="h-4 w-4" />
                    </span>
                    Start speaking
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={stopListening}
                    className="h-12 rounded-2xl px-4 shadow-[0_12px_24px_rgba(239,68,68,0.18)]"
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
                    className="h-12 rounded-2xl border-[#BFE8EA] bg-[#F4FEFE] px-4 text-[#137E86] shadow-sm hover:bg-[#ECFCFD] disabled:opacity-60"
                  >
                    <span className="mr-2 rounded-full bg-[#D8F7F8] p-1.5 shadow-sm">
                      <PlayCircle className="h-4 w-4" />
                    </span>
                    Record your voice
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={stopRecording}
                    className="h-12 rounded-2xl border-[#F2D8CA] bg-white px-4 text-slate-800 shadow-sm hover:bg-[#FFF8F4]"
                  >
                    <Square className="mr-2 h-4 w-4" />
                    Stop recording
                  </Button>
                )}

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResetAttempt}
                  className="h-12 rounded-2xl border-[#F2E7DE] bg-white px-4 text-slate-700 shadow-sm hover:bg-[#FFF8F4]"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
            </div>

            {!supportsRecognition ? (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                <div className="flex items-start gap-2">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>
                    This browser does not expose speech recognition here. Audio playback still works, and you can practice by repeating after Mercy.
                  </p>
                </div>
              </div>
            ) : null}

            {!supportsMediaRecording ? (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                <div className="flex items-start gap-2">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>This browser does not support in-page voice recording here.</p>
                </div>
              </div>
            ) : null}

            {recognitionError ? (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                <div className="flex items-start gap-2">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>{recognitionError}</p>
                </div>
              </div>
            ) : null}

            {recordingError ? (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                <div className="flex items-start gap-2">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>{recordingError}</p>
                </div>
              </div>
            ) : null}

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-[22px] border border-[#F1E5DB] bg-gradient-to-br from-[#FFF9F3] to-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  You said
                </p>
                <p className="mt-2 min-h-[72px] text-sm leading-6 text-slate-700">
                  {transcript || 'Your transcript will appear here after you speak.'}
                </p>
              </div>

              <div className={`rounded-[22px] border p-4 shadow-sm ${transcript ? matchTone.ring : 'border-[#F1E5DB] bg-gradient-to-br from-[#FFF9F3] to-white'}`}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Match score
                  </p>

                  {transcript ? (
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${matchTone.text} ${matchTone.ring}`}>
                      {getConfidenceLevel(matchScore)}
                    </span>
                  ) : null}
                </div>

                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {transcript ? `${matchScore}%` : '--'}
                </p>

                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/90">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r transition-all duration-500 ${matchTone.bar}`}
                    style={{ width: `${transcript ? matchScore : 0}%` }}
                  />
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-600">{coachMessage}</p>
              </div>
            </div>

            {feedbackNotes.length > 0 ? (
              <div className="mt-4 rounded-[22px] border border-emerald-100 bg-gradient-to-r from-emerald-50/75 via-white to-teal-50/60 p-4 shadow-[0_8px_22px_rgba(16,185,129,0.08)]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <p className="text-sm font-semibold text-slate-900">Mercy feedback</p>
                </div>

                <div className="mt-3 space-y-2">
                  {feedbackNotes.map((note) => (
                    <p key={note} className="text-sm leading-6 text-slate-700">
                      {note}
                    </p>
                  ))}
                </div>
              </div>
            ) : null}

            {recordedAudioUrl ? (
              <div className="mt-4 rounded-[22px] border border-[#F1E5DB] bg-gradient-to-br from-[#FFF9F3] to-white p-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <PlayCircle className="h-4 w-4 text-emerald-600" />
                  <p className="text-sm font-semibold text-slate-900">Your latest recording</p>
                </div>

                <audio className="mt-3 w-full" controls src={recordedAudioUrl}>
                  Your browser does not support audio playback.
                </audio>
              </div>
            ) : null}

            <div className="mt-4 rounded-[22px] border border-violet-100 bg-gradient-to-r from-violet-50/75 via-white to-rose-50/50 p-4 shadow-[0_10px_24px_rgba(168,85,247,0.08)]">
              <div className="flex items-start gap-2.5">
                <div className="rounded-full bg-white/90 p-1.5 shadow-sm">
                  <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Mercy’s next step</p>
                  <p className="mt-1 text-sm leading-6 text-slate-700">{nextStepMessage}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  type="button"
                  onClick={startListening}
                  disabled={!supportsRecognition || !practiceText || isListening}
                  className="h-11 rounded-2xl border-0 bg-gradient-to-r from-[#4FC5C7] to-[#38AEB6] px-4 text-white shadow-[0_10px_20px_rgba(56,174,182,0.24)] hover:brightness-[1.03] disabled:opacity-60"
                >
                  <span className="mr-2 rounded-full bg-white/15 p-1.5 shadow-[0_0_0_4px_rgba(255,255,255,0.08)]">
                    <Mic className="h-4 w-4" />
                  </span>
                  Try again slowly
                </Button>

                {onOpenEnglishLogic ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onOpenEnglishLogic}
                    className="h-11 rounded-2xl border-violet-200 bg-white text-violet-700 shadow-sm hover:bg-violet-50"
                  >
                    <BookOpenText className="mr-2 h-4 w-4" />
                    Understand why it changed
                  </Button>
                ) : null}
              </div>
            </div>
          </div>

          {troubleWordList.length > 0 || generatedTroubleWords.length > 0 ? (
            <div className="rounded-[22px] border border-white/80 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <Wand2 className="h-4 w-4 text-[#E76F51]" />
                <p className="text-sm font-semibold text-slate-900">Watch these trouble words</p>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {[...new Set([...troubleWordList, ...generatedTroubleWords])].map((word) => (
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

          {sourceText && correctedText && sourceText !== correctedText ? (
            <div className="rounded-[22px] border border-white/80 bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">Why this sentence matters</p>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div className="rounded-[20px] border border-[#F1E5DB] bg-gradient-to-br from-[#FFF9F3] to-white p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Original
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{sourceText}</p>
                </div>

                <div className="rounded-[20px] border border-[#F1E5DB] bg-gradient-to-br from-[#FFF9F3] to-white p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Better model
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