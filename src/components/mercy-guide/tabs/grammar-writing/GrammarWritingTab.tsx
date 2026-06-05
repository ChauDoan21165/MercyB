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
import L1HintCard from './L1HintCard';
import { recordL1Tag } from '@/lib/stage-3a/adapters/l1TagAdapter';
import { installStage4SignalHook } from '@/lib/stage-4/signalHook';
import Stage4SuggestionPanel from '@/components/stage-4/Stage4SuggestionPanel';
import type { L1WeaknessTag } from '@/lib/feedback/l1-error-detector';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';
import { recordActiveDay } from '@/lib/retention/recordActiveDay';

type LearningSupportMode = 'gentle' | 'guided' | 'immersion';



type DiffSegment = {
  value: string;
  added?: boolean;
  removed?: boolean;
};

function tokenizeDiffText(text: string): string[] {
  return text.match(/\s+|[^\s]+/g) ?? [];
}

function buildDiffSegments(sourceText: string, correctedText: string): DiffSegment[] {
  const sourceTokens = tokenizeDiffText(sourceText);
  const correctedTokens = tokenizeDiffText(correctedText);
  const sourceLower = sourceTokens.map((token) => token.toLowerCase());
  const correctedLower = correctedTokens.map((token) => token.toLowerCase());
  const rows = sourceTokens.length + 1;
  const cols = correctedTokens.length + 1;
  const dp = Array.from({ length: rows }, () => Array(cols).fill(0));

  for (let i = sourceTokens.length - 1; i >= 0; i -= 1) {
    for (let j = correctedTokens.length - 1; j >= 0; j -= 1) {
      if (sourceLower[i] === correctedLower[j]) {
        dp[i][j] = dp[i + 1][j + 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  const segments: DiffSegment[] = [];
  let i = 0;
  let j = 0;

  while (i < sourceTokens.length && j < correctedTokens.length) {
    if (sourceLower[i] === correctedLower[j]) {
      segments.push({ value: correctedTokens[j] });
      i += 1;
      j += 1;
      continue;
    }

    if (dp[i][j + 1] >= dp[i + 1][j]) {
      segments.push({ value: correctedTokens[j], added: true });
      j += 1;
      continue;
    }

    i += 1;
  }

  while (j < correctedTokens.length) {
    segments.push({ value: correctedTokens[j], added: true });
    j += 1;
  }

  return segments;
}

function renderCorrectedTextWithHighlights(
  sourceText: string,
  correctedText: string,
): React.ReactNode {
  const source = cleanText(sourceText);
  const corrected = cleanText(correctedText);

  if (!corrected) {
    return null;
  }

  const segments = buildDiffSegments(source, corrected);
  const hasHighlight = segments.some((segment) => segment.added && cleanText(segment.value));

  if (!hasHighlight) {
    return corrected;
  }

  return segments.map((segment, index) => {
    if (!segment.added || !cleanText(segment.value)) {
      return <React.Fragment key={`segment-${index}`}>{segment.value}</React.Fragment>;
    }

    return (
      <mark
        key={`segment-${index}`}
        className="rounded-md bg-amber-200 px-1 py-0.5 font-semibold text-slate-900"
      >
        {segment.value}
      </mark>
    );
  });
}

type GrammarWritingTabProps = {
  roomId?: string;
  roomTitle?: string;
  contentEn?: string;
  englishLevel?: string | null;
  learningSupportMode?: LearningSupportMode;
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

const CHANGE_PAIR_STOP_WORDS = new Set([
  'a',
  'an',
  'the',
  'to',
  'of',
  'in',
  'on',
  'at',
  'for',
  'with',
  'and',
  'or',
  'but',
  'his',
  'her',
  'their',
  'my',
  'your',
  'our',
  'its',
]);

function cleanText(value?: string | null): string {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

function splitWords(text: string): string[] {
  return cleanText(text)
    .toLowerCase()
    .replace(/[^\w\s']/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
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
    explanation.includes('tense') ||
    explanation.includes('subject-verb agreement')
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
    explanation.includes('past tense') ||
    explanation.includes('subject-verb agreement')
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

function detectGrammarLabelsVi(params: {
  sourceText: string;
  correctedText: string;
  explanation?: string;
}): string[] {
  const source = params.sourceText.toLowerCase();
  const corrected = params.correctedText.toLowerCase();
  const explanation = cleanText(params.explanation).toLowerCase();

  const labels: string[] = [];

  if (
    source.includes('yesterday') ||
    source.includes('last ') ||
    source.includes('ago') ||
    explanation.includes('past tense') ||
    explanation.includes('tense inconsistencies')
  ) {
    labels.push('Quá khứ đơn');
  }

  if (
    explanation.includes('subject-verb agreement') ||
    explanation.includes('singular subject')
  ) {
    labels.push('Hiện tại đơn');
  }

  if (explanation.includes('present perfect')) {
    labels.push('Hiện tại hoàn thành');
  }

  if (
    explanation.includes('article') ||
    /\b(a|an|the)\b/i.test(corrected)
  ) {
    labels.push('Mạo từ');
  }

  if (
    explanation.includes('preposition') ||
    corrected.includes(' to him') ||
    corrected.includes(' to her') ||
    corrected.includes(' to them') ||
    corrected.includes(' to me')
  ) {
    labels.push('Giới từ');
  }

  if (
    explanation.includes('punctuation') ||
    corrected.includes(',') ||
    corrected.includes('.')
  ) {
    labels.push('Dấu câu');
  }

  if (
    explanation.includes('sentence structure') ||
    explanation.includes('flow') ||
    explanation.includes('clause')
  ) {
    labels.push('Cấu trúc câu');
  }

  return Array.from(new Set(labels)).slice(0, 5);
}

function buildChangedWordPairs(
  sourceText: string,
  correctedText: string,
): Array<{ from: string; to: string }> {
  const sourceWords = sourceText.match(/\b[\w']+\b/g) ?? [];
  const correctedWords = correctedText.match(/\b[\w']+\b/g) ?? [];
  const pairs: Array<{ from: string; to: string }> = [];

  const maxLength = Math.min(sourceWords.length, correctedWords.length);

  for (let index = 0; index < maxLength; index += 1) {
    const from = cleanText(sourceWords[index]);
    const to = cleanText(correctedWords[index]);

    if (!from || !to) continue;
    if (from.toLowerCase() === to.toLowerCase()) continue;
    if (from.length <= 2 || to.length <= 2) continue;
    if (CHANGE_PAIR_STOP_WORDS.has(from.toLowerCase()) || CHANGE_PAIR_STOP_WORDS.has(to.toLowerCase())) {
      continue;
    }

    pairs.push({ from, to });
  }

  const sourceLower = sourceText.toLowerCase();
  const correctedLower = correctedText.toLowerCase();

  if (sourceLower.includes('listen him') && correctedLower.includes('listened to him')) {
    pairs.push({ from: 'listen him', to: 'listened to him' });
  }

  if (sourceLower.includes('listen her') && correctedLower.includes('listened to her')) {
    pairs.push({ from: 'listen her', to: 'listened to her' });
  }

  if (sourceLower.includes('listen them') && correctedLower.includes('listened to them')) {
    pairs.push({ from: 'listen them', to: 'listened to them' });
  }

  if (sourceLower.includes('try study') && correctedLower.includes('tried to study')) {
    pairs.push({ from: 'try study', to: 'tried to study' });
  }

  return pairs
    .filter((item, index, array) => {
      const key = `${item.from.toLowerCase()}=>${item.to.toLowerCase()}`;
      return (
        array.findIndex(
          (candidate) =>
            `${candidate.from.toLowerCase()}=>${candidate.to.toLowerCase()}` === key,
        ) === index
      );
    })
    .slice(0, 6);
}

function buildGentleVietnameseExplanation(params: {
  sourceText: string;
  correctedText: string;
  enhancedText: string;
  explanationText: string;
}): {
  intro: string;
  body: string[];
  labels: string[];
  changes: Array<{ from: string; to: string }>;
} {
  const { sourceText, correctedText, enhancedText, explanationText } = params;
  const sourceLower = sourceText.toLowerCase();
  const correctedLower = correctedText.toLowerCase();
  const labels = detectGrammarLabelsVi({
    sourceText,
    correctedText,
    explanation: explanationText,
  });
  const changes = buildChangedWordPairs(sourceText, correctedText);

  const body: string[] = [];
  let intro =
    'Mình sửa nhẹ câu này để câu rõ hơn, đúng ngữ pháp hơn, và tự nhiên hơn trong tiếng Anh.';

  const hasPastSimple =
    labels.includes('Quá khứ đơn') ||
    sourceLower.includes('yesterday') ||
    sourceLower.includes('last ') ||
    sourceLower.includes('ago');

  const hasPresentSimple = labels.includes('Hiện tại đơn');

  if (hasPastSimple) {
    intro =
      'Câu này đang kể lại chuyện đã xảy ra rồi, nên mình chuyển nhiều động từ sang quá khứ đơn để người nghe hiểu ngay đây là chuyện trong quá khứ.';
    body.push(
      'Khi có các dấu hiệu thời gian như “yesterday”, “last…”, “ago”, tiếng Anh thường cần động từ ở quá khứ đơn.'
    );
  } else if (hasPresentSimple) {
    intro =
      'Ở đây mình đang chỉnh theo hiện tại đơn và hòa hợp chủ ngữ – động từ, để câu đúng hơn với chủ ngữ số ít.';
    body.push(
      'Với chủ ngữ số ít như “he / she / the user”, động từ ở hiện tại đơn thường cần thêm -s hoặc -es.'
    );
  } else if (sourceLower.includes('today') && correctedLower !== sourceLower) {
    intro =
      'Câu này đang kể một chuỗi việc trong ngày như một câu chuyện nhìn lại, nên Mercy chỉnh các động từ để mạch kể nhất quán và dễ hiểu hơn.';
  }

  if (
    correctedLower.includes('listened to him') ||
    correctedLower.includes('listened to her') ||
    correctedLower.includes('listened to them') ||
    correctedLower.includes('listened to me') ||
    explanationText.toLowerCase().includes('preposition')
  ) {
    body.push(
      'Ngoài ra, mình cũng chỉnh giới từ cho đúng. Ví dụ trong tiếng Anh mình nói “listen to someone”, không nói “listen someone”.'
    );
  }

  if (
    labels.includes('Cấu trúc câu') ||
    labels.includes('Dấu câu') ||
    explanationText.toLowerCase().includes('punctuation') ||
    explanationText.toLowerCase().includes('clause')
  ) {
    body.push(
      'Mình cũng tách câu dài và thêm dấu câu để ý rõ hơn. Khi câu quá dài, tiếng Anh thường dễ đọc hơn nếu chia thành các đoạn ý nhỏ.'
    );
  }

  if (enhancedText && enhancedText !== correctedText) {
    body.push(
      'Ở bản nâng cao hơn, mình làm câu mượt hơn một chút để nghe tự nhiên hơn, nhưng vẫn giữ nguyên ý của bạn.'
    );
  }

  if (body.length === 0) {
    body.push(
      'Ý của bạn đã khá rõ rồi. Mình chỉ chỉnh vài điểm ngữ pháp và cách diễn đạt để câu tự nhiên hơn trong tiếng Anh.'
    );
  }

  return { intro, body, labels, changes };
}

function buildSupportHint(mode: LearningSupportMode): string {
  switch (mode) {
    case 'gentle':
      return 'Mercy sẽ dùng tiếng Việt nhiều hơn, giải thích mềm hơn, và gọi rõ tên điểm ngữ pháp như quá khứ đơn, hiện tại đơn, hiện tại hoàn thành.';
    case 'guided':
      return 'Mercy will mostly teach in English, with short Vietnamese hints only when they truly help.';
    case 'immersion':
    default:
      return 'Mercy will stay fully in English so you can practice understanding through English only.';
  }
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
  learningSupportMode = 'gentle',
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

  // Belt-and-braces gate: server already filters l1Hint by the same
  // flag per user. Client-side check keeps the card hidden even if a
  // stale cached response still carries the payload after the flag
  // flips off.
  const { enabled: l1DetectorEnabled } = useFeatureFlag('feedbackL1DetectorEnabled');

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
  }, [result, draft]);

  const supportHint = useMemo(
    () => buildSupportHint(learningSupportMode),
    [learningSupportMode],
  );

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

  // Stage 4 (L4) — subscribe the intervention engine to the L1
  // ring-buffer write path (Q9=B: evaluate on signal change). This is
  // the live signal site — `recordL1Tag` fires here on each analysis, so
  // installing here keeps L4's suggestion buffer fresh. Idempotent; the
  // returned teardown removes the subscription on unmount.
  useEffect(() => installStage4SignalHook(), []);

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

    // Live production surface: learner submitted text for grammar analysis.
    // Active-day choke point (dark, dedup'd per local day).
    void recordActiveDay();

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

      // Stage 3A — mirror the L1 detector tag into the local ring buffer
      // for the "What I'm Weak At" screen. Local-only, no Supabase.
      if (analysis?.l1Hint?.weaknessTag) {
        recordL1Tag(analysis.l1Hint.weaknessTag as L1WeaknessTag, Date.now());
      }

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

  const gentleExplanation = useMemo(
    () =>
      buildGentleVietnameseExplanation({
        sourceText,
        correctedText,
        enhancedText,
        explanationText,
      }),
    [sourceText, correctedText, enhancedText, explanationText],
  );

  const correctedTextHighlighted = useMemo(
    () => renderCorrectedTextWithHighlights(sourceText, correctedText),
    [sourceText, correctedText],
  );

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

              <div className="mt-3 rounded-2xl border border-sky-100 bg-sky-50/70 px-3.5 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sky-700">
                  Learning support
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-700">{supportHint}</p>
              </div>
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

          {/* Stage 4 (L4) — diagnostic intervention. Renders ONE
              dismissible suggestion via Stage 3B's card chrome when an L4
              rule fires (e.g. the VN past-tense-marker rule). The
              signal-change hook installed above keeps L4's buffer fresh;
              this panel reads it. Renders nothing until a rule fires. */}
          <Stage4SuggestionPanel />

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
                  <p className="mt-1 text-sm font-medium leading-7 text-slate-800">
                    {correctedTextHighlighted}
                  </p>

                  {learningSupportMode === 'gentle' ? (
                    <div className="mt-2 space-y-2 text-sm leading-6 text-emerald-700">
                      <p>👉 Mình đã sửa câu này để đúng ngữ pháp hơn và dễ đọc hơn.</p>
                      <p>👉 Những chỗ Mercy đổi được tô nổi để người học nhìn ra nhanh hơn.</p>
                      {gentleExplanation.labels.length > 0 ? (
                        <p>
                          Điểm ngữ pháp chính: <strong>{gentleExplanation.labels.join(' • ')}</strong>
                        </p>
                      ) : null}
                    </div>
                  ) : learningSupportMode === 'guided' ? (
                    <p className="mt-2 text-sm leading-6 text-emerald-700">
                      Small hint: Mercy corrected the main grammar shape and made the sentence easier to read.
                    </p>
                  ) : null}
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

                          {learningSupportMode === 'gentle' ? (
                            <div className="mt-2 space-y-2 text-sm leading-6 text-purple-700">
                              <p>👉 Bản nâng cao này mượt hơn một chút, để khi đọc lên nghe tự nhiên hơn.</p>
                              <p>Bước tiếp theo là đọc câu này thành tiếng, rồi xem phần giải thích để hiểu vì sao câu nghe tự nhiên hơn.</p>
                            </div>
                          ) : learningSupportMode === 'guided' ? (
                            <p className="mt-2 text-sm leading-6 text-purple-700">
                              Gợi ý ngắn: đọc câu này thành tiếng trước, rồi mở phần giải thích để hiểu điểm đổi chính.
                            </p>
                          ) : null}
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

                        {learningSupportMode === 'gentle' ? (
                          <div className="mt-2 space-y-2 text-sm leading-6 text-sky-700">
                            <p>👉 Trước tiên hãy nói câu đã sửa thành tiếng.</p>
                            <p>Sau đó mở phần giải thích để hiểu cách nghĩ bằng tiếng Anh và nhớ tên điểm ngữ pháp cho dễ học lâu hơn.</p>
                          </div>
                        ) : learningSupportMode === 'guided' ? (
                          <p className="mt-2 text-sm leading-6 text-sky-700">
                            Gợi ý ngắn: nói câu đã sửa trước, rồi mới nhìn sang phần logic.
                          </p>
                        ) : null}
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
                  <div className="rounded-2xl border border-orange-100/80 bg-orange-50/40 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Why Mercy changed it
                    </p>

                    {learningSupportMode === 'gentle' ? (
                      <div className="mt-2 space-y-3">
                        <p className="text-sm leading-6 text-slate-600">
                          Mercy corrected the tense, sentence structure, and flow so the story sounds clearer in English.
                        </p>

                        <div className="space-y-3 text-[15px] leading-7 text-amber-800">
                          <p>
                            👉 <strong>Giải thích nhẹ:</strong> {gentleExplanation.intro}
                          </p>

                          {gentleExplanation.body.map((item) => (
                            <p key={item}>{item}</p>
                          ))}

                          {gentleExplanation.changes.length > 0 ? (
                            <div>
                              <p className="font-semibold text-amber-900">Các chỗ đổi dễ thấy:</p>
                              <div className="mt-1 space-y-1">
                                {gentleExplanation.changes.map((item) => (
                                  <p key={`${item.from}-${item.to}`}>
                                    - <strong>{item.from}</strong> → <strong>{item.to}</strong>
                                  </p>
                                ))}
                              </div>
                            </div>
                          ) : null}

                          {gentleExplanation.labels.length > 0 ? (
                            <div>
                              <p className="font-semibold text-amber-900">Tên điểm ngữ pháp:</p>
                              <p>
                                {gentleExplanation.labels.map((item, index) => (
                                  <React.Fragment key={item}>
                                    {index > 0 ? ' • ' : ''}
                                    <strong>{item}</strong>
                                  </React.Fragment>
                                ))}
                              </p>
                            </div>
                          ) : null}

                          <p>
                            Nói ngắn gọn: mình giữ nguyên ý của bạn, nhưng chỉnh để câu đúng hơn, rõ ý hơn, và tự nhiên hơn khi người bản xứ đọc.
                          </p>
                        </div>
                      </div>
                    ) : learningSupportMode === 'guided' ? (
                      <div className="mt-2 space-y-2">
                        <p className="text-sm leading-6 text-slate-700">{result.explanation}</p>
                        <p className="text-sm leading-6 text-amber-700">
                          Gợi ý ngắn: tập trung vào {gentleExplanation.labels.length > 0 ? gentleExplanation.labels.join(' • ') : 'động từ, dấu câu, và cấu trúc câu'}.
                        </p>
                      </div>
                    ) : (
                      <p className="mt-2 text-sm leading-6 text-slate-700">{result.explanation}</p>
                    )}
                  </div>
                ) : null}

                {l1DetectorEnabled && result.l1Hint ? (
                  <L1HintCard hint={result.l1Hint} />
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