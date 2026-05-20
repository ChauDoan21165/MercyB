import { vi } from "vitest";
import { handleAction } from "../core.ts";
import { stubGrade } from "../graderClient.ts";
import { makeSession } from "../persistence.ts";
import { recommendLessonsStub } from "../scoring.ts";
import type {
  CoreDeps,
} from "../core.ts";
import type {
  GraderInput,
  GraderResult,
  PlacementV3Profile,
  PlacementV3Request,
  PlacementV3Response,
  PlacementV3Session,
} from "../types.ts";

export function createHarness(options: {
  now?: string;
  grade?: (input: GraderInput) => Promise<GraderResult>;
} = {}) {
  const sessions = new Map<string, PlacementV3Session>();
  const responses = new Map<string, PlacementV3Response[]>();
  const profiles = new Map<string, PlacementV3Profile>();
  let id = 1;
  const now = vi.fn(() => options.now ?? "2026-05-20T12:00:00.000Z");
  const deps: CoreDeps = {
    now,
    newId: () => `id-${id++}`,
    loadLatestInProgress: async (userId) =>
      [...sessions.values()]
        .filter((s) => s.user_id === userId && s.flow_state === "in_progress")
        .sort((a, b) => b.updated_at.localeCompare(a.updated_at))[0] ?? null,
    loadSession: async (sessionId, userId) => {
      const s = sessions.get(sessionId);
      return s?.user_id === userId ? s : null;
    },
    loadResponses: async (sessionId) => responses.get(sessionId) ?? [],
    loadCurrentProfile: async (sessionId, userId) => {
      const p = profiles.get(sessionId);
      return p?.user_id === userId ? p : null;
    },
    createSession: async (input) => {
      const session = makeSession({
        id: input.id ?? `id-${id++}`,
        userId: input.userId,
        now: input.now,
        prompt: input.firstPrompt,
        languagePair: input.languagePair,
      });
      sessions.set(session.id, session);
      responses.set(session.id, []);
      return session;
    },
    updateSession: async (session) => {
      sessions.set(session.id, session);
      return session;
    },
    insertResponse: async (response) => {
      const saved = { ...response, id: response.id ?? `response-${id++}` };
      responses.set(response.session_id, [
        ...(responses.get(response.session_id) ?? []),
        saved,
      ]);
      return saved;
    },
    markProfilesNotCurrent: async (userId) => {
      for (const [k, p] of profiles) {
        if (p.user_id === userId) profiles.set(k, { ...p, is_current: false });
      }
    },
    upsertProfile: async (profile) => {
      const saved = { ...profile, id: profile.id ?? `profile-${id++}` };
      profiles.set(profile.session_id, saved);
      return saved;
    },
    grade: options.grade ?? stubGrade,
    recommendLessons: async (profile) => recommendLessonsStub(profile),
    log: vi.fn(),
  };
  return {
    deps,
    sessions,
    responses,
    profiles,
    run: (request: PlacementV3Request, userId = "user-1") =>
      handleAction({ userId, request, deps }),
  };
}
