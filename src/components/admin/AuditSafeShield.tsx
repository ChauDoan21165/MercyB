import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Shield, Play, Loader2, CheckCircle, AlertTriangle, Search, Wrench,
  FileJson, Music, Database, Filter, Heart, Stethoscope, AlertOctagon,
  Baby, Clock, FileAudio, Trash2, Terminal,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { AuditIssue, AuditResponse, AuditMode, AuditSummary, ISSUE_TYPE_LABELS } from "@/lib/audit-v4-types";
import AuditCodeViewer from "./AuditCodeViewer";

type FilterType = "all" | "errors" | "warnings" | "audio" | "intro_audio" | "orphan_audio" | "essays" | "keywords" | "tts" | "safety" | "deprecated";

export default function AuditSafeShield() {
  const [isRunning, setIsRunning] = useState(false);
  const [isRepairing, setIsRepairing] = useState(false);
  const [issues, setIssues] = useState<AuditIssue[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");
  const [checkFiles, setCheckFiles] = useState(true);
  const [roomIdPrefix, setRoomIdPrefix] = useState("");
  const [summary, setSummary] = useState<AuditSummary | null>(null);
  const { toast } = useToast();

  const isAutoFixable = (issue: AuditIssue) => (issue as any).autoFixable || (issue as any).auto_fixable;

  const callAuditEndpoint = async (mode: AuditMode): Promise<AuditResponse | null> => {
    const { data, error } = await supabase.functions.invoke("audit-v4-safe-shield", {
      body: { mode, checkFiles, roomIdPrefix: roomIdPrefix || undefined },
    });
    if (error) throw new Error(error.message || "Failed to call audit endpoint");
    return data as AuditResponse;
  };

  const runAudit = async () => {
    setIsRunning(true);
    setIssues([]);
    setLogs([]);
    setSummary(null);
    setProgress(10);

    try {
      const response = await callAuditEndpoint("dry-run");
      if (!response?.ok) throw new Error(response?.error || "Audit failed");

      setProgress(100);
      setIssues(response.issues || []);
      setLogs(response.logs || []);
      setSummary(response.summary);
    } catch (error) {
      toast({ title: "Audit Error", description: error instanceof Error ? error.message : String(error), variant: "destructive" });
    } finally {
      setIsRunning(false);
    }
  };

  const handleAutoRepair = async () => {
    if (issues.length === 0) {
      toast({ title: "Run Audit First", description: "Please run an audit before repairs." });
      return;
    }
    
    setIsRepairing(true);
    try {
      const response = await callAuditEndpoint("repair");
      if (!response?.ok) throw new Error(response?.error || "Repair failed");

      toast({ title: "Repair Complete", description: `Fixed ${response.fixesApplied || 0} issues.` });
      await runAudit();
    } catch (error) {
      toast({ title: "Repair Failed", description: error instanceof Error ? error.message : String(error), variant: "destructive" });
    } finally {
      setIsRepairing(false);
    }
  };

  const filteredIssues = issues.filter((issue) => {
    if (search && !issue.file.toLowerCase().includes(search.toLowerCase()) && !issue.message.toLowerCase().includes(search.toLowerCase())) return false;
    switch (filter) {
      case "errors": return issue.severity === "error";
      case "warnings": return issue.severity === "warning";
      case "audio": return ["missing_audio", "missing_audio_field", "missing_audio_file"].includes(issue.type);
      case "intro_audio": return ["missing_intro_audio_en", "missing_intro_audio_vi"].includes(issue.type);
      case "orphan_audio": return issue.type === "orphan_audio_files";
      case "essays": return ["missing_room_essay_en", "missing_room_essay_vi", "essay_placeholder_detected", "essay_too_short", "essay_too_long"].includes(issue.type);
      case "keywords": return ["entry_keyword_missing_en", "entry_keyword_missing_vi", "entry_keyword_too_few", "entry_keyword_duplicate_across_room", "missing_room_keywords"].includes(issue.type);
      case "tts": return ["tts_unstable_text", "tts_length_exceeded", "copy_placeholder_detected"].includes(issue.type);
      case "safety": return ["crisis_content", "kids_crisis_blocker", "medical_claims", "emergency_phrasing"].includes(issue.type);
      case "deprecated": return issue.type === "deprecated_field_present";
      default: return true;
    }
  });

  const autoFixableCount = issues.filter(isAutoFixable).length;
  const severityColors = { error: "bg-red-100 text-red-800", warning: "bg-amber-100 text-amber-800", info: "bg-blue-100 text-blue-800" };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-black" />
            <div>
              <h1 className="text-2xl font-bold text-black">Full System Sync Auditor</h1>
              <p className="text-gray-600 text-sm">Safe Shield Edition v2 — Complete room & audio validation</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={runAudit} className="bg-black text-white hover:bg-gray-800" disabled={isRepairing || isRunning}>
              {isRunning ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Running...</> : <><Play className="h-4 w-4 mr-2" />Run Audit</>}
            </Button>
            <Button onClick={handleAutoRepair} variant="outline" className="border-black" disabled={isRepairing || isRunning || autoFixableCount === 0}>
              {isRepairing ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Repairing...</> : <><Wrench className="h-4 w-4 mr-2" />Fix ({autoFixableCount})</>}
            </Button>
          </div>
        </div>

        {/* Options */}
        <Card className="border border-gray-200">
          <CardContent className="py-4 flex flex-wrap gap-6 items-center">
            <div className="flex items-center gap-2">
              <Switch id="checkFiles" checked={checkFiles} onCheckedChange={setCheckFiles} />
              <Label htmlFor="checkFiles" className="text-sm">Deep audio file check</Label>
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-sm">Room prefix:</Label>
              <Input placeholder="e.g. english_foundation_" value={roomIdPrefix} onChange={(e) => setRoomIdPrefix(e.target.value)} className="w-48 h-8 text-sm" />
            </div>
            {summary?.durationMs && <Badge variant="outline" className="flex items-center gap-1"><Clock className="h-3 w-3" />{summary.durationMs}ms</Badge>}
          </CardContent>
        </Card>

        {/* Progress */}
        {isRunning && <Card className="border border-black"><CardContent className="py-4"><Progress value={progress} className="h-2" /></CardContent></Card>}

        {/* Summary Stats */}
        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <Card className="border"><CardContent className="py-3 text-center"><div className="text-xl font-bold">{summary.totalRooms}</div><div className="text-xs text-gray-500">Rooms</div></CardContent></Card>
            <Card className="border"><CardContent className="py-3 text-center"><div className="text-xl font-bold text-red-600">{summary.errors}</div><div className="text-xs text-gray-500">Errors</div></CardContent></Card>
            <Card className="border"><CardContent className="py-3 text-center"><div className="text-xl font-bold text-amber-600">{summary.warnings}</div><div className="text-xs text-gray-500">Warnings</div></CardContent></Card>
            <Card className="border"><CardContent className="py-3 text-center"><div className="text-xl font-bold text-green-600">{summary.fixed}</div><div className="text-xs text-gray-500">Fixed</div></CardContent></Card>
            <Card className="border"><CardContent className="py-3 text-center"><div className="text-xl font-bold">{summary.audioCoveragePercent}%</div><div className="text-xs text-gray-500">Audio Coverage</div></CardContent></Card>
            <Card className="border"><CardContent className="py-3 text-center"><div className="text-xl font-bold text-purple-600">{summary.orphanAudioFiles}</div><div className="text-xs text-gray-500">Orphan Audio</div></CardContent></Card>
          </div>
        )}

        {/* Audio & Intro Stats */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border"><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Music className="h-4 w-4" />Entry Audio</CardTitle></CardHeader>
              <CardContent className="text-sm space-y-1">
                <div className="flex justify-between"><span>Total slots:</span><span className="font-mono">{summary.totalAudioSlots}</span></div>
                <div className="flex justify-between"><span>Present:</span><span className="font-mono text-green-600">{summary.totalAudioPresent}</span></div>
                <div className="flex justify-between"><span>Missing:</span><span className="font-mono text-red-600">{summary.totalAudioMissing}</span></div>
              </CardContent>
            </Card>
            <Card className="border"><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><FileAudio className="h-4 w-4" />Intro Audio</CardTitle></CardHeader>
              <CardContent className="text-sm space-y-1">
                <div className="flex justify-between"><span>With EN intro:</span><span className="font-mono">{summary.roomsWithIntroEn}</span></div>
                <div className="flex justify-between"><span>With VI intro:</span><span className="font-mono">{summary.roomsWithIntroVi}</span></div>
                <div className="flex justify-between"><span>Missing EN:</span><span className="font-mono text-amber-600">{summary.roomsMissingIntroEn}</span></div>
                <div className="flex justify-between"><span>Missing VI:</span><span className="font-mono text-amber-600">{summary.roomsMissingIntroVi}</span></div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          <div className="flex gap-1 flex-wrap">
            {(["all", "errors", "warnings", "audio", "intro_audio", "orphan_audio", "safety", "essays", "tts", "deprecated"] as FilterType[]).map((key) => (
              <Button key={key} variant={filter === key ? "default" : "outline"} size="sm" onClick={() => setFilter(key)}
                className={filter === key ? (key === "safety" ? "bg-red-600" : "bg-black") + " text-white" : "border-gray-300"}>
                {key.replace(/_/g, " ")}
              </Button>
            ))}
          </div>
        </div>

        {/* Issues List */}
        <Card className="border border-black">
          <CardHeader className="pb-2 border-b"><CardTitle className="flex items-center gap-2"><Filter className="h-5 w-5" />Issues ({filteredIssues.length})</CardTitle></CardHeader>
          <CardContent className="p-0">
            {filteredIssues.length === 0 ? (
              <div className="py-12 text-center text-gray-500"><CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" /><p>{issues.length === 0 ? "Run audit to check" : "No matching issues"}</p></div>
            ) : (
              <ScrollArea className="h-[400px]">
                <div className="divide-y">
                  {filteredIssues.map((issue) => (
                    <div key={issue.id} className="p-3 hover:bg-gray-50 flex items-start gap-3">
                      <div className={`p-1.5 rounded ${severityColors[issue.severity]}`}><AlertTriangle className="h-4 w-4" /></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <code className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded">{issue.file}</code>
                          <Badge variant="outline" className={`text-xs ${issue.severity === "error" ? "border-red-300 text-red-700" : issue.severity === "warning" ? "border-amber-300 text-amber-700" : "border-blue-300 text-blue-700"}`}>
                            {issue.type.replace(/_/g, " ")}
                          </Badge>
                          {isAutoFixable(issue) && <Badge className="bg-green-100 text-green-700 text-xs">Auto-fixable</Badge>}
                        </div>
                        <p className="text-sm text-gray-700 mt-1">{issue.message}</p>
                        {issue.fix && <p className="text-xs text-gray-500 mt-1">Fix: {issue.fix}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {/* Logs */}
        {logs.length > 0 && (
          <Card className="border"><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Terminal className="h-4 w-4" />Logs</CardTitle></CardHeader>
            <CardContent><ScrollArea className="h-32 bg-gray-900 rounded p-3"><pre className="text-xs text-green-400 font-mono">{logs.join("\n")}</pre></ScrollArea></CardContent>
          </Card>
        )}

        {/* Safe Mode Notice */}
        <div className="p-4 bg-gray-100 border rounded text-center">
          <p className="text-black font-medium flex items-center justify-center gap-2"><Shield className="h-4 w-4" />SAFE MODE ACTIVE</p>
          <p className="text-gray-600 text-sm mt-1">Auto-repair only fixes metadata. No deletions performed.</p>
        </div>

        <AuditCodeViewer />
      </div>
    </div>
  );
}
