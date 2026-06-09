// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ConsentModal } from "@/components/ConsentModal";
import { hasCaptureConsent, hasCaptureConsentDecision } from "@/lib/tutor/captureConsent";

beforeEach(() => {
  window.localStorage.clear();
});

describe("ConsentModal", () => {
  it("renders Vietnamese-primary copy with the English secondary line", () => {
    render(<ConsentModal open onDecision={() => {}} />);
    expect(screen.getByText("Cải thiện bài học của bạn")).toBeTruthy();
    expect(screen.getByText("Improve your lessons")).toBeTruthy();
    expect(
      screen.getByText(/MercyBlade lưu bài tập hội thoại của bạn/),
    ).toBeTruthy();
    expect(screen.getByText(/Đồng ý/)).toBeTruthy();
    expect(screen.getByText(/Không, cảm ơn/)).toBeTruthy();
  });

  it("does not grant consent before any choice (no pre-selection)", () => {
    render(<ConsentModal open onDecision={() => {}} />);
    expect(hasCaptureConsent()).toBe(false);
    expect(hasCaptureConsentDecision()).toBe(false);
  });

  it("agreeing persists consent and reports the choice", () => {
    const onDecision = vi.fn();
    render(<ConsentModal open onDecision={onDecision} />);
    fireEvent.click(screen.getByText(/Đồng ý/));
    expect(hasCaptureConsent()).toBe(true);
    expect(onDecision).toHaveBeenCalledWith(true);
  });

  it("declining records a remembered 'no' and reports the choice", () => {
    const onDecision = vi.fn();
    render(<ConsentModal open onDecision={onDecision} />);
    fireEvent.click(screen.getByText(/Không, cảm ơn/));
    expect(hasCaptureConsent()).toBe(false);
    expect(hasCaptureConsentDecision()).toBe(true);
    expect(onDecision).toHaveBeenCalledWith(false);
  });
});
