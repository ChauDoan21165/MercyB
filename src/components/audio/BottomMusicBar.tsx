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

type TabId = "all" | "fav";
type Track = {
  key: string;
  id: string;
  title: string;
  src: string;
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

import { MUSIC_TRACKS } from './musicTracks';

function normalizeTrackId(input: string) {
  return input.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

function buildTracks(): Track[] {
  return MUSIC_TRACKS.map((t, index) => ({
    key: `${t.src}::${index}`,
    id: t.id,
    title: t.title,
    src: t.src,
  }));
}

function getSingletonAudio(): HTMLAudioElement {
  if (!window.__mbBottomAudio) {
    const a = new Audio();
    a.preload = "auto";
    (a as any).playsInline = true;
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

    const sameSrc = a.currentSrc === track.src || a.src === track.src;
    if (sameSrc) {
      localStorage.setItem(LS_TRACK, track.id);
      return;
    }

    const wasPlaying = !a.paused || playingRef.current;

    a.src = track.src;
    localStorage.setItem(LS_TRACK, track.id);

    if (wasPlaying) {
      a.play().catch(() => {
        setPlaying(false);
      });
    } else {
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
      a.play().catch(() => {
        setPlaying(false);
      });
    } else {
      a.pause();
    }
  };

  return (
    <div
      data-mb-bottom-bar="1"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        background: "rgba(255,255,255,0.98)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(0,0,0,0.06)",
        padding: "0 15px",
        height: "36px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        zIndex: 1000,
        touchAction: "pan-x pan-y",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "1.5px",
          background: "rgba(0,0,0,0.04)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "1.5px",
          background: "#007AFF",
          width: `${(current / duration) * 100 || 0}%`,
        }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
        <button
          onClick={() => {
            const nextTab: TabId = tab === "all" ? "fav" : "all";
            setTab(nextTab);
            localStorage.setItem(LS_TAB, nextTab);
          }}
          style={{
            border: "none",
            background: "none",
            cursor: "pointer",
            color: tab === "fav" ? "#E11D48" : "#bbb",
          }}
        >
          <Heart size={14} fill={tab === "fav" ? "currentColor" : "none"} />
        </button>

        <button
          onClick={onTogglePlay}
          style={{ border: "none", background: "none", cursor: "pointer", color: "#000" }}
        >
          {playing ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
        </button>

        <select
          value={track?.id ?? ""}
          onChange={(e) => setTrackId(e.target.value)}
          style={{
            border: "none",
            background: "transparent",
            borderRadius: "4px",
            fontSize: "9px",
            fontWeight: "500",
            padding: "2px 4px",
            maxWidth: "110px",
            minWidth: "60px",
            flex: "0 0 auto",
            color: "#333",
            letterSpacing: "0.01em",
          }}
        >
          {visibleTracks.map((t) => (
            <option key={t.key} value={t.id}>
              {favorites[t.id] ? "❤️ " : ""}
              {t.title}
            </option>
          ))}
        </select>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
        <input
          type="range"
          min={0}
          max={100}
          value={(current / duration) * 100 || 0}
          onChange={(e) => {
            const a = audioRef.current;
            if (!a) return;
            a.currentTime = (Number(e.target.value) / 100) * duration;
          }}
          className="mb-slider-pro"
          style={{ flex: 1 }}
        />
        <span style={{ fontSize: "9px", fontWeight: "900", opacity: 0.4 }}>
          {formatTime(current)}
        </span>
      </div>

      <button
        onClick={toggleFavCurrent}
        style={{
          border: "none",
          background: "none",
          cursor: "pointer",
          color: track && favorites[track.id] ? "#E11D48" : "#ccc",
          flexShrink: 0,
        }}
      >
        <Heart size={14} fill={track && favorites[track.id] ? "currentColor" : "none"} />
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
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
            className="mb-slider-pro"
            style={{ width: "44px" }}
          />
        </div>

        <div style={{ width: "1px", height: "10px", background: "rgba(0,0,0,0.1)" }} />

        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <Search size={12} color="#aaa" />
          <input
            type="range"
            min={60}
            max={140}
            value={zoomPct}
            onChange={(e) => setZoomPct(Number(e.target.value))}
            className="mb-slider-pro"
            style={{ width: "44px" }}
          />
          <span style={{ fontSize: "10px", fontWeight: "900", color: "#555", width: "28px" }}>
            {zoomPct}%
          </span>
        </div>
      </div>

      <style>{`
        .mb-slider-pro {
          -webkit-appearance: none;
          background: rgba(0,0,0,0.06);
          height: 2px;
          border-radius: 10px;
          outline: none;
        }
        .mb-slider-pro::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 10px;
          width: 10px;
          border-radius: 50%;
          background: #444;
          border: 1.5px solid white;
          box-shadow: 0 1px 2px rgba(0,0,0,0.2);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}