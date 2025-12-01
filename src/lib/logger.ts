/**
 * Structured logging utility
 * Replaces scattered console.log with consistent, filterable logs
 * 
 * Usage:
 *   logger.info('RoomLoader', 'Loading room', { roomId, tier });
 *   logger.warn('AudioPlayer', 'Missing audio file', { path });
 *   logger.error('ChatHub', 'Failed to send message', { error });
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogMeta {
  [key: string]: any;
}

class Logger {
  private isDev = process.env.NODE_ENV === 'development';

  private log(level: LogLevel, scope: string, message: string, meta?: LogMeta) {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}] [${scope}]`;

    const logData = {
      timestamp,
      level,
      scope,
      message,
      ...meta,
    };

    switch (level) {
      case 'error':
        console.error(prefix, message, meta || '');
        break;
      case 'warn':
        console.warn(prefix, message, meta || '');
        break;
      case 'info':
        if (this.isDev) {
          console.log(prefix, message, meta || '');
        }
        break;
      case 'debug':
        if (this.isDev) {
          console.debug(prefix, message, meta || '');
        }
        break;
    }

    // In production, could send to monitoring service here
    // e.g., Sentry, LogRocket, etc.
  }

  info(scope: string, message: string, meta?: LogMeta) {
    this.log('info', scope, message, meta);
  }

  warn(scope: string, message: string, meta?: LogMeta) {
    this.log('warn', scope, message, meta);
  }

  error(scope: string, message: string, meta?: LogMeta) {
    this.log('error', scope, message, meta);
  }

  debug(scope: string, message: string, meta?: LogMeta) {
    this.log('debug', scope, message, meta);
  }
}

export const logger = new Logger();
