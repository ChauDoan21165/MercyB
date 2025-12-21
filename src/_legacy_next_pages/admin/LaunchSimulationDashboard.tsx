import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, PlayCircle, CheckCircle2, XCircle, AlertCircle, Download } from 'lucide-react';
import { AdminButton } from '@/components/design-system/AdminButton';
import { runFullSimulation } from '@/simulator/runFullSimulation';
import type { LaunchReport } from '@/simulator/LaunchReportBuilder';

export default function LaunchSimulationDashboard() {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<LaunchReport | null>(null);

  const runSimulation = async () => {
    setLoading(true);
    try {
      const result = await runFullSimulation();
      setReport(result.report);
    } catch (error) {
      console.error('Simulation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadJSON = () => {
    if (!report) return;
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `launch-report-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Launch Simulation Dashboard</h1>
        <p className="text-muted-foreground">
          Run comprehensive pre-launch simulations to test app stability
        </p>
      </div>

      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-1">Full System Simulation</h2>
            <p className="text-sm text-muted-foreground">
              Tests room loading, tier boundaries, audio stress, corrupted data, and more
            </p>
          </div>
          <div className="flex gap-2">
            {report && (
              <AdminButton variant="secondary" onClick={downloadJSON}>
                <Download className="h-4 w-4 mr-2" />
                Export JSON
              </AdminButton>
            )}
            <AdminButton onClick={runSimulation} disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <PlayCircle className="h-4 w-4 mr-2" />
              )}
              Run Simulation
            </AdminButton>
          </div>
        </div>
      </Card>

      {loading && (
        <Card className="p-12">
          <div className="text-center">
            <Loader2 className="h-16 w-16 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-lg font-medium">Running simulation...</p>
            <p className="text-sm text-muted-foreground mt-2">
              This may take a few minutes
            </p>
          </div>
        </Card>
      )}

      {!loading && report && (
        <>
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Summary</h2>
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-3xl font-bold">{report.summary.totalScenarios}</div>
                <div className="text-sm text-muted-foreground mt-1">Total Scenarios</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-3xl font-bold text-green-600">{report.summary.passedScenarios}</div>
                <div className="text-sm text-muted-foreground mt-1">Passed</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-3xl font-bold text-red-600">{report.summary.failedScenarios}</div>
                <div className="text-sm text-muted-foreground mt-1">Failed</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-3xl font-bold">{(report.summary.totalDuration / 1000).toFixed(1)}s</div>
                <div className="text-sm text-muted-foreground mt-1">Duration</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              {report.summary.passed ? (
                <>
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                  <span className="text-2xl font-bold text-green-600">ALL TESTS PASSED</span>
                </>
              ) : (
                <>
                  <XCircle className="h-8 w-8 text-red-600" />
                  <span className="text-2xl font-bold text-red-600">TESTS FAILED</span>
                </>
              )}
            </div>
          </Card>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold mb-3">Scenario Results</h2>
            {report.scenarios.map((scenario, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      {scenario.passed ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <div>
                        <p className="font-medium">{scenario.name}</p>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                          <span>⏱️ {(scenario.duration / 1000).toFixed(2)}s</span>
                          <span>✅ {scenario.assertions.passed}/{scenario.assertions.total} assertions</span>
                          {scenario.warnings > 0 && (
                            <span className="text-yellow-600">⚠️ {scenario.warnings} warnings</span>
                          )}
                          {scenario.errors > 0 && (
                            <span className="text-red-600">❌ {scenario.errors} errors</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Badge variant={scenario.passed ? "default" : "destructive"}>
                    {scenario.passed ? 'PASSED' : 'FAILED'}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-6 text-sm text-muted-foreground">
            Generated: {new Date(report.timestamp).toLocaleString()}
          </div>
        </>
      )}
    </div>
  );
}
