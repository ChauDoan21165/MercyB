/**
 * Security Guard Utilities
 * Centralized authentication and authorization checks
 */

import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export interface AuthContext {
  user: User | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
}

/**
 * Get current authenticated user and admin status
 * @throws Error if not authenticated
 */
export async function requireAuth(): Promise<AuthContext> {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    throw new Error('AUTHENTICATION_REQUIRED');
  }

  // Check admin status using has_role RPC
  const { data: isAdminRpc, error: adminError } = await supabase.rpc('has_role', {
    _role: 'admin',
    _user_id: user.id,
  });

  if (adminError) {
    console.error('Error checking admin role:', adminError);
  }

  return {
    user,
    isAdmin: !!isAdminRpc,
    isAuthenticated: true,
  };
}

/**
 * Require admin role
 * @throws Error if not admin
 */
export async function requireAdmin(): Promise<AuthContext> {
  const auth = await requireAuth();
  
  if (!auth.isAdmin) {
    throw new Error('ADMIN_ACCESS_REQUIRED');
  }
  
  return auth;
}

/**
 * Check if current user is admin (non-throwing)
 */
export async function checkIsAdmin(): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return false;

    const { data: isAdminRpc } = await supabase.rpc('has_role', {
      _role: 'admin',
      _user_id: user.id,
    });

    return !!isAdminRpc;
  } catch {
    return false;
  }
}

/**
 * Session expiration handler
 */
export function setupSessionMonitoring(
  onExpired: () => void,
  onError: (error: Error) => void
) {
  // Monitor auth state changes
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
      if (!session) {
        onExpired();
      }
    }
    
    if (event === 'USER_DELETED') {
      onExpired();
    }
  });

  return () => subscription.unsubscribe();
}
