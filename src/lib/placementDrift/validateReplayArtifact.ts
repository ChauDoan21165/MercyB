import type { CefrLevel, DriftModality, DriftProvider, DriftStatus } from "./types";

const CEFR_LEVELS = new Set(["A1", "A2", "B1", "B2", "C1", "C2"]);
const MODALITIES = new Set(["writing", "reading", "listening", "speaking"]);
const PROVIDERS = new Set(["openai", "gemini", "none", "unknown"]);
const STATUSES = new Set(["success", "error", "timeout", "malformed"]);
const ISO_TIMESTAMP_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

export interface ReplayArtifactValidationResult {
  ok: boolean;
  errors: string[];
  sampleOrder: string[];
}

export interface ReplayDeterminismComparison {
  ok: boolean;
  errors: string[];
  expected: unknown;
  actual: unknown;
}

interface ReplayArtifact {
  simulated?: unknown;
  generatedAt?: unknown;
  run?: {
    id?: unknown;
    batchId?: unknown;
    startedAt?: unknown;
    completedAt?: unknown;
    simulated?: unknown;
    providerSet?: unknown;
  };
  scores?: unknown;
  evidence?: unknown;
  deltas?: unknown;
}

interface ReplayScoreArtifact {
  sampleId?: unknown;
  sample_id?: unknown;
  modality?: unknown;
  expectedCefr?: unknown;
  expected_cefr?: unknown;
  parsedCefr?: unknown;
  parsed_cefr?: unknown;
  provider?: unknown;
  model?: unknown;
  retryPath?: unknown;
  retry_path?: unknown;
  taxonomyTags?: unknown;
  taxonomy_tags?: unknown;
  latencyMs?: unknown;
  latency_ms?: unknown;
  tokensInput?: unknown;
  tokens_input?: unknown;
  tokensOutput?: unknown;
  tokens_output?: unknown;
  status?: unknown;
  malformed?: unknown;
  createdAt?: unknown;
  created_at?: unknown;
  raw_response?: unknown;
}

interface ReplayEvidenceArtifact {
  isoTimestamp?: unknown;
  replayBatchId?: unknown;
  runId?: unknown;
  sampleId?: unknown;
  provider?: unknown;
  model?: unknown;
  latencyMs?: unknown;
  tokenCount?: unknown;
  rawGraderOutput?: unknown;
  parsedCefrResult?: unknown;
  simulated?: unknown;
}

interface DriftDeltaArtifact {
  sampleId?: unknown;
  modality?: unknown;
  expectedCefr?: unknown;
  baselineCefr?: unknown;
  currentCefr?: unknown;
  deltaBands?: unknown;
  provider?: unknown;
  taxonomyTags?: unknown;
  status?: unknown;
}

export function validateReplayArtifact(artifact: unknown): ReplayArtifactValidationResult {
  const errors: string[] = [];
  const root = asRecord(artifact) as ReplayArtifact | null;
  if (!root) {
    return { ok: false, errors: ["artifact must be an object"], sampleOrder: [] };
  }

  if (root.simulated !== true) errors.push("artifact.simulated must be true");
  if ("generatedAt" in root && !isIsoTimestamp(root.generatedAt)) errors.push("artifact.generatedAt must be ISO timestamp");
  validateRun(root.run, errors);

  const scores = Array.isArray(root.scores) ? root.scores : [];
  const evidence = Array.isArray(root.evidence) ? root.evidence : [];
  const deltas = Array.isArray(root.deltas) ? root.deltas : [];

  const sampleOrder = scores.map((score, index) => validateScore(score, index, errors));
  validateUniqueOrder(sampleOrder, "scores", errors);

  const evidenceOrder = evidence.map((entry, index) => validateEvidence(entry, index, errors));
  validateUniqueOrder(evidenceOrder, "evidence", errors);
  if (evidenceOrder.length && sampleOrder.length && evidenceOrder.join("\n") !== sampleOrder.join("\n")) {
    errors.push("evidence sample order must match score sample order");
  }

  const deltaOrder = deltas.map((delta, index) => validateDelta(delta, index, errors));
  validateUniqueOrder(deltaOrder, "deltas", errors);
  if (deltaOrder.length && sampleOrder.length && deltaOrder.join("\n") !== sampleOrder.join("\n")) {
    errors.push("drift delta sample order must match score sample order");
  }

  return { ok: errors.length === 0, errors, sampleOrder };
}

export function buildReplayDeterminismSignature(artifact: unknown): unknown {
  const root = asRecord(artifact) as ReplayArtifact | null;
  if (!root) return null;
  return {
    simulated: root.simulated,
    run: normalizeRun(root.run),
    scores: Array.isArray(root.scores) ? root.scores.map(normalizeScore) : [],
    evidence: Array.isArray(root.evidence) ? root.evidence.map(normalizeEvidence) : [],
    deltas: Array.isArray(root.deltas) ? root.deltas.map(normalizeDelta) : [],
  };
}

export function compareReplayDeterminism(expectedArtifact: unknown, actualArtifact: unknown): ReplayDeterminismComparison {
  const expectedValidation = validateReplayArtifact(expectedArtifact);
  const actualValidation = validateReplayArtifact(actualArtifact);
  const errors = [
    ...expectedValidation.errors.map((error) => `expected: ${error}`),
    ...actualValidation.errors.map((error) => `actual: ${error}`),
  ];
  const expected = buildReplayDeterminismSignature(expectedArtifact);
  const actual = buildReplayDeterminismSignature(actualArtifact);
  if (stableStringify(expected) !== stableStringify(actual)) {
    errors.push("normalized deterministic replay signature changed");
  }
  return { ok: errors.length === 0, errors, expected, actual };
}

export function stableStringify(value: unknown): string {
  return JSON.stringify(sortKeys(value), null, 2);
}

function validateRun(run: ReplayArtifact["run"], errors: string[]) {
  if (!run) return;
  if (typeof run.id !== "string" || run.id.length < 1) errors.push("run.id is required");
  if (typeof run.batchId !== "string" || run.batchId.length < 1) errors.push("run.batchId is required");
  if (run.simulated !== true) errors.push("run.simulated must be true");
  if (!isIsoTimestamp(run.startedAt)) errors.push("run.startedAt must be ISO timestamp");
  if (!isIsoTimestamp(run.completedAt)) errors.push("run.completedAt must be ISO timestamp");
  if (!Array.isArray(run.providerSet) || !run.providerSet.every(isProvider)) {
    errors.push("run.providerSet must contain valid provider IDs");
  }
}

function validateScore(value: unknown, index: number, errors: string[]): string {
  const score = asRecord(value) as ReplayScoreArtifact | null;
  if (!score) {
    errors.push(`scores[${index}] must be an object`);
    return "";
  }
  const sampleId = stringField(score.sampleId ?? score.sample_id);
  if (!sampleId) errors.push(`scores[${index}].sampleId is required`);
  if (!isModality(score.modality)) errors.push(`scores[${index}].modality is invalid`);
  if (!isCefr(score.expectedCefr ?? score.expected_cefr)) errors.push(`scores[${index}].expectedCefr is invalid`);
  const parsedCefr = score.parsedCefr ?? score.parsed_cefr;
  if (parsedCefr !== null && parsedCefr !== undefined && !isCefr(parsedCefr)) errors.push(`scores[${index}].parsedCefr is invalid`);
  if (!isProvider(score.provider)) errors.push(`scores[${index}].provider is invalid`);
  if (typeof score.model !== "string" || !score.model) errors.push(`scores[${index}].model is required`);
  if (!arrayOfStrings(score.retryPath ?? score.retry_path)) errors.push(`scores[${index}].retryPath is required`);
  if (!arrayOfStrings(score.taxonomyTags ?? score.taxonomy_tags)) errors.push(`scores[${index}].taxonomyTags is required`);
  if (!isFiniteNumber(score.latencyMs ?? score.latency_ms)) errors.push(`scores[${index}].latencyMs must be numeric`);
  if (!isFiniteNumber(score.tokensInput ?? score.tokens_input)) errors.push(`scores[${index}].tokensInput must be numeric`);
  if (!isFiniteNumber(score.tokensOutput ?? score.tokens_output)) errors.push(`scores[${index}].tokensOutput must be numeric`);
  if (!isStatus(score.status)) errors.push(`scores[${index}].status is invalid`);
  if (typeof score.malformed !== "boolean") errors.push(`scores[${index}].malformed must be boolean`);
  const createdAt = score.createdAt ?? score.created_at;
  if (createdAt !== undefined && !isIsoTimestamp(createdAt)) errors.push(`scores[${index}].createdAt must be ISO timestamp`);
  const rawResponse = asRecord(score.raw_response);
  if (rawResponse && rawResponse.simulated !== true) errors.push(`scores[${index}].raw_response.simulated must be true`);
  return sampleId;
}

function validateEvidence(value: unknown, index: number, errors: string[]): string {
  const evidence = asRecord(value) as ReplayEvidenceArtifact | null;
  if (!evidence) {
    errors.push(`evidence[${index}] must be an object`);
    return "";
  }
  const sampleId = stringField(evidence.sampleId);
  if (!sampleId) errors.push(`evidence[${index}].sampleId is required`);
  if (!isIsoTimestamp(evidence.isoTimestamp)) errors.push(`evidence[${index}].isoTimestamp must be ISO timestamp`);
  if (typeof evidence.replayBatchId !== "string") errors.push(`evidence[${index}].replayBatchId is required`);
  if (typeof evidence.runId !== "string") errors.push(`evidence[${index}].runId is required`);
  if (!isProvider(evidence.provider)) errors.push(`evidence[${index}].provider is invalid`);
  if (typeof evidence.model !== "string" || !evidence.model) errors.push(`evidence[${index}].model is required`);
  if (!isFiniteNumber(evidence.latencyMs)) errors.push(`evidence[${index}].latencyMs must be numeric`);
  const tokenCount = asRecord(evidence.tokenCount);
  if (!tokenCount || !isFiniteNumber(tokenCount.input) || !isFiniteNumber(tokenCount.output)) {
    errors.push(`evidence[${index}].tokenCount input/output are required`);
  }
  if (evidence.simulated !== true) errors.push(`evidence[${index}].simulated must be true`);
  const raw = asRecord(evidence.rawGraderOutput);
  if (!raw || raw.simulated !== true) errors.push(`evidence[${index}].rawGraderOutput.simulated must be true`);
  return sampleId;
}

function validateDelta(value: unknown, index: number, errors: string[]): string {
  const delta = asRecord(value) as DriftDeltaArtifact | null;
  if (!delta) {
    errors.push(`deltas[${index}] must be an object`);
    return "";
  }
  const sampleId = stringField(delta.sampleId);
  if (!sampleId) errors.push(`deltas[${index}].sampleId is required`);
  if (!isModality(delta.modality)) errors.push(`deltas[${index}].modality is invalid`);
  if (!isCefr(delta.expectedCefr)) errors.push(`deltas[${index}].expectedCefr is invalid`);
  if (delta.baselineCefr !== null && !isCefr(delta.baselineCefr)) errors.push(`deltas[${index}].baselineCefr is invalid`);
  if (delta.currentCefr !== null && !isCefr(delta.currentCefr)) errors.push(`deltas[${index}].currentCefr is invalid`);
  if (delta.deltaBands !== null && !isFiniteNumber(delta.deltaBands)) errors.push(`deltas[${index}].deltaBands must be numeric or null`);
  if (!isProvider(delta.provider)) errors.push(`deltas[${index}].provider is invalid`);
  if (!arrayOfStrings(delta.taxonomyTags)) errors.push(`deltas[${index}].taxonomyTags is required`);
  if (!isStatus(delta.status)) errors.push(`deltas[${index}].status is invalid`);
  return sampleId;
}

function validateUniqueOrder(values: string[], label: string, errors: string[]) {
  const seen = new Set<string>();
  for (const value of values) {
    if (!value) continue;
    if (seen.has(value)) errors.push(`${label} contains duplicate sample ${value}`);
    seen.add(value);
  }
}

function normalizeRun(run: ReplayArtifact["run"]) {
  if (!run) return null;
  return {
    simulated: run.simulated,
    providerSet: run.providerSet,
  };
}

function normalizeScore(value: unknown) {
  const score = asRecord(value) as ReplayScoreArtifact | null;
  if (!score) return null;
  return {
    sampleId: score.sampleId ?? score.sample_id,
    modality: score.modality as DriftModality,
    expectedCefr: score.expectedCefr ?? score.expected_cefr,
    parsedCefr: score.parsedCefr ?? score.parsed_cefr,
    provider: score.provider as DriftProvider,
    model: score.model,
    retryPath: score.retryPath ?? score.retry_path,
    taxonomyTags: score.taxonomyTags ?? score.taxonomy_tags,
    latencyMs: score.latencyMs ?? score.latency_ms,
    tokensInput: score.tokensInput ?? score.tokens_input,
    tokensOutput: score.tokensOutput ?? score.tokens_output,
    status: score.status as DriftStatus,
    malformed: score.malformed,
    rawResponseSimulated: asRecord(score.raw_response)?.simulated,
  };
}

function normalizeEvidence(value: unknown) {
  const evidence = asRecord(value) as ReplayEvidenceArtifact | null;
  if (!evidence) return null;
  return {
    sampleId: evidence.sampleId,
    provider: evidence.provider,
    model: evidence.model,
    latencyMs: evidence.latencyMs,
    tokenCount: evidence.tokenCount,
    parsedCefrResult: evidence.parsedCefrResult,
    simulated: evidence.simulated,
    rawSimulated: asRecord(evidence.rawGraderOutput)?.simulated,
  };
}

function normalizeDelta(value: unknown) {
  const delta = asRecord(value) as DriftDeltaArtifact | null;
  if (!delta) return null;
  return {
    sampleId: delta.sampleId,
    modality: delta.modality,
    expectedCefr: delta.expectedCefr,
    baselineCefr: delta.baselineCefr,
    currentCefr: delta.currentCefr,
    deltaBands: delta.deltaBands,
    provider: delta.provider,
    taxonomyTags: delta.taxonomyTags,
    status: delta.status,
  };
}

function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeys);
  const record = asRecord(value);
  if (!record) return value;
  return Object.fromEntries(Object.entries(record).sort(([left], [right]) => left.localeCompare(right)).map(([key, inner]) => [key, sortKeys(inner)]));
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? value as Record<string, unknown> : null;
}

function stringField(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function isIsoTimestamp(value: unknown): boolean {
  return typeof value === "string" && ISO_TIMESTAMP_PATTERN.test(value) && !Number.isNaN(Date.parse(value));
}

function isCefr(value: unknown): value is CefrLevel {
  return typeof value === "string" && CEFR_LEVELS.has(value);
}

function isModality(value: unknown): value is DriftModality {
  return typeof value === "string" && MODALITIES.has(value);
}

function isProvider(value: unknown): value is DriftProvider {
  return typeof value === "string" && PROVIDERS.has(value);
}

function isStatus(value: unknown): value is DriftStatus {
  return typeof value === "string" && STATUSES.has(value);
}

function isFiniteNumber(value: unknown): boolean {
  return typeof value === "number" && Number.isFinite(value);
}

function arrayOfStrings(value: unknown): value is string[] {
  return Array.isArray(value) && value.length > 0 && value.every((entry) => typeof entry === "string" && entry.length > 0);
}
