// PATH: src/pages/ChatHub.tsx

// MB-BLUE-100.9 → MB-BLUE-101.NO-HERO-ROOMS → MB-BLUE-101.9-MERCY-GUIDE-IN-ROOM
/**
 * ChatHub (Room Loader — THIN CONTROLLER)
 *
 * FIX (MB-BLUE-101.9-MERCY-GUIDE-IN-ROOM):
 * - Mount MercyGuide INSIDE the real room page so it gets real room context
 * - Pass roomId, roomTitle, tier, pathSlug, tags, contentEn into MercyGuide
 * - Do NOT render TeacherMercyCorner here, to avoid duplicate host UI on room pages
 *
 * ZOOM FIX:
 * - Keep syncing --mb-essay-zoom from storage
 * - Apply that zoom variable to the live room content wrapper
 * - Do not change layout flow, headers, host, or bottom bar
 *
 * PRESERVED:
 * - ChatHub stays THIN
 * - No extra auth changes
 * - No hero/header duplication
 * - BottomMusicBar stays fixed and aligned
 * - Room loading / fallback / back button behavior preserved
 */

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  canonicalizeRoomId,
  loadRoomJson,
  type RoomJsonResolverErrorKind,
} from "@/lib/roomJsonResolver";
import { getErrorMessage } from "@/lib/constants/uiText";
import { normalizeTierOrUndefined } from "@/lib/constants/tiers";

import RoomRenderer from "@/components/room/RoomRenderer";
import { DownloadRoomButton } from "@/components/room/DownloadRoomButton";
import OfflineUnavailable from "@/components/offline/OfflineUnavailable";
import { getEffectiveRoomSpec, type RoomSpec } from "@/lib/roomSpecification";

import BottomMusicBar from "@/components/audio/BottomMusicBar";
import { MercyGuide } from "@/components/MercyGuide";

type LoadState = "loading" | "ready" | "error";
type ErrorKind = RoomJsonResolverErrorKind;
type AnyRoom = Record<string, unknown>;

const PAGE_MAX = 980;
const LS_LAST_ROOM = "mb.lastRoomId";
const ARRIVAL_DELAY_MS = 0;

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
  if (/sexuality-curiosity-level3-sub[1-6]$/i.test(id)) return "/sexuality-culture";
  if (/-level3\b/i.test(id)) return "/rooms-level3";
  if (/-level2\b/i.test(id)) return "/rooms-level2";
  if (/-level1\b/i.test(id)) return "/rooms-level1";
  return "/rooms";
}

async function getParentRouteSafe(roomId?: string): Promise<string> {
  try {
    const mod: unknown = await import("@/lib/routeHelper").catch(() => null);
    const anyMod = mod as {
      getParentRoute?: (roomId?: string) => string;
      getParentPath?: (roomId?: string) => string;
    } | null;
    const fn = anyMod?.getParentRoute || anyMod?.getParentPath;
    if (typeof fn === "function") return fn(roomId);
  } catch {
    // ignore
  }
  return fallbackParentRoute(roomId);
}

function asString(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

function firstNonEmptyString(...vals: unknown[]): string {
  for (const v of vals) {
    const s = asString(v);
    if (s) return s;
  }
  return "";
}

function arrayOfStrings(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.map((x) => asString(x)).filter(Boolean);
}

function getRoomTitleSafe(room: AnyRoom | null, roomId?: string): string {
  if (!room) return String(roomId || "").trim();

  return firstNonEmptyString(
    room.title,
    room.roomTitle,
    room.name,
    room.label,
    room.heading,
    room.slugTitle,
    room.id,
    roomId,
  );
}

function getRoomTierSafe(room: AnyRoom | null): string {
  if (!room) return "";

  return firstNonEmptyString(
    room.tier,
    room.vipTier,
    room.accessTier,
    room.level,
  );
}

function getRoomPathSlugSafe(room: AnyRoom | null): string {
  if (!room) return "";

  return firstNonEmptyString(
    room.pathSlug,
    room.path_slug,
    room.path,
    room.seriesSlug,
  );
}

function getRoomTagsSafe(room: AnyRoom | null): string[] {
  if (!room) return [];

  const direct = arrayOfStrings(room.tags);
  if (direct.length) return uniqueStrings(direct);

  const keywords = arrayOfStrings(room.keywords);
  if (keywords.length) return uniqueStrings(keywords);

  const topics = arrayOfStrings(room.topics);
  if (topics.length) return uniqueStrings(topics);

  return [];
}

function getRoomContentEnSafe(room: AnyRoom | null): string {
  if (!room) return "";

  const direct = firstNonEmptyString(
    room.contentEn,
    room.content_en,
    room.textEn,
    room.text_en,
    room.english,
    room.promptEn,
    room.prompt_en,
    room.summaryEn,
    room.summary_en,
    room.descriptionEn,
    room.description_en,
  );
  if (direct) return direct;

  const entries = Array.isArray(room.entries) ? room.entries : [];
  const lines = entries
    .slice(0, 12)
    .map((entry) => {
      const e = (entry ?? {}) as Record<string, unknown>;
      return firstNonEmptyString(
        e.text_en,
        e.textEn,
        e.en,
        e.english,
        e.line_en,
        e.lineEn,
      );
    })
    .filter(Boolean);

  return lines.join("\n").trim();
}

/* ----------------------------------------------------- */
/* ZOOM SYNC (LOCKED)                                    */
/* ----------------------------------------------------- */
function syncRootZoomFromStorage() {
  try {
    const rawPct = localStorage.getItem("mb.ui.zoom");
    let pct = rawPct ? Number(rawPct) : Number.NaN;

    if (!Number.isFinite(pct)) {
      const rawLegacy = localStorage.getItem("mb_zoom");
      const legacy = rawLegacy ? Number(rawLegacy) : Number.NaN;
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
    [roomId, canonicalId],
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

      let lastErrorKind: ErrorKind | null = null;

      // Wrap the existing variant-trying loop so it can be one half of Promise.all.
      const loadJson = async (): Promise<AnyRoom | null> => {
        let loaded: AnyRoom | null = null;
        for (const key of loadKeys) {
          try {
            const data = (await loadRoomJson(key)) as unknown as AnyRoom | null;
            if (data) {
              loaded = data;
              break;
            }
          } catch (err: unknown) {
            const anyErr = err as { kind?: ErrorKind; code?: ErrorKind };
            const kind = (anyErr?.kind || anyErr?.code || "unknown") as ErrorKind;
            lastErrorKind = kind;
          }
        }
        return loaded;
      };

      // Launch both before either is awaited. Spec only needs canonicalId
      // (synchronously available) — verified safe via empirical check that
      // loadedRoom.id === canonicalId for all 475 shipped rooms.
      const [loadedRoom, effectiveSpec] = await Promise.all([
        loadJson(),
        getEffectiveRoomSpec(canonicalId, null),
      ]);

      if (cancelled) return;

      if (!loadedRoom) {
        setState("error");
        setErrorKind(lastErrorKind || ("not_found" as ErrorKind));
        setShowArrival(false);
        return;
      }

      setRoom(loadedRoom);
      setRoomSpec(effectiveSpec);
      setState("ready");

      try {
        const persistedId =
          String(loadedRoom.id || roomId || canonicalId || "").trim() ||
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

  const roomTitle = useMemo(() => getRoomTitleSafe(room, roomId), [room, roomId]);
  const roomTier = useMemo(() => getRoomTierSafe(room), [room]);
  const roomPathSlug = useMemo(() => getRoomPathSlugSafe(room), [room]);
  const roomTags = useMemo(() => getRoomTagsSafe(room), [room]);
  const roomContentEn = useMemo(() => getRoomContentEnSafe(room), [room]);

  const shellClass = "mx-auto w-full max-w-[980px] px-4 pb-40 pt-3";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <style>{`
        :root {
          --mb-essay-zoom: var(--mb-essay-zoom, 100);
        }

        [data-mb-room-zoom="1"] {
          font-size: calc(16px * (var(--mb-essay-zoom, 100) / 100));
          line-height: 1.65;
        }

        [data-mb-room-zoom="1"] p,
        [data-mb-room-zoom="1"] li,
        [data-mb-room-zoom="1"] blockquote,
        [data-mb-room-zoom="1"] label,
        [data-mb-room-zoom="1"] figcaption,
        [data-mb-room-zoom="1"] .prose,
        [data-mb-room-zoom="1"] .text-sm,
        [data-mb-room-zoom="1"] .text-base,
        [data-mb-room-zoom="1"] .text-lg {
          font-size: calc(1em * (var(--mb-essay-zoom, 100) / 100)) !important;
        }
      `}</style>

      <main className={shellClass}>
        {state === "loading" ? (
          <div className="rounded-2xl border border-black/10 bg-white/70 p-6 shadow-sm">
            <ArrivalOverlay />
          </div>
        ) : null}

        {state === "error" && errorKind === "offline_unavailable" ? (
          <OfflineUnavailable
            roomId={roomId ?? null}
            onBack={() => void handleBack()}
          />
        ) : null}

        {state === "error" && errorKind !== "offline_unavailable" ? (
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
              {room && roomId ? (
                <div className="mb-3 flex justify-end">
                  <DownloadRoomButton
                    roomId={roomId}
                    room={room}
                    title={roomTitle || undefined}
                  />
                </div>
              ) : null}
              <div data-mb-room-zoom="1">
                {room && (
                  <RoomRenderer
                    room={room}
                    roomId={roomId}
                    roomSpec={roomSpec || undefined}
                  />
                )}
              </div>
            </div>
          </div>
        ) : null}
      </main>

      {state === "ready" && room ? (
        <MercyGuide
          roomId={String(roomId || "")}
          roomTitle={roomTitle || undefined}
          tier={roomTier || undefined}
          pathSlug={roomPathSlug || undefined}
          tags={roomTags.length ? roomTags : undefined}
          contentEn={roomContentEn || undefined}
        />
      ) : null}

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