import { Music, Settings } from "lucide-react";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";
import { useUserAccess } from "@/hooks/useUserAccess";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

export const GlobalPlayingIndicator = () => {
  const { isPlaying, currentTrackName } = useMusicPlayer();
  const { isAdmin } = useUserAccess();
  const navigate = useNavigate();
  const isDev = import.meta.env.DEV;
  const [versionIndicator, setVersionIndicator] = useState('A');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchVersionIndicator();
    if (isAdmin) fetchUnreadCount();
  }, [isAdmin]);

  const fetchVersionIndicator = async () => {
    try {
      const { data } = await supabase
        .from('app_settings')
        .select('setting_value')
        .eq('setting_key', 'version_indicator')
        .maybeSingle();
      if (data) setVersionIndicator(data.setting_value);
    } catch {}
  };

  const fetchUnreadCount = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { count: notificationCount } = await supabase
        .from('admin_notifications')
        .select('*', { count: 'exact', head: true })
        .eq('admin_user_id', user.id)
        .eq('is_read', false);
      const { count: feedbackCount } = await supabase
        .from('feedback')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'new');
      setUnreadCount((notificationCount || 0) + (feedbackCount || 0));
    } catch {}
  };

  if (!isPlaying) return null;

  const showAdminControls = isAdmin || isDev;

  return (
    <div className="fixed bottom-20 md:bottom-24 right-4 z-40 flex items-center gap-2">
      {/* Track Pill */}
      <div className="bg-black/90 text-white text-xs px-3 py-2 rounded-full shadow-lg flex items-center gap-2 max-w-[180px]">
        <Music className="h-3 w-3 shrink-0" />
        <span className="truncate">
          {currentTrackName || "Playing"}
        </span>
      </div>

      {/* Admin Controls - docked to the right of the pill */}
      {showAdminControls && (
        <div className="flex items-center gap-1 shrink-0">
          {/* Version Indicator */}
          <div 
            className="h-5 w-5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-[10px] font-bold shadow-sm"
            title="App Version"
          >
            {versionIndicator}
          </div>
          {/* Settings Button */}
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
        </div>
      )}
    </div>
  );
};
