import { expect, type Page } from "@playwright/test";
import { test } from "./fixtures/test";
import { BASE_URL } from "./fixtures/env";
import { handleAction, type CoreDeps } from "../../supabase/functions/placement-v3-session/core.ts";
import { makeSession, recommendLessons } from "../../supabase/functions/placement-v3-session/persistence.ts";
import type {
  GraderInput,
  OrchestratorResponse,
  PlacementV3Profile,
  PlacementV3Request,
  PlacementV3Response,
  PlacementV3Session,
} from "../../supabase/functions/placement-v3-session/types.ts";

const TEST_USER_ID = "00000000-0000-4000-8000-000000000044";
const ANSWER =
  "I use English for work emails, customer explanations, and travel plans. I want to improve speaking confidence, article control, and final consonants, so I practice with complete sentences every day after work.";

type Stored = {
  sessions: Map<string, PlacementV3Session>;
  responses: Map<string, PlacementV3Response[]>;
  profiles: Map<string, PlacementV3Profile>;
  failures: string[];
};

const flows = [
  "baseline",
  "resume",
  "abandon",
  "duplicate",
  "retry",
  "refresh",
  "delayed",
  "fallback",
  "recommendation",
  "timeout",
] as const;

test.describe("placement v3 endurance browser flows", () => {
  for (const flow of flows) {
    test(`endurance flow: ${flow}`, async ({ page }) => {
      const stored = createStored();
      await seedAuthenticatedSession(page);
      await installAuthRoutes(page);
      await installRoute(page, stored);
      await page.goto(`${BASE_URL}/placement`);
      await page.getByRole("button", { name: /Start placement test/i }).click();
      await page.getByRole("button", { name: /adult learner/i }).click();
      await page.waitForURL(/\/placement\/test\//);

      if (flow === "abandon") {
        await page.getByRole("button", { name: /Leave test/i }).click();
        await page.getByRole("button", { name: /^Leave/i }).last().click();
        await expect(page).toHaveURL(/\/$/);
        expect([...stored.sessions.values()].some((s) => s.flow_state === "abandoned")).toBe(true);
        return;
      }

      for (let i = 0; i < 12; i += 1) {
        if (flow === "refresh" && i === 2) await page.reload();
        if (await page.getByText(/Overall level/i).isVisible().catch(() => false)) break;
        await answer(page);
        const submit = page.getByRole("button", { name: /Submit answer/i });
        const enabled = await submit.isEnabled().catch(() => false);
        if (!enabled && await page.getByText(/Overall level/i).isVisible().catch(() => false)) break;
        await expect(submit).toBeEnabled({ timeout: 5_000 });
        await submit.click();
        if (flow === "duplicate" && i === 0) {
          await page.goBack().catch(() => undefined);
          await page.goForward().catch(() => undefined);
        }
        if (await page.getByText(/Overall level/i).isVisible().catch(() => false)) break;
        await page.waitForTimeout(flow === "delayed" ? 220 : 80);
      }

      await expect(page.getByText(/Overall level/i)).toBeVisible();
      const [session] = [...stored.sessions.values()];
      expect(session.flow_state).toBe("completed");
      expect(stored.responses.get(session.id)?.length).toBeGreaterThanOrEqual(5);
    });
  }
});

async function seedAuthenticatedSession(page: Page) {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      "mb-supabase-auth-placeholder.invalid.supabase.co",
      JSON.stringify({
        access_token: "placement-v3-endurance-token",
        refresh_token: "placement-v3-refresh-token",
        token_type: "bearer",
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        user: { id: "00000000-0000-4000-8000-000000000044", aud: "authenticated", role: "authenticated" },
      }),
    );
  });
}

async function installAuthRoutes(page: Page) {
  await page.route("**/auth/v1/**", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        id: TEST_USER_ID,
        aud: "authenticated",
        role: "authenticated",
        email: "placement-v3-endurance@mercyblade.test",
      }),
    });
  });
}

async function installRoute(page: Page, stored: Stored) {
  const deps = depsFor(stored);
  await page.route("**/functions/v1/placement-v3-session", async (route) => {
    const request = route.request().postDataJSON() as PlacementV3Request;
    const result = await handleAction({ userId: TEST_USER_ID, request, deps });
    if (!result.ok && request.action === "resume" && result.error === "session_not_found") {
      await route.fulfill({ contentType: "application/json", body: JSON.stringify({ type: "no_session" }) });
      return;
    }
    await route.fulfill({
      status: result.ok ? 200 : result.status,
      contentType: "application/json",
      body: JSON.stringify(publicResult(result)),
    });
  });
}

function depsFor(stored: Stored): CoreDeps {
  let id = 1;
  return {
    now: () => new Date(Date.UTC(2026, 4, 20, 14, id, 0)).toISOString(),
    newId: () => `e2e-endurance-${id++}`,
    loadLatestInProgress: async (userId) =>
      [...stored.sessions.values()].find((s) => s.user_id === userId && s.flow_state === "in_progress") ?? null,
    loadSession: async (sessionId, userId) => {
      const session = stored.sessions.get(sessionId);
      return session?.user_id === userId ? session : null;
    },
    loadResponses: async (sessionId) => stored.responses.get(sessionId) ?? [],
    loadCurrentProfile: async (sessionId, userId) => {
      const profile = stored.profiles.get(sessionId);
      return profile?.user_id === userId ? profile : null;
    },
    createSession: async (input) => {
      const session = makeSession({
        id: input.id ?? `e2e-endurance-${id++}`,
        userId: input.userId,
        now: input.now,
        prompt: input.firstPrompt,
        languagePair: input.languagePair,
      });
      stored.sessions.set(session.id, { ...session, total_tasks: input.totalTasks });
      stored.responses.set(session.id, []);
      return stored.sessions.get(session.id) ?? session;
    },
    updateSession: async (session) => {
      stored.sessions.set(session.id, session);
      return session;
    },
    insertResponse: async (response) => {
      const saved = { ...response, id: response.id ?? `response-${id++}` };
      stored.responses.set(response.session_id, [...(stored.responses.get(response.session_id) ?? []), saved]);
      return saved;
    },
    markProfilesNotCurrent: async (userId) => {
      for (const [key, profile] of stored.profiles) {
        if (profile.user_id === userId) stored.profiles.set(key, { ...profile, is_current: false });
      }
    },
    upsertProfile: async (profile) => {
      const saved = { ...profile, id: profile.id ?? `profile-${id++}` };
      stored.profiles.set(profile.session_id, saved);
      return saved;
    },
    grade: async (input) => ({ ok: true, assessment: assessment(input), version: "e2e-endurance" }),
    recommendLessons: async (profile) => recommendLessons(profile),
  };
}

function publicResult(result: OrchestratorResponse): unknown {
  if (!result.ok) return result;
  const progress = {
    current: result.session.current_task_index,
    total: result.session.total_tasks ?? 0,
    state: result.session.flow_state,
  };
  if (result.action === "start") {
    return { sessionId: result.session.id, currentTask: result.prompt, totalTasks: result.session.total_tasks ?? 0, progress };
  }
  if (result.action === "respond") {
    if (result.profile) return { type: "session_complete", profile: result.profile, recommendations: result.profile.recommended_lessons };
    return { type: "next_task", currentTask: result.prompt, progress };
  }
  if (result.action === "abandon") return { status: "abandoned" };
  if (result.action === "resume") return { type: "resumed", sessionId: result.session.id, currentTask: result.prompt, progress };
  return { sessionState: result.session.flow_state, currentTask: result.prompt, progress, profile: result.profile };
}

function assessment(input: GraderInput) {
  return {
    overallLevel: input.modality === "reading" ? "A2" as const : "B1" as const,
    confidence: 0.76,
    strengths: ["Enough evidence for endurance E2E."],
    gaps: [],
    l1InterferenceFlags: [],
    metadata: { endurance: true },
  };
}

async function answer(page: Page) {
  await page.locator("textarea, input[placeholder*='Short answer'], [role='radio']").first().waitFor({ state: "visible" });
  const filled = await page.evaluate((value) => {
    const fields = [...document.querySelectorAll("main textarea, main input[placeholder*='Short answer']")]
      .filter((node) => (node as HTMLElement).getBoundingClientRect().height > 0);
    if (fields.length === 0) return false;
    const el = fields.at(-1) as HTMLInputElement | HTMLTextAreaElement;
    const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, "value")?.set?.call(el, value);
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  }, ANSWER);
  if (!filled) await page.getByRole("radio").first().click();
}

function createStored(): Stored {
  return {
    sessions: new Map(),
    responses: new Map(),
    profiles: new Map(),
    failures: [],
  };
}
