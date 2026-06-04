// Retention surface guard — SpeechDrillPage onAttempt seam (recordActiveDay).
import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SpeechDrillPage from "@/pages/SpeechDrillPage";

const h = vi.hoisted(() => ({ record: vi.fn() }));
vi.mock("@/lib/retention/recordActiveDay", () => ({ recordActiveDay: h.record }));

vi.mock("@/hooks/useFeatureFlag", () => ({ useFeatureFlag: () => ({ enabled: true, loading: false }) }));
vi.mock("@/services/speechAttempts", () => ({ recordSpeechAttempt: vi.fn(async () => ({ ok: true, skipped: false, id: "a1" })) }));
vi.mock("@/services/roomProgress", () => ({
  trackRoomEntry: vi.fn(async () => ({ ok: true, action: "inserted" })),
  updateRoomProgress: vi.fn(async () => ({ ok: true, action: "updated" })),
}));
vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    auth: { getUser: vi.fn(async () => ({ data: { user: { id: "user-1" } } })) },
    from: vi.fn(() => ({ select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), maybeSingle: vi.fn(async () => ({ data: { progress_pct: 0 }, error: null })) })),
  },
}));
vi.mock("@/components/speech/SpeechDrill", () => ({
  SpeechDrill: ({ targetSentence, onAttempt }: { targetSentence: string; onAttempt?: (e: unknown) => void }) => (
    <section aria-label="Speech drill">
      <p data-testid="target-sentence">{targetSentence}</p>
      <button type="button" onClick={() => onAttempt?.({ target: targetSentence, recognized: targetSentence, score: { overallScore: 96, wordScores: [] }, elapsedMs: 1200 })}>score</button>
    </section>
  ),
}));

function renderPage(path: string) {
  return render(<MemoryRouter initialEntries={[path]}><Routes><Route path="/speak" element={<SpeechDrillPage />} /><Route path="/" element={<div>home</div>} /></Routes></MemoryRouter>);
}

describe("retention guard — SpeechDrillPage onAttempt", () => {
  beforeEach(() => { h.record.mockClear(); });

  it("POSITIVE: a scored pronunciation attempt fires recordActiveDay exactly once", async () => {
    renderPage("/speak?lessonSource=ielts-speaking&lessonId=ielts_speaking_part1_hometown");
    fireEvent.click(await screen.findByRole("button", { name: "score" }));
    await waitFor(() => expect(h.record).toHaveBeenCalledTimes(1));
  });

  it("NEGATIVE: mounting the drill without an attempt does NOT fire recordActiveDay", async () => {
    renderPage("/speak?lessonSource=ielts-speaking&lessonId=ielts_speaking_part1_hometown");
    await screen.findByTestId("target-sentence");
    expect(h.record).not.toHaveBeenCalled();
  });
});
