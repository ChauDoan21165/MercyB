// src/pages/ChatHub.tsx
// MB-BLUE-15.2 — 2025-12-20 — ChatHub uses canonical roomJsonResolver (single loader path)

import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { getErrorMessage } from "@/lib/constants/uiText";
import { canonicalizeRoomId, loadRoomJson, type RoomJsonResolverErrorKind } from "@/lib/roomJsonResolver";

type LoadState = "loading" | "ready" | "error";
type ErrorKind = RoomJsonResolverErrorKind;

export default function ChatHub() {
  const { roomId } = useParams<{ roomId: string }>();

  const canonicalId = useMemo(() => canonicalizeRoomId(roomId || ""), [roomId]);

  const [state, setState] = useState<LoadState>("loading");
  const [errorKind, setErrorKind] = useState<ErrorKind | null>(null);

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

      try {
        await loadRoomJson(roomId);
        if (!cancelled) setState("ready");
      } catch (err: any) {
        if (cancelled) return;

        const kind: ErrorKind =
          err?.kind === "not_found" ||
          err?.kind === "json_invalid" ||
          err?.kind === "network" ||
          err?.kind === "server"
            ? err.kind
            : "server";

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
        ? "NETWORK_ERROR"
        : "SERVER_ERROR";

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

  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <h1 className="text-xl font-semibold">Room loaded</h1>
        <p className="text-muted-foreground mt-2">
          roomId: <code>{roomId}</code> → <code>{canonicalId}</code>
        </p>
      </div>
    </div>
  );
}
