import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, XCircle, ArrowLeft, Loader2, Wrench, Download } from "lucide-react";
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
  issueType: "missing_file" | "invalid_json" | "no_entries" | "missing_audio" | "locked" | "missing_entries" | "inactive";
  message: string;
  details?: string;
  resolvedPath?: string;
  manifestKey?: string;
  isKidsRoom?: boolean;
  levelId?: string;
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
  vip9: "VIP9",
  VIP9: "VIP9",
  kids: "Kids",
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
  const [selectedTier, setSelectedTier] = useState<string>(tier || "all");
  const [progress, setProgress] = useState<{ current: number; total: number; roomName: string } | null>(null);
  
  // Kids room filtering state
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [availableRooms, setAvailableRooms] = useState<Array<{ id: string; title: string; level: string }>>([]);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);

  const allTiers = [
    { id: "all", name: "All Tiers" },
    { id: "free", name: "Free" },
    { id: "vip1", name: "VIP 1" },
    { id: "vip2", name: "VIP 2" },
    { id: "vip3", name: "VIP 3" },
    { id: "vip4", name: "VIP 4" },
    { id: "vip5", name: "VIP 5" },
    { id: "vip6", name: "VIP 6" },
    { id: "vip7", name: "VIP 7" },
    { id: "vip9", name: "VIP 9" },
    { id: "kidslevel1", name: "Kids Level 1" },
    { id: "kidslevel2", name: "Kids Level 2" },
    { id: "kidslevel3", name: "Kids Level 3" },
  ];

  const tierDisplay = allTiers.find(t => t.id === selectedTier)?.name || "All Tiers";

  useEffect(() => {
    const isKidsTier = selectedTier.startsWith("kidslevel");
    if (isKidsTier) {
      const level = selectedTier.replace("kidslevel", "level");
      setSelectedLevel(level);
      loadAvailableKidsRooms();
    }
  }, [selectedTier]);


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

  const checkRoomHealth = async () => {
    setLoading(true);
    setError(null);
    setProgress(null);

    try {
      const isKidsTier = selectedTier.startsWith("kidslevel");
      if (isKidsTier) {
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

    if (selectedTier !== "all") {
      query = query.eq("tier", selectedTier.toLowerCase());
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
      case "no_entries":
      case "missing_entries":
      case "locked":
      case "inactive":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getIssueBadge = (issueType: RoomIssue["issueType"]) => {
    const variants: Record<RoomIssue["issueType"], "destructive" | "default"> = {
      missing_file: "destructive",
      invalid_json: "destructive",
      no_entries: "default",
      missing_entries: "default",
      missing_audio: "default",
      locked: "default",
      inactive: "default",
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
          <h1 className="text-3xl font-bold">All Rooms Health Check</h1>
          <p className="text-muted-foreground">
            Validate room configurations across all tiers including Kids levels
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
          <Button onClick={checkRoomHealth} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Scanning...
              </>
            ) : (
              "Refresh"
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

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1">
            <h2 className="text-lg font-semibold mb-1">Select Tier</h2>
            <p className="text-sm text-muted-foreground">Choose a tier to validate its rooms</p>
          </div>
          <Select value={selectedTier} onValueChange={setSelectedTier}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select tier" />
            </SelectTrigger>
            <SelectContent>
              {allTiers.map((tier) => (
                <SelectItem key={tier.id} value={tier.id}>
                  {tier.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {health && (
        <>
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
                All rooms in {tierDisplay} are properly configured with valid JSON files.
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
                          {issue.issueType === "missing_entries" && issue.isKidsRoom && issue.levelId && (
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
        </>
      )}
    </div>
  );
}
