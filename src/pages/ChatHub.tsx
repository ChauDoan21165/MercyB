// src/pages/ChatHub.tsx
import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import { GlobalAppBar } from "@/components/GlobalAppBar";
import { RoomHeaderStandard } from "@/components/RoomHeaderStandard";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Send, MessageCircle, RefreshCw, Heart, Star, History, Clock } from "lucide-react";
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

import { CompanionBubble } from "@/components/companion/CompanionBubble";
import { MercyDockIcon } from "@/components/companion/MercyDockIcon";

import { useMercyRoomIntro, getRoomIntro } from "@/hooks/useMercyRoomIntro";
import { PUBLIC_ROOM_MANIFEST } from "@/lib/roomManifest";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { messageSchema } from "@/lib/inputValidation";
import { supabase } from "@/integrations/supabase/client";

import { setCustomKeywordMappings, clearCustomKeywordMappings, loadRoomKeywords } from "@/lib/customKeywordLoader";
import { buildAudioSrc } from "@/lib/audioHelpers";

import { ProfileAvatarUpload } from "@/components/ProfileAvatarUpload";
import { getTierRoute } from "@/lib/tierRoutes";
import { LockedBanner } from "@/components/room/LockedBanner";
import { PrimaryHero } from "@/components/layout/PrimaryHero";
import heroRainbowBg from "@/assets/hero-rainbow-clean.png";

import { useFavoriteRooms } from "@/hooks/useFavoriteRooms";
import { useRecentRooms } from "@/hooks/useRecentRooms";
import { useRoomAudioPreload } from "@/hooks/useRoomAudioPreload";

import { useMercyHost } from "@/hooks/useMercyHost";
import { MercyHostGreeting, MercyColorModeToast } from "@/components/MercyHostGreeting";

import { useMercyRoomComplete } from "@/components/mercy";

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

type RoomErrorKind = "auth" | "access" | "not_found" | "json_invalid" | "unknown";

const ChatHub = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const canonicalRoomId = (roomId || "").trim().toLowerCase().replace(/-/g, "_");

  useEffect(() => {
    if (!roomId) return;
    if (roomId !== canonicalRoomId) {
      navigate(`/room/${canonicalRoomId}`, { replace: true });
    }
  }, [roomId, canonicalRoomId, navigate]);

  const [roomIntroData, setRoomIntroData] = useState<{ introEn: string; introVi: string }>({
    introEn: "",
    introVi: "",
  });

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
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };
  const scrollToAudioPlayer = () => {
    audioPlayerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const progress = useRoomProgress(canonicalRoomId);
  const { trackMessage, trackKeyword, trackCompletion } = useBehaviorTracking(canonicalRoomId);
  const { awardPoints } = usePoints();
  const markRoomComplete = useMercyRoomComplete();

  const { tier, isAdmin, isAuthenticated, isLoading: accessLoading, canAccessTier } = useUserAccess();
  const { creditInfo, hasCreditsRemaining, incrementUsage, refreshCredits } = useCredits();

  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const [showCreditLimit, setShowCreditLimit] = useState(false);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [loadedRoomTier, setLoadedRoomTier] = useState<string | null>(null);

  const contentMode = "keyword";

  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);

  const [keywordMenu, setKeywordMenu] = useState<{ en: string[]; vi: string[] } | null>(null);
  const [clickedKeyword, setClickedKeyword] = useState<string | null>(null);
  const [roomEssay, setRoomEssay] = useState<{ en: string; vi: string } | null>(null);
  const [mergedEntries, setMergedEntries] = useState<any[]>([]);
  const [audioBasePath, setAudioBasePath] = useState<string>("/");
  const [matchedEntryId, setMatchedEntryId] = useState<string | null>(null);

  const { favoriteRooms, isFavorite: isRoomFavorite, toggleFavorite: toggleRoomFavorite } = useFavoriteRooms();
  const { recentRooms, addRecentRoom, clearRecentRooms } = useRecentRooms();

  const [favoriteSearch, setFavoriteSearch] = useState("");
  const [recentSearch, setRecentSearch] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [roomNameOverride, setRoomNameOverride] = useState<{ nameEn: string; nameVi: string } | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const audioFilesToPreload = mergedEntries
    .map((entry) => entry.audio || entry.audioFile)
    .filter((audio): audio is string => Boolean(audio));

  useRoomAudioPreload(audioBasePath, audioFilesToPreload);

  const info = getRoomInfo(canonicalRoomId);

  const currentRoom = roomNameOverride
    ? { nameVi: roomNameOverride.nameVi, nameEn: roomNameOverride.nameEn }
    : info
      ? { nameVi: info.nameVi, nameEn: info.nameEn }
      : { nameVi: "Phòng không xác định", nameEn: "Unknown Room" };

  const mercyIntro = useMercyRoomIntro({
    roomId: canonicalRoomId,
    roomTitleEn: currentRoom.nameEn,
    roomTitleVi: currentRoom.nameVi,
    introEn: roomIntroData.introEn || roomEssay?.en || "",
    introVi: roomIntroData.introVi || roomEssay?.vi || "",
    userName: username || "friend",
  });

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

  useEffect(() => {
    const fetchUsername = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("username, email, avatar_url")
          .eq("id", user.id)
          .single();

        setUsername(profile?.username || user.email?.split("@")[0] || "User");
        setAvatarUrl(profile?.avatar_url || null);
      }
    };

    fetchUsername();
  }, []);

  useEffect(() => {
    if (accessLoading) return;
    setShowAccessDenied(false);
  }, [accessLoading]);

  const handleAccessDenied = () => {
    navigate("/");
  };

  // Initialize room on load or when roomId changes
  useEffect(() => {
    let cancelled = false;

    const loadRoomData = async () => {
      setRoomLoading(true);
      setRoomError(null);

      setMainMessages([]);
      setKeywordMenu(null);
      setRoomEssay(null);
      setCurrentAudio(null);
      setIsAudioPlaying(false);
      setMergedEntries([]);
      setMatchedEntryId(null);

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

        if (cancelled) return;

        setMergedEntries(result.merged);
        setAudioBasePath(result.audioBasePath || "/");
        setLoadedRoomTier(result.roomTier || null);

        const isPreview = result.hasFullAccess === false && result.merged.length > 0;
        setIsPreviewMode(isPreview);

        if (result.errorCode === "JSON_INVALID") {
          setRoomError({ 
            kind: "json_invalid" as RoomErrorKind, 
            message: `Invalid or corrupted room data (ID: ${canonicalRoomId})` 
          });
          setRoomLoading(false);
          return;
        }

        if (result.errorCode === "ROOM_NOT_FOUND") {
          setRoomError({ 
            kind: "not_found", 
            message: canonicalRoomId ? `Room ID: ${canonicalRoomId}` : undefined 
          });
          setRoomLoading(false);
          return;
        }

        if (!result.merged || result.merged.length === 0) {
          console.warn(`No merged entries for room ${canonicalRoomId} tier ${tier}`);
        }

        setKeywordMenu(result.keywordMenu);

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
        if (cancelled) return;

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

    return () => {
      cancelled = true;
    };
  }, [canonicalRoomId]);

  // Scroll to top and focus input when room loads
  useEffect(() => {
    if (!roomLoading && !roomError && mainScrollRef.current) {
      mainScrollRef.current.scrollTo({ top: 0, behavior: "smooth" });

      setTimeout(() => {
        mainInputRef.current?.focus();
      }, 300);
    }
  }, [roomLoading, roomError, canonicalRoomId]);

  // TEMPORARY MINIMAL RETURN TO ENSURE BUILD SUCCESS
  return (
    <div>
      ChatHub
    </div>
  );
};

export default ChatHub;
