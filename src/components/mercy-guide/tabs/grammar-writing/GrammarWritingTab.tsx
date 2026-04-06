import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, Target } from 'lucide-react';

import { Button } from '@/components/ui/button';

import type {
  GrammarApiResponse,
  GrammarWritingTeacherState,
  PronunciationLaunchPayload,
  TeacherWritingTask,
} from './types';
import {
  buildTeacherInstructionText,
  getTeacherEmphasis,
  shouldAutoApplyTeacherPrefill,
} from './teacher';
import { hasMeaningfulDifference } from './utils';

type GrammarWritingTabProps = {
  roomId?: string;
  roomTitle?: string;
  contentEn?: string;
  englishLevel?: string | null;
  teacherTask?: TeacherWritingTask;
  onAnalysisResult?: (result: GrammarApiResponse | null) => void;
  onPracticePronunciation?: (payload: PronunciationLaunchPayload) => void;
  onTeacherWritingStateChange?: (state: GrammarWritingTeacherState) => void;
};

type AnalyzeGrammarParams = {
  text: string;
  roomId?: string;
  roomTitle?: string;
  englishLevel?: string | null;
  contentEn?: string;
};

const GRAMMAR_API_ENDPOINT = 'http://localhost:3001/api/mercy/grammar';

async function analyzeGrammarWithApi({
  text,
  roomId,
  roomTitle,
  englishLevel,
  contentEn,
}: AnalyzeGrammarParams): Promise<GrammarApiResponse> {
  const response = await fetch(GRAMMAR_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      roomId,
      roomTitle,
      englishLevel,
      contentEn,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    const suffix = errorText ? `: ${errorText}` : '';
    throw new Error(`Grammar API failed with status ${response.status}${suffix}`);
  }

  const data = (await response.json()) as GrammarApiResponse;
  return data;
}

export function GrammarWritingTab({
  roomId,
  roomTitle,
  contentEn,
  englishLevel,
  teacherTask,
  onAnalysisResult,
  onPracticePronunciation,
  onTeacherWritingStateChange,
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

  const lastEmittedStateRef = useRef<string | null>(null);

  const isTeacherInitiated = Boolean(teacherTask);

  const teacherInstructionText = useMemo(
    () => buildTeacherInstructionText(teacherTask),
    [teacherTask],
  );

  const derivedWritingMode = useMemo(() => {
    if (result?.writingMode) return result.writingMode;

    const wordCount = draft.trim() ? draft.trim().split(/\s+/).length : 0;
    if (wordCount <= 12) return 'sentence';
    if (wordCount <= 60) return 'paragraph';
    return 'essay';
  }, [result?.writingMode, draft]);

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
    if (!onTeacherWritingStateChange) return;

    const hasMeaningfulState =
      Boolean(result) || Boolean(latestSubmittedText) || Boolean(teacherTask) || isRevisionAttempt;

    if (!hasMeaningfulState) return;

    const state: GrammarWritingTeacherState = {
      latestAnalysisResult: result ?? null,
      currentWritingMode: derivedWritingMode,
      isTeacherInitiated,
      isRevisionAttempt,
      latestSubmittedText,
      teacherTask,
      revisionSourceText: teacherAssignedBaseText || undefined,
    };

    const serialized = JSON.stringify(state);
    if (serialized === lastEmittedStateRef.current) return;

    lastEmittedStateRef.current = serialized;
    onTeacherWritingStateChange(state);
  }, [
    result,
    derivedWritingMode,
    isTeacherInitiated,
    isRevisionAttempt,
    latestSubmittedText,
    teacherTask,
    teacherAssignedBaseText,
    onTeacherWritingStateChange,
  ]);

  const charCount = draft.trim().length;
  const canSubmit = charCount > 0 && !isLoading;

  const placeholder = useMemo(() => {
    if (teacherInstructionText) {
      return `${teacherInstructionText}

Paste or write your English here. Mercy will keep the teacher focus while correcting grammar and improving writing.`;
    }

    if (roomTitle) {
      return `Paste 1–2 sentences here and Mercy will fix the grammar, explain the logic, and improve the writing.

Example:
I very like this lesson because it help me understand better.`;
    }

    return `Paste 1–2 sentences here and Mercy will fix the grammar, explain the logic, and improve the writing.

Example:
Yesterday I go to supermarket and buy many thing.`;
  }, [roomTitle, teacherInstructionText]);

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
      });

      setResult(analysis);
      onAnalysisResult?.(analysis);

      if (onTeacherWritingStateChange) {
        const state: GrammarWritingTeacherState = {
          latestAnalysisResult: analysis ?? null,
          currentWritingMode: analysis?.writingMode ?? derivedWritingMode,
          isTeacherInitiated,
          isRevisionAttempt: revisionDetected,
          latestSubmittedText: text,
          teacherTask,
          revisionSourceText: teacherAssignedBaseText || undefined,
        };

        lastEmittedStateRef.current = JSON.stringify(state);
        onTeacherWritingStateChange(state);
      }
    } catch (err) {
      console.error('Grammar API failed:', err);
      setResult(null);
      onAnalysisResult?.(null);
      setError(err instanceof Error ? err.message : 'Grammar API failed. Please try again.');
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

    if (!teacherTask?.prefillText) {
      setTeacherAssignedBaseText('');
    }

    onAnalysisResult?.(null);

    const clearedState: GrammarWritingTeacherState = {
      latestAnalysisResult: null,
      currentWritingMode: undefined,
      isTeacherInitiated: false,
      isRevisionAttempt: false,
      latestSubmittedText: '',
      teacherTask: undefined,
      revisionSourceText: undefined,
    };

    lastEmittedStateRef.current = JSON.stringify(clearedState);
    onTeacherWritingStateChange?.(clearedState);
  }

  function handlePracticePronunciation() {
    if (!result?.correctedText || !onPracticePronunciation) return;

    onPracticePronunciation({
      sourceText: draft.trim(),
      correctedText: result.correctedText,
      enhancedText: result.enhancedText,
    });
  }

  const teacherEmphasis = getTeacherEmphasis(result, teacherTask);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
        <div className="space-y-4">
          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <textarea
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value);
                setHasUserEditedDraftSinceTeacherHydration(true);
              }}
              placeholder={placeholder}
              className="min-h-[180px] w-full resize-y rounded-xl border p-3 text-sm outline-none"
            />

            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">{charCount} characters</p>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClear}
                  disabled={isLoading || (!draft && !result)}
                >
                  Clear
                </Button>

                <Button type="button" onClick={handleAnalyze} disabled={!canSubmit}>
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
                  <p className="mt-1 text-xs">
                    API endpoint tried: <code>{GRAMMAR_API_ENDPOINT}</code>
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {teacherEmphasis ? (
            <div className="rounded-2xl border bg-white p-4 shadow-sm">
              <div className="flex items-start gap-2">
                <Target className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <p className="text-sm font-semibold">{teacherEmphasis.title}</p>
                  {teacherEmphasis.subtitle ? (
                    <p className="text-xs text-muted-foreground">{teacherEmphasis.subtitle}</p>
                  ) : null}
                  <p className="mt-2 text-sm">{teacherEmphasis.body}</p>
                </div>
              </div>
            </div>
          ) : null}

          {result ? (
            <div className="space-y-3 rounded-2xl border bg-white p-4 shadow-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Corrected
                </p>
                <p className="mt-1 font-semibold">{result.correctedText}</p>
              </div>

              {result.enhancedText ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Enhanced
                  </p>
                  <p className="mt-1 text-sm">{result.enhancedText}</p>
                </div>
              ) : null}

              {result.explanation ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Explanation
                  </p>
                  <p className="mt-1 text-sm">{result.explanation}</p>
                </div>
              ) : null}

              {onPracticePronunciation ? (
                <div className="pt-2">
                  <Button type="button" variant="outline" onClick={handlePracticePronunciation}>
                    Practice this in Pronunciation
                  </Button>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
