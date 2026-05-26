// src/components/audio/MusicDock.tsx
// MB-BLUE-99.3 — 2025-12-31 (+0700)
/**
 * MusicDock (MUSIC ONLY — NEVER LESSON AUDIO)
 * - Fixed bottom dock, aligned to page container width
 * - Two tabs: Common / Favorites
 * - Progress bar + time
 * - Volume slider
 * - Zoom slider (75%–200%) writes documentElement data-mb-zoom
 *
 * NOTES:
 * - Provide your song list via props (ids + src + title).
 * - Favorites are localStorage-only (UI-safe).
 */

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AUDIO_CONCEPT } from "@/lib/audioConcepts";

type Song = {
  id: string;
  title: string;
  src: string; // /audio/music/xxx.mp3 or https://...
};

function fmtTime(n: number) {
  if (!Number.isFinite(n) || n < 0) n = 0;
  const m = Math.floor(n / 60);
  const s = Math.floor(n % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

const LS_FAV_KEY = "mb_music_favorites_v1";
const LS_VOL_KEY = "mb_music_volume_v1";
const LS_TAB_KEY = "mb_music_tab_v1";
const LS_ZOOM_KEY = "mb_zoom_v1";

function readJson<T>(k: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(k);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
function writeJson(k: string, v: any) {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {}
}

export default function MusicDock({
  songs,
  className,
}: {
  songs: Song[];
  className?: string;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [tab, setTab] = useState<"common" | "favorites">(() => {
    const t = String((typeof window !== "undefined" && localStorage.getItem(LS_TAB_KEY)) || "");
    return t === "favorites" ? "favorites" : "common";
  });

  const [favoriteIds, setFavoriteIds] = useState<string[]>(() =>
    readJson<string[]>(LS_FAV_KEY, [])
  );

  const favorites = useMemo(() => {
    const set = new Set(favoriteIds);
    return songs.filter((s) => set.has(s.id));
  }, [songs, favoriteIds]);

  const list = tab === "favorites" ? favorites : songs;

  const [currentId, setCurrentId] = useState<string>(() => list[0]?.id || songs[0]?.id || "");
  const current = useMemo(() => songs.find((s) => s.id === currentId) || null, [songs, currentId]);

  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const [dur, setDur] = useState(0);

  const [vol, setVol] = useState<number>(() => {
    const raw = Number((typeof window !== "undefined" && localStorage.getItem(LS_VOL_KEY)) || "0.8");
    return Number.isFinite(raw) ? clamp(raw, 0, 1) : 0.8;
  });

  const [zoom, setZoom] = useState<number>(() => {
    const raw = Number((typeof window !== "undefined" && localStorage.getItem(LS_ZOOM_KEY)) || "100");
    return Number.isFinite(raw) ? clamp(raw, 75, 200) : 100;
  });

  useEffect(() => {
    // persist zoom + publish to document root
    try {
      localStorage.setItem(LS_ZOOM_KEY, String(zoom));
    } catch {}
    document.documentElement.setAttribute("data-mb-zoom", String(zoom));
  }, [zoom]);

  useEffect(() => {
    // persist tab
    try {
      localStorage.setItem(LS_TAB_KEY, tab);
    } catch {}
    // ensure current song exists in chosen list
    const nextList = tab === "favorites" ? favorites : songs;
    if (!nextList.some((s) => s.id === currentId)) {
      setCurrentId(nextList[0]?.id || songs[0]?.id || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  useEffect(() => {
    // build audio element
    const a = new Audio();
    a.preload = "metadata";
    a.volume = vol;
    audioRef.current = a;

    const onLoaded = () => {
      setReady(true);
      setDur(Number.isFinite(a.duration) ? a.duration : 0);
    };
    const onTime = () => setT(a.currentTime || 0);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => {
      setPlaying(false);
      setT(0);
      // auto-next within current tab list
      const idx = list.findIndex((s) => s.id === currentId);
      const next = idx >= 0 ? list[idx + 1] || list[0] : list[0];
      if (next?.id) setCurrentId(next.id);
    };

    a.addEventListener("loadedmetadata", onLoaded);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("ended", onEnded);

    return () => {
      a.pause();
      a.removeEventListener("loadedmetadata", onLoaded);
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("ended", onEnded);
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // load current song
    const a = audioRef.current;
    if (!a || !current?.src) return;
    setReady(false);
    setT(0);
    setDur(0);
    a.pause();
    a.src = current.src;
    a.load();
    // keep paused by default
    setPlaying(false);
  }, [current?.src]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = vol;
    try {
      localStorage.setItem(LS_VOL_KEY, String(vol));
    } catch {}
  }, [vol]);

  const pct = useMemo(() => {
    if (!dur || dur <= 0) return 0;
    return clamp(t / dur, 0, 1);
  }, [t, dur]);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) a.play().catch(() => {});
    else a.pause();
  };

  const seek = (nextPct: number) => {
    const a = audioRef.current;
    if (!a || !dur) return;
    a.currentTime = clamp(nextPct, 0, 1) * dur;
  };

  const isFav = (id: string) => favoriteIds.includes(id);

  const toggleFav = (id: string) => {
    setFavoriteIds((cur) => {
      const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
      writeJson(LS_FAV_KEY, next);
      return next;
    });
  };

  return (
    <div className={className || ""} data-mb-musicdock data-mb-concept={AUDIO_CONCEPT.MUSIC}>
      <style>{`
        [data-mb-musicdock]{
          position: fixed;
          left: 50%;
          transform: translateX(-50%);
          bottom: 12px;
          z-index: 60;
          width: min(980px, calc(100vw - 32px)); /* aligns with ChatHub container edges */
          pointer-events: none; /* only inner shell clickable */
        }
        [data-mb-musicdock] .mb-shell{
          pointer-events: auto;
          border: 1px solid rgba(0,0,0,0.12);
          background: rgba(255,255,255,0.86);
          backdrop-filter: blur(10px);
          border-radius: 18px;
          box-shadow: 0 16px 40px rgba(0,0,0,0.14);
          padding: 10px 10px;
        }
        [data-mb-musicdock] .mb-row{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap: 10px;
          flex-wrap: nowrap;
          min-width:0;
        }
        [data-mb-musicdock] .mb-left,
        [data-mb-musicdock] .mb-right{
          display:flex;
          align-items:center;
          gap: 8px;
          flex: 0 0 auto;
          min-width:0;
        }
        [data-mb-musicdock] .mb-mid{
          flex: 1 1 auto;
          min-width:0;
        }
        [data-mb-musicdock] .mb-tabs{
          display:flex;
          gap:6px;
        }
        [data-mb-musicdock] .mb-tab{
          height: 30px;
          padding: 0 10px;
          border-radius: 12px;
          border: 1px solid rgba(0,0,0,0.14);
          background: rgba(255,255,255,0.92);
          font-size: 12px;
          font-weight: 900;
          white-space: nowrap;
          opacity: 0.72;
        }
        [data-mb-musicdock] .mb-tab[data-active="true"]{
          opacity: 1;
          box-shadow: 0 10px 24px rgba(0,0,0,0.08);
        }
        [data-mb-musicdock] .mb-play{
          width: 34px;
          height: 34px;
          border-radius: 12px;
          border: 1px solid rgba(0,0,0,0.14);
          background: rgba(255,255,255,0.92);
          display:flex;
          align-items:center;
          justify-content:center;
          font-size: 14px;
        }
        [data-mb-musicdock] .mb-title{
          font-size: 12px;
          font-weight: 900;
          opacity: 0.78;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 6px;
        }
        [data-mb-musicdock] .mb-barRow{
          display:flex;
          align-items:center;
          gap: 10px;
        }
        [data-mb-musicdock] .mb-range{
          width: 100%;
          flex: 1 1 auto;
          min-width: 0;
        }
        [data-mb-musicdock] .mb-time{
          font-size: 12px;
          font-weight: 900;
          opacity: 0.65;
          white-space: nowrap;
          flex: 0 0 auto;
        }
        [data-mb-musicdock] .mb-miniLabel{
          font-size: 11px;
          font-weight: 900;
          opacity: 0.65;
          white-space: nowrap;
        }
        [data-mb-musicdock] .mb-mini{
          display:flex;
          align-items:center;
          gap: 6px;
        }
        [data-mb-musicdock] .mb-select{
          height: 30px;
          border-radius: 12px;
          border: 1px solid rgba(0,0,0,0.14);
          background: rgba(255,255,255,0.92);
          font-size: 12px;
          font-weight: 800;
          max-width: 320px;
        }
        [data-mb-musicdock] .mb-favBtn{
          width: 30px;
          height: 30px;
          border-radius: 12px;
          border: 1px solid rgba(0,0,0,0.14);
          background: rgba(255,255,255,0.92);
          display:flex;
          align-items:center;
          justify-content:center;
          font-size: 13px;
        }
        @media (max-width: 520px){
          [data-mb-musicdock] .mb-select{ max-width: 180px; }
        }
      `}</style>

      <div className="mb-shell">
        <div className="mb-row">
          <div className="mb-left">
            <div className="mb-tabs">
              <button
                type="button"
                className="mb-tab"
                data-active={tab === "common" ? "true" : "false"}
                onClick={() => setTab("common")}
                aria-label="Common music list"
              >
                Common
              </button>
              <button
                type="button"
                className="mb-tab"
                data-active={tab === "favorites" ? "true" : "false"}
                onClick={() => setTab("favorites")}
                aria-label="Favorites music list"
              >
                Favorites
              </button>
            </div>

            <button
              type="button"
              className="mb-play"
              onClick={toggle}
              title={playing ? "Pause music" : "Play music"}
              aria-label={playing ? "Pause music" : "Play music"}
              disabled={!current?.src}
            >
              {playing ? "❚❚" : "▶"}
            </button>
          </div>

          <div className="mb-mid">
            <div className="mb-title">{current ? current.title : "No song selected"}</div>

            <div className="mb-barRow">
              <input
                className="mb-range"
                type="range"
                min={0}
                max={1000}
                step={1}
                value={Math.round(pct * 1000)}
                onChange={(e) => seek(Number(e.target.value) / 1000)}
                aria-label="Seek music"
                disabled={!ready || !dur}
              />
              <div className="mb-time">
                {fmtTime(t)} / {fmtTime(dur)}
              </div>
            </div>
          </div>

          <div className="mb-right">
            <select
              className="mb-select"
              value={currentId}
              onChange={(e) => setCurrentId(e.target.value)}
              aria-label="Select song"
            >
              {list.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>

            {current ? (
              <button
                type="button"
                className="mb-favBtn"
                onClick={() => toggleFav(current.id)}
                title={isFav(current.id) ? "Remove from favorites" : "Add to favorites"}
                aria-label="Toggle favorite song"
              >
                {isFav(current.id) ? "♥" : "♡"}
              </button>
            ) : null}

            <div className="mb-mini" title="Volume">
              <span className="mb-miniLabel">VOL</span>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={Math.round(vol * 100)}
                onChange={(e) => setVol(clamp(Number(e.target.value) / 100, 0, 1))}
                aria-label="Music volume"
              />
            </div>

            <div className="mb-mini" title="Zoom">
              <span className="mb-miniLabel">ZOOM</span>
              <input
                type="range"
                min={75}
                max={200}
                step={1}
                value={zoom}
                onChange={(e) => setZoom(clamp(Number(e.target.value), 75, 200))}
                aria-label="Page zoom"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
