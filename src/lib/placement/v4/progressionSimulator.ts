import type {
  CEFRLevel,
  PlacementV3L1InterferenceFlag,
  PlacementV3PerSkillProfile,
} from "../../../types/placement-v3";

export const PROGRESSION_SIMULATOR_VERSION = "placement-v4-progression-simulator-v1";

export const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;

export type ProgressionCefrLevel = (typeof CEFR_LEVELS)[number];

export type ProgressionSubskill =
  | "reading"
  | "listening"
  | "speaking"
  | "writing"
  | "conversation"
  | "grammar"
  | "vocabulary"
  | "pronunciation";

export type PlacementV3ProgressionInput = {
  cefr_overall: CEFRLevel;
  cefr_overall_confidence: number;
  cefr_per_skill?: PlacementV3PerSkillProfile;
  l1_interference_flags?: PlacementV3L1InterferenceFlag[];
  strengths?: string[];
  gaps?: string[];
};

export type StudyPlanAssumptions = {
  timelineDays?: number[];
  weeklyStudyDays?: number;
  minutesPerStudyDay?: number;
  lessonsPerStudyDay?: number;
  lessonCompletionVariance?: number[];
  dropoutVariance?: number[];
  spacedReviewRate?: number;
  speakingPracticeShare?: number;
  reviewCadenceDays?: number;
  seedLabel?: string;
};

export type ProgressionSubskillState = {
  subskill: ProgressionSubskill;
  startScore: number;
  score: number;
  cefr: ProgressionCefrLevel;
  confidence: number;
  l1Drag: number;
  studyGain: number;
  reviewGain: number;
  regression: number;
};

export type ProgressionSnapshot = {
  day: number;
  overallScore: number;
  overallCefr: ProgressionCefrLevel;
  completionRate: number;
  dropoutPressure: number;
  activeStudyDays: number;
  completedLessons: number;
  subskills: Record<ProgressionSubskill, ProgressionSubskillState>;
};

export type ProgressionTraceEvent = {
  day: number;
  type:
    | "study"
    | "review"
    | "dropout"
    | "plateau"
    | "regression"
    | "milestone";
  subskill?: ProgressionSubskill;
  delta: number;
  scoreAfter?: number;
  note: string;
};

export type ProgressionSimulationResult = {
  modelVersion: string;
  inputHash: string;
  assumptions: Required<StudyPlanAssumptions>;
  start: ProgressionSnapshot;
  snapshots: ProgressionSnapshot[];
  final: ProgressionSnapshot;
  trace: ProgressionTraceEvent[];
};

type MutableSubskillState = ProgressionSubskillState;

const SUBSKILLS: readonly ProgressionSubskill[] = [
  "reading",
  "listening",
  "speaking",
  "writing",
  "conversation",
  "grammar",
  "vocabulary",
  "pronunciation",
] as const;

const DEFAULT_TIMELINES = [30, 90, 180];
const CEFR_MIN = 0;
const CEFR_MAX = CEFR_LEVELS.length - 1;

const STUDY_WEIGHTS: Record<ProgressionSubskill, number> = {
  reading: 1.18,
  listening: 1,
  speaking: 0.78,
  writing: 0.92,
  conversation: 0.86,
  grammar: 0.96,
  vocabulary: 1.08,
  pronunciation: 0.74,
};

const REVIEW_WEIGHTS: Record<ProgressionSubskill, number> = {
  reading: 0.72,
  listening: 0.82,
  speaking: 0.68,
  writing: 0.74,
  conversation: 0.76,
  grammar: 0.92,
  vocabulary: 1.1,
  pronunciation: 0.86,
};

const L1_SENSITIVE: Record<ProgressionSubskill, number> = {
  reading: 0.18,
  listening: 0.36,
  speaking: 0.78,
  writing: 0.5,
  conversation: 0.64,
  grammar: 0.44,
  vocabulary: 0.2,
  pronunciation: 0.9,
};

export function simulateProgression(
  placement: PlacementV3ProgressionInput,
  assumptions: StudyPlanAssumptions = {},
): ProgressionSimulationResult {
  const normalizedAssumptions = normalizeAssumptions(assumptions);
  const maxDay = Math.max(...normalizedAssumptions.timelineDays);
  const states = initializeSubskills(placement);
  const trace: ProgressionTraceEvent[] = [];
  const snapshots: ProgressionSnapshot[] = [];
  let activeStudyDays = 0;
  let completedLessons = 0;

  const start = makeSnapshot(0, states, 1, 0, activeStudyDays, completedLessons);
  const l1Severity = l1SeverityScore(placement.l1_interference_flags ?? []);
  const seedOffset = stableSeed(normalizedAssumptions.seedLabel);

  for (let day = 1; day <= maxDay; day += 1) {
    const completionRate = varianceAt(
      normalizedAssumptions.lessonCompletionVariance,
      day,
      seedOffset,
      1,
    );
    const dropoutPressure = varianceAt(
      normalizedAssumptions.dropoutVariance,
      day,
      seedOffset + 7,
      0,
    );
    const isStudyDay = studyDay(day, normalizedAssumptions.weeklyStudyDays);
    const dropoutActive = dropoutPressure >= 0.72;
    const effectiveCompletion = clamp01(completionRate * (dropoutActive ? 0.16 : 1));

    if (isStudyDay && effectiveCompletion > 0.05) {
      activeStudyDays += 1;
      const lessonsToday =
        normalizedAssumptions.lessonsPerStudyDay * effectiveCompletion;
      completedLessons += lessonsToday;
      applyStudyDay({
        states,
        day,
        lessonsToday,
        assumptions: normalizedAssumptions,
        l1Severity,
        trace,
      });
    }

    if (dropoutActive) {
      applyDropoutDay(states, day, dropoutPressure, trace);
    }

    if (day % normalizedAssumptions.reviewCadenceDays === 0) {
      applyReviewDay(states, day, normalizedAssumptions, l1Severity, trace);
    }

    applyPlateauAndRegression(states, day, isStudyDay, dropoutActive, trace);

    if (normalizedAssumptions.timelineDays.includes(day)) {
      const snapshot = makeSnapshot(
        day,
        states,
        completionRate,
        dropoutPressure,
        activeStudyDays,
        completedLessons,
      );
      snapshots.push(snapshot);
      traceMilestones(snapshot, trace);
    }
  }

  const final = snapshots[snapshots.length - 1] ??
    makeSnapshot(maxDay, states, 1, 0, activeStudyDays, completedLessons);

  return {
    modelVersion: PROGRESSION_SIMULATOR_VERSION,
    inputHash: stableHash({ placement, assumptions: normalizedAssumptions }),
    assumptions: normalizedAssumptions,
    start,
    snapshots,
    final,
    trace,
  };
}

export function exportProgressionTrace(result: ProgressionSimulationResult): string {
  return stableStringify(result);
}

function normalizeAssumptions(
  assumptions: StudyPlanAssumptions,
): Required<StudyPlanAssumptions> {
  const timelineDays = [...(assumptions.timelineDays ?? DEFAULT_TIMELINES)]
    .filter((day) => Number.isInteger(day) && day > 0)
    .sort((a, b) => a - b);

  return {
    timelineDays: timelineDays.length ? timelineDays : [...DEFAULT_TIMELINES],
    weeklyStudyDays: clamp(Math.round(assumptions.weeklyStudyDays ?? 5), 0, 7),
    minutesPerStudyDay: clamp(assumptions.minutesPerStudyDay ?? 35, 0, 240),
    lessonsPerStudyDay: clamp(assumptions.lessonsPerStudyDay ?? 1.2, 0, 8),
    lessonCompletionVariance: normalizeVariance(
      assumptions.lessonCompletionVariance,
      1,
    ),
    dropoutVariance: normalizeVariance(assumptions.dropoutVariance, 0),
    spacedReviewRate: clamp01(assumptions.spacedReviewRate ?? 0.55),
    speakingPracticeShare: clamp01(assumptions.speakingPracticeShare ?? 0.25),
    reviewCadenceDays: clamp(Math.round(assumptions.reviewCadenceDays ?? 4), 1, 30),
    seedLabel: assumptions.seedLabel ?? "default",
  };
}

function normalizeVariance(values: number[] | undefined, fallback: number): number[] {
  const normalized = (values ?? [])
    .filter((value) => Number.isFinite(value))
    .map((value) => clamp01(value));
  return normalized.length ? normalized : [fallback];
}

function initializeSubskills(
  placement: PlacementV3ProgressionInput,
): Record<ProgressionSubskill, MutableSubskillState> {
  const overallScore = cefrToScore(placement.cefr_overall);
  const overallConfidence = clamp01(placement.cefr_overall_confidence);
  const perSkill = placement.cefr_per_skill ?? {};
  const l1Severity = l1SeverityScore(placement.l1_interference_flags ?? []);

  const raw: Record<ProgressionSubskill, { score: number; confidence: number }> = {
    reading: skillSeed(perSkill.reading, overallScore, overallConfidence),
    listening: skillSeed(perSkill.listening, overallScore, overallConfidence),
    speaking: skillSeed(perSkill.speaking, overallScore, overallConfidence),
    writing: skillSeed(perSkill.writing, overallScore, overallConfidence),
    conversation: skillSeed(perSkill.conversation, overallScore, overallConfidence),
    grammar: derivedSeed([perSkill.writing, perSkill.reading], overallScore, overallConfidence),
    vocabulary: derivedSeed([perSkill.reading, perSkill.listening], overallScore, overallConfidence),
    pronunciation: derivedSeed([perSkill.speaking, perSkill.listening], overallScore, overallConfidence),
  };

  return Object.fromEntries(
    SUBSKILLS.map((subskill) => {
      const score = clamp(raw[subskill].score, CEFR_MIN, CEFR_MAX);
      return [
        subskill,
        {
          subskill,
          startScore: round3(score),
          score: round3(score),
          cefr: scoreToCefr(score),
          confidence: round3(raw[subskill].confidence),
          l1Drag: round3(l1Severity * L1_SENSITIVE[subskill]),
          studyGain: 0,
          reviewGain: 0,
          regression: 0,
        },
      ];
    }),
  ) as Record<ProgressionSubskill, MutableSubskillState>;
}

function skillSeed(
  skill: { level: CEFRLevel; confidence: number } | undefined,
  fallbackScore: number,
  fallbackConfidence: number,
): { score: number; confidence: number } {
  if (!skill) return { score: fallbackScore, confidence: fallbackConfidence * 0.82 };
  return {
    score: cefrToScore(skill.level),
    confidence: clamp01(skill.confidence),
  };
}

function derivedSeed(
  skills: Array<{ level: CEFRLevel; confidence: number } | undefined>,
  fallbackScore: number,
  fallbackConfidence: number,
): { score: number; confidence: number } {
  const present = skills.filter(
    (skill): skill is { level: CEFRLevel; confidence: number } => Boolean(skill),
  );
  if (!present.length) return { score: fallbackScore, confidence: fallbackConfidence * 0.76 };
  const confidence = present.reduce((sum, skill) => sum + clamp01(skill.confidence), 0);
  const weighted = present.reduce(
    (sum, skill) => sum + cefrToScore(skill.level) * clamp01(skill.confidence),
    0,
  );
  return {
    score: confidence > 0 ? weighted / confidence : fallbackScore,
    confidence: confidence / present.length,
  };
}

function applyStudyDay(args: {
  states: Record<ProgressionSubskill, MutableSubskillState>;
  day: number;
  lessonsToday: number;
  assumptions: Required<StudyPlanAssumptions>;
  l1Severity: number;
  trace: ProgressionTraceEvent[];
}) {
  const effort = (args.assumptions.minutesPerStudyDay / 35) * args.lessonsToday;
  const baseGain = 0.00135 * effort;

  for (const subskill of SUBSKILLS) {
    const state = args.states[subskill];
    const l1Drag = args.l1Severity * L1_SENSITIVE[subskill] * 0.48;
    const speakingBoost =
      subskill === "speaking" || subskill === "pronunciation" || subskill === "conversation"
        ? 0.74 + args.assumptions.speakingPracticeShare
        : 1.06 - args.assumptions.speakingPracticeShare * 0.16;
    const highLevelFriction = 1 - Math.max(0, state.score - 2.2) * 0.11;
    const delta = baseGain *
      STUDY_WEIGHTS[subskill] *
      speakingBoost *
      clamp(highLevelFriction, 0.62, 1) *
      (1 - l1Drag);

    bumpState(state, delta, "studyGain");
    if (delta >= 0.001) {
      args.trace.push({
        day: args.day,
        type: "study",
        subskill,
        delta: round4(delta),
        scoreAfter: state.score,
        note: "completed lesson practice",
      });
    }
  }
}

function applyReviewDay(
  states: Record<ProgressionSubskill, MutableSubskillState>,
  day: number,
  assumptions: Required<StudyPlanAssumptions>,
  l1Severity: number,
  trace: ProgressionTraceEvent[],
) {
  const base = 0.0012 * assumptions.spacedReviewRate;
  for (const subskill of SUBSKILLS) {
    const state = states[subskill];
    const reviewEfficiency = REVIEW_WEIGHTS[subskill] * (1 - l1Severity * L1_SENSITIVE[subskill] * 0.26);
    const delta = base * reviewEfficiency;
    bumpState(state, delta, "reviewGain");
    trace.push({
      day,
      type: "review",
      subskill,
      delta: round4(delta),
      scoreAfter: state.score,
      note: "spaced review retention",
    });
  }
}

function applyDropoutDay(
  states: Record<ProgressionSubskill, MutableSubskillState>,
  day: number,
  dropoutPressure: number,
  trace: ProgressionTraceEvent[],
) {
  const penalty = (dropoutPressure - 0.68) * 0.006;
  for (const subskill of SUBSKILLS) {
    const state = states[subskill];
    const delta = -penalty * (subskill === "speaking" || subskill === "pronunciation" ? 1.22 : 0.82);
    bumpState(state, delta, "regression");
  }
  trace.push({
    day,
    type: "dropout",
    delta: round4(-penalty),
    note: "dropout pressure reduced active recall",
  });
}

function applyPlateauAndRegression(
  states: Record<ProgressionSubskill, MutableSubskillState>,
  day: number,
  isStudyDay: boolean,
  dropoutActive: boolean,
  trace: ProgressionTraceEvent[],
) {
  if (isStudyDay || dropoutActive || day % 14 !== 0) return;
  for (const subskill of SUBSKILLS) {
    const state = states[subskill];
    const delta = subskill === "speaking" || subskill === "pronunciation" ? -0.0042 : -0.0024;
    bumpState(state, delta, "regression");
  }
  trace.push({
    day,
    type: "regression",
    delta: -0.003,
    note: "inactive interval caused mild skill decay",
  });
}

function traceMilestones(snapshot: ProgressionSnapshot, trace: ProgressionTraceEvent[]) {
  for (const subskill of SUBSKILLS) {
    const state = snapshot.subskills[subskill];
    if (Math.floor(state.startScore) < Math.floor(state.score)) {
      trace.push({
        day: snapshot.day,
        type: "milestone",
        subskill,
        delta: round4(state.score - state.startScore),
        scoreAfter: state.score,
        note: `${subskill} reached ${state.cefr}`,
      });
    } else if (Math.abs(state.score - state.startScore) < 0.04 && snapshot.day >= 90) {
      trace.push({
        day: snapshot.day,
        type: "plateau",
        subskill,
        delta: round4(state.score - state.startScore),
        scoreAfter: state.score,
        note: `${subskill} plateaued near ${state.cefr}`,
      });
    }
  }
}

function bumpState(
  state: MutableSubskillState,
  delta: number,
  bucket: "studyGain" | "reviewGain" | "regression",
) {
  state.score = round3(clamp(state.score + delta, CEFR_MIN, CEFR_MAX));
  state.cefr = scoreToCefr(state.score);
  if (bucket === "regression") {
    state.regression = round3(state.regression + Math.abs(delta));
  } else {
    state[bucket] = round3(state[bucket] + Math.max(0, delta));
  }
}

function makeSnapshot(
  day: number,
  states: Record<ProgressionSubskill, MutableSubskillState>,
  completionRate: number,
  dropoutPressure: number,
  activeStudyDays: number,
  completedLessons: number,
): ProgressionSnapshot {
  const subskills = Object.fromEntries(
    SUBSKILLS.map((subskill) => [subskill, { ...states[subskill] }]),
  ) as Record<ProgressionSubskill, ProgressionSubskillState>;
  const overallScore = weightedOverall(subskills);
  return {
    day,
    overallScore: round3(overallScore),
    overallCefr: scoreToCefr(overallScore),
    completionRate: round3(completionRate),
    dropoutPressure: round3(dropoutPressure),
    activeStudyDays,
    completedLessons: round3(completedLessons),
    subskills,
  };
}

function weightedOverall(states: Record<ProgressionSubskill, ProgressionSubskillState>): number {
  return (
    states.reading.score * 0.15 +
    states.listening.score * 0.13 +
    states.speaking.score * 0.16 +
    states.writing.score * 0.14 +
    states.conversation.score * 0.12 +
    states.grammar.score * 0.1 +
    states.vocabulary.score * 0.1 +
    states.pronunciation.score * 0.1
  );
}

function studyDay(day: number, weeklyStudyDays: number): boolean {
  if (weeklyStudyDays <= 0) return false;
  if (weeklyStudyDays >= 7) return true;
  const dayOfWeek = (day - 1) % 7;
  return dayOfWeek < weeklyStudyDays;
}

function varianceAt(values: number[], day: number, seedOffset: number, fallback: number): number {
  if (!values.length) return fallback;
  const index = Math.abs((day - 1 + seedOffset) % values.length);
  return values[index] ?? fallback;
}

function l1SeverityScore(flags: PlacementV3L1InterferenceFlag[]): number {
  if (!flags.length) return 0;
  const values = flags.map((flag) => {
    switch (flag.severity) {
      case "high":
        return 1;
      case "medium":
        return 0.62;
      case "low":
        return 0.3;
      default:
        return 0.45;
    }
  });
  return clamp01(values.reduce((sum, value) => sum + value, 0) / Math.max(3, values.length));
}

function cefrToScore(level: CEFRLevel): number {
  const index = CEFR_LEVELS.indexOf(level);
  return index >= 0 ? index : 0;
}

function scoreToCefr(score: number): ProgressionCefrLevel {
  const index = Math.round(clamp(Math.floor(score + 0.5), CEFR_MIN, CEFR_MAX));
  return CEFR_LEVELS[index];
}

function stableSeed(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) % 997;
  }
  return hash;
}

function stableHash(value: unknown): string {
  let hash = 2166136261;
  const input = stableStringify(value);
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`)
    .join(",")}}`;
}

function clamp01(value: number): number {
  return clamp(value, 0, 1);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round3(value: number): number {
  return Math.round(value * 1000) / 1000;
}

function round4(value: number): number {
  return Math.round(value * 10000) / 10000;
}
