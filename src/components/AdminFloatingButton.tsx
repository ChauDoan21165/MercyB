import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUserAccess } from "@/hooks/useUserAccess";

export const AdminFloatingButton = () => {
  const navigate = useNavigate();
  const { isAdmin } = useUserAccess();
  const [unreadCount, setUnreadCount] = useState(0);
  const [versionIndicator, setVersionIndicator] = useState('A');

  useEffect(() => {
    // Fetch version indicator for everyone
    fetchVersionIndicator();

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
          console.log('Version indicator updated:', payload);
          if (payload.new && payload.new.setting_value) {
            setVersionIndicator(payload.new.setting_value);
          }
        }
      )
      .subscribe();

    if (!isAdmin) {
      return () => {
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
      supabase.removeChannel(versionChannel);
      supabase.removeChannel(channel);
    };
  }, [isAdmin]);

  const fetchVersionIndicator = async () => {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('setting_value')
        .eq('setting_key', 'version_indicator')
        .maybeSingle();

      if (!error && data) {
        setVersionIndicator(data.setting_value);
      }
    } catch (error) {
      console.error('Error fetching version:', error);
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

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-1">
      {/* Version Indicator Dot - Change the character to track versions */}
      <div 
        className="h-4 w-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-[9px] font-bold shadow-sm"
        title="App Version"
      >
        {versionIndicator}
      </div>
      
      {isAdmin && (
        <Button
          onClick={() => navigate('/admin/stats')}
          size="sm"
          variant="outline"
          className="rounded-full shadow-sm h-5 w-5 p-0 bg-gray-400 hover:bg-gray-500 border-gray-500 relative"
        >
          <Settings className="h-3 w-3 text-white" />
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
