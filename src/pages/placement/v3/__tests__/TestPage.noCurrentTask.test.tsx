import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PlacementV3Session } from "@/lib/placement/v3/types";
import TestPage from "../TestPage";

vi.mock("@/lib/placement/v3/clientStub", () => ({
  resumeSession: vi.fn(),
  getResults: vi.fn(),
  abandonSession: vi.fn(),
}));

vi.mock("@/lib/telemetry/signalCell", () => ({
  openSignal: () => ({ succeeded: vi.fn(), failed: vi.fn(), cancel: vi.fn() }),
}));

import { resumeSession } from "@/lib/placement/v3/clientStub";

const resume = vi.mocked(resumeSession);

const SESSION_ID = "sess-1";

function sessionWithoutTask(status: PlacementV3Session["status"]): PlacementV3Session {
  return {
    sessionId: SESSION_ID,
    status,
    currentTask: null,
    answeredCount: 5,
    estimatedTotal: 5,
    modalityIndex: 0,
    modalities: ["writing", "speaking", "reading", "listening", "conversation"],
    startedAt: new Date(0).toISOString(),
    expiresAt: new Date(Date.now() + 86_400_000).toISOString(),
  };
}

function LocationProbe() {
  const location = useLocation();
  return <div data-testid="pathname">{location.pathname}</div>;
}

function renderAt() {
  return render(
    <MemoryRouter initialEntries={[`/placement/test/${SESSION_ID}`]}>
      <LocationProbe />
      <Routes>
        <Route path="/placement/test/:sessionId" element={<TestPage />} />
        <Route path="/placement/results/:sessionId" element={<div>RESULTS ROUTE</div>} />
        <Route path="/placement/who" element={<div>WHO ROUTE</div>} />
        <Route path="/placement/resume" element={<div>RESUME ROUTE</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  resume.mockReset();
});

/**
 * A session with no currentTask used to park on the "Preparing results" spinner
 * forever: the only navigate() to results lived in handleSubmit, whose button is
 * not rendered in that branch.
 */
describe("TestPage — a session with no current task always has an exit", () => {
  it("navigates to results when a resumed session is already completed", async () => {
    resume.mockResolvedValue(sessionWithoutTask("completed"));
    renderAt();

    await waitFor(() => {
      expect(screen.getByTestId("pathname").textContent).toBe(`/placement/results/${SESSION_ID}`);
    });
    expect(screen.getByText("RESULTS ROUTE")).toBeInTheDocument();
  });

  it("does not strand the user on the spinner when the session never completed", async () => {
    resume.mockResolvedValue(sessionWithoutTask("in_progress"));
    renderAt();

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
    expect(screen.queryByText(/Preparing results/i)).not.toBeInTheDocument();
    expect(screen.getByText(/could not load the next question/i)).toBeInTheDocument();
  });

  it("offers a way out of the dead end", async () => {
    resume.mockResolvedValue(sessionWithoutTask("in_progress"));
    renderAt();

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /start a new test/i })).toBeInTheDocument();
    });
  });
});
