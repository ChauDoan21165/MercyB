// supabase/functions/admin-billing-metrics/index.ts
// deno-lint-ignore-file no-explicit-any

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type BillingProvider = "stripe" | "apple" | "google";

type SubscriptionStatus =
  | "active"
  | "trialing"
  | "grace_period"
  | "past_due"
  | "paused"
  | "expired"
  | "revoked";

type Database = {
  public: {
    Views: {
      billing_mrr_inputs_v: {
        Row: {
          user_id: string | null;
          provider: BillingProvider | null;
          provider_subscription_id: string | null;
          provider_price_id: string | null;
          provider_product_id: string | null;
          product_id: string | null;
          status: SubscriptionStatus | null;
          current_period_start: string | null;
          current_period_end: string | null;
          cancel_at_period_end: boolean | null;
          mapped_monthly_amount: number | null;
        };
      };
      billing_recent_subscription_changes_v: {
        Row: {
          user_id: string | null;
          email: string | null;
          provider: BillingProvider | null;
          provider_subscription_id: string | null;
          provider_customer_id: string | null;
          provider_price_id: string | null;
          provider_product_id: string | null;
          product_id: string | null;
          status: SubscriptionStatus | null;
          current_period_start: string | null;
          current_period_end: string | null;
          cancel_at_period_end: boolean | null;
          canceled_at: string | null;
          ended_at: string | null;
          updated_at: string | null;
          created_at: string | null;
        };
      };
    };
    Tables: {
      subscriptions: {
        Row: {
          user_id: string;
          status: SubscriptionStatus;
          created_at: string | null;
          updated_at: string | null;
          ended_at: string | null;
          current_period_end: string | null;
          provider: BillingProvider;
          provider_price_id: string | null;
          product_id: string | null;
        };
      };
      entitlement_events: {
        Row: {
          provider: BillingProvider;
          event_type: string;
          event_id: string;
          user_id: string | null;
          created_at: string;
        };
      };
    };
  };
};

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function env(name: string): string {
  return (Deno.env.get(name) ?? "").trim();
}

function safeNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function startOfDayUtc(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

function isoDaysAgo(days: number): string {
  const d = startOfDayUtc(new Date());
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString();
}

function toDateKey(value: string | null | undefined): string | null {
  if (!value || typeof value !== "string") return null;
  return value.slice(0, 10);
}

function isRevenueBearingStatus(status: unknown): boolean {
  return (
    status === "active" ||
    status === "trialing" ||
    status === "grace_period" ||
    status === "past_due"
  );
}

function isInactiveStatus(status: unknown): boolean {
  return status === "expired" || status === "revoked";
}

function uniqueCount(values: Array<string | null | undefined>): number {
  return new Set(values.filter((v): v is string => typeof v === "string" && v.length > 0))
    .size;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "GET" && req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const supabaseUrl = env("PROJECT_SUPABASE_URL") || env("SUPABASE_URL");
  const serviceRoleKey =
    env("PROJECT_SUPABASE_SERVICE_ROLE_KEY") || env("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    return json({ error: "Missing Supabase configuration" }, 500);
  }

  const supabase = createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  try {
    const nowIso = new Date().toISOString();
    const last30dIso = isoDaysAgo(30);
    const last60dIso = isoDaysAgo(60);

    const [
      mrrInputsRes,
      subscriptionsRes,
      recentChangesRes,
      recentEventsRes,
    ] = await Promise.all([
      supabase.from("billing_mrr_inputs_v").select("*"),
      supabase
        .from("subscriptions")
        .select(
          "user_id,status,created_at,updated_at,ended_at,current_period_end,provider,provider_price_id,product_id",
        ),
      supabase
        .from("billing_recent_subscription_changes_v")
        .select("*")
        .limit(25),
      supabase
        .from("entitlement_events")
        .select("provider,event_type,event_id,user_id,created_at")
        .gte("created_at", last60dIso)
        .order("created_at", { ascending: false })
        .limit(500),
    ]);

    if (mrrInputsRes.error) {
      throw new Error(`billing_mrr_inputs_v: ${mrrInputsRes.error.message}`);
    }
    if (subscriptionsRes.error) {
      throw new Error(`subscriptions: ${subscriptionsRes.error.message}`);
    }
    if (recentChangesRes.error) {
      throw new Error(
        `billing_recent_subscription_changes_v: ${recentChangesRes.error.message}`,
      );
    }
    if (recentEventsRes.error) {
      throw new Error(`entitlement_events: ${recentEventsRes.error.message}`);
    }

    const mrrInputs = mrrInputsRes.data ?? [];
    const subscriptions = subscriptionsRes.data ?? [];
    const recentChanges = recentChangesRes.data ?? [];
    const recentEvents = recentEventsRes.data ?? [];

    const mrr = mrrInputs.reduce((sum, row) => {
      return sum + safeNumber(row.mapped_monthly_amount, 0);
    }, 0);

    const activeSubscribers = uniqueCount(
      mrrInputs.map((row) => row.user_id ?? null),
    );

    const trialingCount = mrrInputs.filter((row) => row.status === "trialing")
      .length;

    const pastDueCount = mrrInputs.filter((row) => row.status === "past_due")
      .length;

    const cancelAtPeriodEndCount = mrrInputs.filter(
      (row) => row.cancel_at_period_end === true,
    ).length;

    const newSubscriptions30d = subscriptions.filter((row) => {
      return !!row.created_at && row.created_at >= last30dIso;
    }).length;

    const canceledSubscriptions30d = subscriptions.filter((row) => {
      return (
        isInactiveStatus(row.status) &&
        !!row.ended_at &&
        row.ended_at >= last30dIso
      );
    }).length;

    const activeBaseForChurn30d = subscriptions.filter((row) => {
      return (
        isRevenueBearingStatus(row.status) ||
        (!!row.current_period_end && row.current_period_end >= last30dIso)
      );
    }).length;

    const churnRate30d = activeBaseForChurn30d > 0
      ? Number(
        ((canceledSubscriptions30d / activeBaseForChurn30d) * 100).toFixed(2),
      )
      : 0;

    const arpu = activeSubscribers > 0
      ? Number((mrr / activeSubscribers).toFixed(2))
      : 0;

    const providerBreakdownMap = new Map<
      string,
      {
        provider: string;
        active_subscriptions: number;
        active_users: Set<string>;
        mrr: number;
      }
    >();

    for (const row of mrrInputs) {
      const provider = row.provider ?? "unknown";
      if (!providerBreakdownMap.has(provider)) {
        providerBreakdownMap.set(provider, {
          provider,
          active_subscriptions: 0,
          active_users: new Set<string>(),
          mrr: 0,
        });
      }

      const entry = providerBreakdownMap.get(provider)!;
      entry.active_subscriptions += 1;
      if (row.user_id) entry.active_users.add(row.user_id);
      entry.mrr += safeNumber(row.mapped_monthly_amount, 0);
    }

    const providerBreakdown = Array.from(providerBreakdownMap.values()).map(
      (entry) => ({
        provider: entry.provider,
        active_subscriptions: entry.active_subscriptions,
        active_users: entry.active_users.size,
        mrr: Number(entry.mrr.toFixed(2)),
      }),
    );

    const dailySeriesMap = new Map<
      string,
      {
        date: string;
        new_subscriptions: number;
        cancellations: number;
      }
    >();

    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setUTCDate(d.getUTCDate() - i);
      const key = d.toISOString().slice(0, 10);
      dailySeriesMap.set(key, {
        date: key,
        new_subscriptions: 0,
        cancellations: 0,
      });
    }

    for (const row of subscriptions) {
      const createdKey = toDateKey(row.created_at);
      if (createdKey && dailySeriesMap.has(createdKey)) {
        dailySeriesMap.get(createdKey)!.new_subscriptions += 1;
      }

      const endedKey = toDateKey(row.ended_at);
      if (
        endedKey &&
        dailySeriesMap.has(endedKey) &&
        isInactiveStatus(row.status)
      ) {
        dailySeriesMap.get(endedKey)!.cancellations += 1;
      }
    }

    const dailySeries30d = Array.from(dailySeriesMap.values());

    return json({
      generated_at: nowIso,
      summary: {
        mrr: Number(mrr.toFixed(2)),
        active_subscribers: activeSubscribers,
        new_subscriptions_30d: newSubscriptions30d,
        canceled_subscriptions_30d: canceledSubscriptions30d,
        churn_rate_30d: churnRate30d,
        past_due_count: pastDueCount,
        trialing_count: trialingCount,
        cancel_at_period_end_count: cancelAtPeriodEndCount,
        arpu: arpu,
      },
      provider_breakdown: providerBreakdown,
      daily_series_30d: dailySeries30d,
      recent_changes: recentChanges,
      recent_events: recentEvents.slice(0, 50),
    });
  } catch (error) {
    console.error("[admin-billing-metrics] error:", error);
    return json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});