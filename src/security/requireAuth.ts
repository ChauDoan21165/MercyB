// Multi-Layer Auth Guards - Enforce authentication at multiple layers

import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

export interface AuthContext {
  user: User;
  isAdmin: boolean;
  isModerator: boolean;
}

/**
 * Require authentication for API routes
 */
export async function requireAuthApi(req: Request): Promise<AuthContext> {
  const authHeader = req.headers.get('Authorization');
  
  if (!authHeader) {
    throw new Response('Unauthorized', { status: 401 });
  }

  const token = authHeader.replace('Bearer ', '');
  
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    throw new Response('Unauthorized', { status: 401 });
  }

  // Check roles
  const { data: roles } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id);

  const isAdmin = roles?.some(r => r.role === 'admin') || false;
  const isModerator = roles?.some(r => r.role === 'moderator') || false;

  return { user, isAdmin, isModerator };
}

/**
 * Require authentication for client-side routes
 */
export async function requireAuth(): Promise<AuthContext> {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    throw new Error('AUTHENTICATION_REQUIRED');
  }

  // Check roles
  const { data: roles } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id);

  const isAdmin = roles?.some(r => r.role === 'admin') || false;
  const isModerator = roles?.some(r => r.role === 'moderator') || false;

  return { user, isAdmin, isModerator };
}

/**
 * Require admin role
 */
export async function requireAdmin(): Promise<AuthContext> {
  const auth = await requireAuth();
  
  if (!auth.isAdmin) {
    throw new Error('ADMIN_ACCESS_REQUIRED');
  }
  
  return auth;
}

/**
 * Require moderator or admin role
 */
export async function requireModerator(): Promise<AuthContext> {
  const auth = await requireAuth();
  
  if (!auth.isAdmin && !auth.isModerator) {
    throw new Error('MODERATOR_ACCESS_REQUIRED');
  }
  
  return auth;
}
