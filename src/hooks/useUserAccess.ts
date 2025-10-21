import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type UserTier = 'free' | 'vip1' | 'vip2' | 'vip3';

interface UserAccess {
  isAdmin: boolean;
  tier: UserTier;
  canAccessVIP1: boolean;
  canAccessVIP2: boolean;
  canAccessVIP3: boolean;
  loading: boolean;
}

export const useUserAccess = (): UserAccess => {
  const [access, setAccess] = useState<UserAccess>({
    isAdmin: false,
    tier: 'free',
    canAccessVIP1: false,
    canAccessVIP2: false,
    canAccessVIP3: false,
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
          tier: 'free',
          canAccessVIP1: false,
          canAccessVIP2: false,
          canAccessVIP3: false,
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
      const tier = (tierName.includes('vip1') ? 'vip1' : 
                   tierName.includes('vip2') ? 'vip2' : 
                   tierName.includes('vip3') ? 'vip3' : 'free') as UserTier;

      setAccess({
        isAdmin,
        tier: isAdmin ? 'vip3' : tier,
        canAccessVIP1: isAdmin || tier === 'vip1' || tier === 'vip2' || tier === 'vip3',
        canAccessVIP2: isAdmin || tier === 'vip2' || tier === 'vip3',
        canAccessVIP3: isAdmin || tier === 'vip3',
        loading: false,
      });
    } catch (error) {
      console.error('Error checking user access:', error);
      setAccess({
        isAdmin: false,
        tier: 'free',
        canAccessVIP1: false,
        canAccessVIP2: false,
        canAccessVIP3: false,
        loading: false,
      });
    }
  };

  return access;
};
