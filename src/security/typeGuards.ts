/**
 * Path: src/security/typeGuards.ts
 * File: typeGuards.ts
 *
 * Type Guards - Strict runtime type validation for user tier and roles
 */

import type { TierId } from '@/lib/roomMaster/roomMasterTypes';

const VALID_TIERS: TierId[] = [
  'free',
  'vip1',
  'vip2',
  'vip3',
  'vip4',
  'vip5',
  'vip6',
  'vip7',
  'vip8',
  'vip9',
  'premium_month',
  'premium_year',
  'kids_1',
  'kids_2',
  'kids_3',
];

const VALID_ROLES = ['admin', 'moderator', 'user'] as const;
export type AppRole = (typeof VALID_ROLES)[number];

/**
 * Guard: Ensure tier is valid, force to 'free' if poisoned
 */
export function guardTierId(tier: unknown): TierId {
  if (typeof tier !== 'string') {
    if (import.meta.env.DEV) {
      console.error('[TypeGuard] Invalid tier type:', typeof tier);
    }
    return 'free';
  }

  const normalized = tier.trim().toLowerCase() as TierId;

  if (!VALID_TIERS.includes(normalized)) {
    if (import.meta.env.DEV) {
      console.error('[TypeGuard] Invalid tier value:', tier, '- forcing to free');
    }
    return 'free';
  }

  return normalized;
}

/**
 * Guard: Ensure role is valid
 */
export function guardRole(role: unknown): AppRole {
  if (typeof role !== 'string') {
    return 'user';
  }

  const normalized = role.trim().toLowerCase() as AppRole;

  if (!VALID_ROLES.includes(normalized)) {
    if (import.meta.env.DEV) {
      console.error('[TypeGuard] Invalid role:', role, '- forcing to user');
    }
    return 'user';
  }

  return normalized;
}

/**
 * Guard: Ensure user ID is valid UUID
 */
export function guardUserId(userId: unknown): string | null {
  if (typeof userId !== 'string') {
    return null;
  }

  const trimmed = userId.trim();

  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  if (!uuidPattern.test(trimmed)) {
    if (import.meta.env.DEV) {
      console.error('[TypeGuard] Invalid user ID format');
    }
    return null;
  }

  return trimmed;
}

/**
 * Compare client tier vs server tier, detect spoofing
 */
export function detectTierSpoofing(
  clientTier: TierId,
  serverTier: TierId,
): boolean {
  const normalizedClient = guardTierId(clientTier);
  const normalizedServer = guardTierId(serverTier);

  if (normalizedClient !== normalizedServer) {
    if (import.meta.env.DEV) {
      console.warn('[TierSpoofing] Mismatch detected:', {
        client: normalizedClient,
        server: normalizedServer,
      });
    }
    return true;
  }

  return false;
}

/**
 * Get tier level for comparison (higher = more access)
 *
 * Notes:
 * - premium_month / premium_year are canonical paid billing tiers
 * - vip1..vip9 remain legacy compatibility levels
 * - kids tiers remain scoped lower levels
 */
export function getTierLevel(tier: TierId): number {
  const safeTier = guardTierId(tier);

  const tierLevels: Record<TierId, number> = {
    free: 0,
    vip1: 1,
    vip2: 2,
    vip3: 3,
    vip4: 4,
    vip5: 5,
    vip6: 6,
    vip7: 7,
    vip8: 8,
    vip9: 9,
    premium_month: 999,
    premium_year: 999,
    kids_1: 1,
    kids_2: 2,
    kids_3: 3,
  };

  return tierLevels[safeTier];
}

/**
 * Check if user tier grants access to required tier
 *
 * Safe behavior:
 * - unknown / poisoned user tier => treated as 'free'
 * - unknown / poisoned required tier => treated as 'free'
 */
export function canAccessTier(
  userTier: TierId | string | null | undefined,
  requiredTier: TierId | string | null | undefined,
): boolean {
  const safeUserTier = guardTierId(userTier);
  const safeRequiredTier = guardTierId(requiredTier);

  const userLevel = getTierLevel(safeUserTier);
  const requiredLevel = getTierLevel(safeRequiredTier);

  return userLevel >= requiredLevel;
}