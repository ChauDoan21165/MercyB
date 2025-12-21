/**
 * Crystal Dashboard - Audio Command Center v5.0
 * Phase 5: Zero-Friction Autopilot System
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import {
  Music,
  Loader2,
  RefreshCw,
  Shield,
  Zap,
  AlertTriangle,
  CheckCircle,
  Play,
  Eye,
  BarChart3,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface IntegritySnapshot {
  updatedAt: string;
  systemIntegrity: number;
  totalRooms: number;
  totalAudioFiles: number;
  lowestRooms: Array<{ roomId: string; score: number; missingEn: number; missingVi: number }>;
  violations: { missing: number; orphans: number; duplicates: number; namingIssues: number };
  autopilot: { enabled: boolean; lastRun: string | null; fixesApplied: number };
  byTier: Record<string, { rooms: number; avgScore: number; issues: number }>;
}

export default function AudioCrystal() {
  const [snapshot, setSnapshot] = useState<IntegritySnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loadSnapshot = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('audio-integrity-snapshot');
      if (error) throw error;
      setSnapshot(data);
    } catch (err) {
      toast({ title: "Error loading snapshot", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadSnapshot(); }, []);

  const getScoreColor = (score: number) => {
    if (score >= 99) return "text-green-600";
    if (score >= 90) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-black" />
            <div>
              <h1 className="text-2xl font-bold text-black">Crystal Dashboard v5.0</h1>
              <p className="text-gray-600 text-sm">Audio Command Center • Phase 5 Autopilot</p>
            </div>
          </div>
          <Button onClick={loadSnapshot} disabled={isLoading} className="bg-black text-white">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            Refresh
          </Button>
        </div>

        {/* Main Integrity Gauge */}
        {snapshot && (
          <Card className="border-2 border-black">
            <CardContent className="py-8">
              <div className="text-center">
                <div className={`text-7xl font-bold ${getScoreColor(snapshot.systemIntegrity)}`}>
                  {snapshot.systemIntegrity}%
                </div>
                <div className="text-xl text-gray-600 mt-2">System Integrity</div>
                <Progress value={snapshot.systemIntegrity} className="h-4 mt-4 max-w-md mx-auto" />
                <div className="flex justify-center gap-4 mt-4 text-sm">
                  <span>{snapshot.totalRooms} rooms</span>
                  <span>•</span>
                  <span>{snapshot.violations.missing} missing</span>
                  <span>•</span>
                  <span>{snapshot.violations.orphans} orphans</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        {snapshot && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border border-black">
              <CardContent className="py-4 text-center">
                <div className="text-3xl font-bold text-red-600">{snapshot.violations.missing}</div>
                <div className="text-sm text-gray-600">Missing Audio</div>
              </CardContent>
            </Card>
            <Card className="border border-black">
              <CardContent className="py-4 text-center">
                <div className="text-3xl font-bold text-orange-600">{snapshot.violations.orphans}</div>
                <div className="text-sm text-gray-600">Orphan Files</div>
              </CardContent>
            </Card>
            <Card className="border border-black">
              <CardContent className="py-4 text-center">
                <div className="text-3xl font-bold text-amber-600">{snapshot.violations.duplicates}</div>
                <div className="text-sm text-gray-600">Duplicates</div>
              </CardContent>
            </Card>
            <Card className="border border-black">
              <CardContent className="py-4 text-center">
                <div className={`text-3xl font-bold ${snapshot.autopilot.enabled ? 'text-green-600' : 'text-gray-400'}`}>
                  {snapshot.autopilot.enabled ? 'ON' : 'OFF'}
                </div>
                <div className="text-sm text-gray-600">Autopilot</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Lowest Integrity Rooms */}
        {snapshot && snapshot.lowestRooms.length > 0 && (
          <Card className="border-2 border-red-400">
            <CardHeader>
              <CardTitle className="text-red-800 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Rooms Needing Attention
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-48">
                {snapshot.lowestRooms.filter(r => r.score < 100).map(room => (
                  <div key={room.roomId} className="flex items-center justify-between py-2 border-b">
                    <span className="font-mono text-sm">{room.roomId}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive">{room.missingEn + room.missingVi} missing</Badge>
                      <span className={`font-bold ${getScoreColor(room.score)}`}>{room.score}%</span>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        {/* Tier Breakdown */}
        {snapshot && Object.keys(snapshot.byTier).length > 0 && (
          <Card className="border border-black">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                By Tier
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {Object.entries(snapshot.byTier).map(([tier, stats]) => (
                  <div key={tier} className="p-3 bg-gray-50 rounded text-center">
                    <div className="font-bold">{tier}</div>
                    <div className={`text-xl ${getScoreColor(stats.avgScore)}`}>{stats.avgScore}%</div>
                    <div className="text-xs text-gray-500">{stats.rooms} rooms</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
