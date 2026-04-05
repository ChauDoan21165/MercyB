import type {
  GrammarApiResponse,
  GrammarWritingTeacherState,
  TeacherWritingTask,
} from './types';

export function buildTeacherWritingTask(input: {
  result: GrammarApiResponse | null;
  teacherWritingState: GrammarWritingTeacherState | null;
}): TeacherWritingTask | null {
  const { result, teacherWritingState } = input;
  const primaryTask = result?.practice?.tasks?.[0];
  const decisionTask = result?.decision?.taskPlan?.[0];

  const taskType =
    primaryTask?.type ?? decisionTask?.type ?? result?.decision?.primaryFocus ?? 'rewrite';

  const focus =
    primaryTask?.focus ??
    decisionTask?.focus ??
    result?.decision?.primaryFocus ??
    teacherWritingState?.teacherTask?.focus;

  const instruction =
    primaryTask?.instruction ??
    decisionTask?.reason ??
    (focus ? `Focus on ${focus}.` : 'Continue the teacher writing task.');

  const prefillText =
    teacherWritingState?.latestSubmittedText ||
    teacherWritingState?.revisionSourceText ||
    result?.correctedText ||
    result?.enhancedText ||
    '';

  return {
    taskType,
    focus,
    instruction,
    reason: decisionTask?.reason ?? primaryTask?.explanation ?? result?.explanation,
    prefillText,
    triggerToken: `${Date.now()}-${taskType}-${focus ?? 'general'}`,
  };
}
