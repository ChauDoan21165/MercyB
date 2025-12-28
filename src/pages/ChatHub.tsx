// src/pages/ChatHub.tsx
// MB-BLUE-97.5 — 2025-12-28 (+0700)
/**
 * ChatHub (Room Loader — THIN CONTROLLER)
 *
 * Phase III rules (LOCKED):
 * - ChatHub loads room JSON
 * - Handles loading / error only
 * - Does NOT render entries
 * - Does NOT render keywords
 * - Does NOT touch audio logic
 *
 * Rendering is delegated to RoomRenderer.
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

// Mercy Host (guarded)
import MercyHostCorner from "@/components/mercy/MercyHostCorner";
import { FEATURE_FLAGS } from "@/lib/featureFlags";

type LoadState = "loading" | "ready" | "error";
type ErrorKind = RoomJsonResolverErrorKind;
type AnyRoom = any;

export default function ChatHub() {
  const { roomId } = useParams<{ roomId: string }>();

  const canonicalId = useMemo(() => {
    return canonicalizeRoomId(roomId || "");
  }, [roomId]);

  const [state, setState] = useState<LoadState>("loading");
  const [errorKind, setErrorKind] = useState<ErrorKind | null>(null);
  const [room, setRoom] = useState<AnyRoom | null>(null);

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

      try {
        // ✅ Always load via canonical ID (single source of truth)
        const data = await loadRoomJson(canonicalId);

        if (!cancelled) {
          setRoom(data);
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

  /* ---------------- states ---------------- */

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

  /* ---------------- success ---------------- */

  const hostRoomId = room?.id || canonicalId || roomId || "unknown_room";
  const hostRoomTitle =
    room?.title?.en || room?.description?.en || canonicalId || "Room";
  const hostTier = (room?.tier || "free") as "free" | "vip1" | "vip2" | "vip3";

  return (
    <div className="mx-auto w-full max-w-none px-4 md:px-6 py-10">
      {FEATURE_FLAGS.MERCY_HOST_ENABLED && (
        <MercyHostCorner
          roomId={hostRoomId}
          roomTitle={hostRoomTitle}
          roomTier={hostTier}
          language="en"
        />
      )}

      {/* ✅ AUTHORITATIVE RENDER */}
      <RoomRenderer room={room} roomId={canonicalId || roomId} />
    </div>
  );
}
