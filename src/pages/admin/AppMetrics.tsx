import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Database, Layers, Box, FileCode, HardDrive, Users, Building, Globe, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface AppMetrics {
  totalTiers: number;
  totalRooms: number;
  roomsByTier: Record<string, number>;
  totalEntries: number;
  totalKidsEntries: number;
  totalEdgeFunctions: number;
  totalStorageBuckets: number;
  totalUsers: number;
  totalProfiles: number;
  vip9Domains: { domain: string; count: number }[];
}

const AppMetrics = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<AppMetrics>({
    totalTiers: 0,
    totalRooms: 0,
    roomsByTier: {},
    totalEntries: 0,
    totalKidsEntries: 0,
    totalEdgeFunctions: 0,
    totalStorageBuckets: 4, // From the database: payment-proofs, room-audio, room-audio-uploads, avatars
    totalUsers: 0,
    totalProfiles: 0,
    vip9Domains: [],
  });

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
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
      // Fetch subscription tiers
      const { data: tiers } = await supabase
        .from("subscription_tiers")
        .select("id");
      
      // Fetch rooms and count by tier
      const { data: rooms } = await supabase
        .from("rooms")
        .select("id, tier");
      
      const roomsByTier: Record<string, number> = {};
      rooms?.forEach(room => {
        const tier = room.tier || "free";
        roomsByTier[tier] = (roomsByTier[tier] || 0) + 1;
      });

      // Calculate total entries from rooms
      const { data: roomsWithEntries } = await supabase
        .from("rooms")
        .select("entries");
      
      const totalEntries = roomsWithEntries?.reduce((sum, room) => {
        const entries = room.entries as any[];
        return sum + (entries?.length || 0);
      }, 0) || 0;

      // Fetch kids entries
      const { count: kidsEntriesCount } = await supabase
        .from("kids_entries")
        .select("*", { count: "exact", head: true });

      // Fetch users
      const { count: usersCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // Count VIP9 rooms by domain
      const { data: vip9Rooms } = await supabase
        .from("rooms")
        .select("domain")
        .ilike("tier", "%vip9%");

      const vip9DomainCounts: Record<string, number> = {};
      vip9Rooms?.forEach(room => {
        if (room.domain) {
          vip9DomainCounts[room.domain] = (vip9DomainCounts[room.domain] || 0) + 1;
        }
      });

      const vip9Domains = Object.entries(vip9DomainCounts).map(([domain, count]) => ({
        domain,
        count
      }));

      setMetrics({
        totalTiers: tiers?.length || 0,
        totalRooms: rooms?.length || 0,
        roomsByTier,
        totalEntries,
        totalKidsEntries: kidsEntriesCount || 0,
        totalEdgeFunctions: 6, // sync-rooms-from-json, tts, paypal, moderation, chat-room, matchmaking
        totalStorageBuckets: 4,
        totalUsers: usersCount || 0,
        totalProfiles: usersCount || 0,
        vip9Domains,
      });
    } catch (error) {
      console.error("Error fetching metrics:", error);
      toast({
        title: "Error",
        description: "Failed to load app metrics",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-lg">Loading metrics...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminBreadcrumb
          items={[
            { label: "Dashboard", href: "/admin" },
            { label: "App Metrics" }
          ]} 
        />

        <div>
          <h1 className="text-3xl font-bold mb-2">Application Scale Metrics</h1>
          <p className="text-muted-foreground">
            Overview of your application's infrastructure, data, and scale
          </p>
        </div>

        {/* Infrastructure Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalRooms}</div>
              <p className="text-xs text-muted-foreground">
                Across all tiers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subscription Tiers</CardTitle>
              <Layers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalTiers}</div>
              <p className="text-xs text-muted-foreground">
                Active pricing tiers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
              <Box className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalEntries + metrics.totalKidsEntries}</div>
              <p className="text-xs text-muted-foreground">
                {metrics.totalEntries} rooms + {metrics.totalKidsEntries} kids
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                Total user profiles
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Backend Infrastructure */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCode className="h-5 w-5" />
                Backend Functions
              </CardTitle>
              <CardDescription>Edge functions and serverless logic</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{metrics.totalEdgeFunctions}</div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>• sync-rooms-from-json</span>
                  <Badge variant="outline">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>• tts (Text-to-Speech)</span>
                  <Badge variant="outline">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>• paypal-payment</span>
                  <Badge variant="outline">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>• moderation</span>
                  <Badge variant="outline">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>• chat-room</span>
                  <Badge variant="outline">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>• matchmaking</span>
                  <Badge variant="outline">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="h-5 w-5" />
                Storage Infrastructure
              </CardTitle>
              <CardDescription>File storage buckets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{metrics.totalStorageBuckets}</div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>• payment-proofs</span>
                  <Badge variant="secondary">Private</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>• room-audio</span>
                  <Badge variant="secondary">Private</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>• room-audio-uploads</span>
                  <Badge variant="secondary">Private</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>• avatars</span>
                  <Badge variant="outline">Public</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rooms by Tier Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Rooms Distribution by Tier
            </CardTitle>
            <CardDescription>Content breakdown across subscription levels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-5">
              {Object.entries(metrics.roomsByTier)
                .sort((a, b) => b[1] - a[1])
                .map(([tier, count]) => (
                  <div key={tier} className="flex flex-col p-3 border rounded-lg">
                    <span className="text-xs font-medium text-muted-foreground uppercase mb-1">
                      {tier}
                    </span>
                    <span className="text-2xl font-bold">{count}</span>
                    <span className="text-xs text-muted-foreground">rooms</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* VIP9 Strategic Domains */}
        {metrics.vip9Domains.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                VIP9 Strategic Domains
              </CardTitle>
              <CardDescription>Room distribution across VIP9 domains</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-3">
                {metrics.vip9Domains.map(({ domain, count }) => (
                  <div key={domain} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{domain}</span>
                    </div>
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* System Summary */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>System Summary</CardTitle>
            <CardDescription>Quick overview of application scale</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Total Content Items:</span>
                <span>{metrics.totalEntries + metrics.totalKidsEntries} entries</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Backend Services:</span>
                <span>{metrics.totalEdgeFunctions} edge functions</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Storage Systems:</span>
                <span>{metrics.totalStorageBuckets} buckets</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Subscription Tiers:</span>
                <span>{metrics.totalTiers} active tiers</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-medium">User Base:</span>
                <span>{metrics.totalUsers} registered users</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AppMetrics;
