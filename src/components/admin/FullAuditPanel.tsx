import { useState } from 'react';
import { useStabilityAudit } from '@/hooks/useStabilityAudit';
import { useDesignTokenAudit } from '@/hooks/useDesignTokenAudit';
import { useUiUxAudit } from '@/hooks/useUiUxAudit';
import { useJsonStructureAudit } from '@/hooks/useJsonStructureAudit';
import { usePerformanceAudit } from '@/hooks/usePerformanceAudit';
import { useCrossLanguageAudit } from '@/hooks/useCrossLanguageAudit';
import { useLaunchReadinessAudit } from '@/hooks/useLaunchReadinessAudit';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, AlertTriangle, SkipForward, Play, Loader2, Zap } from 'lucide-react';

const statusConfig = {
  pass: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
  fail: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
  warn: { icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  skip: { icon: SkipForward, color: 'text-gray-500', bg: 'bg-gray-100' },
};

interface AuditPanelProps {
  roomId?: string;
}

export function FullAuditPanel({ roomId }: AuditPanelProps) {
  const stability = useStabilityAudit();
  const design = useDesignTokenAudit();
  const uiux = useUiUxAudit(roomId);
  const jsonStructure = useJsonStructureAudit();
  const performance = usePerformanceAudit();
  const crossLanguage = useCrossLanguageAudit();
  const launchReadiness = useLaunchReadinessAudit();
  const [activeTab, setActiveTab] = useState('all');

  const runAllAudits = async () => {
    await Promise.all([
      stability.runAudit(),
      design.runAudit(),
      uiux.runAudit(),
      jsonStructure.runAudit(),
      performance.runAudit(),
      crossLanguage.runAudit(),
      launchReadiness.runAudit(),
    ]);
  };

  const isRunning = stability.isRunning || design.isRunning || uiux.isRunning || 
    jsonStructure.isRunning || performance.isRunning || crossLanguage.isRunning || launchReadiness.isRunning;

  // Convert old format to new unified format
  const stabilityResults = stability.result?.issues.map(i => ({
    id: i.id,
    name: i.check,
    status: i.severity === 'error' ? 'fail' : i.severity === 'warning' ? 'warn' : 'pass',
    message: i.message,
    source: 'stability'
  })) || [];

  const designResults = design.result?.issues.map(i => ({
    id: i.id,
    name: i.check,
    status: i.severity === 'error' ? 'fail' : i.severity === 'warning' ? 'warn' : 'pass',
    message: i.message,
    source: 'design'
  })) || [];

  const uiuxResults = uiux.result?.issues.map(i => ({
    id: i.id,
    name: i.check,
    status: i.severity === 'error' ? 'fail' : i.severity === 'warning' ? 'warn' : 'pass',
    message: i.message,
    source: 'uiux'
  })) || [];

  const jsonResults = jsonStructure.results.map(r => ({ ...r, source: 'json' }));
  const perfResults = performance.results.map(r => ({ ...r, source: 'performance' }));
  const langResults = crossLanguage.results.map(r => ({ ...r, source: 'language' }));
  const launchResults = launchReadiness.results.map(r => ({ ...r, source: 'launch' }));

  const allResults = [
    ...stabilityResults,
    ...designResults,
    ...uiuxResults,
    ...jsonResults,
    ...perfResults,
    ...langResults,
    ...launchResults,
  ];

  const totalPassed = allResults.filter(r => r.status === 'pass').length;
  const totalFailed = allResults.filter(r => r.status === 'fail').length;
  const totalWarnings = allResults.filter(r => r.status === 'warn').length;
  const totalSkipped = allResults.filter(r => r.status === 'skip').length;

  const renderResults = (results: typeof allResults, filter?: string) => {
    const filtered = filter === 'issues' 
      ? results.filter(r => r.status === 'fail' || r.status === 'warn')
      : results;
    
    return (
      <div className="space-y-2 max-h-[500px] overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="text-muted-foreground text-sm">No results to display</p>
        ) : (
          filtered.map((result, idx) => {
            const config = statusConfig[result.status as keyof typeof statusConfig] || statusConfig.skip;
            const Icon = config.icon;
            return (
              <div
                key={`${result.id}-${idx}`}
                className={`flex items-start gap-3 p-2 rounded-md ${config.bg} bg-opacity-50`}
              >
                <Icon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${config.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{result.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{result.message}</p>
                </div>
                <Badge variant="outline" className="text-xs flex-shrink-0">
                  {result.source}
                </Badge>
              </div>
            );
          })
        )}
      </div>
    );
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Full System Audit (210 Checks)
          </CardTitle>
          <Button 
            onClick={runAllAudits} 
            disabled={isRunning}
            size="sm"
          >
            {isRunning ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Running...</>
            ) : (
              <><Play className="mr-2 h-4 w-4" /> Run All Audits</>
            )}
          </Button>
        </div>
        
        {allResults.length > 0 && (
          <div className="flex gap-2 mt-2 flex-wrap">
            <Badge variant="outline" className="bg-green-100 text-green-800">
              {totalPassed} Passed
            </Badge>
            <Badge variant="outline" className="bg-red-100 text-red-800">
              {totalFailed} Failed
            </Badge>
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
              {totalWarnings} Warnings
            </Badge>
            <Badge variant="outline" className="bg-gray-100 text-gray-600">
              {totalSkipped} Skipped
            </Badge>
            <Badge variant="outline" className="bg-blue-100 text-blue-800">
              {allResults.length} Total
            </Badge>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {allResults.length === 0 && !isRunning && (
          <p className="text-muted-foreground text-sm">
            Click "Run All Audits" to evaluate 210 checks across 7 categories.
          </p>
        )}

        {allResults.length > 0 && (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4 flex-wrap h-auto gap-1">
              <TabsTrigger value="all">All ({allResults.length})</TabsTrigger>
              <TabsTrigger value="issues">Issues ({totalFailed + totalWarnings})</TabsTrigger>
              <TabsTrigger value="stability">Stability ({stabilityResults.length})</TabsTrigger>
              <TabsTrigger value="design">Design ({designResults.length})</TabsTrigger>
              <TabsTrigger value="uiux">UI/UX ({uiuxResults.length})</TabsTrigger>
              <TabsTrigger value="json">JSON ({jsonResults.length})</TabsTrigger>
              <TabsTrigger value="performance">Perf ({perfResults.length})</TabsTrigger>
              <TabsTrigger value="language">Lang ({langResults.length})</TabsTrigger>
              <TabsTrigger value="launch">Launch ({launchResults.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all">{renderResults(allResults)}</TabsContent>
            <TabsContent value="issues">{renderResults(allResults, 'issues')}</TabsContent>
            <TabsContent value="stability">{renderResults(stabilityResults)}</TabsContent>
            <TabsContent value="design">{renderResults(designResults)}</TabsContent>
            <TabsContent value="uiux">{renderResults(uiuxResults)}</TabsContent>
            <TabsContent value="json">{renderResults(jsonResults)}</TabsContent>
            <TabsContent value="performance">{renderResults(perfResults)}</TabsContent>
            <TabsContent value="language">{renderResults(langResults)}</TabsContent>
            <TabsContent value="launch">{renderResults(launchResults)}</TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
