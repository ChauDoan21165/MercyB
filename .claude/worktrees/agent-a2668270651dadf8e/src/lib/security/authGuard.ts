/**
 * Path: src/lib/security/authGuard.ts
 * Security Guard Utilities
 * Centralized authentication and authorization checks
 */

import { supabase } from '@/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';

export interface AuthContext {
  user: User | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
}

const GUARD_TIMEOUT_MS = 8000;

function withTimeout<T>(promise: PromiseLike<T>, ms: number): Promise<T> {
  return Promise.race([
    Promise.resolve(promise),
    new Promise<never>((_, reject) =>
      window.setTimeout(() => reject(new Error('AUTH_GUARD_TIMEOUT')), ms),
    ),
  ]);
}

async function fetchIsAdmin(userId: string): Promise<boolean> {
  try {
    const { data, error } = await withTimeout(
      supabase.rpc('has_role', { _role: 'admin', _user_id: userId }),
      GUARD_TIMEOUT_MS,
    );
    if (error) return false;
    return Boolean(data);
  } catch {
    return false;
  }
}

/**
 * Get current authenticated user and admin status.
 * Throws 'AUTHENTICATION_REQUIRED' if not authenticated.
 */
export async function requireAuth(): Promise<AuthContext> {
  let user: User | null = null;

  try {
    const { data, error } = await withTimeout(
      supabase.auth.getUser(),
      GUARD_TIMEOUT_MS,
    );
    if (error || !data?.user) throw new Error('AUTHENTICATION_REQUIRED');
    user = data.user;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'AUTHENTICATION_REQUIRED';
    throw new Error(message === 'AUTH_GUARD_TIMEOUT' ? 'AUTH_GUARD_TIMEOUT' : 'AUTHENTICATION_REQUIRED');
  }

  const isAdmin = await fetchIsAdmin(user.id);

  return { user, isAdmin, isAuthenticated: true };
}

/**
 * Require admin role.
 * Throws 'ADMIN_ACCESS_REQUIRED' if not admin.
 * Reuses requireAuth so getUser is only called once.
 */
export async function requireAdmin(): Promise<AuthContext> {
  const auth = await requireAuth();

  if (!auth.isAdmin) {
    throw new Error('ADMIN_ACCESS_REQUIRED');
  }

  return auth;
}

/**
 * Check if current user is admin — non-throwing.
 * Returns false on any error or timeout.
 */
export async function checkIsAdmin(): Promise<boolean> {
  try {
    const { data, error } = await withTimeout(
      supabase.auth.getUser(),
      GUARD_TIMEOUT_MS,
    );
    if (error || !data?.user) return false;
    return fetchIsAdmin(data.user.id);
  } catch {
    return false;
  }
}

/**
 * Monitor auth state changes and call onExpired when the session
 * is genuinely gone — not during a token refresh in progress.
 *
 * TOKEN_REFRESHED with no session means the refresh failed and the
 * session is truly gone. SIGNED_OUT always means gone.
 */
export function setupSessionMonitoring(
  onExpired: () => void,
  onError: (error: Error) => void,
): () => void {
  try {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          onExpired();
          return;
        }

        // TOKEN_REFRESHED with a valid session is a successful refresh — ignore
        // TOKEN_REFRESHED with no session means the refresh failed — treat as expired
        if (event === 'TOKEN_REFRESHED' && !session) {
          onExpired();
        }
      },
    );

    return () => subscription.unsubscribe();
  } catch (err) {
    onError(err instanceof Error ? err : new Error('SESSION_MONITOR_FAILED'));
    return () => undefined;
  }
}