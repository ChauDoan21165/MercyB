import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// Tabs component removed - using unified tier dropdown instead
import { AlertCircle, CheckCircle2, XCircle, ArrowLeft, Loader2, Wrench, Download, Play, Volume2, FileText } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { PUBLIC_ROOM_MANIFEST } from "@/lib/roomManifest";
import { KIDS_ROOM_JSON_MAP } from "@/pages/KidsChat";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface RoomIssue {
  roomId: string;
  roomTitle: string;
  tier: string;
  issueType: "missing_file" | "invalid_json" | "no_entries" | "missing_audio" | "locked" | "missing_entries" | "inactive" | "orphan_json" | "audio_unreachable" | "entry_mismatch";
  message: string;
  details?: string;
  resolvedPath?: string;
  manifestKey?: string;
  isKidsRoom?: boolean;
  levelId?: string;
  audioFile?: string;
  entrySlug?: string;
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

interface RoomHealth {
  totalRooms: number;
  healthyRooms: number;
  issuesFound: number;
  issues: RoomIssue[];
}

const TIER_DISPLAY_NAMES: Record<string, string> = {
  free: "Free",
  "Free / Miễn phí": "Free",
  vip1: "VIP1",
  VIP1: "VIP1",
  vip2: "VIP2",
  VIP2: "VIP2",
  vip3: "VIP3",
  VIP3: "VIP3",
  vip4: "VIP4",
  VIP4: "VIP4",
  vip5: "VIP5",
  VIP5: "VIP5",
  vip6: "VIP6",
  VIP6: "VIP6",
  vip7: "VIP7",
  VIP7: "VIP7",
  vip8: "VIP8",
  VIP8: "VIP8",
  vip9: "VIP9",
  VIP9: "VIP9",
  kids: "Kids",
  kidslevel1: "Kids Level 1",
  kidslevel2: "Kids Level 2",
  kidslevel3: "Kids Level 3",
};

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
  const [bulkFixing, setBulkFixing] = useState(false);
  const [bulkFixProgress, setBulkFixProgress] = useState<{ current: number; total: number; roomName: string } | null>(null);
  const [bulkFixingAudio, setBulkFixingAudio] = useState(false);
  const [audioFixProgress, setAudioFixProgress] = useState<{ current: number; total: number; roomName: string } | null>(null);
  const [fixingRoomId, setFixingRoomId] = useState<string | null>(null);
  const [fixingAudioRoomId, setFixingAudioRoomId] = useState<string | null>(null);
  
  // Kids room filtering state (for kids tiers only)
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [availableRooms, setAvailableRooms] = useState<Array<{ id: string; title: string; level: string }>>([]);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);

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

  const tierDisplay = TIER_DISPLAY_NAMES[selectedTier] || selectedTier.toUpperCase();

  useEffect(() => {
    if (selectedTier.startsWith("kidslevel")) {
      loadAvailableKidsRooms();
    }
  }, [selectedTier, selectedLevel]);

  // Removed auto-run - user must manually trigger scans

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
      tier: TIER_DISPLAY_NAMES[room.tier] || room.tier,
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

  // Run deep scan for current tier
  const runDeepScan = async () => {
    setDeepScanning(true);
    setDeepScanResults([]);
    
    try {
      let query = supabase
        .from("rooms")
        .select("*")
        .neq("tier", "kids");

      if (selectedTier && !selectedTier.startsWith("kidslevel")) {
        query = query.ilike("tier", `%${selectedTier}%`);
      }

      const { data: rooms, error: roomsError } = await query;
      if (roomsError) throw roomsError;

      const reports: DeepRoomReport[] = [];
      const total = rooms?.length || 0;

      for (let i = 0; i < total; i++) {
        const room = rooms![i];
        setProgress({ current: i + 1, total, roomName: room.title_en });

        // Find and load JSON file
        const manifestPathById = PUBLIC_ROOM_MANIFEST[room.id];
        if (!manifestPathById) continue;

        try {
          const response = await fetch(`/${manifestPathById}`);
          if (!response.ok) continue;
          
          // Check if response is actually JSON
          const contentType = response.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            console.warn(`Skipping ${room.id}: Response is not JSON (${contentType})`);
            continue;
          }
          
          const jsonData = await response.json();
          const report = await deepScanRoom(room, jsonData, manifestPathById);
          reports.push(report);
        } catch (error) {
          console.warn(`Skipping room ${room.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      setDeepScanResults(reports);
      
      toast({
        title: "Deep Scan Complete",
        description: `Scanned ${reports.length} rooms with detailed validation`,
      });
    } catch (error: any) {
      toast({
        title: "Deep Scan Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setDeepScanning(false);
      setProgress(null);
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

    const issues: RoomIssue[] = [];
    let healthyCount = 0;
    const totalRooms = rooms?.length || 0;

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
          
          const response = await fetch(url, { signal: controller.signal });
          clearTimeout(timeoutId);
          
          if (!response.ok) continue;

          const text = await response.text();

          // Check if response is HTML instead of JSON (404 page scenario)
          if (text.trim().startsWith("<!") || text.trim().startsWith("<html")) {
            htmlDetected = true;
            break;
          }

          try {
            jsonData = JSON.parse(text);
            jsonFound = true;
            resolvedPath = path;
            resolvedManifestKey = key !== "fallback" ? key : undefined;
            break;
          } catch (parseError: any) {
            roomIssues.push({
              roomId: room.id,
              roomTitle: room.title_en,
              tier: TIER_DISPLAY_NAMES[room.tier] || room.tier,
              issueType: "invalid_json",
              message: "Invalid JSON syntax in file",
              details: parseError.message,
              resolvedPath: path,
              manifestKey: key !== "fallback" ? key : undefined,
            });
            break;
          }
        } catch (error: any) {
          // Handle timeout and other fetch errors silently, continue to next candidate
          if (error.name === 'AbortError') {
            console.warn(`Timeout fetching ${url}`);
          }
        }
      }

      if (!jsonFound && roomIssues.length === 0) {
        const suggestedPath = getSuggestedJsonPath(room.schema_id, room.tier || 'free');

        roomIssues.push({
          roomId: room.id,
          roomTitle: room.title_en,
          tier: TIER_DISPLAY_NAMES[room.tier] || room.tier,
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
            tier: TIER_DISPLAY_NAMES[room.tier] || room.tier,
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
          tier: TIER_DISPLAY_NAMES[room.tier] || room.tier,
          issueType: "locked",
          message: "Room is locked",
          resolvedPath,
          manifestKey: resolvedManifestKey,
        });
      }

      if (roomIssues.length === 0) {
        healthyCount++;
      } else {
        issues.push(...roomIssues);
      }
    }

    setHealth({
      totalRooms: rooms?.length || 0,
      healthyRooms: healthyCount,
      issuesFound: issues.length,
      issues,
    });
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

    const issues: RoomIssue[] = [];
    let healthyCount = 0;
    const totalRooms = rooms?.length || 0;

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

      if (roomIssues.length === 0) {
        healthyCount++;
      } else {
        issues.push(...roomIssues);
      }
    }

    setHealth({
      totalRooms: rooms?.length || 0,
      healthyRooms: healthyCount,
      issuesFound: issues.length,
      issues,
    });
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
          <Button 
            onClick={runDeepScan} 
            disabled={deepScanning || loading}
            variant="secondary"
          >
            {deepScanning ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deep Scanning...
              </>
            ) : (
              <>
                <Volume2 className="mr-2 h-4 w-4" />
                Deep Scan
              </>
            )}
          </Button>
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
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading && progress && (
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
        </div>
      </Card>

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
              <div className="flex gap-2">
                {deepScanResults.some(r => r.summary.audioIssues > 0) && (
                  <Button 
                    onClick={bulkFixAudioIssues} 
                    disabled={bulkFixingAudio || bulkFixing}
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
                    disabled={bulkFixing || bulkFixingAudio}
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
    </div>
  );
}
