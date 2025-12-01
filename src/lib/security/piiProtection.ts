/**
 * PII Protection & Privacy Utilities
 * Prevents logging and displaying sensitive user information
 */

/**
 * Strip PII from error messages and logs
 */
export const stripPII = (message: string): string => {
  // Remove email addresses
  message = message.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL_REDACTED]');
  
  // Remove phone numbers (various formats)
  message = message.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE_REDACTED]');
  
  // Remove UUIDs
  message = message.replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '[ID_REDACTED]');
  
  // Remove credit card numbers
  message = message.replace(/\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g, '[CARD_REDACTED]');
  
  return message;
};

/**
 * Mask user ID for display (show first 4 chars only)
 */
export const maskUserId = (userId: string): string => {
  if (!userId || userId.length < 8) return '[REDACTED]';
  return `${userId.substring(0, 4)}...`;
};

/**
 * Mask email for display (show first char + domain)
 */
export const maskEmail = (email: string): string => {
  const [local, domain] = email.split('@');
  if (!local || !domain) return '[EMAIL_REDACTED]';
  return `${local[0]}***@${domain}`;
};

/**
 * Sanitize user object for logging (remove PII)
 */
export const sanitizeUserForLog = (user: any): any => {
  if (!user) return null;
  
  return {
    id: maskUserId(user.id),
    created_at: user.created_at,
    // Explicitly exclude PII fields
    // email: REDACTED
    // phone: REDACTED
    // full_name: REDACTED
  };
};

/**
 * Safe console.log wrapper that strips PII
 */
export const safeLog = (...args: any[]) => {
  if (import.meta.env.PROD) {
    // In production, block all logs
    return;
  }
  
  const sanitized = args.map(arg => {
    if (typeof arg === 'string') {
      return stripPII(arg);
    }
    if (typeof arg === 'object' && arg !== null) {
      return sanitizeUserForLog(arg);
    }
    return arg;
  });
  
  console.log(...sanitized);
};

/**
 * Safe error logging that strips PII
 */
export const safeError = (message: string, error?: any) => {
  if (import.meta.env.PROD) {
    // In production, only log generic error
    console.error('[ERROR]', stripPII(message));
    return;
  }
  
  console.error('[ERROR]', stripPII(message), error);
};