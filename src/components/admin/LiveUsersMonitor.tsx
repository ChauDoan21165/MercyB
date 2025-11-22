import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Eye, LogIn, LogOut } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UserActivity {
  user_id: string;
  username: string;
  room_id?: string;
  room_name?: string;
  status: 'online' | 'offline';
  last_seen: string;
}

interface ActivityLog {
  id: string;
  timestamp: string;
  username: string;
  action: 'joined' | 'left' | 'room_change';
  room_name?: string;
}

export const LiveUsersMonitor = () => {
  const [onlineUsers, setOnlineUsers] = useState<UserActivity[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);

  useEffect(() => {
    fetchOnlineUsers();
    subscribeToUserActivity();

    // Refresh every 30 seconds
    const interval = setInterval(fetchOnlineUsers, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const fetchOnlineUsers = async () => {
    try {
      // Get active sessions from the last 5 minutes
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      
      const { data: sessions } = await supabase
        .from('user_sessions')
        .select(`
          user_id,
          last_activity,
          device_info
        `)
        .gte('last_activity', fiveMinutesAgo)
        .order('last_activity', { ascending: false });

      if (sessions) {
        // Get user profiles for these sessions
        const userIds = [...new Set(sessions.map(s => s.user_id))];
        
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, username, full_name')
          .in('id', userIds);

        // Get current room analytics
        const { data: roomAnalytics } = await supabase
          .from('room_usage_analytics')
          .select('user_id, room_id')
          .in('user_id', userIds)
          .is('session_end', null);

        const users: UserActivity[] = sessions.map(session => {
          const profile = profiles?.find(p => p.id === session.user_id);
          const currentRoom = roomAnalytics?.find(r => r.user_id === session.user_id);
          
          return {
            user_id: session.user_id,
            username: profile?.username || profile?.full_name || 'Anonymous',
            room_id: currentRoom?.room_id,
            room_name: currentRoom?.room_id,
            status: 'online' as const,
            last_seen: session.last_activity,
          };
        });

        setOnlineUsers(users);
      }
    } catch (error) {
      console.error('Error fetching online users:', error);
    }
  };

  const subscribeToUserActivity = () => {
    // Subscribe to user_sessions changes
    const sessionsChannel = supabase
      .channel('sessions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_sessions'
        },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            // User came online
            const { data: profile } = await supabase
              .from('profiles')
              .select('username, full_name')
              .eq('id', payload.new.user_id)
              .single();

            const username = profile?.username || profile?.full_name || 'Anonymous';
            
            addActivityLog({
              id: `${Date.now()}-joined`,
              timestamp: new Date().toISOString(),
              username,
              action: 'joined',
            });
          }
          
          fetchOnlineUsers();
        }
      )
      .subscribe();

    // Subscribe to room_usage_analytics for room changes
    const roomsChannel = supabase
      .channel('rooms-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'room_usage_analytics'
        },
        async (payload) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('username, full_name')
            .eq('id', payload.new.user_id)
            .single();

          const username = profile?.username || profile?.full_name || 'Anonymous';
          
          addActivityLog({
            id: `${Date.now()}-room`,
            timestamp: new Date().toISOString(),
            username,
            action: 'room_change',
            room_name: payload.new.room_id,
          });
          
          fetchOnlineUsers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(sessionsChannel);
      supabase.removeChannel(roomsChannel);
    };
  };

  const addActivityLog = (log: ActivityLog) => {
    setActivityLog(prev => [log, ...prev].slice(0, 50)); // Keep last 50 activities
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Online Users Card */}
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Online Users
            </CardTitle>
            <Badge 
              className="animate-pulse"
              style={{ background: 'var(--gradient-rainbow)', color: 'white' }}
            >
              {onlineUsers.length} Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            {onlineUsers.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No users currently online
              </p>
            ) : (
              <div className="space-y-3">
                {onlineUsers.map((user) => (
                  <div 
                    key={user.user_id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {user.username}
                        </p>
                        {user.room_name && (
                          <div className="flex items-center gap-1 mt-1">
                            <Eye className="h-3 w-3 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground">
                              {user.room_name}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatTime(user.last_seen)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Activity Log Card */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            Live Activity Feed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            {activityLog.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Waiting for user activity...
              </p>
            ) : (
              <div className="space-y-2">
                {activityLog.map((log) => (
                  <div 
                    key={log.id}
                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors animate-fade-in"
                  >
                    {log.action === 'joined' && (
                      <LogIn className="h-4 w-4 text-green-500 mt-1" />
                    )}
                    {log.action === 'left' && (
                      <LogOut className="h-4 w-4 text-red-500 mt-1" />
                    )}
                    {log.action === 'room_change' && (
                      <Eye className="h-4 w-4 text-blue-500 mt-1" />
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">
                        <span className="font-medium">{log.username}</span>
                        {log.action === 'joined' && ' came online'}
                        {log.action === 'left' && ' went offline'}
                        {log.action === 'room_change' && ` entered ${log.room_name}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatTime(log.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};
