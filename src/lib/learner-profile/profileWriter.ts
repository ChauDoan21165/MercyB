import { supabase } from "@/lib/supabaseClient";
import {
  CORRECTION_SOURCE_SYNTHETIC_MARKER_KEY,
  isCorrectionSourceSyntheticMarkerValue,
} from "@/lib/ai-tutor/correctionSourceSyntheticMarker";

export const LEARNER_PROFILE_WRITE_FUNCTION = "learner-profile-write";

export type LearnerProfileSkill =
  | "pronunciation"
  | "grammar"
  | "vocabulary"
  | "listening"
  | "speaking"
  | "reading"
  | "writing";

export type LearnerProfilePatternCode =
  | "missing-article"
  | "tense-omission"
  | "subj-verb-agreement"
  | "preposition-calque"
  | "word-order"
  | "zero-copula"
  | "double-negation"
  | "word_choice"
  | "sentence_structure"
  | "pronunciation"
  | "politeness_register";

export type LearnerProfilePatternEvent = {
  patternCode: LearnerProfilePatternCode;
  l1?: string | null;
  occurrenceCount?: number;
  resolvedCount?: number;
  exampleUnitId?: string | null;
};

export type LearnerProfileSkillEvent = {
  skill: LearnerProfileSkill;
  score?: number | null;
  cefrEstimate?: "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | null;
  confidence?: number | null;
  evidenceCount?: number;
  lastAssessedAt?: string | null;
};

type QueuedPattern = LearnerProfilePatternEvent & { syntheticMonitoring: string | null };
type QueuedSkill = LearnerProfileSkillEvent & { syntheticMonitoring: string | null };
type InvokeResult = { error: unknown | null };
type TimerHandle = number | ReturnType<typeof setTimeout>;

type WriterDeps = {
  getSession?: () => Promise<{ accessToken: string | null }>;
  invoke?: (payload: LearnerProfileWritePayload) => Promise<InvokeResult>;
  readSyntheticMarker?: () => string | null;
  readNativeLanguage?: () => string | null;
  setTimer?: (fn: () => void, ms: number) => TimerHandle;
  clearTimer?: (timer: TimerHandle) => void;
  log?: (message: string, error?: unknown) => void;
  batchDelayMs?: number;
};

export type LearnerProfileWritePayload = {
  patterns: Array<{
    pattern_code: LearnerProfilePatternCode;
    l1: string;
    occurrence_count: number;
    resolved_count: number;
    example_unit_id: string | null;
    syntheticMonitoring: string | null;
  }>;
  skills: Array<{
    skill: LearnerProfileSkill;
    score: number | null;
    cefr_estimate: string | null;
    confidence: number | null;
    evidence_count: number;
    last_assessed_at: string | null;
    syntheticMonitoring: string | null;
  }>;
};

const DEFAULT_BATCH_DELAY_MS = 750;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const DIRECT_PATTERN_CODES = new Set<LearnerProfilePatternCode>([
  "missing-article",
  "tense-omission",
  "subj-verb-agreement",
  "preposition-calque",
  "word-order",
  "zero-copula",
  "double-negation",
  "word_choice",
  "sentence_structure",
  "pronunciation",
  "politeness_register",
]);

export function recordLearnerProfileCorrection(input: {
  patternCode?: string | null;
  appliedRuleIds?: readonly string[] | null;
  l1?: string | null;
  exampleUnitId?: string | null;
}): void {
  defaultWriter.recordCorrection(input);
}

export function createLearnerProfileWriter(deps: WriterDeps = {}) {
  const queue: { patterns: QueuedPattern[]; skills: QueuedSkill[] } = {
    patterns: [],
    skills: [],
  };
  const batchDelayMs = deps.batchDelayMs ?? DEFAULT_BATCH_DELAY_MS;
  let timer: TimerHandle | null = null;
  let flushing = false;

  function recordCorrection(input: {
    patternCode?: string | null;
    appliedRuleIds?: readonly string[] | null;
    l1?: string | null;
    exampleUnitId?: string | null;
  }): void {
    const patternCode = normalizePatternCode(input.patternCode) ??
      derivePatternCodeFromRuleIds(input.appliedRuleIds ?? []);
    if (!patternCode) return;

    queue.patterns.push({
      patternCode,
      l1: normalizeL1(input.l1 ?? (deps.readNativeLanguage ?? readNativeLanguage)()),
      occurrenceCount: 1,
      resolvedCount: 0,
      exampleUnitId: normalizeUuid(input.exampleUnitId),
      syntheticMonitoring: (deps.readSyntheticMarker ?? readSyntheticMarker)(),
    });
    scheduleFlush();
  }

  function recordSkill(input: LearnerProfileSkillEvent): void {
    queue.skills.push({
      ...input,
      evidenceCount: Math.max(1, Math.floor(input.evidenceCount ?? 1)),
      syntheticMonitoring: (deps.readSyntheticMarker ?? readSyntheticMarker)(),
    });
    scheduleFlush();
  }

  function scheduleFlush(): void {
    if (timer !== null) return;
    timer = (deps.setTimer ?? setTimeout)(() => {
      timer = null;
      void flush();
    }, batchDelayMs);
  }

  async function flush(): Promise<void> {
    if (flushing) return;
    if (timer !== null) {
      (deps.clearTimer ?? clearTimeout)(timer);
      timer = null;
    }
    if (queue.patterns.length === 0 && queue.skills.length === 0) return;

    const patterns = queue.patterns.splice(0);
    const skills = queue.skills.splice(0);
    flushing = true;
    try {
      const { accessToken } = await (deps.getSession ?? getSession)();
      if (!accessToken) return;

      const payload = buildPayload(patterns, skills);
      if (payload.patterns.length === 0 && payload.skills.length === 0) return;

      const result = await (deps.invoke ?? invokeLearnerProfileWrite)(payload);
      if (result.error) log("invoke_failed", result.error);
    } catch (error) {
      log("write_failed", error);
    } finally {
      flushing = false;
    }
  }

  function log(stage: string, error?: unknown): void {
    (deps.log ?? defaultLog)(`[learner-profile] ${stage}`, error);
  }

  return { recordCorrection, recordSkill, flush };
}

export function normalizePatternCode(value: string | null | undefined): LearnerProfilePatternCode | null {
  const normalized = String(value ?? "").trim().toLowerCase().replace(/\s+/g, "-");
  if (DIRECT_PATTERN_CODES.has(normalized as LearnerProfilePatternCode)) {
    return normalized as LearnerProfilePatternCode;
  }
  if (!normalized) return null;
  if (/article|a\/an\/the/.test(normalized)) return "missing-article";
  if (/past|tense|irregular|yesterday/.test(normalized)) return "tense-omission";
  if (/subject[-_\s]*verb|third[-_\s]*person|sva/.test(normalized)) return "subj-verb-agreement";
  if (/preposition|in\/on\/at|discuss|marry|listen-to|look-at|wait-for/.test(normalized)) return "preposition-calque";
  if (/word[-_\s]*order|topic[-_\s]*comment|time[-_\s]*expression/.test(normalized)) return "word-order";
  if (/copula|be[-_\s]*(drop|verb)|missing[-_\s]*be|zero[-_\s]*copula/.test(normalized)) return "zero-copula";
  if (/double[-_\s]*negation|no[-_\s]*.*no/.test(normalized)) return "double-negation";
  if (/word[-_\s]*choice|collocation|calque|say[-_\s]*tell/.test(normalized)) return "word_choice";
  if (/pronunciation|phoneme|tone/.test(normalized)) return "pronunciation";
  if (/polite|register|formal|casual/.test(normalized)) return "politeness_register";
  if (/sentence|structure|runon|because|although|transfer/.test(normalized)) return "sentence_structure";
  return null;
}

export function derivePatternCodeFromRuleIds(ruleIds: readonly string[]): LearnerProfilePatternCode | null {
  for (const ruleId of ruleIds) {
    const pattern = normalizePatternCode(ruleId);
    if (pattern) return pattern;
  }
  return null;
}

function buildPayload(patterns: QueuedPattern[], skills: QueuedSkill[]): LearnerProfileWritePayload {
  return {
    patterns: patterns.map((pattern) => ({
      pattern_code: pattern.patternCode,
      l1: normalizeL1(pattern.l1),
      occurrence_count: Math.max(1, Math.floor(pattern.occurrenceCount ?? 1)),
      resolved_count: Math.max(0, Math.floor(pattern.resolvedCount ?? 0)),
      example_unit_id: normalizeUuid(pattern.exampleUnitId),
      syntheticMonitoring: pattern.syntheticMonitoring,
    })),
    skills: skills.map((skill) => ({
      skill: skill.skill,
      score: normalizeNumber(skill.score, 0, 100),
      cefr_estimate: skill.cefrEstimate ?? null,
      confidence: normalizeNumber(skill.confidence, 0, 1),
      evidence_count: Math.max(1, Math.floor(skill.evidenceCount ?? 1)),
      last_assessed_at: skill.lastAssessedAt ?? null,
      syntheticMonitoring: skill.syntheticMonitoring,
    })),
  };
}

function normalizeL1(value: string | null | undefined): string {
  const normalized = String(value ?? "vi").trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
  return /^[a-z][a-z0-9_-]{1,11}$/.test(normalized) ? normalized : "vi";
}

function normalizeUuid(value: string | null | undefined): string | null {
  const trimmed = String(value ?? "").trim();
  return UUID_RE.test(trimmed) ? trimmed : null;
}

function normalizeNumber(value: number | null | undefined, min: number, max: number): number | null {
  if (value == null || !Number.isFinite(value)) return null;
  return Math.min(max, Math.max(min, value));
}

function readNativeLanguage(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem("mercyb:nativeLanguage") ??
      readStringFromJsonStorage("mercyb:languagePair", "native") ??
      readStringFromJsonStorage("mercyb:selectedPair", "native") ??
      readStringFromJsonStorage("mercyblade.languagePair", "native");
  } catch {
    return null;
  }
}

function readSyntheticMarker(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(CORRECTION_SOURCE_SYNTHETIC_MARKER_KEY);
    return isCorrectionSourceSyntheticMarkerValue(value) ? value : null;
  } catch {
    return null;
  }
}

function readStringFromJsonStorage(key: string, field: string): string | null {
  const raw = window.localStorage.getItem(key);
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    const value = (parsed as Record<string, unknown>)[field];
    return typeof value === "string" && value.trim() ? value : null;
  } catch {
    return null;
  }
}

async function getSession(): Promise<{ accessToken: string | null }> {
  try {
    const { data } = await supabase.auth.getSession();
    return { accessToken: data.session?.access_token ?? null };
  } catch {
    return { accessToken: null };
  }
}

async function invokeLearnerProfileWrite(payload: LearnerProfileWritePayload): Promise<InvokeResult> {
  const { error } = await supabase.functions.invoke(LEARNER_PROFILE_WRITE_FUNCTION, { body: payload });
  return { error: error ?? null };
}

function defaultLog(message: string, error?: unknown): void {
  console.warn(message, error);
}

const defaultWriter = createLearnerProfileWriter();
