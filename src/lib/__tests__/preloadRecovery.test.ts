// src/lib/__tests__/preloadRecovery.test.ts
//
// Unit tests for the stale-deploy recovery listener. We dispatch
// synthetic `error` events on fake <link rel="modulepreload"> and
// <script type="module"> elements and assert the onChunkLoad404
// callback fires exactly when it should.
//
// Why we dispatch directly on the element rather than letting jsdom
// fire a real network error: jsdom doesn't actually fetch resources,
// so a real preload 404 never reaches the capture-phase listener.
// Synthetic dispatch is the only reliable way to exercise the
// listener in unit tests.

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { attachPreloadFailureRecovery } from "../preloadRecovery";

describe("attachPreloadFailureRecovery", () => {
  let detach: () => void;
  let onChunkLoad404: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onChunkLoad404 = vi.fn();
    detach = attachPreloadFailureRecovery(onChunkLoad404);
  });

  afterEach(() => {
    detach();
  });

  function fireResourceError(target: HTMLElement) {
    // Resource errors are dispatched on the element directly and do
    // not bubble. We dispatch with `bubbles: false` to mirror the
    // browser's real behaviour; the listener uses capture phase.
    const event = new Event("error", { bubbles: false, cancelable: false });
    Object.defineProperty(event, "target", { value: target, enumerable: true });
    document.body.appendChild(target);
    target.dispatchEvent(event);
    document.body.removeChild(target);
  }

  it("fires onChunkLoad404 when a <link rel='modulepreload'> errors", () => {
    const link = document.createElement("link");
    link.rel = "modulepreload";
    link.href = "/assets/old-hash.js";
    fireResourceError(link);
    expect(onChunkLoad404).toHaveBeenCalledTimes(1);
  });

  it("fires onChunkLoad404 when a <script type='module'> errors", () => {
    const script = document.createElement("script");
    script.type = "module";
    script.src = "/assets/old-hash.js";
    fireResourceError(script);
    expect(onChunkLoad404).toHaveBeenCalledTimes(1);
  });

  it("fires onChunkLoad404 and prevents default for Vite preload errors", () => {
    const event = new Event("vite:preloadError", { cancelable: true });

    window.dispatchEvent(event);

    expect(onChunkLoad404).toHaveBeenCalledTimes(1);
    expect(event.defaultPrevented).toBe(true);
  });

  it("ignores <link rel='stylesheet'> errors (only modulepreload matters)", () => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/assets/old-hash.css";
    fireResourceError(link);
    expect(onChunkLoad404).not.toHaveBeenCalled();
  });

  it("ignores classic <script> (non-module) errors", () => {
    const script = document.createElement("script");
    script.src = "/some-third-party.js";
    // Default `type` is empty string (classic script), not "module".
    fireResourceError(script);
    expect(onChunkLoad404).not.toHaveBeenCalled();
  });

  it("ignores <img> error events", () => {
    const img = document.createElement("img");
    img.src = "/missing.png";
    fireResourceError(img);
    expect(onChunkLoad404).not.toHaveBeenCalled();
  });

  it("stops firing after detach", () => {
    detach();
    const link = document.createElement("link");
    link.rel = "modulepreload";
    fireResourceError(link);
    window.dispatchEvent(new Event("vite:preloadError", { cancelable: true }));
    expect(onChunkLoad404).not.toHaveBeenCalled();
  });
});
