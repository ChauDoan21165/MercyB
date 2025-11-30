import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { type TierId, normalizeTier } from '@/lib/constants/tiers';
import { canAccessVIPTier } from '@/lib/accessControl';

export interface UserAccess {
  isAdmin: boolean;
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
}

export const useUserAccess = (): UserAccess => {
  const [access, setAccess] = useState<UserAccess>({
    isAdmin: false,
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
  });

  useEffect(() => {
    checkUserAccess();
  }, []);

  const checkUserAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setAccess({
          isAdmin: false,
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
        });
        return;
      }

      // Check admin status via has_role() RPC to stay consistent with AdminRoute
      const { data: isAdminRpc, error: adminError } = await supabase.rpc('has_role', {
        _role: 'admin',
        _user_id: user.id,
      });

      if (adminError) {
        console.error('Error checking admin role via has_role RPC:', adminError);
      }

      const isAdmin = !!isAdminRpc;

      // Check subscription tier
      const { data: subscription } = await supabase
        .from('user_subscriptions')
        .select('*, subscription_tiers(*)')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      const rawTierName = subscription?.subscription_tiers?.name || 'Free / Miễn phí';
      const tier: TierId = normalizeTier(rawTierName);
      const finalTier: TierId = isAdmin ? 'vip9' : tier;

      setAccess({
        isAdmin,
        isAuthenticated: true,
        isDemoMode: false,
        tier: finalTier,
        canAccessVIP1: canAccessVIPTier(finalTier, 'vip1'),
        canAccessVIP2: canAccessVIPTier(finalTier, 'vip2'),
        canAccessVIP3: canAccessVIPTier(finalTier, 'vip3'),
        canAccessVIP3II: canAccessVIPTier(finalTier, 'vip3ii'),
        canAccessVIP4: canAccessVIPTier(finalTier, 'vip4'),
        canAccessVIP5: canAccessVIPTier(finalTier, 'vip5'),
        canAccessVIP6: canAccessVIPTier(finalTier, 'vip6'),
        canAccessVIP9: canAccessVIPTier(finalTier, 'vip9'),
        loading: false,
      });
    } catch (error) {
      console.error('Error checking user access:', error);
      setAccess({
        isAdmin: false,
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
      });
    }
  };

  return access;
};
