/**
 * Content Quality Dashboard
 * Admin interface for content quality and safety audits
 */

import { useState } from 'react';
import { AlertTriangle, CheckCircle, FileText, Shield, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { AdminButton } from '@/components/design-system/AdminButton';
import { SeverityBadge } from '@/components/design-system/SeverityBadge';
import { SectionHeader } from '@/design-system/components/SectionHeader';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface QualityIssue {
  roomId: string;
  issueType: string;
  severity: string;
  message: string;
  field: string;
}

interface SafetyIssue {
  roomId: string;
  issueType: string;
  severity: number;
  urgency: string;
  message: string;
  triggerWords?: string[];
  suggestedAction?: string;
}

export default function ContentQualityDashboard() {
  const [qualityLoading, setQualityLoading] = useState(false);
  const [safetyLoading, setSafetyLoading] = useState(false);
  const [qualityResults, setQualityResults] = useState<any>(null);
  const [safetyResults, setSafetyResults] = useState<any>(null);

  const runQualityAudit = async () => {
    setQualityLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('content-quality-audit', {
        body: {},
      });

      if (error) throw error;

      setQualityResults(data);
      toast.success(`Quality audit complete: ${data.issuesFound} issues found`);
    } catch (error: any) {
      console.error('Quality audit error:', error);
      toast.error(error.message || 'Failed to run quality audit');
    } finally {
      setQualityLoading(false);
    }
  };

  const runSafetyAudit = async () => {
    setSafetyLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('safety-audit', {
        body: {},
      });

      if (error) throw error;

      setSafetyResults(data);
      
      if (data.criticalIssues > 0) {
        toast.error(`Safety audit: ${data.criticalIssues} critical issues found!`, {
          duration: 10000,
        });
      } else {
        toast.success(`Safety audit complete: ${data.issuesFound} issues found`);
      }
    } catch (error: any) {
      console.error('Safety audit error:', error);
      toast.error(error.message || 'Failed to run safety audit');
    } finally {
      setSafetyLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8" data-admin-page="true">
      <div className="max-w-7xl mx-auto space-y-8">
        <SectionHeader
          title="Content Quality & Safety Dashboard"
          subtitle="Analyze and audit all room content for quality, safety, and consistency"
        />

        {/* Audit Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Quality Audit */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Content Quality Audit</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Checks tone, word count, keywords, bilingual quality, and structure
                </p>
                <AdminButton
                  variant="primary"
                  size="md"
                  loading={qualityLoading}
                  onClick={runQualityAudit}
                >
                  {qualityLoading ? 'Running Audit...' : 'Run Quality Audit'}
                </AdminButton>
              </div>
            </div>
          </div>

          {/* Safety Audit */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-lg">
                <Shield className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Safety Audit</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Detects crisis content, validates disclaimers, checks for harmful advice
                </p>
                <AdminButton
                  variant="danger"
                  size="md"
                  loading={safetyLoading}
                  onClick={runSafetyAudit}
                >
                  {safetyLoading ? 'Running Audit...' : 'Run Safety Audit'}
                </AdminButton>
              </div>
            </div>
          </div>
        </div>

        {/* Quality Results */}
        {qualityResults && (
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Quality Audit Results</h3>
              <SeverityBadge severity={qualityResults.issuesFound === 0 ? 'success' : 'warn'}>
                {qualityResults.issuesFound} Issues
              </SeverityBadge>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-muted rounded-lg p-4">
                <div className="text-2xl font-bold">{qualityResults.totalRooms}</div>
                <div className="text-sm text-muted-foreground">Total Rooms</div>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <div className="text-2xl font-bold">{qualityResults.issuesFound}</div>
                <div className="text-sm text-muted-foreground">Issues Found</div>
              </div>
              {Object.entries(qualityResults.summary).map(([type, count]) => (
                <div key={type} className="bg-muted rounded-lg p-4">
                  <div className="text-2xl font-bold">{count as number}</div>
                  <div className="text-sm text-muted-foreground capitalize">{type}</div>
                </div>
              ))}
            </div>

            {/* Issues List */}
            {qualityResults.issues.length > 0 && (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {qualityResults.issues.slice(0, 50).map((issue: QualityIssue, idx: number) => (
                  <div
                    key={idx}
                    className={cn(
                      "border rounded-lg p-3 text-sm",
                      issue.severity === 'high' && 'severity-error',
                      issue.severity === 'medium' && 'severity-warn',
                      issue.severity === 'low' && 'severity-info'
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="font-medium">{issue.roomId}</div>
                        <div className="text-muted-foreground">{issue.message}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Field: {issue.field} | Type: {issue.issueType}
                        </div>
                      </div>
                      <SeverityBadge severity={issue.severity as any}>
                        {issue.severity}
                      </SeverityBadge>
                    </div>
                  </div>
                ))}
                {qualityResults.issues.length > 50 && (
                  <div className="text-center text-sm text-muted-foreground">
                    Showing 50 of {qualityResults.issues.length} issues
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Safety Results */}
        {safetyResults && (
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Safety Audit Results</h3>
              <div className="flex gap-2">
                {safetyResults.criticalIssues > 0 && (
                  <SeverityBadge severity="error">
                    {safetyResults.criticalIssues} Critical
                  </SeverityBadge>
                )}
                <SeverityBadge severity={safetyResults.issuesFound === 0 ? 'success' : 'warn'}>
                  {safetyResults.issuesFound} Total Issues
                </SeverityBadge>
              </div>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-muted rounded-lg p-4">
                <div className="text-2xl font-bold">{safetyResults.totalRooms}</div>
                <div className="text-sm text-muted-foreground">Total Rooms</div>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {safetyResults.criticalIssues}
                </div>
                <div className="text-sm text-muted-foreground">Critical Issues</div>
              </div>
              {Object.entries(safetyResults.summary).map(([type, count]) => (
                <div key={type} className="bg-muted rounded-lg p-4">
                  <div className="text-2xl font-bold">{count as number}</div>
                  <div className="text-sm text-muted-foreground capitalize">{type}</div>
                </div>
              ))}
            </div>

            {/* Issues List */}
            {safetyResults.issues.length > 0 && (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {safetyResults.issues.slice(0, 50).map((issue: SafetyIssue, idx: number) => (
                  <div
                    key={idx}
                    className={cn(
                      "border rounded-lg p-3 text-sm",
                      issue.severity >= 4 && 'severity-error',
                      issue.severity === 3 && 'severity-warn',
                      issue.severity <= 2 && 'severity-info'
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="font-medium flex items-center gap-2">
                          {issue.severity >= 4 && <AlertTriangle className="h-4 w-4" />}
                          {issue.roomId}
                        </div>
                        <div className="text-muted-foreground">{issue.message}</div>
                        {issue.triggerWords && issue.triggerWords.length > 0 && (
                          <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                            Triggers: {issue.triggerWords.join(', ')}
                          </div>
                        )}
                        {issue.suggestedAction && (
                          <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                            → {issue.suggestedAction}
                          </div>
                        )}
                      </div>
                      <SeverityBadge
                        severity={issue.severity >= 4 ? 'error' : issue.severity === 3 ? 'warn' : 'info'}
                      >
                        Severity {issue.severity}
                      </SeverityBadge>
                    </div>
                  </div>
                ))}
                {safetyResults.issues.length > 50 && (
                  <div className="text-center text-sm text-muted-foreground">
                    Showing 50 of {safetyResults.issues.length} issues
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* No Results */}
        {!qualityResults && !safetyResults && (
          <div className="text-center py-12">
            <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Run an audit to see results</p>
          </div>
        )}
      </div>
    </div>
  );
}
