// Subscription-gating UI states for <RequireFeature>.
//
// RequireFeature is the canonical app-layer gate: it renders `children`
// only when the active entitlement satisfies `flag`, otherwise `fallback`.
// Tiering is profiles.tier 0..N — level0 (tier 0) = free, higher = paid.
// There is NO 'vip' cohort; legacy `vipN` flags map to a numeric rank.
//
// We drive the gate by mocking the entitlement hook it consumes so every
// state is hermetic (no Supabase, no network). The supabaseClient stub is
// present because the real hook imports it transitively.

import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    auth: { getSession: vi.fn(), onAuthStateChange: vi.fn() },
    from: vi.fn(),
  },
}));

const useEntitlements = vi.fn();
vi.mock("@/lib/useEntitlements", () => ({
  useEntitlements: () => useEntitlements(),
}));

import RequireFeature from "@/components/entitlements/RequireFeature";

/** Minimal entitlement shape the gate reads: is_premium/status for the
 *  premium flag, vip_rank for vipN flags, plus a hasFlag resolver. */
function makeEnt(overrides: Record<string, unknown> = {}) {
  return {
    is_premium: false,
    status: "free",
    vip_rank: 0,
    ...overrides,
  };
}

function setEntitlements({
  loading = false,
  ent = makeEnt(),
  hasFlag = () => false,
}: {
  loading?: boolean;
  ent?: Record<string, unknown> | null;
  hasFlag?: (key: string, fallback?: boolean) => boolean;
}) {
  useEntitlements.mockReturnValue({ loading, ent, hasFlag });
}

const LOCKED = "Upgrade to unlock";
const UNLOCKED = "Premium content";

function renderGate(flag: string) {
  return render(
    <RequireFeature flag={flag} fallback={<div>{LOCKED}</div>}>
      <div>{UNLOCKED}</div>
    </RequireFeature>,
  );
}

describe("RequireFeature — subscription gating UI states", () => {
  beforeEach(() => {
    useEntitlements.mockReset();
  });

  it("shows the locked fallback while entitlements are loading", () => {
    setEntitlements({ loading: true, ent: null });
    renderGate("premium");
    expect(screen.getByText(LOCKED)).toBeInTheDocument();
    expect(screen.queryByText(UNLOCKED)).not.toBeInTheDocument();
  });

  it("shows the locked fallback when there is no entitlement at all", () => {
    setEntitlements({ loading: false, ent: null });
    renderGate("premium");
    expect(screen.getByText(LOCKED)).toBeInTheDocument();
    expect(screen.queryByText(UNLOCKED)).not.toBeInTheDocument();
  });

  describe("premium flag", () => {
    it("locks a free (tier 0) user", () => {
      setEntitlements({
        ent: makeEnt({ is_premium: false, status: "free" }),
      });
      renderGate("premium");
      expect(screen.getByText(LOCKED)).toBeInTheDocument();
      expect(screen.queryByText(UNLOCKED)).not.toBeInTheDocument();
    });

    it("unlocks an active premium (paid) user", () => {
      setEntitlements({
        ent: makeEnt({ is_premium: true, status: "active" }),
      });
      renderGate("premium");
      expect(screen.getByText(UNLOCKED)).toBeInTheDocument();
      expect(screen.queryByText(LOCKED)).not.toBeInTheDocument();
    });

    it("locks a premium user whose subscription is not active", () => {
      setEntitlements({
        ent: makeEnt({ is_premium: true, status: "canceled" }),
      });
      renderGate("is_premium");
      expect(screen.getByText(LOCKED)).toBeInTheDocument();
      expect(screen.queryByText(UNLOCKED)).not.toBeInTheDocument();
    });
  });

  describe("numeric rank (vipN) flag", () => {
    it("unlocks when the user's rank meets the required rank", () => {
      setEntitlements({ ent: makeEnt({ vip_rank: 3 }) });
      renderGate("vip3");
      expect(screen.getByText(UNLOCKED)).toBeInTheDocument();
    });

    it("unlocks when the user's rank exceeds the required rank", () => {
      setEntitlements({ ent: makeEnt({ vip_rank: 9 }) });
      renderGate("vip3");
      expect(screen.getByText(UNLOCKED)).toBeInTheDocument();
    });

    it("locks a free user (rank 0) below the required rank", () => {
      setEntitlements({ ent: makeEnt({ vip_rank: 0 }) });
      renderGate("vip3");
      expect(screen.getByText(LOCKED)).toBeInTheDocument();
      expect(screen.queryByText(UNLOCKED)).not.toBeInTheDocument();
    });

    it("treats a missing rank as 0 (locked)", () => {
      const ent = makeEnt();
      delete (ent as Record<string, unknown>).vip_rank;
      setEntitlements({ ent });
      renderGate("vip1");
      expect(screen.getByText(LOCKED)).toBeInTheDocument();
    });
  });

  describe("generic feature flag (delegates to hasFlag)", () => {
    it("unlocks when hasFlag resolves true for the feature", () => {
      const hasFlag = vi.fn((key: string) => key === "level2");
      setEntitlements({ ent: makeEnt(), hasFlag });
      renderGate("level2");
      expect(screen.getByText(UNLOCKED)).toBeInTheDocument();
      expect(hasFlag).toHaveBeenCalledWith("level2", false);
    });

    it("locks when hasFlag resolves false for the feature", () => {
      const hasFlag = vi.fn(() => false);
      setEntitlements({ ent: makeEnt(), hasFlag });
      renderGate("level2");
      expect(screen.getByText(LOCKED)).toBeInTheDocument();
      expect(screen.queryByText(UNLOCKED)).not.toBeInTheDocument();
    });

    it("normalizes the flag (trim + lowercase) before resolving", () => {
      const hasFlag = vi.fn((key: string) => key === "level1");
      setEntitlements({ ent: makeEnt(), hasFlag });
      renderGate("  LEVEL1  ");
      expect(screen.getByText(UNLOCKED)).toBeInTheDocument();
      expect(hasFlag).toHaveBeenCalledWith("level1", false);
    });
  });
});
