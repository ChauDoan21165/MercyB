import { useMemo } from "react";
import type { PlacementV3Session } from "@/lib/placement/v3/types";

export function usePlacementProgress(session: PlacementV3Session | null) {
  return useMemo(() => {
    if (!session) {
      return {
        answeredCount: 0,
        estimatedTotal: 1,
        percent: 0,
        currentModality: "writing" as const,
        modalities: ["writing" as const],
      };
    }
    return {
      answeredCount: session.answeredCount,
      estimatedTotal: session.estimatedTotal,
      percent: Math.round((session.answeredCount / Math.max(1, session.estimatedTotal)) * 100),
      currentModality: session.currentTask?.modality ?? session.modalities[session.modalityIndex] ?? "writing",
      modalities: session.modalities,
    };
  }, [session]);
}

export default usePlacementProgress;
