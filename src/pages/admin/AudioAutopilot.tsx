/**
 * Audio Autopilot Admin Dashboard v4.7
 * Full autonomous audio management command center
 * 
 * Phase 4.7 enhancements:
 * - Two-way governance integration via Supabase
 * - Deep filtering (room, confidence, type)
 * - Deduplication indicators
 * - Real-time stats from API
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Play, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Clock,
  BarChart3,
  Download,
  Terminal,
  Copy,
  Shield,
  History,
  Eye,
  ThumbsUp,
  ThumbsDown,
  TrendingUp,
  TrendingDown,
  Filter,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import type { AutopilotStatusStore, AudioChangeSet, AudioChange } from '@/lib/audio/types';

interface AutopilotReport {
  version: string;
  timestamp: string;
  cycleId: string;
  config: any;
  result: any;
  details: any;
}

interface CycleHistoryEntry {
  cycleId: string;
  timestamp: string;
  label?: string;
  integrityBefore: number;
  integrityAfter: number;
  applied: number;
  blocked: number;
  governanceFlags: string[];
  mode: 'dry-run' | 'apply';
  duration: number;
}

interface AutopilotHistory {
  version: string;
  updatedAt: string;
  cycles: CycleHistoryEntry[];
  maxCycles: number;
}

interface PendingGovernanceReview {
  id: string;
  cycleId: string;
  timestamp: string;
  operation: {
    type: string;
    roomId: string;
    before: string;
    after?: string;
    confidence: number;
  };
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  notes?: string;
}

interface PendingGovernanceDB {
  version: string;
  updatedAt: string;
  pending: PendingGovernanceReview[];
  approved: PendingGovernanceReview[];
  rejected: PendingGovernanceReview[];
}

interface GovernanceDecision {
  changeId: string;
  operation: {
    type: string;
    source: string;
    target: string;
    roomId?: string;
    metadata: any;
  };
  decision: string;
  confidence: number;
  reason: string;
  violations: string[];
  canOverride: boolean;
}

// Quick Approve Button Component for bulk approving high-confidence reviews
function QuickApproveButton({ 
  pending, 
  onApproved 
}: { 
  pending: PendingGovernanceReview[];
  onApproved: () => void;
}) {
  const [threshold, setThreshold] = useState(90);
  const [isApproving, setIsApproving] = useState(false);

  const eligibleCount = pending.filter(r => r.operation.confidence >= threshold).length;

  const handleBulkApprove = async () => {
    const toApprove = pending.filter(r => r.operation.confidence >= threshold);
    if (toApprove.length === 0) {
      toast.info('No reviews meet the confidence threshold');
      return;
    }

    setIsApproving(true);
    try {
      const reviewIds = toApprove.map(r => r.id);
      const { error } = await supabase
        .from('audio_governance_reviews')
        .update({
          status: 'approved',
          reviewed_by: 'admin-bulk',
          reviewed_at: new Date().toISOString(),
          notes: `Bulk approved (≥${threshold}% confidence)`,
        })
        .in('review_id', reviewIds);

      if (error) throw error;
      
      toast.success(`Approved ${toApprove.length} reviews ≥${threshold}%`);
      onApproved();
    } catch (error) {
      console.error('Bulk approve error:', error);
      toast.error('Failed to bulk approve');
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={String(threshold)} onValueChange={(v) => setThreshold(Number(v))}>
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Threshold" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="85">≥85%</SelectItem>
          <SelectItem value="90">≥90%</SelectItem>
          <SelectItem value="92">≥92%</SelectItem>
          <SelectItem value="95">≥95%</SelectItem>
        </SelectContent>
      </Select>
      <Button 
        size="sm" 
        onClick={handleBulkApprove}
        disabled={isApproving || eligibleCount === 0}
      >
        {isApproving ? (
          <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
        ) : (
          <CheckCircle className="w-4 h-4 mr-1" />
        )}
        Approve All ({eligibleCount})
      </Button>
    </div>
  );
}

export default function AudioAutopilot() {
  const [isLoading, setIsLoading] = useState(false);
  const [autopilotStatus, setAutopilotStatus] = useState<AutopilotStatusStore | null>(null);
  const [lastReport, setLastReport] = useState<AutopilotReport | null>(null);
  const [changeSet, setChangeSet] = useState<AudioChangeSet | null>(null);
  const [governanceLog, setGovernanceLog] = useState<GovernanceDecision[]>([]);
  const [history, setHistory] = useState<AutopilotHistory | null>(null);
  const [pendingGovernance, setPendingGovernance] = useState<PendingGovernanceDB | null>(null);
  const [selectedReview, setSelectedReview] = useState<PendingGovernanceReview | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  
  // Phase 4.7: Filters
  const [roomFilter, setRoomFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [confidenceFilter, setConfidenceFilter] = useState('');
  const [governanceStats, setGovernanceStats] = useState<any>(null);

  useEffect(() => {
    loadAllArtifacts();
  }, []);

  const loadAllArtifacts = async () => {
    setIsLoading(true);
    await Promise.all([
      loadAutopilotStatus(),
      loadAutopilotReport(),
      loadChangeSet(),
      loadHistory(),
      loadPendingGovernanceFromAPI(),
      loadGovernanceStats(),
    ]);
    setIsLoading(false);
  };

  const loadAutopilotStatus = async () => {
    try {
      const response = await fetch('/audio/autopilot-status.json');
      if (response.ok) {
        const status = await response.json();
        setAutopilotStatus(status);
      }
    } catch (error) {
      console.log('No autopilot status file found');
    }
  };

  const loadAutopilotReport = async () => {
    try {
      const response = await fetch('/audio/autopilot-report.json');
      if (response.ok) {
        const report = await response.json();
        setLastReport(report);
        
        if (report.governanceDecisions) {
          setGovernanceLog(report.governanceDecisions);
        } else if (report.result?.governanceDecisions) {
          setGovernanceLog(report.result.governanceDecisions);
        }
      }
    } catch (error) {
      console.log('No autopilot report file found');
    }
  };

  const loadChangeSet = async () => {
    try {
      const response = await fetch('/audio/autopilot-changeset.json');
      if (response.ok) {
        const cs = await response.json();
        setChangeSet(cs);
      }
    } catch (error) {
      console.log('No changeset file found');
    }
  };

  const loadHistory = async () => {
    try {
      const response = await fetch('/audio/autopilot-history.json');
      if (response.ok) {
        const h = await response.json();
        setHistory(h);
      }
    } catch (error) {
      console.log('No history file found');
    }
  };

  // Phase 4.7: Load from Supabase API
  const loadPendingGovernanceFromAPI = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('audio-governance-console', {
        body: null,
        method: 'GET',
      });
      
      // Also try loading from local file as fallback
      if (error) {
        console.log('API not available, trying local file');
        const response = await fetch('/audio/pending-governance.json');
        if (response.ok) {
          const pg = await response.json();
          setPendingGovernance(pg);
        }
        return;
      }

      // Transform API response to match local format
      if (data?.data) {
        setPendingGovernance({
          version: '4.7',
          updatedAt: new Date().toISOString(),
          pending: data.data.pending?.map((r: any) => ({
            id: r.review_id,
            cycleId: r.cycle_id,
            timestamp: r.created_at,
            operation: {
              type: r.operation_type,
              roomId: r.room_id,
              before: r.before_filename,
              after: r.after_filename,
              confidence: r.confidence,
            },
            reason: r.reason,
            status: r.status,
            reviewedBy: r.reviewed_by,
            reviewedAt: r.reviewed_at,
            notes: r.notes,
          })) || [],
          approved: [],
          rejected: [],
        });
      }
    } catch (error) {
      console.log('Error loading governance from API:', error);
      // Try fallback
      try {
        const response = await fetch('/audio/pending-governance.json');
        if (response.ok) {
          const pg = await response.json();
          setPendingGovernance(pg);
        }
      } catch {
        // Ignore
      }
    }
  };

  // Phase 4.7: Load stats from API
  const loadGovernanceStats = async () => {
    try {
      const { data, error } = await supabase
        .from('audio_governance_reviews')
        .select('status, room_id, confidence');
      
      if (!error && data) {
        const stats = {
          totalPending: data.filter(r => r.status === 'pending').length,
          totalApproved: data.filter(r => r.status === 'approved').length,
          totalRejected: data.filter(r => r.status === 'rejected').length,
          pendingByRoom: {} as Record<string, number>,
          avgConfidence: 0,
        };
        
        const pending = data.filter(r => r.status === 'pending');
        for (const r of pending) {
          stats.pendingByRoom[r.room_id] = (stats.pendingByRoom[r.room_id] || 0) + 1;
        }
        
        if (pending.length > 0) {
          stats.avgConfidence = pending.reduce((sum, r) => sum + Number(r.confidence), 0) / pending.length;
        }
        
        setGovernanceStats(stats);
      }
    } catch (error) {
      console.log('Error loading governance stats:', error);
    }
  };

  // Phase 4.7: Approve via API
  const handleApproveReview = async (review: PendingGovernanceReview) => {
    try {
      const { error } = await supabase
        .from('audio_governance_reviews')
        .update({
          status: 'approved',
          reviewed_by: 'admin',
          reviewed_at: new Date().toISOString(),
          notes: reviewNotes,
        })
        .eq('review_id', review.id);

      if (error) throw error;
      
      toast.success(`Approved: ${review.id}`);
      setSelectedReview(null);
      setReviewNotes('');
      loadPendingGovernanceFromAPI();
      loadGovernanceStats();
    } catch (error) {
      console.error('Error approving:', error);
      toast.error('Failed to approve review');
    }
  };

  // Phase 4.7: Reject via API
  const handleRejectReview = async (review: PendingGovernanceReview) => {
    try {
      const { error } = await supabase
        .from('audio_governance_reviews')
        .update({
          status: 'rejected',
          reviewed_by: 'admin',
          reviewed_at: new Date().toISOString(),
          notes: reviewNotes,
        })
        .eq('review_id', review.id);

      if (error) throw error;
      
      toast.info(`Rejected: ${review.id}`);
      setSelectedReview(null);
      setReviewNotes('');
      loadPendingGovernanceFromAPI();
      loadGovernanceStats();
    } catch (error) {
      console.error('Error rejecting:', error);
      toast.error('Failed to reject review');
    }
  };

  // Phase 4.7: Cleanup stale
  const handleCleanupStale = async () => {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 7);
      
      const { data, error } = await supabase
        .from('audio_governance_reviews')
        .delete()
        .eq('status', 'pending')
        .lt('created_at', cutoffDate.toISOString())
        .select();

      if (error) throw error;
      
      toast.success(`Cleaned up ${data?.length || 0} stale items`);
      loadPendingGovernanceFromAPI();
      loadGovernanceStats();
    } catch (error) {
      console.error('Error cleaning up:', error);
      toast.error('Failed to cleanup stale items');
    }
  };

  // Filter pending reviews
  const filteredPending = pendingGovernance?.pending?.filter(review => {
    if (roomFilter && !review.operation.roomId.toLowerCase().includes(roomFilter.toLowerCase())) {
      return false;
    }
    if (typeFilter && review.operation.type !== typeFilter) {
      return false;
    }
    if (confidenceFilter) {
      const minConf = parseFloat(confidenceFilter);
      if (!isNaN(minConf) && review.operation.confidence < minConf) {
        return false;
      }
    }
    return true;
  }) || [];

  const getIntegrityColor = (value: number) => {
    if (value >= 99) return 'text-green-600';
    if (value >= 90) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDecisionBadgeVariant = (decision: string) => {
    switch (decision) {
      case 'auto-approve':
        return 'default';
      case 'governance-approve':
        return 'secondary';
      case 'block':
      case 'blocked':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  // Get summary counts from changeSet
  const changeCounts = changeSet ? {
    critical: changeSet.criticalFixes?.length || (changeSet as any).categories?.criticalFixes?.length || 0,
    auto: changeSet.autoFixes?.length || (changeSet as any).categories?.autoFixes?.length || 0,
    lowConf: changeSet.lowConfidence?.length || (changeSet as any).categories?.lowConfidence?.length || 0,
    blocked: changeSet.blocked?.length || (changeSet as any).categories?.blocked?.length || 0,
    cosmetic: changeSet.cosmetic?.length || (changeSet as any).categories?.cosmetic?.length || 0,
  } : { critical: 0, auto: 0, lowConf: 0, blocked: 0, cosmetic: 0 };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Audio Autopilot v4.7</h1>
            <p className="text-muted-foreground">Persistent governance DB with two-way integration</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={autopilotStatus?.lastRunAt ? 'default' : 'secondary'}>
              {autopilotStatus?.lastRunAt ? 'Active' : 'No runs yet'}
            </Badge>
            <Button variant="outline" size="sm" onClick={loadAllArtifacts} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Last Run
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-semibold">
                  {autopilotStatus?.lastRunAt 
                    ? new Date(autopilotStatus.lastRunAt).toLocaleString()
                    : 'Never'}
                </span>
              </div>
              {autopilotStatus?.mode && (
                <Badge variant="outline" className="mt-2">{autopilotStatus.mode}</Badge>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Integrity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-2xl font-bold ${getIntegrityColor(autopilotStatus?.afterIntegrity || 0)}`}>
                    {(autopilotStatus?.afterIntegrity || 0).toFixed(1)}%
                  </span>
                  {autopilotStatus?.afterIntegrity && autopilotStatus.beforeIntegrity && (
                    <Badge variant={autopilotStatus.afterIntegrity >= autopilotStatus.beforeIntegrity ? 'default' : 'destructive'}>
                      {autopilotStatus.afterIntegrity >= autopilotStatus.beforeIntegrity ? '+' : ''}
                      {(autopilotStatus.afterIntegrity - autopilotStatus.beforeIntegrity).toFixed(1)}%
                    </Badge>
                  )}
                </div>
                <Progress value={autopilotStatus?.afterIntegrity || 0} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Fixes Applied
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-2xl font-bold">{autopilotStatus?.changesApplied || 0}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Blocked
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-500" />
                <span className="text-2xl font-bold">{autopilotStatus?.changesBlocked || 0}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-yellow-500" />
                <span className="text-2xl font-bold">{pendingGovernance?.pending?.length || 0}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Governance Flags */}
        {autopilotStatus?.governanceFlags && autopilotStatus.governanceFlags.length > 0 && (
          <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <span className="font-medium">Governance Flags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {autopilotStatus.governanceFlags.map((flag, i) => (
                  <Badge key={i} variant="outline" className="border-yellow-500 text-yellow-700">
                    {flag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="history" className="space-y-4">
          <TabsList>
            <TabsTrigger value="history">
              <History className="w-4 h-4 mr-2" />
              History
            </TabsTrigger>
            <TabsTrigger value="pending">
              <Eye className="w-4 h-4 mr-2" />
              Pending Reviews
            </TabsTrigger>
            <TabsTrigger value="changeset">
              <BarChart3 className="w-4 h-4 mr-2" />
              Change Set
            </TabsTrigger>
            <TabsTrigger value="governance">
              <Shield className="w-4 h-4 mr-2" />
              Governance Log
            </TabsTrigger>
            <TabsTrigger value="commands">
              <Terminal className="w-4 h-4 mr-2" />
              Commands
            </TabsTrigger>
          </TabsList>

          {/* History Tab (Phase 4.6) */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Cycle History (Last 20)</CardTitle>
                <CardDescription>
                  Track integrity changes over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!history || history.cycles.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    No history available. Run autopilot to start tracking.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Mini Chart */}
                    <div className="h-24 flex items-end gap-1 border-b pb-2">
                      {history.cycles.slice(0, 20).reverse().map((cycle, i) => {
                        const height = Math.max(10, cycle.integrityAfter);
                        const isUp = cycle.integrityAfter >= cycle.integrityBefore;
                        return (
                          <div
                            key={cycle.cycleId}
                            className={`flex-1 rounded-t transition-all ${
                              isUp ? 'bg-green-500' : 'bg-red-500'
                            }`}
                            style={{ height: `${height}%` }}
                            title={`${cycle.integrityAfter.toFixed(1)}%`}
                          />
                        );
                      })}
                    </div>

                    {/* History Table */}
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-2">
                        {history.cycles.map((cycle) => (
                          <div
                            key={cycle.cycleId}
                            className="flex items-center justify-between p-3 bg-muted rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`p-1 rounded ${
                                cycle.integrityAfter >= cycle.integrityBefore 
                                  ? 'bg-green-100 dark:bg-green-900' 
                                  : 'bg-red-100 dark:bg-red-900'
                              }`}>
                                {cycle.integrityAfter >= cycle.integrityBefore 
                                  ? <TrendingUp className="w-4 h-4 text-green-600" />
                                  : <TrendingDown className="w-4 h-4 text-red-600" />
                                }
                              </div>
                              <div>
                                <div className="font-medium text-sm">
                                  {cycle.label || cycle.cycleId}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {new Date(cycle.timestamp).toLocaleString()}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div className={`font-bold ${getIntegrityColor(cycle.integrityAfter)}`}>
                                  {cycle.integrityAfter.toFixed(1)}%
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {cycle.integrityAfter >= cycle.integrityBefore ? '+' : ''}
                                  {(cycle.integrityAfter - cycle.integrityBefore).toFixed(1)}%
                                </div>
                              </div>
                              <div className="text-right text-sm">
                                <div className="text-green-600">+{cycle.applied}</div>
                                <div className="text-red-600">-{cycle.blocked}</div>
                              </div>
                              <Badge variant="outline">{cycle.mode}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pending Reviews Tab (Phase 4.6) */}
          <TabsContent value="pending">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Pending Human Reviews</CardTitle>
                  <CardDescription>
                    Changes requiring manual approval or rejection
                  </CardDescription>
                </div>
                {pendingGovernance && pendingGovernance.pending.length > 0 && (
                  <QuickApproveButton 
                    pending={pendingGovernance.pending}
                    onApproved={() => {
                      loadPendingGovernanceFromAPI();
                      loadGovernanceStats();
                    }}
                  />
                )}
              </CardHeader>
              <CardContent>
                {!pendingGovernance || pendingGovernance.pending.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    No pending reviews. All changes are either approved or rejected.
                  </div>
                ) : (
                  <div className="space-y-4">
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-3">
                        {pendingGovernance.pending.map((review) => (
                          <div
                            key={review.id}
                            className={`p-4 border rounded-lg ${
                              selectedReview?.id === review.id 
                                ? 'border-primary bg-primary/5' 
                                : 'border-border'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline">{review.operation.type}</Badge>
                                  <span className="text-sm font-medium">{review.operation.roomId}</span>
                                </div>
                                <div className="text-sm text-muted-foreground mb-2">
                                  {review.reason}
                                </div>
                                <div className="text-xs font-mono bg-muted p-2 rounded">
                                  <div>Before: {review.operation.before}</div>
                                  {review.operation.after && (
                                    <div>After: {review.operation.after}</div>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant="secondary">
                                    Confidence: {review.operation.confidence}%
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(review.timestamp).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => handleApproveReview(review)}
                                >
                                  <ThumbsUp className="w-4 h-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleRejectReview(review)}
                                >
                                  <ThumbsDown className="w-4 h-4 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            </div>
                            
                            {selectedReview?.id === review.id && (
                              <div className="mt-4 pt-4 border-t">
                                <Textarea
                                  placeholder="Add notes (optional)"
                                  value={reviewNotes}
                                  onChange={(e) => setReviewNotes(e.target.value)}
                                  className="mb-2"
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Change Set Tab */}
          <TabsContent value="changeset">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Change Set Breakdown</CardTitle>
                  <CardDescription>
                    {changeSet ? (changeSet as any).id || 'Current changeset' : 'No changeset loaded'}
                  </CardDescription>
                </div>
                {changeSet && (
                  <Button variant="outline" size="sm" onClick={downloadReport}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {!changeSet ? (
                  <div className="text-center text-muted-foreground py-8">
                    No changeset available. Run autopilot to generate.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Summary */}
                    <div className="grid grid-cols-5 gap-4">
                      <div className="text-center p-3 bg-red-50 dark:bg-red-950 rounded">
                        <div className="text-2xl font-bold text-red-600">{changeCounts.critical}</div>
                        <div className="text-xs text-muted-foreground">Critical</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded">
                        <div className="text-2xl font-bold text-green-600">{changeCounts.auto}</div>
                        <div className="text-xs text-muted-foreground">Auto Fix</div>
                      </div>
                      <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-950 rounded">
                        <div className="text-2xl font-bold text-yellow-600">{changeCounts.lowConf}</div>
                        <div className="text-xs text-muted-foreground">Low Conf</div>
                      </div>
                      <div className="text-center p-3 bg-gray-100 dark:bg-gray-900 rounded">
                        <div className="text-2xl font-bold">{changeCounts.blocked}</div>
                        <div className="text-xs text-muted-foreground">Blocked</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded">
                        <div className="text-2xl font-bold text-blue-600">{changeCounts.cosmetic}</div>
                        <div className="text-xs text-muted-foreground">Cosmetic</div>
                      </div>
                    </div>

                    {/* Changes list */}
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-2">
                        {[
                          ...(changeSet.criticalFixes || []).map((c: AudioChange) => ({ ...c, category: 'critical' })),
                          ...(changeSet.autoFixes || []).map((c: AudioChange) => ({ ...c, category: 'auto' })),
                          ...(changeSet.lowConfidence || []).map((c: AudioChange) => ({ ...c, category: 'lowConf' })),
                          ...(changeSet.blocked || []).map((c: AudioChange) => ({ ...c, category: 'blocked' })),
                        ].slice(0, 50).map((change: AudioChange & { category: string }) => (
                          <div key={change.id} className="p-2 bg-muted rounded text-sm">
                            <div className="flex items-center gap-2">
                              <Badge variant={
                                change.category === 'critical' ? 'destructive' :
                                change.category === 'auto' ? 'default' :
                                change.category === 'lowConf' ? 'secondary' : 'outline'
                              }>
                                {change.type}
                              </Badge>
                              <span className="font-mono text-xs truncate">{change.roomId}</span>
                              <span className="text-muted-foreground">→</span>
                              <span className="font-mono text-xs truncate">{change.after || change.before}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Governance Log Tab */}
          <TabsContent value="governance">
            <Card>
              <CardHeader>
                <CardTitle>Governance Decisions</CardTitle>
                <CardDescription>
                  All governance evaluations from the last run
                </CardDescription>
              </CardHeader>
              <CardContent>
                {governanceLog.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    No governance decisions recorded yet.
                  </div>
                ) : (
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-2">
                      {governanceLog.slice(0, 100).map((decision, i) => (
                        <div key={i} className="p-3 bg-muted rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge variant={getDecisionBadgeVariant(decision.decision)}>
                                {decision.decision}
                              </Badge>
                              <span className="text-sm font-medium">{decision.operation?.type}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {decision.confidence ? `${(decision.confidence * 100).toFixed(0)}%` : ''}
                            </span>
                          </div>
                          {decision.reason && (
                            <p className="text-sm text-muted-foreground">{decision.reason}</p>
                          )}
                          {decision.violations && decision.violations.length > 0 && (
                            <div className="flex gap-1 mt-2">
                              {decision.violations.map((v, vi) => (
                                <Badge key={vi} variant="outline" className="text-xs">
                                  {v}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Commands Tab */}
          <TabsContent value="commands">
            <Card>
              <CardHeader>
                <CardTitle>CLI Commands</CardTitle>
                <CardDescription>
                  Run these commands locally or trigger via CI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg font-mono text-sm">
                    <code>npx tsx scripts/run-audio-autopilot.ts --dry-run</code>
                    <Button size="sm" variant="ghost" onClick={() => copyCommand('npx tsx scripts/run-audio-autopilot.ts --dry-run')}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground ml-2">Preview changes without applying</p>
                  
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg font-mono text-sm">
                    <code>npx tsx scripts/run-audio-autopilot.ts --apply --governance-mode assisted</code>
                    <Button size="sm" variant="ghost" onClick={() => copyCommand('npx tsx scripts/run-audio-autopilot.ts --apply --governance-mode assisted')}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground ml-2">Apply with assisted governance (flags low-confidence)</p>
                  
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg font-mono text-sm">
                    <code>npx tsx scripts/run-audio-autopilot.ts --apply --rooms "vip1" --cycle-label "vip1-fix"</code>
                    <Button size="sm" variant="ghost" onClick={() => copyCommand('npx tsx scripts/run-audio-autopilot.ts --apply --rooms "vip1" --cycle-label "vip1-fix"')}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground ml-2">Filter to VIP1 rooms with custom label</p>
                  
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg font-mono text-sm">
                    <code>npx tsx scripts/run-audio-autopilot.ts --apply --max-changes 50 --save-artifacts ./reports</code>
                    <Button size="sm" variant="ghost" onClick={() => copyCommand('npx tsx scripts/run-audio-autopilot.ts --apply --max-changes 50 --save-artifacts ./reports')}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground ml-2">Limit changes and save to custom directory</p>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">CLI Flags (v4.6)</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><code>--dry-run</code> Preview only</div>
                    <div><code>--apply</code> Apply changes</div>
                    <div><code>--rooms "&lt;pattern&gt;"</code> Filter rooms</div>
                    <div><code>--max-changes &lt;n&gt;</code> Limit changes</div>
                    <div><code>--governance-mode &lt;mode&gt;</code> auto/assisted/strict</div>
                    <div><code>--cycle-label "&lt;string&gt;"</code> Label for tracking</div>
                    <div><code>--save-artifacts &lt;dir&gt;</code> Custom output dir</div>
                    <div><code>--with-tts</code> Enable TTS generation</div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Artifact Locations</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div><code>public/audio/autopilot-status.json</code> - Last run status</div>
                    <div><code>public/audio/autopilot-report.json</code> - Full report</div>
                    <div><code>public/audio/autopilot-changeset.json</code> - Change details</div>
                    <div><code>public/audio/autopilot-history.json</code> - Cycle history</div>
                    <div><code>public/audio/pending-governance.json</code> - Pending reviews</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
