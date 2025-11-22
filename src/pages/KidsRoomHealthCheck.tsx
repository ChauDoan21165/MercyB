import { useState } from 'react';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, XCircle, AlertCircle, Loader2, Wrench } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface RoomStatus {
  id: string;
  title_en: string;
  title_vi: string;
  level_id: string;
  entry_count: number;
  is_active: boolean;
  status: 'ok' | 'missing_entries' | 'inactive';
}

export default function KidsRoomHealthCheck() {
  const { isAdmin, loading: adminLoading } = useAdminCheck();
  const { toast } = useToast();
  const [checking, setChecking] = useState(false);
  const [fixing, setFixing] = useState<string | null>(null);
  const [fixingAll, setFixingAll] = useState(false);
  const [rooms, setRooms] = useState<RoomStatus[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<'level-1' | 'level-2' | 'level-3'>('level-2');

  const checkRooms = async () => {
    setChecking(true);
    try {
      const { data, error } = await supabase
        .from('kids_rooms')
        .select(`
          id,
          title_en,
          title_vi,
          level_id,
          is_active,
          kids_entries(count)
        `)
        .eq('level_id', selectedLevel)
        .order('display_order');

      if (error) throw error;

      const roomStatuses: RoomStatus[] = (data || []).map((room: any) => {
        const entryCount = room.kids_entries?.[0]?.count || 0;
        let status: 'ok' | 'missing_entries' | 'inactive' = 'ok';
        
        if (!room.is_active) {
          status = 'inactive';
        } else if (entryCount === 0) {
          status = 'missing_entries';
        }

        return {
          id: room.id,
          title_en: room.title_en,
          title_vi: room.title_vi,
          level_id: room.level_id,
          entry_count: entryCount,
          is_active: room.is_active,
          status
        };
      });

      setRooms(roomStatuses);
      
      const issues = roomStatuses.filter(r => r.status !== 'ok').length;
      toast({
        title: issues === 0 ? "All rooms are healthy!" : `Found ${issues} issue(s)`,
        description: `Checked ${roomStatuses.length} rooms`,
      });
    } catch (error: any) {
      toast({
        title: "Error checking rooms",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setChecking(false);
    }
  };

  const fixRoom = async (roomId: string) => {
    setFixing(roomId);
    try {
      // Fetch the JSON file for this room
      const jsonFileName = `${roomId.replace(/-/g, '_')}_kids_${selectedLevel.replace('level-', 'l')}.json`;
      const response = await fetch(`/data/${jsonFileName}`);
      
      if (!response.ok) {
        throw new Error(`JSON file not found: ${jsonFileName}`);
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
        title: "Error fixing room",
        description: error.message,
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
        const jsonFileName = `${room.id.replace(/-/g, '_')}_kids_${selectedLevel.replace('level-', 'l')}.json`;
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
  const inactiveRooms = rooms.filter(r => r.status === 'inactive');

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Kids Room Health Check</h1>
          <p className="text-muted-foreground mt-1">Verify and fix room data integrity</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select Level</CardTitle>
            <CardDescription>Choose which kids level to check</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button
                variant={selectedLevel === 'level-1' ? 'default' : 'outline'}
                onClick={() => setSelectedLevel('level-1')}
              >
                Level 1 (Ages 3-6)
              </Button>
              <Button
                variant={selectedLevel === 'level-2' ? 'default' : 'outline'}
                onClick={() => setSelectedLevel('level-2')}
              >
                Level 2 (Ages 7-9)
              </Button>
              <Button
                variant={selectedLevel === 'level-3' ? 'default' : 'outline'}
                onClick={() => setSelectedLevel('level-3')}
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
                </CardContent>
              </Card>
            </div>

            {/* Rooms with Issues */}
            {(missingEntries.length > 0 || inactiveRooms.length > 0) && (
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
                            Missing entries - Room has 0 content entries
                          </span>
                        </div>
                        <Button
                          onClick={() => fixRoom(room.id)}
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
                      <AlertDescription>
                        <strong>{room.title_en}</strong> ({room.id})
                        <br />
                        <span className="text-sm">
                          Room is marked as inactive - Manual review needed
                        </span>
                      </AlertDescription>
                    </Alert>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* All Rooms List */}
            <Card>
              <CardHeader>
                <CardTitle>All Rooms ({rooms.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {rooms.map(room => (
                    <div
                      key={room.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {room.status === 'ok' && (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        )}
                        {room.status === 'missing_entries' && (
                          <AlertCircle className="h-5 w-5 text-yellow-500" />
                        )}
                        {room.status === 'inactive' && (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <div>
                          <div className="font-medium">{room.title_en}</div>
                          <div className="text-sm text-muted-foreground">
                            {room.id} • {room.entry_count} entries
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
