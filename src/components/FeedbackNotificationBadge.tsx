import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useUserAccess } from "@/hooks/useUserAccess";

export const FeedbackNotificationBadge = () => {
  const { isAdmin } = useUserAccess();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!isAdmin) return;

    loadUnreadCount();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('feedback_notifications')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'feedback' },
        () => loadUnreadCount()
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [isAdmin]);

  const loadUnreadCount = async () => {
    const { count } = await supabase
      .from('feedback')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'new');

    setUnreadCount(count || 0);
  };

  if (!isAdmin || unreadCount === 0) return null;

  return (
    <div className="relative inline-block">
      <Bell className="w-5 h-5" />
      <Badge 
        variant="destructive" 
        className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
      >
        {unreadCount}
      </Badge>
    </div>
  );
};
