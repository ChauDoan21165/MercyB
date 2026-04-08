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

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
        <div className="space-y-4">
          <div className="rounded-3xl border border-white/80 bg-white/92 p-5 shadow-[0_10px_28px_rgba(148,163,184,0.06)]">
            <div className="flex items-center gap-2">
              <Radio className="h-4 w-4 text-blue-600" />
              <p className="text-sm font-semibold text-slate-900">Practice the same sentence aloud</p>
            </div>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Say the sentence slowly first. Match the wording and rhythm before trying to speak faster.
            </p>

            <div className="mt-4 rounded-2xl border border-sky-100 bg-gradient-to-r from-sky-50/80 to-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Best line to practice
              </p>
              <p className="mt-2 text-base leading-7 text-slate-800">
                {enhancedText || correctedText || sourceText || defaultPracticeText}
              </p>
            </div>

            <div className="mt-4 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50/70 to-white p-4">
              <div className="flex items-start gap-2">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
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

              <div className="rounded-full border bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                {profile?.english_level || 'intermediate'}
              </div>
            </div>

            <textarea
              value={customText}
              onChange={(e) => {
                setCustomText(e.target.value);
                setVariant('custom');
              }}
              placeholder="Type the sentence you want to practice speaking..."
              className="mt-4 min-h-[120px] w-full resize-y rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-base leading-7 outline-none"
            />

            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                type="button"
                variant={variant === 'custom' ? 'default' : 'outline'}
                onClick={() => setVariant('custom')}
              >
                Custom
              </Button>

              {correctedText ? (
                <Button
                  type="button"
                  variant={variant === 'corrected' ? 'default' : 'outline'}
                  onClick={() => {
                    setVariant('corrected');
                    setCustomText(correctedText);
                  }}
                >
                  Corrected
                </Button>
              ) : null}

              {enhancedText ? (
                <Button
                  type="button"
                  variant={variant === 'enhanced' ? 'default' : 'outline'}
                  onClick={() => {
                    setVariant('enhanced');
                    setCustomText(enhancedText);
                  }}
                >
                  Enhanced
                </Button>
              ) : null}

              {sourceText ? (
                <Button
                  type="button"
                  variant={variant === 'source' ? 'default' : 'outline'}
                  onClick={() => {
                    setVariant('source');
                    setCustomText(sourceText);
                  }}
                >
                  Original
                </Button>
              ) : null}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={handleSpeak} disabled={!practiceText}>
                <Volume2 className="mr-2 h-4 w-4" />
                {isSpeaking ? 'Replay Mercy audio' : 'Play Mercy audio'}
              </Button>

              <Button type="button" variant="outline" onClick={stopSpeaking} disabled={!isSpeaking}>
                <Square className="mr-2 h-4 w-4" />
                Stop audio
              </Button>

              <Button type="button" variant="outline" onClick={handleCopy} disabled={!practiceText}>
                <Copy className="mr-2 h-4 w-4" />
                {copySuccess ? 'Copied' : 'Copy text'}
              </Button>
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
                  >
                    <Mic className="mr-2 h-4 w-4" />
                    Start speaking
                  </Button>
                ) : (
                  <Button type="button" variant="destructive" onClick={stopListening}>
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
                  >
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Record your voice
                  </Button>
                ) : (
                  <Button type="button" variant="outline" onClick={stopRecording}>
                    <Square className="mr-2 h-4 w-4" />
                    Stop recording
                  </Button>
                )}

                <Button type="button" variant="outline" onClick={handleResetAttempt}>
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
              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  You said
                </p>
                <p className="mt-2 min-h-[72px] text-sm leading-6 text-slate-700">
                  {transcript || 'Your transcript will appear here after you speak.'}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Match score
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {transcript ? `${matchScore}%` : '--'}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{coachMessage}</p>
              </div>
            </div>

            {feedbackNotes.length > 0 ? (
              <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
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
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="flex items-center gap-2">
                  <PlayCircle className="h-4 w-4 text-emerald-600" />
                  <p className="text-sm font-semibold text-slate-900">Your latest recording</p>
                </div>

                <audio className="mt-3 w-full" controls src={recordedAudioUrl}>
                  Your browser does not support audio playback.
                </audio>
              </div>
            ) : null}

            <div className="mt-4 rounded-2xl border border-violet-100 bg-gradient-to-r from-violet-50/70 to-white p-4">
              <div className="flex items-start gap-2">
                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
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
                >
                  <Mic className="mr-2 h-4 w-4" />
                  Try again slowly
                </Button>

                {onOpenEnglishLogic ? (
                  <Button type="button" variant="outline" onClick={onOpenEnglishLogic}>
                    <BookOpenText className="mr-2 h-4 w-4" />
                    Understand why it changed
                  </Button>
                ) : null}
              </div>
            </div>
          </div>

          {troubleWordList.length > 0 || generatedTroubleWords.length > 0 ? (
            <div className="rounded-2xl border border-white/80 bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">Watch these trouble words</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {[...new Set([...troubleWordList, ...generatedTroubleWords])].map((word) => (
                  <span
                    key={word}
                    className="rounded-full border bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {sourceText && correctedText && sourceText !== correctedText ? (
            <div className="rounded-2xl border border-white/80 bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">Why this sentence matters</p>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Original
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{sourceText}</p>
                </div>

                <div className="rounded-2xl border border-slate-200 p-3">
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