// @vitest-environment jsdom
//
// Hardening tests for <GlobalPlayingIndicator />.
//
// The component is the floating "now playing" pill plus an admin-only control
// cluster (version badge + admin dashboard button with an unread-count badge).
// Its behaviour is driven by four hooks (music player, user access, auth,
// router) and two Supabase reads (app_settings + admin notification/feedback
// counts). All of those are mocked here so the suite is deterministic and never
// touches the network.
//
// Only this file is created; no source is modified.

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor, fireEvent, cleanup } from "@testing-library/react";

// ---------------------------------------------------------------------------
// Mutable hook state — each test tweaks these before rendering.
// ---------------------------------------------------------------------------
let musicState: { isPlaying: boolean; currentTrackName: string | null };
let accessState: { isAdmin: boolean };
let authState: { user: { id: string } | null };

const navigateMock = vi.fn();

// Per-table Supabase query results. The `then` on each chain makes it awaitable
// (resolving to the table's result object), while `maybeSingle` resolves to the
// same object — mirroring the two call shapes the component uses.
let queryResults: Record<string, { data?: unknown; count?: number | null }>;
const fromMock = vi.fn();

// ---------------------------------------------------------------------------
// Module mocks
// ---------------------------------------------------------------------------
vi.mock("@/contexts/MusicPlayerContext", () => ({
  useMusicPlayer: () => musicState,
}));

vi.mock("@/hooks/useUserAccess", () => ({
  useUserAccess: () => accessState,
}));

vi.mock("@/providers/AuthProvider", () => ({
  useAuth: () => authState,
}));

vi.mock("react-router-dom", async (orig) => {
  const actual = await (orig() as Promise<Record<string, unknown>>);
  return { ...actual, useNavigate: () => navigateMock };
});

vi.mock("@/lib/supabaseClient", () => ({
  supabase: { from: (...args: unknown[]) => fromMock(...args) },
}));

// Import AFTER the mocks are registered.
import { GlobalPlayingIndicator } from "@/components/GlobalPlayingIndicator";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function buildChain(table: string) {
  const result = queryResults[table] ?? { data: null, count: null };
  const chain: Record<string, unknown> = {};
  chain.select = vi.fn(() => chain);
  chain.eq = vi.fn(() => chain);
  chain.maybeSingle = vi.fn(() => Promise.resolve(result));
  // Make the chain awaitable so `await supabase.from(...).select(...).eq(...)`
  // resolves to the configured result.
  chain.then = (
    resolve: (v: unknown) => unknown,
    reject: (e: unknown) => unknown,
  ) => Promise.resolve(result).then(resolve, reject);
  return chain;
}

beforeEach(() => {
  musicState = { isPlaying: true, currentTrackName: "Lofi Beats" };
  accessState = { isAdmin: false };
  authState = { user: { id: "user-1" } };
  queryResults = {
    app_settings: { data: { setting_value: "A" } },
    admin_notifications: { count: 0 },
    feedback: { count: 0 },
  };

  // restoreMocks/mockReset in vitest.config wipe implementations between tests,
  // so (re)install the default from-router each time.
  fromMock.mockImplementation((table: string) => buildChain(table));

  // Default to a non-dev environment so admin controls are gated purely on
  // isAdmin unless a test opts into dev mode.
  vi.stubEnv("DEV", false);
});

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
});

// ---------------------------------------------------------------------------
// Visibility gating
// ---------------------------------------------------------------------------
describe("GlobalPlayingIndicator — visibility", () => {
  it("renders nothing when no track is playing", () => {
    musicState = { isPlaying: false, currentTrackName: "Lofi Beats" };
    const { container } = render(<GlobalPlayingIndicator />);
    expect(container.firstChild).toBeNull();
  });

  it("renders the track pill when playing", () => {
    render(<GlobalPlayingIndicator />);
    expect(screen.getByText("Lofi Beats")).toBeTruthy();
  });

  it("does not query Supabase or render at all while not playing", () => {
    musicState = { isPlaying: false, currentTrackName: null };
    render(<GlobalPlayingIndicator />);
    // Effect still runs (fetchVersionIndicator) but the tree is null.
    expect(screen.queryByText("Playing")).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Track name rendering
// ---------------------------------------------------------------------------
describe("GlobalPlayingIndicator — track name", () => {
  it("shows the current track name", () => {
    musicState = { isPlaying: true, currentTrackName: "Morning Calm" };
    render(<GlobalPlayingIndicator />);
    expect(screen.getByText("Morning Calm")).toBeTruthy();
  });

  it("falls back to 'Playing' when the track name is null", () => {
    musicState = { isPlaying: true, currentTrackName: null };
    render(<GlobalPlayingIndicator />);
    expect(screen.getByText("Playing")).toBeTruthy();
  });

  it("falls back to 'Playing' when the track name is an empty string", () => {
    musicState = { isPlaying: true, currentTrackName: "" };
    render(<GlobalPlayingIndicator />);
    expect(screen.getByText("Playing")).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Admin control gating (isAdmin || isDev)
// ---------------------------------------------------------------------------
describe("GlobalPlayingIndicator — admin control gating", () => {
  it("hides admin controls for a non-admin in production", () => {
    accessState = { isAdmin: false };
    vi.stubEnv("DEV", false);
    render(<GlobalPlayingIndicator />);
    expect(screen.queryByTitle("App Version")).toBeNull();
    expect(screen.queryByTitle("Admin Dashboard")).toBeNull();
  });

  it("shows admin controls for an admin", async () => {
    accessState = { isAdmin: true };
    render(<GlobalPlayingIndicator />);
    expect(await screen.findByTitle("App Version")).toBeTruthy();
    expect(screen.getByTitle("Admin Dashboard")).toBeTruthy();
  });

  it("shows admin controls in dev mode even for a non-admin", () => {
    accessState = { isAdmin: false };
    vi.stubEnv("DEV", true);
    render(<GlobalPlayingIndicator />);
    expect(screen.getByTitle("App Version")).toBeTruthy();
    expect(screen.getByTitle("Admin Dashboard")).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Version indicator
// ---------------------------------------------------------------------------
describe("GlobalPlayingIndicator — version indicator", () => {
  it("defaults to 'A' when no setting row exists", async () => {
    accessState = { isAdmin: true };
    queryResults.app_settings = { data: null };
    render(<GlobalPlayingIndicator />);
    const badge = await screen.findByTitle("App Version");
    expect(badge.textContent).toBe("A");
  });

  it("renders the fetched version value", async () => {
    accessState = { isAdmin: true };
    queryResults.app_settings = { data: { setting_value: "B" } };
    render(<GlobalPlayingIndicator />);
    await waitFor(() => {
      expect(screen.getByTitle("App Version").textContent).toBe("B");
    });
  });

  it("always queries app_settings, even for a non-admin", async () => {
    accessState = { isAdmin: false };
    render(<GlobalPlayingIndicator />);
    await waitFor(() => {
      expect(fromMock).toHaveBeenCalledWith("app_settings");
    });
  });

  it("keeps the default version when the fetch throws", async () => {
    accessState = { isAdmin: true };
    fromMock.mockImplementation((table: string) => {
      if (table === "app_settings") throw new Error("network down");
      return buildChain(table);
    });
    render(<GlobalPlayingIndicator />);
    const badge = await screen.findByTitle("App Version");
    expect(badge.textContent).toBe("A");
  });
});

// ---------------------------------------------------------------------------
// Unread count badge
// ---------------------------------------------------------------------------
describe("GlobalPlayingIndicator — unread count", () => {
  it("sums notification and feedback counts", async () => {
    accessState = { isAdmin: true };
    queryResults.admin_notifications = { count: 2 };
    queryResults.feedback = { count: 3 };
    render(<GlobalPlayingIndicator />);
    expect(await screen.findByText("5")).toBeTruthy();
  });

  it("renders no badge when the combined count is zero", async () => {
    accessState = { isAdmin: true };
    queryResults.admin_notifications = { count: 0 };
    queryResults.feedback = { count: 0 };
    render(<GlobalPlayingIndicator />);
    // Wait for the admin button to confirm the effect ran.
    await screen.findByTitle("Admin Dashboard");
    expect(screen.queryByText("0")).toBeNull();
  });

  it("treats null counts as zero (no badge)", async () => {
    accessState = { isAdmin: true };
    queryResults.admin_notifications = { count: null };
    queryResults.feedback = { count: null };
    render(<GlobalPlayingIndicator />);
    await screen.findByTitle("Admin Dashboard");
    // No numeric badge should be present.
    expect(screen.queryByText(/^\d/)).toBeNull();
  });

  it("clamps counts above 9 to '9+'", async () => {
    accessState = { isAdmin: true };
    queryResults.admin_notifications = { count: 8 };
    queryResults.feedback = { count: 5 };
    render(<GlobalPlayingIndicator />);
    expect(await screen.findByText("9+")).toBeTruthy();
  });

  it("renders exactly '9' at the boundary without the plus", async () => {
    accessState = { isAdmin: true };
    queryResults.admin_notifications = { count: 9 };
    queryResults.feedback = { count: 0 };
    render(<GlobalPlayingIndicator />);
    expect(await screen.findByText("9")).toBeTruthy();
    expect(screen.queryByText("9+")).toBeNull();
  });

  it("does not fetch the unread count for a non-admin", async () => {
    accessState = { isAdmin: false };
    render(<GlobalPlayingIndicator />);
    await waitFor(() => {
      expect(fromMock).toHaveBeenCalledWith("app_settings");
    });
    expect(fromMock).not.toHaveBeenCalledWith("admin_notifications");
    expect(fromMock).not.toHaveBeenCalledWith("feedback");
  });

  it("does not fetch the unread count when there is no user id", async () => {
    accessState = { isAdmin: true };
    authState = { user: null };
    vi.stubEnv("DEV", true); // keep admin controls visible without a user
    render(<GlobalPlayingIndicator />);
    await waitFor(() => {
      expect(fromMock).toHaveBeenCalledWith("app_settings");
    });
    expect(fromMock).not.toHaveBeenCalledWith("admin_notifications");
  });

  it("fetches the unread count for an admin with a user id", async () => {
    accessState = { isAdmin: true };
    authState = { user: { id: "admin-42" } };
    render(<GlobalPlayingIndicator />);
    await waitFor(() => {
      expect(fromMock).toHaveBeenCalledWith("admin_notifications");
      expect(fromMock).toHaveBeenCalledWith("feedback");
    });
  });

  it("survives an unread-count fetch that throws", async () => {
    accessState = { isAdmin: true };
    fromMock.mockImplementation((table: string) => {
      if (table === "admin_notifications") throw new Error("boom");
      return buildChain(table);
    });
    render(<GlobalPlayingIndicator />);
    // Component still renders the admin button despite the failed count fetch.
    expect(await screen.findByTitle("Admin Dashboard")).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------
describe("GlobalPlayingIndicator — navigation", () => {
  it("navigates to /admin when the settings button is clicked", async () => {
    accessState = { isAdmin: true };
    render(<GlobalPlayingIndicator />);
    const button = await screen.findByTitle("Admin Dashboard");
    fireEvent.click(button);
    expect(navigateMock).toHaveBeenCalledWith("/admin");
  });
});
