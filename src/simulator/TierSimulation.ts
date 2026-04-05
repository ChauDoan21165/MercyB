// FILE: TierSimulation.ts
// PATH: src/simulator/TierSimulation.ts

import type { TierId } from "@/lib/constants/tiers";

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

function activeSubscription(tierId: TierId): NonNullable<MockUser["subscription"]> {
  return {
    tier_id: tierId,
    status: "active",
    current_period_start: new Date(
      Date.now() - 10 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    current_period_end: new Date(
      Date.now() + 20 * 24 * 60 * 60 * 1000,
    ).toISOString(),
  };
}

const MOCK_USERS: Record<TierId | "admin", MockUser> = {
  free: {
    id: "sim-user-free",
    email: "sim-free@mercyblade.test",
    tier: "free",
    isAdmin: false,
    subscription: null,
  },

  premium_month: {
    id: "sim-user-premium-month",
    email: "sim-premium-month@mercyblade.test",
    tier: "premium_month",
    isAdmin: false,
    subscription: activeSubscription("premium_month"),
  },

  premium_year: {
    id: "sim-user-premium-year",
    email: "sim-premium-year@mercyblade.test",
    tier: "premium_year",
    isAdmin: false,
    subscription: activeSubscription("premium_year"),
  },

  vip1: {
    id: "sim-user-vip1",
    email: "sim-vip1@mercyblade.test",
    tier: "vip1",
    isAdmin: false,
    subscription: activeSubscription("vip1"),
  },

  vip2: {
    id: "sim-user-vip2",
    email: "sim-vip2@mercyblade.test",
    tier: "vip2",
    isAdmin: false,
    subscription: activeSubscription("vip2"),
  },

  vip3: {
    id: "sim-user-vip3",
    email: "sim-vip3@mercyblade.test",
    tier: "vip3",
    isAdmin: false,
    subscription: activeSubscription("vip3"),
  },

  vip4: {
    id: "sim-user-vip4",
    email: "sim-vip4@mercyblade.test",
    tier: "vip4",
    isAdmin: false,
    subscription: activeSubscription("vip4"),
  },

  vip5: {
    id: "sim-user-vip5",
    email: "sim-vip5@mercyblade.test",
    tier: "vip5",
    isAdmin: false,
    subscription: activeSubscription("vip5"),
  },

  vip6: {
    id: "sim-user-vip6",
    email: "sim-vip6@mercyblade.test",
    tier: "vip6",
    isAdmin: false,
    subscription: activeSubscription("vip6"),
  },

  vip7: {
    id: "sim-user-vip7",
    email: "sim-vip7@mercyblade.test",
    tier: "vip7",
    isAdmin: false,
    subscription: activeSubscription("vip7"),
  },

  vip8: {
    id: "sim-user-vip8",
    email: "sim-vip8@mercyblade.test",
    tier: "vip8",
    isAdmin: false,
    subscription: activeSubscription("vip8"),
  },

  vip9: {
    id: "sim-user-vip9",
    email: "sim-vip9@mercyblade.test",
    tier: "vip9",
    isAdmin: false,
    subscription: activeSubscription("vip9"),
  },

  kids_1: {
    id: "sim-user-kids1",
    email: "sim-kids1@mercyblade.test",
    tier: "kids_1",
    isAdmin: false,
    subscription: activeSubscription("kids_1"),
  },

  kids_2: {
    id: "sim-user-kids2",
    email: "sim-kids2@mercyblade.test",
    tier: "kids_2",
    isAdmin: false,
    subscription: activeSubscription("kids_2"),
  },

  kids_3: {
    id: "sim-user-kids3",
    email: "sim-kids3@mercyblade.test",
    tier: "kids_3",
    isAdmin: false,
    subscription: activeSubscription("kids_3"),
  },

  admin: {
    id: "sim-user-admin",
    email: "sim-admin@mercyblade.test",
    tier: "vip9",
    isAdmin: true,
    subscription: activeSubscription("vip9"),
  },
};

export function mockTier(tierId: TierId | "admin"): MockUser {
  return MOCK_USERS[tierId];
}

export function mockSupabaseAuth(user: MockUser) {
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
      if (table === "user_subscriptions") {
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