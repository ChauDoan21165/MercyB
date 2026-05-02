import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock the Sentry SDKs so init / setUser / captureException never run for
// real. We re-import per test to read the spy back. Note that vitest sets
// MODE='test', which makes initSentry() return before the dynamic imports
// fire — these mocks exist as belt-and-braces in case that guard regresses.
vi.mock("@sentry/react", () => ({
  init: vi.fn(),
  setUser: vi.fn(),
  captureException: vi.fn(),
}));
vi.mock("@sentry/capacitor", () => ({
  init: vi.fn(),
  setUser: vi.fn(),
  captureException: vi.fn(),
  setTag: vi.fn(),
}));

import * as Sentry from "@sentry/react";
import {
  initSentry,
  scrubEvent,
  scrubBreadcrumb,
  isSentryEnabled,
  __resetForTest,
} from "../sentryInit";
import {
  captureError,
  tagWithUser,
  clearUser,
} from "../captureException";

const sentryInit = Sentry.init as unknown as ReturnType<typeof vi.fn>;
const sentrySetUser = Sentry.setUser as unknown as ReturnType<typeof vi.fn>;
const sentryCaptureException = Sentry.captureException as unknown as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
  __resetForTest();
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("initSentry — DSN gating", () => {
  it("does NOT call Sentry.init when MODE === 'test'", () => {
    // Vitest sets MODE=test by default; even with a DSN present, init must skip.
    vi.stubEnv("VITE_SENTRY_DSN", "https://fake@o0.ingest.sentry.io/0");
    initSentry();
    expect(sentryInit).not.toHaveBeenCalled();
    expect(isSentryEnabled()).toBe(false);
  });

  it("isSentryEnabled returns false when DSN is empty", () => {
    vi.stubEnv("VITE_SENTRY_DSN", "");
    initSentry();
    expect(isSentryEnabled()).toBe(false);
  });

  it("calling initSentry twice does not double-init", () => {
    vi.stubEnv("VITE_SENTRY_DSN", "");
    initSentry();
    initSentry();
    expect(sentryInit).not.toHaveBeenCalled();
  });
});

describe("captureError no-op when disabled", () => {
  it("does not call Sentry.captureException when not initialized", () => {
    captureError(new Error("boom"));
    expect(sentryCaptureException).not.toHaveBeenCalled();
  });

  it("does not call Sentry.captureException with context either", () => {
    captureError(new Error("boom"), { route: "/groups", attempt: 2 });
    expect(sentryCaptureException).not.toHaveBeenCalled();
  });
});

describe("tagWithUser / clearUser no-op when disabled", () => {
  it("tagWithUser does not call Sentry.setUser when disabled", () => {
    tagWithUser("user-123");
    expect(sentrySetUser).not.toHaveBeenCalled();
  });

  it("tagWithUser does not call Sentry.setUser for null userId", () => {
    tagWithUser(null);
    expect(sentrySetUser).not.toHaveBeenCalled();
  });

  it("clearUser does not call Sentry.setUser when disabled", () => {
    clearUser();
    expect(sentrySetUser).not.toHaveBeenCalled();
  });
});

describe("scrubEvent — PII stripping", () => {
  it("strips email addresses from event.message", () => {
    const event = scrubEvent({ message: "user alice@example.com failed" });
    expect(event?.message).not.toContain("alice@example.com");
    expect(event?.message).toContain("[EMAIL_REDACTED]");
  });

  it("strips UUIDs from event.message", () => {
    const event = scrubEvent({
      message: "lookup failed for 550e8400-e29b-41d4-a716-446655440000",
    });
    expect(event?.message).not.toContain("550e8400");
    expect(event?.message).toContain("[ID_REDACTED]");
  });

  it("reduces user object to id only — drops email / username / ip", () => {
    const event = scrubEvent({
      user: {
        id: "user-123",
        email: "alice@example.com",
        username: "alice",
        ip_address: "1.2.3.4",
      },
    });
    expect(event?.user).toEqual({ id: "user-123" });
  });

  it("removes user entirely when only PII fields are present (no id)", () => {
    const event = scrubEvent({
      user: { email: "alice@example.com", username: "alice" },
    });
    expect(event?.user).toBeUndefined();
  });

  it("strips PII from request body strings + drops cookies", () => {
    const event = scrubEvent({
      request: {
        data: "email=alice@example.com&phone=555-123-4567",
        query_string: "uid=550e8400-e29b-41d4-a716-446655440000",
        cookies: { sb_access_token: "secret-token" },
      },
    });
    expect(event?.request?.data).not.toContain("alice@example.com");
    expect(event?.request?.data).toContain("[EMAIL_REDACTED]");
    expect(event?.request?.query_string).toContain("[ID_REDACTED]");
    // Cookies are dropped wholesale — they contain auth tokens.
    expect(event?.request?.cookies).toBeUndefined();
  });

  it("strips PII from exception values", () => {
    const event = scrubEvent({
      exception: {
        values: [
          { value: "DB error for alice@example.com", type: "Error" },
          { value: "no PII here", type: "Error" },
        ],
      },
    });
    expect(event?.exception?.values?.[0].value).toContain("[EMAIL_REDACTED]");
    expect(event?.exception?.values?.[1].value).toBe("no PII here");
  });

  it("filters ui.input breadcrumbs out entirely", () => {
    const event = scrubEvent({
      breadcrumbs: [
        { category: "ui.input", message: "alice@example.com" },
        { category: "navigation", message: "to /groups" },
      ],
    });
    expect(event?.breadcrumbs).toHaveLength(1);
    expect(event?.breadcrumbs?.[0].category).toBe("navigation");
  });

  it("strips JWT access tokens from event.message", () => {
    const fakeJwt =
      "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyLTEifQ.abc123-_def";
    const event = scrubEvent({ message: `auth failed with ${fakeJwt}` });
    expect(event?.message).not.toContain("eyJ");
    expect(event?.message).toContain("[JWT_REDACTED]");
  });

  it("strips Bearer tokens from event.message", () => {
    const event = scrubEvent({
      message: "Authorization: Bearer abcdef.GHIJKL-1234567890",
    });
    expect(event?.message).not.toContain("abcdef.GHIJKL");
    expect(event?.message).toContain("Bearer [TOKEN_REDACTED]");
  });

  it("strips Stripe customer IDs from exception values", () => {
    const event = scrubEvent({
      exception: {
        values: [
          { value: "Stripe error for cus_PqR1234XYZabc", type: "Error" },
        ],
      },
    });
    expect(event?.exception?.values?.[0].value).not.toContain("cus_PqR");
    expect(event?.exception?.values?.[0].value).toContain("[STRIPE_CUS_REDACTED]");
  });

  it("strips Supabase service-role key from event.message", () => {
    const event = scrubEvent({
      message: "SUPABASE_SERVICE_ROLE_KEY=eyJhbgci.fake.payload was missing",
    });
    expect(event?.message).not.toContain("eyJhbgci");
    expect(event?.message).toContain("[SERVICE_KEY_REDACTED]");
  });

  it("strips Capacitor audio blob URLs from breadcrumb messages", () => {
    const event = scrubEvent({
      breadcrumbs: [
        {
          category: "fetch",
          message: "decode failed for blob:capacitor://localhost/abc-123-def",
        },
      ],
    });
    expect(event?.breadcrumbs?.[0].message).not.toContain("blob:capacitor://");
    expect(event?.breadcrumbs?.[0].message).toContain("[AUDIO_BLOB_REDACTED]");
  });
});

describe("scrubBreadcrumb", () => {
  it("drops ui.input breadcrumbs (raw user text)", () => {
    expect(
      scrubBreadcrumb({ category: "ui.input", message: "anything" }),
    ).toBeNull();
  });

  it("strips PII from breadcrumb message", () => {
    const b = scrubBreadcrumb({
      category: "navigation",
      message: "fetched profile for alice@example.com",
    });
    expect(b?.message).toContain("[EMAIL_REDACTED]");
  });

  it("strips PII from string values in breadcrumb.data", () => {
    const b = scrubBreadcrumb({
      category: "fetch",
      data: { url: "/api/users?email=alice@example.com", status: 200 },
    });
    expect(b?.data?.url).toContain("[EMAIL_REDACTED]");
    // Non-string values pass through untouched.
    expect(b?.data?.status).toBe(200);
  });

  it("preserves non-ui.input breadcrumbs unchanged when no PII", () => {
    const b = scrubBreadcrumb({
      category: "navigation",
      message: "to /rooms",
    });
    expect(b).toEqual({ category: "navigation", message: "to /rooms" });
  });
});
