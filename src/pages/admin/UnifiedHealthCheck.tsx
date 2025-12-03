import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ColorfulMercyBladeHeader } from "@/components/ColorfulMercyBladeHeader";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// Tabs component removed - using unified tier dropdown instead
import { AlertCircle, CheckCircle2, XCircle, ArrowLeft, Loader2, Wrench, Download, Play, Volume2, FileText, Trash2, RefreshCw, FileEdit, Music, Search } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { PUBLIC_ROOM_MANIFEST } from "@/lib/roomManifest";
import { KIDS_ROOM_JSON_MAP } from "@/pages/KidsChat";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { guardedCall } from "@/lib/guardedCall";
import { normalizeTier, tierIdToLabel, type TierId } from "@/lib/constants/tiers";
import { UiHealthPanel } from "@/components/admin/UiHealthPanel";
import { RoomLinkHealth } from "@/components/admin/RoomLinkHealth";
import { AudioCoveragePanel } from "@/components/admin/AudioCoveragePanel";
import EnvironmentBanner from "@/components/admin/EnvironmentBanner";
import { RoomHealthSummary as RoomHealthSummaryComponent } from "@/components/admin/RoomHealthSummary";
import { TierFilterBar } from "@/components/admin/TierFilterBar";
import { RoomIssuesTable } from "@/components/admin/RoomIssuesTable";
import { DeepScanPanel } from "@/components/admin/DeepScanPanel";
import { VipTierCoveragePanel } from "@/components/admin/VipTierCoveragePanel";

interface RoomIssue {
  roomId: string;
  roomTitle: string;
  tier: string;
  issueType: "missing_file" | "invalid_json" | "no_entries" | "missing_audio" | "locked" | "missing_entries" | "inactive" | "orphan_json" | "audio_unreachable" | "entry_mismatch" | "audio_filename_mismatch";
  message: string;
  details?: string;
  resolvedPath?: string;
  manifestKey?: string;
  isKidsRoom?: boolean;
  levelId?: string;
  audioFile?: string;
  entrySlug?: string;
  httpStatus?: number;
  url?: string;
}

interface AudioCheckResult {
  file: string;
  status: "success" | "failed" | "timeout";
  error?: string;
  httpStatus?: number;
}

interface EntryValidation {
  slug: string;
  inJson: boolean;
  inDb: boolean;
  issue?: string;
}

interface DeepRoomReport {
  roomId: string;
  roomTitle: string;
  tier: string;
  jsonPath?: string;
  summary: {
    totalIssues: number;
    audioIssues: number;
    entryIssues: number;
    healthScore: number; // 0-100
  };
  audioChecks: AudioCheckResult[];
  entryValidation: EntryValidation[];
  issues: RoomIssue[];
}

interface MissingAudioEntry {
  roomId: string;
  roomTitle: string;
  entrySlug: string;
  field: string;
  filename: string;
  status: string;
  checkedUrl?: string; // The exact URL that was checked for debugging
  httpStatus?: number;
}

interface AudioScanResult {
  success: boolean;
  totalChecked: number;
  missingCount: number;
  existingCount: number;
  missingFiles: MissingAudioEntry[];
  existingFiles: MissingAudioEntry[];
}

interface RoomHealth {
  totalRooms: number;
  healthyRooms: number;
  issuesFound: number;
  issues: RoomIssue[];
}

// Helper function to get display name for any tier string
function getTierDisplayName(tier: string | null | undefined): string {
  if (!tier) return "Free";
  const tierId = normalizeTier(tier);
  const label = tierIdToLabel(tierId);
  return label.split(' / ')[0]; // Return English part only
}

// Helper to convert schema_id to proper JSON filename
const getSuggestedJsonBaseName = (schemaId: string, tier: string): string => {
  // If schema_id already has underscores, use it as-is and capitalize
  if (schemaId.includes('_')) {
    const words = schemaId.split('_');
    const capitalizedWords = words.map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    );
    const baseName = capitalizedWords.join('_');
    const tierSuffix = tier.toLowerCase().replace(/\s+/g, '');
    return `${baseName}_${tierSuffix}`;
  }
  
  // Otherwise split by hyphens, capitalize each word, then join with underscores
  const words = schemaId.split('-');
  const capitalizedWords = words.map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  );
  const baseName = capitalizedWords.join('_');
  
  // Add tier suffix (lowercase, remove spaces)
  const tierSuffix = tier.toLowerCase().replace(/\s+/g, '');
  return `${baseName}_${tierSuffix}`;
};

const getSuggestedJsonPath = (schemaId: string, tier: string): string => {
  const fileName = getSuggestedJsonBaseName(schemaId, tier);
  return `public/data/${fileName}.json`;
};

const getJsonFilenameForKidsRoom = (roomId: string, levelId: string): string => {
  const mappedFile = KIDS_ROOM_JSON_MAP[roomId];
  if (mappedFile) return mappedFile;

  const suffix =
    levelId === 'level1' ? 'kids_l1' :
    levelId === 'level2' ? 'kids_l2' :
    levelId === 'level3' ? 'kids_l3' : 'kids';

  return `${roomId.replace(/-/g, '_')}_${suffix}.json`;
};

const buildRoomJsonFromDb = (room: any) => {
  const entries = Array.isArray(room.entries) ? room.entries : [];
  const keywords = Array.isArray(room.keywords) ? room.keywords : [];

  const json: any = {
    id: room.id,
    title: {
      en: room.title_en || room.id,
      vi: room.title_vi || room.title_en || room.id,
    },
    entries,
  };

  if (room.room_essay_en || room.room_essay_vi) {
    json.content = {
      en: room.room_essay_en || "",
      vi: room.room_essay_vi || "",
    };
  }

  if (keywords.length > 0) {
    json.keywords = keywords;
  }

  if (room.tier) {
    json.tier = room.tier;
  }

  if (room.domain) {
    json.domain = room.domain;
  }

  if (room.schema_id) {
    json.schema_id = room.schema_id;
  }

  return json;
};

export default function UnifiedHealthCheck() {
  const { tier } = useParams<{ tier: string }>();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [health, setHealth] = useState<RoomHealth | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fixing, setFixing] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<string>(tier || "free");
  const [progress, setProgress] = useState<{ current: number; total: number; roomName: string } | null>(null);
  const [deepScanResults, setDeepScanResults] = useState<DeepRoomReport[]>([]);
  const [deepScanning, setDeepScanning] = useState(false);
  const [currentScanningFile, setCurrentScanningFile] = useState<string | null>(null);
  const [bulkFixing, setBulkFixing] = useState(false);
  const [bulkFixProgress, setBulkFixProgress] = useState<{ current: number; total: number; roomName: string } | null>(null);
  const [bulkFixingAudio, setBulkFixingAudio] = useState(false);
  const [audioFixProgress, setAudioFixProgress] = useState<{ current: number; total: number; roomName: string } | null>(null);
  const [bulkFixingKeywords, setBulkFixingKeywords] = useState(false);
  const [keywordFixProgress, setKeywordFixProgress] = useState<{ current: number; total: number; roomName: string } | null>(null);
  const [bulkFixingFilenames, setBulkFixingFilenames] = useState(false);
  const [filenameFixProgress, setFilenameFixProgress] = useState<{ current: number; total: number; roomName: string } | null>(null);
  const [fixingRoomId, setFixingRoomId] = useState<string | null>(null);
  const [fixingAudioRoomId, setFixingAudioRoomId] = useState<string | null>(null);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [phantomRooms, setPhantomRooms] = useState<{ id: string, title: string }[]>([]);
  const [bulkFixingJson, setBulkFixingJson] = useState(false);
  const [jsonFixProgress, setJsonFixProgress] = useState<{ current: number; total: number; roomName: string } | null>(null);
  
  // Missing audio scanner state
  const [scanningMissingAudio, setScanningMissingAudio] = useState(false);
  const [audioScanResults, setAudioScanResults] = useState<AudioScanResult | null>(null);
  
  // Auto-fix state
  const [autoFixing, setAutoFixing] = useState(false);
  const [autoFixResults, setAutoFixResults] = useState<any[]>([]);
  
  // Design violations state
  const [designViolations, setDesignViolations] = useState<any>(null);
  const [loadingDesignScan, setLoadingDesignScan] = useState(false);
  
  // Kids room filtering state (for kids tiers only)
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [availableRooms, setAvailableRooms] = useState<Array<{ id: string; title: string; level: string }>>([]);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);

  // Room health summary from edge function
  interface VipTierCoverage {
    tierId: string;
    label: string;
    expectedCount: number;
    dbActiveCount: number;
    missingRoomIds: string[];
    inactiveRoomIds: string[];
    wrongTierRoomIds: string[];
  }

  interface RoomHealthSummary {
    global: {
      total_rooms: number;
      rooms_zero_audio: number;
      rooms_low_health: number;
      rooms_missing_json: number;
    };
    byTier: {
      [tier: string]: {
        total_rooms: number;
        rooms_zero_audio: number;
        rooms_low_health: number;
        rooms_missing_json: number;
      };
    };
    vip_track_gaps: {
      tier: string;
      title: string;
      total_rooms: number;
      min_required: number;
      issue: string;
    }[];
    tier_counts: Record<string, number>;
    vipTierCoverage?: VipTierCoverage[];
  }
  
  const [summary, setSummary] = useState<RoomHealthSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const allTiers = [
    { value: "free", label: "Free" },
    { value: "vip1", label: "VIP1" },
    { value: "vip2", label: "VIP2" },
    { value: "vip3", label: "VIP3" },
    { value: "vip4", label: "VIP4" },
    { value: "vip5", label: "VIP5" },
    { value: "vip6", label: "VIP6" },
    { value: "vip7", label: "VIP7" },
    { value: "vip8", label: "VIP8" },
    { value: "vip9", label: "VIP9" },
    { value: "kidslevel1", label: "Kids Level 1" },
    { value: "kidslevel2", label: "Kids Level 2" },
    { value: "kidslevel3", label: "Kids Level 3" },
  ];

  const tierDisplay = getTierDisplayName(selectedTier);

  useEffect(() => {
    // Load summary for all tiers on initial mount
    fetchSummary();
  }, []);

  // Removed auto-run - user must manually trigger scans for deep checks

  const fetchSummary = async (tierOverride?: string) => {
    setSummaryLoading(true);
    setSummaryError(null);
    try {
      const { data, error } = await supabase.functions.invoke("room-health-summary", {
        body: tierOverride ? { tier: tierOverride } : {},
      });

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error("No data returned from room-health-summary");
      }

      console.log("[Health] raw room-health-summary response:", data);

      const typed = data as RoomHealthSummary;

      // Basic structure sanity check
      if (!typed.global || !typed.byTier) {
        throw new Error("Invalid health summary structure");
      }

      setSummary(typed);
    } catch (err: any) {
      console.error("[Health] room-health-summary error:", err);
      setSummaryError(err?.message ?? "Unknown error");
    } finally {
      setSummaryLoading(false);
    }
  };

  const loadAvailableKidsRooms = async () => {
    try {
      let query = supabase
        .from('kids_rooms')
        .select('id, title_en, level_id')
        .eq('is_active', true)
        .order('level_id')
        .order('display_order');

      if (selectedLevel !== "all") {
        query = query.eq('level_id', selectedLevel);
      }

      const { data, error } = await query;

      if (error) throw error;

      const rooms = (data || []).map(room => ({
        id: room.id,
        title: room.title_en,
        level: room.level_id
      }));

      setAvailableRooms(rooms);
      
      // Reset selected rooms when level changes
      setSelectedRooms([]);
    } catch (error) {
      console.error('Error loading kids rooms:', error);
    }
  };

  const downloadMissingFilesReport = () => {
    if (!health) return;

    const missingFileIssues = health.issues.filter(
      issue => issue.issueType === "missing_file"
    );

    if (missingFileIssues.length === 0) {
      toast({
        title: "No missing files",
        description: "All rooms have their JSON files",
      });
      return;
    }

    let report = `MISSING FILES REPORT - ${new Date().toISOString()}\n`;
    report += `═══════════════════════════════════════════════════════════\n\n`;
    report += `Total Missing Files: ${missingFileIssues.length}\n\n`;
    report += `INSTRUCTIONS:\n`;
    report += `- Create these JSON files in the paths specified below\n`;
    report += `- Each file should contain valid room data with entries\n`;
    report += `- Schema_id from database: refers to the room identifier\n\n`;
    report += `═══════════════════════════════════════════════════════════\n\n`;

    missingFileIssues.forEach((issue, index) => {
      report += `${index + 1}. ${issue.roomTitle}\n`;
      report += `   Room ID: ${issue.roomId}\n`;
      report += `   Tier: ${issue.tier}\n`;
      report += `   ${issue.details || issue.message}\n`;
      report += `   Manifest Key: ${issue.manifestKey || 'N/A'}\n`;
      report += `\n`;
    });

    report += `═══════════════════════════════════════════════════════════\n`;
    report += `SUMMARY BY PATH:\n\n`;
    
    const pathMap = new Map<string, string[]>();
    missingFileIssues.forEach(issue => {
      const path = issue.details?.replace('Create: ', '') || 'Unknown path';
      if (!pathMap.has(path)) {
        pathMap.set(path, []);
      }
      pathMap.get(path)!.push(`${issue.roomTitle} (${issue.roomId})`);
    });

    pathMap.forEach((rooms, path) => {
      report += `${path}\n`;
      rooms.forEach(room => report += `  - ${room}\n`);
      report += `\n`;
    });

    // Create and download the file
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `missing-files-report-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Report Downloaded",
      description: `Downloaded report with ${missingFileIssues.length} missing files`,
    });
  };

  // Test if an audio file is accessible
  const testAudioFile = async (audioPath: string): Promise<AudioCheckResult> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
      
      const response = await fetch(`/audio/${audioPath}`, { 
        method: 'HEAD',
        signal: controller.signal 
      });
      clearTimeout(timeoutId);
      
      if (response.ok) {
        return { file: audioPath, status: "success", httpStatus: response.status };
      } else {
        return { 
          file: audioPath, 
          status: "failed", 
          httpStatus: response.status,
          error: `HTTP ${response.status}: ${response.statusText}` 
        };
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        return { file: audioPath, status: "timeout", error: "Request timed out after 3s" };
      }
      return { file: audioPath, status: "failed", error: error.message };
    }
  };

  // Deep scan a single room
  const deepScanRoom = async (room: any, jsonData: any, jsonPath: string): Promise<DeepRoomReport> => {
    const report: DeepRoomReport = {
      roomId: room.id,
      roomTitle: room.title_en,
      tier: getTierDisplayName(room.tier),
      jsonPath,
      summary: {
        totalIssues: 0,
        audioIssues: 0,
        entryIssues: 0,
        healthScore: 100
      },
      audioChecks: [],
      entryValidation: [],
      issues: []
    };

    // 1. Extract all audio files from JSON
    const audioFiles = new Set<string>();
    if (jsonData.content?.audio) {
      // Split space-separated audio files
      const files = jsonData.content.audio.trim().split(/\s+/);
      files.forEach((f: string) => audioFiles.add(f));
    }
    if (jsonData.entries && Array.isArray(jsonData.entries)) {
      jsonData.entries.forEach((entry: any) => {
        if (entry.audio) {
          if (typeof entry.audio === 'string') {
            // Split space-separated audio files
            const files = entry.audio.trim().split(/\s+/);
            files.forEach((f: string) => audioFiles.add(f));
          } else if (entry.audio.en) {
            // Split space-separated audio files
            const files = entry.audio.en.trim().split(/\s+/);
            files.forEach((f: string) => audioFiles.add(f));
          }
        }
      });
    }

    // 2. Test all audio files
    for (const audioFile of audioFiles) {
      const result = await testAudioFile(audioFile);
      report.audioChecks.push(result);
      
      if (result.status !== "success") {
        report.summary.audioIssues++;
        report.issues.push({
          roomId: room.id,
          roomTitle: room.title_en,
          tier: report.tier,
          issueType: "audio_unreachable",
          message: `Audio file unreachable: ${audioFile}`,
          details: result.error || `Status: ${result.status}`,
          audioFile: audioFile
        });
      }
      
      // Check for _vip9_ pattern in VIP9 audio filenames (should be normalized)
      if (room.tier && (room.tier.includes('VIP9') || room.tier === 'vip9')) {
        if (audioFile.includes('_vip9_')) {
          report.summary.audioIssues++;
          report.issues.push({
            roomId: room.id,
            roomTitle: room.title_en,
            tier: report.tier,
            issueType: "audio_filename_mismatch",
            message: `Audio filename contains "_vip9_" and needs normalization: ${audioFile}`,
            details: `Should be: ${audioFile.replace(/_vip9_/g, '_')}`,
            audioFile: audioFile
          });
        }
      }
    }

    // 3. Validate entries against database
    const dbEntries = room.entries || [];
    const jsonEntries = jsonData.entries || [];
    
    // Helper to get entry identifier (handles different JSON formats)
    const getEntryId = (entry: any): string | null => {
      if (!entry || typeof entry !== 'object') return null;
      
      const id = entry.slug || entry.artifact_id || entry.id;
      
      // Ensure we return a valid string or null
      if (id && typeof id === 'string' && id.trim().length > 0) {
        return id.trim();
      }
      
      return null;
    };
    
    const dbSlugs = new Set(dbEntries.map((e: any) => getEntryId(e)).filter(Boolean));
    const jsonSlugs = new Set(jsonEntries.map((e: any) => getEntryId(e)).filter(Boolean));

    // Check JSON entries
    jsonEntries.forEach((jsonEntry: any) => {
      const entryId = getEntryId(jsonEntry);
      
      if (!entryId) {
        // Entry has no identifier - skip validation but note it
        return;
      }
      
      const validation: EntryValidation = {
        slug: entryId,
        inJson: true,
        inDb: dbSlugs.has(entryId)
      };

      if (!validation.inDb) {
        validation.issue = "Entry exists in JSON but not in database";
        report.summary.entryIssues++;
        report.issues.push({
          roomId: room.id,
          roomTitle: room.title_en,
          tier: report.tier,
          issueType: "entry_mismatch",
          message: `Entry "${entryId}" in JSON but not in database`,
          entrySlug: entryId
        });
      }

      report.entryValidation.push(validation);
    });

    // Check DB entries
    dbEntries.forEach((dbEntry: any) => {
      const entryId = getEntryId(dbEntry);
      
      if (!entryId) {
        // Entry has no identifier - skip validation
        return;
      }
      
      if (!jsonSlugs.has(entryId)) {
        const validation: EntryValidation = {
          slug: entryId,
          inJson: false,
          inDb: true,
          issue: "Entry exists in database but not in JSON"
        };
        report.summary.entryIssues++;
        report.issues.push({
          roomId: room.id,
          roomTitle: room.title_en,
          tier: report.tier,
          issueType: "entry_mismatch",
          message: `Entry "${entryId}" in database but not in JSON`,
          entrySlug: entryId
        });
        report.entryValidation.push(validation);
      }
    });

    // Calculate health score
    report.summary.totalIssues = report.issues.length;
    const maxIssues = audioFiles.size + jsonEntries.length + dbEntries.length;
    if (maxIssues > 0) {
      report.summary.healthScore = Math.max(0, Math.round(100 - (report.summary.totalIssues / maxIssues) * 100));
    }

    return report;
  };

  // Stop deep scan
  const stopDeepScan = () => {
    console.log('🛑 Stopping deep scan...');
    if (abortController) {
      abortController.abort();
      setAbortController(null);
    }
    setDeepScanning(false);
    setProgress(null);
    toast({
      title: "Scan Stopped",
      description: "Deep scan was cancelled by user",
    });
  };

  // Remove phantom rooms (rooms in DB with no JSON files)
  const removePhantomRooms = async () => {
    if (phantomRooms.length === 0) {
      toast({
        title: "No Phantom Rooms",
        description: "Run a deep scan first to identify rooms without JSON files",
      });
      return;
    }

    // Enhanced confirmation with full list and stronger warning
    const roomList = phantomRooms.map(r => `• ${r.id} - ${r.title}`).join('\n');
    const confirmed = window.confirm(
      `⚠️ PERMANENT DELETION WARNING ⚠️\n\n` +
      `This will PERMANENTLY DELETE ${phantomRooms.length} rooms from the database.\n\n` +
      `These rooms were identified as having NO JSON files in public/data/:\n\n` +
      `${roomList}\n\n` +
      `THIS CANNOT BE UNDONE!\n\n` +
      `Are you absolutely sure you want to delete these rooms?`
    );

    if (!confirmed) return;

    // Double confirmation for safety
    const doubleConfirm = window.confirm(
      `FINAL CONFIRMATION:\n\n` +
      `Deleting ${phantomRooms.length} rooms. Type OK to proceed.`
    );

    if (!doubleConfirm) {
      toast({
        title: "Deletion Cancelled",
        description: "No rooms were deleted",
      });
      return;
    }

    console.log('🗑️ Removing', phantomRooms.length, 'phantom rooms...');
    
    try {
      const { error } = await supabase
        .from('rooms')
        .delete()
        .in('id', phantomRooms.map(r => r.id));

      if (error) throw error;

      toast({
        title: "Phantom Rooms Removed",
        description: `Successfully removed ${phantomRooms.length} rooms from database`,
      });

      setPhantomRooms([]);
      setDeepScanResults([]);
      
      // Re-run quick scan to refresh counts
      checkRoomHealth();
    } catch (error: any) {
      console.error('❌ Error removing phantom rooms:', error);
      toast({
        title: "Removal Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Sync rooms from JSON files in public/data/
  const syncRoomsFromGitHub = async () => {
    console.log('🔄 Starting GitHub sync...');
    setLoading(true);

    const result = await guardedCall(
      'Sync rooms from JSON',
      async () => {
        const { data, error } = await supabase.functions.invoke('sync-rooms-from-json');
        
        if (error) {
          throw new Error(error.message || 'Failed to invoke sync function');
        }

        return data;
      },
      {
        showSuccessToast: false, // We'll show custom success toast
        showErrorToast: true
      }
    );

    if (result.success && result.data) {
      const syncData = result.data;
      console.log('✅ Sync complete:', syncData);

      toast({
        title: "Sync Complete",
        description: `Discovered ${syncData.discovered} files, inserted ${syncData.inserted}, updated ${syncData.updated}${syncData.errors > 0 ? `, ${syncData.errors} errors` : ''}`,
      });

      // Refresh the room counts
      checkRoomHealth();
    }

    setLoading(false);
  };

  // Run deep scan for current tier
  const runDeepScan = async () => {
    console.log('🔍 Starting Deep Scan for tier:', selectedTier);
    
    // Create new abort controller for this scan
    const controller = new AbortController();
    setAbortController(controller);
    
    setDeepScanning(true);
    setDeepScanResults([]);
    setProgress(null);
    
    try {
      console.log('[Deep Scan] Starting deep scan...');
      const { data: rooms, error } = await supabase
        .from('rooms')
        .select('*')
        .ilike('tier', `%${selectedTier}%`);
      
      if (error) {
        console.error('[Deep Scan] Database query error:', error);
        throw error;
      }
      
      console.log(`[Deep Scan] Found ${rooms?.length || 0} rooms for tier ${selectedTier}`);
      
      if (!rooms || rooms.length === 0) {
        console.warn('⚠️ No rooms found for tier:', selectedTier);
        toast({
          title: "No Rooms Found",
          description: `No rooms found for tier: ${selectedTier}`,
          variant: "destructive"
        });
        return;
      }

      console.log('🚀 Starting deep scan of', rooms.length, 'rooms');
      const reports: DeepRoomReport[] = [];
      const failedRooms: { id: string, title: string, error: string }[] = [];
      const total = rooms.length;

      for (let i = 0; i < total; i++) {
        // Check if scan was aborted
        if (controller.signal.aborted) {
          console.log('🛑 Scan aborted at room', i + 1, 'of', total);
          return;
        }
        
        const room = rooms[i];
        console.log(`📝 Scanning room ${i + 1}/${total}:`, room.id, '-', room.title_en);
        setProgress({ current: i + 1, total, roomName: room.title_en });
        setCurrentScanningFile(`${room.id}.json`);

        // Use strict canonical resolver - NO FALLBACKS
        let jsonData: any = null;
        let resolvedPath: string = "";
        let httpStatus: number | undefined = undefined;
        let fileUrl: string = "";
        
        try {
          const { loadRoomJson, resolveRoomJsonPath } = await import('@/lib/roomJsonResolver');
          resolvedPath = await resolveRoomJsonPath(room.id || "");
          fileUrl = `/public/data/${room.id}.json`;
          
          // First, check if the file exists and capture HTTP status
          try {
            const checkResponse = await fetch(fileUrl, { method: 'HEAD' });
            httpStatus = checkResponse.status;
            console.log(`🔍 File check for ${room.id}: HTTP ${httpStatus}`);
          } catch (fetchError) {
            console.warn(`⚠️ Failed to check file ${fileUrl}:`, fetchError);
          }
          
          jsonData = await loadRoomJson(room.id || "");
          console.log(`✅ Loaded JSON for ${room.id}:`, resolvedPath);
        } catch (error: any) {
          // JSON file missing or invalid
          console.warn(`⚠️ JSON file missing for ${room.id}:`, error.message?.split('\n')[0]);

          const hasDbEntries = Array.isArray(room.entries) && room.entries.length > 0;

          if (hasDbEntries) {
            // Room has real content in DB → DO NOT treat as phantom, just report missing JSON
            console.warn(`➡️ Room ${room.id} has database entries; marking as JSON-missing but NOT phantom.`);

            const report: DeepRoomReport = {
              roomId: room.id,
              roomTitle: room.title_en || room.id,
              tier: selectedTier,
              summary: {
                totalIssues: 1,
                audioIssues: 0,
                entryIssues: 0,
                healthScore: 0,
              },
              audioChecks: [],
              entryValidation: [],
              issues: [
                {
                  roomId: room.id,
                  roomTitle: room.title_en || room.id,
                  tier: selectedTier,
                  issueType: "missing_file",
                  message: `Missing JSON file at public/data/${room.id}.json`,
                  details: `Room has database entries but no JSON file. Fix JSON path or export JSON from DB.${httpStatus ? ` HTTP Status: ${httpStatus}` : ''}`,
                  httpStatus,
                  url: fileUrl,
                },
              ],
            };

            reports.push(report);
            setDeepScanResults((prev) => [...prev, report]);
          } else {
            // Truly phantom: no JSON and no DB entries → candidate for cleanup (requires explicit delete)
            failedRooms.push({
              id: room.id,
              title: room.title_en || room.id,
              error: "JSON file not found or invalid, and room has no DB entries",
            });
          }

          // Skip to next room
          continue;
        }

        try {
          const report = await deepScanRoom(room, jsonData, resolvedPath);
          reports.push(report);
          console.log(`✅ Deep scan complete for ${room.id}. Issues:`, report.summary.totalIssues);
          // Update results incrementally for real-time display
          setDeepScanResults((prev) => [...prev, report]);
        } catch (error: any) {
          // Deep scan failed for reasons other than missing JSON
          console.error(`❌ Deep scan failed for ${room.id}:`, error);

          const fallbackReport: DeepRoomReport = {
            roomId: room.id,
            roomTitle: room.title_en || room.id,
            tier: selectedTier,
            summary: {
              totalIssues: 1,
              audioIssues: 0,
              entryIssues: 0,
              healthScore: 0,
            },
            audioChecks: [],
            entryValidation: [],
            issues: [
              {
                roomId: room.id,
                roomTitle: room.title_en || room.id,
                tier: selectedTier,
                issueType: "invalid_json",
                message: "Deep scan failed due to invalid or unexpected JSON structure",
                details: error instanceof Error ? error.message : String(error),
              },
            ],
          };

          reports.push(fallbackReport);
          setDeepScanResults((prev) => [...prev, fallbackReport]);
        }
      }

      console.log('✅ Deep scan loop complete. Successfully scanned:', reports.length, '| Failed:', failedRooms.length);
      
      // Show results with failure count
      if (failedRooms.length > 0) {
        console.warn('⚠️ ROOMS MISSING JSON FILES:', failedRooms.length);
        console.table(failedRooms.slice(0, 20).map(r => ({ ID: r.id, Title: r.title })));
        
        // Store phantom rooms for cleanup option
        setPhantomRooms(failedRooms);
        
        // Add phantom rooms to results with proper DeepRoomReport structure
        const phantomReports: DeepRoomReport[] = await Promise.all(failedRooms.map(async r => {
          // Check HTTP status for phantom rooms too
          let phantomStatus: number | undefined = undefined;
          const phantomUrl = `/public/data/${r.id}.json`;
          try {
            const checkResponse = await fetch(phantomUrl, { method: 'HEAD' });
            phantomStatus = checkResponse.status;
          } catch (err) {
            console.warn(`Failed to check phantom room ${r.id}`);
          }
          
          return {
            roomId: r.id,
            roomTitle: r.title,
            tier: selectedTier,
            summary: {
              totalIssues: 1,
              audioIssues: 0,
              entryIssues: 0,
              healthScore: 0
            },
            audioChecks: [],
            entryValidation: [],
            issues: [{
              roomId: r.id,
              roomTitle: r.title,
              tier: selectedTier,
              issueType: "missing_file",
              message: `Missing JSON file at public/data/${r.id}.json`,
              httpStatus: phantomStatus,
              url: phantomUrl,
              details: r.error
            }]
          };
        }));
        
        // Combine successful and failed scans for display (incremental update)
        setDeepScanResults(prev => [...prev, ...phantomReports]);
        
        // Different message if NO rooms were successfully scanned
        if (reports.length === 0) {
          toast({
            title: "Database Cleanup Needed",
            description: `All ${failedRooms.length} rooms in database are missing JSON files. Check console for room list. Use "Remove Phantom Rooms" button below.`,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Deep Scan Complete",
            description: `✅ ${reports.length} rooms scanned | ❌ ${failedRooms.length} rooms missing JSON files (check console)`,
            variant: "destructive"
          });
        }
      } else {
        setDeepScanResults(reports);
        console.log('🎉 All rooms scanned successfully!');
        toast({
          title: "Deep Scan Complete",
          description: `Scanned ${reports.length} rooms with detailed validation`,
        });
      }
    } catch (error: any) {
      console.error('💥 Deep Scan Error:', error);
      toast({
        title: "Deep Scan Failed",
        description: error.message || 'Unknown error occurred',
        variant: "destructive"
      });
    } finally {
      console.log('🏁 Cleaning up deep scan state');
      setDeepScanning(false);
      setProgress(null);
      setCurrentScanningFile(null);
      setAbortController(null);
    }
  };

  // Try to find audio file with different path variations
  const findAudioFile = async (audioPath: string): Promise<string | null> => {
    const baseName = audioPath.split('/').pop() || audioPath;
    const pathVariations = [
      audioPath,
      `/audio/${audioPath}`,
      `audio/${audioPath}`,
      `/audio/${baseName}`,
      `audio/${baseName}`,
      baseName,
    ];

    for (const path of pathVariations) {
      try {
        const response = await fetch(`/audio/${path.replace(/^\/audio\//, '')}`, { method: 'HEAD' });
        if (response.ok) {
          return path.replace(/^\/audio\//, '');
        }
      } catch {
        continue;
      }
    }

    return null;
  };

  // Bulk fix audio filename patterns (_vip9_ normalization)
  const bulkFixAudioFilenames = async () => {
    const roomsWithFilenameIssues = deepScanResults.filter(
      report => report.issues.some(i => i.issueType === "audio_filename_mismatch")
    );

    if (roomsWithFilenameIssues.length === 0) {
      toast({
        title: "No Filename Issues Found",
        description: "No rooms with audio filename issues to fix",
      });
      return;
    }

    setBulkFixingFilenames(true);
    let successCount = 0;
    let failCount = 0;

    try {
      for (let i = 0; i < roomsWithFilenameIssues.length; i++) {
        const report = roomsWithFilenameIssues[i];
        setFilenameFixProgress({
          current: i + 1,
          total: roomsWithFilenameIssues.length,
          roomName: report.roomTitle
        });

        try {
          // Normalize audio filenames by removing _vip9_
          const { error } = await supabase.rpc('exec_sql', {
            sql: `
              UPDATE rooms SET entries = (
                SELECT jsonb_agg(
                  jsonb_set(entry, '{audio}', to_jsonb(
                    regexp_replace(entry->>'audio', '_vip9_', '_', 'g')
                  ))
                )
                FROM jsonb_array_elements(entries) AS entry
              )
              WHERE id = '${report.roomId}';
            `
          });

          // Fallback if RPC doesn't work - use direct update
          if (error) {
            const { data: roomData, error: fetchError } = await supabase
              .from('rooms')
              .select('entries')
              .eq('id', report.roomId)
              .single();

            if (fetchError || !roomData) {
              failCount++;
              continue;
            }

            const normalizedEntries = roomData.entries.map((entry: any) => ({
              ...entry,
              audio: entry.audio ? entry.audio.replace(/_vip9_/g, '_') : entry.audio
            }));

            const { error: updateError } = await supabase
              .from('rooms')
              .update({ entries: normalizedEntries })
              .eq('id', report.roomId);

            if (updateError) {
              failCount++;
            } else {
              successCount++;
            }
          } else {
            successCount++;
          }
        } catch (error: any) {
          console.error(`Error fixing filenames for ${report.roomId}:`, error);
          failCount++;
        }
      }

      toast({
        title: "Filename Fix Complete",
        description: `Normalized audio filenames in ${successCount} rooms. ${failCount > 0 ? `${failCount} rooms failed.` : ''}`,
        variant: failCount > 0 ? "default" : "default"
      });

      // Re-run deep scan to refresh results
      if (successCount > 0) {
        await runDeepScan();
      }
    } finally {
      setBulkFixingFilenames(false);
      setFilenameFixProgress(null);
    }
  };

  // Bulk fix audio issues
  const bulkFixAudioIssues = async () => {
    const roomsWithAudioIssues = deepScanResults.filter(
      report => report.summary.audioIssues > 0
    );

    if (roomsWithAudioIssues.length === 0) {
      toast({
        title: "No Audio Issues Found",
        description: "No rooms with audio issues to fix",
      });
      return;
    }

    setBulkFixingAudio(true);
    let successCount = 0;
    let failCount = 0;
    let fixedFiles = 0;

    try {
      for (let i = 0; i < roomsWithAudioIssues.length; i++) {
        const report = roomsWithAudioIssues[i];
        setAudioFixProgress({
          current: i + 1,
          total: roomsWithAudioIssues.length,
          roomName: report.roomTitle
        });

        try {
          // Load JSON file
          const response = await fetch(`/${report.jsonPath}`);
          if (!response.ok) {
            failCount++;
            continue;
          }

          // Check if response is actually JSON
          const contentType = response.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            console.warn(`Skipping ${report.roomId}: Response is not JSON`);
            failCount++;
            continue;
          }

          const jsonData = await response.json();
          let hasChanges = false;

          // Fix audio in entries
          if (jsonData.entries && Array.isArray(jsonData.entries)) {
            for (const entry of jsonData.entries) {
              if (entry.audio) {
                const audioPath = typeof entry.audio === 'string' 
                  ? entry.audio 
                  : entry.audio.en;
                
                if (audioPath) {
                  // Test if current path works
                  const testResult = await testAudioFile(audioPath);
                  if (testResult.status !== "success") {
                    // Try to find correct path
                    const correctedPath = await findAudioFile(audioPath);
                    if (correctedPath) {
                      if (typeof entry.audio === 'string') {
                        entry.audio = correctedPath;
                      } else {
                        entry.audio.en = correctedPath;
                      }
                      hasChanges = true;
                      fixedFiles++;
                    }
                  }
                }
              }
            }
          }

          // Fix audio in content
          if (jsonData.content?.audio) {
            const testResult = await testAudioFile(jsonData.content.audio);
            if (testResult.status !== "success") {
              const correctedPath = await findAudioFile(jsonData.content.audio);
              if (correctedPath) {
                jsonData.content.audio = correctedPath;
                hasChanges = true;
                fixedFiles++;
              }
            }
          }

          if (hasChanges) {
            // Update database with corrected entries
            const { error } = await supabase
              .from('rooms')
              .update({ entries: jsonData.entries })
              .eq('id', report.roomId);

            if (error) {
              console.error(`Failed to update ${report.roomId}:`, error);
              failCount++;
            } else {
              successCount++;
            }
          }
        } catch (error: any) {
          console.error(`Error fixing audio for ${report.roomId}:`, error);
          failCount++;
        }
      }

      toast({
        title: "Audio Fix Complete",
        description: `Fixed ${fixedFiles} audio files across ${successCount} rooms. ${failCount > 0 ? `${failCount} rooms failed.` : ''}`,
        variant: failCount > 0 ? "default" : "default"
      });

      // Re-run deep scan to refresh results
      if (successCount > 0) {
        await runDeepScan();
      }
    } finally {
      setBulkFixingAudio(false);
      setAudioFixProgress(null);
    }
  };

  // Bulk fix entry mismatches
  const bulkFixEntryMismatches = async () => {
    // Get all rooms with entry_mismatch issues
    const roomsWithMismatches = deepScanResults.filter(
      report => report.summary.entryIssues > 0
    );

    if (roomsWithMismatches.length === 0) {
      toast({
        title: "No Issues Found",
        description: "No rooms with entry mismatches to fix",
      });
      return;
    }

    setBulkFixing(true);
    let successCount = 0;
    let failCount = 0;

    try {
      for (let i = 0; i < roomsWithMismatches.length; i++) {
        const report = roomsWithMismatches[i];
        setBulkFixProgress({
          current: i + 1,
          total: roomsWithMismatches.length,
          roomName: report.roomTitle
        });

        try {
          // Load JSON file
          const response = await fetch(`/${report.jsonPath}`);
          if (!response.ok) {
            console.error(`Failed to load JSON for ${report.roomId}`);
            failCount++;
            continue;
          }

          // Check if response is actually JSON
          const contentType = response.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            console.warn(`Skipping ${report.roomId}: Response is not JSON`);
            failCount++;
            continue;
          }

          const jsonData = await response.json();
          
          if (!jsonData.entries || !Array.isArray(jsonData.entries)) {
            console.error(`No entries found in JSON for ${report.roomId}`);
            failCount++;
            continue;
          }

          // Update the database with entries from JSON
          const { error } = await supabase
            .from('rooms')
            .update({ entries: jsonData.entries })
            .eq('id', report.roomId);

          if (error) {
            console.error(`Failed to update ${report.roomId}:`, error);
            failCount++;
          } else {
            successCount++;
          }
        } catch (error: any) {
          console.error(`Error fixing ${report.roomId}:`, error);
          failCount++;
        }
      }

      toast({
        title: "Entry Fix Complete",
        description: `Synced ${successCount} rooms. ${failCount > 0 ? `${failCount} rooms failed.` : ''}`,
        variant: failCount > 0 ? "default" : "default"
      });

      // Re-run deep scan to refresh results
      if (successCount > 0) {
        await runDeepScan();
      }
    } finally {
      setBulkFixing(false);
      setBulkFixProgress(null);
    }
  };

  // Bulk fix missing keywords for VIP9 rooms
  const bulkFixKeywords = async () => {
    setBulkFixingKeywords(true);
    let successCount = 0;
    let failCount = 0;

    try {
      // Query VIP9 rooms with empty keywords
      const { data: rooms, error: roomsError } = await supabase
        .from('rooms')
        .select('id, title_en, keywords, tier')
        .ilike('tier', '%vip9%')
        .or('keywords.is.null,keywords.eq.{}');

      if (roomsError) throw roomsError;

      if (!rooms || rooms.length === 0) {
        toast({
          title: "No Issues Found",
          description: "All VIP9 rooms have keywords populated",
        });
        return;
      }

      const roomsNeedingFix = rooms.filter(r => !r.keywords || r.keywords.length === 0);

      if (roomsNeedingFix.length === 0) {
        toast({
          title: "No Issues Found",
          description: "All VIP9 rooms have keywords populated",
        });
        return;
      }

      for (let i = 0; i < roomsNeedingFix.length; i++) {
        const room = roomsNeedingFix[i];
        setKeywordFixProgress({
          current: i + 1,
          total: roomsNeedingFix.length,
          roomName: room.title_en
        });

        try {
          // Try to load JSON file using canonical path
          const response = await fetch(`/data/${room.id}.json`);
          if (!response.ok) {
            console.error(`Failed to load JSON for ${room.id}`);
            failCount++;
            continue;
          }

          const contentType = response.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            console.warn(`Skipping ${room.id}: Response is not JSON`);
            failCount++;
            continue;
          }

          const jsonData = await response.json();
          
          // Extract keywords from JSON
          let keywords: string[] = [];
          
          // Check for keywords in various possible locations
          if (jsonData.keywords) {
            if (Array.isArray(jsonData.keywords)) {
              keywords = jsonData.keywords;
            } else if (typeof jsonData.keywords === 'object') {
              // Handle bilingual keywords {en: [], vi: []}
              keywords = [...(jsonData.keywords.en || []), ...(jsonData.keywords.vi || [])];
            }
          }
          
          // Also check entries for keywords
          if (jsonData.entries && Array.isArray(jsonData.entries)) {
            jsonData.entries.forEach((entry: any) => {
              if (entry.keywords_en) keywords.push(...entry.keywords_en);
              if (entry.keywords_vi) keywords.push(...entry.keywords_vi);
              if (entry.keywords && Array.isArray(entry.keywords)) {
                keywords.push(...entry.keywords);
              }
            });
          }

          // Deduplicate
          keywords = [...new Set(keywords)];

          if (keywords.length === 0) {
            console.warn(`No keywords found in JSON for ${room.id}`);
            failCount++;
            continue;
          }

          // Update database
          const { error } = await supabase
            .from('rooms')
            .update({ keywords })
            .eq('id', room.id);

          if (error) {
            console.error(`Failed to update ${room.id}:`, error);
            failCount++;
          } else {
            console.log(`✅ Updated ${room.id} with ${keywords.length} keywords`);
            successCount++;
          }
        } catch (error: any) {
          console.error(`Error fixing ${room.id}:`, error);
          failCount++;
        }
      }

      toast({
        title: "Keyword Fix Complete",
        description: `Updated ${successCount} rooms with keywords. ${failCount > 0 ? `${failCount} rooms failed.` : ''}`,
      });

      // Refresh the page data
      if (successCount > 0) {
        checkRooms();
      }
    } catch (error: any) {
      toast({
        title: "Keyword Fix Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setBulkFixingKeywords(false);
      setKeywordFixProgress(null);
    }
  };

  // Scan for missing audio files across all rooms
  const scanMissingAudio = async () => {
    setScanningMissingAudio(true);
    setAudioScanResults(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('scan-missing-audio');
      
      if (error) throw error;
      
      setAudioScanResults(data as AudioScanResult);
      
      toast({
        title: "Audio Scan Complete",
        description: `Checked ${data.totalChecked} audio files. ${data.missingCount} missing.`,
        variant: data.missingCount > 0 ? "default" : "default"
      });
    } catch (error: any) {
      console.error('Error scanning audio:', error);
      toast({
        title: "Scan Failed",
        description: error.message || 'Failed to scan audio files',
        variant: "destructive"
      });
    } finally {
      setScanningMissingAudio(false);
    }
  };

  // Load design violations scan
  const loadDesignViolations = async () => {
    setLoadingDesignScan(true);
    setDesignViolations(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('scan-design-violations');
      
      if (error) throw error;
      
      setDesignViolations(data);
      
      const violationCount = data?.total_violations ?? 0;
      toast({
        title: "Design Scan Complete",
        description: violationCount === 0 
          ? "✅ No design violations found!" 
          : `Found ${violationCount} design contract violations`,
        variant: violationCount > 0 ? "destructive" : "default"
      });
    } catch (error: any) {
      console.error('Error scanning design violations:', error);
      toast({
        title: "Scan Failed",
        description: error.message || 'Failed to scan design violations',
        variant: "destructive"
      });
    } finally {
      setLoadingDesignScan(false);
    }
  };

  // Auto-fix rooms using room-health-auto-fix edge function
  const handleAutoFix = async () => {
    if (deepScanResults.length === 0) return;
    
    setAutoFixing(true);
    setAutoFixResults([]);
    
    try {
      const roomIds = deepScanResults.map(r => r.roomId);
      
      const { data, error } = await supabase.functions.invoke('room-health-auto-fix', {
        body: { room_ids: roomIds }
      });
      
      if (error) throw error;
      
      if (!data || !data.summaries) {
        throw new Error('Invalid response from auto-fix function');
      }
      
      setAutoFixResults(data.summaries);
      
      toast({
        title: "Auto-Fix Complete",
        description: `Fixed ${data.processed} rooms. Check results below.`,
      });
      
      // Refresh deep scan to show updated state
      await runDeepScan();
    } catch (error: any) {
      console.error('Error auto-fixing rooms:', error);
      toast({
        title: "Auto-Fix Failed",
        description: error.message || 'Failed to auto-fix rooms',
        variant: "destructive"
      });
    } finally {
      setAutoFixing(false);
    }
  };

  // Export missing audio as CSV
  const exportMissingAudioCSV = () => {
    if (!audioScanResults || audioScanResults.missingCount === 0) return;
    
    const headers = ['Room ID', 'Room Title', 'Entry Slug', 'Field', 'Filename', 'Status'];
    const rows = audioScanResults.missingFiles.map(entry => [
      entry.roomId,
      entry.roomTitle,
      entry.entrySlug,
      entry.field,
      entry.filename,
      entry.status
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `missing-audio-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "CSV Exported",
      description: `Downloaded ${audioScanResults.missingCount} missing audio files list`
    });
  };

  // Copy missing filenames to clipboard
  const copyMissingFilenames = async () => {
    if (!audioScanResults || audioScanResults.missingCount === 0) return;
    
    const filenames = audioScanResults.missingFiles.map(entry => entry.filename).join('\n');
    
    try {
      await navigator.clipboard.writeText(filenames);
      toast({
        title: "Copied to Clipboard",
        description: `${audioScanResults.missingCount} filenames copied`
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Could not copy to clipboard",
        variant: "destructive"
      });
    }
  };

  // Fix entries for a single room
  const fixSingleRoomEntries = async (roomId: string, roomTitle: string, jsonPath: string) => {
    setFixingRoomId(roomId);
    
    try {
      // Load JSON file
      const response = await fetch(`/${jsonPath}`);
      if (!response.ok) {
        toast({
          title: "Failed to Load JSON",
          description: `Could not load JSON file for ${roomTitle}`,
          variant: "destructive"
        });
        return;
      }

      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        toast({
          title: "Invalid Response",
          description: `Response is not JSON for ${roomTitle}`,
          variant: "destructive"
        });
        return;
      }

      const jsonData = await response.json();
      
      if (!jsonData.entries || !Array.isArray(jsonData.entries)) {
        toast({
          title: "No Entries Found",
          description: `No entries found in JSON for ${roomTitle}`,
          variant: "destructive"
        });
        return;
      }

      // Update the database with entries from JSON
      const { error } = await supabase
        .from('rooms')
        .update({ entries: jsonData.entries })
        .eq('id', roomId);

      if (error) {
        toast({
          title: "Update Failed",
          description: `Failed to update ${roomTitle}: ${error.message}`,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Entries Synced",
        description: `Successfully synced ${jsonData.entries.length} entries for ${roomTitle}`,
      });

      // Re-run deep scan to refresh results
      await runDeepScan();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to fix ${roomTitle}: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setFixingRoomId(null);
    }
  };

  // Fix audio for a single room
  const fixSingleRoomAudio = async (roomId: string, roomTitle: string, jsonPath: string) => {
    setFixingAudioRoomId(roomId);
    let fixedFiles = 0;
    
    try {
      // Load JSON file
      const response = await fetch(`/${jsonPath}`);
      if (!response.ok) {
        toast({
          title: "Failed to Load JSON",
          description: `Could not load JSON file for ${roomTitle}`,
          variant: "destructive"
        });
        return;
      }

      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        toast({
          title: "Invalid Response",
          description: `Response is not JSON for ${roomTitle}`,
          variant: "destructive"
        });
        return;
      }

      const jsonData = await response.json();
      let hasChanges = false;

      // Fix audio in entries
      if (jsonData.entries && Array.isArray(jsonData.entries)) {
        for (const entry of jsonData.entries) {
          if (entry.audio) {
            const audioPath = typeof entry.audio === 'string' 
              ? entry.audio 
              : entry.audio.en;
            
            if (audioPath) {
              // Test if current path works
              const testResult = await testAudioFile(audioPath);
              if (testResult.status !== "success") {
                // Try to find correct path
                const correctedPath = await findAudioFile(audioPath);
                if (correctedPath) {
                  if (typeof entry.audio === 'string') {
                    entry.audio = correctedPath;
                  } else {
                    entry.audio.en = correctedPath;
                  }
                  hasChanges = true;
                  fixedFiles++;
                }
              }
            }
          }
        }
      }

      // Fix audio in content
      if (jsonData.content?.audio) {
        const testResult = await testAudioFile(jsonData.content.audio);
        if (testResult.status !== "success") {
          const correctedPath = await findAudioFile(jsonData.content.audio);
          if (correctedPath) {
            jsonData.content.audio = correctedPath;
            hasChanges = true;
            fixedFiles++;
          }
        }
      }

      if (!hasChanges) {
        toast({
          title: "No Fixes Needed",
          description: `Could not find corrected paths for audio files in ${roomTitle}`,
        });
        return;
      }

      // Update database with corrected entries
      const { error } = await supabase
        .from('rooms')
        .update({ entries: jsonData.entries })
        .eq('id', roomId);

      if (error) {
        toast({
          title: "Update Failed",
          description: `Failed to update ${roomTitle}: ${error.message}`,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Audio Fixed",
        description: `Successfully fixed ${fixedFiles} audio file${fixedFiles > 1 ? 's' : ''} for ${roomTitle}`,
      });

      // Re-run deep scan to refresh results
      await runDeepScan();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to fix audio for ${roomTitle}: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setFixingAudioRoomId(null);
    }
  };

  // Download comprehensive report
  const downloadComprehensiveReport = () => {
    if (deepScanResults.length === 0) {
      toast({
        title: "No Data",
        description: "Run a deep scan first to generate a report",
      });
      return;
    }

    let report = `COMPREHENSIVE ROOM HEALTH REPORT\n`;
    report += `Generated: ${new Date().toISOString()}\n`;
    report += `Tier: ${tierDisplay}\n`;
    report += `═══════════════════════════════════════════════════════════\n\n`;

    report += `SUMMARY\n`;
    report += `Total Rooms Scanned: ${deepScanResults.length}\n`;
    
    const totalIssues = deepScanResults.reduce((sum, r) => sum + r.summary.totalIssues, 0);
    const totalAudioIssues = deepScanResults.reduce((sum, r) => sum + r.summary.audioIssues, 0);
    const totalEntryIssues = deepScanResults.reduce((sum, r) => sum + r.summary.entryIssues, 0);
    const avgHealthScore = Math.round(
      deepScanResults.reduce((sum, r) => sum + r.summary.healthScore, 0) / deepScanResults.length
    );

    report += `Total Issues Found: ${totalIssues}\n`;
    report += `- Audio Issues: ${totalAudioIssues}\n`;
    report += `- Entry Mismatches: ${totalEntryIssues}\n`;
    report += `Average Health Score: ${avgHealthScore}%\n\n`;
    report += `═══════════════════════════════════════════════════════════\n\n`;

    // Room-by-room details
    deepScanResults.forEach((roomReport, index) => {
      report += `${index + 1}. ${roomReport.roomTitle} (${roomReport.roomId})\n`;
      report += `   Health Score: ${roomReport.summary.healthScore}%\n`;
      report += `   JSON Path: ${roomReport.jsonPath}\n`;
      report += `   Issues: ${roomReport.summary.totalIssues}\n\n`;

      if (roomReport.audioChecks.length > 0) {
        report += `   Audio Files Checked: ${roomReport.audioChecks.length}\n`;
        const failedAudio = roomReport.audioChecks.filter(a => a.status !== "success");
        if (failedAudio.length > 0) {
          report += `   ⚠️ Failed Audio Files:\n`;
          failedAudio.forEach(audio => {
            report += `      - ${audio.file}: ${audio.error || audio.status}\n`;
          });
        }
        report += `\n`;
      }

      if (roomReport.entryValidation.length > 0) {
        const entryIssues = roomReport.entryValidation.filter(e => e.issue);
        if (entryIssues.length > 0) {
          report += `   ⚠️ Entry Validation Issues:\n`;
          entryIssues.forEach(entry => {
            report += `      - ${entry.slug}: ${entry.issue}\n`;
          });
        }
        report += `\n`;
      }

      if (roomReport.issues.length > 0) {
        report += `   All Issues:\n`;
        roomReport.issues.forEach(issue => {
          report += `      - [${issue.issueType}] ${issue.message}\n`;
          if (issue.details) report += `        Details: ${issue.details}\n`;
        });
      }

      report += `\n───────────────────────────────────────────────────────────\n\n`;
    });

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `room-health-comprehensive-${selectedTier}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Report Downloaded",
      description: `Comprehensive report for ${deepScanResults.length} rooms`,
    });
  };

  const checkRoomHealth = async () => {
    setLoading(true);
    setError(null);
    setProgress(null);
    
    // Initialize health state for streaming updates
    setHealth({
      totalRooms: 0,
      healthyRooms: 0,
      issuesFound: 0,
      issues: [],
    });

    try {
      if (selectedTier.startsWith("kidslevel")) {
        await checkKidsRooms();
      } else {
        await checkMainRooms();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setProgress(null);
    }
  };

  const checkMainRooms = async () => {
    let query = supabase
      .from("rooms")
      .select("*")
      .neq("tier", "kids");

    // Use case-insensitive matching for the selected tier
    if (selectedTier && !selectedTier.startsWith("kidslevel")) {
      query = query.ilike("tier", `%${selectedTier}%`);
    }

    const { data: rooms, error: roomsError } = await query;

    if (roomsError) throw roomsError;

    const totalRooms = rooms?.length || 0;
    
    // Initialize streaming state
    setHealth({
      totalRooms,
      healthyRooms: 0,
      issuesFound: 0,
      issues: [],
    });

    for (let i = 0; i < (rooms?.length || 0); i++) {
      const room = rooms![i];
      setProgress({ current: i + 1, total: totalRooms, roomName: room.title_en });
      
      const roomIssues: RoomIssue[] = [];

      // Check if JSON file exists and is valid
      const manifestPathById = PUBLIC_ROOM_MANIFEST[room.id];
      const manifestKeyWithTier = room.tier
        ? `${room.id}-${String(room.tier).toLowerCase()}`
        : null;
      const manifestPathByTier = manifestKeyWithTier
        ? PUBLIC_ROOM_MANIFEST[manifestKeyWithTier]
        : undefined;

      const manifestCandidates: { url: string; key: string; path: string }[] = [];
      if (manifestPathById) {
        manifestCandidates.push({
          url: `/${manifestPathById}`,
          key: room.id,
          path: manifestPathById,
        });
      }
      if (manifestPathByTier && manifestPathByTier !== manifestPathById) {
        manifestCandidates.push({
          url: `/${manifestPathByTier}`,
          key: manifestKeyWithTier!,
          path: manifestPathByTier,
        });
      }

      // Generate multiple filename patterns to match inconsistent naming in actual files
      const schemaId = room.schema_id || room.id;
      const tier = room.tier || 'free';
      const tierSuffix = tier.toLowerCase().replace(/\s+/g, '');
      
      // Helper: Capitalize and preserve special chars
      const capitalizeWord = (word: string) => {
        if (!word || word === '&') return word;
        return word.charAt(0).toUpperCase() + word.slice(1);
      };
      
      // Pattern 1: Exact schema_id (lowercase with hyphens)
      const pattern1 = `${schemaId}.json`;
      
      // Pattern 2: Replace hyphens with underscores
      const pattern2 = `${schemaId.replace(/-/g, "_")}.json`;
      
      // Pattern 3: Capitalize words, replace hyphens with underscores
      const pattern3 = schemaId.split('-')
        .map(capitalizeWord)
        .join('_') + '.json';
      
      // Pattern 4: Pattern 3 + tier suffix
      const pattern4 = schemaId.split('-')
        .map(capitalizeWord)
        .join('_') + `_${tierSuffix}.json`;
      
      // Pattern 5: Replace hyphens with underscores, capitalize
      const pattern5 = schemaId.replace(/-/g, '_')
        .split('_')
        .map(capitalizeWord)
        .join('_') + '.json';
      
      // Pattern 6: Pattern 5 + tier suffix
      const pattern6 = schemaId.replace(/-/g, '_')
        .split('_')
        .map(capitalizeWord)
        .join('_') + `_${tierSuffix}.json`;
      
      // Pattern 7: English writing series (lowercase with -ii)
      const pattern7 = `${schemaId.toLowerCase().replace('vip3ii', 'vip3-ii')}.json`;
      
      // Pattern 8: Replace & with "And", capitalize
      const pattern8 = schemaId.replace(/&/g, 'and')
        .split(/[-_]/)
        .map(capitalizeWord)
        .join('_') + `_${tierSuffix}.json`;
      
      // Pattern 9: weight-loss-&-fitness -> Weight_Loss_And_Fitness_vip3
      const pattern9 = schemaId.replace(/-&-/g, '_And_')
        .replace(/&/g, 'And')
        .split('-')
        .map(capitalizeWord)
        .join('_') + `_${tierSuffix}.json`;
      
      // Pattern 10: Schema ID specific mappings for known files
      const specificMappings: Record<string, string> = {
        'weight-loss-&-fitness': 'Weight_Loss_And_Fitness_vip3.json',
        'strategy-in-life---mastery-&-legacy': 'Strategy_In_Life_Mastery_Legacy_vip3.json',
        'mercy_blade_english': 'Mercy_Blade_Method_Of_ Learning_English.json', // Note the space!
        'quiet_growth_vip3_3': 'Quiet_Growth_Simple Investing_vip3.3.finance.json',
        'quiet_growth': 'Quiet_Growth_Simple Investing_vip3.3.finance.json',
        'legacy_peace_vip3_6': 'Legacy_&_Long_Term_Peace_vip3_6_finance.json',
        'diverse_desires_vip3_sub5': 'Diverse_Desires_&_Belonging_vip3_sub5_sex.json',
        'relational_erotic_vip3_sub2': 'Relational_Intelligence_&_Erotic_Communication_vip3_sub2_sex.json',
        'sexuality_culture_vip3': 'Sexuality & Curiosity & Culture_vip3.json',
        'sexuality-curiosity-culture-vip3': 'Sexuality & Curiosity & Culture_vip3.json',
        'mercy-blade-room-v1': 'Sexuality & Curiosity & Culture_vip3.json',
        'growing_bigger_vip3_5': 'Growing_Bigger_When_Ready_vip3_5_fiance.json',
        'finance_grow_bigger_vip3_sub5': 'Growing_Bigger_When_Ready_vip3_5_fiance.json',
        'strategy_tactics_ii_vip3': 'Strategy_in_Life_ Advanced_Tactics_II_vip3.json',
        'strategy_life_advanced_tactics_vip3': 'Strategy_in_Life_Advanced_Tactics_II_vip3.json',
        'strategy_life_foundations_vip3': 'Strategy_in_Life_Foundations_II_vip3.json',
        'english-writing-deepdive-part5-vip3ii': 'english-writing-deepdive-part5-vip3-ii.json',
        'english-writing-deepdive-part8-vip3ii': 'english-writing-deepdive-part8-vip3-ii.json',
      };
      
      const pattern10 = specificMappings[schemaId] || '';
      
      // Pattern 11: Legacy format (triple hyphen to single underscore)
      const pattern11 = schemaId.replace(/---/g, '_')
        .replace(/--/g, '_')
        .replace(/-/g, '_')
        .split('_')
        .map(capitalizeWord)
        .join('_') + `_${tierSuffix}.json`;
      
      // Pattern 12: Mixed case preservation for english-writing
      const pattern12 = `${schemaId}.json`;

      const fallbackCandidates: { url: string; key: string; path: string }[] = [
        { url: `/data/${room.id}.json`, key: "fallback", path: `data/${room.id}.json` },
        ...(pattern10 ? [{ url: `/data/${pattern10}`, key: "specific", path: `data/${pattern10}` }] : []),
        { url: `/data/${pattern1}`, key: "fallback", path: `data/${pattern1}` },
        { url: `/data/${pattern2}`, key: "fallback", path: `data/${pattern2}` },
        { url: `/data/${pattern3}`, key: "fallback", path: `data/${pattern3}` },
        { url: `/data/${pattern4}`, key: "fallback", path: `data/${pattern4}` },
        { url: `/data/${pattern5}`, key: "fallback", path: `data/${pattern5}` },
        { url: `/data/${pattern6}`, key: "fallback", path: `data/${pattern6}` },
        { url: `/data/${pattern7}`, key: "fallback", path: `data/${pattern7}` },
        { url: `/data/${pattern8}`, key: "fallback", path: `data/${pattern8}` },
        { url: `/data/${pattern9}`, key: "fallback", path: `data/${pattern9}` },
        { url: `/data/${pattern11}`, key: "fallback", path: `data/${pattern11}` },
        { url: `/data/${pattern12}`, key: "fallback", path: `data/${pattern12}` },
      ];

      const fileCandidates = [...manifestCandidates, ...fallbackCandidates];

      let jsonFound = false;
      let jsonData: any = null;
      let htmlDetected = false;
      let resolvedPath: string | undefined;
      let resolvedManifestKey: string | undefined;

      for (const { url, key, path } of fileCandidates) {
        try {
          // Add timeout to prevent hanging
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
          
          console.log(`[Health Check] Trying: ${url}`);
          const response = await fetch(url, { signal: controller.signal });
          clearTimeout(timeoutId);
          
          console.log(`[Health Check] ${url} → Status: ${response.status}`);
          if (!response.ok) continue;

          const text = await response.text();

          // Check if response is HTML instead of JSON (404 page scenario)
          if (text.trim().startsWith("<!") || text.trim().startsWith("<html")) {
            console.warn(`[Health Check] ${url} returned HTML (404 page)`);
            htmlDetected = true;
            continue; // Changed from break to continue - try other candidates
          }

          try {
            jsonData = JSON.parse(text);
            jsonFound = true;
            resolvedPath = path;
            resolvedManifestKey = key !== "fallback" ? key : undefined;
            console.log(`[Health Check] ✅ Found valid JSON at: ${url}`);
            break;
          } catch (parseError: any) {
            console.error(`[Health Check] JSON parse error for ${url}:`, parseError.message);
            roomIssues.push({
              roomId: room.id,
              roomTitle: room.title_en,
              tier: getTierDisplayName(room.tier),
              issueType: "invalid_json",
              message: "Invalid JSON syntax in file",
              details: parseError.message,
              resolvedPath: path,
              manifestKey: key !== "fallback" ? key : undefined,
            });
            continue; // Changed from break - try other candidates
          }
        } catch (error: any) {
          // Handle timeout and other fetch errors silently, continue to next candidate
          if (error.name === 'AbortError') {
            console.warn(`[Health Check] Timeout fetching ${url}`);
          } else {
            console.warn(`[Health Check] Fetch error for ${url}:`, error.message);
          }
        }
      }
      
      if (!jsonFound) {
        console.error(`[Health Check] ❌ No valid JSON found for room ${room.id} (${room.title_en}). Tried ${fileCandidates.length} paths.`);
      }

      if (!jsonFound && roomIssues.length === 0) {
        const suggestedPath = getSuggestedJsonPath(room.schema_id, room.tier || 'free');

        roomIssues.push({
          roomId: room.id,
          roomTitle: room.title_en,
          tier: getTierDisplayName(room.tier),
          issueType: "missing_file",
          message: htmlDetected
            ? "File returns HTML instead of JSON (file missing)"
            : "JSON file not found",
          details: `Create: ${suggestedPath}`,
          manifestKey: manifestKeyWithTier || room.id,
        });
      }

      // If JSON was found and parsed, check entries
      if (jsonData) {
        if (!jsonData.entries || jsonData.entries.length === 0) {
          roomIssues.push({
            roomId: room.id,
            roomTitle: room.title_en,
            tier: getTierDisplayName(room.tier),
            issueType: "no_entries",
            message: "Room has no entries",
            resolvedPath,
            manifestKey: resolvedManifestKey,
          });
        }
      }

      // Check if room is locked
      if (room.is_locked) {
        roomIssues.push({
          roomId: room.id,
          roomTitle: room.title_en,
          tier: getTierDisplayName(room.tier),
          issueType: "locked",
          message: "Room is locked",
          resolvedPath,
          manifestKey: resolvedManifestKey,
        });
      }

      // Stream update: update health state immediately after each room
      setHealth(prev => {
        if (!prev) return prev;
        const newIssues = roomIssues.length > 0 ? [...prev.issues, ...roomIssues] : prev.issues;
        return {
          totalRooms: prev.totalRooms,
          healthyRooms: roomIssues.length === 0 ? prev.healthyRooms + 1 : prev.healthyRooms,
          issuesFound: newIssues.length,
          issues: newIssues,
        };
      });
    }
  };

  const checkKidsRooms = async () => {
    let query = supabase
      .from('kids_rooms')
      .select(`
        id,
        title_en,
        title_vi,
        level_id,
        is_active,
        kids_entries(count)
      `)
      .order('level_id')
      .order('display_order');

    // Apply level filter
    if (selectedLevel !== "all") {
      query = query.eq('level_id', selectedLevel);
    }

    const { data: allRooms, error: roomsError } = await query;

    if (roomsError) throw roomsError;

    // Apply room-specific filter if any rooms are selected
    const rooms = selectedRooms.length > 0 
      ? allRooms?.filter(room => selectedRooms.includes(room.id))
      : allRooms;

    const totalRooms = rooms?.length || 0;
    
    // Initialize streaming state
    setHealth({
      totalRooms,
      healthyRooms: 0,
      issuesFound: 0,
      issues: [],
    });

    for (let i = 0; i < (rooms?.length || 0); i++) {
      const room = rooms![i];
      setProgress({ current: i + 1, total: totalRooms, roomName: room.title_en });
      
      const roomIssues: RoomIssue[] = [];
      const entryCount = room.kids_entries?.[0]?.count || 0;

      // Try to validate JSON file
      try {
        const jsonFileName = getJsonFilenameForKidsRoom(room.id, room.level_id);
        
        // Add timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        const response = await fetch(`/data/${jsonFileName}`, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) {
          roomIssues.push({
            roomId: room.id,
            roomTitle: room.title_en,
            tier: "Kids",
            issueType: "missing_file",
            message: `JSON file not found: /data/${jsonFileName}`,
            isKidsRoom: true,
            levelId: room.level_id,
          });
        } else {
          const contentType = response.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            roomIssues.push({
              roomId: room.id,
              roomTitle: room.title_en,
              tier: "Kids",
              issueType: "missing_file",
              message: `JSON file not found (got ${contentType || 'unknown type'})`,
              isKidsRoom: true,
              levelId: room.level_id,
            });
          } else {
            try {
              const json = await response.json();
              // For kids rooms, we only care that JSON exists and is valid.
              // It's okay if either JSON or DB has zero entries; content can still be loaded from JSON.
              if (!Array.isArray(json.entries)) {
                roomIssues.push({
                  roomId: room.id,
                  roomTitle: room.title_en,
                  tier: "Kids",
                  issueType: "invalid_json",
                  message: "JSON entries field is missing or not an array",
                  isKidsRoom: true,
                  levelId: room.level_id,
                });
              }
            } catch (e) {
              roomIssues.push({
                roomId: room.id,
                roomTitle: room.title_en,
                tier: "Kids",
                issueType: "invalid_json",
                message: "Invalid JSON syntax in file",
                isKidsRoom: true,
                levelId: room.level_id,
              });
            }
          }
        }
      } catch (e: any) {
        roomIssues.push({
          roomId: room.id,
          roomTitle: room.title_en,
          tier: "Kids",
          issueType: "missing_file",
          message: e.message,
          isKidsRoom: true,
          levelId: room.level_id,
        });
      }

      if (!room.is_active) {
        roomIssues.push({
          roomId: room.id,
          roomTitle: room.title_en,
          tier: "Kids",
          issueType: "inactive",
          message: "Room is inactive",
          isKidsRoom: true,
          levelId: room.level_id,
        });
      }

      // Stream update: update health state immediately after each room
      setHealth(prev => {
        if (!prev) return prev;
        const newIssues = roomIssues.length > 0 ? [...prev.issues, ...roomIssues] : prev.issues;
        return {
          totalRooms: prev.totalRooms,
          healthyRooms: roomIssues.length === 0 ? prev.healthyRooms + 1 : prev.healthyRooms,
          issuesFound: newIssues.length,
          issues: newIssues,
        };
      });
    }
  };

  const fixKidsRoom = async (roomId: string, levelId: string) => {
    setFixing(roomId);
    try {
      const jsonFileName = getJsonFilenameForKidsRoom(roomId, levelId);
      const response = await fetch(`/data/${jsonFileName}`);
      
      if (!response.ok) {
        throw new Error(`JSON file not found: /data/${jsonFileName}`);
      }

      const roomData = await response.json();
      
      if (!roomData.entries || roomData.entries.length === 0) {
        throw new Error('No entries found in JSON file');
      }

      const entries = roomData.entries.map((entry: any, index: number) => {
        let contentEn = '';
        let contentVi = '';
        
        if (entry.copy) {
          contentEn = entry.copy.en || '';
          contentVi = entry.copy.vi || '';
        } else if (entry.content) {
          contentEn = entry.content.en || '';
          contentVi = entry.content.vi || '';
        }
        
        let audioUrl = entry.audio || entry.audio_url || null;
        if (audioUrl && !audioUrl.startsWith('http') && !audioUrl.startsWith('/')) {
          audioUrl = `/${audioUrl}`;
        }
        
        return {
          id: `${roomId}-${index + 1}`,
          room_id: roomId,
          content_en: contentEn,
          content_vi: contentVi,
          audio_url: audioUrl,
          display_order: index + 1,
          is_active: true
        };
      });

      const { error } = await supabase
        .from('kids_entries')
        .insert(entries);

      if (error) throw error;

      toast({
        title: "Room fixed!",
        description: `Inserted ${entries.length} entries for ${roomId}`,
      });

      await checkRoomHealth();
    } catch (error: any) {
      toast({
        title: "Error fixing room",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setFixing(null);
    }
  };

  const bulkExportMissingJsonFromDb = async () => {
    // Find all rooms in deep scan with missing JSON files
    const roomsWithMissingJson = deepScanResults.filter(report =>
      report.issues.some(i => i.issueType === "missing_file")
    );

    if (roomsWithMissingJson.length === 0) {
      toast({
        title: "No Missing JSON Files",
        description: "No rooms with missing JSON files were found in the latest deep scan.",
      });
      return;
    }

    setBulkFixingJson(true);
    let successCount = 0;
    let skipCount = 0;
    let failCount = 0;

    try {
      for (let i = 0; i < roomsWithMissingJson.length; i++) {
        const report = roomsWithMissingJson[i];
        setJsonFixProgress({
          current: i + 1,
          total: roomsWithMissingJson.length,
          roomName: report.roomTitle,
        });

        try {
          const { data: room, error } = await supabase
            .from('rooms')
            .select('*')
            .eq('id', report.roomId)
            .maybeSingle();

          if (error || !room) {
            console.error(`Failed to load room ${report.roomId}:`, error);
            failCount++;
            continue;
          }

          if (!Array.isArray(room.entries) || room.entries.length === 0) {
            // Phantom room with no real content - skip JSON export
            console.warn(`Skipping JSON export for ${report.roomId}: no database entries.`);
            skipCount++;
            continue;
          }

          const jsonData = buildRoomJsonFromDb(room);
          const filename = `${room.id}.json`;

          const { error: saveError } = await supabase.functions.invoke('save-room-json', {
            body: {
              filename,
              content: JSON.stringify(jsonData, null, 2),
            },
          });

          if (saveError) {
            console.error(`Failed to save JSON for ${report.roomId}:`, saveError);
            failCount++;
            continue;
          }

          successCount++;
        } catch (error: any) {
          console.error(`Error exporting JSON for ${report.roomId}:`, error);
          failCount++;
        }
      }

      toast({
        title: "JSON Export Complete",
        description: `Created ${successCount} JSON files from database. Skipped ${skipCount} rooms without entries.${failCount > 0 ? ` ${failCount} rooms failed.` : ''}`,
      });

      if (successCount > 0) {
        await runDeepScan();
      }
    } finally {
      setBulkFixingJson(false);
      setJsonFixProgress(null);
    }
  };

  const getIssueIcon = (issueType: RoomIssue["issueType"]) => {
    switch (issueType) {
      case "missing_file":
      case "invalid_json":
        return <XCircle className="h-5 w-5 text-destructive" />;
      case "audio_unreachable":
        return <Volume2 className="h-5 w-5 text-amber-500" />;
      case "entry_mismatch":
        return <FileText className="h-5 w-5 text-blue-500" />;
      case "no_entries":
      case "missing_entries":
      case "locked":
      case "inactive":
      case "orphan_json":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getIssueBadge = (issueType: RoomIssue["issueType"]) => {
    const variants: Record<RoomIssue["issueType"], "destructive" | "default" | "secondary"> = {
      missing_file: "destructive",
      invalid_json: "destructive",
      audio_unreachable: "destructive",
      entry_mismatch: "secondary",
      no_entries: "default",
      missing_entries: "default",
      missing_audio: "default",
      locked: "default",
      inactive: "default",
      orphan_json: "default",
    };

    return <Badge variant={variants[issueType]}>{issueType.replace(/_/g, " ")}</Badge>;
  };

  return (
    <>
      <ColorfulMercyBladeHeader subtitle="Room Health Check" />
      <EnvironmentBanner />
      <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/admin/health-dashboard">
            <Button variant="ghost" size="sm" className="mb-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Room Health Check</h1>
          <p className="text-muted-foreground">
            Validate room JSON files and configuration across all tiers
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            <strong>Quick Scan:</strong> Basic validation • <strong>Deep Scan:</strong> Tests audio files & entry matching
          </p>
        </div>
        <div className="flex gap-2">
          {health && health.issues.some(i => i.issueType === "missing_file") && (
            <Button 
              onClick={downloadMissingFilesReport} 
              variant="outline"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Missing Files Report
            </Button>
          )}
          {deepScanResults.length > 0 && (
            <Button 
              onClick={downloadComprehensiveReport} 
              variant="outline"
            >
              <FileText className="mr-2 h-4 w-4" />
              Download Full Report
            </Button>
          )}
          {deepScanning ? (
            <Button 
              onClick={stopDeepScan} 
              variant="destructive"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Stop Scan
            </Button>
          ) : (
            <Button 
              onClick={runDeepScan} 
              disabled={loading}
              variant="secondary"
            >
              <Volume2 className="mr-2 h-4 w-4" />
              Deep Scan
            </Button>
          )}
          <Button onClick={checkRoomHealth} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Scanning...
              </>
            ) : (
              "Quick Scan"
            )}
          </Button>
          <Button
            onClick={() => {
              setHealth(null);
              setDeepScanResults([]);
              setPhantomRooms([]);
              toast({
                title: "Cleared",
                description: "Scan results cleared. Run a new scan.",
              });
            }}
            disabled={loading || deepScanning}
            variant="outline"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Clear & Refresh
          </Button>
          <Button
            onClick={syncRoomsFromGitHub}
            disabled={loading || deepScanning}
            variant="outline"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync from GitHub
          </Button>
          {phantomRooms.length > 0 && !deepScanning && (
            <Button
              onClick={removePhantomRooms}
              variant="destructive"
              size="default"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Remove {phantomRooms.length} Phantom Rooms
            </Button>
          )}
        </div>
      </div>

      {/* Room Health Summary from Edge Function */}
      {summaryLoading ? (
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm text-muted-foreground">Loading health summary...</span>
          </div>
        </Card>
      ) : summary ? (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Health Summary</h2>
          
          {/* Global Metrics */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Global Metrics</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold">{summary.global?.total_rooms ?? 0}</div>
                <div className="text-sm text-muted-foreground">Total Rooms</div>
              </div>
              <div className="p-4 bg-destructive/10 rounded-lg">
                <div className="text-2xl font-bold text-destructive">{summary.global?.rooms_zero_audio ?? 0}</div>
                <div className="text-sm text-muted-foreground">0% Audio</div>
              </div>
              <div className="p-4 bg-yellow-500/10 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{summary.global?.rooms_low_health ?? 0}</div>
                <div className="text-sm text-muted-foreground">Low Health</div>
              </div>
              <div className="p-4 bg-orange-500/10 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{summary.global?.rooms_missing_json ?? 0}</div>
                <div className="text-sm text-muted-foreground">Missing JSON</div>
              </div>
            </div>
          </div>

          {/* Tier-Specific Metrics */}
          {(() => {
            const tierKey = selectedTier?.toLowerCase() ?? null;
            const tierData = tierKey ? summary.byTier?.[tierKey] ?? null : null;

            if (!tierKey) {
              return null;
            }

            if (!tierData) {
              return (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No data available for {tierDisplay} tier yet. This tier may not have any rooms registered.
                  </AlertDescription>
                </Alert>
              );
            }

            return (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  {tierDisplay} Tier Metrics
                </h3>
                <div className="grid grid-cols-4 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold">
                      {tierData.total_rooms ?? 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Rooms</div>
                  </div>
                  <div className="p-4 bg-destructive/10 rounded-lg">
                    <div className="text-2xl font-bold text-destructive">
                      {tierData.rooms_zero_audio ?? 0}
                    </div>
                    <div className="text-sm text-muted-foreground">0% Audio</div>
                  </div>
                  <div className="p-4 bg-yellow-500/10 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {tierData.rooms_low_health ?? 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Low Health</div>
                  </div>
                  <div className="p-4 bg-orange-500/10 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {tierData.rooms_missing_json ?? 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Missing JSON</div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* VIP Track Gaps */}
          {(summary.vip_track_gaps ?? []).length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                VIP Tier Gaps {(summary.vip_track_gaps ?? []).length}
              </h3>
              <div className="flex flex-wrap gap-2">
                {(summary.vip_track_gaps ?? []).map((gap) => (
                  <Badge key={gap.tier} variant="destructive">
                    {gap.title}: 0 rooms
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </Card>
      ) : (
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">
            No health data available yet.
          </p>
        </Card>
      )}

      {/* Error State Display */}
      {(summaryError || error) && (
        <Card className="p-6 border-destructive">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-semibold">Health Summary Error</p>
                <p className="text-sm">{summaryError || error}</p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => fetchSummary(selectedTier)}
                  className="mt-2"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Retry
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </Card>
      )}

      {deepScanning && progress && (
        <Card className="p-6 border-blue-500/50 bg-blue-50/30">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-blue-900">Deep Scan in Progress...</span>
              <span className="font-medium text-blue-700">
                {progress.current} / {progress.total}
              </span>
            </div>
            <Progress value={(progress.current / progress.total) * 100} className="h-2" />
            {currentScanningFile && (
              <div className="flex items-center gap-2 text-sm">
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                <span className="text-blue-900 font-mono">{currentScanningFile}</span>
                <span className="text-blue-600">→</span>
                <span className="text-blue-700">{progress.roomName}</span>
              </div>
            )}
          </div>
        </Card>
      )}

      {loading && progress && !deepScanning && (
        <Card className="p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Checking rooms...</span>
              <span className="font-medium">
                {progress.current} / {progress.total}
              </span>
            </div>
            <Progress value={(progress.current / progress.total) * 100} className="h-2" />
            <div className="flex items-center gap-2 text-sm">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-foreground">{progress.roomName}</span>
            </div>
          </div>
        </Card>
      )}

      {bulkFixing && bulkFixProgress && (
        <Card className="p-6 border-green-500/50">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Syncing entries to database...</span>
              <span className="font-medium">
                {bulkFixProgress.current} / {bulkFixProgress.total}
              </span>
            </div>
            <Progress value={(bulkFixProgress.current / bulkFixProgress.total) * 100} className="h-2" />
            <div className="flex items-center gap-2 text-sm">
              <Loader2 className="h-4 w-4 animate-spin text-green-500" />
              <span className="text-foreground">{bulkFixProgress.roomName}</span>
            </div>
          </div>
        </Card>
      )}

      {bulkFixingAudio && audioFixProgress && (
        <Card className="p-6 border-amber-500/50">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Fixing audio paths...</span>
              <span className="font-medium">
                {audioFixProgress.current} / {audioFixProgress.total}
              </span>
            </div>
            <Progress value={(audioFixProgress.current / audioFixProgress.total) * 100} className="h-2" />
            <div className="flex items-center gap-2 text-sm">
              <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
              <span className="text-foreground">{audioFixProgress.roomName}</span>
            </div>
          </div>
        </Card>
      )}

      {bulkFixingKeywords && keywordFixProgress && (
        <Card className="p-6 border-blue-500/50">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Populating keywords from JSON...</span>
              <span className="font-medium">
                {keywordFixProgress.current} / {keywordFixProgress.total}
              </span>
            </div>
            <Progress value={(keywordFixProgress.current / keywordFixProgress.total) * 100} className="h-2" />
            <div className="flex items-center gap-2 text-sm">
              <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
              <span className="text-foreground">{keywordFixProgress.roomName}</span>
            </div>
          </div>
        </Card>
      )}

      {bulkFixingFilenames && filenameFixProgress && (
        <Card className="p-6 border-purple-500/50">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Normalizing audio filenames...</span>
              <span className="font-medium">
                {filenameFixProgress.current} / {filenameFixProgress.total}
              </span>
            </div>
            <Progress value={(filenameFixProgress.current / filenameFixProgress.total) * 100} className="h-2" />
            <div className="flex items-center gap-2 text-sm">
              <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
              <span className="text-foreground">{filenameFixProgress.roomName}</span>
            </div>
          </div>
        </Card>
      )}

      {bulkFixingJson && jsonFixProgress && (
        <Card className="p-6 border-primary/50">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Exporting JSON files from database...</span>
              <span className="font-medium">
                {jsonFixProgress.current} / {jsonFixProgress.total}
              </span>
            </div>
            <Progress value={(jsonFixProgress.current / jsonFixProgress.total) * 100} className="h-2" />
            <div className="flex items-center gap-2 text-sm">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-foreground">{jsonFixProgress.roomName}</span>
            </div>
          </div>
        </Card>
      )}

      {/* VIP Tier Coverage Panel */}
      {summary?.vipTierCoverage && summary.vipTierCoverage.length > 0 && (
        <VipTierCoveragePanel coverage={summary.vipTierCoverage} />
      )}

      {/* Room Link Health - Check UI References vs Data */}
      <RoomLinkHealth />

      {/* Audio Coverage - Audio Completeness by Room/Tier */}
      <AudioCoveragePanel />

      {/* Unified Tier Selection */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Select Tier</label>
            <Select value={selectedTier} onValueChange={setSelectedTier}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="Select a tier" />
              </SelectTrigger>
              <SelectContent>
                {allTiers.map((tier) => (
                  <SelectItem key={tier.value} value={tier.value}>
                    {tier.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Kids-specific filters */}
          {selectedTier.startsWith("kidslevel") && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <label className="text-sm font-medium mb-2 block">Filter by Level</label>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="level1">Kids Level 1 (Ages 4-7)</SelectItem>
                    <SelectItem value="level2">Kids Level 2 (Ages 7-9)</SelectItem>
                    <SelectItem value="level3">Kids Level 3 (Ages 10-12)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {availableRooms.length > 0 && (
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Select Specific Rooms (Optional)
                  </label>
                  <div className="border rounded-md p-3 max-h-40 overflow-y-auto space-y-2">
                    <div className="flex items-center space-x-2 mb-2 pb-2 border-b">
                      <Checkbox
                        id="select-all"
                        checked={selectedRooms.length === availableRooms.length && availableRooms.length > 0}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedRooms(availableRooms.map(r => r.id));
                          } else {
                            setSelectedRooms([]);
                          }
                        }}
                      />
                      <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
                        {selectedRooms.length === availableRooms.length && availableRooms.length > 0 ? 'Deselect All' : 'Select All'}
                      </label>
                    </div>
                    {availableRooms.map((room) => (
                      <div key={room.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={room.id}
                          checked={selectedRooms.includes(room.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedRooms([...selectedRooms, room.id]);
                            } else {
                              setSelectedRooms(selectedRooms.filter(id => id !== room.id));
                            }
                          }}
                        />
                        <label htmlFor={room.id} className="text-sm cursor-pointer">
                          {room.title}
                        </label>
                      </div>
                    ))}
                  </div>
                  {selectedRooms.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {selectedRooms.length} room{selectedRooms.length !== 1 ? 's' : ''} selected
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 pt-4 border-t">
            {/* Quick Scan - placeholder for future implementation */}
            
            {/* Deep Scan */}
            <Button
              onClick={runDeepScan}
              disabled={loading || deepScanning}
              className="bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-600"
            >
              {deepScanning && !scanningMissingAudio && !autoFixing && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Deep Scan
            </Button>

            {/* Scan Missing Audio */}
            <Button
              onClick={scanMissingAudio}
              disabled={loading || deepScanning || scanningMissingAudio}
              className="bg-orange-600 hover:bg-orange-700 text-white border-2 border-orange-600"
            >
              {scanningMissingAudio && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Scan Missing Audio
            </Button>

            {/* Auto-Fix All (only when we have deep scan results) */}
            {deepScanResults.length > 0 && (
              <Button
                onClick={handleAutoFix}
                disabled={autoFixing}
                className="bg-green-600 hover:bg-green-700 text-white border-2 border-green-600"
              >
                {autoFixing && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {autoFixing ? "Fixing..." : "Auto-Fix All"}
              </Button>
            )}

            {/* Design Scan */}
            <Button
              onClick={loadDesignViolations}
              disabled={loadingDesignScan}
              className="bg-purple-600 hover:bg-purple-700 text-white border-2 border-purple-600"
            >
              {loadingDesignScan && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Scan Design
            </Button>
          </div>
        </div>
      </Card>

      {/* Missing Audio Results */}
      {audioScanResults && (
        <Card className="p-6 border-2 border-orange-600">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-black">Missing / Broken Audio Files ({audioScanResults.missingCount})</h2>
                <p className="text-sm text-gray-600">Total checked: {audioScanResults.totalChecked} files</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={exportMissingAudioCSV} variant="outline" className="border-black text-black hover:bg-gray-100">
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
                <Button onClick={copyMissingFilenames} variant="outline" className="border-black text-black hover:bg-gray-100">
                  <FileText className="mr-2 h-4 w-4" />
                  Copy Filenames
                </Button>
              </div>
            </div>
            
            {audioScanResults.missingCount === 0 ? (
              <Alert className="bg-green-50 border-green-500">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  All audio files exist! No missing files found.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border-2 border-black">
                  <thead>
                    <tr className="bg-black text-white">
                      <th className="border border-black p-2 text-left font-bold">Room ID</th>
                      <th className="border border-black p-2 text-left font-bold">Room Title</th>
                      <th className="border border-black p-2 text-left font-bold">Entry Slug</th>
                      <th className="border border-black p-2 text-left font-bold">Field</th>
                      <th className="border border-black p-2 text-left font-bold">Filename</th>
                      <th className="border border-black p-2 text-left font-bold">Checked URL</th>
                      <th className="border border-black p-2 text-left font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {audioScanResults.missingFiles.map((entry, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="border border-black p-2 font-mono text-sm">{entry.roomId}</td>
                        <td className="border border-black p-2 text-sm font-semibold">{entry.roomTitle}</td>
                        <td className="border border-black p-2 font-mono text-sm">{entry.entrySlug}</td>
                        <td className="border border-black p-2 font-mono text-sm">{entry.field}</td>
                        <td className="border border-black p-2 font-mono text-sm">{entry.filename}</td>
                        <td className="border border-black p-2 font-mono text-xs text-gray-600 max-w-xs truncate" title={entry.checkedUrl}>{entry.checkedUrl}</td>
                        <td className="border border-black p-2 text-sm text-red-600 font-bold">{entry.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Health Check Results */}
      {health && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{health.totalRooms}</p>
                  <p className="text-sm text-muted-foreground">Total Rooms</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{health.healthyRooms}</p>
                  <p className="text-sm text-muted-foreground">Healthy Rooms</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center space-x-2">
                <XCircle className="h-5 w-5 text-destructive" />
                <div>
                  <p className="text-2xl font-bold">{health.issuesFound}</p>
                  <p className="text-sm text-muted-foreground">Issues Found</p>
                </div>
              </div>
            </Card>
          </div>

          {health.issuesFound === 0 ? (
            <Card className="p-8 text-center">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">All Rooms Healthy!</h3>
              <p className="text-muted-foreground">
                All rooms are properly configured with valid JSON files.
              </p>
            </Card>
          ) : (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Rooms Requiring Attention</h2>
              <div className="space-y-4">
                {health.issues.map((issue, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 space-y-2 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        {getIssueIcon(issue.issueType)}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold">
                              {issue.roomTitle} ({issue.roomId})
                            </h3>
                            <Badge variant="outline">{issue.tier}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{issue.message}</p>
                          {(issue.manifestKey || issue.resolvedPath) && (
                            <div className="mt-2">
                              <div className="inline-flex items-center gap-2 px-2 py-1 bg-muted rounded text-xs font-mono">
                                {issue.manifestKey && (
                                  <span className="text-muted-foreground">
                                    manifest: <span className="text-foreground">{issue.manifestKey}</span>
                                  </span>
                                )}
                                {issue.resolvedPath && (
                                  <>
                                    {issue.manifestKey && <span className="text-muted-foreground">→</span>}
                                    <span className="text-primary">{issue.resolvedPath}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          )}
                          {(issue.url || issue.httpStatus) && (
                            <div className="mt-2 space-y-1">
                              {issue.url && (
                                <div className="inline-flex items-center gap-2 px-2 py-1 bg-destructive/10 rounded text-xs font-mono">
                                  <span className="text-muted-foreground">URL:</span>
                                  <span className="text-foreground">{issue.url}</span>
                                </div>
                              )}
                              {issue.httpStatus && (
                                <div className="inline-flex items-center gap-2 px-2 py-1 bg-destructive/10 rounded text-xs font-mono ml-2">
                                  <span className="text-muted-foreground">HTTP Status:</span>
                                  <span className={`font-bold ${
                                    issue.httpStatus === 404 ? 'text-red-600' : 
                                    issue.httpStatus >= 500 ? 'text-orange-600' : 
                                    'text-yellow-600'
                                  }`}>
                                    {issue.httpStatus} {
                                      issue.httpStatus === 404 ? '(Not Found)' :
                                      issue.httpStatus >= 500 ? '(Server Error)' :
                                      issue.httpStatus >= 400 ? '(Client Error)' :
                                      '(Other)'
                                    }
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                          {issue.details && (
                            <p className="text-xs text-muted-foreground mt-1 font-mono bg-muted/30 p-2 rounded">
                              {issue.details}
                            </p>
                          )}
                          {issue.issueType === "missing_file" && (
                            <Alert className="mt-2 py-2 px-3">
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription className="text-xs">
                                💡 This file needs to be created. Check the database schema_id field and create the matching JSON file in public/data/
                              </AlertDescription>
                            </Alert>
                          )}
                          {issue.issueType === "missing_entries" && issue.levelId && issue.isKidsRoom && (
                            <Button
                              size="sm"
                              className="mt-2"
                              onClick={() => fixKidsRoom(issue.roomId, issue.levelId!)}
                              disabled={fixing === issue.roomId}
                            >
                              {fixing === issue.roomId ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Fixing...
                                </>
                              ) : (
                                <>
                                  <Wrench className="h-4 w-4 mr-2" />
                                  Fix Room
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                      {getIssueBadge(issue.issueType)}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Deep Scan Results */}
      {deepScanResults.length > 0 && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Deep Scan Results</h2>
                <p className="text-sm text-muted-foreground">
                  Comprehensive validation including audio files and entry matching
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {deepScanResults.some(r => r.issues.some(i => i.issueType === "audio_filename_mismatch")) && (
                  <Button 
                    onClick={bulkFixAudioFilenames} 
                    disabled={bulkFixingFilenames || bulkFixingAudio || bulkFixing || bulkFixingKeywords}
                    variant="default"
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {bulkFixingFilenames ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Normalizing...
                      </>
                    ) : (
                      <>
                        <FileEdit className="mr-2 h-4 w-4" />
                        Bulk Fix Audio Filenames
                      </>
                    )}
                  </Button>
                )}
                {deepScanResults.some(r => r.summary.audioIssues > 0) && (
                  <Button 
                    onClick={bulkFixAudioIssues} 
                    disabled={bulkFixingAudio || bulkFixing || bulkFixingKeywords || bulkFixingFilenames}
                    variant="default"
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    {bulkFixingAudio ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Fixing Audio...
                      </>
                    ) : (
                      <>
                        <Volume2 className="mr-2 h-4 w-4" />
                        Bulk Fix Audio Issues
                      </>
                    )}
                  </Button>
                )}
                {deepScanResults.some(r => r.summary.entryIssues > 0) && (
                  <Button 
                    onClick={bulkFixEntryMismatches} 
                    disabled={bulkFixing || bulkFixingAudio || bulkFixingKeywords || bulkFixingFilenames}
                    variant="default"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {bulkFixing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Syncing...
                      </>
                    ) : (
                      <>
                        <Wrench className="mr-2 h-4 w-4" />
                        Bulk Fix Entry Mismatches
                      </>
                    )}
                  </Button>
                )}
                {selectedTier === "vip9" && (
                  <Button 
                    onClick={bulkFixKeywords} 
                    disabled={bulkFixing || bulkFixingAudio || bulkFixingKeywords || bulkFixingFilenames}
                    variant="default"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {bulkFixingKeywords ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Fixing Keywords...
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2 h-4 w-4" />
                        Bulk Fix VIP9 Keywords
                      </>
                    )}
                  </Button>
                )}
                <Button onClick={downloadComprehensiveReport} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export Report
                </Button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="p-4">
                <div className="text-center">
                  <p className="text-3xl font-bold">
                    {Math.round(deepScanResults.reduce((sum, r) => sum + r.summary.healthScore, 0) / deepScanResults.length)}%
                  </p>
                  <p className="text-sm text-muted-foreground">Avg Health</p>
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-center">
                  <p className="text-3xl font-bold">
                    {deepScanResults.reduce((sum, r) => sum + r.summary.totalIssues, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Issues</p>
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-amber-500">
                    {deepScanResults.reduce((sum, r) => sum + r.summary.audioIssues, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Audio Issues</p>
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-500">
                    {deepScanResults.reduce((sum, r) => sum + r.summary.entryIssues, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Entry Issues</p>
                </div>
              </Card>
            </div>

            {/* Room-by-Room Results */}
            <div className="space-y-4">
              {deepScanResults.map((roomReport, index) => (
                <Card 
                  key={roomReport.roomId} 
                  className={`p-4 ${roomReport.summary.totalIssues > 0 ? 'border-amber-500/50' : 'border-green-500/50'}`}
                >
                  <div className="space-y-3">
                    {/* Room Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{roomReport.roomTitle}</h3>
                        <p className="text-sm text-muted-foreground">{roomReport.roomId}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{roomReport.tier}</Badge>
                        <div className="text-right">
                          <p className={`text-2xl font-bold ${
                            roomReport.summary.healthScore >= 90 ? 'text-green-500' :
                            roomReport.summary.healthScore >= 70 ? 'text-amber-500' :
                            'text-destructive'
                          }`}>
                            {roomReport.summary.healthScore}%
                          </p>
                          <p className="text-xs text-muted-foreground">Health Score</p>
                        </div>
                      </div>
                    </div>

                    {/* Audio Check Summary */}
                    {roomReport.audioChecks.length > 0 && (
                      <div className="border-t pt-3">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium flex items-center gap-2">
                            <Volume2 className="h-4 w-4" />
                            Audio Files ({roomReport.audioChecks.length})
                          </p>
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-muted-foreground">
                              {roomReport.audioChecks.filter(a => a.status === "success").length} / {roomReport.audioChecks.length} working
                            </p>
                            {roomReport.summary.audioIssues > 0 && roomReport.jsonPath && (
                              <Button 
                                size="sm"
                                onClick={() => fixSingleRoomAudio(roomReport.roomId, roomReport.roomTitle, roomReport.jsonPath!)}
                                disabled={fixingAudioRoomId === roomReport.roomId || bulkFixing || bulkFixingAudio}
                                className="bg-amber-600 hover:bg-amber-700"
                              >
                                {fixingAudioRoomId === roomReport.roomId ? (
                                  <>
                                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                    Fixing...
                                  </>
                                ) : (
                                  <>
                                    <Volume2 className="mr-1 h-3 w-3" />
                                    Fix Audio
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        </div>
                        {roomReport.audioChecks.some(a => a.status !== "success") && (
                          <div className="space-y-1 bg-muted/30 rounded p-2">
                            {roomReport.audioChecks.filter(a => a.status !== "success").map((audio, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-xs">
                                <XCircle className="h-3 w-3 text-destructive" />
                                <span className="font-mono flex-1">{audio.file}</span>
                                <Badge variant="destructive" className="text-xs">{audio.status}</Badge>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Entry Validation Summary */}
                    {roomReport.entryValidation.length > 0 && (
                      <div className="border-t pt-3">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Entries ({roomReport.entryValidation.length})
                          </p>
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-muted-foreground">
                              {roomReport.entryValidation.filter(e => !e.issue).length} / {roomReport.entryValidation.length} matched
                            </p>
                            {roomReport.summary.entryIssues > 0 && roomReport.jsonPath && (
                              <Button 
                                size="sm"
                                onClick={() => fixSingleRoomEntries(roomReport.roomId, roomReport.roomTitle, roomReport.jsonPath!)}
                                disabled={fixingRoomId === roomReport.roomId || bulkFixing || bulkFixingAudio}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                {fixingRoomId === roomReport.roomId ? (
                                  <>
                                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                    Fixing...
                                  </>
                                ) : (
                                  <>
                                    <Wrench className="mr-1 h-3 w-3" />
                                    Fix Entries
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        </div>
                         {roomReport.entryValidation.some(e => e.issue) && (
                          <div className="space-y-1 bg-muted/30 rounded p-2">
                            {roomReport.entryValidation.filter(e => e.issue).map((entry, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-xs">
                                <AlertCircle className="h-3 w-3 text-amber-500" />
                                <span className="font-mono flex-1">
                                  {entry.slug || <span className="text-muted-foreground italic">(no identifier)</span>}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {entry.inJson ? 'JSON only' : 'DB only'}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* All Issues */}
                    {roomReport.issues.length > 0 && (
                      <div className="border-t pt-3">
                        <p className="text-sm font-medium mb-2">Issues ({roomReport.issues.length})</p>
                        <div className="space-y-2">
                          {roomReport.issues.map((issue, idx) => (
                            <Alert key={idx} className="py-2">
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription className="text-xs">
                                <strong>[{issue.issueType}]</strong> {issue.message}
                                {(issue.url || issue.httpStatus) && (
                                  <div className="mt-2 space-y-1">
                                    {issue.url && (
                                      <div className="flex items-center gap-2">
                                        <span className="text-muted-foreground">URL:</span>
                                        <code className="text-xs bg-muted px-1 py-0.5 rounded">{issue.url}</code>
                                      </div>
                                    )}
                                    {issue.httpStatus && (
                                      <div className="flex items-center gap-2">
                                        <span className="text-muted-foreground">HTTP:</span>
                                        <code className={`text-xs px-1 py-0.5 rounded font-bold ${
                                          issue.httpStatus === 404 ? 'bg-red-100 text-red-700' : 
                                          issue.httpStatus >= 500 ? 'bg-orange-100 text-orange-700' : 
                                          'bg-yellow-100 text-yellow-700'
                                        }`}>
                                          {issue.httpStatus} {
                                            issue.httpStatus === 404 ? 'Not Found' :
                                            issue.httpStatus >= 500 ? 'Server Error' :
                                            issue.httpStatus >= 400 ? 'Client Error' :
                                            'Other'
                                          }
                                        </code>
                                      </div>
                                    )}
                                  </div>
                                )}
                                {issue.details && <p className="mt-1 text-muted-foreground">{issue.details}</p>}
                              </AlertDescription>
                            </Alert>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Auto-Fix Results Panel */}
      {autoFixResults && autoFixResults.length > 0 && (
        <Card className="p-6 border-2 border-green-600">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-black">
                Auto-Fix Results 
                <Badge className="ml-2 bg-green-600 text-white">{autoFixResults.length} rooms fixed</Badge>
              </h2>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {autoFixResults.map((result, idx) => (
                <Card key={idx} className="p-4 border border-gray-300">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-black">{result.slug || result.room_id}</h3>
                      <div className="flex gap-2">
                        <Badge variant="outline">
                          Health: {result.health_score ?? 0}%
                        </Badge>
                        <Badge variant="outline">
                          Audio: {result.audio_coverage ?? 0}%
                        </Badge>
                      </div>
                    </div>
                    
                    {result.issues_fixed && result.issues_fixed.length > 0 && (
                      <div className="pl-4 space-y-1">
                        <p className="text-sm font-medium text-black">Issues Fixed:</p>
                        <ul className="list-disc list-inside space-y-1">
                          {result.issues_fixed.map((issue: string, i: number) => (
                            <li key={i} className="text-sm text-gray-700">{issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Design Violations Panel */}
      {loadingDesignScan && (
        <Card className="p-6 border-2 border-purple-600">
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
            <p className="text-lg font-bold text-black">Scanning codebase for design violations…</p>
          </div>
        </Card>
      )}

      {!loadingDesignScan && designViolations && (
        <Card className="p-6 border-2 border-purple-600">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-black">
                Design Contract Violations
                {designViolations.total_violations !== undefined && (
                  <Badge className="ml-2 bg-purple-600 text-white">
                    {designViolations.total_violations} violations
                  </Badge>
                )}
              </h2>
              <Button 
                onClick={loadDesignViolations}
                variant="outline"
                className="border-black text-black hover:bg-gray-100"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Re-scan
              </Button>
            </div>

            {designViolations.total_violations === 0 ? (
              <Alert className="bg-green-50 border-green-500">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  ✅ No design violations detected! All code follows semantic token guidelines.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {designViolations.violations && designViolations.violations.length > 0 ? (
                  designViolations.violations.map((fileViolation: any, idx: number) => (
                    <Card key={idx} className="p-4 border border-gray-300">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <code className="text-sm font-mono text-black">{fileViolation.file}</code>
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">
                            {fileViolation.violations?.length ?? 0} issues
                          </Badge>
                        </div>
                        
                        {fileViolation.violations && fileViolation.violations.length > 0 && (
                          <div className="pl-4 space-y-2">
                            {fileViolation.violations.map((violation: any, i: number) => (
                              <div key={i} className="border-l-2 border-purple-600 pl-3">
                                <div className="flex items-start gap-2">
                                  <Badge variant="outline" className="text-xs shrink-0">
                                    {violation.type || 'unknown'}
                                  </Badge>
                                  <div className="flex-1">
                                    <p className="text-sm text-gray-700">{violation.message}</p>
                                    {violation.line && (
                                      <p className="text-xs text-gray-500 mt-1">Line {violation.line}</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </Card>
                  ))
                ) : (
                  <Alert>
                    <AlertDescription>
                      No detailed violations found. Check console for details.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
    </>
  );
}
