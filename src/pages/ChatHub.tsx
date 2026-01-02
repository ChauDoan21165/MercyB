// src/pages/ChatHub.tsx
// MB-BLUE-100.9 — 2026-01-02 (+0700)
/**
 * ChatHub (Room Loader — THIN CONTROLLER)
 *
 * ✅ FIX (MB-BLUE-100.9):
 * - STOP scaling the whole page with transform: scale(...).
 *   That was the REAL reason the fixed BottomMusicBar looked like it “sticks out”:
 *   content got scaled smaller, but the fixed dock stayed on the 980px ruler.
 *
 * - BottomMusicBar mount stays fixed + aligned to PAGE_MAX=980.
 * - Zoom stays live-refresh, but we only sync the ROOT zoom attributes/vars
 *   (RoomRenderer consumes them inside BOX 4; we do NOT scale the page).
 *
 * ✅ Preserved:
 * 1) HeroBand stays (src/components/HeroBand.tsx) → /hero/hero_band.jpg
 * 2) BottomMusicBar mount aligned to page ruler (max-w-[980px] + px)
 * 3) Top bar: Mercy Blade TRUE dead-center using grid 1fr auto 1fr
 */

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  canonicalizeRoomId,
  loadRoomJson,
  type RoomJsonResolverErrorKind,
} from "@/lib/roomJsonResolver";
import { getErrorMessage } from "@/lib/constants/uiText";

import RoomRenderer from "@/components/room/RoomRenderer";
import { getEffectiveRoomSpec, type RoomSpec } from "@/lib/roomSpecification";

import MercyHostCorner from "@/components/mercy/MercyHostCorner";
import { FEATURE_FLAGS } from "@/lib/featureFlags";

// ✅ UNIVERSAL MUSIC BAR ONLY (ENTERTAINMENT)
import BottomMusicBar from "@/components/audio/BottomMusicBar";

// ✅ HERO BAND (background + centered slogan)
import HeroBand from "@/components/HeroBand";

type LoadState = "loading" | "ready" | "error";
type ErrorKind = RoomJsonResolverErrorKind;
type AnyRoom = any;

function asArray(x: any) {
  return Array.isArray(x) ? x : [];
}
function firstNonEmptyArray(...candidates: any[]): any[] {
  for (const c of candidates) {
    const arr = asArray(c);
    if (arr.length > 0) return arr;
  }
  return [];
}
function resolveKeywords(room: AnyRoom) {
  const en = firstNonEmptyArray(
    room?.keywords_en,
    room?.keywords?.en,
    room?.meta?.keywords_en
  );
  const vi = firstNonEmptyArray(
    room?.keywords_vi,
    room?.keywords?.vi,
    room?.meta?.keywords_vi
  );
  return { en, vi };
}
function detectRoomUiKind(room: AnyRoom): "keyword_hub" | "content" {
  const kw = resolveKeywords(room);
  const kwCount = Math.max(kw.en.length, kw.vi.length);
  if (kwCount > 0) return "keyword_hub";
  return "content";
}

/** BOX 1 — one-row top bar (locked) */
function RoomTopBar() {
  const nav = useNavigate();
  const [dark, setDark] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-mb-mode",
      dark ? "dark" : "light"
    );
  }, [dark]);

  return (
    <div data-mb-topbar className="mb-5">
      <style>{`
        [data-mb-topbar] .mb-shell{
          border: 1px solid rgba(0,0,0,0.10);
          background: rgba(255,255,255,0.86);
          backdrop-filter: blur(10px);
          border-radius: 18px;
          box-shadow: 0 10px 24px rgba(0,0,0,0.06);
          padding: 10px 12px;
        }

        /* ✅ TRUE CENTER: left 1fr | brand auto | right 1fr */
        [data-mb-topbar] .mb-row{
          display:grid;
          grid-template-columns: 1fr auto 1fr;
          align-items:center;
          gap:10px;
          min-width:0;
        }

        [data-mb-topbar] .mb-left{
          display:flex;
          align-items:center;
          gap:8px;
          justify-self:start;
          min-width:0;
          white-space:nowrap;
        }

        [data-mb-topbar] .mb-right{
          display:flex;
          align-items:center;
          gap:8px;
          justify-self:end;
          min-width:0;
          white-space:nowrap;
        }

        [data-mb-topbar] .mb-brandCenter{
          justify-self:center;
          pointer-events:none;
          min-width:0;
        }

        [data-mb-topbar] .mb-brand{
          font-weight: 900;
          letter-spacing: -0.02em;
          background: linear-gradient(90deg,#ff4d6d,#ffbe0b,#3a86ff,#8338ec,#06d6a0);
          -webkit-background-clip: text;
          color: transparent;
          font-size: 36px;
          line-height: 38px;
          max-width: 52vw;
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
        }

        [data-mb-topbar] .mb-btn{
          height: 34px;
          padding: 0 12px;
          border-radius: 12px;
          border: 1px solid rgba(0,0,0,0.16);
          background: rgba(255,255,255,0.94);
          font-size: 12px;
          font-weight: 800;
          white-space: nowrap;
          flex: 0 0 auto;
        }

        [data-mb-topbar] .mb-iconbtn{
          width: 34px;
          height: 34px;
          border-radius: 12px;
          border: 1px solid rgba(0,0,0,0.16);
          background: rgba(255,255,255,0.94);
          display:flex;
          align-items:center;
          justify-content:center;
          flex: 0 0 auto;
        }

        [data-mb-topbar] .mb-search{
          height: 34px;
          border-radius: 12px;
          border: 1px solid rgba(0,0,0,0.16);
          background: rgba(255,255,255,0.94);
          padding: 0 10px;
          font-size: 12px;
          width: clamp(140px, 26vw, 320px);
          min-width: 0;
        }

        @media (max-width: 740px){
          [data-mb-topbar] .mb-brand{
            font-size: 28px;
            line-height: 30px;
            max-width: 44vw;
          }
          [data-mb-topbar] .mb-search{
            width: clamp(120px, 22vw, 240px);
          }
        }
      `}</style>

      <div className="mb-shell">
        <div className="mb-row">
          <div className="mb-left">
            <button type="button" onClick={() => nav("/")} className="mb-btn">
              Home
            </button>
            <button type="button" onClick={() => nav(-1)} className="mb-btn">
              Back
            </button>
          </div>

          <div className="mb-brandCenter" aria-hidden="true">
            <span className="mb-brand">Mercy Blade</span>
          </div>

          <div className="mb-right">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setQ("");
              }}
              placeholder="Search rooms..."
              className="mb-search"
            />
            <button
              type="button"
              onClick={() => setDark((v) => !v)}
              title="Day / Night"
              className="mb-iconbtn"
            >
              {dark ? "🌙" : "☀️"}
            </button>
            <button
              type="button"
              onClick={() => nav("/tiers")}
              title="Tier Map"
              className="mb-btn"
            >
              👁 <span className="hidden sm:inline">Tier Map</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function KeywordHubRoom({
  room,
  roomId,
  roomSpec,
}: {
  room: AnyRoom;
  roomId: string;
  roomSpec?: { use_color_theme?: boolean };
}) {
  return <RoomRenderer room={room} roomId={roomId} roomSpec={roomSpec} />;
}

/**
 * Zoom sync (LOCKED):
 * - Source of truth is BottomMusicBar (writes data-mb-zoom + --mb-essay-zoom + LS["mb.ui.zoom"])
 * - ChatHub must NOT scale the page. We only mirror root attrs/vars for safety.
 * - Back-compat: also accept legacy LS["mb_zoom"] (0.7–1.4 float).
 */
function syncRootZoomFromStorage() {
  try {
    // ✅ new canonical key (percent)
    const rawPct = localStorage.getItem("mb.ui.zoom");
    let pct = rawPct ? Number(rawPct) : NaN;

    // legacy key (ratio)
    if (!Number.isFinite(pct)) {
      const rawLegacy = localStorage.getItem("mb_zoom");
      const ratio = rawLegacy ? Number(rawLegacy) : NaN;
      if (Number.isFinite(ratio)) pct = Math.round(ratio * 100);
    }

    if (!Number.isFinite(pct)) return;

    const safe = Math.max(60, Math.min(140, Math.round(pct)));
    document.documentElement.style.setProperty("--mb-essay-zoom", String(safe));
    document.documentElement.setAttribute("data-mb-zoom", String(safe));
  } catch {
    // ignore
  }
}

export default function ChatHub() {
  const { roomId } = useParams<{ roomId: string }>();
  const canonicalId = useMemo(() => canonicalizeRoomId(roomId || ""), [roomId]);

  const [state, setState] = useState<LoadState>("loading");
  const [errorKind, setErrorKind] = useState<ErrorKind | null>(null);
  const [room, setRoom] = useState<AnyRoom | null>(null);
  const [roomSpec, setRoomSpec] = useState<RoomSpec | null>(null);

  // ✅ ZOOM: mirror root values on focus / storage / explicit event
  useEffect(() => {
    const sync = () => syncRootZoomFromStorage();

    sync();
    window.addEventListener("mb-zoom-change", sync as EventListener);
    window.addEventListener("focus", sync);

    const onStorage = (e: StorageEvent) => {
      if (e.key === "mb.ui.zoom" || e.key === "mb_zoom") sync();
    };
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("mb-zoom-change", sync as EventListener);
      window.removeEventListener("focus", sync);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!roomId) {
        setErrorKind("not_found");
        setState("error");
        return;
      }

      setState("loading");
      setErrorKind(null);
      setRoom(null);
      setRoomSpec(null);

      try {
        const data = await loadRoomJson(canonicalId);
        const tier = (data?.tier || "free") as string;

        let resolved: RoomSpec | null = null;
        try {
          resolved = await getEffectiveRoomSpec(canonicalId, tier);
        } catch (e: any) {
          console.warn("[ChatHub] roomSpec resolver failed:", e?.message || e);
        }

        if (!cancelled) {
          setRoom(data);
          setRoomSpec(resolved);
          setState("ready");
        }
      } catch (err: any) {
        if (cancelled) return;

        const kind: ErrorKind =
          err?.kind ||
          (err instanceof TypeError
            ? "network"
            : String(err?.message || "").includes("ROOM_NOT_FOUND")
            ? "not_found"
            : String(err?.message || "").includes("JSON_INVALID") ||
              String(err?.message || "").includes("Unexpected token")
            ? "json_invalid"
            : "server");

        setErrorKind(kind);
        setState("error");
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [roomId, canonicalId]);

  if (state === "loading") {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (state === "error") {
    const msgKey =
      errorKind === "not_found"
        ? "ROOM_NOT_FOUND"
        : errorKind === "json_invalid"
        ? "JSON_INVALID"
        : errorKind === "network"
        ? "network_error"
        : "server_error";

    return (
      <div className="min-h-[40vh] flex items-center justify-center text-center p-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Room error</h2>
          <p className="text-muted-foreground">{getErrorMessage(msgKey)}</p>
          <p className="text-xs text-muted-foreground mt-3">
            roomId: <code>{roomId}</code> → canonical: <code>{canonicalId}</code>
          </p>
        </div>
      </div>
    );
  }

  const hostRoomId = room?.id || canonicalId || roomId || "unknown_room";
  const hostRoomTitle =
    room?.title?.en || room?.description?.en || canonicalId || "Room";
  const hostTier = (room?.tier || "free") as "free" | "vip1" | "vip2" | "vip3";

  const uiKind = detectRoomUiKind(room);

  return (
    <>
      {/* ✅ DO NOT SCALE PAGE (prevents “dock sticks out” illusion) */}
      <div className="mx-auto w-full max-w-[980px] px-4 md:px-6 py-6 pb-36">
        <RoomTopBar />

        <HeroBand />

        {FEATURE_FLAGS.MERCY_HOST_ENABLED && (
          <MercyHostCorner
            roomId={hostRoomId}
            roomTitle={hostRoomTitle}
            roomTier={hostTier}
            language="en"
          />
        )}

        {uiKind === "keyword_hub" ? (
          <KeywordHubRoom
            room={room}
            roomId={canonicalId || roomId || ""}
            roomSpec={
              roomSpec ? { use_color_theme: !!roomSpec.use_color_theme } : undefined
            }
          />
        ) : (
          <RoomRenderer
            room={room}
            roomId={canonicalId || roomId}
            roomSpec={
              roomSpec ? { use_color_theme: !!roomSpec.use_color_theme } : undefined
            }
          />
        )}
      </div>

      {/* ✅ FIXED BOTTOM MOUNT: SAME RULER AS PAGE */}
      <div
        data-mb-music-mount
        className="fixed bottom-0 left-0 right-0 z-50"
        style={{ pointerEvents: "none" }}
      >
        <div
          className="mx-auto w-full max-w-[980px] px-4 md:px-6 pb-4"
          style={{ pointerEvents: "auto" }}
        >
          <BottomMusicBar />
        </div>
      </div>
    </>
  );
}

/** New thing to learn:
 * If you scale the page, fixed UI won’t scale with it — it will look “wrong width”.
 * Keep zoom inside content areas (RoomRenderer BOX 4), not on the whole route. */
