export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type PlacementV3Modality =
  | "writing"
  | "speaking"
  | "reading"
  | "listening"
  | "conversation";

export type PlacementV3FlowState =
  | "in_progress"
  | "completed"
  | "abandoned"
  | "error";

export type PlacementV3Action =
  | "start"
  | "respond"
  | "abandon"
  | "resume"
  | "status";

export interface LanguagePair {
  native: string;
  target: string;
}

export interface L1InterferenceFlag {
  patternId: string;
  severity: "low" | "medium" | "high";
  evidence?: string;
}

export interface AssessmentCriterion {
  level: CEFRLevel;
  score?: number;
  evidence?: string;
}

export interface CEFRAssessment {
  overallLevel: CEFRLevel;
  confidence: number;
  criteria?: Record<string, AssessmentCriterion>;
  strengths?: string[];
  gaps?: string[];
  l1InterferenceFlags?: L1InterferenceFlag[];
  metadata?: Record<string, unknown>;
}

export interface SkillProfile {
  level: CEFRLevel;
  confidence: number;
  evidenceStatus?: "counted" | "degraded" | "not_counted";
  evidenceNote?: string;
}

export type PerSkillProfile = Partial<Record<PlacementV3Modality, SkillProfile>>;

export interface Recommendation {
  lessonId: string;
  reason: string;
  priority: number;
}

export interface PlacementV3Profile {
  id?: string;
  user_id: string;
  session_id: string;
  cefr_overall: CEFRLevel;
  cefr_overall_confidence: number;
  cefr_per_skill: PerSkillProfile;
  l1_interference_flags: L1InterferenceFlag[];
  strengths: string[];
  gaps: string[];
  recommended_lessons: Recommendation[];
  computed_at: string;
  is_current: boolean;
  created_at?: string;
}

export interface PromptTask {
  id: string;
  modality: PlacementV3Modality;
  cefr: CEFRLevel;
  promptText: string;
  expectedResponse: "text" | "audio" | "choice";
  metadata?: Record<string, unknown>;
}

export interface SessionMetadata {
  lastPrompt?: PromptTask;
  modalityStats?: Partial<Record<PlacementV3Modality, ModalityStats>>;
  errors?: SessionError[];
  completedModalities?: PlacementV3Modality[];
  lastCompletedModality?: PlacementV3Modality;
  targetLevel?: CEFRLevel;
  version?: string;
}

export interface ModalityStats {
  attempts: number;
  levelSum: number;
  weightedLevelSum: number;
  confidenceSum: number;
  lastLevel?: CEFRLevel;
}

export interface SessionError {
  at: string;
  code: string;
  message: string;
  recoverable: boolean;
}

export interface PlacementV3Session {
  id: string;
  user_id: string;
  is_synthetic?: boolean;
  started_at: string;
  completed_at: string | null;
  abandoned_at: string | null;
  current_modality: PlacementV3Modality | null;
  current_task_index: number;
  total_tasks: number | null;
  language_pair: LanguagePair;
  flow_state: PlacementV3FlowState;
  metadata: SessionMetadata;
  created_at: string;
  updated_at: string;
}

export interface PlacementV3Response {
  id?: string;
  session_id: string;
  task_index: number;
  modality: PlacementV3Modality;
  prompt_id: string;
  prompt_text: string;
  user_response_text: string | null;
  audio_storage_path: string | null;
  response_duration_ms: number | null;
  ai_assessment: CEFRAssessment | null;
  ai_assessment_version: string | null;
  graded_at: string | null;
  created_at: string;
}

export interface PlacementV3ResponseWriteResult {
  response: PlacementV3Response;
  inserted: boolean;
}

export interface RespondInput {
  sessionId: string;
  taskIndex: number;
  promptId?: string;
  responseText?: string;
  audioStoragePath?: string;
  responseDurationMs?: number;
}

export interface StartInput {
  languagePair?: LanguagePair;
  initialLevel?: CEFRLevel;
  syntheticMonitoring?: string | boolean | null;
}

export type PlacementV3Request =
  | ({ action: "start" } & StartInput)
  | { action: "respond"; response: RespondInput }
  | { action: "abandon"; sessionId: string }
  | { action: "resume"; sessionId?: string }
  | { action: "status"; sessionId?: string };

export interface SessionStateResponse {
  ok: true;
  action: PlacementV3Action;
  session: PlacementV3Session;
  prompt: PromptTask | null;
  profile: PlacementV3Profile | null;
  resumed?: boolean;
}

export interface ErrorResponse {
  ok: false;
  error: string;
  message: string;
  status: number;
}

export type OrchestratorResponse = SessionStateResponse | ErrorResponse;

export interface GraderInput {
  userId: string;
  sessionId: string;
  authToken?: string;
  modality: PlacementV3Modality;
  prompt: PromptTask;
  responseText: string;
  audioStoragePath?: string;
  responseDurationMs?: number;
}

export interface GraderResult {
  ok: boolean;
  assessment: CEFRAssessment;
  version: string;
  providerTrace?: GraderProviderTrace;
  errorCode?: string;
  errorMessage?: string;
}

export interface GraderProviderTrace {
  gradingPath: string;
  provider: string;
  model: string;
  latencyMs: number | null;
  tokensInput: number | null;
  tokensOutput: number | null;
  fallback: boolean;
  errorCode?: string;
  httpStatus?: number;
}

export interface PersistSessionInput {
  userId: string;
  languagePair: LanguagePair;
  firstPrompt: PromptTask;
  now: string;
  totalTasks: number;
  isSynthetic?: boolean;
  id?: string;
}

/**
 * One append to `profiles.placement_history` from a v3 completion.
 * Shape mirrors v2's `PlacementHistoryEntry` in
 * `supabase/functions/placement-session/types.ts` so the jsonb column
 * can hold v2 + v3 entries side by side. `source: 'v3'` discriminates;
 * IRT-only fields (`theta`, `se`, numeric `perSkill`) are null/empty
 * because v3 doesn't use IRT scoring.
 */
export interface PlacementHistoryEntryV3 {
  ts: string;
  bankVersion: string;
  theta: null;
  se: null;
  cefr: CEFRLevel;
  perSkill: Record<string, never>;
  l1Top: string[];
  sessionId: string;
  source: "v3";
}

/**
 * Snapshot payload passed to `writeProfileSnapshot`. Built from a
 * completed `PlacementV3Profile` by the orchestrator; persisted to the
 * shared `profiles` table by the edge function. Mirrors v2's
 * `LegacySnapshot` shape so consumers (`FocusAreasCard`, `AccountPage`)
 * read the same columns regardless of which placement version produced
 * them.
 */
export interface PlacementProfileSnapshotV3 {
  userId: string;
  sessionId: string;
  cefr: CEFRLevel;
  startingRoom: string;
  completedAt: string;
  weaknessTags: string[];
  historyEntry: PlacementHistoryEntryV3;
}

export interface OrchestratorDeps {
  now: () => string;
  newId: () => string;
  loadLatestInProgress: (userId: string) => Promise<PlacementV3Session | null>;
  loadSession: (
    sessionId: string,
    userId: string,
  ) => Promise<PlacementV3Session | null>;
  loadResponses: (sessionId: string) => Promise<PlacementV3Response[]>;
  loadCurrentProfile: (
    sessionId: string,
    userId: string,
  ) => Promise<PlacementV3Profile | null>;
  createSession: (
    input: PersistSessionInput,
  ) => Promise<PlacementV3Session>;
  updateSession: (session: PlacementV3Session) => Promise<PlacementV3Session>;
  insertResponse: (
    response: PlacementV3Response,
  ) => Promise<PlacementV3ResponseWriteResult>;
  updateResponse: (
    response: PlacementV3Response,
  ) => Promise<PlacementV3Response>;
  markProfilesNotCurrent: (userId: string) => Promise<void>;
  upsertProfile: (profile: PlacementV3Profile) => Promise<PlacementV3Profile>;
  /**
   * Write the placement completion snapshot to the shared `profiles` table —
   * mirrors v2's `placement-session/index.ts:361-368` pattern. Compliant
   * under the directional carve-out of the "no Placement writeback"
   * invariant: the placement engine writing its own results is permitted;
   * writebacks FROM other surfaces (Study OS / memory / AI Tutor) are not.
   * See STRATEGY.md §12 "Placement Writeback Boundary" + docs/app/APP_LOGIC_FLOW.md.
   */
  writeProfileSnapshot: (snapshot: PlacementProfileSnapshotV3) => Promise<void>;
  grade: (input: GraderInput) => Promise<GraderResult>;
  recommendLessons: (profile: PlacementV3Profile) => Promise<Recommendation[]>;
  log?: (event: string, meta?: Record<string, unknown>) => void;
}

export const CEFR_ORDER: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
export const MODALITY_ORDER: PlacementV3Modality[] = [
  "writing",
  "speaking",
  "reading",
  "listening",
  "conversation",
];
