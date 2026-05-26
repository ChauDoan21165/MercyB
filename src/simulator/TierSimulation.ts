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
  level0: {
    id: "sim-user-level0",
    email: "sim-level0@mercyblade.test",
    tier: "level0",
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

  level1: {
    id: "sim-user-level1",
    email: "sim-level1@mercyblade.test",
    tier: "level1",
    isAdmin: false,
    subscription: activeSubscription("level1"),
  },

  level2: {
    id: "sim-user-level2",
    email: "sim-level2@mercyblade.test",
    tier: "level2",
    isAdmin: false,
    subscription: activeSubscription("level2"),
  },

  level3: {
    id: "sim-user-level3",
    email: "sim-level3@mercyblade.test",
    tier: "level3",
    isAdmin: false,
    subscription: activeSubscription("level3"),
  },

  level4: {
    id: "sim-user-level4",
    email: "sim-level4@mercyblade.test",
    tier: "level4",
    isAdmin: false,
    subscription: activeSubscription("level4"),
  },

  level5: {
    id: "sim-user-level5",
    email: "sim-level5@mercyblade.test",
    tier: "level5",
    isAdmin: false,
    subscription: activeSubscription("level5"),
  },

  level6: {
    id: "sim-user-level6",
    email: "sim-level6@mercyblade.test",
    tier: "level6",
    isAdmin: false,
    subscription: activeSubscription("level6"),
  },

  level7: {
    id: "sim-user-level7",
    email: "sim-level7@mercyblade.test",
    tier: "level7",
    isAdmin: false,
    subscription: activeSubscription("level7"),
  },

  level8: {
    id: "sim-user-level8",
    email: "sim-level8@mercyblade.test",
    tier: "level8",
    isAdmin: false,
    subscription: activeSubscription("level8"),
  },

  level9: {
    id: "sim-user-level9",
    email: "sim-level9@mercyblade.test",
    tier: "level9",
    isAdmin: false,
    subscription: activeSubscription("level9"),
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
    tier: "level9",
    isAdmin: true,
    subscription: activeSubscription("level9"),
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