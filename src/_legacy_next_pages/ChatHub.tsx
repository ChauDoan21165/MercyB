// src/_legacy_next_pages/ChatHub.tsx
// MB-BLUE-15.3 — 2025-12-21
/**
 * ChatHub (Room Loader Surface)
 * Strategic rule:
 * - ChatHub must NOT re-implement resolver rules.
 * - Single canonical resolver lives in: src/lib/roomJsonResolver.ts
 *
 * This file only:
 * - reads :roomId from route
 * - calls loadRoomJson(roomId)
 * - stores loaded room in state
 * - renders RoomRenderer
 */

import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { getErrorMessage } from "@/lib/constants/uiText";
import {
  canonicalizeRoomId,
  loadRoomJson,
  type RoomJsonResolverErrorKind,
} from "@/lib/roomJsonResolver";

import RoomRenderer from "@/components/room/RoomRenderer";

type LoadState = "loading" | "ready" | "error";
type ErrorKind = RoomJsonResolverErrorKind;

export default function ChatHub() {
  const { roomId } = useParams<{ roomId: string }>();

  const canonicalId = useMemo(() => canonicalizeRoomId(roomId || ""), [roomId]);

  const [state, setState] = useState<LoadState>("loading");
  const [errorKind, setErrorKind] = useState<ErrorKind | null>(null);

  // NEW: store the loaded room JSON
  const [room, setRoom] = useState<any>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!roomId) {
        setRoom(null);
        setErrorKind("not_found");
        setState("error");
        return;
      }

      setState("loading");
      setErrorKind(null);
      setRoom(null);

      try {
        const data = await loadRoomJson(roomId);

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

        setRoom(null);
        setErrorKind(kind);
        setState("error");
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [roomId]);

  if (state === "loading") {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
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
      <div className="flex h-full items-center justify-center text-center p-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Room error</h2>
          <p className="text-muted-foreground">{getErrorMessage(msgKey)}</p>

          <p className="text-xs text-muted-foreground mt-3">
            roomId: <code>{roomId}</code> → <code>{canonicalId}</code>
          </p>
        </div>
      </div>
    );
  }

  // READY
  return <RoomRenderer room={room} />;
}
