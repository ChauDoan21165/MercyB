/**
 * System Health Dashboard v1.0
 * 
 * Read-only overview powered by public/system-health.json
 * Run: npx tsx scripts/check-system-health.ts to generate snapshot
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Activity,
  ArrowLeft,
  Terminal
} from 'lucide-react';

type HealthStatus = 'healthy' | 'warning' | 'critical';

interface SubsystemHealth {
  id: string;
  label: string;
  status: HealthStatus;
  score: number;
  issues: string[];
  lastCheckedAt: string | null;
}

interface SystemHealthSnapshot {
  version: '1.0';
  generatedAt: string;
  subsystems: SubsystemHealth[];
}

export default function SystemHealthPage() {
  const [snapshot, setSnapshot] = useState<SystemHealthSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadHealth = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/system-health.json', { cache: 'no-store' });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = (await res.json()) as SystemHealthSnapshot;
      setSnapshot(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('Failed to load system health:', msg);
      setErrorMsg('Cannot load system health snapshot. Run check-system-health script.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHealth();
  }, []);

  const getStatusColor = (status: HealthStatus) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'critical':
        return 'text-red-600';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: HealthStatus) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'critical':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getStatusBadgeVariant = (status: HealthStatus): 'default' | 'secondary' | 'destructive' => {
    switch (status) {
      case 'healthy':
        return 'default';
      case 'warning':
        return 'secondary';
      case 'critical':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  // Calculate overall health
  const overallScore = snapshot 
    ? snapshot.subsystems.reduce((sum, s) => sum + s.score, 0) / snapshot.subsystems.length
    : 0;
  const overallStatus: HealthStatus = overallScore >= 95 ? 'healthy' : overallScore >= 80 ? 'warning' : 'critical';

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link to="/admin">
              <Button variant="ghost" size="sm" className="mb-2">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">System Health</h1>
            <p className="text-muted-foreground">
              Read-only snapshot of Mercy Blade subsystems
            </p>
          </div>
          <div className="flex items-center gap-3">
            {snapshot?.generatedAt && (
              <span className="text-xs text-muted-foreground">
                Generated: {new Date(snapshot.generatedAt).toLocaleString()}
              </span>
            )}
            <Button variant="outline" size="sm" onClick={loadHealth} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Error message */}
        {errorMsg && (
          <Card className="border-destructive/50 bg-destructive/10">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
                <div className="space-y-2">
                  <p className="text-sm text-destructive font-medium">{errorMsg}</p>
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-xs text-muted-foreground mb-1">Run this command to generate:</p>
                    <code className="text-xs font-mono flex items-center gap-2">
                      <Terminal className="w-3 h-3" />
                      npx tsx scripts/check-system-health.ts
                    </code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* No data yet */}
        {!snapshot && !errorMsg && (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              {isLoading
                ? 'Loading system health...'
                : 'No system health snapshot found.'}
            </CardContent>
          </Card>
        )}

        {/* Subsystem cards */}
        {snapshot && (
          <>
            {/* Overall status */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(overallStatus)}
                    <div>
                      <p className="text-sm text-muted-foreground">Overall System Health</p>
                      <p className={`text-3xl font-bold ${getStatusColor(overallStatus)}`}>
                        {overallScore.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <Badge variant={getStatusBadgeVariant(overallStatus)} className="text-lg px-4 py-2">
                    {overallStatus.toUpperCase()}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Subsystem cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {snapshot.subsystems.map((subsys) => (
                <Card key={subsys.id}>
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-sm font-medium">
                        {subsys.label}
                      </CardTitle>
                      {subsys.lastCheckedAt && (
                        <CardDescription className="text-xs">
                          Checked: {new Date(subsys.lastCheckedAt).toLocaleString()}
                        </CardDescription>
                      )}
                    </div>
                    <Badge variant={getStatusBadgeVariant(subsys.status)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(subsys.status)}
                        <span className="capitalize">{subsys.status}</span>
                      </span>
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-baseline justify-between">
                        <span className={`text-2xl font-bold ${getStatusColor(subsys.status)}`}>
                          {subsys.score.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={subsys.score} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Issues panel */}
            <Card>
              <CardHeader>
                <CardTitle>Issues</CardTitle>
                <CardDescription>
                  Top messages from each subsystem (max 10 per subsystem)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[320px]">
                  <div className="space-y-4">
                    {snapshot.subsystems.map((subsys) => (
                      <div key={subsys.id} className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{subsys.label}</span>
                          <Badge variant={getStatusBadgeVariant(subsys.status)}>
                            <span className="capitalize">{subsys.status}</span>
                          </Badge>
                        </div>
                        {subsys.issues.length === 0 ? (
                          <p className="text-xs text-muted-foreground">No issues reported.</p>
                        ) : (
                          <ul className="text-xs text-muted-foreground list-disc pl-5 space-y-1">
                            {subsys.issues.map((issue, idx) => (
                              <li key={idx}>{issue}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Quick links */}
            <Card>
              <CardHeader>
                <CardTitle>Related Tools</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Link to="/admin/audio-autopilot">
                  <Button variant="outline" size="sm">Audio Autopilot</Button>
                </Link>
                <Link to="/admin/audio-coverage">
                  <Button variant="outline" size="sm">Audio Coverage</Button>
                </Link>
                <Link to="/admin/health-dashboard">
                  <Button variant="outline" size="sm">Room Health</Button>
                </Link>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
