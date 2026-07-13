import { supabase } from "@/lib/supabaseClient";
import type { TutorTarget } from "@/lib/tutor/tutorCopy";

export const CORRECTION_SOURCE_EVENTS_TABLE = "correction_source_events";

export type CorrectionSourceEventSource =
  | "local_corrected"
  | "local_unchanged_server_attempt"
  | "server_corrected"
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
  insertRow?: (row: CorrectionSourceEventRow) => Promise<InsertResult>;
};

export function classifyCorrectionSourceEvent(input: {
  localStatus: "corrected" | "unchanged" | "needs_ai";
  serverAttempted?: boolean;
  serverSucceeded?: boolean;
}): CorrectionSourceEventSource {
  if (input.localStatus === "corrected") return "local_corrected";
  if (!input.serverAttempted || input.serverSucceeded === undefined) return "local_unchanged_server_attempt";
  return input.serverSucceeded ? "server_corrected" : "server_failed";
}

export function deriveCorrectionSourceLangPair(
  nativeLanguage: string | null,
  targetLanguage: TutorTarget,
): string | null {
  const native = String(nativeLanguage ?? "").trim().toLowerCase().replace(/[^a-z-]/g, "");
  const target = String(targetLanguage ?? "").trim().toLowerCase().replace(/[^a-z-]/g, "");
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
    const getUserContext = deps.getUserContext ?? defaultGetUserContext;
    const insertRow = deps.insertRow ?? defaultInsertRow;
    const context = await getUserContext();
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
