// src/components/__tests__/NotificationBootstrap.hardening.test.tsx
//
// Hardening tests for <NotificationBootstrap /> — the app-root wiring that
// boots the notification engine on mount and tears it down on unmount, but
// only when FEATURE_FLAGS.FEATURE_NOTIFICATIONS is on. The component itself
// renders nothing (returns null) and never awaits the engine promises (it
// fires them with `void`), so it must stay inert and resilient regardless of
// what the engine does.
//
// External dependencies (the feature flags and the notification engine) are
// fully mocked so these tests are deterministic and never touch real timers,
// Capacitor, or Supabase.

import type { ReactElement } from "react";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { cleanup, render } from "@testing-library/react";

// --- Mocks --------------------------------------------------------------

// A mutable flag object so individual tests can flip FEATURE_NOTIFICATIONS
// without re-importing the module. The component reads the property inside
// its effect at runtime, so toggling it between renders is sufficient.
const featureFlagsState = {
  FEATURE_NOTIFICATIONS: false,
};

vi.mock("@/lib/featureFlags", () => ({
  get FEATURE_FLAGS() {
    return featureFlagsState;
  },
}));

const bootNotificationEngine = vi.fn<() => Promise<void>>(() =>
  Promise.resolve(),
);
const shutdownNotificationEngine = vi.fn<() => Promise<void>>(() =>
  Promise.resolve(),
);

vi.mock("@/notificationEngine", () => ({
  bootNotificationEngine: () => bootNotificationEngine(),
  shutdownNotificationEngine: () => shutdownNotificationEngine(),
}));

// Import AFTER the mocks are registered so the component picks them up.
import NotificationBootstrap from "../NotificationBootstrap";

// A rejected promise whose rejection is pre-handled, so a deliberately
// failing engine boot does not surface as an unhandled rejection in the
// test runner while still exercising the component's fire-and-forget path.
function preHandledRejection(message: string): Promise<void> {
  const p = Promise.reject(new Error(message));
  p.catch(() => {
    /* swallow — the component intentionally ignores the result */
  });
  return p;
}

// --- Lifecycle ----------------------------------------------------------

describe("<NotificationBootstrap /> — hardening", () => {
  beforeEach(() => {
    featureFlagsState.FEATURE_NOTIFICATIONS = false;
    bootNotificationEngine.mockReset();
    shutdownNotificationEngine.mockReset();
    bootNotificationEngine.mockImplementation(() => Promise.resolve());
    shutdownNotificationEngine.mockImplementation(() => Promise.resolve());
  });

  afterEach(() => {
    cleanup();
  });

  // --- Render contract --------------------------------------------------

  it("is a function component (default export)", () => {
    expect(typeof NotificationBootstrap).toBe("function");
  });

  it("renders nothing into the DOM regardless of the flag", () => {
    featureFlagsState.FEATURE_NOTIFICATIONS = true;
    const { container } = render(<NotificationBootstrap />);
    expect(container.childNodes).toHaveLength(0);
    expect(container.innerHTML).toBe("");
  });

  it("returns null even with the flag off", () => {
    featureFlagsState.FEATURE_NOTIFICATIONS = false;
    const { container } = render(<NotificationBootstrap />);
    expect(container.firstChild).toBeNull();
  });

  // --- Flag OFF (default / web) ----------------------------------------

  it("does not boot the engine when the flag is off", () => {
    featureFlagsState.FEATURE_NOTIFICATIONS = false;
    render(<NotificationBootstrap />);
    expect(bootNotificationEngine).not.toHaveBeenCalled();
  });

  it("does not shut down the engine on unmount when the flag is off", () => {
    featureFlagsState.FEATURE_NOTIFICATIONS = false;
    const { unmount } = render(<NotificationBootstrap />);
    unmount();
    expect(shutdownNotificationEngine).not.toHaveBeenCalled();
    expect(bootNotificationEngine).not.toHaveBeenCalled();
  });

  // --- Flag ON ----------------------------------------------------------

  it("boots the engine exactly once on mount when the flag is on", () => {
    featureFlagsState.FEATURE_NOTIFICATIONS = true;
    render(<NotificationBootstrap />);
    expect(bootNotificationEngine).toHaveBeenCalledTimes(1);
    // Boot takes no arguments.
    expect(bootNotificationEngine).toHaveBeenCalledWith();
    // Shutdown must not fire until unmount.
    expect(shutdownNotificationEngine).not.toHaveBeenCalled();
  });

  it("shuts the engine down exactly once on unmount when the flag is on", () => {
    featureFlagsState.FEATURE_NOTIFICATIONS = true;
    const { unmount } = render(<NotificationBootstrap />);
    expect(bootNotificationEngine).toHaveBeenCalledTimes(1);
    unmount();
    expect(shutdownNotificationEngine).toHaveBeenCalledTimes(1);
    expect(shutdownNotificationEngine).toHaveBeenCalledWith();
  });

  it("boots only once across re-renders (effect has an empty dependency array)", () => {
    featureFlagsState.FEATURE_NOTIFICATIONS = true;
    const { rerender } = render(<NotificationBootstrap />);
    rerender(<NotificationBootstrap />);
    rerender(<NotificationBootstrap />);
    expect(bootNotificationEngine).toHaveBeenCalledTimes(1);
    expect(shutdownNotificationEngine).not.toHaveBeenCalled();
  });

  it("pairs each mount with exactly one shutdown across repeated cycles", () => {
    featureFlagsState.FEATURE_NOTIFICATIONS = true;

    const first = render(<NotificationBootstrap />);
    first.unmount();
    const second = render(<NotificationBootstrap />);
    second.unmount();
    const third = render(<NotificationBootstrap />);
    third.unmount();

    expect(bootNotificationEngine).toHaveBeenCalledTimes(3);
    expect(shutdownNotificationEngine).toHaveBeenCalledTimes(3);
  });

  it("ignores a stale flag captured at mount time — toggling after mount does not re-boot", () => {
    // The effect runs once on mount; flipping the flag afterwards has no
    // effect because the dependency array is empty.
    featureFlagsState.FEATURE_NOTIFICATIONS = true;
    const { rerender } = render(<NotificationBootstrap />);
    expect(bootNotificationEngine).toHaveBeenCalledTimes(1);

    featureFlagsState.FEATURE_NOTIFICATIONS = false;
    rerender(<NotificationBootstrap />);
    expect(bootNotificationEngine).toHaveBeenCalledTimes(1);
  });

  // --- Independent instances -------------------------------------------

  it("boots once per mounted instance when several are rendered", () => {
    featureFlagsState.FEATURE_NOTIFICATIONS = true;
    render(
      <>
        <NotificationBootstrap />
        <NotificationBootstrap />
      </>,
    );
    expect(bootNotificationEngine).toHaveBeenCalledTimes(2);
  });

  // --- Error handling / resilience -------------------------------------

  it("does not throw when bootNotificationEngine returns a rejected promise", () => {
    featureFlagsState.FEATURE_NOTIFICATIONS = true;
    bootNotificationEngine.mockImplementationOnce(() =>
      preHandledRejection("boot blew up"),
    );

    let result: ReturnType<typeof render> | undefined;
    expect(() => {
      result = render(<NotificationBootstrap />);
    }).not.toThrow();

    expect(bootNotificationEngine).toHaveBeenCalledTimes(1);
    expect(result?.container.firstChild).toBeNull();
  });

  it("does not throw on unmount when shutdownNotificationEngine returns a rejected promise", () => {
    featureFlagsState.FEATURE_NOTIFICATIONS = true;
    shutdownNotificationEngine.mockImplementationOnce(() =>
      preHandledRejection("shutdown blew up"),
    );

    const { unmount } = render(<NotificationBootstrap />);
    expect(() => unmount()).not.toThrow();
    expect(shutdownNotificationEngine).toHaveBeenCalledTimes(1);
  });

  it("still renders and tears down cleanly even if the engine boot is slow (never awaited)", () => {
    // The component fires boot with `void` and never awaits it, so a boot
    // that never resolves must not block mount or unmount.
    featureFlagsState.FEATURE_NOTIFICATIONS = true;
    bootNotificationEngine.mockImplementationOnce(
      () => new Promise<void>(() => {}),
    );

    const { container, unmount } = render(<NotificationBootstrap />);
    expect(container.firstChild).toBeNull();
    expect(() => unmount()).not.toThrow();
    expect(shutdownNotificationEngine).toHaveBeenCalledTimes(1);
  });

  // --- Sanity: the component itself does not render children ------------

  it("ignores any children passed to it (it is a side-effect-only component)", () => {
    featureFlagsState.FEATURE_NOTIFICATIONS = true;
    const Child = (): ReactElement => <div data-testid="child">hello</div>;
    const { queryByTestId } = render(
      // @ts-expect-error — the component takes no props/children; verify it
      // drops them rather than rendering them.
      <NotificationBootstrap>
        <Child />
      </NotificationBootstrap>,
    );
    expect(queryByTestId("child")).toBeNull();
  });
});
