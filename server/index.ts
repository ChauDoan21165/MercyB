// PATH: server/index.ts

import express from 'express';
import cors from 'cors';
import { makeTeachingDecision } from './mercy/decision';
import {
  createEmptyLearnerMemory,
  updateLearnerMemory,
  getDueReviews,
} from './mercy/memory';
import type {
  AnalysisResult,
  LearnerMemory,
  TeachingDecision,
} from './mercy/types';

console.log('🔥 NEW MERCY SERVER ACTIVE');

const app = express();

app.use(cors());
app.use(express.json());

const learnerMemoryStore = new Map<string, LearnerMemory>();

type GrammarIssue = {
  original: string;
  corrected: string;
  reason: string;
  category?: string;
  grammarPoint?: string;
};

type QuickFixTask = {
  type: 'quickFix';
  focus: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  priority: number;
};

type ContrastTask = {
  type: 'contrast';
  focus: string;
  question: string;
  examples: string[];
  explanation: string;
  priority: number;
};

type ProductionTask = {
  type: 'production';
  focus: string;
  instruction: string;
  targetPattern?: string;
  priority: number;
};

type LinkingTask = {
  type: 'linking';
  focus: string;
  instruction: string;
  pairs?: string[];
  targetPattern?: string;
  explanation?: string;
  priority: number;
};

type RewriteTask = {
  type: 'rewrite';
  focus: string;
  instruction: string;
  sourceText?: string;
  targetPattern?: string;
  explanation?: string;
  priority: number;
};

type ReviewTask = {
  type: 'review';
  focus: string;
  instruction: string;
  targetPattern?: string;
  explanation?: string;
  priority: number;
};

type PracticeTask =
  | QuickFixTask
  | ContrastTask
  | ProductionTask
  | LinkingTask
  | RewriteTask
  | ReviewTask;

type PracticeBlock = {
  mode: 'coach' | 'explain' | 'challenge';
  tasks: PracticeTask[];
  quickFix?: {
    question: string;
    options: string[];
    answer: string;
    explanation: string;
  };
  contrast?: {
    question: string;
    examples: string[];
    explanation: string;
  };
  production?: {
    instruction: string;
  };
};

type AdvancedPattern = {
  name: string;
  example: string;
  explanation: string;
  level?: 'basic' | 'intermediate' | 'advanced';
};

type StructureAnalysis = {
  sentenceCount: number;
  complexity: 'basic' | 'intermediate' | 'advanced';
  variety: string[];
};

type TenseProfile = {
  primary: string;
  distribution: Record<string, number>;
};

type GrammarGlossItem = {
  key: string;
  label: string;
  glossVi: string;
};

type WritingMode = 'sentence' | 'paragraph' | 'essay';

type ParagraphAnalysis = {
  flow: 'weak' | 'developing' | 'strong';
  tenseConsistency: 'weak' | 'mixed but controlled' | 'strong';
  ideaConnection: 'weak' | 'developing' | 'strong';
  notes: string[];
};

type GrammarResponse = {
  correctedText: string;
  enhancedText?: string;
  editedVersion?: string;
  explanation?: string;
  issues?: GrammarIssue[];
  grammarPoints?: string[];
  grammarGloss?: GrammarGlossItem[];
  tenseAnalysis?: {
    detected: string[];
    likelyMainTense: string | null;
    dominantTenseProfile: TenseProfile;
    notes: string[];
  };
  score?: {
    grammar: number;
    clarity: number;
    naturalness: number;
  };
  practice?: PracticeBlock;
  overallAssessment?: string;
  levelSignal?: string;
  teachingPoints?: string[];
  advancedPatterns?: AdvancedPattern[];
  structureAnalysis?: StructureAnalysis;
  writingMode?: WritingMode;
  paragraphAnalysis?: ParagraphAnalysis;
  debugServerVersion?: string;
  decision?: TeachingDecision;
  memory?: LearnerMemory;
};

const grammarGlossMap: Record<string, { label: string; glossVi: string }> = {
  'simple past': {
    label: 'Simple Past',
    glossVi: 'thì quá khứ đơn',
  },
  'present continuous': {
    label: 'Present Continuous',
    glossVi: 'thì hiện tại tiếp diễn',
  },
  'present perfect': {
    label: 'Present Perfect',
    glossVi: 'thì hiện tại hoàn thành',
  },
  'present perfect continuous': {
    label: 'Present Perfect Continuous',
    glossVi: 'thì hiện tại hoàn thành tiếp diễn',
  },
  'present simple': {
    label: 'Present Simple',
    glossVi: 'thì hiện tại đơn',
  },
  'relative clause': {
    label: 'Relative Clause',
    glossVi: 'mệnh đề quan hệ',
  },
  'contrast clause': {
    label: 'Contrast Clause',
    glossVi: 'mệnh đề tương phản',
  },
  'interrogative structure': {
    label: 'Interrogative Structure',
    glossVi: 'cấu trúc câu hỏi',
  },
  'negative adverbial inversion': {
    label: 'Negative Adverbial Inversion',
    glossVi: 'đảo ngữ sau trạng từ phủ định / giới hạn',
  },
  'perfect participle clause': {
    label: 'Perfect Participle Clause',
    glossVi: 'mệnh đề phân từ hoàn thành',
  },
  'habitual expression': {
    label: 'Habitual Expression',
    glossVi: 'cụm diễn tả thói quen',
  },
  'time marker': {
    label: 'Time Marker',
    glossVi: 'dấu hiệu thời gian',
  },
  'linking devices': {
    label: 'Linking Devices',
    glossVi: 'từ nối',
  },
  cohesion: {
    label: 'Cohesion',
    glossVi: 'liên kết ý',
  },
  coherence: {
    label: 'Coherence',
    glossVi: 'mạch lạc',
  },
  'paragraph flow': {
    label: 'Paragraph Flow',
    glossVi: 'mạch chảy đoạn văn',
  },
  'idea connection': {
    label: 'Idea Connection',
    glossVi: 'liên kết ý tưởng',
  },
};

function capitalizeFirst(text: string) {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function ensureEndingPunctuation(text: string) {
  const trimmed = text.trim();
  if (!trimmed) return trimmed;
  if (/[.!?]$/.test(trimmed)) return trimmed;
  return `${trimmed}.`;
}

function pushIssue(
  issues: GrammarIssue[],
  original: string,
  corrected: string,
  reason: string,
  category?: string,
  grammarPoint?: string
) {
  issues.push({
    original,
    corrected,
    reason,
    category,
    grammarPoint,
  });
}

function unique<T>(items: T[]) {
  return [...new Set(items)];
}

function sentenceSplit(text: string) {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function hasPastTimeMarker(text: string) {
  return /\b(last year|last month|last week|yesterday|ago|this morning|in \d{4})\b/i.test(text);
}

function hasCurrentPeriodMarker(text: string) {
  return /\b(this year|this month|this week|recently|lately|so far)\b/i.test(text);
}

function hasNowMarker(text: string) {
  return /\b(now|right now|at the moment|currently)\b/i.test(text);
}

function hasQuestionForm(sentence: string) {
  return /^(What|Why|How|When|Where|Who|Whom|Whose|Which|Is|Are|Do|Does|Did|Can|Could|Should|Would|Will|Have|Has|Had)\b/.test(
    sentence.trim()
  );
}

function hasNegativeAdverbialInversion(sentence: string) {
  return /^(Never|Rarely|Seldom|Hardly ever|Not only|Under no circumstances|No sooner|Little)\b/i.test(
    sentence.trim()
  );
}

function hasHabitualExpression(sentence: string) {
  return /\b(every day|every morning|every single morning|usually|often|always|normally|regularly)\b/i.test(
    sentence
  );
}

function detectPresentSimpleHabit(sentence: string) {
  return /\b(works|builds|goes|plays|studies|lives|knows|wants|needs|likes|jumps|runs|walks|reads|writes|speaks)\b/i.test(
    sentence
  );
}

function detectPresentSimpleSentence(sentence: string) {
  if (hasQuestionForm(sentence)) return false;
  return (
    detectPresentSimpleHabit(sentence) ||
    (hasHabitualExpression(sentence) &&
      /\b(is|are|do|does|has|have|jumps|runs|goes|works|plays)\b/i.test(sentence))
  );
}

function detectSimplePastSentence(sentence: string) {
  const lowered = sentence.toLowerCase();

  return (
    /\b(went|bought|built|felt|decided|completed|finished|relaxed|played|studied|worked|lived|knew|wanted|needed|liked|wrote|read)\b/.test(
      lowered
    ) ||
    /\b[a-z]+ed\b/.test(lowered) ||
    hasPastTimeMarker(lowered)
  );
}

function detectPresentPerfectContinuousSentence(sentence: string) {
  return /\b(have|has) been [a-z]+ing\b/i.test(sentence);
}

function detectPresentContinuousSentence(sentence: string) {
  return /\b(am|is|are) [a-z]+ing\b/i.test(sentence);
}

function detectPresentPerfectSentence(sentence: string) {
  return /\b(have|has) [a-z]+ed\b|\b(have|has) done\b|\b(have|has) built\b|\b(have|has) gone\b|\b(have|has) bought\b/i.test(
    sentence
  );
}

function buildGrammarGloss(grammarPoints: string[]) {
  return grammarPoints
    .map((point) => {
      const item = grammarGlossMap[point];
      if (!item) return null;

      return {
        key: point,
        label: item.label,
        glossVi: item.glossVi,
      };
    })
    .filter(Boolean) as GrammarGlossItem[];
}

function detectWritingMode(structureAnalysis: StructureAnalysis): WritingMode {
  const count = structureAnalysis.sentenceCount;
  if (count <= 2) return 'sentence';
  if (count <= 5) return 'paragraph';
  return 'essay';
}

function analyzeParagraphTenseConsistency(
  tenseProfile: TenseProfile,
  sentenceCount: number
): ParagraphAnalysis['tenseConsistency'] {
  if (sentenceCount < 3) return 'strong';

  const hasPast = tenseProfile.distribution['simple past'] > 0;
  const hasPresentContinuous = tenseProfile.distribution['present continuous'] > 0;
  const hasPresentSimple = tenseProfile.distribution['present simple'] > 0;
  const hasPresentPerfect = tenseProfile.distribution['present perfect'] > 0;
  const differentFamilies =
    Number(hasPast) +
    Number(hasPresentContinuous) +
    Number(hasPresentSimple) +
    Number(hasPresentPerfect);

  if (differentFamilies >= 2) {
    return 'mixed but controlled';
  }

  return 'strong';
}

function analyzeIdeaConnection(text: string): ParagraphAnalysis['ideaConnection'] {
  const lowered = text.toLowerCase();
  const connectors = [
    'and',
    'but',
    'because',
    'so',
    'although',
    'though',
    'however',
    'then',
    'after that',
  ];

  const found = connectors.filter((c) => lowered.includes(c));
  if (found.length >= 2) return 'strong';
  if (found.length === 1) return 'developing';
  return 'weak';
}

function analyzeFlow(
  structureAnalysis: StructureAnalysis,
  ideaConnection: ParagraphAnalysis['ideaConnection']
): ParagraphAnalysis['flow'] {
  if (
    structureAnalysis.sentenceCount >= 3 &&
    ideaConnection === 'strong' &&
    structureAnalysis.complexity !== 'basic'
  ) {
    return 'strong';
  }

  if (structureAnalysis.sentenceCount >= 3) return 'developing';
  return 'weak';
}

function analyzeParagraph(
  text: string,
  structureAnalysis: StructureAnalysis,
  tenseProfile: TenseProfile
): ParagraphAnalysis | undefined {
  if (structureAnalysis.sentenceCount < 3) return undefined;

  const ideaConnection = analyzeIdeaConnection(text);
  const flow = analyzeFlow(structureAnalysis, ideaConnection);
  const tenseConsistency = analyzeParagraphTenseConsistency(
    tenseProfile,
    structureAnalysis.sentenceCount
  );

  const notes: string[] = [];

  if (ideaConnection === 'weak') {
    notes.push('Your ideas are understandable, but the connections between sentences are still weak.');
  } else if (ideaConnection === 'developing') {
    notes.push('Your paragraph has some linking, but the connections can become smoother.');
  } else {
    notes.push('Your paragraph shows good linking between ideas.');
  }

  if (tenseConsistency === 'mixed but controlled') {
    notes.push('You are mixing time frames, but the contrast is mostly understandable.');
  } else {
    notes.push('Your tense use across the paragraph is fairly consistent.');
  }

  if (flow === 'strong') {
    notes.push('The paragraph has a clear sense of movement from one idea to the next.');
  } else if (flow === 'developing') {
    notes.push('The paragraph is developing a clear flow, but transitions can become smoother.');
  }

  return {
    flow,
    tenseConsistency,
    ideaConnection,
    notes,
  };
}

function detectGrammarPoints(text: string) {
  const sentences = sentenceSplit(text);
  const grammarPoints: string[] = [];
  const notes: string[] = [];

  const lowered = text.toLowerCase();

  if (hasPastTimeMarker(lowered)) {
    grammarPoints.push('time marker');
    notes.push('The writing contains a finished past-time marker.');
  }

  if (hasCurrentPeriodMarker(lowered)) {
    grammarPoints.push('current time frame');
    notes.push('The writing contains a time expression connected to the present.');
  }

  if (hasNowMarker(lowered)) {
    notes.push('The writing includes a present-focused time signal.');
  }

  if (/\b(am|is|are) [a-z]+ing\b/.test(lowered)) {
    grammarPoints.push('present continuous');
    notes.push('Present continuous was detected.');
  }

  if (/\b(have|has) been [a-z]+ing\b/.test(lowered)) {
    grammarPoints.push('present perfect continuous');
    notes.push('Present perfect continuous was detected.');
  }

  if (
    /\b(have|has) [a-z]+ed\b/.test(lowered) ||
    /\b(have|has) done\b/.test(lowered) ||
    /\b(have|has) built\b/.test(lowered) ||
    /\b(have|has) gone\b/.test(lowered) ||
    /\b(have|has) bought\b/.test(lowered)
  ) {
    grammarPoints.push('present perfect');
    notes.push('Present perfect was detected.');
  }

  if (sentences.some((sentence) => detectSimplePastSentence(sentence))) {
    grammarPoints.push('simple past');
    notes.push('Simple past was detected.');
  }

  if (sentences.some((sentence) => detectPresentSimpleSentence(sentence))) {
    grammarPoints.push('present simple');
    notes.push('Present simple was detected.');
  }

  if (sentences.some((sentence) => hasHabitualExpression(sentence))) {
    grammarPoints.push('habitual expression');
    notes.push('A habitual expression was detected.');
  }

  if (/\balthough\b|\bthough\b|\beven though\b/.test(lowered)) {
    grammarPoints.push('contrast clause');
    notes.push('A contrast clause was detected.');
  }

  if (/\bthat I\b|\bwhich\b|\bwho\b|\bwhom\b|\bwhose\b/.test(text)) {
    grammarPoints.push('relative clause');
    notes.push('A relative clause was detected.');
  }

  if (/\bif\b/.test(lowered)) {
    grammarPoints.push('conditional structure');
    notes.push('A conditional structure may be present.');
  }

  if (/\b(having [a-z]+ed|having done|having been|having completed)\b/i.test(text)) {
    grammarPoints.push('perfect participle clause');
    notes.push('A perfect participle clause was detected.');
  }

  if (sentences.some((sentence) => hasQuestionForm(sentence) && sentence.trim().endsWith('?'))) {
    grammarPoints.push('interrogative structure');
    notes.push('An interrogative structure was detected.');
  }

  if (sentences.some((sentence) => hasNegativeAdverbialInversion(sentence))) {
    grammarPoints.push('negative adverbial inversion');
    notes.push('A negative adverbial inversion was detected.');
  }

  if (/\b(is|are|was|were|be|been|being)\s+[a-z]+ed\b/.test(lowered)) {
    grammarPoints.push('passive voice');
    notes.push('A passive construction may be present.');
  }

  return {
    grammarPoints: unique(grammarPoints),
    notes: unique(notes),
  };
}

function fixSentenceLevelIssues(text: string) {
  let corrected = text;
  const issues: GrammarIssue[] = [];

  const replaceWithIssue = (
    pattern: RegExp,
    replacement: string,
    reason: string,
    category?: string,
    grammarPoint?: string
  ) => {
    if (pattern.test(corrected)) {
      const before = corrected;
      corrected = corrected.replace(pattern, replacement);
      pushIssue(issues, before, corrected, reason, category, grammarPoint);
    }
  };

  replaceWithIssue(
    /\bI very like\b/gi,
    'I really like',
    'Use "really like" instead of "very like".',
    'word choice',
    'adverb use'
  );

  replaceWithIssue(
    /\bdiscuss about\b/gi,
    'discuss',
    'Use "discuss" directly without "about".',
    'grammar',
    'verb pattern'
  );

  replaceWithIssue(
    /\bmore better\b/gi,
    'better',
    'Do not use a double comparative.',
    'grammar',
    'comparatives'
  );

  replaceWithIssue(
    /\badvices\b/gi,
    'advice',
    '"Advice" is usually uncountable.',
    'grammar',
    'countable vs uncountable nouns'
  );

  replaceWithIssue(
    /\bhomeworks\b/gi,
    'homework',
    '"Homework" is usually uncountable.',
    'grammar',
    'countable vs uncountable nouns'
  );

  replaceWithIssue(
    /\binformations\b/gi,
    'information',
    '"Information" is usually uncountable.',
    'grammar',
    'countable vs uncountable nouns'
  );

  replaceWithIssue(
    /\bgara\b/gi,
    'garage',
    'Corrected spelling: "gara" → "garage".',
    'spelling',
    'spelling'
  );

  replaceWithIssue(
    /\bout post\b/gi,
    'outpost',
    'Corrected spelling: "out post" → "outpost".',
    'spelling',
    'compound words'
  );

  replaceWithIssue(
    /\bthis year i\b/g,
    'This year I',
    'Capitalize "I".',
    'capitalization',
    'capitalization'
  );

  replaceWithIssue(
    /\bi\b/g,
    'I',
    'Capitalize the pronoun "I".',
    'capitalization',
    'capitalization'
  );

  return { corrected, issues };
}

function analyzeTenseConsistency(text: string) {
  let corrected = text;
  const issues: GrammarIssue[] = [];
  const lowered = corrected.toLowerCase();

  const pastTime = hasPastTimeMarker(lowered);
  const currentPeriod = hasCurrentPeriodMarker(lowered);
  const nowMarker = hasNowMarker(lowered);

  if (/\bYesterday I buy\b/i.test(corrected)) {
    const before = corrected;
    corrected = corrected.replace(/\bYesterday I buy\b/i, 'Yesterday I bought');
    pushIssue(
      issues,
      before,
      corrected,
      'After "Yesterday", use simple past: "bought".',
      'tense',
      'simple past'
    );
  }

  if (/\bI go\b/i.test(corrected) && pastTime) {
    const before = corrected;
    corrected = corrected.replace(/\bI go\b/i, 'I went');
    pushIssue(
      issues,
      before,
      corrected,
      'A finished past time marker usually needs simple past.',
      'tense',
      'simple past'
    );
  }

  if (/\bbuy many thing\b/i.test(corrected)) {
    const before = corrected;
    corrected = corrected.replace(/\bbuy many thing\b/i, 'bought many things');
    pushIssue(
      issues,
      before,
      corrected,
      'Use past tense "bought" and plural noun "things".',
      'grammar',
      'simple past'
    );
  }

  if (/\bnow,?\s+i have done\b/i.test(corrected)) {
    const before = corrected;
    corrected = corrected.replace(/\bnow,?\s+i have done\b/i, 'Now I am doing');
    pushIssue(
      issues,
      before,
      corrected,
      'With "now", present continuous is usually more natural than present perfect for an action in progress.',
      'tense',
      'present continuous'
    );
  }

  if (/\bnow\b/i.test(corrected) && /\bhave done\b/i.test(corrected) && !/\bjust\b/i.test(corrected)) {
    const before = corrected;
    corrected = corrected.replace(/\bhave done\b/i, 'am doing');
    pushIssue(
      issues,
      before,
      corrected,
      'Present continuous usually fits better when the sentence focuses on something happening now.',
      'tense',
      'present continuous'
    );
  }

  if (/\bthis year i have been building my gara and out post\b/i.test(corrected)) {
    const before = corrected;
    corrected = corrected.replace(
      /\bthis year i have been building my gara and out post\b/i,
      'This year, I have been building my garage and outpost'
    );
    pushIssue(
      issues,
      before,
      corrected,
      'Present perfect continuous fits well here because the action started earlier this year and is still continuing.',
      'tense',
      'present perfect continuous'
    );
  }

  if (/\bthis year,?\s+i built\b/i.test(corrected) && /\bthis year\b/i.test(corrected) && !/\bfinished\b/i.test(corrected)) {
    const before = corrected;
    corrected = corrected.replace(/\bthis year,?\s+i built\b/i, 'This year, I have built');
    pushIssue(
      issues,
      before,
      corrected,
      'For a time period that is still open, present perfect can sound more natural than simple past.',
      'tense',
      'present perfect'
    );
  }

  if (/\byesterday\b/i.test(corrected) && /\bhave built\b/i.test(corrected)) {
    const before = corrected;
    corrected = corrected.replace(/\bhave built\b/i, 'built');
    pushIssue(
      issues,
      before,
      corrected,
      'Do not usually combine present perfect with a finished time marker like "yesterday". Use simple past instead.',
      'tense',
      'simple past'
    );
  }

  if (/\blast year\b/i.test(corrected) && /\bhave built\b/i.test(corrected)) {
    const before = corrected;
    corrected = corrected.replace(/\bhave built\b/i, 'built');
    pushIssue(
      issues,
      before,
      corrected,
      'Use simple past with a finished time marker like "last year".',
      'tense',
      'simple past'
    );
  }

  return { corrected, issues };
}

function polishNaturalness(text: string) {
  let enhanced = text;

  enhanced = enhanced.replace(
    /\bI built the house last year\. This year, I have been building my garage and outpost\./i,
    'I built the house last year. This year, I have been working on my garage and outpost.'
  );

  enhanced = enhanced.replace(
    /\bI bought a chair this morning\. Now I am doing my homework\./i,
    'I bought a chair this morning, and now I am doing my homework.'
  );

  enhanced = enhanced.replace(
    /\bI bought a house yesterday\. I have been building my garage\./i,
    'I bought a house yesterday, and I have been building my garage since then.'
  );

  enhanced = enhanced.replace(/\bquiet space\b/gi, 'calm space');
  enhanced = enhanced.replace(/\bpractice thinking about\b/gi, 'practice reflecting on');
  enhanced = enhanced.replace(/\bwhere you practice\b/gi, 'where you can practice');

  return enhanced;
}

function rewriteParagraph(text: string) {
  const sentences = sentenceSplit(text);
  if (sentences.length < 2) return text;

  const trimmed = sentences.map((s) => s.trim()).filter(Boolean);
  if (trimmed.length < 2) return text;

  const normalized = trimmed.map((sentence, index) => {
    if (index === 0) return sentence;
    return sentence.replace(/^(However|Therefore|Also|Then|In addition|As a result),?\s+/i, '');
  });

  const rewritten: string[] = [];

  normalized.forEach((sentence, index) => {
    if (index === 0) {
      rewritten.push(sentence);
      return;
    }

    const previous = normalized[index - 1].toLowerCase();
    const current = sentence.toLowerCase();

    let connector = '';

    if (/\byesterday\b|\blast year\b|\bthis morning\b|\bago\b/.test(previous) && /\bnow\b|\btoday\b|\bcurrently\b|\bthis year\b/.test(current)) {
      connector = 'Now, ';
    } else if (/\bbecause\b|\bif\b/.test(current)) {
      connector = '';
    } else if (/\bbirds\b|\bnature\b|\bsky\b|\batmosphere\b|\bsurroundings\b/.test(current)) {
      connector = 'Meanwhile, ';
    } else if (/\btherefore\b|\bas a result\b|\bso\b/.test(current)) {
      connector = '';
    } else if (/\bhowever\b|\bbut\b|\balthough\b|\bthough\b/.test(current)) {
      connector = 'However, ';
    } else if (index === normalized.length - 1) {
      connector = 'As a result, ';
    } else {
      connector = 'In addition, ';
    }

    if (!connector) {
      rewritten.push(sentence);
      return;
    }

    const body = sentence.charAt(0).toLowerCase() + sentence.slice(1);
    rewritten.push(`${connector}${body}`);
  });

  let result = rewritten.join(' ');
  result = result.replace(/\bHowever,\s+however\b/gi, 'However');
  result = result.replace(/\bAs a result,\s+therefore\b/gi, 'Therefore');
  result = result.replace(/\bIn addition,\s+also\b/gi, 'Also');
  result = result.replace(/\s+/g, ' ').trim();

  return result;
}

function buildEditedVersion(
  correctedText: string,
  enhancedText: string,
  writingMode: WritingMode,
  paragraphAnalysis?: ParagraphAnalysis,
  decision?: TeachingDecision
) {
  const shouldRewriteParagraph =
    writingMode !== 'sentence' ||
    paragraphAnalysis?.flow !== 'strong' ||
    paragraphAnalysis?.ideaConnection !== 'strong' ||
    paragraphAnalysis?.tenseConsistency === 'mixed but controlled' ||
    decision?.primaryFocus === 'paragraph coherence' ||
    decision?.primaryFocus === 'paragraph flow' ||
    decision?.primaryFocus === 'idea connection' ||
    decision?.primaryFocus === 'time-frame connection across sentences' ||
    decision?.primaryFocus === 'tense consistency across the paragraph';

  if (!shouldRewriteParagraph) {
    return enhancedText;
  }

  return rewriteParagraph(enhancedText);
}

function analyzeAdvancedPatterns(text: string): AdvancedPattern[] {
  const patterns: AdvancedPattern[] = [];
  const sentences = sentenceSplit(text);

  for (const sentence of sentences) {
    if (/\bAlthough\b|\bThough\b|\bEven though\b/.test(sentence)) {
      patterns.push({
        name: 'Contrast clause',
        example: sentence,
        explanation:
          'This sentence uses a subordinating conjunction to show contrast between two ideas.',
        level: 'intermediate',
      });
    }

    if (/\bHaving [a-z]+ed\b|\bHaving done\b|\bHaving been\b|\bHaving completed\b/.test(sentence)) {
      patterns.push({
        name: 'Perfect participle clause',
        example: sentence,
        explanation:
          'This structure shows that one action was completed before the action in the main clause.',
        level: 'advanced',
      });
    }

    if (/\bthat I\b|\bwhich\b|\bwho\b|\bwhom\b|\bwhose\b/.test(sentence)) {
      patterns.push({
        name: 'Relative clause',
        example: sentence,
        explanation:
          'A relative clause adds information about a noun without starting a completely new sentence.',
        level: 'intermediate',
      });
    }

    if (/\bif\b/.test(sentence.toLowerCase())) {
      patterns.push({
        name: 'Conditional structure',
        example: sentence,
        explanation:
          'This sentence explores a condition and its result, which is a key structure in flexible English expression.',
        level: 'intermediate',
      });
    }

    if (hasQuestionForm(sentence) && sentence.trim().endsWith('?')) {
      patterns.push({
        name: 'Interrogative structure',
        example: sentence,
        explanation:
          'This sentence uses question structure to ask for information directly and clearly.',
        level: 'intermediate',
      });
    }

    if (
      hasNegativeAdverbialInversion(sentence) &&
      /\b(had|has|have|did|do|does|is|are|was|were|can|could|should|would|will)\b/i.test(sentence)
    ) {
      patterns.push({
        name: 'Negative adverbial inversion',
        example: sentence,
        explanation:
          'This advanced structure inverts the normal word order after a negative or limiting expression for emphasis.',
        level: 'advanced',
      });
    }

    if (hasHabitualExpression(sentence) && detectPresentSimpleSentence(sentence)) {
      patterns.push({
        name: 'Present simple habitual',
        example: sentence,
        explanation:
          'Present simple is commonly used for routines, repeated actions, and general habits.',
        level: 'basic',
      });
    }

    if (/\b(is|are|was|were|be|been|being)\s+[a-z]+ed\b/i.test(sentence)) {
      patterns.push({
        name: 'Passive voice',
        example: sentence,
        explanation:
          'Passive voice shifts attention from the doer to the action or result.',
        level: 'intermediate',
      });
    }
  }

  return unique(patterns.map((p) => JSON.stringify(p))).map((p) =>
    JSON.parse(p) as AdvancedPattern
  );
}

function analyzeStructure(text: string): StructureAnalysis {
  const sentences = sentenceSplit(text);
  const variety: string[] = [];

  for (const sentence of sentences) {
    if (/\balthough\b|\bthough\b|\beven though\b/i.test(sentence)) {
      variety.push('subordinate clause');
    }
    if (/\bthat\b|\bwhich\b|\bwho\b|\bwhom\b|\bwhose\b/.test(sentence)) {
      variety.push('embedded clause');
    }
    if (/\bHaving [a-z]+ed\b|\bHaving done\b|\bHaving completed\b/i.test(sentence)) {
      variety.push('reduced clause');
    }
    if (/,/.test(sentence)) {
      variety.push('expanded sentence');
    }
    if (hasQuestionForm(sentence) && sentence.trim().endsWith('?')) {
      variety.push('interrogative sentence');
    }
    if (hasNegativeAdverbialInversion(sentence)) {
      variety.push('inversion');
    }
    if (hasHabitualExpression(sentence)) {
      variety.push('habitual expression');
    }
  }

  let complexity: 'basic' | 'intermediate' | 'advanced' = 'basic';

  if (variety.length >= 2 || sentences.some((s) => /,/.test(s))) {
    complexity = 'intermediate';
  }

  if (
    variety.includes('reduced clause') ||
    variety.includes('inversion') ||
    (variety.includes('subordinate clause') && variety.includes('embedded clause'))
  ) {
    complexity = 'advanced';
  }

  return {
    sentenceCount: sentences.length,
    complexity,
    variety: unique(variety),
  };
}

function generateTeachingPoints(
  corrected: string,
  grammarPoints: string[],
  advancedPatterns: AdvancedPattern[],
  writingMode: WritingMode,
  paragraphAnalysis?: ParagraphAnalysis
): string[] {
  const points: string[] = [];
  const lowered = corrected.toLowerCase();

  if (/\byesterday\b/.test(lowered) && /\b(bought|built|went|felt|decided|completed|relaxed)\b/.test(lowered)) {
    points.push('Use simple past with a finished time marker such as “yesterday” or “last year”.');
  }

  if (/\bhave been [a-z]+ing\b/.test(lowered)) {
    points.push('Present perfect continuous is useful for actions that started in the past and are still continuing now.');
  }

  if (advancedPatterns.some((p) => p.name === 'Present simple habitual')) {
    points.push('Present simple is the normal choice for habits and repeated actions such as daily routines.');
  }

  if (grammarPoints.includes('relative clause')) {
    points.push('Relative clauses help you add detail to a noun without writing a separate sentence.');
  }

  if (advancedPatterns.some((p) => p.name === 'Perfect participle clause')) {
    points.push('Perfect participle clauses make writing more compact and advanced by showing sequence without repeating the subject.');
  }

  if (advancedPatterns.some((p) => p.name === 'Contrast clause')) {
    points.push('Contrast clauses like “although” help your writing sound more logical and mature.');
  }

  if (advancedPatterns.some((p) => p.name === 'Negative adverbial inversion')) {
    points.push('Negative adverbial inversion is an advanced emphasis structure that changes normal word order for stronger effect.');
  }

  if (advancedPatterns.some((p) => p.name === 'Interrogative structure')) {
    points.push('Good question structure helps you ask clearly and naturally in English.');
  }

  if (writingMode === 'paragraph' && paragraphAnalysis) {
    if (paragraphAnalysis.ideaConnection === 'weak') {
      points.push('Try adding linking words such as “and”, “but”, “because”, or “so” to connect your ideas more clearly.');
    }

    if (paragraphAnalysis.flow !== 'strong') {
      points.push('Paragraph writing is not only about correct grammar. It also needs clear movement from one sentence to the next.');
    }
  }

  return unique(points);
}

function buildDecisionTeachingPoints(
  basePoints: string[],
  decision: TeachingDecision
): string[] {
  const points = [...basePoints];

  if (decision.praiseFocus) {
    points.unshift(`Strong point: ${decision.praiseFocus}.`);
  }

  if (decision.primaryFocus) {
    points.unshift(`Main teaching focus: ${decision.primaryFocus}.`);
  }

  return unique(points);
}

function buildOverallAssessment(
  issues: GrammarIssue[],
  structureAnalysis: StructureAnalysis,
  advancedPatterns: AdvancedPattern[],
  writingMode: WritingMode,
  paragraphAnalysis?: ParagraphAnalysis
) {
  if (writingMode === 'paragraph' && paragraphAnalysis) {
    if (issues.length <= 2 && paragraphAnalysis.flow === 'strong') {
      return 'This is a strong paragraph. Your grammar is mostly accurate, and your ideas move forward clearly from one sentence to the next.';
    }

    if (issues.length <= 3 && paragraphAnalysis.flow === 'developing') {
      return 'This paragraph is developing well. The ideas are understandable, and Mercy is now helping you improve flow as well as grammar.';
    }
  }

  if (
    issues.length === 0 &&
    advancedPatterns.length >= 3 &&
    structureAnalysis.complexity === 'advanced'
  ) {
    return 'This is strong upper-intermediate-to-advanced writing. The grammar is accurate, and the paragraph shows excellent variety in sentence design and control.';
  }

  if (issues.length === 0 && advancedPatterns.length >= 2) {
    return 'This is strong intermediate-to-advanced writing. The grammar is accurate, and the sentence structures show good variety and control.';
  }

  if (issues.length === 0 && structureAnalysis.complexity === 'advanced') {
    return 'This is strong writing with advanced sentence structure and accurate grammar.';
  }

  if (issues.length <= 2 && structureAnalysis.complexity !== 'basic') {
    return 'This writing is generally strong. Mercy made only light corrections while preserving your structure.';
  }

  if (issues.length === 0) {
    return 'This sentence is already mostly correct. Mercy made only light polishing changes.';
  }

  return 'Mercy found some grammar or phrasing issues, but the sentence already shows useful learning potential.';
}

function buildLevelSignal(
  structureAnalysis: StructureAnalysis,
  advancedPatterns: AdvancedPattern[],
  issues: GrammarIssue[]
) {
  const advancedCount = advancedPatterns.filter((p) => p.level === 'advanced').length;

  if (issues.length === 0 && advancedCount >= 2) {
    return 'Advanced signal';
  }

  if (issues.length === 0 && advancedPatterns.some((p) => p.level === 'advanced')) {
    return 'Upper-intermediate to advanced signal';
  }

  if (issues.length <= 2 && structureAnalysis.complexity === 'advanced') {
    return 'Upper-intermediate signal';
  }

  if (issues.length <= 3 && structureAnalysis.complexity === 'intermediate') {
    return 'Intermediate signal';
  }

  return 'Foundational to intermediate signal';
}

function buildExplanation(
  original: string,
  corrected: string,
  grammarPoints: string[],
  tenseNotes: string[],
  advancedPatterns: AdvancedPattern[],
  decision?: TeachingDecision,
  writingMode?: WritingMode,
  paragraphAnalysis?: ParagraphAnalysis
) {
  const lowered = corrected.toLowerCase();
  const parts: string[] = [];
  const patternNames = advancedPatterns.map((p) => p.name);

  parts.push('Mercy checked grammar, tense logic, spelling, sentence structure, and natural phrasing.');

  if (writingMode === 'paragraph') {
    parts.push('Because this is a paragraph, Mercy also looked at how your ideas connect across sentences.');
  }

  if (grammarPoints.length > 0) {
    parts.push(`Detected grammar points: ${grammarPoints.join(', ')}.`);
  }

  if (decision?.praiseFocus) {
    parts.push(`Strong point detected: ${decision.praiseFocus}.`);
  }

  if (decision?.primaryFocus) {
    parts.push(`Main teaching priority: ${decision.primaryFocus}.`);
  }

  if (/\blast year\b/.test(lowered) && /\bi built\b/.test(lowered)) {
    parts.push('“Built” is simple past, which is appropriate because “last year” refers to a finished time in the past.');
  }

  if (/\byesterday\b/.test(lowered) && /\b(i bought|we went|she felt|they decided)\b/.test(lowered)) {
    parts.push('Simple past matches “yesterday” because it points to a finished past event.');
  }

  if (/\bthis year\b/.test(lowered) && /\bhave been building\b/.test(lowered)) {
    parts.push('“Have been building” is present perfect continuous, which is useful for an action that started in the past and is still continuing this year.');
  }

  if (/\bhave been building\b/.test(lowered) && !/\bthis year\b/.test(lowered)) {
    parts.push('“Have been building” is present perfect continuous, used for an action that began earlier and is still in progress now.');
  }

  if (patternNames.includes('Present simple habitual')) {
    parts.push('The present simple sentence expresses a routine or repeated action, which is one of the core uses of that tense.');
  }

  if (patternNames.includes('Contrast clause')) {
    parts.push('Using “although” correctly creates a clear contrast structure and makes the sentence more mature.');
  }

  if (patternNames.includes('Perfect participle clause')) {
    parts.push('The perfect participle clause shows that one action was completed before the next one happened.');
  }

  if (patternNames.includes('Relative clause')) {
    parts.push('The relative clause adds detail naturally to a noun, which is a strong feature of more developed writing.');
  }

  if (patternNames.includes('Interrogative structure')) {
    parts.push('The question sentence uses clear interrogative structure, which improves flexibility and range in writing.');
  }

  if (patternNames.includes('Negative adverbial inversion')) {
    parts.push('The inversion structure is advanced because it changes normal word order to create emphasis after a limiting expression.');
  }

  if (paragraphAnalysis && writingMode === 'paragraph') {
    parts.push(...paragraphAnalysis.notes);
  }

  if (/\byesterday\b/.test(original.toLowerCase()) && /\bhave\b/.test(original.toLowerCase())) {
    parts.push('A common learner mistake is mixing present perfect with a finished past-time marker like “yesterday”. English usually prefers simple past in that case.');
  }

  if (tenseNotes.length > 0) {
    parts.push(...tenseNotes);
  }

  if (original.trim() === corrected.trim()) {
    parts.push('The sentence was already mostly correct, so Mercy focused more on explanation and teaching value than correction.');
  }

  return unique(parts).join(' ');
}

function buildQuickFixTaskFromFocus(
  focus: string,
  priorityOverride?: number
): QuickFixTask | null {
  if (focus === 'simple past with finished time markers') {
    return {
      type: 'quickFix',
      focus,
      question: 'Choose the correct sentence:',
      options: ['I have built it yesterday.', 'I built it yesterday.'],
      answer: 'I built it yesterday.',
      explanation: 'Use simple past with a finished past-time marker like “yesterday”.',
      priority: priorityOverride ?? 100,
    };
  }

  if (focus === 'present continuous for ongoing action') {
    return {
      type: 'quickFix',
      focus,
      question: 'Choose the better sentence for an action happening now:',
      options: ['Now I have done my homework.', 'Now I am doing my homework.'],
      answer: 'Now I am doing my homework.',
      explanation:
        'Present continuous is usually more natural when the action is happening right now.',
      priority: priorityOverride ?? 95,
    };
  }

  if (focus === 'interrogative structure') {
    return {
      type: 'quickFix',
      focus,
      question: 'Choose the better question:',
      options: ['Why you are late?', 'Why are you late?'],
      answer: 'Why are you late?',
      explanation: 'In English questions, the auxiliary verb usually comes before the subject.',
      priority: priorityOverride ?? 80,
    };
  }

  return null;
}

function buildContrastTaskFromFocus(
  focus: string,
  priorityOverride?: number
): ContrastTask | null {
  if (focus === 'tense contrast across finished and ongoing actions') {
    return {
      type: 'contrast',
      focus,
      question: 'What is the difference between these two sentences?',
      examples: [
        'I built my garage last year.',
        'I have been building my garage this year.',
      ],
      explanation:
        'Simple past describes a finished action in the past. Present perfect continuous describes an action that started earlier and is still continuing now.',
      priority: priorityOverride ?? 90,
    };
  }

  if (focus === 'finished past vs continuing action') {
    return {
      type: 'contrast',
      focus,
      question: 'What is the difference between these two sentences?',
      examples: [
        'I built my garage last year.',
        'I have been building my garage this year.',
      ],
      explanation:
        'Simple past describes a finished action in the past. Present perfect continuous describes an action that started earlier and is still continuing now.',
      priority: priorityOverride ?? 88,
    };
  }

  return null;
}

function buildProductionTaskFromFocus(
  focus: string,
  priorityOverride?: number
): ProductionTask | null {
  if (focus === 'negative adverbial inversion') {
    return {
      type: 'production',
      focus,
      instruction:
        'Write one sentence beginning with “Never before...” or “Rarely...”, and keep the inverted word order correct.',
      targetPattern: 'negative adverbial inversion',
      priority: priorityOverride ?? 100,
    };
  }

  if (focus === 'perfect participle clause') {
    return {
      type: 'production',
      focus,
      instruction:
        'Rewrite two actions as one sentence using a perfect participle clause, for example: “Having finished the report, I went home.”',
      targetPattern: 'perfect participle clause',
      priority: priorityOverride ?? 85,
    };
  }

  if (focus === 'contrast clause') {
    return {
      type: 'production',
      focus,
      instruction:
        'Write one sentence using “although”, “though”, or “even though” to connect two contrasting ideas.',
      targetPattern: 'contrast clause',
      priority: priorityOverride ?? 75,
    };
  }

  if (focus === 'relative clause') {
    return {
      type: 'production',
      focus,
      instruction:
        'Write one sentence that describes a person or thing using “who”, “which”, or “that”.',
      targetPattern: 'relative clause',
      priority: priorityOverride ?? 70,
    };
  }

  if (focus === 'advanced structural control') {
    return {
      type: 'production',
      focus,
      instruction:
        'Write two sentences: one using an advanced structure you already control, and one new sentence that stretches your range further.',
      targetPattern: 'advanced structural control',
      priority: priorityOverride ?? 72,
    };
  }

  return null;
}

function buildLinkingTaskFromFocus(
  focus: string,
  correctedText: string,
  priorityOverride?: number
): LinkingTask | null {
  if (
    focus === 'idea connection' ||
    focus === 'linking devices' ||
    focus === 'time-frame connection across sentences'
  ) {
    return {
      type: 'linking',
      focus,
      instruction:
        'Add linking words or short transition phrases so the paragraph moves more smoothly from one sentence to the next.',
      pairs:
        focus === 'time-frame connection across sentences'
          ? ['past event → present result', 'earlier action → current situation']
          : ['main idea → supporting detail', 'sentence 1 → sentence 2'],
      targetPattern: 'linking devices',
      explanation:
        focus === 'time-frame connection across sentences'
          ? 'Your paragraph mixes time frames understandably, but the transition between them can be smoother.'
          : 'Your paragraph is understandable, but the bridges between sentences can become clearer.',
      priority: priorityOverride ?? 98,
    };
  }

  if (focus === 'paragraph flow') {
    return {
      type: 'linking',
      focus,
      instruction:
        'Add one connector or transition at the start of a sentence so the paragraph feels smoother.',
      pairs: ['one event → next event', 'problem → result'],
      targetPattern: 'linking devices',
      explanation:
        'Paragraph flow improves when the reader can clearly see how each sentence connects to the next one.',
      priority: priorityOverride ?? 94,
    };
  }

  if (focus.toLowerCase().includes('connection') || focus.toLowerCase().includes('linking')) {
    return {
      type: 'linking',
      focus,
      instruction:
        'Improve the links between sentences with clearer transitions and relationship words.',
      pairs: ['idea → example', 'past → present'],
      targetPattern: 'linking devices',
      explanation: 'This task focuses on helping the paragraph feel more connected as a whole.',
      priority: priorityOverride ?? 92,
    };
  }

  if (correctedText.split(/(?<=[.!?])\s+/).filter(Boolean).length >= 3) {
    return {
      type: 'linking',
      focus,
      instruction:
        'Connect the sentences more clearly with a transition such as “so”, “because”, “however”, or “after that”.',
      pairs: ['sentence 1 → sentence 2', 'sentence 2 → sentence 3'],
      targetPattern: 'linking devices',
      explanation: 'This keeps paragraph practice focused on connection, not only sentence repair.',
      priority: priorityOverride ?? 88,
    };
  }

  return null;
}

function buildRewriteTaskFromFocus(
  focus: string,
  correctedText: string,
  priorityOverride?: number
): RewriteTask | null {
  if (
    focus === 'paragraph flow' ||
    focus === 'paragraph coherence' ||
    focus === 'tense consistency across the paragraph'
  ) {
    return {
      type: 'rewrite',
      focus,
      instruction:
        'Rewrite the paragraph so the ideas connect more smoothly and the time frame feels easier to follow.',
      sourceText: correctedText,
      targetPattern: 'cohesion',
      explanation:
        focus === 'tense consistency across the paragraph'
          ? 'Keep the time shift if needed, but make it easier for the reader to follow.'
          : 'Rewrite the whole paragraph with smoother flow instead of only fixing one sentence at a time.',
      priority: priorityOverride ?? 99,
    };
  }

  if (focus.toLowerCase().includes('flow') || focus.toLowerCase().includes('coherence')) {
    return {
      type: 'rewrite',
      focus,
      instruction:
        'Rewrite the paragraph so each sentence leads naturally into the next one.',
      sourceText: correctedText,
      targetPattern: 'cohesion',
      explanation: 'This is a paragraph-level rewrite task, not just a sentence-level grammar fix.',
      priority: priorityOverride ?? 95,
    };
  }

  return null;
}

function buildReviewTaskFromFocus(
  focus: string,
  correctedText: string,
  priorityOverride?: number
): PracticeTask | null {
  if (focus === 'simple past with finished time markers') {
    return {
      type: 'quickFix',
      focus,
      question: 'Review: choose the correct sentence again:',
      options: ['I have built it yesterday.', 'I built it yesterday.'],
      answer: 'I built it yesterday.',
      explanation:
        'This is now a review target. Finished past markers like “yesterday” usually require simple past.',
      priority: priorityOverride ?? 100,
    };
  }

  if (focus === 'present continuous for ongoing action') {
    return {
      type: 'quickFix',
      focus,
      question: 'Review: choose the better sentence for something happening now:',
      options: ['Now I have done my homework.', 'Now I am doing my homework.'],
      answer: 'Now I am doing my homework.',
      explanation:
        'This is now a review target. Present continuous is usually the better choice for actions happening now.',
      priority: priorityOverride ?? 100,
    };
  }

  if (focus === 'tense contrast across finished and ongoing actions') {
    return {
      type: 'contrast',
      focus,
      question: 'Review: what is the difference between these two sentences?',
      examples: [
        'I built my garage last year.',
        'I have been building my garage this year.',
      ],
      explanation:
        'Review the difference carefully: one action is finished, while the other started earlier and is still continuing.',
      priority: priorityOverride ?? 100,
    };
  }

  if (
    focus === 'idea connection' ||
    focus === 'paragraph flow' ||
    focus === 'paragraph coherence' ||
    focus === 'time-frame connection across sentences' ||
    focus === 'tense consistency across the paragraph'
  ) {
    return {
      type: 'review',
      focus,
      instruction:
        'Review this paragraph target by rewriting or reconnecting the ideas more clearly across the whole paragraph.',
      targetPattern:
        focus === 'time-frame connection across sentences' ? 'linking devices' : 'cohesion',
      explanation:
        'This review should stay at paragraph level so practice does not collapse back into isolated sentence drills.',
      priority: priorityOverride ?? 96,
    };
  }

  if (correctedText.split(/(?<=[.!?])\s+/).filter(Boolean).length >= 3) {
    return {
      type: 'review',
      focus,
      instruction:
        `Review this target by revising the paragraph as a whole: ${focus}.`,
      targetPattern: 'cohesion',
      explanation: 'This keeps review practice aligned with paragraph coaching.',
      priority: priorityOverride ?? 92,
    };
  }

  return {
    type: 'production',
    focus,
    instruction: `Review this target by writing one new sentence that correctly uses: ${focus}.`,
    targetPattern: focus,
    priority: priorityOverride ?? 90,
  };
}

function generatePracticeFromDecision(
  decision: TeachingDecision,
  correctedText: string
): PracticeBlock {
  const tasks: PracticeTask[] = [];

  const addTask = (task: PracticeTask | null) => {
    if (!task) return;

    const exists = tasks.some((existing) => {
      if (existing.type !== task.type) return false;

      if (existing.type === 'quickFix' && task.type === 'quickFix') {
        return existing.question === task.question;
      }

      if (existing.type === 'contrast' && task.type === 'contrast') {
        return existing.question === task.question;
      }

      if (existing.type === 'production' && task.type === 'production') {
        return existing.instruction === task.instruction;
      }

      if (existing.type === 'linking' && task.type === 'linking') {
        return existing.instruction === task.instruction && existing.focus === task.focus;
      }

      if (existing.type === 'rewrite' && task.type === 'rewrite') {
        return existing.instruction === task.instruction && existing.focus === task.focus;
      }

      if (existing.type === 'review' && task.type === 'review') {
        return existing.instruction === task.instruction && existing.focus === task.focus;
      }

      return false;
    });

    if (!exists) tasks.push(task);
  };

  const taskPlan = (decision.taskPlan ?? []) as Array<{
    type: string;
    focus: string;
    priority: number;
    reason?: string;
  }>;

  for (const item of taskPlan) {
    if (item.type === 'review') {
      addTask(buildReviewTaskFromFocus(item.focus, correctedText, item.priority));
      continue;
    }

    if (item.type === 'quickFix') {
      addTask(buildQuickFixTaskFromFocus(item.focus, item.priority));
      continue;
    }

    if (item.type === 'contrast') {
      addTask(buildContrastTaskFromFocus(item.focus, item.priority));
      continue;
    }

    if (item.type === 'production') {
      addTask(buildProductionTaskFromFocus(item.focus, item.priority));
      continue;
    }

    if (item.type === 'linking') {
      addTask(buildLinkingTaskFromFocus(item.focus, correctedText, item.priority));
      continue;
    }

    if (item.type === 'rewrite') {
      addTask(buildRewriteTaskFromFocus(item.focus, correctedText, item.priority));
      continue;
    }
  }

  if (tasks.length === 0) {
    addTask({
      type: 'production',
      focus: decision.primaryFocus || 'tense control',
      instruction:
        'Write one new sentence that correctly applies the main teaching focus from this response.',
      targetPattern: decision.primaryFocus || 'tense control',
      priority: 50,
    });
  }

  const sortedTasks = [...tasks].sort((a, b) => b.priority - a.priority);

  const primaryQuickFix = sortedTasks.find(
    (task): task is QuickFixTask => task.type === 'quickFix'
  );

  const primaryContrast = sortedTasks.find(
    (task): task is ContrastTask => task.type === 'contrast'
  );

  const primaryProduction = sortedTasks.find(
    (task): task is ProductionTask => task.type === 'production'
  );

  return {
    mode:
      decision.responseMode === 'explain' || decision.responseMode === 'challenge'
        ? decision.responseMode
        : 'coach',
    tasks: sortedTasks,
    quickFix: primaryQuickFix
      ? {
          question: primaryQuickFix.question,
          options: primaryQuickFix.options,
          answer: primaryQuickFix.answer,
          explanation: primaryQuickFix.explanation,
        }
      : undefined,
    contrast: primaryContrast
      ? {
          question: primaryContrast.question,
          examples: primaryContrast.examples,
          explanation: primaryContrast.explanation,
        }
      : undefined,
    production: primaryProduction
      ? {
          instruction: primaryProduction.instruction,
        }
      : undefined,
  };
}

function buildDominantTenseProfile(corrected: string): TenseProfile {
  const sentences = sentenceSplit(corrected);

  const distribution: Record<string, number> = {
    'present simple': 0,
    'simple past': 0,
    'present perfect': 0,
    'present perfect continuous': 0,
    'present continuous': 0,
    interrogative: 0,
    'inversion structure': 0,
  };

  for (const sentence of sentences) {
    if (detectPresentPerfectContinuousSentence(sentence)) {
      distribution['present perfect continuous'] += 1;
    }

    if (detectPresentContinuousSentence(sentence)) {
      distribution['present continuous'] += 1;
    }

    if (detectPresentPerfectSentence(sentence) && !detectPresentPerfectContinuousSentence(sentence)) {
      distribution['present perfect'] += 1;
    }

    if (detectSimplePastSentence(sentence)) {
      distribution['simple past'] += 1;
    }

    if (detectPresentSimpleSentence(sentence)) {
      distribution['present simple'] += 1;
    }

    if (hasQuestionForm(sentence) && sentence.trim().endsWith('?')) {
      distribution.interrogative += 1;
    }

    if (hasNegativeAdverbialInversion(sentence)) {
      distribution['inversion structure'] += 1;
    }
  }

  const nonZeroEntries = Object.entries(distribution).filter(([, count]) => count > 0);

  let primary = 'mixed';

  const hasPresent = distribution['present simple'] > 0;
  const hasPast = distribution['simple past'] > 0;
  const hasQuestion = distribution.interrogative > 0;
  const hasInversion = distribution['inversion structure'] > 0;

  if ((hasPresent && hasPast) || hasQuestion || hasInversion) {
    primary = 'mixed';
  } else if (nonZeroEntries.length === 1) {
    primary = nonZeroEntries[0][0];
  } else if (nonZeroEntries.length > 1) {
    const sorted = [...nonZeroEntries].sort((a, b) => b[1] - a[1]);
    primary = sorted[0][0];
  }

  return {
    primary,
    distribution,
  };
}

function chooseLikelyMainTense(profile: TenseProfile) {
  if (profile.primary === 'mixed') return 'mixed';
  return profile.primary;
}

function analyzeGrammar(text: string, learnerId = 'demo-learner'): GrammarResponse {
  const cleaned = text.trim();

  const sentenceIssues: GrammarIssue[] = [];
  const tenseIssues: GrammarIssue[] = [];

  const sentencePass = fixSentenceLevelIssues(cleaned);
  sentenceIssues.push(...sentencePass.issues);

  const tensePass = analyzeTenseConsistency(sentencePass.corrected);
  tenseIssues.push(...tensePass.issues);

  let corrected = tensePass.corrected;

  const capitalized = capitalizeFirst(corrected);
  if (capitalized !== corrected) {
    pushIssue(
      sentenceIssues,
      corrected,
      capitalized,
      'Capitalize the first word.',
      'capitalization',
      'capitalization'
    );
    corrected = capitalized;
  }

  const punctuated = ensureEndingPunctuation(corrected);
  if (punctuated !== corrected) {
    pushIssue(
      sentenceIssues,
      corrected,
      punctuated,
      'Add ending punctuation for a complete sentence.',
      'punctuation',
      'sentence punctuation'
    );
    corrected = punctuated;
  }

  const detection = detectGrammarPoints(corrected);
  const structureAnalysis = analyzeStructure(corrected);
  const writingMode = detectWritingMode(structureAnalysis);
  const advancedPatterns = analyzeAdvancedPatterns(corrected);
  const grammarPoints = unique([
    ...detection.grammarPoints,
    ...advancedPatterns.map((p) => p.name.toLowerCase()),
  ]);
  const enhancedText = polishNaturalness(corrected);
  const issues = [...sentenceIssues, ...tenseIssues];
  const dominantTenseProfile = buildDominantTenseProfile(corrected);
  const likelyMainTense = chooseLikelyMainTense(dominantTenseProfile);
  const paragraphAnalysis = analyzeParagraph(
    corrected,
    structureAnalysis,
    dominantTenseProfile
  );

  let grammarScore = 95;
  let clarityScore = 92;
  let naturalnessScore = 90;

  grammarScore = Math.max(60, grammarScore - issues.length * 4);
  clarityScore = Math.max(65, clarityScore - Math.min(issues.length * 2, 20));
  naturalnessScore = Math.max(60, naturalnessScore - Math.min(issues.length * 3, 25));

  if (advancedPatterns.length >= 2 && issues.length === 0) {
    clarityScore = Math.min(99, clarityScore + 4);
    naturalnessScore = Math.min(98, naturalnessScore + 3);
  }

  if (advancedPatterns.some((p) => p.name === 'Negative adverbial inversion') && issues.length === 0) {
    clarityScore = Math.min(99, clarityScore + 1);
    naturalnessScore = Math.min(99, naturalnessScore + 1);
  }

  if (paragraphAnalysis?.flow === 'strong') {
    clarityScore = Math.min(99, clarityScore + 2);
  }

  const analysis: AnalysisResult = {
    grammarPoints,
    issues: issues.map(
      (issue) => `${issue.category ?? 'issue'}: ${issue.reason}`
    ),
    advancedPatterns: advancedPatterns.map((pattern) => ({
      name: pattern.name,
      example: pattern.example,
      explanation: pattern.explanation,
      level: pattern.level === 'advanced' ? 'advanced' : 'intermediate',
    })),
    tenseAnalysis: {
      detected: grammarPoints,
      likelyMainTense,
      dominantTenseProfile,
      notes: detection.notes,
    },
    structureAnalysis,
    score: {
      grammar: grammarScore,
      clarity: clarityScore,
      naturalness: naturalnessScore,
    },
    levelSignal: buildLevelSignal(structureAnalysis, advancedPatterns, issues),
  };

  const learnerMemory =
    learnerMemoryStore.get(learnerId) ?? createEmptyLearnerMemory(learnerId);

  const dueReviews = getDueReviews(learnerMemory);

  const decisionInput: LearnerMemory = {
    ...learnerMemory,
    reviewQueue: dueReviews.length > 0 ? dueReviews : learnerMemory.reviewQueue,
  };

  const baseTeachingPoints = generateTeachingPoints(
    corrected,
    grammarPoints,
    advancedPatterns,
    writingMode,
    paragraphAnalysis
  );

  const decision = makeTeachingDecision({
    writingMode,
    paragraphAnalysis,
    issues,
    grammarPoints,
    teachingPoints: baseTeachingPoints,
    levelSignal: analysis.levelSignal,
    memory: decisionInput,
  });

  const updatedMemory = updateLearnerMemory(learnerMemory, decision);
  learnerMemoryStore.set(learnerId, updatedMemory);

  const practice = generatePracticeFromDecision(decision, corrected);
  const teachingPoints = buildDecisionTeachingPoints(baseTeachingPoints, decision);
  const overallAssessment = buildOverallAssessment(
    issues,
    structureAnalysis,
    advancedPatterns,
    writingMode,
    paragraphAnalysis
  );
  const levelSignal = decision.learnerLevelSignal;
  const grammarGloss = buildGrammarGloss(grammarPoints);
  const editedVersion = buildEditedVersion(
    corrected,
    enhancedText,
    writingMode,
    paragraphAnalysis,
    decision
  );

  return {
    correctedText: corrected,
    enhancedText,
    editedVersion,
    explanation: buildExplanation(
      cleaned,
      corrected,
      grammarPoints,
      detection.notes,
      advancedPatterns,
      decision,
      writingMode,
      paragraphAnalysis
    ),
    issues,
    grammarPoints,
    grammarGloss,
    tenseAnalysis: {
      detected: grammarPoints,
      likelyMainTense,
      dominantTenseProfile,
      notes: detection.notes,
    },
    score: {
      grammar: grammarScore,
      clarity: clarityScore,
      naturalness: naturalnessScore,
    },
    practice,
    overallAssessment,
    levelSignal,
    teachingPoints,
    advancedPatterns,
    structureAnalysis,
    writingMode,
    paragraphAnalysis,
    debugServerVersion: 'mercy-advanced-v10-server-stable',
    decision,
    memory: updatedMemory,
  };
}

app.get('/health', (_req, res) => {
  return res.status(200).json({
    ok: true,
    service: 'mercy-grammar-api',
    version: 'mercy-advanced-v10-server-stable',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health', (_req, res) => {
  return res.status(200).json({
    ok: true,
    service: 'mercy-grammar-api',
    version: 'mercy-advanced-v10-server-stable',
    timestamp: new Date().toISOString(),
  });
});

app.post('/api/mercy/grammar', (req, res) => {
  try {
    console.log('🔥 Grammar route loaded with advanced response');

    const text = String(req.body?.text ?? '').trim();

    if (!text) {
      return res.status(400).json({ error: 'Text is required.' });
    }

    const learnerId = String(req.body?.learnerId ?? 'demo-learner');
    const result = analyzeGrammar(text, learnerId);
    return res.json(result);
  } catch (error) {
    console.error('Grammar API failed:', error);
    return res.status(500).json({ error: 'Grammar analysis failed.' });
  }
});

const PORT = 3001;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Grammar API running on http://localhost:${PORT}`);
  console.log(`Grammar API health check on http://localhost:${PORT}/health`);
});

server.on('listening', () => {
  console.log('✅ Express server is listening');
});

server.on('close', () => {
  console.log('🛑 Express server closed');
});

server.on('error', (error) => {
  console.error('❌ Express server error:', error);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception:', error);
});

process.on('unhandledRejection', (reason) => {
  console.error('❌ Unhandled rejection:', reason);
});

process.on('exit', (code) => {
  console.log(`ℹ️ Process exiting with code ${code}`);
});

const heartbeat = setInterval(() => {
  console.log(`💓 Mercy server heartbeat ${new Date().toISOString()}`);
}, 15000);

function shutdown(signal: string) {
  console.log(`\n${signal} received. Shutting down Mercy server...`);
  clearInterval(heartbeat);

  server.close((error) => {
    if (error) {
      console.error('❌ Error while closing server:', error);
      process.exit(1);
      return;
    }

    console.log('✅ Mercy server shut down cleanly');
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));