import { useEffect, useState } from "react";
import { Info } from "lucide-react";

const messages = [
  {
    id: "welcome",
    en: "Welcome to Mercy Blade! Tap a keyword bubble to start exploring a room.",
    vi: "Chào mừng bạn đến với Mercy Blade! Hãy nhấp vào bong bóng từ khóa để bắt đầu khám phá phòng.",
  },
  {
    id: "rooms",
    en: "Each room is a mini library. Scroll keywords, then tap to see the essay and audio.",
    vi: "Mỗi phòng là một thư viện nhỏ. Hãy cuộn danh sách từ khóa, sau đó chạm để xem bài viết và nghe audio.",
  },
  {
    id: "guide",
    en: "Not sure where to go? Open the Tier Map at the top right and follow your curiosity.",
    vi: "Chưa biết bắt đầu từ đâu? Mở Tier Map ở góc trên bên phải và đi theo sự tò mò của bạn.",
  },
];

export function CornerTalker() {
  const [open, setOpen] = useState(true);
  const [step, setStep] = useState(0);
  const [talking, setTalking] = useState(true);

  useEffect(() => {
    // cycle messages every 18s, pause talking between
    const interval = setInterval(() => {
      setTalking(true);
      setStep((prev) => (prev + 1) % messages.length);
      setTimeout(() => setTalking(false), 5000);
    }, 18000);
    // stop mouth after initial 5s
    const timeout = setTimeout(() => setTalking(false), 5000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const msg = messages[step];

  if (!open) {
    // collapsed pill (tiny face only)
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
          <div
            className="mb-mouth absolute bottom-2 left-1/2 -translate-x-1/2 w-3 h-[3px] rounded-full bg-foreground"
          />
        </div>
      </button>
    );
  }

  return (
    <div className="fixed bottom-20 right-4 z-40 flex gap-3 items-end max-w-xs sm:max-w-sm">
      {/* speech bubble */}
      <div className="bg-card/95 backdrop-blur-sm shadow-xl border border-border rounded-2xl px-3.5 py-2.5 text-xs leading-snug text-foreground">
        <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-primary">
          <Info className="w-3 h-3" />
          <span>Mercy Guide</span>
        </div>
        <p className="mb-1">
          <span className="font-semibold text-foreground">EN: </span>
          {msg.en}
        </p>
        <p>
          <span className="font-semibold text-foreground">VI: </span>
          {msg.vi}
        </p>
        <div className="mt-2 flex items-center justify-between gap-2">
          <button
            className="text-[11px] underline text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setStep((s) => (s + 1) % messages.length)}
          >
            Next tip
          </button>
          <button
            className="text-[11px] text-muted-foreground/70 hover:text-muted-foreground transition-colors"
            onClick={() => setOpen(false)}
          >
            Hide
          </button>
        </div>
      </div>

      {/* tiny cartoon face */}
      <div className="relative w-11 h-11 rounded-full bg-gradient-to-tr from-[hsl(var(--rainbow-magenta))] to-[hsl(var(--rainbow-cyan))] shadow-lg flex items-center justify-center shrink-0">
        {/* eyes */}
        <div className="absolute inset-x-2 top-2 flex justify-between text-[7px] text-foreground">
          <span>•</span>
          <span>•</span>
        </div>
        {/* mouth */}
        <div
          className={
            "mb-mouth absolute bottom-2 left-1/2 -translate-x-1/2 w-3.5 h-[4px] rounded-full bg-foreground " +
            (talking ? "mb-mouth-talking" : "")
          }
        />
      </div>
    </div>
  );
}
