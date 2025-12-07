import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableRow, TableCell, TableBody, TableHead, TableHeader } from "@/components/ui/table";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AiControlPanel } from "@/components/admin/AiControlPanel";
import { Cpu, DollarSign, BarChart3, TrendingUp, Clock, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AIUsageRecord {
  id: string;
  user_id: string | null;
  model: string;
  tokens_input: number;
  tokens_output: number;
  cost_usd: number;
  status: string;
  endpoint: string | null;
  request_duration_ms: number | null;
  error_message: string | null;
  created_at: string;
}

interface UsageSummary {
  total_requests: number;
  total_tokens: number;
  total_cost: number;
  avg_tokens: number;
  avg_cost: number;
}

const AIUsage = () => {
  const [usage, setUsage] = useState<AIUsageRecord[]>([]);
  const [summary, setSummary] = useState<UsageSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch recent usage records
      const { data: usageData, error: usageError } = await supabase
        .from("ai_usage")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500);

      if (usageError) throw usageError;
      setUsage(usageData || []);

      // Fetch summary statistics
      const { data: summaryData, error: summaryError } = await supabase
        .rpc("get_ai_usage_summary");

      if (summaryError) throw summaryError;
      if (summaryData && summaryData.length > 0) {
        setSummary(summaryData[0]);
      }
    } catch (error) {
      console.error("Failed to fetch AI usage data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "default";
      case "error":
        return "destructive";
      case "timeout":
        return "secondary";
      default:
        return "outline";
    }
  };

  // Calculate breakdown by model
  const modelBreakdown = usage.reduce((acc, record) => {
    if (!acc[record.model]) {
      acc[record.model] = { count: 0, cost: 0, tokens: 0 };
    }
    acc[record.model].count += 1;
    acc[record.model].cost += Number(record.cost_usd);
    acc[record.model].tokens += record.tokens_input + record.tokens_output;
    return acc;
  }, {} as Record<string, { count: number; cost: number; tokens: number }>);

  const topModels = Object.entries(modelBreakdown)
    .sort((a, b) => b[1].cost - a[1].cost)
    .slice(0, 5);

  return (
    <AdminLayout>
      <div className="container mx-auto max-w-7xl px-4 py-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">AI Usage & Costs</h1>
          <p className="text-muted-foreground mt-1">
            Monitor AI model usage, tokens, and expenses
          </p>
        </div>

        {/* AI Control Panel - Global Toggle & Budget */}
        <AiControlPanel />

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Total Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "—" : (summary?.total_requests || usage.length).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Cpu className="h-4 w-4" />
                Total Tokens
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading
                  ? "—"
                  : (
                      summary?.total_tokens ||
                      usage.reduce(
                        (sum, r) => sum + r.tokens_input + r.tokens_output,
                        0
                      )
                    ).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Total Cost
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                $
                {loading
                  ? "—"
                  : (
                      summary?.total_cost ||
                      usage.reduce((sum, r) => sum + Number(r.cost_usd), 0)
                    ).toFixed(4)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Avg Tokens/Request
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading
                  ? "—"
                  : (summary?.avg_tokens || 0).toFixed(0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Avg Cost/Request
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${loading ? "—" : (summary?.avg_cost || 0).toFixed(4)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Model Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Top Models by Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topModels.map(([model, stats]) => (
                <div key={model} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium">{model}</div>
                    <div className="text-xs text-muted-foreground">
                      {stats.count} requests • {stats.tokens.toLocaleString()} tokens
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">${stats.cost.toFixed(4)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Usage Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5" />
              Recent AI Calls
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">
                Loading AI usage data...
              </div>
            ) : usage.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No AI usage data found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Model</TableHead>
                      <TableHead>Tokens</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead>Endpoint</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[140px]">Time</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {usage.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>
                          <div className="font-medium text-sm">{row.model}</div>
                        </TableCell>

                        <TableCell>
                          <div className="text-sm">
                            {(row.tokens_input + row.tokens_output).toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {row.tokens_input.toLocaleString()} in /{" "}
                            {row.tokens_output.toLocaleString()} out
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="font-medium">
                            ${Number(row.cost_usd).toFixed(5)}
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="text-sm">{row.endpoint || "—"}</div>
                        </TableCell>

                        <TableCell>
                          {row.request_duration_ms ? (
                            <div className="flex items-center gap-1 text-xs">
                              <Clock className="h-3 w-3" />
                              {row.request_duration_ms}ms
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </TableCell>

                        <TableCell>
                          <Badge variant={getStatusColor(row.status)}>
                            {row.status}
                          </Badge>
                          {row.error_message && (
                            <div className="flex items-center gap-1 mt-1 text-xs text-destructive">
                              <AlertCircle className="h-3 w-3" />
                              {row.error_message.slice(0, 30)}...
                            </div>
                          )}
                        </TableCell>

                        <TableCell>
                          <div className="text-xs text-muted-foreground">
                            {new Date(row.created_at).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(row.created_at).toLocaleTimeString()}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AIUsage;
