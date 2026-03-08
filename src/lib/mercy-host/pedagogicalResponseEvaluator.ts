/**
 * pedagogicalResponseEvaluator.ts
 *
 * Evaluates the pedagogical quality of a generated Mercy teaching turn.
 *
 * Purpose:
 * - detect weak teaching responses before they feel bot-like
 * - ensure each response is actionable, appropriate, and mode-consistent
 * - provide small repair hints for post-processing or future retries
 *
 * Design notes:
 * - pure and deterministic
 * - no storage required
 * - safe for tests
 * - intended to sit after planning / generation, before final delivery
 */

export type EvaluatorSeverity = 'info' | 'warn' | 'fail';

export type PedagogicalIssueCode =
  | 'missing_concrete_correction'
  | 'missing_example'
  | 'missing_next_step'
  | 'too_vague'
  | 'too_long_for_drill'
  | 'too_long_for_recap'
  | 'too_brief_for_explanation'
  | 'too_brief_for_correction'
  | 'tone_too_harsh_for_sensitive_moment'
  | 'tone_too_soft_for_directness'
  | 'humor_in_sensitive_moment'
  | 'humor_in_correction'
  | 'challenge_without_task'
  | 'review_without_concept_anchor'
  | 'repetition_heavy'
  | 'lacks_acknowledgement_after_repeated_mistake'
  | 'missing_repair_signal'
  | 'mode_text_mismatch';

export interface PedagogicalResponseEvaluationInput {
  text: string;
  textAlt?: string;

  teachingMode: string;
  tone?: string;
  correctionStyle?: string;

  concept?: string | null;
  mistake?: string | null;
  fix?: string | null;
  example?: string | null;
  nextPrompt?: string | null;
  summary?: string | null;
  explanation?: string | null;

  repeatedMistake?: boolean;
  shouldReviewConcept?: boolean;
  requireDirectness?: boolean;
  wantsExplanation?: boolean;
  wantsChallenge?: boolean;
  wantsDrill?: boolean;
  wantsRecap?: boolean;

  isSensitiveMoment?: boolean;
  isCorrectiveTurn?: boolean;
  shouldUseHumor?: boolean;
  shouldAcknowledgeEffort?: boolean;
}

export interface PedagogicalIssue {
  code: PedagogicalIssueCode;
  severity: EvaluatorSeverity;
  message: string;
}

export interface PedagogicalResponseEvaluation {
  score: number;
  pass: boolean;
  issues: PedagogicalIssue[];
  strengths: string[];
  repairHints: string[];
}

function normalize(value?: string | null): string {
  return (value ?? '').trim().toLowerCase();
}

function cleanText(value?: string | null): string {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function wordCount(text: string): number {
  const normalized = cleanText(text);
  if (!normalized) return 0;
  return normalized.split(/\s+/).length;
}

function sentenceCount(text: string): number {
  const normalized = cleanText(text);
  if (!normalized) return 0;

  const matches = normalized.match(/[.!?]+/g);
  if (matches?.length) return matches.length;

  return normalized.includes(':') ? 1 : 0;
}

function containsAny(text: string, patterns: string[]): boolean {
  const hay = normalize(text);
  return patterns.some((pattern) => hay.includes(normalize(pattern)));
}

function countOccurrences(text: string, term: string): number {
  const source = normalize(text);
  const target = normalize(term);

  if (!target) return 0;

  let count = 0;
  let index = 0;

  while (index < source.length) {
    const found = source.indexOf(target, index);
    if (found === -1) break;
    count += 1;
    index = found + target.length;
  }

  return count;
}

function clampScore(value: number): number {
  if (value < 0) return 0;
  if (value > 100) return 100;
  return Math.round(value);
}

function isMode(input: PedagogicalResponseEvaluationInput, value: string): boolean {
  return normalize(input.teachingMode) === normalize(value);
}

function hasConcreteTask(text: string, nextPrompt?: string | null): boolean {
  return (
    Boolean(normalize(nextPrompt)) ||
    containsAny(text, [
      'try:',
      'now say:',
      'rewrite:',
      'translate:',
      'say:',
      'make one sentence',
      'one more sentence',
      'next step',
      'try one sentence',
      'focus on',
      'practice',
    ])
  );
}

function hasExampleSignal(
  text: string,
  example?: string | null,
  nextPrompt?: string | null
): boolean {
  return (
    Boolean(normalize(example)) ||
    containsAny(text, [
      'for example',
      'example:',
      'try:',
      'now say:',
      'rewrite:',
      'translate:',
      'say:',
      'i went',
      'i have finished',
      'if i had known',
    ]) ||
    Boolean(normalize(nextPrompt))
  );
}

function hasCorrectionSignal(
  text: string,
  fix?: string | null,
  mistake?: string | null
): boolean {
  return (
    Boolean(normalize(fix)) ||
    containsAny(text, [
      'small fix',
      'use ',
      'say ',
      'correct form',
      'instead of',
      'not ',
      'changes in the past tense',
      'focus on',
    ]) ||
    Boolean(normalize(mistake))
  );
}

function hasAcknowledgement(text: string): boolean {
  return containsAny(text, [
    "you're close",
    'you’re close',
    'good',
    'good work',
    'good —',
    "i'm here with you",
    'take your time',
    "you're doing well",
    'you’re doing well',
    'keep it simple',
    'let’s review this once more',
    "let's review this once more",
  ]);
}

function seemsHarsh(text: string): boolean {
  return containsAny(text, [
    'wrong',
    'no.',
    'bad',
    'obviously',
    'you should know',
    'again?',
    'that makes no sense',
    'come on',
  ]);
}

function seemsHumorous(text: string): boolean {
  return containsAny(text, [
    'meaner version',
    'earn its lunch',
    'boss',
    'haha',
    'slightly meaner',
    'slightly rude',
  ]);
}

function seemsVague(text: string): boolean {
  const wc = wordCount(text);

  if (wc === 0) return true;

  return (
    wc < 6 &&
    !containsAny(text, [
      'try',
      'use',
      'say',
      'rewrite',
      'translate',
      'focus',
      'small fix',
      'now say',
    ])
  );
}

function pushIssue(
  issues: PedagogicalIssue[],
  code: PedagogicalIssueCode,
  severity: EvaluatorSeverity,
  message: string
): void {
  if (issues.some((issue) => issue.code === code)) {
    return;
  }

  issues.push({ code, severity, message });
}

function pushStrength(strengths: string[], value: string): void {
  if (!strengths.includes(value)) {
    strengths.push(value);
  }
}

function pushHint(repairHints: string[], value: string): void {
  if (!repairHints.includes(value)) {
    repairHints.push(value);
  }
}

function evaluateModeSpecificRules(
  input: PedagogicalResponseEvaluationInput,
  issues: PedagogicalIssue[],
  strengths: string[],
  repairHints: string[]
): void {
  const text = cleanText(input.text);
  const mode = normalize(input.teachingMode);
  const wc = wordCount(text);

  if (mode === 'correct') {
    if (!hasCorrectionSignal(text, input.fix, input.mistake)) {
      pushIssue(
        issues,
        'missing_concrete_correction',
        'fail',
        'Correction turn does not contain a concrete correction.'
      );
      pushHint(repairHints, 'Add a direct correction line such as "Small fix:" or "Use ..."');
    } else {
      pushStrength(strengths, 'correction_is_concrete');
    }

    if (!hasConcreteTask(text, input.nextPrompt)) {
      pushIssue(
        issues,
        'missing_next_step',
        'warn',
        'Correction turn should end with a clear retry or next step.'
      );
      pushHint(repairHints, 'Add a retry prompt like "Try one sentence with ..."');
    }

    if (wc < 7) {
      pushIssue(
        issues,
        'too_brief_for_correction',
        'warn',
        'Correction turn is too brief to be teacherly and actionable.'
      );
      pushHint(repairHints, 'Add one calm guiding sentence after the correction.');
    }
  }

  if (mode === 'explain') {
    if (!hasExampleSignal(text, input.example, input.nextPrompt)) {
      pushIssue(
        issues,
        'missing_example',
        'warn',
        'Explanation turn should include an example or immediate practice line.'
      );
      pushHint(repairHints, 'Add an example sentence or "Now say:" prompt.');
    } else {
      pushStrength(strengths, 'explanation_includes_example_or_practice');
    }

    if (wc < 10 || sentenceCount(text) < 2) {
      pushIssue(
        issues,
        'too_brief_for_explanation',
        'warn',
        'Explanation turn is too brief for an explanation-focused move.'
      );
      pushHint(
        repairHints,
        'Add one short explanation sentence and one guided practice sentence.'
      );
    }
  }

  if (mode === 'challenge') {
    if (!containsAny(text, ['translate:', 'rewrite:', 'one step further'])) {
      pushIssue(
        issues,
        'challenge_without_task',
        'fail',
        'Challenge turn does not clearly contain a challenge task.'
      );
      pushHint(repairHints, 'Add a concrete transformation or translation task.');
    } else {
      pushStrength(strengths, 'challenge_contains_clear_task');
    }
  }

  if (mode === 'review') {
    const conceptNorm = normalize(input.concept);

    if (
      !conceptNorm &&
      !containsAny(text, [
        'focus on',
        'review',
        'past tense',
        'present perfect',
        'target structure',
      ])
    ) {
      pushIssue(
        issues,
        'review_without_concept_anchor',
        'warn',
        'Review turn should anchor the learner to a concept or target.'
      );
      pushHint(repairHints, 'Add a concept anchor like "Focus on past tense."');
    } else {
      pushStrength(strengths, 'review_has_concept_anchor');
    }
  }

  if (mode === 'drill' && wc > 18) {
    pushIssue(
      issues,
      'too_long_for_drill',
      'warn',
      'Drill turn is too long. Drill should stay brief and repeatable.'
    );
    pushHint(repairHints, 'Cut drill language to short repeatable commands.');
  }

  if (mode === 'recap' && wc > 24) {
    pushIssue(
      issues,
      'too_long_for_recap',
      'warn',
      'Recap turn is too long. Recap should stay compressed.'
    );
    pushHint(repairHints, 'Compress recap into one summary line plus one next step.');
  }
}

function evaluateToneRules(
  input: PedagogicalResponseEvaluationInput,
  issues: PedagogicalIssue[],
  strengths: string[],
  repairHints: string[]
): void {
  const text = cleanText(input.text);
  const mode = normalize(input.teachingMode);

  if (input.isSensitiveMoment && seemsHarsh(text)) {
    pushIssue(
      issues,
      'tone_too_harsh_for_sensitive_moment',
      'fail',
      'Sensitive-moment response sounds too harsh.'
    );
    pushHint(repairHints, 'Replace harsh wording with calm reassurance and one clear step.');
  }

  if (
    input.requireDirectness &&
    normalize(input.tone) === 'warm' &&
    mode === 'correct' &&
    normalize(input.correctionStyle) !== 'direct'
  ) {
    pushIssue(
      issues,
      'tone_too_soft_for_directness',
      'warn',
      'Directness was requested but the response may be too soft.'
    );
    pushHint(repairHints, 'Use a clearer correction line while keeping the tone respectful.');
  }

  if (input.isSensitiveMoment && (input.shouldUseHumor || seemsHumorous(text))) {
    pushIssue(
      issues,
      'humor_in_sensitive_moment',
      'fail',
      'Humor should not appear in a sensitive moment.'
    );
    pushHint(repairHints, 'Remove playful language from sensitive turns.');
  }

  if (mode === 'correct' && seemsHumorous(text) && !input.wantsChallenge) {
    pushIssue(
      issues,
      'humor_in_correction',
      'warn',
      'Correction turn includes humor that may weaken clarity.'
    );
    pushHint(repairHints, 'Keep correction turns calm and straightforward.');
  }

  if (!input.isSensitiveMoment && !seemsHarsh(text) && !input.shouldUseHumor) {
    pushStrength(strengths, 'tone_is_controlled');
  }

  if (input.shouldUseHumor && seemsHumorous(text) && mode === 'challenge') {
    pushStrength(strengths, 'humor_used_in_right_place');
  }
}

function evaluateStructureRules(
  input: PedagogicalResponseEvaluationInput,
  issues: PedagogicalIssue[],
  strengths: string[],
  repairHints: string[]
): void {
  const text = cleanText(input.text);
  const mode = normalize(input.teachingMode);

  if (seemsVague(text)) {
    pushIssue(
      issues,
      'too_vague',
      'warn',
      'Response is too vague to be instructionally useful.'
    );
    pushHint(repairHints, 'Add one concrete instruction or example.');
  }

  if (
    !hasConcreteTask(text, input.nextPrompt) &&
    mode !== 'recap' &&
    mode !== 'encourage'
  ) {
    pushIssue(
      issues,
      'missing_next_step',
      'warn',
      'Response does not clearly tell the learner what to do next.'
    );
    pushHint(repairHints, 'End with one specific learner action.');
  }

  const repeatedTerms = [input.concept ?? '', input.mistake ?? '', input.fix ?? '']
    .map(normalize)
    .filter(Boolean);

  const repetitionHeavy = repeatedTerms.some((term) => countOccurrences(text, term) >= 3);

  if (repetitionHeavy) {
    pushIssue(
      issues,
      'repetition_heavy',
      'info',
      'Response may be overly repetitive.'
    );
    pushHint(repairHints, 'Keep one clear correction, then vary the phrasing.');
  } else {
    pushStrength(strengths, 'response_not_overly_repetitive');
  }
}

function evaluateRecoveryRules(
  input: PedagogicalResponseEvaluationInput,
  issues: PedagogicalIssue[],
  strengths: string[],
  repairHints: string[]
): void {
  const text = cleanText(input.text);

  if (input.repeatedMistake && !hasAcknowledgement(text) && !input.shouldAcknowledgeEffort) {
    pushIssue(
      issues,
      'lacks_acknowledgement_after_repeated_mistake',
      'warn',
      'Repeated-mistake turn should usually include calm acknowledgement.'
    );
    pushHint(repairHints, 'Add a line like "You’re close" or "Let’s review this once more."');
  }

  if (input.repeatedMistake && hasAcknowledgement(text)) {
    pushStrength(strengths, 'repeated_mistake_turn_acknowledges_effort');
  }

  if (
    input.repeatedMistake &&
    !containsAny(text, ['review', 'try:', 'focus on', 'small fix', 'use ', 'now say:'])
  ) {
    pushIssue(
      issues,
      'missing_repair_signal',
      'warn',
      'Repeated-mistake turn should show a clear repair path.'
    );
    pushHint(repairHints, 'Add a repair signal: review, fix, focus, or retry prompt.');
  }
}

function evaluateModeTextAlignment(
  input: PedagogicalResponseEvaluationInput,
  issues: PedagogicalIssue[],
  strengths: string[],
  repairHints: string[]
): void {
  const mode = normalize(input.teachingMode);
  const text = normalize(input.text);

  const mismatched =
    (mode === 'challenge' && containsAny(text, ['small fix', 'let’s review', "let's review"])) ||
    (mode === 'drill' && containsAny(text, ['here is the key point', 'because'])) ||
    (mode === 'recap' && containsAny(text, ['small fix:', 'rewrite:'])) ||
    (mode === 'correct' && containsAny(text, ['translate:']) && !input.wantsChallenge);

  if (mismatched) {
    pushIssue(
      issues,
      'mode_text_mismatch',
      'warn',
      'The wording of the response does not fully match the intended teaching mode.'
    );
    pushHint(repairHints, 'Rewrite the surface text so it matches the selected mode.');
  } else {
    pushStrength(strengths, 'mode_and_surface_text_align');
  }
}

export function evaluatePedagogicalResponse(
  input: PedagogicalResponseEvaluationInput
): PedagogicalResponseEvaluation {
  const normalizedInput: PedagogicalResponseEvaluationInput = {
    ...input,
    text: cleanText(input.text),
    textAlt: cleanText(input.textAlt),
  };

  const issues: PedagogicalIssue[] = [];
  const strengths: string[] = [];
  const repairHints: string[] = [];

  evaluateModeSpecificRules(normalizedInput, issues, strengths, repairHints);
  evaluateToneRules(normalizedInput, issues, strengths, repairHints);
  evaluateStructureRules(normalizedInput, issues, strengths, repairHints);
  evaluateRecoveryRules(normalizedInput, issues, strengths, repairHints);
  evaluateModeTextAlignment(normalizedInput, issues, strengths, repairHints);

  let score = 100;

  for (const issue of issues) {
    if (issue.severity === 'fail') score -= 25;
    else if (issue.severity === 'warn') score -= 10;
    else score -= 4;
  }

  if (isMode(normalizedInput, 'correct') && hasCorrectionSignal(normalizedInput.text)) {
    score += 2;
  }

  if (isMode(normalizedInput, 'challenge') && hasConcreteTask(normalizedInput.text)) {
    score += 2;
  }

  if (isMode(normalizedInput, 'review') && containsAny(normalizedInput.text, ['focus on'])) {
    score += 2;
  }

  const finalScore = clampScore(score);
  const pass =
    !issues.some((issue) => issue.severity === 'fail') &&
    finalScore >= 70;

  return {
    score: finalScore,
    pass,
    issues,
    strengths: Array.from(new Set(strengths)),
    repairHints: Array.from(new Set(repairHints)),
  };
}

export default evaluatePedagogicalResponse;