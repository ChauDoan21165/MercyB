/**
 * Session Management System
 * Auto-refresh Supabase session before expiry
 */

import { supabase } from "@/integrations/supabase/client";
import { logger } from "./logger";

class SessionManager {
  private refreshTimer: NodeJS.Timeout | null = null;
  private readonly REFRESH_BEFORE_EXPIRY = 2 * 60 * 1000; // 2 minutes

  /**
   * Start automatic session renewal
   */
  async startAutoRenewal() {
    // Get current session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      logger.info('No active session to renew');
      return;
    }

    // Calculate when to refresh
    const expiresAt = new Date(session.expires_at! * 1000);
    const now = new Date();
    const timeUntilExpiry = expiresAt.getTime() - now.getTime();
    const timeUntilRefresh = Math.max(0, timeUntilExpiry - this.REFRESH_BEFORE_EXPIRY);

    logger.info('Session auto-renewal scheduled', {
      expiresAt: expiresAt.toISOString(),
      refreshIn: Math.round(timeUntilRefresh / 1000) + 's',
    });

    // Schedule refresh
    this.refreshTimer = setTimeout(async () => {
      await this.renewSession();
    }, timeUntilRefresh);
  }

  /**
   * Renew session
   */
  private async renewSession() {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        logger.error('Failed to refresh session', { error: error.message });
        return;
      }

      logger.info('Session refreshed successfully');

      // Schedule next refresh
      await this.startAutoRenewal();
    } catch (err) {
      logger.error('Session renewal error', { error: String(err) });
    }
  }

  /**
   * Stop auto-renewal
   */
  stopAutoRenewal() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
      logger.info('Session auto-renewal stopped');
    }
  }

  /**
   * Force immediate renewal
   */
  async forceRenewal() {
    await this.renewSession();
  }
}

// Singleton instance
export const sessionManager = new SessionManager();

// Auto-start on import
if (typeof window !== 'undefined') {
  sessionManager.startAutoRenewal();
  
  // Expose for debugging
  (window as any).__MB_SESSION = sessionManager;
}
