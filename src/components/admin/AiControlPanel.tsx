import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, DollarSign, Users, Zap, TrendingUp } from "lucide-react";

type AiDashboard = {
  is_ai_enabled: boolean;
  monthly_budget_usd: number;
  total_spent_usd: number;
  remaining_usd: number;
  total_calls: number;
  total_tokens: number;
  per_user: Record<string, number>;
  per_model: Record<string, { calls: number; tokens: number; cost: number }>;
};

export function AiControlPanel() {
  const [data, setData] = useState<AiDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [budgetInput, setBudgetInput] = useState("");

  async function load() {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Not authenticated");
        return;
      }

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-dashboard`,
        {
          headers: { 
            Authorization: `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          },
        }
      );
      
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to load');
      }
      
      const json = await res.json();
      setData(json);
      setBudgetInput(String(json.monthly_budget_usd));
    } catch (err) {
      console.error(err);
      toast.error("Failed to load AI dashboard");
    } finally {
      setLoading(false);
    }
  }

  async function save(partial: Partial<{ is_ai_enabled: boolean; monthly_budget_usd: number }>) {
    if (!data) return;
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-dashboard`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(partial),
        }
      );
      
      if (!res.ok) throw new Error('Failed to save');
      
      const json = await res.json();
      setData((prev) => (prev ? { ...prev, ...json } : prev));
      toast.success("Settings saved");
    } catch (err) {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="py-8 text-center text-muted-foreground">
          Failed to load AI dashboard
        </CardContent>
      </Card>
    );
  }

  const budgetUsedPercent = (data.total_spent_usd / data.monthly_budget_usd) * 100;
  const isOverBudget = data.remaining_usd < 0;

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-lg font-semibold">
          <span>AI Usage Control</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-normal text-muted-foreground">
              {data.is_ai_enabled ? "Enabled" : "Disabled"}
            </span>
            <Switch
              checked={data.is_ai_enabled}
              onCheckedChange={(val) => save({ is_ai_enabled: val })}
              disabled={saving}
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-border bg-background p-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span className="text-xs">Spent</span>
            </div>
            <div className="mt-1 text-xl font-bold">
              ${data.total_spent_usd.toFixed(2)}
            </div>
          </div>
          <div className="rounded-lg border border-border bg-background p-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs">Remaining</span>
            </div>
            <div className={`mt-1 text-xl font-bold ${isOverBudget ? 'text-destructive' : ''}`}>
              ${Math.abs(data.remaining_usd).toFixed(2)}
              {isOverBudget && " over"}
            </div>
          </div>
          <div className="rounded-lg border border-border bg-background p-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Zap className="h-4 w-4" />
              <span className="text-xs">API Calls</span>
            </div>
            <div className="mt-1 text-xl font-bold">
              {data.total_calls.toLocaleString()}
            </div>
          </div>
          <div className="rounded-lg border border-border bg-background p-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span className="text-xs">Users</span>
            </div>
            <div className="mt-1 text-xl font-bold">
              {Object.keys(data.per_user).length}
            </div>
          </div>
        </div>

        {/* Budget Progress */}
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span>Budget: ${data.monthly_budget_usd}/month</span>
            <span>{Math.min(budgetUsedPercent, 100).toFixed(0)}% used</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full transition-all ${isOverBudget ? 'bg-destructive' : budgetUsedPercent > 80 ? 'bg-yellow-500' : 'bg-primary'}`}
              style={{ width: `${Math.min(budgetUsedPercent, 100)}%` }}
            />
          </div>
        </div>

        {/* Budget Input */}
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={budgetInput}
            onChange={(e) => setBudgetInput(e.target.value)}
            className="w-28"
            min="0"
            step="10"
          />
          <Button
            size="sm"
            disabled={saving || Number(budgetInput) === data.monthly_budget_usd}
            onClick={() => save({ monthly_budget_usd: Number(budgetInput) })}
          >
            Update Budget
          </Button>
        </div>

        {/* Per Model Stats */}
        {Object.keys(data.per_model).length > 0 && (
          <div>
            <h4 className="mb-2 text-sm font-medium">Usage by Model</h4>
            <div className="space-y-1 text-xs">
              {Object.entries(data.per_model)
                .sort((a, b) => b[1].cost - a[1].cost)
                .map(([model, stats]) => (
                  <div key={model} className="flex justify-between text-muted-foreground">
                    <span className="font-mono">{model}</span>
                    <span>{stats.calls} calls · ${stats.cost.toFixed(4)}</span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
