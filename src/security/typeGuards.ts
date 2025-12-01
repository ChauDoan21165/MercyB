// Type Guards - Strict runtime type validation for user tier and roles

import type { TierId } from '@/lib/roomMaster/roomMasterTypes';

const VALID_TIERS: TierId[] = [
  'free',
  'vip1',
  'vip2',
  'vip3',
  'vip3ii',
  'vip4',
  'vip5',
  'vip6',
  'vip7',
  'vip8',
  'vip9',
  'kids_1',
  'kids_2',
  'kids_3',
];

const VALID_ROLES = ['admin', 'moderator', 'user'] as const;
export type AppRole = typeof VALID_ROLES[number];

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

  const normalized = tier.toLowerCase() as TierId;

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

  if (!VALID_ROLES.includes(role as AppRole)) {
    if (import.meta.env.DEV) {
      console.error('[TypeGuard] Invalid role:', role, '- forcing to user');
    }
    return 'user';
  }

  return role as AppRole;
}

/**
 * Guard: Ensure user ID is valid UUID
 */
export function guardUserId(userId: unknown): string | null {
  if (typeof userId !== 'string') {
    return null;
  }

  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  if (!uuidPattern.test(userId)) {
    if (import.meta.env.DEV) {
      console.error('[TypeGuard] Invalid user ID format');
    }
    return null;
  }

  return userId;
}

/**
 * Compare client tier vs server tier, detect spoofing
 */
export function detectTierSpoofing(clientTier: TierId, serverTier: TierId): boolean {
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
 */
export function getTierLevel(tier: TierId): number {
  const tierLevels: Record<TierId, number> = {
    free: 0,
    vip1: 1,
    vip2: 2,
    vip3: 3,
    vip3ii: 3,
    vip4: 4,
    vip5: 5,
    vip6: 6,
    vip7: 7,
    vip8: 8,
    vip9: 9,
    kids_1: 1,
    kids_2: 2,
    kids_3: 3,
  };

  return tierLevels[tier] || 0;
}

/**
 * Check if user tier grants access to required tier
 */
export function canAccessTier(userTier: TierId, requiredTier: TierId): boolean {
  const userLevel = getTierLevel(userTier);
  const requiredLevel = getTierLevel(requiredTier);

  return userLevel >= requiredLevel;
}
