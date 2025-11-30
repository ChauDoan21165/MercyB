import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';

export interface AuditLogEntry {
  admin_id: string;
  action: string;
  target_id?: string;
  target_type?: string;
  metadata?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
}

/**
 * Log admin actions to audit_logs table
 * Use for tracking sensitive operations like payments, manual approvals, room edits, etc.
 */
export async function logAdminAction(
  client: SupabaseClient,
  entry: AuditLogEntry
): Promise<void> {
  try {
    const { error } = await client.from('audit_logs').insert({
      admin_id: entry.admin_id,
      action: entry.action,
      target_id: entry.target_id || null,
      target_type: entry.target_type || null,
      metadata: entry.metadata || {},
      ip_address: entry.ip_address || null,
      user_agent: entry.user_agent || null,
    });

    if (error) {
      console.error('Failed to write audit log:', error);
    }
  } catch (error) {
    console.error('Audit log error:', error);
  }
}

/**
 * Common audit action types for consistency
 */
export const AUDIT_ACTIONS = {
  // Room operations
  ROOM_CREATE: 'room.create',
  ROOM_EDIT: 'room.edit',
  ROOM_DELETE: 'room.delete',
  ROOM_IMPORT: 'room.import',
  ROOM_HEALTH_OVERRIDE: 'room.health_override',
  ROOM_LOCK: 'room.lock',
  ROOM_UNLOCK: 'room.unlock',
  
  // Payment operations
  PAYMENT_VERIFY: 'payment.verify',
  PAYMENT_REJECT: 'payment.reject',
  PAYMENT_MARK_FRAUD: 'payment.mark_fraud',
  PAYMENT_REFUND: 'payment.refund',
  
  // User operations
  USER_ROLE_CHANGE: 'user.role_change',
  USER_BAN: 'user.ban',
  USER_UNBAN: 'user.unban',
  USER_TIER_CHANGE: 'user.tier_change',
  USER_SUBSCRIPTION_OVERRIDE: 'user.subscription_override',
  
  // System operations
  SYSTEM_FEATURE_FLAG_UPDATE: 'system.feature_flag_update',
  SYSTEM_CONFIG_CHANGE: 'system.config_change',
  
  // Music operations
  MUSIC_APPROVE: 'music.approve',
  MUSIC_REJECT: 'music.reject',
  MUSIC_DELETE: 'music.delete',
  
  // Content operations
  JSON_REPLACE: 'json.replace',
  JSON_BULK_UPDATE: 'json.bulk_update',
  
  // Moderation operations
  MODERATION_VIOLATION_REVIEWED: 'moderation.violation_reviewed',
  MODERATION_USER_WARNING: 'moderation.user_warning',
} as const;
