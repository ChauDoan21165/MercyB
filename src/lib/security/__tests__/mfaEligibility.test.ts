import { describe, it, expect } from "vitest";
import { canUseMfa } from "../mfaEligibility";

// Minimal access shapes — exercising the four eligibility paths plus the
// loading invariant that motivated the helper (smoke-test bug 2026-04-27).

const baseAccess = {
  isAuthenticated: false,
  loading: false,
  hasPremium: false,
  isHighAdmin: false,
};

describe("canUseMfa — eligibility decisions", () => {
  it("returns resolved=false during loading (the smoke-test invariant)", () => {
    const out = canUseMfa({ ...baseAccess, loading: true, isAuthenticated: true });
    expect(out.resolved).toBe(false);
    expect(out.allowed).toBe(false);
    expect(out.reason).toBe("loading");
  });

  it("returns resolved=false during loading even when downstream flags would allow", () => {
    // This is the actual bug we fixed: hasPremium=false (default) +
    // isHighAdmin=false (default) during loading would have made the
    // old `isPaid = hasPremium || isHighAdmin` check return false
    // and bounce the user to "ineligible". The helper protects
    // against that by gating on loading FIRST.
    const out = canUseMfa({ ...baseAccess, loading: true, isAuthenticated: true });
    expect(out.allowed).toBe(false); // would have been admin_override post-load
    expect(out.reason).toBe("loading");
  });

  it("anon users are not eligible (anon)", () => {
    const out = canUseMfa({ ...baseAccess, isAuthenticated: false });
    expect(out.resolved).toBe(true);
    expect(out.allowed).toBe(false);
    expect(out.reason).toBe("anon");
  });

  it("admin override beats free-tier (admin_override)", () => {
    const out = canUseMfa({
      ...baseAccess,
      isAuthenticated: true,
      isHighAdmin: true,
      hasPremium: false,
    });
    expect(out.resolved).toBe(true);
    expect(out.allowed).toBe(true);
    expect(out.reason).toBe("admin_override");
  });

  it("admin override applies even without subscription row (the smoke-test scenario)", () => {
    // user_id 9957f25a-... had admin_level=10 but no user_subscriptions
    // row. /account/security correctly let them through; /auth/security
    // wrongly blocked. Both must agree → both call canUseMfa.
    const out = canUseMfa({
      isAuthenticated: true,
      loading: false,
      hasPremium: false, // no subscription row
      isHighAdmin: true, // admin_level=10
    });
    expect(out.allowed).toBe(true);
    expect(out.reason).toBe("admin_override");
  });

  it("paid users are eligible (paid)", () => {
    const out = canUseMfa({
      ...baseAccess,
      isAuthenticated: true,
      hasPremium: true,
    });
    expect(out.resolved).toBe(true);
    expect(out.allowed).toBe(true);
    expect(out.reason).toBe("paid");
  });

  it("free-tier users are NOT eligible (free_tier)", () => {
    const out = canUseMfa({
      ...baseAccess,
      isAuthenticated: true,
      hasPremium: false,
      isHighAdmin: false,
    });
    expect(out.resolved).toBe(true);
    expect(out.allowed).toBe(false);
    expect(out.reason).toBe("free_tier");
  });

  it("admin override and paid both true → admin reason wins (telemetry preference)", () => {
    // Order in canUseMfa: admin first, then paid. Either reason is
    // technically correct; this test pins the precedence so admins
    // appearing in MFA telemetry are tagged consistently.
    const out = canUseMfa({
      isAuthenticated: true,
      loading: false,
      hasPremium: true,
      isHighAdmin: true,
    });
    expect(out.allowed).toBe(true);
    expect(out.reason).toBe("admin_override");
  });
});
