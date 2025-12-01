// Tamper Detection - Detect and prevent path traversal and injection attacks

const ROOM_ID_PATTERN = /^[a-z0-9_]+$/;
const TIER_ID_PATTERN = /^(free|vip[1-9]|vip3ii|kids_[1-3])$/;

export class TamperError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = 'TamperError';
  }
}

/**
 * Validate room ID to prevent path traversal
 */
export function validateRoomId(roomId: string): void {
  if (!roomId) {
    throw new TamperError('Room ID is required', 'roomId');
  }

  // Check for path traversal
  if (roomId.includes('../') || roomId.includes('..\\')) {
    throw new TamperError('ROOM_ID_TAMPERED: Path traversal detected', 'roomId');
  }

  // Check for spaces or uppercase
  if (/[A-Z\s]/.test(roomId)) {
    throw new TamperError('ROOM_ID_TAMPERED: Invalid characters (uppercase or spaces)', 'roomId');
  }

  // Enforce pattern: lowercase alphanumeric + underscores only
  if (!ROOM_ID_PATTERN.test(roomId)) {
    throw new TamperError('ROOM_ID_TAMPERED: Must be lowercase alphanumeric with underscores only', 'roomId');
  }

  // Length check
  if (roomId.length > 100) {
    throw new TamperError('ROOM_ID_TAMPERED: Room ID too long', 'roomId');
  }
}

/**
 * Validate tier ID to prevent tier spoofing
 */
export function validateTierId(tierId: string): void {
  if (!tierId) {
    throw new TamperError('Tier ID is required', 'tierId');
  }

  const normalized = tierId.toLowerCase();

  if (!TIER_ID_PATTERN.test(normalized)) {
    throw new TamperError('TIER_ID_INVALID: Not a valid tier', 'tierId');
  }
}

/**
 * Validate user ID to prevent injection
 */
export function validateUserId(userId: string): void {
  if (!userId) {
    throw new TamperError('User ID is required', 'userId');
  }

  // UUID format check
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  if (!uuidPattern.test(userId)) {
    throw new TamperError('USER_ID_INVALID: Must be valid UUID', 'userId');
  }
}

/**
 * Detect SQL injection patterns
 */
export function detectSQLInjection(input: string): boolean {
  const sqlPatterns = [
    /(\bOR\b|\bAND\b)\s+\d+\s*=\s*\d+/i,
    /UNION\s+SELECT/i,
    /DROP\s+TABLE/i,
    /INSERT\s+INTO/i,
    /DELETE\s+FROM/i,
    /--/,
    /;/,
    /\/\*/,
    /\*\//,
  ];

  return sqlPatterns.some(pattern => pattern.test(input));
}

/**
 * Sanitize and validate search query
 */
export function validateSearchQuery(query: string): string {
  if (!query || query.length === 0) {
    return '';
  }

  // Check for SQL injection
  if (detectSQLInjection(query)) {
    throw new TamperError('SEARCH_QUERY_TAMPERED: SQL injection detected', 'searchQuery');
  }

  // Limit length
  const sanitized = query.slice(0, 200).trim();

  return sanitized;
}
