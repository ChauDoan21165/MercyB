import type { LearnerMemory, TeachingDecision } from './types';

function todayIso() {
  return new Date().toISOString();
}

function addDaysIso(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

function incrementCounter(
  map: Record<string, number>,
  key: string | undefined,
  amount = 1
) {
  if (!key) return map;
  return {
    ...map,
    [key]: (map[key] ?? 0) + amount,
  };
}

export function createEmptyLearnerMemory(learnerId: string): LearnerMemory {
  return {
    learnerId,
    recurringIssues: {},
    strengths: {},
    recentTasks: [],
    reviewQueue: [],
    levelTrend: 'stable',
  };
}

function upsertReviewItem(
  reviewQueue: LearnerMemory['reviewQueue'],
  focus: string,
  intervalDays: number
): LearnerMemory['reviewQueue'] {
  const existing = reviewQueue.find((item) => item.focus === focus);

  if (existing) {
    return reviewQueue.map((item) =>
      item.focus === focus
        ? {
            ...item,
            nextReviewAt: addDaysIso(intervalDays),
            intervalDays,
          }
        : item
    );
  }

  return [
    ...reviewQueue,
    {
      focus,
      nextReviewAt: addDaysIso(intervalDays),
      intervalDays,
      successCount: 0,
    },
  ];
}

function trimRecentTasks(
  tasks: LearnerMemory['recentTasks'],
  max = 20
): LearnerMemory['recentTasks'] {
  return tasks.slice(-max);
}

function inferLevelTrend(
  memory: LearnerMemory,
  decision: TeachingDecision
): LearnerMemory['levelTrend'] {
  const issueCount = memory.recurringIssues[decision.primaryFocus] ?? 0;

  if (decision.praiseFocus && issueCount <= 1) {
    return 'rising';
  }

  if (issueCount >= 4 && decision.shouldReviewOldIssue) {
    return 'struggling';
  }

  return 'stable';
}

export function updateLearnerMemory(
  memory: LearnerMemory,
  decision: TeachingDecision
): LearnerMemory {
  let recurringIssues = { ...memory.recurringIssues };
  let strengths = { ...memory.strengths };
  let reviewQueue = [...memory.reviewQueue];

  recurringIssues = incrementCounter(recurringIssues, decision.primaryFocus, 1);

  for (const focus of decision.secondaryFocuses) {
    recurringIssues = incrementCounter(recurringIssues, focus, 1);
  }

  if (decision.praiseFocus) {
    strengths = incrementCounter(strengths, decision.praiseFocus, 1);
  }

  const recentTasks = trimRecentTasks([
    ...memory.recentTasks,
    ...decision.taskPlan.map((task) => ({
      type: task.type,
      focus: task.focus,
      assignedAt: todayIso(),
    })),
  ]);

  const primaryFocusCount = recurringIssues[decision.primaryFocus] ?? 0;

  if (decision.shouldReviewOldIssue || primaryFocusCount >= 2) {
    reviewQueue = upsertReviewItem(reviewQueue, decision.primaryFocus, 3);
  }

  if (primaryFocusCount >= 4) {
    reviewQueue = upsertReviewItem(reviewQueue, decision.primaryFocus, 7);
  }

  const nextMemory: LearnerMemory = {
    ...memory,
    recurringIssues,
    strengths,
    recentTasks,
    reviewQueue,
  };

  return {
    ...nextMemory,
    levelTrend: inferLevelTrend(nextMemory, decision),
  };
}

export function markReviewSuccess(
  memory: LearnerMemory,
  focus: string
): LearnerMemory {
  const updatedQueue = memory.reviewQueue.map((item) => {
    if (item.focus !== focus) return item;

    const nextSuccessCount = item.successCount + 1;
    const nextInterval =
      nextSuccessCount >= 3
        ? 14
        : nextSuccessCount === 2
        ? 7
        : 3;

    return {
      ...item,
      successCount: nextSuccessCount,
      intervalDays: nextInterval,
      nextReviewAt: addDaysIso(nextInterval),
    };
  });

  return {
    ...memory,
    reviewQueue: updatedQueue,
  };
}

export function getDueReviews(
  memory: LearnerMemory,
  nowIso = new Date().toISOString()
) {
  return memory.reviewQueue.filter((item) => item.nextReviewAt <= nowIso);
}