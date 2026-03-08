/**
 * VERSION: teacherMemoryEngine.ts v6
 *
 * Lightweight teacher-memory store for tests and local runtime.
 *
 * Purpose:
 * - persist a compact recent history of Mercy teaching turns
 * - keep only a bounded window of turns
 * - expose simple load/update/clear helpers
 * - derive a small continuity insight from prior nearby turns
 *
 * Design notes:
 * - keeps the public shape explicit and stable for tests
 * - stores compact turn metadata only
 * - returns a fully populated insight object on every call
 * - uses case-insensitive concept / mistake matching
 * - accepts compatibility fields for current-turn insight lookup
 * - prefers concrete recent continuity signals over generic continuity
 */

export interface TeacherMemoryTurn {
  teachingMode: string;
  tone?: string;
  concept?: string | null;
  mistake?: string | null;
  fix?: string | null;
  learnerText?: string | null;
  usedHumor?: boolean;
  wasCorrectiveTurn?: boolean;
  wasSuccessfulTurn?: boolean;
  timestamp: string;
}

export interface TeacherMemoryState {
  userId: string;
  recentTurns: TeacherMemoryTurn[];
  lastUpdatedAt: number;
}

export interface UpdateTeacherMemoryInput {
  userId: string;
  teachingMode: string;
  tone?: string;
  concept?: string | null;
  mistake?: string | null;
  fix?: string | null;
  learnerText?: string | null;
  usedHumor?: boolean;
  timestamp?: string;

  // Compatibility fields used by older tests/callers.
  wasCorrectiveTurn?: boolean;
  successfulTurn?: boolean;
  wasSuccessfulTurn?: boolean;
  repeatedMistake?: boolean;
}

export interface TeacherMemoryInsightInput {
  userId?: string;
  teachingMode?: string;
  concept?: string | null;
  mistake?: string | null;

  currentTeachingMode?: string;
  currentConcept?: string | null;
  currentMistake?: string | null;

  wasCorrectiveTurn?: boolean;
  wasSuccessfulTurn?: boolean;

  // Compatibility fields used by older tests/callers.
  successfulTurn?: boolean;
}

export interface TeacherMemoryInsight {
  shouldReferencePriorMistake: boolean;
  shouldReferencePriorProgress: boolean;
  shouldAcknowledgeRepair: boolean;
  priorConcept?: string;
  priorMistake?: string;
  progressLine: string;
  rationale: string[];
}

const MAX_RECENT_TURNS = 10;
const memoryStore = new Map<string, TeacherMemoryState>();

function normalizeText(value?: string | null): string {
  return (value ?? '').trim().toLowerCase();
}

function hasMeaningfulText(value?: string | null): boolean {
  return normalizeText(value).length > 0;
}

function toTimestampMs(value?: string): number {
  if (!value) {
    return Date.now();
  }

  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : Date.now();
}

function isSuccessMode(teachingMode: string): boolean {
  const mode = normalizeText(teachingMode);

  return (
    mode === 'encourage' ||
    mode === 'challenge' ||
    mode === 'recap' ||
    mode === 'drill' ||
    mode === 'success'
  );
}

function isCorrectiveMode(teachingMode: string): boolean {
  const mode = normalizeText(teachingMode);

  return mode === 'correct' || mode === 'review';
}

function isSuccessfulTurn(turn: TeacherMemoryTurn): boolean {
  return turn.wasSuccessfulTurn === true || isSuccessMode(turn.teachingMode);
}

function isCorrectiveTurn(turn: TeacherMemoryTurn): boolean {
  return turn.wasCorrectiveTurn === true || isCorrectiveMode(turn.teachingMode);
}

function createEmptyInsight(): TeacherMemoryInsight {
  return {
    shouldReferencePriorMistake: false,
    shouldReferencePriorProgress: false,
    shouldAcknowledgeRepair: false,
    priorConcept: undefined,
    priorMistake: undefined,
    progressLine: '',
    rationale: [],
  };
}

function cloneTurn(turn: TeacherMemoryTurn): TeacherMemoryTurn {
  return { ...turn };
}

export function createEmptyTeacherMemoryState(
  userId: string
): TeacherMemoryState {
  return {
    userId,
    recentTurns: [],
    lastUpdatedAt: Date.now(),
  };
}

function cloneTeacherMemoryState(state: TeacherMemoryState): TeacherMemoryState {
  return {
    userId: state.userId,
    recentTurns: state.recentTurns.map(cloneTurn),
    lastUpdatedAt: state.lastUpdatedAt,
  };
}

function normalizeTurn(input: UpdateTeacherMemoryInput): TeacherMemoryTurn {
  const teachingMode = input.teachingMode;
  const timestamp = input.timestamp ?? new Date().toISOString();

  return {
    teachingMode,
    tone: input.tone,
    concept: input.concept ?? null,
    mistake: input.mistake ?? null,
    fix: input.fix ?? null,
    learnerText: input.learnerText ?? null,
    usedHumor: Boolean(input.usedHumor),
    wasCorrectiveTurn:
      input.wasCorrectiveTurn ?? isCorrectiveMode(teachingMode),
    wasSuccessfulTurn:
      input.wasSuccessfulTurn ??
      input.successfulTurn ??
      isSuccessMode(teachingMode),
    timestamp,
  };
}

export function loadTeacherMemory(userId: string): TeacherMemoryState {
  const existing = memoryStore.get(userId);

  if (!existing) {
    return createEmptyTeacherMemoryState(userId);
  }

  return cloneTeacherMemoryState(existing);
}

export function updateTeacherMemory(
  input: UpdateTeacherMemoryInput
): TeacherMemoryState {
  const current = loadTeacherMemory(input.userId);
  const turn = normalizeTurn(input);

  const next: TeacherMemoryState = {
    userId: current.userId,
    recentTurns: [turn, ...current.recentTurns].slice(0, MAX_RECENT_TURNS),
    lastUpdatedAt: toTimestampMs(turn.timestamp),
  };

  memoryStore.set(input.userId, next);
  return cloneTeacherMemoryState(next);
}

export function clearTeacherMemory(userId?: string): void {
  if (userId) {
    memoryStore.delete(userId);
    return;
  }

  memoryStore.clear();
}

export const resetTeacherMemory = clearTeacherMemory;

function pickDisplayValue(value?: string | null): string | undefined {
  return hasMeaningfulText(value) ? (value ?? undefined) : undefined;
}

function sameConcept(turn: TeacherMemoryTurn, conceptNorm: string): boolean {
  if (!conceptNorm) {
    return false;
  }

  return normalizeText(turn.concept) === conceptNorm;
}

function sameMistake(turn: TeacherMemoryTurn, mistakeNorm: string): boolean {
  if (!mistakeNorm) {
    return false;
  }

  return normalizeText(turn.mistake) === mistakeNorm;
}

function sameConceptOrBlank(turn: TeacherMemoryTurn, conceptNorm: string): boolean {
  if (!conceptNorm) {
    return true;
  }

  const priorConcept = normalizeText(turn.concept);
  return priorConcept === '' || priorConcept === conceptNorm;
}

function resolveInsightArgs(
  arg1: string | TeacherMemoryInsightInput,
  arg2?: Omit<TeacherMemoryInsightInput, 'userId'>
): TeacherMemoryInsightInput {
  if (typeof arg1 === 'string') {
    return {
      ...(arg2 ?? {}),
      userId: arg1,
    };
  }

  return arg1;
}

function resolveCurrentTeachingMode(input: TeacherMemoryInsightInput): string {
  return input.currentTeachingMode ?? input.teachingMode ?? '';
}

function resolveCurrentConcept(
  input: TeacherMemoryInsightInput
): string | null | undefined {
  return input.currentConcept ?? input.concept ?? null;
}

function resolveCurrentMistake(
  input: TeacherMemoryInsightInput
): string | null | undefined {
  return input.currentMistake ?? input.mistake ?? null;
}

function resolveCurrentSuccess(
  input: TeacherMemoryInsightInput,
  teachingMode: string
): boolean {
  return (
    input.wasSuccessfulTurn ??
    input.successfulTurn ??
    isSuccessMode(teachingMode)
  );
}

function getMostRecentTurnOnConcept(
  recentTurns: TeacherMemoryTurn[],
  conceptNorm: string
): TeacherMemoryTurn | undefined {
  if (!conceptNorm) {
    return undefined;
  }

  return recentTurns.find((turn) => sameConcept(turn, conceptNorm));
}

function getMostRecentSameMistake(
  recentTurns: TeacherMemoryTurn[],
  conceptNorm: string,
  mistakeNorm: string
): TeacherMemoryTurn | undefined {
  if (!mistakeNorm) {
    return undefined;
  }

  return recentTurns.find(
    (turn) => sameMistake(turn, mistakeNorm) && sameConceptOrBlank(turn, conceptNorm)
  );
}

function getMostRecentCorrectiveOnConcept(
  recentTurns: TeacherMemoryTurn[],
  conceptNorm: string
): TeacherMemoryTurn | undefined {
  if (!conceptNorm) {
    return undefined;
  }

  return recentTurns.find(
    (turn) => sameConcept(turn, conceptNorm) && isCorrectiveTurn(turn)
  );
}

function getMostRecentSuccessfulOnConcept(
  recentTurns: TeacherMemoryTurn[],
  conceptNorm: string
): TeacherMemoryTurn | undefined {
  if (!conceptNorm) {
    return undefined;
  }

  return recentTurns.find(
    (turn) => sameConcept(turn, conceptNorm) && isSuccessfulTurn(turn)
  );
}

function buildInsight(
  overrides: Partial<TeacherMemoryInsight>
): TeacherMemoryInsight {
  return {
    ...createEmptyInsight(),
    ...overrides,
    rationale: overrides.rationale ?? [],
  };
}

/**
 * Supported call shapes:
 * - getTeacherMemoryInsight({ userId, concept, ... })
 * - getTeacherMemoryInsight(userId, { concept, ... })
 */
export function getTeacherMemoryInsight(
  input: TeacherMemoryInsightInput
): TeacherMemoryInsight;
export function getTeacherMemoryInsight(
  userId: string,
  input?: Omit<TeacherMemoryInsightInput, 'userId'>
): TeacherMemoryInsight;
export function getTeacherMemoryInsight(
  inputOrUserId: string | TeacherMemoryInsightInput,
  maybeInput?: Omit<TeacherMemoryInsightInput, 'userId'>
): TeacherMemoryInsight {
  const input = resolveInsightArgs(inputOrUserId, maybeInput);

  if (!input.userId) {
    return createEmptyInsight();
  }

  const memory = loadTeacherMemory(input.userId);

  if (memory.recentTurns.length === 0) {
    return createEmptyInsight();
  }

  const currentTeachingMode = resolveCurrentTeachingMode(input);
  const currentConcept = resolveCurrentConcept(input);
  const currentMistake = resolveCurrentMistake(input);

  const conceptNorm = normalizeText(currentConcept);
  const mistakeNorm = normalizeText(currentMistake);
  const currentIsSuccess = resolveCurrentSuccess(input, currentTeachingMode);

  const priorSameMistake = getMostRecentSameMistake(
    memory.recentTurns,
    conceptNorm,
    mistakeNorm
  );
  const priorConceptTurn = getMostRecentTurnOnConcept(
    memory.recentTurns,
    conceptNorm
  );
  const priorCorrectiveTurn = getMostRecentCorrectiveOnConcept(
    memory.recentTurns,
    conceptNorm
  );
  const priorSuccessfulTurn = getMostRecentSuccessfulOnConcept(
    memory.recentTurns,
    conceptNorm
  );

  if (currentIsSuccess && priorSameMistake && isCorrectiveTurn(priorSameMistake)) {
    return buildInsight({
      shouldAcknowledgeRepair: true,
      shouldReferencePriorProgress: true,
      priorConcept: pickDisplayValue(priorSameMistake.concept),
      priorMistake: pickDisplayValue(priorSameMistake.mistake),
      progressLine:
        'You had trouble with this earlier, and this looks stronger now.',
      rationale: ['repair_after_prior_mistake'],
    });
  }

  if (priorSameMistake) {
    return buildInsight({
      shouldReferencePriorMistake: true,
      priorConcept: pickDisplayValue(priorSameMistake.concept),
      priorMistake: pickDisplayValue(priorSameMistake.mistake),
      progressLine:
        'This same mistake showed up earlier, so keep the correction focused and steady.',
      rationale: ['same_mistake_seen_before'],
    });
  }

  if (currentIsSuccess && priorCorrectiveTurn) {
    return buildInsight({
      shouldReferencePriorProgress: true,
      priorConcept: pickDisplayValue(priorCorrectiveTurn.concept),
      priorMistake: pickDisplayValue(priorCorrectiveTurn.mistake),
      progressLine:
        'This attempt is cleaner than earlier, so keep the support calm and specific.',
      rationale: ['progress_after_correction'],
    });
  }

  if (currentIsSuccess && priorConceptTurn) {
    return buildInsight({
      shouldReferencePriorProgress: true,
      priorConcept: pickDisplayValue(priorConceptTurn.concept),
      priorMistake: pickDisplayValue(priorConceptTurn.mistake),
      progressLine:
        'You’re building on the same idea again, and the progress is showing.',
      rationale: ['progress_on_same_concept'],
    });
  }

  if (!currentIsSuccess && priorSuccessfulTurn) {
    return buildInsight({
      shouldReferencePriorProgress: true,
      priorConcept: pickDisplayValue(priorSuccessfulTurn.concept),
      priorMistake: pickDisplayValue(priorSuccessfulTurn.mistake),
      progressLine:
        'This concept was stabilizing recently, so correct without sounding punitive.',
      rationale: ['ongoing_concept_progress'],
    });
  }

  return createEmptyInsight();
}

export const deriveTeacherMemoryInsight = getTeacherMemoryInsight;

export default {
  createEmptyTeacherMemoryState,
  loadTeacherMemory,
  updateTeacherMemory,
  clearTeacherMemory,
  resetTeacherMemory,
  getTeacherMemoryInsight,
  deriveTeacherMemoryInsight,
};