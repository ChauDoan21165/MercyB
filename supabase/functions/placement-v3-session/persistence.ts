import {
  type LanguagePair,
  type OrchestratorDeps,
  type PersistSessionInput,
  type PlacementV3Profile,
  type PlacementV3Response,
  type PlacementV3Session,
  type PromptTask,
} from "./types.ts";
import { recommendLessonsStub } from "./scoring.ts";

type QueryBuilder = {
  select: (columns?: string, options?: unknown) => QueryBuilder;
  insert: (value: unknown) => QueryBuilder;
  update: (value: unknown) => QueryBuilder;
  upsert: (value: unknown, options?: unknown) => QueryBuilder;
  eq: (column: string, value: unknown) => QueryBuilder;
  order: (column: string, options?: unknown) => QueryBuilder;
  limit: (count: number) => QueryBuilder;
  maybeSingle: () => Promise<{ data: unknown; error: { message?: string } | null }>;
  single: () => Promise<{ data: unknown; error: { message?: string } | null }>;
  then: Promise<{ data: unknown; error: { message?: string } | null }>["then"];
};

export interface SupabaseLike {
  from: (table: string) => QueryBuilder;
}

export function createPersistence(
  db: SupabaseLike,
  base: Pick<OrchestratorDeps, "now" | "newId" | "log">,
): Omit<
  OrchestratorDeps,
  "grade" | "recommendLessons"
> {
  return {
    ...base,
    async loadLatestInProgress(userId) {
      const { data, error } = await db
        .from("placement_v3_sessions")
        .select("*")
        .eq("user_id", userId)
        .eq("flow_state", "in_progress")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw new Error(`loadLatestInProgress: ${error.message}`);
      return data ? rowToSession(data) : null;
    },
    async loadSession(sessionId, userId) {
      const { data, error } = await db
        .from("placement_v3_sessions")
        .select("*")
        .eq("id", sessionId)
        .eq("user_id", userId)
        .maybeSingle();
      if (error) throw new Error(`loadSession: ${error.message}`);
      return data ? rowToSession(data) : null;
    },
    async loadResponses(sessionId) {
      const { data, error } = await db
        .from("placement_v3_responses")
        .select("*")
        .eq("session_id", sessionId)
        .order("task_index", { ascending: true });
      if (error) throw new Error(`loadResponses: ${error.message}`);
      return Array.isArray(data) ? data.map(rowToResponse) : [];
    },
    async loadCurrentProfile(sessionId, userId) {
      const { data, error } = await db
        .from("placement_v3_profiles")
        .select("*")
        .eq("session_id", sessionId)
        .eq("user_id", userId)
        .maybeSingle();
      if (error) throw new Error(`loadCurrentProfile: ${error.message}`);
      return data ? rowToProfile(data) : null;
    },
    async createSession(input) {
      const row = sessionInsertRow(input);
      const { data, error } = await db
        .from("placement_v3_sessions")
        .insert(row)
        .select("*")
        .single();
      if (error) throw new Error(`createSession: ${error.message}`);
      return rowToSession(data);
    },
    async updateSession(session) {
      const { data, error } = await db
        .from("placement_v3_sessions")
        .update(sessionUpdateRow(session))
        .eq("id", session.id)
        .eq("user_id", session.user_id)
        .select("*")
        .single();
      if (error) throw new Error(`updateSession: ${error.message}`);
      return rowToSession(data);
    },
    async insertResponse(response) {
      const { data, error } = await db
        .from("placement_v3_responses")
        .insert(response)
        .select("*")
        .single();
      if (error) throw new Error(`insertResponse: ${error.message}`);
      return rowToResponse(data);
    },
    async markProfilesNotCurrent(userId) {
      const { error } = await db
        .from("placement_v3_profiles")
        .update({ is_current: false })
        .eq("user_id", userId);
      if (error) throw new Error(`markProfilesNotCurrent: ${error.message}`);
    },
    async upsertProfile(profile) {
      const { data, error } = await db
        .from("placement_v3_profiles")
        .upsert(profile, { onConflict: "user_id,session_id" })
        .select("*")
        .single();
      if (error) throw new Error(`upsertProfile: ${error.message}`);
      return rowToProfile(data);
    },
  };
}

export async function recommendLessons(profile: PlacementV3Profile) {
  // Temporary A26 stub. Replace with src/lib/placement/v3/recommender.ts
  // when that PR lands and is importable from edge-function code.
  return recommendLessonsStub(profile);
}

function sessionInsertRow(input: PersistSessionInput) {
  return {
    id: input.id,
    user_id: input.userId,
    started_at: input.now,
    completed_at: null,
    abandoned_at: null,
    current_modality: input.firstPrompt.modality,
    current_task_index: 0,
    total_tasks: input.totalTasks,
    language_pair: input.languagePair,
    flow_state: "in_progress",
    metadata: {
      lastPrompt: input.firstPrompt,
      targetLevel: input.firstPrompt.cefr,
      version: "placement-v3-session-v1",
    },
    created_at: input.now,
    updated_at: input.now,
  };
}

function sessionUpdateRow(session: PlacementV3Session) {
  return {
    completed_at: session.completed_at,
    abandoned_at: session.abandoned_at,
    current_modality: session.current_modality,
    current_task_index: session.current_task_index,
    total_tasks: session.total_tasks,
    flow_state: session.flow_state,
    metadata: session.metadata,
    updated_at: session.updated_at,
  };
}

function rowToSession(row: unknown): PlacementV3Session {
  const r = row as PlacementV3Session;
  return {
    ...r,
    language_pair: normalizePair(r.language_pair),
    metadata: typeof r.metadata === "object" && r.metadata ? r.metadata : {},
  };
}

function rowToResponse(row: unknown): PlacementV3Response {
  return row as PlacementV3Response;
}

function rowToProfile(row: unknown): PlacementV3Profile {
  return row as PlacementV3Profile;
}

function normalizePair(pair: unknown): LanguagePair {
  if (pair && typeof pair === "object") {
    const p = pair as Partial<LanguagePair>;
    return {
      native: typeof p.native === "string" ? p.native : "vi",
      target: typeof p.target === "string" ? p.target : "en",
    };
  }
  return { native: "vi", target: "en" };
}

export function makeSession(input: {
  id: string;
  userId: string;
  now: string;
  prompt: PromptTask;
  languagePair?: LanguagePair;
}): PlacementV3Session {
  return {
    id: input.id,
    user_id: input.userId,
    started_at: input.now,
    completed_at: null,
    abandoned_at: null,
    current_modality: input.prompt.modality,
    current_task_index: 0,
    total_tasks: 11,
    language_pair: input.languagePair ?? { native: "vi", target: "en" },
    flow_state: "in_progress",
    metadata: {
      lastPrompt: input.prompt,
      targetLevel: input.prompt.cefr,
      version: "placement-v3-session-v1",
    },
    created_at: input.now,
    updated_at: input.now,
  };
}

