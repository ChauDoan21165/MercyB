// src/components/mercy-guide/tabs/grammar-writing/teacher.ts

import type {
  GrammarApiResponse,
  TeacherWritingTask,
} from './types';
import { normalizeMeaningfulText } from './utils';

export function shouldAutoApplyTeacherPrefill(input: {
  currentDraft: string;
  hasUserEditedDraft: boolean;
  teacherTask?: TeacherWritingTask;
  previousTriggerToken?: string;
}) {
  const { currentDraft, hasUserEditedDraft, teacherTask, previousTriggerToken } = input;

  if (!teacherTask?.prefillText) return false;

  const trimmedDraft = normalizeMeaningfulText(currentDraft);
  const triggerChanged =
    teacherTask.triggerToken &&
    teacherTask.triggerToken !== previousTriggerToken;

  if (!trimmedDraft) return true;
  if (triggerChanged && !hasUserEditedDraft) return true;

  return false;
}

export function buildTeacherInstructionText(teacherTask?: TeacherWritingTask) {
  if (!teacherTask) return null;
  if (teacherTask.instruction) return teacherTask.instruction;
  if (teacherTask.focus) {
    return `Mercy wants you to ${teacherTask.taskType} with focus on ${teacherTask.focus}.`;
  }
  return `Mercy sent you here for a ${teacherTask.taskType} task.`;
}

export function getTeacherEmphasis(
  result: GrammarApiResponse | null,
  teacherTask?: TeacherWritingTask,
) {
  if (!result || !teacherTask) return null;

  if (teacherTask.taskType === 'rewrite') {
    return {
      title: 'Teacher focus after analysis',
      subtitle: 'Revision quality and idea flow now matter most.',
      body:
        result.paragraphAnalysis?.flow ||
        result.paragraphAnalysis?.ideaConnection ||
        result.practice?.tasks?.find((task) => task.type === 'rewrite')?.instruction ||
        result.explanation ||
        'Mercy wants your revision to feel more connected and natural from one sentence to the next.',
    };
  }

  if (teacherTask.taskType === 'linking') {
    return {
      title: 'Teacher focus after analysis',
      subtitle: 'Connection and transitions now matter most.',
      body:
        result.paragraphAnalysis?.ideaConnection ||
        result.practice?.tasks?.find((task) => task.type === 'linking')?.instruction ||
        result.paragraphAnalysis?.flow ||
        result.explanation ||
        'Mercy wants stronger bridges between your ideas.',
    };
  }

  if (teacherTask.taskType === 'quickFix') {
    const primaryIssue = result.issues?.[0];
    const quickFixTask = result.practice?.tasks?.find((task) => task.type === 'quickFix');

    return {
      title: 'Teacher focus after analysis',
      subtitle: 'Fix the specific grammar problem first.',
      body:
        primaryIssue?.reason ||
        quickFixTask?.question ||
        quickFixTask?.explanation ||
        result.explanation ||
        'Mercy wants one precise grammar correction before moving on.',
    };
  }

  if (teacherTask.taskType === 'production') {
    const productionTask = result.practice?.tasks?.find((task) => task.type === 'production');

    return {
      title: 'Teacher focus after analysis',
      subtitle: 'Natural learner-generated output matters most.',
      body:
        productionTask?.instruction ||
        result.overallAssessment ||
        result.explanation ||
        'Mercy wants you to produce your own sentence naturally, not only copy corrections.',
    };
  }

  return {
    title: 'Teacher focus after analysis',
    subtitle: 'Mercy is still guiding this writing task.',
    body:
      result.explanation ||
      result.overallAssessment ||
      'Mercy is using the analysis to support the assigned task.',
  };
}