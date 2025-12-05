/**
 * Audio Autopilot Admin Dashboard v4.4
 * Full autonomous audio management command center
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
  Pause, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  FileAudio,
  GitBranch,
  Shield,
  Clock,
  BarChart3,
  Download,
  Terminal,
} from 'lucide-react';
import { toast } from 'sonner';
import type { 
  AutopilotStatusStore, 
  AutopilotReport, 
  StructuredChangeSet,
} from '@/lib/audio/autopilotEngine';
import type { GovernanceDecision } from '@/lib/audio/audioGovernanceEngine';

export default function AudioAutopilot() {
  const [isLoading, setIsLoading] = useState(false);
  const [autopilotStatus, setAutopilotStatus] = useState<AutopilotStatusStore | null>(null);
  const [lastReport, setLastReport] = useState<AutopilotReport | null>(null);
  const [changeSet, setChangeSet] = useState<StructuredChangeSet | null>(null);
  const [governanceLog, setGovernanceLog] = useState<GovernanceDecision[]>([]);
  const [isDryRun, setIsDryRun] = useState(true);

  useEffect(() => {
    loadAutopilotStatus();
  }, []);

  const loadAutopilotStatus = async () => {
    try {
      const response = await fetch('/audio/autopilot-status.json');
      if (response.ok) {
        const status = await response.json();
        setAutopilotStatus(status);
        if (status.governanceDecisions) {
          setGovernanceLog(status.governanceDecisions);
        }
      }
    } catch (error) {
      console.log('No autopilot status file found');
    }
  };

  const runSimulation = async () => {
    setIsLoading(true);
    toast.info('Running autopilot simulation (dry-run)...');
    
    // Simulate the autopilot cycle
    setTimeout(() => {
      const mockReport: AutopilotReport = {
        cycleId: `simulation-${Date.now()}`,
        timestamp: new Date().toISOString(),
        summary: {
          integrityBefore: 87,
          integrityAfter: 94,
          integrityDelta: 7,
          totalRooms: 150,
          roomsFixed: 23,
          totalOperations: 45,
          appliedOperations: 0,
          blockedOperations: 3,
          passedGovernance: true,
        },
        stages: [
          { name: 'scan', status: 'success', duration: '234ms', details: '150 rooms scanned' },
          { name: 'repair', status: 'success', duration: '156ms', details: '42 repairs identified' },
          { name: 'generate-missing', status: 'skipped', duration: '12ms', details: 'TTS stubbed' },
          { name: 'semantic-attach', status: 'success', duration: '89ms', details: '5 orphans matched' },
          { name: 'rebuild-manifest', status: 'success', duration: '45ms', details: 'Manifest updated' },
          { name: 'integrity-eval', status: 'success', duration: '67ms', details: '94% integrity' },
          { name: 'governance-eval', status: 'partial', duration: '23ms', details: '3 blocked' },
          { name: 'report', status: 'success', duration: '12ms', details: 'Report generated' },
        ],
        lowestIntegrityRooms: [
          { roomId: 'stress-relief-vip2', score: 65 },
          { roomId: 'anxiety-management-vip3', score: 72 },
          { roomId: 'sleep-better-vip1', score: 78 },
        ],
        violations: [
          { code: 'CROSS_ROOM', severity: 'warning', message: 'Cross-room attachment blocked' },
        ],
        recommendations: [
          'Review 3 blocked operations manually',
          'Consider regenerating audio for stress-relief-vip2',
        ],
      };
      
      setLastReport(mockReport);
      setIsLoading(false);
      toast.success('Simulation complete! Review results below.');
    }, 2000);
  };

  const downloadReport = () => {
    if (!lastReport) return;
    
    const blob = new Blob([JSON.stringify(lastReport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `autopilot-report-${lastReport.cycleId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadChangeSet = () => {
    if (!changeSet) return;
    
    const blob = new Blob([JSON.stringify(changeSet, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `changeset-${changeSet.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Audio Autopilot v4.4</h1>
            <p className="text-muted-foreground">Full autonomous audio management</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={autopilotStatus?.enabled ? 'default' : 'secondary'}>
              {autopilotStatus?.enabled ? 'Enabled' : 'Disabled'}
            </Badge>
            <Button variant="outline" size="sm" onClick={loadAutopilotStatus}>
              <RefreshCw className="w-4 h-4 mr-2" />
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
                  {autopilotStatus?.lastRun 
                    ? new Date(autopilotStatus.lastRun).toLocaleString()
                    : 'Never'}
                </span>
              </div>
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
                  <span className="text-2xl font-bold">
                    {autopilotStatus?.integrityAfter || 0}%
                  </span>
                  {autopilotStatus?.integrityAfter && autopilotStatus.integrityBefore && (
                    <Badge variant={autopilotStatus.integrityAfter >= autopilotStatus.integrityBefore ? 'default' : 'destructive'}>
                      {autopilotStatus.integrityAfter >= autopilotStatus.integrityBefore ? '+' : ''}
                      {autopilotStatus.integrityAfter - autopilotStatus.integrityBefore}%
                    </Badge>
                  )}
                </div>
                <Progress value={autopilotStatus?.integrityAfter || 0} className="h-2" />
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
                <span className="text-2xl font-bold">{autopilotStatus?.fixesApplied || 0}</span>
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
                <span className="text-2xl font-bold">{autopilotStatus?.blockedChanges || 0}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="simulate" className="space-y-4">
          <TabsList>
            <TabsTrigger value="simulate">
              <Play className="w-4 h-4 mr-2" />
              Simulate
            </TabsTrigger>
            <TabsTrigger value="governance">
              <Shield className="w-4 h-4 mr-2" />
              Governance Log
            </TabsTrigger>
            <TabsTrigger value="report">
              <BarChart3 className="w-4 h-4 mr-2" />
              Last Report
            </TabsTrigger>
            <TabsTrigger value="violations">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Cross-Room Violations
            </TabsTrigger>
          </TabsList>

          {/* Simulate Tab */}
          <TabsContent value="simulate">
            <Card>
              <CardHeader>
                <CardTitle>Simulate Autopilot</CardTitle>
                <CardDescription>
                  Run a dry-run simulation to preview what the autopilot would do
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Button 
                    onClick={runSimulation} 
                    disabled={isLoading}
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Running...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Run Simulation (Dry-Run)
                      </>
                    )}
                  </Button>
                  
                  <Button variant="outline" disabled>
                    <GitBranch className="w-4 h-4 mr-2" />
                    Trigger CI Workflow
                  </Button>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">CLI Commands</h4>
                  <div className="space-y-2 font-mono text-sm">
                    <div className="bg-background p-2 rounded">
                      <code>npm run audio:check</code>
                      <span className="text-muted-foreground ml-4"># Dry-run check</span>
                    </div>
                    <div className="bg-background p-2 rounded">
                      <code>npm run audio:fix</code>
                      <span className="text-muted-foreground ml-4"># Apply fixes</span>
                    </div>
                  </div>
                </div>

                {lastReport && (
                  <div className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Simulation Results</h4>
                      <Button variant="outline" size="sm" onClick={downloadReport}>
                        <Download className="w-4 h-4 mr-2" />
                        Download Report
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-muted rounded">
                        <div className="text-2xl font-bold">{lastReport.summary.integrityBefore}%</div>
                        <div className="text-sm text-muted-foreground">Before</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded">
                        <div className="text-2xl font-bold text-green-600">{lastReport.summary.integrityAfter}%</div>
                        <div className="text-sm text-muted-foreground">After</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded">
                        <div className="text-2xl font-bold">{lastReport.summary.appliedOperations}</div>
                        <div className="text-sm text-muted-foreground">Would Apply</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded">
                        <div className="text-2xl font-bold text-red-600">{lastReport.summary.blockedOperations}</div>
                        <div className="text-sm text-muted-foreground">Blocked</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h5 className="font-medium text-sm">Stages</h5>
                      {lastReport.stages.map((stage, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          {stage.status === 'success' ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : stage.status === 'skipped' ? (
                            <Pause className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-yellow-500" />
                          )}
                          <span className="font-mono">{stage.name}</span>
                          <span className="text-muted-foreground">({stage.duration})</span>
                        </div>
                      ))}
                    </div>
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
                      {governanceLog.map((decision, i) => (
                        <div 
                          key={i} 
                          className={`p-3 rounded-lg border ${
                            decision.decision === 'block' 
                              ? 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950'
                              : decision.decision === 'auto-approve'
                              ? 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950'
                              : 'border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <Badge variant={
                              decision.decision === 'block' ? 'destructive' :
                              decision.decision === 'auto-approve' ? 'default' : 'secondary'
                            }>
                              {decision.decision}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {Math.round(decision.confidence * 100)}% confidence
                            </span>
                          </div>
                          <div className="mt-2 text-sm">
                            <div><strong>Operation:</strong> {decision.operation.type}</div>
                            <div className="font-mono text-xs truncate">
                              {decision.operation.source} → {decision.operation.target}
                            </div>
                            <div className="text-muted-foreground mt-1">{decision.reason}</div>
                          </div>
                          {decision.violations.length > 0 && (
                            <div className="mt-2">
                              {decision.violations.map((v, vi) => (
                                <Badge key={vi} variant="outline" className="mr-1 text-xs">
                                  {v}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Last Report Tab */}
          <TabsContent value="report">
            <Card>
              <CardHeader>
                <CardTitle>Last Autopilot Report</CardTitle>
                <CardDescription>
                  Detailed report from the most recent autopilot cycle
                </CardDescription>
              </CardHeader>
              <CardContent>
                {lastReport ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-mono text-sm">{lastReport.cycleId}</div>
                        <div className="text-muted-foreground text-sm">
                          {new Date(lastReport.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={downloadReport}>
                        <Download className="w-4 h-4 mr-2" />
                        Download JSON
                      </Button>
                    </div>

                    {lastReport.lowestIntegrityRooms.length > 0 && (
                      <div>
                        <h5 className="font-medium mb-2">Lowest Integrity Rooms</h5>
                        <div className="space-y-1">
                          {lastReport.lowestIntegrityRooms.map((room, i) => (
                            <div key={i} className="flex items-center justify-between p-2 bg-muted rounded">
                              <span className="font-mono text-sm">{room.roomId}</span>
                              <Badge variant={room.score < 80 ? 'destructive' : 'secondary'}>
                                {room.score}%
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {lastReport.recommendations.length > 0 && (
                      <div>
                        <h5 className="font-medium mb-2">Recommendations</h5>
                        <ul className="list-disc list-inside space-y-1">
                          {lastReport.recommendations.map((rec, i) => (
                            <li key={i} className="text-sm text-muted-foreground">{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    No report available. Run a simulation first.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cross-Room Violations Tab */}
          <TabsContent value="violations">
            <Card>
              <CardHeader>
                <CardTitle>Cross-Room Violations</CardTitle>
                <CardDescription>
                  Audio files that may belong to different rooms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center text-muted-foreground py-8">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
                  <p>Run the autopilot simulation to detect cross-room violations</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Force Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Force Actions</CardTitle>
            <CardDescription>
              Manual override controls for specific operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" disabled>
                <FileAudio className="w-4 h-4 mr-2" />
                Force Regenerate Missing Audio
              </Button>
              <Button variant="outline" disabled>
                <RefreshCw className="w-4 h-4 mr-2" />
                Force Rebuild Manifest
              </Button>
              <Button variant="outline" disabled>
                <Terminal className="w-4 h-4 mr-2" />
                View Raw Logs
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
