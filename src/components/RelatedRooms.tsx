import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { getRoomInfo } from "@/lib/roomData";

interface RelatedRoomsProps {
  roomNames: string[];
}

type RoomInfoLike = {
  nameEn?: string;
  nameVi?: string;
} | null;

export const RelatedRooms = ({ roomNames }: RelatedRoomsProps) => {
  const navigate = useNavigate();

  const safeRoomNames = useMemo(() => roomNames?.filter(Boolean) ?? [], [roomNames]);
  if (safeRoomNames.length === 0) return null;

  // Extract room IDs from the format "Name (Vietnamese Name)"
  const getRoomIdFromName = (fullName: string) => {
    const englishName = fullName.split("(")[0]?.trim() ?? "";

    // Slugify -> kebab-case, safe for routes
    // - lowercases
    // - "&" -> "and"
    // - removes non-alphanumeric (keeps spaces/dashes)
    // - collapses whitespace/dashes
    return englishName
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/[\s_-]+/g, "-")
      .replace(/-+/g, "-");
  };

  const getEnglishLabel = (fullName: string) => fullName.split("(")[0]?.trim() ?? fullName;

  // Build stable list of roomIds to fetch
  const roomIds = useMemo(() => {
    const ids = safeRoomNames.map(getRoomIdFromName).filter(Boolean);
    // de-dupe while keeping order
    return Array.from(new Set(ids));
  }, [safeRoomNames]);

  // Cache loaded room info (getRoomInfo is async in current codebase)
  const [infoById, setInfoById] = useState<Record<string, RoomInfoLike>>({});

  useEffect(() => {
    let cancelled = false;

    // only fetch missing ids
    const missing = roomIds.filter((id) => infoById[id] === undefined);
    if (missing.length === 0) return;

    (async () => {
      const next: Record<string, RoomInfoLike> = {};

      await Promise.all(
        missing.map(async (id) => {
          try {
            const info = (await getRoomInfo(id)) as any;
            next[id] = info ? { nameEn: info.nameEn, nameVi: info.nameVi } : null;
          } catch {
            next[id] = null;
          }
        }),
      );

      if (!cancelled) {
        setInfoById((prev) => ({ ...prev, ...next }));
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomIds.join("|")]); // stable dependency without re-fetch loops

  return (
    <div className="mt-4 p-4 bg-secondary/20 rounded-lg border border-secondary/30 animate-fade-in">
      <div className="flex items-start gap-2 mb-3">
        <span className="text-2xl">💡</span>
        <div>
          <p className="font-medium text-sm mb-1">Others also explored:</p>
          <p className="text-xs text-muted-foreground mb-1">Những người khác cũng đã khám phá:</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {safeRoomNames.map((roomName, index) => {
          const roomId = getRoomIdFromName(roomName);
          const info = roomId ? infoById[roomId] : null;

          return (
            <Button
              key={`${roomId || "room"}-${index}`}
              variant="outline"
              size="sm"
              className="hover-scale"
              onClick={() => {
                if (!roomId) return;
                navigate(`/chat/${roomId}`);
              }}
              disabled={!roomId}
              aria-disabled={!roomId}
              title={!roomId ? "Invalid room link" : undefined}
            >
              {info?.nameEn || getEnglishLabel(roomName)}
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          );
        })}
      </div>
    </div>
  );
};