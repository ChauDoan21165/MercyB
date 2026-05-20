import { expect, type Page } from "@playwright/test";
import { test } from "./fixtures/test";
import { BASE_URL } from "./fixtures/env";
import {
  assertPlacementV3RouteEnabled,
  capturePlacementV3Diagnostics,
  placementTaskReady,
  retryWithTrace,
  routeSettled,
  stableInputFill,
  trackPendingNetworkRequests,
  waitForEnabledSubmit,
} from "./utils/stability";
import { handleAction, type CoreDeps } from "../../supabase/functions/placement-v3-session/core.ts";
import { createHttpWritingGrader } from "../../supabase/functions/placement-v3-session/graderClient.ts";
import { makeSession, recommendLessons } from "../../supabase/functions/placement-v3-session/persistence.ts";
import type {
  GraderInput,
  OrchestratorResponse,
  PlacementV3Profile,
  PlacementV3Request,
  PlacementV3Response,
  PlacementV3Session,
  Recommendation,
} from "../../supabase/functions/placement-v3-session/types.ts";
import { gradeWritingSample } from "../../supabase/functions/placement-v3-grade-writing/core.ts";
import { CEFRSubskill } from "../../supabase/functions/_shared/cefr/types.ts";
import { gradeConversation } from "../../supabase/functions/placement-v3-mercy-conversation/conversationGrader.ts";

const TEST_USER_ID = "00000000-0000-4000-8000-000000000033";
const TEST_TOKEN = "placement-v3-e2e-token";
const LONG_PLACEMENT_ANSWER =
  "I use English at work when I write emails, explain problems, and speak with customers from other countries. Yesterday I practiced after work at a coffee shop near my office. I still make mistakes with articles, verb tense, and final sounds, but I can explain my goal clearly, give examples, and keep answering follow-up questions with enough detail.";

type Stored = {
  sessions: Map<string, PlacementV3Session>;
  responses: Map<string, PlacementV3Response[]>;
  profiles: Map<string, PlacementV3Profile>;
  graderCalls: string[];
  recommenderCalls: number;
};

test.describe("placement v3 end-to-end vertical", () => {
  test("runs UI client, session orchestrator, graders, recommender, results, and persistence", async ({ page }, testInfo) => {
    const networkTracker = trackPendingNetworkRequests(page);
    const stored = createStored();
    const retryLog: string[] = [];
    try {
      await seedAuthenticatedSession(page);
      await installAuthRoutes(page);
      await installOrchestratorRoute(page, stored);

      await page.goto(`${BASE_URL}/placement`);
      await assertPlacementV3RouteEnabled(page);
      await expect(page.getByText(/Let's find where you should start/i)).toBeVisible();
      await page.getByRole("button", { name: /Start placement test/i }).click();
      await page.getByRole("button", { name: /adult learner/i }).click();
      await routeSettled(page, /\/placement\/test\//);
      await placementTaskReady(page);
      await expect(page.getByLabel(/Writing answer/i)).toBeVisible();

      for (let i = 0; i < 11; i += 1) {
        if (await page.getByText(/Overall level/i).isVisible().catch(() => false)) break;
        await answerCurrentTask(page);
        const submit = await waitForEnabledSubmit(page);
        await retryWithTrace(
          `placement-v3-submit-${i + 1}`,
          2,
          async () => {
            await submit.click();
            await page.waitForTimeout(350);
          },
          (message) => retryLog.push(message),
        );
      }

      await expect(page.getByText(/Overall level/i)).toBeVisible();
      await expect(page.getByText(/^Writing$/i).first()).toBeVisible();
      await expect(page.getByText(/^Speaking$/i).first()).toBeVisible();
      await expect(page.getByText(/^Reading$/i).first()).toBeVisible();
      await expect(page.getByText(/^Listening$/i).first()).toBeVisible();
      await expect(page.getByText(/^Conversation$/i).first()).toBeVisible();
      await expect(page.getByRole("button", { name: /Start this lesson/i }).first()).toBeVisible();

      const [session] = [...stored.sessions.values()];
      expect(session.flow_state).toBe("completed");
      expect(stored.responses.get(session.id)?.length).toBeGreaterThanOrEqual(5);
      expect(stored.profiles.get(session.id)?.recommended_lessons.length).toBeGreaterThan(0);
      expect(stored.graderCalls).toContain("placement-v3-grade-writing");
      expect(stored.graderCalls).toContain("placement-v3-mercy-conversation");
      expect(stored.recommenderCalls).toBeGreaterThan(0);
    } catch (error) {
      await testInfo.attach("b1-placement-v3-retry-log", {
        body: retryLog.join("\n") || "No retry log entries.",
        contentType: "text/plain",
      });
      await capturePlacementV3Diagnostics(page, testInfo, networkTracker.pendingRequests());
      throw error;
    } finally {
      networkTracker.dispose();
    }
  });
});

async function seedAuthenticatedSession(page: Page) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL ?? "https://placeholder.invalid.supabase.co";
  const projectId = deriveProjectId(supabaseUrl);
  const storageKey = `mb-supabase-auth-${projectId}`;
  const now = Math.floor(Date.now() / 1000);
  await page.addInitScript(
    ({ storageKey, now }) => {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify({
          access_token: "placement-v3-e2e-token",
          refresh_token: "placement-v3-refresh-token",
          token_type: "bearer",
          expires_in: 3600,
          expires_at: now + 3600,
          user: {
            id: "00000000-0000-4000-8000-000000000033",
            aud: "authenticated",
            role: "authenticated",
            email: "placement-v3-e2e@mercyblade.test",
            email_confirmed_at: new Date(0).toISOString(),
          },
        }),
      );
    },
    { storageKey, now },
  );
}

async function installAuthRoutes(page: Page) {
  await page.route("**/auth/v1/**", async (route) => {
    const url = route.request().url();
    if (url.includes("/user")) {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          id: TEST_USER_ID,
          aud: "authenticated",
          role: "authenticated",
          email: "placement-v3-e2e@mercyblade.test",
          email_confirmed_at: new Date(0).toISOString(),
        }),
      });
      return;
    }
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        access_token: TEST_TOKEN,
        refresh_token: "placement-v3-refresh-token",
        token_type: "bearer",
        expires_in: 3600,
        user: {
          id: TEST_USER_ID,
          aud: "authenticated",
          role: "authenticated",
          email: "placement-v3-e2e@mercyblade.test",
          email_confirmed_at: new Date(0).toISOString(),
        },
      }),
    });
  });
}

async function installOrchestratorRoute(page: Page, stored: Stored) {
  const deps = createDeps(stored);
  await page.route("**/functions/v1/placement-v3-session", async (route) => {
    const body = route.request().postDataJSON() as PlacementV3Request;
    const result = await handleAction({ userId: TEST_USER_ID, request: body, deps });
    if (!result.ok && body.action === "resume" && result.error === "session_not_found") {
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

function createDeps(stored: Stored): CoreDeps {
  let id = 1;
  const writingGrader = createHttpWritingGrader({
    functionBaseUrl: "https://placement-edge.test/functions/v1",
    serviceRoleKey: "service-role-test",
    fetchImpl: async (input, init) => {
      const url = String(input);
      stored.graderCalls.push(url.includes("placement-v3-mercy-conversation")
        ? "placement-v3-mercy-conversation"
        : "placement-v3-grade-writing");

      if (url.includes("placement-v3-mercy-conversation")) {
        const body = JSON.parse(String(init?.body ?? "{}")) as { transcript?: Parameters<typeof gradeConversation>[0] };
        return jsonResponse({ assessment: gradeConversation(body.transcript ?? []) });
      }

      const body = JSON.parse(String(init?.body ?? "{}")) as {
        promptId: string;
        taskText: string;
        userResponse: string;
        targetLanguage: "en";
        userId?: string;
      };
      const graded = await gradeWritingSample(body, {
        callAi: async () => ({
          ok: true,
          provider: "openai",
          model: "e2e-fixture",
          latencyMs: 240,
          raw: "{}",
          json: writingAiAssessment(),
        }),
      });
      return jsonResponse(graded);
    },
  });

  return {
    now: () => new Date(Date.UTC(2026, 4, 20, 12, id, 0)).toISOString(),
    newId: () => `placement-v3-e2e-${id++}`,
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
        id: input.id ?? `placement-v3-e2e-${id++}`,
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
    grade: async (input) => ({ ok: true, assessment: heuristicAssessment(input), version: "e2e-non-writing-grader" }),
    writingGrader,
    recommendLessons: async (profile) => {
      stored.recommenderCalls += 1;
      return (await recommendLessons(profile)).slice(0, 6).map((lesson, index): Recommendation => ({
        lessonId: lesson.lessonId,
        reason: lesson.reason,
        priority: lesson.priority || 1 - index * 0.1,
      }));
    },
    log: () => undefined,
  };
}

async function answerCurrentTask(page: Page) {
  await page.waitForTimeout(100);
  await placementTaskReady(page);
  const submit = page.getByRole("button", { name: /Submit answer/i });

  const activeTextField = page
    .locator("main textarea, main input[placeholder*='Short answer'], main [role='textbox']")
    .filter({ visible: true })
    .last();

  if (await activeTextField.isVisible().catch(() => false)) {
    await stableInputFill(activeTextField, LONG_PLACEMENT_ANSWER);
    if (await submit.isEnabled().catch(() => false)) {
      return;
    }
  }

  const visibleRadio = page.getByRole("radio").filter({ visible: true }).first();
  if (await visibleRadio.isVisible().catch(() => false)) {
    await visibleRadio.click();
    if (await submit.isEnabled().catch(() => false)) {
      return;
    }
  }

  if (await activeTextField.isVisible().catch(() => false)) {
    await activeTextField.evaluate((node, answer) => {
      const el = node as HTMLInputElement | HTMLTextAreaElement;
      const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      const setter = Object.getOwnPropertyDescriptor(proto, "value")?.set;
      setter?.call(el, answer);
      el.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: answer }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
    }, LONG_PLACEMENT_ANSWER);
    return;
  }

  await visibleRadio.click();
}

function publicResult(result: OrchestratorResponse): unknown {
  if (!result.ok) return result;
  const progress = {
    current: result.session.current_task_index,
    total: result.session.total_tasks ?? 0,
    state: result.session.flow_state,
  };
  if (result.action === "start") {
    return {
      sessionId: result.session.id,
      currentTask: result.prompt,
      totalTasks: result.session.total_tasks ?? 0,
      progress,
      resumed: result.resumed ?? false,
    };
  }
  if (result.action === "respond") {
    if (result.profile) {
      return {
        type: "session_complete",
        profile: result.profile,
        recommendations: result.profile.recommended_lessons,
      };
    }
    return { type: "next_task", currentTask: result.prompt, progress };
  }
  if (result.action === "abandon") return { status: "abandoned" };
  if (result.action === "resume") {
    return {
      type: "resumed",
      sessionId: result.session.id,
      currentTask: result.prompt,
      progress,
    };
  }
  return {
    sessionState: result.session.flow_state,
    currentModality: result.session.current_modality,
    currentTask: result.prompt,
    progress,
    profile: result.profile,
  };
}

function writingAiAssessment() {
  return {
    overall: { level: "B1", confidence: 0.82 },
    subskills: {
      [CEFRSubskill.Grammar]: { level: "B1", confidence: 0.8, notes: "Mostly clear clauses with some article errors." },
      [CEFRSubskill.Vocabulary]: { level: "B1", confidence: 0.84, notes: "Work and learning vocabulary is controlled." },
      [CEFRSubskill.Coherence]: { level: "B1", confidence: 0.82, notes: "Ideas connect clearly." },
      [CEFRSubskill.TaskAchievement]: { level: "B1", confidence: 0.82, notes: "Answers the prompt with relevant detail." },
    },
    strengths: ["Explains goals and work context clearly."],
    gaps: ["Article control is inconsistent."],
    l1InterferenceFlags: [
      { pattern: "article-omission", severity: "med", examples: ["write email"] },
    ],
    recommendedFocusAreas: ["Practice articles in workplace sentences."],
  };
}

function heuristicAssessment(input: GraderInput) {
  const isChoice = /^[a-z]$/i.test(input.responseText.trim());
  return {
    overallLevel: isChoice ? "A2" as const : "B1" as const,
    confidence: isChoice ? 0.45 : 0.76,
    strengths: ["Provides enough language for diagnosis."],
    gaps: input.modality === "speaking" ? ["Final consonants need focused practice."] : [],
    l1InterferenceFlags: input.modality === "speaking"
      ? [{ patternId: "final-consonants", severity: "high" as const, evidence: "Typed transcript references final sounds." }]
      : [],
    metadata: { e2e: true },
  };
}

function jsonResponse(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

function createStored(): Stored {
  return {
    sessions: new Map(),
    responses: new Map(),
    profiles: new Map(),
    graderCalls: [],
    recommenderCalls: 0,
  };
}

function deriveProjectId(urlRaw: string): string {
  try {
    const url = new URL(urlRaw);
    if (url.hostname === "127.0.0.1" || url.hostname === "localhost") {
      return `local-${url.hostname}-${url.port || "80"}`;
    }
    return url.hostname.match(/^([a-z0-9-]+)\.supabase\.co$/i)?.[1] ?? url.hostname;
  } catch {
    return "unknown";
  }
}
