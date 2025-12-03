import { useEffect, useRef, useState } from "react";
import { Info, Volume2, VolumeX, RotateCw } from "lucide-react";

type Props = {
  roomId: string;
  introEn: string;
  introVi: string;
  introAudioUrl?: string;
};

const tips = [
  {
    id: "keywords",
    en: "Tap a keyword bubble to jump to the topic you care about most.",
    vi: "Hãy nhấp vào bong bóng từ khóa để đi thẳng tới chủ đề bạn quan tâm nhất.",
  },
  {
    id: "audio",
    en: "You can read and listen together to make the ideas sink in deeper.",
    vi: "Bạn có thể vừa đọc vừa nghe để ý tưởng thấm sâu hơn.",
  },
];

export function CornerTalker({ roomId, introEn, introVi, introAudioUrl }: Props) {
  const [open, setOpen] = useState(true);
  const [talking, setTalking] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const [enabled, setEnabled] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load user preference
  useEffect(() => {
    const stored = window.localStorage.getItem("mb_talker_enabled");
    if (stored === "false") setEnabled(false);
  }, []);

  // Set up audio element
  useEffect(() => {
    if (!introAudioUrl) return;
    const audio = new Audio(introAudioUrl);
    audioRef.current = audio;

    const stopTalking = () => setTalking(false);
    audio.addEventListener("ended", stopTalking);
    audio.addEventListener("pause", stopTalking);

    return () => {
      audio.pause();
      audio.removeEventListener("ended", stopTalking);
      audio.removeEventListener("pause", stopTalking);
    };
  }, [introAudioUrl]);

  // Auto-play intro once per room when enabled
  useEffect(() => {
    if (!enabled || !introAudioUrl) return;
    const key = `mb_talker_intro_played_${roomId}`;
    if (window.sessionStorage.getItem(key) === "yes") return;

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
      setTalking(true);
      window.sessionStorage.setItem(key, "yes");
      setTimeout(() => setTalking(false), 6000);
    }
  }, [roomId, enabled, introAudioUrl]);

  // Cycle tips quietly
  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((i) => (i + 1) % tips.length);
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  const currentTip = tips[tipIndex];

  const handleReplayIntro = () => {
    if (!introAudioUrl || !audioRef.current || !enabled) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
    setTalking(true);
    setTimeout(() => setTalking(false), 6000);
  };

  const handleToggleEnabled = () => {
    const next = !enabled;
    setEnabled(next);
    window.localStorage.setItem("mb_talker_enabled", next ? "true" : "false");
    if (!next && audioRef.current) {
      audioRef.current.pause();
    }
  };

  if (!open) {
    // Collapsed pill
    return (
      <button
        className="fixed bottom-20 right-4 z-40 flex items-center justify-center rounded-full bg-card/90 shadow-lg border border-border w-10 h-10 hover:shadow-xl transition"
        onClick={() => setOpen(true)}
        aria-label="Open Mercy Blade guide"
      >
        <div className="relative w-7 h-7 rounded-full bg-gradient-to-tr from-[hsl(var(--rainbow-magenta))] to-[hsl(var(--rainbow-cyan))] flex items-center justify-center">
          <div className="absolute inset-x-2 top-2 flex justify-between text-[6px] text-foreground">
            <span>•</span>
            <span>•</span>
          </div>
          <div className="mb-mouth absolute bottom-2 left-1/2 -translate-x-1/2 w-3 h-[3px] rounded-full bg-foreground" />
        </div>
      </button>
    );
  }

  return (
    <div className="fixed bottom-20 right-4 z-40 flex gap-3 items-end max-w-xs sm:max-w-sm">
      {/* Speech bubble */}
      <div className="bg-card/95 backdrop-blur-sm shadow-xl border border-border rounded-2xl px-3.5 py-2.5 text-xs leading-snug text-foreground">
        <div className="mb-1 flex items-center justify-between gap-1.5 text-[11px] font-semibold text-primary">
          <span className="inline-flex items-center gap-1">
            <Info className="w-3 h-3" />
            <span>Mercy Guide</span>
          </span>
          <button
            onClick={handleToggleEnabled}
            className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
          >
            {enabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
          </button>
        </div>

        {/* Room intro text */}
        <p className="mb-1">
          <span className="font-semibold text-foreground">EN: </span>
          {introEn}
        </p>
        <p className="mb-2">
          <span className="font-semibold text-foreground">VI: </span>
          {introVi}
        </p>

        {/* Rotating tip */}
        <p className="text-[11px] text-muted-foreground mb-2">
          <span className="font-semibold">Tip: </span>
          {currentTip.en} / {currentTip.vi}
        </p>

        <div className="flex items-center justify-between gap-2">
          {introAudioUrl && (
            <button
              className="text-[11px] inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
              onClick={handleReplayIntro}
              disabled={!enabled}
            >
              <RotateCw className="w-3 h-3" />
              Replay intro
            </button>
          )}
          <button
            className="text-[11px] text-muted-foreground/70 hover:text-muted-foreground transition-colors"
            onClick={() => setOpen(false)}
          >
            Hide
          </button>
        </div>
      </div>

      {/* Tiny cartoon face */}
      <div className="relative w-11 h-11 rounded-full bg-gradient-to-tr from-[hsl(var(--rainbow-magenta))] to-[hsl(var(--rainbow-cyan))] shadow-lg flex items-center justify-center shrink-0">
        <div className="absolute inset-x-2 top-2 flex justify-between text-[7px] text-foreground">
          <span>•</span>
          <span>•</span>
        </div>
        <div
          className={
            "mb-mouth absolute bottom-2 left-1/2 -translate-x-1/2 w-3.5 h-[4px] rounded-full bg-foreground " +
            (enabled && talking ? "mb-mouth-talking" : "")
          }
        />
      </div>
    </div>
  );
}
