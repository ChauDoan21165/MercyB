import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Shield,
  Play,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Search,
  Wrench,
  FileJson,
  Music,
  Database,
  Filter,
  RefreshCw,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { AuditIssue, AuditResponse, AuditMode } from "@/lib/audit-v4-types";

type FilterType = "all" | "errors" | "missing_audio" | "missing_json" | "missing_entries";

export default function AuditSafeShield() {
  const [isRunning, setIsRunning] = useState(false);
  const [isRepairing, setIsRepairing] = useState(false);
  const [issues, setIssues] = useState<AuditIssue[]>([]);
  const [progress, setProgress] = useState(0);
  const [repairProgress, setRepairProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState({
    totalRooms: 0,
    scanned: 0,
    errors: 0,
    warnings: 0,
    fixed: 0,
  });
  const abortRef = useRef(false);
  const { toast } = useToast();

  // Helper to check both camelCase and snake_case from backend
  const isAutoFixable = (issue: AuditIssue) =>
    (issue as any).autoFixable || (issue as any).auto_fixable;

  // Call backend audit endpoint
  const callAuditEndpoint = async (mode: AuditMode): Promise<AuditResponse | null> => {
    const { data, error } = await supabase.functions.invoke("audit-v4-safe-shield", {
      body: { mode },
    });

    if (error) {
      throw new Error(error.message || "Failed to call audit endpoint");
    }

    return data as AuditResponse;
  };

  const runAudit = async () => {
    setIsRunning(true);
    setIssues([]);
    setProgress(0);
    setStats({ totalRooms: 0, scanned: 0, errors: 0, warnings: 0, fixed: 0 });
    abortRef.current = false;

    try {
      setCurrentTask("Running audit via backend...");
      setProgress(20);

      const response = await callAuditEndpoint("dry-run");

      if (!response?.ok) {
        throw new Error(response?.error || "Audit failed");
      }

      setProgress(80);
      setCurrentTask("Processing results...");

      // Update state from backend response
      setIssues(response.issues || []);
      setStats({
        totalRooms: response.summary.totalRooms,
        scanned: response.summary.scannedRooms,
        errors: response.summary.errors,
        warnings: response.summary.warnings,
        fixed: response.summary.fixed,
      });

      setProgress(100);
      setCurrentTask("Audit complete");

    } catch (error) {
      console.error("Audit error:", error);
      toast({
        title: "Audit Error",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const stopAudit = () => {
    abortRef.current = true;
    setIsRunning(false);
    setCurrentTask("Audit stopped");
  };

  // Filter issues
  const filteredIssues = issues.filter((issue) => {
    // Search filter
    if (search && !issue.file.toLowerCase().includes(search.toLowerCase()) &&
        !issue.message.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }

    // Type filter
    switch (filter) {
      case "errors":
        return issue.severity === "error";
      case "missing_audio":
        return issue.type === "missing_audio";
      case "missing_json":
        return issue.type === "missing_json" || issue.type === "missing_db";
      case "missing_entries":
        return issue.type === "missing_entries";
      default:
        return true;
    }
  });

  // Count auto-fixable from ALL issues, not just filtered
  const autoFixableCount = issues.filter(isAutoFixable).length;

  const handleAutoRepair = async () => {
    if (autoFixableCount === 0) {
      toast({
        title: "Nothing to repair",
        description: "No auto-fixable issues found. Run an audit first.",
      });
      return;
    }

    setIsRepairing(true);
    setRepairProgress(0);
    setCurrentTask("Running Safe Shield repairs via backend...");

    try {
      setRepairProgress(20);
      
      // Call backend with repair mode
      const response = await callAuditEndpoint("repair");

      if (!response?.ok) {
        throw new Error(response?.error || "Auto-repair failed");
      }

      setRepairProgress(80);
      setCurrentTask("Processing repair results...");

      // Log backend repair actions
      if (response.logs && response.logs.length > 0) {
        console.log("[Auto-Repair Logs]", response.logs);
      }

      setRepairProgress(100);
      setCurrentTask("Repair complete");

      // Update stats
      setStats(prev => ({ ...prev, fixed: response.fixesApplied || 0 }));

      toast({
        title: "Auto-Repair Complete",
        description: `Fixed ${response.fixesApplied || 0} issues. Safe mode: no deletions performed.`,
      });

      // Re-run audit to refresh the issues list
      setIsRepairing(false);
      await runAudit();

    } catch (error) {
      console.error("Auto-repair error:", error);
      toast({
        title: "Auto-Repair Failed",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
    } finally {
      setIsRepairing(false);
      setCurrentTask("");
    }
  };

  const severityColors = {
    error: "bg-red-100 text-red-800 border-red-200",
    warning: "bg-amber-100 text-amber-800 border-amber-200",
    info: "bg-blue-100 text-blue-800 border-blue-200",
  };

  const typeIcons: Record<string, React.ReactNode> = {
    missing_json: <FileJson className="h-4 w-4" />,
    missing_audio: <Music className="h-4 w-4" />,
    missing_db: <Database className="h-4 w-4" />,
    missing_entries: <AlertTriangle className="h-4 w-4" />,
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-black" />
            <div>
              <h1 className="text-2xl font-bold text-black">
                Full System Sync Auditor
              </h1>
              <p className="text-gray-600 text-sm">
                Safe Shield Edition — Cross-system sync check (GitHub, Database, Registry)
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {isRunning ? (
              <Button onClick={stopAudit} variant="outline" className="border-black">
                Stop
              </Button>
            ) : (
              <Button
                onClick={runAudit}
                className="bg-black text-white hover:bg-gray-800"
                disabled={isRepairing || isRunning}
              >
                {isRunning ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Run Audit
                  </>
                )}
              </Button>
            )}
            <Button
              onClick={handleAutoRepair}
              variant="outline"
              className="border-black"
              disabled={isRepairing || isRunning || autoFixableCount === 0}
            >
              {isRepairing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Repairing...
                </>
              ) : (
                <>
                  <Wrench className="h-4 w-4 mr-2" />
                  Fix Issues ({autoFixableCount})
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Progress */}
        {isRunning && (
          <Card className="border border-black">
            <CardContent className="py-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-black font-medium">{currentTask}</span>
                <span className="text-gray-500">{stats.scanned} / {stats.totalRooms}</span>
              </div>
              <Progress value={progress} className="h-2" />
            </CardContent>
          </Card>
        )}

        {/* Repair Progress */}
        {isRepairing && (
          <Card className="border border-green-500 bg-green-50">
            <CardContent className="py-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-800 font-medium flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {currentTask || "Repairing..."}
                </span>
                <span className="text-green-600">{repairProgress}%</span>
              </div>
              <Progress value={repairProgress} className="h-2 bg-green-200" />
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="border border-gray-200">
            <CardContent className="py-4 text-center">
              <div className="text-2xl font-bold text-black">{stats.totalRooms}</div>
              <div className="text-xs text-gray-500">Total Rooms</div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200">
            <CardContent className="py-4 text-center">
              <div className="text-2xl font-bold text-black">{stats.scanned}</div>
              <div className="text-xs text-gray-500">Scanned</div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200">
            <CardContent className="py-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.errors}</div>
              <div className="text-xs text-gray-500">Errors</div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200">
            <CardContent className="py-4 text-center">
              <div className="text-2xl font-bold text-amber-600">{stats.warnings}</div>
              <div className="text-xs text-gray-500">Warnings</div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200">
            <CardContent className="py-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.fixed}</div>
              <div className="text-xs text-gray-500">Fixed</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search rooms or issues..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 border-gray-300"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { key: "all", label: "All" },
              { key: "errors", label: "Errors" },
              { key: "missing_audio", label: "Missing Audio" },
              { key: "missing_json", label: "Missing JSON" },
              { key: "missing_entries", label: "Missing Entries" },
            ].map(({ key, label }) => (
              <Button
                key={key}
                variant={filter === key ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(key as FilterType)}
                className={filter === key ? "bg-black text-white" : "border-gray-300"}
              >
                {label}
                {key !== "all" && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {issues.filter((i) => {
                      if (key === "errors") return i.severity === "error";
                      if (key === "missing_audio") return i.type === "missing_audio";
                      if (key === "missing_json") return i.type === "missing_json" || i.type === "missing_db";
                      if (key === "missing_entries") return i.type === "missing_entries";
                      return false;
                    }).length}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Issues List */}
        <Card className="border border-black">
          <CardHeader className="pb-2 border-b">
            <CardTitle className="text-black flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Issues ({filteredIssues.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filteredIssues.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                {issues.length === 0 ? (
                  <>
                    <CheckCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>Run the audit to check for issues</p>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
                    <p>No issues match the current filter</p>
                  </>
                )}
              </div>
            ) : (
              <ScrollArea className="h-[500px]">
                <div className="divide-y divide-gray-100">
                  {filteredIssues.map((issue) => (
                    <div
                      key={issue.id}
                      className="p-3 hover:bg-gray-50 flex items-start gap-3"
                    >
                      <div className={`p-1.5 rounded ${severityColors[issue.severity]}`}>
                        {typeIcons[issue.type] || <AlertTriangle className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <code className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded text-black">
                            {issue.file}
                          </code>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              issue.severity === "error"
                                ? "border-red-300 text-red-700"
                                : issue.severity === "warning"
                                ? "border-amber-300 text-amber-700"
                                : "border-blue-300 text-blue-700"
                            }`}
                          >
                            {issue.type.replace(/_/g, " ")}
                          </Badge>
                          {isAutoFixable(issue) && (
                            <Badge className="bg-green-100 text-green-700 text-xs">
                              Auto-fixable
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 mt-1">{issue.message}</p>
                        {issue.fix && (
                          <p className="text-xs text-gray-500 mt-1">
                            Fix: {issue.fix}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {/* Safe Mode Notice */}
        <div className="p-4 bg-gray-100 border border-gray-300 rounded text-center">
          <p className="text-black font-medium flex items-center justify-center gap-2">
            <Shield className="h-4 w-4" />
            SAFE MODE ACTIVE
          </p>
          <p className="text-gray-600 text-sm mt-1">
            Auto-repair only adds missing items. No destructive actions (deletions) will be performed.
          </p>
        </div>
      </div>
    </div>
  );
}
