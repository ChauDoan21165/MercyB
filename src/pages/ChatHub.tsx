import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GlobalAppBar } from "@/components/GlobalAppBar";
import { RoomHeaderStandard } from "@/components/RoomHeaderStandard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, MessageCircle, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { getRoomInfo } from "@/lib/roomData";
import { loadMergedRoom } from "@/lib/roomLoader";
import { ROOMS_TABLE } from "@/lib/constants/rooms";
import { useRoomProgress } from "@/hooks/useRoomProgress";
import { useBehaviorTracking } from "@/hooks/useBehaviorTracking";
import { WelcomeBack } from "@/components/WelcomeBack";
import { RelatedRooms } from "@/components/RelatedRooms";
import { MessageActions } from "@/components/MessageActions";
import { usePoints } from "@/hooks/usePoints";
import { RoomErrorState } from "@/components/RoomErrorState";
import { useUiHealthReporter } from "@/hooks/useUiHealthReporter";
import { RoomLoadShell } from "@/components/RoomLoadShell";
import { RoomLayout } from "@/components/room/RoomLayout";
import { useUserAccess } from "@/hooks/useUserAccess";
import { useCredits } from "@/hooks/useCredits";
import { CreditLimitModal } from "@/components/CreditLimitModal";
import { AudioPlayer } from "@/components/AudioPlayer";
import { HighlightedContent } from "@/components/HighlightedContent";
import { KeywordAudioCopyDot } from "@/components/admin/KeywordAudioCopyDot";
import { AdminRoomTools } from "@/components/admin/AdminCopyTools";
import { PairedHighlightedContent } from "@/components/PairedHighlightedContent";
import { PUBLIC_ROOM_MANIFEST } from "@/lib/roomManifest";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from "@/components/ui/alert-dialog";
import { messageSchema } from "@/lib/inputValidation";
import { supabase } from "@/integrations/supabase/client";
import { roomDataMap } from "@/lib/roomDataImports";
import { setCustomKeywordMappings, clearCustomKeywordMappings, loadRoomKeywords } from "@/lib/customKeywordLoader";
import { buildAudioSrc } from "@/lib/audioHelpers";
import { ProfileAvatarUpload } from "@/components/ProfileAvatarUpload";
import { getTierRoute } from "@/lib/tierRoutes";
import { useFavoriteRooms } from "@/hooks/useFavoriteRooms";
import { useRecentRooms } from "@/hooks/useRecentRooms";
import { useRoomAudioPreload } from "@/hooks/useRoomAudioPreload";
import { Heart, Star, History, Clock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  relatedRooms?: string[];
  audioFile?: string;
  audioPlaylist?: string[];
}

type RoomErrorKind = "auth" | "access" | "not_found" | "unknown";

const ChatHub = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mainMessages, setMainMessages] = useState<Message[]>([]);
  const [mainInput, setMainInput] = useState("");
  const [feedbackInput, setFeedbackInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [roomLoading, setRoomLoading] = useState(true);
  const [roomError, setRoomError] = useState<{ kind: RoomErrorKind; message?: string } | null>(null);
  const [username, setUsername] = useState<string>("");
  const [noKeywordCount, setNoKeywordCount] = useState(0);
  const [matchedEntryCount, setMatchedEntryCount] = useState(0);
  const [userMessageCount, setUserMessageCount] = useState(0);
  const mainScrollRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const audioPlayerRef = useRef<HTMLDivElement>(null);
  const mainInputRef = useRef<HTMLInputElement>(null);
  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };
  const scrollToAudioPlayer = () => {
    audioPlayerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
  const progress = useRoomProgress(roomId);
  const { trackMessage, trackKeyword, trackCompletion } = useBehaviorTracking(roomId || "");
  const { awardPoints } = usePoints();
  const {
    tier,
    isAdmin,
    isAuthenticated,
    isLoading: accessLoading,
    canAccessTier,
  } = useUserAccess();
  const { creditInfo, hasCreditsRemaining, incrementUsage, refreshCredits } = useCredits();
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const [showCreditLimit, setShowCreditLimit] = useState(false);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const contentMode = "keyword"; // Always use keyword mode
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  
  const [keywordMenu, setKeywordMenu] = useState<{ en: string[]; vi: string[] } | null>(null);
  const [clickedKeyword, setClickedKeyword] = useState<string | null>(null);
  const [roomEssay, setRoomEssay] = useState<{ en: string; vi: string } | null>(null);
  const [mergedEntries, setMergedEntries] = useState<any[]>([]);
  const [audioBasePath, setAudioBasePath] = useState<string>('/');
  const [matchedEntryId, setMatchedEntryId] = useState<string | null>(null);
  const { favoriteRooms, isFavorite: isRoomFavorite, toggleFavorite: toggleRoomFavorite } = useFavoriteRooms();
  const { recentRooms, addRecentRoom, clearRecentRooms } = useRecentRooms();
  const [favoriteSearch, setFavoriteSearch] = useState("");
  const [recentSearch, setRecentSearch] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [roomNameOverride, setRoomNameOverride] = useState<{ nameEn: string; nameVi: string } | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Preload audio files for current room
  const audioFilesToPreload = mergedEntries
    .map(entry => entry.audio || entry.audioFile)
    .filter((audio): audio is string => Boolean(audio));
  
  useRoomAudioPreload(audioBasePath, audioFilesToPreload);

  // Use centralized room metadata
  const info = getRoomInfo(roomId || "");
  const currentRoom = roomNameOverride
    ? { nameVi: roomNameOverride.nameVi, nameEn: roomNameOverride.nameEn }
    : info
      ? { nameVi: info.nameVi, nameEn: info.nameEn }
      : { nameVi: "Phòng không xác định", nameEn: "Unknown Room" };

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

  // Fallback: load room titles from database when manifest metadata is missing
  useEffect(() => {
    if (!roomId) return;

    // If manifest has info, prefer that and clear any override
    if (info) {
      setRoomNameOverride(null);
      return;
    }

    const loadRoomTitle = async () => {
      const { data, error } = await supabase
        .from(ROOMS_TABLE)
        .select('title_en, title_vi')
        .eq('id', roomId)
        .maybeSingle();

      if (data && !error) {
        setRoomNameOverride({
          nameEn: data.title_en || "Unknown Room",
          nameVi: data.title_vi || "Phòng không xác định",
        });
      }
    };

    loadRoomTitle();
  }, [roomId, info]);
  // Fetch username and avatar
  useEffect(() => {
    const fetchUsername = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("username, email, avatar_url")
          .eq("id", user.id)
          .single();
       
        setUsername(profile?.username || user.email?.split('@')[0] || "User");
        setAvatarUrl(profile?.avatar_url || null);
      }
    };
    fetchUsername();
  }, []);

  // Check access - Free rooms require registration, VIP rooms require subscription
  useEffect(() => {
    if (accessLoading) {
      // Don't show access denied while still loading
      return;
    }
    
    if (!info) {
      return;
    }

    // Unauthenticated users can't access any rooms
    if (!isAuthenticated) {
      setShowAccessDenied(true);
      return;
    }
    
    // Authenticated users: check tier access using unified helper
    const roomTierId = info.tier === 'vip3_ii' ? 'vip3ii' : info.tier || 'free';
    const hasAccess = canAccessTier(roomTierId);
    
    setShowAccessDenied(!hasAccess);
  }, [
    accessLoading,
    info,
    isAuthenticated,
    canAccessTier,
  ]);

  const handleAccessDenied = () => {
    navigate('/');
  };

  // Initialize room on load or when roomId changes
  useEffect(() => {
    const loadRoomData = async () => {
      setRoomLoading(true);
      setRoomError(null);
      
      // Reset state when switching rooms
      setMainMessages([]);
      setKeywordMenu(null);
      setRoomEssay(null);
      setCurrentAudio(null);
      setIsAudioPlaying(false);
      setMergedEntries([]);
      setMatchedEntryId(null);
      
      // Track this room visit
      if (roomId && info) {
        addRecentRoom({
          id: roomId,
          nameEn: currentRoom.nameEn,
          nameVi: currentRoom.nameVi,
          tier: info.tier || 'free'
        });
      }
      
      try {
        // Load merged entries - uses authenticated tier internally
        const result = await loadMergedRoom(roomId || '');
        setMergedEntries(result.merged);
        setAudioBasePath(result.audioBasePath || '/');
       
        if (!result.merged || result.merged.length === 0) {
          console.warn(`No merged entries for room ${roomId} tier ${tier}`);
        }
       
        // Set keyword menu from merged data
        setKeywordMenu(result.keywordMenu);
        
        // Load room essay from database
        const { data: dbRoom } = await supabase
          .from(ROOMS_TABLE)
          .select('room_essay_en, room_essay_vi')
          .eq('id', roomId)
          .maybeSingle();
        
        if (dbRoom?.room_essay_en || dbRoom?.room_essay_vi) {
          setRoomEssay({
            en: dbRoom.room_essay_en || '',
            vi: dbRoom.room_essay_vi || ''
          });
        }
        
        // Load custom keyword colors for this room (only for JSON-based rooms)
        // Database rooms use standard semantic colors
        clearCustomKeywordMappings();
        
        // Don't add welcome message to chat - it's displayed in the card above
        setMainMessages([]);
        setRoomLoading(false);
      } catch (error: any) {
        console.error('Failed to load room data', error);
        
        // Map error to unified error kind
        const errorMessage = String(error?.message || error);
        let errorKind: RoomErrorKind = "unknown";
        let errorText: string | undefined;
        
        if (errorMessage.includes("AUTHENTICATION_REQUIRED")) {
          errorKind = "auth";
        } else if (errorMessage.includes("ACCESS_DENIED_INSUFFICIENT_TIER")) {
          errorKind = "access";
        } else if (errorMessage.includes("ROOM_NOT_FOUND") || error?.name === "RoomJsonNotFoundError") {
          errorKind = "not_found";
          errorText = roomId ? `Room ID: ${roomId}` : undefined;
        } else {
          errorKind = "unknown";
          errorText = "Failed to load room. This room may not exist or you may not have access.";
        }
        
        setRoomError({ kind: errorKind, message: errorText });
        setMainMessages([]);
        setRoomLoading(false);
      }
    };
   
    loadRoomData();
  }, [roomId]);

  // Scroll to top and focus input when room loads
  useEffect(() => {
    if (!roomLoading && !roomError && mainScrollRef.current) {
      // Scroll chat container to top smoothly
      mainScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Focus input after a brief delay
      setTimeout(() => {
        mainInputRef.current?.focus();
      }, 300);
    }
  }, [roomLoading, roomError, roomId]);

  const handleKeywordClick = async (keyword: string) => {
    if (!isAuthenticated) {
      setShowSignupPrompt(true);
      return;
    }
    if (isLoading) return;
    setClickedKeyword(keyword);
    await sendEntryForKeyword(keyword);
    // Scroll to audio player after message is added
    setTimeout(() => {
      scrollToAudioPlayer();
    }, 200);
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

    // "all" is now treated like any other keyword; rely on room data entry for content
    // (no special synthetic combination here)

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
      
      // Use audioFile and audioPlaylist from entry (already processed by roomLoader)
      const audioFile = entry.audio;
      const audioPlaylist = entry.audioPlaylist || (audioFile ? [audioFile] : []);
      
      console.log('=== MESSAGE BUILD DEBUG ===');
      console.log('English text length:', en.length);
      console.log('Vietnamese text length:', vi.length);
      console.log('Final audioFile:', audioFile);
      console.log('Audio playlist:', audioPlaylist);
      console.log('=========================');
      
      setMainMessages(prev => prev.map(m => m.id === typingMessageId ? { ...m, text, audioFile, audioPlaylist } : m));
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
    
    // Check authentication first
    if (!isAuthenticated) {
      setShowSignupPrompt(true);
      return;
    }
    
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
        const { error } = await supabase.from('feedback').insert({
          user_id: user.id,
          message: input,
          status: 'new',
          priority: 'normal'
        });
        
        if (error) {
          console.error('Feedback submission error:', error);
          toast({
            title: "Error / Lỗi",
            description: "Failed to submit feedback / Không thể gửi phản hồi",
            variant: "destructive"
          });
        } else {
          callback();
        }
      }
      return; // Stop execution after feedback submission
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

    // Compute audio URL if available - use canonical buildAudioSrc helper
    const audioUrl = message.audioFile ? buildAudioSrc(message.audioFile) : null;

    const handleAudioClick = () => {
      if (!message.audioFile) {
        toast({
          title: "Audio unavailable / Âm thanh không có",
          description: "No audio file specified / Không có file âm thanh",
          variant: "destructive"
        });
        return;
      }

      // Normalize path using canonical helper
      const url = buildAudioSrc(message.audioFile);
      if (!url) return;

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
                {/* English content */}
                <div className="mb-3">
                  <div className="text-sm leading-relaxed">
                    <HighlightedContent content={englishContent} />
                  </div>
                </div>
                
                {/* Shadowing reminder and Audio Player - Right below English essay */}
                {(message.audioFile && audioUrl) && (
                  <div className="my-3" ref={audioPlayerRef}>
                    <p className="text-xs text-muted-foreground italic mb-2 text-center">
                      💡 Try shadowing: Listen and repeat along with the audio to improve your pronunciation and fluency. / 💡 Hãy thử bóng: Nghe và lặp lại cùng với âm thanh để cải thiện phát âm và sự trôi chảy của bạn.
                    </p>
                    <div className="flex items-center gap-2">
                      <AudioPlayer
                        audioPath={audioUrl}
                        isPlaying={currentAudio === audioUrl && isAudioPlaying}
                        onPlayPause={handleAudioClick}
                        onEnded={() => {
                          setIsAudioPlaying(false);
                          setCurrentAudio(null);
                        }}
                        playlist={message.audioPlaylist}
                      />
                    </div>
                  </div>
                )}

                {/* Vietnamese content */}
                <div className="mt-3 pt-3 border-t border-border/40">
                  <div className="text-sm leading-relaxed">
                    <HighlightedContent content={vietnameseContent} />
                  </div>
                  <div className="mt-3">
                    <MessageActions 
                      text={englishContent} 
                      viText={vietnameseContent} 
                      roomId={roomId || ""} 
                    />
                  </div>
                </div>
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
                  <div className="mt-4 mb-3 flex items-center gap-2" ref={audioPlayerRef}>
                    <MessageActions text={message.text} roomId={roomId || ""} />
                    <AudioPlayer
                      audioPath={audioUrl}
                      isPlaying={currentAudio === audioUrl && isAudioPlaying}
                      onPlayPause={handleAudioClick}
                      onEnded={() => {
                        setIsAudioPlaying(false);
                        setCurrentAudio(null);
                      }}
                      playlist={message.audioPlaylist}
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

  // UI health reporter
  useUiHealthReporter({
    roomId: roomId || undefined,
    path: location.pathname,
  });

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

  // Build breadcrumbs for GlobalAppBar
  const breadcrumbItems = [
    ...(info?.tier ? [{
      label: getTierRoute(info.tier)?.name || info.tier.toUpperCase(),
      href: getTierRoute(info.tier)?.path
    }] : []),
    { label: currentRoom.nameEn }
  ];

  return (
    <>
      <GlobalAppBar breadcrumbs={breadcrumbItems} />
      {!isAdmin && (
        <AlertDialog open={showAccessDenied} onOpenChange={setShowAccessDenied}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {!isAuthenticated 
                  ? "Sign Up Required / Yêu Cầu Đăng Ký" 
                  : "VIP Only / Chỉ Dành Cho VIP"}
              </AlertDialogTitle>
              <AlertDialogDescription className="space-y-2">
                {!isAuthenticated ? (
                  <>
                    <p>Please create a free account to access this room.</p>
                    <p className="text-sm">Vui lòng tạo tài khoản miễn phí để truy cập phòng này.</p>
                    <p className="font-semibold mt-4">Room tier: {info?.tier?.toUpperCase()}</p>
                  </>
                ) : (
                  <>
                    <p>This room is for VIP members only. Please upgrade your subscription to access this content.</p>
                    <p className="text-sm">Phòng này chỉ dành cho thành viên VIP. Vui lòng nâng cấp gói đăng ký để truy cập nội dung này.</p>
                    <p className="font-semibold mt-4">Required tier: {info?.tier?.toUpperCase()}</p>
                    <p className="text-sm">Your tier: {tier?.toUpperCase()}</p>
                  </>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
              <Button onClick={handleAccessDenied} variant="outline" className="w-full sm:w-auto">
                Go Back / Quay Lại
              </Button>
              {!isAuthenticated ? (
                <Button onClick={() => navigate('/auth')} className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
                  Sign Up Free / Đăng ký miễn phí
                </Button>
              ) : (
                <Button onClick={() => navigate('/')} className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
                  View Plans / Xem Gói
                </Button>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      <RoomLayout bgColor={getBgColor()}>
        <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Admin Copy Tools - Only visible to admins */}
        {isAdmin && roomId && (
          <AdminRoomTools
            roomId={roomId}
            audioFilename={mergedEntries[0]?.audio || ''}
            essayEn={roomEssay?.en}
            essayVi={roomEssay?.vi}
          />
        )}
        
        {/* Room Header Standard - Clean, single H1 + meta row */}
        <RoomHeaderStandard
          titleEn={currentRoom.nameEn}
          titleVi={currentRoom.nameVi}
          tier={info?.tier || 'free'}
          isFavorite={isRoomFavorite(roomId || '')}
          onFavoriteToggle={() => toggleRoomFavorite({
            id: roomId || '',
            nameEn: currentRoom.nameEn,
            nameVi: currentRoom.nameVi,
            tier: info?.tier || 'free'
          })}
          onRefresh={handleRefreshRooms}
          isRefreshing={isRefreshing}
        />
        
        {/* Main Room Content - Loading and Error States */}
        {roomLoading && !roomError ? (
          <RoomLoadShell isLoading={true} error={null}>
            <></>
          </RoomLoadShell>
        ) : roomError ? (
          <RoomErrorState 
            kind={roomError.kind}
            message={roomError.message}
            roomId={roomId}
          />
        ) : (
          <>
          {/* Welcome / Intro Section */}
          <section className="rounded-2xl bg-card/90 shadow-sm border border-border px-4 sm:px-6 py-4 sm:py-5">
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

          {/* Room Essay - Always Visible */}
          {roomEssay && roomEssay.en && roomEssay.vi && (
            <div className="mb-4 p-4 bg-muted/30 rounded-lg border border-border/50" key="room-essay-permanent">
              <PairedHighlightedContent
                englishContent={roomEssay.en}
                vietnameseContent={roomEssay.vi}
              />
            </div>
          )}
          
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
                      onClick={() => {
                        handleKeywordClick(keywordEn);
                      }}
                      disabled={isLoading || !isAuthenticated}
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
        </section>
        
        {/* Main Chat Area */}
        <section className="rounded-2xl bg-card shadow-sm border border-border px-4 sm:px-6 py-5">
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
        </section>
        {/* Feedback - Single Line at Bottom */}
        <section className="rounded-2xl bg-card/70 border border-border px-4 sm:px-6 py-3">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-secondary flex-shrink-0" />
            <Input
              placeholder={isAuthenticated ? "Feedback / Phản Hồi..." : "Sign up to send feedback / Đăng ký để gửi phản hồi..."}
              value={feedbackInput}
              onChange={(e) => setFeedbackInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && isAuthenticated) {
                  sendMessage(feedbackInput, setFeedbackInput, () => {
                    toast({
                      title: "Thank you! / Cảm ơn!",
                      description: "Your feedback has been submitted / Phản hồi của bạn đã được gửi"
                    });
                  }, "feedback");
                }
              }}
              className="text-sm flex-1"
              disabled={!isAuthenticated}
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                if (!isAuthenticated) {
                  toast({
                    title: "Sign Up Required / Yêu Cầu Đăng Ký",
                    description: "Please create a free account to send feedback / Vui lòng tạo tài khoản miễn phí để gửi phản hồi",
                    variant: "destructive"
                  });
                  return;
                }
                sendMessage(feedbackInput, setFeedbackInput, () => {
                  toast({
                    title: "Thank you! / Cảm ơn!",
                    description: "Your feedback has been submitted / Phản hồi của bạn đã được gửi"
                  });
                }, "feedback");
              }}
              disabled={!isAuthenticated}
            >
              <Send className="w-3 h-3" />
            </Button>
          </div>
          </section>
        </>
        )}
        </div>
      </RoomLayout>
    <CreditLimitModal
      open={showCreditLimit}
      onClose={() => setShowCreditLimit(false)}
      onSuccess={refreshCredits}
questionsUsed={creditInfo?.questionsUsed ?? 0}
        questionsLimit={creditInfo?.questionsLimit ?? 0}
    />
    
    {/* Signup Prompt Modal - Only shown when unauthenticated users try to interact */}
    <AlertDialog open={showSignupPrompt} onOpenChange={setShowSignupPrompt}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">Sign Up to Start Your Journey</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3 pt-2">
              <p className="text-base">
                You're viewing this room as a guest. Create a free account to interact with the content, track your progress, and unlock personalized features.
              </p>
              <p className="text-sm text-muted-foreground italic">
                Bạn đang xem phòng này với tư cách khách. Tạo tài khoản miễn phí để tương tác với nội dung, theo dõi tiến trình và mở khóa các tính năng cá nhân hóa.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => setShowSignupPrompt(false)}
            className="w-full sm:w-auto"
          >
            Continue Browsing / Tiếp tục duyệt
          </Button>
          <Button
            onClick={() => navigate('/auth')}
            className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
          >
            Sign Up Free / Đăng ký miễn phí
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
};

export default ChatHub;
