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
import { createClient } from "@supabase/supabase-js";

import {
  SYNTH_BASE_URL,
  SYNTH_EMAIL,
  SYNTH_PASSWORD,
  SYNTH_SUPABASE_URL,
  SYNTH_SUPABASE_ANON_KEY,
  hasSyntheticCreds,
  redact,
} from "./env";
import { resolveExpectedDeploySha } from "./expectedDeploy";
import type { JourneyResult } from "./report";

test.describe.configure({ mode: "default", timeout: 90_000 });
test.skip(
  !hasSyntheticCreds(),
  "PROD_SYNTH_* creds absent — the synthetic learner runs only on the admin-host runner.",
);

const FEEDBACK_TABLE = "learning_events";
const SINK_WAIT_MS = 60_000; // journey (d) budget
const SEEDED_ERROR_SENTENCE = "She go to school every day and she don't likes it.";

function projectRef(url: string): string {
  return new URL(url).host.split(".")[0];
}

async function attach(testInfo: TestInfo, r: JourneyResult): Promise<void> {
  await testInfo.attach("journey-result", {
    body: JSON.stringify(r),
    contentType: "application/json",
  });
}

/** Seed an authenticated browser session without re-driving the UI (journey (a)
 * separately validates the UI sign-in path). Mirrors src/lib/supabaseClient.ts:
 * custom storageKey `mb-supabase-auth-<ref>`. */
async function seedSession(context: import("@playwright/test").BrowserContext): Promise<void> {
  const res = await context.request.post(
    `${SYNTH_SUPABASE_URL}/auth/v1/token?grant_type=password`,
    {
      headers: { apikey: SYNTH_SUPABASE_ANON_KEY, "Content-Type": "application/json" },
      data: { email: SYNTH_EMAIL, password: SYNTH_PASSWORD },
    },
  );
  if (!res.ok()) throw new Error(`synthetic sign-in failed: ${res.status()}`);
  const session = await res.json();
  const key = `mb-supabase-auth-${projectRef(SYNTH_SUPABASE_URL)}`;
  await context.addInitScript(
    ([k, v]) => window.localStorage.setItem(k, v),
    [key, JSON.stringify(session)] as const,
  );
}

// ── (a) sign-in completes without a redirect bounce ──────────────────────────
test("(a) sign-in completes without redirect bounce", async ({ page }, testInfo) => {
  const t0 = Date.now();
  let ok = false;
  let detail = "";
  try {
    await page.goto(`${SYNTH_BASE_URL}/signin`, { waitUntil: "networkidle" });
    const passwordTab = page.getByRole("button", {
      name: /sign in with password|đăng nhập bằng mật khẩu|^sign in$|đăng nhập · sign in/i,
    });
    if (await passwordTab.first().isVisible().catch(() => false)) await passwordTab.first().click();

    await page.locator('input[type="email"], input[name="email"], input[autocomplete="email"]').first().fill(SYNTH_EMAIL);
    await page.locator('input[type="password"], input[autocomplete="current-password"]').first().fill(SYNTH_PASSWORD);
    await Promise.all([
      page.waitForURL((u) => !/\/(signin|login)/.test(new URL(u).pathname), { timeout: 20_000 }).catch(() => {}),
      page.locator('button:has-text(/sign ?in|log ?in|đăng ?nhập/i), button[type="submit"]').first().click(),
    ]);
    const landed = new URL(page.url()).pathname;
    ok = !/\/(signin|login)/.test(landed);
    detail = ok ? `landed on ${landed}` : `BOUNCED back to ${landed}`;
  } catch (e) {
    detail = redact(`error: ${(e as Error).message}`);
  }
  await attach(testInfo, { id: "a", name: "sign-in completes without bounce", ok, detail, ms: Date.now() - t0 });
  expect(ok, detail).toBeTruthy();
});

// ── (b) correction renders · (c) label shows · (d) row lands in learning_events ─
test("(b/c/d) correction → feedback tap → row lands with rule_or_detector_id", async ({ page, context }, testInfo) => {
  await seedSession(context);

  // (b) submit a seeded-error sentence in grammar mode and get a correction.
  const tB = Date.now();
  let bOk = false, bDetail = "";
  try {
    await page.goto(`${SYNTH_BASE_URL}/ai-tutor`, { waitUntil: "networkidle" });
    const field = page.getByRole("textbox").first();
    await field.click();
    await field.fill(SEEDED_ERROR_SENTENCE);
    await page.locator('button:has-text(/Sửa câu|Submit|Gửi|Kiểm tra/i), button[type="submit"]').first().click();
    // The correction is "rendered" iff the feedback buttons mount (they only
    // render for a correction that carries a real rule_or_detector_id).
    await expect(page.getByTestId("correction-feedback-helpful")).toBeVisible({ timeout: 30_000 });
    bOk = true;
    bDetail = "correction rendered with feedback buttons";
  } catch (e) {
    bDetail = redact(`no correction/buttons: ${(e as Error).message}`);
  }
  await attach(testInfo, { id: "b", name: "Sửa câu renders a correction", ok: bOk, detail: bDetail, ms: Date.now() - tB });

  // (c) tap helpful → visible "✓ Đã ghi nhận · Recorded".
  const tC = Date.now();
  let cOk = false, cDetail = "";
  const tapAt = new Date();
  if (bOk) {
    try {
      await page.getByTestId("correction-feedback-helpful").click();
      await expect(page.getByTestId("correction-feedback-thanks")).toBeVisible({ timeout: 10_000 });
      cOk = true;
      cDetail = "Đã ghi nhận label visible";
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
    const supabase = createClient(SYNTH_SUPABASE_URL, SYNTH_SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    try {
      const { error: signInErr } = await supabase.auth.signInWithPassword({ email: SYNTH_EMAIL, password: SYNTH_PASSWORD });
      if (signInErr) throw signInErr;
      const deadline = Date.now() + SINK_WAIT_MS;
      while (Date.now() < deadline) {
        const { data, error } = await supabase
          .from(FEEDBACK_TABLE)
          .select("id, event_type, rule_or_detector_id, created_at")
          .in("event_type", ["feedback_helpful", "feedback_not_helpful"])
          .not("rule_or_detector_id", "is", null)
          .gte("created_at", tapAt.toISOString())
          .order("created_at", { ascending: false })
          .limit(1);
        if (error) throw error;
        if (data && data.length) { dOk = true; dDetail = `row ${data[0].id} rule=${data[0].rule_or_detector_id}`; break; }
        await new Promise((r) => setTimeout(r, 3_000));
      }
      if (!dOk) dDetail = `NO row within ${SINK_WAIT_MS / 1000}s (sink flag off? — the today-bug signature)`;
    } catch (e) {
      dDetail = redact(`db read failed: ${(e as Error).message}`);
    } finally {
      await supabase.auth.signOut().catch(() => {});
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
    const expected = await resolveExpectedDeploySha(request);
    const v = await (await request.get(`${SYNTH_BASE_URL}/version.json`, { timeout: 15_000 })).json();
    const live = String(v.hash ?? "");
    ok = Boolean(expected) && (live === expected || expected.startsWith(live) || live.startsWith(expected));
    detail = `live=${live} expected=${expected || "(unresolved)"}`;
  } catch (e) {
    detail = redact(`version check failed: ${(e as Error).message}`);
  }
  await attach(testInfo, { id: "f", name: "version matches expected deploy", ok, detail, ms: Date.now() - t0 });
  expect(ok, detail).toBeTruthy();
});
