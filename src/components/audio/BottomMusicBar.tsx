// PATH: src/components/audio/BottomMusicBar.tsx

/**
 * MercyB: Bottom Music Bar
 * Fixes:
 * - Continuous playback on mobile with HMR-safe singleton audio
 * - Native pinch-to-zoom unlock
 * - Keep zoom slider + existing UI layout
 *
 * Zoom-only update:
 * - Let pinch gestures pass through fixed bottom bar
 *
 * React key fix:
 * - Use a guaranteed-unique key per track instead of collision-prone normalized title id
 */

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause, Heart, Volume2, Search } from "lucide-react";
import { MUSIC_TRACKS } from "./musicTracks";
import { getPublicAudioUrl } from "@/lib/musicAudioUrl";

type TabId = "all" | "fav";
type Track = {
  key: string;
  id: string;
  title: string;
  /** Public URL to the track. Computed once from the filename at build time. */
  src: string;
};
type InlineAudioElement = HTMLAudioElement & {
  playsInline: boolean;
};

declare global {
  interface Window {
    __mbBottomAudio?: HTMLAudioElement;
    __mbBottomEndedBound?: boolean;
  }
}

const LS_TAB = "mb.music.tab";
const LS_TRACK = "mb.music.trackId";
const LS_VOL = "mb.music.vol";
const LS_ZOOM = "mb.ui.zoom";
const LS_FAV = "mb.music.fav";

function formatTime(sec: number) {
  if (!isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function buildTracks(): Track[] {
  return MUSIC_TRACKS.map((t, index) => ({
    key: `${t.file}::${index}`,
    id: t.id,
    title: t.title,
    src: getPublicAudioUrl(t.file),
  }));
}

function getSingletonAudio(): HTMLAudioElement {
  if (!window.__mbBottomAudio) {
    const a = new Audio() as InlineAudioElement;
    // Product ruling: music never auto-fetches. Keep the singleton empty until
    // the learner explicitly presses play; assigning src is what starts the MP3 request.
    a.preload = "none";
    a.playsInline = true;
    a.loop = false;
    window.__mbBottomAudio = a;
  }
  return window.__mbBottomAudio;
}

export default function BottomMusicBar() {
  const tracks = useMemo(() => buildTracks(), []);
  const audioRef = useRef<HTMLAudioElement | null>(
    typeof window !== "undefined" ? getSingletonAudio() : null
  );

  const [tab, setTab] = useState<TabId>(() => {
    const raw = localStorage.getItem(LS_TAB);
    return raw === "fav" ? "fav" : "all";
  });

  const [favorites, setFavorites] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem(LS_FAV) || "{}");
    } catch {
      return {};
    }
  });

  const [trackId, setTrackId] = useState(
    () => localStorage.getItem(LS_TRACK) || tracks[0]?.id || ""
  );
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [vol, setVol] = useState(() => Number(localStorage.getItem(LS_VOL)) || 0.6);
  const [zoomPct, setZoomPct] = useState(() => Number(localStorage.getItem(LS_ZOOM)) || 100);

  const visibleTracks = useMemo(
    () => (tab === "fav" ? tracks.filter((t) => favorites[t.id]) : tracks),
    [tab, tracks, favorites]
  );

  const track = useMemo(
    () => visibleTracks.find((t) => t.id === trackId) || visibleTracks[0] || tracks[0],
    [visibleTracks, trackId, tracks]
  );

  const visibleTracksRef = useRef<Track[]>(visibleTracks);
  const trackRef = useRef<Track | undefined>(track);
  const playingRef = useRef(false);

  useEffect(() => {
    visibleTracksRef.current = visibleTracks;
  }, [visibleTracks]);

  useEffect(() => {
    trackRef.current = track;
  }, [track]);

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  useEffect(() => {
    if (tab === "fav" && visibleTracks.length === 0) {
      setTab("all");
      localStorage.setItem(LS_TAB, "all");
    }
  }, [tab, visibleTracks.length]);

  useEffect(() => {
    let meta = document.querySelector('meta[name="viewport"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "viewport");
      document.head.appendChild(meta);
    }

    meta.setAttribute(
      "content",
      "width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover"
    );

    const old = document.getElementById("mb-native-zoom-unlock");
    old?.remove();

    const style = document.createElement("style");
    style.id = "mb-native-zoom-unlock";
    style.innerHTML = `
      html, body, #root {
        touch-action: auto !important;
        overflow: auto !important;
        -webkit-overflow-scrolling: touch !important;
      }

      [data-mb-bottom-bar="1"] {
        touch-action: pan-x pan-y !important;
      }

      input, select, textarea {
        font-size: 16px !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.getElementById("mb-native-zoom-unlock")?.remove();
    };
  }, []);

  useEffect(() => {
    const val = String(zoomPct);
    document.documentElement.style.setProperty("--mb-essay-zoom", val);
    localStorage.setItem(LS_ZOOM, val);
  }, [zoomPct]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    a.volume = vol;

    const syncTime = () => {
      setCurrent(a.currentTime || 0);
      setDuration(a.duration || 0);
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    a.addEventListener("timeupdate", syncTime);
    a.addEventListener("loadedmetadata", syncTime);
    a.addEventListener("durationchange", syncTime);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);

    return () => {
      a.removeEventListener("timeupdate", syncTime);
      a.removeEventListener("loadedmetadata", syncTime);
      a.removeEventListener("durationchange", syncTime);
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
    };
  }, [vol]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    if (window.__mbBottomEndedBound) return;

    const handleEnded = () => {
      const list = visibleTracksRef.current;
      const currentTrack = trackRef.current;

      if (!list.length || !currentTrack) {
        setPlaying(false);
        return;
      }

      const idx = list.findIndex((t) => t.id === currentTrack.id);
      const nextIdx = idx >= 0 ? (idx + 1) % list.length : 0;
      const nextTrack = list[nextIdx];

      if (!nextTrack) {
        setPlaying(false);
        return;
      }

      trackRef.current = nextTrack;
      setTrackId(nextTrack.id);
      localStorage.setItem(LS_TRACK, nextTrack.id);

      a.src = nextTrack.src;
      const p = a.play();
      if (p) {
        p.catch((err) => {
          console.warn("Auto-next blocked:", err);
          setPlaying(false);
        });
      }
    };

    a.addEventListener("ended", handleEnded);
    window.__mbBottomEndedBound = true;

    return () => {
      // keep singleton binding stable across HMR / remounts
    };
  }, []);

  useEffect(() => {
    const a = audioRef.current;
    if (!a || !track) return;

    const wasPlaying = !a.paused || playingRef.current;
    localStorage.setItem(LS_TRACK, track.id);

    if (wasPlaying) {
      const sameSrc = a.currentSrc === track.src || a.src === track.src;
      if (!sameSrc) {
        a.src = track.src;
      }
      a.play().catch(() => setPlaying(false));
    } else {
      a.removeAttribute("src");
      a.load();
      setCurrent(0);
      setDuration(0);
    }
  }, [track]);

  const toggleFavCurrent = () => {
    if (!track) return;
    const newFavs = { ...favorites, [track.id]: !favorites[track.id] };
    setFavorites(newFavs);
    localStorage.setItem(LS_FAV, JSON.stringify(newFavs));
  };

  const onTogglePlay = () => {
    const a = audioRef.current;
    if (!a || !track) return;

    if (a.paused) {
      if (a.src !== track.src && a.currentSrc !== track.src) {
        a.src = track.src;
      }
      a.play().catch(() => setPlaying(false));
    } else {
      a.pause();
    }
  };

  const progressPct = (current / duration) * 100 || 0;

  return (
    <div data-mb-bottom-bar="1" className="mb-bar">
      <div className="mb-bar-left">
        <button
          className="mb-btn"
          aria-label="Toggle favourites filter"
          onClick={() => {
            const nextTab: TabId = tab === "all" ? "fav" : "all";
            setTab(nextTab);
            localStorage.setItem(LS_TAB, nextTab);
          }}
          style={{ color: tab === "fav" ? "#E11D48" : "#bbb" }}
        >
          <Heart size={14} fill={tab === "fav" ? "currentColor" : "none"} />
        </button>

        <button
          className="mb-btn"
          onClick={onTogglePlay}
          aria-label={playing ? "Pause" : "Play"}
          style={{ color: "#000" }}
        >
          {playing ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
        </button>

        <select
          className="mb-title"
          value={track?.id ?? ""}
          onChange={(e) => setTrackId(e.target.value)}
          aria-label="Select track"
        >
          {visibleTracks.map((t) => (
            <option key={t.key} value={t.id}>
              {favorites[t.id] ? "❤️ " : ""}
              {t.title}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-bar-seek">
        <input
          type="range"
          min={0}
          max={100}
          value={progressPct}
          onChange={(e) => {
            const a = audioRef.current;
            if (!a) return;
            a.currentTime = (Number(e.target.value) / 100) * duration;
          }}
          className="mb-slider-pro mb-slider-progress mb-seek"
          aria-label="Seek"
          style={{ "--mb-progress": `${progressPct}%` } as React.CSSProperties}
        />
        <span className="mb-time">
          <span className="mb-time-current">{formatTime(current)}</span>
          <span className="mb-time-duration"> / {formatTime(duration)}</span>
        </span>
      </div>

      <button
        className="mb-btn"
        aria-label="Favourite this track"
        onClick={toggleFavCurrent}
        style={{ color: track && favorites[track.id] ? "#E11D48" : "#ccc" }}
      >
        <Heart size={14} fill={track && favorites[track.id] ? "currentColor" : "none"} />
      </button>

      <div className="mb-bar-right">
        <div className="mb-bar-slot">
          <Volume2 size={12} color="#aaa" />
          <input
            type="range"
            min={0}
            max={100}
            value={vol * 100}
            onChange={(e) => {
              const a = audioRef.current;
              const v = Number(e.target.value) / 100;
              setVol(v);
              if (a) a.volume = v;
              localStorage.setItem(LS_VOL, String(v));
            }}
            className="mb-slider-pro mb-slider-small"
            aria-label="Volume"
          />
        </div>

        <div className="mb-divider" />

        <div className="mb-bar-slot">
          <Search size={12} color="#aaa" />
          <input
            type="range"
            min={60}
            max={140}
            value={zoomPct}
            onChange={(e) => setZoomPct(Number(e.target.value))}
            className="mb-slider-pro mb-slider-small"
            aria-label="Zoom"
          />
          <span className="mb-zoom-label">{zoomPct}%</span>
        </div>
      </div>

      <style>{`
        /* ===================================================================
           Bottom music bar — fluid responsive layout (320 → 1440+)
           Rule: nothing is ever hidden; every control stays visible and
           tappable. All sizes scale via clamp() between a mobile minimum and
           a desktop maximum. Duration label is the only element behind a
           viewport-based toggle, and that's a label-refinement (0:17 →
           0:17 / 3:24), not a control removal.
           =================================================================== */
        .mb-bar {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          background: rgba(255,255,255,0.98);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-top: 1px solid rgba(0,0,0,0.06);
          padding: 0 clamp(6px, 2vw, 15px);
          height: 36px;
          display: flex;
          align-items: center;
          gap: clamp(3px, 1vw, 12px);
          z-index: 1000;
          touch-action: pan-x pan-y;
        }
        .mb-bar-left,
        .mb-bar-right {
          display: flex;
          align-items: center;
          gap: clamp(2px, 0.6vw, 8px);
          flex-shrink: 0;
        }
        .mb-bar-seek {
          flex: 1 1 0;
          display: flex;
          align-items: center;
          gap: clamp(3px, 1vw, 8px);
          min-width: 40px;
        }
        .mb-bar-slot {
          display: flex;
          align-items: center;
          gap: clamp(2px, 0.5vw, 4px);
        }
        .mb-btn {
          border: none;
          background: none;
          cursor: pointer;
          padding: 4px;
          line-height: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .mb-title {
          border: none;
          background: transparent;
          border-radius: 4px;
          font-size: clamp(9px, 1.6vw, 12px);
          font-weight: 500;
          padding: 2px 4px;
          max-width: clamp(40px, 22vw, 180px);
          min-width: 40px;
          flex: 0 0 auto;
          color: #333;
          letter-spacing: 0.01em;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        .mb-seek {
          flex: 1 1 auto;
          min-width: 0;
        }
        .mb-time {
          font-size: clamp(9px, 1.4vw, 11px);
          font-weight: 900;
          opacity: 0.55;
          white-space: nowrap;
          flex: 0 0 auto;
        }
        .mb-time-duration {
          display: none;
        }
        @media (min-width: 500px) {
          .mb-time-duration { display: inline; }
        }
        .mb-slider-small {
          width: clamp(28px, 7vw, 80px);
        }
        .mb-divider {
          width: 1px;
          height: 10px;
          background: rgba(0,0,0,0.1);
          flex-shrink: 0;
        }
        .mb-zoom-label {
          font-size: clamp(8px, 1.3vw, 11px);
          font-weight: 900;
          color: #555;
          min-width: 22px;
          white-space: nowrap;
          flex: 0 0 auto;
        }

        /* ---- slider common ---- */
        .mb-slider-pro {
          -webkit-appearance: none;
          appearance: none;
          background: rgba(0,0,0,0.14);
          height: 4px;
          border-radius: 10px;
          outline: none;
          margin: 0;
          padding: 0;
        }
        .mb-slider-pro::-webkit-slider-runnable-track {
          height: 4px;
          border-radius: 10px;
          background: transparent;
        }
        .mb-slider-pro::-moz-range-track {
          height: 4px;
          border-radius: 10px;
          background: rgba(0,0,0,0.14);
        }
        /* Seek variant: blue fill of played portion via linear-gradient driven
           by the --mb-progress var set inline. */
        .mb-slider-progress {
          background: linear-gradient(
            to right,
            #007AFF 0%,
            #007AFF var(--mb-progress, 0%),
            rgba(0,0,0,0.14) var(--mb-progress, 0%),
            rgba(0,0,0,0.14) 100%
          );
        }
        .mb-slider-progress::-moz-range-progress {
          background: #007AFF;
          height: 4px;
          border-radius: 10px;
        }
        .mb-slider-pro::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 14px;
          width: 14px;
          margin-top: -5px;
          border-radius: 50%;
          background: #111;
          border: 2px solid #fff;
          box-shadow: 0 1px 3px rgba(0,0,0,0.3);
          cursor: pointer;
        }
        .mb-slider-pro::-moz-range-thumb {
          height: 14px;
          width: 14px;
          border-radius: 50%;
          background: #111;
          border: 2px solid #fff;
          box-shadow: 0 1px 3px rgba(0,0,0,0.3);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
