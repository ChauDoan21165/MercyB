import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, XCircle, AlertCircle, Loader2, Wrench, Download, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { KIDS_ROOM_JSON_MAP } from '@/pages/KidsChat';

interface RoomStatus {
  id: string;
  title_en: string;
  title_vi: string;
  level_id: string;
  entry_count: number;
  is_active: boolean;
  status: 'ok' | 'missing_entries' | 'inactive' | 'missing_json' | 'invalid_json';
  jsonError?: string;
}

const getJsonFilenameForRoom = (roomId: string, levelId: string): string => {
  const mappedFile = KIDS_ROOM_JSON_MAP[roomId];
  if (mappedFile) return mappedFile;

  const suffix =
    levelId === 'level1' ? 'kids_l1' :
    levelId === 'level2' ? 'kids_l2' :
    levelId === 'level3' ? 'kids_l3' : 'kids';

  return `${roomId.replace(/-/g, '_')}_${suffix}.json`;
};

export default function KidsRoomHealthCheck() {
  const navigate = useNavigate();
  const { isAdmin, loading: adminLoading } = useAdminCheck();
  const { toast } = useToast();
  const [checking, setChecking] = useState(false);
  const [fixing, setFixing] = useState<string | null>(null);
  const [fixingAll, setFixingAll] = useState(false);
  const [rooms, setRooms] = useState<RoomStatus[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'level1' | 'level2' | 'level3'>('all');

  const checkRooms = async () => {
    setChecking(true);
    try {
      let query = supabase
        .from('kids_rooms')
        .select(`
          id,
          title_en,
          title_vi,
          level_id,
          is_active,
          kids_entries(count)
        `);
      
      if (selectedLevel !== 'all') {
        query = query.eq('level_id', selectedLevel);
      }
      
      const { data, error } = await query.order('level_id').order('display_order');

      if (error) throw error;

      // VALIDATION: Warn if no rooms found - likely a level_id mismatch
      if (!data || data.length === 0) {
        toast({
          title: "⚠️ No rooms found",
          description: selectedLevel === 'all' 
            ? "No active rooms found in database. Please check if kids_rooms table has data and level_id values are: level1, level2, or level3 (no dashes)."
            : `No rooms found for ${selectedLevel}. Verify the level_id in database matches exactly: ${selectedLevel} (not ${selectedLevel.replace('level', 'level-')})`,
          variant: "destructive"
        });
        setRooms([]);
        setChecking(false);
        return;
      }

      // Check each room's JSON file + DB entries
      const roomStatuses: RoomStatus[] = await Promise.all(
        (data || []).map(async (room: any) => {
          const entryCount = room.kids_entries?.[0]?.count || 0;
          let status: RoomStatus['status'] = 'ok';
          let jsonError: string | undefined;
          let hasJsonEntries = false;

          // Try to validate JSON file and detect if it has entries
          try {
            const jsonFileName = getJsonFilenameForRoom(room.id, room.level_id);
            const response = await fetch(`/data/${jsonFileName}`);

            if (!response.ok) {
              jsonError = `JSON file not found: /data/${jsonFileName}`;
            } else {
              const contentType = response.headers.get('content-type');
              if (!contentType || !contentType.includes('application/json')) {
                // In practice this usually means the file is missing or misnamed and the server
                // is returning an HTML fallback page instead of the JSON asset.
                jsonError = `JSON file not found: /data/${jsonFileName} (got ${contentType || 'unknown type'})`;
              } else {
                try {
                  const json = await response.json();
                  if (Array.isArray(json.entries) && json.entries.length > 0) {
                    hasJsonEntries = true;
                  } else {
                    jsonError = 'JSON has no entries array or it is empty';
                  }
                } catch (e) {
                  jsonError = 'Invalid JSON syntax in file';
                }
              }
            }
          } catch (e: any) {
            jsonError = e.message;
          }

          // Decide final status combining DB + JSON state
          if (!room.is_active) {
            status = 'inactive';
          } else if (entryCount > 0) {
            if (jsonError) {
              status = jsonError.startsWith('JSON file not found')
                ? 'missing_json'
                : 'invalid_json';
            } else {
              status = 'ok';
            }
          } else {
            // No DB entries
            if (hasJsonEntries) {
              // Room will still work via JSON fallback in KidsChat
              status = 'ok';
            } else if (jsonError) {
              status = jsonError.startsWith('JSON file not found')
                ? 'missing_json'
                : 'invalid_json';
            } else {
              status = 'missing_entries';
            }
          }

          return {
            id: room.id,
            title_en: room.title_en,
            title_vi: room.title_vi,
            level_id: room.level_id,
            entry_count: entryCount,
            is_active: room.is_active,
            status,
            jsonError
          };
        })
      );

      setRooms(roomStatuses);
      
      const issues = roomStatuses.filter(r => r.status !== 'ok').length;
      toast({
        title: issues === 0 ? "All rooms are healthy!" : `Found ${issues} issue(s)`,
        description: `Checked ${roomStatuses.length} rooms (DB + JSON validation)`,
      });
    } catch (error: any) {
      toast({
        title: "❌ Error checking rooms",
        description: (
          <div className="space-y-2">
            <p className="text-sm font-mono bg-destructive/10 p-2 rounded">{error.message}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(error.message);
                toast({ title: "✓ Error copied to clipboard" });
              }}
              className="h-7 text-xs"
            >
              Copy error message
            </Button>
          </div>
        ),
        variant: "destructive"
      });
    } finally {
      setChecking(false);
    }
  };

  const fixRoom = async (roomId: string, roomLevelId: string) => {
    setFixing(roomId);
    try {
      // Validate level_id format
      if (!roomLevelId.match(/^level[1-3]$/)) {
        throw new Error(`Invalid level_id format: "${roomLevelId}". Expected format: level1, level2, or level3 (no dashes)`);
      }

      // Fetch the JSON file for this room (using the same mapping as KidsChat)
      const jsonFileName = getJsonFilenameForRoom(roomId, roomLevelId);
      const response = await fetch(`/data/${jsonFileName}`);
      
      if (!response.ok) {
        throw new Error(`JSON file not found: /data/${jsonFileName}. Please ensure the file exists and the mapping for "${roomId}" is correct.`);
      }

      const roomData = await response.json();
      
      if (!roomData.entries || roomData.entries.length === 0) {
        throw new Error('No entries found in JSON file');
      }

      // Prepare entries for insertion
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

      // Insert entries
      const { error } = await supabase
        .from('kids_entries')
        .insert(entries);

      if (error) throw error;

      toast({
        title: "Room fixed!",
        description: `Inserted ${entries.length} entries for ${roomId}`,
      });

      // Refresh the room list
      await checkRooms();
    } catch (error: any) {
      toast({
        title: "❌ Error fixing room",
        description: (
          <div className="space-y-2">
            <p className="text-sm font-mono bg-destructive/10 p-2 rounded">{error.message}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(error.message);
                toast({ title: "✓ Error copied to clipboard" });
              }}
              className="h-7 text-xs"
            >
              Copy error message
            </Button>
          </div>
        ),
        variant: "destructive"
      });
    } finally {
      setFixing(null);
    }
  };

  const fixAllRooms = async () => {
    const roomsToFix = rooms.filter(r => r.status === 'missing_entries');
    
    if (roomsToFix.length === 0) {
      toast({
        title: "No rooms to fix",
        description: "All rooms are already healthy!",
      });
      return;
    }

    setFixingAll(true);
    let successCount = 0;
    let errorCount = 0;

    for (const room of roomsToFix) {
      try {
        const jsonFileName = getJsonFilenameForRoom(room.id, room.level_id);

  const activateRoom = async (roomId: string) => {
    setFixing(roomId);
    try {
      const { error } = await supabase
        .from('kids_rooms')
        .update({ is_active: true })
        .eq('id', roomId);

      if (error) throw error;

      toast({
        title: "Room activated!",
        description: `Room ${roomId} is now active`,
      });

      await checkRooms();
    } catch (error: any) {
      toast({
        title: "❌ Error activating room",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setFixing(null);
    }
  };
        const response = await fetch(`/data/${jsonFileName}`);
        
        if (!response.ok) {
          throw new Error(`JSON file not found: ${jsonFileName}`);
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
            id: `${room.id}-${index + 1}`,
            room_id: room.id,
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
        
        successCount++;
      } catch (error: any) {
        console.error(`Failed to fix ${room.id}:`, error.message);
        errorCount++;
      }
    }

    setFixingAll(false);

    toast({
      title: "Bulk fix complete",
      description: `Fixed ${successCount} rooms. ${errorCount > 0 ? `${errorCount} failed.` : ''}`,
      variant: errorCount > 0 ? "destructive" : "default"
    });

    await checkRooms();
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
        <div className="text-center py-12">Access denied</div>
      </AdminLayout>
    );
  }

  const okRooms = rooms.filter(r => r.status === 'ok');
  const missingEntries = rooms.filter(r => r.status === 'missing_entries');
  const missingJson = rooms.filter(r => r.status === 'missing_json');
  const invalidJson = rooms.filter(r => r.status === 'invalid_json');
  const inactiveRooms = rooms.filter(r => r.status === 'inactive');

  // Group rooms by level
  const roomsByLevel = {
    'level1': rooms.filter(r => r.level_id === 'level1'),
    'level2': rooms.filter(r => r.level_id === 'level2'),
    'level3': rooms.filter(r => r.level_id === 'level3'),
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/health-dashboard')}
            className="mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Health Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Kids Room Health Check</h1>
          <p className="text-muted-foreground mt-1">Verify and fix room data integrity across all levels</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select Level</CardTitle>
            <CardDescription>Choose which kids level to check or scan all levels</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedLevel === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedLevel('all')}
              >
                All Levels
              </Button>
              <Button
                variant={selectedLevel === 'level1' ? 'default' : 'outline'}
                onClick={() => setSelectedLevel('level1')}
              >
                Level 1 (Ages 3-6)
              </Button>
              <Button
                variant={selectedLevel === 'level2' ? 'default' : 'outline'}
                onClick={() => setSelectedLevel('level2')}
              >
                Level 2 (Ages 7-9)
              </Button>
              <Button
                variant={selectedLevel === 'level3' ? 'default' : 'outline'}
                onClick={() => setSelectedLevel('level3')}
              >
                Level 3 (Ages 10-13)
              </Button>
            </div>

            <Button
              onClick={checkRooms}
              disabled={checking}
              className="w-full"
            >
              {checking ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking...
                </>
              ) : (
                'Run Health Check'
              )}
            </Button>
          </CardContent>
        </Card>

        {rooms.length > 0 && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Healthy Rooms
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{okRooms.length}</div>
                  {selectedLevel === 'all' && (
                    <div className="text-xs text-muted-foreground mt-1">
                      L1: {roomsByLevel['level1'].filter(r => r.status === 'ok').length} • 
                      L2: {roomsByLevel['level2'].filter(r => r.status === 'ok').length} • 
                      L3: {roomsByLevel['level3'].filter(r => r.status === 'ok').length}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    Missing Entries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{missingEntries.length}</div>
                  {selectedLevel === 'all' && (
                    <div className="text-xs text-muted-foreground mt-1">
                      L1: {roomsByLevel['level1'].filter(r => r.status === 'missing_entries').length} • 
                      L2: {roomsByLevel['level2'].filter(r => r.status === 'missing_entries').length} • 
                      L3: {roomsByLevel['level3'].filter(r => r.status === 'missing_entries').length}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    Inactive Rooms
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{inactiveRooms.length}</div>
                  {selectedLevel === 'all' && (
                    <div className="text-xs text-muted-foreground mt-1">
                      L1: {roomsByLevel['level1'].filter(r => r.status === 'inactive').length} • 
                      L2: {roomsByLevel['level2'].filter(r => r.status === 'inactive').length} • 
                      L3: {roomsByLevel['level3'].filter(r => r.status === 'inactive').length}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Rooms with Issues */}
            {(missingEntries.length > 0 || missingJson.length > 0 || invalidJson.length > 0 || inactiveRooms.length > 0) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Rooms Requiring Attention</span>
                    {missingEntries.length > 0 && (
                      <Button
                        onClick={fixAllRooms}
                        disabled={fixingAll}
                        variant="default"
                        size="sm"
                      >
                        {fixingAll ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Fixing All...
                          </>
                        ) : (
                          <>
                            <Wrench className="mr-2 h-4 w-4" />
                            Fix All ({missingEntries.length})
                          </>
                        )}
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {missingEntries.map(room => (
                    <Alert key={room.id} variant="default">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="flex items-center justify-between">
                        <div>
                          <strong>{room.title_en}</strong> ({room.id})
                          <br />
                          <span className="text-sm text-muted-foreground">
                            Level {room.level_id.replace('level', '')} • Missing entries - Room has 0 content entries
                          </span>
                        </div>
                        <Button
                          onClick={() => fixRoom(room.id, room.level_id)}
                          disabled={fixing === room.id}
                          size="sm"
                        >
                          {fixing === room.id ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Fixing...
                            </>
                          ) : (
                            <>
                              <Wrench className="mr-2 h-4 w-4" />
                              Fix Now
                            </>
                          )}
                        </Button>
                      </AlertDescription>
                    </Alert>
                  ))}

                  {missingJson.map(room => (
                    <Alert key={room.id} variant="destructive">
                      <XCircle className="h-4 w-4" />
                      <AlertDescription className="flex items-center justify-between">
                        <div>
                          <strong>{room.title_en}</strong> ({room.id})
                          <br />
                          <span className="text-sm">
                            Level {room.level_id.replace('level', '')} • {room.jsonError}
                          </span>
                          <br />
                          <span className="text-xs text-muted-foreground mt-1 block">
                            Expected: /data/{getJsonFilenameForRoom(room.id, room.level_id)}
                          </span>
                        </div>
                        <Button
                          onClick={() => fixRoom(room.id, room.level_id)}
                          disabled={fixing === room.id}
                          size="sm"
                        >
                          {fixing === room.id ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Fixing...
                            </>
                          ) : (
                            <>
                              <Wrench className="mr-2 h-4 w-4" />
                              Fix Now
                            </>
                          )}
                        </Button>
                      </AlertDescription>
                    </Alert>
                  ))}

                  {invalidJson.map(room => (
                    <Alert key={room.id} variant="destructive">
                      <XCircle className="h-4 w-4" />
                      <AlertDescription className="flex items-center justify-between">
                        <div>
                          <strong>{room.title_en}</strong> ({room.id})
                          <br />
                          <span className="text-sm">
                            Level {room.level_id.replace('level', '')} • {room.jsonError}
                          </span>
                        </div>
                        <Button
                          onClick={() => fixRoom(room.id, room.level_id)}
                          disabled={fixing === room.id}
                          size="sm"
                        >
                          {fixing === room.id ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Fixing...
                            </>
                          ) : (
                            <>
                              <Wrench className="mr-2 h-4 w-4" />
                              Fix Now
                            </>
                          )}
                        </Button>
                      </AlertDescription>
                    </Alert>
                  ))}

                  {inactiveRooms.map(room => (
                    <Alert key={room.id} variant="destructive">
                      <XCircle className="h-4 w-4" />
                      <AlertDescription className="flex items-center justify-between">
                        <div>
                          <strong>{room.title_en}</strong> ({room.id})
                          <br />
                          <span className="text-sm">
                            Level {room.level_id.replace('level', '')} • Room is marked as inactive
                          </span>
                        </div>
                        <Button
                          onClick={() => activateRoom(room.id)}
                          disabled={fixing === room.id}
                          size="sm"
                          variant="default"
                        >
                          {fixing === room.id ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Activating...
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Activate
                            </>
                          )}
                        </Button>
                      </AlertDescription>
                    </Alert>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* All Rooms List */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedLevel === 'all' ? 'All Rooms' : `Level ${selectedLevel.replace('level', '')} Rooms`} ({rooms.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {rooms.map(room => (
                    <div
                      key={room.id}
                      onClick={() => navigate(`/kids-chat/${room.id}`)}
                      className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {room.status === 'ok' && (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        )}
                        {room.status === 'missing_entries' && (
                          <AlertCircle className="h-5 w-5 text-yellow-500" />
                        )}
                        {(room.status === 'missing_json' || room.status === 'invalid_json') && (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        {room.status === 'inactive' && (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <div>
                          <div className="font-medium">{room.title_en}</div>
                          <div className="text-sm text-muted-foreground">
                            {selectedLevel === 'all' && `L${room.level_id.replace('level', '')} • `}
                            {room.id} • {room.entry_count} entries
                            {room.jsonError && (
                              <>
                                <br />
                                <span className="text-xs text-destructive">{room.jsonError}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant={
                          room.status === 'ok'
                            ? 'default'
                            : room.status === 'missing_entries'
                            ? 'secondary'
                            : 'destructive'
                        }
                      >
                        {room.status === 'ok' && 'Healthy'}
                        {room.status === 'missing_entries' && 'Needs Fix'}
                        {room.status === 'missing_json' && 'Missing JSON'}
                        {room.status === 'invalid_json' && 'Invalid JSON'}
                        {room.status === 'inactive' && 'Inactive'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
