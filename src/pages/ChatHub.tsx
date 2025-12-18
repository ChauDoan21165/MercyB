import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { loadRoomJson } from "@/lib/roomJsonResolver";
import { classifyRoomError } from "@/lib/errors/roomErrorKind";
import { getErrorMessage } from "@/lib/constants/uiText";

type LoadState = "loading" | "ready" | "error";

export default function ChatHub() {
  const { roomId } = useParams<{ roomId: string }>();

  const [state, setState] = useState<LoadState>("loading");
  const [errorKind, setErrorKind] = useState<
    "not_found" | "json_invalid" | "network" | "server" | null
  >(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!roomId) {
        setErrorKind("not_found");
        setState("error");
        return;
      }

      setState("loading");

      try {
        await loadRoomJson(roomId);
        if (!cancelled) {
          setState("ready");
        }
      } catch (err) {
        if (cancelled) return;

        const kind = classifyRoomError(err);
        setErrorKind(kind);
        setState("error");
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [roomId]);

  // =========================
  // RENDER
  // =========================

  if (state === "loading") {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="flex h-full items-center justify-center text-center p-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Room error</h2>
          <p className="text-muted-foreground">
            {getErrorMessage(
              errorKind === "not_found"
                ? "ROOM_NOT_FOUND"
                : errorKind === "json_invalid"
                ? "JSON_INVALID"
                : errorKind === "network"
                ? "network_error"
                : "server_error"
            )}
          </p>
        </div>
      </div>
    );
  }

  // READY STATE (room exists & validated)
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <h1 className="text-xl font-semibold">Room loaded</h1>
        <p className="text-muted-foreground mt-2">
          Room ID: <code>{roomId}</code>
        </p>
      </div>
    </div>
  );
}
