// src/components/__tests__/FeedbackNotificationBadge.hardening.test.tsx
//
// Hardening tests for <FeedbackNotificationBadge />.
//
// The component renders a Bell + unread-count Badge for admins only. It:
//   - returns null for non-admins (early, before any query/subscribe)
//   - on mount (admin) loads the count of feedback rows with status 'new'
//   - subscribes to realtime postgres_changes on the `feedback` table and
//     reloads the count on every event
//   - unsubscribes on unmount / when isAdmin flips false
//   - renders null while the count is 0, and the badge once count > 0
//
// External deps (supabase realtime + count query, useUserAccess) are fully
// mocked so the suite is deterministic and offline.

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";

// ---------------------------------------------------------------------------
// useUserAccess mock — admin flag is the only field this component reads.
// ---------------------------------------------------------------------------
const mockUseUserAccess = vi.fn();
vi.mock("@/hooks/useUserAccess", () => ({
  useUserAccess: () => mockUseUserAccess(),
}));

// ---------------------------------------------------------------------------
// supabase mock — controllable count + realtime channel.
// ---------------------------------------------------------------------------
//
// loadUnreadCount() chains: .from('feedback').select(..,{count,head}).eq('status','new')
// and awaits the final result. We make .eq() resolve to { count: <current> }.
//
// The realtime channel is .channel(name).on(...).subscribe() and the cleanup
// calls channel.unsubscribe(). We capture the registered postgres_changes
// callback so tests can fire a fake event.

let countValue: number | null = 0;
let countError = false;

const eqMock = vi.fn(() =>
  countError
    ? Promise.resolve({ count: null, error: new Error("boom") })
    : Promise.resolve({ count: countValue, error: null }),
);
const selectMock = vi.fn(() => ({ eq: eqMock }));
const fromMock = vi.fn(() => ({ select: selectMock }));

let realtimeCallback: ((payload: unknown) => void) | null = null;
const unsubscribeMock = vi.fn();
const subscribeMock = vi.fn(() => ({ unsubscribe: unsubscribeMock }));
const onMock = vi.fn((_event: string, _filter: unknown, cb: (p: unknown) => void) => {
  realtimeCallback = cb;
  return { subscribe: subscribeMock };
});
const channelMock = vi.fn(() => ({ on: onMock }));

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    // @ts-expect-error -- test mock bridge intentionally accepts flexible realtime callback args.
    from: (...args: unknown[]) => fromMock(...args),
    // @ts-expect-error -- test mock bridge intentionally accepts flexible realtime callback args.
    channel: (...args: unknown[]) => channelMock(...(args as [string])),
  },
}));

// Keep the Bell icon and Badge as lightweight stand-ins so we assert on the
// component's own logic rather than third-party render internals.
vi.mock("lucide-react", () => ({
  Bell: (props: Record<string, unknown>) => <svg data-testid="bell-icon" {...props} />,
}));
vi.mock("@/components/ui/badge", () => ({
  Badge: ({ children, ...rest }: { children?: React.ReactNode }) => (
    <span data-testid="count-badge" {...rest}>
      {children}
    </span>
  ),
}));

import { FeedbackNotificationBadge } from "@/components/FeedbackNotificationBadge";

beforeEach(() => {
  countValue = 0;
  countError = false;
  realtimeCallback = null;
  mockUseUserAccess.mockReturnValue({ isAdmin: false });
  fromMock.mockClear();
  selectMock.mockClear();
  eqMock.mockClear();
  channelMock.mockClear();
  onMock.mockClear();
  subscribeMock.mockClear();
  unsubscribeMock.mockClear();
});

afterEach(() => {
  cleanup();
});

describe("FeedbackNotificationBadge — export", () => {
  it("exports the component as a function", () => {
    expect(typeof FeedbackNotificationBadge).toBe("function");
  });
});

describe("FeedbackNotificationBadge — non-admin", () => {
  it("renders nothing for a non-admin user", () => {
    mockUseUserAccess.mockReturnValue({ isAdmin: false });
    const { container } = render(<FeedbackNotificationBadge />);
    expect(container.firstChild).toBeNull();
    expect(screen.queryByTestId("bell-icon")).toBeNull();
  });

  it("does not query feedback or open a realtime channel for non-admins", () => {
    mockUseUserAccess.mockReturnValue({ isAdmin: false });
    render(<FeedbackNotificationBadge />);
    expect(fromMock).not.toHaveBeenCalled();
    expect(channelMock).not.toHaveBeenCalled();
  });
});

describe("FeedbackNotificationBadge — admin with zero unread", () => {
  it("loads the count but renders nothing when count is 0", async () => {
    mockUseUserAccess.mockReturnValue({ isAdmin: true });
    countValue = 0;

    const { container } = render(<FeedbackNotificationBadge />);

    await waitFor(() => expect(fromMock).toHaveBeenCalledWith("feedback"));
    // count === 0 → component returns null
    expect(container.firstChild).toBeNull();
    expect(screen.queryByTestId("count-badge")).toBeNull();
  });

  it("queries with an exact head count filtered to status 'new'", async () => {
    mockUseUserAccess.mockReturnValue({ isAdmin: true });
    render(<FeedbackNotificationBadge />);

    await waitFor(() => expect(selectMock).toHaveBeenCalled());
    expect(selectMock).toHaveBeenCalledWith("*", { count: "exact", head: true });
    expect(eqMock).toHaveBeenCalledWith("status", "new");
  });
});

describe("FeedbackNotificationBadge — admin with unread feedback", () => {
  it("renders the bell and the unread count badge", async () => {
    mockUseUserAccess.mockReturnValue({ isAdmin: true });
    countValue = 7;

    render(<FeedbackNotificationBadge />);

    await waitFor(() => expect(screen.getByTestId("count-badge")).toBeTruthy());
    expect(screen.getByTestId("bell-icon")).toBeTruthy();
    expect(screen.getByTestId("count-badge").textContent).toBe("7");
  });

  it("subscribes to feedback realtime changes on the public schema", async () => {
    mockUseUserAccess.mockReturnValue({ isAdmin: true });
    countValue = 1;

    render(<FeedbackNotificationBadge />);

    await waitFor(() => expect(channelMock).toHaveBeenCalledWith("feedback_notifications"));
    expect(onMock).toHaveBeenCalledWith(
      "postgres_changes",
      { event: "*", schema: "public", table: "feedback" },
      expect.any(Function),
    );
    expect(subscribeMock).toHaveBeenCalledTimes(1);
  });

  it("reloads the count when a realtime event fires", async () => {
    mockUseUserAccess.mockReturnValue({ isAdmin: true });
    countValue = 2;

    render(<FeedbackNotificationBadge />);

    await waitFor(() => expect(screen.getByTestId("count-badge").textContent).toBe("2"));
    expect(realtimeCallback).toBeTypeOf("function");

    // Simulate a new feedback row landing.
    countValue = 5;
    realtimeCallback?.({});

    await waitFor(() => expect(screen.getByTestId("count-badge").textContent).toBe("5"));
  });

  it("hides the badge again when a realtime event drops the count to 0", async () => {
    mockUseUserAccess.mockReturnValue({ isAdmin: true });
    countValue = 3;

    const { container } = render(<FeedbackNotificationBadge />);
    await waitFor(() => expect(screen.getByTestId("count-badge").textContent).toBe("3"));

    countValue = 0;
    realtimeCallback?.({});

    await waitFor(() => expect(container.firstChild).toBeNull());
  });
});

describe("FeedbackNotificationBadge — cleanup", () => {
  it("unsubscribes from the channel on unmount", async () => {
    mockUseUserAccess.mockReturnValue({ isAdmin: true });
    countValue = 1;

    const { unmount } = render(<FeedbackNotificationBadge />);
    await waitFor(() => expect(subscribeMock).toHaveBeenCalled());

    unmount();
    expect(unsubscribeMock).toHaveBeenCalledTimes(1);
  });
});

describe("FeedbackNotificationBadge — error & edge handling", () => {
  it("treats a null count as 0 (renders nothing, no crash)", async () => {
    mockUseUserAccess.mockReturnValue({ isAdmin: true });
    countValue = null;

    const { container } = render(<FeedbackNotificationBadge />);

    await waitFor(() => expect(fromMock).toHaveBeenCalled());
    expect(container.firstChild).toBeNull();
  });

  it("does not throw when the count query resolves with an error/null count", async () => {
    mockUseUserAccess.mockReturnValue({ isAdmin: true });
    countError = true;

    const { container } = render(<FeedbackNotificationBadge />);

    await waitFor(() => expect(eqMock).toHaveBeenCalled());
    // error path → count is null → coerced to 0 → null render, no throw
    expect(container.firstChild).toBeNull();
  });

  it("renders a large unread count verbatim", async () => {
    mockUseUserAccess.mockReturnValue({ isAdmin: true });
    countValue = 9999;

    render(<FeedbackNotificationBadge />);

    await waitFor(() => expect(screen.getByTestId("count-badge").textContent).toBe("9999"));
  });
});
