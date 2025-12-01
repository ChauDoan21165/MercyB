// Global Access Policy - Central access control rules

import type { TierId } from '@/lib/roomMaster/roomMasterTypes';
import type { AppRole } from './typeGuards';
import { getTierLevel } from './typeGuards';
import { isKidsTier, canKidsAccessAdult } from './kidsAccess';

export interface AccessRule {
  allowedRoles: AppRole[];
  allowedTiers: TierId[];
  requireAuth: boolean;
  description: string;
}

export const ACCESS_POLICIES: Record<string, AccessRule> = {
  // Public pages
  homepage: {
    allowedRoles: ['user', 'moderator', 'admin'],
    allowedTiers: ['free', 'vip1', 'vip2', 'vip3', 'vip3ii', 'vip4', 'vip5', 'vip6', 'vip7', 'vip8', 'vip9', 'kids_1', 'kids_2', 'kids_3'],
    requireAuth: false,
    description: 'Public homepage - accessible to all',
  },

  pricing: {
    allowedRoles: ['user', 'moderator', 'admin'],
    allowedTiers: ['free', 'vip1', 'vip2', 'vip3', 'vip3ii', 'vip4', 'vip5', 'vip6', 'vip7', 'vip8', 'vip9', 'kids_1', 'kids_2', 'kids_3'],
    requireAuth: false,
    description: 'Pricing page - accessible to all',
  },

  // Free tier
  free_rooms: {
    allowedRoles: ['user', 'moderator', 'admin'],
    allowedTiers: ['free', 'vip1', 'vip2', 'vip3', 'vip3ii', 'vip4', 'vip5', 'vip6', 'vip7', 'vip8', 'vip9'],
    requireAuth: true,
    description: 'Free rooms - accessible to all authenticated users except kids',
  },

  // VIP tiers
  vip1_rooms: {
    allowedRoles: ['user', 'moderator', 'admin'],
    allowedTiers: ['vip1', 'vip2', 'vip3', 'vip3ii', 'vip4', 'vip5', 'vip6', 'vip7', 'vip8', 'vip9'],
    requireAuth: true,
    description: 'VIP1 rooms - requires VIP1 or higher',
  },

  vip2_rooms: {
    allowedRoles: ['user', 'moderator', 'admin'],
    allowedTiers: ['vip2', 'vip3', 'vip3ii', 'vip4', 'vip5', 'vip6', 'vip7', 'vip8', 'vip9'],
    requireAuth: true,
    description: 'VIP2 rooms - requires VIP2 or higher',
  },

  vip9_rooms: {
    allowedRoles: ['user', 'moderator', 'admin'],
    allowedTiers: ['vip9'],
    requireAuth: true,
    description: 'VIP9 rooms - requires VIP9 tier',
  },

  // Kids content
  kids_rooms: {
    allowedRoles: ['user', 'moderator', 'admin'],
    allowedTiers: ['kids_1', 'kids_2', 'kids_3', 'vip1', 'vip2', 'vip3', 'vip3ii', 'vip4', 'vip5', 'vip6', 'vip7', 'vip8', 'vip9'],
    requireAuth: true,
    description: 'Kids rooms - accessible to kids tiers and all adult tiers',
  },

  // Admin pages
  admin_dashboard: {
    allowedRoles: ['admin'],
    allowedTiers: ['free', 'vip1', 'vip2', 'vip3', 'vip3ii', 'vip4', 'vip5', 'vip6', 'vip7', 'vip8', 'vip9', 'kids_1', 'kids_2', 'kids_3'],
    requireAuth: true,
    description: 'Admin dashboard - requires admin role',
  },

  // Moderator pages
  mod_dashboard: {
    allowedRoles: ['moderator', 'admin'],
    allowedTiers: ['free', 'vip1', 'vip2', 'vip3', 'vip3ii', 'vip4', 'vip5', 'vip6', 'vip7', 'vip8', 'vip9', 'kids_1', 'kids_2', 'kids_3'],
    requireAuth: true,
    description: 'Moderator dashboard - requires moderator or admin role',
  },

  // Profile & settings
  profile: {
    allowedRoles: ['user', 'moderator', 'admin'],
    allowedTiers: ['free', 'vip1', 'vip2', 'vip3', 'vip3ii', 'vip4', 'vip5', 'vip6', 'vip7', 'vip8', 'vip9', 'kids_1', 'kids_2', 'kids_3'],
    requireAuth: true,
    description: 'User profile - accessible to all authenticated users',
  },
};

/**
 * Check if user has access to a page
 */
export function checkPageAccess(
  pageId: string,
  userRole: AppRole,
  userTier: TierId
): { allowed: boolean; reason?: string } {
  const policy = ACCESS_POLICIES[pageId];

  if (!policy) {
    return { allowed: false, reason: 'Unknown page' };
  }

  // Check role
  if (!policy.allowedRoles.includes(userRole)) {
    return { allowed: false, reason: `This page requires ${policy.allowedRoles.join(' or ')} role` };
  }

  // Check tier
  if (!policy.allowedTiers.includes(userTier)) {
    return { allowed: false, reason: `This page requires ${policy.allowedTiers.join(', ')} tier` };
  }

  return { allowed: true };
}

/**
 * Check if user can access a room
 */
export function checkRoomAccess(
  userTier: TierId,
  roomTier: TierId
): { allowed: boolean; reason?: string } {
  // Kids tier users can only access kids content
  if (isKidsTier(userTier)) {
    if (!canKidsAccessAdult(userTier, roomTier)) {
      return { allowed: false, reason: 'Kids accounts can only access Kids Level content' };
    }
  }

  // Check tier level
  const userLevel = getTierLevel(userTier);
  const roomLevel = getTierLevel(roomTier);

  if (userLevel < roomLevel) {
    return { allowed: false, reason: `This room requires ${roomTier} tier or higher` };
  }

  return { allowed: true };
}
