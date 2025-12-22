// src/pages/LandingPage.tsx — v2025-12-21-87.2-AUDIO-AVATAR
import { useMemo, useRef, useState } from "react";
import homepage from "@/data/homepage-config.json";

type Lang = "en" | "vi";

function pickText(obj: any, lang: Lang): string {
  if (!obj) return "";
  return (obj[lang] ?? obj.en ?? obj.vi ?? "") as string;
}

function pickAudio(obj: any, lang: Lang): string {
  if (!obj) return "";
  return (obj[lang] ?? obj.en ?? obj.vi ?? "") as string;
}

function safeLower(s: string) {
  return (s || "").toLowerCase();
}

/**
 * Simple “talking face” avatar that animates while audio is playing.
 * Keeps native audio controls.
 */
function AudioWithAvatar({
  src,
  label,
}: {
  src: string;
  label?: string;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-3">
      {/* Local keyframes (no Tailwind config needed) */}
      <style>{`
        @keyframes mbMouthTalk {
          0%   { transform: scaleY(0.35); }
          50%  { transform: scaleY(1.10); }
          100% { transform: scaleY(0.35); }
        }
        @keyframes mbCheekBounce {
          0%   { transform: translateY(0px); }
          50%  { transform: translateY(-1px); }
          100% { transform: translateY(0px); }
        }
      `}</style>

      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="text-xs text-slate-300">
          {label ? (
            <>
              Audio: <span className="text-slate-200">{label}</span>
            </>
          ) : (
            <>
              Audio: <span className="text-slate-200">{src.split("/").pop()}</span>
            </>
          )}
        </div>

        {/* Avatar */}
        <div
          className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950/50 px-2 py-1"
          title={isPlaying ? "Playing" : "Paused"}
          style={{
            animation: isPlaying ? "mbCheekBounce 600ms ease-in-out infinite" : "none",
          }}
        >
          <div className="relative h-8 w-8 overflow-hidden rounded-full border border-slate-700 bg-slate-900">
            {/* Face */}
            <svg viewBox="0 0 64 64" className="h-full w-full">
              <defs>
                <radialGradient id="g" cx="35%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#fde68a" />
                  <stop offset="65%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </radialGradient>
              </defs>
              <circle cx="32" cy="32" r="28" fill="url(#g)" />
              {/* Eyes */}
              <circle cx="23" cy="28" r="3" fill="#0f172a" />
              <circle cx="41" cy="28" r="3" fill="#0f172a" />
              {/* Cheeks */}
              <circle cx="18" cy="36" r="3" fill="#fb7185" opacity="0.35" />
              <circle cx="46" cy="36" r="3" fill="#fb7185" opacity="0.35" />
              {/* Mouth (animated by scaling) */}
              <g transform="translate(0,0)">
                <rect
                  x="26"
                  y="40"
                  width="12"
                  height="8"
                  rx="4"
                  fill="#0f172a"
                  style={{
                    transformOrigin: "32px 44px",
                    animation: isPlaying ? "mbMouthTalk 180ms ease-in-out infinite" : "none",
                  }}
                />
                {/* little tongue highlight */}
                <rect
                  x="29"
                  y="44"
                  width="6"
                  height="3"
                  rx="1.5"
                  fill="#fb7185"
                  opacity={isPlaying ? 0.7 : 0.0}
                />
              </g>
            </svg>
          </div>

          <div className="text-[11px] text-slate-300">
            {isPlaying ? "talking…" : "quiet"}
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        controls
        preload="none"
        src={src}
        style={{ width: "100%" }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="mt-2 text-[11px] text-slate-400">
        If audio does not play, check file exists in <span className="text-slate-300">public/audio/</span>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [lang, setLang] = useState<Lang>("en");
  const [q, setQ] = useState("");

  const sections = (homepage as any)?.sections ?? [];

  const filtered = useMemo(() => {
    const query = safeLower(q).trim();
    if (!query) return sections;

    return sections.filter((sec: any) => {
      const title = pickText(sec?.title, lang);
      const body = pickText(sec?.body, lang);
      const t2 = pickText(sec?.title, lang === "en" ? "vi" : "en");
      const b2 = pickText(sec?.body, lang === "en" ? "vi" : "en");
      const hay = safeLower([title, body, t2, b2].join(" "));
      return hay.includes(query);
    });
  }, [q, lang, sections]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto w-full max-w-[640px] px-4 py-6">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-3">
          <div className="text-lg font-semibold tracking-tight">
            {(homepage as any)?.name ?? "Mercy Blade"}
          </div>

          <div className="flex items-center gap-2">
            <button
              className={`rounded-full border px-3 py-1 text-sm hover:bg-slate-900 ${
                lang === "en" ? "border-slate-500" : "border-slate-700"
              }`}
              onClick={() => setLang("en")}
              aria-pressed={lang === "en"}
              title="English"
            >
              EN
            </button>
            <button
              className={`rounded-full border px-3 py-1 text-sm hover:bg-slate-900 ${
                lang === "vi" ? "border-slate-500" : "border-slate-700"
              }`}
              onClick={() => setLang("vi")}
              aria-pressed={lang === "vi"}
              title="Tiếng Việt"
            >
              VI
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={lang === "en" ? "Search keywords..." : "Tìm theo từ khóa..."}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-slate-500"
          />
          <div className="mt-2 text-xs text-slate-400">
            {lang === "en"
              ? `Showing ${filtered.length} sections`
              : `Đang hiển thị ${filtered.length} mục`}
          </div>
        </div>

        {/* Sections */}
        <div className="mt-4 space-y-4">
          {filtered.map((sec: any) => {
            const bg = sec?.background_color ?? "#0b1220";
            const headingColor = sec?.heading_color ?? "#E2E8F0";
            const accent = sec?.accent_color ?? "#38BDF8";

            const title = pickText(sec?.title, lang);
            const body = pickText(sec?.body, lang);
            const audioFile = pickAudio(sec?.audio, lang);

            return (
              <section
                key={sec?.id ?? title}
                className="rounded-2xl border border-slate-800 p-4 shadow-sm"
                style={{ background: bg }}
              >
                <div className="flex items-start justify-between gap-3">
                  <h2
                    className="text-base font-semibold leading-snug"
                    style={{ color: headingColor }}
                  >
                    {title || "(untitled)"}
                  </h2>

                  {sec?.id ? (
                    <span
                      className="rounded-full px-2 py-1 text-[11px]"
                      style={{
                        color: headingColor,
                        border: `1px solid ${accent}`,
                      }}
                      title={sec.id}
                    >
                      {sec.id}
                    </span>
                  ) : null}
                </div>

                {/* ✅ FIX: make body text clearly visible on light section backgrounds */}
                {body ? (
                  <div
                    className="mt-3 whitespace-pre-wrap text-sm leading-relaxed"
                    style={{
                      color: "#0F172A", // slate-900 (readable on your pastel cards)
                      opacity: 0.95,
                    }}
                  >
                    {body}
                  </div>
                ) : null}

                {/* Audio */}
                <div className="mt-4">
                  {audioFile ? (
                    <AudioWithAvatar
                      src={`/audio/${audioFile}`}
                      label={audioFile}
                    />
                  ) : (
                    <div className="text-xs text-slate-400">
                      {lang === "en"
                        ? "No audio configured for this section."
                        : "Mục này chưa có audio."}
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>

        {/* Bottom quick links */}
        <div className="mt-8 flex flex-wrap gap-2">
          <a
            className="rounded-full border border-slate-700 px-3 py-2 text-xs hover:bg-slate-900"
            href="/free"
          >
            {lang === "en" ? "Go to Free Rooms" : "Vào Free Rooms"}
          </a>
        </div>
      </div>
    </div>
  );
}
