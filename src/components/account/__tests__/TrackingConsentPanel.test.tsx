// Verifies the privacy panel is a real, working caller of
// setMarketingConsent — the gap the 2026-05-18 privacy audit (§8)
// flagged: the function existed but had zero UI callers.
//
// Uses the real behaviorTrackingFlag (localStorage-backed) so the
// test proves actual persistence, not a mock contract.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";

import { TrackingConsentPanel } from "../TrackingConsentPanel";
import {
  __resetMarketingConsentForTests,
  isMarketingTrackingEnabled,
} from "@/services/behaviorTrackingFlag";

// Control the chrome language without standing up the native-language
// provider — the panel only reads useChromeLanguage().
const langMock = vi.fn<[], "vi" | "en">(() => "vi");
vi.mock("@/lib/i18n/chromeLanguage", () => ({
  useChromeLanguage: () => langMock(),
}));

const OPT_OUT_KEY = "mb_marketing_opt_out";

beforeEach(() => {
  __resetMarketingConsentForTests();
  langMock.mockReturnValue("vi");
});

afterEach(() => {
  cleanup();
  __resetMarketingConsentForTests();
});

describe("TrackingConsentPanel", () => {
  it("defaults ON (no opt-out flag) and renders the VI label", () => {
    render(<TrackingConsentPanel />);
    const sw = screen.getByRole("switch");
    expect(sw.getAttribute("aria-checked")).toBe("true");
    expect(
      screen.getByText("Cho phép theo dõi quảng cáo và phân tích"),
    ).toBeTruthy();
  });

  it("renders the EN label when chrome language is en", () => {
    langMock.mockReturnValue("en");
    render(<TrackingConsentPanel />);
    expect(
      screen.getByText("Allow advertising and analytics tracking"),
    ).toBeTruthy();
  });

  it("toggling OFF calls setMarketingConsent(false) — persists opt-out + shows reload hint", () => {
    render(<TrackingConsentPanel />);
    const sw = screen.getByRole("switch");

    fireEvent.click(sw);

    // Real persistence, not a spy: the localStorage flag the loader reads.
    expect(window.localStorage.getItem(OPT_OUT_KEY)).toBe("1");
    expect(isMarketingTrackingEnabled()).toBe(false);
    expect(sw.getAttribute("aria-checked")).toBe("false");
    expect(
      screen.getByText(
        "Tải lại trang để áp dụng đầy đủ thay đổi này cho phiên hiện tại.",
      ),
    ).toBeTruthy();
  });

  it("toggling back ON clears the opt-out and hides the reload hint", () => {
    render(<TrackingConsentPanel />);
    const sw = screen.getByRole("switch");

    fireEvent.click(sw); // OFF
    fireEvent.click(sw); // ON

    expect(window.localStorage.getItem(OPT_OUT_KEY)).toBeNull();
    expect(isMarketingTrackingEnabled()).toBe(true);
    expect(sw.getAttribute("aria-checked")).toBe("true");
    expect(
      screen.queryByText(
        "Tải lại trang để áp dụng đầy đủ thay đổi này cho phiên hiện tại.",
      ),
    ).toBeNull();
  });

  it("initializes from a pre-existing opt-out flag (OFF on mount)", () => {
    window.localStorage.setItem(OPT_OUT_KEY, "1");
    render(<TrackingConsentPanel />);
    expect(screen.getByRole("switch").getAttribute("aria-checked")).toBe(
      "false",
    );
  });
});
