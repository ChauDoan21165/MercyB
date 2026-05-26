/**
 * Path: src/lib/security/errorMessages.ts
 * Safe Error Messages
 * User-facing error messages that do not leak sensitive info
 */

export const SAFE_ERROR_MESSAGES: Record<string, string> = {
  // Authentication errors
  AUTHENTICATION_REQUIRED: "Please log in to continue.",
  SESSION_EXPIRED: "Your session has expired. Please log in again.",
  ADMIN_ACCESS_REQUIRED: "Admin access is required for this operation.",

  // Access control errors
  ACCESS_DENIED_INSUFFICIENT_TIER: "Upgrade your subscription to access this content.",
  ACCESS_DENIED: "You do not have permission to access this resource.",

  // Input validation errors
  INVALID_ROOM_ID: "The room ID you provided is invalid.",
  INVALID_AUDIO_FILENAME: "The audio filename is invalid.",
  INVALID_INPUT: "The input you provided is invalid.",
  INVALID_TIER: "The subscription tier is invalid.",
  INVALID_URL: "The URL you provided is invalid.",
  INVALID_ROOM_SIZE: "This room exceeds the maximum allowed size.",
  PAYLOAD_TOO_LARGE: "The data you submitted is too large.",

  // Rate limiting
  RATE_LIMIT_EXCEEDED: "You are making requests too quickly. Please slow down.",

  // Generic errors
  INTERNAL_ERROR: "An error occurred. Please try again later.",
  NOT_FOUND: "The resource you requested was not found.",
  DATABASE_ERROR: "A database error occurred. Please try again.",

  // Room loading errors
  ROOM_NOT_FOUND: "The room you requested was not found.",
  ROOM_LOAD_ERROR: "Failed to load room content. Please try again.",
};

/**
 * Convert internal error to safe user-facing message.
 * Never exposes internal error details to the user.
 */
export function getSafeErrorMessage(error: Error | string): string {
  const errorKey = typeof error === "string" ? error : error.message;

  if (errorKey in SAFE_ERROR_MESSAGES) {
    return SAFE_ERROR_MESSAGES[errorKey];
  }

  // Unmapped error — log only in dev, never expose key to user
  if (import.meta.env.DEV) {
    console.warn("[errorMessages] unmapped error key:", errorKey);
  }

  return SAFE_ERROR_MESSAGES.INTERNAL_ERROR;
}

/**
 * Log detailed error for debugging.
 * Only logs in development — in production integrate with a logging service.
 */
export function logError(
  error: Error,
  context?: Record<string, unknown>,
): void {
  if (import.meta.env.DEV) {
    console.error("[Security Error]", {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    });
  }

  // TODO: In production, send to Supabase logging or an external service
}