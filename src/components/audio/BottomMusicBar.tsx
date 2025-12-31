// src/components/audio/BottomMusicBar.tsx
// MB-BLUE-100.3 — 2025-12-31 (+0700)
//
// BOTTOM MUSIC BAR (LOCKED):
// - Music bar is ALWAYS entertainment-only (no learning audio).
// - Bar layout: LEFT 3/4 = music controls, RIGHT 1/4 = zoom + future tiny dots.
// - Music controls ONLY: All | MB Songs | ♥ | play face | track select | progress + time | volume
// - NO extra words inside bar (no "Mercy Blade", no "Zoom", no labels).
// - Progress bar is the ONLY element allowed to stretch when bar width increases.
// - Zoom MUST be global: set CSS var --mb-essay-zoom AND data-mb-zoom on :root, persist in localStorage.
//
// FIX (100.3):
// - VISUAL ALIGNMENT: music bar now uses the same "page ruler" as rooms/feedback:
//   max-w-[980px] + px-4 md:px-6.
// - This stops the bottom bar from being wider than the feedback box and prevents stick-out.
// - (Yes: we intentionally mount as fixed here to guarantee identical alignment everywhere.)

import React, { useEffect, useMemo, useRef, useState } from "react";

type TabId = "all" | "mb" | "fav";

type Track = {
  id: string;
  title: string;
  src: string;
  group: "all" | "mb";
};

const LS_TAB = "mb.music.tab";
const LS_TRACK = "mb.music.trackId";
const LS_VOL = "mb.music.vol";
const LS_ZOOM = "mb.ui.zoom";
const LS_FAV = "mb.music.fav";

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function formatTime(sec: number) {
  if (!isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function getInitialNumber(key: string, fallback: number) {
  try {
    const v = localStorage.getItem(key);
    if (v == null) return fallback;
    const n = Number(v);
    return isFinite(n) ? n : fallback;
  } catch {
    return fallback;
  }
}

function getInitialString(key: string, fallback: string) {
  try {
    const v = localStorage.getItem(key);
    return v == null ? fallback : v;
  } catch {
    return fallback;
  }
}

function getInitialFav(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(LS_FAV);
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

// ✅ Global zoom: BOTH mechanisms (RoomRenderer may listen to either)
function applyGlobalZoom(pct: number) {
  const safe = clamp(Math.round(pct), 60, 140);
  document.documentElement.style.setProperty("--mb-essay-zoom", String(safe));
  document.documentElement.setAttribute("data-mb-zoom", String(safe));
  try {
    localStorage.setItem(LS_ZOOM, String(safe));
  } catch {}
}

// RAF ticker for time updates while playing
function useRaf(active: boolean, cb: () => void) {
  const rafRef = useRef<number | null>(null);
  useEffect(() => {
    if (!active) return;
    const tick = () => {
      cb();
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);
}

function TalkingFaceIcon({ playing }: { playing: boolean }) {
  // Mouth opens while playing
  return (
    <div
      aria-hidden="true"
      style={{
        width: 28,
        height: 28,
        borderRadius: 9999,
        border: "1px solid rgba(0,0,0,0.14)",
        background: "rgba(255,255,255,0.92)",
        display: "grid",
        placeItems: "center",
      }}
    >
      <div style={{ position: "relative", width: 18, height: 18 }}>
        {/* eyes */}
        <div
          style={{
            position: "absolute",
            left: 4,
            top: 6,
            width: 2,
            height: 2,
            borderRadius: 9999,
            background: "rgba(0,0,0,0.55)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 4,
            top: 6,
            width: 2,
            height: 2,
            borderRadius: 9999,
            background: "rgba(0,0,0,0.55)",
          }}
        />
        {/* cheeks */}
        <div
          style={{
            position: "absolute",
            left: 1,
            top: 9,
            width: 3,
            height: 3,
            borderRadius: 9999,
            background: "rgba(255, 120, 160, 0.28)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 1,
            top: 9,
            width: 3,
            height: 3,
            borderRadius: 9999,
            background: "rgba(255, 120, 160, 0.28)",
          }}
        />
        {/* mouth */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            bottom: 3,
            width: 9,
            height: playing ? 6 : 2,
            borderRadius: 9999,
            background: "rgba(0,0,0,0.45)",
            transition: "height 120ms ease",
          }}
        />
      </div>
    </div>
  );
}

export default function BottomMusicBar() {
  // Tracks (UI is locked; you can swap sources/titles only)
  const tracks: Track[] = useMemo(
    () => [
      {
        id: "strings_of_time",
        title: "Strings of Time",
        src: "/music/2016-05-06_-_Strings_of_Time_-_David_Fesliyan_1.mp3",
        group: "all",
      },
      {
        id: "land_of_8_bits",
        title: "Land of 8 Bits",
        src: "/music/2019-01-10_-_Land_of_8_Bits_-_Stephen_Bennett_-_FesliyanStudios.com-2.mp3",
        group: "all",
      },
      // MB songs subset
      {
        id: "mb_theme_1",
        title: "MB Theme 1",
        src: "/music/2015-11-08_-_Peace_-_David_Fesliyan-2.mp3",
        group: "mb",
      },
    ],
    []
  );

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [tab, setTab] = useState<TabId>(() => {
    const v = getInitialString(LS_TAB, "all");
    return v === "all" || v === "mb" || v === "fav" ? (v as TabId) : "all";
  });

  const [favorites, setFavorites] = useState<Record<string, boolean>>(() => getInitialFav());

  const visibleTracks = useMemo(() => {
    if (tab === "mb") return tracks.filter((t) => t.group === "mb");
    if (tab === "fav") return tracks.filter((t) => favorites[t.id]);
    return tracks;
  }, [tab, tracks, favorites]);

  const [trackId, setTrackId] = useState<string>(() => {
    const saved = getInitialString(LS_TRACK, tracks[0]?.id ?? "");
    return tracks.some((t) => t.id === saved) ? saved : tracks[0]?.id ?? "";
  });

  const track = useMemo(() => tracks.find((t) => t.id === trackId) ?? tracks[0], [tracks, trackId]);

  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);

  const [vol, setVol] = useState<number>(() => clamp(getInitialNumber(LS_VOL, 0.6), 0, 1));
  const [zoomPct, setZoomPct] = useState<number>(() => clamp(getInitialNumber(LS_ZOOM, 100), 60, 140));

  // Init audio once
  useEffect(() => {
    const a = new Audio();
    a.preload = "metadata";
    a.volume = vol;
    audioRef.current = a;

    const onLoaded = () => setDuration(isFinite(a.duration) ? a.duration : 0);
    const onEnded = () => setPlaying(false);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    a.addEventListener("loadedmetadata", onLoaded);
    a.addEventListener("ended", onEnded);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);

    applyGlobalZoom(zoomPct);

    return () => {
      a.pause();
      a.src = "";
      a.removeEventListener("loadedmetadata", onLoaded);
      a.removeEventListener("ended", onEnded);
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist tab
  useEffect(() => {
    try {
      localStorage.setItem(LS_TAB, tab);
    } catch {}
  }, [tab]);

  // Persist favorites
  useEffect(() => {
    try {
      localStorage.setItem(LS_FAV, JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  // Sync volume
  useEffect(() => {
    const a = audioRef.current;
    if (a) a.volume = vol;
    try {
      localStorage.setItem(LS_VOL, String(vol));
    } catch {}
  }, [vol]);

  // Sync track source (and preserve play state)
  useEffect(() => {
    const a = audioRef.current;
    if (!a || !track) return;

    const wasPlaying = !a.paused && !a.ended;
    a.pause();
    setPlaying(false);
    setDuration(0);
    setCurrent(0);

    a.src = track.src;
    a.load();

    try {
      localStorage.setItem(LS_TRACK, track.id);
    } catch {}

    if (wasPlaying) a.play().catch(() => {});
  }, [track]);

  // Update time while playing
  useRaf(playing, () => {
    const a = audioRef.current;
    if (!a) return;
    setCurrent(a.currentTime || 0);
    const d = isFinite(a.duration) ? a.duration : 0;
    if (d !== duration) setDuration(d);
  });

  const togglePlay = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) a.play().catch(() => {});
    else a.pause();
  };

  const seekToRatio = (ratio: number) => {
    const a = audioRef.current;
    if (!a) return;
    const d = isFinite(a.duration) ? a.duration : 0;
    if (!d) return;
    a.currentTime = clamp(ratio, 0, 1) * d;
    setCurrent(a.currentTime);
  };

  const toggleFavCurrent = () => {
    if (!track) return;
    setFavorites((prev) => ({ ...prev, [track.id]: !prev[track.id] }));
  };

  const isFav = track ? !!favorites[track.id] : false;

  const onZoomChange = (pct: number) => {
    const safe = clamp(Math.round(pct), 60, 140);
    setZoomPct(safe);
    applyGlobalZoom(safe);
  };

  // ---------- INTERNAL NO-OVERFLOW GUARANTEE ----------
  const box: React.CSSProperties = {
    width: "100%",
    border: "1px solid rgba(0,0,0,0.14)",
    background: "rgba(255,255,255,0.94)",
    backdropFilter: "blur(10px)",
    borderRadius: 18,
    boxShadow: "0 -16px 40px rgba(0,0,0,0.10)",
    padding: "10px 12px",
    overflow: "hidden",
    clipPath: "inset(0 round 18px)",
  };

  const row: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "3fr 1fr",
    gap: 10,
    alignItems: "center",
    minWidth: 0,
  };

  const left: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    minWidth: 0,
    overflow: "hidden",
  };

  const right: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 10,
    minWidth: 0,
    overflow: "hidden",
  };

  const pill: React.CSSProperties = {
    padding: "8px 14px",
    borderRadius: 9999,
    border: "1px solid rgba(0,0,0,0.14)",
    background: "rgba(255,255,255,0.90)",
    fontWeight: 800,
    fontSize: 14,
    cursor: "pointer",
    userSelect: "none",
    whiteSpace: "nowrap",
    flex: "0 0 auto",
  };

  const pillActive: React.CSSProperties = {
    ...pill,
    background: "rgba(77,184,255,0.18)",
  };

  const iconPill: React.CSSProperties = {
    width: 40,
    height: 36,
    borderRadius: 9999,
    border: "1px solid rgba(0,0,0,0.14)",
    background: "rgba(255,255,255,0.90)",
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
    userSelect: "none",
    flex: "0 0 auto",
  };

  const selectStyle: React.CSSProperties = {
    height: 36,
    borderRadius: 9999,
    border: "1px solid rgba(0,0,0,0.14)",
    padding: "0 14px",
    background: "rgba(255,255,255,0.92)",
    fontWeight: 800,
    fontSize: 14,
    outline: "none",
    maxWidth: 220,
    flex: "0 0 auto",
  };

  const progressWrap: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    minWidth: 0,
    flex: "1 1 auto",
    overflow: "hidden",
  };

  const progressSlider: React.CSSProperties = {
    width: "100%",
    maxWidth: "100%",
    minWidth: 0,
    flex: "1 1 auto",
    display: "block",
    boxSizing: "border-box",
  };

  const timeText: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 800,
    color: "rgba(0,0,0,0.52)",
    whiteSpace: "nowrap",
    flex: "0 0 auto",
  };

  const volSlider: React.CSSProperties = {
    width: 120,
    maxWidth: 120,
    flex: "0 0 auto",
    minWidth: 0,
  };

  const zoomSlider: React.CSSProperties = {
    width: "100%",
    maxWidth: 220,
    minWidth: 0,
    flex: "1 1 auto",
    display: "block",
    boxSizing: "border-box",
  };

  const tinyDots: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 6,
    opacity: 0.55,
    flex: "0 0 auto",
  };

  const dot: React.CSSProperties = {
    width: 6,
    height: 6,
    borderRadius: 9999,
    background: "rgba(0,0,0,0.35)",
  };

  const progressRatio = duration > 0 ? clamp(current / duration, 0, 1) : 0;

  return (
    <div
      className="mb-bottom-musicbar"
      role="region"
      aria-label="Music bar"
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 50,
        pointerEvents: "none", // ✅ only inner box receives input
      }}
    >
      {/* ✅ SAME RULER AS ROOM/FEEDBACK: max-w + padding */}
      <div
        style={{
          width: "100%",
          maxWidth: 980,
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: 16,
          paddingRight: 16,
          paddingBottom: 16,
          pointerEvents: "none",
        }}
        className="md:px-6"
      >
        <div style={{ pointerEvents: "auto" }}>
          <div style={box}>
            <div style={row}>
              {/* LEFT 3/4: MUSIC ONLY */}
              <div style={left}>
                <button type="button" style={tab === "all" ? pillActive : pill} onClick={() => setTab("all")}>
                  All
                </button>

                <button type="button" style={tab === "mb" ? pillActive : pill} onClick={() => setTab("mb")}>
                  MB Songs
                </button>

                <button
                  type="button"
                  style={tab === "fav" ? { ...iconPill, background: "rgba(184,77,255,0.12)" } : iconPill}
                  onClick={() => setTab("fav")}
                  aria-label="Favorites"
                  title="Favorites"
                >
                  {tab === "fav" ? "♥" : "♡"}
                </button>

                <button type="button" style={iconPill} onClick={togglePlay} aria-label={playing ? "Pause" : "Play"}>
                  <TalkingFaceIcon playing={playing} />
                </button>

                <select
                  value={track?.id ?? ""}
                  onChange={(e) => setTrackId(e.target.value)}
                  style={selectStyle}
                  aria-label="Track"
                >
                  {visibleTracks.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
                </select>

                <div style={progressWrap}>
                  <input
                    type="range"
                    min={0}
                    max={1000}
                    value={Math.round(progressRatio * 1000)}
                    onChange={(e) => seekToRatio(Number(e.target.value) / 1000)}
                    style={progressSlider}
                    aria-label="Progress"
                  />
                  <div style={timeText}>
                    {formatTime(current)} / {formatTime(duration)}
                  </div>
                </div>

                <button
                  type="button"
                  style={iconPill}
                  onClick={toggleFavCurrent}
                  aria-label={isFav ? "Unfavorite" : "Favorite"}
                  title={isFav ? "Unfavorite" : "Favorite"}
                >
                  {isFav ? "♥" : "♡"}
                </button>

                <input
                  type="range"
                  min={0}
                  max={100}
                  value={Math.round(vol * 100)}
                  onChange={(e) => setVol(clamp(Number(e.target.value) / 100, 0, 1))}
                  style={volSlider}
                  aria-label="Volume"
                />
              </div>

              {/* RIGHT 1/4: ZOOM + dots ONLY (no labels) */}
              <div style={right}>
                <input
                  type="range"
                  min={60}
                  max={140}
                  value={zoomPct}
                  onChange={(e) => onZoomChange(Number(e.target.value))}
                  style={zoomSlider}
                  aria-label="Zoom"
                />

                <div style={tinyDots} aria-hidden="true">
                  <div style={dot} />
                  <div style={dot} />
                  <div style={dot} />
                </div>
              </div>
            </div>
          </div>

          {/* Scoped CSS hard clamps any global range rules leaking in */}
          <style>{`
            .mb-bottom-musicbar * { box-sizing: border-box; }
            .mb-bottom-musicbar { width: 100%; max-width: 100%; }
            .mb-bottom-musicbar input[type="range"]{
              width: 100%;
              max-width: 100%;
              min-width: 0;
              display: block;
            }
            .mb-bottom-musicbar [aria-label="Track"]{
              max-width: 220px;
            }
            @media (max-width: 640px){
              .mb-bottom-musicbar [aria-label="Track"]{
                max-width: 160px;
              }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}

/* New thing to learn:
   Fixed UI should use a viewport shell + an inner "ruler" (max-width + padding) so it aligns
   perfectly with page content while staying globally mounted. */
