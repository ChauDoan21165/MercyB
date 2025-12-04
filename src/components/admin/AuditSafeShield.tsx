import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield, Play, Loader2, CheckCircle, AlertTriangle, Search,
  FileJson, Music, Database, Filter, Heart, AlertOctagon,
  Clock, FileAudio, Trash2, Terminal, Download,
  BookOpen, Key, AlertCircle, Info, XCircle, ListTodo, Mic,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { AuditIssue, AuditSummary } from "@/lib/audit-v4-types";
import { ISSUE_TYPE_LABELS, TASK_TYPE_LABELS } from "@/lib/audit-v4-types";
import AuditCodeViewer from "./AuditCodeViewer";

// Types for V5.2
interface TTSTask {
  taskId: string;
  taskType: "generate_tts" | "generate_entry_tts" | "generate_intro_tts";
  roomId: string;
  entrySlug: string | null;
  language: "en" | "vi";
  filename: string;
  text: string;
}

interface AudioJob {
  room_id: string;
  entry_slug?: string;
  field: "intro" | "content";
  lang: "en" | "vi";
  text: string;
  filename: string;
}

interface StorageScanResult {
  ok: boolean;
  error?: string;
  fileCount: number;
  filesInBucket: number;
  basenamesInBucket: number;
}

interface AudioFileStats {
  referenced: number;
  present: number;
  missing: number;
  coverage: number;
  missingFiles: string[];
}

interface IntroStats {
  withIntroEn: number;
  missingIntroEn: number;
  withIntroVi: number;
  missingIntroVi: number;
}

interface AuditResponse {
  ok: boolean;
  mode: string;
  error?: string;
  stats: AuditSummary;
  summary: AuditSummary & {
    audio?: AudioFileStats;
    intro?: IntroStats;
    storageScan?: StorageScanResult;
    orphanAudioCount?: number;
    referencedAudioCount?: number;
  };
  issues: AuditIssue[];
  tasks: TTSTask[];
  legacyTasks?: any[];
  audioJobs: AudioJob[];
  orphanFiles: string[];
  fixesApplied: number;
  fixed: number;
  logs: string[];
  storageScan: StorageScanResult;
  audioFileStats: AudioFileStats;
}

type AuditMode = "scan";

type FilterType = "all" | "errors" | "warnings" | "infos" | "audio" | "intro_audio" | "orphan_audio" | "essays" | "keywords" | "tts" | "safety" | "deprecated" | "room_identity" | "entry_structure";

export default function AuditSafeShield() {
  const [isRunning, setIsRunning] = useState(false);
  const [issues, setIssues] = useState<AuditIssue[]>([]);
  const [tasks, setTasks] = useState<TTSTask[]>([]);
  const [audioJobs, setAudioJobs] = useState<AudioJob[]>([]);
  const [orphanFiles, setOrphanFiles] = useState<string[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");
  const [checkFiles, setCheckFiles] = useState(true);
  const [roomIdPrefix, setRoomIdPrefix] = useState("");
  const [summary, setSummary] = useState<AuditResponse["summary"] | null>(null);
  const [storageScan, setStorageScan] = useState<StorageScanResult | null>(null);
  const [audioFileStats, setAudioFileStats] = useState<AudioFileStats | null>(null);
  const { toast } = useToast();

  const callAuditEndpoint = async (_mode: AuditMode): Promise<AuditResponse | null> => {
    const { data, error } = await supabase.functions.invoke("audit-v4-safe-shield", {
      body: { mode: "scan", checkFiles, roomIdPrefix: roomIdPrefix || undefined },
    });
    if (error) throw new Error(error.message || "Failed to call audit endpoint");
    return data as AuditResponse;
  };

  const runAudit = async () => {
    setIsRunning(true);
    setIssues([]);
    setTasks([]);
    setAudioJobs([]);
    setOrphanFiles([]);
    setLogs([]);
    setSummary(null);
    setStorageScan(null);
    setAudioFileStats(null);
    setProgress(10);

    try {
      const response = await callAuditEndpoint("scan");
      if (!response?.ok) throw new Error(response?.error || "Audit failed");

      setProgress(100);
      setIssues(response.issues || []);
      setTasks(response.tasks || []);
      setAudioJobs(response.audioJobs || []);
      setOrphanFiles(response.orphanFiles || []);
      setLogs(response.logs || []);
      setSummary(response.summary || response.stats);
      setStorageScan(response.storageScan);
      setAudioFileStats(response.audioFileStats);
      
      toast({ title: "Audit Complete", description: `Found ${response.issues?.length || 0} issues, generated ${response.tasks?.length || 0} TTS tasks` });
    } catch (error) {
      toast({ title: "Audit Error", description: error instanceof Error ? error.message : String(error), variant: "destructive" });
    } finally {
      setIsRunning(false);
    }
  };

  const exportToJson = (data: any, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredIssues = issues.filter((issue) => {
    if (search && !issue.file.toLowerCase().includes(search.toLowerCase()) && !issue.message.toLowerCase().includes(search.toLowerCase()) && !issue.type.toLowerCase().includes(search.toLowerCase())) return false;
    switch (filter) {
      case "errors": return issue.severity === "error";
      case "warnings": return issue.severity === "warning";
      case "infos": return issue.severity === "info";
      case "audio": return ["missing_audio", "missing_audio_field", "missing_audio_file"].includes(issue.type);
      case "intro_audio": return ["missing_intro_audio_en", "missing_intro_audio_vi"].includes(issue.type);
      case "orphan_audio": return issue.type === "orphan_audio_files";
      case "essays": return ["missing_room_essay_en", "missing_room_essay_vi", "essay_placeholder_detected", "essay_placeholder", "essay_too_short", "essay_too_long"].includes(issue.type);
      case "keywords": return ["entry_keyword_missing_en", "entry_keyword_missing_vi", "entry_keyword_too_few", "entry_keyword_duplicate_across_room", "missing_room_keywords", "keyword_display_label_wrong", "keyword_too_few", "keyword_duplicate"].includes(issue.type);
      case "tts": return ["tts_unstable_text", "tts_length_exceeded", "copy_placeholder_detected"].includes(issue.type);
      case "safety": return ["crisis_content", "crisis_content_detected", "kids_crisis_blocker", "kids_blocker_detected", "medical_claims", "unsafe_medical_claim", "emergency_phrasing", "corrupt_characters_detected"].includes(issue.type);
      case "deprecated": return ["deprecated_field_present", "unknown_entry_key", "unknown_field_present"].includes(issue.type);
      case "room_identity": return ["duplicate_room", "missing_tier", "invalid_tier", "tier_incorrect", "missing_schema_id", "missing_schema", "missing_domain", "domain_incorrect", "missing_title", "missing_title_en", "missing_title_vi"].includes(issue.type);
      case "entry_structure": return ["missing_entries", "malformed_entries", "entry_count_info", "missing_slug", "duplicate_slug", "slug_format_info", "invalid_slug", "missing_copy_en", "missing_copy_vi", "copy_word_count_extreme", "entry_copy_missing", "entry_copy_structure_invalid"].includes(issue.type);
      default: return true;
    }
  });

  const severityColors: Record<string, string> = { error: "bg-red-100 text-red-800", warning: "bg-amber-100 text-amber-800", info: "bg-blue-100 text-blue-800" };
  const severityIcons: Record<string, typeof AlertTriangle> = { error: XCircle, warning: AlertCircle, info: Info };

  const getTypeLabel = (type: string): string => ISSUE_TYPE_LABELS[type] || type.replace(/_/g, " ");
  const getTaskTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      generate_tts: "Generate TTS",
      generate_entry_tts: "Entry TTS",
      generate_intro_tts: "Intro TTS",
    };
    return labels[type] || type;
  };

  // Get audio/intro stats from new or legacy format
  const getAudioStats = () => {
    if (summary?.audio) return summary.audio;
    if (audioFileStats) return audioFileStats;
    return null;
  };

  const getIntroStats = () => {
    if (summary?.intro) return summary.intro;
    return {
      withIntroEn: summary?.roomsWithIntroEn || 0,
      missingIntroEn: summary?.roomsMissingIntroEn || 0,
      withIntroVi: summary?.roomsWithIntroVi || 0,
      missingIntroVi: summary?.roomsMissingIntroVi || 0,
    };
  };

  const getStorageStats = () => {
    if (summary?.storageScan) return summary.storageScan;
    if (storageScan) return storageScan;
    return null;
  };

  const audioStats = getAudioStats();
  const introStats = getIntroStats();
  const storageStats = getStorageStats();

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-black" />
            <div>
              <h1 className="text-2xl font-bold text-black">Full System Sync Auditor</h1>
              <p className="text-gray-600 text-sm">Safe Shield V5.2 — Non-destructive room & audio validation with TTS task generation</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={runAudit} className="bg-black text-white hover:bg-gray-800" disabled={isRunning}>
              {isRunning ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Scanning...</> : <><Play className="h-4 w-4 mr-2" />Run Audit</>}
            </Button>
          </div>
        </div>

        {/* Options */}
        <Card className="border border-gray-200">
          <CardContent className="py-4 flex flex-wrap gap-6 items-center">
            <div className="flex items-center gap-2">
              <Switch id="checkFiles" checked={checkFiles} onCheckedChange={setCheckFiles} />
              <Label htmlFor="checkFiles" className="text-sm">Real storage scan</Label>
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

        {/* Storage Scan Warning */}
        {storageStats && !storageStats.ok && (
          <Card className="border-2 border-amber-500 bg-amber-50">
            <CardContent className="py-4">
              <div className="flex items-center gap-3 text-amber-800">
                <AlertTriangle className="h-6 w-6" />
                <div>
                  <p className="font-semibold">⚠ Storage scan failed — audio coverage cannot be trusted</p>
                  <p className="text-sm">{storageStats.error || "Unknown error"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Summary Stats */}
        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            <Card className="border"><CardContent className="py-3 text-center"><div className="text-xl font-bold">{summary.totalRooms}</div><div className="text-xs text-gray-500">Rooms</div></CardContent></Card>
            <Card className="border"><CardContent className="py-3 text-center"><div className="text-xl font-bold">{summary.totalEntries || 0}</div><div className="text-xs text-gray-500">Entries</div></CardContent></Card>
            <Card className="border"><CardContent className="py-3 text-center"><div className="text-xl font-bold text-red-600">{summary.errors}</div><div className="text-xs text-gray-500">Errors</div></CardContent></Card>
            <Card className="border"><CardContent className="py-3 text-center"><div className="text-xl font-bold text-amber-600">{summary.warnings}</div><div className="text-xs text-gray-500">Warnings</div></CardContent></Card>
            <Card className="border"><CardContent className="py-3 text-center"><div className={`text-xl font-bold ${audioStats?.coverage === 100 ? 'text-green-600' : audioStats?.coverage && audioStats.coverage < 50 ? 'text-red-600' : ''}`}>{audioStats?.coverage ?? summary.audioCoveragePercent ?? 0}%</div><div className="text-xs text-gray-500">Audio Coverage</div></CardContent></Card>
            <Card className="border"><CardContent className="py-3 text-center"><div className="text-xl font-bold text-purple-600">{summary.orphanAudioCount ?? orphanFiles.length}</div><div className="text-xs text-gray-500">Orphan Audio</div></CardContent></Card>
            <Card className="border"><CardContent className="py-3 text-center"><div className="text-xl font-bold text-blue-600">{tasks.length}</div><div className="text-xs text-gray-500">TTS Tasks</div></CardContent></Card>
            <Card className="border"><CardContent className="py-3 text-center"><div className="text-xl font-bold text-indigo-600">{audioJobs.length}</div><div className="text-xs text-gray-500">Audio Jobs</div></CardContent></Card>
          </div>
        )}

        {/* Audio, Intro & Storage Stats */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border"><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Music className="h-4 w-4" />Audio Files</CardTitle></CardHeader>
              <CardContent className="text-sm space-y-1">
                <div className="flex justify-between"><span>Referenced:</span><span className="font-mono">{audioStats?.referenced ?? summary.referencedAudioFiles ?? 0}</span></div>
                <div className="flex justify-between"><span>Present:</span><span className="font-mono text-green-600">{audioStats?.present ?? summary.totalAudioPresent ?? 0}</span></div>
                <div className="flex justify-between"><span>Missing:</span><span className="font-mono text-red-600">{audioStats?.missing ?? summary.entriesMissingAudio ?? 0}</span></div>
                <div className="flex justify-between"><span>Coverage:</span><span className={`font-mono ${(audioStats?.coverage ?? 0) >= 80 ? 'text-green-600' : 'text-red-600'}`}>{audioStats?.coverage ?? summary.audioCoveragePercent ?? 0}%</span></div>
              </CardContent>
            </Card>
            <Card className="border"><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><FileAudio className="h-4 w-4" />Intro Audio</CardTitle></CardHeader>
              <CardContent className="text-sm space-y-1">
                <div className="flex justify-between"><span>With EN intro:</span><span className="font-mono text-green-600">{introStats.withIntroEn}</span></div>
                <div className="flex justify-between"><span>Missing EN:</span><span className="font-mono text-amber-600">{introStats.missingIntroEn}</span></div>
                <div className="flex justify-between"><span>With VI intro:</span><span className="font-mono text-green-600">{introStats.withIntroVi}</span></div>
                <div className="flex justify-between"><span>Missing VI:</span><span className="font-mono text-amber-600">{introStats.missingIntroVi}</span></div>
              </CardContent>
            </Card>
            <Card className="border"><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Database className="h-4 w-4" />Storage Bucket</CardTitle></CardHeader>
              <CardContent className="text-sm space-y-1">
                {storageStats?.ok === false ? (
                  <div className="text-amber-600 font-medium">⚠ Scan failed</div>
                ) : (
                  <>
                    <div className="flex justify-between"><span>Files in bucket:</span><span className="font-mono">{storageStats?.fileCount ?? summary.audioFilesInBucket ?? 0}</span></div>
                    <div className="flex justify-between"><span>Unique basenames:</span><span className="font-mono">{storageStats?.basenamesInBucket ?? summary.audioBasenamesInBucket ?? 0}</span></div>
                  </>
                )}
                <div className="flex justify-between"><span>Referenced:</span><span className="font-mono">{summary.referencedAudioCount ?? summary.referencedAudioFiles ?? 0}</span></div>
                <div className="flex justify-between"><span>Orphans:</span><span className="font-mono text-gray-600">{summary.orphanAudioCount ?? orphanFiles.length}</span></div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="border">
          <CardContent className="py-4">
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search by file, message, or type..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {([
                  { key: "all", icon: Filter, color: "" },
                  { key: "errors", icon: XCircle, color: "text-red-600" },
                  { key: "warnings", icon: AlertCircle, color: "text-amber-600" },
                  { key: "audio", icon: Music, color: "text-purple-600" },
                  { key: "intro_audio", icon: FileAudio, color: "text-indigo-600" },
                  { key: "keywords", icon: Key, color: "text-green-600" },
                  { key: "essays", icon: BookOpen, color: "text-cyan-600" },
                  { key: "safety", icon: Heart, color: "text-red-600" },
                  { key: "deprecated", icon: AlertOctagon, color: "text-gray-500" },
                ] as { key: FilterType; icon: typeof Filter; color: string }[]).map(({ key, icon: Icon, color }) => (
                  <Button key={key} variant={filter === key ? "default" : "outline"} size="sm" onClick={() => setFilter(key)}
                    className={`gap-1.5 ${filter === key ? "bg-black text-white" : "border-gray-300"}`}>
                    <Icon className={`h-3.5 w-3.5 ${filter !== key ? color : ""}`} />
                    {key.replace(/_/g, " ")}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs defaultValue="issues" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="issues" className="gap-2"><Filter className="h-4 w-4" />Issues ({filteredIssues.length})</TabsTrigger>
            <TabsTrigger value="tasks" className="gap-2"><ListTodo className="h-4 w-4" />TTS Tasks ({tasks.length})</TabsTrigger>
            <TabsTrigger value="audio-jobs" className="gap-2"><Mic className="h-4 w-4" />Audio Jobs ({audioJobs.length})</TabsTrigger>
            <TabsTrigger value="orphans" className="gap-2"><Trash2 className="h-4 w-4" />Orphans ({orphanFiles.length})</TabsTrigger>
            <TabsTrigger value="logs" className="gap-2"><Terminal className="h-4 w-4" />Logs</TabsTrigger>
          </TabsList>

          {/* Issues Tab */}
          <TabsContent value="issues">
            <Card className="border border-black">
              <CardContent className="p-0">
                {filteredIssues.length === 0 ? (
                  <div className="py-12 text-center text-gray-500"><CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" /><p>{issues.length === 0 ? "Run audit to check" : "No matching issues"}</p></div>
                ) : (
                  <ScrollArea className="h-[450px]">
                    <div className="divide-y">
                      {filteredIssues.map((issue) => {
                        const SeverityIcon = severityIcons[issue.severity] || AlertTriangle;
                        return (
                          <div key={issue.id} className="p-3 hover:bg-gray-50 flex items-start gap-3">
                            <div className={`p-1.5 rounded ${severityColors[issue.severity]}`}><SeverityIcon className="h-4 w-4" /></div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <code className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded truncate max-w-[200px]">{issue.file}</code>
                                <Badge variant="outline" className={`text-xs ${issue.severity === "error" ? "border-red-300 text-red-700" : issue.severity === "warning" ? "border-amber-300 text-amber-700" : "border-blue-300 text-blue-700"}`}>
                                  {getTypeLabel(issue.type)}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-700 mt-1">{issue.message}</p>
                              {issue.fix && <p className="text-xs text-gray-500 mt-1">💡 Fix: {issue.fix}</p>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TTS Tasks Tab */}
          <TabsContent value="tasks">
            <Card className="border">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2"><ListTodo className="h-4 w-4" />TTS Tasks ({tasks.length})</CardTitle>
                {tasks.length > 0 && (
                  <Button size="sm" variant="outline" onClick={() => exportToJson(tasks, `tts_tasks_${Date.now()}.json`)}>
                    <Download className="h-3.5 w-3.5 mr-1" />Export JSON
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {tasks.length === 0 ? (
                  <div className="py-8 text-center text-gray-500"><ListTodo className="h-8 w-8 mx-auto mb-2" /><p>No TTS tasks generated</p></div>
                ) : (
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-2">
                      {tasks.map((task) => (
                        <div key={task.taskId} className="p-3 border rounded hover:bg-gray-50">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <Badge variant={task.taskType === "generate_intro_tts" ? "default" : "secondary"} className="text-xs">
                              {getTaskTypeLabel(task.taskType)}
                            </Badge>
                            <Badge variant="outline" className="text-xs">{task.language.toUpperCase()}</Badge>
                            <code className="text-xs font-mono text-gray-600">{task.roomId}</code>
                            {task.entrySlug && <code className="text-xs font-mono text-gray-400">/ {task.entrySlug}</code>}
                          </div>
                          <p className="text-xs font-mono text-gray-700">📁 {task.filename}</p>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.text.slice(0, 150)}...</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audio Jobs Tab */}
          <TabsContent value="audio-jobs">
            <Card className="border">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2"><Mic className="h-4 w-4" />Audio Jobs ({audioJobs.length})</CardTitle>
                {audioJobs.length > 0 && (
                  <Button size="sm" variant="outline" onClick={() => exportToJson(audioJobs, `audio_jobs_${Date.now()}.json`)}>
                    <Download className="h-3.5 w-3.5 mr-1" />Export JSON
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {audioJobs.length === 0 ? (
                  <div className="py-8 text-center text-gray-500"><Mic className="h-8 w-8 mx-auto mb-2" /><p>No audio jobs needed</p></div>
                ) : (
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-2">
                      {audioJobs.map((job, idx) => (
                        <div key={idx} className="p-3 border rounded hover:bg-gray-50">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <Badge variant={job.field === "intro" ? "default" : "secondary"} className="text-xs">{job.field}</Badge>
                            <Badge variant="outline" className="text-xs">{job.lang.toUpperCase()}</Badge>
                            <code className="text-xs font-mono text-gray-600">{job.room_id}</code>
                            {job.entry_slug && <code className="text-xs font-mono text-gray-400">/ {job.entry_slug}</code>}
                          </div>
                          <p className="text-xs font-mono text-gray-700 truncate">📁 {job.filename}</p>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{job.text.slice(0, 150)}...</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orphans Tab */}
          <TabsContent value="orphans">
            <Card className="border">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2"><Trash2 className="h-4 w-4" />Orphan Audio Files ({orphanFiles.length})</CardTitle>
                {orphanFiles.length > 0 && (
                  <Button size="sm" variant="outline" onClick={() => exportToJson(orphanFiles, `orphan_files_${Date.now()}.json`)}>
                    <Download className="h-3.5 w-3.5 mr-1" />Export JSON
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {orphanFiles.length === 0 ? (
                  <div className="py-8 text-center text-gray-500"><CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" /><p>No orphan audio files detected</p></div>
                ) : (
                  <ScrollArea className="h-[350px]">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {orphanFiles.slice(0, 200).map((file, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded text-xs font-mono truncate">
                          <FileAudio className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{file}</span>
                        </div>
                      ))}
                    </div>
                    {orphanFiles.length > 200 && <p className="text-xs text-gray-500 mt-3 text-center">Showing first 200 of {orphanFiles.length} files...</p>}
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Logs Tab */}
          <TabsContent value="logs">
            <Card className="border">
              <CardContent className="pt-4">
                {logs.length === 0 ? (
                  <div className="py-8 text-center text-gray-500"><Terminal className="h-8 w-8 mx-auto mb-2" /><p>Run audit to see logs</p></div>
                ) : (
                  <ScrollArea className="h-[350px] bg-gray-900 rounded p-4">
                    <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap">{logs.join("\n")}</pre>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Safe Mode Notice */}
        <div className="p-4 bg-gray-100 border rounded text-center">
          <p className="text-black font-medium flex items-center justify-center gap-2"><Shield className="h-4 w-4" />SAFE MODE ACTIVE — V5.2</p>
          <p className="text-gray-600 text-sm mt-1">Non-destructive: Only generates TTS tasks and audio jobs. No database modifications.</p>
        </div>

        <AuditCodeViewer />
      </div>
    </div>
  );
}
