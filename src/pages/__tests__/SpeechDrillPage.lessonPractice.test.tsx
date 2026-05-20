import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import SpeechDrillPage from "../SpeechDrillPage";

const recordSpeechAttempt = vi.fn(async () => ({ ok: true, skipped: false, id: "attempt-1" }));
const trackRoomEntry = vi.fn(async () => ({ ok: true, action: "inserted" }));
const updateRoomProgress = vi.fn(async () => ({ ok: true, action: "updated" }));

vi.mock("@/hooks/useFeatureFlag", () => ({
  useFeatureFlag: () => ({ enabled: true, loading: false }),
}));

vi.mock("@/services/speechAttempts", () => ({
  recordSpeechAttempt: (...args: unknown[]) => recordSpeechAttempt(...args),
}));

vi.mock("@/services/roomProgress", () => ({
  trackRoomEntry: (...args: unknown[]) => trackRoomEntry(...args),
  updateRoomProgress: (...args: unknown[]) => updateRoomProgress(...args),
}));

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    auth: {
      getUser: vi.fn(async () => ({ data: { user: { id: "user-1" } } })),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn(async () => ({ data: { progress_pct: 0 }, error: null })),
    })),
  },
}));

vi.mock("@/components/speech/SpeechDrill", () => ({
  SpeechDrill: ({
    targetSentence,
    targetSentenceVi,
    onAttempt,
  }: {
    targetSentence: string;
    targetSentenceVi?: string;
    onAttempt?: (event: {
      target: string;
      recognized: string;
      score: { overallScore: number; wordScores: unknown[] };
      elapsedMs: number;
    }) => void;
  }) => (
    <section aria-label="Speech drill">
      <p data-testid="target-sentence">{targetSentence}</p>
      {targetSentenceVi ? <p>{targetSentenceVi}</p> : null}
      <button
        type="button"
        onClick={() =>
          onAttempt?.({
            target: targetSentence,
            recognized: targetSentence,
            score: { overallScore: 96, wordScores: [] },
            elapsedMs: 1200,
          })
        }
      >
        score
      </button>
    </section>
  ),
}));

function renderPage(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/speak" element={<SpeechDrillPage />} />
        <Route path="/" element={<div>home</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("SpeechDrillPage lesson practice", () => {
  beforeEach(() => {
    recordSpeechAttempt.mockClear();
    trackRoomEntry.mockClear();
    updateRoomProgress.mockClear();
  });

  it("loads IELTS lesson sentences from the Speak route params", async () => {
    renderPage("/speak?lessonSource=ielts-speaking&lessonId=ielts_speaking_part1_hometown");

    expect(await screen.findByTestId("lesson-practice-context")).toHaveTextContent(
      "Hometown",
    );
    expect(screen.getByTestId("target-sentence")).toHaveTextContent("Đà Nẵng");
    expect(screen.getByText(/0% complete/i)).toBeInTheDocument();
    await waitFor(() => expect(trackRoomEntry).toHaveBeenCalled());
  });

  it("records speech and persists lesson percent complete after a scored attempt", async () => {
    renderPage("/speak?lessonSource=ielts-speaking&lessonId=ielts_speaking_part1_hometown");

    fireEvent.click(await screen.findByRole("button", { name: "score" }));

    await waitFor(() => {
      expect(recordSpeechAttempt).toHaveBeenCalledWith(
        expect.objectContaining({
          context: expect.objectContaining({
            room_id: "practice:ielts-speaking:ielts_speaking_part1_hometown",
            line_id: expect.stringContaining("ielts_speaking_part1_hometown:band7:1"),
          }),
        }),
      );
    });
    await waitFor(() => {
      expect(updateRoomProgress).toHaveBeenCalledWith(
        "user-1",
        "practice:ielts-speaking:ielts_speaking_part1_hometown",
        expect.objectContaining({ progressPct: expect.any(Number) }),
      );
    });
    expect(screen.getByText(/% complete/i)).toBeInTheDocument();
  });
});
