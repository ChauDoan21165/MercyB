/**
 * Mercy Curriculum Tracker
 *
 * Purpose:
 * - track what the learner has studied
 * - estimate strength by topic
 * - identify weak topics that need review
 * - suggest the next best teaching move
 *
 * Design rules:
 * - lightweight and local-first
 * - topic mastery should move gradually
 * - recent struggle matters more than old success
 * - review should feel natural, not punitive
 */

export type CurriculumTopicStatus =
  | 'new'
  | 'learning'
  | 'practicing'
  | 'stable'
  | 'needs_review'
  | 'mastered';

export interface TopicProgress {
  topic: string;
  attempts: number;
  correct: number;
  mistakes: number;
  streak: number;
  lastSeenAt: number;
  lastCorrectAt?: number;
  lastMistakeAt?: number;
  status: CurriculumTopicStatus;
  score: number; // 0-100
}

export interface CurriculumState {
  topics: Record<string, TopicProgress>;
  recentTopics: string[];
  updatedAt: number;
}

export interface CurriculumUpdateInput {
  topic: string;
  correct?: boolean;
  timestamp?: number;
}

export interface CurriculumRecommendation {
  topic: string | null;
  reason:
    | 'weakest_topic'
    | 'new_topic'
    | 'stale_topic'
    | 'continue_recent'
    | 'no_topics';
  suggestedMode: 'review' | 'practice' | 'advance' | 'introduce';
}

const STORAGE_KEY = 'mercy_curriculum_tracker';
const MAX_RECENT_TOPICS = 8;
const STALE_DAYS = 7;
const REVIEW_SCORE_THRESHOLD = 45;
const STABLE_SCORE_THRESHOLD = 70;
const MASTERED_SCORE_THRESHOLD = 90;

function nowTs(): number {
  return Date.now();
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function cleanTopic(topic: string): string {
  return String(topic ?? '').trim().toLowerCase();
}

function uniqueRecent(topics: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const topic of topics) {
    if (!topic || seen.has(topic)) continue;
    seen.add(topic);
    result.push(topic);
    if (result.length >= MAX_RECENT_TOPICS) break;
  }

  return result;
}

function createEmptyState(): CurriculumState {
  return {
    topics: {},
    recentTopics: [],
    updatedAt: nowTs(),
  };
}

function createTopicProgress(topic: string, timestamp: number): TopicProgress {
  return {
    topic,
    attempts: 0,
    correct: 0,
    mistakes: 0,
    streak: 0,
    lastSeenAt: timestamp,
    status: 'new',
    score: 0,
  };
}

function computeScore(progress: TopicProgress): number {
  const attempts = progress.attempts;
  if (attempts === 0) return 0;

  const accuracy = progress.correct / attempts;
  const accuracyPoints = accuracy * 70;
  const streakPoints = clamp(progress.streak, 0, 5) * 4;
  const experiencePoints = Math.min(attempts, 10) * 1.5;
  const penalty = Math.max(progress.mistakes - progress.correct, 0) * 2;

  return clamp(Math.round(accuracyPoints + streakPoints + experiencePoints - penalty), 0, 100);
}

function computeStatus(progress: TopicProgress): CurriculumTopicStatus {
  const score = progress.score;

  if (progress.attempts === 0) return 'new';
  if (score < REVIEW_SCORE_THRESHOLD) return 'needs_review';
  if (score < STABLE_SCORE_THRESHOLD) return 'learning';
  if (score < MASTERED_SCORE_THRESHOLD) return 'practicing';
  if (progress.attempts >= 6 && progress.streak >= 3) return 'mastered';
  return 'stable';
}

function getStorage(): Storage | null {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return null;
    }
    return localStorage;
  } catch {
    return null;
  }
}

/**
 * Load curriculum tracker state.
 */
export function loadCurriculumState(): CurriculumState {
  const storage = getStorage();
  if (!storage) return createEmptyState();

  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return createEmptyState();

    const parsed = JSON.parse(raw) as CurriculumState;

    return {
      topics: parsed.topics || {},
      recentTopics: Array.isArray(parsed.recentTopics) ? parsed.recentTopics : [],
      updatedAt: parsed.updatedAt || nowTs(),
    };
  } catch {
    return createEmptyState();
  }
}

/**
 * Save curriculum tracker state.
 */
export function saveCurriculumState(state: CurriculumState): void {
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage errors
  }
}

/**
 * Reset all curriculum state.
 */
export function resetCurriculumState(): CurriculumState {
  const state = createEmptyState();
  saveCurriculumState(state);
  return state;
}

/**
 * Update one topic after a learner interaction.
 */
export function updateCurriculumTopic(input: CurriculumUpdateInput): CurriculumState {
  const topic = cleanTopic(input.topic);
  if (!topic) {
    return loadCurriculumState();
  }

  const timestamp = input.timestamp ?? nowTs();
  const state = loadCurriculumState();
  const current = state.topics[topic] || createTopicProgress(topic, timestamp);

  current.attempts += 1;
  current.lastSeenAt = timestamp;

  if (input.correct) {
    current.correct += 1;
    current.streak += 1;
    current.lastCorrectAt = timestamp;
  } else {
    current.mistakes += 1;
    current.streak = 0;
    current.lastMistakeAt = timestamp;
  }

  current.score = computeScore(current);
  current.status = computeStatus(current);

  state.topics[topic] = current;
  state.recentTopics = uniqueRecent([topic, ...state.recentTopics]);
  state.updatedAt = timestamp;

  saveCurriculumState(state);
  return state;
}

/**
 * Get progress for a single topic.
 */
export function getTopicProgress(topic: string): TopicProgress | null {
  const cleaned = cleanTopic(topic);
  if (!cleaned) return null;

  const state = loadCurriculumState();
  return state.topics[cleaned] || null;
}

/**
 * Get all topic progress, sorted by most recently seen first.
 */
export function getAllTopicProgress(): TopicProgress[] {
  const state = loadCurriculumState();

  return Object.values(state.topics).sort((a, b) => b.lastSeenAt - a.lastSeenAt);
}

/**
 * Get weak topics that likely need review.
 */
export function getWeakTopics(limit = 5): TopicProgress[] {
  return getAllTopicProgress()
    .filter((topic) => topic.status === 'needs_review' || topic.score < REVIEW_SCORE_THRESHOLD)
    .sort((a, b) => a.score - b.score || b.lastSeenAt - a.lastSeenAt)
    .slice(0, limit);
}

/**
 * Get strong topics.
 */
export function getStrongTopics(limit = 5): TopicProgress[] {
  return getAllTopicProgress()
    .filter((topic) => topic.status === 'stable' || topic.status === 'mastered')
    .sort((a, b) => b.score - a.score || b.lastSeenAt - a.lastSeenAt)
    .slice(0, limit);
}

/**
 * Get recently practiced topics.
 */
export function getRecentTopics(limit = 5): TopicProgress[] {
  const state = loadCurriculumState();

  return state.recentTopics
    .map((topic) => state.topics[topic])
    .filter(Boolean)
    .slice(0, limit);
}

function isStale(progress: TopicProgress, timestamp = nowTs()): boolean {
  const staleMs = STALE_DAYS * 24 * 60 * 60 * 1000;
  return timestamp - progress.lastSeenAt >= staleMs;
}

/**
 * Recommend what Mercy should teach next.
 */
export function getCurriculumRecommendation(): CurriculumRecommendation {
  const topics = getAllTopicProgress();

  if (topics.length === 0) {
    return {
      topic: null,
      reason: 'no_topics',
      suggestedMode: 'introduce',
    };
  }

  const weak = getWeakTopics(1)[0];
  if (weak) {
    return {
      topic: weak.topic,
      reason: 'weakest_topic',
      suggestedMode: 'review',
    };
  }

  const stale = topics
    .filter((topic) => isStale(topic))
    .sort((a, b) => a.lastSeenAt - b.lastSeenAt)[0];

  if (stale) {
    return {
      topic: stale.topic,
      reason: 'stale_topic',
      suggestedMode: 'review',
    };
  }

  const recent = getRecentTopics(1)[0];
  if (recent) {
    if (recent.status === 'new' || recent.status === 'learning') {
      return {
        topic: recent.topic,
        reason: 'continue_recent',
        suggestedMode: 'practice',
      };
    }

    return {
      topic: recent.topic,
      reason: 'continue_recent',
      suggestedMode: 'advance',
    };
  }

  const newest = topics.sort((a, b) => a.attempts - b.attempts || b.lastSeenAt - a.lastSeenAt)[0];
  if (newest) {
    return {
      topic: newest.topic,
      reason: 'new_topic',
      suggestedMode: 'practice',
    };
  }

  return {
    topic: null,
    reason: 'no_topics',
    suggestedMode: 'introduce',
  };
}

/**
 * Mark a topic as reviewed without counting a new attempt.
 * Useful after a recap or passive review.
 */
export function touchCurriculumTopic(topic: string, timestamp = nowTs()): CurriculumState {
  const cleaned = cleanTopic(topic);
  if (!cleaned) return loadCurriculumState();

  const state = loadCurriculumState();
  const current = state.topics[cleaned] || createTopicProgress(cleaned, timestamp);

  current.lastSeenAt = timestamp;
  current.status = computeStatus(current);

  state.topics[cleaned] = current;
  state.recentTopics = uniqueRecent([cleaned, ...state.recentTopics]);
  state.updatedAt = timestamp;

  saveCurriculumState(state);
  return state;
}

/**
 * Explain a recommendation in plain language.
 */
export function explainCurriculumRecommendation(
  recommendation: CurriculumRecommendation
): string {
  switch (recommendation.reason) {
    case 'weakest_topic':
      return `Review "${recommendation.topic}" because it shows the most friction.`;
    case 'stale_topic':
      return `Revisit "${recommendation.topic}" because it has not appeared recently.`;
    case 'continue_recent':
      return `Continue with "${recommendation.topic}" while the learner still has momentum.`;
    case 'new_topic':
      return `Practice "${recommendation.topic}" to strengthen a newer area.`;
    case 'no_topics':
    default:
      return 'No tracked topics yet. Introduce a clear starting point.';
  }
}