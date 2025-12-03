import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUserAccess } from "@/hooks/useUserAccess";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";

export const AdminFloatingButton = () => {
  const navigate = useNavigate();
  const { isAdmin } = useUserAccess();
  const { isPlaying } = useMusicPlayer();
  const [unreadCount, setUnreadCount] = useState(0);
  const [versionIndicator, setVersionIndicator] = useState('A');

  // When music is playing, GlobalPlayingIndicator shows admin controls instead
  if (isPlaying) return null;

  useEffect(() => {
    // Fetch version indicator for everyone
    fetchVersionIndicator();

    // Fallback: Poll every 30 seconds on mobile (realtime subscriptions can be unreliable on mobile)
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const pollInterval = isMobile ? setInterval(() => {
      console.log('Polling version indicator (mobile fallback)');
      fetchVersionIndicator();
    }, 30000) : null;

    // Subscribe to real-time version indicator changes (for all users)
    const versionChannel = supabase
      .channel('version-indicator')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'app_settings',
          filter: 'setting_key=eq.version_indicator'
        },
        (payload) => {
          console.log('✅ Version indicator updated via realtime:', payload);
          if (payload.new && payload.new.setting_value) {
            setVersionIndicator(payload.new.setting_value);
          }
        }
      )
      .subscribe((status) => {
        console.log('Version channel subscription status:', status);
      });

    if (!isAdmin) {
      return () => {
        if (pollInterval) clearInterval(pollInterval);
        supabase.removeChannel(versionChannel);
      };
    }

    fetchUnreadCount();

    // Subscribe to real-time updates for both admin_notifications and feedback
    const channel = supabase
      .channel('admin-notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'admin_notifications'
        },
        () => fetchUnreadCount()
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'feedback'
        },
        () => fetchUnreadCount()
      )
      .subscribe();

    return () => {
      if (pollInterval) clearInterval(pollInterval);
      supabase.removeChannel(versionChannel);
      supabase.removeChannel(channel);
    };
  }, [isAdmin]);

  const fetchVersionIndicator = async () => {
    try {
      console.log('🔄 Fetching version indicator...');
      const { data, error } = await supabase
        .from('app_settings')
        .select('setting_value')
        .eq('setting_key', 'version_indicator')
        .maybeSingle();

      if (error) {
        console.error('❌ Error fetching version:', error);
        return;
      }

      if (data) {
        console.log('📱 Version indicator fetched:', data.setting_value);
        setVersionIndicator(data.setting_value);
      } else {
        console.log('⚠️ No version indicator found in database');
      }
    } catch (error) {
      console.error('❌ Exception fetching version:', error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Count unread admin notifications
      const { count: notificationCount } = await supabase
        .from('admin_notifications')
        .select('*', { count: 'exact', head: true })
        .eq('admin_user_id', user.id)
        .eq('is_read', false);

      // Count new feedback
      const { count: feedbackCount } = await supabase
        .from('feedback')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'new');

      setUnreadCount((notificationCount || 0) + (feedbackCount || 0));
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const isDev = import.meta.env.DEV;

  // Only show when music is NOT playing (GlobalPlayingIndicator handles it when music plays)
  // Position higher to avoid overlap with music player bar
  return (
    <div className="fixed bottom-20 md:bottom-24 right-4 z-40 flex items-center gap-1">
      {/* Version Indicator Dot */}
      <div 
        className="h-5 w-5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-[10px] font-bold shadow-sm"
        title="App Version"
      >
        {versionIndicator}
      </div>

      {!isAdmin && !isDev && (
        <Button
          onClick={fetchVersionIndicator}
          size="sm"
          variant="outline"
          className="rounded-full h-6 px-2 text-[10px] leading-none"
        >
          Update
        </Button>
      )}
      
      {/* Show admin button for admins OR in dev mode */}
      {(isAdmin || isDev) && (
        <Button
          onClick={() => navigate('/admin')}
          size="sm"
          variant="outline"
          className="rounded-full shadow-sm h-7 w-7 p-0 bg-gray-800 hover:bg-gray-700 border-gray-600 relative"
          title="Admin Dashboard"
        >
          <Settings className="h-3.5 w-3.5 text-white" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-3 w-3 flex items-center justify-center p-0 rounded-full text-[8px]"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      )}
    </div>
  );
};
