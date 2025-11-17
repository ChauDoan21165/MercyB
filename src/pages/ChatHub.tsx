import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, ArrowLeft, MessageCircle, Mail, Users, Loader2, Volume2, RefreshCw, Bug } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { getRoomInfo } from "@/lib/roomData";
import { loadMergedRoom } from "@/lib/roomLoader";
import { useRoomProgress } from "@/hooks/useRoomProgress";
import { useBehaviorTracking } from "@/hooks/useBehaviorTracking";
import { RoomProgress } from "@/components/RoomProgress";
import { WelcomeBack } from "@/components/WelcomeBack";
import { RelatedRooms } from "@/components/RelatedRooms";
import { MessageActions } from "@/components/MessageActions";
import { MatchmakingButton } from "@/components/MatchmakingButton";
import { usePoints } from "@/hooks/usePoints";
import { DictionaryLookup } from "@/components/DictionaryLookup";
import { useUserAccess } from "@/hooks/useUserAccess";
import { useCredits } from "@/hooks/useCredits";
import { CreditLimitModal } from "@/components/CreditLimitModal";
import { CreditsDisplay } from "@/components/CreditsDisplay";
import { AudioPlayer } from "@/components/AudioPlayer";
import { HighlightedContent } from "@/components/HighlightedContent";
import { PUBLIC_ROOM_MANIFEST } from "@/lib/roomManifest";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from "@/components/ui/alert-dialog";
import { messageSchema } from "@/lib/inputValidation";
import { supabase } from "@/integrations/supabase/client";
import { roomDataMap } from "@/lib/roomDataImports";
import { getParentRoute } from "@/lib/routeHelper";
import { CareerProgressTracker } from "@/components/CareerProgressTracker";
import { AnimatedTierBadge } from "@/components/AnimatedTierBadge";
import { loadRoomKeywords } from "@/lib/roomKeywords";
import { setCustomKeywordMappings, clearCustomKeywordMappings } from "@/lib/keywordColors";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  relatedRooms?: string[];
  audioFile?: string;
}

const ChatHub = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mainMessages, setMainMessages] = useState<Message[]>([]);
  const [mainInput, setMainInput] = useState("");
  const [feedbackInput, setFeedbackInput] = useState("");
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
  const { canAccessVIP1, canAccessVIP2, canAccessVIP3, canAccessVIP4, tier, isAdmin, loading: accessLoading } = useUserAccess();
  const { creditInfo, hasCreditsRemaining, incrementUsage, refreshCredits } = useCredits();
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const [showCreditLimit, setShowCreditLimit] = useState(false);
  const contentMode = "keyword"; // Always use keyword mode
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  
  const [keywordMenu, setKeywordMenu] = useState<{ en: string[]; vi: string[] } | null>(null);
  const [clickedKeyword, setClickedKeyword] = useState<string | null>(null);
  const [mergedEntries, setMergedEntries] = useState<any[]>([]);
  const [audioBasePath, setAudioBasePath] = useState<string>('/');
  const [debugMode, setDebugMode] = useState(false);
  const [matchedEntryId, setMatchedEntryId] = useState<string | null>(null);
  const [debugSearch, setDebugSearch] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Use centralized room metadata
  const info = getRoomInfo(roomId || "");
  const currentRoom = info ? { nameVi: info.nameVi, nameEn: info.nameEn } : { nameVi: "Phòng không xác định", nameEn: "Unknown Room" };

  const handleRefreshRooms = () => {
    setIsRefreshing(true);
    toast({
      title: "Refreshing room data...",
      description: "Reloading registry and content"
    });
    
    // Dispatch event to trigger registry reload
    window.dispatchEvent(new CustomEvent('roomDataUpdated'));
    
    // Reload the page to force re-fetch
    setTimeout(() => {
      window.location.reload();
    }, 300);
  };

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
        (info.tier === 'vip3' && canAccessVIP3) ||
        (info.tier === 'vip4' && canAccessVIP4);
      if (!hasAccess) {
        setShowAccessDenied(true);
      } else {
        setShowAccessDenied(false);
      }
    }
  }, [accessLoading, info, canAccessVIP1, canAccessVIP2, canAccessVIP3, canAccessVIP4, isAdmin]);

  const handleAccessDenied = () => {
    navigate('/');
  };

  // Initialize room on load or when roomId changes
  useEffect(() => {
    const loadRoomData = async () => {
      // Reset state when switching rooms
      setMainMessages([]);
      setKeywordMenu(null);
      setCurrentAudio(null);
      setIsAudioPlaying(false);
      setMergedEntries([]);
      setMatchedEntryId(null);
      try {
        // Load merged entries from /public/tiers/{tier}/{room}/ based on room's tier metadata
        const result = await loadMergedRoom(roomId || '', info?.tier || 'free');
        setMergedEntries(result.merged);
        setAudioBasePath(result.audioBasePath || '/');
       
        if (!result.merged || result.merged.length === 0) {
          console.warn(`No merged entries for room ${roomId} tier ${tier}`);
        }
       
        // Set keyword menu from merged data
        setKeywordMenu(result.keywordMenu);
        
        // Load custom keyword colors for this room
        const customKeywords = await loadRoomKeywords(roomId || '');
        if (customKeywords.length > 0) {
          setCustomKeywordMappings(customKeywords);
          console.log(`Loaded ${customKeywords.length} custom keyword color mappings for ${roomId}`);
        } else {
          clearCustomKeywordMappings();
        }
        
        // Don't add welcome message to chat - it's displayed in the card above
        setMainMessages([]);
      } catch (error) {
        console.error('Failed to load room data', error);
        setMainMessages([]);
      }
    };
   
    loadRoomData();
  }, [roomId]);

  const handleKeywordClick = async (keyword: string) => {
    if (isLoading) return;
    setClickedKeyword(keyword);
    await sendEntryForKeyword(keyword);
  };

  // Helpers for direct keyword→entry mapping
  const norm = (s: any) =>
    String(s ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[\s\-_]+/g, ' ')
      .replace(/[^\w\s]/g, '')
      .trim();
  const extractBilingual = (entry: any) => {
    const read = (obj: any, path: string[]) => path.reduce((acc, k) => (acc ? acc[k] : undefined), obj);
    const candidates: Array<[string[], string[]]> = [
      [["essay_en"],["essay_vi"]],
      [["essay","en"],["essay","vi"]],
      [["content_en"],["content_vi"]],
      [["content","en"],["content","vi"]],
      [["body_en"],["body_vi"]],
      [["body","en"],["body","vi"]],
      [["copy_en"],["copy_vi"]],
      [["copy","en"],["copy","vi"]],
      [["description","en"],["description","vi"]],
    ];
    for (const [enP, viP] of candidates) {
      const en = String(read(entry, enP) || '').trim();
      const vi = String(read(entry, viP) || '').trim();
      if (en || vi) return { en, vi };
    }
    const en = String(entry?.content || entry?.essay || '').trim();
    return { en, vi: String(entry?.content_vi || entry?.essay_vi || '').trim() };
  };

  // Find merged entry by keyword_en match (no fallback to first entry)
  const resolveEntryByKeyword = (keyword: string) => {
    const k = norm(keyword);
    if (!mergedEntries || mergedEntries.length === 0) return null;

    const by = (s: any) => norm(String(s || ''));

    // 0) Exact match on slug
    let entry = mergedEntries.find(e => by(e.slug) === k);
    if (entry) {
      setMatchedEntryId(entry.slug || entry.keywordEn);
      return entry;
    }

    // 1) Exact match on keywordEn (first keyword in entry)
    entry = mergedEntries.find((e: any) => by(e.keywordEn) === k);
    if (entry) {
      setMatchedEntryId(entry.slug || entry.keywordEn);
      return entry;
    }

    // 2) Match against ALL keywords in the entry's keywords_en array
    entry = mergedEntries.find(e => {
      const keywords = Array.isArray(e.keywords_en) ? e.keywords_en : [];
      return keywords.some(kw => by(kw) === k);
    });
    if (entry) {
      setMatchedEntryId(entry.slug || entry.keywordEn);
      return entry;
    }

    // 3) Contains either direction on keywordEn
    entry = mergedEntries.find(e => by(e.keywordEn).includes(k) || k.includes(by(e.keywordEn)));
    if (entry) {
      setMatchedEntryId(entry.slug || entry.keywordEn);
      return entry;
    }

    // 4) Contains match in any keyword
    entry = mergedEntries.find(e => {
      const keywords = Array.isArray(e.keywords_en) ? e.keywords_en : [];
      return keywords.some(kw => {
        const normalized = by(kw);
        return normalized.includes(k) || k.includes(normalized);
      });
    });
    if (entry) {
      setMatchedEntryId(entry.slug || entry.keywordEn);
      return entry;
    }

    // 5) Match by slug/title
    entry = mergedEntries.find(e => {
      const slug = by(e.slug);
      const title = typeof e.title === 'object' ? by(e.title?.en) : by(e.title);
      return slug.includes(k) || k.includes(slug) || title.includes(k) || k.includes(title);
    });
    if (entry) {
      setMatchedEntryId(entry.slug || entry.keywordEn);
      return entry;
    }

    // 6) Token-overlap fallback
    const tokens = k.split(/\s+/).filter(Boolean);
    entry = mergedEntries.find(e => {
      const target = [by(e.keywordEn), by(typeof e.title === 'object' ? e.title?.en : e.title), by(e.slug)].join(' ');
      return tokens.every(t => target.includes(t));
    });
    if (entry) {
      setMatchedEntryId(entry.slug || entry.keywordEn);
    }
    return entry || null;
  };

  const sendEntryForKeyword = async (keyword: string) => {
    const typingMessageId = (Date.now() + 1).toString();
    const typingMessage: Message = { id: typingMessageId, text: '...', isUser: false, timestamp: new Date() };
    
    // Replace the last bot message instead of appending (keep only welcome + latest essay)
    setMainMessages(prev => {
      const filtered = prev.filter(m => m.isUser || m.id === 'welcome');
      return [...filtered, typingMessage];
    });
    
    try {
      console.log('=== BEFORE RESOLVE DEBUG ===');
      console.log('Keyword to search:', keyword);
      console.log('mergedEntries array:', mergedEntries);
      console.log('mergedEntries length:', mergedEntries.length);
      if (mergedEntries.length > 0) {
        console.log('First entry structure:', mergedEntries[0]);
        console.log('First entry keywordEn:', mergedEntries[0].keywordEn);
        console.log('First entry keywords_en:', mergedEntries[0].keywords_en);
      }
      console.log('=========================');
      
      const entry = resolveEntryByKeyword(keyword);
      console.log('=== KEYWORD MATCH DEBUG ===');
      console.log('Keyword searched:', keyword);
      console.log('All entries in mergedEntries:', mergedEntries.length);
      console.log('Entry found:', entry);
      console.log('Entry slug:', entry?.slug);
      console.log('Entry keywords_en:', entry?.keywords_en);
      console.log('Entry audio field:', entry?.audio);
      console.log('Entry copy.en:', entry?.copy?.en ? 'exists' : 'missing');
      console.log('Entry replyEn:', entry?.replyEn ? 'exists' : 'missing');
      console.log('Entry essay_en:', entry?.essay_en ? 'exists' : 'missing');
      console.log('=========================');
      
      if (!entry) throw new Error('No entry matched');
     
      // Build message: English Essay + Audio + Vietnamese Essay (if exists)
      const en = String(entry.essay_en || entry.replyEn || entry.copy?.en || '');
      const vi = String(entry.essay_vi || entry.replyVi || entry.copy?.vi || '');
      const text = vi ? `${en}\n\n---\n\n${vi}` : en;
      // Automatically add /audio/ prefix if not already present
      const audioFile = entry.audio 
        ? (entry.audio.startsWith('/audio/') ? entry.audio : `/audio/${entry.audio.replace(/^\//, '')}`)
        : undefined;
      
      console.log('=== MESSAGE BUILD DEBUG ===');
      console.log('English text length:', en.length);
      console.log('Vietnamese text length:', vi.length);
      console.log('Final audioFile:', audioFile);
      console.log('=========================');
      
      setMainMessages(prev => prev.map(m => m.id === typingMessageId ? { ...m, text, audioFile } : m));
      trackKeyword(keyword);
    } catch (err) {
      console.error('Keyword mapping failed', err);
      setMainMessages(prev => prev.filter(m => m.id !== typingMessageId));
      toast({ title: 'Error', description: 'Could not load entry for keyword', variant: 'destructive' });
    }
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
    // For typed input, respond by mapping to the matching keyword entry
    try {
      await sendEntryForKeyword(currentInput);
    } catch (e) {
      console.error('Error generating response:', e);
      toast({ title: 'Error', description: 'Could not generate response', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (
    input: string,
    setInput: (val: string) => void,
    callback: () => void,
    chatType: string
  ) => {
    if (!input.trim()) return;
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
        callback();
      }
    }
  };

  // Stable scroll: only scroll when new messages are added (not replacements)
  const prevMessageCountRef = useRef(mainMessages.length);
  useEffect(() => {
    // Only scroll if message count increased (new message) not when messages are replaced
    if (mainMessages.length > prevMessageCountRef.current) {
      const timer = setTimeout(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 100);
      prevMessageCountRef.current = mainMessages.length;
      return () => clearTimeout(timer);
    }
  }, [mainMessages]);

  const MessageBubble = ({ message }: { message: Message }) => {
    const [showVietnamese, setShowVietnamese] = useState(true);
    
    // Split content to display English and Vietnamese separately
    const parts = message.text.split(/\n+---\n+/);
    const englishContent = parts[0]?.trim() || message.text;
    const vietnameseContent = parts[1]?.trim() || '';

    // Compute audio URL if available (normalized to /audio/...)
    const audioUrl = message.audioFile 
      ? (() => {
          let p = String(message.audioFile).replace(/^\/+/, '').replace(/^public\//, '');
          p = p.replace(/^audio\/(en|vi)\//, 'audio/');
          if (!p.startsWith('audio/')) p = `audio/${p}`;
          return `/${p}`;
        })()
      : null;

    const handleAudioClick = () => {
      if (!message.audioFile) {
        toast({
          title: "Audio unavailable / Âm thanh không có",
          description: "No audio file specified / Không có file âm thanh",
          variant: "destructive"
        });
        return;
      }

      // Normalize path
      let p = String(message.audioFile).replace(/^\/+/, '').replace(/^public\//, '');
      p = p.replace(/^audio\/(en|vi)\//, 'audio/');
      if (!p.startsWith('audio/')) p = `audio/${p}`;
      const url = `/${p}`;

      // Toggle or switch track; Audio element is managed inside AudioPlayer
      if (currentAudio === url) {
        setIsAudioPlaying(!isAudioPlaying);
      } else {
        setCurrentAudio(url);
        setIsAudioPlaying(true);
      }
    };

    return (
      <div className={`flex ${message.isUser ? "justify-end" : "justify-start"} mb-4`}>
        <div className="w-full group">
          <div
            className={`rounded-2xl px-6 py-4 ${
              message.isUser
                ? "bg-gradient-to-br from-primary to-primary-glow text-primary-foreground"
                : "bg-card border shadow-sm"
            }`}
          >
            {!message.isUser && vietnameseContent ? (
              <>
                <HighlightedContent 
                  content={englishContent}
                  className="w-full"
                  showShadowingReminder={!!(message.audioFile && audioUrl)}
                />
                
                {/* Copy button and Audio Player - After English essay */}
                <div className="mt-3 flex items-center gap-2">
                  <MessageActions text={englishContent} roomId={roomId || ""} />
                  {(message.audioFile && audioUrl) && (
                    <AudioPlayer
                      audioPath={audioUrl}
                      isPlaying={currentAudio === audioUrl && isAudioPlaying}
                      onPlayPause={handleAudioClick}
                      onEnded={() => {
                        setIsAudioPlaying(false);
                        setCurrentAudio(null);
                      }}
                    />
                  )}
                </div>
                
                {showVietnamese && (
                  <>
                    <hr className="border-border my-4" />
                    <HighlightedContent 
                      content={vietnameseContent}
                      className="w-full"
                    />
                  </>
                )}
              </>
            ) : (
              <>
                <HighlightedContent 
                  content={message.text}
                  className="w-full"
                  showShadowingReminder={!!(message.audioFile && audioUrl)}
                />
                
                {/* Copy and Audio Player */}
                {!message.isUser && message.audioFile && audioUrl && (
                  <div className="mt-4 mb-3 flex items-center gap-2">
                    <MessageActions text={message.text} roomId={roomId || ""} />
                    <AudioPlayer
                      audioPath={audioUrl}
                      isPlaying={currentAudio === audioUrl && isAudioPlaying}
                      onPlayPause={handleAudioClick}
                      onEnded={() => {
                        setIsAudioPlaying(false);
                        setCurrentAudio(null);
                      }}
                    />
                  </div>
                )}
                
                {!message.isUser && !message.audioFile && <MessageActions text={message.text} roomId={roomId || ""} />}
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
    if (!roomInfo) return 'hsl(var(--page-free))';
    switch (roomInfo.tier) {
      case 'free': return 'hsl(var(--page-free))';
      case 'vip1': return 'hsl(var(--page-vip1))';
      case 'vip2': return 'hsl(var(--page-vip2))';
      case 'vip3': return 'hsl(var(--page-vip3))';
      case 'vip4': return 'hsl(var(--page-vip4))';
      default: return 'hsl(var(--page-free))';
    }
  };

  return (
    <>
      {!isAdmin && (
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
      )}
      <div className="min-h-screen p-4" style={{ background: getBgColor() }}>
        <div className="max-w-7xl mx-auto space-y-4">
        
        {/* Debug Mode Toggle - Admin Only */}
        {isAdmin && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDebugMode(!debugMode)}
            className="fixed bottom-4 left-4 z-50 gap-2 shadow-lg"
          >
            <Bug className="h-4 w-4" />
            {debugMode ? 'Hide Debug' : 'Show Debug'}
          </Button>
        )}

        {/* Debug Panel */}
        {isAdmin && debugMode && mergedEntries.length > 0 && (
          <div className="fixed top-16 right-4 z-50 w-96 max-h-[80vh] bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg">
            <div className="p-4 border-b border-border">
              <h3 className="text-sm font-semibold mb-3 text-foreground">Keyword Mappings ({mergedEntries.length} entries)</h3>
              <Input
                placeholder="Search keywords or entries..."
                value={debugSearch}
                onChange={(e) => setDebugSearch(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div className="overflow-y-auto max-h-[calc(80vh-120px)] p-4 space-y-2">
              {mergedEntries
                .filter(entry => {
                  if (!debugSearch.trim()) return true;
                  const search = debugSearch.toLowerCase();
                  const slug = (entry.slug || entry.keywordEn || '').toLowerCase();
                  const keywords = Array.isArray(entry.keywords_en) ? entry.keywords_en : [entry.keywordEn];
                  const keywordsMatch = keywords.some((kw: string) => kw.toLowerCase().includes(search));
                  const audioMatch = entry.audioPath?.toLowerCase().includes(search);
                  return slug.includes(search) || keywordsMatch || audioMatch;
                })
                .map((entry, idx) => {
                  const isMatched = matchedEntryId === (entry.slug || entry.keywordEn);
                  const keywords = Array.isArray(entry.keywords_en) ? entry.keywords_en : [entry.keywordEn];
                  return (
                    <div 
                      key={idx} 
                      className={`p-2 rounded text-xs border ${isMatched ? 'bg-primary/20 border-primary' : 'bg-muted/50 border-border'}`}
                    >
                      <div className="font-medium text-foreground mb-1">
                        {entry.slug || entry.keywordEn || `Entry ${idx + 1}`}
                      </div>
                      <div className="text-muted-foreground">
                        Keywords: {keywords.join(', ')}
                      </div>
                      {entry.audioPath && (
                        <div className="text-muted-foreground mt-1">
                          Audio: {entry.audioPath.split('/').pop()}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        )}
        
        {/* Header */}
        <div className="flex items-center justify-between bg-card rounded-lg p-4 shadow-soft">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => navigate(getParentRoute(roomId))}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back / Quay Lại
            </Button>
          </div>
         
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center gap-2">
              {isAdmin && roomId && (
                <button
                  type="button"
                  onClick={() => {
                    const key = roomId && (/(?:-(free|vip1|vip2|vip3|vip4))$/.test(roomId) ? roomId : (info?.tier ? `${roomId}-${info.tier}` : roomId));
                    const manifestVal = key ? PUBLIC_ROOM_MANIFEST[key] : undefined;
                    const fileName = manifestVal ? manifestVal.replace(/^data\//, '') : `${roomId.replace(/-/g, '_')}.json`;
                    navigator.clipboard.writeText(fileName);
                    toast({
                      title: "Copied!",
                      description: `JSON: ${fileName}`,
                    });
                  }}
                  className="w-[1em] h-[1em] rounded-full bg-primary hover:bg-primary/90 cursor-pointer flex-shrink-0 transition-colors"
                  title="Copy JSON filename"
                />
              )}
              <h2 className="text-lg font-semibold" style={{
                background: 'var(--gradient-rainbow)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                {currentRoom.nameEn === currentRoom.nameVi 
                  ? currentRoom.nameEn 
                  : `${currentRoom.nameEn} / ${currentRoom.nameVi}`}
              </h2>
              {info && (
                <Badge variant="secondary" className="text-xs">
                  {info.tier === 'free' ? 'Free' : info.tier === 'vip1' ? 'VIP 1' : info.tier === 'vip2' ? 'VIP 2' : info.tier === 'vip3' ? 'VIP 3' : 'VIP 4'}
                </Badge>
              )}
            </div>
            <div className="flex items-center justify-center gap-1 text-xs font-medium text-primary">
              {username && (
                <div className="flex items-center gap-2">
                  <span>👤 {username}</span>
                  <AnimatedTierBadge tier={tier} size="sm" />
                </div>
              )}
              <span>You have explored {progress.totalRooms} {progress.totalRooms === 1 ? 'topic' : 'topics'}, {progress.streak} day streak! 🔥</span>
            </div>
          </div>
         
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshRooms}
                disabled={isRefreshing}
                className="gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh Rooms</span>
              </Button>
            )}
          </div>
        </div>
        
        {/* Welcome Message and Keywords Combined */}
        <Card className="p-4 shadow-soft bg-card border border-border">
          <div className="text-center space-y-0 mb-4">
            {keywordMenu && keywordMenu.en && keywordMenu.en.length > 0 ? (
              <p className="text-sm text-foreground leading-tight">
                Welcome to {currentRoom.nameEn} Room, please click the keyword of the topic you want to discover / Chào mừng bạn đến với phòng {currentRoom.nameVi}, vui lòng nhấp vào từ khóa của chủ đề bạn muốn khám phá
              </p>
            ) : (
              <p className="text-sm text-foreground leading-tight">
                Welcome to {currentRoom.nameEn} Room / Chào mừng bạn đến với phòng {currentRoom.nameVi}
              </p>
            )}
          </div>

          {/* Dictionary Lookup */}
          <DictionaryLookup />
          
          {keywordMenu && keywordMenu.en && keywordMenu.vi && keywordMenu.en.length > 0 && (
            <div>
              <div className="flex flex-wrap gap-2 justify-center">
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
                      {isAdmin && (
                        <span
                          role="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const entry = resolveEntryByKeyword(keywordEn);
                            const audioFile = entry?.audio;
                            if (!audioFile) {
                              toast({ title: "No audio", description: "This entry has no audio filename" });
                              return;
                            }
                            // Automatically add /audio/ prefix if not already present
                            const out = audioFile.startsWith('/audio/') 
                              ? audioFile 
                              : `/audio/${audioFile.replace(/^\//, '')}`;
                            navigator.clipboard.writeText(out);
                            toast({ title: "Copied!", description: `Audio: ${out}` });
                          }}
                          className="inline-flex w-[1em] h-[1em] rounded-full bg-destructive hover:bg-destructive/90 mr-2 align-middle cursor-pointer"
                          title="Copy audio filename"
                        />
                      )}
                      {keywordEn} / {keywordVi}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}
        </Card>
        
        {/* Main Chat Area */}
        <Card className="p-4 shadow-soft bg-card border border-border">
          <div className="space-y-3">
            <ScrollArea className="h-[560px] pr-4" ref={mainScrollRef}>
              <WelcomeBack lastRoomId={progress.lastVisit} currentRoomId={roomId || ""} />
             
              {/* Show response messages */}
              {mainMessages.length === 0 ? (
                <div className="flex items-center justify-center text-center py-8">
                  <div className="space-y-2">
                    <p className="text-muted-foreground">Click a keyword to start</p>
                    <p className="text-sm text-muted-foreground">Nhấp vào từ khóa để bắt đầu</p>
                  </div>
                </div>
              ) : (
                mainMessages.map(msg => <MessageBubble key={msg.id} message={msg} />)
              )}
              <div ref={endRef} />
            </ScrollArea>
          </div>
        </Card>
        {/* Feedback - Single Line at Bottom */}
        <Card className="p-3 shadow-soft">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-secondary flex-shrink-0" />
            <Input
              placeholder="Feedback / Phản Hồi..."
              value={feedbackInput}
              onChange={(e) => setFeedbackInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  sendMessage(feedbackInput, setFeedbackInput, () => {
                    toast({
                      title: "Thank you! / Cảm ơn!",
                      description: "Your feedback has been submitted / Phản hồi của bạn đã được gửi"
                    });
                  }, "feedback");
                }
              }}
              className="text-sm flex-1"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => sendMessage(feedbackInput, setFeedbackInput, () => {
                toast({
                  title: "Thank you! / Cảm ơn!",
                  description: "Your feedback has been submitted / Phản hồi của bạn đã được gửi"
                });
              }, "feedback")}
            >
              <Send className="w-3 h-3" />
            </Button>
          </div>
        </Card>
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
