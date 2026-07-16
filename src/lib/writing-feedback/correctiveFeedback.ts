export type WrittenErrorFamily =
  | 'articles'
  | 'tense'
  | 'punctuation'
  | 'plural'
  | 'word_order'
  | 'collocation'
  | 'other';

export interface WrittenFeedbackCandidate {
  id: string;
  family: WrittenErrorFamily;
  message: string;
  severity?: 'low' | 'medium' | 'high';
  span?: string;
  correction?: string;
}

export interface SelectWrittenFeedbackFocusInput {
  candidates: WrittenFeedbackCandidate[];
  activeTargetFamily?: WrittenErrorFamily | null;
}

export interface WrittenFeedbackFocus {
  primary: WrittenFeedbackCandidate | null;
  secondary: WrittenFeedbackCandidate[];
  reason: 'active_target_family' | 'highest_severity' | 'none';
}

const SEVERITY_RANK: Record<NonNullable<WrittenFeedbackCandidate['severity']>, number> = {
  low: 1,
  medium: 2,
  high: 3,
};

function severityRank(candidate: WrittenFeedbackCandidate): number {
  return SEVERITY_RANK[candidate.severity ?? 'medium'];
}

function stableCandidateSort(
  a: WrittenFeedbackCandidate,
  b: WrittenFeedbackCandidate,
): number {
  const severityDelta = severityRank(b) - severityRank(a);
  if (severityDelta !== 0) return severityDelta;
  return a.id.localeCompare(b.id);
}

export function selectWrittenFeedbackFocus(
  input: SelectWrittenFeedbackFocusInput,
): WrittenFeedbackFocus {
  const candidates = input.candidates.slice();
  if (candidates.length === 0) {
    return { primary: null, secondary: [], reason: 'none' };
  }

  const activeFamily = input.activeTargetFamily ?? null;
  const activeMatches = activeFamily
    ? candidates.filter((candidate) => candidate.family === activeFamily)
    : [];
  const primary = (activeMatches.length > 0 ? activeMatches : candidates)
    .slice()
    .sort(stableCandidateSort)[0];

  return {
    primary,
    secondary: candidates.filter((candidate) => candidate.id !== primary.id),
    reason: activeMatches.length > 0 ? 'active_target_family' : 'highest_severity',
  };
}

export interface BuildWrittenMetalinguisticFeedbackInput {
  family: WrittenErrorFamily;
  learnerSentence: string;
  correctedSentence: string;
  priorAttemptsWithSameFamily?: number;
}

export interface WrittenMetalinguisticFeedback {
  kind: 'direct_correction' | 'metalinguistic_explanation';
  ruleLabel: string | null;
  explanation: string | null;
  correctedExample: string;
}

const RULE_EXPLANATIONS: Record<WrittenErrorFamily, { label: string; explanation: string }> = {
  articles: {
    label: 'Article before singular count nouns',
    explanation: 'Use a or an before one singular count noun when it is introduced for the first time.',
  },
  tense: {
    label: 'Verb tense marks time',
    explanation: 'Match the verb form to the time signal so the reader knows when the action happened.',
  },
  punctuation: {
    label: 'Sentence boundary',
    explanation: 'Separate complete ideas with a period, semicolon, or connector instead of joining them with only a comma.',
  },
  plural: {
    label: 'Plural noun marking',
    explanation: 'Use a plural noun form after numbers and quantity words such as many, several, or two.',
  },
  word_order: {
    label: 'English word order',
    explanation: 'Keep the subject and verb in the expected English order unless the sentence uses a licensed question or emphasis pattern.',
  },
  collocation: {
    label: 'Natural word partnership',
    explanation: 'Some English words commonly travel together; use the expected partner rather than a literal translation.',
  },
  other: {
    label: 'Repeated writing pattern',
    explanation: 'Focus on the repeated pattern and apply the same fix when it appears again.',
  },
};

export function buildWrittenMetalinguisticFeedback(
  input: BuildWrittenMetalinguisticFeedbackInput,
): WrittenMetalinguisticFeedback {
  const repeated = (input.priorAttemptsWithSameFamily ?? 0) >= 1;
  const rule = RULE_EXPLANATIONS[input.family] ?? RULE_EXPLANATIONS.other;
  if (!repeated) {
    return {
      kind: 'direct_correction',
      ruleLabel: null,
      explanation: null,
      correctedExample: input.correctedSentence,
    };
  }

  return {
    kind: 'metalinguistic_explanation',
    ruleLabel: rule.label,
    explanation: rule.explanation,
    correctedExample: input.correctedSentence,
  };
}

export interface RepresentativeWrittenErrorInput {
  errors: WrittenFeedbackCandidate[];
}

export interface RepresentativeWrittenErrorSelection {
  selected: WrittenFeedbackCandidate[];
  suppressedCount: number;
  patternCue: string | null;
}

export function selectRepresentativeWrittenErrors(
  input: RepresentativeWrittenErrorInput,
): RepresentativeWrittenErrorSelection {
  const byFamily = new Map<WrittenErrorFamily, WrittenFeedbackCandidate[]>();
  for (const error of input.errors) {
    const bucket = byFamily.get(error.family) ?? [];
    bucket.push(error);
    byFamily.set(error.family, bucket);
  }

  const selected: WrittenFeedbackCandidate[] = [];
  let suppressedCount = 0;
  const repeatedFamilies: WrittenErrorFamily[] = [];

  for (const [family, errors] of byFamily.entries()) {
    const representative = errors.slice().sort(stableCandidateSort)[0];
    if (representative) selected.push(representative);
    if (errors.length > 1) {
      suppressedCount += errors.length - 1;
      repeatedFamilies.push(family);
    }
  }

  selected.sort((a, b) => input.errors.indexOf(a) - input.errors.indexOf(b));

  return {
    selected,
    suppressedCount,
    patternCue:
      suppressedCount > 0
        ? `Fix this ${repeatedFamilies.join(', ')} pattern once, then scan for the same pattern again.`
        : null,
  };
}
