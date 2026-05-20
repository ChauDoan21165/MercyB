import {
  CEFR_ORDER,
  type LanguagePair,
  type OrchestratorDeps,
  type PersistSessionInput,
  type PlacementV3Profile,
  type PlacementV3Response,
  type PlacementV3Session,
  type PromptTask,
  type Recommendation,
} from "./types.ts";

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
  const imported = await tryAppRecommender(profile);
  if (imported.length) return imported;
  return recommendLessonsFromProfile(profile);
}

type RecommenderModule = {
  recommendLessons?: (ctx: { assessment: Record<string, unknown> }) => Array<{
    lessonId: string;
    reason: string;
    priority: number;
  }>;
};

async function tryAppRecommender(profile: PlacementV3Profile): Promise<Recommendation[]> {
  try {
    const importer = Function("path", "return import(path)") as (
      path: string,
    ) => Promise<RecommenderModule>;
    const mod = await importer("../../../src/lib/placement/v3/recommender.ts");
    if (typeof mod.recommendLessons !== "function") return [];
    return mod.recommendLessons({ assessment: profileToRecommenderAssessment(profile) })
      .slice(0, 6)
      .map((lesson) => ({
        lessonId: lesson.lessonId,
        reason: lesson.reason,
        priority: Math.max(0, Math.min(1, lesson.priority)),
      }));
  } catch {
    return [];
  }
}

function profileToRecommenderAssessment(profile: PlacementV3Profile): Record<string, unknown> {
  return {
    overallLevel: profile.cefr_overall,
    confidence: profile.cefr_overall_confidence,
    skillLevels: Object.fromEntries(
      Object.entries(profile.cefr_per_skill).map(([skill, value]) => [
        skill,
        value.level,
      ]),
    ),
    strengths: profile.strengths,
    gaps: profile.gaps,
    l1InterferenceFlags: profile.l1_interference_flags,
  };
}

function recommendLessonsFromProfile(profile: PlacementV3Profile): Recommendation[] {
  const weakest = Object.entries(profile.cefr_per_skill)
    .sort(([, a], [, b]) => CEFR_ORDER.indexOf(a.level) - CEFR_ORDER.indexOf(b.level))[0];
  const weakestSkill = weakest?.[0] ?? "grammar";
  const level = (weakest?.[1].level ?? profile.cefr_overall).toLowerCase();
  const firstGap = profile.gaps[0] ?? `${weakestSkill} control`;
  const topFlag = profile.l1_interference_flags[0]?.patternId;
  return [
    {
      lessonId: `placement-v3:${level}:${weakestSkill}-foundation`,
      reason: `Addresses ${firstGap} at ${profile.cefr_overall}.`,
      priority: 1,
    },
    {
      lessonId: `placement-v3:${level}:vietnamese-transfer`,
      reason: topFlag
        ? `Targets Vietnamese L1 pattern ${topFlag}.`
        : "Targets common Vietnamese L1 transfer patterns found in placement.",
      priority: 0.86,
    },
    {
      lessonId: `placement-v3:${level}:conversation-loop`,
      reason: "Builds active recall across speaking, listening, writing, and Mercy conversation.",
      priority: 0.72,
    },
  ];
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
