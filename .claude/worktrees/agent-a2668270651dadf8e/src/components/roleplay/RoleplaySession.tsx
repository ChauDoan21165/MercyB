// FILE: src/components/roleplay/RoleplaySession.tsx

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getLevel } from "@/lib/progression/xpEngine";

type MinimalSpeechRecognition = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((e: unknown) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};
type SpeechRecognitionCtor = new () => MinimalSpeechRecognition;

export type RoleplayScenario = {
  id: string;
  title: string;
  titleVi?: string;
  setup: string;
  setupVi?: string;
  targetVocab?: string[];
  mercyOpener?: string;
  mercyOpenerVi?: string;
};

export type RoleplayCorrection = {
  original: string;
  improved: string;
  noteVi?: string;
};

export type RoleplayTurn = {
  id: string;
  role: "user" | "mercy";
  text: string;
  textVi?: string;
  correction?: RoleplayCorrection;
  createdAt: number;
};

export type RoleplaySessionSummary = {
  scenarioId: string;
  scenarioTitle: string;
  turns: RoleplayTurn[];
  turnCount: number;
  vocabUsed: string[];
  vocabTargetCount: number;
  endedAt: number;
};

type RoleplaySessionProps = {
  scenario: RoleplayScenario;
  userLevel?: "beginner" | "intermediate" | "advanced";
  onEndSession?: (summary: RoleplaySessionSummary) => void;
};

function uid(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 7)}`;
}

// ElevenLabs is now proxied through /api/tts. The API key lives only on the
// server (ELEVENLABS_API_KEY). The frontend may pass an optional voiceId
// override via VITE_ELEVENLABS_VOICE_ID for local experimentation; otherwise
// the server's ELEVENLABS_VOICE_ID default is used.
function getOptionalVoiceIdOverride(): string | undefined {
  const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
  return env?.VITE_ELEVENLABS_VOICE_ID || undefined;
}

function detectVocab(text: string, targets: string[]): string[] {
  if (!text || targets.length === 0) return [];
  const lower = text.toLowerCase();
  return targets.filter((w) => {
    const re = new RegExp(`\\b${w.toLowerCase().replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}\\b`);
    return re.test(lower);
  });
}

function maybeCorrection(
  text: string,
  level: "beginner" | "intermediate" | "advanced"
): RoleplayCorrection | undefined {
  // Lightweight, encouraging mock. Only fires sometimes and only on simple tells.
  const trimmed = text.trim();
  if (!trimmed) return undefined;

  // Capitalize first letter
  if (/^[a-z]/.test(trimmed)) {
    const improved = trimmed[0].toUpperCase() + trimmed.slice(1);
    return {
      original: trimmed,
      improved,
      noteVi: "Câu tiếng Anh thường viết hoa chữ đầu — bạn gần đúng rồi.",
    };
  }

  // Common a/an mismatch (very rough)
  const aAn = trimmed.match(/\ba ([aeiou]\w+)/i);
  if (aAn) {
    const improved = trimmed.replace(/\ba ([aeiou]\w+)/i, `an ${aAn[1]}`);
    return {
      original: trimmed,
      improved,
      noteVi: 'Trước nguyên âm dùng "an" thay vì "a". Nhỏ thôi, không lo.',
    };
  }

  // I am instead of I'm for advanced flow
  if (level !== "beginner" && /\bi am\b/i.test(trimmed)) {
    return {
      original: trimmed,
      improved: trimmed.replace(/\bi am\b/i, "I'm"),
      noteVi: "Trong hội thoại tự nhiên, người bản xứ hay rút gọn “I am” thành “I'm”.",
    };
  }

  return undefined;
}

function mockMercyReply(
  scenario: RoleplayScenario,
  userText: string,
  turnCount: number
): { text: string; textVi?: string } {
  const lower = userText.toLowerCase();
  const targets = scenario.targetVocab ?? [];
  const matched = detectVocab(userText, targets);

  if (turnCount <= 1) {
    return {
      text: `Nice — let's stay in the scene. ${
        matched.length
          ? `I love that you used "${matched[0]}". `
          : ""
      }What happens next from your side?`,
      textVi: "Tốt — mình giữ tình huống nhé. Bạn muốn nói tiếp điều gì?",
    };
  }

  if (lower.includes("?")) {
    return {
      text: "Good question. In this situation I would answer briefly and then ask one back. Try giving a short answer first.",
      textVi: "Câu hỏi hay. Trong tình huống này hãy trả lời ngắn rồi hỏi lại một câu nhé.",
    };
  }

  if (matched.length > 0) {
    return {
      text: `Great — "${matched[0]}" fits perfectly here. Can you add one more detail?`,
      textVi: `Tuyệt — từ “${matched[0]}” rất hợp. Thêm một chi tiết nữa được không?`,
    };
  }

  return {
    text: "Got it. Try one more line — keep it natural, like you're really there.",
    textVi: "Mình hiểu rồi. Thử thêm một câu nữa — nói tự nhiên như đang ở đó thật nhé.",
  };
}

export function RoleplaySession({
  scenario,
  userLevel = "intermediate",
  onEndSession,
}: RoleplaySessionProps) {
  const [started, setStarted] = useState(false);
  const [turns, setTurns] = useState<RoleplayTurn[]>([]);
  const [draft, setDraft] = useState("");
  const [showCorrections, setShowCorrections] = useState(true);
  const [pending, setPending] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);
  const [listening, setListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const lastSpokenIdRef = useRef<string | null>(null);
  const recognitionRef = useRef<MinimalSpeechRecognition | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  const ttsAvailable =
    typeof window !== "undefined" && typeof window.speechSynthesis !== "undefined";

  const micCtor: SpeechRecognitionCtor | null = useMemo(() => {
    if (typeof window === "undefined") return null;
    const w = window as unknown as {
      SpeechRecognition?: SpeechRecognitionCtor;
      webkitSpeechRecognition?: SpeechRecognitionCtor;
    };
    return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
  }, []);
  const micAvailable = micCtor !== null;

  const stopAudio = useCallback(() => {
    const el = audioElRef.current;
    if (el) {
      try {
        el.pause();
      } catch {
        /* ignore */
      }
      audioElRef.current = null;
    }
    if (audioUrlRef.current) {
      try {
        URL.revokeObjectURL(audioUrlRef.current);
      } catch {
        /* ignore */
      }
      audioUrlRef.current = null;
    }
  }, []);

  const speakViaSynth = useCallback(
    (text: string) => {
      if (!ttsAvailable || !text) return;
      try {
        const synth = window.speechSynthesis;
        synth.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = "en-US";
        utter.rate = 1;
        utter.pitch = 1;
        synth.speak(utter);
      } catch {
        /* speech is best-effort; ignore */
      }
    },
    [ttsAvailable]
  );

  const speak = useCallback(
    (text: string) => {
      if (!voiceOn || !text) return;

      // Stop anything currently playing (synth + audio element).
      stopAudio();
      if (ttsAvailable) {
        try {
          window.speechSynthesis.cancel();
        } catch {
          /* ignore */
        }
      }

      const voiceIdOverride = getOptionalVoiceIdOverride();

      // Fire-and-forget; never block chat. Capture token to ignore stale
      // results if the user toggles voice off mid-flight.
      const myToken = Symbol("elevenlabs-req");
      (audioElRef as unknown as { current: { __token?: symbol } | null }).current = { __token: myToken };

      (async () => {
        try {
          const res = await fetch("/api/tts", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "audio/mpeg",
            },
            body: JSON.stringify({
              text,
              ...(voiceIdOverride ? { voiceId: voiceIdOverride } : {}),
            }),
          });

          if (!res.ok) {
            const bodyText = await res.text().catch(() => "<unreadable>");
            console.warn("[tts] proxy non-OK", res.status, bodyText.slice(0, 200));
            throw new Error(`/api/tts ${res.status}`);
          }
          const contentType = res.headers.get("content-type") ?? "";
          if (!contentType.startsWith("audio/")) {
            // Server-side misconfig (e.g. missing key) — fall back to synth.
            const bodyText = await res.text().catch(() => "<unreadable>");
            console.warn("[tts] non-audio response, falling back to synth", bodyText.slice(0, 200));
            throw new Error("non-audio response");
          }
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);

          // If voice was toggled off (or another speak() superseded us)
          // while the request was in flight, drop this response.
          const sentinel = (audioElRef.current as unknown as { __token?: symbol } | null);
          if (!sentinel || sentinel.__token !== myToken) {
            URL.revokeObjectURL(url);
            return;
          }

          const audio = new Audio(url);
          audioUrlRef.current = url;
          audioElRef.current = audio;
          audio.onended = () => {
            if (audioElRef.current === audio) {
              audioElRef.current = null;
            }
            try {
              URL.revokeObjectURL(url);
            } catch {
              /* ignore */
            }
            if (audioUrlRef.current === url) audioUrlRef.current = null;
          };
          audio.onerror = (e) => {
            console.warn("[tts] audio element error — falling back to synth", e);
            if (audioElRef.current === audio) audioElRef.current = null;
            try {
              URL.revokeObjectURL(url);
            } catch {
              /* ignore */
            }
            if (audioUrlRef.current === url) audioUrlRef.current = null;
            // Only fall back to synth if voice is still on (sentinel intact).
            const s = audioElRef.current as unknown as { __token?: symbol } | null;
            if (!s || s.__token === myToken) speakViaSynth(text);
          };
          await audio.play();
        } catch (err) {
          // Network / 4xx / playback rejection → fall back to browser synth,
          // but only if the user hasn't toggled voice off in the meantime.
          console.warn("[tts] proxy path failed — falling back to synth", err);
          const s = audioElRef.current as unknown as { __token?: symbol } | null;
          if (!s || s.__token === myToken) speakViaSynth(text);
        }
      })();
    },
    [voiceOn, ttsAvailable, stopAudio, speakViaSynth]
  );

  // Auto-speak the latest Mercy reply (once per turn).
  useEffect(() => {
    if (!voiceOn) return;
    const last = turns[turns.length - 1];
    if (!last || last.role !== "mercy") return;
    if (lastSpokenIdRef.current === last.id) return;
    lastSpokenIdRef.current = last.id;
    speak(last.text);
  }, [turns, voiceOn, speak]);

  // When voice toggles off, stop any in-flight speech (both paths).
  useEffect(() => {
    if (voiceOn) return;
    stopAudio();
    if (!ttsAvailable) return;
    try {
      window.speechSynthesis.cancel();
    } catch {
      /* ignore */
    }
  }, [voiceOn, ttsAvailable, stopAudio]);

  // Cleanup on unmount.
  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.stop();
      } catch {
        /* ignore */
      }
      stopAudio();
      if (typeof window !== "undefined" && window.speechSynthesis) {
        try {
          window.speechSynthesis.cancel();
        } catch {
          /* ignore */
        }
      }
    };
  }, [stopAudio]);

  const toggleMic = useCallback(() => {
    if (!micCtor) return;
    if (listening) {
      try {
        recognitionRef.current?.stop();
      } catch {
        /* ignore */
      }
      setListening(false);
      return;
    }
    try {
      const rec = new micCtor();
      rec.lang = "en-US";
      rec.interimResults = false;
      rec.continuous = false;
      rec.onresult = (e) => {
        let transcript = "";
        for (let i = 0; i < e.results.length; i++) {
          const alt = e.results[i]?.[0];
          if (alt?.transcript) transcript += `${alt.transcript} `;
        }
        transcript = transcript.trim();
        if (transcript) {
          setDraft((d) => (d ? `${d} ${transcript}` : transcript));
        }
      };
      rec.onerror = () => setListening(false);
      rec.onend = () => setListening(false);
      recognitionRef.current = rec;
      rec.start();
      setListening(true);
    } catch {
      setListening(false);
    }
  }, [micCtor, listening]);

  // Local temp progression — swap to xpEngine + real streak source later.
  const [progressionTotalXP] = useState(0);
  const [progressionStreak] = useState(3);
  const progressionLevel = getLevel(progressionTotalXP).level;

  const targets = scenario.targetVocab ?? [];

  const vocabUsed = useMemo(() => {
    const used = new Set<string>();
    for (const t of turns) {
      if (t.role !== "user") continue;
      detectVocab(t.text, targets).forEach((w) => used.add(w));
    }
    return Array.from(used);
  }, [turns, targets]);

  const userTurnCount = useMemo(
    () => turns.filter((t) => t.role === "user").length,
    [turns]
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [turns, pending]);

  function startSession() {
    const opener = scenario.mercyOpener ?? `Let's begin. ${scenario.setup}`;
    const openerVi = scenario.mercyOpenerVi ?? scenario.setupVi;
    setTurns([
      {
        id: uid("t"),
        role: "mercy",
        text: opener,
        textVi: openerVi,
        createdAt: Date.now(),
      },
    ]);
    setStarted(true);
  }

  async function handleSend() {
    const text = draft.trim();
    if (!text || pending) return;

    const correction = showCorrections ? maybeCorrection(text, userLevel) : undefined;

    const userTurn: RoleplayTurn = {
      id: uid("t"),
      role: "user",
      text,
      correction,
      createdAt: Date.now(),
    };

    setTurns((prev) => [...prev, userTurn]);
    setDraft("");
    setPending(true);

    // Simulate a small delay so the UI feels conversational.
    const reply = mockMercyReply(scenario, text, userTurnCount + 1);
    await new Promise((r) => setTimeout(r, 450));

    const mercyTurn: RoleplayTurn = {
      id: uid("t"),
      role: "mercy",
      text: reply.text,
      textVi: reply.textVi,
      createdAt: Date.now(),
    };

    setTurns((prev) => [...prev, mercyTurn]);
    setPending(false);
  }

  function handleEnd() {
    const summary: RoleplaySessionSummary = {
      scenarioId: scenario.id,
      scenarioTitle: scenario.title,
      turns,
      turnCount: userTurnCount,
      vocabUsed,
      vocabTargetCount: targets.length,
      endedAt: Date.now(),
    };
    onEndSession?.(summary);
  }

  return (
    <div className="flex flex-col h-full max-h-[100dvh] w-full max-w-2xl mx-auto bg-background text-foreground">
      {/* Header — scenario title + setup */}
      <header className="px-4 pt-4 pb-3 border-b border-border/60">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-base font-semibold truncate">
              {scenario.title}
            </h2>
            {scenario.titleVi && (
              <p className="text-xs text-muted-foreground truncate">
                {scenario.titleVi}
              </p>
            )}
          </div>
          {started && (
            <button
              type="button"
              onClick={handleEnd}
              className="shrink-0 text-xs px-3 py-1.5 rounded-full border border-border hover:bg-muted transition-colors"
            >
              End Session
            </button>
          )}
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground">
          Level {progressionLevel} • 🔥 {progressionStreak}-day streak
        </p>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          {scenario.setup}
        </p>
        {scenario.setupVi && (
          <p className="text-xs text-muted-foreground/80 leading-relaxed mt-1">
            {scenario.setupVi}
          </p>
        )}

        {started && (
          <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground">
            <span>Turns: {userTurnCount}</span>
            {targets.length > 0 && (
              <span>
                Vocab: {vocabUsed.length}/{targets.length}
              </span>
            )}
            <label className="ml-auto inline-flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showCorrections}
                onChange={(e) => setShowCorrections(e.target.checked)}
                className="h-3 w-3 accent-primary"
              />
              <span>Gợi ý sửa lỗi</span>
            </label>
            {ttsAvailable && (
              <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={voiceOn}
                  onChange={(e) => setVoiceOn(e.target.checked)}
                  className="h-3 w-3 accent-primary"
                />
                <span>{voiceOn ? "🔊" : "🔈"} Voice</span>
              </label>
            )}
          </div>
        )}
      </header>

      {/* Body */}
      {!started ? (
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 text-center">
          <p className="text-sm text-muted-foreground mb-4 max-w-sm">
            Sẵn sàng nhập vai? Nói tự nhiên, sai cũng không sao — Mercy sẽ nhẹ
            nhàng gợi ý.
          </p>
          {targets.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-1.5 justify-center max-w-sm">
              {targets.map((w) => (
                <span
                  key={w}
                  className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                >
                  {w}
                </span>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={startSession}
            className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Start Roleplay
          </button>
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
        >
          {turns.map((turn) => (
            <TurnBubble
              key={turn.id}
              turn={turn}
              showCorrections={showCorrections}
              targets={targets}
              onReplay={
                turn.role === "mercy" && ttsAvailable
                  ? () => speak(turn.text)
                  : undefined
              }
            />
          ))}
          {pending && (
            <div className="flex items-start">
              <div className="bg-muted text-muted-foreground rounded-2xl px-3 py-2 text-sm">
                <span className="inline-flex gap-1">
                  <Dot delay={0} />
                  <Dot delay={150} />
                  <Dot delay={300} />
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Composer */}
      {started && (
        <div className="border-t border-border/60 px-3 py-3 bg-background">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-end gap-2"
          >
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Nói gì đó bằng tiếng Anh…"
              rows={1}
              className="flex-1 resize-none rounded-2xl border border-border bg-background px-3 py-2 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/40 max-h-32"
            />
            {micAvailable && (
              <button
                type="button"
                onClick={toggleMic}
                aria-pressed={listening}
                aria-label={listening ? "Stop microphone" : "Speak"}
                title={listening ? "Đang nghe… nhấn để dừng" : "Nhấn để nói"}
                className={`shrink-0 px-3 py-2 rounded-full border text-sm transition-colors ${
                  listening
                    ? "border-red-500 bg-red-500/10 text-red-600 dark:text-red-400 animate-pulse"
                    : "border-border hover:bg-muted"
                }`}
              >
                🎤
              </button>
            )}
            <button
              type="submit"
              disabled={!draft.trim() || pending}
              className="shrink-0 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function TurnBubble({
  turn,
  showCorrections,
  targets,
  onReplay,
}: {
  turn: RoleplayTurn;
  showCorrections: boolean;
  targets: string[];
  onReplay?: () => void;
}) {
  const isUser = turn.role === "user";
  const matched = isUser ? detectVocab(turn.text, targets) : [];

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} max-w-[85%] md:max-w-[75%]`}>
        <div
          className={`rounded-2xl px-3.5 py-2 text-sm leading-relaxed shadow-sm ${
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground"
          }`}
        >
          <p className="whitespace-pre-wrap">{turn.text}</p>
          {turn.textVi && !isUser && (
            <p className="mt-1 text-[11px] opacity-70">{turn.textVi}</p>
          )}
        </div>

        {!isUser && onReplay && (
          <button
            type="button"
            onClick={onReplay}
            className="mt-1 text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            aria-label="Replay voice"
          >
            🔁 Replay voice
          </button>
        )}

        {isUser && matched.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1 justify-end">
            {matched.map((w) => (
              <span
                key={w}
                className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
              >
                ✓ {w}
              </span>
            ))}
          </div>
        )}

        {isUser && showCorrections && turn.correction && (
          <CorrectionCard correction={turn.correction} />
        )}
      </div>
    </div>
  );
}

function CorrectionCard({ correction }: { correction: RoleplayCorrection }) {
  return (
    <div className="mt-1.5 max-w-full rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 px-3 py-2 text-xs">
      <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-medium mb-0.5">
        <span aria-hidden>✨</span>
        <span>Gợi ý nhẹ</span>
      </div>
      <p className="text-foreground/80">
        <span className="line-through opacity-60">{correction.original}</span>
      </p>
      <p className="text-foreground mt-0.5">{correction.improved}</p>
      {correction.noteVi && (
        <p className="mt-1 text-muted-foreground text-[11px] leading-relaxed">
          {correction.noteVi}
        </p>
      )}
    </div>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <span
      className="inline-block w-1.5 h-1.5 rounded-full bg-current animate-pulse"
      style={{ animationDelay: `${delay}ms` }}
    />
  );
}

export default RoleplaySession;
