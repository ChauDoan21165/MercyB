/**
 * TIER 3 — Prod Synthetic Learner: journeys (a)–(f) against REAL production.
 *
 * Runs as ONE dedicated synthetic account (never a real learner; excluded from
 * every metric by profiles.is_synthetic — see the migration + guard tests).
 * Read-only except the correction-feedback tap journey (c) requires.
 *
 * Skips (never fails) without PROD_SYNTH_* creds, so CI is green until Chau
 * flips the schedule on with masked CI variables. Selectors are intentionally
 * broad with fallbacks (the prod markup evolves) — a live validation run on the
 * admin host confirms them before the schedule is trusted.
 *
 * Each journey attaches a `journey-result` for syntheticReporter.ts, which
 * writes the artifact and sends the failure-only alert.
 */
import { test, expect, type TestInfo } from "@playwright/test";
import { GoTrueClient } from "@supabase/auth-js";

import { CORRECTION_SOURCE_SYNTHETIC_MARKER_KEY } from "../../src/lib/ai-tutor/correctionSourceSyntheticMarker";
import {
  SYNTH_BASE_URL,
  SYNTH_EMAIL,
  SYNTH_PASSWORD,
  SYNTH_SUPABASE_URL,
  SYNTH_SUPABASE_ANON_KEY,
  hasSyntheticCreds,
  redact,
} from "./env";
import { isDeployShaAcceptable } from "./expectedDeploy";
import type { JourneyResult } from "./report";
import {
  selectSeededCorrectionProbes,
  type SeededCorrectionProbe,
} from "./seededCorrectionProbes";

test.describe.configure({ mode: "default", timeout: 90_000 });
test.skip(
  !hasSyntheticCreds(),
  "PROD_SYNTH_* creds absent — the synthetic learner runs only on the admin-host runner.",
);

const FEEDBACK_TABLE = "learning_events";
const SINK_WAIT_MS = 60_000; // journey (d) budget
const DEFER_NOTICE_TITLE = "Đã ghi nhận · Noted";

function projectRef(url: string): string {
  return new URL(url).host.split(".")[0];
}

async function attach(testInfo: TestInfo, r: JourneyResult): Promise<void> {
  await testInfo.attach("journey-result", {
    body: JSON.stringify(r),
    contentType: "application/json",
  });
}

async function pinSyntheticLessonState(page: import("@playwright/test").Page): Promise<void> {
  await page.route("**/rest/v1/conversation_events?**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      headers: { "content-range": "0-0/0" },
      body: "[]",
    });
  });
  await page.route("**/rest/v1/conversations?**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      headers: { "content-range": "0-0/0" },
      body: route.request().method() === "HEAD" ? "" : "[]",
    });
  });
}

function expectsImmediateCorrection(probe: SeededCorrectionProbe): boolean {
  return probe.expectedProductPath === "immediate_correction";
}

function expectedShadowAction(probe: SeededCorrectionProbe): "correct_now" | "defer_to_recap" {
  return probe.expectedShadowPath === "target_form_correct_now" ? "correct_now" : "defer_to_recap";
}

function orderedCorrectionProbes(
  probes: readonly SeededCorrectionProbe[],
  feedbackProbe: SeededCorrectionProbe,
): readonly SeededCorrectionProbe[] {
  return [...probes.filter((probe) => probe.id !== feedbackProbe.id), feedbackProbe];
}

async function assertSyntheticMarkerOnCurrentOrigin(
  page: import("@playwright/test").Page,
): Promise<void> {
  const marker = await page.evaluate((key) => {
    window.localStorage.setItem(key, "1");
    return window.localStorage.getItem(key);
  }, CORRECTION_SOURCE_SYNTHETIC_MARKER_KEY);
  expect(marker).toBe("1");
}

async function submitCorrectionProbe(
  page: import("@playwright/test").Page,
  probe: SeededCorrectionProbe,
): Promise<void> {
  await page.goto(`${SYNTH_BASE_URL}/ai-tutor`, { waitUntil: "networkidle" });
  await assertSyntheticMarkerOnCurrentOrigin(page);
  const field = page.getByRole("textbox").first();
  await field.click();
  await field.fill(probe.sentence);
  // Grammar submit is <button type="button"> (CorrectionMode.tsx), label
  // ui.submit = "Sửa câu này" (vi) / "Correct my sentence" (en). Match the FULL
  // submit label — NOT the bare "Sửa câu", which also names the mode-switcher
  // TAB (already active on this surface).
  await page.getByRole("button", { name: /Sửa câu này|Correct my sentence/i }).first().click();
}

async function readLatestShadowDecision(
  page: import("@playwright/test").Page,
  accessToken: string,
  probe: SeededCorrectionProbe,
  since: Date,
): Promise<string> {
  const base = SYNTH_SUPABASE_URL.replace(/\/$/, "");
  const params = new URLSearchParams({
    select: "event_type,rule_or_detector_id,payload,created_at",
    event_type: "eq.lpi_policy_decision",
    rule_or_detector_id: `eq.${probe.expectedDetector}`,
    created_at: `gte.${since.toISOString()}`,
    order: "created_at.desc",
    limit: "1",
  });
  const resp = await page.request.get(`${base}/rest/v1/${FEEDBACK_TABLE}?${params.toString()}`, {
    headers: { apikey: SYNTH_SUPABASE_ANON_KEY, Authorization: `Bearer ${accessToken}` },
    timeout: 15_000,
  });
  if (!resp.ok()) return `shadow_unchecked: rest ${resp.status()}`;
  const rows = (await resp.json()) as Array<{ payload?: { action?: string; reason?: string } | null }>;
  const row = rows[0];
  if (!row) return `shadow_missing: expected ${expectedShadowAction(probe)}`;
  return `shadow=${row.payload?.action ?? "unknown"} reason=${row.payload?.reason ?? "unknown"} expected=${expectedShadowAction(probe)}`;
}

/**
 * Authenticate via the Supabase auth API (NOT the sign-in UI) and inject the
 * session into the browser context the way supabase-js persists it, BEFORE
 * navigation, so the page loads already authenticated.
 *
 * APPROACH CHANGE (run #8): the synthetic learner no longer drives the /signin
 * UI — that flaked on the form-click dance across four runner hosts (arm64 Air,
 * amd64 macbook, admin frozen-chromium). The UI login has its own manual/canary
 * coverage; the synthetic learner tests what we actually care about — that a
 * valid credential yields a working authed session and the feedback row lands.
 *
 * We sign in with supabase-js itself (a memory storage adapter + the app's
 * storageKey), so the injected localStorage blob is byte-exact for what the app
 * reads on load — no hand-rolled session shape. Throws on a non-2xx auth
 * response (bad creds / rate-limit) — a REAL signal, never papered over.
 */
async function seedSession(
  context: import("@playwright/test").BrowserContext,
): Promise<{ accessToken: string }> {
  const key = `mb-supabase-auth-${projectRef(SYNTH_SUPABASE_URL)}`;
  const captured: Record<string, string> = {};
  const memory = {
    getItem: (k: string) => (k in captured ? captured[k] : null),
    setItem: (k: string, v: string) => { captured[k] = v; },
    removeItem: (k: string) => { delete captured[k]; },
  };
  // GoTrueClient (auth-only) — NOT the full supabase-js createClient, which
  // requires a native WebSocket for realtime and THROWS at construction on the
  // shell runner's Node < 22. GoTrueClient persists the exact
  // `{ currentSession, expiresAt }` blob the app reads on load.
  const auth = new GoTrueClient({
    url: `${SYNTH_SUPABASE_URL.replace(/\/$/, "")}/auth/v1`,
    headers: { apikey: SYNTH_SUPABASE_ANON_KEY },
    storage: memory,
    storageKey: key,
    persistSession: true,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  });
  const { data, error } = await auth.signInWithPassword({
    email: SYNTH_EMAIL,
    password: SYNTH_PASSWORD,
  });
  if (error || !data.session) {
    const status = (error as { status?: number } | null)?.status ?? "?";
    // Real signal (bad creds / rate-limit / other) — surface it, don't paper over.
    throw new Error(`synthetic direct auth failed: status=${status} ${error?.message ?? "no session returned"}`);
  }
  const blob = captured[key];
  if (!blob) throw new Error("GoTrueClient persisted no session blob under the storage key");
  await context.addInitScript(
    ([k, v, pairKey, pairVal, nativeKey, nativeVal, syntheticMarkerKey]) => {
      window.localStorage.setItem(k, v);
      // The synthetic account authenticates via API injection and never runs the
      // /ai-tutor language picker, so it has no stored pair. Bare /ai-tutor gates
      // on that (AiTutor.tsx: `if (!hasUrlPair && !hasStoredPair)` → "Choose Your
      // Language"), so the correction tutor — and getByRole('textbox') — never
      // mounts and (b) times out. Seed the pair a real onboarded user carries
      // (readAnonymousPair shape {native, targets[]} + the nativeLang mirror).
      window.localStorage.setItem(pairKey, pairVal);
      window.localStorage.setItem(nativeKey, nativeVal);
      window.localStorage.setItem(syntheticMarkerKey, "1");
    },
    [
      key,
      blob,
      "mercyblade.languagePair",
      JSON.stringify({ native: "vi", targets: ["en"] }),
      "mercyblade.nativeLang",
      "vi",
      CORRECTION_SOURCE_SYNTHETIC_MARKER_KEY,
    ] as const,
  );
  return { accessToken: data.session.access_token };
}

// ── (a) sign-in completes without a redirect bounce ──────────────────────────
test("(a) valid credential yields a working authed session (no bounce)", async ({ page, context }, testInfo) => {
  const t0 = Date.now();
  let ok = false;
  let detail = "";
  try {
    // Authenticate via the Supabase auth API and inject the real session BEFORE
    // navigating (see seedSession). No UI login — that flaked across four hosts
    // and has its own manual/canary coverage. This tests what matters: a valid
    // credential yields a working authed session that is NOT bounced to /signin.
    await seedSession(context);
    // A protected/authed surface must be reachable with the injected session.
    await page.goto(`${SYNTH_BASE_URL}/ai-tutor`, { waitUntil: "networkidle" });
    const landed = new URL(page.url()).pathname;
    ok = !/\/(signin|login)/.test(landed);
    detail = ok
      ? `authed surface reachable: ${landed}`
      : `BOUNCED to ${landed} despite a valid injected session — app-side redirect signal`;
  } catch (e) {
    // A throw here is the direct-auth failure (bad creds / rate-limit) — a real signal.
    detail = redact(`error: ${(e as Error).message}`);
  }
  await attach(testInfo, { id: "a", name: "valid credential yields authed session (no bounce)", ok, detail, ms: Date.now() - t0 });
  expect(ok, detail).toBeTruthy();
});

// ── (b) correction renders · (c) label shows · (d) row lands in learning_events ─
test("(b/c/d) correction → feedback tap → row lands with rule_or_detector_id", async ({ page, context }, testInfo) => {
  const { accessToken } = await seedSession(context);
  const seededProbes = selectSeededCorrectionProbes();
  const feedbackProbe = seededProbes.find(expectsImmediateCorrection);
  await pinSyntheticLessonState(page);

  // (b) submit seeded-error sentences in grammar mode. The seed contract tracks
  // the product path, not just LPI shadow telemetry:
  // - immediate_correction: correction card + feedback buttons
  // - legacy_timing_defer: true UI defer notice, no feedback buttons
  // - lpi_shadow_defer: correction card + feedback buttons; shadow defer is
  //   telemetry only while VITE_LPI_POLICY_MODE=shadow.
  const tB = Date.now();
  let bOk = false, bDetail = "";
  let feedbackReady = false;
  const details: string[] = [];
  const failures: string[] = [];
  if (!feedbackProbe) {
    failures.push("seed rotation has no immediate-correction probe");
  } else {
    for (const probe of orderedCorrectionProbes(seededProbes, feedbackProbe)) {
      const submittedAt = new Date();
      try {
        await submitCorrectionProbe(page, probe);

        if (probe.expectedProductPath === "legacy_timing_defer") {
          await expect(page.getByText(DEFER_NOTICE_TITLE, { exact: true })).toBeVisible({ timeout: 30_000 });
          await expect(page.getByTestId("correction-feedback-helpful")).toHaveCount(0);
          details.push(
            `${probe.id}: legacy timing defer notice rendered; no correction feedback expected; expectedDetector=${probe.expectedDetector}`,
          );
          continue;
        }

        // The correction is "rendered" iff the feedback buttons mount (they only
        // render for a correction that carries a real rule_or_detector_id).
        await expect(page.getByTestId("correction-feedback-helpful")).toBeVisible({ timeout: 30_000 });
        const shadowDecision = probe.expectedProductPath === "lpi_shadow_defer"
          ? await readLatestShadowDecision(page, accessToken, probe, submittedAt)
            .catch((e) => `shadow_unchecked: ${redact((e as Error).message)}`)
          : "shadow_not_checked";
        details.push(
          `${probe.id}: correction rendered with feedback buttons; productPath=${probe.expectedProductPath}; expectedDetector=${probe.expectedDetector}; expectedShadowPath=${probe.expectedShadowPath}; ${shadowDecision}`,
        );
        if (probe.id === feedbackProbe.id) feedbackReady = true;
      } catch (e) {
        failures.push(`${probe.id}: ${redact((e as Error).message)}`);
      }
    }
  }
  bOk = failures.length === 0 && feedbackReady;
  bDetail = [...details, ...failures.map((failure) => `FAIL ${failure}`)].join(" | ");
  await attach(testInfo, { id: "b", name: "Sửa câu renders a correction", ok: bOk, detail: bDetail, ms: Date.now() - tB });

  // (c) tap helpful → visible "✓ Đã ghi nhận · Recorded".
  const tC = Date.now();
  let cOk = false, cDetail = "";
  const tapAt = new Date();
  if (feedbackReady) {
    try {
      await page.getByTestId("correction-feedback-helpful").click();
      await expect(page.getByTestId("correction-feedback-thanks")).toBeVisible({ timeout: 10_000 });
      cOk = true;
      cDetail = `Đã ghi nhận label visible; seed=${feedbackProbe?.id ?? "unknown"}`;
    } catch (e) {
      cDetail = redact(`no ack label: ${(e as Error).message}`);
    }
  } else {
    cDetail = "blocked by (b)";
  }
  await attach(testInfo, { id: "c", name: "feedback tap shows Đã ghi nhận", ok: cOk, detail: cDetail, ms: Date.now() - tC });

  // (d) the row must land in learning_events within 60s, non-null rule_or_detector_id.
  // Read as the synthetic account itself (RLS select_own) — no service key.
  const tD = Date.now();
  let dOk = false, dDetail = "";
  if (cOk) {
    // Read as the synthetic account itself (RLS select_own) via a RAW PostgREST
    // fetch with the session's access token — NOT the full supabase-js client
    // (WebSocket/Node<22 hazard on the shell runner). No service key.
    const base = SYNTH_SUPABASE_URL.replace(/\/$/, "");
    const params = new URLSearchParams({
      select: "id,event_type,rule_or_detector_id,created_at",
      event_type: "in.(feedback_helpful,feedback_not_helpful)",
      rule_or_detector_id: "not.is.null",
      created_at: `gte.${tapAt.toISOString()}`,
      order: "created_at.desc",
      limit: "1",
    });
    const url = `${base}/rest/v1/${FEEDBACK_TABLE}?${params.toString()}`;
    const headers = { apikey: SYNTH_SUPABASE_ANON_KEY, Authorization: `Bearer ${accessToken}` };
    try {
      const deadline = Date.now() + SINK_WAIT_MS;
      while (Date.now() < deadline) {
        const resp = await page.request.get(url, { headers, timeout: 15_000 });
        if (!resp.ok()) throw new Error(`rest ${resp.status()}: ${(await resp.text()).slice(0, 120)}`);
        const rows = (await resp.json()) as Array<{ id: string; rule_or_detector_id: string }>;
        if (rows.length) {
          dOk = true;
          dDetail = `row ${rows[0].id} rule=${rows[0].rule_or_detector_id}; seed=${feedbackProbe?.id ?? "unknown"}`;
          break;
        }
        await new Promise((r) => setTimeout(r, 3_000));
      }
      if (!dOk) dDetail = `NO row within ${SINK_WAIT_MS / 1000}s (sink flag off? — the today-bug signature)`;
    } catch (e) {
      dDetail = redact(`db read failed: ${(e as Error).message}`);
    }
  } else {
    dDetail = "blocked by (c)";
  }
  await attach(testInfo, { id: "d", name: "feedback row lands in learning_events ≤60s", ok: dOk, detail: dDetail, ms: Date.now() - tD });

  expect(bOk && cOk && dOk, `b=${bDetail} | c=${cDetail} | d=${dDetail}`).toBeTruthy();
});

// ── (e) placement-v3-session returns (never net::ERR_FAILED) ──────────────────
test("(e) placement-v3-session returns without ERR_FAILED", async ({ request }, testInfo) => {
  const t0 = Date.now();
  let ok = false, detail = "";
  try {
    const tok = await request.post(`${SYNTH_SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      headers: { apikey: SYNTH_SUPABASE_ANON_KEY, "Content-Type": "application/json" },
      data: { email: SYNTH_EMAIL, password: SYNTH_PASSWORD },
    });
    const access = (await tok.json())?.access_token as string | undefined;
    if (!access) throw new Error("no access token for placement call");
    // A received HTTP response — any status — means the gateway did NOT drop the
    // request (the ERR_FAILED cold-start signature is a thrown/failed request).
    const resp = await request.post(`${SYNTH_SUPABASE_URL}/functions/v1/placement-v3-session`, {
      headers: { apikey: SYNTH_SUPABASE_ANON_KEY, Authorization: `Bearer ${access}`, "Content-Type": "application/json" },
      data: { action: "start", languagePair: { native: "vi", target: "en" }, initialLevel: "A2" },
      timeout: 30_000,
    });
    ok = true; // no throw ⇒ a response was received
    detail = `responded ${resp.status()} in ${Date.now() - t0}ms`;
  } catch (e) {
    detail = redact(`ERR_FAILED / no response: ${(e as Error).message}`);
  }
  await attach(testInfo, { id: "e", name: "placement-v3-session returns (no ERR_FAILED)", ok, detail, ms: Date.now() - t0 });
  expect(ok, detail).toBeTruthy();
});

// ── (f) version endpoint matches expected deploy ─────────────────────────────
test("(f) version.json matches expected deploy sha", async ({ request }, testInfo) => {
  const t0 = Date.now();
  let ok = false, detail = "";
  try {
    const v = await (await request.get(`${SYNTH_BASE_URL}/version.json`, { timeout: 15_000 })).json();
    const live = String(v.hash ?? "");
    // Deploy-lag tolerant: live must equal CI_COMMIT_SHA or be an ancestor of it
    // on origin/main (Cloudflare auto-deploy can lag/lead the "latest green"
    // resolver). Fails only if live is not an ancestor (rollback/foreign build).
    const verdict = await isDeployShaAcceptable(request, live);
    ok = verdict.ok;
    detail = verdict.reason;
  } catch (e) {
    detail = redact(`version check failed: ${(e as Error).message}`);
  }
  await attach(testInfo, { id: "f", name: "version matches expected deploy", ok, detail, ms: Date.now() - t0 });
  expect(ok, detail).toBeTruthy();
});
