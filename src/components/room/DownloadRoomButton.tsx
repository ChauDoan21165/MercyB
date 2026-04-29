// src/components/room/DownloadRoomButton.tsx
//
// Offline Lite v1 — small button that downloads the current room
// (JSON + audio) for offline use. Self-contained: takes the same
// `room` object ChatHub already loaded, calls into
// src/lib/offline/downloadRoomPack.ts, and reports state in its
// own label. Does not touch RoomRenderer or the room-load flow.

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  downloadRoomPack,
  isRoomPackAvailable,
} from "@/lib/offline/downloadRoomPack";

type Status = "idle" | "downloading" | "available" | "failed";

interface Props {
  roomId: string;
  room: Record<string, unknown> | null;
  title?: string;
}

const LABELS: Record<Status, string> = {
  idle: "Download for offline",
  downloading: "Downloading…",
  available: "Available offline",
  failed: "Download failed",
};

export function DownloadRoomButton({ roomId, room, title }: Props) {
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    if (!roomId) return;
    let cancelled = false;
    void (async () => {
      const has = await isRoomPackAvailable(roomId);
      if (!cancelled && has) setStatus("available");
    })();
    return () => {
      cancelled = true;
    };
  }, [roomId]);

  async function handleClick(): Promise<void> {
    if (!room) return;
    setStatus("downloading");
    const result = await downloadRoomPack({ roomId, room, title });
    setStatus(result.ok ? "available" : "failed");
  }

  const disabled = status === "downloading" || !room;

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => void handleClick()}
      disabled={disabled}
      aria-live="polite"
      data-testid="download-room-button"
      className="text-xs"
    >
      {LABELS[status]}
    </Button>
  );
}
