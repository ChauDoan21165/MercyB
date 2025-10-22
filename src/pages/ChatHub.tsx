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
import { usePoints } from "@/hooks/usePoints";
import { useUserAccess } from "@/hooks/useUserAccess";
import { useCredits } from "@/hooks/useCredits";
import { CreditLimitModal } from "@/components/CreditLimitModal";
import { CreditsDisplay } from "@/components/CreditsDisplay";
import { PrivateChatPanel } from "@/components/PrivateChatPanel";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from "@/components/ui/alert-dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { keywordRespond } from "@/lib/keywordResponder";
import { messageSchema } from "@/lib/inputValidation";
import { supabase } from "@/integrations/supabase/client";

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
  const [mainInput, setMainInput] = useState("");
  const [feedbackInput, setFeedbackInput] = useState("");
  const [roomInput, setRoomInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [noKeywordCount, setNoKeywordCount] = useState(0);
  const [matchedEntryCount, setMatchedEntryCount] = useState(0);
  const [userMessageCount, setUserMessageCount] = useState(0);
  const mainScrollRef = useRef<HTMLDivElement>(null);
  const progress = useRoomProgress(roomId);
  const { trackMessage, trackKeyword, trackCompletion } = useBehaviorTracking(roomId || "");
  const { awardPoints } = usePoints();
  const { canAccessVIP1, canAccessVIP2, canAccessVIP3, tier, isAdmin, loading: accessLoading } = useUserAccess();
  const { creditInfo, hasCreditsRemaining, incrementUsage, refreshCredits } = useCredits();
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const [showCreditLimit, setShowCreditLimit] = useState(false);
  const [contentMode, setContentMode] = useState<"ai" | "keyword">(() => {
    const saved = localStorage.getItem(`contentMode_${roomId}`);
    return (saved === "keyword" || saved === "ai") ? saved : "ai";
  });

  // Save content mode preference
  useEffect(() => {
    localStorage.setItem(`contentMode_${roomId}`, contentMode);
  }, [contentMode, roomId]);

// Use centralized room metadata
const info = getRoomInfo(roomId || "");
const currentRoom = info ? { nameVi: info.nameVi, nameEn: info.nameEn } : { nameVi: "Phòng không xác định", nameEn: "Unknown Room" };

// Check access
useEffect(() => {
  if (!accessLoading && info) {
    const hasAccess = 
      info.tier === 'free' ||
      (info.tier === 'vip1' && canAccessVIP1) ||
      (info.tier === 'vip2' && canAccessVIP2) ||
      (info.tier === 'vip3' && canAccessVIP3);
    
    if (!hasAccess) {
      setShowAccessDenied(true);
    }
  }
}, [accessLoading, info, canAccessVIP1, canAccessVIP2, canAccessVIP3]);

const handleAccessDenied = () => {
  navigate('/');
};

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

    // Validate input
    const validation = messageSchema.safeParse({ text: mainInput });
    if (!validation.success) {
      toast({
        title: "Invalid Input / Đầu Vào Không Hợp Lệ",
        description: validation.error.issues[0].message,
        variant: "destructive"
      });
      return;
    }

    // Check if user has credits remaining
    if (!hasCreditsRemaining()) {
      setShowCreditLimit(true);
      return;
    }

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
    
    // Increment usage count
    await incrementUsage();
    
    // Track message count and award points every 10 questions
    const newCount = userMessageCount + 1;
    setUserMessageCount(newCount);
    if (newCount % 10 === 0) {
      await awardPoints(10, 'questions_completed', `Completed ${newCount} questions in ${currentRoom.nameEn}`, roomId);
      toast({
        title: "Points Awarded! / Điểm Thưởng!",
        description: `You earned 10 points for completing ${newCount} questions! / Bạn nhận 10 điểm khi hoàn thành ${newCount} câu hỏi!`,
      });
    }
    
    // Track message for behavior analytics
    trackMessage(currentInput);

    // KEYWORD MODE: Use keyword responder
    if (contentMode === "keyword") {
      // Add typing indicator
      const typingMessageId = (Date.now() + 1).toString();
      const typingMessage: Message = {
        id: typingMessageId,
        text: '...',
        isUser: false,
        timestamp: new Date()
      };
      setMainMessages(prev => [...prev, typingMessage]);
      
      try {
        // Simulate a brief delay for better UX
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const response = keywordRespond(roomId || "", currentInput, noKeywordCount, matchedEntryCount);
        
        if (response.matched) {
          setMatchedEntryCount(prev => prev + 1);
          setNoKeywordCount(0);
        } else {
          setNoKeywordCount(prev => prev + 1);
        }

        // Replace typing indicator with actual response
        setMainMessages(prev => 
          prev.map(m => 
            m.id === typingMessageId 
              ? { ...m, text: response.text, relatedRooms: response.relatedRooms }
              : m
          )
        );
      } catch (error) {
        console.error('Error generating keyword response:', error);
        // Remove typing indicator on error
        setMainMessages(prev => prev.filter(m => m.id !== typingMessageId));
        toast({
          title: "Error / Lỗi",
          description: "Could not generate response / Không Thể Tạo Phản Hồi",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // AI MODE: Use AI chat
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

  const sendMessage = async (
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

    // Handle feedback submission to database
    if (chatType === "feedback") {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('feedback').insert({
          user_id: user.id,
          room_id: roomId || '',
          message: input,
          status: 'new',
          priority: 'normal'
        });

        const responseText = "Thank you for your feedback. Admins have been notified.\n\nCảm ơn phản hồi của bạn. Quản trị viên đã được thông báo.";
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: responseText,
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } else if (chatType === "room") {
      setTimeout(() => {
        const responseText = "Your message has been sent to the room.\n\nTin nhắn của bạn đã được gửi đến phòng.";
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: responseText,
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      }, 800);
    }
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
          {message.isUser && (
            <span className="text-xs opacity-70 mt-1 block">
              {message.timestamp.toLocaleTimeString()}
            </span>
          )}
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

  // Get background color based on room tier
  const roomInfo = getRoomInfo(roomId || "");
  const getBgColor = () => {
    if (!roomInfo) return 'hsl(var(--background))';
    switch (roomInfo.tier) {
      case 'vip1': return 'hsl(var(--page-vip1))';
      case 'vip2': return 'hsl(var(--page-vip2))';
      case 'vip3': return 'hsl(var(--page-vip3))';
      default: return 'hsl(var(--background))';
    }
  };

  return (
    <>
      <AlertDialog open={showAccessDenied} onOpenChange={setShowAccessDenied}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>VIP Only / Chỉ Dành Cho VIP</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>This room is for VIP members only. Please upgrade your subscription to access this content.</p>
              <p className="text-sm">Phòng này chỉ dành cho thành viên VIP. Vui lòng nâng cấp gói đăng ký để truy cập nội dung này.</p>
              <p className="font-semibold mt-4">Required tier: {info?.tier?.toUpperCase()}</p>
              <p className="text-sm">Your tier: {tier?.toUpperCase()}</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleAccessDenied}>Go Back / Quay Lại</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="min-h-screen p-4" style={{ background: getBgColor() }}>
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
          </div>
          
          <div className="text-center space-y-2">
            <div>
              <h2 className="text-xl font-bold text-foreground">{currentRoom.nameEn}</h2>
              <p className="text-sm text-muted-foreground">{currentRoom.nameVi}</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <p className="text-xs text-muted-foreground">Choose content mode / Chọn chế độ nội dung:</p>
              <ToggleGroup 
                type="single" 
                value={contentMode} 
                onValueChange={(value) => {
                  if (value === "ai" && !canAccessVIP1) {
                    toast({
                      title: "VIP Required / Yêu Cầu VIP",
                      description: "AI mode is only available for VIP members. Switch to keyword mode for free access. / Chế độ AI chỉ dành cho thành viên VIP. Chuyển sang chế độ từ khóa để sử dụng miễn phí.",
                      variant: "destructive",
                      duration: 4000,
                    });
                    return;
                  }
                  if (value) setContentMode(value as "ai" | "keyword");
                }}
                className="inline-flex bg-card border rounded-lg p-1"
              >
                <ToggleGroupItem 
                  value="ai" 
                  aria-label="AI Content" 
                  className="text-sm px-4 py-2 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                >
                  <span className="flex flex-col items-center">
                    <span>🤖 AI Content</span>
                    <span className="text-xs opacity-80">Nội dung tạo bởi AI</span>
                  </span>
                </ToggleGroupItem>
                <ToggleGroupItem 
                  value="keyword" 
                  aria-label="Keyword Content" 
                  className="text-sm px-4 py-2 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                >
                  <span className="flex flex-col items-center">
                    <span>📚 Keyword Content</span>
                    <span className="text-xs opacity-80">Nội dung nghiên cứu trước của admin</span>
                  </span>
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
              Active / Đang Hoạt Động
            </Badge>
          </div>
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

          {/* Private Chat with Permissions */}
          <PrivateChatPanel roomId={roomId || ""} />
        </div>
      </div>
    </div>

    <CreditLimitModal
      open={showCreditLimit}
      onClose={() => setShowCreditLimit(false)}
      onSuccess={refreshCredits}
      questionsUsed={creditInfo.questionsUsed}
      questionsLimit={creditInfo.questionsLimit}
    />
    </>
  );
};

export default ChatHub;
