import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, UserPlus, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Profile {
  id: string;
  username: string | null;
}

interface ChatRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: string;
  sender_username?: string;
  receiver_username?: string;
}

interface PrivateMessage {
  id: string;
  message: string;
  sender_id: string;
  created_at: string;
  is_read: boolean;
}

interface PrivateChatPanelProps {
  roomId: string;
}

export const PrivateChatPanel = ({ roomId }: PrivateChatPanelProps) => {
  const { toast } = useToast();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [usersInRoom, setUsersInRoom] = useState<Profile[]>([]);
  const [pendingRequests, setPendingRequests] = useState<ChatRequest[]>([]);
  const [activeChats, setActiveChats] = useState<ChatRequest[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatRequest | null>(null);
  const [messages, setMessages] = useState<PrivateMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [showUserList, setShowUserList] = useState(false);

  useEffect(() => {
    getCurrentUser();
    loadActiveUsers();
    loadChatRequests();
    
    // Subscribe to realtime updates
    const requestsChannel = supabase
      .channel(`private_requests_${roomId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'private_chat_requests' },
        () => loadChatRequests()
      )
      .subscribe();

    const messagesChannel = supabase
      .channel(`private_messages_${roomId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'private_messages' },
        () => {
          if (selectedChat) loadMessages(selectedChat.id);
        }
      )
      .subscribe();

    return () => {
      requestsChannel.unsubscribe();
      messagesChannel.unsubscribe();
    };
  }, [roomId, selectedChat]);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) setCurrentUserId(user.id);
  };

  const loadActiveUsers = async () => {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, username')
      .neq('id', currentUserId || '');
    
    if (profiles) setUsersInRoom(profiles);
  };

  const loadChatRequests = async () => {
    if (!currentUserId) return;

    const { data: requests } = await supabase
      .from('private_chat_requests')
      .select('*')
      .eq('room_id', roomId)
      .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`);

    if (requests) {
      // Fetch usernames separately
      const userIds = [...new Set(requests.flatMap(r => [r.sender_id, r.receiver_id]))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, username')
        .in('id', userIds);

      const usernameMap = new Map(profiles?.map(p => [p.id, p.username]) || []);

      const enrichedRequests = requests.map(r => ({
        ...r,
        sender_username: usernameMap.get(r.sender_id) || undefined,
        receiver_username: usernameMap.get(r.receiver_id) || undefined
      }));

      const pending = enrichedRequests.filter(r => r.status === 'pending' && r.receiver_id === currentUserId);
      const active = enrichedRequests.filter(r => r.status === 'accepted');
      
      setPendingRequests(pending);
      setActiveChats(active);
    }
  };

  const sendChatRequest = async (receiverId: string) => {
    if (!currentUserId) return;

    const { error } = await supabase
      .from('private_chat_requests')
      .insert({
        sender_id: currentUserId,
        receiver_id: receiverId,
        room_id: roomId,
        status: 'pending'
      });

    if (error) {
      toast({
        title: "Error / Lỗi",
        description: "Could not send request / Không thể gửi yêu cầu",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Request Sent / Đã Gửi",
        description: "Chat request sent successfully / Yêu cầu chat đã gửi thành công"
      });
      setShowUserList(false);
    }
  };

  const handleRequest = async (requestId: string, status: 'accepted' | 'rejected' | 'ignored') => {
    const { error } = await supabase
      .from('private_chat_requests')
      .update({ status })
      .eq('id', requestId);

    if (!error) {
      loadChatRequests();
      toast({
        title: status === 'accepted' ? "Accepted / Đã Chấp Nhận" : "Declined / Đã Từ Chối",
        description: status === 'accepted' 
          ? "You can now chat / Bạn có thể chat ngay" 
          : "Request declined / Yêu cầu đã bị từ chối"
      });
    }
  };

  const loadMessages = async (requestId: string) => {
    const { data } = await supabase
      .from('private_messages')
      .select('*')
      .eq('request_id', requestId)
      .order('created_at', { ascending: true });

    if (data) setMessages(data);
  };

  const sendMessage = async () => {
    if (!messageInput.trim() || !selectedChat || !currentUserId) return;

    const otherUserId = selectedChat.sender_id === currentUserId 
      ? selectedChat.receiver_id 
      : selectedChat.sender_id;

    const { error } = await supabase
      .from('private_messages')
      .insert({
        sender_id: currentUserId,
        receiver_id: otherUserId,
        request_id: selectedChat.id,
        message: messageInput
      });

    if (!error) {
      setMessageInput("");
      loadMessages(selectedChat.id);
    }
  };

  const selectChat = (chat: ChatRequest) => {
    setSelectedChat(chat);
    loadMessages(chat.id);
  };

  return (
    <Card className="p-4 shadow-soft">
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-2 border-b">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-primary" />
            <div>
              <h4 className="text-sm font-semibold">Private Chat</h4>
              <p className="text-xs text-muted-foreground">Chat Riêng</p>
            </div>
          </div>
          
          <Dialog open={showUserList} onOpenChange={setShowUserList}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <UserPlus className="w-3 h-3 mr-1" />
                New
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Send Chat Request / Gửi Yêu Cầu Chat</DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {usersInRoom.map(user => (
                    <div key={user.id} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">{user.username || 'Anonymous'}</span>
                      <Button size="sm" onClick={() => sendChatRequest(user.id)}>
                        Send Request / Gửi
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">Requests / Yêu Cầu:</p>
            {pendingRequests.map(req => (
              <div key={req.id} className="flex items-center justify-between p-2 bg-muted rounded text-xs">
                <span>{req.sender_username || 'User'} wants to chat</span>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => handleRequest(req.id, 'accepted')}>
                    <Check className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleRequest(req.id, 'rejected')}>
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Active Chats */}
        {!selectedChat && activeChats.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">Active Chats / Chat Hoạt Động:</p>
            {activeChats.map(chat => {
              const otherUsername = chat.sender_id === currentUserId 
                ? chat.receiver_username 
                : chat.sender_username;
              return (
                <Button
                  key={chat.id}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => selectChat(chat)}
                >
                  {otherUsername || 'User'}
                </Button>
              );
            })}
          </div>
        )}

        {/* Chat Messages */}
        {selectedChat && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold">
                Chat with {selectedChat.sender_id === currentUserId 
                  ? selectedChat.receiver_username 
                  : selectedChat.sender_username || 'User'}
              </p>
              <Button size="sm" variant="ghost" onClick={() => setSelectedChat(null)}>
                Back / Quay Lại
              </Button>
            </div>

            <ScrollArea className="h-32">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`mb-2 text-xs p-2 rounded-lg ${
                    msg.sender_id === currentUserId ? 'bg-primary/20 ml-auto' : 'bg-muted'
                  } max-w-[80%]`}
                >
                  {msg.message}
                </div>
              ))}
            </ScrollArea>

            <div className="flex gap-2">
              <Input
                placeholder="Type message / Nhập tin nhắn..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                className="text-sm"
              />
              <Button size="sm" variant="outline" onClick={sendMessage}>
                <Send className="w-3 h-3" />
              </Button>
            </div>
          </>
        )}

        {!selectedChat && activeChats.length === 0 && pendingRequests.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">
            No active chats. Click "New" to start. / Chưa có chat. Nhấn "New" để bắt đầu.
          </p>
        )}
      </div>
    </Card>
  );
};
