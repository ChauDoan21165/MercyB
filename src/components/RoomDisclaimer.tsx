// FILE: src/components/room/RoomDisclaimer.tsx
// MercyBlade Blue — RoomDisclaimer (SAFE / STABLE)
// FIXES:
// - Prevent setState after unmount (cancel flag).
// - Avoid TS2305 by NOT importing a missing named export (getRoom).
// - Normalize multiple schema shapes (string or {en,vi}).
// - Trim + drop empty strings.
// - Graceful failure (no console noise; returns null).

import { useEffect, useMemo, useState } from "react";
import { AlertCircle } from "lucide-react";
import * as roomFetcher from "@/lib/roomFetcher";
import { HighlightedContent } from "./HighlightedContent";

interface RoomDisclaimerProps {
  roomId: string;
}

interface DisclaimerData {
  safetyEn?: string;
  safetyVi?: string;
  crisisEn?: string;
  crisisVi?: string;
}

const toText = (v: any): string => {
  const s = typeof v === "string" ? v : "";
  return s.trim();
};

const pickBilingual = (
  raw: any,
  candidates: Array<(r: any) => any>,
): { en: string; vi: string } => {
  for (const pick of candidates) {
    const v = pick(raw);

    // Object form: { en, vi }
    if (v && typeof v === "object" && !Array.isArray(v)) {
      const en = toText((v as any).en);
      const vi = toText((v as any).vi);
      if (en || vi) return { en, vi };
    }

    // String form: treat as EN (or generic)
    if (typeof v === "string") {
      const s = toText(v);
      if (s) return { en: s, vi: "" };
    }
  }
  return { en: "", vi: "" };
};

export const RoomDisclaimer = ({ roomId }: RoomDisclaimerProps) => {
  const [data, setData] = useState<DisclaimerData | null>(null);

  useEffect(() => {
    let cancelled = false;

    const id = String(roomId || "").trim();
    if (!id) {
      setData(null);
      return;
    }

    // Build-safe resolver: support whatever function exists in roomFetcher without requiring a named export.
    const getRoomFn =
      (roomFetcher as any).getRoom ||
      (roomFetcher as any).getRoomById ||
      (roomFetcher as any).fetchRoom ||
      (roomFetcher as any).roomMasterLoader ||
      null;

    if (typeof getRoomFn !== "function") {
      // If loader is missing, fail gracefully (do not render disclaimer).
      setData(null);
      return;
    }

    (async () => {
      try {
        const room = await getRoomFn(id);
        if (cancelled) return;

        if (!room) {
          setData(null);
          return;
        }

        const rawRoom = room as any;

        // SAFETY DISCLAIMER (accept multiple shapes)
        const safety = pickBilingual(rawRoom, [
          // legacy flat strings
          (r) => r?.safety_disclaimer,
          (r) => r?.safety_disclaimer_en,
          (r) => r?.safety_disclaimer_vi,
          // nested content (object or strings)
          (r) => r?.content?.safety,
          (r) => r?.content?.safety_disclaimer,
          (r) => r?.content?.safety_en,
          (r) => r?.content?.safety_vi,
        ]);

        // If there is an explicit VI string field, prefer it for vi.
        const safetyViDirect =
          toText(rawRoom?.safety_disclaimer_vi) || toText(rawRoom?.content?.safety_vi);
        const safetyEnDirect =
          toText(rawRoom?.safety_disclaimer_en) || toText(rawRoom?.content?.safety_en);

        const safetyEn = safetyEnDirect || safety.en;
        const safetyVi = safetyViDirect || safety.vi;

        // CRISIS FOOTER (object or strings)
        const crisis = pickBilingual(rawRoom, [
          (r) => r?.crisis_footer,
          (r) => r?.content?.crisis_footer,
          (r) => r?.crisis_footer_en,
          (r) => r?.crisis_footer_vi,
        ]);

        const crisisEnDirect =
          toText(rawRoom?.crisis_footer_en) || toText(rawRoom?.content?.crisis_footer_en);
        const crisisViDirect =
          toText(rawRoom?.crisis_footer_vi) || toText(rawRoom?.content?.crisis_footer_vi);

        const crisisEn = crisisEnDirect || crisis.en || toText(rawRoom?.crisis_footer?.en);
        const crisisVi = crisisViDirect || crisis.vi || toText(rawRoom?.crisis_footer?.vi);

        const next: DisclaimerData = {
          safetyEn: safetyEn || undefined,
          safetyVi: safetyVi || undefined,
          crisisEn: crisisEn || undefined,
          crisisVi: crisisVi || undefined,
        };

        if (!next.safetyEn && !next.safetyVi && !next.crisisEn && !next.crisisVi) {
          setData(null);
        } else {
          setData(next);
        }
      } catch {
        if (!cancelled) setData(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [roomId]);

  const hasAnything = useMemo(() => {
    if (!data) return false;
    return !!(data.safetyEn || data.safetyVi || data.crisisEn || data.crisisVi);
  }, [data]);

  if (!hasAnything || !data) return null;

  const { safetyEn, safetyVi, crisisEn, crisisVi } = data;

  return (
    <div className="p-3 bg-yellow-50/80 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800 shadow-sm">
      <div className="flex items-start gap-2">
        <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-500 mt-0.5 flex-shrink-0" />
        <div className="space-y-1.5 text-xs leading-relaxed text-yellow-900 dark:text-yellow-100">
          {safetyEn ? (
            <div className="font-medium">
              <HighlightedContent content={safetyEn} />
            </div>
          ) : null}

          {safetyVi ? (
            <div className="font-medium">
              <HighlightedContent content={safetyVi} />
            </div>
          ) : null}

          {crisisEn ? (
            <div className="font-semibold text-red-600 dark:text-red-400">
              <HighlightedContent content={crisisEn} />
            </div>
          ) : null}

          {crisisVi ? (
            <div className="font-semibold text-red-600 dark:text-red-400">
              <HighlightedContent content={crisisVi} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};