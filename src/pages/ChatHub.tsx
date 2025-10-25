import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, ArrowLeft, MessageCircle, Mail, Users, Loader2, Volume2 } from "lucide-react";
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
import { keywordRespond } from "@/lib/keywordResponder";
import { messageSchema } from "@/lib/inputValidation";
import { supabase } from "@/integrations/supabase/client";
import { roomDataMap } from "@/lib/roomDataImports";

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
  const [username, setUsername] = useState<string>("");
  const [noKeywordCount, setNoKeywordCount] = useState(0);
  const [matchedEntryCount, setMatchedEntryCount] = useState(0);
  const [userMessageCount, setUserMessageCount] = useState(0);
  const mainScrollRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };
  const progress = useRoomProgress(roomId);
  const { trackMessage, trackKeyword, trackCompletion } = useBehaviorTracking(roomId || "");
  const { awardPoints } = usePoints();
  const { canAccessVIP1, canAccessVIP2, canAccessVIP3, tier, isAdmin, loading: accessLoading } = useUserAccess();
  const { creditInfo, hasCreditsRemaining, incrementUsage, refreshCredits } = useCredits();
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const [showCreditLimit, setShowCreditLimit] = useState(false);
  const contentMode = "keyword"; // Always use keyword mode
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const [altAudio, setAltAudio] = useState<string | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [keywordMenu, setKeywordMenu] = useState<{ en: string[]; vi: string[] } | null>(null);
  const [clickedKeyword, setClickedKeyword] = useState<string | null>(null);

// Use centralized room metadata
const info = getRoomInfo(roomId || "");
const currentRoom = info ? { nameVi: info.nameVi, nameEn: info.nameEn } : { nameVi: "Phòng không xác định", nameEn: "Unknown Room" };

// Fetch username
useEffect(() => {
  const fetchUsername = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("username, email")
        .eq("id", user.id)
        .single();
      
      setUsername(profile?.username || user.email?.split('@')[0] || "User");
    }
  };
  fetchUsername();
}, []);

// Check access
useEffect(() => {
  if (!accessLoading && info) {
    const hasAccess = 
      isAdmin || // Admins can access all rooms
      info.tier === 'free' ||
      (info.tier === 'vip1' && canAccessVIP1) ||
      (info.tier === 'vip2' && canAccessVIP2) ||
      (info.tier === 'vip3' && canAccessVIP3);

    if (!hasAccess) {
      setShowAccessDenied(true);
    } else {
      setShowAccessDenied(false);
    }
  }
}, [accessLoading, info, canAccessVIP1, canAccessVIP2, canAccessVIP3, isAdmin]);

const handleAccessDenied = () => {
  navigate('/');
};

  // Initialize room on load or when roomId changes
  useEffect(() => {
    // Reset state when switching rooms
    setMainMessages([]);
    setKeywordMenu(null);
    setCurrentAudio(null);
    setIsAudioPlaying(false);

    try {
      const roomData = roomDataMap[roomId || ''];
      
      // Load welcome message with new format
      const welcomeText = `Welcome to ${currentRoom.nameEn} Room, please click the keyword of the topic you want to discover.\n\nChào mừng bạn đến với phòng ${currentRoom.nameVi}, vui lòng nhấp vào từ khóa của chủ đề bạn muốn khám phá.`;
      
      const welcomeMessage: Message = {
        id: 'welcome',
        text: welcomeText,
        isUser: false,
        timestamp: new Date()
      };
      setMainMessages([welcomeMessage]);
      
      // Load keyword menu from room data (support multiple schemas)
      if (roomData?.keyword_menu?.en && roomData?.keyword_menu?.vi) {
        setKeywordMenu(roomData.keyword_menu);
      } else if (roomData?.keywords) {
        try {
          const groups = Object.values(roomData.keywords) as any[];
          const en = Array.from(new Set(groups.flatMap((g: any) => g?.en || [])));
          const vi = Array.from(new Set(groups.flatMap((g: any) => g?.vi || [])));
          if (en.length > 0 || vi.length > 0) {
            setKeywordMenu({ en, vi });
          }
        } catch (e) {
          console.warn('Could not derive keyword menu from keywords', e);
        }
      }
    } catch (error) {
      console.error('Error loading room data:', error);
      // Fallback welcome message
      const welcomeMessage: Message = {
        id: 'welcome',
        text: `Welcome to ${currentRoom.nameEn} Room, please click the keyword of the topic you want to discover.\n\nChào mừng bạn đến với phòng ${currentRoom.nameVi}, vui lòng nhấp vào từ khóa của chủ đề bạn muốn khám phá.`,
        isUser: false,
        timestamp: new Date()
      };
      setMainMessages([welcomeMessage]);
    }
  }, [roomId]);

  const handleKeywordClick = async (keyword: string) => {
    if (isLoading) return;
    
    // Highlight the clicked keyword
    setClickedKeyword(keyword);
    
    // Send the message without showing it as a user bubble
    await sendMainMessage(keyword);
  };

  const sendMainMessage = async (keywordText?: string) => {
    const messageText = keywordText || mainInput.trim();
    if (!messageText || isLoading) return;

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to send messages",
        variant: "destructive"
      });
      return;
    }


    // Validate input (only when user types, not for keyword clicks)
    if (!keywordText) {
      const validation = messageSchema.safeParse({ text: mainInput });
      if (!validation.success) {
        toast({
          title: "Invalid Input / Đầu Vào Không Hợp Lệ",
          description: validation.error.issues[0].message,
          variant: "destructive"
        });
        return;
      }
    }


    // Check if user has credits remaining
    if (!hasCreditsRemaining()) {
      setShowCreditLimit(true);
      return;
    }

    // Only add user message bubble if NOT from keyword click
    if (!keywordText) {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: messageText,
        isUser: true,
        timestamp: new Date()
      };
      setMainMessages(prev => [...prev, userMessage]);
    }
    
    const currentInput = messageText;
    if (!keywordText) {
      setMainInput("");
    }
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

    // KEYWORD MODE: Use keyword responder only
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
            
            // Play audio if available - try storage first
            if (response.audioFile) {
              try {
                setAudioLoading(true);
                const raw = String(response.audioFile);
                // Extract filename from path
                const filename = raw.replace(/^\/?(audio\/)?/, '');
                
                // Try Supabase storage first
                const { data: urlData } = supabase.storage
                  .from('room-audio')
                  .getPublicUrl(filename);
                const storageUrl = urlData.publicUrl;

                // Cache-bust to force reload
                const withTs = (u: string) => `${u}${u.includes('?') ? '&' : '?'}t=${Date.now()}`;

                // Set storage URL as primary, local path as fallback
                const primaryUrl = withTs(storageUrl);
                const fallbackUrl = withTs(`/audio/${filename}`);
                
                setCurrentAudio(primaryUrl);
                setAltAudio(fallbackUrl);
                setIsAudioPlaying(false);

                // Try to start playback
                const el = audioRef.current;
                if (el) {
                  const handleError = () => {
                    console.log('Primary audio failed, trying fallback');
                    if (fallbackUrl && el.src !== fallbackUrl) {
                      el.src = fallbackUrl;
                      el.load();
                      el.play().catch(() => {
                        toast({
                          title: "Audio unavailable / Âm thanh không có",
                          description: "Audio file not found / Không tìm thấy file âm thanh",
                          variant: "destructive"
                        });
                      });
                    }
                    el.removeEventListener('error', handleError);
                  };
                  el.addEventListener('error', handleError, { once: true } as any);
                  el.src = primaryUrl;
                  el.load();
                  el.currentTime = 0;
                  el.play().catch(() => {/* autoplay blocked, user can click play */});
                }

              } catch (e) {
                console.error('Audio load error:', e);
                setAudioLoading(false);
                setCurrentAudio(null);
              }
            }
          } else {
            setNoKeywordCount(prev => prev + 1);
          }

        // Replace typing indicator with actual response
        setMainMessages(prev => 
          prev.map(m => 
            m.id === typingMessageId 
              ? { 
                  ...m, 
                  text: response.text
                    .replace(/\*\*/g, '')
                    .replace(/(?:\n|\s)*\d{1,2}:\d{2}:\d{2}\s?(AM|PM)?\.?$/i, '')
                    .trim(), 
                  relatedRooms: response.relatedRooms 
                }
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

  // Stable scroll: only when messages change or loading starts
  useEffect(() => {
    scrollToBottom();
  }, [mainMessages, isLoading]);

  const MessageBubble = ({ message }: { message: Message }) => {
    // Split content to display English and Vietnamese separately
    const parts = message.text.split(/\n+---\n+/);
    const englishContent = parts[0]?.trim() || message.text;
    const vietnameseContent = parts[1]?.trim() || '';

    return (
      <div className={`flex ${message.isUser ? "justify-end" : "justify-start"} mb-4`}>
        <div className="w-full group">
          <div
            className={`rounded-2xl px-4 py-3 ${
              message.isUser
                ? "bg-gradient-to-br from-primary to-primary-glow text-primary-foreground"
                : "bg-card border shadow-sm"
            }`}
          >
            {!message.isUser && vietnameseContent ? (
              <>
                <p className="text-sm whitespace-pre-wrap">{englishContent}</p>
                {!message.isUser && <MessageActions text={englishContent} roomId={roomId || ""} />}
                <hr className="border-border my-3" />
                <p className="text-sm whitespace-pre-wrap">{vietnameseContent}</p>
                {!message.isUser && <MessageActions text={vietnameseContent} roomId={roomId || ""} />}
              </>
            ) : (
              <>
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                {!message.isUser && <MessageActions text={message.text} roomId={roomId || ""} />}
              </>
            )}
            {message.isUser && (
              <span className="text-xs opacity-70 mt-1 block">
                {message.timestamp.toLocaleTimeString()}
              </span>
            )}
          </div>
          
          {!message.isUser && message.relatedRooms && message.relatedRooms.length > 0 && (
            <RelatedRooms roomNames={message.relatedRooms} />
          )}
        </div>
      </div>
    );
  };

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
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <h2 className="text-lg font-semibold">{currentRoom.nameEn}</h2>
              {info && (
                <Badge variant="secondary" className="text-xs">
                  {info.tier === 'free' ? 'Free' : info.tier === 'vip1' ? 'VIP 1' : info.tier === 'vip2' ? 'VIP 2' : 'VIP 3'}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mb-1">{currentRoom.nameVi}</p>
            {username && (
              <p className="text-xs font-medium text-primary mb-1">
                👤 {username}
              </p>
            )}
            <RoomProgress totalRooms={progress.totalRooms} streak={progress.streak} />
          </div>
          
          <div className="w-24"></div>
        </div>

        {/* Main Chat Area */}
        <Card className="p-4 shadow-soft">
          <div className="space-y-3">
            <ScrollArea className="h-[380px] pr-4" ref={mainScrollRef}>
              <WelcomeBack lastRoomId={progress.lastVisit} currentRoomId={roomId || ""} />
              
              {/* Show welcome message first */}
              {mainMessages.length > 0 && mainMessages[0].id === 'welcome' && (
                <div className="mb-4">
                  <div className="bg-card border shadow-sm rounded-2xl px-4 py-3">
                    <p className="text-sm whitespace-pre-wrap">{mainMessages[0].text}</p>
                  </div>
                </div>
              )}
              
              {/* Show response messages (excluding welcome) */}
              {mainMessages.slice(1).length === 0 ? (
                <div className="flex items-center justify-center text-center py-8">
                  <div className="space-y-2">
                    <p className="text-muted-foreground">Click a keyword to start</p>
                    <p className="text-sm text-muted-foreground">Nhấp vào từ khóa để bắt đầu</p>
                  </div>
                </div>
              ) : (
                mainMessages.slice(1).map(msg => <MessageBubble key={msg.id} message={msg} />)
              )}
              <div ref={endRef} />
            </ScrollArea>
            
            {/* Audio player - always visible when audio is available */}
            {currentAudio && (
              <div className="mt-3 flex items-center gap-2 p-3 bg-muted/30 rounded-lg border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (audioRef.current) {
                      if (isAudioPlaying) {
                        audioRef.current.pause();
                      } else {
                        audioRef.current.play().catch((err) => {
                          console.error('Playback error:', err);
                          toast({
                            title: "Audio Error / Lỗi Âm Thanh",
                            description: "Cannot play audio / Không thể phát âm thanh",
                            variant: "destructive"
                          });
                        });
                      }
                    }
                  }}
                  disabled={audioLoading}
                  className="flex items-center gap-2"
                >
                  {audioLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-xs">Loading...</span>
                    </>
                  ) : isAudioPlaying ? (
                    <>
                      <span className="text-lg">⏸️</span>
                      <span className="text-xs font-medium">Pause Audio</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4" />
                      <span className="text-xs font-medium">Play Audio / Phát Âm Thanh</span>
                    </>
                  )}
                </Button>
                <audio
                  key={currentAudio}
                  ref={audioRef}
                  src={currentAudio}
                  preload="auto"
                  className="hidden"
                  onCanPlay={() => setAudioLoading(false)}
                  onEnded={() => setIsAudioPlaying(false)}
                  onPause={() => setIsAudioPlaying(false)}
                  onPlay={() => setIsAudioPlaying(true)}
                  onError={(e) => {
                    console.error('Audio error:', e);
                    setAudioLoading(false);
                    if (altAudio && audioRef.current && audioRef.current.src !== altAudio) {
                      console.log('Trying fallback audio');
                      audioRef.current.src = altAudio;
                      audioRef.current.load();
                    } else {
                      toast({
                        title: "Audio unavailable / Âm thanh không có",
                        description: "Audio file not found / Không tìm thấy file âm thanh",
                        variant: "destructive"
                      });
                    }
                  }}
                  onLoadedMetadata={() => setAudioLoading(false)}
                />
              </div>
            )}
          </div>
        </Card>

        {/* Keyword Menu Section */}
        {keywordMenu && keywordMenu.en && keywordMenu.vi && (
          <Card className="p-4 shadow-soft">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-muted-foreground">Keywords / Từ Khóa</h4>
              <div className="flex flex-wrap gap-2">
                {keywordMenu.en.map((keywordEn, idx) => {
                  const keywordVi = keywordMenu.vi[idx] || '';
                  const isClicked = clickedKeyword === keywordEn || clickedKeyword === keywordVi;
                  return (
                    <Button 
                      key={`pair-${idx}`} 
                      variant={isClicked ? "default" : "outline"}
                      size="sm"
                      className="text-xs cursor-pointer"
                      onClick={() => handleKeywordClick(keywordEn)}
                      disabled={isLoading}
                    >
                      {keywordEn} / {keywordVi}
                    </Button>
                  );
                })}
              </div>
            </div>
          </Card>
        )}

        {/* Two Chat Boxes */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Combined Feedback & Room Chat */}
          <Card className="p-4 shadow-soft">
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b">
                <MessageCircle className="w-4 h-4 text-secondary" />
                <div>
                  <h4 className="text-sm font-semibold">Feedback & Room Chat</h4>
                  <p className="text-xs text-muted-foreground">Phản Hồi & Chat Phòng</p>
                </div>
              </div>
              
              <ScrollArea className="h-24">
                {[...feedbackMessages, ...roomMessages].sort((a, b) => 
                  a.timestamp.getTime() - b.timestamp.getTime()
                ).map(msg => (
                  <div key={msg.id} className="mb-2">
                    <div className={`text-xs p-2 rounded-lg ${msg.isUser ? "bg-secondary/20" : "bg-muted"}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </ScrollArea>

              <div className="flex gap-2">
                <Input
                  placeholder="Send message / Gửi tin nhắn..."
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      sendMessage(feedbackInput, setFeedbackInput, setFeedbackMessages, "feedback");
                    }
                  }}
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
