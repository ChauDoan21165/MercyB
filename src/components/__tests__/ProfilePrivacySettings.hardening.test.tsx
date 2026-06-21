// @vitest-environment jsdom
//
// Hardening tests for ProfilePrivacySettings.
//
// The component:
//   - loads `profile_visibility` from the `user_knowledge_profile` table on mount,
//   - renders a radio group of three visibility options,
//   - upserts the selected visibility on save,
//   - surfaces success/error via toast,
//   - and handles the unauthenticated case gracefully.
//
// All external dependencies (Supabase client, auth provider, toast hook) are
// mocked so the suite is fully deterministic and never touches the network.

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";

// ---------------------------------------------------------------------------
// Mock state — reconfigured per test via the helpers below.
// ---------------------------------------------------------------------------

// Result returned by the load query (`.maybeSingle()`).
let loadResult: { data: unknown; error: unknown } = { data: null, error: null };
// Result returned by the save mutation (`.upsert()`).
let saveResult: { error: unknown } = { error: null };

// Spies we assert against.
const maybeSingleSpy = vi.fn(async () => loadResult);
const upsertSpy = vi.fn(async () => saveResult);
const selectSpy = vi.fn();
const eqSpy = vi.fn();
const fromSpy = vi.fn();

// Chainable query builder mirroring the Supabase fluent API surface the
// component actually uses: .from().select().eq().maybeSingle() and
// .from().upsert().
function makeBuilder() {
  const builder: Record<string, unknown> = {};
  builder.select = selectSpy.mockReturnValue(builder);
  builder.eq = eqSpy.mockReturnValue(builder);
  builder.maybeSingle = maybeSingleSpy;
  builder.upsert = upsertSpy;
  return builder;
}

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    from: (...args: unknown[]) => {
      fromSpy(...args);
      return makeBuilder();
    },
  },
}));

// Auth provider — userId is read off the returned user object.
let mockUser: { id: string } | null = { id: "user-123" };
vi.mock("@/providers/AuthProvider", () => ({
  useAuth: () => ({ user: mockUser }),
}));

// Toast hook — capture every call so we can assert on title/variant.
const toastSpy = vi.fn();
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: toastSpy }),
}));

// Import after mocks are registered.
import { ProfilePrivacySettings } from "@/components/ProfilePrivacySettings";

// ---------------------------------------------------------------------------

beforeEach(() => {
  vi.clearAllMocks();
  loadResult = { data: null, error: null };
  saveResult = { error: null };
  mockUser = { id: "user-123" };
  // Re-prime the lazily-cleared async spies (clearAllMocks wipes impls).
  maybeSingleSpy.mockImplementation(async () => loadResult);
  upsertSpy.mockImplementation(async () => saveResult);
  // Silence expected error logging from the catch branches.
  vi.spyOn(console, "error").mockImplementation(() => {});
});

// Wait for the loading spinner ("Loading...") to disappear, i.e. the initial
// load effect has settled and the radio group is rendered.
async function renderSettled() {
  const utils = render(<ProfilePrivacySettings />);
  await waitFor(() =>
    expect(screen.queryByText("Loading...")).toBeNull(),
  );
  return utils;
}

describe("ProfilePrivacySettings — initial load", () => {
  it("queries the user_knowledge_profile table scoped to the current user", async () => {
    await renderSettled();
    expect(fromSpy).toHaveBeenCalledWith("user_knowledge_profile");
    expect(selectSpy).toHaveBeenCalledWith("profile_visibility");
    expect(eqSpy).toHaveBeenCalledWith("user_id", "user-123");
    expect(maybeSingleSpy).toHaveBeenCalledTimes(1);
  });

  it("renders all three visibility options after loading", async () => {
    await renderSettled();
    expect(screen.getByText("Private")).toBeTruthy();
    expect(screen.getByText("Level 3 Members Only")).toBeTruthy();
    expect(screen.getByText("Public")).toBeTruthy();
    expect(screen.getByText("Save Privacy Settings")).toBeTruthy();
  });

  it("renders the explanatory 'What's Protected' section", async () => {
    await renderSettled();
    expect(screen.getByText("What's Protected")).toBeTruthy();
    expect(screen.getByText(/Your interests and knowledge areas/)).toBeTruthy();
  });

  it("defaults to vip3_only when no stored row exists", async () => {
    loadResult = { data: null, error: null };
    await renderSettled();
    const vip3 = screen.getByRole("radio", { name: /Level 3 Members Only/i });
    expect(vip3.getAttribute("aria-checked")).toBe("true");
  });

  it("reflects a stored 'public' visibility from the database", async () => {
    loadResult = { data: { profile_visibility: "public" }, error: null };
    await renderSettled();
    const pub = screen.getByRole("radio", { name: /Public/i });
    expect(pub.getAttribute("aria-checked")).toBe("true");
  });

  it("reflects a stored 'private' visibility from the database", async () => {
    loadResult = { data: { profile_visibility: "private" }, error: null };
    await renderSettled();
    const priv = screen.getByRole("radio", { name: /Private/i });
    expect(priv.getAttribute("aria-checked")).toBe("true");
  });

  it("falls back to vip3_only when the stored row has a null visibility", async () => {
    loadResult = { data: { profile_visibility: null }, error: null };
    await renderSettled();
    const vip3 = screen.getByRole("radio", { name: /Level 3 Members Only/i });
    expect(vip3.getAttribute("aria-checked")).toBe("true");
  });
});

describe("ProfilePrivacySettings — load error handling", () => {
  it("shows a destructive toast when the query errors with a non-PGRST116 code", async () => {
    loadResult = { data: null, error: { code: "XX000", message: "boom" } };
    await renderSettled();
    expect(toastSpy).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Error", variant: "destructive" }),
    );
  });

  it("ignores the PGRST116 'no rows' code without toasting an error", async () => {
    loadResult = { data: null, error: { code: "PGRST116" } };
    await renderSettled();
    expect(toastSpy).not.toHaveBeenCalled();
    // Still renders the form with the default selection.
    const vip3 = screen.getByRole("radio", { name: /Level 3 Members Only/i });
    expect(vip3.getAttribute("aria-checked")).toBe("true");
  });

  it("still leaves the loading state when the query rejects", async () => {
    maybeSingleSpy.mockRejectedValueOnce(new Error("network down"));
    await renderSettled();
    expect(screen.queryByText("Loading...")).toBeNull();
    expect(toastSpy).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Error", variant: "destructive" }),
    );
  });
});

describe("ProfilePrivacySettings — unauthenticated", () => {
  it("does not query the database when there is no user", async () => {
    mockUser = null;
    await renderSettled();
    expect(fromSpy).not.toHaveBeenCalled();
  });

  it("renders the form with the default selection when unauthenticated", async () => {
    mockUser = null;
    await renderSettled();
    const vip3 = screen.getByRole("radio", { name: /Level 3 Members Only/i });
    expect(vip3.getAttribute("aria-checked")).toBe("true");
  });

  it("shows an error toast on save when not authenticated", async () => {
    mockUser = null;
    await renderSettled();
    fireEvent.click(screen.getByText("Save Privacy Settings"));
    await waitFor(() =>
      expect(toastSpy).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Error", variant: "destructive" }),
      ),
    );
    expect(upsertSpy).not.toHaveBeenCalled();
  });
});

describe("ProfilePrivacySettings — selection + save", () => {
  it("upserts the currently selected visibility scoped to the user", async () => {
    await renderSettled();
    fireEvent.click(screen.getByText("Save Privacy Settings"));
    await waitFor(() => expect(upsertSpy).toHaveBeenCalledTimes(1));
    const [payload, options] = upsertSpy.mock.calls[0] as unknown as [
      Record<string, unknown>,
      Record<string, unknown>,
    ];
    expect(payload.user_id).toBe("user-123");
    expect(payload.profile_visibility).toBe("vip3_only");
    expect(typeof payload.updated_at).toBe("string");
    expect(options).toEqual({ onConflict: "user_id" });
  });

  it("persists a changed selection", async () => {
    await renderSettled();
    fireEvent.click(screen.getByRole("radio", { name: /Public/i }));
    fireEvent.click(screen.getByText("Save Privacy Settings"));
    await waitFor(() => expect(upsertSpy).toHaveBeenCalledTimes(1));
    const [payload] = upsertSpy.mock.calls[0] as unknown as [Record<string, unknown>];
    expect(payload.profile_visibility).toBe("public");
  });

  it("shows a success toast after a successful save", async () => {
    await renderSettled();
    fireEvent.click(screen.getByText("Save Privacy Settings"));
    await waitFor(() =>
      expect(toastSpy).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Success" }),
      ),
    );
  });

  it("shows a destructive toast when the upsert returns an error", async () => {
    saveResult = { error: { message: "rls denied" } };
    await renderSettled();
    fireEvent.click(screen.getByText("Save Privacy Settings"));
    await waitFor(() =>
      expect(toastSpy).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Error", variant: "destructive" }),
      ),
    );
  });

  it("shows a destructive toast when the upsert throws", async () => {
    upsertSpy.mockRejectedValueOnce(new Error("network"));
    await renderSettled();
    fireEvent.click(screen.getByText("Save Privacy Settings"));
    await waitFor(() =>
      expect(toastSpy).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Error", variant: "destructive" }),
      ),
    );
  });

  it("re-enables the Save button after the save settles (success)", async () => {
    await renderSettled();
    const btn = screen.getByText("Save Privacy Settings");
    fireEvent.click(btn);
    await waitFor(() =>
      expect(toastSpy).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Success" }),
      ),
    );
    // After settle the label returns to its idle text (not "Saving...").
    expect(screen.getByText("Save Privacy Settings")).toBeTruthy();
    expect(screen.queryByText("Saving...")).toBeNull();
  });

  it("re-enables the Save button after the save settles (error)", async () => {
    saveResult = { error: { message: "denied" } };
    await renderSettled();
    fireEvent.click(screen.getByText("Save Privacy Settings"));
    await waitFor(() =>
      expect(toastSpy).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Error" }),
      ),
    );
    expect(screen.queryByText("Saving...")).toBeNull();
    expect(screen.getByText("Save Privacy Settings")).toBeTruthy();
  });
});

describe("ProfilePrivacySettings — re-load on user change", () => {
  afterEach(() => cleanup());

  it("re-runs the load query when the userId changes", async () => {
    const { rerender } = render(<ProfilePrivacySettings />);
    await waitFor(() => expect(maybeSingleSpy).toHaveBeenCalledTimes(1));

    mockUser = { id: "user-456" };
    rerender(<ProfilePrivacySettings />);
    await waitFor(() => expect(eqSpy).toHaveBeenCalledWith("user_id", "user-456"));
  });
});
