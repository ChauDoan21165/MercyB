// src/pages/ChatHub.tsx
// MB-BLUE-11.5 — 2025-12-19 — ChatHub uses canonical roomJsonResolver (single loader path)

import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { getErrorMessage } from "@/lib/constants/uiText";

type LoadState = "loading" | "ready" | "error";
type ErrorKind = "not_found" | "json_invalid" | "network" | "server";

/**
 * Canonicalize roomId to snake_case (system-wide rule)
 */
function canonicalizeRoomId(input: string): string {
  return (input || "")
    .trim()
    .toLowerCase()
    .replace(/[-\s]+/g, "_")
    .replace(/_+/g, "_");
}

/**
 * Single canonical loader path:
 * - uses /src/lib/roomJsonResolver.ts (manifest + canonical rules)
 * - no direct /data string building here
 */
async function fetchRoomJson(roomIdRaw: string): Promise<any> {
  const canonicalId = canonicalizeRoomId(roomIdRaw);

  const { loadRoomJson } = await import("@/lib/roomJsonResolver");
  const data = await loadRoomJson(canonicalId);

  if (!data) {
    const err = new Error("ROOM_NOT_FOUND");
    (err as any).kind = "not_found";
    throw err;
  }

  return data;
}

export default function ChatHub() {
  const { roomId } = useParams<{ roomId: string }>();

  const canonicalId = useMemo(
    () => canonicalizeRoomId(roomId || ""),
    [roomId]
  );

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
        await fetchRoomJson(roomId);
        if (!cancelled) setState("ready");
      } catch (err: any) {
        if (cancelled) return;

        let kind: ErrorKind = "server";

        if (err?.kind) {
          kind = err.kind;
        } else if (err instanceof TypeError) {
          // fetch failed / network / CORS / offline
          kind = "network";
        } else if (String(err?.message || "").includes("ROOM_NOT_FOUND")) {
          kind = "not_found";
        } else if (String(err?.message || "").includes("Unexpected token")) {
          kind = "json_invalid";
        }

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
