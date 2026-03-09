// src/components/audio/BottomMusicBar.tsx
// MB-BLUE-100.9 — 2026-01-02 (+0700)
//
// BOTTOM MUSIC BAR (LOCKED):
// - Music bar is ALWAYS entertainment-only (no learning audio).
// - Bar layout: LEFT 3/4 = music controls, RIGHT 1/4 = zoom + future tiny dots.
// - Music controls ONLY: All | (Fav tab) | play face | track select | progress + time | volume
// - NO extra words inside bar (no "Mercy Blade", no "Zoom", no labels).
// - Progress bar is the ONLY element allowed to stretch when bar width increases.
// - Zoom MUST be global: set CSS var --mb-essay-zoom AND data-mb-zoom on :root, persist in localStorage.
//
// FIX (100.7):
// - Bigger mouth, volume icon, zoom icon + percent
//
// FIX (100.8):
// - ✅ ALIGNMENT STABLE: BottomMusicBar is NO LONGER position:fixed.
//   Pages (Home/ChatHub) own the fixed mount + ruler alignment.
// - ✅ Favorites tab is heart-only.
//   Keep right-side heart for “favorite this track”.
//
// FIX (100.9):
// - ✅ HARD LAYOUT-NEUTRAL CLAMP: This component can NEVER exceed its parent width.
//   (Prevents “sticking out” even if inner controls try to expand).
// - ✅ Emits "mb-zoom-change" event on same-tab zoom updates (for live sync consumers).
//
// PATCH (2026-03-08c):
// - Auto-load audio files from src/assets/music via import.meta.glob.
// - No manual tracks array editing needed for each new song.
//
// PATCH (2026-03-08d):
// - Simplify tabs: only All + Favorites.
// - Favorites tab is heart-only (no word).
// - Songs favorited via right-side current-track heart appear in the Favorites list.
// - If Favorites is empty, dropdown safely falls back to All instead of going blank.
//
// PATCH (2026-03-08e):
// - Keep auto-load behavior while fixing simplified UI regression.
// - Preserve duplicate variants like "(1)" "(2)" in visible titles so all files appear distinctly.
// - Tweak favorite-tab active styling to be clearer and less “old UI” looking.

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

type TabId = "all" | "fav";

type Track = {
  id: string;
  title: string;
  src: string;
};

const LS_TAB = "mb.music.tab";
const LS_TRACK = "mb.music.trackId";
const LS_VOL = "mb.music.vol";
const LS_ZOOM = "mb.ui.zoom";
const LS_FAV = "mb.music.fav";
const LS_ADMIN = "mb_admin";

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

function applyGlobalZoom(pct: number) {
  const safe = clamp(Math.round(pct), 60, 140);

  document.documentElement.style.setProperty("--mb-essay-zoom", String(safe));
  document.documentElement.setAttribute("data-mb-zoom", String(safe));

  try {
    localStorage.setItem(LS_ZOOM, String(safe));
  } catch {}

  try {
    window.dispatchEvent(new Event("mb-zoom-change"));
  } catch {}
}

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
  return (
    <div
      aria-hidden="true"
      style={{
        width: 30,
        height: 30,
        borderRadius: 9999,
        border: "1px solid rgba(0,0,0,0.16)",
        background: "rgba(255,255,255,0.94)",
        display: "grid",
        placeItems: "center",
      }}
    >
      <div style={{ position: "relative", width: 20, height: 20 }}>
        <div
          style={{
            position: "absolute",
            left: 4,
            top: 6,
            width: 2.4,
            height: 2.4,
            borderRadius: 9999,
            background: "rgba(0,0,0,0.62)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 4,
            top: 6,
            width: 2.4,
            height: 2.4,
            borderRadius: 9999,
            background: "rgba(0,0,0,0.62)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 1,
            top: 9,
            width: 3.5,
            height: 3.5,
            borderRadius: 9999,
            background: "rgba(255, 120, 160, 0.30)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 1,
            top: 9,
            width: 3.5,
            height: 3.5,
            borderRadius: 9999,
            background: "rgba(255, 120, 160, 0.30)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            bottom: 2.5,
            width: 11,
            height: playing ? 8 : 3,
            borderRadius: 9999,
            background: "rgba(0,0,0,0.62)",
            boxShadow: playing ? "0 2px 10px rgba(0,0,0,0.12)" : "none",
            transition: "height 120ms ease",
          }}
        />
      </div>
    </div>
  );
}

function normalizeTrackTitle(fileName: string) {
  const noExt = fileName.replace(/\.[^/.]+$/, "");
  return noExt.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
}

function makeTrackId(fileName: string) {
  return fileName
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

const musicModules = import.meta.glob("@/assets/music/*.{mp3,wav,ogg,m4a}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

function buildTracks(): Track[] {
  return Object.entries(musicModules)
    .map(([path, src]) => {
      const fileName = path.split("/").pop() ?? "";
      return {
        id: makeTrackId(fileName),
        title: normalizeTrackTitle(fileName),
        src,
      } as Track;
    })
    .sort((a, b) => a.title.localeCompare(b.title, undefined, { numeric: true }));
}

export default function BottomMusicBar() {
  const nav = useNavigate();

  const tracks: Track[] = useMemo(() => buildTracks(), []);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastNonZeroVolRef = useRef<number>(0.6);

  const [tab, setTab] = useState<TabId>(() => {
    const v = getInitialString(LS_TAB, "all");
    return v === "all" || v === "fav" ? (v as TabId) : "all";
  });

  const [favorites, setFavorites] = useState<Record<string, boolean>>(() =>
    getInitialFav()
  );

  const visibleTracks = useMemo(() => {
    if (tab === "fav") {
      const favs = tracks.filter((t) => favorites[t.id]);
      return favs.length ? favs : tracks;
    }
    return tracks;
  }, [tab, tracks, favorites]);

  const [trackId, setTrackId] = useState<string>(() => {
    const saved = getInitialString(LS_TRACK, tracks[0]?.id ?? "");
    return tracks.some((t) => t.id === saved) ? saved : tracks[0]?.id ?? "";
  });

  const track = useMemo(
    () =>
      visibleTracks.find((t) => t.id === trackId) ??
      tracks.find((t) => t.id === trackId) ??
      visibleTracks[0] ??
      tracks[0],
    [visibleTracks, tracks, trackId]
  );

  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);

  const [vol, setVol] = useState<number>(() =>
    clamp(getInitialNumber(LS_VOL, 0.6), 0, 1)
  );
  const [zoomPct, setZoomPct] = useState<number>(() =>
    clamp(getInitialNumber(LS_ZOOM, 100), 60, 140)
  );

  const [adminVisible, setAdminVisible] = useState(false);
  useEffect(() => {
    const host = String(window.location.hostname || "");
    const isLocal =
      host === "127.0.0.1" || host === "localhost" || host === "::1";
    let flag = false;
    try {
      flag = localStorage.getItem(LS_ADMIN) === "1";
    } catch {}
    setAdminVisible(isLocal || flag);
  }, []);

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

  useEffect(() => {
    try {
      localStorage.setItem(LS_TAB, tab);
    } catch {}
  }, [tab]);

  useEffect(() => {
    try {
      localStorage.setItem(LS_FAV, JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  useEffect(() => {
    const a = audioRef.current;
    if (a) a.volume = vol;
    if (vol > 0.001) lastNonZeroVolRef.current = vol;
    try {
      localStorage.setItem(LS_VOL, String(vol));
    } catch {}
  }, [vol]);

  useEffect(() => {
    if (!visibleTracks.some((t) => t.id === trackId) && visibleTracks[0]) {
      setTrackId(visibleTracks[0].id);
    }
  }, [visibleTracks, trackId]);

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

  const toggleMute = () => {
    if (vol > 0.001) {
      setVol(0);
      return;
    }
    const restore = clamp(lastNonZeroVolRef.current || 0.6, 0, 1);
    setVol(restore);
  };

  const outer: React.CSSProperties = {
    width: "100%",
    maxWidth: "100%",
    minWidth: 0,
    display: "block",
    overflow: "hidden",
    pointerEvents: "auto",
    contain: "layout paint",
  };

  const box: React.CSSProperties = {
    width: "100%",
    maxWidth: "100%",
    minWidth: 0,
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
    width: "100%",
    maxWidth: "100%",
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
    color: "rgba(0,0,0,0.92)",
  };

  const pillActive: React.CSSProperties = {
    ...pill,
    background: "rgba(205, 228, 245, 0.90)",
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
    color: "rgba(0,0,0,0.92)",
  };

  const favTabActive: React.CSSProperties = {
    ...iconPill,
    background: "rgba(238, 225, 246, 0.90)",
    border: "1px solid rgba(155, 120, 180, 0.26)",
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
    maxWidth: 320,
    minWidth: 0,
    flex: "0 1 320px",
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

  const volWrap: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flex: "0 0 auto",
    minWidth: 0,
  };

  const volSlider: React.CSSProperties = {
    width: 120,
    maxWidth: 120,
    flex: "0 0 auto",
    minWidth: 0,
  };

  const zoomWrap: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
    minWidth: 0,
    flex: "1 1 auto",
  };

  const zoomIcon: React.CSSProperties = {
    width: 34,
    height: 34,
    borderRadius: 9999,
    border: "1px solid rgba(0,0,0,0.14)",
    background: "rgba(255,255,255,0.90)",
    display: "grid",
    placeItems: "center",
    flex: "0 0 auto",
    userSelect: "none",
  };

  const zoomSlider: React.CSSProperties = {
    width: "100%",
    maxWidth: 180,
    minWidth: 0,
    flex: "1 1 auto",
    display: "block",
    boxSizing: "border-box",
  };

  const zoomText: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 900,
    color: "rgba(0,0,0,0.55)",
    whiteSpace: "nowrap",
    flex: "0 0 auto",
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

  const adminDotBtn: React.CSSProperties = {
    ...dot,
    border: "1px solid rgba(0,0,0,0.20)",
    background: "rgba(0,0,0,0.30)",
    padding: 0,
    cursor: "pointer",
    display: "block",
  };

  const progressRatio = duration > 0 ? clamp(current / duration, 0, 1) : 0;
  const speakerEmoji =
    vol <= 0.001 ? "🔇" : vol < 0.35 ? "🔈" : vol < 0.7 ? "🔉" : "🔊";
  const favTabIcon = tab === "fav" ? "♥" : "♡";

  return (
    <div
      className="mb-bottom-musicbar"
      style={outer}
      role="region"
      aria-label="Music bar"
    >
      <div style={box}>
        <div style={row}>
          <div style={left}>
            <button
              type="button"
              style={tab === "all" ? pillActive : pill}
              onClick={() => setTab("all")}
            >
              All
            </button>

            <button
              type="button"
              style={tab === "fav" ? favTabActive : iconPill}
              onClick={() => setTab("fav")}
              aria-label="Favorites"
              title="Favorites"
            >
              {favTabIcon}
            </button>

            <button
              type="button"
              style={iconPill}
              onClick={togglePlay}
              aria-label={playing ? "Pause" : "Play"}
            >
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

            <div style={volWrap}>
              <button
                type="button"
                style={iconPill}
                onClick={toggleMute}
                aria-label="Volume toggle"
                title="Volume"
              >
                {speakerEmoji}
              </button>

              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(vol * 100)}
                onChange={(e) =>
                  setVol(clamp(Number(e.target.value) / 100, 0, 1))
                }
                style={volSlider}
                aria-label="Volume"
              />
            </div>
          </div>

          <div style={right}>
            <div style={zoomWrap}>
              <div style={zoomIcon} aria-hidden="true" title="Zoom">
                🔎
              </div>

              <input
                type="range"
                min={60}
                max={140}
                value={zoomPct}
                onChange={(e) => onZoomChange(Number(e.target.value))}
                style={zoomSlider}
                aria-label="Zoom"
              />

              <div style={zoomText} aria-label="Zoom percent">
                {zoomPct}%
              </div>
            </div>

            <div style={tinyDots}>
              {adminVisible ? (
                <button
                  type="button"
                  aria-label="Admin"
                  title="Admin"
                  onClick={() => nav("/admin")}
                  style={adminDotBtn}
                />
              ) : (
                <div style={dot} aria-hidden="true" />
              )}

              <div style={dot} aria-hidden="true" />
              <div style={dot} aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .mb-bottom-musicbar,
        .mb-bottom-musicbar * { box-sizing: border-box; }

        .mb-bottom-musicbar{
          width: 100%;
          max-width: 100%;
          min-width: 0;
          overflow: hidden;
        }

        .mb-bottom-musicbar > div{
          max-width: 100%;
          min-width: 0;
        }

        .mb-bottom-musicbar input[type="range"]{
          width: 100%;
          max-width: 100%;
          min-width: 0;
          display: block;
        }

        .mb-bottom-musicbar [aria-label="Track"]{
          max-width: 320px;
        }

        @media (max-width: 640px){
          .mb-bottom-musicbar [aria-label="Track"]{
            max-width: 160px;
          }
        }
      `}</style>
    </div>
  );
}