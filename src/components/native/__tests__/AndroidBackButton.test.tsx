// @vitest-environment jsdom

import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import React from "react";

// ── Mocks ────────────────────────────────────────────────────────────

const addListener = vi.fn();
const exitApp = vi.fn();
let backHandler: (() => void) | undefined;

vi.mock("@capacitor/app", () => ({
  App: {
    addListener: (name: string, fn: () => void) => {
      addListener(name);
      if (name === "backButton") backHandler = fn;
      return Promise.resolve({ remove: vi.fn(() => Promise.resolve()) });
    },
    exitApp: () => {
      exitApp();
      return Promise.resolve();
    },
  },
}));

const getPlatform = vi.fn();
vi.mock("@/lib/platform", () => ({ getPlatform: () => getPlatform() }));

const toast = vi.fn();
vi.mock("@/components/ui/use-toast", () => ({ toast: (a: unknown) => toast(a) }));

const navigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return { ...actual, useNavigate: () => navigate };
});

import AndroidBackButton from "../AndroidBackButton";

function mountAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AndroidBackButton />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  addListener.mockClear();
  exitApp.mockClear();
  toast.mockClear();
  navigate.mockClear();
  backHandler = undefined;
  getPlatform.mockReturnValue("android");
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  document.body.innerHTML = "";
});

describe("AndroidBackButton", () => {
  it("does NOT register the listener off Android", async () => {
    getPlatform.mockReturnValue("web");
    mountAt("/room/x");
    await Promise.resolve();
    expect(addListener).not.toHaveBeenCalled();
  });

  it("registers a backButton listener on Android", async () => {
    mountAt("/");
    await Promise.resolve();
    expect(addListener).toHaveBeenCalledWith("backButton");
  });

  it("closes an open overlay (Escape) instead of navigating/exiting", async () => {
    mountAt("/room/x");
    await Promise.resolve();
    const dialog = document.createElement("div");
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("data-state", "open");
    document.body.appendChild(dialog);
    const onKey = vi.fn();
    document.addEventListener("keydown", onKey);

    backHandler!();

    expect(onKey).toHaveBeenCalled();
    expect((onKey.mock.calls[0][0] as KeyboardEvent).key).toBe("Escape");
    expect(navigate).not.toHaveBeenCalled();
    expect(exitApp).not.toHaveBeenCalled();
  });

  it("navigates back when not at the home route", async () => {
    mountAt("/room/x");
    await Promise.resolve();
    backHandler!();
    expect(navigate).toHaveBeenCalledWith(-1);
    expect(exitApp).not.toHaveBeenCalled();
  });

  it("requires a second press within the window to exit at root", async () => {
    mountAt("/");
    await Promise.resolve();

    backHandler!(); // first press
    expect(toast).toHaveBeenCalledTimes(1);
    expect(exitApp).not.toHaveBeenCalled();

    vi.advanceTimersByTime(500); // within 2s window
    backHandler!(); // second press
    expect(exitApp).toHaveBeenCalledTimes(1);
  });

  it("does NOT exit if the second press is after the window", async () => {
    mountAt("/");
    await Promise.resolve();

    backHandler!();
    vi.advanceTimersByTime(2500); // window elapsed
    backHandler!();

    expect(exitApp).not.toHaveBeenCalled();
    expect(toast).toHaveBeenCalledTimes(2);
  });
});
