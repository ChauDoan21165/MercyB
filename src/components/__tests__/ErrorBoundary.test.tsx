import type { ReactElement } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { ErrorBoundary } from "../ErrorBoundary";
import { ChunkLoadRecoveryError } from "@/lib/chunkLoadError";

const Bomb = (): ReactElement => {
  throw new Error("kaboom");
};

describe("<ErrorBoundary />", () => {
  // Suppress the noisy React "uncaught render error" console output that
  // is emitted whenever a child throws — it's not a real failure, it's
  // just React being chatty about the error we're deliberately raising.
  let errSpy: ReturnType<typeof vi.spyOn>;
  let groupSpy: ReturnType<typeof vi.spyOn>;
  let groupEndSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    groupSpy = vi.spyOn(console, "group").mockImplementation(() => {});
    groupEndSpy = vi.spyOn(console, "groupEnd").mockImplementation(() => {});
  });
  afterEach(() => {
    errSpy.mockRestore();
    groupSpy.mockRestore();
    groupEndSpy.mockRestore();
  });

  // Regression: ErrorBoundary mounts ABOVE BrowserRouter in main.tsx, so
  // the fallback UI must not depend on react-router-dom context. Using
  // <Link> here previously crashed the fallback with
  //   "Cannot destructure property 'basename' from null or undefined value"
  // and the secondary crash bubbled to window.onerror, masking the
  // primary error inside the boundary. Keeping the fallback Router-free
  // means a real exception is captured by componentDidCatch instead.
  it("renders the fallback UI when there is no Router ancestor", () => {
    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Đã xảy ra lỗi")).toBeInTheDocument();
    expect(screen.getByText("Thử lại")).toBeInTheDocument();

    const goHome = screen.getByText("Về trang chủ");
    expect(goHome).toBeInstanceOf(HTMLAnchorElement);
    expect((goHome as HTMLAnchorElement).getAttribute("href")).toBe("/");
  });

  it("suppresses auth-lock AbortError crash screen", () => {
    // Simulate a component that throws once (like a lock-steal abort
    // surfacing through a state update), then renders normally.
    // The ErrorBoundary should suppress the crash screen and force
    // a clean remount via the authLockRecovery key.
    const thrownRef = { current: false };
    const LockBomb = (): ReactElement => {
      if (!thrownRef.current) {
        thrownRef.current = true;
        const err = new DOMException(
          "Lock broken by another request with the 'steal' option",
          "AbortError",
        );
        throw err;
      }
      return <div data-testid="survived">recovered</div>;
    };

    render(
      <ErrorBoundary>
        <LockBomb />
      </ErrorBoundary>,
    );

    // After the first throw + recovery, children render normally
    expect(screen.getByTestId("survived")).toBeInTheDocument();
    expect(screen.queryByText("Đã xảy ra lỗi")).not.toBeInTheDocument();
  });

  it("still shows crash screen on non-auth-lock errors", () => {
    const OtherBomb = (): ReactElement => {
      throw new Error("real error — should crash");
    };

    render(
      <ErrorBoundary>
        <OtherBomb />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Đã xảy ra lỗi")).toBeInTheDocument();
    // Real bug → dark screen, NOT the calm "updating" screen.
    expect(screen.queryByText("Đang cập nhật Mercy Blade")).not.toBeInTheDocument();
  });

  describe("stale-deploy chunk-load failure", () => {
    const EB_KEY = "__mb_chunk_eb_reload_once__";
    let replaceSpy: ReturnType<typeof vi.fn>;

    const ChunkBomb = (): ReactElement => {
      throw new TypeError(
        "Failed to fetch dynamically imported module: https://mercyblade.com/assets/ChatHub-C7kMnSdL.js",
      );
    };

    beforeEach(() => {
      sessionStorage.clear();
      replaceSpy = vi.fn();
      Object.defineProperty(window, "location", {
        configurable: true,
        writable: true,
        value: {
          href: "http://localhost/room/english_foundation_ef11",
          replace: replaceSpy,
          reload: vi.fn(),
        },
      });
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
      sessionStorage.clear();
    });

    it("shows the calm VI updating screen (not the dark dump) and escalates one cache-bust reload", async () => {
      render(
        <ErrorBoundary>
          <ChunkBomb />
        </ErrorBoundary>,
      );

      // Calm, Vietnamese-first screen — no raw stack dump for a learner.
      expect(screen.getByText("Đang cập nhật Mercy Blade")).toBeInTheDocument();
      expect(screen.queryByText("Đã xảy ra lỗi")).not.toBeInTheDocument();
      expect(replaceSpy).not.toHaveBeenCalled(); // deferred, not synchronous

      // Tier-2 escalation: SW-unregister then cache-bust nav after 600ms.
      await vi.runAllTimersAsync();
      expect(replaceSpy).toHaveBeenCalledTimes(1);
      expect(replaceSpy.mock.calls[0][0]).toMatch(/[?&]_cb=\d+/);
      expect(sessionStorage.getItem(EB_KEY)).toBe("1");
    });

    it("does NOT auto-loop once the Tier-2 escalation is already spent", async () => {
      sessionStorage.setItem(EB_KEY, "1"); // escalation already used this session

      render(
        <ErrorBoundary>
          <ChunkBomb />
        </ErrorBoundary>,
      );

      // Genuinely stuck → friendly manual-retry screen, no auto navigation.
      expect(screen.getByText("Chưa cập nhật được")).toBeInTheDocument();
      await vi.runAllTimersAsync();
      expect(replaceSpy).not.toHaveBeenCalled();
    });

    it("renders the reload UI for typed exhausted lazy chunk errors", async () => {
      const TypedChunkBomb = (): ReactElement => {
        throw new ChunkLoadRecoveryError(
          "Mercy Blade could not load a route chunk after retrying the current deploy.",
          new TypeError("Failed to fetch dynamically imported module: https://mercyblade.com/assets/Home-BadHash.js"),
        );
      };

      render(
        <ErrorBoundary>
          <TypedChunkBomb />
        </ErrorBoundary>,
      );

      expect(screen.getByText("Đang cập nhật Mercy Blade")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Tải lại" })).toBeInTheDocument();
      expect(screen.queryByText("Đã xảy ra lỗi")).not.toBeInTheDocument();
      await vi.runAllTimersAsync();
      expect(replaceSpy).toHaveBeenCalledTimes(1);
    });
  });
});
