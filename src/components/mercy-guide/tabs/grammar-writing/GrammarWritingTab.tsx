/**
 * File: GrammarWritingTab.tsx
 * Path: src/components/mercy-guide/tabs/grammar-writing/GrammarWritingTab.tsx
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  BookOpenText,
  Check,
  Copy,
  Mic,
  Sparkles,
  Target,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

import type {
  GrammarApiResponse,
  GrammarWritingTeacherState,
  PronunciationLaunchPayload,
  TeacherWritingTask,
} from './types';
import type { MercyLogicPatternMemory, StudentMercyMemoryUpdate } from '../../types';
import {
  buildTeacherInstructionText,
  getTeacherEmphasis,
  shouldAutoApplyTeacherPrefill,
} from './teacher';
import { hasMeaningfulDifference } from './utils';
import { analyzeGrammarWithApi } from './api';

type GrammarWritingTabProps = {
  roomId?: string;
  roomTitle?: string;
  contentEn?: string;
  englishLevel?: string | null;
  teacherTask?: TeacherWritingTask;
  onAnalysisResult?: (result: GrammarApiResponse | null) => void;
  onPracticePronunciation?: (payload: PronunciationLaunchPayload) => void;
  onOpenEnglishLogic?: () => void;
  onTeacherWritingStateChange?: (state: GrammarWritingTeacherState) => void;
  onMemoryUpdate?: (patch: StudentMercyMemoryUpdate) => void;
};

const EMPTY_TEACHER_WRITING_STATE: GrammarWritingTeacherState = {
  latestAnalysisResult: null,
  currentWritingMode: undefined,
  isTeacherInitiated: false,
  isRevisionAttempt: false,
  latestSubmittedText: '',
  teacherTask: undefined,
  revisionSourceText: undefined,
};

function cleanText(value?: string | null): string {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

function buildLogicPatternMemory(
  label: string,
  count = 1,
): MercyLogicPatternMemory {
  const normalized = cleanText(label);
  const now = new Date().toISOString();

  return {
    key: normalized.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'),
    label: normalized,
    count,
    lastSeenAt: now,
  };
}

function detectWritingPatterns(params: {
  sourceText: string;
  correctedText: string;
  enhancedText: string;
  explanation?: string;
}): string[] {
  const source = params.sourceText.toLowerCase();
  const corrected = params.correctedText.toLowerCase();
  const enhanced = params.enhancedText.toLowerCase();
  const explanation = cleanText(params.explanation).toLowerCase();

  const patterns: string[] = [];

  if (
    source.includes('yesterday') ||
    source.includes('last ') ||
    source.includes('ago') ||
    explanation.includes('past tense') ||
    explanation.includes('tense')
  ) {
    patterns.push('past tense with time words');
  }

  if (
    source.includes('because') ||
    source.includes('since') ||
    source.includes('so') ||
    explanation.includes('connector')
  ) {
    patterns.push('reason connector clarity');
  }

  if (source && corrected && source !== corrected) {
    patterns.push('sentence structure refinement');
  }

  if (enhanced && corrected && enhanced !== corrected) {
    patterns.push('natural English phrasing');
  }

  return Array.from(new Set(patterns)).slice(0, 4);
}

function detectRecurringTopics(text: string): string[] {
  const lower = cleanText(text).toLowerCase();
  const topics: string[] = [];

  if (!lower) return topics;

  if (
    lower.includes('today') ||
    lower.includes('yesterday') ||
    lower.includes('morning') ||
    lower.includes('night') ||
    lower.includes('happened')
  ) {
    topics.push('daily events');
  }

  if (
    lower.includes('feel') ||
    lower.includes('felt') ||
    lower.includes('mood') ||
    lower.includes('sad') ||
    lower.includes('happy') ||
    lower.includes('worried') ||
    lower.includes('tired')
  ) {
    topics.push('mood and feelings');
  }

  if (
    lower.includes('think') ||
    lower.includes('thought') ||
    lower.includes('realize') ||
    lower.includes('learned') ||
    lower.includes('understand')
  ) {
    topics.push('reflection and thoughts');
  }

  return topics.slice(0, 3);
}

function detectWritingMode(text: string, fallback?: string): string[] {
  const explicit = cleanText(fallback);
  if (explicit) return [explicit];

  const wordCount = cleanText(text).split(/\s+/).filter(Boolean).length;

  if (wordCount <= 12) return ['sentence'];
  if (wordCount <= 60) return ['paragraph'];
  return ['essay'];
}

function detectLogicMemoryPatterns(params: {
  sourceText: string;
  correctedText: string;
  enhancedText: string;
  explanation?: string;
}): MercyLogicPatternMemory[] {
  const source = params.sourceText.toLowerCase();
  const corrected = params.correctedText.toLowerCase();
  const enhanced = params.enhancedText.toLowerCase();
  const explanation = cleanText(params.explanation).toLowerCase();

  const patterns: MercyLogicPatternMemory[] = [];

  if (
    source.includes('yesterday') ||
    corrected.includes('yesterday') ||
    explanation.includes('past tense')
  ) {
    patterns.push(buildLogicPatternMemory('time words must match the verb'));
  }

  if (
    source.includes('because') ||
    source.includes('since') ||
    source.includes('so') ||
    explanation.includes('connector')
  ) {
    patterns.push(buildLogicPatternMemory('reason connectors need one clear path'));
  }

  if (source && enhanced && source !== enhanced) {
    patterns.push(buildLogicPatternMemory('English prefers a straighter sentence line'));
  }

  return patterns.slice(0, 3);
}

async function copyText(value: string): Promise<boolean> {
  const text = cleanText(value);
  if (!text || typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function GrammarWritingTab({
  roomId,
  roomTitle,
  contentEn,
  englishLevel,
  teacherTask,
  onAnalysisResult,
  onPracticePronunciation,
  onOpenEnglishLogic,
  onTeacherWritingStateChange,
  onMemoryUpdate,
}: GrammarWritingTabProps) {
  const [draft, setDraft] = useState('');
  const [result, setResult] = useState<GrammarApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [latestSubmittedText, setLatestSubmittedText] = useState('');
  const [teacherAssignedBaseText, setTeacherAssignedBaseText] = useState('');
  const [hasUserEditedDraftSinceTeacherHydration, setHasUserEditedDraftSinceTeacherHydration] =
    useState(false);
  const [previousTeacherTriggerToken, setPreviousTeacherTriggerToken] = useState<
    string | undefined
  >(undefined);
  const [isRevisionAttempt, setIsRevisionAttempt] = useState(false);
  const [copiedState, setCopiedState] = useState<'corrected' | 'enhanced' | null>(null);

  const lastEmittedStateRef = useRef<string | null>(null);

  const isTeacherInitiated = Boolean(teacherTask);

  const teacherInstructionText = useMemo(
    () => buildTeacherInstructionText(teacherTask),
    [teacherTask],
  );

  const normalizedTeacherTask = useMemo(
    () =>
      (teacherTask as
        | (TeacherWritingTask & {
            emphasis?: string;
            type?: string;
            taskType?: string;
          })
        | undefined),
    [teacherTask],
  );

  const derivedWritingMode = useMemo(() => {
    if (result?.writingMode) return result.writingMode;

    const wordCount = draft.trim() ? draft.trim().split(/\s+/).length : 0;
    if (wordCount <= 12) return 'sentence';
    if (wordCount <= 60) return 'paragraph';
    return 'essay';
  }, [result?.writingMode, draft]);

  const emitTeacherWritingState = useCallback(
    (
      nextResult: GrammarApiResponse | null,
      overrides?: Partial<GrammarWritingTeacherState>,
    ) => {
      if (!onTeacherWritingStateChange) return;

      const state: GrammarWritingTeacherState = {
        latestAnalysisResult: nextResult ?? null,
        currentWritingMode:
          overrides?.currentWritingMode ?? nextResult?.writingMode ?? derivedWritingMode,
        isTeacherInitiated: overrides?.isTeacherInitiated ?? isTeacherInitiated,
        isRevisionAttempt: overrides?.isRevisionAttempt ?? isRevisionAttempt,
        latestSubmittedText: overrides?.latestSubmittedText ?? latestSubmittedText,
        teacherTask:
          overrides?.teacherTask !== undefined ? overrides.teacherTask : teacherTask,
        revisionSourceText:
          overrides?.revisionSourceText !== undefined
            ? overrides.revisionSourceText
            : teacherAssignedBaseText || undefined,
      };

      const serialized = JSON.stringify(state);
      if (serialized === lastEmittedStateRef.current) return;

      lastEmittedStateRef.current = serialized;
      onTeacherWritingStateChange(state);
    },
    [
      derivedWritingMode,
      isRevisionAttempt,
      isTeacherInitiated,
      latestSubmittedText,
      onTeacherWritingStateChange,
      teacherAssignedBaseText,
      teacherTask,
    ],
  );

  useEffect(() => {
    if (!teacherTask) return;

    const shouldApply = shouldAutoApplyTeacherPrefill({
      currentDraft: draft,
      hasUserEditedDraft: hasUserEditedDraftSinceTeacherHydration,
      teacherTask,
      previousTriggerToken: previousTeacherTriggerToken,
    });

    const prefillText = teacherTask.prefillText?.trim();
    if (!shouldApply || !prefillText) return;

    setDraft(teacherTask.prefillText ?? '');
    setTeacherAssignedBaseText(teacherTask.prefillText ?? '');
    setHasUserEditedDraftSinceTeacherHydration(false);
    setIsRevisionAttempt(false);
    setPreviousTeacherTriggerToken(teacherTask.triggerToken);
  }, [
    teacherTask,
    draft,
    hasUserEditedDraftSinceTeacherHydration,
    previousTeacherTriggerToken,
  ]);

  useEffect(() => {
    const hasMeaningfulState =
      Boolean(result) ||
      Boolean(latestSubmittedText) ||
      Boolean(teacherTask) ||
      isRevisionAttempt;

    if (!hasMeaningfulState) return;

    emitTeacherWritingState(result);
  }, [result, latestSubmittedText, teacherTask, isRevisionAttempt, emitTeacherWritingState]);

  useEffect(() => {
    if (!copiedState) return;

    const timer = window.setTimeout(() => {
      setCopiedState(null);
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [copiedState]);

  const charCount = draft.trim().length;
  const canSubmit = charCount > 0 && !isLoading;

  const correctedText = cleanText(result?.correctedText);
  const enhancedText = cleanText(result?.enhancedText);
  const explanationText = cleanText(result?.explanation);

  const placeholder = useMemo(() => {
    if (teacherInstructionText) {
      return `${teacherInstructionText}

Paste or write your English here. Mercy will keep the teacher focus while correcting grammar and improving writing.`;
    }

    if (roomTitle) {
      return `Write 1–3 real sentences here. Mercy will improve the grammar, make the English more natural, and show you how to continue into speaking and logic.`;
    }

    return `Write 1–3 real sentences here. Mercy will improve the grammar, make the English more natural, and show you how to continue into speaking and logic.`;
  }, [roomTitle, teacherInstructionText]);

  const memoryPatch = useMemo<StudentMercyMemoryUpdate | null>(() => {
    const sourceText = latestSubmittedText || draft.trim();
    if (!result || !sourceText) return null;

    const writingPatterns = detectWritingPatterns({
      sourceText,
      correctedText,
      enhancedText,
      explanation: explanationText,
    });

    const logicPatterns = detectLogicMemoryPatterns({
      sourceText,
      correctedText,
      enhancedText,
      explanation: explanationText,
    });

    const strengths =
      enhancedText && enhancedText !== correctedText
        ? ['You improve quickly when Mercy reshapes your real sentence into more natural English.']
        : correctedText
          ? ['You are building a stronger habit of turning real thoughts into clearer English.']
          : [];

    const focus = writingPatterns.slice(0, 2);
    const recurringTopics = detectRecurringTopics(sourceText);
    const commonWritingModes = detectWritingMode(sourceText, result.writingMode);
    const bridgeLabels = logicPatterns.map((item) => item.label);

    return {
      writing: {
        patterns: writingPatterns,
        strengths,
        currentFocus: focus,
        recurringTopics,
        commonWritingModes,
        lastSubmittedText: sourceText,
        lastCorrectedText: correctedText,
        lastEnhancedText: enhancedText || correctedText,
      },
      logic: {
        vietlishPatterns: logicPatterns,
        bridgesLearned: bridgeLabels,
        currentLogicFocus: focus,
      },
    };
  }, [correctedText, draft, enhancedText, explanationText, latestSubmittedText, result]);

  async function handleAnalyze() {
    const text = draft.trim();
    if (!text) return;

    setIsLoading(true);
    setError(null);
    setLatestSubmittedText(text);

    const revisionBaseline = teacherAssignedBaseText.trim();
    const revisionDetected = Boolean(
      teacherTask && revisionBaseline && hasMeaningfulDifference(text, revisionBaseline),
    );
    setIsRevisionAttempt(revisionDetected);

    try {
      const analysis = await analyzeGrammarWithApi({
        text,
        roomId,
        roomTitle,
        englishLevel,
        contentEn,
        originalText: revisionDetected ? revisionBaseline : undefined,
        focus: normalizedTeacherTask?.focus ?? normalizedTeacherTask?.emphasis,
        taskType: normalizedTeacherTask?.taskType ?? normalizedTeacherTask?.type,
        isTeacherInitiated,
        isRevisionAttempt: revisionDetected,
      });

      setResult(analysis);
      onAnalysisResult?.(analysis);

      emitTeacherWritingState(analysis, {
        currentWritingMode: analysis?.writingMode ?? derivedWritingMode,
        isRevisionAttempt: revisionDetected,
        latestSubmittedText: text,
      });

      const writingPatterns = detectWritingPatterns({
        sourceText: text,
        correctedText: cleanText(analysis?.correctedText),
        enhancedText: cleanText(analysis?.enhancedText),
        explanation: cleanText(analysis?.explanation),
      });

      const logicPatterns = detectLogicMemoryPatterns({
        sourceText: text,
        correctedText: cleanText(analysis?.correctedText),
        enhancedText: cleanText(analysis?.enhancedText),
        explanation: cleanText(analysis?.explanation),
      });

      onMemoryUpdate?.({
        writing: {
          patterns: writingPatterns,
          strengths:
            cleanText(analysis?.enhancedText) &&
            cleanText(analysis?.enhancedText) !== cleanText(analysis?.correctedText)
              ? ['You improve quickly when Mercy reshapes your real sentence into more natural English.']
              : ['You are building a stronger habit of expressing real thoughts in English.'],
          currentFocus: writingPatterns.slice(0, 2),
          recurringTopics: detectRecurringTopics(text),
          commonWritingModes: detectWritingMode(text, analysis?.writingMode),
          lastSubmittedText: text,
          lastCorrectedText: cleanText(analysis?.correctedText),
          lastEnhancedText:
            cleanText(analysis?.enhancedText) || cleanText(analysis?.correctedText),
        },
        logic: {
          vietlishPatterns: logicPatterns,
          bridgesLearned: logicPatterns.map((item) => item.label),
          currentLogicFocus: writingPatterns.slice(0, 2),
        },
      });
    } catch (err) {
      console.error('Grammar API failed:', err);
      setResult(null);
      onAnalysisResult?.(null);
      setError(err instanceof Error ? err.message : 'Grammar API failed. Please try again.');

      emitTeacherWritingState(null, {
        isRevisionAttempt: revisionDetected,
        latestSubmittedText: text,
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleClear() {
    setDraft('');
    setResult(null);
    setError(null);
    setLatestSubmittedText('');
    setIsRevisionAttempt(false);
    setHasUserEditedDraftSinceTeacherHydration(false);
    setCopiedState(null);

    if (!teacherTask?.prefillText) {
      setTeacherAssignedBaseText('');
    }

    onAnalysisResult?.(null);

    lastEmittedStateRef.current = JSON.stringify(EMPTY_TEACHER_WRITING_STATE);
    onTeacherWritingStateChange?.(EMPTY_TEACHER_WRITING_STATE);
  }

  function handlePracticePronunciation() {
    if (!correctedText || !onPracticePronunciation) return;

    onPracticePronunciation({
      sourceText: latestSubmittedText || draft.trim(),
      correctedText,
      enhancedText: enhancedText || undefined,
    });
  }

  async function handleCopyCorrected() {
    if (!correctedText) return;
    const ok = await copyText(correctedText);
    if (ok) setCopiedState('corrected');
  }

  async function handleCopyEnhanced() {
    const target = enhancedText || correctedText;
    if (!target) return;
    const ok = await copyText(target);
    if (ok) setCopiedState('enhanced');
  }

  const teacherEmphasis = getTeacherEmphasis(result, teacherTask);
  const practiceTarget = enhancedText || correctedText;
  const sourceText = latestSubmittedText || draft.trim();

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
        <div className="space-y-4">
          <div className="rounded-3xl border border-orange-100/90 bg-gradient-to-br from-[#FFF7ED] via-white to-[#F0FDF4] p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
            <div className="mb-4">
              <p className="text-[1.05rem] font-semibold text-slate-900">
                Write what is true today
              </p>
              <p className="mt-1.5 text-sm leading-6 text-slate-700">
                Start with your mood, something that happened, or a thought you keep returning to.
                Mercy will help shape it into more natural English.
              </p>
            </div>

            <div className="rounded-[28px] border border-orange-100 bg-[#FFFBF5] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
              <textarea
                value={draft}
                onChange={(e) => {
                  setDraft(e.target.value);
                  setHasUserEditedDraftSinceTeacherHydration(true);
                }}
                placeholder={placeholder}
                className="min-h-[190px] w-full resize-y border-0 bg-transparent p-0 text-sm leading-7 text-slate-800 outline-none placeholder:text-slate-400 focus:ring-0"
              />

              <div className="mt-4 rounded-2xl border border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50/70 p-3.5">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-amber-700">
                  Example
                </p>
                <p className="mt-1.5 text-sm leading-6 text-slate-700">
                  Yesterday I go to supermarket and buy many thing.
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <p className="text-xs font-medium text-slate-600">{charCount} characters</p>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClear}
                  disabled={isLoading || (!draft && !result)}
                  className="border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
                >
                  Clear
                </Button>

                <Button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={!canSubmit}
                  className="bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-[0_10px_24px_rgba(16,185,129,0.24)] hover:from-emerald-500 hover:to-teal-600 hover:shadow-[0_12px_28px_rgba(16,185,129,0.28)]"
                >
                  {isLoading ? 'Analyzing...' : 'Analyze'}
                </Button>
              </div>
            </div>
          </div>

          {error ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              <div className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <p>{error}</p>
                </div>
              </div>
            </div>
          ) : null}

          {teacherEmphasis ? (
            <div className="rounded-2xl border border-orange-100 bg-white p-4 shadow-[0_6px_18px_rgba(15,23,42,0.04)]">
              <div className="flex items-start gap-2">
                <Target className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">{teacherEmphasis.title}</p>
                  {teacherEmphasis.subtitle ? (
                    <p className="text-xs text-slate-500">{teacherEmphasis.subtitle}</p>
                  ) : null}
                  <p className="mt-2 text-sm leading-6 text-slate-700">{teacherEmphasis.body}</p>
                </div>
              </div>
            </div>
          ) : null}

          {result ? (
            <>
              <div className="space-y-4 rounded-3xl border border-orange-100/80 bg-gradient-to-br from-white via-[#FFFDFC] to-[#F8FFFC] p-5 shadow-[0_10px_28px_rgba(148,163,184,0.06)]">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Your sentence
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-700">{sourceText}</p>
                </div>

                <div className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50/80 to-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                    Corrected version
                  </p>
                  <p className="mt-1 text-sm font-medium leading-6 text-slate-800">
                    {correctedText}
                  </p>
                </div>

                {enhancedText ? (
                  <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/70 to-white p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">
                          Enhanced version
                        </p>
                        <p className="mt-1 text-sm font-medium leading-6 text-slate-800">
                          {enhancedText}
                        </p>
                      </div>

                      {copiedState === 'enhanced' ? (
                        <span className="inline-flex items-center gap-1 rounded-full border bg-white px-2.5 py-1 text-xs font-medium text-emerald-700">
                          <Check className="h-3.5 w-3.5" />
                          Copied
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-4 rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50/70 to-white p-4">
                      <div className="flex items-start gap-2">
                        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-purple-600" />
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            That’s a real thought. Now let’s make it natural English.
                          </p>
                          <p className="mt-1 text-sm leading-6 text-slate-600">
                            Mercy improved your sentence. The next step is to say it aloud, then understand why it works.
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 space-y-3">
                        {onPracticePronunciation ? (
                          <button
                            type="button"
                            onClick={handlePracticePronunciation}
                            className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[#60A5FA] to-[#3B82F6] px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:shadow-lg"
                          >
                            <Mic className="mr-2 h-4 w-4" />
                            Say this sentence
                          </button>
                        ) : null}

                        {onOpenEnglishLogic ? (
                          <button
                            type="button"
                            onClick={onOpenEnglishLogic}
                            className="flex w-full items-center justify-center rounded-2xl border border-purple-200 bg-white px-4 py-3 text-sm font-semibold text-purple-700 transition hover:bg-purple-50"
                          >
                            <BookOpenText className="mr-2 h-4 w-4" />
                            Understand this sentence
                          </button>
                        ) : null}
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button type="button" variant="ghost" onClick={handleCopyEnhanced}>
                          <Copy className="mr-2 h-4 w-4" />
                          Use this version
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : null}

                {!enhancedText ? (
                  <div className="rounded-2xl border border-sky-100 bg-gradient-to-r from-sky-50/80 to-white p-4">
                    <div className="flex items-start gap-2">
                      <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          Mercy is ready to guide your next step.
                        </p>
                        <p className="mt-1 text-sm leading-6 text-slate-600">
                          First say the corrected sentence aloud. Then open English Logic to understand the English thinking behind it.
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {onPracticePronunciation ? (
                        <Button type="button" onClick={handlePracticePronunciation}>
                          <Mic className="mr-2 h-4 w-4" />
                          Say this sentence
                        </Button>
                      ) : null}

                      {onOpenEnglishLogic ? (
                        <Button type="button" variant="outline" onClick={onOpenEnglishLogic}>
                          <BookOpenText className="mr-2 h-4 w-4" />
                          Understand this sentence
                        </Button>
                      ) : null}

                      <Button type="button" variant="ghost" onClick={handleCopyCorrected}>
                        <Copy className="mr-2 h-4 w-4" />
                        {copiedState === 'corrected' ? 'Copied' : 'Copy corrected'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="outline" onClick={handleCopyCorrected}>
                      <Copy className="mr-2 h-4 w-4" />
                      {copiedState === 'corrected' ? 'Copied' : 'Copy corrected'}
                    </Button>
                  </div>
                )}

                {result.explanation ? (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Why Mercy changed it
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-700">{result.explanation}</p>
                  </div>
                ) : null}
              </div>

              {memoryPatch?.writing?.currentFocus?.length ? (
                <div className="rounded-2xl border border-orange-100/70 bg-white p-4 shadow-[0_6px_18px_rgba(15,23,42,0.04)]">
                  <p className="text-sm font-semibold text-slate-900">Current focus</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {memoryPatch.writing.currentFocus.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-orange-100 bg-orange-50 px-3 py-1 text-xs font-medium text-slate-700"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  {practiceTarget ? (
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      Best next step: say this line aloud first, then open English Logic to see how English structure became clearer than direct Vietnamese transfer.
                    </p>
                  ) : null}
                </div>
              ) : null}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default GrammarWritingTab;