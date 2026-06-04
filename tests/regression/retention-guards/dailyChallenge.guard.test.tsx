// Retention surface guard — DailyChallengePage handleComplete seam (recordActiveDay).
import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

const h = vi.hoisted(() => ({ record: vi.fn() }));
vi.mock("@/lib/retention/recordActiveDay", () => ({ recordActiveDay: h.record }));

const CHALLENGE = { id: "ch1", content_en: "Hello world", content_vi_explanation: "Xin chào", difficulty: "easy", target_phonemes: ["h"], type: "phrase" };
vi.mock("@/providers/AuthProvider", () => ({ useAuth: () => ({ user: { id: "u1" }, isLoading: false }) }));
vi.mock("@/lib/supabaseClient", () => ({ supabase: {} }));
vi.mock("@/lib/challenges/dailyChallenge", () => ({
  fetchTodaysChallenge: vi.fn(async () => CHALLENGE),
  fetchTodaysCompletion: vi.fn(async () => null),
  recordChallengeCompletion: vi.fn(async () => ({ ok: true })),
  pickTodaysChallenge: vi.fn(() => CHALLENGE),
}));
vi.mock("@/components/speech/SpeechDrill", () => ({
  SpeechDrill: ({ onAttempt }: { onAttempt?: (e: unknown) => void }) => (
    <button type="button" onClick={() => onAttempt?.({ target: "Hello world", recognized: "Hello world", score: { overallScore: 92, wordScores: [] }, elapsedMs: 1000 })}>attempt</button>
  ),
}));

function renderPage() {
  return render(<MemoryRouter><DailyChallengePage /></MemoryRouter>);
}
import DailyChallengePage from "@/pages/challenges/DailyChallengePage";

describe("retention guard — DailyChallengePage handleComplete", () => {
  beforeEach(() => { h.record.mockClear(); });

  it("POSITIVE: completing the daily challenge fires recordActiveDay exactly once", async () => {
    renderPage();
    fireEvent.click(await screen.findByRole("button", { name: "attempt" }));
    fireEvent.click(await screen.findByTestId("challenge-complete-button"));
    await waitFor(() => expect(h.record).toHaveBeenCalledTimes(1));
  });

  it("NEGATIVE: a pronunciation attempt WITHOUT completing does NOT fire recordActiveDay", async () => {
    renderPage();
    fireEvent.click(await screen.findByRole("button", { name: "attempt" }));
    await screen.findByTestId("challenge-complete-button");
    expect(h.record).not.toHaveBeenCalled();
  });
});
