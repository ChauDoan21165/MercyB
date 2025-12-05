/**
 * Audio Autopilot Admin Dashboard v4.5
 * Full autonomous audio management command center
 * 
 * Loads and displays:
 * - autopilot-status.json
 * - autopilot-report.json
 * - autopilot-changeset.json
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
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
} from 'lucide-react';
import { toast } from 'sonner';
import type { AutopilotStatusStore, AudioChangeSet, AudioChange } from '@/lib/audio/types';

interface AutopilotReport {
  version: string;
  timestamp: string;
  config: any;
  result: any;
  details: any;
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

export default function AudioAutopilot() {
  const [isLoading, setIsLoading] = useState(false);
  const [autopilotStatus, setAutopilotStatus] = useState<AutopilotStatusStore | null>(null);
  const [lastReport, setLastReport] = useState<AutopilotReport | null>(null);
  const [changeSet, setChangeSet] = useState<AudioChangeSet | null>(null);
  const [governanceLog, setGovernanceLog] = useState<GovernanceDecision[]>([]);

  useEffect(() => {
    loadAllArtifacts();
  }, []);

  const loadAllArtifacts = async () => {
    setIsLoading(true);
    await Promise.all([
      loadAutopilotStatus(),
      loadAutopilotReport(),
      loadChangeSet(),
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
        
        // Extract governance decisions if available
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

  const copyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    toast.success('Command copied to clipboard');
  };

  const downloadReport = () => {
    if (!lastReport) return;
    
    const blob = new Blob([JSON.stringify(lastReport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `autopilot-report-${lastReport.timestamp || Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Report downloaded');
  };

  const downloadChangeSet = () => {
    if (!changeSet) return;
    
    const blob = new Blob([JSON.stringify(changeSet, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `autopilot-changeset-${changeSet.id || Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Changeset downloaded');
  };

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
            <h1 className="text-3xl font-bold text-foreground">Audio Autopilot v4.5</h1>
            <p className="text-muted-foreground">Full autonomous audio management with governance</p>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Last Run
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-lg font-semibold">
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
        <Tabs defaultValue="commands" className="space-y-4">
          <TabsList>
            <TabsTrigger value="commands">
              <Terminal className="w-4 h-4 mr-2" />
              Commands
            </TabsTrigger>
            <TabsTrigger value="changeset">
              <BarChart3 className="w-4 h-4 mr-2" />
              Change Set
            </TabsTrigger>
            <TabsTrigger value="governance">
              <Shield className="w-4 h-4 mr-2" />
              Governance Log
            </TabsTrigger>
            <TabsTrigger value="report">
              <Download className="w-4 h-4 mr-2" />
              Report
            </TabsTrigger>
          </TabsList>

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
                    <code>npx tsx scripts/run-audio-autopilot.ts --apply</code>
                    <Button size="sm" variant="ghost" onClick={() => copyCommand('npx tsx scripts/run-audio-autopilot.ts --apply')}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground ml-2">Apply approved fixes</p>
                  
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg font-mono text-sm">
                    <code>npx tsx scripts/run-audio-autopilot.ts --apply --rooms "vip1"</code>
                    <Button size="sm" variant="ghost" onClick={() => copyCommand('npx tsx scripts/run-audio-autopilot.ts --apply --rooms "vip1"')}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground ml-2">Filter to specific rooms</p>
                  
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg font-mono text-sm">
                    <code>npx tsx scripts/run-audio-autopilot.ts --apply --with-tts</code>
                    <Button size="sm" variant="ghost" onClick={() => copyCommand('npx tsx scripts/run-audio-autopilot.ts --apply --with-tts')}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground ml-2">Include TTS generation for missing audio</p>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">npm Scripts</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-muted rounded-lg">
                      <code className="text-sm font-mono">npm run audio:check</code>
                      <p className="text-xs text-muted-foreground mt-1">Dry-run all checks</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <code className="text-sm font-mono">npm run audio:fix</code>
                      <p className="text-xs text-muted-foreground mt-1">Apply fixes + regenerate manifest</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Artifact Locations</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div><code>public/audio/autopilot-status.json</code> - Last run status</div>
                    <div><code>public/audio/autopilot-report.json</code> - Full report</div>
                    <div><code>public/audio/autopilot-changeset.json</code> - Change details</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Change Set Tab */}
          <TabsContent value="changeset">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Change Set</CardTitle>
                  <CardDescription>
                    {changeSet?.id || 'No changeset loaded'}
                  </CardDescription>
                </div>
                {changeSet && (
                  <Button variant="outline" size="sm" onClick={downloadChangeSet}>
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

                    {/* Operations list */}
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-2">
                        {(changeSet as any).operations?.slice(0, 50).map((op: any, i: number) => (
                          <div key={i} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between">
                              <Badge variant={getDecisionBadgeVariant(op.governanceDecision)}>
                                {op.type}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {Math.round((op.confidence || 0))}% confidence
                              </span>
                            </div>
                            <div className="mt-2 font-mono text-xs">
                              <div className="text-muted-foreground">{op.roomId}</div>
                              <div className="truncate">{op.before}</div>
                              {op.after && <div className="text-green-600">→ {op.after}</div>}
                            </div>
                          </div>
                        ))}
                        {((changeSet as any).operations?.length || 0) > 50 && (
                          <div className="text-center text-muted-foreground py-4">
                            + {(changeSet as any).operations.length - 50} more operations
                          </div>
                        )}
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
                <CardTitle>Governance Decision Log</CardTitle>
                <CardDescription>
                  All governance decisions from the last autopilot run
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  {governanceLog.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      No governance decisions recorded yet
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {governanceLog.slice(0, 50).map((decision, i) => (
                        <div 
                          key={i} 
                          className={`p-3 rounded-lg border ${
                            decision.decision === 'block' || decision.decision === 'blocked'
                              ? 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950'
                              : decision.decision === 'auto-approve'
                              ? 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950'
                              : 'border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <Badge variant={getDecisionBadgeVariant(decision.decision)}>
                              {decision.decision}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {Math.round((decision.confidence || 0) * 100)}% confidence
                            </span>
                          </div>
                          <div className="mt-2 text-sm">
                            <div><strong>Type:</strong> {decision.operation?.type}</div>
                            <div className="font-mono text-xs truncate">
                              {decision.operation?.source} → {decision.operation?.target}
                            </div>
                            <div className="text-muted-foreground mt-1">{decision.reason}</div>
                          </div>
                          {decision.violations && decision.violations.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {decision.violations.map((v, vi) => (
                                <Badge key={vi} variant="outline" className="text-xs">
                                  {v}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                      {governanceLog.length > 50 && (
                        <div className="text-center text-muted-foreground py-4">
                          + {governanceLog.length - 50} more decisions
                        </div>
                      )}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Report Tab */}
          <TabsContent value="report">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Last Autopilot Report</CardTitle>
                  <CardDescription>
                    {lastReport?.timestamp ? new Date(lastReport.timestamp).toLocaleString() : 'No report available'}
                  </CardDescription>
                </div>
                {lastReport && (
                  <Button variant="outline" size="sm" onClick={downloadReport}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {!lastReport ? (
                  <div className="text-center text-muted-foreground py-8">
                    No report available. Run autopilot to generate.
                  </div>
                ) : (
                  <ScrollArea className="h-[400px]">
                    <pre className="text-sm font-mono bg-muted p-4 rounded-lg overflow-x-auto">
                      {JSON.stringify(lastReport, null, 2)}
                    </pre>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
