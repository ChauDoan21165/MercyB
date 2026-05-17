// supabase/functions/billing-stripe-change-plan/__tests__/duplicateGuard.test.ts
//
// Money-path regression guard for the BACKEND half of the duplicate-
// subscription fix (PR #215, commit f5e09918): the "Stripe-direct
// last-line duplicate guard" inside createCheckoutSessionForFreeUser.
//
// Why this is a source-contract test rather than an integration test:
// billing-stripe-change-plan/index.ts is a single ~39 KB Deno edge
// function and createCheckoutSessionForFreeUser is not exported. The
// established testable-helper split (see stripe-webhook/event-types.ts)
// does not exist here, and extracting a helper out of a live money-path
// edge function is a production-affecting change that is intentionally
// OUT of scope for this test-only PR (locked principle #4 — explicit
// confirmation before any production-affecting money-path change). That
// extraction is logged as deferred follow-up in
// reports/RECON-stripe-dupe-fix.md.
//
// So this test pins the four invariants the fix depends on, straight
// from the production source, plus an executable spec for the blocking-
// status decision. If a future edit weakens any invariant, this is red.

import { describe, expect, it } from "vitest";
// Raw-source import (vite ?raw, same resolver that handles the working
// `../event-types` import in stripe-webhook tests). The function under
// test is not exported, so we assert against its production source.
import INDEX_SRC from "../index.ts?raw";

// Whitespace-insensitive view, so formatting changes don't make these
// brittle while semantic changes still trip them.
const squashed = INDEX_SRC.replace(/\s+/g, "");

const GUARD_MARKER = "=== LAST-LINE DUPLICATE GUARD (Stripe-direct) ===";
const CHECKOUT_CREATE = "stripe.checkout.sessions.create(";

// The guard region: from its banner comment to the line that begins the
// checkout-session creation. Everything that protects against a second
// charge lives in here.
const guardStart = INDEX_SRC.indexOf(GUARD_MARKER);
const sessionDecl = INDEX_SRC.indexOf(
  "let session: Stripe.Checkout.Session;",
);
const guardRegion =
  guardStart >= 0 && sessionDecl > guardStart
    ? INDEX_SRC.slice(guardStart, sessionDecl)
    : "";

describe("billing-stripe-change-plan — Stripe-direct duplicate guard (source contract)", () => {
  it("the guard still exists in createCheckoutSessionForFreeUser", () => {
    expect(guardStart).toBeGreaterThan(-1);
    expect(guardRegion.length).toBeGreaterThan(0);
    expect(guardRegion).toContain("stripe.subscriptions.list");
  });

  it("blocks exactly the four live Stripe statuses (the canonical set)", () => {
    // Changing this set is a money-path behaviour change and must be a
    // conscious, reviewed edit — not an incidental one.
    expect(squashed).toContain(
      '["active","trialing","past_due","unpaid"].includes',
    );
  });

  it("returns the exact response shape the frontend portal-router keys on", () => {
    // Must stay byte-aligned with the three signals asserted in
    // src/lib/__tests__/billing.dupeGuard.test.ts. The frontend routes
    // action:"manage_billing" -> billing portal (no second checkout).
    const guardSquashed = guardRegion.replace(/\s+/g, "");
    expect(guardSquashed).toContain('action:"manage_billing"');
    expect(guardSquashed).toContain("requires_new_subscription:false");
    expect(guardSquashed).toContain("ok:true");
  });

  it("fires BEFORE checkout.sessions.create (cannot create a 2nd subscription first)", () => {
    const guardIdx = INDEX_SRC.indexOf(GUARD_MARKER);
    const checkoutIdx = INDEX_SRC.indexOf(CHECKOUT_CREATE);
    expect(guardIdx).toBeGreaterThan(-1);
    expect(checkoutIdx).toBeGreaterThan(-1);
    expect(guardIdx).toBeLessThan(checkoutIdx);
  });

  it("fails OPEN: a Stripe list-call error must not block a real first-time customer", () => {
    // The catch block of the guard's try must NOT return — a transient
    // subscriptions.list() failure has to fall through to checkout so a
    // legitimate paying first-time user is never hard-blocked. This is
    // the single most safety-critical invariant of the fix.
    const catchIdx = guardRegion.indexOf("} catch (err) {");
    expect(catchIdx).toBeGreaterThan(-1);
    const catchBlock = guardRegion.slice(catchIdx);
    // The intent is documented in a comment ("...do not return — fail
    // open..."); strip comments so we test for an actual return
    // *statement*, not the word inside that comment.
    const catchCode = catchBlock
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\/\/.*$/gm, "");
    expect(catchCode).not.toMatch(/\breturn\b/);
    expect(catchBlock).toContain("fail open");
  });
});

describe("blocking-status decision — executable spec", () => {
  // Mirror of the production predicate. The source-contract test above
  // guarantees production uses exactly this set; this documents the
  // behaviour each status produces.
  const BLOCKING = ["active", "trialing", "past_due", "unpaid"];
  const wouldBlock = (status: string) => BLOCKING.includes(status);

  it.each(["active", "trialing", "past_due", "unpaid"])(
    "blocks a new checkout when an existing sub is '%s'",
    (status) => {
      expect(wouldBlock(status)).toBe(true);
    },
  );

  it.each(["canceled", "incomplete", "incomplete_expired", "paused", ""])(
    "allows checkout when the only existing sub is '%s' (not live)",
    (status) => {
      expect(wouldBlock(status)).toBe(false);
    },
  );
});
