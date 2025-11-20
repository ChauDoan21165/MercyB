import { supabase } from '@/integrations/supabase/client';

// Get user's IP address (best effort)
export const getUserIP = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch {
    return 'unknown';
  }
};

// Log security event
export const logSecurityEvent = async (
  eventType: string,
  severity: 'low' | 'medium' | 'high' | 'critical',
  metadata?: any
) => {
  const ipAddress = await getUserIP();
  const userAgent = navigator.userAgent;
  
  const { data: { user } } = await supabase.auth.getUser();
  
  await supabase.rpc('log_security_event', {
    _user_id: user?.id || null,
    _event_type: eventType,
    _severity: severity,
    _ip_address: ipAddress,
    _user_agent: userAgent,
    _metadata: metadata || {}
  });
};

// Track login attempt
export const trackLoginAttempt = async (
  email: string,
  success: boolean,
  failureReason?: string
) => {
  const ipAddress = await getUserIP();
  const userAgent = navigator.userAgent;
  
  await supabase.from('login_attempts').insert({
    email,
    ip_address: ipAddress,
    user_agent: userAgent,
    success,
    failure_reason: failureReason
  });
};

// Check if user is blocked
export const checkUserBlocked = async (email: string): Promise<boolean> => {
  const { data, error } = await supabase.rpc('is_user_blocked', {
    user_email: email
  });
  
  if (error) {
    console.error('Error checking if user is blocked:', error);
    return false;
  }
  
  return data || false;
};

// Check rate limit
export const checkRateLimit = async (email: string): Promise<boolean> => {
  const ipAddress = await getUserIP();
  
  const { data, error } = await supabase.rpc('check_rate_limit', {
    check_email: email,
    check_ip: ipAddress,
    time_window_minutes: 15,
    max_attempts: 5
  });
  
  if (error) {
    console.error('Error checking rate limit:', error);
    return false;
  }
  
  return data || false;
};

// Admin: Get security dashboard data
export const getSecurityDashboard = async () => {
  // Get recent login attempts
  const { data: recentAttempts } = await supabase
    .from('login_attempts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);
  
  // Get failed login attempts in last 24h
  const { data: recentFailures } = await supabase
    .from('login_attempts')
    .select('*')
    .eq('success', false)
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    .order('created_at', { ascending: false });
  
  // Get security events
  const { data: securityEvents } = await supabase
    .from('security_events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);
  
  // Get blocked users
  const { data: blockedUsers } = await supabase
    .from('user_security_status')
    .select('*, profiles(email, full_name)')
    .eq('is_blocked', true)
    .order('blocked_at', { ascending: false });
  
  // Get users with suspicious activity
  const { data: suspiciousUsers } = await supabase
    .from('user_security_status')
    .select('*, profiles(email, full_name)')
    .gte('suspicious_activity_count', 3)
    .order('suspicious_activity_count', { ascending: false })
    .limit(50);
  
  // Get all active sessions
  const { data: activeSessions } = await supabase
    .from('user_sessions')
    .select('*, profiles(email, full_name)')
    .gte('last_activity', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    .order('last_activity', { ascending: false });
  
  return {
    recentAttempts: recentAttempts || [],
    recentFailures: recentFailures || [],
    securityEvents: securityEvents || [],
    blockedUsers: blockedUsers || [],
    suspiciousUsers: suspiciousUsers || [],
    activeSessions: activeSessions || []
  };
};

// Admin: Block user
export const blockUser = async (
  userId: string,
  reason: string
) => {
  const { data: { user: admin } } = await supabase.auth.getUser();
  
  const { error } = await supabase
    .from('user_security_status')
    .upsert({
      user_id: userId,
      is_blocked: true,
      blocked_reason: reason,
      blocked_at: new Date().toISOString(),
      blocked_by: admin?.id
    }, {
      onConflict: 'user_id'
    });
  
  if (error) throw error;
  
  // Log security event
  await logSecurityEvent('user_blocked', 'high', {
    blocked_user_id: userId,
    reason
  });
  
  // Revoke all sessions for the user
  await supabase
    .from('user_sessions')
    .delete()
    .eq('user_id', userId);
};

// Admin: Unblock user
export const unblockUser = async (userId: string) => {
  const { error } = await supabase
    .from('user_security_status')
    .update({
      is_blocked: false,
      blocked_reason: null,
      blocked_at: null,
      blocked_by: null
    })
    .eq('user_id', userId);
  
  if (error) throw error;
  
  await logSecurityEvent('user_unblocked', 'medium', {
    unblocked_user_id: userId
  });
};

// Admin: Revoke all user sessions
export const revokeUserSessions = async (userId: string) => {
  const { error } = await supabase
    .from('user_sessions')
    .delete()
    .eq('user_id', userId);
  
  if (error) throw error;
  
  await logSecurityEvent('sessions_revoked', 'high', {
    target_user_id: userId
  });
};

// Admin: Invalidate user's access codes
export const invalidateUserAccessCodes = async (userId: string) => {
  const { error } = await supabase
    .from('access_codes')
    .update({ is_active: false })
    .eq('for_user_id', userId);
  
  if (error) throw error;
  
  await logSecurityEvent('access_codes_invalidated', 'high', {
    target_user_id: userId
  });
};

// Admin: Downgrade user tier
export const downgradeUserTier = async (userId: string) => {
  // Get free tier
  const { data: freeTier } = await supabase
    .from('subscription_tiers')
    .select('id')
    .eq('name', 'Free')
    .single();
  
  if (!freeTier) throw new Error('Free tier not found');
  
  // Update subscription
  const { error } = await supabase
    .from('user_subscriptions')
    .update({
      tier_id: freeTier.id,
      status: 'active'
    })
    .eq('user_id', userId);
  
  if (error) throw error;
  
  await logSecurityEvent('user_downgraded', 'high', {
    target_user_id: userId
  });
};

// Detect suspicious patterns
export const detectSuspiciousActivity = (
  loginAttempts: any[],
  userId: string
): boolean => {
  // Multiple failed attempts from different IPs
  const uniqueIPs = new Set(
    loginAttempts
      .filter(a => !a.success)
      .map(a => a.ip_address)
  ).size;
  
  if (uniqueIPs > 3) return true;
  
  // Multiple failed attempts in short time
  const recentFailures = loginAttempts.filter(
    a => !a.success && 
    new Date(a.created_at).getTime() > Date.now() - 5 * 60 * 1000
  );
  
  if (recentFailures.length > 5) return true;
  
  return false;
};
