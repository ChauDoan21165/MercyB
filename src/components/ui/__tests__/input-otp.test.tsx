import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, act } from "@testing-library/react";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp";

// input-otp schedules a caret-blink timer via setTimeout.
// Use fake timers to prevent "window is not defined" when the timer fires
// after the jsdom environment has been torn down.
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

describe("InputOTP", () => {
  it("renders the OTP input container", () => {
    const { container } = render(
      <InputOTP maxLength={6}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
      </InputOTP>
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders the correct number of slots", () => {
    const { container } = render(
      <InputOTP maxLength={4}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
      </InputOTP>
    );
    // Each slot is a div with border-y border-r class
    const slots = container.querySelectorAll("[class*='border-y']");
    expect(slots.length).toBe(4);
  });

  it("renders with a separator", () => {
    const { container } = render(
      <InputOTP maxLength={6}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator data-testid="sep" />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    );
    const sep = container.querySelector("[role='separator']");
    expect(sep).toBeInTheDocument();
  });

  it("InputOTPSeparator has role=separator", () => {
    const { container } = render(
      <InputOTP maxLength={2}>
        <InputOTPGroup><InputOTPSlot index={0} /></InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup><InputOTPSlot index={1} /></InputOTPGroup>
      </InputOTP>
    );
    const sep = container.querySelector("[role='separator']");
    expect(sep).not.toBeNull();
    expect(sep).toHaveAttribute("role", "separator");
  });

  it("InputOTPGroup renders a flex container", () => {
    const { container } = render(
      <InputOTP maxLength={2}>
        <InputOTPGroup data-testid="grp">
          <InputOTPSlot index={0} />
        </InputOTPGroup>
      </InputOTP>
    );
    const grp = container.querySelector("[data-testid='grp']");
    expect(grp).toBeInTheDocument();
    expect(grp!.className).toContain("flex");
  });

  it("forwards disabled class on InputOTP container when disabled", () => {
    const { container } = render(
      <InputOTP maxLength={4} disabled>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
        </InputOTPGroup>
      </InputOTP>
    );
    // The container has has-[:disabled]:opacity-50
    const wrapper = container.querySelector("[class*='has-']");
    expect(wrapper).toBeInTheDocument();
    expect(wrapper!.className).toContain("opacity-50");
  });
});
