import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, XCircle, AlertCircle, Loader2, Music, FileText, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { KIDS_ROOM_JSON_MAP } from '@/pages/KidsChat';

// Types
interface RoomIssue {
  code: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  details?: string;
}

interface RoomHealthResult {
  roomId: string;
  roomTitle: string;
  tier: string;
  isKids: boolean;
  issues: RoomIssue[];
  entryCount: number;
  audioCount: number;
  audioCoverage: number;
  healthScore: number;
}

interface HealthSummary {
  totalRooms: number;
  healthyRooms: number;
  roomsWithIssues: number;
  missingJson: number;
  missingAudio: number;
  missingEntries: number;
  results: RoomHealthResult[];
}

// Tier options
const TIER_OPTIONS = [
  { value: 'all', label: 'All Tiers' },
  { value: 'free', label: 'Free' },
  { value: 'vip1', label: 'VIP1' },
  { value: 'vip2', label: 'VIP2' },
  { value: 'vip3', label: 'VIP3' },
  { value: 'vip4', label: 'VIP4' },
  { value: 'vip5', label: 'VIP5' },
  { value: 'vip6', label: 'VIP6' },
  { value: 'vip7', label: 'VIP7' },
  { value: 'vip8', label: 'VIP8' },
  { value: 'vip9', label: 'VIP9' },
  { value: 'kids_1', label: 'Kids Level 1 (Ages 3-6)' },
  { value: 'kids_2', label: 'Kids Level 2 (Ages 7-9)' },
  { value: 'kids_3', label: 'Kids Level 3 (Ages 10-13)' },
];

// Helper to get Kids JSON filename
const getKidsJsonFilename = (roomId: string, levelId: string): string => {
  const mappedFile = KIDS_ROOM_JSON_MAP[roomId];
  if (mappedFile) return mappedFile;

  const suffix =
    levelId === 'level1' ? 'kids_l1' :
    levelId === 'level2' ? 'kids_l2' :
    levelId === 'level3' ? 'kids_l3' : 'kids';

  return `${roomId.replace(/-/g, '_')}_${suffix}.json`;
};

export default function UnifiedRoomHealthCheck() {
  const { isAdmin, loading: adminLoading } = useAdminCheck();
  const { toast } = useToast();
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [checking, setChecking] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number; roomName: string } | null>(null);
  const [summary, setSummary] = useState<HealthSummary | null>(null);

  const isKidsTier = (tier: string) => tier.startsWith('kids_');

  const runHealthCheck = async () => {
    setChecking(true);
    setProgress(null);
    setSummary(null);

    try {
      const results: RoomHealthResult[] = [];
      let missingJson = 0;
      let missingAudio = 0;
      let missingEntries = 0;

      // Determine what to check
      const checkKids = selectedTier === 'all' || isKidsTier(selectedTier);
      const checkMain = selectedTier === 'all' || !isKidsTier(selectedTier);

      // Fetch main rooms if needed
      if (checkMain && !isKidsTier(selectedTier)) {
        let query = supabase.from('rooms').select('id, tier, title_en, entries, is_locked');
        
        if (selectedTier !== 'all') {
          query = query.eq('tier', selectedTier);
        }

        const { data: mainRooms, error: mainError } = await query;
        if (mainError) throw mainError;

        const totalRooms = mainRooms?.length || 0;

        for (let i = 0; i < totalRooms; i++) {
          const room = mainRooms![i];
          setProgress({ current: i + 1, total: totalRooms, roomName: room.title_en });

          const issues: RoomIssue[] = [];
          const entries = Array.isArray(room.entries) ? room.entries : [];
          const entryCount = entries.length;

          // Check entries
          if (entryCount === 0) {
            issues.push({
              code: 'no_entries',
              severity: 'error',
              message: 'Room has no entries',
            });
            missingEntries++;
          }

          // Check audio in entries - verify actual files exist
          let audioCount = 0;
          let audioFieldCount = 0;
          const missingAudioFiles: string[] = [];
          
          for (const entry of entries as any[]) {
            const audioField = entry.audio || entry.audio_en || entry.audioEn;
            if (audioField) {
              audioFieldCount++;
              // Actually check if the audio file exists
              try {
                const audioPath = audioField.startsWith('/') ? audioField : `/audio/${audioField}`;
                const audioResponse = await fetch(audioPath, { method: 'HEAD' });
                if (audioResponse.ok) {
                  audioCount++;
                } else {
                  missingAudioFiles.push(audioField);
                }
              } catch {
                missingAudioFiles.push(audioField);
              }
            }
          }

          // Count rooms with zero audio as "missingAudio"
          if (entryCount > 0 && audioFieldCount === 0) {
            issues.push({
              code: 'no_audio_defined',
              severity: 'error',
              message: 'No entries have audio field defined',
            });
            missingAudio++;
          } else if (missingAudioFiles.length > 0) {
            issues.push({
              code: 'missing_audio_files',
              severity: 'error',
              message: `${missingAudioFiles.length} audio file(s) missing`,
              details: missingAudioFiles.slice(0, 5).join(', ') + (missingAudioFiles.length > 5 ? '...' : ''),
            });
            if (audioCount === 0) missingAudio++;
          } else if (entryCount > 0 && audioFieldCount < entryCount) {
            issues.push({
              code: 'low_audio',
              severity: 'warning',
              message: `Only ${audioFieldCount}/${entryCount} entries have audio defined`,
            });
          }

          // Check JSON file exists (try to fetch)
          try {
            const jsonPath = `/data/${room.id}.json`;
            const response = await fetch(jsonPath, { method: 'HEAD' });
            if (!response.ok) {
              issues.push({
                code: 'missing_json',
                severity: 'warning',
                message: 'JSON file not found in public/data/',
                details: jsonPath,
              });
              missingJson++;
            }
          } catch {
            // Silent fail - file doesn't exist
          }

          // Check if locked
          if (room.is_locked) {
            issues.push({
              code: 'locked',
              severity: 'info',
              message: 'Room is locked',
            });
          }

          const audioCoverage = entryCount > 0 ? Math.round((audioCount / entryCount) * 100) : 0;
          const healthScore = calculateHealthScore(issues, audioCoverage);

          results.push({
            roomId: room.id,
            roomTitle: room.title_en,
            tier: room.tier || 'free',
            isKids: false,
            issues,
            entryCount,
            audioCount,
            audioCoverage,
            healthScore,
          });
        }
      }

      // Fetch Kids rooms if needed
      if (checkKids) {
        let kidsQuery = supabase.from('kids_rooms').select(`
          id, title_en, level_id, is_active,
          kids_entries(count)
        `);

        if (isKidsTier(selectedTier)) {
          const levelId = selectedTier === 'kids_1' ? 'level1' : 
                          selectedTier === 'kids_2' ? 'level2' : 'level3';
          kidsQuery = kidsQuery.eq('level_id', levelId);
        }

        const { data: kidsRooms, error: kidsError } = await kidsQuery;
        if (kidsError) throw kidsError;

        const existingCount = results.length;
        const totalKids = kidsRooms?.length || 0;

        for (let i = 0; i < totalKids; i++) {
          const room = kidsRooms![i] as any;
          setProgress({ 
            current: existingCount + i + 1, 
            total: existingCount + totalKids, 
            roomName: room.title_en 
          });

          const issues: RoomIssue[] = [];
          const entryCount = room.kids_entries?.[0]?.count || 0;

          // Check entries
          if (entryCount === 0) {
            issues.push({
              code: 'no_entries',
              severity: 'error',
              message: 'Room has no entries in database',
            });
            missingEntries++;
          }

          // Check JSON file and audio
          const jsonFileName = getKidsJsonFilename(room.id, room.level_id);
          let kidsAudioCount = 0;
          let kidsAudioFieldCount = 0;
          let kidsEntryCountFromJson = entryCount;
          const kidsMissingAudioFiles: string[] = [];
          
          try {
            const response = await fetch(`/data/${jsonFileName}`);
            if (!response.ok) {
              issues.push({
                code: 'missing_json',
                severity: 'warning',
                message: 'JSON file not found',
                details: `/data/${jsonFileName}`,
              });
              missingJson++;
            } else {
              // Parse JSON and check audio
              try {
                const jsonData = await response.json();
                const entries = jsonData.entries || [];
                kidsEntryCountFromJson = entries.length;
                
                for (const entry of entries) {
                  const audioField = entry.audio || entry.audio_en || entry.audioEn;
                  if (audioField) {
                    kidsAudioFieldCount++;
                    // Check if audio file exists
                    try {
                      const audioPath = audioField.startsWith('/') ? audioField : `/audio/${audioField}`;
                      const audioResponse = await fetch(audioPath, { method: 'HEAD' });
                      if (audioResponse.ok) {
                        kidsAudioCount++;
                      } else {
                        kidsMissingAudioFiles.push(audioField);
                      }
                    } catch {
                      kidsMissingAudioFiles.push(audioField);
                    }
                  }
                }
              } catch {
                issues.push({
                  code: 'invalid_json',
                  severity: 'error',
                  message: 'File is not valid JSON',
                });
              }
            }
          } catch {
            issues.push({
              code: 'missing_json',
              severity: 'warning',
              message: 'JSON file not found',
              details: `/data/${jsonFileName}`,
            });
            missingJson++;
          }

          // Audio issues for kids rooms
          if (kidsEntryCountFromJson > 0 && kidsAudioFieldCount === 0) {
            issues.push({
              code: 'no_audio_defined',
              severity: 'error',
              message: 'No entries have audio field defined',
            });
            missingAudio++;
          } else if (kidsMissingAudioFiles.length > 0) {
            issues.push({
              code: 'missing_audio_files',
              severity: 'error',
              message: `${kidsMissingAudioFiles.length} audio file(s) missing`,
              details: kidsMissingAudioFiles.slice(0, 5).join(', ') + (kidsMissingAudioFiles.length > 5 ? '...' : ''),
            });
            if (kidsAudioCount === 0) missingAudio++;
          } else if (kidsEntryCountFromJson > 0 && kidsAudioFieldCount < kidsEntryCountFromJson) {
            issues.push({
              code: 'low_audio',
              severity: 'warning',
              message: `Only ${kidsAudioFieldCount}/${kidsEntryCountFromJson} entries have audio defined`,
            });
          }

          // Check if inactive
          if (!room.is_active) {
            issues.push({
              code: 'inactive',
              severity: 'info',
              message: 'Room is inactive',
            });
          }

          const tierLabel = room.level_id === 'level1' ? 'kids_1' : 
                           room.level_id === 'level2' ? 'kids_2' : 'kids_3';
          const kidsAudioCoverage = kidsEntryCountFromJson > 0 ? Math.round((kidsAudioCount / kidsEntryCountFromJson) * 100) : 0;

          results.push({
            roomId: room.id,
            roomTitle: room.title_en,
            tier: tierLabel,
            isKids: true,
            issues,
            entryCount: kidsEntryCountFromJson,
            audioCount: kidsAudioCount,
            audioCoverage: kidsAudioCoverage,
            healthScore: calculateHealthScore(issues, kidsAudioCoverage),
          });
        }
      }

      // Calculate summary
      const healthyRooms = results.filter(r => r.issues.length === 0).length;
      
      setSummary({
        totalRooms: results.length,
        healthyRooms,
        roomsWithIssues: results.length - healthyRooms,
        missingJson,
        missingAudio,
        missingEntries,
        results: results.sort((a, b) => a.healthScore - b.healthScore), // Sort by health score (worst first)
      });

      toast({
        title: healthyRooms === results.length ? 'All rooms healthy!' : `Found ${results.length - healthyRooms} rooms with issues`,
        description: `Checked ${results.length} rooms`,
      });

    } catch (error: any) {
      toast({
        title: 'Error running health check',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setChecking(false);
      setProgress(null);
    }
  };

  const calculateHealthScore = (issues: RoomIssue[], audioCoverage: number): number => {
    let score = 100;
    
    issues.forEach(issue => {
      if (issue.severity === 'error') score -= 30;
      else if (issue.severity === 'warning') score -= 15;
      else score -= 5;
    });

    // Factor in audio coverage
    score = Math.round((score * 0.7) + (audioCoverage * 0.3));
    
    return Math.max(0, Math.min(100, score));
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-destructive';
  };

  const getSeverityBadge = (severity: RoomIssue['severity']) => {
    const variants: Record<string, 'destructive' | 'default' | 'secondary'> = {
      error: 'destructive',
      warning: 'default',
      info: 'secondary',
    };
    return <Badge variant={variants[severity]}>{severity}</Badge>;
  };

  if (adminLoading) {
    return (
      <AdminLayout>
        <div className="text-center py-12">Loading...</div>
      </AdminLayout>
    );
  }

  if (!isAdmin) {
    return (
      <AdminLayout>
        <div className="text-center py-12 text-muted-foreground">Access denied</div>
      </AdminLayout>
    );
  }

  const tierLabel = TIER_OPTIONS.find(t => t.value === selectedTier)?.label || 'All Tiers';

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Room Health Check</h1>
          <p className="text-muted-foreground mt-1">
            Validate rooms, entries, audio files, and JSON data across all tiers
          </p>
        </div>

        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Select Scope</CardTitle>
            <CardDescription>Choose which tier to check or scan all rooms</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Select value={selectedTier} onValueChange={setSelectedTier}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tier" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIER_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={runHealthCheck} disabled={checking}>
                {checking ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Run Health Check
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Progress */}
        {checking && progress && (
          <Card className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Checking rooms...</span>
                <span className="font-medium">{progress.current} / {progress.total}</span>
              </div>
              <Progress value={(progress.current / progress.total) * 100} className="h-2" />
              <div className="flex items-center gap-2 text-sm">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-foreground truncate">{progress.roomName}</span>
              </div>
            </div>
          </Card>
        )}

        {/* Summary */}
        {summary && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">{summary.totalRooms}</p>
                    <p className="text-xs text-muted-foreground">Total Rooms</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-destructive" />
                  <div>
                    <p className="text-2xl font-bold">{summary.missingEntries}</p>
                    <p className="text-xs text-muted-foreground">Missing Entries</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <Music className="h-8 w-8 text-yellow-500" />
                  <div>
                    <p className="text-2xl font-bold">{summary.missingAudio}</p>
                    <p className="text-xs text-muted-foreground">No Audio</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <XCircle className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="text-2xl font-bold">{summary.missingJson}</p>
                    <p className="text-xs text-muted-foreground">Missing JSON</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Results */}
            {summary.roomsWithIssues === 0 ? (
              <Card className="p-8 text-center">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">All Rooms Healthy!</h3>
                <p className="text-muted-foreground">
                  All {tierLabel} rooms are properly configured.
                </p>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Rooms With Issues ({summary.roomsWithIssues})</CardTitle>
                  <CardDescription>Sorted by health score (worst first)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {summary.results
                    .filter(r => r.issues.length > 0)
                    .map((room) => (
                      <div
                        key={room.roomId}
                        className="border rounded-lg p-4 space-y-2"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{room.roomTitle}</h3>
                              <Badge variant="outline">{room.tier.toUpperCase()}</Badge>
                              {room.isKids && <Badge variant="secondary">Kids</Badge>}
                            </div>
                            <p className="text-xs text-muted-foreground font-mono">{room.roomId}</p>
                          </div>
                          <div className="text-right">
                            <p className={`text-lg font-bold ${getScoreColor(room.healthScore)}`}>
                              {room.healthScore}%
                            </p>
                            <p className="text-xs text-muted-foreground">Health</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-2">
                          {room.issues.map((issue, idx) => (
                            <div key={idx} className="flex items-center gap-1">
                              {getSeverityBadge(issue.severity)}
                              <span className="text-sm text-muted-foreground">{issue.message}</span>
                            </div>
                          ))}
                        </div>

                        {!room.isKids && room.entryCount > 0 && (
                          <div className="text-xs text-muted-foreground mt-2">
                            {room.entryCount} entries • {room.audioCount} with audio ({room.audioCoverage}% coverage)
                          </div>
                        )}
                      </div>
                    ))}
                </CardContent>
              </Card>
            )}

            {/* Healthy Rooms Collapsed */}
            {summary.healthyRooms > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    Healthy Rooms ({summary.healthyRooms})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {summary.results
                      .filter(r => r.issues.length === 0)
                      .map((room) => (
                        <Badge key={room.roomId} variant="outline" className="text-green-600">
                          {room.roomTitle}
                        </Badge>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}
