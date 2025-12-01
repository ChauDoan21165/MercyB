/**
 * Session Hardening & Duplicate Session Prevention
 * Enforces strict session policies and blocks multi-device logins
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

const SESSION_STORAGE_KEY = 'mb_active_session';
const MAX_SESSION_AGE_MS = 3600000; // 1 hour

export interface ActiveSession {
  sessionId: string;
  deviceId: string;
  userId: string;
  createdAt: number;
  lastActivity: number;
}

/**
 * Generate unique device fingerprint
 */
export function generateDeviceId(): string {
  const nav = navigator;
  const screen = window.screen;
  
  const fingerprint = [
    nav.userAgent,
    nav.language,
    screen.colorDepth,
    screen.width,
    screen.height,
    new Date().getTimezoneOffset(),
  ].join('|');
  
  // Simple hash (in production, use crypto.subtle.digest)
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  return Math.abs(hash).toString(36);
}

/**
 * Check if user has active session on another device
 */
export async function checkDuplicateSession(userId: string): Promise<boolean> {
  try {
    const { data: sessions, error } = await supabase
      .from('user_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true);
    
    if (error) throw error;
    
    const currentDeviceId = generateDeviceId();
    const otherDeviceSessions = sessions?.filter(
      s => s.device_id !== currentDeviceId
    ) || [];
    
    return otherDeviceSessions.length > 0;
  } catch (error) {
    logger.error('Failed to check duplicate session', { error });
    return false;
  }
}

/**
 * Register active session
 */
export async function registerSession(userId: string): Promise<void> {
  const deviceId = generateDeviceId();
  const sessionId = crypto.randomUUID();
  
  const session: ActiveSession = {
    sessionId,
    deviceId,
    userId,
    createdAt: Date.now(),
    lastActivity: Date.now(),
  };
  
  // Store locally
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  
  // Register in database
  try {
    await supabase.from('user_sessions').upsert({
      user_id: userId,
      session_id: sessionId,
      device_id: deviceId,
      device_info: navigator.userAgent,
      is_active: true,
      last_activity: new Date().toISOString(),
    });
    
    logger.info('Session registered', { userId, deviceId });
  } catch (error) {
    logger.error('Failed to register session', { error });
  }
}

/**
 * Deactivate all other sessions
 */
export async function deactivateOtherSessions(userId: string): Promise<void> {
  const currentDeviceId = generateDeviceId();
  
  try {
    await supabase
      .from('user_sessions')
      .update({ is_active: false })
      .eq('user_id', userId)
      .neq('device_id', currentDeviceId);
    
    logger.info('Other sessions deactivated', { userId });
  } catch (error) {
    logger.error('Failed to deactivate sessions', { error });
  }
}

/**
 * Update session activity
 */
export async function updateSessionActivity(): Promise<void> {
  const sessionStr = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!sessionStr) return;
  
  try {
    const session: ActiveSession = JSON.parse(sessionStr);
    session.lastActivity = Date.now();
    
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    
    await supabase
      .from('user_sessions')
      .update({ last_activity: new Date().toISOString() })
      .eq('session_id', session.sessionId);
  } catch (error) {
    logger.error('Failed to update session activity', { error });
  }
}

/**
 * Check session validity
 */
export function isSessionValid(): boolean {
  const sessionStr = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!sessionStr) return false;
  
  try {
    const session: ActiveSession = JSON.parse(sessionStr);
    const age = Date.now() - session.createdAt;
    
    return age < MAX_SESSION_AGE_MS;
  } catch {
    return false;
  }
}

/**
 * Clean up expired sessions
 */
export async function cleanupExpiredSessions(): Promise<void> {
  try {
    const cutoff = new Date(Date.now() - MAX_SESSION_AGE_MS).toISOString();
    
    await supabase
      .from('user_sessions')
      .update({ is_active: false })
      .lt('last_activity', cutoff);
    
    logger.info('Expired sessions cleaned up');
  } catch (error) {
    logger.error('Failed to cleanup sessions', { error });
  }
}
