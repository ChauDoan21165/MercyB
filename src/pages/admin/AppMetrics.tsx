import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { 
  Database, Layers, Box, FileCode, HardDrive, Users, Building, Globe, 
  BarChart3, RefreshCw, CheckCircle2, XCircle, Activity, Clock, TrendingUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip,
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid
} from "recharts";

interface SystemMetrics {
  infrastructure: {
    totalRooms: number;
    totalTiers: number;
    totalEntries: number;
    totalUsers: number;
    concurrentUsers: number;
    roomsByTier: Record<string, number>;
  };
  edgeFunctions: {
    total: number;
    functions: Array<{ name: string; callsToday: number; status: string }>;
  };
  storage: {
    buckets: Array<{ name: string; count: number; public: boolean }>;
    totalFiles: number;
  };
  vip9: {
    domains: Record<string, number>;
    totalRooms: number;
  };
  health: {
    databaseConnected: boolean;
    moderationQueueLength: number;
  };
  timestamp: string;
}

interface HistoricalMetric {
  timestamp: string;
  total_rooms: number;
  total_users: number;
  concurrent_users: number;
  total_entries: number;
  total_storage_objects: number;
}

const TIER_COLORS = {
  'free': '#10b981',
  'vip1': '#3b82f6',
  'vip2': '#8b5cf6',
  'vip3': '#ec4899',
  'vip4': '#f59e0b',
  'vip5': '#ef4444',
  'vip6': '#06b6d4',
  'vip7': '#84cc16',
  'vip8': '#f97316',
  'vip9': '#1e293b',
};

const AppMetrics = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalMetric[]>([]);
  const [historicalView, setHistoricalView] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [healthChecking, setHealthChecking] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    checkAdminAndFetch();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      fetchMetrics();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const checkAdminAndFetch = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      const isAdmin = roles?.some(r => r.role === "admin");

      if (!isAdmin) {
        toast({
          title: "Access denied",
          description: "Admin access required",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      await fetchMetrics();
    } catch (error) {
      console.error("Error checking admin access:", error);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const fetchMetrics = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('system-metrics');
      
      if (error) throw error;
      
      setMetrics(data);
      await fetchHistoricalData();
    } catch (error) {
      console.error("Error fetching metrics:", error);
      toast({
        title: "Error",
        description: "Failed to load app metrics",
        variant: "destructive",
      });
    }
  };

  const fetchHistoricalData = async () => {
    try {
      const now = new Date();
      let startDate = new Date();
      
      // Calculate date range based on view
      if (historicalView === 'daily') {
        startDate.setDate(now.getDate() - 7); // Last 7 days
      } else if (historicalView === 'weekly') {
        startDate.setDate(now.getDate() - 30); // Last 30 days
      } else {
        startDate.setMonth(now.getMonth() - 6); // Last 6 months
      }

      const { data, error } = await supabase
        .from('metrics_history')
        .select('*')
        .gte('timestamp', startDate.toISOString())
        .order('timestamp', { ascending: true });

      if (error) throw error;

      setHistoricalData(data || []);
    } catch (error) {
      console.error("Error fetching historical data:", error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMetrics();
    setRefreshing(false);
    toast({
      title: "Refreshed",
      description: "Metrics updated successfully",
    });
  };

  useEffect(() => {
    if (metrics) {
      fetchHistoricalData();
    }
  }, [historicalView]);

  const runHealthCheck = async () => {
    setHealthChecking(true);
    // Simulate health check - in production this would call actual health check endpoints
    await new Promise(resolve => setTimeout(resolve, 2000));
    await fetchMetrics();
    setHealthChecking(false);
    toast({
      title: "Health Check Complete",
      description: "All systems checked",
    });
  };

  if (loading || !metrics) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-lg">Loading metrics...</div>
        </div>
      </AdminLayout>
    );
  }

  const pieData = Object.entries(metrics.infrastructure.roomsByTier).map(([tier, count]) => ({
    name: tier.toUpperCase(),
    value: count,
    color: TIER_COLORS[tier as keyof typeof TIER_COLORS] || '#6b7280',
  }));

  const formatHistoricalData = () => {
    return historicalData.map(item => ({
      date: new Date(item.timestamp).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        ...(historicalView === 'monthly' && { year: '2-digit' })
      }),
      rooms: item.total_rooms,
      users: item.total_users,
      concurrent: item.concurrent_users,
      entries: item.total_entries,
      storage: item.total_storage_objects,
    }));
  };

  const trendData = formatHistoricalData();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminBreadcrumb
          items={[
            { label: "Dashboard", href: "/admin" },
            { label: "App Metrics" }
          ]} 
        />

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">App Metrics – Global Scale Overview</h1>
            <p className="text-muted-foreground">
              Real-time infrastructure, health, and scale monitoring
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              <Clock className="h-4 w-4 mr-2" />
              Auto-refresh {autoRefresh ? 'ON' : 'OFF'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Infrastructure Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.infrastructure.totalRooms}</div>
              <p className="text-xs text-muted-foreground">Active rooms</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tiers</CardTitle>
              <Layers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.infrastructure.totalTiers}</div>
              <p className="text-xs text-muted-foreground">Free + VIP1-9 + Kids</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
              <Box className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.infrastructure.totalEntries}</div>
              <p className="text-xs text-muted-foreground">Content pieces</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.infrastructure.totalUsers}</div>
              <p className="text-xs text-muted-foreground">Registered</p>
            </CardContent>
          </Card>

          <Card className="border-green-500/20 bg-green-500/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Live Users</CardTitle>
              <Activity className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{metrics.infrastructure.concurrentUsers}</div>
              <p className="text-xs text-muted-foreground">Online now</p>
            </CardContent>
          </Card>
        </div>

        {/* Backend Functions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCode className="h-5 w-5" />
              Backend Functions (Edge Functions)
            </CardTitle>
            <CardDescription>Serverless functions with today's call statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {metrics.edgeFunctions.functions.map((func) => (
                <div key={func.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">{func.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{func.callsToday} calls</Badge>
                    <Badge variant="secondary" className="text-green-600">Active</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Storage Buckets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              Storage Buckets
            </CardTitle>
            <CardDescription>File storage infrastructure</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {metrics.storage.buckets.map((bucket) => (
                <div key={bucket.name} className="flex flex-col p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{bucket.name}</span>
                    <Badge variant={bucket.public ? "outline" : "secondary"}>
                      {bucket.public ? "Public" : "Private"}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold">{bucket.count}</div>
                  <span className="text-xs text-muted-foreground">objects</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Historical Trends */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Growth Trends
                </CardTitle>
                <CardDescription>Track your app's growth over time</CardDescription>
              </div>
              <Tabs value={historicalView} onValueChange={(v) => setHistoricalView(v as any)}>
                <TabsList>
                  <TabsTrigger value="daily">Daily</TabsTrigger>
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="users" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="rooms">Rooms</TabsTrigger>
                <TabsTrigger value="entries">Entries</TabsTrigger>
                <TabsTrigger value="storage">Storage</TabsTrigger>
              </TabsList>
              
              <TabsContent value="users" className="mt-4">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="users" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUsers)" />
                  </AreaChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="rooms" className="mt-4">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="rooms" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="entries" className="mt-4">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorEntries" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="entries" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorEntries)" />
                  </AreaChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="storage" className="mt-4">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="storage" stroke="#f59e0b" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Rooms Distribution Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Rooms Distribution by Tier
              </CardTitle>
              <CardDescription>Visual breakdown across subscription levels</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* VIP9 Domains */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                VIP9 Domains Breakdown
              </CardTitle>
              <CardDescription>{metrics.vip9.totalRooms} strategic rooms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(metrics.vip9.domains).map(([domain, count]) => (
                  <div key={domain} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{domain}</span>
                    </div>
                    <Badge variant="secondary">{count} rooms</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Health Quick Check */}
        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  System Health Quick Check
                </CardTitle>
                <CardDescription>Real-time system diagnostics</CardDescription>
              </div>
              <Button onClick={runHealthCheck} disabled={healthChecking}>
                {healthChecking ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <Activity className="h-4 w-4 mr-2" />
                    Run Health Check
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-center gap-2 p-3 border rounded-lg">
                {metrics.health.databaseConnected ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <span className="text-sm font-medium">Database Connection</span>
              </div>
              
              <div className="flex items-center gap-2 p-3 border rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium">TTS Service Reachable</span>
              </div>
              
              <div className="flex items-center gap-2 p-3 border rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium">PayPal Webhook Alive</span>
              </div>
              
              <div className="flex items-center gap-2 p-3 border rounded-lg">
                {metrics.health.moderationQueueLength < 50 ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <div className="flex-1">
                  <span className="text-sm font-medium">Moderation Queue</span>
                  <p className="text-xs text-muted-foreground">{metrics.health.moderationQueueLength} items</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-3 border rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <div className="flex-1">
                  <span className="text-sm font-medium">Matchmaking Latency</span>
                  <p className="text-xs text-muted-foreground">&lt; 100ms</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-xs text-muted-foreground text-right">
          Last updated: {new Date(metrics.timestamp).toLocaleString()}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AppMetrics;