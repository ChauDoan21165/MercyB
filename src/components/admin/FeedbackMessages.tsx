import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Check, Clock, AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useNotificationSound } from "@/hooks/useNotificationSound";

interface FeedbackMessage {
  id: string;
  user_id: string;
  message: string;
  category: string | null;
  priority: string | null;
  status: string | null;
  created_at: string;
  profiles: {
    username: string | null;
    full_name: string | null;
    email: string | null;
  } | null;
}

export const FeedbackMessages = () => {
  const { toast } = useToast();
  const { playNotificationSound } = useNotificationSound();
  const [messages, setMessages] = useState<FeedbackMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'new' | 'in_progress' | 'resolved'>('all');
  const previousMessageIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    fetchMessages();
    subscribeToMessages();
  }, [filter]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('feedback')
        .select(`
          *,
          profiles (
            username,
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Check for new high-priority messages
      if (data) {
        const currentIds = new Set(data.map(m => m.id));
        const newHighPriorityMessages = data.filter(msg => 
          msg.priority === 'high' && 
          msg.status === 'new' &&
          !previousMessageIdsRef.current.has(msg.id)
        );

        if (newHighPriorityMessages.length > 0 && previousMessageIdsRef.current.size > 0) {
          playNotificationSound('alert');
          toast({
            title: "🚨 High Priority Feedback!",
            description: `${newHighPriorityMessages.length} new urgent message(s) received`,
            variant: "destructive",
          });
        }

        previousMessageIdsRef.current = currentIds;
      }
      
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      toast({
        title: "Error",
        description: "Failed to load feedback messages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel('feedback-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'feedback'
        },
        () => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('feedback')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Updated! ✓",
        description: `Feedback marked as ${newStatus}`,
      });
      
      fetchMessages();
    } catch (error) {
      console.error('Error updating feedback:', error);
      toast({
        title: "Error",
        description: "Failed to update feedback status",
        variant: "destructive",
      });
    }
  };

  const getPriorityColor = (priority: string | null) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'normal': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case 'new': return <AlertCircle className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      case 'resolved': return <Check className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            User Feedback Messages
          </CardTitle>
          
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All ({messages.length})
            </Button>
            <Button
              variant={filter === 'new' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('new')}
            >
              New
            </Button>
            <Button
              variant={filter === 'in_progress' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('in_progress')}
            >
              In Progress
            </Button>
            <Button
              variant={filter === 'resolved' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('resolved')}
            >
              Resolved
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          {loading ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Loading messages...
            </p>
          ) : messages.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No feedback messages found
            </p>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <Card key={msg.id} className="bg-muted/30">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-semibold text-foreground">
                            {msg.profiles?.username || msg.profiles?.full_name || 'Anonymous'}
                          </p>
                          {msg.category && (
                            <Badge variant="outline" className="text-xs">
                              {msg.category}
                            </Badge>
                          )}
                          {msg.priority && (
                            <div className={`w-2 h-2 rounded-full ${getPriorityColor(msg.priority)}`} />
                          )}
                        </div>
                        <p className="text-sm text-foreground whitespace-pre-wrap">
                          {msg.message}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {getStatusIcon(msg.status)}
                        <span>{msg.status || 'new'}</span>
                        <span>•</span>
                        <span>{formatDate(msg.created_at)}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        {msg.status !== 'in_progress' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStatus(msg.id, 'in_progress')}
                          >
                            In Progress
                          </Button>
                        )}
                        {msg.status !== 'resolved' && (
                          <Button
                            size="sm"
                            onClick={() => updateStatus(msg.id, 'resolved')}
                            style={{ 
                              background: 'var(--gradient-rainbow)',
                              color: 'white'
                            }}
                          >
                            Resolve
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
