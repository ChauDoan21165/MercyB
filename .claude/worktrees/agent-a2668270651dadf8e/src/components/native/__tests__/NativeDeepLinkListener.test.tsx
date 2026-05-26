// @vitest-environment jsdom

import { describe, expect, it, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import React from "react";

const unsubscribe = vi.fn(() => Promise.resolve());
const registerDeepLinkListener = vi.fn();

vi.mock("@/lib/nativeOAuth", () => ({
  registerDeepLinkListener: (cb: (s: unknown) => void) =>
    registerDeepLinkListener(cb),
}));

import NativeDeepLinkListener from "../NativeDeepLinkListener";

beforeEach(() => {
  registerDeepLinkListener.mockReset();
  unsubscribe.mockClear();
  registerDeepLinkListener.mockResolvedValue(unsubscribe);
});

describe("NativeDeepLinkListener", () => {
  it("registers exactly one app-level deep-link listener on mount", async () => {
    render(<NativeDeepLinkListener />);
    await Promise.resolve();
    await Promise.resolve();
    expect(registerDeepLinkListener).toHaveBeenCalledTimes(1);
  });

  it("unsubscribes the listener on unmount", async () => {
    const { unmount } = render(<NativeDeepLinkListener />);
    await Promise.resolve();
    await Promise.resolve();
    unmount();
    await Promise.resolve();
    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });

  it("does not throw if registration rejects (web / plugin unavailable)", async () => {
    registerDeepLinkListener.mockRejectedValue(new Error("no native"));
    expect(() => render(<NativeDeepLinkListener />)).not.toThrow();
    await Promise.resolve();
  });

  it("renders nothing", () => {
    const { container } = render(<NativeDeepLinkListener />);
    expect(container.firstChild).toBeNull();
  });
});
