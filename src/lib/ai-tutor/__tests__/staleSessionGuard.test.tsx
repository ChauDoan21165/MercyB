import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AiTutorStaleSessionNotice } from "../AiTutorStaleSessionNotice";
import {
  AI_TUTOR_STALE_SESSION_MESSAGE,
  checkAiTutorStaleSession,
  useAiTutorStaleSessionGuard,
} from "../staleSessionGuard";

function jsonResponse(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json" },
    ...init,
  });
}

function Harness({
  fetchVersion,
  reload,
}: {
  fetchVersion: typeof fetch;
  reload: () => void;
}) {
  const guard = useAiTutorStaleSessionGuard({
    runningHash: "abc1234",
    fetchVersion,
    nowMs: () => 99,
    reload,
  });

  return (
    <div>
      {guard.notice ? <AiTutorStaleSessionNotice onReload={guard.reloadLatest} /> : null}
      <button type="button" onClick={() => void guard.guardBeforeSubmit()}>
        Sửa câu này
      </button>
      <span data-testid="checking">{String(guard.checking)}</span>
    </div>
  );
}

describe("checkAiTutorStaleSession", () => {
  it("allows correction when the baked hash matches /version.json", async () => {
    const fetchVersion = vi.fn().mockResolvedValue(jsonResponse({ hash: "abc1234" }));

    await expect(
      checkAiTutorStaleSession({
        runningHash: "abc1234",
        fetchVersion,
        nowMs: () => 123,
      }),
    ).resolves.toEqual({
      status: "current",
      shouldBlock: false,
      runningHash: "abc1234",
      latestHash: "abc1234",
    });

    expect(fetchVersion).toHaveBeenCalledWith(
      "/version.json?t=123",
      expect.objectContaining({ cache: "no-store" }),
    );
  });

  it("blocks correction when the fresh manifest hash differs", async () => {
    const fetchVersion = vi.fn().mockResolvedValue(jsonResponse({ hash: "def5678" }));

    await expect(
      checkAiTutorStaleSession({ runningHash: "abc1234", fetchVersion }),
    ).resolves.toEqual({
      status: "stale",
      shouldBlock: true,
      runningHash: "abc1234",
      latestHash: "def5678",
    });
  });

  it("fails soft when /version.json cannot be fetched", async () => {
    const fetchVersion = vi.fn().mockRejectedValue(new Error("offline"));

    await expect(
      checkAiTutorStaleSession({ runningHash: "abc1234", fetchVersion }),
    ).resolves.toEqual({
      status: "unavailable",
      shouldBlock: false,
      runningHash: "abc1234",
      reason: "fetch",
    });
  });

  it("fails soft when the running bundle has no baked hash", async () => {
    const fetchVersion = vi.fn();

    await expect(
      checkAiTutorStaleSession({ runningHash: "", fetchVersion }),
    ).resolves.toEqual({
      status: "unversioned",
      shouldBlock: false,
      runningHash: "",
    });
    expect(fetchVersion).not.toHaveBeenCalled();
  });
});

describe("useAiTutorStaleSessionGuard", () => {
  it("shows the Vietnamese reload notice instead of proceeding on drift", async () => {
    const reload = vi.fn();
    const fetchVersion = vi.fn().mockResolvedValue(jsonResponse({ hash: "new9999" }));

    render(<Harness fetchVersion={fetchVersion} reload={reload} />);
    fireEvent.click(screen.getByRole("button", { name: "Sửa câu này" }));

    expect(await screen.findByText(AI_TUTOR_STALE_SESSION_MESSAGE)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Tải lại trang" }));
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it("keeps the notice hidden when hashes match", async () => {
    const fetchVersion = vi.fn().mockResolvedValue(jsonResponse({ hash: "abc1234" }));

    render(<Harness fetchVersion={fetchVersion} reload={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "Sửa câu này" }));

    await waitFor(() => expect(fetchVersion).toHaveBeenCalledTimes(1));
    expect(screen.queryByText(AI_TUTOR_STALE_SESSION_MESSAGE)).not.toBeInTheDocument();
  });
});
