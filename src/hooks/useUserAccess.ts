import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { type TierId, normalizeTier } from '@/lib/constants/tiers';
import { canAccessVIPTier } from '@/lib/accessControl';

export interface UserAccess {
  isAdmin: boolean;
  isHighAdmin: boolean; // Level >= 9 in admin_users
  adminLevel: number;
  isAuthenticated: boolean;
  isDemoMode: boolean;
  tier: TierId;
  canAccessVIP1: boolean;
  canAccessVIP2: boolean;
  canAccessVIP3: boolean;
  canAccessVIP3II: boolean;
  canAccessVIP4: boolean;
  canAccessVIP5: boolean;
  canAccessVIP6: boolean;
  canAccessVIP9: boolean;
  loading: boolean;
  isLoading: boolean; // Alias for loading (clearer name)
  canAccessTier: (tierId: TierId) => boolean; // Generic tier access check
}

export const useUserAccess = (): UserAccess => {
  const [access, setAccess] = useState<UserAccess>({
    isAdmin: false,
    isHighAdmin: false,
    adminLevel: 0,
    isAuthenticated: false,
    isDemoMode: true,
    tier: 'free',
    canAccessVIP1: false,
    canAccessVIP2: false,
    canAccessVIP3: false,
    canAccessVIP3II: false,
    canAccessVIP4: false,
    canAccessVIP5: false,
    canAccessVIP6: false,
    canAccessVIP9: false,
    loading: true,
    isLoading: true,
    canAccessTier: () => false, // Default to no access while loading
  });

  useEffect(() => {
    checkUserAccess();
  }, []);

  const checkUserAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        const guestAccess: UserAccess = {
          isAdmin: false,
          isHighAdmin: false,
          adminLevel: 0,
          isAuthenticated: false,
          isDemoMode: true,
          tier: 'free',
          canAccessVIP1: false,
          canAccessVIP2: false,
          canAccessVIP3: false,
          canAccessVIP3II: false,
          canAccessVIP4: false,
          canAccessVIP5: false,
          canAccessVIP6: false,
          canAccessVIP9: false,
          loading: false,
          isLoading: false,
          canAccessTier: (tierId: TierId) => tierId === 'free',
        };
        setAccess(guestAccess);
        return;
      }

      // Check admin status via has_role() RPC (user_roles table)
      const { data: isAdminRpc, error: adminError } = await supabase.rpc('has_role', {
        _role: 'admin',
        _user_id: user.id,
      });

      if (adminError) {
        console.error('Error checking admin role via has_role RPC:', adminError);
      }

      // ALSO check admin_users table for high-level admins (level >= 9)
      const { data: adminUserData } = await supabase
        .from('admin_users')
        .select('level')
        .eq('user_id', user.id)
        .maybeSingle();

      const adminLevel = adminUserData?.level || 0;
      const isHighAdmin = adminLevel >= 9;
      const isAdmin = !!isAdminRpc || isHighAdmin; // Either user_roles admin OR high-level admin_users

      console.log('[useUserAccess] Admin check:', { 
        userId: user.id, 
        isAdminRpc, 
        adminLevel, 
        isHighAdmin, 
        isAdmin 
      });

      // Check subscription tier
      const { data: subscription } = await supabase
        .from('user_subscriptions')
        .select('*, subscription_tiers(*)')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      const rawTierName = subscription?.subscription_tiers?.name || 'Free / Miễn phí';
      const tier: TierId = normalizeTier(rawTierName);
      
      // High-level admins (level >= 9) bypass all VIP gates
      const finalTier: TierId = isHighAdmin ? 'vip9' : (isAdmin ? 'vip9' : tier);

      // Generic access checker - single source of truth
      const canAccessTier = (targetTier: TierId): boolean => {
        // High-level admins can access everything
        if (isHighAdmin) return true;
        return canAccessVIPTier(finalTier, targetTier);
      };

      const authenticatedAccess: UserAccess = {
        isAdmin,
        isHighAdmin,
        adminLevel,
        isAuthenticated: true,
        isDemoMode: false,
        tier: finalTier,
        // Implement existing flags via canAccessTier for consistency
        canAccessVIP1: canAccessTier('vip1'),
        canAccessVIP2: canAccessTier('vip2'),
        canAccessVIP3: canAccessTier('vip3'),
        canAccessVIP3II: canAccessTier('vip3ii'),
        canAccessVIP4: canAccessTier('vip4'),
        canAccessVIP5: canAccessTier('vip5'),
        canAccessVIP6: canAccessTier('vip6'),
        canAccessVIP9: canAccessTier('vip9'),
        loading: false,
        isLoading: false,
        canAccessTier, // Expose generic helper
      };
      
      setAccess(authenticatedAccess);
    } catch (error) {
      console.error('Error checking user access:', error);
      const errorAccess: UserAccess = {
        isAdmin: false,
        isHighAdmin: false,
        adminLevel: 0,
        isAuthenticated: false,
        isDemoMode: true,
        tier: 'free',
        canAccessVIP1: false,
        canAccessVIP2: false,
        canAccessVIP3: false,
        canAccessVIP3II: false,
        canAccessVIP4: false,
        canAccessVIP5: false,
        canAccessVIP6: false,
        canAccessVIP9: false,
        loading: false,
        isLoading: false,
        canAccessTier: (tierId: TierId) => tierId === 'free',
      };
      setAccess(errorAccess);
    }
  };

  return access;
};