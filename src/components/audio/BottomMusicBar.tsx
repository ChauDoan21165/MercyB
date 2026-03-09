// src/components/audio/BottomMusicBar.tsx
// MB-BLUE-100.9 — 2026-01-02 (+0700)
//
// BOTTOM MUSIC BAR (LOCKED):
// - Music bar is ALWAYS entertainment-only (no learning audio).
// - Bar layout: LEFT 3/4 = music controls, RIGHT 1/4 = zoom + future tiny dots.
// - Music controls ONLY: All | MB Songs | (Fav tab) | play face | track select | progress + time | volume
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
// - ✅ Remove redundant first heart (Fav tab) → use ★ / ☆
//   Keep ♥ only for “favorite this track”.
//
// FIX (100.9):
// - ✅ HARD LAYOUT-NEUTRAL CLAMP: This component can NEVER exceed its parent width.
//   (Prevents “sticking out” even if inner controls try to expand).
// - ✅ Emits "mb-zoom-change" event on same-tab zoom updates (for live sync consumers).
//
// PATCH (2026-03-08b):
// - Added the uploaded music list to the local track catalog.
// - Excluded the .mp4 item from the music dropdown.
// - Mercy-themed songs are grouped under "mb"; ambient/other songs remain in "all".

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

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

// ✅ owner flag for secret admin dot
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

// ✅ Global zoom: BOTH mechanisms (RoomRenderer/ChatHub may listen to either)
function applyGlobalZoom(pct: number) {
  const safe = clamp(Math.round(pct), 60, 140);

  document.documentElement.style.setProperty("--mb-essay-zoom", String(safe));
  document.documentElement.setAttribute("data-mb-zoom", String(safe));

  try {
    localStorage.setItem(LS_ZOOM, String(safe));
  } catch {}

  // ✅ same-tab live update hook (ChatHub listens to this)
  try {
    window.dispatchEvent(new Event("mb-zoom-change"));
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

export default function BottomMusicBar() {
  const nav = useNavigate();

  const tracks: Track[] = useMemo(
    () => [
      // Ambient / general
      {
        id: "strings_of_time",
        title: "Strings of Time",
        src: "/music/2016-05-06_-_Strings_of_Time_-_David_Fesliyan_1.mp3",
        group: "all",
      },
      {
        id: "peace_and_happy",
        title: "Peace And Happy",
        src: "/music/2016-04-26_-_Peace_And_Happy_-_David_Fesliyan-2.mp3",
        group: "all",
      },
      {
        id: "an_ambient_day",
        title: "An Ambient Day",
        src: "/music/2015-12-22_-_An_Ambient_Day_-_David_Fesliyan-2.mp3",
        group: "all",
      },
      {
        id: "land_of_8_bits",
        title: "Land of 8 Bits",
        src: "/music/2019-01-10_-_Land_of_8_Bits_-_Stephen_Bennett_-_FesliyanStudios.com-2.mp3",
        group: "all",
      },
      {
        id: "simplicity",
        title: "Simplicity",
        src: "/music/2020-09-24_-_Simplicity_-_David_Fesliyan-2.mp3",
        group: "all",
      },
      {
        id: "tropical_keys",
        title: "Tropical Keys",
        src: "/music/2020-09-14_-_Tropical_Keys_-_www.FesliyanStudios.com_David_Renda_1.mp3",
        group: "all",
      },
      {
        id: "mellow_thoughts",
        title: "Mellow Thoughts",
        src: "/music/2020-09-14_-_Mellow_Thoughts_-_www.FesliyanStudios.com_David_Renda-2.mp3",
        group: "all",
      },
      {
        id: "looking_up",
        title: "Looking Up",
        src: "/music/2020-09-14_-_Looking_Up_-_www.FesliyanStudios.com_David_Renda-2.mp3",
        group: "all",
      },
      {
        id: "cruisin_along",
        title: "Cruisin Along",
        src: "/music/2020-08-19_-_Cruisin_Along_-_www.FesliyanStudios.com_David_Renda-2.mp3",
        group: "all",
      },
      {
        id: "the_soft_lullaby",
        title: "The Soft Lullaby",
        src: "/music/2020-03-22_-_The_Soft_Lullaby_-_FesliyanStudios.com_-_David_Renda-2.mp3",
        group: "all",
      },
      {
        id: "not_much_to_say",
        title: "Not Much To Say",
        src: "/music/2020-02-11_-_Not_Much_To_Say_-_David_Fesliyan-2.mp3",
        group: "all",
      },
      {
        id: "elven_forest",
        title: "Elven Forest",
        src: "/music/2019-07-29_-_Elven_Forest_-_FesliyanStudios.com_-_David_Renda-2.mp3",
        group: "all",
      },
      {
        id: "done_with_work",
        title: "Done With Work",
        src: "/music/2019-07-02_-_Done_With_Work_-_www.FesliyanStudios.com_-_David_Renda-2.mp3",
        group: "all",
      },
      {
        id: "on_my_own",
        title: "On My Own",
        src: "/music/2019-06-27_-_On_My_Own_-_www.FesliyanStudios.com_-_David_Renda-2.mp3",
        group: "all",
      },
      {
        id: "chill_gaming",
        title: "Chill Gaming",
        src: "/music/2019-06-07_-_Chill_Gaming_-_David_Fesliyan-2.mp3",
        group: "all",
      },
      {
        id: "the_lounge",
        title: "The Lounge",
        src: "/music/2019-06-05_-_The_Lounge_-_www.fesliyanstudios.com_-_David_Renda-2.mp3",
        group: "all",
      },
      {
        id: "elevator_ride",
        title: "Elevator Ride",
        src: "/music/2019-05-03_-_Elevator_Ride_-_www.fesliyanstudios.com-2.mp3",
        group: "all",
      },
      {
        id: "sad_winds_chapter_1",
        title: "Sad Winds Chapter 1",
        src: "/music/2017-10-14_-_Sad_Winds_Chapter_1_-_David_Fesliyan-2.mp3",
        group: "all",
      },

      // Mercy / MB songs
      {
        id: "mb_theme_1",
        title: "MB Theme 1",
        src: "/music/2015-11-08_-_Peace_-_David_Fesliyan-2.mp3",
        group: "mb",
      },
      {
        id: "where_mercy_finds_me",
        title: "Where Mercy Finds Me",
        src: "/music/Where Mercy Finds Me _ Nơi Mercy Tìm Thấy Tôi.mp3",
        group: "mb",
      },
      {
        id: "where_mercy_finds_me_1",
        title: "Where Mercy Finds Me (1)",
        src: "/music/Where Mercy Finds Me _ Nơi Mercy Tìm Thấy Tôi (1).mp3",
        group: "mb",
      },
      {
        id: "where_mercy_finds_me_2",
        title: "Where Mercy Finds Me (2)",
        src: "/music/Where Mercy Finds Me _ Nơi Mercy Tìm Thấy Tôi (2).mp3",
        group: "mb",
      },
      {
        id: "where_mercy_finds_me_3",
        title: "Where Mercy Finds Me (3)",
        src: "/music/Where Mercy Finds Me _ Nơi Mercy Tìm Thấy Tôi (3).mp3",
        group: "mb",
      },
      {
        id: "where_mercy_finds_me_4",
        title: "Where Mercy Finds Me (4)",
        src: "/music/Where Mercy Finds Me _ Nơi Mercy Tìm Thấy Tôi (4).mp3",
        group: "mb",
      },
      {
        id: "where_mercy_finds_me_5",
        title: "Where Mercy Finds Me (5)",
        src: "/music/Where Mercy Finds Me _ Nơi Mercy Tìm Thấy Tôi (5).mp3",
        group: "mb",
      },
      {
        id: "when_mercy_looks_at_me",
        title: "When Mercy Looks at Me",
        src: "/music/When Mercy Looks at Me _ Khi Mercy Nhìn Về Tôi.mp3",
        group: "mb",
      },
      {
        id: "when_mercy_looks_at_me_1",
        title: "When Mercy Looks at Me (1)",
        src: "/music/When Mercy Looks at Me _ Khi Mercy Nhìn Về Tôi (1).mp3",
        group: "mb",
      },
      {
        id: "song_of_mercy_blade",
        title: "The Song of Mercy Blade",
        src: '/music/The Song of Mercy Blade" – A Signature Anthem for Your Inner Life.mp3',
        group: "mb",
      },
      {
        id: "song_of_mercy_blade_1",
        title: "The Song of Mercy Blade (1)",
        src: '/music/The Song of Mercy Blade" – A Signature Anthem for Your Inner Life (1).mp3',
        group: "mb",
      },
      {
        id: "song_of_mercy_blade_3",
        title: "The Song of Mercy Blade (3)",
        src: '/music/The Song of Mercy Blade" – A Signature Anthem for Your Inner Life (3).mp3',
        group: "mb",
      },
      {
        id: "step_with_me_mercy",
        title: "Step With Me, Mercy",
        src: "/music/Step With Me, Mercy _ Đi Cùng Tôi, Mercy.mp3",
        group: "mb",
      },
      {
        id: "romanticmusic2018_11_11_tender_love",
        title: "Tender Love",
        src: "/music/RomanticMusic2018-11-11_-_Tender_Love_-_David_Fesliyan-2.mp3",
        group: "mb",
      },
      {
        id: "rise_with_mercy",
        title: "Rise With Mercy",
        src: "/music/Rise with Mercy _ Trỗi Dậy Cùng Mercy.mp3",
        group: "mb",
      },
      {
        id: "mercy_blade_theme",
        title: "Mercy Blade Theme",
        src: "/music/mercy_blade_theme.mp3",
        group: "mb",
      },
      {
        id: "mercy_on_my_mind",
        title: "Mercy On My Mind",
        src: "/music/Mercy On My Mind _ Mercy Trong Tâm Trí.mp3",
        group: "mb",
      },
      {
        id: "mercy_on_my_mind_1",
        title: "Mercy On My Mind (1)",
        src: "/music/Mercy On My Mind _ Mercy Trong Tâm Trí (1).mp3",
        group: "mb",
      },
      {
        id: "in_the_quiet_mercy",
        title: "In the Quiet, Mercy",
        src: "/music/In the Quiet, Mercy _ Trong Im Lặng, Mercy.mp3",
        group: "mb",
      },
      {
        id: "in_a_quiet_room_i_open_my_mind",
        title: "In a Quiet Room, I Open My Mind",
        src: "/music/In a quiet room, I open my mind,.mp3",
        group: "mb",
      },
      {
        id: "heart_of_the_blade",
        title: "Heart of the Blade",
        src: "/music/Heart of the Blade _ Trái Tim Của Lưỡi Gươm.mp3",
        group: "mb",
      },
      {
        id: "heart_of_the_blade_1",
        title: "Heart of the Blade (1)",
        src: "/music/Heart of the Blade _ Trái Tim Của Lưỡi Gươm (1).mp3",
        group: "mb",
      },
    ],
    []
  );

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastNonZeroVolRef = useRef<number>(0.6);

  const [tab, setTab] = useState<TabId>(() => {
    const v = getInitialString(LS_TAB, "all");
    return v === "all" || v === "mb" || v === "fav" ? (v as TabId) : "all";
  });

  const [favorites, setFavorites] = useState<Record<string, boolean>>(() =>
    getInitialFav()
  );

  const visibleTracks = useMemo(() => {
    if (tab === "mb") return tracks.filter((t) => t.group === "mb");
    if (tab === "fav") return tracks.filter((t) => favorites[t.id]);
    return tracks;
  }, [tab, tracks, favorites]);

  const [trackId, setTrackId] = useState<string>(() => {
    const saved = getInitialString(LS_TRACK, tracks[0]?.id ?? "");
    return tracks.some((t) => t.id === saved) ? saved : tracks[0]?.id ?? "";
  });

  const track = useMemo(
    () => tracks.find((t) => t.id === trackId) ?? tracks[0],
    [tracks, trackId]
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

  const favTabIcon = tab === "fav" ? "★" : "☆";

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
              style={tab === "mb" ? pillActive : pill}
              onClick={() => setTab("mb")}
            >
              MB Songs
            </button>

            <button
              type="button"
              style={
                tab === "fav"
                  ? { ...iconPill, background: "rgba(184,77,255,0.12)" }
                  : iconPill
              }
              onClick={() => setTab("fav")}
              aria-label="Favorites tab"
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
          max-width: 220px;
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

/* New thing to learn:
   In CSS Grid/Flex, “overflow” often comes from default min-width behavior.
   Setting minWidth: 0 (or overflow hidden) on grid children prevents layout blowouts. */