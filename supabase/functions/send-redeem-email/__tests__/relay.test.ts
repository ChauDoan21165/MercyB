// send-redeem-email/__tests__/relay.test.ts
//
// Relay-protection tests for the two-layer guard in send-redeem-email:
//   Layer 1 — isAuthorizedCaller: only service-role callers may invoke.
//   Layer 2 — isKnownRecipient: even an authorized caller cannot mail an
//              address that doesn't belong to a real MercyBlade user.

import { describe, expect, it } from "vitest";

import {
  extractBearerToken,
  isAuthorizedCaller,
  isKnownRecipient,
} from "../auth";

const SECRET = "super-secret-service-role-key";
const KNOWN_USERS = [
  { email: "alice@example.com" },
  { email: "bob@example.com" },
  { email: null },        // user without email (no crash)
  { email: undefined },   // user without email field (no crash)
] as const;

// ── Layer 1: authorization gate ───────────────────────────────────────────

describe("extractBearerToken", () => {
  it("strips the Bearer prefix", () => {
    expect(extractBearerToken("Bearer abc123")).toBe("abc123");
  });
  it("is case-insensitive on 'Bearer'", () => {
    expect(extractBearerToken("BEARER abc123")).toBe("abc123");
  });
  it("handles multiple spaces between Bearer and token", () => {
    expect(extractBearerToken("Bearer   abc123")).toBe("abc123");
  });
  it("returns empty string for null", () => {
    expect(extractBearerToken(null)).toBe("");
  });
  it("returns empty string for empty header", () => {
    expect(extractBearerToken("")).toBe("");
  });
});

describe("isAuthorizedCaller", () => {
  it("allows an exact match", () => {
    expect(isAuthorizedCaller(SECRET, SECRET)).toBe(true);
  });

  it("rejects a mismatched token", () => {
    expect(isAuthorizedCaller("wrong", SECRET)).toBe(false);
  });

  it("rejects an empty presented token", () => {
    expect(isAuthorizedCaller("", SECRET)).toBe(false);
  });

  it("fails closed when the env key is undefined (SUPABASE_SERVICE_ROLE_KEY not set)", () => {
    expect(isAuthorizedCaller(SECRET, undefined)).toBe(false);
  });

  it("fails closed when the env key is null", () => {
    expect(isAuthorizedCaller(SECRET, null)).toBe(false);
  });

  it("fails closed when the env key is empty string", () => {
    expect(isAuthorizedCaller(SECRET, "")).toBe(false);
  });
});

// ── Layer 2: audience check ───────────────────────────────────────────────

describe("isKnownRecipient", () => {
  it("allows a known user email (exact match)", () => {
    expect(isKnownRecipient("alice@example.com", KNOWN_USERS)).toBe(true);
  });

  it("is case-insensitive — rejects relay to an address with different case", () => {
    // CASL: casing shouldn't create a bypass
    expect(isKnownRecipient("Alice@Example.COM", KNOWN_USERS)).toBe(true);
  });

  it("rejects an email not in the user list — the open-relay case", () => {
    expect(isKnownRecipient("attacker@evil.com", KNOWN_USERS)).toBe(false);
  });

  it("fails closed on empty user list", () => {
    expect(isKnownRecipient("alice@example.com", [])).toBe(false);
  });

  it("fails closed on empty recipient email", () => {
    expect(isKnownRecipient("", KNOWN_USERS)).toBe(false);
  });

  it("handles users with null/undefined email without crashing", () => {
    const users = [{ email: null }, { email: undefined }];
    expect(isKnownRecipient("any@test.com", users)).toBe(false);
  });

  it("full relay scenario: authorized caller + unknown email → BLOCKED", () => {
    // Simulates the scenario: attacker has the service-role key but tries
    // to send to an arbitrary address not in auth.users.
    const presented = extractBearerToken(`Bearer ${SECRET}`);
    const authorized = isAuthorizedCaller(presented, SECRET);
    const allowed = isKnownRecipient("spam-victim@random.com", KNOWN_USERS);
    // Layer 1 passes but layer 2 fails → relay is blocked.
    expect(authorized).toBe(true);
    expect(allowed).toBe(false);
  });

  it("full valid scenario: authorized caller + known email → ALLOWED", () => {
    const presented = extractBearerToken(`Bearer ${SECRET}`);
    const authorized = isAuthorizedCaller(presented, SECRET);
    const allowed = isKnownRecipient("bob@example.com", KNOWN_USERS);
    expect(authorized).toBe(true);
    expect(allowed).toBe(true);
  });
});
