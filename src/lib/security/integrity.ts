/**
 * Data Integrity & Hash Verification
 * SHA-256 hashing for room JSON integrity checks
 */

import { logger } from '@/lib/logger';

/**
 * Calculate SHA-256 hash of string content
 */
export async function calculateHash(content: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Verify content hash matches expected value
 */
export async function verifyHash(
  content: string,
  expectedHash: string
): Promise<boolean> {
  const actualHash = await calculateHash(content);
  const match = actualHash === expectedHash;
  
  if (!match) {
    logger.error('Hash mismatch detected', {
      expected: expectedHash,
      actual: actualHash,
    });
  }
  
  return match;
}

/**
 * Calculate hash for room JSON
 */
export async function calculateRoomHash(roomData: any): Promise<string> {
  const normalized = JSON.stringify(roomData, Object.keys(roomData).sort());
  return calculateHash(normalized);
}

/**
 * Verify room JSON integrity
 */
export async function verifyRoomIntegrity(
  roomData: any,
  expectedHash: string
): Promise<{ valid: boolean; actualHash: string }> {
  const actualHash = await calculateRoomHash(roomData);
  const valid = actualHash === expectedHash;
  
  if (!valid) {
    logger.error('Room integrity check failed', {
      roomId: roomData.id,
      expected: expectedHash,
      actual: actualHash,
    });
  }
  
  return { valid, actualHash };
}

/**
 * Generate integrity report
 */
export interface IntegrityReport {
  roomId: string;
  valid: boolean;
  expectedHash?: string;
  actualHash: string;
  timestamp: number;
}

export async function generateIntegrityReport(
  roomData: any,
  expectedHash?: string
): Promise<IntegrityReport> {
  const actualHash = await calculateRoomHash(roomData);
  
  return {
    roomId: roomData.id,
    valid: expectedHash ? actualHash === expectedHash : true,
    expectedHash,
    actualHash,
    timestamp: Date.now(),
  };
}
