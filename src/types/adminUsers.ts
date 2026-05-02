// PATH: src/types/adminUsers.ts

export type AdminUsersRow = {
  subscriptionId: string;
  userId: string;
  email: string;
  status: string;
  environment: string;
  planInterval: string;
  currencyCode: string;
  amountCents: number;
  quantity: number;
  createdAt: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  isAdmin: boolean;
  adminLevel: number;
  anomalyFlags: string[];
};

export type FreeUserRow = {
  userId: string;
  email: string;
  isAdmin: boolean;
  adminLevel: number;
};

export type AdminUsersKpis = {
  productionActiveCount: number;
  productionTrialCount: number;
  freeUsersCount: number;
  monthlyCount: number;
  yearlyCount: number;
  cancelingSoonCount: number;
  sandboxCount: number;
  filteredRows: number;
  estimatedMrr: number;
  estimatedArr: number;
  conversionPct: number;
  churnRiskPct: number;
  missingProfileCount: number;
  unknownEmailCount: number;
};

export type AdminUsersFiltersState = {
  search: string;
  environment: string;
  status: string;
  plan: string;
  admin: string;
  sort: string;
};

export type AdminUsersChartPoint = {
  name: string;
  value: number;
};

// User-first row, returned by the admin-list-registered-users edge
// function. Sourced from auth.users (NOT profiles) so signups missing a
// profile row (failed trigger, anonymous, legacy) still appear.
export type RegisteredUserSubscriptionStatus =
  | "active"
  | "trialing"
  | "free"
  | "unknown";

export type RegisteredUserRow = {
  id: string;
  email: string | null;
  createdAt: string;
  lastSignInAt: string | null;
  provider: string | null;
  hasProfile: boolean;
  isAdmin: boolean;
  subscriptionStatus: RegisteredUserSubscriptionStatus;
  currentPeriodEnd: string | null;
};