// File: server/mercy/decision.ts

export type WritingMode = 'sentence' | 'paragraph' | 'essay';

export type ParagraphAnalysis = {
  flow?: 'weak' | 'developing' | 'strong' | string;
  ideaConnection?: 'weak' | 'developing' | 'strong' | string;
  tenseConsistency?: 'weak' | 'mixed but controlled' | 'strong' | string;
  notes?: string[];
};

export type GrammarIssue = {
  original?: string;
  corrected?: string;
  reason?: string;
  category?: string;
  grammarPoint?: string;
};

export type TeachingDecisionTaskType =
  | 'quickFix'
  | 'contrast'
  | 'production'
  | 'review'
  | 'linking'
  | 'rewrite';

export type TeachingDecisionTask = {
  type: TeachingDecisionTaskType;
  focus: string;
  priority: number;
  reason: string;
};

export type TeachingDecision = {
  primaryFocus: string;
  secondaryFocuses: string[];
  praiseFocus?: string;
  learnerLevelSignal: string;
  responseMode: 'explain' | 'coach' | 'challenge';
  taskPlan: TeachingDecisionTask[];
  shouldReviewOldIssue: boolean;
  shouldIntroduceStretchTask: boolean;
  shouldReduceExplanation: boolean;
  explanationDepth: 'full' | 'medium' | 'minimal';
  responseTone: 'supportive' | 'balanced' | 'pushing';
};

export type LearnerMemory = {
  recurringIssues?: Record<string, number>;
  strengths?: Record<string, number>;
  recentTasks?: {
    type: TeachingDecisionTaskType;
    focus: string;
    assignedAt: string;
  }[];
  reviewQueue?: {
    focus: string;
    nextReviewAt: string;
    intervalDays: number;
    successCount: number;
  }[];
  levelTrend?: 'rising' | 'stable' | 'struggling';
};

export type BuildDecisionInput = {
  writingMode?: WritingMode;
  paragraphAnalysis?: ParagraphAnalysis;
  issues?: GrammarIssue[];
  grammarPoints?: string[];
  teachingPoints?: string[];
  levelSignal?: string;
  memory?: LearnerMemory;
};

type CandidateTask = TeachingDecisionTask & {
  source: 'paragraph' | 'grammar' | 'memory';
};

function normalize(value?: string | null) {
  return (value ?? '').trim().toLowerCase();
}

function includesAny(value: string, parts: string[]) {
  return parts.some((part) => value.includes(part));
}

function getSeverityScore(issues: GrammarIssue[] = []) {
  if (issues.length === 0) return 0;

  let score = 0;

  for (const issue of issues) {
    const category = normalize(issue.category);
    const reason = normalize(issue.reason);
    const point = normalize(issue.grammarPoint);

    if (
      includesAny(category, ['capitalization', 'punctuation', 'spacing']) ||
      includesAny(reason, ['capitalize', 'punctuation'])
    ) {
      score += 0.5;
      continue;
    }

    if (
      includesAny(category, ['spelling', 'word choice']) ||
      includesAny(reason, ['spelling', 'word choice', 'more natural'])
    ) {
      score += 1;
      continue;
    }

    if (
      includesAny(category, ['grammar', 'tense']) ||
      includesAny(point, [
        'simple past',
        'present simple',
        'present continuous',
        'present perfect',
        'present perfect continuous',
        'subject-verb agreement',
        'articles',
        'prepositions',
      ])
    ) {
      score += 2;
      continue;
    }

    score += 1.5;
  }

  return score;
}

function hasSevereGrammarNeed(issues: GrammarIssue[] = []) {
  const score = getSeverityScore(issues);
  return score >= 7 || issues.length >= 5;
}

function hasModerateGrammarNeed(issues: GrammarIssue[] = []) {
  const score = getSeverityScore(issues);
  return score >= 3 || issues.length >= 2;
}

function getTopRecurringFocus(memory?: LearnerMemory) {
  const entries = Object.entries(memory?.recurringIssues ?? {}).sort((a, b) => b[1] - a[1]);
  return entries[0]?.[0];
}

function pushCandidate(tasks: CandidateTask[], candidate: CandidateTask) {
  const existing = tasks.find(
    (task) => task.type === candidate.type && normalize(task.focus) === normalize(candidate.focus)
  );

  if (!existing) {
    tasks.push(candidate);
    return;
  }

  if (candidate.priority > existing.priority) {
    existing.priority = candidate.priority;
    existing.reason = candidate.reason;
    existing.source = candidate.source;
  }
}

function buildParagraphCandidates(input: BuildDecisionInput): CandidateTask[] {
  const writingMode = input.writingMode;
  const p = input.paragraphAnalysis;
  const tasks: CandidateTask[] = [];

  console.log('DEBUG buildParagraphCandidates:', {
    writingMode,
    paragraphAnalysis: p,
  });

  if (writingMode !== 'paragraph' && writingMode !== 'essay') {
    console.log('DEBUG paragraph tasks:', tasks);
    return tasks;
  }

  const flow = normalize(p?.flow);
  const ideaConnection = normalize(p?.ideaConnection);
  const tenseConsistency = normalize(p?.tenseConsistency);

  const paragraphWeak =
    flow === 'weak' || ideaConnection === 'weak' || tenseConsistency === 'weak';

  const paragraphDeveloping =
    flow === 'developing' ||
    ideaConnection === 'developing' ||
    tenseConsistency === 'mixed but controlled';

  const goodParagraphBase = !paragraphWeak;

  if (flow === 'weak' || flow === 'developing') {
    pushCandidate(tasks, {
      type: 'rewrite',
      focus: 'paragraph flow',
      priority: flow === 'weak' ? 99 : 95,
      reason: 'The paragraph needs stronger movement from one sentence to the next.',
      source: 'paragraph',
    });
  }

  if (ideaConnection === 'weak' || ideaConnection === 'developing') {
    pushCandidate(tasks, {
      type: 'linking',
      focus: 'idea connection',
      priority: ideaConnection === 'weak' ? 98 : 96,
      reason: 'The ideas are understandable, but transitions should be more explicit.',
      source: 'paragraph',
    });
  }

  if (tenseConsistency === 'weak') {
    pushCandidate(tasks, {
      type: 'rewrite',
      focus: 'tense consistency across the paragraph',
      priority: 97,
      reason: 'The paragraph shifts time frames in a confusing way.',
      source: 'paragraph',
    });
  }

  if (tenseConsistency === 'mixed but controlled') {
    pushCandidate(tasks, {
      type: 'linking',
      focus: 'time-frame connection across sentences',
      priority: 93,
      reason: 'The paragraph mixes time frames understandably, but transitions can be smoother.',
      source: 'paragraph',
    });
  }

  if (tasks.length === 0 && goodParagraphBase) {
    pushCandidate(tasks, {
      type: 'rewrite',
      focus: 'paragraph coherence',
      priority: 91,
      reason: 'Paragraph writing should still receive whole-paragraph coaching, not only sentence correction.',
      source: 'paragraph',
    });
  }

  if (paragraphDeveloping && tasks.every((task) => task.type !== 'linking')) {
    pushCandidate(tasks, {
      type: 'linking',
      focus: 'linking devices',
      priority: 92,
      reason: 'Developing paragraphs benefit from explicit connectors and smoother transitions.',
      source: 'paragraph',
    });
  }

  console.log('DEBUG paragraph tasks:', tasks);

  return tasks;
}

function buildGrammarCandidates(input: BuildDecisionInput): CandidateTask[] {
  const grammarPoints = [...new Set(input.grammarPoints ?? [])];
  const tasks: CandidateTask[] = [];

  for (const point of grammarPoints) {
    const key = normalize(point);

    if (key === 'simple past') {
      pushCandidate(tasks, {
        type: 'quickFix',
        focus: 'simple past with finished time markers',
        priority: 78,
        reason: 'A finished past-time marker was detected.',
        source: 'grammar',
      });
      continue;
    }

    if (key === 'present continuous') {
      pushCandidate(tasks, {
        type: 'quickFix',
        focus: 'present continuous for ongoing action',
        priority: 76,
        reason: 'An ongoing action pattern was detected.',
        source: 'grammar',
      });
      continue;
    }

    if (key === 'present perfect continuous') {
      pushCandidate(tasks, {
        type: 'contrast',
        focus: 'ongoing action from past to present',
        priority: 80,
        reason: 'The learner may need tense contrast for continuing actions.',
        source: 'grammar',
      });
      continue;
    }

    if (key === 'present perfect') {
      pushCandidate(tasks, {
        type: 'contrast',
        focus: 'past action connected to the present',
        priority: 77,
        reason: 'This pattern often benefits from contrast explanation.',
        source: 'grammar',
      });
      continue;
    }

    pushCandidate(tasks, {
      type: 'quickFix',
      focus: point,
      priority: 72,
      reason: `Detected grammar point: ${point}.`,
      source: 'grammar',
    });
  }

  const hasPast = grammarPoints.some((p) => normalize(p) === 'simple past');
  const hasPresentCont = grammarPoints.some((p) => normalize(p) === 'present continuous');
  const hasPpc = grammarPoints.some((p) => normalize(p) === 'present perfect continuous');

  if ((hasPast && hasPresentCont) || (hasPast && hasPpc)) {
    pushCandidate(tasks, {
      type: 'review',
      focus: 'tense contrast across finished and ongoing actions',
      priority: 84,
      reason: 'The writing mixes a finished past action with an ongoing or present-linked action.',
      source: 'grammar',
    });
  }

  return tasks;
}

function buildMemoryCandidates(input: BuildDecisionInput): CandidateTask[] {
  const tasks: CandidateTask[] = [];
  const topRecurring = getTopRecurringFocus(input.memory);

  if (topRecurring) {
    pushCandidate(tasks, {
      type: 'review',
      focus: topRecurring,
      priority: 74,
      reason: 'This focus has appeared repeatedly in learner memory.',
      source: 'memory',
    });
  }

  return tasks;
}

function sortByPriority(tasks: CandidateTask[]) {
  return [...tasks].sort((a, b) => b.priority - a.priority);
}

function takeFirstUnique(
  result: CandidateTask[],
  source: CandidateTask[],
  count = 1,
  filter?: (task: CandidateTask) => boolean
) {
  for (const task of source) {
    if (result.length >= count + result.length) break;
    if (filter && !filter(task)) continue;
    const exists = result.some(
      (existing) => existing.type === task.type && normalize(existing.focus) === normalize(task.focus)
    );
    if (!exists) {
      result.push(task);
      if (result.filter((item) => !exists).length >= count) {
        // no-op guard to satisfy structure; actual count control is below
      }
    }
    const addedCount = result.filter((item) => source.includes(item)).length;
    if (addedCount >= count) break;
  }
}

function addUniqueTask(result: CandidateTask[], task?: CandidateTask) {
  if (!task) return;
  const exists = result.some(
    (existing) => existing.type === task.type && normalize(existing.focus) === normalize(task.focus)
  );
  if (!exists) result.push(task);
}

function buildParagraphAwareTaskPlan(tasks: CandidateTask[], input: BuildDecisionInput): CandidateTask[] {
  const writingMode = input.writingMode;
  const severe = hasSevereGrammarNeed(input.issues ?? []);
  const moderate = hasModerateGrammarNeed(input.issues ?? []);

  const sorted = sortByPriority(tasks);

  if (writingMode !== 'paragraph' && writingMode !== 'essay') {
    return sorted;
  }

  const paragraphTasks = sorted.filter((task) => task.type === 'linking' || task.type === 'rewrite');
  const grammarTasks = sorted.filter((task) => task.source === 'grammar');
  const memoryTasks = sorted.filter((task) => task.source === 'memory');
  const leftovers = sorted.filter(
    (task) =>
      !paragraphTasks.includes(task) && !grammarTasks.includes(task) && !memoryTasks.includes(task)
  );

  const result: CandidateTask[] = [];

  if (severe) {
    addUniqueTask(result, grammarTasks[0]);
    addUniqueTask(result, paragraphTasks[0]);
    addUniqueTask(result, grammarTasks[1]);
  } else {
    addUniqueTask(result, paragraphTasks[0]);

    if (moderate) {
      addUniqueTask(result, grammarTasks[0]);
      addUniqueTask(result, paragraphTasks[1] ?? memoryTasks[0]);
    } else {
      addUniqueTask(result, paragraphTasks[1] ?? memoryTasks[0]);
      addUniqueTask(result, grammarTasks[0]);
    }
  }

  for (const pool of [paragraphTasks, grammarTasks, memoryTasks, leftovers]) {
    for (const task of pool) {
      if (result.length >= 5) break;
      addUniqueTask(result, task);
    }
    if (result.length >= 5) break;
  }

  return result
    .map((task, index) => ({
      ...task,
      priority:
        index === 0 && (task.type === 'linking' || task.type === 'rewrite') && !severe
          ? Math.max(task.priority, 100)
          : index === 0 && severe
            ? Math.max(task.priority, 100)
            : Math.max(task.priority, 96 - index),
    }))
    .sort((a, b) => b.priority - a.priority);
}

function choosePrimaryFocus(taskPlan: TeachingDecisionTask[], input: BuildDecisionInput) {
  if (taskPlan.length > 0) {
    return taskPlan[0].focus;
  }

  if (input.writingMode === 'paragraph' || input.writingMode === 'essay') {
    return 'paragraph flow and idea connection';
  }

  return 'core grammar control';
}

function buildSecondaryFocuses(taskPlan: TeachingDecisionTask[], primaryFocus: string) {
  return taskPlan
    .slice(1)
    .map((task) => task.focus)
    .filter((focus) => normalize(focus) !== normalize(primaryFocus))
    .slice(0, 3);
}

function chooseResponseMode(input: BuildDecisionInput): TeachingDecision['responseMode'] {
  const severe = hasSevereGrammarNeed(input.issues ?? []);
  if (severe) return 'coach';
  if (input.writingMode === 'essay') return 'challenge';
  return 'coach';
}

function chooseExplanationDepth(input: BuildDecisionInput): TeachingDecision['explanationDepth'] {
  const severe = hasSevereGrammarNeed(input.issues ?? []);
  if (severe) return 'full';
  if (input.writingMode === 'paragraph' || input.writingMode === 'essay') return 'medium';
  return 'medium';
}

function choosePraiseFocus(input: BuildDecisionInput): string | undefined {
  const strengths = Object.entries(input.memory?.strengths ?? {}).sort((a, b) => b[1] - a[1]);
  if (strengths[0]?.[0]) return strengths[0][0];

  if (normalize(input.paragraphAnalysis?.flow) === 'strong') return 'clear paragraph flow';
  if (normalize(input.paragraphAnalysis?.ideaConnection) === 'strong') return 'clear idea connection';
  if (normalize(input.paragraphAnalysis?.tenseConsistency) === 'strong') return 'stable tense control';

  return undefined;
}

export function buildTeachingDecision(input: BuildDecisionInput): TeachingDecision {
  const paragraphCandidates = buildParagraphCandidates(input);
  const grammarCandidates = buildGrammarCandidates(input);
  const memoryCandidates = buildMemoryCandidates(input);

  const merged: CandidateTask[] = [];

  for (const task of [...paragraphCandidates, ...grammarCandidates, ...memoryCandidates]) {
    pushCandidate(merged, task);
  }

  const reordered = buildParagraphAwareTaskPlan(merged, input);

  const taskPlan: TeachingDecisionTask[] = reordered.slice(0, 3).map((task) => ({
    type: task.type,
    focus: task.focus,
    priority: task.priority,
    reason: task.reason,
  }));

  const primaryFocus = choosePrimaryFocus(taskPlan, input);

  return {
    primaryFocus,
    secondaryFocuses: buildSecondaryFocuses(taskPlan, primaryFocus),
    praiseFocus: choosePraiseFocus(input),
    learnerLevelSignal: input.levelSignal ?? 'unknown',
    responseMode: chooseResponseMode(input),
    taskPlan,
    shouldReviewOldIssue: Boolean(getTopRecurringFocus(input.memory)),
    shouldIntroduceStretchTask: input.writingMode === 'essay',
    shouldReduceExplanation: false,
    explanationDepth: chooseExplanationDepth(input),
    responseTone: input.writingMode === 'essay' ? 'balanced' : 'supportive',
  };
}

// Alias export for compatibility with server/index.ts
export const makeTeachingDecision = buildTeachingDecision;