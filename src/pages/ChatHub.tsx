// src/pages/ChatHub.tsx
// MB-BLUE-100.9 — 2026-01-02 (+0700)
/**
 * ChatHub (Room Loader — THIN CONTROLLER)
 *
 * ✅ FIX (MB-BLUE-100.9):
 * - STOP scaling the whole page with transform: scale(...).
 * - BottomMusicBar mount stays fixed + aligned to PAGE_MAX=980.
 * - Zoom stays live-refresh, but only via ROOT vars (no page scale).
 *
 * ✅ DEV ADDITION:
 * - DebugJWT button (DEV only) to safely log Supabase access_token
 *
 * RULES PRESERVED:
 * - SINGLE AuthProvider source of truth
 * - No window.supabase
 * - No terminal execution of React code
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

import BottomMusicBar from "@/components/audio/BottomMusicBar";
import HeroBand from "@/components/HeroBand";

// ✅ DEV JWT logger
import DebugJWT from "@/debug/DebugJWT";

type LoadState = "loading" | "ready" | "error";
type ErrorKind = RoomJsonResolverErrorKind;
type AnyRoom = any;

/* ----------------------------------------------------- */
/* helpers                                               */
/* ----------------------------------------------------- */
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
    room?.meta?.keywords_en,
  );
  const vi = firstNonEmptyArray(
    room?.keywords_vi,
    room?.keywords?.vi,
    room?.meta?.keywords_vi,
  );
  return { en, vi };
}
function detectRoomUiKind(room: AnyRoom): "keyword_hub" | "content" {
  const kw = resolveKeywords(room);
  return Math.max(kw.en.length, kw.vi.length) > 0 ? "keyword_hub" : "content";
}

/* ----------------------------------------------------- */
/* TOP BAR (LOCKED)                                      */
/* ----------------------------------------------------- */
function RoomTopBar() {
  const nav = useNavigate();
  const [dark, setDark] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    document.documentElement.setAttribute("data-mb-mode", dark ? "dark" : "light");
  }, [dark]);

  return (
    <div data-mb-topbar className="mb-5">
      <style>{`
        [data-mb-topbar] .mb-shell{
          border:1px solid rgba(0,0,0,0.10);
          background:rgba(255,255,255,0.86);
          backdrop-filter:blur(10px);
          border-radius:18px;
          box-shadow:0 10px 24px rgba(0,0,0,0.06);
          padding:10px 12px;
        }
        [data-mb-topbar] .mb-row{
          display:grid;
          grid-template-columns:1fr auto 1fr;
          align-items:center;
          gap:10px;
        }
        [data-mb-topbar] .mb-left,
        [data-mb-topbar] .mb-right{
          display:flex;
          align-items:center;
          gap:8px;
          white-space:nowrap;
          min-width:0;
        }
        [data-mb-topbar] .mb-brand{
          font-weight:900;
          font-size:36px;
          line-height:38px;
          letter-spacing:-0.02em;
          background:linear-gradient(90deg,#ff4d6d,#ffbe0b,#3a86ff,#8338ec,#06d6a0);
          -webkit-background-clip:text;
          color:transparent;
          max-width:52vw;
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
        }
        [data-mb-topbar] .mb-btn,
        [data-mb-topbar] .mb-iconbtn{
          height:34px;
          padding:0 12px;
          border-radius:12px;
          border:1px solid rgba(0,0,0,0.16);
          background:rgba(255,255,255,0.94);
          font-size:12px;
          font-weight:800;
        }
        [data-mb-topbar] .mb-iconbtn{
          width:34px;
          padding:0;
          display:flex;
          align-items:center;
          justify-content:center;
          flex:0 0 auto;
        }
        [data-mb-topbar] .mb-search{
          height:34px;
          border-radius:12px;
          border:1px solid rgba(0,0,0,0.16);
          padding:0 10px;
          font-size:12px;
          width:clamp(140px,26vw,320px);
          min-width:0;
          background:rgba(255,255,255,0.94);
        }
        @media (max-width: 740px){
          [data-mb-topbar] .mb-brand{
            font-size:28px;
            line-height:30px;
            max-width:44vw;
          }
          [data-mb-topbar] .mb-search{
            width:clamp(120px,22vw,240px);
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

          <div aria-hidden className="pointer-events-none justify-self-center min-w-0">
            <span className="mb-brand">Mercy Blade</span>
          </div>

          <div className="mb-right justify-self-end">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setQ("");
              }}
              placeholder="Search rooms..."
              className="mb-search"
            />

            {/* ✅ DEV ONLY JWT LOGGER */}
            {import.meta.env.DEV && <DebugJWT />}

            <button
              type="button"
              className="mb-iconbtn"
              onClick={() => setDark((v) => !v)}
              title="Day / Night"
            >
              {dark ? "🌙" : "☀️"}
            </button>

            <button type="button" onClick={() => nav("/tiers")} className="mb-btn" title="Tier Map">
              👁 <span className="hidden sm:inline">Tier Map</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------- */
/* ZOOM SYNC (LOCKED)                                    */
/* ----------------------------------------------------- */
function syncRootZoomFromStorage() {
  try {
    const rawPct = localStorage.getItem("mb.ui.zoom");
    let pct = rawPct ? Number(rawPct) : NaN;

    if (!Number.isFinite(pct)) {
      const rawLegacy = localStorage.getItem("mb_zoom");
      const legacy = rawLegacy ? Number(rawLegacy) : NaN;
      if (Number.isFinite(legacy)) pct = Math.round(legacy * 100);
    }

    if (!Number.isFinite(pct)) return;

    const safe = Math.max(60, Math.min(140, Math.round(pct)));
    document.documentElement.style.setProperty("--mb-essay-zoom", String(safe));
    document.documentElement.setAttribute("data-mb-zoom", String(safe));
  } catch {
    // ignore
  }
}

/* ----------------------------------------------------- */
/* MAIN                                                  */
/* ----------------------------------------------------- */
export default function ChatHub() {
  const { roomId } = useParams<{ roomId: string }>();
  const canonicalId = useMemo(() => canonicalizeRoomId(roomId || ""), [roomId]);

  const [state, setState] = useState<LoadState>("loading");
  const [errorKind, setErrorKind] = useState<ErrorKind | null>(null);
  const [room, setRoom] = useState<AnyRoom | null>(null);
  const [roomSpec, setRoomSpec] = useState<RoomSpec | null>(null);

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

        const spec = await getEffectiveRoomSpec(canonicalId, tier).catch(() => null);

        if (!cancelled) {
          setRoom(data);
          setRoomSpec(spec);
          setState("ready");
        }
      } catch (err: any) {
        if (cancelled) return;

        const kind: ErrorKind =
          err?.kind ||
          (err instanceof TypeError ? "network" : String(err?.message || "").includes("ROOM_NOT_FOUND")
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

  const uiKind = detectRoomUiKind(room);

  const hostRoomId = room?.id || canonicalId || roomId || "unknown_room";
  const hostRoomTitle = room?.title?.en || room?.description?.en || canonicalId || "Room";
  const hostTier = (room?.tier || "free") as "free" | "vip1" | "vip2" | "vip3";

  return (
    <>
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

        {/* NOTE: keyword_hub currently uses same renderer; kind is kept for future branching */}
        {uiKind === "keyword_hub" ? (
          <RoomRenderer room={room} roomId={canonicalId} roomSpec={roomSpec || undefined} />
        ) : (
          <RoomRenderer room={room} roomId={canonicalId} roomSpec={roomSpec || undefined} />
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
