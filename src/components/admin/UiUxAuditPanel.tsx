import { useState } from 'react';
import { useUiUxAudit, UiUxIssue } from '@/hooks/useUiUxAudit';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, Info, Play, Loader2 } from 'lucide-react';

interface UiUxAuditPanelProps {
  roomId?: string;
}

const severityConfig = {
  pass: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
  error: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
  warning: { icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  info: { icon: Info, color: 'text-blue-600', bg: 'bg-blue-100' },
};

export function UiUxAuditPanel({ roomId }: UiUxAuditPanelProps) {
  const { result, isRunning, runAudit } = useUiUxAudit(roomId);
  const [filter, setFilter] = useState<'all' | 'issues'>('all');

  const filteredIssues = result?.issues.filter(i => 
    filter === 'all' || i.severity !== 'pass'
  ) || [];

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold">UI/UX Audit (30 Checks)</CardTitle>
          <Button 
            onClick={() => runAudit()} 
            disabled={isRunning}
            size="sm"
            variant="outline"
          >
            {isRunning ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Running...</>
            ) : (
              <><Play className="mr-2 h-4 w-4" /> Run Audit</>
            )}
          </Button>
        </div>
        
        {result && (
          <div className="flex gap-2 mt-2">
            <Badge variant="outline" className="bg-green-100 text-green-800">
              {result.passed} Passed
            </Badge>
            <Badge variant="outline" className="bg-red-100 text-red-800">
              {result.failed} Errors
            </Badge>
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
              {result.warnings} Warnings
            </Badge>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {!result && !isRunning && (
          <p className="text-muted-foreground text-sm">
            Click "Run Audit" to evaluate 30 UI/UX checks in parallel.
          </p>
        )}

        {result && (
          <>
            <div className="flex gap-2 mb-4">
              <Button
                size="sm"
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
              >
                All ({result.issues.length})
              </Button>
              <Button
                size="sm"
                variant={filter === 'issues' ? 'default' : 'outline'}
                onClick={() => setFilter('issues')}
              >
                Issues Only ({result.failed + result.warnings})
              </Button>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredIssues.map((issue, idx) => {
                const config = severityConfig[issue.severity];
                const Icon = config.icon;
                return (
                  <div
                    key={`${issue.id}-${idx}`}
                    className={`flex items-start gap-3 p-2 rounded-md ${config.bg} bg-opacity-50`}
                  >
                    <Icon className={`h-4 w-4 mt-0.5 ${config.color}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{issue.check}</p>
                      <p className="text-xs text-muted-foreground truncate">{issue.message}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {issue.severity}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
