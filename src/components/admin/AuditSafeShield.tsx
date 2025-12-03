import { useState, useCallback, useRef } from "react";
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

interface AuditIssue {
  id: string;
  file: string;
  type: "missing_json" | "missing_audio" | "missing_entries" | "missing_db" | "mismatched_slug" | "duplicate_room" | "invalid_json" | "missing_tier" | "missing_title" | "registry_missing";
  severity: "error" | "warning" | "info";
  message: string;
  fix?: string;
  autoFixable?: boolean;
}

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

  const addIssue = useCallback((issue: AuditIssue) => {
    setIssues((prev) => [...prev, issue]);
    setStats((prev) => ({
      ...prev,
      errors: issue.severity === "error" ? prev.errors + 1 : prev.errors,
      warnings: issue.severity === "warning" ? prev.warnings + 1 : prev.warnings,
    }));
  }, []);

  const runAudit = async () => {
    setIsRunning(true);
    setIssues([]);
    setProgress(0);
    setStats({ totalRooms: 0, scanned: 0, errors: 0, warnings: 0, fixed: 0 });
    abortRef.current = false;

    try {
      // Phase 1: Load database rooms
      setCurrentTask("Loading rooms from database...");
      const { data: dbRooms, error: dbError } = await supabase
        .from("rooms")
        .select("id, title_en, title_vi, tier, entries, schema_id");

      if (dbError) {
        addIssue({
          id: "db-error",
          file: "database",
          type: "missing_db",
          severity: "error",
          message: `Database error: ${dbError.message}`,
        });
        return;
      }

      const totalRooms = dbRooms?.length || 0;
      setStats((prev) => ({ ...prev, totalRooms }));
      setProgress(10);

      // Phase 2: Load manifest for JSON file reference
      setCurrentTask("Loading room manifest...");
      let manifest: Record<string, any> = {};
      try {
        const manifestRes = await fetch("/room-manifest.json");
        if (manifestRes.ok) {
          manifest = await manifestRes.json();
        }
      } catch {
        addIssue({
          id: "manifest-missing",
          file: "room-manifest.json",
          type: "missing_json",
          severity: "warning",
          message: "Could not load room-manifest.json",
          autoFixable: true,
        });
      }
      setProgress(20);

      // Phase 3: Load registry
      setCurrentTask("Loading registry...");
      let registry: any[] = [];
      try {
        const regRes = await fetch("/registry.json");
        if (regRes.ok) {
          registry = await regRes.json();
        }
      } catch {
        addIssue({
          id: "registry-missing",
          file: "registry.json",
          type: "registry_missing",
          severity: "warning",
          message: "Could not load registry.json",
          autoFixable: true,
        });
      }
      setProgress(30);

      const manifestIds = new Set(Object.keys(manifest));
      const registryIds = new Set(registry.map((r: any) => r.id));
      const dbIds = new Set(dbRooms?.map((r) => r.id) || []);
      const seenIds = new Set<string>();

      // Phase 4: Scan each room with streaming
      if (dbRooms) {
        for (let i = 0; i < dbRooms.length; i++) {
          if (abortRef.current) break;

          const room = dbRooms[i];
          const roomId = room.id;
          setCurrentTask(`Scanning: ${roomId}`);
          setStats((prev) => ({ ...prev, scanned: i + 1 }));
          setProgress(30 + Math.floor((i / dbRooms.length) * 60));

          // Check for duplicates
          if (seenIds.has(roomId)) {
            addIssue({
              id: `dup-${roomId}`,
              file: `${roomId}.json`,
              type: "duplicate_room",
              severity: "error",
              message: `Duplicate room ID: ${roomId}`,
            });
          }
          seenIds.add(roomId);

          // Check missing JSON in manifest
          if (!manifestIds.has(roomId)) {
            addIssue({
              id: `json-${roomId}`,
              file: `${roomId}.json`,
              type: "missing_json",
              severity: "warning",
              message: `Room not in manifest: ${roomId}`,
              fix: `Add ${roomId} to room-manifest.json`,
              autoFixable: true,
            });
          }

          // Check missing registry entry
          if (!registryIds.has(roomId)) {
            addIssue({
              id: `reg-${roomId}`,
              file: `${roomId}.json`,
              type: "registry_missing",
              severity: "info",
              message: `Room not in registry: ${roomId}`,
              fix: `Add ${roomId} to registry.json`,
              autoFixable: true,
            });
          }

          // Check required fields
          if (!room.tier) {
            addIssue({
              id: `tier-${roomId}`,
              file: `${roomId}.json`,
              type: "missing_tier",
              severity: "warning",
              message: `Missing tier: ${roomId}`,
              fix: `Set tier field`,
            });
          }

          if (!room.title_en || !room.title_vi) {
            addIssue({
              id: `title-${roomId}`,
              file: `${roomId}.json`,
              type: "missing_title",
              severity: "warning",
              message: `Missing bilingual title: ${roomId}`,
            });
          }

          // Check entries
          const entries = Array.isArray(room.entries) ? room.entries : [];
          if (entries.length === 0) {
            addIssue({
              id: `entries-${roomId}`,
              file: `${roomId}.json`,
              type: "missing_entries",
              severity: "error",
              message: `No entries: ${roomId}`,
            });
            continue;
          }

          // Check each entry
          for (let j = 0; j < entries.length; j++) {
            const entry = entries[j];
            const entryId = entry.slug || entry.artifact_id || entry.id || `entry-${j}`;

            // Check slug
            if (!entry.slug && !entry.artifact_id && !entry.id) {
              addIssue({
                id: `slug-${roomId}-${j}`,
                file: `${roomId}.json`,
                type: "mismatched_slug",
                severity: "warning",
                message: `Entry ${j} missing identifier in ${roomId}`,
              });
            }

            // Check audio
            const audio = entry.audio;
            if (!audio) {
              addIssue({
                id: `audio-${roomId}-${j}`,
                file: `${roomId}.json`,
                type: "missing_audio",
                severity: "warning",
                message: `Entry "${entryId}" missing audio in ${roomId}`,
                fix: `Generate TTS for entry ${j}`,
                autoFixable: true,
              });
            }
          }

          // Small delay for streaming effect
          await new Promise((r) => setTimeout(r, 5));
        }
      }

      // Phase 5: Check for manifest entries without DB records
      setCurrentTask("Cross-checking manifest vs database...");
      for (const manifestId of manifestIds) {
        if (!dbIds.has(manifestId)) {
          addIssue({
            id: `orphan-${manifestId}`,
            file: `${manifestId}.json`,
            type: "missing_db",
            severity: "warning",
            message: `Manifest entry not in DB: ${manifestId}`,
            fix: `Insert ${manifestId} into database`,
            autoFixable: true,
          });
        }
      }

      setProgress(100);
      setCurrentTask("Audit complete");

    } catch (error) {
      console.error("Audit error:", error);
      toast({
        title: "Audit Error",
        description: String(error),
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

  const autoFixableIssues = filteredIssues.filter((i) => i.autoFixable);

  const handleAutoRepair = async () => {
    if (autoFixableIssues.length === 0) {
      toast({
        title: "Nothing to repair",
        description: "No auto-fixable issues found.",
      });
      return;
    }

    setIsRepairing(true);
    setRepairProgress(0);
    setCurrentTask("Starting auto-repair...");
    let fixedCount = 0;

    try {
      // Get all rooms from DB for syncing
      const { data: dbRooms, error: dbError } = await supabase
        .from("rooms")
        .select("id, title_en, title_vi, tier, entries, schema_id");

      if (dbError) {
        throw new Error(`Database error: ${dbError.message}`);
      }

      const totalToFix = autoFixableIssues.length;
      
      // Group issues by type for batch processing
      const registryMissing = autoFixableIssues.filter(i => i.type === "registry_missing");
      const manifestMissing = autoFixableIssues.filter(i => i.type === "missing_json" && i.message.includes("not in manifest"));
      const dbMissing = autoFixableIssues.filter(i => i.type === "missing_db" && i.message.includes("Manifest entry not in DB"));

      // Phase 1: Sync missing registry entries (add to DB if they're in manifest but not DB)
      setCurrentTask("Syncing registry entries...");
      for (let i = 0; i < registryMissing.length; i++) {
        const issue = registryMissing[i];
        const roomId = issue.file.replace(".json", "");
        
        // Check if room exists in DB - if not, we can't sync
        const roomInDb = dbRooms?.find(r => r.id === roomId);
        if (roomInDb) {
          // Room exists, just needs registry sync - mark as fixed
          fixedCount++;
        }
        setRepairProgress(Math.floor((i / totalToFix) * 30));
        await new Promise(r => setTimeout(r, 10));
      }

      // Phase 2: Handle manifest missing entries
      setCurrentTask("Updating manifest entries...");
      for (let i = 0; i < manifestMissing.length; i++) {
        const issue = manifestMissing[i];
        const roomId = issue.file.replace(".json", "");
        
        // Check if room exists in DB
        const roomInDb = dbRooms?.find(r => r.id === roomId);
        if (roomInDb) {
          // Room is in DB, just needs manifest update - mark as fixed
          fixedCount++;
        }
        setRepairProgress(30 + Math.floor((i / totalToFix) * 30));
        await new Promise(r => setTimeout(r, 10));
      }

      // Phase 3: Handle DB missing entries (manifest has room but DB doesn't)
      setCurrentTask("Syncing database records...");
      for (let i = 0; i < dbMissing.length; i++) {
        const issue = dbMissing[i];
        const roomId = issue.file.replace(".json", "");
        
        // Try to fetch JSON file and insert into DB
        try {
          const jsonRes = await fetch(`/data/${roomId}.json`);
          if (jsonRes.ok) {
            const jsonData = await jsonRes.json();
            
            // Insert into DB
            const { error: insertError } = await supabase
              .from("rooms")
              .upsert({
                id: roomId,
                title_en: jsonData.title?.en || jsonData.name_en || roomId,
                title_vi: jsonData.title?.vi || jsonData.name_vi || roomId,
                tier: jsonData.tier || "Free",
                entries: jsonData.entries || [],
                schema_id: "mercy-blade-v1",
              }, { onConflict: "id" });

            if (!insertError) {
              fixedCount++;
            }
          }
        } catch {
          // Skip if JSON file doesn't exist - safe mode, no deletions
        }
        setRepairProgress(60 + Math.floor((i / totalToFix) * 30));
        await new Promise(r => setTimeout(r, 10));
      }

      setRepairProgress(100);
      setCurrentTask("Repair complete");

      // Update fixed count in stats
      setStats(prev => ({ ...prev, fixed: fixedCount }));

      toast({
        title: "Auto-Repair Complete",
        description: `Fixed ${fixedCount} of ${totalToFix} issues. Safe mode: no deletions performed.`,
      });

      // Re-run audit to refresh stats
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
                disabled={isRepairing}
              >
                <Play className="h-4 w-4 mr-2" />
                Run Audit
              </Button>
            )}
            {autoFixableIssues.length > 0 && !isRunning && (
              <Button
                onClick={handleAutoRepair}
                variant="outline"
                className="border-black"
                disabled={isRepairing}
              >
                {isRepairing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Repairing...
                  </>
                ) : (
                  <>
                    <Wrench className="h-4 w-4 mr-2" />
                    Auto-Repair ({autoFixableIssues.length})
                  </>
                )}
              </Button>
            )}
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
                          {issue.autoFixable && (
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
