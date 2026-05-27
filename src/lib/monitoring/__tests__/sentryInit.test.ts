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
  whenSentryReady,
  scrubEvent,
  scrubBreadcrumb,
  isSentryEnabled,
  looksLikeExternalNoise,
  looksLikeDomMutationExtensionNoise,
  looksLikeAnonymousStackOverflow,
  runsInsideZaloIab,
  buildSentryOptions,
  enrichEventTags,
  classifyRlsTable,
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

describe("whenSentryReady — deferred-boot readiness contract", () => {
  it("resolves after initSentry() in test mode (terminal: disabled)", async () => {
    initSentry(); // MODE==='test' → early return, but must still settle
    await expect(whenSentryReady()).resolves.toBeUndefined();
    expect(isSentryEnabled()).toBe(false); // buffer must drop, not replay
  });

  it("resolves even when whenSentryReady() is awaited BEFORE initSentry()", async () => {
    const ready = whenSentryReady(); // caller races ahead of init
    initSentry();
    await expect(ready).resolves.toBeUndefined();
  });

  it("returns a stable promise and resolves on the idempotent second call", async () => {
    const a = whenSentryReady();
    const b = whenSentryReady();
    expect(a).toBe(b); // same promise instance — buffer can await once
    initSentry();
    initSentry(); // idempotent path must also settle readiness
    await expect(a).resolves.toBeUndefined();
  });

  it("resolves with Sentry disabled when DSN is empty (drop, not replay)", async () => {
    vi.stubEnv("VITE_SENTRY_DSN", "");
    initSentry();
    await whenSentryReady();
    expect(isSentryEnabled()).toBe(false);
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

// ── External-script noise filter ─────────────────────────────────────────
// Locks every NOISE_PATTERNS entry so future edits can't silently break the
// drop list. Each entry is a separate it() so a regression names exactly
// which pattern broke. A negative case at the end asserts a normal
// MercyBlade-shaped error is NOT filtered.
describe("looksLikeExternalNoise — IAB / extension / SDK CDN drop list", () => {
  // Helper: build a minimal SentryEventLike with the given exception value.
  // Mirrors the shape collectNoiseHaystacks() walks in production.
  function eventWithExceptionValue(value: string) {
    return { exception: { values: [{ value }] } };
  }

  // Helper: build an event whose stack frame filename carries the noise
  // marker (some IAB injections only show up in filenames, not messages).
  function eventWithFrameFilename(filename: string) {
    return {
      exception: {
        values: [
          { value: "TypeError: x", stacktrace: { frames: [{ filename }] } },
        ],
      },
    };
  }

  it("drops Facebook / Instagram / Zalo IAB injection (iabjs://)", () => {
    expect(looksLikeExternalNoise(
      eventWithFrameFilename("iabjs://script.js"),
    )).toBe(true);
  });

  it("drops Chrome extension stacks", () => {
    expect(looksLikeExternalNoise(
      eventWithFrameFilename("chrome-extension://abc123/content.js"),
    )).toBe(true);
  });

  it("drops Firefox extension stacks", () => {
    expect(looksLikeExternalNoise(
      eventWithFrameFilename("moz-extension://uuid/content.js"),
    )).toBe(true);
  });

  it("drops Safari extension stacks (both safari-extension and safari-web-extension)", () => {
    expect(looksLikeExternalNoise(
      eventWithFrameFilename("safari-extension://abc/content.js"),
    )).toBe(true);
    expect(looksLikeExternalNoise(
      eventWithFrameFilename("safari-web-extension://abc/content.js"),
    )).toBe(true);
  });

  it("drops Facebook Pixel SDK noise (connect.facebook.net)", () => {
    expect(looksLikeExternalNoise(
      eventWithFrameFilename("https://connect.facebook.net/en_US/fbevents.js"),
    )).toBe(true);
  });

  it("drops Google Tag Manager noise (googletagmanager.com)", () => {
    expect(looksLikeExternalNoise(
      eventWithFrameFilename("https://www.googletagmanager.com/gtm.js?id=GTM-X"),
    )).toBe(true);
  });

  it("drops Zalo IAB injection — ReferenceError zaloJSV2", () => {
    expect(looksLikeExternalNoise(
      eventWithExceptionValue("Can't find variable: zaloJSV2"),
    )).toBe(true);
  });

  it("drops Zalo IAB injection — lowercase zalojsv variant", () => {
    expect(looksLikeExternalNoise(
      eventWithExceptionValue("ReferenceError: zalojsv is not defined"),
    )).toBe(true);
  });

  it("drops FB/IG IAB webkit.messageHandlers TypeError (the new pattern)", () => {
    // The exact wording from the iOS Safari / Facebook IAB report.
    expect(looksLikeExternalNoise(
      eventWithExceptionValue(
        "undefined is not an object (evaluating 'window.webkit.messageHandlers')",
      ),
    )).toBe(true);
    // Variant without the `window.` prefix (some injections build the
    // identifier dynamically and the prefix doesn't appear in the
    // serialized error).
    expect(looksLikeExternalNoise(
      eventWithExceptionValue(
        "TypeError: undefined is not an object (evaluating 'webkit.messageHandlers.bridge')",
      ),
    )).toBe(true);
  });

  it("does NOT drop a normal MercyBlade-shaped error", () => {
    // Sanity check — a legit error from our own code must pass the filter.
    expect(looksLikeExternalNoise({
      message: "Failed to load room kids/abc",
      exception: {
        values: [
          {
            value: "Error: room not found",
            stacktrace: {
              frames: [
                { filename: "https://mercyblade.com/assets/RoomLoader-XYZ.js" },
              ],
            },
          },
        ],
      },
    })).toBe(false);
  });
});

// ── DOM-mutation extension noise (Translate / Grammarly / etc.) ────────────
// AND-gate: top frame inside our react-*.js bundle AND message is the
// removeChild / NotFoundError family. Anything that's only one half of the
// pair must pass through (could be a real React bug, or unrelated extension
// noise we already cover elsewhere).
describe("looksLikeDomMutationExtensionNoise — extension DOM-mutation drop", () => {
  // Build a Sentry event with the given top-frame filename + exception value.
  // Stack frames are ordered oldest→newest; the top frame is the LAST entry.
  function eventWith(topFrameFilename: string, exceptionValue: string) {
    return {
      exception: {
        values: [
          {
            value: exceptionValue,
            stacktrace: {
              frames: [
                { filename: "https://mercyblade.com/assets/index-AbCdEf.js" },
                { filename: topFrameFilename },
              ],
            },
          },
        ],
      },
    };
  }

  it("drops removeChild error when top frame is in react-*.js", () => {
    expect(
      looksLikeDomMutationExtensionNoise(
        eventWith(
          "https://mercyblade.com/assets/react-k4FrTbjO.js",
          "NotFoundError: Failed to execute 'removeChild' on 'Node'",
        ),
      ),
    ).toBe(true);
  });

  it("drops 'The object can not be found here' when top frame is in react-*.js", () => {
    expect(
      looksLikeDomMutationExtensionNoise(
        eventWith(
          "https://mercyblade.com/assets/react-k4FrTbjO.js",
          "NotFoundError: The object can not be found here.",
        ),
      ),
    ).toBe(true);
  });

  it("drops bare NotFoundError when top frame is in react-*.js", () => {
    expect(
      looksLikeDomMutationExtensionNoise(
        eventWith(
          "https://mercyblade.com/assets/react-7XyZ.js",
          "NotFoundError",
        ),
      ),
    ).toBe(true);
  });

  it("does NOT drop the same message when the top frame is NOT in react-*.js", () => {
    // Same message, but the top frame is in our own app code — this could
    // be a real bug we want to see.
    expect(
      looksLikeDomMutationExtensionNoise(
        eventWith(
          "https://mercyblade.com/assets/RoomRenderer-AbCd.js",
          "NotFoundError: Failed to execute 'removeChild' on 'Node'",
        ),
      ),
    ).toBe(false);
  });

  it("does NOT drop a react-*.js frame whose message is unrelated", () => {
    // Top frame is in react-*.js but the error isn't a DOM-mutation tell —
    // this is a normal React error that should reach Sentry.
    expect(
      looksLikeDomMutationExtensionNoise(
        eventWith(
          "https://mercyblade.com/assets/react-k4FrTbjO.js",
          "TypeError: Cannot read property 'foo' of undefined",
        ),
      ),
    ).toBe(false);
  });

  it("does NOT drop when react-*.js appears in a non-top frame only", () => {
    // react-*.js shows up earlier in the stack (called by something else
    // on top). The brief is specific: only the TOP frame counts.
    const event = {
      exception: {
        values: [
          {
            value: "NotFoundError: Failed to execute 'removeChild' on 'Node'",
            stacktrace: {
              frames: [
                { filename: "https://mercyblade.com/assets/react-k4FrTbjO.js" },
                { filename: "https://example-extension.com/inject.js" },
              ],
            },
          },
        ],
      },
    };
    expect(looksLikeDomMutationExtensionNoise(event)).toBe(false);
  });

  it("returns false on events with no exception", () => {
    expect(looksLikeDomMutationExtensionNoise({})).toBe(false);
    expect(
      looksLikeDomMutationExtensionNoise({ message: "something" }),
    ).toBe(false);
  });

  it("returns false on events with empty frames", () => {
    expect(
      looksLikeDomMutationExtensionNoise({
        exception: {
          values: [
            {
              value: "NotFoundError",
              stacktrace: { frames: [] },
            },
          ],
        },
      }),
    ).toBe(false);
  });
});

// ── Anonymous-frame stack-overflow drop (WEB-R/Q/C) ───────────────────────
// AND-gate: exception value is "Maximum call stack size exceeded" AND no
// stack frame names a real source. The shape comes from Chrome Mobile iOS
// (and similar in-app browsers) injecting scripts that recursively overflow;
// the host page sees one frame at `undefined:30:70` and no app code in the
// stack. A genuine app recursion still has react-*.js / app frames, so it
// must keep reaching Sentry.
describe("looksLikeAnonymousStackOverflow — injected-script stack overflow drop", () => {
  it("drops the WEB-R/Q/C shape: single frame with undefined filename", () => {
    expect(
      looksLikeAnonymousStackOverflow({
        exception: {
          values: [
            {
              value: "Maximum call stack size exceeded.",
              stacktrace: { frames: [{ filename: "undefined" }] },
            },
          ],
        },
      }),
    ).toBe(true);
  });

  it("drops when exception has no stacktrace frames at all", () => {
    expect(
      looksLikeAnonymousStackOverflow({
        exception: {
          values: [{ value: "RangeError: Maximum call stack size exceeded." }],
        },
      }),
    ).toBe(true);
  });

  it("drops when frames array is empty", () => {
    expect(
      looksLikeAnonymousStackOverflow({
        exception: {
          values: [
            {
              value: "Maximum call stack size exceeded",
              stacktrace: { frames: [] },
            },
          ],
        },
      }),
    ).toBe(true);
  });

  it("drops when every frame has empty / missing / <anonymous> filename", () => {
    expect(
      looksLikeAnonymousStackOverflow({
        exception: {
          values: [
            {
              value: "Maximum call stack size exceeded",
              stacktrace: {
                frames: [
                  { filename: "" },
                  { filename: "<anonymous>" },
                  { filename: "undefined" },
                  {},
                ],
              },
            },
          ],
        },
      }),
    ).toBe(true);
  });

  it("does NOT drop a stack overflow whose stack reaches our bundle", () => {
    // The whole point of this filter is to spare real recursion bugs.
    // Any frame with a real filename means we want to see it.
    expect(
      looksLikeAnonymousStackOverflow({
        exception: {
          values: [
            {
              value: "Maximum call stack size exceeded",
              stacktrace: {
                frames: [
                  { filename: "undefined" },
                  {
                    filename:
                      "https://mercyblade.com/assets/RoomRenderer-AbCd.js",
                  },
                ],
              },
            },
          ],
        },
      }),
    ).toBe(false);
  });

  it("does NOT drop a different RangeError variant", () => {
    // Only "Maximum call stack size exceeded" is the injected-script
    // fingerprint. Other RangeError messages must pass through.
    expect(
      looksLikeAnonymousStackOverflow({
        exception: {
          values: [
            {
              value: "RangeError: Invalid array length",
              stacktrace: { frames: [] },
            },
          ],
        },
      }),
    ).toBe(false);
  });

  it("does NOT drop a different error with anonymous frames", () => {
    // Anonymous frames alone aren't enough — must AND with the stack
    // overflow message. (Anonymous frames are normal for eval / blob
    // scripts; we'd over-filter without the message gate.)
    expect(
      looksLikeAnonymousStackOverflow({
        exception: {
          values: [
            {
              value: "TypeError: Cannot read property 'foo' of undefined",
              stacktrace: { frames: [{ filename: "undefined" }] },
            },
          ],
        },
      }),
    ).toBe(false);
  });

  it("returns false on events with no exception", () => {
    expect(looksLikeAnonymousStackOverflow({})).toBe(false);
    expect(
      looksLikeAnonymousStackOverflow({ message: "Maximum call stack size exceeded" }),
    ).toBe(false);
  });
});

// ── Zalo in-app browser drop (WEB-3) ───────────────────────────────────────
// Pins the UA-based filter that drops every event when the page is running
// inside the Zalo IAB. The check sits at the very top of beforeSend, so a
// regression here means Zalo bridge-script errors flood Sentry again.
describe("runsInsideZaloIab — Zalo IAB user-agent drop", () => {
  // Save the jsdom-provided navigator so we can restore it cleanly. We
  // can't just delete `globalThis.navigator` and let the next test see
  // whatever happens — other tests rely on jsdom's defaults.
  const realNavigator = globalThis.navigator;

  function setUserAgent(ua: string | undefined) {
    if (ua === undefined) {
      // Simulate non-browser environment: navigator entirely absent.
      // (e.g. SSR, edge function, node script that loads sentryInit.)
      Object.defineProperty(globalThis, "navigator", {
        value: undefined,
        configurable: true,
        writable: true,
      });
      return;
    }
    Object.defineProperty(globalThis, "navigator", {
      value: { userAgent: ua },
      configurable: true,
      writable: true,
    });
  }

  afterEach(() => {
    Object.defineProperty(globalThis, "navigator", {
      value: realNavigator,
      configurable: true,
      writable: true,
    });
  });

  it("returns true for a real Zalo IAB user agent (drops the event)", () => {
    setUserAgent(
      "Mozilla/5.0 (Linux; Android 10; SM-G960F) AppleWebKit/537.36 " +
      "(KHTML, like Gecko) Version/4.0 Chrome/87.0.4280.141 " +
      "Mobile Safari/537.36 Zalo/22.06.01 ZaloTheme/light ZaloLanguage/vi",
    );
    expect(runsInsideZaloIab()).toBe(true);
  });

  it("returns false for a normal Chrome user agent (event passes through)", () => {
    setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
      "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    );
    expect(runsInsideZaloIab()).toBe(false);
  });

  it("returns false for an empty user agent (event passes through)", () => {
    setUserAgent("");
    expect(runsInsideZaloIab()).toBe(false);
  });

  it("returns false when navigator is undefined (SSR / non-browser)", () => {
    setUserAgent(undefined);
    expect(runsInsideZaloIab()).toBe(false);
  });

  it("matches a UA with only the ZaloTheme token (no bare Zalo/version)", () => {
    // Defensive: covers older / variant Zalo builds that drop the
    // "Zalo/<ver>" token but keep "ZaloTheme/<value>".
    setUserAgent(
      "Mozilla/5.0 (Linux; Android 11; ...) Chrome/100.0 Mobile " +
      "Safari/537.36 ZaloTheme/dark",
    );
    expect(runsInsideZaloIab()).toBe(true);
  });

  it("does NOT false-positive on substrings like 'GazaLogistics'", () => {
    // Word-boundary anchor in ZALO_IAB_UA_RE protects against
    // unrelated tokens that happen to contain "zalo" as a substring.
    setUserAgent("Mozilla/5.0 (compatible; GazaLogisticsBot/1.0)");
    expect(runsInsideZaloIab()).toBe(false);
  });
});

describe("buildSentryOptions — Session Replay platform fork", () => {
  // Pins the contract that web init gets Replay (10% baseline / 100%
  // on-error, masked text / blocked media) and native (Capacitor) init
  // does not. @sentry/capacitor has no Replay support; wiring it on
  // the native branch would silently no-op at best and surface as a
  // confusing "integration registered" log at worst.
  const SHARED = { dsn: "https://x@y/0", tracesSampleRate: 0.1 };

  it("web init includes the Replay integration with Sentry's privacy defaults + sample rates", () => {
    const replayInstance = { __id: "replay-instance" };
    const replayFactory = vi.fn(() => replayInstance);

    const opts = buildSentryOptions({
      shared: SHARED,
      isNativeCapacitor: false,
      replayIntegrationFactory: replayFactory,
    });

    // Sample rates: 10% baseline, 100% on-error.
    expect(opts.replaysSessionSampleRate).toBe(0.1);
    expect(opts.replaysOnErrorSampleRate).toBe(1.0);

    // Replay factory called once with the safe defaults.
    expect(replayFactory).toHaveBeenCalledTimes(1);
    expect(replayFactory).toHaveBeenCalledWith({
      maskAllText: true,
      blockAllMedia: true,
    });

    // Resulting integrations array contains exactly the replay instance.
    expect(opts.integrations).toEqual([replayInstance]);

    // Shared options are still present.
    expect(opts.dsn).toBe(SHARED.dsn);
    expect(opts.tracesSampleRate).toBe(SHARED.tracesSampleRate);
  });

  it("native (Capacitor) init does NOT include Replay or replay sample rates", () => {
    // Even if a factory is somehow available on native, buildSentryOptions
    // must not wire it — @sentry/capacitor has no replay support.
    const replayFactory = vi.fn(() => ({ __id: "replay-instance" }));

    const opts = buildSentryOptions({
      shared: SHARED,
      isNativeCapacitor: true,
      replayIntegrationFactory: replayFactory,
    });

    expect(replayFactory).not.toHaveBeenCalled();
    expect(opts.integrations).toBeUndefined();
    expect(opts.replaysSessionSampleRate).toBeUndefined();
    expect(opts.replaysOnErrorSampleRate).toBeUndefined();

    // Shared options are still present.
    expect(opts.dsn).toBe(SHARED.dsn);
    expect(opts.tracesSampleRate).toBe(SHARED.tracesSampleRate);
  });

  it("web init falls back gracefully if replayIntegration factory is missing", () => {
    // Defensive: future @sentry/react versions could rename or drop the
    // export. Init must still succeed — without Replay — rather than throw.
    const opts = buildSentryOptions({
      shared: SHARED,
      isNativeCapacitor: false,
      replayIntegrationFactory: undefined,
    });

    expect(opts.integrations).toBeUndefined();
    expect(opts.replaysSessionSampleRate).toBeUndefined();
    expect(opts.replaysOnErrorSampleRate).toBeUndefined();
    expect(opts.dsn).toBe(SHARED.dsn);
  });
});

describe("classifyRlsTable — admin/privileged RLS table → featureArea", () => {
  it("maps the known admin-gated tables to 'admin'", () => {
    expect(classifyRlsTable("access_codes")).toBe("admin");
    expect(classifyRlsTable("email_campaigns")).toBe("admin");
    expect(classifyRlsTable("email_events")).toBe("admin");
  });

  it("maps the admin_* prefix convention to 'admin' (case-insensitive)", () => {
    expect(classifyRlsTable("admin_audit_log")).toBe("admin");
    expect(classifyRlsTable("ADMIN_Whatever")).toBe("admin");
  });

  it("maps profiles RLS to auth so it is not inferred as Teacher AI", () => {
    expect(classifyRlsTable("profiles")).toBe("auth");
    expect(classifyRlsTable("PROFILES")).toBe("auth");
  });

  it("returns null for learner tables + empty input (→ normal inference)", () => {
    expect(classifyRlsTable("rooms")).toBeNull();
    expect(classifyRlsTable("")).toBeNull();
    expect(classifyRlsTable(undefined)).toBeNull();
    expect(classifyRlsTable(null)).toBeNull();
  });
});

describe("enrichEventTags — featureArea preserved for rls_denied events", () => {
  it("keeps a pinned admin featureArea instead of reclassifying it", () => {
    const event = { tags: { rls_denied: "true", featureArea: "admin" } };
    enrichEventTags(event as never);
    expect(event.tags.featureArea).toBe("admin");
    // admin ≠ "other" ⇒ P1 (core break); rootCauseHint recognises the marker
    expect((event.tags as Record<string, string>).priority).toBe("P1");
  });

  it("does NOT preserve featureArea when rls_denied is absent", () => {
    const event = { tags: { featureArea: "admin" } };
    enrichEventTags(event as never);
    // No rls_denied marker ⇒ normal route/content inference wins (jsdom
    // path "/" is unclassified ⇒ "other"), not the stray preset.
    expect(event.tags.featureArea).not.toBe("admin");
  });

  it("falls through to inference when the pinned value is not a valid FeatureArea", () => {
    const event = { tags: { rls_denied: "true", featureArea: "bogus" } };
    enrichEventTags(event as never);
    expect(event.tags.featureArea).not.toBe("bogus");
  });

  it("keeps profiles RLS classified as auth instead of Mercy Teacher AI", () => {
    const event = {
      exception: {
        values: [
          {
            type: "Error",
            value: "PostgREST 403 (RLS denied): profiles [POST]",
          },
        ],
      },
      tags: { rls_denied: "true", featureArea: "auth" } as Record<string, string>,
    };

    enrichEventTags(event as never);

    expect(event.tags.featureArea).toBe("auth");
    expect(event.tags.rootCauseHint).toBe("auth_session_or_rls");
  });
});

describe("enrichEventTags — stale-deploy chunk-load severity", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });
  afterEach(() => {
    sessionStorage.clear();
  });

  function chunkEvent() {
    return {
      exception: {
        values: [
          {
            type: "TypeError",
            value:
              "Failed to fetch dynamically imported module: https://mercyblade.com/assets/ChatHub-C7kMnSdL.js",
          },
        ],
      },
      tags: {} as Record<string, string>,
    };
  }

  it("downgrades a recovering chunk-load failure to warning / P3", () => {
    const event = chunkEvent();
    enrichEventTags(event as never);

    expect(event.tags.chunkRecovery).toBe("attempted");
    expect(event.tags.chunkRecoveryAttempts).toBe("1");
    expect(event.tags.priority).toBe("P3");
    expect((event as { level?: string }).level).toBe("warning");
    expect((event as { fingerprint?: string[] }).fingerprint).toEqual([
      "mercyblade",
      "chunk-load",
      "attempted",
    ]);
  });

  it("keeps the post-cache-bust residual at error / P1 so the tail stays visible", () => {
    sessionStorage.setItem("__mb_chunk_eb_reload_once__", "1");
    const event = chunkEvent();
    enrichEventTags(event as never);

    expect(event.tags.chunkRecovery).toBe("exhausted");
    expect(event.tags.chunkRecoveryAttempts).toBe("2");
    expect(event.tags.priority).toBe("P1");
    expect((event as { level?: string }).level).toBe("error");
    expect((event as { fingerprint?: string[] }).fingerprint).toEqual([
      "mercyblade",
      "chunk-load",
      "exhausted",
    ]);
  });

  it("does not touch severity for a normal (non-chunk) error", () => {
    const event = {
      exception: { values: [{ type: "Error", value: "normal app bug" }] },
      tags: {} as Record<string, string>,
    };
    enrichEventTags(event as never);

    expect(event.tags.chunkRecovery).toBeUndefined();
    expect((event as { fingerprint?: string[] }).fingerprint?.[1]).not.toBe(
      "chunk-load",
    );
  });
});
