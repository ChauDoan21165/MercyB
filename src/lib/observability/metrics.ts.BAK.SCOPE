/**
 * Observability Metrics Helper
 * Centralized metrics tracking and event emission
 */

import { logger } from '@/lib/logger';

export interface RoomLoadMetric {
  roomId: string;
  duration: number;
  success: boolean;
  tier?: string;
}

export interface AudioMetric {
  eventType: 'play_start' | 'play_error' | 'play_success';
  roomId?: string;
  entrySlug?: string;
  filename?: string;
  durationMs?: number;
  error?: string;
}

export interface ValidationMetric {
  mode: string;
  roomsChecked: number;
  errorsCount: number;
  warningsCount: number;
}

/**
 * Emit room load complete event for dev panel
 */
export function emitRoomLoadMetric(metric: RoomLoadMetric) {
  logger.roomLoad(metric.roomId, metric.duration, metric.success, {
    tier: metric.tier,
  });

  // Emit custom event for dev panel
  if (import.meta.env.DEV) {
    window.dispatchEvent(
      new CustomEvent('room:load:complete', { detail: metric })
    );
  }
}

/**
 * Track audio playback events
 */
export function trackAudioEvent(metric: AudioMetric) {
  const { eventType, roomId, entrySlug, filename, durationMs, error } = metric;

  logger.info(`Audio: ${eventType}`, {
    scope: 'AudioMetrics',
    eventType,
    roomId,
    entrySlug,
    filename,
    durationMs,
    error,
  });

  // For audio errors, log with higher severity
  if (eventType === 'play_error') {
    logger.error('Audio playback failed', {
      scope: 'AudioMetrics',
      filename,
      roomId,
      error,
    });
  }
}

/**
 * Track validation results
 */
export function trackValidationMetrics(metric: ValidationMetric) {
  logger.info('Validation completed', {
    scope: 'ValidationMetrics',
    mode: metric.mode,
    roomsChecked: metric.roomsChecked,
    errorsCount: metric.errorsCount,
    warningsCount: metric.warningsCount,
  });
}

/**
 * Emit app-level error for dev panel
 */
export function emitAppError(kind: string, details?: Record<string, any>) {
  logger.error('App error', {
    scope: 'AppError',
    kind,
    ...details,
  });

  // Emit custom event for dev panel
  if (import.meta.env.DEV) {
    window.dispatchEvent(
      new CustomEvent('app:error', { detail: { kind, ...details } })
    );
  }
}

/**
 * Track deep scan execution
 */
export function trackDeepScan(params: {
  tier: string;
  roomsScanned: number;
  issuesFound: number;
  durationMs: number;
  actorId: string;
}) {
  logger.info('Deep scan completed', {
    scope: 'DeepScanMetrics',
    kind: 'deep_scan_run',
    ...params,
  });
}

/**
 * Track room specification creation
 */
export function trackRoomSpecCreation(params: {
  targetId: string;
  scope: string;
  actorId: string;
  success: boolean;
}) {
  logger.info('Room specification created', {
    scope: 'RoomSpecMetrics',
    kind: 'room_spec_created',
    ...params,
  });
}

/**
 * Sample performance data (only log a percentage of events)
 */
export function samplePerformance<T>(
  fn: () => T,
  sampleRate: number = 0.1
): T {
  const startTime = performance.now();
  const result = fn();
  const duration = performance.now() - startTime;

  // Only log if random sample hits
  if (Math.random() < sampleRate) {
    logger.performance('sampled_operation', duration, {
      sampleRate,
    });
  }

  return result;
}
