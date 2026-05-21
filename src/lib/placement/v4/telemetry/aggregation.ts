// Placement v4 telemetry — deterministic aggregation pipeline.
//
// Determinism contract:
//   - Output is bit-identical for any permutation of the same input event set.
//   - No Date.now(), no Math.random(), no Intl-locale-dependent sorting.
//   - All iteration over keyed collections happens via pre-sorted arrays;
//     Map insertion order is never relied upon.
//   - Floating-point math is summation-only; no division-then-multiply chains
//     that would expose ordering-dependent rounding.

import { UTC_MS_PER_DAY, utcDayOrdinal } from "./time";
import type {
  AggregationSummary,
  CefrCheckpointEvent,
  HesitationLoopEvent,
  LessonAggregate,
  LessonCompleteEvent,
  LessonDropoffEvent,
  LessonRetryEvent,
  LessonStartEvent,
  SpeakingRetryEvent,
  StudyStreakEvent,
  TelemetryEvent,
  UserAggregate,
} from "./types";

/**
 * Canonicalize: sort events by (timestampMs, eventId) ascending.
 *
 * Why both keys: timestampMs alone is not unique (events emitted in the same
 * millisecond would otherwise have indeterminate order). eventId is a stable
 * tiebreaker so the same event set always produces the same sequence.
 */
export function canonicalizeEvents(
  events: readonly TelemetryEvent[],
): readonly TelemetryEvent[] {
  return [...events].sort(compareEvents);
}

function compareEvents(a: TelemetryEvent, b: TelemetryEvent): number {
  if (a.timestampMs !== b.timestampMs) return a.timestampMs - b.timestampMs;
  if (a.eventId < b.eventId) return -1;
  if (a.eventId > b.eventId) return 1;
  return 0;
}

interface LessonAccumulator {
  lessonId: string;
  starts: number;
  completions: number;
  retries: number;
  dropoffs: number;
  speakingRetries: number;
  hesitationLoops: number;
  totalScoreRatio: number;
  totalScoreSamples: number;
  totalDurationMs: number;
  durationSamples: number;
  userIdHashes: Set<string>;
}

interface UserAccumulator {
  userIdHash: string;
  sessionIds: Set<string>;
  lessonsStarted: number;
  lessonsCompleted: number;
  lessonsDroppedOff: number;
  totalRetries: number;
  totalSpeakingRetries: number;
  totalHesitationLoops: number;
  maxStreakDays: number;
  activeDays: Set<number>;
  firstSeenMs: number;
  lastSeenMs: number;
  cefrTransitions: Array<{
    modality: CefrCheckpointEvent["modality"];
    fromLevel: CefrCheckpointEvent["fromLevel"];
    toLevel: CefrCheckpointEvent["toLevel"];
    confidence: number;
    timestampMs: number;
  }>;
}

function emptyLesson(lessonId: string): LessonAccumulator {
  return {
    lessonId,
    starts: 0,
    completions: 0,
    retries: 0,
    dropoffs: 0,
    speakingRetries: 0,
    hesitationLoops: 0,
    totalScoreRatio: 0,
    totalScoreSamples: 0,
    totalDurationMs: 0,
    durationSamples: 0,
    userIdHashes: new Set(),
  };
}

function emptyUser(userIdHash: string, timestampMs: number): UserAccumulator {
  return {
    userIdHash,
    sessionIds: new Set(),
    lessonsStarted: 0,
    lessonsCompleted: 0,
    lessonsDroppedOff: 0,
    totalRetries: 0,
    totalSpeakingRetries: 0,
    totalHesitationLoops: 0,
    maxStreakDays: 0,
    activeDays: new Set(),
    firstSeenMs: timestampMs,
    lastSeenMs: timestampMs,
    cefrTransitions: [],
  };
}

function getLesson(
  map: Map<string, LessonAccumulator>,
  lessonId: string,
): LessonAccumulator {
  let entry = map.get(lessonId);
  if (!entry) {
    entry = emptyLesson(lessonId);
    map.set(lessonId, entry);
  }
  return entry;
}

function getUser(
  map: Map<string, UserAccumulator>,
  userIdHash: string,
  timestampMs: number,
): UserAccumulator {
  let entry = map.get(userIdHash);
  if (!entry) {
    entry = emptyUser(userIdHash, timestampMs);
    map.set(userIdHash, entry);
  } else {
    if (timestampMs < entry.firstSeenMs) entry.firstSeenMs = timestampMs;
    if (timestampMs > entry.lastSeenMs) entry.lastSeenMs = timestampMs;
  }
  return entry;
}

/**
 * Aggregate a batch of validated events into per-lesson and per-user summaries.
 *
 * Input does not need to be pre-sorted; this function canonicalizes internally.
 * The aggregation is associative across input batches when combined via
 * {@link mergeAggregations}.
 */
export function aggregateEvents(
  events: readonly TelemetryEvent[],
): AggregationSummary {
  const canonical = canonicalizeEvents(events);

  const lessonMap = new Map<string, LessonAccumulator>();
  const userMap = new Map<string, UserAccumulator>();

  let earliestMs: number | null = null;
  let latestMs: number | null = null;

  for (const event of canonical) {
    if (earliestMs === null || event.timestampMs < earliestMs) {
      earliestMs = event.timestampMs;
    }
    if (latestMs === null || event.timestampMs > latestMs) {
      latestMs = event.timestampMs;
    }

    const user = getUser(userMap, event.userIdHash, event.timestampMs);
    user.sessionIds.add(event.sessionId);
    user.activeDays.add(utcDayOrdinal(event.timestampMs));

    applyEventToLesson(event, lessonMap);
    applyEventToUser(event, user);
  }

  const lessonIds = [...lessonMap.keys()].sort();
  const lessons: LessonAggregate[] = lessonIds.map((id) => {
    const acc = lessonMap.get(id)!;
    const sortedUsers = [...acc.userIdHashes].sort();
    return {
      lessonId: acc.lessonId,
      starts: acc.starts,
      completions: acc.completions,
      retries: acc.retries,
      dropoffs: acc.dropoffs,
      speakingRetries: acc.speakingRetries,
      hesitationLoops: acc.hesitationLoops,
      totalScoreRatio: acc.totalScoreRatio,
      totalScoreSamples: acc.totalScoreSamples,
      totalDurationMs: acc.totalDurationMs,
      durationSamples: acc.durationSamples,
      uniqueUsers: sortedUsers.length,
      userIdHashes: sortedUsers,
    };
  });

  const userIds = [...userMap.keys()].sort();
  const users: UserAggregate[] = userIds.map((id) => {
    const acc = userMap.get(id)!;
    const sortedActiveDays = [...acc.activeDays].sort((a, b) => a - b);
    const sortedSessions = [...acc.sessionIds].sort();
    const transitions = [...acc.cefrTransitions].sort((a, b) => {
      if (a.timestampMs !== b.timestampMs) return a.timestampMs - b.timestampMs;
      if (a.modality < b.modality) return -1;
      if (a.modality > b.modality) return 1;
      return 0;
    });
    return {
      userIdHash: acc.userIdHash,
      sessions: sortedSessions.length,
      sessionIdHashes: sortedSessions,
      lessonsStarted: acc.lessonsStarted,
      lessonsCompleted: acc.lessonsCompleted,
      lessonsDroppedOff: acc.lessonsDroppedOff,
      totalRetries: acc.totalRetries,
      totalSpeakingRetries: acc.totalSpeakingRetries,
      totalHesitationLoops: acc.totalHesitationLoops,
      maxStreakDays: acc.maxStreakDays,
      activeDays: sortedActiveDays,
      firstSeenMs: acc.firstSeenMs,
      lastSeenMs: acc.lastSeenMs,
      cefrTransitions: transitions,
    };
  });

  return {
    eventCount: canonical.length,
    lessonCount: lessons.length,
    userCount: users.length,
    earliestMs,
    latestMs,
    lessons,
    users,
  };
}

function applyEventToLesson(
  event: TelemetryEvent,
  lessonMap: Map<string, LessonAccumulator>,
): void {
  switch (event.type) {
    case "lesson_start": {
      const l = getLesson(lessonMap, (event as LessonStartEvent).lessonId);
      l.starts += 1;
      l.userIdHashes.add(event.userIdHash);
      return;
    }
    case "lesson_complete": {
      const e = event as LessonCompleteEvent;
      const l = getLesson(lessonMap, e.lessonId);
      l.completions += 1;
      l.totalScoreRatio += e.scoreRatio;
      l.totalScoreSamples += 1;
      l.totalDurationMs += e.durationMs;
      l.durationSamples += 1;
      l.userIdHashes.add(event.userIdHash);
      return;
    }
    case "lesson_retry": {
      const l = getLesson(lessonMap, (event as LessonRetryEvent).lessonId);
      l.retries += 1;
      l.userIdHashes.add(event.userIdHash);
      return;
    }
    case "lesson_dropoff": {
      const l = getLesson(lessonMap, (event as LessonDropoffEvent).lessonId);
      l.dropoffs += 1;
      l.userIdHashes.add(event.userIdHash);
      return;
    }
    case "speaking_retry": {
      const l = getLesson(lessonMap, (event as SpeakingRetryEvent).lessonId);
      l.speakingRetries += 1;
      l.userIdHashes.add(event.userIdHash);
      return;
    }
    case "hesitation_loop": {
      const l = getLesson(lessonMap, (event as HesitationLoopEvent).lessonId);
      l.hesitationLoops += 1;
      l.userIdHashes.add(event.userIdHash);
      return;
    }
    case "study_streak":
    case "cefr_checkpoint":
      // User-scoped events; no per-lesson contribution.
      return;
  }
}

function applyEventToUser(event: TelemetryEvent, user: UserAccumulator): void {
  switch (event.type) {
    case "lesson_start":
      user.lessonsStarted += 1;
      return;
    case "lesson_complete":
      user.lessonsCompleted += 1;
      return;
    case "lesson_retry":
      user.totalRetries += 1;
      return;
    case "lesson_dropoff":
      user.lessonsDroppedOff += 1;
      return;
    case "speaking_retry":
      user.totalSpeakingRetries += 1;
      return;
    case "hesitation_loop":
      user.totalHesitationLoops += 1;
      return;
    case "study_streak": {
      const e = event as StudyStreakEvent;
      if (e.streakDays > user.maxStreakDays) user.maxStreakDays = e.streakDays;
      return;
    }
    case "cefr_checkpoint": {
      const e = event as CefrCheckpointEvent;
      user.cefrTransitions.push({
        modality: e.modality,
        fromLevel: e.fromLevel,
        toLevel: e.toLevel,
        confidence: e.confidence,
        timestampMs: e.timestampMs,
      });
      return;
    }
  }
}

/** Merge two aggregations into one, preserving determinism. */
export function mergeAggregations(
  a: AggregationSummary,
  b: AggregationSummary,
): AggregationSummary {
  const lessonMap = new Map<string, LessonAggregate>();
  for (const l of a.lessons) lessonMap.set(l.lessonId, l);
  for (const l of b.lessons) {
    const existing = lessonMap.get(l.lessonId);
    if (!existing) {
      lessonMap.set(l.lessonId, l);
      continue;
    }
    const mergedUsers = new Set<string>([
      ...existing.userIdHashes,
      ...l.userIdHashes,
    ]);
    const sortedUsers = [...mergedUsers].sort();
    lessonMap.set(l.lessonId, {
      lessonId: l.lessonId,
      starts: existing.starts + l.starts,
      completions: existing.completions + l.completions,
      retries: existing.retries + l.retries,
      dropoffs: existing.dropoffs + l.dropoffs,
      speakingRetries: existing.speakingRetries + l.speakingRetries,
      hesitationLoops: existing.hesitationLoops + l.hesitationLoops,
      totalScoreRatio: existing.totalScoreRatio + l.totalScoreRatio,
      totalScoreSamples: existing.totalScoreSamples + l.totalScoreSamples,
      totalDurationMs: existing.totalDurationMs + l.totalDurationMs,
      durationSamples: existing.durationSamples + l.durationSamples,
      uniqueUsers: sortedUsers.length,
      userIdHashes: sortedUsers,
    });
  }

  const userMap = new Map<string, UserAggregate>();
  for (const u of a.users) userMap.set(u.userIdHash, u);
  for (const u of b.users) {
    const existing = userMap.get(u.userIdHash);
    if (!existing) {
      userMap.set(u.userIdHash, u);
      continue;
    }
    const activeDays = new Set<number>([
      ...existing.activeDays,
      ...u.activeDays,
    ]);
    const sessions = new Set<string>([
      ...existing.sessionIdHashes,
      ...u.sessionIdHashes,
    ]);
    const sortedSessions = [...sessions].sort();
    const transitions = [...existing.cefrTransitions, ...u.cefrTransitions]
      .slice()
      .sort((x, y) => {
        if (x.timestampMs !== y.timestampMs) return x.timestampMs - y.timestampMs;
        if (x.modality < y.modality) return -1;
        if (x.modality > y.modality) return 1;
        return 0;
      });
    userMap.set(u.userIdHash, {
      userIdHash: u.userIdHash,
      sessions: sortedSessions.length,
      sessionIdHashes: sortedSessions,
      lessonsStarted: existing.lessonsStarted + u.lessonsStarted,
      lessonsCompleted: existing.lessonsCompleted + u.lessonsCompleted,
      lessonsDroppedOff: existing.lessonsDroppedOff + u.lessonsDroppedOff,
      totalRetries: existing.totalRetries + u.totalRetries,
      totalSpeakingRetries:
        existing.totalSpeakingRetries + u.totalSpeakingRetries,
      totalHesitationLoops:
        existing.totalHesitationLoops + u.totalHesitationLoops,
      maxStreakDays: Math.max(existing.maxStreakDays, u.maxStreakDays),
      activeDays: [...activeDays].sort((x, y) => x - y),
      firstSeenMs: Math.min(existing.firstSeenMs, u.firstSeenMs),
      lastSeenMs: Math.max(existing.lastSeenMs, u.lastSeenMs),
      cefrTransitions: transitions,
    });
  }

  const earliest =
    a.earliestMs === null
      ? b.earliestMs
      : b.earliestMs === null
        ? a.earliestMs
        : Math.min(a.earliestMs, b.earliestMs);
  const latest =
    a.latestMs === null
      ? b.latestMs
      : b.latestMs === null
        ? a.latestMs
        : Math.max(a.latestMs, b.latestMs);

  const lessons = [...lessonMap.keys()]
    .sort()
    .map((id) => lessonMap.get(id)!);
  const users = [...userMap.keys()].sort().map((id) => userMap.get(id)!);

  return {
    eventCount: a.eventCount + b.eventCount,
    lessonCount: lessons.length,
    userCount: users.length,
    earliestMs: earliest,
    latestMs: latest,
    lessons,
    users,
  };
}

// Re-export for downstream modules that compute their own time helpers.
export { UTC_MS_PER_DAY, utcDayOrdinal };
