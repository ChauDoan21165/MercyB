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

  useEffect(() => {
    if (!isAdmin) return;

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
      supabase.removeChannel(channel);
    };
  }, [isAdmin]);

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

  if (!isAdmin) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      <Button
        onClick={() => navigate('/admin/kids-standardizer')}
        size="sm"
        variant="outline"
        className="rounded-full shadow-sm h-5 w-5 p-0 bg-pink-400 hover:bg-pink-500 border-pink-500"
        title="Kids Admin Tools"
      >
        <span className="text-white text-xs font-bold">K</span>
      </Button>
      <Button
        onClick={() => navigate('/admin/mercy-blade-standards')}
        size="sm"
        variant="outline"
        className="rounded-full shadow-sm h-5 w-5 p-0 bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 border-purple-500"
        title="Mercy Blade Universal Standards"
      >
        <span className="text-white text-xs font-bold">★</span>
      </Button>
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
    </div>
  );
};
