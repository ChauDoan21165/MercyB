/**
 * Supabase Query Performance Logger
 * Dev-only logging for slow queries
 */

const isDev = process.env.NODE_ENV !== 'production';
const SLOW_QUERY_THRESHOLD = 200; // ms

interface QueryLog {
  table: string;
  operation: string;
  duration: number;
  timestamp: number;
  params?: any;
}

const queryLogs: QueryLog[] = [];

/**
 * Log Supabase query performance
 */
export function logQuery(
  table: string,
  operation: string,
  duration: number,
  params?: any
) {
  if (!isDev) return;

  const log: QueryLog = {
    table,
    operation,
    duration,
    timestamp: Date.now(),
    params,
  };

  queryLogs.push(log);

  // Keep only last 100 logs
  if (queryLogs.length > 100) {
    queryLogs.shift();
  }

  // Warn about slow queries
  if (duration > SLOW_QUERY_THRESHOLD) {
    console.warn(
      `[Slow Query] ${table}.${operation} took ${duration.toFixed(2)}ms`,
      params
    );
  }
}

/**
 * Wrapper for Supabase queries with logging
 */
export async function loggedQuery<T>(
  table: string,
  operation: string,
  queryFn: () => Promise<T>,
  params?: any
): Promise<T> {
  const startTime = performance.now();
  
  try {
    const result = await queryFn();
    const duration = performance.now() - startTime;
    logQuery(table, operation, duration, params);
    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    logQuery(table, `${operation} (ERROR)`, duration, params);
    throw error;
  }
}

/**
 * Get query performance report
 */
export function getQueryReport() {
  if (!isDev) return [];

  return queryLogs
    .filter(log => log.duration > SLOW_QUERY_THRESHOLD)
    .sort((a, b) => b.duration - a.duration);
}

/**
 * Clear query logs
 */
export function clearQueryLogs() {
  queryLogs.length = 0;
}
