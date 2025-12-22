// src/pages/ChatHub.tsx — MB-BLUE-15.2 — 2025-12-21
/**
 * ChatHub (Room Loader + Minimal Room Render)
 * Strategic rule:
 * - ChatHub must NOT re-implement resolver rules.
 * - Single canonical resolver lives in: src/lib/roomJsonResolver.ts
 */

import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { getErrorMessage } from "@/lib/constants/uiText";
import {
  canonicalizeRoomId,
  loadRoomJson,
  type RoomJsonResolverErrorKind,
} from "@/lib/roomJsonResolver";

type LoadState = "loading" | "ready" | "error";
type ErrorKind = RoomJsonResolverErrorKind;

type AnyRoom = any; // keep loose until schema is locked

export default function ChatHub() {
  const { roomId } = useParams<{ roomId: string }>();

  const canonicalId = useMemo(
    () => canonicalizeRoomId(roomId || ""),
    [roomId]
  );

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

  // Minimal render (lock this stable)
  const titleEn = room?.title?.en || room?.description?.en;
  const titleVi = room?.title?.vi || room?.description?.vi;

  const essayEn = room?.room_essay?.en;
  const essayVi = room?.room_essay?.vi;

  const entries: any[] = Array.isArray(room?.entries) ? room.entries : [];

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">
        {canonicalId || "Room"}
      </h1>

      {(titleEn || titleVi) && (
        <div className="mt-4 space-y-1">
          {titleEn && <p className="text-base">{titleEn}</p>}
          {titleVi && <p className="text-base text-muted-foreground">{titleVi}</p>}
        </div>
      )}

      {(essayEn || essayVi) && (
        <div className="mt-6 space-y-4">
          {essayEn && <p className="leading-7">{essayEn}</p>}
          {essayVi && (
            <p className="leading-7 text-muted-foreground">{essayVi}</p>
          )}
        </div>
      )}

      <div className="mt-8 border-t pt-6">
        <h2 className="text-lg font-semibold">Entries</h2>

        {entries.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">
            No entries found in this room JSON.
          </p>
        ) : (
          <div className="mt-4 space-y-4">
            {entries.map((e, i) => {
              const eTitleEn = e?.title?.en || e?.prompt?.en || e?.question?.en;
              const eTitleVi = e?.title?.vi || e?.prompt?.vi || e?.question?.vi;

              const eBodyEn = e?.content?.en || e?.answer?.en || e?.text?.en;
              const eBodyVi = e?.content?.vi || e?.answer?.vi || e?.text?.vi;

              return (
                <div key={String(e?.id || i)} className="rounded-lg border p-4">
                  <div className="text-sm text-muted-foreground">
                    #{i + 1} {e?.id ? <code className="ml-2">{e.id}</code> : null}
                  </div>

                  {(eTitleEn || eTitleVi) && (
                    <div className="mt-2">
                      {eTitleEn && (
                        <div className="font-medium">{eTitleEn}</div>
                      )}
                      {eTitleVi && (
                        <div className="text-muted-foreground">{eTitleVi}</div>
                      )}
                    </div>
                  )}

                  {(eBodyEn || eBodyVi) && (
                    <div className="mt-3 space-y-2">
                      {eBodyEn && <p className="leading-7">{eBodyEn}</p>}
                      {eBodyVi && (
                        <p className="leading-7 text-muted-foreground">{eBodyVi}</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <p className="mt-8 text-xs text-muted-foreground">
        roomId: <code>{roomId}</code> → <code>{canonicalId}</code>
      </p>
    </div>
  );
}
