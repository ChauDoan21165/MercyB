/**
 * File: EnglishLogicTab.tsx
 * Path: src/components/mercy-guide/tabs/EnglishLogicTab.tsx
 */

import React, { useEffect, useMemo, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Languages,
  Lightbulb,
  Mic,
  PenSquare,
  Sparkles,
  RotateCcw,
} from 'lucide-react';

import type {
  GrammarApiResponse,
  GrammarWritingTeacherState,
  MercyLogicPatternMemory,
  PronunciationLaunchPayload,
  StudentMercyMemoryUpdate,
} from '../types';

type EnglishLogicLessonInput = {
  roomTitle?: string;
  contentEn?: string;
  troubleWords?: Array<string | { word?: string | null }>;
};

type LearningSupportMode = 'gentle' | 'guided' | 'immersion';

type Props = EnglishLogicLessonInput & {
  learningSupportMode?: LearningSupportMode;
  latestTeacherWritingState?: GrammarWritingTeacherState | null;
  latestAnalysisResult?: GrammarApiResponse | null;
  pendingPronunciationPayload?: PronunciationLaunchPayload | null;
  onOpenPronunciation?: (payload?: PronunciationLaunchPayload) => void;
  onOpenWriting?: () => void;
  onMemoryUpdate?: (patch: StudentMercyMemoryUpdate) => void;
  onVaultReplay?: (word: string) => void;
  isKidsMode?: boolean;
  kidsModeAgeBand?: string | null;
  teacherLabel?: string | null;
};

type LogicViewModel = {
  focus: string;
  bridgeTitle: string;
  whyNatural: string;
  vietlishPattern: string;
  englishLogic: string;
  nextTimeTip: string;
  miniRule: string;
  comparisonLabel: string;
  sentencePattern: string;
  vietlishExample: string;
  englishExample: string;
  keyShift: string[];
};

type ExamplePair = {
  weak: string;
  natural: string;
};

type ChangeInsight = {
  label: string;
  category:
    | 'spelling'
    | 'wording'
    | 'connector'
    | 'verb_tense'
    | 'be_verb'
    | 'story_consistency'
    | 'word_order'
    | 'clarity';
  before: string;
  after: string;
};

function cleanText(value?: string | null): string {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

function asList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === 'string' ? cleanText(item) : ''))
    .filter(Boolean);
}

function splitWords(text: string): string[] {
  return cleanText(text)
    .toLowerCase()
    .replace(/[^\w\s']/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function buildSentencePattern(text: string): string {
  const normalized = cleanText(text);
  if (!normalized) return 'subject + time + action + detail';

  const words = splitWords(normalized);

  if (words.length <= 3) return 'short direct English sentence';

  if (
    words.some((word) =>
      ['because', 'so', 'when', 'if', 'although', 'since', 'but', 'knowing'].includes(word),
    )
  ) {
    return 'main idea + connector or framing phrase + supporting reason';
  }

  if (
    words.some((word) =>
      ['yesterday', 'last', 'ago', 'today', 'now', 'tomorrow', 'tonight'].includes(word),
    )
  ) {
    return 'subject + time + verb + detail';
  }

  return 'subject + verb + clear supporting detail';
}

function getRemovedTokens(original: string, improved: string): string[] {
  const originalWords = splitWords(original);
  const improvedWords = new Set(splitWords(improved));

  return Array.from(new Set(originalWords.filter((word) => !improvedWords.has(word)))).slice(0, 6);
}

function getAddedTokens(original: string, improved: string): string[] {
  const originalWords = new Set(splitWords(original));
  const improvedWords = splitWords(improved);

  return Array.from(new Set(improvedWords.filter((word) => !originalWords.has(word)))).slice(0, 6);
}

function buildLogicPatternMemory(label: string, count = 1): MercyLogicPatternMemory {
  const normalized = cleanText(label);
  const now = new Date().toISOString();

  return {
    key: normalized.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'),
    label: normalized,
    count,
    lastSeenAt: now,
  };
}

function getWordTypos(original: string, improved: string): ChangeInsight[] {
  const originalWords = original.match(/\b[\w']+\b/g) ?? [];
  const improvedWords = improved.match(/\b[\w']+\b/g) ?? [];

  const changes: ChangeInsight[] = [];
  const maxLength = Math.min(originalWords.length, improvedWords.length);

  for (let index = 0; index < maxLength; index += 1) {
    const before = cleanText(originalWords[index]);
    const after = cleanText(improvedWords[index]);

    if (!before || !after || before.toLowerCase() === after.toLowerCase()) continue;

    const closeLength = Math.abs(before.length - after.length) <= 3;
    const bothSingleWords = !before.includes(' ') && !after.includes(' ');
    const typoLike =
      closeLength &&
      bothSingleWords &&
      before.length >= 4 &&
      after.length >= 4 &&
      before[0]?.toLowerCase() === after[0]?.toLowerCase();

    if (!typoLike) continue;

    changes.push({
      label: `${before} → ${after}`,
      category: 'spelling',
      before,
      after,
    });
  }

  return changes.slice(0, 3);
}

function extractQuotedPairs(explanation: string): ChangeInsight[] {
  const pairs: ChangeInsight[] = [];
  const quoteRegex = /[“"]([^"”]+)[”"]\s*(?:→|->|to)\s*[“"]([^"”]+)[”"]/g;
  let match: RegExpExecArray | null = null;

  while ((match = quoteRegex.exec(explanation))) {
    const before = cleanText(match[1]);
    const after = cleanText(match[2]);
    if (!before || !after || before.toLowerCase() === after.toLowerCase()) continue;

    pairs.push({
      label: `${before} → ${after}`,
      category: categorizeChange(before, after),
      before,
      after,
    });
  }

  return pairs.slice(0, 6);
}

function categorizeChange(before: string, after: string): ChangeInsight['category'] {
  const beforeLower = before.toLowerCase();
  const afterLower = after.toLowerCase();

  const beforeWords = splitWords(beforeLower);
  const afterWords = splitWords(afterLower);

  if (
    beforeWords.length === 1 &&
    afterWords.length === 1 &&
    Math.abs(before.length - after.length) <= 3 &&
    before.length >= 4 &&
    after.length >= 4
  ) {
    return 'spelling';
  }

  const beVerbSet = new Set(['am', 'is', 'are', 'was', 'were']);
  if (!beforeWords.some((word) => beVerbSet.has(word)) && afterWords.some((word) => beVerbSet.has(word))) {
    return 'be_verb';
  }

  const framingWords = new Set(['because', 'since', 'knowing', 'as', 'so']);
  if (beforeWords.some((word) => framingWords.has(word)) || afterWords.some((word) => framingWords.has(word))) {
    if (beforeLower !== afterLower) {
      return 'connector';
    }
  }

  const pastSignals = new Set(['yesterday', 'last', 'ago', 'was', 'were', 'had', 'did', 'would', 'went']);
  const modalSet = new Set(['will', 'would', 'can', 'could', 'may', 'might', 'shall', 'should']);
  if (
    beforeWords.some((word) => modalSet.has(word)) &&
    afterWords.some((word) => modalSet.has(word)) &&
    beforeWords.join(' ') !== afterWords.join(' ')
  ) {
    return 'story_consistency';
  }

  if (beforeWords.some((word) => pastSignals.has(word)) || afterWords.some((word) => pastSignals.has(word))) {
    if (beforeLower !== afterLower) {
      return 'verb_tense';
    }
  }

  if (beforeWords.length > 1 || afterWords.length > 1) {
    return 'wording';
  }

  return 'clarity';
}

function dedupeInsights(items: ChangeInsight[]): ChangeInsight[] {
  const seen = new Set<string>();
  const result: ChangeInsight[] = [];

  for (const item of items) {
    const key = `${item.category}:${item.before.toLowerCase()}=>${item.after.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }

  return result;
}

function buildChangeInsights(params: {
  original: string;
  corrected: string;
  enhanced: string;
  explanation: string;
  grammarPoints: string[];
  tense?: string;
}): ChangeInsight[] {
  const { original, corrected, enhanced, explanation, grammarPoints, tense } = params;
  const improved = enhanced || corrected;
  const insights: ChangeInsight[] = [];

  if (explanation) {
    insights.push(...extractQuotedPairs(explanation));
  }

  if (original && improved) {
    insights.push(...getWordTypos(original, improved));
  }

  const pointsLower = grammarPoints.map((item) => item.toLowerCase());
  const tenseLower = cleanText(tense).toLowerCase();
  const originalLower = original.toLowerCase();
  const improvedLower = improved.toLowerCase();

  if (
    original &&
    improved &&
    originalLower !== improvedLower &&
    (pointsLower.some((item) => item.includes('spelling')) ||
      insights.some((item) => item.category === 'spelling'))
  ) {
    const removed = getRemovedTokens(original, improved);
    const added = getAddedTokens(original, improved);

    if (removed.length > 0 && added.length > 0) {
      insights.push({
        label: 'Spelling and word form cleanup',
        category: 'spelling',
        before: removed[0],
        after: added[0],
      });
    }
  }

  if (
    original &&
    improved &&
    originalLower.includes('since ') &&
    improvedLower.includes('knowing ')
  ) {
    insights.push({
      label: 'Framing phrase became more natural',
      category: 'wording',
      before: 'Since...',
      after: 'Knowing...',
    });
  }

  if (
    original &&
    improved &&
    /\bwill\b/i.test(original) &&
    /\bwould\b/i.test(improved)
  ) {
    insights.push({
      label: 'Story tone became more consistent',
      category: 'story_consistency',
      before: 'will',
      after: 'would',
    });
  }

  if (
    original &&
    improved &&
    (tenseLower.includes('past') ||
      /\b(yesterday|last|ago)\b/i.test(original) ||
      /\b(yesterday|last|ago)\b/i.test(improved))
  ) {
    const originalPastVerbMismatch =
      /\b(yesterday|last|ago)\b/i.test(original) &&
      /\b(go|come|eat|see|do|make|take|give|feel|am|is|are)\b/i.test(original);

    const improvedLooksPast =
      /\b(went|came|ate|saw|did|made|took|gave|felt|was|were)\b/i.test(improved);

    if (originalPastVerbMismatch || improvedLooksPast) {
      insights.push({
        label: 'Past-time signal matched the verb',
        category: 'verb_tense',
        before: original,
        after: improved,
      });
    }
  }

  if (
    original &&
    improved &&
    originalLower !== improvedLower &&
    insights.length === 0
  ) {
    insights.push({
      label: 'Sentence became clearer and more natural',
      category: 'clarity',
      before: original,
      after: improved,
    });
  }

  return dedupeInsights(insights).slice(0, 6);
}

function getPrimaryInsight(
  insights: ChangeInsight[],
  grammarPoints: string[],
  explanation: string,
  tense?: string,
): ChangeInsight | null {
  const preferredOrder: ChangeInsight['category'][] = [
    'spelling',
    'story_consistency',
    'wording',
    'connector',
    'verb_tense',
    'be_verb',
    'word_order',
    'clarity',
  ];

  for (const category of preferredOrder) {
    const found = insights.find((item) => item.category === category);
    if (found) return found;
  }

  const firstGrammarPoint = cleanText(grammarPoints[0]);
  if (firstGrammarPoint) {
    return {
      label: firstGrammarPoint,
      category: /spelling/i.test(firstGrammarPoint)
        ? 'spelling'
        : cleanText(tense).toLowerCase().includes('past')
          ? 'verb_tense'
          : 'clarity',
      before: '',
      after: '',
    };
  }

  if (explanation) {
    return {
      label: 'Sentence became clearer and more natural',
      category: 'clarity',
      before: '',
      after: '',
    };
  }

  return null;
}

function buildGroundedLogicViewModel(params: {
  original: string;
  corrected: string;
  enhanced: string;
  explanation: string;
  grammarPoints: string[];
  tense?: string;
}): LogicViewModel {
  const { original, corrected, enhanced, explanation, grammarPoints, tense } = params;
  const improved = enhanced || corrected || original;
  const insights = buildChangeInsights(params);
  const primaryInsight = getPrimaryInsight(insights, grammarPoints, explanation, tense);
  const hasStrongVietlishTransfer = insights.some((item) =>
    ['verb_tense', 'be_verb', 'connector', 'word_order'].includes(item.category),
  );

  const defaultWhyNatural =
    explanation ||
    'Mercy changed the sentence to make the meaning clearer, smoother, and more natural in English.';

  const base: LogicViewModel = {
    focus: primaryInsight?.label || grammarPoints[0] || 'clearer English sentence',
    bridgeTitle: hasStrongVietlishTransfer
      ? 'English structure becomes clearer here'
      : 'This is mostly a polish change, not a deep Vietlish problem',
    whyNatural: defaultWhyNatural,
    vietlishPattern: hasStrongVietlishTransfer
      ? 'Some Vietnamese-to-English transfer is showing up here, so Mercy is helping the sentence follow a more natural English pattern.'
      : 'This sentence is already close to natural English. Mercy is mostly polishing wording, spelling, or story flow instead of fixing a strong Vietnamese-thinking pattern.',
    englishLogic:
      'English usually sounds strongest when the sentence is easy to follow, with clear grammar, natural word choice, and a steady story line.',
    nextTimeTip:
      'After you write the sentence, do one quick check: spelling, verb choice, and whether the sentence sounds smooth when read aloud.',
    miniRule: 'Keep the meaning, then polish the line.',
    comparisonLabel: hasStrongVietlishTransfer ? 'English structure pattern' : 'Polish and clarity pattern',
    sentencePattern: buildSentencePattern(improved),
    vietlishExample: 'I very tired today because many work.',
    englishExample: 'I feel very tired today because I have a lot of work.',
    keyShift: [
      'Use the exact change Mercy made to understand what became smoother.',
      'Not every sentence needs a deep logic lesson. Sometimes the real win is polish and control.',
    ],
  };

  switch (primaryInsight?.category) {
    case 'spelling':
      return {
        ...base,
        focus: 'Spelling correction',
        bridgeTitle: 'Clean spelling helps English feel trustworthy and clear',
        whyNatural:
          explanation ||
          'Mercy mainly corrected spelling or word form, so the sentence reads more smoothly and looks more confident.',
        vietlishPattern:
          'This is not really a Vietlish logic issue. The sentence idea is already understandable. The main improvement is accurate spelling and cleaner word forms.',
        englishLogic:
          'In English writing, small form and agreement errors can distract the reader even when the idea is good. Clean wording makes the sentence feel more polished and reliable.',
        nextTimeTip:
          'After writing, scan slowly for verb endings, singular/plural forms, and whether the sentence sounds smooth when read aloud.',
        miniRule: 'Right idea + cleaner form = stronger English.',
        comparisonLabel: 'Spelling and polish pattern',
        vietlishExample: '',
        englishExample: '',
        keyShift: [
          'The meaning was already there. Mercy mainly cleaned the written form.',
          'A small form fix can make the whole sentence feel more fluent.',
        ],
      };

    case 'story_consistency':
      return {
        ...base,
        focus: 'Story consistency',
        bridgeTitle: 'Keep one story timeline and tone',
        whyNatural:
          explanation ||
          'Mercy adjusted the sentence so the story voice stays consistent from beginning to end.',
        vietlishPattern:
          'This is usually not a strong Vietlish issue. It is more about keeping the English story frame stable once the sentence is already in the past or in reflection mode.',
        englishLogic:
          'When English is telling a past event or imagining a result from that event, the later parts of the sentence usually stay in the same story frame.',
        nextTimeTip:
          'If the sentence is telling a past scene, check whether the final question or result still matches that same moment.',
        miniRule: 'One story frame, all the way through.',
        comparisonLabel: 'Story consistency pattern',
        vietlishExample: 'He studied all night. Will it be enough?',
        englishExample: 'He studied all night. Would it be enough?',
        keyShift: [
          'The sentence became more consistent with the story tone.',
          'Mercy is helping the paragraph sound like one continuous scene.',
        ],
      };

    case 'wording':
    case 'clarity':
      return {
        ...base,
        focus: 'Natural phrasing',
        bridgeTitle: 'Choose the smoother English line',
        whyNatural:
          explanation ||
          'Mercy changed the wording because English often prefers a more direct or more elegant phrasing, even when the original meaning is already correct.',
        vietlishPattern:
          'This is mostly a phrasing and style improvement, not a major Vietnamese-thinking error. Your meaning was already close.',
        englishLogic:
          'Natural English often chooses the version that sounds lighter, more direct, and easier to process in one read.',
        nextTimeTip:
          'When two versions feel possible, read them aloud and keep the one that sounds cleaner in one breath.',
        miniRule: 'Say it the clean way, not the heavy way.',
        comparisonLabel: 'Natural phrasing pattern',
        vietlishExample: 'Since he had a big exam that day, he chose a healthy breakfast.',
        englishExample: 'Knowing he had a big exam that day, he chose a healthy breakfast.',
        keyShift: [
          'Mercy is polishing phrasing, not changing your core meaning.',
          'The stronger English version usually feels lighter and more natural.',
        ],
      };

    case 'connector':
      return {
        ...base,
        focus: 'Connector control',
        bridgeTitle: 'Use one clear idea path',
        whyNatural:
          explanation ||
          'Mercy simplified the link between ideas so the sentence moves more cleanly.',
        vietlishPattern:
          'Vietnamese can rely more on context and flexible linking. English often sounds better when the sentence uses one clean connection instead of a heavy chain of translated links.',
        englishLogic:
          'In English, one strong connector is often enough. Too many connectors can make the line feel crowded or indirect.',
        nextTimeTip:
          'Choose the main relationship first: reason, result, contrast, or time. Then use only the connector you really need.',
        miniRule: 'One connector, one job.',
        comparisonLabel: 'Connector pattern',
        vietlishExample: 'I stayed home because I was tired so I did not go out.',
        englishExample: 'I stayed home because I was tired.',
        keyShift: [
          'Mercy is clearing the path between the ideas.',
          'English usually prefers one clean connector over several stacked ones.',
        ],
      };

    case 'be_verb':
      return {
        ...base,
        focus: 'Visible verb center',
        bridgeTitle: 'English usually needs the verb to appear clearly',
        whyNatural:
          explanation ||
          'Mercy made the sentence sound natural by making the verb center visible.',
        vietlishPattern:
          'Vietnamese can leave this kind of state meaning more to context. English usually wants the main verb, especially forms of “to be,” to appear clearly.',
        englishLogic:
          'Descriptions and conditions in English usually need a visible verb so the sentence feels complete.',
        nextTimeTip:
          'If you are describing a person, feeling, or condition, check whether am / is / are / was / were should be there.',
        miniRule: 'No clear sentence without a clear verb.',
        comparisonLabel: 'Be-verb structure pattern',
        vietlishExample: 'My sister very kind.',
        englishExample: 'My sister is very kind.',
        keyShift: [
          'Mercy made the sentence center visible.',
          'English description sentences usually need an explicit verb.',
        ],
      };

    case 'verb_tense':
      return {
        ...base,
        focus: 'Time and verb agreement',
        bridgeTitle: 'Match the verb to the time signal',
        whyNatural:
          explanation ||
          'Mercy changed the verb so the timeline is clear immediately.',
        vietlishPattern:
          'Vietnamese often lets the time word carry more of the timeline. English usually expects the verb form to support that timeline too.',
        englishLogic:
          'When English hears a past-time signal, it expects the verb to show the past as well.',
        nextTimeTip:
          'When you see yesterday, last, ago, or a past-time story, check the verb before anything else.',
        miniRule: 'Past time word = past verb.',
        comparisonLabel: 'Past-time verb pattern',
        vietlishExample: 'Yesterday I go to work very late.',
        englishExample: 'Yesterday I went to work very late.',
        keyShift: [
          'The timeline should appear in the verb, not only in the time word.',
          'Mercy is helping the sentence sound correct immediately.',
        ],
      };

    default:
      return base;
  }
}

function buildExamples(params: {
  original: string;
  corrected: string;
  enhanced: string;
  explanation: string;
  grammarPoints: string[];
  tense?: string;
}): ExamplePair[] {
  const insights = buildChangeInsights(params);
  const primaryInsight = getPrimaryInsight(
    insights,
    params.grammarPoints,
    params.explanation,
    params.tense,
  );

  switch (primaryInsight?.category) {
    case 'spelling':
      return [];

    case 'story_consistency':
      return [
        {
          weak: 'He worked so hard for the test. Will it be enough?',
          natural: 'He worked so hard for the test. Would it be enough?',
        },
        {
          weak: 'She had prepared for months. Will her plan succeed?',
          natural: 'She had prepared for months. Would her plan succeed?',
        },
      ];

    case 'wording':
    case 'clarity':
      return [
        {
          weak: 'Since he had a big exam that day, he chose a healthy breakfast.',
          natural: 'Knowing he had a big exam that day, he chose a healthy breakfast.',
        },
        {
          weak: 'Because she felt nervous, she tried to breathe slowly.',
          natural: 'Feeling nervous, she tried to breathe slowly.',
        },
      ];

    case 'connector':
      return [
        {
          weak: 'I stayed home because I was tired so I did not go out.',
          natural: 'I stayed home because I was tired.',
        },
        {
          weak: 'I was busy so because I had too much work.',
          natural: 'I was busy because I had too much work.',
        },
      ];

    case 'be_verb':
      return [
        {
          weak: 'My sister very kind.',
          natural: 'My sister is very kind.',
        },
        {
          weak: 'Yesterday I very tired.',
          natural: 'Yesterday I was very tired.',
        },
      ];

    case 'verb_tense':
      return [
        {
          weak: 'Yesterday I go to work very late.',
          natural: 'Yesterday I went to work very late.',
        },
        {
          weak: 'Last night I am very tired.',
          natural: 'Last night I was very tired.',
        },
      ];

    default:
      return [
        {
          weak: 'Today I very busy because many work.',
          natural: 'I am very busy today because I have a lot of work.',
        },
        {
          weak: 'I go there and after that very confused.',
          natural: 'I went there, and after that I felt very confused.',
        },
      ];
  }
}

function detectVietnameseGrammarNames(params: {
  originalText: string;
  correctedText: string;
  explanationText: string;
}): string[] {
  const original = params.originalText.toLowerCase();
  const corrected = params.correctedText.toLowerCase();
  const explanation = params.explanationText.toLowerCase();
  const labels: string[] = [];

  const looksPast =
    original.includes('yesterday') ||
    original.includes('last ') ||
    original.includes('ago') ||
    explanation.includes('past tense');

  const looksPresentSimple =
    explanation.includes('subject-verb agreement') ||
    explanation.includes('singular subject') ||
    /\bhe\s+\w+s\b/.test(corrected) ||
    /\bshe\s+\w+s\b/.test(corrected);

  if (looksPast) labels.push('Quá khứ đơn');
  if (looksPresentSimple) labels.push('Hiện tại đơn');
  if (explanation.includes('present perfect')) labels.push('Hiện tại hoàn thành');
  if (explanation.includes('preposition') || corrected.includes(' to him') || corrected.includes(' to her')) {
    labels.push('Giới từ');
  }
  if (explanation.includes('article') || /\b(a|an|the)\b/.test(corrected)) {
    labels.push('Mạo từ');
  }
  if (explanation.includes('punctuation') || corrected.includes(',') || corrected.includes('.')) {
    labels.push('Dấu câu');
  }
  if (explanation.includes('sentence structure') || explanation.includes('flow') || explanation.includes('clause')) {
    labels.push('Cấu trúc câu');
  }

  return Array.from(new Set(labels)).slice(0, 5);
}

function buildGentleLogicExplanation(params: {
  originalText: string;
  correctedText: string;
  enhancedText: string;
  explanationText: string;
  logic: LogicViewModel;
}): {
  intro: string;
  body: string[];
  grammarNames: string[];
} {
  const { originalText, correctedText, enhancedText, explanationText, logic } = params;
  const original = originalText.toLowerCase();
  const corrected = correctedText.toLowerCase();

  const grammarNames = detectVietnameseGrammarNames({
    originalText,
    correctedText,
    explanationText,
  });

  const body: string[] = [];
  let intro =
    'Mình giải thích nhẹ bằng tiếng Việt để bạn dễ thấy chỗ nào Mercy đang chỉnh và vì sao câu nghe tự nhiên hơn.';

  if (logic.focus === 'Spelling correction') {
    intro =
      'Câu này không phải lỗi “tư duy tiếng Việt” nặng. Chủ yếu mình đang chỉnh dạng từ, chia động từ, và vài chỗ cho câu gọn và đúng hơn.';
    body.push(
      'Ví dụ với chủ ngữ số ít như “the user”, tiếng Anh hiện tại đơn thường cần động từ có thêm -s: start → starts, spill → spills, catch → catches, arrive → arrives, forget → forgets, want → wants, need → needs.'
    );
    body.push(
      'Ngoài ra mình thêm dấu phẩy và tách ý rõ hơn để câu dài dễ đọc hơn. Khi một câu có nhiều hành động liên tiếp, tiếng Anh thường cần chia nhịp rõ ràng hơn.'
    );
    if (enhancedText && enhancedText !== correctedText) {
      body.push(
        'Bản tự nhiên hơn chỉ làm câu mượt hơn một chút, chứ không đổi ý của bạn.'
      );
    }
  } else if (logic.focus === 'Time and verb agreement') {
    intro =
      'Ở đây mình đang sửa theo thời gian của câu. Khi bạn kể chuyện đã xảy ra rồi, tiếng Anh thường dùng quá khứ đơn.';
    body.push(
      'Nếu có từ như yesterday, last, ago, động từ thường cũng phải lùi về quá khứ để người nghe hiểu ngay mốc thời gian.'
    );
  } else if (logic.focus === 'Visible verb center') {
    intro =
      'Ở đây Mercy đang làm cho câu có “trục câu” rõ hơn. Trong tiếng Anh, câu miêu tả thường cần động từ hiện ra đầy đủ.';
    body.push(
      'Ví dụ khi tả trạng thái hay cảm xúc, tiếng Anh thường cần am / is / are / was / were.'
    );
  } else if (logic.focus === 'Connector control') {
    intro =
      'Ở đây mình đang làm đường nối giữa các ý rõ hơn. Tiếng Anh thường thích một đường ý sạch và thẳng hơn.';
    body.push(
      'Nếu có quá nhiều connector hoặc nối ý quá dài, câu sẽ nặng và khó theo dõi.'
    );
  } else if (logic.focus === 'Natural phrasing') {
    intro =
      'Ý của bạn đã đúng khá nhiều rồi. Ở đây Mercy chủ yếu làm câu nhẹ hơn và tự nhiên hơn khi người bản xứ đọc.';
    body.push(
      'Tiếng Anh tự nhiên thường chọn cách nói gọn, thẳng, và mượt hơn thay vì giữ nguyên cách sắp ý nặng.'
    );
  } else {
    body.push(
      'Mercy đang chỉ ra điều gì thực sự thay đổi trong câu, để bạn hiểu đúng chỗ cần nhớ thay vì học quá nhiều cùng lúc.'
    );
  }

  if (
    corrected.includes(' to him') ||
    corrected.includes(' to her') ||
    corrected.includes(' to them') ||
    corrected.includes(' to me')
  ) {
    body.push(
      'Có chỗ mình cũng chỉnh giới từ cho đúng. Ví dụ trong tiếng Anh thường là “listen to someone”, không phải “listen someone”.'
    );
  }

  if (explanationText.toLowerCase().includes('subject-verb agreement')) {
    body.push(
      'Một điểm quan trọng nữa là hòa hợp chủ ngữ – động từ. Chủ ngữ số ít thường kéo theo dạng động từ khác với số nhiều.'
    );
  }

  return { intro, body, grammarNames };
}

function buildGuidedVietnameseHint(params: {
  logic: LogicViewModel;
  explanationText: string;
  originalText: string;
  correctedText: string;
}): string {
  const grammarNames = detectVietnameseGrammarNames({
    originalText: params.originalText,
    correctedText: params.correctedText,
    explanationText: params.explanationText,
  });

  if (grammarNames.length > 0) {
    return `Gợi ý ngắn: điểm chính ở đây là ${grammarNames.join(' • ')}.`;
  }

  if (params.logic.focus === 'Spelling correction') {
    return 'Gợi ý ngắn: đây chủ yếu là chỉnh dạng từ và độ mượt của câu.';
  }

  return 'Gợi ý ngắn: Mercy đang làm câu rõ hơn và tự nhiên hơn.';
}

export default function EnglishLogicTab({
  roomTitle,
  contentEn,
  troubleWords,
  learningSupportMode = 'gentle',
  latestTeacherWritingState,
  latestAnalysisResult,
  pendingPronunciationPayload,
  onOpenPronunciation,
  onOpenWriting,
  onMemoryUpdate,
  isKidsMode = false,
  kidsModeAgeBand,
  teacherLabel,
}: Props) {
  const lastMemorySignatureRef = useRef<string>('');

  const originalText = cleanText(
    latestTeacherWritingState?.latestSubmittedText ||
      latestTeacherWritingState?.revisionSourceText ||
      pendingPronunciationPayload?.sourceText,
  );

  const correctedText = cleanText(
    latestAnalysisResult?.correctedText || pendingPronunciationPayload?.correctedText,
  );

  const enhancedText = cleanText(
    latestAnalysisResult?.enhancedText || pendingPronunciationPayload?.enhancedText,
  );

  const explanationText = cleanText(latestAnalysisResult?.explanation);
  const grammarPoints = asList(
    (latestAnalysisResult as { grammarPoints?: unknown } | null | undefined)?.grammarPoints,
  );
  const tenseText = cleanText(
    (
      latestAnalysisResult as
        | {
            tenseAnalysis?: { likelyMainTense?: string | null } | null;
          }
        | null
        | undefined
    )?.tenseAnalysis?.likelyMainTense,
  );

  const logic = useMemo(
    () =>
      buildGroundedLogicViewModel({
        original: originalText,
        corrected: correctedText,
        enhanced: enhancedText,
        explanation: explanationText,
        grammarPoints,
        tense: tenseText,
      }),
    [originalText, correctedText, enhancedText, explanationText, grammarPoints, tenseText],
  );

  const examples = useMemo(
    () =>
      buildExamples({
        original: originalText,
        corrected: correctedText,
        enhanced: enhancedText,
        explanation: explanationText,
        grammarPoints,
        tense: tenseText,
      }),
    [originalText, correctedText, enhancedText, explanationText, grammarPoints, tenseText],
  );

  const displayImprovedText = enhancedText || correctedText;
  const practiceLine = displayImprovedText || originalText;
  const shouldShowComparisonExamples =
    logic.focus !== 'Spelling correction' &&
    Boolean(logic.vietlishExample) &&
    Boolean(logic.englishExample);
  const shouldShowPatternExamples =
    logic.focus !== 'Spelling correction' && examples.length > 0;

  const gentleLogicExplanation = useMemo(
    () =>
      buildGentleLogicExplanation({
        originalText,
        correctedText,
        enhancedText,
        explanationText,
        logic,
      }),
    [originalText, correctedText, enhancedText, explanationText, logic],
  );

  const guidedHint = useMemo(
    () =>
      buildGuidedVietnameseHint({
        logic,
        explanationText,
        originalText,
        correctedText,
      }),
    [logic, explanationText, originalText, correctedText],
  );

  const pronunciationPayload = useMemo<PronunciationLaunchPayload | null>(() => {
    if (!practiceLine) return null;

    return {
      sourceText: originalText || practiceLine,
      correctedText: correctedText || enhancedText || originalText || practiceLine,
      enhancedText: enhancedText || undefined,
    };
  }, [correctedText, enhancedText, originalText, practiceLine]);

  const troubleWordList = useMemo(() => {
    if (!Array.isArray(troubleWords)) return [];
    return troubleWords
      .map((item) => {
        if (typeof item === 'string') return cleanText(item);
        if (item && typeof item === 'object' && 'word' in item) {
          return cleanText((item as { word?: string | null }).word);
        }
        return '';
      })
      .filter(Boolean)
      .slice(0, 6);
  }, [troubleWords]);

  const tokenChanges = useMemo(() => {
    const improved = displayImprovedText || '';
    return {
      removed: getRemovedTokens(originalText, improved),
      added: getAddedTokens(originalText, improved),
    };
  }, [originalText, displayImprovedText]);

  const fallbackContext = cleanText(contentEn)
    ? cleanText(contentEn).slice(0, 280)
    : `Mercy will explain how your English sentence works more naturally than direct Vietnamese-style translation${roomTitle ? ` in ${roomTitle}` : ''}.`;

  const hasLesson = Boolean(originalText || correctedText || enhancedText);

  useEffect(() => {
    if (!hasLesson || !onMemoryUpdate || isKidsMode) return;

    const logicPattern = buildLogicPatternMemory(logic.comparisonLabel);
    const signature = JSON.stringify({
      originalText,
      correctedText,
      enhancedText,
      focus: logic.focus,
      bridgeTitle: logic.bridgeTitle,
      comparisonLabel: logic.comparisonLabel,
    });

    if (signature === lastMemorySignatureRef.current) return;
    lastMemorySignatureRef.current = signature;

    onMemoryUpdate({
      logic: {
        vietlishPatterns: [logicPattern],
        bridgesLearned: [logic.bridgeTitle],
        currentLogicFocus: [logic.focus],
      },
    });
  }, [
    correctedText,
    enhancedText,
    hasLesson,
    isKidsMode,
    logic.bridgeTitle,
    logic.comparisonLabel,
    logic.focus,
    onMemoryUpdate,
    originalText,
  ]);

  if (isKidsMode) {
    const kidsTeacherName = cleanText(teacherLabel) || 'Teacher Mercy';
    const kidsAgeLabel = cleanText(kidsModeAgeBand) || '3–4';
    const kidsPracticeLine = practiceLine || 'Hello.';

    return (
      <div className="m-0 flex-1 overflow-hidden">
        <ScrollArea className="h-full bg-gradient-to-br from-[#FFF8F1] via-[#FFFDFC] to-[#F8F7FF]">
          <div className="space-y-5 p-4 md:p-5">
            <div className="rounded-[28px] border border-orange-100/80 bg-gradient-to-br from-[#FFF7ED] via-white to-[#FFFDF8] p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
              <div className="space-y-2">
                <h2 className="text-[1.75rem] font-semibold tracking-tight text-slate-900">
                  {kidsTeacherName} kids mode
                </h2>
                <p className="max-w-4xl text-[15px] leading-7 text-slate-700">
                  Logic is off for ages {kidsAgeLabel}. Keep the lesson simple: listen first, then say the same line with Mercy.
                </p>

                <div className="rounded-2xl border border-sky-100 bg-sky-50/70 px-4 py-3 text-[15px] leading-7 text-sky-900">
                  <p>
                    <strong>Giải thích ngắn:</strong> với bé nhỏ, mình không mở phần phân tích logic. Chỉ cần nghe mẫu, nói lại, và lặp lại cùng một câu ngắn.
                  </p>
                </div>
              </div>

              <section className="mt-6 rounded-[28px] border border-white/80 bg-white/92 p-5 shadow-[0_10px_28px_rgba(148,163,184,0.06)]">
                <div className="flex items-center gap-2">
                  <Mic className="h-4 w-4 text-sky-500" />
                  <p className="text-sm font-semibold text-slate-900">
                    Best line to say now
                  </p>
                </div>

                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Practice line
                  </p>
                  <p className="mt-2 text-lg leading-8 text-slate-700">
                    {kidsPracticeLine}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (pronunciationPayload) {
                        onOpenPronunciation?.(pronunciationPayload);
                        return;
                      }
                      onOpenPronunciation?.();
                    }}
                    className="rounded-2xl border-sky-200 bg-white hover:bg-sky-50"
                  >
                    <Mic className="mr-2 h-4 w-4" />
                    Open Speak
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={onOpenWriting}
                    className="rounded-2xl hover:bg-slate-100"
                  >
                    <PenSquare className="mr-2 h-4 w-4" />
                    Change the line
                  </Button>
                </div>
              </section>

              <section className="rounded-[28px] border border-emerald-100/70 bg-gradient-to-r from-emerald-50/80 to-white p-5 shadow-[0_10px_28px_rgba(16,185,129,0.05)]">
                <div className="flex items-start gap-2">
                  <RotateCcw className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Mercy’s next step</p>
                    <p className="mt-1 text-sm leading-6 text-slate-700">
                      Tap Speak, play the line, then let the child say the same words slowly one more time.
                    </p>

                    <p className="mt-2 text-[15px] leading-7 text-emerald-900">
                      <strong>Bước tiếp theo:</strong> bấm Speak, nghe Mercy đọc mẫu, rồi cho bé nói lại đúng câu đó thêm một lần.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="m-0 flex-1 overflow-hidden">
      <ScrollArea className="h-full bg-gradient-to-br from-[#FFF8F1] via-[#FFFDFC] to-[#F8F7FF]">
        <div className="space-y-5 p-4 md:p-5">
          <div className="rounded-[28px] border border-orange-100/80 bg-gradient-to-br from-[#FFF7ED] via-white to-[#FFFDF8] p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
            <div className="space-y-2">
              <h2 className="text-[1.75rem] font-semibold tracking-tight text-slate-900">
                English Logic
              </h2>
              <p className="max-w-4xl text-[15px] leading-7 text-slate-700">
                Mercy explains what really changed in this sentence, and only shows a Vietlish logic lesson when the sentence actually needs one.
              </p>

              {learningSupportMode === 'gentle' ? (
                <div className="rounded-2xl border border-sky-100 bg-sky-50/70 px-4 py-3 text-[15px] leading-7 text-sky-900">
                  <p>
                    <strong>Giải thích nhẹ bằng tiếng Việt:</strong> Ở chế độ này, Mercy sẽ nói rõ hơn bằng tiếng Việt, gọi tên điểm ngữ pháp như <strong>quá khứ đơn</strong>, <strong>hiện tại đơn</strong>, <strong>hiện tại hoàn thành</strong>, <strong>giới từ</strong>, <strong>mạo từ</strong>, và <strong>cấu trúc câu</strong>.
                  </p>
                </div>
              ) : null}

              {learningSupportMode === 'guided' ? (
                <div className="rounded-2xl border border-sky-100 bg-sky-50/70 px-4 py-3 text-sm leading-6 text-sky-900">
                  <p>{guidedHint}</p>
                </div>
              ) : null}
            </div>

            {!hasLesson ? (
              <section className="mt-6 rounded-[28px] border border-orange-100/80 bg-gradient-to-br from-[#FFFDF9] via-white to-[#FDF7F2] p-6 shadow-[0_10px_28px_rgba(148,163,184,0.06)] md:p-8">
                <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFF0E8] via-[#FFE4D6] to-[#FFF5EF] shadow-sm">
                    <Languages className="h-8 w-8 text-[#E07050]" />
                  </div>

                  <p className="mt-5 text-[1.9rem] font-semibold tracking-tight text-slate-900">
                    No learner sentence yet
                  </p>
                  <p className="mt-3 max-w-2xl text-[15px] leading-7 text-slate-700">
                    {fallbackContext}
                  </p>

                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <Button
                      type="button"
                      onClick={onOpenWriting}
                      className="rounded-2xl bg-gradient-to-r from-[#FF8A65] to-[#FF6F61] px-5 text-white shadow-[0_10px_24px_rgba(255,111,97,0.22)] hover:brightness-[1.03]"
                    >
                      <PenSquare className="mr-2 h-4 w-4" />
                      Open Grammar & Writing
                    </Button>
                  </div>
                </div>
              </section>
            ) : (
              <div className="mt-6 space-y-4">
                <section className="rounded-[28px] border border-white/80 bg-white/92 p-5 shadow-[0_10px_28px_rgba(148,163,184,0.06)]">
                  <div className="flex items-center gap-2">
                    <Languages className="h-4 w-4 text-violet-500" />
                    <p className="text-sm font-semibold text-slate-900">
                      Your sentence vs natural English
                    </p>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_4px_14px_rgba(15,23,42,0.03)]">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Your sentence
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-700">
                        {originalText || 'No original sentence captured.'}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/80 to-white p-4 shadow-[0_4px_14px_rgba(168,85,247,0.06)]">
                      <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">
                        Natural English
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-700">
                        {enhancedText || correctedText || 'No improved sentence yet.'}
                      </p>
                    </div>
                  </div>

                  {learningSupportMode === 'gentle' ? (
                    <div className="mt-4 rounded-2xl border border-violet-100 bg-violet-50/60 p-4 text-[15px] leading-7 text-violet-900">
                      <p>
                        <strong>Nói ngắn gọn bằng tiếng Việt:</strong> bên trái là câu bạn viết, bên phải là bản tiếng Anh đã được làm mượt và rõ hơn. Mục tiêu là để bạn nhìn ra chính xác chỗ Mercy sửa, chứ không phải chỉ đọc kết quả cuối cùng.
                      </p>
                    </div>
                  ) : null}
                </section>

                <section className="rounded-[28px] border border-white/80 bg-white/92 p-5 shadow-[0_10px_28px_rgba(148,163,184,0.06)]">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                    <p className="text-sm font-semibold text-slate-900">{logic.bridgeTitle}</p>
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div className="space-y-4 text-sm">
                      <div className="rounded-2xl border border-orange-100/70 bg-gradient-to-r from-orange-50/70 to-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Main focus
                        </p>
                        <p className="mt-1 text-slate-700">{logic.focus}</p>

                        {learningSupportMode !== 'immersion' && gentleLogicExplanation.grammarNames.length > 0 ? (
                          <p className="mt-2 text-sm leading-6 text-orange-800">
                            <strong>Tên điểm ngữ pháp:</strong>{' '}
                            {gentleLogicExplanation.grammarNames.join(' • ')}
                          </p>
                        ) : null}
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Why Mercy changed it
                        </p>
                        <p className="mt-1 text-slate-700">{logic.whyNatural}</p>

                        {learningSupportMode === 'gentle' ? (
                          <div className="mt-3 space-y-3 rounded-2xl border border-amber-100 bg-amber-50/60 p-4 text-[15px] leading-7 text-amber-900">
                            <p>
                              <strong>Giải thích nhẹ:</strong> {gentleLogicExplanation.intro}
                            </p>
                            {gentleLogicExplanation.body.map((item) => (
                              <p key={item}>{item}</p>
                            ))}
                          </div>
                        ) : null}

                        {learningSupportMode === 'guided' ? (
                          <p className="mt-2 text-sm leading-6 text-amber-700">{guidedHint}</p>
                        ) : null}
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          English thinking
                        </p>
                        <p className="mt-1 text-slate-700">{logic.englishLogic}</p>

                        {learningSupportMode === 'gentle' ? (
                          <p className="mt-2 text-[15px] leading-7 text-sky-900">
                            <strong>Hiểu theo tiếng Việt:</strong> đây là cách tiếng Anh “muốn” câu được dựng lên. Nhiều khi ý của bạn đúng rồi, nhưng tiếng Anh vẫn cần động từ, dạng từ, dấu câu, hoặc nhịp câu rõ hơn để nghe tự nhiên.
                          </p>
                        ) : null}
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Key shift
                        </p>
                        <div className="mt-2 space-y-2">
                          {logic.keyShift.map((item) => (
                            <div key={item} className="flex items-start gap-2">
                              <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                              <p className="text-slate-700">{item}</p>
                            </div>
                          ))}
                        </div>

                        {learningSupportMode === 'gentle' ? (
                          <div className="mt-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 text-[15px] leading-7 text-emerald-900">
                            <p>
                              <strong>Tóm lại bằng tiếng Việt:</strong> ý của bạn đã có sẵn, Mercy đang giúp câu đúng dạng hơn, gọn hơn, và tự nhiên hơn khi người bản xứ đọc.
                            </p>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="space-y-4 text-sm">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Vietnamese thinking pattern
                        </p>
                        <p className="mt-1 text-slate-700">{logic.vietlishPattern}</p>

                        {learningSupportMode === 'gentle' ? (
                          <p className="mt-2 text-[15px] leading-7 text-rose-900">
                            <strong>Nói dễ hiểu:</strong> chỗ này không hẳn là “dịch từ tiếng Việt sang tiếng Anh” quá mạnh. Phần lớn là Mercy đang sửa cho câu sạch hơn về dạng từ, chia động từ, và cách nối ý.
                          </p>
                        ) : null}
                      </div>

                      <div className="rounded-2xl border border-purple-100/70 bg-gradient-to-r from-purple-50/70 to-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Sentence pattern to remember
                        </p>
                        <p className="mt-1 text-slate-700">{logic.sentencePattern}</p>

                        {learningSupportMode === 'gentle' ? (
                          <p className="mt-2 text-[15px] leading-7 text-purple-900">
                            <strong>Mẫu câu nên nhớ:</strong> khi câu có nhiều ý, hãy cố giữ một trục rõ: chủ ngữ + động từ + phần bổ sung, rồi mới nối thêm ý phụ.
                          </p>
                        ) : null}
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Quick rule
                        </p>
                        <p className="mt-1 text-slate-700">{logic.miniRule}</p>

                        {learningSupportMode === 'gentle' ? (
                          <p className="mt-2 text-[15px] leading-7 text-slate-800">
                            <strong>Nhớ nhanh bằng tiếng Việt:</strong> đừng cố giữ nguyên cách nghĩ tiếng Việt từng chữ. Hãy ưu tiên câu tiếng Anh nghe rõ và tròn ý.
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {shouldShowComparisonExamples ? (
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <div className="rounded-2xl border border-rose-100 bg-rose-50/70 p-4 shadow-[0_4px_14px_rgba(244,63,94,0.04)]">
                        <p className="text-xs font-semibold uppercase tracking-wide text-rose-600">
                          Less natural English
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-700">{logic.vietlishExample}</p>
                      </div>

                      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 shadow-[0_4px_14px_rgba(16,185,129,0.04)]">
                        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                          More natural English
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-700">{logic.englishExample}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 rounded-2xl border border-sky-100 bg-gradient-to-r from-sky-50/80 to-white p-4 text-sm shadow-[0_4px_14px_rgba(59,130,246,0.04)]">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Mercy note
                      </p>
                      <p className="mt-2 text-slate-700">
                        This was mainly a polish fix, not a full English-pattern lesson. Mercy cleaned the spelling or wording, so there is no need to force a fake “less natural vs more natural” comparison here.
                      </p>

                      {learningSupportMode === 'gentle' ? (
                        <p className="mt-2 text-[15px] leading-7 text-sky-900">
                          <strong>Giải thích bằng tiếng Việt:</strong> chỗ này chủ yếu là chỉnh câu cho sạch và đúng hơn thôi, chưa cần biến thành một bài học logic lớn.
                        </p>
                      ) : null}
                    </div>
                  )}

                  <div className="mt-4 rounded-2xl border border-sky-100 bg-gradient-to-r from-sky-50/80 to-white p-4 text-sm shadow-[0_4px_14px_rgba(59,130,246,0.04)]">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Try this next time
                    </p>
                    <div className="mt-2 flex items-start gap-2">
                      <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      <p className="text-slate-700">{logic.nextTimeTip}</p>
                    </div>

                    {learningSupportMode === 'gentle' ? (
                      <p className="mt-2 text-[15px] leading-7 text-sky-900">
                        <strong>Gợi ý nhẹ:</strong> sau khi viết xong, hãy nhìn lại đuôi động từ, chủ ngữ số ít/số nhiều, và thử đọc câu thành tiếng. Nếu đọc bị vấp, câu thường vẫn còn chỗ cần sửa.
                      </p>
                    ) : null}
                  </div>
                </section>

                <section className="rounded-[28px] border border-white/80 bg-white/92 p-5 shadow-[0_10px_28px_rgba(148,163,184,0.06)]">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-sky-500" />
                    <p className="text-sm font-semibold text-slate-900">
                      What changed inside your sentence
                    </p>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_4px_14px_rgba(15,23,42,0.03)]">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Words or patterns removed
                      </p>
                      {tokenChanges.removed.length > 0 ? (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {tokenChanges.removed.map((token) => (
                            <span
                              key={token}
                              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700"
                            >
                              {token}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-2 text-sm text-slate-600">
                          Mercy mostly refined structure instead of removing many words.
                        </p>
                      )}
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_4px_14px_rgba(15,23,42,0.03)]">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Words or patterns added
                      </p>
                      {tokenChanges.added.length > 0 ? (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {tokenChanges.added.map((token) => (
                            <span
                              key={token}
                              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700"
                            >
                              {token}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-2 text-sm text-slate-600">
                          Mercy kept your wording close and mainly improved flow.
                        </p>
                      )}
                    </div>
                  </div>

                  {learningSupportMode === 'gentle' ? (
                    <div className="mt-4 rounded-2xl border border-orange-100 bg-orange-50/60 p-4 text-[15px] leading-7 text-orange-900">
                      <p>
                        <strong>Hiểu nhanh bằng tiếng Việt:</strong> phần này giúp bạn thấy cụ thể từ nào hoặc mẫu nào đã được bỏ đi, và từ nào được thêm vào để câu chuẩn hơn.
                      </p>
                    </div>
                  ) : null}
                </section>

                {shouldShowPatternExamples ? (
                  <section className="rounded-[28px] border border-white/80 bg-white/92 p-5 shadow-[0_10px_28px_rgba(148,163,184,0.06)]">
                    <p className="text-sm font-semibold text-slate-900">
                      Sentence pattern examples
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      These examples now follow the real change Mercy noticed in your sentence.
                    </p>

                    {learningSupportMode === 'gentle' ? (
                      <p className="mt-2 text-[15px] leading-7 text-slate-800">
                        <strong>Ví dụ bằng tiếng Việt:</strong> đây là vài cặp câu để bạn nhìn nhanh cách một câu “ít tự nhiên” chuyển thành câu “tự nhiên hơn”.
                      </p>
                    ) : null}

                    <div className="mt-4 grid gap-3">
                      {examples.map((example, index) => (
                        <div
                          key={`${example.weak}-${index}`}
                          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_4px_14px_rgba(15,23,42,0.03)]"
                        >
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Example {index + 1}
                          </p>

                          <div className="mt-3 grid gap-3 md:grid-cols-2">
                            <div className="rounded-2xl border border-rose-100 bg-rose-50/60 p-3">
                              <p className="text-xs font-semibold uppercase tracking-wide text-rose-600">
                                Less natural English
                              </p>
                              <p className="mt-1 text-sm text-slate-700">{example.weak}</p>
                            </div>

                            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3">
                              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                                More natural English
                              </p>
                              <p className="mt-1 text-sm text-slate-700">{example.natural}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                ) : null}

                <section className="rounded-[28px] border border-white/80 bg-white/92 p-5 shadow-[0_10px_28px_rgba(148,163,184,0.06)]">
                  <p className="text-sm font-semibold text-slate-900">How this connects to speaking</p>
                  <p className="mt-2 text-sm text-slate-600">
                    Practice the improved line aloud so your mouth learns the same structure your mind just studied.
                  </p>

                  {learningSupportMode === 'gentle' ? (
                    <p className="mt-2 text-[15px] leading-7 text-slate-800">
                      <strong>Nói bằng tiếng Việt:</strong> sau khi hiểu logic của câu, bạn nên đọc câu đã sửa thành tiếng. Khi miệng quen với câu đúng, lần sau viết cũng sẽ tự nhiên hơn.
                    </p>
                  ) : null}

                  <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Best line to practice
                    </p>
                    <p className="mt-2 text-sm text-slate-700">
                      {practiceLine || 'Open Pronunciation after Grammar to practice the improved line.'}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (pronunciationPayload) {
                          onOpenPronunciation?.(pronunciationPayload);
                          return;
                        }
                        onOpenPronunciation?.();
                      }}
                      className="rounded-2xl border-sky-200 bg-white hover:bg-sky-50"
                    >
                      <Mic className="mr-2 h-4 w-4" />
                      Say this sentence
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      onClick={onOpenWriting}
                      className="rounded-2xl hover:bg-slate-100"
                    >
                      <PenSquare className="mr-2 h-4 w-4" />
                      Rewrite this sentence
                    </Button>
                  </div>
                </section>

                <section className="rounded-[28px] border border-emerald-100/70 bg-gradient-to-r from-emerald-50/80 to-white p-5 shadow-[0_10px_28px_rgba(16,185,129,0.05)]">
                  <div className="flex items-start gap-2">
                    <RotateCcw className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Mercy’s next step</p>
                      <p className="mt-1 text-sm leading-6 text-slate-700">
                        Good. You understood the exact change Mercy made in this sentence. Now try another real sentence, or rewrite this same idea more clearly and let Mercy guide you again.
                      </p>

                      {learningSupportMode === 'gentle' ? (
                        <p className="mt-2 text-[15px] leading-7 text-emerald-900">
                          <strong>Bước tiếp theo bằng tiếng Việt:</strong> hãy thử viết lại cùng ý đó thêm một lần nữa. Mục tiêu không phải viết “hay” ngay, mà là viết ngày càng rõ hơn và đúng hơn.
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      type="button"
                      onClick={onOpenWriting}
                      className="rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-[0_10px_24px_rgba(16,185,129,0.22)] hover:from-emerald-500 hover:to-teal-600"
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Try this sentence again
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={onOpenWriting}
                      className="rounded-2xl border-slate-300 bg-white hover:bg-slate-50"
                    >
                      <PenSquare className="mr-2 h-4 w-4" />
                      Rewrite this sentence
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        if (pronunciationPayload) {
                          onOpenPronunciation?.(pronunciationPayload);
                          return;
                        }
                        onOpenPronunciation?.();
                      }}
                      className="rounded-2xl hover:bg-emerald-100/60"
                    >
                      <Mic className="mr-2 h-4 w-4" />
                      Say it again
                    </Button>
                  </div>
                </section>

                {(grammarPoints.length > 0 || troubleWordList.length > 0) && (
                  <section className="rounded-[28px] border border-white/80 bg-white/92 p-5 shadow-[0_10px_28px_rgba(148,163,184,0.06)]">
                    <p className="text-sm font-semibold text-slate-900">Patterns Mercy notices</p>

                    {grammarPoints.length > 0 ? (
                      <div className="mt-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Grammar points
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {grammarPoints.map((point) => (
                            <span
                              key={point}
                              className="rounded-full border border-orange-100 bg-orange-50 px-3 py-1 text-xs font-medium text-slate-700"
                            >
                              {point}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {troubleWordList.length > 0 ? (
                      <div className="mt-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Pronunciation watch words
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {troubleWordList.map((word) => (
                            <span
                              key={word}
                              className="rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-xs font-medium text-slate-700"
                            >
                              {word}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {learningSupportMode === 'gentle' ? (
                      <p className="mt-3 text-[15px] leading-7 text-slate-800">
                        <strong>Gợi ý bằng tiếng Việt:</strong> đây là những mẫu Mercy đang để ý lặp lại. Nếu bạn nhìn thấy một mẫu xuất hiện nhiều lần, đó thường là điểm nên luyện trước.
                      </p>
                    ) : null}
                  </section>
                )}
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}