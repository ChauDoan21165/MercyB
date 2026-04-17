/**
 * Path: src/components/GuideBox.tsx
 * File: GuideBox.tsx
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CornerDownRight,
  GripHorizontal,
  Maximize2,
  MessageCircle,
  Minimize2,
  PenSquare,
  Send,
  UserRound,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserAccess } from "@/hooks/useUserAccess";

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

type PanelSizeKey = "sm" | "md" | "lg" | "xl";

type SavedGuideFeedback = {
  text: string;
  createdAt: string;
};

const GUIDE_IMAGE_SRC = "/guide.png";
const GUIDE_IMAGE_FALLBACK = "/guide.png";

const SIGN_IN_ROUTE = "/signin";
const PRICING_ROUTE = "/pricing";
const DEFAULT_TRIAL_ENDED_MESSAGE =
  "Your free trial has ended. Please upgrade to continue.";

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
const GUIDE_FEEDBACK_STORAGE_KEY = "guide-box-feedback-queue-v1";

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

function GuideActionCard({
  icon,
  titleEn,
  titleVi,
  bodyEn,
  bodyVi,
  onClick,
  titleColor,
  iconBackground,
  iconColor,
  arrowColor,
}: {
  icon: React.ReactNode;
  titleEn: string;
  titleVi: string;
  bodyEn: string;
  bodyVi: string;
  onClick: () => void;
  titleColor: string;
  iconBackground: string;
  iconColor: string;
  arrowColor: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: "100%",
        borderRadius: 16,
        border: "1px solid rgba(0,0,0,0.07)",
        background: "rgba(255,255,255,0.98)",
        padding: 18,
        display: "flex",
        alignItems: "center",
        gap: 16,
        cursor: "pointer",
        textAlign: "left",
        boxShadow: "0 4px 14px rgba(0,0,0,0.03)",
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 9999,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          background: iconBackground,
          color: iconColor,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>

      <div style={{ minWidth: 0, flex: 1 }}>
        <div
          style={{
            fontSize: 17,
            fontWeight: 800,
            color: titleColor,
            lineHeight: 1.2,
          }}
        >
          {titleEn}
        </div>

        <div
          style={{
            marginTop: 3,
            fontSize: 12,
            fontWeight: 700,
            color: "rgba(0,0,0,0.42)",
            lineHeight: 1.35,
          }}
        >
          {titleVi}
        </div>

        <div
          style={{
            marginTop: 10,
            fontSize: 14,
            fontWeight: 700,
            color: "rgba(0,0,0,0.76)",
            lineHeight: 1.55,
          }}
        >
          {bodyEn}
        </div>

        <div
          style={{
            marginTop: 5,
            fontSize: 12,
            fontWeight: 600,
            color: "rgba(0,0,0,0.46)",
            lineHeight: 1.55,
          }}
        >
          {bodyVi}
        </div>
      </div>

      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          color: arrowColor,
          flexShrink: 0,
        }}
        aria-hidden="true"
      >
        <ArrowRight size={26} strokeWidth={2.2} />
      </div>
    </button>
  );
}

function NewUserInlineAction({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        height: 32,
        padding: "0 12px",
        borderRadius: 9999,
        border: "1px solid rgba(92,122,170,0.14)",
        background: "rgba(92,122,170,0.06)",
        color: "rgba(71,85,126,0.94)",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        cursor: "pointer",
        fontSize: 12,
        fontWeight: 800,
        whiteSpace: "nowrap",
      }}
    >
      <span>{label}</span>
      <ArrowRight size={14} strokeWidth={2.2} />
    </button>
  );
}

function NewUserPagesCard({
  onSignIn,
  onPricing,
}: {
  onSignIn: () => void;
  onPricing: () => void;
}) {
  return (
    <div
      style={{
        borderRadius: 14,
        border: "1px solid rgba(0,0,0,0.07)",
        background: "rgba(255,255,255,0.98)",
        padding: 14,
        boxShadow: "0 4px 14px rgba(0,0,0,0.03)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            minWidth: 0,
            flex: 1,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 9999,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(92,122,170,0.10)",
              color: "rgba(71,85,126,0.92)",
              flexShrink: 0,
            }}
          >
            <UserRound size={18} />
          </div>

          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: "rgba(71,85,126,0.96)",
                lineHeight: 1.2,
              }}
            >
              Pages for new users
            </div>

            <div
              style={{
                marginTop: 3,
                fontSize: 12,
                fontWeight: 700,
                color: "rgba(0,0,0,0.42)",
                lineHeight: 1.35,
              }}
            >
              Trang cho người mới
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <NewUserInlineAction label="Sign in" onClick={onSignIn} />
          <NewUserInlineAction label="Pricing" onClick={onPricing} />
        </div>
      </div>
    </div>
  );
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
        color: "rgba(0,0,0,0.46)",
        textTransform: "uppercase",
        letterSpacing: 0.35,
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

export function GuideBox(_props: GuideBoxProps) {
  const navigate = useNavigate();
  const access = useUserAccess();

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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSaved, setFeedbackSaved] = useState(false);

  const preFullscreenRectRef = useRef<PanelRect | null>(null);
  const preFullscreenSizeRef = useRef<PanelSizeKey | null>(null);
  const dragCleanupRef = useRef<(() => void) | null>(null);

  const trialEndedMessage =
    access.accessAnnouncement || DEFAULT_TRIAL_ENDED_MESSAGE;

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
      // ignore storage failures
    }
  }, [bubblePos]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.sessionStorage.setItem(PANEL_SIZE_STORAGE_KEY, panelSize);
    } catch {
      // ignore storage failures
    }
  }, [panelSize]);

  useEffect(() => {
    if (typeof window === "undefined" || isFullscreen) return;
    try {
      window.sessionStorage.setItem(
        PANEL_RECT_STORAGE_KEY,
        JSON.stringify(sanitizePanelRect(panelRect, panelSize))
      );
    } catch {
      // ignore storage failures
    }
  }, [panelRect, panelSize, isFullscreen]);

  useEffect(() => {
    if (!feedbackSaved) return;
    const timer = window.setTimeout(() => {
      setFeedbackSaved(false);
    }, 2200);

    return () => window.clearTimeout(timer);
  }, [feedbackSaved]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onResize = () => {
      if (isFullscreen) return;
      setBubblePos((prev) => sanitizeBubblePos(prev));
      setPanelRect((prev) => sanitizePanelRect(prev, panelSize));
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [panelSize, isFullscreen]);

  useEffect(() => {
    return () => {
      if (dragCleanupRef.current) {
        dragCleanupRef.current();
        dragCleanupRef.current = null;
      }
    };
  }, []);

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

  const handleBubbleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      openGuide();
    },
    [openGuide]
  );

  const startPanelDrag = useCallback(
    (clientX: number, clientY: number, pointerId: number) => {
      if (isFullscreen) return;

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
        dragCleanupRef.current = null;
      };

      dragCleanupRef.current = cleanup;

      const onPointerUp = (upEvent: PointerEvent) => {
        if (upEvent.pointerId !== pointerId) return;
        cleanup();
      };

      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
      window.addEventListener("pointercancel", onPointerUp);
    },
    [panelRect, isFullscreen]
  );

  const handlePanelDragStart = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (isFullscreen) return;
      event.preventDefault();
      event.stopPropagation();
      startPanelDrag(event.clientX, event.clientY, event.pointerId);
    },
    [isFullscreen, startPanelDrag]
  );

  const handleResizePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (isFullscreen) return;
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
        dragCleanupRef.current = null;
      };

      dragCleanupRef.current = cleanup;

      const onPointerUp = (upEvent: PointerEvent) => {
        if (upEvent.pointerId !== pointerId) return;
        cleanup();
      };

      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
      window.addEventListener("pointercancel", onPointerUp);
    },
    [isFullscreen, panelRect]
  );

  const applyPanelSize = useCallback(
    (sizeKey: PanelSizeKey) => {
      if (isFullscreen) return;
      setPanelSize(sizeKey);
      setPanelRect((prev) =>
        clampPanelRect({
          ...prev,
          width: PANEL_SIZES[sizeKey].width,
          height: PANEL_SIZES[sizeKey].height,
        })
      );
    },
    [isFullscreen]
  );

  const toggleFullscreen = useCallback(() => {
    if (isFullscreen) {
      if (preFullscreenRectRef.current && preFullscreenSizeRef.current) {
        setPanelRect(clampPanelRect(preFullscreenRectRef.current));
        setPanelSize(preFullscreenSizeRef.current);
      }
      setIsFullscreen(false);
      preFullscreenRectRef.current = null;
      preFullscreenSizeRef.current = null;
    } else {
      preFullscreenRectRef.current = { ...panelRect };
      preFullscreenSizeRef.current = panelSize;
      setIsFullscreen(true);
    }
  }, [isFullscreen, panelRect, panelSize]);

  const goLibrary = useCallback(() => {
    if (access.isAuthenticated && access.isTrialExpired) {
      window.alert(trialEndedMessage);
      setIsOpen(false);
      return;
    }

    navigate("/rooms");
    setIsOpen(false);
  }, [access.isAuthenticated, access.isTrialExpired, navigate, trialEndedMessage]);

  const goTeacherMercy = useCallback(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.dispatchEvent(new CustomEvent("mercy-guide:focus"));
    }
    navigate("/");
    setIsOpen(false);
  }, [navigate]);

  const goSignIn = useCallback(() => {
    navigate(SIGN_IN_ROUTE);
    setIsOpen(false);
  }, [navigate]);

  const goPricing = useCallback(() => {
    navigate(PRICING_ROUTE);
    setIsOpen(false);
  }, [navigate]);

  const saveFeedback = useCallback(() => {
    const text = cleanText(feedbackText);
    if (!text) return;

    if (typeof window !== "undefined") {
      try {
        const existing =
          readSessionJson<SavedGuideFeedback[]>(GUIDE_FEEDBACK_STORAGE_KEY) ?? [];
        const next = [{ text, createdAt: new Date().toISOString() }, ...existing].slice(
          0,
          50
        );

        window.sessionStorage.setItem(
          GUIDE_FEEDBACK_STORAGE_KEY,
          JSON.stringify(next)
        );
      } catch {
        // ignore storage failures
      }
    }

    setFeedbackText("");
    setFeedbackSaved(true);
  }, [feedbackText]);

  const panelStyle = useMemo(
    () => ({
      position: "fixed" as const,
      zIndex: isFullscreen ? 100000 : 99999,
      borderRadius: 20,
      border: "1px solid rgba(0,0,0,0.08)",
      background: "rgba(252,252,251,0.98)",
      boxShadow: "0 18px 48px rgba(0,0,0,0.14)",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column" as const,
      ...(isFullscreen
        ? {
            top: 12,
            left: 12,
            right: 12,
            bottom: 12,
            width: "auto",
            height: "auto",
            maxWidth: "none",
            maxHeight: "none",
          }
        : {
            left: panelRect.left,
            bottom: panelRect.bottom,
            width: panelRect.width,
            height: panelRect.height,
            maxWidth: "calc(100vw - 24px)",
            maxHeight: "calc(100vh - 24px)",
          }),
    }),
    [isFullscreen, panelRect]
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
            touchAction: "manipulation",
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
              onClick={handleBubbleClick}
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
                background: "rgb(224 248 245)",
                padding: 4,
                boxShadow: "0 12px 28px rgba(0,0,0,0.16)",
                border: "2px solid white",
                cursor: "pointer",
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
                    "linear-gradient(to bottom, rgb(240 255 250), rgb(248 255 253))",
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
                      color: "rgb(0 128 120)",
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
        <div style={panelStyle}>
          {!isFullscreen && (
            <>
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
                  background: "rgba(0,0,0,0.16)",
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
                  background: "rgba(0,0,0,0.16)",
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
                  background: "rgba(0,0,0,0.16)",
                  cursor: "grab",
                  zIndex: 3,
                  touchAction: "none",
                }}
              />
            </>
          )}

          <div
            style={{
              padding: "10px 14px 12px",
              borderBottom: "1px solid rgba(0,0,0,0.06)",
              background: "rgba(250,250,248,0.96)",
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
                  background: "rgba(0,0,0,0.18)",
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
                    background: "rgb(240 255 250)",
                    border: "2px solid rgb(224 248 245)",
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
                        color: "rgb(0 128 120)",
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
                      color: "rgba(0,0,0,0.54)",
                      lineHeight: 1.4,
                    }}
                  >
                    Choose one next step.
                    <br />
                    Chọn một bước tiếp theo.
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
                  onClick={toggleFullscreen}
                  title={isFullscreen ? "Thu gọn Guide" : "Mở rộng Guide"}
                  aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                  style={{
                    height: 34,
                    padding: "0 12px",
                    borderRadius: 9999,
                    border: "1px solid rgba(0,128,120,0.16)",
                    background: "rgba(0,128,120,0.08)",
                    color: "rgba(0,0,0,0.74)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    cursor: "pointer",
                    fontWeight: 800,
                    fontSize: 12,
                  }}
                >
                  {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                  {isFullscreen ? "Thu gọn" : "Mở rộng"}
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
                    border: "1px solid rgba(0,0,0,0.08)",
                    background: "white",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "rgba(0,0,0,0.70)",
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
                        ? "1px solid rgba(0,128,120,0.18)"
                        : "1px solid rgba(0,0,0,0.08)",
                      background: active ? "rgba(0,128,120,0.08)" : "white",
                      color: "rgba(0,0,0,0.74)",
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
            </div>
          </div>

          <div
            style={{
              padding: 14,
              display: "grid",
              gap: 14,
              minHeight: 0,
              flex: 1,
              overflowY: "auto",
              overflowX: "hidden",
              alignContent: "start",
              background: "rgba(249,249,247,0.8)",
            }}
          >
            <GuideActionCard
              icon={<BookOpen size={18} />}
              titleEn="Library"
              titleVi="Thư viện"
              bodyEn="Browse rooms. Read, listen, reflect."
              bodyVi="Vào room để đọc, nghe, suy ngẫm."
              onClick={goLibrary}
              titleColor="rgba(12,92,84,0.96)"
              iconBackground="rgba(20,120,110,0.10)"
              iconColor="rgba(12,92,84,0.92)"
              arrowColor="rgba(20,120,110,0.78)"
            />

            <GuideActionCard
              icon={<PenSquare size={18} />}
              titleEn="Teacher Mercy"
              titleVi="Teacher Mercy"
              bodyEn="Write and get help with grammar, pronunciation, and English logic."
              bodyVi="Viết và nhận hỗ trợ về ngữ pháp, phát âm và logic tiếng Anh."
              onClick={goTeacherMercy}
              titleColor="rgba(139,60,97,0.96)"
              iconBackground="rgba(190,90,130,0.10)"
              iconColor="rgba(139,60,97,0.92)"
              arrowColor="rgba(139,60,97,0.76)"
            />

            <NewUserPagesCard onSignIn={goSignIn} onPricing={goPricing} />

            <div
              style={{
                borderRadius: 16,
                border: "1px solid rgba(0,0,0,0.07)",
                background: "rgba(255,255,255,0.98)",
                padding: 14,
                boxShadow: "0 4px 14px rgba(0,0,0,0.03)",
              }}
            >
              <SectionTitle
                icon={<MessageCircle size={14} />}
                labelEn="Feedback"
                labelVi="Góp ý"
              />

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  saveFeedback();
                }}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: 8,
                }}
              >
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Share feedback... / Gửi góp ý..."
                  rows={3}
                  style={{
                    width: "100%",
                    minWidth: 0,
                    padding: "12px 14px",
                    borderRadius: 12,
                    border: "1px solid rgba(0,0,0,0.10)",
                    outline: "none",
                    fontSize: 14,
                    resize: "none",
                    fontFamily: "inherit",
                    background: "rgba(252,252,251,0.98)",
                    color: "rgba(0,0,0,0.82)",
                  }}
                />

                <button
                  type="submit"
                  style={{
                    width: 48,
                    height: 48,
                    alignSelf: "end",
                    borderRadius: 12,
                    border: feedbackSaved
                      ? "1px solid rgba(180,83,105,0.18)"
                      : "1px solid rgba(0,128,120,0.16)",
                    background: feedbackSaved
                      ? "rgba(180,83,105,0.08)"
                      : "rgba(0,128,120,0.08)",
                    color: "rgba(0,0,0,0.80)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                  aria-label="Send feedback"
                  title="Gửi góp ý"
                >
                  <Send size={18} />
                </button>
              </form>

              {feedbackSaved ? (
                <div
                  style={{
                    marginTop: 10,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 10px",
                    borderRadius: 9999,
                    background: "rgba(180,83,105,0.08)",
                    border: "1px solid rgba(180,83,105,0.14)",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "rgba(131,24,67,0.84)",
                  }}
                >
                  <span aria-hidden="true">🌹</span>
                  <span>Thank you. / Cảm ơn bạn.</span>
                </div>
              ) : null}
            </div>
          </div>

          {!isFullscreen && (
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
                color: "rgba(0,0,0,0.36)",
                background: "rgba(255,255,255,0.82)",
                border: "1px solid rgba(0,0,0,0.05)",
                zIndex: 4,
              }}
            >
              <CornerDownRight size={14} />
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default GuideBox;