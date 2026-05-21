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
  PlacementV3ResponseWriteResult,
  PlacementV3Session,
} from "../types.ts";

export function createHarness(options: {
  now?: string;
  grade?: (input: GraderInput) => Promise<GraderResult>;
  insertResponseDelayMs?: number;
} = {}) {
  const sessions = new Map<string, PlacementV3Session>();
  const responses = new Map<string, PlacementV3Response[]>();
  const profiles = new Map<string, PlacementV3Profile>();
  const inFlightClaims = new Set<string>();
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
    insertResponse: async (response): Promise<PlacementV3ResponseWriteResult> => {
      const key = `${response.session_id}:${response.task_index}`;
      while (inFlightClaims.has(key)) {
        await new Promise((resolve) => setTimeout(resolve, 1));
      }
      const existing = (responses.get(response.session_id) ?? []).find(
        (row) => row.task_index === response.task_index,
      );
      if (existing) {
        return { response: existing, inserted: false };
      }
      inFlightClaims.add(key);
      try {
        if (options.insertResponseDelayMs) {
          await new Promise((resolve) => setTimeout(resolve, options.insertResponseDelayMs));
        }
        const latestExisting = (responses.get(response.session_id) ?? []).find(
          (row) => row.task_index === response.task_index,
        );
        if (latestExisting) {
          return { response: latestExisting, inserted: false };
        }
        const saved = { ...response, id: response.id ?? `response-${id++}` };
        responses.set(response.session_id, [
          ...(responses.get(response.session_id) ?? []),
          saved,
        ]);
        return { response: saved, inserted: true };
      } finally {
        inFlightClaims.delete(key);
      }
    },
    updateResponse: async (response) => {
      const current = responses.get(response.session_id) ?? [];
      const updated = current.map((row) =>
        row.task_index === response.task_index ? { ...row, ...response } : row
      );
      const saved = updated.find((row) => row.task_index === response.task_index);
      if (!saved) throw new Error("missing response to update");
      responses.set(response.session_id, updated);
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
