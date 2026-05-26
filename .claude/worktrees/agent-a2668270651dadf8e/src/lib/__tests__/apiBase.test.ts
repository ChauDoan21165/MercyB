import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockIsNativePlatform = vi.fn();

vi.mock("@/lib/platform", () => ({
  isNativePlatform: () => mockIsNativePlatform(),
}));

import { getNativeApiOrigin, resolveApiUrl } from "../apiBase";

describe("resolveApiUrl", () => {
  beforeEach(() => {
    mockIsNativePlatform.mockReset();
  });

  afterEach(() => {
    // Reset env override between tests so one test cannot poison another.
    vi.unstubAllEnvs();
  });

  it("returns absolute URLs unchanged regardless of platform", () => {
    mockIsNativePlatform.mockReturnValue(true);
    expect(resolveApiUrl("https://example.com/api/x")).toBe(
      "https://example.com/api/x",
    );
    mockIsNativePlatform.mockReturnValue(false);
    expect(resolveApiUrl("http://example.com/api/x")).toBe(
      "http://example.com/api/x",
    );
  });

  it("returns relative paths unchanged on web", () => {
    mockIsNativePlatform.mockReturnValue(false);
    expect(resolveApiUrl("/api/mercy/grammar")).toBe("/api/mercy/grammar");
    expect(resolveApiUrl("/api/foo")).toBe("/api/foo");
  });

  it("prefixes the production origin on native platforms", () => {
    mockIsNativePlatform.mockReturnValue(true);
    expect(resolveApiUrl("/api/mercy/grammar")).toBe(
      "https://mercyblade.com/api/mercy/grammar",
    );
  });

  it("repairs paths missing a leading slash", () => {
    mockIsNativePlatform.mockReturnValue(true);
    expect(resolveApiUrl("api/foo")).toBe("https://mercyblade.com/api/foo");
    mockIsNativePlatform.mockReturnValue(false);
    expect(resolveApiUrl("api/foo")).toBe("/api/foo");
  });

  it("uses VITE_API_BASE_URL override on native when set", () => {
    vi.stubEnv("VITE_API_BASE_URL", "https://staging.mercyblade.com/");
    mockIsNativePlatform.mockReturnValue(true);
    expect(resolveApiUrl("/api/x")).toBe("https://staging.mercyblade.com/api/x");
    expect(getNativeApiOrigin()).toBe("https://staging.mercyblade.com");
  });

  it("strips a trailing slash from the override origin", () => {
    vi.stubEnv("VITE_API_BASE_URL", "https://api.example.com/");
    expect(getNativeApiOrigin()).toBe("https://api.example.com");
  });

  it("falls back to prod when override is empty string", () => {
    vi.stubEnv("VITE_API_BASE_URL", "");
    expect(getNativeApiOrigin()).toBe("https://mercyblade.com");
  });

  it("returns input unchanged for empty / non-string inputs", () => {
    mockIsNativePlatform.mockReturnValue(true);
    expect(resolveApiUrl("")).toBe("");
    // @ts-expect-error - intentionally exercising defensive guard
    expect(resolveApiUrl(undefined)).toBeUndefined();
  });
});
