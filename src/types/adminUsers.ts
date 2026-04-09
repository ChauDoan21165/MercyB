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