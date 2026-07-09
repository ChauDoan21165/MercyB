/**
 * PROD SMOKE — "imitation user" placement tripwire.
 *
 * WHY THIS EXISTS
 * ---------------
 * The pre-existing placement E2E specs (tests/e2e/placement-v3.spec.ts) drive
 * the CLIENT STUB: they seed `mb.placement.v3.stub.session` in localStorage and
 * assert on the stub's synchronous output. The stub can never hang and never
 * loads real audio, so those tests were structurally incapable of catching:
 *   (a) the listening audio failing to load (0:00 / stuck "Loading audio…"), and
 *   (b) the results screen spinning on "Loading your results" forever.
 * tests/golden-flows/prod-golden-flows.pw.ts hits real prod, but only via API
 * requests — it never renders the placement UI, so it misses both too.
 *
 * This test imitates a real user against REAL production with NO mocks:
 * start a fresh placement, answer every item via TEXT (bypassing the mic),
 * submit, and reach the results screen — asserting on the two failure modes
 * above with hard, loud assertions.
 *
 * Run:   npm run test:prod-smoke
 *        PROD_SMOKE_URL=https://mercyblade.com npx playwright test -c playwright.prod-smoke.config.ts
 */
import { test as base, expect, type Page, type TestInfo } from "@playwright/test";

// ── Tunables ────────────────────────────────────────────────────────────────
const RESULTS_TIMEOUT_MS = 30_000; // "Loading your results" must resolve within this
const AUDIO_METADATA_TIMEOUT_MS = 15_000; // <audio> must report duration within this
const MAX_STEPS = 30; // safety bound on the answer loop

// A canned answer long enough to clear the min-length gate on writing tasks
// (TestPage.minAnswerLength → 40 chars for writing).
const CANNED_TEXT =
  "I study English every morning because I want a better job abroad. This month " +
  "I want to improve my speaking and listening so I can talk with customers clearly.";

// Console noise we explicitly tolerate (per brief: the known Sentry-DSN warning).
const KNOWN_CONSOLE_NOISE = [
  /sentry/i,
  /\[vite\]/i,
  /Download the React DevTools/i,
  /favicon/i,
  // Known, non-fatal prod issue surfaced by this smoke (2026-07-09): a Web
  // Worker created from a blob: URL is blocked by the CSP script-src. The
  // placement flow completes despite it. Tolerated here so it does not mask
  // the two target assertions; reported separately for a real fix.
  /Creating a worker from 'blob:.*violates the following Content Security Policy/i,
];

// UI anchors (from src/pages/placement/v3/ResultsPage.tsx + ListeningTaskCard.tsx)
const RESULTS_HEADING = /Here's what we found|Đây là kết quả của bạn/i;
const RESULTS_OVERALL = /Overall level|Trình độ/i;
const RESULTS_LOADING = /Loading your results|Đang tải kết quả/i;
const AUDIO_SELECTOR = 'audio[aria-label="Listening prompt audio"]';
const AUDIO_FALLBACK =
  /Audio is unavailable for this question|Chưa nghe được âm thanh cho câu này/i;

// The "Who is this account for?" step. On real prod the adult path is gated
// behind sign-in ("Sign in to take the test"); anonymous users cannot complete
// the placement. With a canary session the adult card becomes a start button.
const WHO_FOR_HEADING = /Who is this account for\?|Tài khoản này là của ai\?/i;
const SIGNIN_GATE = /Sign in to take the test|Đăng nhập để làm bài test/i;
// Authenticated adult card copy ("Me — an adult learner / Mình — người lớn").
// Deliberately does NOT match the signed-out "Sign in to take the test" card,
// so a not-yet-hydrated session can't send us into the OAuth flow by mistake.
const ADULT_START = /adult learner|người lớn đang học|Start placement/i;

function isKnownNoise(text: string): boolean {
  return KNOWN_CONSOLE_NOISE.some((re) => re.test(text));
}

type Diagnostics = {
  consoleErrors: string[];
  failedResponses: { url: string; status: number }[];
};

// Fixture: wire console/network capture and auto-attach diagnostics on failure,
// so a red result carries screenshot + failing request + console dump.
const test = base.extend<{ diagnostics: Diagnostics }>({
  diagnostics: async ({ page }, use, testInfo) => {
    const diag: Diagnostics = { consoleErrors: [], failedResponses: [] };

    page.on("console", (msg) => {
      if (msg.type() === "error" && !isKnownNoise(msg.text())) {
        diag.consoleErrors.push(msg.text());
      }
    });
    page.on("pageerror", (err) => {
      if (!isKnownNoise(err.message)) diag.consoleErrors.push(`pageerror: ${err.message}`);
    });
    page.on("response", (res) => {
      if (res.status() >= 400) diag.failedResponses.push({ url: res.url(), status: res.status() });
    });

    await use(diag);

    if (testInfo.status !== testInfo.expectedStatus) {
      await attachDiagnostics(page, testInfo, diag, "failure");
    }
  },
});

async function attachDiagnostics(
  page: Page,
  testInfo: TestInfo,
  diag: Diagnostics,
  tag: string,
): Promise<void> {
  await testInfo.attach(`${tag}-failed-requests`, {
    body: JSON.stringify(diag.failedResponses, null, 2),
    contentType: "application/json",
  });
  await testInfo.attach(`${tag}-console-errors`, {
    body: diag.consoleErrors.join("\n") || "(none)",
    contentType: "text/plain",
  });
  const shot = await page.screenshot({ fullPage: true }).catch(() => null);
  if (shot) await testInfo.attach(`${tag}-screenshot`, { body: shot, contentType: "image/png" });
}

/**
 * Optional canary login. The brief allows exactly one prod write — creating the
 * canary's OWN test sessions. If PROD_SMOKE_EMAIL/PASSWORD are set we sign the
 * canary in via the Supabase auth REST endpoint and seed the session before the
 * app boots. Without creds we proceed anonymously (real users can start
 * placement without an account; the two bug asserts do not require auth).
 */
async function maybeLoginCanary(page: Page): Promise<"canary" | "anonymous"> {
  const email = process.env.PROD_SMOKE_EMAIL;
  const password = process.env.PROD_SMOKE_PASSWORD;
  if (!email || !password) return "anonymous";

  const supabaseUrl = (
    process.env.PROD_SMOKE_SUPABASE_URL ?? "https://buemdfxyhxunzpgdoqin.supabase.co"
  ).replace(/\/$/, "");
  const anonKey = process.env.PROD_SMOKE_SUPABASE_ANON_KEY;
  if (!anonKey) {
    throw new Error("PROD_SMOKE_SUPABASE_ANON_KEY is required when canary creds are set.");
  }

  const res = await page.request.post(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    headers: { apikey: anonKey, "Content-Type": "application/json" },
    data: { email, password },
  });
  if (!res.ok()) {
    throw new Error(`Canary login failed: ${res.status()} ${await res.text()}`);
  }
  // The grant response IS the session shape supabase-js persists. The app uses a
  // CUSTOM storage key (src/lib/supabaseClient.ts): `mb-supabase-auth-<projectId>`
  // where projectId is the `<ref>` of `<ref>.supabase.co` — NOT the default
  // `sb-<ref>-auth-token`. Writing the default key silently fails to authenticate.
  const session = await res.json();
  const projectRef = new URL(supabaseUrl).host.split(".")[0];
  const storageKey = `mb-supabase-auth-${projectRef}`;
  const value = JSON.stringify(session);
  await page.addInitScript(
    ([k, v]) => window.localStorage.setItem(k, v),
    [storageKey, value] as const,
  );
  return "canary";
}

async function isOnResults(page: Page): Promise<boolean> {
  return page
    .getByText(RESULTS_HEADING)
    .first()
    .isVisible()
    .catch(() => false);
}

const SUBMIT_LABEL = /Submit answer|Continue|Next|Tiếp tục|Nộp|Gửi/i;

/** Wait for a real answer control (text field or radio) or the results screen. */
async function waitForAnswerable(page: Page): Promise<void> {
  await page
    .waitForFunction(() => {
      const b = document.body.innerText;
      return (
        /Here's what we found|Đây là kết quả/.test(b) ||
        !!document.querySelector("textarea, input, [role=radio]")
      );
    }, undefined, { timeout: 15_000 })
    .catch(() => {});
}

/**
 * Answer whatever task card is on screen, preferring a text answer.
 * Text fields are filled by real typing (pressSequentially) — the app's
 * word-count gate does not register a programmatic value set (`.fill()`),
 * which silently keeps Submit disabled.
 */
async function answerCurrentStep(page: Page): Promise<void> {
  // Who-are-you step: pick the adult path.
  const adult = page.getByRole("button", { name: ADULT_START }).first();
  if ((await adult.count()) && (await adult.isVisible().catch(() => false))) {
    await adult.click();
    return;
  }

  // Prefer a free-text answer (writing / conversation / short answer) — bypasses
  // the mic. getByRole('textbox') covers both <textarea> and <input> (incl.
  // inputs with no explicit type attribute).
  const field = page.getByRole("textbox").first();
  if ((await field.count()) && (await field.isEditable().catch(() => false))) {
    await field.click();
    await field.fill("");
    await field.pressSequentially(CANNED_TEXT, { delay: 2 });
    return;
  }

  // A "Record" gate may hide the transcript field until clicked.
  const record = page.getByRole("button", { name: /Record|Ghi âm/i }).first();
  if ((await record.count()) && (await record.isVisible().catch(() => false))) {
    await record.click();
    const transcript = page.getByRole("textbox").first();
    if ((await transcript.count()) && (await transcript.isEditable().catch(() => false))) {
      await transcript.click();
      await transcript.pressSequentially(CANNED_TEXT, { delay: 2 });
    }
    return;
  }

  // Otherwise a multiple-choice task (listening / reading / feedback): pick one.
  const radios = page.getByRole("radio");
  if (await radios.count()) await radios.first().click();
}

/** Click Submit, then wait out the async "Đang gửi câu trả lời" (submitting…) state. */
async function advanceStep(page: Page): Promise<void> {
  const advance = page.getByRole("button", { name: SUBMIT_LABEL }).first();
  if ((await advance.count()) && (await advance.isEnabled().catch(() => false))) {
    await advance.click().catch(() => {});
    await page
      .waitForFunction(
        () => !/Đang gửi câu trả lời|Submitting/i.test(document.body.innerText),
        undefined,
        { timeout: 25_000 },
      )
      .catch(() => {});
    await page.waitForLoadState("networkidle", { timeout: 10_000 }).catch(() => {});
  }
}

/**
 * HARD ASSERT (audio): the listening prompt must EITHER expose a real
 * duration > 0, OR render the honest "audio unavailable / score excluded"
 * fallback. Failing both means the user is trapped on "Loading audio…" — the
 * 0:00 bug.
 */
async function assertAudioHealthyOrGracefullyDegraded(page: Page): Promise<void> {
  const hasDuration = await page
    .waitForFunction(
      (sel) => {
        const el = document.querySelector(sel) as HTMLAudioElement | null;
        return !!el && Number.isFinite(el.duration) && el.duration > 0;
      },
      AUDIO_SELECTOR,
      { timeout: AUDIO_METADATA_TIMEOUT_MS },
    )
    .then(() => true)
    .catch(() => false);

  if (hasDuration) return; // playable — good.

  const fallback = page.getByText(AUDIO_FALLBACK);
  await expect(
    fallback,
    "AUDIO BUG: the listening prompt exposed no duration > 0 AND showed no " +
      "'audio unavailable / score excluded' fallback — the user is stuck on " +
      "'Loading audio…' (the 0:00 hang).",
  ).toBeVisible({ timeout: 3_000 });
}

/**
 * HARD ASSERT (results): "Loading your results" must resolve to a real results
 * screen within RESULTS_TIMEOUT_MS. A persistent spinner is failed LOUDLY — this
 * is the key regression the whole suite exists for.
 */
async function assertResultsResolve(
  page: Page,
  testInfo: TestInfo,
  diag: Diagnostics,
): Promise<void> {
  try {
    await expect(page.getByText(RESULTS_HEADING).first()).toBeVisible({
      timeout: RESULTS_TIMEOUT_MS,
    });
  } catch {
    const stuck = await page
      .getByText(RESULTS_LOADING)
      .first()
      .isVisible()
      .catch(() => false);
    await attachDiagnostics(page, testInfo, diag, stuck ? "results-hang" : "results-missing");
    throw new Error(
      stuck
        ? `RESULTS HANG: 'Loading your results' never resolved within ${RESULTS_TIMEOUT_MS}ms ` +
          `— the placement is stuck on the infinite spinner.`
        : `RESULTS MISSING: neither a results screen nor the loading spinner was ` +
          `present ${RESULTS_TIMEOUT_MS}ms after the final submit.`,
    );
  }

  // Sanity: an actual CEFR-shaped result rendered, not just the header.
  await expect(page.getByText(RESULTS_OVERALL).first()).toBeVisible({ timeout: 5_000 });
}

test.describe("PROD smoke — imitation user completes a full placement test", () => {
  test("start → answer every item by text → results render; audio + hang asserted", async ({
    page,
    diagnostics,
  }, testInfo) => {
    const authMode = await maybeLoginCanary(page);
    testInfo.annotations.push({ type: "auth", description: authMode });

    // 1. Start a fresh placement (real prod, real pipeline). networkidle so the
    // Supabase session hydrates before we touch the who-for card — clicking
    // before hydration shows the signed-out card and derails into OAuth.
    await page.goto("/placement/who", { waitUntil: "networkidle" });
    await expect(page.getByText(WHO_FOR_HEADING).first()).toBeVisible({ timeout: 20_000 });

    // Auth gate: on prod the adult placement requires sign-in. An anonymous run
    // cannot reach the audio/results flow, so fail with an actionable message
    // rather than a misleading "results missing" 30s later.
    if (authMode === "anonymous") {
      const gated = await page
        .getByText(SIGNIN_GATE)
        .first()
        .isVisible()
        .catch(() => false);
      if (gated) {
        await attachDiagnostics(page, testInfo, diagnostics, "auth-gate");
        throw new Error(
          "AUTH GATE: the adult placement test requires sign-in on this environment " +
            "('Sign in to take the test'). Set PROD_SMOKE_EMAIL / PROD_SMOKE_PASSWORD / " +
            "PROD_SMOKE_SUPABASE_ANON_KEY (canary account) to drive the full audio + results flow.",
        );
      }
    } else {
      // Canary: wait for the authenticated adult card to hydrate before we click,
      // so we never fall through to the signed-out sign-in gate.
      await expect(
        page.getByRole("button", { name: ADULT_START }).first(),
        "authenticated adult card ('Me — an adult learner') did not hydrate — canary session may be invalid.",
      ).toBeVisible({ timeout: 20_000 });
    }

    // 2. Answer every item until the results screen appears.
    let sawListening = false;
    for (let step = 0; step < MAX_STEPS; step++) {
      await waitForAnswerable(page);
      if (await isOnResults(page)) break;

      if (await page.locator(AUDIO_SELECTOR).count()) {
        sawListening = true;
        await assertAudioHealthyOrGracefullyDegraded(page);
      }

      await answerCurrentStep(page);
      await advanceStep(page);
    }

    // 3. The key assertion: results resolve within budget (catches the hang).
    await assertResultsResolve(page, testInfo, diagnostics);

    // 4. No uncaught console errors during the run (Sentry-DSN noise excluded).
    expect(
      diagnostics.consoleErrors,
      `console errors during placement:\n${diagnostics.consoleErrors.join("\n")}`,
    ).toEqual([]);

    if (!sawListening) {
      testInfo.annotations.push({
        type: "note",
        description:
          "No listening task surfaced in this session — the audio assertion was not exercised this run.",
      });
    }
  });
});
