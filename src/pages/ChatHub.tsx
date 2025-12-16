// src/pages/ChatHub.tsx
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { GlobalAppBar } from "@/components/GlobalAppBar";
import { RoomHeaderStandard } from "@/components/RoomHeaderStandard";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Send, MessageCircle } from "lucide-react";
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
import { AdminRoomTools } from "@/components/admin/AdminCopyTools";
import { PairedHighlightedContent } from "@/components/PairedHighlightedContent";

import { CompanionBubble } from "@/components/companion/CompanionBubble";

import { useMercyRoomIntro } from "@/hooks/useMercyRoomIntro";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

import { messageSchema } from "@/lib/inputValidation";
import { supabase } from "@/integrations/supabase/client";

import { clearCustomKeywordMappings } from "@/lib/customKeywordLoader";
import { buildAudioSrc } from "@/lib/audioHelpers";

import { getTierRoute } from "@/lib/tierRoutes";
import { LockedBanner } from "@/components/room/LockedBanner";
import { PrimaryHero } from "@/components/layout/PrimaryHero";
import heroRainbowBg from "@/assets/hero-rainbow-clean.png";

import { useFavoriteRooms } from "@/hooks/useFavoriteRooms";
import { useRecentRooms } from "@/hooks/useRecentRooms";
import { useRoomAudioPreload } from "@/hooks/useRoomAudioPreload";

import { useMercyHost } from "@/hooks/useMercyHost";
import { MercyHostGreeting, MercyColorModeToast } from "@/components/MercyHostGreeting";

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
  const location = useLocation();
  const { toast } = useToast();

  // ✅ Canonical room id for JSON strict mode + consistent DB id
  const canonicalRoomId = (roomId || "").trim().toLowerCase().replace(/-/g, "_");

  // ✅ Auto-redirect old/non-canonical URLs to canonical route
  useEffect(() => {
    if (!roomId) return;
    if (roomId !== canonicalRoomId) {
      navigate(`/room/${canonicalRoomId}`, { replace: true });
    }
  }, [roomId, canonicalRoomId, navigate]);

  // Room intro state for Mercy's intro flow
  const [roomIntroData, setRoomIntroData] = useState<{ introEn: string; introVi: string }>({
    introEn: "",
    introVi: "",
  });

  const [mainMessages, setMainMessages] = useState<Message[]>([]);
  const [feedbackInput, setFeedbackInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [roomLoading, setRoomLoading] = useState(true);
  const [roomError, setRoomError] = useState<{ kind: RoomErrorKind; message?: string } | null>(null);
  const [username, setUsername] = useState<string>("");

  const mainScrollRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const audioPlayerRef = useRef<HTMLDivElement>(null);

  const scrollToAudioPlayer = () => {
    audioPlayerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const progress = useRoomProgress(canonicalRoomId);
  const { trackMessage, trackKeyword } = useBehaviorTracking(canonicalRoomId);
  const { awardPoints } = usePoints();

  const { tier, isAdmin, isAuthenticated, isLoading: accessLoading } = useUserAccess();
  const { creditInfo, hasCreditsRemaining, incrementUsage, refreshCredits } = useCredits();

  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const [showCreditLimit, setShowCreditLimit] = useState(false);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [loadedRoomTier, setLoadedRoomTier] = useState<string | null>(null);

  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const [keywordMenu, setKeywordMenu] = useState<{ en: string[]; vi: string[] } | null>(null);
  const [clickedKeyword, setClickedKeyword] = useState<string | null>(null);
  const [roomEssay, setRoomEssay] = useState<{ en: string; vi: string } | null>(null);
  const [mergedEntries, setMergedEntries] = useState<any[]>([]);
  const [audioBasePath, setAudioBasePath] = useState<string>("/");
  const [, setMatchedEntryId] = useState<string | null>(null);

  const { isFavorite: isRoomFavorite, toggleFavorite: toggleRoomFavorite } = useFavoriteRooms();
  const { addRecentRoom } = useRecentRooms();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const [roomNameOverride, setRoomNameOverride] = useState<{ nameEn: string; nameVi: string } | null>(null);

  // Preload audio files for current room
  const audioFilesToPreload = mergedEntries
    .map((entry) => entry.audio || entry.audioFile)
    .filter((audio): audio is string => Boolean(audio));

  useRoomAudioPreload(audioBasePath, audioFilesToPreload);

  // Use centralized room metadata (canonical id)
  const info = getRoomInfo(canonicalRoomId);

  const currentRoom = roomNameOverride
    ? { nameVi: roomNameOverride.nameVi, nameEn: roomNameOverride.nameEn }
    : info
      ? { nameVi: info.nameVi, nameEn: info.nameEn }
      : { nameVi: "Phòng không xác định", nameEn: "Unknown Room" };

  // Mercy Room Intro Flow
  const mercyIntro = useMercyRoomIntro({
    roomId: canonicalRoomId,
    roomTitleEn: currentRoom.nameEn,
    roomTitleVi: currentRoom.nameVi,
    introEn: roomIntroData.introEn || roomEssay?.en || "",
    introVi: roomIntroData.introVi || roomEssay?.vi || "",
    userName: username || "friend",
  });

  // Mercy Host System - room entry greeting
  const mercyHost = useMercyHost({
    roomId: canonicalRoomId,
    roomTitle: currentRoom.nameEn,
    roomTier: info?.tier || loadedRoomTier || "free",
    language: "en",
  });

  const handleRefreshRooms = () => {
    setIsRefreshing(true);
    toast({
      title: "Refreshing room data...",
      description: "Reloading registry and content",
    });

    window.dispatchEvent(new CustomEvent("roomDataUpdated"));

    setTimeout(() => {
      window.location.reload();
    }, 300);
  };

  // Fallback: load room titles from database when manifest metadata is missing
  useEffect(() => {
    if (!canonicalRoomId) return;

    if (info) {
      setRoomNameOverride(null);
      return;
    }

    const loadRoomTitle = async () => {
      const { data, error } = await supabase
        .from(ROOMS_TABLE)
        .select("title_en, title_vi")
        .eq("id", canonicalRoomId)
        .maybeSingle();

      if (data && !error) {
        setRoomNameOverride({
          nameEn: data.title_en || "Unknown Room",
          nameVi: data.title_vi || "Phòng không xác định",
        });
      }
    };

    loadRoomTitle();
  }, [canonicalRoomId, info]);

  // Fetch username
  useEffect(() => {
    const fetchUsername = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("username, email")
          .eq("id", user.id)
          .single();

        setUsername(profile?.username || user.email?.split("@")[0] || "User");
      }
    };

    fetchUsername();
  }, []);

  // Preview model - don't block, let room loader handle preview
  useEffect(() => {
    if (accessLoading) return;
    setShowAccessDenied(false);
  }, [accessLoading]);

  const handleAccessDenied = () => {
    navigate("/");
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
      if (canonicalRoomId && info) {
        addRecentRoom({
          id: canonicalRoomId,
          nameEn: currentRoom.nameEn,
          nameVi: currentRoom.nameVi,
          tier: info.tier || "free",
        });
      }

      try {
        const result = await loadMergedRoom(canonicalRoomId);

        setMergedEntries(result.merged);
        setAudioBasePath(result.audioBasePath || "/");
        setLoadedRoomTier(result.roomTier || null);

        const isPreview = result.hasFullAccess === false && result.merged.length > 0;
        setIsPreviewMode(isPreview);

        if (result.errorCode === "ROOM_NOT_FOUND") {
          setRoomError({ kind: "not_found", message: canonicalRoomId ? `Room ID: ${canonicalRoomId}` : undefined });
          setRoomLoading(false);
          return;
        }

        setKeywordMenu(result.keywordMenu);

        // Load room essay from database
        const { data: dbRoom } = await supabase
          .from(ROOMS_TABLE)
          .select("room_essay_en, room_essay_vi")
          .eq("id", canonicalRoomId)
          .maybeSingle();

        if (dbRoom?.room_essay_en || dbRoom?.room_essay_vi) {
          setRoomEssay({
            en: dbRoom.room_essay_en || "",
            vi: dbRoom.room_essay_vi || "",
          });
        }

        clearCustomKeywordMappings();

        setMainMessages([]);
        setRoomLoading(false);
      } catch (error: any) {
        console.error("Failed to load room data", error);

        const errorMessage = String(error?.message || error);
        let errorKind: RoomErrorKind = "unknown";
        let errorText: string | undefined;

        if (errorMessage.includes("AUTHENTICATION_REQUIRED")) {
          errorKind = "auth";
        } else if (errorMessage.includes("ACCESS_DENIED_INSUFFICIENT_TIER")) {
          errorKind = "access";
        } else if (errorMessage.includes("ROOM_NOT_FOUND") || error?.name === "RoomJsonNotFoundError") {
          errorKind = "not_found";
          errorText = canonicalRoomId ? `Room ID: ${canonicalRoomId}` : undefined;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canonicalRoomId]);

  // ✅ FIX: allow keyword click for guests (no auth gate here)
  const handleKeywordClick = async (keyword: string) => {
    if (isLoading) return;
    setClickedKeyword(keyword);
    await sendEntryForKeyword(keyword);
    setTimeout(() => {
      scrollToAudioPlayer();
    }, 200);
  };

  // Helpers for direct keyword→entry mapping
  const norm = (s: any) =>
    String(s ?? "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[\s\-_]+/g, " ")
      .replace(/[^\w\s]/g, "")
      .trim();

  // Find merged entry by keyword_en match (no fallback to first entry)
  const resolveEntryByKeyword = (keyword: string) => {
    const k = norm(keyword);
    if (!mergedEntries || mergedEntries.length === 0) return null;

    const by = (s: any) => norm(String(s || ""));

    // 0) Exact match on slug
    let entry = mergedEntries.find((e: any) => by(e.slug) === k);
    if (entry) {
      setMatchedEntryId(entry.slug || entry.keywordEn);
      return entry;
    }

    // 1) Exact match on keywordEn
    entry = mergedEntries.find((e: any) => by(e.keywordEn) === k);
    if (entry) {
      setMatchedEntryId(entry.slug || entry.keywordEn);
      return entry;
    }

    // 2) Match against all keywords in keywords_en
    entry = mergedEntries.find((e: any) => {
      const keywords = Array.isArray(e.keywords_en) ? e.keywords_en : [];
      return keywords.some((kw: any) => by(kw) === k);
    });
    if (entry) {
      setMatchedEntryId(entry.slug || entry.keywordEn);
      return entry;
    }

    // 3) Contains either direction on keywordEn
    entry = mergedEntries.find((e: any) => by(e.keywordEn).includes(k) || k.includes(by(e.keywordEn)));
    if (entry) {
      setMatchedEntryId(entry.slug || entry.keywordEn);
      return entry;
    }

    // 4) Contains match in any keyword
    entry = mergedEntries.find((e: any) => {
      const keywords = Array.isArray(e.keywords_en) ? e.keywords_en : [];
      return keywords.some((kw: any) => {
        const normalized = by(kw);
        return normalized.includes(k) || k.includes(normalized);
      });
    });
    if (entry) {
      setMatchedEntryId(entry.slug || entry.keywordEn);
      return entry;
    }

    // 5) Match by slug/title
    entry = mergedEntries.find((e: any) => {
      const slug = by(e.slug);
      const title = typeof e.title === "object" ? by(e.title?.en) : by(e.title);
      return slug.includes(k) || k.includes(slug) || title.includes(k) || k.includes(title);
    });
    if (entry) {
      setMatchedEntryId(entry.slug || entry.keywordEn);
      return entry;
    }

    // 6) Token-overlap fallback
    const tokens = k.split(/\s+/).filter(Boolean);
    entry = mergedEntries.find((e: any) => {
      const target = [by(e.keywordEn), by(typeof e.title === "object" ? e.title?.en : e.title), by(e.slug)].join(" ");
      return tokens.every((t: string) => target.includes(t));
    });

    if (entry) setMatchedEntryId(entry.slug || entry.keywordEn);
    return entry || null;
  };

  const sendEntryForKeyword = async (keyword: string) => {
    const typingMessageId = (Date.now() + 1).toString();
    const typingMessage: Message = { id: typingMessageId, text: "...", isUser: false, timestamp: new Date() };

    setMainMessages((prev) => {
      const filtered = prev.filter((m) => m.isUser || m.id === "welcome");
      return [...filtered, typingMessage];
    });

    try {
      const entry = resolveEntryByKeyword(keyword);
      if (!entry) throw new Error("No entry matched");

      const en = String(entry.essay_en || entry.replyEn || entry.copy?.en || "");
      const vi = String(entry.essay_vi || entry.replyVi || entry.copy?.vi || "");
      const text = vi ? `${en}\n\n---\n\n${vi}` : en;

      const audioFile = entry.audio;
      const audioPlaylist = entry.audioPlaylist || (audioFile ? [audioFile] : []);

      setMainMessages((prev) =>
        prev.map((m) => (m.id === typingMessageId ? { ...m, text, audioFile, audioPlaylist } : m)),
      );
      trackKeyword(keyword);
    } catch (err) {
      console.error("Keyword mapping failed", err);
      setMainMessages((prev) => prev.filter((m) => m.id !== typingMessageId));
      toast({ title: "Error", description: "Could not load entry for keyword", variant: "destructive" });
    }
  };

  const sendMessage = async (input: string, setInput: (val: string) => void, callback: () => void, chatType: string) => {
    if (!input.trim()) return;
    setInput("");

    if (chatType === "feedback") {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { error } = await supabase.from("feedback").insert({
          user_id: user.id,
          message: input,
          status: "new",
          priority: "normal",
        });

        if (error) {
          console.error("Feedback submission error:", error);
          toast({
            title: "Error / Lỗi",
            description: "Failed to submit feedback / Không thể gửi phản hồi",
            variant: "destructive",
          });
        } else {
          callback();
        }
      }
      return;
    }
  };

  // Stable scroll: only scroll when new messages are added (not replacements)
  const prevMessageCountRef = useRef(mainMessages.length);
  useEffect(() => {
    if (mainMessages.length > prevMessageCountRef.current) {
      const timer = setTimeout(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 100);
      prevMessageCountRef.current = mainMessages.length;
      return () => clearTimeout(timer);
    }
  }, [mainMessages]);

  const MessageBubble = ({ message }: { message: Message }) => {
    const parts = message.text.split(/\n+---\n+/);
    const englishContent = parts[0]?.trim() || message.text;
    const vietnameseContent = parts[1]?.trim() || "";

    const audioUrl = message.audioFile ? buildAudioSrc(message.audioFile) : null;

    const handleAudioClick = () => {
      if (!message.audioFile) {
        toast({
          title: "Audio unavailable / Âm thanh không có",
          description: "No audio file specified / Không có file âm thanh",
          variant: "destructive",
        });
        return;
      }

      const url = buildAudioSrc(message.audioFile);
      if (!url) return;

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
                <div className="mb-3">
                  <div className="text-sm leading-relaxed">
                    <HighlightedContent content={englishContent} />
                  </div>
                </div>

                {message.audioFile && audioUrl && (
                  <div className="my-3" ref={audioPlayerRef}>
                    <p className="text-xs text-muted-foreground italic mb-2 text-center">
                      💡 Try shadowing: Listen and repeat along with the audio to improve your pronunciation and fluency. /
                      💡 Hãy thử bóng: Nghe và lặp lại cùng với âm thanh để cải thiện phát âm và sự trôi chảy của bạn.
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

                <div className="mt-3 pt-3 border-t border-border/40">
                  <div className="text-sm leading-relaxed">
                    <HighlightedContent content={vietnameseContent} />
                  </div>
                  <div className="mt-3">
                    <MessageActions text={englishContent} viText={vietnameseContent} roomId={canonicalRoomId} />
                  </div>
                </div>
              </>
            ) : (
              <>
                <HighlightedContent content={message.text} className="w-full" />

                {!message.isUser && message.audioFile && audioUrl && (
                  <div className="mt-4 mb-3 flex items-center gap-2" ref={audioPlayerRef}>
                    <MessageActions text={message.text} roomId={canonicalRoomId} />
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

                {!message.isUser && !message.audioFile && <MessageActions text={message.text} roomId={canonicalRoomId} />}
              </>
            )}

            {message.isUser && <span className="text-xs opacity-70 mt-1 block">{message.timestamp.toLocaleTimeString()}</span>}
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
    roomId: canonicalRoomId || undefined,
    path: location.pathname,
  });

  // Get background color based on room tier
  const roomInfo = getRoomInfo(canonicalRoomId);
  const getBgColor = () => {
    if (!roomInfo) return "hsl(var(--page-free))";
    switch (roomInfo.tier) {
      case "free":
        return "hsl(var(--page-free))";
      case "vip1":
        return "hsl(var(--page-vip1))";
      case "vip2":
        return "hsl(var(--page-vip2))";
      case "vip3":
        return "hsl(var(--page-vip3))";
      case "vip4":
        return "hsl(var(--page-vip4))";
      default:
        return "hsl(var(--page-free))";
    }
  };

  // Build breadcrumbs for GlobalAppBar
  const breadcrumbItems = [
    ...(info?.tier
      ? [
          {
            label: getTierRoute(info.tier)?.name || info.tier.toUpperCase(),
            href: getTierRoute(info.tier)?.path,
          },
        ]
      : []),
    { label: currentRoom.nameEn },
  ];

  return (
    <>
      <GlobalAppBar breadcrumbs={breadcrumbItems} />

      {mercyHost.greetingText && <MercyHostGreeting mercy={mercyHost} />}

      {mercyHost.currentVoiceLine && !mercyHost.isPlaying && (
        <MercyColorModeToast
          message={mercyHost.language === "vi" ? mercyHost.currentVoiceLine.vi : mercyHost.currentVoiceLine.en}
          onDismiss={mercyHost.stopVoice}
        />
      )}

      {canonicalRoomId?.startsWith("english_foundation_") && (
        <PrimaryHero title="English Foundation" subtitle={currentRoom.nameEn} background={heroRainbowBg} />
      )}

      {!isAdmin && (
        <AlertDialog open={showAccessDenied} onOpenChange={setShowAccessDenied}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {!isAuthenticated ? "Sign Up Required / Yêu Cầu Đăng Ký" : "VIP Only / Chỉ Dành Cho VIP"}
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
                    <p className="text-sm">
                      Phòng này chỉ dành cho thành viên VIP. Vui lòng nâng cấp gói đăng ký để truy cập nội dung này.
                    </p>
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
                <Button
                  onClick={() => navigate("/auth")}
                  className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                >
                  Sign Up Free / Đăng ký miễn phí
                </Button>
              ) : (
                <Button
                  onClick={() => navigate("/")}
                  className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                >
                  View Plans / Xem Gói
                </Button>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      <RoomLayout bgColor={getBgColor()}>
        <div className="max-w-4xl mx-auto space-y-6">
          {isAdmin && canonicalRoomId && (
            <AdminRoomTools
              roomId={canonicalRoomId}
              audioFilename={mergedEntries[0]?.audio || ""}
              essayEn={roomEssay?.en}
              essayVi={roomEssay?.vi}
            />
          )}

          <RoomHeaderStandard
            titleEn={currentRoom.nameEn}
            titleVi={currentRoom.nameVi}
            tier={info?.tier || "free"}
            isFavorite={isRoomFavorite(canonicalRoomId)}
            onFavoriteToggle={() =>
              toggleRoomFavorite({
                id: canonicalRoomId,
                nameEn: currentRoom.nameEn,
                nameVi: currentRoom.nameVi,
                tier: info?.tier || "free",
              })
            }
            onRefresh={handleRefreshRooms}
            isRefreshing={isRefreshing}
          />

          {isPreviewMode && <LockedBanner roomTier={loadedRoomTier as any} isLoggedIn={isAuthenticated} />}

          {roomLoading && !roomError ? (
            <RoomLoadShell isLoading={true} error={null}>
              <></>
            </RoomLoadShell>
          ) : roomError ? (
            <RoomErrorState kind={roomError.kind} message={roomError.message} roomId={canonicalRoomId} />
          ) : (
            <>
              <section className="rounded-2xl bg-card/90 shadow-sm border border-border px-4 sm:px-6 py-4 sm:py-5">
                <div className="text-center space-y-0 mb-4">
                  {keywordMenu && keywordMenu.en && keywordMenu.en.length > 0 ? (
                    <p className="text-sm text-foreground leading-tight">
                      Welcome to {currentRoom.nameEn} Room, please click the keyword of the topic you want to discover /
                      Chào mừng bạn đến với phòng {currentRoom.nameVi}, vui lòng nhấp vào từ khóa của chủ đề bạn muốn khám phá
                    </p>
                  ) : (
                    <p className="text-sm text-foreground leading-tight">
                      Welcome to {currentRoom.nameEn} Room / Chào mừng bạn đến với phòng {currentRoom.nameVi}
                    </p>
                  )}
                </div>

                {roomEssay && roomEssay.en && roomEssay.vi && (
                  <div className="mb-4 p-4 bg-muted/30 rounded-lg border border-border/50" key="room-essay-permanent">
                    <PairedHighlightedContent englishContent={roomEssay.en} vietnameseContent={roomEssay.vi} />
                  </div>
                )}

                {keywordMenu && keywordMenu.en && keywordMenu.vi && keywordMenu.en.length > 0 && (
                  <div>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {keywordMenu.en.map((keywordEn, idx) => {
                        const keywordVi = keywordMenu.vi[idx] || "";
                        const isClicked = clickedKeyword === keywordEn || clickedKeyword === keywordVi;
                        const entry = mergedEntries.find(
                          (e: any) =>
                            e.keywordEn === keywordEn || (Array.isArray(e.keywords_en) && e.keywords_en.includes(keywordEn)),
                        );
                        const audioFile = entry?.audio;

                        return (
                          <Button
                            key={`pair-${idx}`}
                            variant={isClicked ? "default" : "outline"}
                            size="sm"
                            className="text-xs cursor-pointer"
                            onClick={() => handleKeywordClick(keywordEn)}
                            // ✅ FIX: keywords must work even for guests
                            disabled={isLoading}
                          >
                            {isAdmin && (
                              <span
                                role="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!audioFile) {
                                    toast({
                                      title: "No audio configured",
                                      description: `Entry "${keywordEn}" has no audio field`,
                                      variant: "destructive",
                                    });
                                    return;
                                  }
                                  const out = `/audio/${audioFile.replace(/^\/?(audio\/)?/, "")}`;
                                  navigator.clipboard.writeText(out);
                                  toast({
                                    title: "Audio filename copied!",
                                    description: out,
                                    duration: 3000,
                                  });
                                }}
                                className={`inline-flex w-[0.75em] h-[0.75em] rounded-full mr-1.5 align-middle cursor-pointer transition-colors ${
                                  audioFile
                                    ? "bg-destructive hover:bg-destructive/80"
                                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                                }`}
                                title={audioFile ? `Click to copy: ${audioFile}` : "No audio configured for this entry"}
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

              <section className="rounded-2xl bg-card shadow-sm border border-border px-4 sm:px-6 py-5">
                <div className="space-y-3">
                  <ScrollArea className="h-[560px] pr-4" ref={mainScrollRef}>
                    <WelcomeBack lastRoomId={progress.lastVisit} currentRoomId={canonicalRoomId} />

                    {mainMessages.length === 0 ? (
                      <div className="flex items-center justify-center text-center py-8">
                        <div className="space-y-2">
                          <p className="text-muted-foreground">Click a keyword to start</p>
                          <p className="text-sm text-muted-foreground">Nhấp vào từ khóa để bắt đầu</p>
                        </div>
                      </div>
                    ) : (
                      mainMessages.map((msg) => <MessageBubble key={msg.id} message={msg} />)
                    )}

                    <div ref={endRef} />
                  </ScrollArea>
                </div>
              </section>

              <section className="rounded-2xl bg-card/70 border border-border px-4 sm:px-6 py-3">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-secondary flex-shrink-0" />
                  <Input
                    placeholder={isAuthenticated ? "Feedback / Phản Hồi..." : "Sign up to send feedback / Đăng ký để gửi phản hồi..."}
                    value={feedbackInput}
                    onChange={(e) => setFeedbackInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && isAuthenticated) {
                        sendMessage(
                          feedbackInput,
                          setFeedbackInput,
                          () => {
                            toast({
                              title: "Thank you! / Cảm ơn!",
                              description: "Your feedback has been submitted / Phản hồi của bạn đã được gửi",
                            });
                          },
                          "feedback",
                        );
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
                          description:
                            "Please create a free account to send feedback / Vui lòng tạo tài khoản miễn phí để gửi phản hồi",
                          variant: "destructive",
                        });
                        return;
                      }
                      sendMessage(
                        feedbackInput,
                        setFeedbackInput,
                        () => {
                          toast({
                            title: "Thank you! / Cảm ơn!",
                            description: "Your feedback has been submitted / Phản hồi của bạn đã được gửi",
                          });
                        },
                        "feedback",
                      );
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

      <AlertDialog open={showSignupPrompt} onOpenChange={setShowSignupPrompt}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Sign Up to Start Your Journey</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3 pt-2">
                <p className="text-base">
                  You're viewing this room as a guest. Create a free account to interact with the content, track your progress,
                  and unlock personalized features.
                </p>
                <p className="text-sm text-muted-foreground italic">
                  Bạn đang xem phòng này với tư cách khách. Tạo tài khoản miễn phí để tương tác với nội dung, theo dõi tiến trình và
                  mở khóa các tính năng cá nhân hóa.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowSignupPrompt(false)} className="w-full sm:w-auto">
              Continue Browsing / Tiếp tục duyệt
            </Button>
            <Button
              onClick={() => navigate("/auth")}
              className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            >
              Sign Up Free / Đăng ký miễn phí
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <CompanionBubble
        text={mercyIntro.text}
        textVi={mercyIntro.textVi}
        visible={mercyIntro.visible}
        onClose={mercyIntro.handleClose}
        title="Mercy"
        isTalking={mercyIntro.isTalking}
        actions={mercyIntro.actions}
        showMuteOption={!mercyIntro.isInIntroFlow}
      />
    </>
  );
};

export default ChatHub;
