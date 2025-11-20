import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type UserTier = 'demo' | 'free' | 'vip1' | 'vip2' | 'vip3' | 'vip3_ii' | 'vip4' | 'vip5';

export interface UserAccess {
  isAdmin: boolean;
  isAuthenticated: boolean;
  isDemoMode: boolean;
  tier: UserTier;
  canAccessVIP1: boolean;
  canAccessVIP2: boolean;
  canAccessVIP3: boolean;
  canAccessVIP3II: boolean;
  canAccessVIP4: boolean;
  canAccessVIP5: boolean;
  loading: boolean;
}

export const useUserAccess = (): UserAccess => {
  const [access, setAccess] = useState<UserAccess>({
    isAdmin: false,
    isAuthenticated: false,
    isDemoMode: true,
    tier: 'demo',
    canAccessVIP1: false,
    canAccessVIP2: false,
    canAccessVIP3: false,
    canAccessVIP3II: false,
    canAccessVIP4: false,
    canAccessVIP5: false,
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
          tier: 'demo',
          canAccessVIP1: false,
          canAccessVIP2: false,
          canAccessVIP3: false,
          canAccessVIP3II: false,
          canAccessVIP4: false,
          canAccessVIP5: false,
          loading: false,
        });
        return;
      }

      // Check admin status
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      const isAdmin = roles?.some(r => r.role === 'admin') || false;

      // Check subscription tier
      const { data: subscription } = await supabase
        .from('user_subscriptions')
        .select('*, subscription_tiers(*)')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      const tierName = subscription?.subscription_tiers?.name?.toLowerCase() || 'free';
      const tier = (tierName.includes('vip5') ? 'vip5' :
                   tierName.includes('vip4') ? 'vip4' :
                   tierName.includes('vip3 ii') || tierName.includes('vip3_ii') ? 'vip3_ii' :
                   tierName.includes('vip1') ? 'vip1' : 
                   tierName.includes('vip2') ? 'vip2' : 
                   tierName.includes('vip3') ? 'vip3' : 'free') as UserTier;

      setAccess({
        isAdmin,
        isAuthenticated: true,
        isDemoMode: false,
        tier: isAdmin ? 'vip5' : tier,
        canAccessVIP1: isAdmin || tier === 'vip1' || tier === 'vip2' || tier === 'vip3' || tier === 'vip3_ii' || tier === 'vip4' || tier === 'vip5',
        canAccessVIP2: isAdmin || tier === 'vip2' || tier === 'vip3' || tier === 'vip3_ii' || tier === 'vip4' || tier === 'vip5',
        canAccessVIP3: isAdmin || tier === 'vip3' || tier === 'vip3_ii' || tier === 'vip4' || tier === 'vip5',
        canAccessVIP3II: isAdmin || tier === 'vip3_ii' || tier === 'vip4' || tier === 'vip5',
        canAccessVIP4: isAdmin || tier === 'vip4' || tier === 'vip5',
        canAccessVIP5: isAdmin || tier === 'vip5',
        loading: false,
      });
    } catch (error) {
      console.error('Error checking user access:', error);
      setAccess({
        isAdmin: false,
        isAuthenticated: false,
        isDemoMode: true,
        tier: 'demo',
        canAccessVIP1: false,
        canAccessVIP2: false,
        canAccessVIP3: false,
        canAccessVIP3II: false,
        canAccessVIP4: false,
        canAccessVIP5: false,
        loading: false,
      });
    }
  };

  return access;
};
