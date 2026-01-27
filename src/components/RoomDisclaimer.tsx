import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { HighlightedContent } from "./HighlightedContent";

import { supabase } from "@/lib/supabaseClient";
import { ROOMS_TABLE } from "@/lib/constants/rooms";
import { getRoom as getRoomLocal } from "@/lib/roomFetcher";

interface RoomDisclaimerProps {
  roomId: string;
}

interface DisclaimerData {
  safetyEn?: string;
  safetyVi?: string;
  crisisEn?: string;
  crisisVi?: string;
}

async function fetchRoomBestEffort(roomId: string): Promise<any | null> {
  const id = String(roomId || "").trim();
  if (!id) return null;

  // 1) DB first (preferred, RLS-safe if policy allows reading rooms meta)
  try {
    const { data, error } = await supabase.from(ROOMS_TABLE).select("*").eq("id", id).maybeSingle();
    if (!error && data) return data;
  } catch {
    // ignore
  }

  // 2) Local manifest JSON (fast, no RLS)
  try {
    const local = await getRoomLocal(id);
    if (local) return local;
  } catch {
    // ignore
  }

  // 3) JSON resolver fallback (legacy)
  try {
    const mod = await import("@/lib/roomJsonResolver");
    const loadRoomJson = (mod as any)?.loadRoomJson as ((rid: string) => Promise<any>) | undefined;
    if (!loadRoomJson) return null;
    const jsonData = await loadRoomJson(id);
    return jsonData ?? null;
  } catch {
    return null;
  }
}

export const RoomDisclaimer = ({ roomId }: RoomDisclaimerProps) => {
  const [data, setData] = useState<DisclaimerData | null>(null);

  useEffect(() => {
    const id = String(roomId || "").trim();
    if (!id) return;

    let cancelled = false;

    (async () => {
      try {
        const room: any | null = await fetchRoomBestEffort(id);
        if (cancelled) return;

        if (!room) {
          setData(null);
          return;
        }

        // Extract disclaimer data from room (support both DB + JSON shapes)
        const rawRoom = room as any;

        const safetyEn =
          rawRoom.safety_disclaimer ??
          rawRoom.safety_disclaimer_en ??
          rawRoom.content?.safety_en ??
          rawRoom.content?.safetyEn ??
          rawRoom.safety?.en ??
          "";

        const safetyVi =
          rawRoom.safety_disclaimer_vi ??
          rawRoom.safety_disclaimer_vn ??
          rawRoom.safety_disclaimer_vi_vn ??
          rawRoom.safety_disclaimer_vi_en ?? // harmless if absent
          rawRoom.content?.safety_vi ??
          rawRoom.content?.safetyVi ??
          rawRoom.safety?.vi ??
          "";

        const crisisEn =
          rawRoom.crisis_footer?.en ??
          rawRoom.crisis_en ??
          rawRoom.crisis?.en ??
          rawRoom.content?.crisis_en ??
          "";

        const crisisVi =
          rawRoom.crisis_footer?.vi ??
          rawRoom.crisis_vi ??
          rawRoom.crisis?.vi ??
          rawRoom.content?.crisis_vi ??
          "";

        const next: DisclaimerData = {
          safetyEn: String(safetyEn || "").trim() || undefined,
          safetyVi: String(safetyVi || "").trim() || undefined,
          crisisEn: String(crisisEn || "").trim() || undefined,
          crisisVi: String(crisisVi || "").trim() || undefined,
        };

        setData(next);
      } catch {
        if (!cancelled) setData(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [roomId]);

  if (!data) return null;

  const { safetyEn, safetyVi, crisisEn, crisisVi } = data;
  if (!safetyEn && !safetyVi && !crisisEn && !crisisVi) return null;

  return (
    <div className="p-3 bg-yellow-50/80 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800 shadow-sm">
      <div className="flex items-start gap-2">
        <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-500 mt-0.5 flex-shrink-0" />
        <div className="space-y-1.5 text-xs leading-relaxed text-yellow-900 dark:text-yellow-100">
          {safetyEn && (
            <div className="font-medium">
              <HighlightedContent content={safetyEn} />
            </div>
          )}
          {safetyVi && (
            <div className="font-medium">
              <HighlightedContent content={safetyVi} />
            </div>
          )}
          {crisisEn && (
            <div className="font-semibold text-red-600 dark:text-red-400">
              <HighlightedContent content={crisisEn} />
            </div>
          )}
          {crisisVi && (
            <div className="font-semibold text-red-600 dark:text-red-400">
              <HighlightedContent content={crisisVi} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
