// src/pages/admin/AdminBillingDashboard.tsx

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CreditCard,
  DollarSign,
  Loader2,
  RefreshCw,
  TrendingDown,
  Users,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

import { supabase } from "@/integrations/supabase/client";

type SummaryMetrics = {
  mrr: number;
  active_subscribers: number;
  new_subscriptions_30d: number;
  canceled_subscriptions_30d: number;
  churn_rate_30d: number;
  past_due_count: number;
  trialing_count: number;
  cancel_at_period_end_count: number;
  arpu: number;
};

type ProviderBreakdownRow = {
  provider: string;
  active_subscriptions: number;
  active_users: number;
  mrr: number;
};

type DailySeriesRow = {
  date: string;
  new_subscriptions: number;
  cancellations: number;
};

type RecentChangeRow = {
  user_id: string | null;
  email: string | null;
  provider: string | null;
  provider_subscription_id: string | null;
  provider_customer_id: string | null;
  provider_price_id: string | null;
  provider_product_id: string | null;
  product_id: string | null;
  status: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean | null;
  canceled_at: string | null;
  ended_at: string | null;
  updated_at: string | null;
  created_at: string | null;
};

type RecentEventRow = {
  provider: string;
  event_type: string;
  event_id: string;
  user_id: string | null;
  created_at: string;
};

type BillingMetricsResponse = {
  generated_at: string;
  summary: SummaryMetrics;
  provider_breakdown: ProviderBreakdownRow[];
  daily_series_30d: DailySeriesRow[];
  recent_changes: RecentChangeRow[];
  recent_events: RecentEventRow[];
};

function formatMoney(value: number): string {
  if (!Number.isFinite(value)) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatPercent(value: number): string {
  if (!Number.isFinite(value)) return "0%";
  return `${value.toFixed(2)}%`;
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString();
}

function formatDateTime(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString();
}

function labelizeProvider(value: string | null | undefined): string {
  if (!value) return "Unknown";
  const normalized = value.toLowerCase();
  if (normalized === "stripe") return "Stripe";
  if (normalized === "apple") return "Apple";
  if (normalized === "google") return "Google";
  return value;
}

function truncateMiddle(value: string | null | undefined, max = 18): string {
  if (!value) return "—";
  if (value.length <= max) return value;
  const left = Math.ceil((max - 3) / 2);
  const right = Math.floor((max - 3) / 2);
  return `${value.slice(0, left)}...${value.slice(value.length - right)}`;
}

function StatusBadge({ status }: { status: string | null | undefined }) {
  const normalized = String(status ?? "").toLowerCase();

  const className =
    normalized === "active"
      ? "bg-green-100 text-green-800"
      : normalized === "trialing"
      ? "bg-blue-100 text-blue-800"
      : normalized === "past_due"
      ? "bg-yellow-100 text-yellow-800"
      : normalized === "grace_period"
      ? "bg-indigo-100 text-indigo-800"
      : normalized === "paused"
      ? "bg-orange-100 text-orange-800"
      : normalized === "expired" || normalized === "revoked"
      ? "bg-gray-200 text-gray-700"
      : "bg-gray-100 text-gray-700";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${className}`}
    >
      {status ?? "unknown"}
    </span>
  );
}

function StatCard(props: {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-medium text-slate-500">{props.title}</div>
        <div className="text-slate-400">{props.icon}</div>
      </div>
      <div className="text-2xl font-semibold text-slate-900">{props.value}</div>
      {props.subtitle ? (
        <div className="mt-2 text-sm text-slate-500">{props.subtitle}</div>
      ) : null}
    </div>
  );
}

export default function AdminBillingDashboard() {
  const [data, setData] = useState<BillingMetricsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [providerFilter, setProviderFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const loadMetrics = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      const { data: response, error: invokeError } = await supabase.functions
        .invoke("admin-billing-metrics", {
          body: {},
        });

      if (invokeError) {
        throw new Error(invokeError.message || "Failed to load billing metrics");
      }

      if (!response || typeof response !== "object") {
        throw new Error("Billing metrics response was empty");
      }

      setData(response as BillingMetricsResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadMetrics(false);
  }, [loadMetrics]);

  const filteredRecentChanges = useMemo(() => {
    if (!data) return [];

    return data.recent_changes.filter((row) => {
      const providerMatch =
        providerFilter === "all" || String(row.provider ?? "") === providerFilter;

      const statusMatch =
        statusFilter === "all" || String(row.status ?? "") === statusFilter;

      return providerMatch && statusMatch;
    });
  }, [data, providerFilter, statusFilter]);

  const availableProviders = useMemo(() => {
    if (!data) return [];
    return Array.from(
      new Set(
        data.recent_changes
          .map((row) => row.provider)
          .filter((value): value is string => typeof value === "string" && value.length > 0),
      ),
    );
  }, [data]);

  const availableStatuses = useMemo(() => {
    if (!data) return [];
    return Array.from(
      new Set(
        data.recent_changes
          .map((row) => row.status)
          .filter((value): value is string => typeof value === "string" && value.length > 0),
      ),
    );
  }, [data]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading billing dashboard...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <div className="mb-3 flex items-center gap-2 text-red-700">
            <AlertCircle className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Failed to load billing metrics</h2>
          </div>
          <p className="mb-4 text-sm text-red-700">{error ?? "Unknown error"}</p>
          <button
            type="button"
            onClick={() => void loadMetrics(false)}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const { summary } = data;

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">
            Admin Billing Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Generated at {formatDateTime(data.generated_at)}
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadMetrics(true)}
          disabled={refreshing}
          className="inline-flex items-center gap-2 rounded-xl border bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="MRR"
          value={formatMoney(summary.mrr)}
          subtitle="Estimated monthly recurring revenue"
          icon={<DollarSign className="h-5 w-5" />}
        />
        <StatCard
          title="Active Subscribers"
          value={String(summary.active_subscribers)}
          subtitle={`ARPU ${formatMoney(summary.arpu)}`}
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          title="30-Day Churn"
          value={formatPercent(summary.churn_rate_30d)}
          subtitle={`${summary.canceled_subscriptions_30d} canceled in last 30 days`}
          icon={<TrendingDown className="h-5 w-5" />}
        />
        <StatCard
          title="Past Due"
          value={String(summary.past_due_count)}
          subtitle={`${summary.cancel_at_period_end_count} set to cancel at period end`}
          icon={<CreditCard className="h-5 w-5" />}
        />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-900">
              New vs Canceled Subscriptions (30d)
            </h2>
            <p className="text-sm text-slate-500">
              Daily subscription flow across the last 30 days
            </p>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.daily_series_30d}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="new_subscriptions"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="cancellations"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Provider Breakdown
            </h2>
            <p className="text-sm text-slate-500">
              Active subscriptions and MRR by billing provider
            </p>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.provider_breakdown}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="provider" tickFormatter={labelizeProvider} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="active_subscriptions" name="Active Subs" />
                <Bar dataKey="mrr" name="MRR" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b text-left text-slate-500">
                  <th className="py-2 pr-4 font-medium">Provider</th>
                  <th className="py-2 pr-4 font-medium">Active Subs</th>
                  <th className="py-2 pr-4 font-medium">Active Users</th>
                  <th className="py-2 pr-4 font-medium">MRR</th>
                </tr>
              </thead>
              <tbody>
                {data.provider_breakdown.map((row) => (
                  <tr key={row.provider} className="border-b last:border-0">
                    <td className="py-2 pr-4">{labelizeProvider(row.provider)}</td>
                    <td className="py-2 pr-4">{row.active_subscriptions}</td>
                    <td className="py-2 pr-4">{row.active_users}</td>
                    <td className="py-2 pr-4">{formatMoney(row.mrr)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="text-sm text-slate-500">New Subs (30d)</div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">
            {summary.new_subscriptions_30d}
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="text-sm text-slate-500">Canceled (30d)</div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">
            {summary.canceled_subscriptions_30d}
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="text-sm text-slate-500">Trialing</div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">
            {summary.trialing_count}
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="text-sm text-slate-500">Cancel at Period End</div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">
            {summary.cancel_at_period_end_count}
          </div>
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Recent Subscription Changes
          </h2>
          <p className="text-sm text-slate-500">
            Latest canonical subscription state changes
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <select
            value={providerFilter}
            onChange={(e) => setProviderFilter(e.target.value)}
            className="rounded-xl border bg-white px-3 py-2 text-sm text-slate-700"
          >
            <option value="all">All providers</option>
            {availableProviders.map((provider) => (
              <option key={provider} value={provider}>
                {labelizeProvider(provider)}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border bg-white px-3 py-2 text-sm text-slate-700"
          >
            <option value="all">All statuses</option>
            {availableStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-8 overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="text-left text-slate-500">
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Provider</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Plan</th>
                <th className="px-4 py-3 font-medium">Period End</th>
                <th className="px-4 py-3 font-medium">Updated</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecentChanges.map((row) => (
                <tr key={`${row.provider_subscription_id}-${row.updated_at}`} className="border-t">
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">
                      {row.email ?? truncateMiddle(row.user_id, 20)}
                    </div>
                    <div className="text-xs text-slate-500">
                      {truncateMiddle(row.provider_subscription_id, 22)}
                    </div>
                  </td>
                  <td className="px-4 py-3">{labelizeProvider(row.provider)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-slate-900">
                      {row.provider_price_id ?? row.product_id ?? "—"}
                    </div>
                    {row.cancel_at_period_end ? (
                      <div className="text-xs text-amber-600">
                        Cancels at period end
                      </div>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">{formatDate(row.current_period_end)}</td>
                  <td className="px-4 py-3">{formatDateTime(row.updated_at)}</td>
                </tr>
              ))}

              {filteredRecentChanges.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    No subscription changes match the current filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Recent Billing Events</h2>
          <p className="text-sm text-slate-500">
            Recent entitlement events recorded by the billing system
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b text-left text-slate-500">
              <tr>
                <th className="py-2 pr-4 font-medium">Time</th>
                <th className="py-2 pr-4 font-medium">Provider</th>
                <th className="py-2 pr-4 font-medium">Event Type</th>
                <th className="py-2 pr-4 font-medium">User</th>
                <th className="py-2 pr-4 font-medium">Event ID</th>
              </tr>
            </thead>
            <tbody>
              {data.recent_events.map((row) => (
                <tr key={row.event_id} className="border-b last:border-0">
                  <td className="py-2 pr-4">{formatDateTime(row.created_at)}</td>
                  <td className="py-2 pr-4">{labelizeProvider(row.provider)}</td>
                  <td className="py-2 pr-4">{row.event_type}</td>
                  <td className="py-2 pr-4">{truncateMiddle(row.user_id, 20)}</td>
                  <td className="py-2 pr-4">{truncateMiddle(row.event_id, 26)}</td>
                </tr>
              ))}

              {data.recent_events.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-500">
                    No recent billing events found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}