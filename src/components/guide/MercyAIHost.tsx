// FILE: MercyAIHost.tsx
// PATH: src/components/guide/MercyAIHost.tsx
// VERSION: MB-BLUE-101.8a-shared-host-core — 2026-03-28 (+0700)
// REFINEMENT: Scaling Fix applied for 2026 UI Balance.

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import TalkingFaceIcon from "@/components/guide/TalkingFaceIcon";
import { supabase } from "@/lib/supabaseClient";

type QuickAction = {
  id: string;
  label: string;
  description?: string;
  onClick: () => void;
};

type PanelMode = "home" | "email" | "billing" | "about";

type HostContext = {
  roomId?: string;
  entryId?: string;
  keyword?: string;
};

type ChatMsg = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

type HostLang = "en" | "vi";

type HostNoteType = "question" | "progress" | "fault" | "feedback";
type HostCategory = "ui" | "content" | "audio" | "billing" | "auth" | "performance" | "other";
type HostRowType = "user_report" | "host_auto" | "admin_note";

type HostSizeKey = "sm" | "md" | "lg" | "xl";

type HostPoint = {
  x: number;
  y: number;
};

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onstart: null | (() => void);
  onend: null | (() => void);
  onerror: null | ((event: { error?: string }) => void);
  onresult: null | ((event: SpeechRecognitionEventLike) => void);
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionEventLike = {
  results: ArrayLike<{
    isFinal?: boolean;
    length: number;
    [index: number]: {
      transcript?: string;
    };
  }>;
};

declare global {
  interface Window {
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    SpeechRecognition?: new () => SpeechRecognitionLike;
  }
}

/**
 * Mercy Host sizing controls
 * REFINE: Values adjusted slightly to fix "Small Face" scaling issues in 2026 layout.
 */
const HOST_RIGHT = 24;
const HOST_BOTTOM = 24;

const HOST_PANEL_MAX_WIDTH = "94vw";
const HOST_PANEL_MAX_HEIGHT = "calc(100vh - 120px)";

// Fixed Launcher scaling for standard MD view
const HOST_LAUNCHER_SIZE = 112;
const HOST_LAUNCHER_FACE_SIZE = 88;

const HOST_HEADER_AVATAR_WRAP = 68;
const HOST_HEADER_FACE_SIZE = 54;
const HOST_HEADER_SUBTITLE_MAX_WIDTH = 360;

const HOST_SIZE_PRESETS: Record<
  HostSizeKey,
  {
    panelWidth: number;
    launcherSize: number;
    launcherFaceSize: number;
    headerAvatarWrap: number;
    headerFaceSize: number;
  }
> = {
  sm: {
    panelWidth: 420,
    launcherSize: 92,
    launcherFaceSize: 74, // Increased from 70
    headerAvatarWrap: 56,
    headerFaceSize: 46, // Increased from 44
  },
  md: {
    panelWidth: 560,
    launcherSize: 112,
    launcherFaceSize: 92, // Increased from 88
    headerAvatarWrap: 68,
    headerFaceSize: 58, // Increased from 54
  },
  lg: {
    panelWidth: 720,
    launcherSize: 124,
    launcherFaceSize: 104, // Increased from 98
    headerAvatarWrap: 76,
    headerFaceSize: 64, // Increased from 60
  },
  xl: {
    panelWidth: 920,
    launcherSize: 136,
    launcherFaceSize: 114, // Increased from 108
    headerAvatarWrap: 84,
    headerFaceSize: 72, // Increased from 66
  },
};

const LS_LANG_KEY = "mb.host.lang";
const LS_SIZE_KEY = "mb.host.size";
const LS_PANEL_POS_KEY = "mb.host.panel.pos";
const LS_LAUNCHER_POS_KEY = "mb.host.launcher.pos";

function isTruthyString(v: string | null | undefined) {
  return (v ?? "").trim().toLowerCase() === "true";
}

function safeGetLS(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetLS(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

function safeGetJson<T>(key: string, fallback: T): T {
  try {
    const raw = safeGetLS(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as T;
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function safeSetJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

function safeLang(): HostLang {
  const v = (safeGetLS(LS_LANG_KEY) ?? "").toLowerCase().trim();
  return v === "vi" ? "vi" : "en";
}

function safeHostSize(): HostSizeKey {
  const v = (safeGetLS(LS_SIZE_KEY) ?? "").toLowerCase().trim();
  if (v === "sm" || v === "md" || v === "lg" || v === "xl") return v;
  return "md";
}

function uid(prefix = "m") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

function clampText(s: string, max = 1200) {
  const t = (s ?? "").trim();
  if (!t) return "";
  return t.length > max ? `${t.slice(0, max)}…` : t;
}

function containsAny(hay: string, needles: string[]) {
  const h = hay.toLowerCase();
  return needles.some((n) => h.includes(n));
}

function normalizeOneLetterAnswer(s: string): "a" | "b" | "c" | null {
  const t = (s ?? "").trim().toLowerCase();
  if (!t) return null;
  const first = t[0];
  if (first === "a" || first === "b" || first === "c") return first;
  return null;
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function getViewportBounds() {
  if (typeof window === "undefined") {
    return { width: 1440, height: 900 };
  }
  return {
    width: Math.max(320, window.innerWidth || 1440),
    height: Math.max(320, window.innerHeight || 900),
  };
}

function clampPointForLauncher(pt: HostPoint, launcherSize: number): HostPoint {
  const vp = getViewportBounds();
  return {
    x: clamp(pt.x, 8, Math.max(8, vp.width - launcherSize - 8)),
    y: clamp(pt.y, 8, Math.max(8, vp.height - launcherSize - 8)),
  };
}

function clampPointForPanel(pt: HostPoint, panelWidth: number): HostPoint {
  const vp = getViewportBounds();
  const panelHeightGuess = Math.min(vp.height - 64, 720);
  return {
    x: clamp(pt.x, 8, Math.max(8, vp.width - panelWidth - 8)),
    y: clamp(pt.y, 8, Math.max(8, vp.height - panelHeightGuess - 8)),
  };
}

function defaultLauncherPoint(launcherSize: number): HostPoint {
  const vp = getViewportBounds();
  return clampPointForLauncher(
    {
      x: vp.width - HOST_RIGHT - launcherSize,
      y: vp.height - HOST_BOTTOM - launcherSize,
    },
    launcherSize,
  );
}

function defaultPanelPoint(panelWidth: number): HostPoint {
  const vp = getViewportBounds();
  return clampPointForPanel(
    {
      x: vp.width - HOST_RIGHT - panelWidth,
      y: vp.height - HOST_BOTTOM - 520,
    },
    panelWidth,
  );
}

function getSpeechRecognitionCtor():
  | (new () => SpeechRecognitionLike)
  | null {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

function normalizeWords(input: string): string[] {
  return (input ?? "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s']/gu, " ")
    .split(/\s+/)
    .map((x) => x.trim())
    .filter(Boolean);
}

function scorePronunciation(target: string, actual: string, lang: HostLang) {
  const t = normalizeWords(target);
  const a = normalizeWords(actual);

  if (!t.length && !a.length) {
    return {
      score: 0,
      summary:
        lang === "vi"
          ? "Chưa có dữ liệu để chấm."
          : "Not enough speech to score yet.",
      detail:
        lang === "vi"
          ? "Hãy thử đọc một câu ngắn rõ hơn."
          : "Try reading one short sentence more clearly.",
    };
  }

  const matched = t.filter((w) => a.includes(w)).length;
  const ratio = t.length ? matched / t.length : 0;
  const score = Math.round(ratio * 100);

  let summary = "";
  let detail = "";

  if (score >= 90) {
    summary = lang === "vi" ? "Rất tốt." : "Very strong.";
    detail =
      lang === "vi"
        ? "Nhịp và từ khóa khá chính xác. Thử nói tự nhiên hơn một chút."
        : "Rhythm and key words are strong. Try saying it a little more naturally.";
  } else if (score >= 70) {
    summary = lang === "vi" ? "Khá tốt." : "Good attempt.";
    detail =
      lang === "vi"
        ? "Bạn nói đúng phần lớn câu. Hãy nhấn rõ hơn các từ chính."
        : "You got most of the sentence. Stress the key words a bit more clearly.";
  } else if (score >= 45) {
    summary = lang === "vi" ? "Đang đúng hướng." : "You’re on the right track.";
    detail =
      lang === "vi"
        ? "Hãy nói chậm hơn và chia câu thành 2 nhịp ngắn."
        : "Slow down and split the sentence into 2 shorter chunks.";
  } else {
    summary = lang === "vi" ? "Cần thử lại." : "Needs another try.";
    detail =
      lang === "vi"
        ? "Hãy nghe lại, rồi đọc chậm và rõ từng từ."
        : "Listen again, then read slowly and clearly word by word.";
  }

  return { score, summary, detail };
}

/**
 * Typing dots
 */
function TypingIndicator() {
  return (
    <svg
      width="28"
      height="10"
      viewBox="0 0 28 10"
      role="img"
      aria-label="Typing"
      style={{ display: "block" }}
    >
      <circle cx="6" cy="5" r="2" fill="rgba(0,0,0,0.55)">
        <animate
          attributeName="opacity"
          values="0.25;0.9;0.25"
          dur="1s"
          repeatCount="indefinite"
          begin="0s"
        />
      </circle>
      <circle cx="14" cy="5" r="2" fill="rgba(0,0,0,0.55)">
        <animate
          attributeName="opacity"
          values="0.25;0.9;0.25"
          dur="1s"
          repeatCount="indefinite"
          begin="0.15s"
        />
      </circle>
      <circle cx="22" cy="5" r="2" fill="rgba(0,0,0,0.55)">
        <animate
          attributeName="opacity"
          values="0.25;0.9;0.25"
          dur="1s"
          repeatCount="indefinite"
          begin="0.3s"
        />
      </circle>
    </svg>
  );
}

function HostSizeControl(props: {
  hostSize: HostSizeKey;
  onChange: (next: HostSizeKey) => void;
}) {
  const { hostSize, onChange } = props;

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        border: "1px solid rgba(0,0,0,0.10)",
        borderRadius: 999,
        background: "#fff",
        padding: "3px 4px",
      }}
    >
      {(["sm", "md", "lg", "xl"] as HostSizeKey[]).map((key) => {
        const active = key === hostSize;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            title={`Host size: ${key.toUpperCase()}`}
            style={{
              border: "none",
              background: active ? "#111" : "transparent",
              color: active ? "#fff" : "rgba(0,0,0,0.70)",
              borderRadius: 999,
              minWidth: 28,
              height: 24,
              padding: "0 8px",
              fontSize: 10,
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            {key.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}

function PronunciationPanel(props: {
  lang: HostLang;
  targetText: string;
  transcript: string;
  isRecording: boolean;
  isSpeechSupported: boolean;
  score: number | null;
  feedbackSummary: string;
  feedbackDetail: string;
  onTargetChange: (next: string) => void;
  onStart: () => void;
  onStop: () => void;
  onClear: () => void;
}) {
  const {
    lang,
    targetText,
    transcript,
    isRecording,
    isSpeechSupported,
    score,
    feedbackSummary,
    feedbackDetail,
    onTargetChange,
    onStart,
    onStop,
    onClear,
  } = props;

  return (
    <div
      style={{
        borderRadius: 14,
        border: "1px solid rgba(0,0,0,0.10)",
        background: "rgba(0,0,0,0.03)",
        padding: 12,
        marginBottom: 12,
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 800, color: "#111" }}>
        {lang === "vi" ? "Luyện phát âm" : "Pronunciation practice"}
      </div>

      <div
        style={{
          fontSize: 11,
          color: "rgba(0,0,0,0.62)",
          marginTop: 6,
        }}
      >
        {lang === "vi"
          ? "Đọc một câu ngắn. Mercy sẽ nghe, chép lại, rồi góp ý nhịp và độ rõ."
          : "Read one short sentence. Mercy will listen, transcribe it, then give rhythm and clarity feedback."}
      </div>

      <textarea
        value={targetText}
        onChange={(e) => onTargetChange(e.target.value)}
        rows={2}
        placeholder={
          lang === "vi"
            ? "Ví dụ: I would like a cup of tea."
            : "Example: I would like a cup of tea."
        }
        style={{
          marginTop: 10,
          width: "100%",
          resize: "vertical",
          borderRadius: 12,
          border: "1px solid rgba(0,0,0,0.12)",
          background: "#fff",
          padding: "10px 12px",
          fontSize: 12,
          color: "rgba(0,0,0,0.85)",
          lineHeight: "18px",
          outline: "none",
        }}
      />

      <div
        style={{
          marginTop: 10,
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          alignItems: "center",
        }}
      >
        <button
          type="button"
          onClick={isRecording ? onStop : onStart}
          disabled={!isSpeechSupported || !targetText.trim()}
          style={{
            borderRadius: 999,
            border: "1px solid rgba(0,0,0,0.12)",
            background: isRecording ? "#111" : "#fff",
            color: isRecording ? "#fff" : "rgba(0,0,0,0.84)",
            padding: "8px 12px",
            fontSize: 12,
            fontWeight: 900,
            cursor:
              !isSpeechSupported || !targetText.trim() ? "not-allowed" : "pointer",
            opacity: !isSpeechSupported || !targetText.trim() ? 0.6 : 1,
          }}
        >
          {isRecording
            ? lang === "vi"
              ? "■ Dừng"
              : "■ Stop"
            : lang === "vi"
              ? "🎤 Ghi âm"
              : "🎤 Record"}
        </button>

        <button
          type="button"
          onClick={onClear}
          style={{
            borderRadius: 999,
            border: "1px solid rgba(0,0,0,0.12)",
            background: "#fff",
            color: "rgba(0,0,0,0.80)",
            padding: "8px 12px",
            fontSize: 12,
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          {lang === "vi" ? "Xóa" : "Clear"}
        </button>

        <div style={{ fontSize: 11, color: "rgba(0,0,0,0.55)" }}>
          {!isSpeechSupported
            ? lang === "vi"
              ? "Trình duyệt này chưa hỗ trợ SpeechRecognition."
              : "This browser does not support SpeechRecognition yet."
            : isRecording
              ? lang === "vi"
                ? "Đang nghe… nói rõ và chậm."
                : "Listening… speak clearly and slowly."
              : lang === "vi"
                ? "Mẹo: câu ngắn sẽ chấm ổn hơn."
                : "Tip: short sentences score more reliably."}
        </div>
      </div>

      {transcript ? (
        <div
          style={{
            marginTop: 12,
            borderRadius: 12,
            background: "#fff",
            border: "1px solid rgba(0,0,0,0.08)",
            padding: 10,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 800, color: "#111" }}>
            {lang === "vi" ? "Mercy nghe được" : "Mercy heard"}
          </div>
          <div
            style={{
              marginTop: 6,
              fontSize: 12,
              color: "rgba(0,0,0,0.82)",
              whiteSpace: "pre-line",
            }}
          >
            {transcript}
          </div>
        </div>
      ) : null}

      {feedbackSummary || feedbackDetail || score !== null ? (
        <div
          style={{
            marginTop: 10,
            borderRadius: 12,
            background: "rgba(0,0,0,0.05)",
            border: "1px solid rgba(0,0,0,0.08)",
            padding: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 800, color: "#111" }}>
              {lang === "vi" ? "Phản hồi" : "Feedback"}
            </div>

            {score !== null ? (
              <div
                style={{
                  borderRadius: 999,
                  background: "#111",
                  color: "#fff",
                  padding: "3px 8px",
                  fontSize: 11,
                  fontWeight: 900,
                }}
              >
                {lang === "vi" ? "Điểm" : "Score"} {score}/100
              </div>
            ) : null}
          </div>

          {feedbackSummary ? (
            <div
              style={{
                marginTop: 6,
                fontSize: 12,
                fontWeight: 800,
                color: "rgba(0,0,0,0.86)",
              }}
            >
              {feedbackSummary}
            </div>
          ) : null}

          {feedbackDetail ? (
            <div
              style={{
                marginTop: 5,
                fontSize: 12,
                color: "rgba(0,0,0,0.72)",
                whiteSpace: "pre-line",
              }}
            >
              {feedbackDetail}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export default function MercyAIHost() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<PanelMode>("home");
  const [mounted, setMounted] = useState(false);
  const [ctx, setCtx] = useState<HostContext>({});
  const [lang, setLang] = useState<HostLang>(safeLang());
  const [hostSize, setHostSize] = useState<HostSizeKey>(safeHostSize());

  const hostSizePreset = useMemo(() => HOST_SIZE_PRESETS[hostSize], [hostSize]);
  const panelWidth = hostSizePreset.panelWidth;
  const launcherSize = hostSizePreset.launcherSize;
  const launcherFaceSize = hostSizePreset.launcherFaceSize;
  const headerAvatarWrap = hostSizePreset.headerAvatarWrap;
  const headerFaceSize = hostSizePreset.headerFaceSize;

  const [launcherPos, setLauncherPos] = useState<HostPoint>(() =>
    defaultLauncherPoint(HOST_SIZE_PRESETS[safeHostSize()].launcherSize),
  );
  const [panelPos, setPanelPos] = useState<HostPoint>(() =>
    defaultPanelPoint(HOST_SIZE_PRESETS[safeHostSize()].panelWidth),
  );

  const dragRef = useRef<{
    kind: "launcher" | "panel";
    startMouseX: number;
    startMouseY: number;
    startX: number;
    startY: number;
  } | null>(null);

  const [isTyping, setIsTyping] = useState(false);
  const typingTimerRef = useRef<number | null>(null);

  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const [authUserId, setAuthUserId] = useState<string | null>(null);
  const [authEmail, setAuthEmail] = useState<string>("");

  const [displayName, setDisplayName] = useState<string>("");

  const [canVoiceTest, setCanVoiceTest] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [lastProgress, setLastProgress] = useState<{
    updatedAt?: string;
    roomId?: string;
    keyword?: string;
    entryId?: string;
    next?: string;
  } | null>(null);

  const [testActive, setTestActive] = useState(false);
  const [testStep, setTestStep] = useState<0 | 1 | 2 | 3>(0);
  const [testScore, setTestScore] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams<{ roomId?: string }>();

  const isSignin = location.pathname.startsWith("/signin");
  const isAdmin = location.pathname.startsWith("/admin");
  const isRoom = location.pathname.startsWith("/room/");
  const roomIdFromUrl = params.roomId;

  const appKey = "mercy_blade";

  // Pronunciation / recording
  const [pronTargetText, setPronTargetText] = useState<string>("I would like a cup of tea.");
  const [pronTranscript, setPronTranscript] = useState<string>("");
  const [pronScore, setPronScore] = useState<number | null>(null);
  const [pronSummary, setPronSummary] = useState<string>("");
  const [pronDetail, setPronDetail] = useState<string>("");
  const [isRecording, setIsRecording] = useState(false);
  const [speechError, setSpeechError] = useState<string>("");
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const speechSupported = useMemo(() => Boolean(getSpeechRecognitionCtor()), []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    safeSetLS(LS_LANG_KEY, lang);
  }, [lang]);

  useEffect(() => {
    safeSetLS(LS_SIZE_KEY, hostSize);
  }, [hostSize]);

  useEffect(() => {
    const nextLauncher = clampPointForLauncher(
      launcherPos,
      launcherSize,
    );
    if (nextLauncher.x !== launcherPos.x || nextLauncher.y !== launcherPos.y) {
      setLauncherPos(nextLauncher);
    }
  }, [launcherSize]);

  useEffect(() => {
    const nextPanel = clampPointForPanel(panelPos, panelWidth);
    if (nextPanel.x !== panelPos.x || nextPanel.y !== panelPos.y) {
      setPanelPos(nextPanel);
    }
  }, [panelWidth]);

  useEffect(() => {
    const storedLauncher = safeGetJson<HostPoint | null>(LS_LAUNCHER_POS_KEY, null);
    const storedPanel = safeGetJson<HostPoint | null>(LS_PANEL_POS_KEY, null);

    setLauncherPos(
      storedLauncher
        ? clampPointForLauncher(storedLauncher, launcherSize)
        : defaultLauncherPoint(launcherSize),
    );
    setPanelPos(
      storedPanel
        ? clampPointForPanel(storedPanel, panelWidth)
        : defaultPanelPoint(panelWidth),
    );
  }, [launcherSize, panelWidth]);

  useEffect(() => {
    safeSetJson(LS_LAUNCHER_POS_KEY, launcherPos);
  }, [launcherPos]);

  useEffect(() => {
    safeSetJson(LS_PANEL_POS_KEY, panelPos);
  }, [panelPos]);

  useEffect(() => {
    const onResize = () => {
      setLauncherPos((prev) => clampPointForLauncher(prev, launcherSize));
      setPanelPos((prev) => clampPointForPanel(prev, panelWidth));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [launcherSize, panelWidth]);

  const stopRecording = useCallback(() => {
    try {
      recognitionRef.current?.stop();
    } catch {
      // ignore
    }
    setIsRecording(false);
  }, []);

  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, [stopRecording]);

  const startRecording = useCallback(() => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      setSpeechError(
        lang === "vi"
          ? "Trình duyệt không hỗ trợ nhận dạng giọng nói."
          : "Browser speech recognition is not supported.",
      );
      return;
    }

    try {
      setSpeechError("");
      setPronTranscript("");
      setPronScore(null);
      setPronSummary("");
      setPronDetail("");

      const rec = new Ctor();
      recognitionRef.current = rec;
      rec.lang = lang === "vi" ? "en-US" : "en-US";
      rec.interimResults = true;
      rec.continuous = false;

      rec.onstart = () => {
        setIsRecording(true);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      rec.onerror = (event) => {
        const err = String(event?.error || "");
        setSpeechError(
          lang === "vi"
            ? `Ghi âm chưa thành công${err ? `: ${err}` : "."}`
            : `Recording did not complete${err ? `: ${err}` : "."}`,
        );
        setIsRecording(false);
      };

      rec.onresult = (event) => {
        const chunks: string[] = [];
        let finalText = "";

        for (let i = 0; i < event.results.length; i += 1) {
          const item = event.results[i];
          if (!item || !item.length) continue;
          const transcript = String(item[0]?.transcript || "").trim();
          if (!transcript) continue;
          chunks.push(transcript);
          if (item.isFinal) finalText += `${transcript} `;
        }

        const joined = finalText.trim() || chunks.join(" ").trim();
        setPronTranscript(joined);

        if (joined) {
          const scored = scorePronunciation(pronTargetText, joined, lang);
          setPronScore(scored.score);
          setPronSummary(scored.summary);
          setPronDetail(scored.detail);
        }
      };

      rec.start();
    } catch {
      setSpeechError(
        lang === "vi"
          ? "Không thể bắt đầu ghi âm."
          : "Could not start recording.",
      );
      setIsRecording(false);
    }
  }, [lang, pronTargetText]);

  const clearPronunciation = useCallback(() => {
    stopRecording();
    setSpeechError("");
    setPronTranscript("");
    setPronScore(null);
    setPronSummary("");
    setPronDetail("");
  }, [stopRecording]);

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === "en" ? "vi" : "en"));
  }, []);

  const onHostSizeChange = useCallback((next: HostSizeKey) => {
    setHostSize(next);
  }, []);

  const startDrag = useCallback(
    (kind: "launcher" | "panel", e: React.MouseEvent) => {
      if (e.button !== 0) return;
      const src = kind === "launcher" ? launcherPos : panelPos;

      dragRef.current = {
        kind,
        startMouseX: e.clientX,
        startMouseY: e.clientY,
        startX: src.x,
        startY: src.y,
      };
    },
    [launcherPos, panelPos],
  );

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const drag = dragRef.current;
      if (!drag) return;

      const dx = e.clientX - drag.startMouseX;
      const dy = e.clientY - drag.startMouseY;
      const next = { x: drag.startX + dx, y: drag.startY + dy };

      if (drag.kind === "launcher") {
        setLauncherPos(clampPointForLauncher(next, launcherSize));
      } else {
        setPanelPos(clampPointForPanel(next, panelWidth));
      }
    };

    const onUp = () => {
      dragRef.current = null;
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [launcherSize, panelWidth]);

  const clearTypingTimer = useCallback(() => {
    if (typingTimerRef.current !== null) window.clearTimeout(typingTimerRef.current);
    typingTimerRef.current = null;
  }, []);

  useEffect(() => {
    return () => clearTypingTimer();
  }, [clearTypingTimer]);

  const stopVoice = useCallback(() => {
    try {
      if (typeof window === "undefined") return;
      if (!("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    } finally {
      setIsSpeaking(false);
    }
  }, []);

  const speak = useCallback(
    (text: string) => {
      try {
        if (typeof window === "undefined") return false;
        if (!("speechSynthesis" in window)) return false;

        stopVoice();

        const u = new SpeechSynthesisUtterance(text);
        u.lang = lang === "vi" ? "vi-VN" : "en-US";
        u.rate = 1;
        u.pitch = 1;

        u.onstart = () => setIsSpeaking(true);
        u.onend = () => setIsSpeaking(false);
        u.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(u);
        return true;
      } catch {
        setIsSpeaking(false);
        return false;
      }
    },
    [lang, stopVoice],
  );

  useEffect(() => {
    let alive = true;

    const sync = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const u = data?.session?.user ?? null;
        if (!alive) return;
        setAuthUserId(u?.id ?? null);
        setAuthEmail(u?.email ?? "");
      } catch {
        if (!alive) return;
        setAuthUserId(null);
        setAuthEmail("");
      }
    };

    void sync();

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      const u = session?.user ?? null;
      setAuthUserId(u?.id ?? null);
      setAuthEmail(u?.email ?? "");
    });

    return () => {
      alive = false;
      sub?.subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isAdmin) return;

    const onCtx = (e: Event) => {
      const ce = e as CustomEvent<HostContext>;
      if (!ce.detail) return;
      setCtx((prev) => ({ ...prev, ...ce.detail }));
    };
    window.addEventListener("mb:host-context", onCtx as EventListener);
    return () => {
      window.removeEventListener("mb:host-context", onCtx as EventListener);
    };
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin) return;
    if (!isRoom) return;
    if (!roomIdFromUrl) return;
    setCtx((prev) => ({ ...prev, roomId: roomIdFromUrl }));
  }, [isAdmin, isRoom, roomIdFromUrl]);

  const pageHint = useMemo(() => {
    const p = location.pathname || "/";
    if (p.startsWith("/signin")) return lang === "vi" ? "Hỗ trợ đăng nhập" : "Login help";
    if (p.startsWith("/room/")) return lang === "vi" ? "Hỗ trợ phòng học" : "Room help";
    if (p.startsWith("/tiers")) return lang === "vi" ? "Chọn gói VIP" : "Choose VIP tier";
    return lang === "vi" ? "Hỗ trợ" : "Help";
  }, [location.pathname, lang]);

  const headerSubtitle = useMemo(() => {
    switch (mode) {
      case "email":
        return lang === "vi" ? "Hỗ trợ email" : "Email help";
      case "billing":
        return lang === "vi" ? "Hỗ trợ thanh toán/VIP" : "Subscription help";
      case "about":
        return lang === "vi" ? "Giới thiệu" : "About";
      default:
        return pageHint;
    }
  }, [mode, pageHint, lang]);

  const contextLine = useMemo(() => {
    const rid = ctx.roomId ?? roomIdFromUrl;
    const parts: string[] = [];
    if (rid) parts.push(rid);
    if (ctx.entryId) parts.push(`entry:${ctx.entryId}`);
    if (ctx.keyword) parts.push(`kw:${ctx.keyword}`);
    return parts.length ? parts.join(" • ") : null;
  }, [ctx.roomId, ctx.entryId, ctx.keyword, roomIdFromUrl]);

  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, []);

  useEffect(() => {
    if (isAdmin) return;
    if (!open) return;
    const t = window.setTimeout(() => {
      scrollToBottom();
      inputRef.current?.focus();
    }, 0);
    return () => window.clearTimeout(t);
  }, [isAdmin, open, scrollToBottom]);

  useEffect(() => {
    if (isAdmin) return;
    if (!open) return;
    scrollToBottom();
  }, [isAdmin, messages, open, scrollToBottom]);

  const addMsg = useCallback((role: ChatMsg["role"], text: string) => {
    const clean = clampText(text);
    if (!clean) return;
    setMessages((prev) => [...prev, { id: uid(role === "user" ? "u" : "a"), role, text: clean }]);
  }, []);

  const loadMyDisplayName = useCallback(async () => {
    try {
      const { data: s } = await supabase.auth.getSession();
      const uidUser = s?.session?.user?.id;
      const email = s?.session?.user?.email ?? "";
      if (!uidUser) return;

      const { data: p, error } = await supabase
        .from("profiles")
        .select("display_name, full_name, name, is_admin, admin_level" as never)
        .eq("id", uidUser)
        .maybeSingle();

      if (error) {
        setDisplayName((email || "").trim());
        setCanVoiceTest(false);
        return;
      }

      const anyP = p as
        | {
            display_name?: string | null;
            full_name?: string | null;
            name?: string | null;
            is_admin?: boolean | null;
            admin_level?: number | null;
          }
        | null;

      const n =
        (anyP?.display_name ?? "").trim() ||
        (anyP?.full_name ?? "").trim() ||
        (anyP?.name ?? "").trim() ||
        "";

      setDisplayName((n || email || "").trim());

      const adminOk =
        Boolean(anyP?.is_admin) ||
        (typeof anyP?.admin_level === "number" &&
          Number.isFinite(anyP.admin_level) &&
          anyP.admin_level >= 1);

      setCanVoiceTest(adminOk);
    } catch {
      // ignore
    }
  }, []);

  const loadLastProgress = useCallback(async () => {
    try {
      const { data: s } = await supabase.auth.getSession();
      const uidUser = s?.session?.user?.id;
      if (!uidUser) return;

      const { data, error } = await supabase
        .from("mercy_host_notes")
        .select("created_at, room_id, keyword, entry_id, details, note_type")
        .eq("user_id", uidUser)
        .eq("note_type", "progress")
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) return;

      const row = data?.[0] as
        | {
            created_at?: string;
            room_id?: string | null;
            keyword?: string | null;
            entry_id?: string | null;
            details?: unknown;
          }
        | undefined;

      if (!row) return;

      const d = (row.details ?? {}) as { next?: unknown };
      setLastProgress({
        updatedAt: row.created_at,
        roomId: row.room_id ?? undefined,
        keyword: row.keyword ?? undefined,
        entryId: row.entry_id ?? undefined,
        next: typeof d?.next === "string" ? d.next : undefined,
      });
    } catch {
      // ignore
    }
  }, []);

  const logHostNote = useCallback(
    async (args: {
      note_type: HostNoteType;
      category: HostCategory;
      type: HostRowType;
      title: string;
      message: string;
      fault_code?: string | null;
      severity?: number | null;
      details?: Record<string, unknown>;
    }) => {
      try {
        const { data: s } = await supabase.auth.getSession();
        const uidUser = s?.session?.user?.id;
        if (!uidUser) return;

        const rid = ctx.roomId ?? roomIdFromUrl ?? null;

        const v = (import.meta as { env?: { VITE_APP_VERSION?: string } })?.env
          ?.VITE_APP_VERSION;
        const clientVersion = typeof v === "string" && v.trim().length ? v.trim() : null;

        const payload: Record<string, unknown> = {
          user_id: uidUser,
          user_email: s?.session?.user?.email ?? null,
          app_key: appKey,
          page_path: location.pathname ?? null,

          room_id: rid,
          keyword: ctx.keyword ?? null,
          entry_id: ctx.entryId ?? null,

          note_type: args.note_type,
          category: args.category,
          type: args.type,
          title: args.title,
          message: args.message,
          fault_code: args.fault_code ?? null,

          details: args.details ?? {},
          meta: {
            mode,
            contextLine,
            lang,
          },
          client_version: clientVersion,
        };

        if (typeof args.severity === "number" && Number.isFinite(args.severity)) {
          payload.severity = args.severity;
        }

        await supabase.from("mercy_host_notes").insert(payload);
      } catch {
        // ignore
      }
    },
    [ctx.entryId, ctx.keyword, ctx.roomId, roomIdFromUrl, location.pathname, mode, contextLine, lang],
  );

  useEffect(() => {
    if (isAdmin) return;
    if (!open) return;
    void loadMyDisplayName();
    void loadLastProgress();
  }, [isAdmin, open, loadMyDisplayName, loadLastProgress]);

  useEffect(() => {
    if (isAdmin) return;

    const onProgress = (
      e: Event,
    ) => {
      const ce = e as CustomEvent<{
        roomId?: string;
        keyword?: string;
        entryId?: string;
        next?: string;
      }>;
      const d = ce.detail;
      if (!d) return;

      setLastProgress({
        updatedAt: new Date().toISOString(),
        roomId: d.roomId,
        keyword: d.keyword,
        entryId: d.entryId,
        next: d.next,
      });

      void logHostNote({
        note_type: "progress",
        category: "other",
        type: "host_auto",
        title: "Progress update",
        message: `Progress: ${[d.roomId, d.keyword, d.entryId].filter(Boolean).join(" • ")}`,
        details: { next: d.next ?? null },
      });
    };

    window.addEventListener("mb:host-progress", onProgress as EventListener);
    return () => window.removeEventListener("mb:host-progress", onProgress as EventListener);
  }, [isAdmin, logHostNote]);

  const goTiers = useCallback(() => {
    const rid = ctx.roomId ?? roomIdFromUrl;
    const returnTo = rid ? `/room/${rid}` : location.pathname || "/";
    navigate(`/tiers?returnTo=${encodeURIComponent(returnTo)}`);
  }, [ctx.roomId, roomIdFromUrl, location.pathname, navigate]);

  const startQuickTest = useCallback(() => {
    setTestActive(true);
    setTestStep(1);
    setTestScore(0);

    if (lang === "vi") {
      addMsg(
        "assistant",
        `Mini test (30 giây) để gợi ý nơi bắt đầu.\n\nQ1) “I ___ a student.”\nA) am  B) is  C) are\nTrả lời: A / B / C`,
      );
    } else {
      addMsg(
        "assistant",
        `Mini test (30 seconds) to recommend where to start.\n\nQ1) “I ___ a student.”\nA) am  B) is  C) are\nReply: A / B / C`,
      );
    }

    void logHostNote({
      note_type: "question",
      category: "other",
      type: "host_auto",
      title: "Quick test started",
      message: "User started quick test",
      details: { step: 1 },
    });
  }, [addMsg, lang, logHostNote]);

  const finishQuickTest = useCallback(
    (finalScore: number) => {
      setTestActive(false);
      setTestStep(0);

      const level =
        finalScore <= 1 ? "beginner" : finalScore === 2 ? "intermediate" : "advanced";

      const recEn =
        level === "beginner"
          ? `Result: Beginner.\nStart: simple rooms with short lines + repeat audio.\nTip: pick 1 keyword and repeat 3 times.\nNext: go to /tiers to unlock more rooms.`
          : level === "intermediate"
            ? `Result: Intermediate.\nStart: rooms with longer sentences + shadowing.\nTip: listen once → repeat once → read once.\nNext: go to /tiers if you want VIP rooms.`
            : `Result: Advanced.\nStart: VIP rooms (long cycles) + fast listening.\nTip: use “keyword” to drill weak points.\nNext: VIP9 gives Mercy voice coaching (daily minutes cap).`;

      const recVi =
        level === "beginner"
          ? `Kết quả: Cơ bản.\nBắt đầu: phòng câu ngắn + nghe lặp.\nMẹo: chọn 1 keyword và lặp 3 lần.\nBước tiếp: vào /tiers để mở thêm phòng.`
          : level === "intermediate"
            ? `Kết quả: Trung bình.\nBắt đầu: phòng câu dài hơn + shadowing.\nMẹo: nghe 1 lần → nhại 1 lần → đọc 1 lần.\nBước tiếp: vào /tiers nếu muốn mở phòng VIP.`
            : `Kết quả: Khá.\nBắt đầu: phòng VIP (chu kỳ dài) + nghe nhanh.\nMẹo: dùng keyword để khoan vào điểm yếu.\nBước tiếp: VIP9 có giọng nói Mercy (giới hạn phút/ngày).`;

      addMsg("assistant", lang === "vi" ? recVi : recEn);

      void logHostNote({
        note_type: "progress",
        category: "other",
        type: "host_auto",
        title: "Quick test result",
        message: `Quick test result: ${level} (${finalScore}/3)`,
        details: { level, score: finalScore },
      });
    },
    [addMsg, lang, logHostNote],
  );

  const baseAssistantHome = useMemo(() => {
    const name = displayName ? ` ${displayName}` : "";
    const p =
      lastProgress?.roomId && !isSignin
        ? lang === "vi"
          ? `Lần trước: ${lastProgress.roomId}${lastProgress.keyword ? ` • kw:${lastProgress.keyword}` : ""}${lastProgress.next ? `\nBước tiếp: ${lastProgress.next}` : ""}`
          : `Last time: ${lastProgress.roomId}${lastProgress.keyword ? ` • kw:${lastProgress.keyword}` : ""}${lastProgress.next ? `\nNext: ${lastProgress.next}` : ""}`
        : "";

    if (lang === "vi") {
      return `Chào${name}. Mình là Mercy Host.\n${p ? `${p}\n` : ""}Bạn muốn làm gì ngay bây giờ?\n• Chọn gói VIP (/tiers)\n• Làm mini test\n• Vào phòng học\n• Báo lỗi (audio/UI)\n• Luyện phát âm ở khung bên dưới`;
    }

    return `Hi${name}. I’m Mercy Host.\n${p ? `${p}\n` : ""}What do you need right now?\n• Choose a VIP tier (/tiers)\n• Take a mini test\n• Start learning in a room\n• Report a problem (audio/UI)\n• Practice pronunciation in the panel below`;
  }, [displayName, lastProgress, isSignin, lang]);

  const seedIfEmpty = useCallback(
    (nextMode: PanelMode) => {
      setMessages((prev) => {
        if (prev.length) return prev;
        const first =
          nextMode === "home"
            ? baseAssistantHome
            : lang === "vi"
              ? `Chào. Hỏi mình về ${nextMode}.`
              : `Hi. Ask me anything about ${nextMode}.`;
        return [{ id: uid("a"), role: "assistant", text: first }];
      });
    },
    [baseAssistantHome, lang],
  );

  const makeReply = useCallback(
    (userTextRaw: string, currentMode: PanelMode) => {
      const userText = userTextRaw.toLowerCase();
      const rid = ctx.roomId ?? roomIdFromUrl;

      if (testActive) {
        const ans = normalizeOneLetterAnswer(userTextRaw);
        if (!ans) {
          return lang === "vi" ? "Bạn trả lời A / B / C nhé." : "Please answer A / B / C.";
        }

        let add = 0;
        if (testStep === 1 && ans === "a") add = 1;
        if (testStep === 2 && ans === "b") add = 1;
        if (testStep === 3 && ans === "a") add = 1;

        const nextScore = testScore + add;
        setTestScore(nextScore);

        if (testStep === 1) {
          setTestStep(2);
          return lang === "vi"
            ? `Q2) “He ___ to work every day.”\nA) go  B) goes  C) going\nTrả lời: A / B / C`
            : `Q2) “He ___ to work every day.”\nA) go  B) goes  C) going\nReply: A / B / C`;
        }

        if (testStep === 2) {
          setTestStep(3);
          return lang === "vi"
            ? `Q3) Chọn đúng: “___ I watched a movie.”\nA) Yesterday  B) Tomorrow  C) Now\nTrả lời: A / B / C`
            : `Q3) Choose: “___ I watched a movie.”\nA) Yesterday  B) Tomorrow  C) Now\nReply: A / B / C`;
        }

        setTestStep(0);
        window.setTimeout(() => {
          finishQuickTest(nextScore);
        }, 0);

        return lang === "vi" ? "Xong. Mình tổng kết nhé…" : "Done. Let me summarize…";
      }

      if (
        containsAny(userText, [
          "tier", "tiers", "vip", "price", "pricing", "upgrade", "pay", "payment",
          "subscribe", "subscription", "checkout", "gói", "nâng", "thanh toán", "đăng ký",
        ])
      ) {
        if (!authUserId) {
          return lang === "vi"
            ? `Để thanh toán và mở VIP, bạn cần đăng nhập trước.\n• Bấm “Login help” hoặc vào /signin\nSau đó vào /tiers để chọn gói.`
            : `To pay and unlock VIP, please sign in first.\n• Tap “Login help” or go to /signin\nThen go to /tiers to choose a plan.`;
        }

        return lang === "vi"
          ? `Mình sẽ dẫn bạn theo 3 bước:\n1) Vào /tiers chọn gói (VIP1/VIP3/VIP9)\n2) Thanh toán\n3) Quay lại phòng học và bắt đầu\nBạn muốn mình mở trang /tiers không?`
          : `Here’s the 3-step path:\n1) Go to /tiers and choose VIP (VIP1/VIP3/VIP9)\n2) Pay\n3) Return to learning rooms and start\nDo you want me to open /tiers now?`;
      }

      if (
        currentMode === "email" ||
        containsAny(userText, ["email", "mail", "reset", "verify", "verification", "spam", "thư", "xác minh"])
      ) {
        return lang === "vi"
          ? `Hỗ trợ email:
• Kiểm tra spam/junk và tìm “Mercy”
• Chờ 2–5 phút (có thể trễ)
• Nếu dùng email theo domain: kiểm tra hộp thư có nhận được mail không
Bạn đang cần: đặt lại mật khẩu / xác minh / hóa đơn?`
          : `Email help:
• Check spam/junk and search “Mercy”
• Wait 2–5 minutes (providers can delay)
• If you used a domain email: confirm your mailbox really receives mail
Tell me: password reset, verification, or receipt?`;
      }

      if (
        currentMode === "billing" ||
        containsAny(userText, ["receipt", "stripe", "billing", "invoice", "vip", "pay", "payment", "hóa đơn"])
      ) {
        return lang === "vi"
          ? `VIP / thanh toán:
• Sau khi trả tiền, VIP sẽ tự kích hoạt
• Nếu chưa: đăng xuất → đăng nhập lại 1 lần, rồi kiểm tra trang Tier/VIP
Bạn mua gói nào (VIP1/VIP3/VIP9) và hiện đang thấy gì?`
          : `VIP / billing:
• After payment, VIP should activate automatically
• If it doesn’t: sign out → sign in once, then check Tier/VIP page
Tell me: which tier (VIP1/VIP3/VIP9) and what you see now?`;
      }

      if (
        currentMode === "about" ||
        containsAny(userText, ["how", "works", "what is", "about", "guide", "là gì", "hoạt động"])
      ) {
        return lang === "vi"
          ? `Mercy Blade:
• Rooms = học song ngữ ngắn + audio
• Host = dẫn đường + hỗ trợ + ghi nhận lỗi
• Luyện phát âm = đọc câu ngắn rồi nhận góp ý trực tiếp
Bạn đang ở trang nào? Mình chỉ bạn bước tiếp theo.`
          : `Mercy Blade:
• Rooms = short bilingual learning + audio
• Host = navigation + help + logging
• Pronunciation practice = read a short sentence and get immediate feedback
Tell me what page you’re on, and I’ll point the next step.`;
      }

      if (
        containsAny(userText, [
          "login", "signin", "sign in", "otp", "phone", "password", "google", "facebook",
          "đăng nhập", "mật khẩu", "sđt",
        ])
      ) {
        return lang === "vi"
          ? `Hỗ trợ đăng nhập:
• Email/mật khẩu: dùng “Forgot password” khi cần
• Phone OTP: kiểm tra mã quốc gia + thử lại
• Google/Facebook: phải bật trong Supabase Auth
Bạn đang dùng cách nào (email / phone / Google / Facebook)?`
          : `Login help:
• Email/password: use Forgot password if needed
• Phone OTP: confirm country code + try again
• Google/Facebook: must be enabled in Supabase Auth
What method are you using (email / phone / Google / Facebook)?`;
      }

      if (containsAny(userText, ["voice", "speak", "talk", "read to me", "nói", "giọng", "đọc"])) {
        return lang === "vi"
          ? `Giọng nói của Mercy Host là tính năng VIP9.
• VIP9 có giới hạn phút/ngày để hệ thống bền vững
• Bạn vẫn có thể luyện phát âm ngay trong khung Host này
Bạn muốn nâng cấp không? Bấm “Chọn gói (Pay)” để vào /tiers.`
          : `Mercy Host Voice is VIP9 only.
• VIP9 includes a daily minutes cap
• You can still practice pronunciation directly inside this Host panel
Want it? Tap “Choose tier” to open /tiers.`;
      }

      if (
        rid &&
        containsAny(userText, ["room", "audio", "sound", "play", "cannot hear", "can't hear", "progress", "không nghe", "âm thanh", "phòng"])
      ) {
        void logHostNote({
          note_type: "fault",
          category: containsAny(userText, ["audio", "sound", "play", "can't hear", "cannot hear", "không nghe", "âm thanh"])
            ? "audio"
            : "ui",
          type: "user_report",
          title: "Room/audio issue",
          message: userTextRaw,
          fault_code: containsAny(userText, ["audio", "sound", "play", "can't hear", "cannot hear", "không nghe", "âm thanh"])
            ? "AUDIO_PLAY_FAIL"
            : "ROOM_ISSUE",
          severity: 2,
          details: { room_id: rid, ctx },
        });

        return lang === "vi"
          ? `Hỗ trợ phòng (${rid}):
• Thử reload 1 lần
• Nếu audio không chạy: có thể entry đó không có audio
Bạn cho mình biết: phòng + dòng entry nào bị lỗi (hoặc gửi roomId).`
          : `Room help (${rid}):
• Try reloading once
• If audio doesn’t play: the entry may not have audio attached
Tell me: which room + which entry line is failing (or send the roomId).`;
      }

      return lang === "vi"
        ? `Ok. Cho mình 1 chi tiết:
• Bạn đang ở trang nào? (${location.pathname})
• Bạn bấm gì?
• Bạn mong gì xảy ra và thực tế ra sao?`
        : `Got it. Tell me one detail:
• What page are you on? (${location.pathname})
• What did you click?
• What did you expect vs what happened?`;
    },
    [authUserId, ctx, roomIdFromUrl, location.pathname, lang, logHostNote, testActive, testStep, testScore, finishQuickTest],
  );

  const assistantRespond = useCallback(
    (userText: string, currentMode: PanelMode) => {
      clearTypingTimer();
      setIsTyping(true);

      typingTimerRef.current = window.setTimeout(() => {
        setIsTyping(false);
        typingTimerRef.current = null;
        addMsg("assistant", makeReply(userText, currentMode));
      }, 650);
    },
    [addMsg, clearTypingTimer, makeReply],
  );

  const transitionToMode = useCallback(
    (nextMode: PanelMode) => {
      setMode(nextMode);
      seedIfEmpty(nextMode);
      clearTypingTimer();
      setIsTyping(true);

      typingTimerRef.current = window.setTimeout(() => {
        setIsTyping(false);
        typingTimerRef.current = null;

        if (nextMode === "email") {
          addMsg("assistant", lang === "vi" ? "OK — email không tới. Bạn cần: xác minh / reset / hóa đơn?" : "Okay — email not arriving. What type (verification / reset / receipt)?");
        } else if (nextMode === "billing") {
          addMsg("assistant", lang === "vi" ? "OK — thanh toán/VIP. Bạn đang ở gói nào và lỗi gì?" : "Okay — billing/VIP. Which tier and what’s wrong?");
        } else if (nextMode === "about") {
          addMsg("assistant", lang === "vi" ? "OK — Mercy Blade hoạt động thế nào. Bạn đang muốn làm gì?" : "Okay — here’s how Mercy Blade works. What are you trying to do?");
        } else {
          addMsg("assistant", baseAssistantHome);
        }
      }, 500);
    },
    [addMsg, baseAssistantHome, clearTypingTimer, seedIfEmpty, lang],
  );

  const openPanel = useCallback(() => {
    setOpen(true);
    seedIfEmpty(mode);
    clearTypingTimer();
    setIsTyping(true);
    typingTimerRef.current = window.setTimeout(() => {
      setIsTyping(false);
      typingTimerRef.current = null;
      inputRef.current?.focus();
    }, 250);
  }, [clearTypingTimer, mode, seedIfEmpty]);

  const closePanel = useCallback(() => {
    setOpen(false);
    setIsTyping(false);
    clearTypingTimer();
    stopVoice();
    stopRecording();
  }, [clearTypingTimer, stopVoice, stopRecording]);

  useEffect(() => {
    if (isAdmin) return;
    if (!isSignin) return;

    const k = "mb_ai_host_autopened_signin_once";
    if (isTruthyString(safeGetLS(k))) return;

    safeSetLS(k, "true");
    setOpen(true);
    setMode("home");
    seedIfEmpty("home");
    clearTypingTimer();
    setIsTyping(true);
    typingTimerRef.current = window.setTimeout(() => {
      setIsTyping(false);
      typingTimerRef.current = null;
    }, 450);
  }, [isAdmin, isSignin, clearTypingTimer, seedIfEmpty]);

  useEffect(() => {
    if (isAdmin) return;
    if (!open) return;
    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") closePanel();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isAdmin, open, closePanel]);

  const actions: QuickAction[] = useMemo(
    () => [
      {
        id: "tiers",
        label: lang === "vi" ? "Chọn gói (Pay)" : "Choose tier",
        description: lang === "vi" ? "Mở trang /tiers để thanh toán" : "Open /tiers to pay and unlock",
        onClick: () => goTiers(),
      },
      {
        id: "voice",
        label: canVoiceTest
          ? lang === "vi" ? "Giọng nói (Admin Test)" : "Voice (Admin Test)"
          : lang === "vi" ? "Giọng nói (VIP9)" : "Voice (VIP9)",
        description: canVoiceTest
          ? lang === "vi" ? "Test giọng nói ngay trên trình duyệt (không tốn tiền)" : "Test voice using browser TTS (no cost)"
          : lang === "vi" ? "Chỉ dành cho VIP9" : "VIP9 only",
        onClick: () => {
          if (!authUserId) {
            closePanel();
            navigate("/signin");
            return;
          }
          if (!canVoiceTest) {
            addMsg("assistant", lang === "vi" ? "Giọng nói Mercy Host là VIP9. Bạn có thể nâng cấp ở /tiers." : "Mercy Host Voice is VIP9 only. You can upgrade at /tiers.");
            return;
          }
          const ok = speak(lang === "vi" ? "Xin chào. Tôi là Mercy Host. Đây là bản thử giọng nói dành cho admin." : "Hi. I am Mercy Host. This is an admin voice test.");
          if (!ok) {
            addMsg("assistant", lang === "vi" ? "Trình duyệt này không hỗ trợ Text-to-Speech." : "This browser does not support Text-to-Speech.");
          }
        },
      },
      {
        id: "test",
        label: "Mini test",
        description: lang === "vi" ? "Đo nhanh trình độ để gợi ý nơi bắt đầu" : "Quick level check to recommend where to start",
        onClick: () => {
          if (!open) openPanel();
          seedIfEmpty(mode);
          startQuickTest();
        },
      },
      {
        id: "login",
        label: lang === "vi" ? "Hỗ trợ đăng nhập" : "Login help",
        description: lang === "vi" ? "Email, OTP, Google/Facebook" : "Email, phone OTP, Google/Facebook issues",
        onClick: () => {
          closePanel();
          navigate("/signin");
        },
      },
      {
        id: "email",
        label: lang === "vi" ? "Email không tới" : "Email not arriving",
        description: lang === "vi" ? "Reset / xác minh / hóa đơn" : "Password reset / verification email tips",
        onClick: () => transitionToMode("email"),
      },
      {
        id: "billing",
        label: lang === "vi" ? "Thanh toán/VIP" : "Subscription",
        description: lang === "vi" ? "VIP & lỗi kích hoạt" : "VIP access & payment questions",
        onClick: () => transitionToMode("billing"),
      },
      {
        id: "about",
        label: lang === "vi" ? "Cách dùng" : "How it works",
        description: lang === "vi" ? "Giới thiệu nhanh & dẫn đường" : "Quick explanation & navigation",
        onClick: () => transitionToMode("about"),
      },
    ],
    [addMsg, authUserId, canVoiceTest, closePanel, goTiers, lang, mode, navigate, open, openPanel, seedIfEmpty, speak, startQuickTest, transitionToMode],
  );

  const onSend = useCallback(() => {
    const text = clampText(draft);
    if (!text) return;

    setDraft("");
    seedIfEmpty(mode);
    addMsg("user", text);

    void logHostNote({
      note_type: "question",
      category: "other",
      type: "user_report",
      title: "User message",
      message: text,
      details: {
        page: location.pathname,
        roomId: ctx.roomId ?? roomIdFromUrl ?? null,
        keyword: ctx.keyword ?? null,
        entryId: ctx.entryId ?? null,
        mode,
      },
    });

    assistantRespond(text, mode);
  }, [addMsg, assistantRespond, draft, mode, seedIfEmpty, logHostNote, location.pathname, ctx, roomIdFromUrl]);

  const onInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onSend();
      }
    },
    [onSend],
  );

  useEffect(() => {
    const g = globalThis as any;
    g.__MB_HOST_STATE__ = {
      open, mode, page: location.pathname, roomId: ctx.roomId ?? roomIdFromUrl, ctx, isTyping,
      messagesCount: messages.length, isAdmin, displayName, lastProgress, lang, authUserId, authEmail,
      testActive, testStep, testScore, appKey, canVoiceTest, isSpeaking, hostSize, launcherPos, panelPos,
      isRecording, pronTranscript, pronScore,
    };
  }, [open, mode, location.pathname, ctx, roomIdFromUrl, isTyping, messages.length, isAdmin, displayName, lastProgress, lang, authUserId, authEmail, testActive, testStep, testScore, canVoiceTest, isSpeaking, hostSize, launcherPos, panelPos, isRecording, pronTranscript, pronScore]);

  if (!mounted || typeof document === "undefined" || !document.body) return null;
  if (isAdmin) return null;

  const fontStack = 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"';

  const ui = open ? (
    <div
      data-mb-host="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2147483000,
        fontFamily: fontStack,
      }}
    >
      <div
        onMouseDown={closePanel}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          background: "transparent",
        }}
      />

      <div
        style={{
          position: "fixed",
          left: panelPos.x,
          top: panelPos.y,
        }}
      >
        <div
          role="dialog"
          aria-modal="false"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: panelWidth,
            maxWidth: HOST_PANEL_MAX_WIDTH,
            maxHeight: HOST_PANEL_MAX_HEIGHT,
            borderRadius: 18,
            background: "#fff",
            border: "1px solid rgba(0,0,0,0.10)",
            boxShadow: "0 18px 55px rgba(0,0,0,0.22)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            onMouseDown={(e) => startDrag("panel", e)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
              borderBottom: "1px solid rgba(0,0,0,0.10)",
              background: "#fff",
              flex: "0 0 auto",
              cursor: "move",
              userSelect: "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: headerAvatarWrap,
                  height: headerAvatarWrap,
                  borderRadius: 999,
                  background: "rgba(0,0,0,0.05)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flex: "0 0 auto",
                }}
                aria-hidden="true"
              >
                <TalkingFaceIcon size={headerFaceSize} isTalking={isTyping || isSpeaking} />
              </div>

              <div style={{ lineHeight: 1.15, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>Mercy Host</div>
                <div
                  style={{
                    fontSize: 12,
                    color: "rgba(0,0,0,0.60)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: HOST_HEADER_SUBTITLE_MAX_WIDTH,
                  }}
                  title={contextLine ?? headerSubtitle}
                >
                  {contextLine ?? headerSubtitle}
                </div>
              </div>
            </div>

            <div
              style={{ display: "flex", alignItems: "center", gap: 8 }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <HostSizeControl hostSize={hostSize} onChange={onHostSizeChange} />
              {isSpeaking && (
                <button
                  type="button"
                  onClick={stopVoice}
                  title={lang === "vi" ? "Dừng giọng" : "Stop voice"}
                  style={{
                    border: "1px solid rgba(0,0,0,0.10)",
                    background: "#fff",
                    borderRadius: 999,
                    height: 32,
                    padding: "0 10px",
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: "pointer",
                    color: "rgba(0,0,0,0.70)",
                  }}
                >
                  ■
                </button>
              )}
              <button
                type="button"
                onClick={toggleLang}
                aria-label="Toggle language"
                title={lang === "en" ? "Switch to Vietnamese" : "Chuyển sang English"}
                style={{
                  border: "1px solid rgba(0,0,0,0.10)",
                  background: "#fff",
                  borderRadius: 999,
                  height: 32,
                  padding: "0 10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "rgba(0,0,0,0.70)",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 800,
                }}
              >
                {lang === "en" ? "EN" : "VI"}
              </button>
              <button
                type="button"
                onClick={closePanel}
                aria-label="Close"
                style={{
                  border: "1px solid rgba(0,0,0,0.10)",
                  background: "#fff",
                  borderRadius: 999,
                  width: 36,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "rgba(0,0,0,0.60)",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>
          </div>

          <div
            ref={scrollRef}
            style={{
              padding: "12px 16px",
              overflow: "auto",
              background: "#fff",
              flex: "1 1 auto",
              minHeight: 0,
            }}
          >
            <PronunciationPanel
              lang={lang}
              targetText={pronTargetText}
              transcript={pronTranscript}
              isRecording={isRecording}
              isSpeechSupported={speechSupported}
              score={pronScore}
              feedbackSummary={speechError || pronSummary}
              feedbackDetail={speechError ? "" : pronDetail}
              onTargetChange={setPronTargetText}
              onStart={startRecording}
              onStop={stopRecording}
              onClear={clearPronunciation}
            />

            {messages.map((m) => {
              const isUser = m.role === "user";
              return (
                <div
                  key={m.id}
                  style={{
                    display: "flex",
                    justifyContent: isUser ? "flex-end" : "flex-start",
                    marginTop: 10,
                  }}
                >
                  <div
                    style={{
                      borderRadius: 16,
                      maxWidth: "86%",
                      background: isUser ? "#111" : "rgba(0,0,0,0.06)",
                      color: isUser ? "rgba(255,255,255,0.92)" : "rgba(0,0,0,0.82)",
                      padding: "10px 12px",
                      fontSize: 12,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {m.text}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div style={{ display: "flex", justifyContent: "flex-start", marginTop: 10 }}>
                <div
                  style={{
                    borderRadius: 16,
                    maxWidth: "86%",
                    background: "rgba(0,0,0,0.06)",
                    padding: "10px 12px",
                    minHeight: 36,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <TypingIndicator />
                </div>
              </div>
            )}

            <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
              {actions.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={a.onClick}
                  title={a.description}
                  style={{
                    borderRadius: 999,
                    border: "1px solid rgba(0,0,0,0.12)",
                    background: "#fff",
                    padding: "6px 10px",
                    fontSize: 12,
                    color: "rgba(0,0,0,0.82)",
                    cursor: "pointer",
                  }}
                >
                  {a.label}
                </button>
              ))}
            </div>

            <div
              style={{
                marginTop: 14,
                borderRadius: 14,
                background: "rgba(0,0,0,0.06)",
                padding: 12,
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(0,0,0,0.70)" }}>
                {lang === "vi" ? "Gợi ý nhanh" : "Care loop"}
              </div>
              <div style={{ fontSize: 11, color: "rgba(0,0,0,0.60)", marginTop: 6 }}>
                {lang === "vi"
                  ? `Mình ghi nhận câu hỏi/lỗi để đội dev sửa sau. Bạn cũng có thể kéo khung, đổi 4 cỡ, và luyện phát âm ngay tại đây.`
                  : `I record questions/faults so we can fix bugs later. You can also drag this Host, switch between 4 sizes, and practice pronunciation right here.`}
              </div>
            </div>
          </div>

          <div
            style={{
              borderTop: "1px solid rgba(0,0,0,0.10)",
              background: "#fff",
              padding: "10px 12px",
              flex: "0 0 auto",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 10,
                borderRadius: 16,
                border: "1px solid rgba(0,0,0,0.12)",
                background: "#fff",
                padding: "10px 12px",
              }}
            >
              <textarea
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder={
                  lang === "vi"
                    ? "Gõ ở đây… (Enter để gửi, Shift+Enter xuống dòng)"
                    : "Type here… (Enter to send, Shift+Enter newline)"
                }
                rows={1}
                style={{
                  width: "100%",
                  resize: "none",
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontSize: 12,
                  color: "rgba(0,0,0,0.85)",
                  lineHeight: "18px",
                  maxHeight: 90,
                  overflow: "auto",
                }}
              />
              <button
                type="button"
                onClick={onSend}
                disabled={!draft.trim()}
                style={{
                  borderRadius: 12,
                  background: !draft.trim() ? "rgba(0,0,0,0.18)" : "#111",
                  color: "#fff",
                  fontSize: 11,
                  padding: "8px 12px",
                  border: "none",
                  cursor: !draft.trim() ? "default" : "pointer",
                  flex: "0 0 auto",
                }}
              >
                {lang === "vi" ? "Gửi" : "Send"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div
      data-mb-host="true"
      style={{
        position: "fixed",
        left: launcherPos.x,
        top: launcherPos.y,
        zIndex: 2147483000,
        fontFamily: fontStack,
      }}
    >
      <button
        type="button"
        onClick={openPanel}
        onMouseDown={(e) => startDrag("launcher", e)}
        aria-label="Open Mercy Host"
        title="Mercy Host"
        style={{
          width: launcherSize,
          height: launcherSize,
          borderRadius: 999,
          border: "1px solid rgba(0,0,0,0.12)",
          background: "#fff",
          boxShadow: "0 10px 26px rgba(0,0,0,0.18)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "move",
        }}
      >
        <div
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TalkingFaceIcon size={launcherFaceSize} isTalking={false} />
        </div>
      </button>
    </div>
  );

  return createPortal(ui, document.body);
}