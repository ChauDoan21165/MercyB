// PATH: src/lib/security/piiProtection.ts
/**
 * PII Protection & Privacy Utilities
 * Prevents logging and displaying sensitive user information
 */

/**
 * Strip PII from error messages and logs
 */
export function stripPII(message: string): string {
  return message
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[EMAIL_REDACTED]")
    .replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, "[PHONE_REDACTED]")
    .replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, "[ID_REDACTED]")
    .replace(/\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g, "[CARD_REDACTED]");
}

/**
 * Mask user ID for display — show first 4 chars only.
 */
export function maskUserId(userId: string): string {
  if (!userId || userId.length < 8) return "[REDACTED]";
  return `${userId.substring(0, 4)}…`;
}

/**
 * Mask email for display — show first char + domain.
 */
export function maskEmail(email: string): string {
  const atIndex = email.indexOf("@");
  if (atIndex <= 0) return "[EMAIL_REDACTED]";
  const local  = email.slice(0, atIndex);
  const domain = email.slice(atIndex + 1);
  if (!domain) return "[EMAIL_REDACTED]";
  return `${local[0]}***@${domain}`;
}

/**
 * Sanitize a user object for logging — removes all PII fields.
 */
export function sanitizeUserForLog(user: unknown): unknown {
  if (!user || typeof user !== "object") return null;

  const record = user as Record<string, unknown>;

  return {
    id: typeof record.id === "string" ? maskUserId(record.id) : "[REDACTED]",
    created_at: record.created_at ?? null,
    // Explicitly excluded: email, phone, full_name
  };
}

/**
 * Safe console.log — strips PII and is silent in production.
 */
export function safeLog(...args: unknown[]): void {
  if (import.meta.env.PROD) return;

  const sanitized = args.map((arg) => {
    if (typeof arg === "string") return stripPII(arg);
    if (typeof arg === "object" && arg !== null) return sanitizeUserForLog(arg);
    return arg;
  });

  console.log(...sanitized);
}

/**
 * Safe error logging — strips PII and is silent in production.
 * Does not call console.error in production to avoid leaking
 * any internal details even after stripping.
 */
export function safeError(message: string, error?: unknown): void {
  if (import.meta.env.PROD) return;

  console.error("[ERROR]", stripPII(message), error);
}