import { useState } from 'react';
import { useStabilityAudit } from '@/hooks/useStabilityAudit';
import { useDesignTokenAudit } from '@/hooks/useDesignTokenAudit';
import { useUiUxAudit } from '@/hooks/useUiUxAudit';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, AlertTriangle, Info, Play, Loader2, Zap } from 'lucide-react';

const severityConfig = {
  pass: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
  error: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
  warning: { icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  info: { icon: Info, color: 'text-blue-600', bg: 'bg-blue-100' },
};

interface AuditPanelProps {
  roomId?: string;
}

export function FullAuditPanel({ roomId }: AuditPanelProps) {
  const stability = useStabilityAudit();
  const design = useDesignTokenAudit();
  const uiux = useUiUxAudit(roomId);
  const [activeTab, setActiveTab] = useState('all');

  const runAllAudits = async () => {
    await Promise.all([
      stability.runAudit(),
      design.runAudit(),
      uiux.runAudit(),
    ]);
  };

  const isRunning = stability.isRunning || design.isRunning || uiux.isRunning;

  const allIssues = [
    ...(stability.result?.issues.map(i => ({ ...i, source: 'stability' })) || []),
    ...(design.result?.issues.map(i => ({ ...i, source: 'design' })) || []),
    ...(uiux.result?.issues.map(i => ({ ...i, source: 'uiux' })) || []),
  ];

  const totalPassed = (stability.result?.passed || 0) + (design.result?.passed || 0) + (uiux.result?.passed || 0);
  const totalFailed = (stability.result?.failed || 0) + (design.result?.failed || 0) + (uiux.result?.failed || 0);
  const totalWarnings = (stability.result?.warnings || 0) + (design.result?.warnings || 0) + (uiux.result?.warnings || 0);

  const renderIssues = (issues: typeof allIssues, filter?: string) => {
    const filtered = filter === 'issues' 
      ? issues.filter(i => i.severity !== 'pass')
      : issues;
    
    return (
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="text-muted-foreground text-sm">No issues to display</p>
        ) : (
          filtered.map((issue, idx) => {
            const config = severityConfig[issue.severity];
            const Icon = config.icon;
            return (
              <div
                key={`${issue.id}-${idx}`}
                className={`flex items-start gap-3 p-2 rounded-md ${config.bg} bg-opacity-50`}
              >
                <Icon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${config.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{issue.check}</p>
                  <p className="text-xs text-muted-foreground truncate">{issue.message}</p>
                </div>
                <Badge variant="outline" className="text-xs flex-shrink-0">
                  {issue.source}
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
            Full System Audit (90 Checks)
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
        
        {allIssues.length > 0 && (
          <div className="flex gap-2 mt-2 flex-wrap">
            <Badge variant="outline" className="bg-green-100 text-green-800">
              {totalPassed} Passed
            </Badge>
            <Badge variant="outline" className="bg-red-100 text-red-800">
              {totalFailed} Errors
            </Badge>
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
              {totalWarnings} Warnings
            </Badge>
            <Badge variant="outline" className="bg-blue-100 text-blue-800">
              {allIssues.length} Total
            </Badge>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {allIssues.length === 0 && !isRunning && (
          <p className="text-muted-foreground text-sm">
            Click "Run All Audits" to evaluate 90 checks across stability, design tokens, and UI/UX.
          </p>
        )}

        {allIssues.length > 0 && (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All ({allIssues.length})</TabsTrigger>
              <TabsTrigger value="issues">Issues ({totalFailed + totalWarnings})</TabsTrigger>
              <TabsTrigger value="stability">Stability ({stability.result?.issues.length || 0})</TabsTrigger>
              <TabsTrigger value="design">Design ({design.result?.issues.length || 0})</TabsTrigger>
              <TabsTrigger value="uiux">UI/UX ({uiux.result?.issues.length || 0})</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              {renderIssues(allIssues)}
            </TabsContent>
            <TabsContent value="issues">
              {renderIssues(allIssues, 'issues')}
            </TabsContent>
            <TabsContent value="stability">
              {renderIssues(stability.result?.issues.map(i => ({ ...i, source: 'stability' })) || [])}
            </TabsContent>
            <TabsContent value="design">
              {renderIssues(design.result?.issues.map(i => ({ ...i, source: 'design' })) || [])}
            </TabsContent>
            <TabsContent value="uiux">
              {renderIssues(uiux.result?.issues.map(i => ({ ...i, source: 'uiux' })) || [])}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
