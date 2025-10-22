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

    // Subscribe to real-time updates
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
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin]);

  const fetchUnreadCount = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { count } = await supabase
        .from('admin_notifications')
        .select('*', { count: 'exact', head: true })
        .eq('admin_user_id', user.id)
        .eq('is_read', false);

      setUnreadCount(count || 0);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={() => navigate('/admin/stats')}
        size="lg"
        className="rounded-full shadow-lg h-14 w-14 relative"
      >
        <Settings className="h-6 w-6" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 rounded-full"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>
    </div>
  );
};
