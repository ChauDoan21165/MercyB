// src/pages/ChatHub.tsx
// MB-BLUE-100.9 → MB-BLUE-101.NO-HERO-ROOMS — 2026-01-14 (+0700)
/**
 * ChatHub (Room Loader — THIN CONTROLLER)
 *
 * ✅ FIX (MB-BLUE-101.NO-HERO-ROOMS):
 * - KEEP RoomTopBar (Mercy Blade stays on top bar) ✅
 * - REMOVE HeroBand from normal room pages ✅
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
 *
 * PATCH (2026-01-31):
 * - The “top box” (RoomTopBar) caused a DOUBLE HEADER when GlobalHeader/AppHeader are present.
 * - ChatHub must be THIN: DO NOT render a second header here.
 * - Room pages now rely on the global header(s) from the app shell.
 *
 * PATCH (2026-01-31b):
 * - ALIGN RULER WITH GLOBAL HEADER:
 *   GlobalHeader/AppHeader use: max-w-[980px] px-4
 *   ChatHub previously used:     max-w-[980px] px-4 md:px-6  (mismatch at md breakpoint)
 *   Fix: remove md:px-6 in BOTH wrappers so borders/boxes line up across pages.
 */

import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

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
  const en = firstNonEmptyArray(room?.keywords_en, room?.keywords?.en, room?.meta?.keywords_en);
  const vi = firstNonEmptyArray(room?.keywords_vi, room?.keywords?.vi, room?.meta?.keywords_vi);
  return { en, vi };
}
function detectRoomUiKind(room: AnyRoom): "keyword_hub" | "content" {
  const kw = resolveKeywords(room);
  return Math.max(kw.en.length, kw.vi.length) > 0 ? "keyword_hub" : "content";
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
    return <div className="min-h-[40vh] flex items-center justify-center text-muted-foreground">Loading…</div>;
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
      {/* ✅ RULER MUST MATCH GLOBAL HEADER: max-w-[980px] px-4 (NO md:px-6) */}
      <div className="mx-auto w-full max-w-[980px] px-4 py-6 pb-36">
        {/* PATCH (2026-01-31):
            ChatHub MUST NOT render a second header/topbox.
            GlobalHeader/AppHeader belong to the app shell. */}

        {/* ✅ NO HERO BAND ON ROOM PAGES (Home keeps hero) */}

        {FEATURE_FLAGS.MERCY_HOST_ENABLED && (
          <MercyHostCorner roomId={hostRoomId} roomTitle={hostRoomTitle} roomTier={hostTier} language="en" />
        )}

        {/* NOTE: keyword_hub currently uses same renderer; kind is kept for future branching */}
        {uiKind === "keyword_hub" ? (
          <RoomRenderer room={room} roomId={canonicalId} roomSpec={roomSpec || undefined} />
        ) : (
          <RoomRenderer room={room} roomId={canonicalId} roomSpec={roomSpec || undefined} />
        )}
      </div>

      {/* ✅ FIXED BOTTOM MOUNT: SAME RULER AS PAGE (NO md:px-6) */}
      <div data-mb-music-mount className="fixed bottom-0 left-0 right-0 z-50" style={{ pointerEvents: "none" }}>
        <div className="mx-auto w-full max-w-[980px] px-4 pb-4" style={{ pointerEvents: "auto" }}>
          <BottomMusicBar />
        </div>
      </div>
    </>
  );
}

/** New thing to learn:
 * If two pages “almost align” but differ on desktop, check breakpoint padding:
 * px-4 vs md:px-6 will quietly break your global ruler. */
