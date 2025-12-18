import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { PUBLIC_ROOM_MANIFEST } from "@/lib/roomManifest";
import { getErrorMessage } from "@/lib/constants/uiText";

type LoadState = "loading" | "ready" | "error";
type ErrorKind = "not_found" | "json_invalid" | "network" | "server";

function canonicalizeRoomId(input: string): string {
  return (input || "")
    .trim()
    .toLowerCase()
    .replace(/[-\s]+/g, "_")
    .replace(/_+/g, "_");
}

async function fetchRoomJsonBySystem(roomIdRaw: string): Promise<any> {
  const canonicalId = canonicalizeRoomId(roomIdRaw);

  const manifestPath =
    PUBLIC_ROOM_MANIFEST[canonicalId] || `data/${canonicalId}.json`;

  const cacheBuster = Date.now();
  const url = `/${manifestPath}?t=${cacheBuster}`;

  const res = await fetch(url, { cache: "no-store" });

  if (res.status === 404) {
    const err = new Error("ROOM_NOT_FOUND");
    (err as any).kind = "not_found";
    throw err;
  }

  if (!res.ok) {
    const err = new Error(`HTTP_${res.status}`);
    (err as any).kind = "server";
    throw err;
  }

  // If JSON is invalid, this will throw
  const data = await res.json();
  return data;
}

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
        await fetchRoomJsonBySystem(roomId);
        if (!cancelled) setState("ready");
      } catch (err: any) {
        if (cancelled) return;

        // classify quickly + safely
        const kind: ErrorKind =
          err?.kind ||
          (err instanceof TypeError
            ? "network"
            : String(err?.message || "").includes("ROOM_NOT_FOUND")
            ? "not_found"
            : String(err?.message || "").includes("Unexpected token")
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
