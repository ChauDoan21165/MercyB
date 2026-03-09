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
 *
 * PATCH (2026-02-XX):
 * - TEST STABILITY: Even if room load fails (DB/JSON), error UI MUST still provide a Back button
 *   so navigation integration tests don't hang on "Room error" screens.
 * - LOAD ROBUSTNESS: Try multiple ID variants (hyphen/underscore) when loading JSON.
 *
 * PATCH (2026-03-08g):
 * - Persist last successful room id to localStorage for "Continue your journey" surfaces.
 * - Add a small calm arrival overlay before showing room content.
 * - Keep ChatHub THIN: no new data writes, no auth changes, no hero/header duplication.
 *
 * PATCH (2026-03-09):
 * - Align RoomRenderer props with current RoomRenderer contract.
 * - Pass roomId through explicitly.
 *
 * PATCH (2026-03-09b):
 * - Remove dead uiKind detection and related helpers.
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

type LoadState = "loading" | "ready" | "error";
type ErrorKind = RoomJsonResolverErrorKind;
type AnyRoom = any;

const PAGE_MAX = 980;
const LS_LAST_ROOM = "mb.lastRoomId";
const ARRIVAL_DELAY_MS = 1600;

/* ----------------------------------------------------- */
/* helpers                                               */
/* ----------------------------------------------------- */
function uniqueStrings(list: string[]): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const s of list) {
    const v = String(s || "").trim();
    if (!v) continue;
    if (seen.has(v)) continue;
    seen.add(v);
    out.push(v);
  }
  return out;
}

function roomIdVariants(roomId: string, canonicalId: string): string[] {
  const raw = String(roomId || "").trim();
  const canon = String(canonicalId || "").trim();

  const rawHyphen = raw.replace(/_/g, "-");
  const rawUnder = raw.replace(/-/g, "_");

  const canonHyphen = canon.replace(/_/g, "-");
  const canonUnder = canon.replace(/-/g, "_");

  return uniqueStrings([raw, rawHyphen, canonHyphen, canon, rawUnder, canonUnder]);
}

function fallbackParentRoute(roomId?: string): string {
  const id = String(roomId || "").trim();
  if (!id) return "/rooms";
  if (/sexuality-curiosity-vip3-sub[1-6]$/i.test(id)) return "/sexuality-culture";
  if (/-vip3\b/i.test(id)) return "/rooms-vip3";
  if (/-vip2\b/i.test(id)) return "/rooms-vip2";
  if (/-vip1\b/i.test(id)) return "/rooms-vip1";
  return "/rooms";
}

async function getParentRouteSafe(roomId?: string): Promise<string> {
  try {
    const mod: any = await import("@/lib/routeHelper").catch(() => null);
    const fn = mod?.getParentRoute || mod?.getParentPath;
    if (typeof fn === "function") return fn(roomId);
  } catch {
    // ignore
  }
  return fallbackParentRoute(roomId);
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
/* CALM ARRIVAL                                          */
/* ----------------------------------------------------- */
function ArrivalOverlay() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center px-6">
      <div className="text-center">
        <div
          aria-hidden="true"
          className="mx-auto mb-5 h-3 w-3 rounded-full bg-black/30 animate-pulse"
        />
        <div className="text-lg font-semibold text-foreground">
          Take a quiet breath.
        </div>
        <div className="mt-2 text-sm text-muted-foreground">
          You are entering a reflection room.
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------- */
/* MAIN                                                  */
/* ----------------------------------------------------- */
export default function ChatHub() {
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();

  const canonicalId = useMemo(() => canonicalizeRoomId(roomId || ""), [roomId]);
  const loadKeys = useMemo(
    () => roomIdVariants(roomId || "", canonicalId),
    [roomId, canonicalId]
  );

  const [state, setState] = useState<LoadState>("loading");
  const [errorKind, setErrorKind] = useState<ErrorKind | null>(null);
  const [room, setRoom] = useState<AnyRoom | null>(null);
  const [roomSpec, setRoomSpec] = useState<RoomSpec | null>(null);
  const [showArrival, setShowArrival] = useState<boolean>(true);

  useEffect(() => {
    syncRootZoomFromStorage();

    const onStorage = (e: StorageEvent) => {
      if (!e.key || e.key === "mb.ui.zoom" || e.key === "mb_zoom") {
        syncRootZoomFromStorage();
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    async function run() {
      if (!roomId) {
        if (cancelled) return;
        setState("error");
        setErrorKind("not_found" as ErrorKind);
        setRoom(null);
        setRoomSpec(null);
        setShowArrival(false);
        return;
      }

      setState("loading");
      setErrorKind(null);
      setRoom(null);
      setRoomSpec(null);
      setShowArrival(true);

      let loadedRoom: AnyRoom | null = null;
      let lastErrorKind: ErrorKind | null = null;

      for (const key of loadKeys) {
        try {
          const data = await loadRoomJson(key);
          if (data) {
            loadedRoom = data;
            break;
          }
        } catch (err: any) {
          const kind = (err?.kind || err?.code || "unknown") as ErrorKind;
          lastErrorKind = kind;
        }
      }

      if (cancelled) return;

      if (!loadedRoom) {
        setState("error");
        setErrorKind(lastErrorKind || ("not_found" as ErrorKind));
        setShowArrival(false);
        return;
      }

      const effectiveSpec = getEffectiveRoomSpec(loadedRoom);

      setRoom(loadedRoom);
      setRoomSpec(effectiveSpec);
      setState("ready");

      try {
        const persistedId =
          String(loadedRoom?.id || roomId || canonicalId || "").trim() ||
          String(roomId || "").trim();
        if (persistedId) {
          localStorage.setItem(LS_LAST_ROOM, persistedId);
        }
      } catch {
        // ignore
      }

      timer = setTimeout(() => {
        if (!cancelled) setShowArrival(false);
      }, ARRIVAL_DELAY_MS);
    }

    void run();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [roomId, canonicalId, loadKeys]);

  const errorMessage = useMemo(() => {
    return getErrorMessage(errorKind || "unknown");
  }, [errorKind]);

  async function handleBack() {
    const parent = await getParentRouteSafe(roomId);
    navigate(parent);
  }

  const shellClass = "mx-auto w-full max-w-[980px] px-4 pb-40 pt-3";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className={shellClass}>
        {state === "loading" ? (
          <div className="rounded-2xl border border-black/10 bg-white/70 p-6 shadow-sm">
            <ArrivalOverlay />
          </div>
        ) : null}

        {state === "error" ? (
          <div className="rounded-2xl border border-black/10 bg-white/80 p-6 shadow-sm">
            <div className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Room error
            </div>

            <h1 className="mt-2 text-2xl font-bold text-foreground">
              We could not open this room.
            </h1>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {errorMessage}
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => void handleBack()}
                className="rounded-xl border border-black/10 bg-white px-4 py-2 font-medium text-foreground shadow-sm transition hover:bg-black/[0.03]"
              >
                ← Back
              </button>

              <button
                type="button"
                onClick={() => navigate("/rooms")}
                className="rounded-xl border border-black/10 bg-white px-4 py-2 font-medium text-foreground shadow-sm transition hover:bg-black/[0.03]"
              >
                Browse rooms
              </button>
            </div>
          </div>
        ) : null}

        {state === "ready" && room ? (
          <div className="space-y-4">
            {showArrival ? (
              <div className="rounded-2xl border border-black/10 bg-white/75 p-6 shadow-sm">
                <ArrivalOverlay />
              </div>
            ) : null}

            <div className={showArrival ? "hidden" : "block"}>
              <RoomRenderer
                room={room}
                roomId={roomId}
                roomSpec={roomSpec || undefined}
              />
            </div>
          </div>
        ) : null}
      </main>

      {FEATURE_FLAGS?.mercyHostCorner ? <MercyHostCorner /> : null}

      <div
        aria-label="Bottom music dock"
        className="pointer-events-none fixed inset-x-0 bottom-3 z-[80] px-4"
      >
        <div
          className="pointer-events-auto mx-auto w-full"
          style={{ maxWidth: PAGE_MAX }}
        >
          <BottomMusicBar />
        </div>
      </div>
    </div>
  );
}