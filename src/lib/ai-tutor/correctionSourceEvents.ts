import { supabase } from "@/lib/supabaseClient";
import type { TutorTarget } from "@/lib/tutor/tutorCopy";

export const CORRECTION_SOURCE_EVENTS_TABLE = "correction_source_events";

export type CorrectionSourceEventSource =
  | "local_corrected"
  | "local_unchanged_server_attempt"
  | "server_corrected"
  | "server_no_correction"
  | "server_failed";

export type CorrectionSourceEventRow = {
  source: CorrectionSourceEventSource;
  lang_pair: string | null;
  is_synthetic: boolean;
};

type UserContext = {
  nativeLanguage: string | null;
  isSynthetic: boolean;
};

type InsertResult = { error: unknown | null };

type CorrectionSourceEventDeps = {
  getUserContext?: () => Promise<UserContext>;
  getLocalContext?: () => UserContext;
  insertRow?: (row: CorrectionSourceEventRow) => Promise<InsertResult>;
};

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

export function classifyCorrectionSourceEvent(input: {
  localStatus: "corrected" | "unchanged" | "needs_ai";
  serverAttempted?: boolean;
  serverSucceeded?: boolean;
}): CorrectionSourceEventSource {
  if (input.localStatus === "corrected") return "local_corrected";
  if (!input.serverAttempted || input.serverSucceeded === undefined) return "local_unchanged_server_attempt";
  return input.serverSucceeded ? "server_corrected" : "server_no_correction";
}

export function deriveCorrectionSourceLangPair(
  nativeLanguage: string | null,
  targetLanguage: TutorTarget,
): string | null {
  const native = normalizeLanguageCode(nativeLanguage);
  const target = normalizeLanguageCode(targetLanguage);
  if (!native || !target) return null;
  return `${native}-${target}`.slice(0, 17);
}

export function recordCorrectionSourceEvent(input: {
  source: CorrectionSourceEventSource;
  targetLanguage: TutorTarget;
}): void {
  void writeCorrectionSourceEvent(input).catch(() => undefined);
}

export async function writeCorrectionSourceEvent(
  input: {
    source: CorrectionSourceEventSource;
    targetLanguage: TutorTarget;
  },
  deps: CorrectionSourceEventDeps = {},
): Promise<void> {
  try {
    const localContext = deps.getLocalContext?.() ?? defaultGetLocalContext();
    const getUserContext = deps.getUserContext ?? defaultGetUserContext;
    const insertRow = deps.insertRow ?? defaultInsertRow;
    const remoteContext = await getUserContext().catch(() => localContext);
    const context = mergeUserContext(localContext, remoteContext);
    const row: CorrectionSourceEventRow = {
      source: input.source,
      lang_pair: deriveCorrectionSourceLangPair(context.nativeLanguage, input.targetLanguage),
      is_synthetic: context.isSynthetic,
    };
    await insertRow(row);
  } catch {
    // Best-effort telemetry only; correction UX must never depend on this row.
  }
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
    isSynthetic: false,
  };
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

async function defaultInsertRow(row: CorrectionSourceEventRow): Promise<InsertResult> {
  const { error } = await supabase.from(CORRECTION_SOURCE_EVENTS_TABLE).insert(row);
  return { error };
}
