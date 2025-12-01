// Tier Simulation - Mock user tiers for testing

import type { TierId } from '@/lib/roomMaster/roomMasterTypes';

export interface MockUser {
  id: string;
  email: string;
  tier: TierId;
  isAdmin: boolean;
  subscription: {
    tier_id: string;
    status: string;
    current_period_start: string;
    current_period_end: string;
  } | null;
}

const MOCK_USERS: Record<TierId | 'admin', MockUser> = {
  free: {
    id: 'sim-user-free',
    email: 'sim-free@mercyblade.test',
    tier: 'free',
    isAdmin: false,
    subscription: null,
  },
  vip1: {
    id: 'sim-user-vip1',
    email: 'sim-vip1@mercyblade.test',
    tier: 'vip1',
    isAdmin: false,
    subscription: {
      tier_id: 'vip1',
      status: 'active',
      current_period_start: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      current_period_end: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    },
  },
  vip2: {
    id: 'sim-user-vip2',
    email: 'sim-vip2@mercyblade.test',
    tier: 'vip2',
    isAdmin: false,
    subscription: {
      tier_id: 'vip2',
      status: 'active',
      current_period_start: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      current_period_end: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    },
  },
  vip3: {
    id: 'sim-user-vip3',
    email: 'sim-vip3@mercyblade.test',
    tier: 'vip3',
    isAdmin: false,
    subscription: {
      tier_id: 'vip3',
      status: 'active',
      current_period_start: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      current_period_end: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    },
  },
  vip3ii: {
    id: 'sim-user-vip3ii',
    email: 'sim-vip3ii@mercyblade.test',
    tier: 'vip3ii',
    isAdmin: false,
    subscription: {
      tier_id: 'vip3ii',
      status: 'active',
      current_period_start: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      current_period_end: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    },
  },
  vip4: {
    id: 'sim-user-vip4',
    email: 'sim-vip4@mercyblade.test',
    tier: 'vip4',
    isAdmin: false,
    subscription: {
      tier_id: 'vip4',
      status: 'active',
      current_period_start: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      current_period_end: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    },
  },
  vip5: {
    id: 'sim-user-vip5',
    email: 'sim-vip5@mercyblade.test',
    tier: 'vip5',
    isAdmin: false,
    subscription: {
      tier_id: 'vip5',
      status: 'active',
      current_period_start: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      current_period_end: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    },
  },
  vip6: {
    id: 'sim-user-vip6',
    email: 'sim-vip6@mercyblade.test',
    tier: 'vip6',
    isAdmin: false,
    subscription: {
      tier_id: 'vip6',
      status: 'active',
      current_period_start: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      current_period_end: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    },
  },
  vip7: {
    id: 'sim-user-vip7',
    email: 'sim-vip7@mercyblade.test',
    tier: 'vip7',
    isAdmin: false,
    subscription: {
      tier_id: 'vip7',
      status: 'active',
      current_period_start: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      current_period_end: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    },
  },
  vip8: {
    id: 'sim-user-vip8',
    email: 'sim-vip8@mercyblade.test',
    tier: 'vip8',
    isAdmin: false,
    subscription: {
      tier_id: 'vip8',
      status: 'active',
      current_period_start: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      current_period_end: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    },
  },
  vip9: {
    id: 'sim-user-vip9',
    email: 'sim-vip9@mercyblade.test',
    tier: 'vip9',
    isAdmin: false,
    subscription: {
      tier_id: 'vip9',
      status: 'active',
      current_period_start: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      current_period_end: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    },
  },
  kids_1: {
    id: 'sim-user-kids1',
    email: 'sim-kids1@mercyblade.test',
    tier: 'kids_1',
    isAdmin: false,
    subscription: {
      tier_id: 'kids_1',
      status: 'active',
      current_period_start: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      current_period_end: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    },
  },
  kids_2: {
    id: 'sim-user-kids2',
    email: 'sim-kids2@mercyblade.test',
    tier: 'kids_2',
    isAdmin: false,
    subscription: {
      tier_id: 'kids_2',
      status: 'active',
      current_period_start: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      current_period_end: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    },
  },
  kids_3: {
    id: 'sim-user-kids3',
    email: 'sim-kids3@mercyblade.test',
    tier: 'kids_3',
    isAdmin: false,
    subscription: {
      tier_id: 'kids_3',
      status: 'active',
      current_period_start: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      current_period_end: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    },
  },
  admin: {
    id: 'sim-user-admin',
    email: 'sim-admin@mercyblade.test',
    tier: 'vip9',
    isAdmin: true,
    subscription: {
      tier_id: 'vip9',
      status: 'active',
      current_period_start: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      current_period_end: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    },
  },
};

export function mockTier(tierId: TierId | 'admin'): MockUser {
  return MOCK_USERS[tierId];
}

export function mockSupabaseAuth(user: MockUser) {
  // This would be used to mock Supabase client
  // In real implementation, you'd need to mock the actual Supabase client methods
  return {
    auth: {
      getUser: async () => ({
        data: {
          user: {
            id: user.id,
            email: user.email,
            user_metadata: {
              is_admin: user.isAdmin,
            },
          },
        },
        error: null,
      }),
    },
    from: (table: string) => {
      if (table === 'user_subscriptions') {
        return {
          select: () => ({
            eq: () => ({
              maybeSingle: async () => ({
                data: user.subscription,
                error: null,
              }),
            }),
          }),
        };
      }
      return {};
    },
  };
}
