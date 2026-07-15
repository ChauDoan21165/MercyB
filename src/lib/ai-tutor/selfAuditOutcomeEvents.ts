import { getSupabaseEnvSnapshot, supabase } from "@/lib/supabaseClient";
import type { TutorTarget } from "@/lib/tutor/tutorCopy";
import {
  CORRECTION_SOURCE_SYNTHETIC_MARKER_KEY,
  isCorrectionSourceSyntheticMarkerValue,
} from "./correctionSourceSyntheticMarker";

export const SELF_AUDIT_OUTCOME_EVENTS_TABLE = "self_audit_outcome_events";

export type SelfAuditOutcomeDecision = "SHOW" | "SHOW_WITH_CAUTION" | "REVISE" | "BLOCK";

export type SelfAuditOutcomeEventRow = {
  decision: SelfAuditOutcomeDecision;
  deciding_gate: string | null;
  failed_rule: string | null;
  reason_code: string | null;
  lang_pair: string | null;
  is_synthetic: boolean;
};

type UserContext = {
  nativeLanguage: string | null;
  isSynthetic: boolean;
};

type InsertResult = { error: unknown | null };

type SelfAuditOutcomeEventDeps = {
  getUserContext?: () => Promise<UserContext>;
  getLocalContext?: () => UserContext;
  isProfileSyntheticCacheCold?: () => boolean;
  ensureProfileSyntheticResolved?: () => Promise<void>;
  durableInsertRow?: (row: SelfAuditOutcomeEventRow) => Promise<InsertResult>;
  insertRow?: (row: SelfAuditOutcomeEventRow) => Promise<InsertResult>;
};

const LOG_PREFIX = "[self_audit_outcome_events]";
const PROFILE_SYNTHETIC_CACHE_KEY = "mercyblade.correctionSourceProfileSynthetic.v1";

const LANGUAGE_CODE_BY_NAME: Record<string, string> = {
  chinese: "zh",
  english: "en",
  french: "fr",
  german: "de",
  japanese: "ja",
  korean: "ko",
  spanish: "es",
  vietnamese: "vi",
};

export function recordSelfAuditOutcomeEvent(input: {
  telemetry: Record<string, unknown>;
  targetLanguage: TutorTarget;
}): void {
  void writeSelfAuditOutcomeEvent(input).catch((error: unknown) => {
    logInsertFailure("unexpected_throw", error);
  });
}

export async function writeSelfAuditOutcomeEvent(
  input: {
    telemetry: Record<string, unknown>;
    targetLanguage: TutorTarget;
  },
  deps: SelfAuditOutcomeEventDeps = {},
): Promise<void> {
  try {
    let localContext = deps.getLocalContext?.() ?? defaultGetLocalContext();
    const usesLegacyTestPath = !deps.durableInsertRow && (deps.getUserContext || deps.insertRow);

    if (usesLegacyTestPath) {
      const getUserContext = deps.getUserContext ?? defaultGetUserContext;
      const insertRow = deps.insertRow ?? defaultInsertRow;
      const remoteContext = await getUserContext().catch(() => localContext);
      const row = buildSelfAuditOutcomeEventRow(input, mergeUserContext(localContext, remoteContext));
      await insertWithLogging("client_insert", row, insertRow);
      return;
    }

    const isProfileSyntheticCacheCold = deps.isProfileSyntheticCacheCold ?? defaultIsProfileSyntheticCacheCold;
    if (!localContext.isSynthetic && isProfileSyntheticCacheCold()) {
      const ensureProfileSyntheticResolved =
        deps.ensureProfileSyntheticResolved ?? defaultEnsureProfileSyntheticResolved;
      await ensureProfileSyntheticResolved();
      localContext = deps.getLocalContext?.() ?? defaultGetLocalContext();
    }

    const localRow = buildSelfAuditOutcomeEventRow(input, localContext);
    const durableInsertRow = deps.durableInsertRow ?? defaultDurableInsertRow;
    const durableResult = await durableInsertRow(localRow);
    if (!durableResult.error) return;

    logInsertFailure("keepalive_insert_failed", durableResult.error);

    const remoteContext = await defaultGetUserContext().catch(() => localContext);
    const fallbackRow = buildSelfAuditOutcomeEventRow(input, mergeUserContext(localContext, remoteContext));
    await insertWithLogging("client_fallback_insert", fallbackRow, deps.insertRow ?? defaultInsertRow);
  } catch (error: unknown) {
    logInsertFailure("write_failed", error);
  }
}

export function buildSelfAuditOutcomeEventRow(
  input: {
    telemetry: Record<string, unknown>;
    targetLanguage: TutorTarget;
  },
  context: UserContext,
): SelfAuditOutcomeEventRow {
  const decision = readDecision(input.telemetry.decision);
  const decidingGate = readSafeToken(input.telemetry.decidingGate, 64);
  const reasonCode = decidingGate
    ? readSafeToken(readGateDecisionReason(input.telemetry.gateDecisions, decidingGate), 96)
    : null;

  return {
    decision,
    deciding_gate: decidingGate,
    failed_rule: decision === "SHOW" ? null : decidingGate,
    reason_code: reasonCode,
    lang_pair: deriveSelfAuditLangPair(context.nativeLanguage, input.targetLanguage),
    is_synthetic: context.isSynthetic,
  };
}

export function deriveSelfAuditLangPair(
  nativeLanguage: string | null,
  targetLanguage: TutorTarget,
): string | null {
  const native = normalizeLanguageCode(nativeLanguage);
  const target = normalizeLanguageCode(targetLanguage);
  if (!native || !target) return null;
  return `${native}-${target}`.slice(0, 17);
}

async function insertWithLogging(
  stage: string,
  row: SelfAuditOutcomeEventRow,
  insertRow: (row: SelfAuditOutcomeEventRow) => Promise<InsertResult>,
): Promise<void> {
  const result = await insertRow(row);
  if (result.error) {
    logInsertFailure(stage, result.error);
  }
}

function readDecision(value: unknown): SelfAuditOutcomeDecision {
  return value === "SHOW_WITH_CAUTION" || value === "REVISE" || value === "BLOCK"
    ? value
    : "SHOW";
}

function readGateDecisionReason(gateDecisions: unknown, gateId: string): unknown {
  if (!gateDecisions || typeof gateDecisions !== "object" || Array.isArray(gateDecisions)) return null;
  const gate = (gateDecisions as Record<string, unknown>)[gateId];
  if (!gate || typeof gate !== "object" || Array.isArray(gate)) return null;
  return (gate as Record<string, unknown>).reasonCode;
}

function readSafeToken(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const token = value.trim().replace(/[^A-Za-z0-9_:-]/g, "");
  return token ? token.slice(0, maxLength) : null;
}

function normalizeLanguageCode(language: string | null | undefined): string {
  const value = String(language ?? "").trim().toLowerCase().replace(/[^a-z-]/g, "");
  return LANGUAGE_CODE_BY_NAME[value] ?? value;
}

function mergeUserContext(localContext: UserContext, remoteContext: UserContext): UserContext {
  return {
    nativeLanguage: remoteContext.nativeLanguage ?? localContext.nativeLanguage,
    isSynthetic: remoteContext.isSynthetic || localContext.isSynthetic,
  };
}

function defaultGetLocalContext(): UserContext {
  if (typeof window === "undefined") return { nativeLanguage: null, isSynthetic: false };

  return {
    nativeLanguage: readNativeLanguageFromLocalStorage(),
    isSynthetic: readSyntheticMarkerFromLocalStorage() || readCachedProfileSyntheticFromLocalStorage(),
  };
}

export function readSelfAuditOutcomeLocalContextForTest(): UserContext {
  return defaultGetLocalContext();
}

function readNativeLanguageFromLocalStorage(): string | null {
  try {
    const direct = window.localStorage.getItem("mercyb:nativeLanguage");
    if (direct) return direct;

    const legacyPair = readJsonObject("mercyb:languagePair") ?? readJsonObject("mercyb:selectedPair");
    const legacyNative = readStringField(legacyPair, "native");
    if (legacyNative) return legacyNative;

    const anonymousPair = readJsonObject("mercyblade.languagePair");
    return readStringField(anonymousPair, "native");
  } catch {
    return null;
  }
}

function readSyntheticMarkerFromLocalStorage(): boolean {
  try {
    return isCorrectionSourceSyntheticMarkerValue(
      window.localStorage.getItem(CORRECTION_SOURCE_SYNTHETIC_MARKER_KEY),
    );
  } catch {
    return false;
  }
}

let profileSyntheticResolutionPromise: Promise<void> | null = null;

function defaultIsProfileSyntheticCacheCold(): boolean {
  if (typeof window === "undefined") return false;
  if (readSyntheticMarkerFromLocalStorage()) return false;

  const { storageKey } = getSupabaseEnvSnapshot();
  const sessionKey = readSessionKeyFromLocalStorage(storageKey);
  if (!sessionKey) return false;

  const cached = readJsonObject(PROFILE_SYNTHETIC_CACHE_KEY);
  return cached?.sessionKey !== sessionKey || typeof cached.isSynthetic !== "boolean";
}

async function defaultEnsureProfileSyntheticResolved(): Promise<void> {
  if (!defaultIsProfileSyntheticCacheCold()) return;
  profileSyntheticResolutionPromise ??= resolveProfileSyntheticCache().finally(() => {
    profileSyntheticResolutionPromise = null;
  });
  await profileSyntheticResolutionPromise;
}

async function resolveProfileSyntheticCache(): Promise<void> {
  if (typeof window === "undefined") return;

  const { storageKey } = getSupabaseEnvSnapshot();
  const sessionKey = readSessionKeyFromLocalStorage(storageKey);
  if (!sessionKey) return;

  const context = await defaultGetUserContext();
  writeProfileSyntheticCache(sessionKey, context.isSynthetic);
}

function readCachedProfileSyntheticFromLocalStorage(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const { storageKey } = getSupabaseEnvSnapshot();
    const sessionKey = readSessionKeyFromLocalStorage(storageKey);
    if (!sessionKey) return false;

    const cached = readJsonObject(PROFILE_SYNTHETIC_CACHE_KEY);
    return cached?.sessionKey === sessionKey && cached.isSynthetic === true;
  } catch {
    return false;
  }
}

function writeProfileSyntheticCache(sessionKey: string, isSynthetic: boolean): void {
  try {
    window.localStorage.setItem(
      PROFILE_SYNTHETIC_CACHE_KEY,
      JSON.stringify({
        sessionKey,
        isSynthetic,
        resolvedAt: new Date().toISOString(),
      }),
    );
  } catch {
    // Cache failures must not affect correction UX.
  }
}

function readJsonObject(key: string): Record<string, unknown> | null {
  const raw = window.localStorage.getItem(key);
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed as Record<string, unknown>
      : null;
  } catch {
    return null;
  }
}

function readStringField(object: Record<string, unknown> | null, key: string): string | null {
  const value = object?.[key];
  return typeof value === "string" && value.trim() ? value : null;
}

async function defaultGetUserContext(): Promise<UserContext> {
  try {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id ?? null;
    if (!userId) return { nativeLanguage: null, isSynthetic: false };

    const { data, error } = await supabase
      .from("profiles")
      .select("native_language,is_synthetic")
      .eq("id", userId)
      .maybeSingle();

    if (error) return { nativeLanguage: null, isSynthetic: false };
    const profile = data as { native_language?: string | null; is_synthetic?: boolean | null } | null;
    return {
      nativeLanguage: profile?.native_language ?? null,
      isSynthetic: profile?.is_synthetic === true,
    };
  } catch {
    return { nativeLanguage: null, isSynthetic: false };
  }
}

async function defaultInsertRow(row: SelfAuditOutcomeEventRow): Promise<InsertResult> {
  const { error } = await supabase.from(SELF_AUDIT_OUTCOME_EVENTS_TABLE).insert(row);
  return { error };
}

async function defaultDurableInsertRow(row: SelfAuditOutcomeEventRow): Promise<InsertResult> {
  if (typeof fetch !== "function") {
    return { error: new Error("fetch_unavailable") };
  }

  try {
    const { supabaseUrl, hasAnonKey, storageKey } = getSupabaseEnvSnapshot();
    const anonKey = String(import.meta.env.VITE_SUPABASE_ANON_KEY ?? "").trim();
    if (!supabaseUrl || !hasAnonKey || !anonKey) {
      return { error: new Error("supabase_env_unavailable") };
    }

    const accessToken = readAccessTokenFromLocalStorage(storageKey) ?? await readAccessTokenFromClient();
    const response = await fetch(
      `${supabaseUrl.replace(/\/$/, "")}/rest/v1/${SELF_AUDIT_OUTCOME_EVENTS_TABLE}`,
      {
        method: "POST",
        keepalive: true,
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${accessToken ?? anonKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify(row),
      },
    );

    if (!response.ok) {
      return {
        error: new Error(`rest_${response.status}: ${(await response.text()).slice(0, 200)}`),
      };
    }

    return { error: null };
  } catch (error: unknown) {
    return { error };
  }
}

function readAccessTokenFromLocalStorage(storageKey: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return readNestedAccessToken(parsed);
  } catch {
    return null;
  }
}

async function readAccessTokenFromClient(): Promise<string | null> {
  try {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  } catch {
    return null;
  }
}

function readNestedAccessToken(value: unknown): string | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  if (typeof record.access_token === "string" && record.access_token) return record.access_token;
  for (const key of ["currentSession", "session"]) {
    const nested = readNestedAccessToken(record[key]);
    if (nested) return nested;
  }
  return null;
}

function readSessionKeyFromLocalStorage(storageKey: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    const userId = readNestedUserId(parsed);
    if (userId) return `user:${userId}`;
    const accessToken = readNestedAccessToken(parsed);
    return accessToken ? `token:${accessToken.slice(0, 32)}` : null;
  } catch {
    return null;
  }
}

function readNestedUserId(value: unknown): string | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const id = readStringField(record, "id");
  if (id) return id;

  const user = readNestedUserId(record.user);
  if (user) return user;

  for (const key of ["currentSession", "session"]) {
    const nested = readNestedUserId(record[key]);
    if (nested) return nested;
  }
  return null;
}

function logInsertFailure(stage: string, error: unknown): void {
  console.warn(LOG_PREFIX, stage, describeError(error));
}

function describeError(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

function startProfileSyntheticCacheWarmup(): void {
  if (typeof window === "undefined") return;
  const mode = String(import.meta.env.MODE ?? "");
  const isVitest = Boolean(import.meta.env.VITEST) || mode === "test";
  if (isVitest) return;

  void defaultEnsureProfileSyntheticResolved().catch((error: unknown) => {
    logInsertFailure("profile_synthetic_cache_warmup_failed", error);
  });

  try {
    supabase.auth.onAuthStateChange(() => {
      void defaultEnsureProfileSyntheticResolved().catch((error: unknown) => {
        logInsertFailure("profile_synthetic_cache_warmup_failed", error);
      });
    });
  } catch {
    // Auth listeners are best-effort; a cold first telemetry event will still wait for resolution.
  }
}

startProfileSyntheticCacheWarmup();
