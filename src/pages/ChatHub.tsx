import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, ArrowLeft, MessageCircle, Mail, Users, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { getRoomInfo } from "@/lib/roomData";
import { useRoomProgress } from "@/hooks/useRoomProgress";
import { useBehaviorTracking } from "@/hooks/useBehaviorTracking";
import { RoomProgress } from "@/components/RoomProgress";
import { WelcomeBack } from "@/components/WelcomeBack";
import { RelatedRooms } from "@/components/RelatedRooms";
import { MessageActions } from "@/components/MessageActions";
import { MatchmakingButton } from "@/components/MatchmakingButton";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  relatedRooms?: string[];
}

const ChatHub = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mainMessages, setMainMessages] = useState<Message[]>([]);
  const [feedbackMessages, setFeedbackMessages] = useState<Message[]>([]);
  const [roomMessages, setRoomMessages] = useState<Message[]>([]);
  const [privateMessages, setPrivateMessages] = useState<Message[]>([]);
  const [mainInput, setMainInput] = useState("");
  const [feedbackInput, setFeedbackInput] = useState("");
  const [roomInput, setRoomInput] = useState("");
  const [privateInput, setPrivateInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [noKeywordCount, setNoKeywordCount] = useState(0);
  const [matchedEntryCount, setMatchedEntryCount] = useState(0);
  const mainScrollRef = useRef<HTMLDivElement>(null);
  const progress = useRoomProgress(roomId);
  const { trackMessage, trackKeyword, trackCompletion } = useBehaviorTracking(roomId || "");

// Use centralized room metadata
const info = getRoomInfo(roomId || "");
const currentRoom = info ? { nameVi: info.nameVi, nameEn: info.nameEn } : { nameVi: "Phòng không xác định", nameEn: "Unknown Room" };

  // Add welcome message when room loads
  useEffect(() => {
    if (mainMessages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        text: `Hello! Welcome to ${currentRoom.nameEn} room. How can I help you today?\n\nXin chào! Chào mừng bạn đến với phòng ${currentRoom.nameVi}. Tôi có thể giúp gì cho bạn hôm nay?`,
        isUser: false,
        timestamp: new Date()
      };
      setMainMessages([welcomeMessage]);
    }
  }, [roomId]);

  const sendMainMessage = async () => {
    if (!mainInput.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: mainInput,
      isUser: true,
      timestamp: new Date()
    };

    setMainMessages(prev => [...prev, userMessage]);
    const currentInput = mainInput;
    setMainInput("");
    setIsLoading(true);
    
    // Track message for behavior analytics
    trackMessage(currentInput);

    // Create a temporary AI message that we'll update with streaming content
    const aiMessageId = (Date.now() + 1).toString();
    const tempAiMessage: Message = {
      id: aiMessageId,
      text: '',
      isUser: false,
      timestamp: new Date()
    };
    setMainMessages(prev => [...prev, tempAiMessage]);

    try {
      // Get conversation history
      const conversationHistory = mainMessages
        .filter(m => m.id !== 'welcome')
        .map(m => ({
          role: m.isUser ? 'user' : 'assistant',
          content: m.text
        }));

      conversationHistory.push({ role: 'user', content: currentInput });

      const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;
      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          roomId: roomId,
          messages: conversationHistory
        }),
      });

      if (!response.ok || !response.body) {
        if (response.status === 429) {
          throw new Error('Too many requests. Please wait a moment and try again.');
        }
        if (response.status === 402) {
          throw new Error('AI service temporarily unavailable. Please try again later.');
        }
        throw new Error('Failed to get AI response');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';
      let accumulatedText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              accumulatedText += content;
              // Update the AI message with accumulated text
              setMainMessages(prev =>
                prev.map(m =>
                  m.id === aiMessageId ? { ...m, text: accumulatedText } : m
                )
              );
            }
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

    } catch (error) {
      console.error('Error generating response:', error);
      // Remove the temp message on error
      setMainMessages(prev => prev.filter(m => m.id !== aiMessageId));
      
      toast({
        title: "Error / Lỗi",
        description: error instanceof Error ? error.message : "Could not generate response / Không Thể Tạo Phản Hồi",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = (
    input: string,
    setInput: (val: string) => void,
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    chatType: string
  ) => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInput("");

    // Simulate response
    setTimeout(() => {
      let responseText = "";
      if (chatType === "feedback") {
        responseText = "Thank you for your feedback. We have recorded it.\n\nCảm ơn phản hồi của bạn. Chúng tôi đã ghi nhận.";
      } else if (chatType === "room") {
        responseText = "Your message has been sent to the room.\n\nTin nhắn của bạn đã được gửi đến phòng.";
      } else {
        responseText = "Your private message has been sent.\n\nTin nhắn riêng tư của bạn đã được gửi.";
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 800);
  };

  useEffect(() => {
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTop = mainScrollRef.current.scrollHeight;
    }
  }, [mainMessages]);

  const MessageBubble = ({ message }: { message: Message }) => (
    <div className={`flex ${message.isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div className="max-w-[80%] group">
        <div
          className={`rounded-2xl px-4 py-3 ${
            message.isUser
              ? "bg-gradient-to-br from-primary to-primary-glow text-primary-foreground"
              : "bg-card border shadow-sm"
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
          <span className="text-xs opacity-70 mt-1 block">
            {message.timestamp.toLocaleTimeString()}
          </span>
        </div>
        
        {!message.isUser && (
          <>
            <MessageActions text={message.text} roomId={roomId || ""} />
            {message.relatedRooms && message.relatedRooms.length > 0 && (
              <RelatedRooms roomNames={message.relatedRooms} />
            )}
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between bg-card rounded-lg p-4 shadow-soft">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => navigate("/rooms")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back / Quay Lại
            </Button>
            <MatchmakingButton />
          </div>
          
          <div className="text-center">
            <h2 className="text-xl font-bold text-foreground">{currentRoom.nameEn}</h2>
            <p className="text-sm text-muted-foreground">{currentRoom.nameVi}</p>
          </div>
          
          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
            Active / Đang Hoạt Động
          </Badge>
        </div>
        
        {/* Progress Tracker */}
        <RoomProgress totalRooms={progress.totalRooms} streak={progress.streak} />

        {/* Main Chat Area */}
        <Card className="p-6 shadow-soft">
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <MessageCircle className="w-5 h-5 text-primary" />
              <div>
                <h3 className="font-semibold">Main Consultation</h3>
                <p className="text-xs text-muted-foreground">Tư Vấn Chính</p>
              </div>
            </div>
            
            <ScrollArea className="h-[400px] pr-4" ref={mainScrollRef}>
              <WelcomeBack lastRoomId={progress.lastVisit} currentRoomId={roomId || ""} />
              {mainMessages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-center">
                  <div className="space-y-2">
                    <p className="text-muted-foreground">Start your conversation</p>
                    <p className="text-sm text-muted-foreground">Bắt Đầu Cuộc Trò Chuyện Của Bạn</p>
                  </div>
                </div>
              ) : (
                mainMessages.map(msg => <MessageBubble key={msg.id} message={msg} />)
              )}
            </ScrollArea>

            <div className="flex gap-2 pt-2">
              <Input
                placeholder="Type your message / Nhập Tin Nhắn..."
                value={mainInput}
                onChange={(e) => setMainInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && !isLoading && sendMainMessage()}
                disabled={isLoading}
                className="flex-1"
              />
              <Button 
                onClick={sendMainMessage} 
                disabled={isLoading}
                className="bg-gradient-to-r from-primary to-primary-glow"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Three Small Chat Boxes */}
        <div className="grid md:grid-cols-3 gap-4">
          {/* Feedback Chat */}
          <Card className="p-4 shadow-soft">
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Mail className="w-4 h-4 text-secondary" />
                <div>
                  <h4 className="text-sm font-semibold">Feedback to Admin</h4>
                  <p className="text-xs text-muted-foreground">Phản Hồi</p>
                </div>
              </div>
              
              <ScrollArea className="h-32">
                {feedbackMessages.map(msg => (
                  <div key={msg.id} className="mb-2">
                    <div className={`text-xs p-2 rounded-lg ${msg.isUser ? "bg-secondary/20" : "bg-muted"}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </ScrollArea>

              <div className="flex gap-2">
                <Input
                  placeholder="Send feedback / Gửi Phản Hồi..."
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage(feedbackInput, setFeedbackInput, setFeedbackMessages, "feedback")}
                  className="text-sm"
                />
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => sendMessage(feedbackInput, setFeedbackInput, setFeedbackMessages, "feedback")}
                >
                  <Send className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Room Chat */}
          <Card className="p-4 shadow-soft">
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Users className="w-4 h-4 text-accent" />
                <div>
                  <h4 className="text-sm font-semibold">Room Chat</h4>
                  <p className="text-xs text-muted-foreground">Chat Phòng</p>
                </div>
              </div>
              
              <ScrollArea className="h-32">
                {roomMessages.map(msg => (
                  <div key={msg.id} className="mb-2">
                    <div className={`text-xs p-2 rounded-lg ${msg.isUser ? "bg-accent/20" : "bg-muted"}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </ScrollArea>

              <div className="flex gap-2">
                <Input
                  placeholder="Room message / Nhắn Tin Phòng..."
                  value={roomInput}
                  onChange={(e) => setRoomInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage(roomInput, setRoomInput, setRoomMessages, "room")}
                  className="text-sm"
                />
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => sendMessage(roomInput, setRoomInput, setRoomMessages, "room")}
                >
                  <Send className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Private Chat */}
          <Card className="p-4 shadow-soft">
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b">
                <MessageCircle className="w-4 h-4 text-primary" />
                <div>
                  <h4 className="text-sm font-semibold">Private Chat</h4>
                  <p className="text-xs text-muted-foreground">Chat Riêng</p>
                </div>
              </div>
              
              <ScrollArea className="h-32">
                {privateMessages.map(msg => (
                  <div key={msg.id} className="mb-2">
                    <div className={`text-xs p-2 rounded-lg ${msg.isUser ? "bg-primary/20" : "bg-muted"}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </ScrollArea>

              <div className="flex gap-2">
                <Input
                  placeholder="Private message / Nhắn Tin Riêng..."
                  value={privateInput}
                  onChange={(e) => setPrivateInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage(privateInput, setPrivateInput, setPrivateMessages, "private")}
                  className="text-sm"
                />
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => sendMessage(privateInput, setPrivateInput, setPrivateMessages, "private")}
                >
                  <Send className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChatHub;
