import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import { usePlacementProgress } from "@/hooks/placement/v3/usePlacementProgress";
import type { PlacementV3Session } from "@/lib/placement/v3/types";

describe("usePlacementProgress", () => {
  it("returns safe defaults without a session", () => {
    const { result } = renderHook(() => usePlacementProgress(null));
    expect(result.current.percent).toBe(0);
    expect(result.current.currentModality).toBe("writing");
  });

  it("derives percent and active modality from the session", () => {
    const session: PlacementV3Session = {
      sessionId: "s1",
      status: "in_progress",
      answeredCount: 2,
      estimatedTotal: 5,
      modalityIndex: 2,
      modalities: ["writing", "speaking", "reading", "listening", "conversation"],
      currentTask: {
        id: "r1",
        modality: "reading",
        type: "reading_short",
        instruction: { en: "Read", vi: "Đọc" },
        prompt: { en: "Answer", vi: "Trả lời" },
      },
      startedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 1000).toISOString(),
    };
    const { result } = renderHook(() => usePlacementProgress(session));
    expect(result.current.percent).toBe(40);
    expect(result.current.currentModality).toBe("reading");
  });
});
