import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, FileText, Globe, Layers, BookOpen, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface RoomMetrics {
  id: string;
  tier: string;
  domain: string;
  title_en: string;
  title_vi: string;
  entry_count: number;
  approx_words_en: number;
  approx_words_vi: number;
}

interface TierStats {
  rooms: number;
  entries: number;
  approx_words_en: number;
  approx_words_vi: number;
}

interface SummaryMetrics {
  by_tier: Record<string, TierStats>;
  by_domain: Record<string, TierStats>;
  total_rooms: number;
  total_entries: number;
  total_words_en: number;
  total_words_vi: number;
  generated_at: string;
}

interface MetricsData {
  rooms: RoomMetrics[];
  summary: SummaryMetrics;
}

export default function RoomAnalytics() {
  const [data, setData] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [domainFilter, setDomainFilter] = useState<string>("all");

  const loadMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/data/room-metrics.json");
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Run 'npx tsx scripts/analyze-rooms.ts' to generate metrics`);
      }
      const json = await response.json();
      setData(json);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Loading room metrics...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background p-6">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Metrics Not Available</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{error || "No data"}</p>
            <p className="text-sm text-muted-foreground mb-4">
              Run: <code className="bg-muted px-2 py-1 rounded">npx tsx scripts/analyze-rooms.ts</code>
            </p>
            <Button onClick={loadMetrics} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" /> Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { rooms, summary } = data;
  const tiers = Object.keys(summary.by_tier).sort();
  const domains = Object.keys(summary.by_domain).sort();

  const filteredRooms = rooms.filter(room => {
    if (tierFilter !== "all" && room.tier !== tierFilter) return false;
    if (domainFilter !== "all" && room.domain !== domainFilter) return false;
    return true;
  });

  const maxRoomsInTier = Math.max(...Object.values(summary.by_tier).map(t => t.rooms));
  const maxRoomsInDomain = Math.max(...Object.values(summary.by_domain).map(d => d.rooms));

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Room Analytics</h1>
            <p className="text-sm text-muted-foreground">
              Generated: {new Date(summary.generated_at).toLocaleString()}
            </p>
          </div>
          <Button onClick={loadMetrics} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Layers className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-3xl font-bold">{summary.total_rooms}</p>
                  <p className="text-sm text-muted-foreground">Total Rooms</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-3xl font-bold">{summary.total_entries.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Entries</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <BookOpen className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-3xl font-bold">{summary.total_words_en.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Words (EN)</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Globe className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-3xl font-bold">{summary.total_words_vi.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Words (VI)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* By Tier & By Domain */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" /> By Tier
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tiers.map(tier => {
                const stats = summary.by_tier[tier];
                const pct = (stats.rooms / maxRoomsInTier) * 100;
                return (
                  <div key={tier} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium uppercase">{tier}</span>
                      <span className="text-muted-foreground">
                        {stats.rooms} rooms · {stats.entries} entries
                      </span>
                    </div>
                    <Progress value={pct} className="h-2" />
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" /> By Domain
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {domains.map(domain => {
                const stats = summary.by_domain[domain];
                const pct = (stats.rooms / maxRoomsInDomain) * 100;
                return (
                  <div key={domain} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium capitalize">{domain}</span>
                      <span className="text-muted-foreground">
                        {stats.rooms} rooms · {stats.entries} entries
                      </span>
                    </div>
                    <Progress value={pct} className="h-2" />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Room List */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <CardTitle>All Rooms ({filteredRooms.length})</CardTitle>
              <div className="flex gap-2 ml-auto">
                <Select value={tierFilter} onValueChange={setTierFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Tier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tiers</SelectItem>
                    {tiers.map(t => (
                      <SelectItem key={t} value={t}>{t.toUpperCase()}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={domainFilter} onValueChange={setDomainFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Domain" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Domains</SelectItem>
                    {domains.map(d => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2">ID</th>
                    <th className="text-left py-2 px-2">Title (EN)</th>
                    <th className="text-left py-2 px-2">Tier</th>
                    <th className="text-left py-2 px-2">Domain</th>
                    <th className="text-right py-2 px-2">Entries</th>
                    <th className="text-right py-2 px-2">Words EN</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRooms.slice(0, 100).map(room => (
                    <tr key={room.id} className="border-b border-border/50 hover:bg-muted/50">
                      <td className="py-2 px-2 font-mono text-xs">{room.id}</td>
                      <td className="py-2 px-2 max-w-[200px] truncate">{room.title_en}</td>
                      <td className="py-2 px-2">
                        <Badge variant="outline" className="uppercase text-xs">
                          {room.tier}
                        </Badge>
                      </td>
                      <td className="py-2 px-2">
                        <Badge variant="secondary" className="capitalize text-xs">
                          {room.domain}
                        </Badge>
                      </td>
                      <td className="py-2 px-2 text-right">{room.entry_count}</td>
                      <td className="py-2 px-2 text-right">{room.approx_words_en.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredRooms.length > 100 && (
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  Showing first 100 of {filteredRooms.length} rooms
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
