import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAdminLevel } from "@/hooks/useAdminLevel";
import {
  Users,
  CreditCard,
  KeyRound,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStats {
  totalUsers: number;
  activeSubscriptions: number;
  pendingPayments: number;
  activeAccessCodes: number;
  recentTransactions: number;
  pendingVerifications: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { adminInfo, getLevelLabel } = useAdminLevel();

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const [
        usersResult,
        subscriptionsResult,
        pendingPaymentsResult,
        accessCodesResult,
        recentTransactionsResult,
        pendingVerificationsResult,
      ] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("user_subscriptions").select("id", { count: "exact", head: true }).eq("status", "active"),
        supabase.from("bank_transfer_orders").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("access_codes").select("id", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("payment_transactions").select("id", { count: "exact", head: true }).gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
        supabase.from("payment_proof_submissions").select("id", { count: "exact", head: true }).eq("status", "pending"),
      ]);

      setStats({
        totalUsers: usersResult.count ?? 0,
        activeSubscriptions: subscriptionsResult.count ?? 0,
        pendingPayments: pendingPaymentsResult.count ?? 0,
        activeAccessCodes: accessCodesResult.count ?? 0,
        recentTransactions: recentTransactionsResult.count ?? 0,
        pendingVerifications: pendingVerificationsResult.count ?? 0,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      description: "Registered accounts",
      color: "text-blue-500",
    },
    {
      title: "Active Subscriptions",
      value: stats?.activeSubscriptions ?? 0,
      icon: CheckCircle2,
      description: "Currently active",
      color: "text-green-500",
    },
    {
      title: "Pending Payments",
      value: stats?.pendingPayments ?? 0,
      icon: Clock,
      description: "Awaiting approval",
      color: "text-yellow-500",
    },
    {
      title: "Active Access Codes",
      value: stats?.activeAccessCodes ?? 0,
      icon: KeyRound,
      description: "Available for redemption",
      color: "text-purple-500",
    },
    {
      title: "Recent Transactions",
      value: stats?.recentTransactions ?? 0,
      icon: TrendingUp,
      description: "Last 7 days",
      color: "text-cyan-500",
    },
    {
      title: "Pending Verifications",
      value: stats?.pendingVerifications ?? 0,
      icon: AlertCircle,
      description: "Needs review",
      color: "text-orange-500",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
          {adminInfo && (
            <p className="text-muted-foreground">
              Logged in as <span className="font-medium">{adminInfo.email}</span> •{" "}
              <span className="text-primary">{getLevelLabel(adminInfo.level)}</span>
            </p>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card key={card.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </CardTitle>
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-8 w-20" />
                  ) : (
                    <div className="text-2xl font-bold">{card.value.toLocaleString()}</div>
                  )}
                  <p className="text-xs text-muted-foreground">{card.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <a
                href="/admin/payment-verification"
                className="flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-accent"
              >
                <CreditCard className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Verify Payments</p>
                  <p className="text-sm text-muted-foreground">Review pending proofs</p>
                </div>
              </a>

              <a
                href="/admin/bank-transfers"
                className="flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-accent"
              >
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Bank Transfers</p>
                  <p className="text-sm text-muted-foreground">Approve pending transfers</p>
                </div>
              </a>

              <a
                href="/admin/access-codes"
                className="flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-accent"
              >
                <KeyRound className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Access Codes</p>
                  <p className="text-sm text-muted-foreground">Generate new codes</p>
                </div>
              </a>

              <a
                href="/admin/users"
                className="flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-accent"
              >
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Manage Users</p>
                  <p className="text-sm text-muted-foreground">View user accounts</p>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
