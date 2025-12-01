/**
 * Comprehensive Audit Logging System
 * Tracks all admin operations and security events
 */

import { supabase } from '@/integrations/supabase/client';
import { maskUserId, maskEmail } from './piiProtection';

export type AuditEventType = 
  | 'admin_access'
  | 'room_edit'
  | 'room_create'
  | 'room_delete'
  | 'tier_change'
  | 'user_ban'
  | 'user_unban'
  | 'access_code_create'
  | 'payment_verified'
  | 'bulk_operation'
  | 'security_event';

export interface AuditLogEntry {
  type: AuditEventType;
  action: string;
  targetType?: string;
  targetId?: string;
  metadata?: Record<string, any>;
}

/**
 * Log audit event to database
 */
export const logAuditEvent = async (entry: AuditLogEntry) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('Cannot log audit event: user not authenticated');
      return;
    }

    // Strip PII from metadata
    const sanitizedMetadata = entry.metadata ? {
      ...entry.metadata,
      user_id: entry.metadata.user_id ? maskUserId(entry.metadata.user_id) : undefined,
      email: entry.metadata.email ? maskEmail(entry.metadata.email) : undefined,
    } : undefined;

    await supabase.from('audit_logs').insert({
      admin_id: user.id,
      action: entry.action,
      target_type: entry.targetType || null,
      target_id: entry.targetId || null,
      metadata: sanitizedMetadata || null,
      ip_address: null, // Will be set by edge function if needed
      user_agent: navigator.userAgent,
    });
  } catch (error) {
    console.error('Failed to log audit event:', error);
  }
};

/**
 * Log admin dashboard access
 */
export const logAdminAccess = async (page: string) => {
  await logAuditEvent({
    type: 'admin_access',
    action: `Accessed admin ${page}`,
    targetType: 'admin_page',
    targetId: page,
  });
};

/**
 * Log room modification
 */
export const logRoomEdit = async (roomId: string, changes: string[]) => {
  await logAuditEvent({
    type: 'room_edit',
    action: 'Room modified',
    targetType: 'room',
    targetId: roomId,
    metadata: { changes },
  });
};

/**
 * Log tier change
 */
export const logTierChange = async (userId: string, oldTier: string, newTier: string) => {
  await logAuditEvent({
    type: 'tier_change',
    action: 'User tier changed',
    targetType: 'user',
    targetId: userId,
    metadata: { oldTier, newTier },
  });
};

/**
 * Log bulk operation
 */
export const logBulkOperation = async (operation: string, count: number, details?: any) => {
  await logAuditEvent({
    type: 'bulk_operation',
    action: operation,
    metadata: { count, ...details },
  });
};