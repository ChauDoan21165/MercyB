/**
 * Mercy Lesson Memory
 *
 * Tracks short-term learning signals so Mercy behaves like a real teacher.
 *
 * Responsibilities:
 * - track recent mistakes
 * - detect repeated mistakes
 * - track correct answer streaks
 * - store recent concepts practiced
 * - provide review signals
 *
 * Storage:
 * - sessionStorage (per tab/session)
 * - safe fallback if storage unavailable
 *
 * Notes:
 * - keeps backward-compatible fields from the older version
 * - enriches memory with recentMistakes + conceptMistakeCount
 * - supports test-friendly reset behavior
 */

export interface LessonMemoryState {
  correctStreak: number;
  lastMistake?: string;
  mistakeCount: Record<string, number>;
  conceptMistakeCount: Record<string, number>;
  recentMistakes: string[];
  recentConcepts: string[];
  lastInteractionAt: number;
}

export interface LessonUpdateInput {
  correct?: boolean;
  mistake?: string;
  concept?: string;
}

const MAX_RECENT_MISTAKES = 10;
const MAX_RECENT_CONCEPTS = 5;
const REPEATED_MISTAKE_THRESHOLD = 2;
const REVIEW_CONCEPT_THRESHOLD = 2;

function getKey(userId?: string): string {
  return `mercy_lesson_memory_${userId || 'default'}`;
}

function canUseSessionStorage(): boolean {
  try {
    return typeof sessionStorage !== 'undefined';
  } catch {
    return false;
  }
}

function normalizeMemory(raw: Partial<LessonMemoryState> | null | undefined): LessonMemoryState {
  return {
    correctStreak: raw?.correctStreak ?? 0,
    lastMistake: raw?.lastMistake,
    mistakeCount: raw?.mistakeCount ?? {},
    conceptMistakeCount: raw?.conceptMistakeCount ?? {},
    recentMistakes: Array.isArray(raw?.recentMistakes) ? raw!.recentMistakes : [],
    recentConcepts: Array.isArray(raw?.recentConcepts) ? raw!.recentConcepts : [],
    lastInteractionAt: raw?.lastInteractionAt ?? Date.now(),
  };
}

function pushUniqueFront(list: string[], value: string, max: number): string[] {
  const cleanValue = String(value ?? '').trim();
  if (!cleanValue) return list;

  return [cleanValue, ...list.filter((item) => item !== cleanValue)].slice(0, max);
}

/**
 * Create fresh memory state
 */
export function createEmptyMemory(): LessonMemoryState {
  return {
    correctStreak: 0,
    mistakeCount: {},
    conceptMistakeCount: {},
    recentMistakes: [],
    recentConcepts: [],
    lastInteractionAt: Date.now(),
  };
}

/**
 * Load lesson memory from storage
 */
export function loadLessonMemory(userId?: string): LessonMemoryState {
  if (!canUseSessionStorage()) {
    return createEmptyMemory();
  }

  try {
    const raw = sessionStorage.getItem(getKey(userId));
    if (!raw) {
      return createEmptyMemory();
    }

    const parsed = JSON.parse(raw) as Partial<LessonMemoryState>;
    return normalizeMemory(parsed);
  } catch {
    return createEmptyMemory();
  }
}

/**
 * Save lesson memory
 */
export function saveLessonMemory(
  memory: LessonMemoryState,
  userId?: string
): void {
  if (!canUseSessionStorage()) return;

  try {
    sessionStorage.setItem(getKey(userId), JSON.stringify(memory));
  } catch {
    // ignore storage errors
  }
}

/**
 * Clear lesson memory
 */
export function clearLessonMemory(userId?: string): LessonMemoryState {
  const empty = createEmptyMemory();

  if (!canUseSessionStorage()) {
    return empty;
  }

  try {
    sessionStorage.setItem(getKey(userId), JSON.stringify(empty));
  } catch {
    // ignore storage errors
  }

  return empty;
}

/**
 * Update lesson memory after a learner interaction
 */
export function updateLessonMemory(
  input: LessonUpdateInput,
  userId?: string
): LessonMemoryState {
  const isResetSignal =
    input.correct === true &&
    input.mistake === undefined &&
    input.concept === undefined;

  if (isResetSignal) {
    return clearLessonMemory(userId);
  }

  const memory = loadLessonMemory(userId);

  if (input.correct) {
    memory.correctStreak += 1;
  } else {
    memory.correctStreak = 0;
  }

  if (input.mistake) {
    memory.lastMistake = input.mistake;
    memory.recentMistakes = pushUniqueFront(
      memory.recentMistakes,
      input.mistake,
      MAX_RECENT_MISTAKES
    );

    memory.mistakeCount[input.mistake] =
      (memory.mistakeCount[input.mistake] || 0) + 1;
  }

  if (input.concept) {
    memory.recentConcepts = pushUniqueFront(
      memory.recentConcepts,
      input.concept,
      MAX_RECENT_CONCEPTS
    );

    if (!input.correct) {
      memory.conceptMistakeCount[input.concept] =
        (memory.conceptMistakeCount[input.concept] || 0) + 1;
    }
  }

  memory.lastInteractionAt = Date.now();

  saveLessonMemory(memory, userId);

  return memory;
}

/**
 * Detect repeated mistake
 */
export function isRepeatedMistake(
  mistake: string,
  userId?: string
): boolean {
  const memory = loadLessonMemory(userId);
  return (memory.mistakeCount[mistake] || 0) >= REPEATED_MISTAKE_THRESHOLD;
}

/**
 * Get current correct streak
 */
export function getCorrectStreak(userId?: string): number {
  const memory = loadLessonMemory(userId);
  return memory.correctStreak;
}

/**
 * Should Mercy increase difficulty?
 *
 * Teacher rule:
 * 2+ correct answers → challenge learner
 */
export function shouldIncreaseDifficulty(userId?: string): boolean {
  return getCorrectStreak(userId) >= 2;
}

/**
 * Should Mercy suggest review?
 *
 * Teacher rule:
 * 2+ mistakes on same concept → review
 */
export function shouldReviewConcept(
  concept: string,
  userId?: string
): boolean {
  const memory = loadLessonMemory(userId);

  return (
    (memory.conceptMistakeCount[concept] || 0) >= REVIEW_CONCEPT_THRESHOLD
  );
}

/**
 * Get last mistake (for correction hints)
 */
export function getLastMistake(userId?: string): string | undefined {
  const memory = loadLessonMemory(userId);
  return memory.lastMistake;
}

/**
 * Get recent mistakes
 */
export function getRecentMistakes(userId?: string): string[] {
  const memory = loadLessonMemory(userId);
  return memory.recentMistakes;
}

/**
 * Get recent concepts for recap prompts
 */
export function getRecentConcepts(userId?: string): string[] {
  const memory = loadLessonMemory(userId);
  return memory.recentConcepts;
}