import { supabase } from "@/integrations/supabase/client";

/**
 * Unified Logging System
 * 
 * Enhanced logging with automatic persistence to database and performance tracking.
 * Logs are stored in system_logs table with timestamp, level, route, userId, and metadata.
 * 
 * Usage (new API - backwards compatible):
 *   logger.info('Loading room', { roomId, tier });
 *   logger.error('Failed to send message', { error, scope: 'ChatHub' });
 *   logger.performance('loadRoom', 150, { roomId });
 * 
 * Legacy API (still supported):
 *   logger.info('RoomLoader', 'Loading room', { roomId, tier });
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  scope?: string;
  route?: string;
  userId?: string;
  roomId?: string;
  tierId?: string;
  errorStack?: string;
  [key: string]: any;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;
  private isProd = import.meta.env.PROD;

  /**
   * Remove all console.log calls in production
   */
  private shouldLog(level: LogLevel): boolean {
    if (this.isProd && level === "debug") return false;
    return true;
  }

  /**
   * Core logging implementation
   */
  private async log(level: LogLevel, scopeOrMessage: string, messageOrMeta?: string | LogContext, metaOrUndefined?: LogContext) {
    if (!this.shouldLog(level)) return;
    // Support both old and new API
    let message: string;
    let context: LogContext = {};
    
    if (typeof messageOrMeta === 'string') {
      // Old API: logger.info('scope', 'message', { meta })
      context.scope = scopeOrMessage;
      message = messageOrMeta;
      context = { ...context, ...metaOrUndefined };
    } else {
      // New API: logger.info('message', { context })
      message = scopeOrMessage;
      context = messageOrMeta || {};
    }

    const timestamp = new Date().toISOString();
    const route = context.route || window.location.pathname;
    const scope = context.scope || 'App';
    
    // Get userId from context or current session
    let userId = context.userId;
    if (!userId) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        userId = user?.id;
      } catch {
        // Ignore auth errors in logging
      }
    }

    // Console output with formatting
    const consoleMethod = level === "error" ? console.error : level === "warn" ? console.warn : console.log;
    const prefix = `[${timestamp}] [${level.toUpperCase()}] [${scope}]`;
    
    if (this.isDevelopment) {
      consoleMethod(prefix, message, context || "");
    } else {
      // In production, only log errors and warnings to console
      if (level === "error" || level === "warn") {
        consoleMethod(prefix, message);
      }
    }

    // Persist to database only in production and only for error/warn
    if (this.isProd && (level === "error" || level === "warn")) {
      try {
        await supabase.from("system_logs").insert({
          level,
          message,
          route,
          user_id: userId,
          metadata: context || {},
          created_at: timestamp,
        });
      } catch (dbError) {
        // Don't throw - logging should never break the app
        console.error("Failed to persist log to database:", dbError);
      }
    }
  }

  /**
   * Log info message
   */
  info(scopeOrMessage: string, messageOrMeta?: string | LogContext, metaOrUndefined?: LogContext) {
    this.log("info", scopeOrMessage, messageOrMeta, metaOrUndefined);
  }

  /**
   * Log warning message
   */
  warn(scopeOrMessage: string, messageOrMeta?: string | LogContext, metaOrUndefined?: LogContext) {
    this.log("warn", scopeOrMessage, messageOrMeta, metaOrUndefined);
  }

  /**
   * Log error message
   */
  error(scopeOrMessage: string, messageOrMeta?: string | LogContext, metaOrUndefined?: LogContext) {
    this.log("error", scopeOrMessage, messageOrMeta, metaOrUndefined);
  }

  /**
   * Log debug message (only in development)
   */
  debug(scopeOrMessage: string, messageOrMeta?: string | LogContext, metaOrUndefined?: LogContext) {
    if (this.isDevelopment) {
      this.log("debug", scopeOrMessage, messageOrMeta, metaOrUndefined);
    }
  }

  /**
   * Log performance metrics
   */
  performance(metricName: string, duration: number, context?: LogContext) {
    this.info(`Performance: ${metricName}`, {
      ...context,
      duration_ms: duration,
      metric: metricName,
    });
  }

  /**
   * Log room loading metrics
   */
  roomLoad(roomId: string, duration: number, success: boolean, context?: LogContext) {
    const message = success 
      ? `Room loaded: ${roomId} in ${duration}ms` 
      : `Room failed to load: ${roomId}`;
    
    if (success) {
      this.info(message, { ...context, roomId, duration_ms: duration });
    } else {
      this.error(message, { ...context, roomId, duration_ms: duration });
    }
  }

  /**
   * Log authentication events
   */
  auth(event: "login" | "logout" | "signup" | "session_refresh", userId?: string, context?: LogContext) {
    this.info(`Auth: ${event}`, { ...context, userId, auth_event: event });
  }

  /**
   * Log payment events
   */
  payment(event: string, amount?: number, tierId?: string, context?: LogContext) {
    this.info(`Payment: ${event}`, { ...context, amount, tierId, payment_event: event });
  }
}

export const logger = new Logger();
