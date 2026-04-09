/**
 * File: GuideBox.tsx
 * Path: src/components/GuideBox.tsx
 */

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  MapPin,
  X,
  ArrowRight,
  Compass,
  Gem,
  Send,
  MessageCircle,
  CornerDownRight,
  Maximize2,
  GripHorizontal,
  BookOpen,
  Mic2,
  PenSquare,
  Languages,
  HeartHandshake,
  Home,
  LibraryBig,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import askMercy from "@/services/mercyChat";

interface GuideBoxProps {
  roomId?: string;
  roomTitle?: string;
  tier?: string;
  pathSlug?: string;
  tags?: string[];
  contentEn?: string;
}

type BubblePos = {
  left: number;
  bottom: number;
};

type PanelRect = {
  left: number;
  bottom: number;
  width: number;
  height: number;
};

type RoomContextSummary = {
  hasRoomContext: boolean;
  roomName: string;
  tierLabel: string | null;
  topicLabel: string | null;
  shortSummary: string | null;
};

type PanelSizeKey = "sm" | "md" | "lg" | "xl";
type ChatRole = "guide" | "user";

type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
};

type GuideInfoCard = {
  key: string;
  icon: React.ReactNode;
  titleEn: string;
  titleVi: string;
  bodyEn: string;
  bodyVi: string;
};

const GUIDE_IMAGE_SRC = "/guide.png";
const GUIDE_IMAGE_FALLBACK = "/guide.png";

const BUBBLE_SIZE = 92;
const HEADER_FACE_SIZE = 50;

const DEFAULT_BUBBLE_LEFT = 18;
const DEFAULT_BUBBLE_BOTTOM = 118;
const BUBBLE_SAFE_MARGIN = 12;
const BUBBLE_BOTTOM_SAFE_MOBILE = 112;
const BUBBLE_BOTTOM_SAFE_DESKTOP = 24;

const BUBBLE_POSITION_STORAGE_KEY = "guide-box-bubble-position-v8-left";
const PANEL_RECT_STORAGE_KEY = "guide-box-panel-rect-v8-left";
const PANEL_SIZE_STORAGE_KEY = "guide-box-panel-size-v8";
const GUIDE_INTRO_EXPANDED_STORAGE_KEY = "guide-box-intro-expanded-v1";

const PANEL_MIN_MARGIN = 12;
const PANEL_BOTTOM_SAFE_MOBILE = 108;
const PANEL_MIN_WIDTH = 300;
const PANEL_MAX_WIDTH = 760;
const PANEL_MIN_HEIGHT = 360;
const PANEL_MAX_HEIGHT = 860;

const PANEL_SIZES: Record<
  PanelSizeKey,
  { width: number; height: number; label: string }
> = {
  sm: { width: 320, height: 420, label: "S" },
  md: { width: 420, height: 560, label: "M" },
  lg: { width: 560, height: 700, label: "L" },
  xl: { width: 700, height: 820, label: "XL" },
};

const DEFAULT_PANEL_SIZE: PanelSizeKey = "md";

function isMobileViewport() {
  return typeof window !== "undefined" && window.innerWidth < 768;
}

function getBubbleBottomSafe() {
  return isMobileViewport()
    ? BUBBLE_BOTTOM_SAFE_MOBILE
    : BUBBLE_BOTTOM_SAFE_DESKTOP;
}

function getPanelBottomSafe() {
  return isMobileViewport() ? PANEL_BOTTOM_SAFE_MOBILE : PANEL_MIN_MARGIN;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function cleanText(value?: string | null) {
  if (!value) return "";
  return value.replace(/\s+/g, " ").trim();
}

function stripHtml(value?: string | null) {
  if (!value) return "";
  return cleanText(value.replace(/<[^>]*>/g, " "));
}

function sentenceCase(value?: string | null) {
  const text = cleanText(value);
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function truncateWords(value?: string | null, maxWords = 16) {
  const text = cleanText(value);
  if (!text) return "";
  const words = text.split(" ");
  if (words.length <= maxWords) return text;
  return `${words.slice(0, maxWords).join(" ")}…`;
}

function humanizeSlug(value?: string | null) {
  const text = cleanText(value);
  if (!text) return "";
  return sentenceCase(text.replace(/[-_/]+/g, " "));
}

function deriveTopicLabel(tags?: string[], contentEn?: string) {
  const usableTags = (tags ?? [])
    .map((tag) => cleanText(tag))
    .filter(Boolean)
    .slice(0, 3);

  if (usableTags.length > 0) return usableTags.join(", ");

  const content = stripHtml(contentEn);
  if (!content) return null;

  const firstSentence =
    content
      .split(/[.!?]/)
      .map((part) => cleanText(part))
      .find(Boolean) ?? "";

  return truncateWords(firstSentence, 10) || null;
}

function deriveRoomContextSummary({
  roomTitle,
  tier,
  pathSlug,
  tags,
  contentEn,
}: GuideBoxProps): RoomContextSummary {
  const safeRoomTitle = cleanText(roomTitle);
  const safeTier = cleanText(tier);
  const safeSlug = humanizeSlug(pathSlug);
  const topicLabel = deriveTopicLabel(tags, contentEn);
  const contentSummary = truncateWords(stripHtml(contentEn), 18);

  const roomName =
    safeRoomTitle || safeSlug || (safeTier ? `${safeTier} room` : "this room");

  const hasRoomContext = Boolean(
    safeRoomTitle || safeTier || safeSlug || topicLabel || contentSummary
  );

  return {
    hasRoomContext,
    roomName,
    tierLabel: safeTier || null,
    topicLabel,
    shortSummary: contentSummary || null,
  };
}

function clampBubblePos(next: BubblePos): BubblePos {
  if (typeof window === "undefined") {
    return {
      left: Math.max(BUBBLE_SAFE_MARGIN, next.left),
      bottom: Math.max(getBubbleBottomSafe(), next.bottom),
    };
  }

  const bottomSafe = getBubbleBottomSafe();
  const maxLeft = Math.max(
    BUBBLE_SAFE_MARGIN,
    window.innerWidth - BUBBLE_SIZE - BUBBLE_SAFE_MARGIN
  );
  const maxBottom = Math.max(
    bottomSafe,
    window.innerHeight - BUBBLE_SIZE - BUBBLE_SAFE_MARGIN
  );

  return {
    left: clamp(next.left, BUBBLE_SAFE_MARGIN, maxLeft),
    bottom: clamp(next.bottom, bottomSafe, maxBottom),
  };
}

function clampPanelRect(next: PanelRect): PanelRect {
  if (typeof window === "undefined") return next;

  const maxWidth = Math.min(
    PANEL_MAX_WIDTH,
    window.innerWidth - PANEL_MIN_MARGIN * 2
  );
  const width = clamp(
    next.width,
    PANEL_MIN_WIDTH,
    Math.max(PANEL_MIN_WIDTH, maxWidth)
  );

  const bottomSafe = getPanelBottomSafe();
  const maxHeight = Math.max(
    PANEL_MIN_HEIGHT,
    window.innerHeight - bottomSafe - PANEL_MIN_MARGIN
  );
  const height = clamp(
    next.height,
    PANEL_MIN_HEIGHT,
    Math.min(PANEL_MAX_HEIGHT, maxHeight)
  );

  const maxLeft = Math.max(
    PANEL_MIN_MARGIN,
    window.innerWidth - width - PANEL_MIN_MARGIN
  );
  const maxBottom = Math.max(
    bottomSafe,
    window.innerHeight - height - PANEL_MIN_MARGIN
  );

  return {
    left: clamp(next.left, PANEL_MIN_MARGIN, maxLeft),
    bottom: clamp(next.bottom, bottomSafe, maxBottom),
    width,
    height,
  };
}

function makePanelRectFromSize(
  sizeKey: PanelSizeKey,
  left: number,
  bottom: number
): PanelRect {
  const size = PANEL_SIZES[sizeKey];
  return clampPanelRect({
    left,
    bottom,
    width: size.width,
    height: size.height,
  });
}

function getDefaultBubblePos(): BubblePos {
  return clampBubblePos({
    left: DEFAULT_BUBBLE_LEFT,
    bottom: DEFAULT_BUBBLE_BOTTOM,
  });
}

function getDefaultPanelRect(sizeKey: PanelSizeKey): PanelRect {
  if (typeof window === "undefined") {
    return {
      left: 126,
      bottom: 118,
      width: PANEL_SIZES[sizeKey].width,
      height: PANEL_SIZES[sizeKey].height,
    };
  }

  const bubble = getDefaultBubblePos();
  const left = isMobileViewport()
    ? PANEL_MIN_MARGIN
    : bubble.left + BUBBLE_SIZE + 14;
  const bottom = isMobileViewport()
    ? PANEL_BOTTOM_SAFE_MOBILE
    : Math.max(PANEL_MIN_MARGIN, bubble.bottom - 8);

  return makePanelRectFromSize(sizeKey, left, bottom);
}

function sanitizePanelSizeKey(value: unknown): PanelSizeKey {
  return value === "sm" || value === "md" || value === "lg" || value === "xl"
    ? value
    : DEFAULT_PANEL_SIZE;
}

function sanitizeBubblePos(value: unknown): BubblePos {
  const candidate = (value ?? {}) as Partial<BubblePos>;
  return clampBubblePos({
    left: isFiniteNumber(candidate.left)
      ? candidate.left
      : DEFAULT_BUBBLE_LEFT,
    bottom: isFiniteNumber(candidate.bottom)
      ? candidate.bottom
      : DEFAULT_BUBBLE_BOTTOM,
  });
}

function sanitizePanelRect(value: unknown, sizeKey: PanelSizeKey): PanelRect {
  const candidate = (value ?? {}) as Partial<PanelRect>;
  const fallback = getDefaultPanelRect(sizeKey);

  return clampPanelRect({
    left: isFiniteNumber(candidate.left) ? candidate.left : fallback.left,
    bottom: isFiniteNumber(candidate.bottom)
      ? candidate.bottom
      : fallback.bottom,
    width: isFiniteNumber(candidate.width) ? candidate.width : fallback.width,
    height: isFiniteNumber(candidate.height)
      ? candidate.height
      : fallback.height,
  });
}

function readSessionJson<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function readSessionBoolean(key: string, fallback = false) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.sessionStorage.getItem(key);
    if (raw == null) return fallback;
    return raw === "true";
  } catch {
    return fallback;
  }
}

function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function getInitialGuideMessages(roomSummary: RoomContextSummary): ChatMessage[] {
  const first = roomSummary.hasRoomContext
    ? `Hi. I’m Guide.\nChào bạn! Mình là Guide, người dẫn đường của bạn.\n\nYou are in ${roomSummary.roomName}. I can point you to important pages, explain how to use this room, or help you decide the next step.\nBạn đang ở ${roomSummary.roomName}. Mình sẽ chỉ bạn các trang quan trọng, hướng dẫn cách dùng room này, hoặc giúp bạn chọn bước tiếp theo.`
    : "Hi. I’m Guide.\nChào bạn! Mình là Guide, người dẫn đường của bạn.\n\nI can point you to important pages, explain how to use Mercy Blade, and help you decide where to start.\nMình có thể chỉ bạn các trang quan trọng, hướng dẫn cách dùng Mercy Blade và giúp bạn biết nên bắt đầu từ đâu.";

  return [{ id: createId("guide"), role: "guide", text: first }];
}

function SectionTitle({
  icon,
  labelEn,
  labelVi,
}: {
  icon?: React.ReactNode;
  labelEn: string;
  labelVi: string;
}) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        fontSize: 12,
        fontWeight: 800,
        color: "rgba(0,0,0,0.50)",
        textTransform: "uppercase",
        letterSpacing: 0.4,
        marginBottom: 10,
        flexWrap: "wrap",
      }}
    >
      {icon}
      <span>
        {labelEn} / {labelVi}
      </span>
    </div>
  );
}

function ActionButton({
  labelEn,
  labelVi,
  icon,
  onClick,
  primary = false,
}: {
  labelEn: string;
  labelVi: string;
  icon: React.ReactNode;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
        padding: "11px 12px",
        borderRadius: 12,
        border: primary
          ? "1px solid rgba(0,128,120,0.18)"
          : "1px solid rgba(0,0,0,0.10)",
        background: primary ? "rgba(0,128,120,0.10)" : "white",
        color: "rgba(0,0,0,0.82)",
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
        {icon}
        <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontWeight: 800, fontSize: 14 }}>{labelEn}</span>
          <span
            style={{
              fontWeight: 600,
              fontSize: 12,
              color: "rgba(0,0,0,0.56)",
            }}
          >
            {labelVi}
          </span>
        </span>
      </span>
      <ArrowRight size={16} />
    </button>
  );
}

function MiniInfoCard({ card }: { card: GuideInfoCard }) {
  return (
    <div
      style={{
        borderRadius: 12,
        border: "1px solid rgba(0,0,0,0.08)",
        background: "rgba(255,255,255,0.96)",
        padding: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 8,
          color: "rgba(0,0,0,0.82)",
        }}
      >
        <span
          style={{
            width: 28,
            height: 28,
            borderRadius: 9999,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,128,120,0.10)",
            color: "rgba(0,0,0,0.76)",
            flexShrink: 0,
          }}
        >
          {card.icon}
        </span>

        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 800, fontSize: 14 }}>{card.titleEn}</div>
          <div
            style={{
              marginTop: 2,
              fontWeight: 700,
              fontSize: 12,
              color: "rgba(0,0,0,0.56)",
            }}
          >
            {card.titleVi}
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 8,
          fontSize: 13,
          lineHeight: 1.55,
          color: "rgba(0,0,0,0.68)",
          display: "grid",
          gap: 6,
        }}
      >
        <div>{card.bodyEn}</div>
        <div style={{ color: "rgba(0,0,0,0.60)" }}>{card.bodyVi}</div>
      </div>
    </div>
  );
}

export function GuideBox({
  roomId,
  roomTitle,
  tier,
  pathSlug,
  tags,
  contentEn,
}: GuideBoxProps) {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [bubblePos, setBubblePos] = useState<BubblePos>(() =>
    getDefaultBubblePos()
  );
  const [panelSize, setPanelSize] = useState<PanelSizeKey>(() =>
    DEFAULT_PANEL_SIZE
  );
  const [panelRect, setPanelRect] = useState<PanelRect>(() =>
    getDefaultPanelRect(DEFAULT_PANEL_SIZE)
  );
  const [imageBroken, setImageBroken] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showFullAppIntro, setShowFullAppIntro] = useState<boolean>(() =>
    readSessionBoolean(GUIDE_INTRO_EXPANDED_STORAGE_KEY, false)
  );
  const messagesRef = useRef<HTMLDivElement | null>(null);

  const roomSummary = useMemo(
    () =>
      deriveRoomContextSummary({
        roomId,
        roomTitle,
        tier,
        pathSlug,
        tags,
        contentEn,
      }),
    [roomId, roomTitle, tier, pathSlug, tags, contentEn]
  );

  useEffect(() => {
    setMessages(getInitialGuideMessages(roomSummary));
  }, [roomSummary]);

  useEffect(() => {
    if (!messagesRef.current) return;
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const restoredPanelSize = sanitizePanelSizeKey(
      readSessionJson<string>(PANEL_SIZE_STORAGE_KEY)
    );
    const restoredBubble = sanitizeBubblePos(
      readSessionJson<Partial<BubblePos>>(BUBBLE_POSITION_STORAGE_KEY)
    );
    const restoredPanel = sanitizePanelRect(
      readSessionJson<Partial<PanelRect>>(PANEL_RECT_STORAGE_KEY),
      restoredPanelSize
    );

    setPanelSize(restoredPanelSize);
    setBubblePos(restoredBubble);
    setPanelRect(restoredPanel);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.sessionStorage.setItem(
        BUBBLE_POSITION_STORAGE_KEY,
        JSON.stringify(sanitizeBubblePos(bubblePos))
      );
    } catch {
      // ignore
    }
  }, [bubblePos]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.sessionStorage.setItem(PANEL_SIZE_STORAGE_KEY, panelSize);
    } catch {
      // ignore
    }
  }, [panelSize]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.sessionStorage.setItem(
        PANEL_RECT_STORAGE_KEY,
        JSON.stringify(sanitizePanelRect(panelRect, panelSize))
      );
    } catch {
      // ignore
    }
  }, [panelRect, panelSize]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.sessionStorage.setItem(
        GUIDE_INTRO_EXPANDED_STORAGE_KEY,
        String(showFullAppIntro)
      );
    } catch {
      // ignore
    }
  }, [showFullAppIntro]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onResize = () => {
      setBubblePos((prev) => sanitizeBubblePos(prev));
      setPanelRect((prev) => sanitizePanelRect(prev, panelSize));
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [panelSize]);

  const openGuide = useCallback(() => {
    const nextRect = makePanelRectFromSize(
      panelSize,
      isMobileViewport()
        ? PANEL_MIN_MARGIN
        : bubblePos.left + BUBBLE_SIZE + 14,
      isMobileViewport()
        ? PANEL_BOTTOM_SAFE_MOBILE
        : Math.max(PANEL_MIN_MARGIN, bubblePos.bottom - 8)
    );

    setPanelRect((prev) =>
      clampPanelRect({
        ...prev,
        left: nextRect.left,
        bottom: nextRect.bottom,
      })
    );
    setIsOpen(true);
  }, [bubblePos, panelSize]);

  const startPanelDrag = useCallback(
    (clientX: number, clientY: number, pointerId: number) => {
      const startX = clientX;
      const startY = clientY;
      const startRect = panelRect;
      const previousUserSelect = document.body.style.userSelect;

      document.body.style.userSelect = "none";

      const onPointerMove = (moveEvent: PointerEvent) => {
        if (moveEvent.pointerId !== pointerId) return;

        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;

        setPanelRect(
          clampPanelRect({
            ...startRect,
            left: startRect.left + dx,
            bottom: startRect.bottom - dy,
          })
        );
      };

      const cleanup = () => {
        document.body.style.userSelect = previousUserSelect;
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
        window.removeEventListener("pointercancel", onPointerUp);
      };

      const onPointerUp = (upEvent: PointerEvent) => {
        if (upEvent.pointerId !== pointerId) return;
        cleanup();
      };

      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
      window.addEventListener("pointercancel", onPointerUp);
    },
    [panelRect]
  );

  const handlePanelDragStart = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      startPanelDrag(event.clientX, event.clientY, event.pointerId);
    },
    [startPanelDrag]
  );

  const handleBubblePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();

      const startX = event.clientX;
      const startY = event.clientY;
      const startPos = bubblePos;
      const pointerId = event.pointerId;
      let moved = false;

      const onPointerMove = (moveEvent: PointerEvent) => {
        if (moveEvent.pointerId !== pointerId) return;

        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;

        if (Math.abs(dx) > 4 || Math.abs(dy) > 4) moved = true;

        setBubblePos(
          clampBubblePos({
            left: startPos.left + dx,
            bottom: startPos.bottom - dy,
          })
        );
      };

      const onPointerUp = (upEvent: PointerEvent) => {
        if (upEvent.pointerId !== pointerId) return;

        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
        window.removeEventListener("pointercancel", onPointerUp);

        if (!moved) openGuide();
      };

      window.addEventListener("pointermove", onPointerMove, { passive: false });
      window.addEventListener("pointerup", onPointerUp);
      window.addEventListener("pointercancel", onPointerUp);
    },
    [bubblePos, openGuide]
  );

  const handleResizePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();

      const startX = event.clientX;
      const startY = event.clientY;
      const startRect = panelRect;
      const pointerId = event.pointerId;
      const previousUserSelect = document.body.style.userSelect;

      document.body.style.userSelect = "none";

      const onPointerMove = (moveEvent: PointerEvent) => {
        if (moveEvent.pointerId !== pointerId) return;

        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;

        setPanelRect(
          clampPanelRect({
            ...startRect,
            width: startRect.width + dx,
            height: startRect.height - dy,
          })
        );
      };

      const cleanup = () => {
        document.body.style.userSelect = previousUserSelect;
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
        window.removeEventListener("pointercancel", onPointerUp);
      };

      const onPointerUp = (upEvent: PointerEvent) => {
        if (upEvent.pointerId !== pointerId) return;
        cleanup();
      };

      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
      window.addEventListener("pointercancel", onPointerUp);
    },
    [panelRect]
  );

  const applyPanelSize = useCallback((sizeKey: PanelSizeKey) => {
    setPanelSize(sizeKey);
    setPanelRect((prev) =>
      clampPanelRect({
        ...prev,
        width: PANEL_SIZES[sizeKey].width,
        height: PANEL_SIZES[sizeKey].height,
      })
    );
  }, []);

  const expandForTyping = useCallback(() => {
    applyPanelSize("xl");
  }, [applyPanelSize]);

  const goHome = useCallback(() => {
    navigate("/");
    setIsOpen(false);
  }, [navigate]);

  const goResume = useCallback(() => {
    if (roomId) {
      navigate(`/room/${roomId}`);
      setIsOpen(false);
      return;
    }
    navigate("/rooms");
    setIsOpen(false);
  }, [navigate, roomId]);

  const goPaths = useCallback(() => {
    navigate("/tiers");
    setIsOpen(false);
  }, [navigate]);

  const goPricing = useCallback(() => {
    navigate("/pricing");
    setIsOpen(false);
  }, [navigate]);

  const goRoom = useCallback(() => {
    if (roomId) {
      navigate(`/room/${roomId}`);
      setIsOpen(false);
      return;
    }
    navigate("/rooms");
    setIsOpen(false);
  }, [navigate, roomId]);

  const submitQuestion = useCallback(
    async (rawInput?: string) => {
      const text = cleanText(rawInput ?? chatInput);
      if (!text) return;

      const userMessage: ChatMessage = {
        id: createId("user"),
        role: "user",
        text,
      };

      setMessages((prev) => [...prev, userMessage]);
      setChatInput("");

      try {
        const reply = await askMercy({
          surface: "guide",
          role: "janitor",
          message: text,
          roomId,
          roomTitle,
          tier,
          pathSlug,
          tags,
          contentEn,
        });

        const guideMessage: ChatMessage = {
          id: createId("guide"),
          role: "guide",
          text: reply.text,
        };

        setMessages((prev) => [...prev, guideMessage]);
      } catch {
        const fallback: ChatMessage = {
          id: createId("guide"),
          role: "guide",
          text:
            "I couldn’t answer right now.\nMình chưa trả lời được lúc này.\n\nYou can still use the quick buttons and the app guide above.\nBạn vẫn có thể dùng các lối tắt nhanh và phần hướng dẫn ở phía trên.",
        };

        setMessages((prev) => [...prev, fallback]);
      }
    },
    [chatInput, roomId, roomTitle, tier, pathSlug, tags, contentEn]
  );

  const openTeacherMercy = useCallback(() => {
    submitQuestion("What is Teacher Mercy?");
  }, [submitQuestion]);

  const quickQuestions = useMemo(
    () => [
      {
        en: "How do I use the app?",
        vi: "Làm sao để học hiệu quả với app?",
      },
      {
        en: "What is shadowing?",
        vi: "Nói đuổi (Shadowing) là gì?",
      },
      {
        en: "What is Teacher Mercy?",
        vi: "Teacher Mercy là gì?",
      },
      roomSummary.hasRoomContext
        ? {
            en: "How do I use this room?",
            vi: "Cách học Room này như thế nào?",
          }
        : {
            en: "Where do I start?",
            vi: "Mình nên bắt đầu từ đâu?",
          },
      {
        en: "What should I do next?",
        vi: "Tiếp theo mình nên làm gì?",
      },
      {
        en: "Where am I?",
        vi: "Mình đang ở đâu vậy?",
      },
    ],
    [roomSummary.hasRoomContext]
  );

  const importantPlaces = useMemo(
    () => [
      {
        key: "home",
        labelEn: "Go home",
        labelVi: "Về trang chủ",
        icon: <Home size={16} />,
        onClick: goHome,
        primary: false,
      },
      {
        key: "resume",
        labelEn: roomId ? "Resume this room" : "Explore rooms",
        labelVi: roomId ? "Tiếp tục Room này" : "Khám phá các Room",
        icon: <LibraryBig size={16} />,
        onClick: goResume,
        primary: true,
      },
      {
        key: "paths",
        labelEn: "Learning paths",
        labelVi: "Lộ trình bài bản",
        icon: <Compass size={16} />,
        onClick: goPaths,
      },
      {
        key: "teacher",
        labelEn: "Teacher Mercy",
        labelVi: "Mở Teacher Mercy",
        icon: <Sparkles size={16} />,
        onClick: openTeacherMercy,
      },
      {
        key: "pricing",
        labelEn: "Pricing",
        labelVi: "Bảng giá & VIP",
        icon: <Gem size={16} />,
        onClick: goPricing,
      },
      ...(roomSummary.hasRoomContext
        ? [
            {
              key: "open-room",
              labelEn: "Open this room",
              labelVi: "Mở Room này",
              icon: <ArrowRight size={16} />,
              onClick: goRoom,
              primary: false,
            },
          ]
        : []),
    ],
    [
      goHome,
      goPaths,
      goPricing,
      goResume,
      goRoom,
      openTeacherMercy,
      roomId,
      roomSummary.hasRoomContext,
    ]
  );

  const appIntroCards = useMemo<GuideInfoCard[]>(
    () => [
      {
        key: "rooms",
        icon: <BookOpen size={15} />,
        titleEn: "400+ rooms about real life",
        titleVi: "400+ Room từ thực tế cuộc sống",
        bodyEn:
          "Mercy Blade has a large library of rooms built around meaningful life topics, not empty textbook examples. You learn English through feelings, work, health, goals, habits, relationships, and daily life.",
        bodyVi:
          "Mercy Blade sở hữu thư viện khổng lồ với các Room xoay quanh chủ đề đời sống thực tế, thay vì ví dụ sách giáo khoa khô khan. Bạn sẽ học tiếng Anh qua cảm xúc, công việc, sức khỏe và các mối quan hệ hằng ngày.",
      },
      {
        key: "shadowing",
        icon: <Mic2 size={15} />,
        titleEn: "Read, listen, and shadow",
        titleVi: "Đọc, nghe và nói đuổi (Shadowing)",
        bodyEn:
          "You can read Vietnamese first to understand the meaning, then read the same idea in English and listen to English audio. Reading and listening to the same text helps you practice shadowing and build rhythm, pronunciation, and confidence.",
        bodyVi:
          "Bạn có thể đọc tiếng Việt để hiểu nghĩa, sau đó đối chiếu sang tiếng Anh và nghe audio. Việc này giúp bạn luyện nói đuổi (Shadowing) để cải thiện nhịp điệu, phát âm và sự tự tin tự nhiên.",
      },
      {
        key: "levels",
        icon: <Languages size={15} />,
        titleEn: "Free to VIP 9",
        titleVi: "Lộ trình từ Free đến VIP 9",
        bodyEn:
          "The library grows from Free to VIP 9. As you move up, the texts become longer, deeper, and more demanding. That gives learners a calm path from easier material into richer English.",
        bodyVi:
          "Thư viện được phân cấp từ Free đến VIP 9. Càng lên cao, nội dung càng sâu sắc và thử thách hơn, giúp bạn nâng trình tiếng Anh một cách bền vững và nhẹ nhàng.",
      },
      {
        key: "teacher-mercy",
        icon: <PenSquare size={15} />,
        titleEn: "Teacher Mercy learning loop",
        titleVi: "Chu trình học cùng Teacher Mercy",
        bodyEn:
          "Teacher Mercy helps you write about real life, improve grammar, make your English more natural, practice speaking, and notice English logic so you avoid Vietlish. The advantage is the loop: write → improve → speak → understand.",
        bodyVi:
          "Teacher Mercy giúp bạn viết về trải nghiệm thực, chỉnh ngữ pháp và thấm nhuần tư duy bản ngữ để bỏ cách nói 'tiếng Anh bồi'. Điểm mạnh là chu trình khép kín: Viết → Cải thiện → Nói → Thấu hiểu.",
      },
    ],
    []
  );

  const introSummary = useMemo(
    () =>
      roomSummary.hasRoomContext
        ? `You are in ${roomSummary.roomName}. This app is built around real life learning. Explore rooms, use Teacher Mercy, and keep moving step by step.\nBạn đang ở ${roomSummary.roomName}. App được xây dựng để bạn học từ chính cuộc sống thực. Hãy khám phá các Room, dùng Teacher Mercy và tiến bộ mỗi ngày.`
        : "Mercy Blade helps Vietnamese learners build English through real life topics, shadowing, and a guided Teacher Mercy loop.\nMercy Blade giúp người Việt xây gốc tiếng Anh qua chủ đề đời sống thực tế, luyện nói đuổi (Shadowing) và chu trình học kèm cặp cùng Teacher Mercy.",
    [roomSummary.hasRoomContext, roomSummary.roomName]
  );

  return (
    <>
      {!isOpen && (
        <div
          style={{
            position: "fixed",
            left: bubblePos.left,
            bottom: bubblePos.bottom,
            zIndex: 99990,
            touchAction: "none",
            WebkitUserSelect: "none",
            userSelect: "none",
          }}
        >
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              role="button"
              tabIndex={0}
              aria-label="Open Guide"
              onPointerDown={handleBubblePointerDown}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openGuide();
                }
              }}
              style={{
                position: "relative",
                width: BUBBLE_SIZE,
                height: BUBBLE_SIZE,
                borderRadius: 9999,
                background: "rgb(251 207 232)",
                padding: 4,
                boxShadow: "0 12px 28px rgba(0,0,0,0.18)",
                border: "2px solid white",
                cursor: "grab",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  overflow: "hidden",
                  borderRadius: 9999,
                  background:
                    "linear-gradient(to bottom, rgb(252 231 243), rgb(255 241 242))",
                }}
              >
                {!imageBroken ? (
                  <img
                    src={GUIDE_IMAGE_SRC}
                    alt="Guide"
                    loading="eager"
                    decoding="async"
                    draggable={false}
                    onError={(e) => {
                      const img = e.currentTarget;
                      if (img.dataset.fallbackApplied !== "true") {
                        img.dataset.fallbackApplied = "true";
                        img.src = GUIDE_IMAGE_FALLBACK;
                        return;
                      }
                      setImageBroken(true);
                    }}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "50% 30%",
                      transform: "scale(1.14)",
                      pointerEvents: "none",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: 22,
                      color: "rgb(157 23 77)",
                    }}
                  >
                    G
                  </div>
                )}
              </div>
            </div>

            <div
              style={{
                pointerEvents: "none",
                fontSize: 14,
                fontWeight: 800,
                color: "rgba(0,0,0,0.82)",
                lineHeight: 1,
              }}
            >
              Guide
            </div>
          </div>
        </div>
      )}

      {isOpen && (
        <div
          style={{
            position: "fixed",
            left: panelRect.left,
            bottom: panelRect.bottom,
            zIndex: 99999,
            width: panelRect.width,
            height: panelRect.height,
            maxWidth: "calc(100vw - 24px)",
            maxHeight: "calc(100vh - 24px)",
            borderRadius: 18,
            border: "1px solid rgba(0,0,0,0.10)",
            background: "white",
            boxShadow: "0 18px 48px rgba(0,0,0,0.18)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            onPointerDown={handlePanelDragStart}
            title="Kéo hộp Guide"
            style={{
              position: "absolute",
              left: 6,
              top: "50%",
              transform: "translateY(-50%)",
              width: 8,
              height: 72,
              borderRadius: 9999,
              background: "rgba(0,0,0,0.20)",
              cursor: "grab",
              zIndex: 3,
              touchAction: "none",
            }}
          />

          <div
            onPointerDown={handlePanelDragStart}
            title="Kéo hộp Guide"
            style={{
              position: "absolute",
              right: 6,
              top: "50%",
              transform: "translateY(-50%)",
              width: 8,
              height: 72,
              borderRadius: 9999,
              background: "rgba(0,0,0,0.20)",
              cursor: "grab",
              zIndex: 3,
              touchAction: "none",
            }}
          />

          <div
            onPointerDown={handlePanelDragStart}
            title="Kéo hộp Guide"
            style={{
              position: "absolute",
              left: "50%",
              bottom: 8,
              transform: "translateX(-50%)",
              width: 72,
              height: 8,
              borderRadius: 9999,
              background: "rgba(0,0,0,0.20)",
              cursor: "grab",
              zIndex: 3,
              touchAction: "none",
            }}
          />

          <div
            style={{
              padding: "10px 14px 12px",
              borderBottom: "1px solid rgba(0,0,0,0.08)",
              background: "rgba(250,250,250,0.96)",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 10,
              }}
            >
              <div
                onPointerDown={handlePanelDragStart}
                role="button"
                tabIndex={0}
                aria-label="Drag Guide box"
                title="Kéo Guide"
                style={{
                  width: 72,
                  height: 10,
                  borderRadius: 9999,
                  background: "rgba(0,0,0,0.22)",
                  cursor: "grab",
                  touchAction: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <GripHorizontal size={14} color="rgba(255,255,255,0.85)" />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    width: HEADER_FACE_SIZE,
                    height: HEADER_FACE_SIZE,
                    borderRadius: 9999,
                    overflow: "hidden",
                    background: "rgb(252 231 243)",
                    border: "2px solid rgb(251 207 232)",
                    flexShrink: 0,
                  }}
                >
                  {!imageBroken ? (
                    <img
                      src={GUIDE_IMAGE_SRC}
                      alt="Guide"
                      loading="eager"
                      decoding="async"
                      onError={(e) => {
                        const img = e.currentTarget;
                        if (img.dataset.fallbackApplied !== "true") {
                          img.dataset.fallbackApplied = "true";
                          img.src = GUIDE_IMAGE_FALLBACK;
                          return;
                        }
                        setImageBroken(true);
                      }}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "50% 30%",
                        transform: "scale(1.14)",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 800,
                        color: "rgb(157 23 77)",
                      }}
                    >
                      G
                    </div>
                  )}
                </div>

                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: "rgba(0,0,0,0.88)",
                      lineHeight: 1.2,
                    }}
                  >
                    Guide
                  </div>
                  <div
                    style={{
                      marginTop: 2,
                      fontSize: 13,
                      color: "rgba(0,0,0,0.58)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    Human help. Important pages. Clear direction.
                    <br />
                    Hỗ trợ tận tâm. Truy cập nhanh. Chỉ dẫn rõ ràng.
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flexShrink: 0,
                }}
              >
                <button
                  type="button"
                  onClick={expandForTyping}
                  title="Mở rộng để gõ"
                  aria-label="Expand for typing"
                  style={{
                    height: 34,
                    padding: "0 12px",
                    borderRadius: 9999,
                    border: "1px solid rgba(0,128,120,0.18)",
                    background: "rgba(0,128,120,0.10)",
                    color: "rgba(0,0,0,0.76)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    cursor: "pointer",
                    fontWeight: 800,
                    fontSize: 12,
                  }}
                >
                  <Maximize2 size={14} />
                  Mở rộng
                </button>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close Guide"
                  title="Đóng"
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 9999,
                    border: "1px solid rgba(0,0,0,0.10)",
                    background: "white",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "rgba(0,0,0,0.72)",
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div
              style={{
                marginTop: 10,
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              {(["sm", "md", "lg", "xl"] as PanelSizeKey[]).map((sizeKey) => {
                const active = panelSize === sizeKey;
                return (
                  <button
                    key={sizeKey}
                    type="button"
                    onClick={() => applyPanelSize(sizeKey)}
                    style={{
                      minWidth: 50,
                      height: 32,
                      padding: "0 12px",
                      borderRadius: 9999,
                      border: active
                        ? "1px solid rgba(0,128,120,0.22)"
                        : "1px solid rgba(0,0,0,0.10)",
                      background: active ? "rgba(0,128,120,0.10)" : "white",
                      color: "rgba(0,0,0,0.76)",
                      fontWeight: 800,
                      fontSize: 12,
                      cursor: "pointer",
                    }}
                    title={`Kích thước ${PANEL_SIZES[sizeKey].label}`}
                  >
                    {PANEL_SIZES[sizeKey].label}
                  </button>
                );
              })}

              <div
                style={{
                  fontSize: 11,
                  color: "rgba(0,0,0,0.46)",
                  fontWeight: 700,
                  marginLeft: 4,
                }}
              >
                Kéo bằng các thanh xám để di chuyển Guide
              </div>
            </div>
          </div>

          <div
            style={{
              padding: 14,
              display: "grid",
              gridTemplateRows: "auto auto auto auto 1fr auto auto",
              gap: 12,
              minHeight: 0,
              flex: 1,
              overflowY: "auto",
              overflowX: "hidden",
              alignContent: "start",
            }}
          >
            <div
              style={{
                borderRadius: 14,
                border: "1px solid rgba(0,128,120,0.12)",
                background:
                  "linear-gradient(180deg, rgba(0,128,120,0.06), rgba(255,255,255,0.98))",
                padding: 14,
              }}
            >
              <SectionTitle
                icon={<HeartHandshake size={14} />}
                labelEn="How to use Mercy Blade"
                labelVi="Cách học hiệu quả"
              />

              <div
                style={{
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: "rgba(0,0,0,0.78)",
                  fontWeight: 600,
                  whiteSpace: "pre-wrap",
                }}
              >
                {introSummary}
              </div>

              <div
                style={{
                  marginTop: 12,
                  display: "grid",
                  gap: 10,
                }}
              >
                {appIntroCards.map((card) => (
                  <MiniInfoCard key={card.key} card={card} />
                ))}
              </div>

              <button
                type="button"
                onClick={() => setShowFullAppIntro((prev) => !prev)}
                style={{
                  marginTop: 12,
                  borderRadius: 9999,
                  border: "1px solid rgba(0,0,0,0.10)",
                  background: "white",
                  padding: "8px 12px",
                  fontSize: 12,
                  fontWeight: 800,
                  color: "rgba(0,0,0,0.74)",
                  cursor: "pointer",
                }}
              >
                {showFullAppIntro
                  ? "Show less / Thu gọn"
                  : "Read full introduction / Đọc giới thiệu đầy đủ"}
              </button>

              {showFullAppIntro ? (
                <div
                  style={{
                    marginTop: 12,
                    borderRadius: 12,
                    border: "1px solid rgba(0,0,0,0.08)",
                    background: "rgba(255,255,255,0.96)",
                    padding: 12,
                    fontSize: 13,
                    lineHeight: 1.65,
                    color: "rgba(0,0,0,0.72)",
                    whiteSpace: "pre-wrap",
                    display: "grid",
                    gap: 10,
                  }}
                >
                  <div>
                    Mercy Blade helps Vietnamese learners build English through
                    real life, not random textbook sentences.
                    {"\n\n"}This app has two main strengths.
                    {"\n\n"}1. A large English library built around real life
                    {"\n"}Mercy Blade has more than 400 rooms. Each room is a
                    small learning space built around meaningful topics from
                    daily life. These rooms cover subjects people actually care
                    about, such as feelings, family, work, health, money,
                    habits, goals, travel, and modern life.
                    {"\n\n"}You can read in Vietnamese to understand the
                    meaning, then read the same idea in English, and listen to
                    English audio that matches the text. This supports
                    shadowing: understand, read, listen, and repeat. Shadowing
                    helps learners improve pronunciation, rhythm, listening,
                    confidence, and natural sentence flow.
                    {"\n\n"}The library is organized from Free to VIP 9. As
                    learners move higher, the texts become longer, deeper, and
                    more advanced.
                    {"\n\n"}2. Teacher Mercy
                    {"\n"}Teacher Mercy is a guided English coach designed
                    especially for Vietnamese learners. You write about a real
                    life event, thought, or feeling. Mercy helps correct
                    grammar, improve natural English, guide speaking practice,
                    and explain English logic so you avoid Vietlish. The real
                    advantage is the loop: write → improve → speak → understand.
                    {"\n\n"}Our mission
                    {"\n"}The founder, CD, wants Mercy Blade to become the best
                    English learning app for Vietnamese people. Your support and
                    feedback help us improve every day and move closer to that
                    goal.
                  </div>

                  <div style={{ color: "rgba(0,0,0,0.60)" }}>
                    Mercy Blade giúp người Việt xây gốc tiếng Anh qua các tình huống thực tế,
                    thay vì những câu mẫu ngẫu nhiên kiểu sách giáo khoa.
                    {"\n\n"}Hệ thống có hai điểm mạnh cốt lõi:
                    {"\n\n"}1. Thư viện tiếng Anh gắn liền với đời sống thực
                    {"\n"}Với hơn 400 Room, mỗi không gian học được xây dựng quanh các chủ đề 
                    ý nghĩa như: Cảm xúc, công việc, sức khỏe, thói quen và mục tiêu. 
                    Bạn có thể đọc tiếng Việt để thấu hiểu nghĩa trước, sau đó đối chiếu sang 
                    tiếng Anh và nghe audio đi kèm. 
                    {"\n\n"}Cách này hỗ trợ tối đa cho việc luyện nói đuổi (Shadowing): 
                    Hiểu - Đọc - Nghe - Lặp lại. Shadowing giúp bạn cải thiện nhịp điệu, 
                    phát âm và dòng chảy tự nhiên của câu. Hệ thống bài đọc được phân cấp từ 
                    Free đến VIP 9, dài hơn và sâu sắc hơn theo trình độ của bạn.
                    {"\n\n"}2. Teacher Mercy
                    {"\n"}Đây là người hướng dẫn tiếng Anh có định hướng, được thiết kế riêng 
                    cho người Việt. Bạn viết về một sự kiện hay suy nghĩ thực tế, 
                    Mercy sẽ giúp chỉnh sửa ngữ pháp, làm cách diễn đạt tự nhiên hơn và 
                    giải thích tư duy bản ngữ để bạn thoát khỏi cách nói 'tiếng Anh bồi'. 
                    Điểm mạnh nhất chính là chu trình học: Viết → Chỉnh sửa → Nói → Thấu hiểu.
                    {"\n\n"}Sứ mệnh của chúng tôi
                    {"\n"}Nhà sáng lập CD mong muốn Mercy Blade trở thành ứng dụng học tiếng Anh 
                    tốt nhất cho người Việt. Sự ủng hộ của bạn chính là động lực để chúng tôi 
                    hoàn thiện mỗi ngày.
                  </div>
                </div>
              ) : null}
            </div>

            <div
              style={{
                borderRadius: 14,
                border: "1px solid rgba(0,0,0,0.08)",
                background: "rgba(250,250,250,0.9)",
                padding: 12,
              }}
            >
              <SectionTitle
                icon={<MapPin size={14} />}
                labelEn="Current place"
                labelVi="Vị trí hiện tại"
              />

              <div
                style={{
                  marginTop: 8,
                  fontSize: 18,
                  fontWeight: 800,
                  color: "rgba(0,0,0,0.88)",
                }}
              >
                {roomSummary.hasRoomContext ? roomSummary.roomName : "Trang chủ"}
              </div>

              {roomSummary.tierLabel ? (
                <div
                  style={{
                    marginTop: 6,
                    fontSize: 13,
                    color: "rgba(0,0,0,0.58)",
                  }}
                >
                  Cấp độ: {roomSummary.tierLabel}
                </div>
              ) : null}

              {roomSummary.topicLabel ? (
                <div
                  style={{
                    marginTop: 6,
                    fontSize: 13,
                    color: "rgba(0,0,0,0.58)",
                  }}
                >
                  Chủ đề: {truncateWords(roomSummary.topicLabel, 8)}
                </div>
              ) : null}

              {roomSummary.shortSummary ? (
                <div
                  style={{
                    marginTop: 8,
                    fontSize: 13,
                    lineHeight: 1.5,
                    color: "rgba(0,0,0,0.68)",
                  }}
                >
                  {roomSummary.shortSummary}
                </div>
              ) : null}
            </div>

            <div
              style={{
                borderRadius: 14,
                border: "1px solid rgba(0,0,0,0.08)",
                background: "rgba(255,255,255,0.96)",
                padding: 12,
              }}
            >
              <SectionTitle
                icon={<Compass size={14} />}
                labelEn="Important places"
                labelVi="Lối tắt nhanh"
              />

              <div style={{ display: "grid", gap: 10 }}>
                {importantPlaces.map((item) => (
                  <ActionButton
                    key={item.key}
                    labelEn={item.labelEn}
                    labelVi={item.labelVi}
                    icon={item.icon}
                    onClick={item.onClick}
                    primary={item.primary}
                  />
                ))}
              </div>
            </div>

            <div
              style={{
                borderRadius: 14,
                border: "1px solid rgba(0,0,0,0.08)",
                background: "rgba(255,255,255,0.96)",
                padding: 12,
              }}
            >
              <SectionTitle
                icon={<MessageCircle size={14} />}
                labelEn="Common questions"
                labelVi="Câu hỏi thường gặp"
              />

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {quickQuestions.map((question) => (
                  <button
                    key={question.en}
                    type="button"
                    onClick={() => submitQuestion(question.en)}
                    style={{
                      borderRadius: 9999,
                      border: "1px solid rgba(0,0,0,0.10)",
                      background: "white",
                      padding: "8px 12px",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "rgba(0,0,0,0.72)",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                    title={question.vi}
                  >
                    <div>{question.en}</div>
                    <div
                      style={{
                        marginTop: 2,
                        fontWeight: 600,
                        color: "rgba(0,0,0,0.52)",
                      }}
                    >
                      {question.vi}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div
              style={{
                minHeight: 220,
                borderRadius: 14,
                border: "1px solid rgba(0,0,0,0.08)",
                background: "rgba(255,255,255,0.92)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "10px 12px",
                  borderBottom: "1px solid rgba(0,0,0,0.08)",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13,
                  fontWeight: 800,
                  color: "rgba(0,0,0,0.74)",
                  flexShrink: 0,
                }}
              >
                <MessageCircle size={15} />
                Trò chuyện cùng Guide
              </div>

              <div
                ref={messagesRef}
                style={{
                  padding: 12,
                  overflowY: "auto",
                  minHeight: 0,
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  background: "rgba(252,252,252,0.9)",
                }}
              >
                {messages.map((message) => (
                  <div
                    key={message.id}
                    style={{
                      alignSelf:
                        message.role === "user" ? "flex-end" : "flex-start",
                      maxWidth: "92%",
                      borderRadius: 14,
                      padding: "10px 12px",
                      whiteSpace: "pre-wrap",
                      lineHeight: 1.45,
                      fontSize: 13,
                      background:
                        message.role === "user"
                          ? "rgba(0,128,120,0.12)"
                          : "rgba(245,245,245,1)",
                      border:
                        message.role === "user"
                          ? "1px solid rgba(0,128,120,0.12)"
                          : "1px solid rgba(0,0,0,0.06)",
                      color: "rgba(0,0,0,0.82)",
                    }}
                  >
                    {message.text}
                  </div>
                ))}
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitQuestion();
              }}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: 8,
              }}
            >
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onFocus={expandForTyping}
                placeholder="Ask a simple question... / Hỏi một câu đơn giản..."
                style={{
                  width: "100%",
                  minWidth: 0,
                  height: 46,
                  padding: "0 14px",
                  borderRadius: 12,
                  border: "1px solid rgba(0,0,0,0.12)",
                  outline: "none",
                  fontSize: 14,
                }}
              />

              <button
                type="submit"
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 12,
                  border: "1px solid rgba(0,128,120,0.18)",
                  background: "rgba(0,128,120,0.10)",
                  color: "rgba(0,0,0,0.82)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                aria-label="Send"
                title="Gửi"
              >
                <Send size={16} />
              </button>
            </form>

            <div
              style={{
                fontSize: 12,
                lineHeight: 1.5,
                color: "rgba(0,0,0,0.50)",
              }}
            >
              Kéo các thanh xám để di chuyển Guide. Dùng S / M / L / XL để đổi
              kích thước nhanh. Bấm Mở rộng (Expand) để có nhiều chỗ gõ văn bản hơn.
            </div>
          </div>

          <div
            onPointerDown={handleResizePointerDown}
            title="Resize"
            style={{
              position: "absolute",
              right: 6,
              bottom: 24,
              width: 22,
              height: 22,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "nwse-resize",
              color: "rgba(0,0,0,0.40)",
              background: "rgba(255,255,255,0.8)",
              border: "1px solid rgba(0,0,0,0.06)",
              zIndex: 4,
            }}
          >
            <CornerDownRight size={14} />
          </div>
        </div>
      )}
    </>
  );
}

export default GuideBox;