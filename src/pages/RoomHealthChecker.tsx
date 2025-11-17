import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Database, FileJson, AlertCircle, CheckCircle, RefreshCw, Wrench } from "lucide-react";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { useUserAccess } from "@/hooks/useUserAccess";
import { PUBLIC_ROOM_MANIFEST } from "@/lib/roomManifest";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface RoomHealth {
  id: string;
  title_en: string;
  tier: string;
  hasDbEntries: boolean;
  hasDbKeywords: boolean;
  dbEntryCount: number;
  dbKeywordCount: number;
  hasJsonFile: boolean;
  jsonPath?: string;
  source: 'database' | 'json' | 'none';
  status: 'healthy' | 'warning' | 'error';
}

export default function RoomHealthChecker() {
  const navigate = useNavigate();
  const { isAdmin, loading: accessLoading } = useUserAccess();
  const { toast } = useToast();
  const [isRepairing, setIsRepairing] = useState(false);

  const { data: healthReport, isLoading, refetch } = useQuery({
    queryKey: ["room-health"],
    queryFn: async () => {
      // Fetch all rooms from database
      const { data: rooms, error } = await supabase
        .from("rooms")
        .select("*")
        .order("tier, title_en");
      
      if (error) throw error;

      // Check each room's health
      const healthChecks: RoomHealth[] = await Promise.all(
        (rooms || []).map(async (room) => {
          const hasDbEntries = Array.isArray(room.entries) && room.entries.length > 0;
          const hasDbKeywords = Array.isArray(room.keywords) && room.keywords.length > 0;
          const dbEntryCount = hasDbEntries ? room.entries.length : 0;
          const dbKeywordCount = hasDbKeywords ? room.keywords.length : 0;

          // Check if JSON file exists
          const tier = room.tier || 'free';
          const manifestKey = `${room.id.replace(/_/g, '-')}-${tier}`;
          const jsonPath = PUBLIC_ROOM_MANIFEST[manifestKey] || PUBLIC_ROOM_MANIFEST[room.id.replace(/_/g, '-')];
          
          let hasJsonFile = false;
          if (jsonPath) {
            try {
              const response = await fetch(`/${jsonPath}`, { method: 'HEAD' });
              hasJsonFile = response.ok;
            } catch {
              hasJsonFile = false;
            }
          }

          // Determine source and status
          let source: 'database' | 'json' | 'none' = 'none';
          let status: 'healthy' | 'warning' | 'error' = 'error';

          if (hasDbEntries || hasDbKeywords) {
            source = 'database';
            status = 'healthy';
          } else if (hasJsonFile) {
            source = 'json';
            status = 'warning';
          }

          return {
            id: room.id,
            title_en: room.title_en,
            tier: room.tier || 'free',
            hasDbEntries,
            hasDbKeywords,
            dbEntryCount,
            dbKeywordCount,
            hasJsonFile,
            jsonPath,
            source,
            status
          };
        })
      );

      return healthChecks;
    },
  });

  if (accessLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Access denied. Admin privileges required.</p>
      </div>
    );
  }

  const healthyCount = healthReport?.filter(r => r.status === 'healthy').length || 0;
  const warningCount = healthReport?.filter(r => r.status === 'warning').length || 0;
  const errorCount = healthReport?.filter(r => r.status === 'error').length || 0;

  const extractKeywords = (entries: any[]): string[] => {
    const keywords = new Set<string>();
    entries.forEach((entry: any) => {
      if (entry.question?.en) keywords.add(entry.question.en.toLowerCase());
      if (entry.question?.vi) keywords.add(entry.question.vi.toLowerCase());
      if (entry.replies) {
        entry.replies.forEach((reply: any) => {
          if (reply.en) keywords.add(reply.en.toLowerCase());
          if (reply.vi) keywords.add(reply.vi.toLowerCase());
        });
      }
    });
    return Array.from(keywords).slice(0, 50);
  };

  const repairRoom = async (room: RoomHealth) => {
    if (!room.jsonPath) return;

    try {
      const response = await fetch(`/${room.jsonPath}`);
      if (!response.ok) throw new Error('Failed to fetch JSON file');
      
      const data = await response.json();
      const entries = data.merged || [];
      const keywords = extractKeywords(entries);

      await supabase
        .from('rooms')
        .update({
          entries,
          keywords,
          room_essay_en: data.room_essay?.en || null,
          room_essay_vi: data.room_essay?.vi || null,
          safety_disclaimer_en: data.safety_disclaimer?.en || null,
          safety_disclaimer_vi: data.safety_disclaimer?.vi || null,
          crisis_footer_en: data.crisis_footer?.en || null,
          crisis_footer_vi: data.crisis_footer?.vi || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', room.id);

      return { success: true, room: room.id };
    } catch (error) {
      console.error(`Failed to repair room ${room.id}:`, error);
      return { success: false, room: room.id, error };
    }
  };

  const handleBatchRepair = async () => {
    const roomsNeedingRepair = healthReport?.filter(
      r => (r.status === 'warning' || r.status === 'error') && r.hasJsonFile
    ) || [];

    if (roomsNeedingRepair.length === 0) {
      toast({
        title: "No repairs needed",
        description: "All rooms with JSON files are already synced to the database.",
      });
      return;
    }

    setIsRepairing(true);
    const results = await Promise.all(roomsNeedingRepair.map(repairRoom));
    
    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    toast({
      title: "Batch repair completed",
      description: `Successfully repaired ${successCount} rooms. ${failCount > 0 ? `Failed: ${failCount}` : ''}`,
    });

    setIsRepairing(false);
    refetch();
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <AdminBreadcrumb
          items={[
            { label: "Admin", href: "/admin" },
            { label: "Room Health Checker" }
          ]}
        />

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Room Health Checker</h1>
            <p className="text-muted-foreground mt-2">
              Diagnose room data sources and missing content
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleBatchRepair} 
              disabled={isRepairing || warningCount + errorCount === 0}
              size="sm"
            >
              <Wrench className="h-4 w-4 mr-2" />
              {isRepairing ? 'Repairing...' : 'Batch Repair'}
            </Button>
            <Button onClick={() => refetch()} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{healthyCount}</p>
                <p className="text-sm text-muted-foreground">Healthy (DB)</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <AlertCircle className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{warningCount}</p>
                <p className="text-sm text-muted-foreground">Using JSON Fallback</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{errorCount}</p>
                <p className="text-sm text-muted-foreground">No Data Found</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <Database className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold text-foreground">{healthReport?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Total Rooms</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Room Health Table */}
        <Card className="p-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Room Details</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Room ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Title</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Tier</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Source</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">DB Entries</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">DB Keywords</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">JSON File</th>
                  </tr>
                </thead>
                <tbody>
                  {healthReport?.map((room) => (
                    <tr key={room.id} className="border-b border-border hover:bg-accent/50">
                      <td className="py-3 px-4">
                        {room.status === 'healthy' && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                        {room.status === 'warning' && (
                          <AlertCircle className="h-5 w-5 text-yellow-500" />
                        )}
                        {room.status === 'error' && (
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm font-mono text-foreground">{room.id}</td>
                      <td className="py-3 px-4 text-sm text-foreground">{room.title_en}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="text-xs">
                          {room.tier}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {room.source === 'database' && (
                          <div className="flex items-center gap-2 text-green-600">
                            <Database className="h-4 w-4" />
                            <span className="text-sm">Database</span>
                          </div>
                        )}
                        {room.source === 'json' && (
                          <div className="flex items-center gap-2 text-yellow-600">
                            <FileJson className="h-4 w-4" />
                            <span className="text-sm">JSON Fallback</span>
                          </div>
                        )}
                        {room.source === 'none' && (
                          <span className="text-sm text-red-600">None</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-foreground">
                        {room.hasDbEntries ? (
                          <span className="text-green-600">{room.dbEntryCount} entries</span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-foreground">
                        {room.hasDbKeywords ? (
                          <span className="text-green-600">{room.dbKeywordCount} keywords</span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {room.hasJsonFile ? (
                          <span className="text-green-600">✓ {room.jsonPath}</span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        <Button onClick={() => navigate("/admin")} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Admin
        </Button>
      </div>
    </div>
  );
}
