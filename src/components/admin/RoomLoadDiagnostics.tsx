/**
 * Path: src/components/admin/RoomLoadDiagnostics.tsx
 * File: RoomLoadDiagnostics.tsx
 */

import { useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Loader2,
  RefreshCw,
  Search,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabaseClient";
import { ROOMS_TABLE } from "@/lib/constants/rooms";
import { canonicalizeRoomId, loadRoomJson } from "@/lib/roomJsonResolver";
import { useAdminAccess } from "@/hooks/admin/useAdminAccess";
import { useUserAccess } from "@/hooks/useUserAccess";

type AnyRoomJson = {
  id?: string;
  tier?: string;
  title?: { en?: string; vi?: string };
  intro?: { en?: string; vi?: string };
  name?: string;
  name_vi?: string;
  intro_text?: string;
  intro_vi?: string;
  description?: string;
  description_vi?: string;
  title_en?: string;
  title_vi?: string;
  intro_en?: string;
  path?: string;
  entries?: unknown[];
};

type DbRoomMatch = {
  id: string;
  tier: string | null;
  title_en: string | null;
  title_vi: string | null;
};

type AttemptResult = {
  candidate: string;
  ok: boolean;
  elapsedMs: number;
  resolvedRoomId: string | null;
  entryCount: number | null;
  title: string | null;
  errorKind: string | null;
  errorMessage: string | null;
  status: number | null;
};

type DiagnosticRun = {
  requestedRoomId: string;
  requestKey: string;
  canonicalRoomId: string;
  startedAtIso: string;
  totalElapsedMs: number;
  success: boolean;
  succeededCandidate: string | null;
  attempts: AttemptResult[];
  dbMatches: DbRoomMatch[];
  notes: string[];
};

const successfulCandidateCache = new Map<string, string>();

function stripJsonSuffix(value: string): string {
  return String(value || "").replace(/\.json$/i, "");
}

function lastPathSegment(value: string): string {
  const cleaned = String(value || "").trim();
  if (!cleaned) return "";

  const withoutQuery = cleaned.split("?")[0] || cleaned;
  const withoutHash = withoutQuery.split("#")[0] || withoutQuery;
  const parts = withoutHash.split("/").filter(Boolean);

  return parts.length ? parts[parts.length - 1] : withoutHash;
}

function sanitizeRoomIdKeepHyphen(input: string): string {
  return stripJsonSuffix(String(input || ""))
    .trim()
    .toLowerCase()
    .replace(/["'`]+/g, "")
    .replace(/[^\w\s-]+/g, "_")
    .replace(/[\s]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/-+/g, "-")
    .replace(/^[_-]+|[_-]+$/g, "");
}

function hyphenVariant(input: string): string {
  return String(input || "").replace(/_+/g, "-").replace(/-+/g, "-");
}

function underscoreVariant(input: string): string {
  return String(input || "").replace(/-+/g, "_").replace(/_+/g, "_");
}

function coreRoomIdVariant(input: string): string {
  return String(input || "").replace(
    /(?:[_-](?:vip[1-9]|free|kids[_-]?[123]|kidslevel[123]|kids_l[123]|vip3[_-]?ii))$/i,
    "",
  );
}

function toRoomRequestCacheKey(input: string): string {
  const rawSegment = stripJsonSuffix(lastPathSegment(String(input || ""))).trim();
  const canonical = canonicalizeRoomId(rawSegment);
  if (canonical) return canonical;

  const safeRaw = sanitizeRoomIdKeepHyphen(rawSegment);
  if (safeRaw) return safeRaw;

  return stripJsonSuffix(String(input || "")).trim().toLowerCase();
}

function buildRoomIdCandidates(input: string): string[] {
  const rawSegment = stripJsonSuffix(lastPathSegment(String(input || ""))).trim();
  const safeRaw = sanitizeRoomIdKeepHyphen(rawSegment);
  const canonical = canonicalizeRoomId(rawSegment);
  const hyphenSafe = hyphenVariant(safeRaw);
  const hyphenFromCanonical = hyphenVariant(canonical);
  const lowerRaw = stripJsonSuffix(rawSegment).trim().toLowerCase();

  const ordered = [
    rawSegment,
    lowerRaw,
    safeRaw,
    hyphenSafe,
    canonical,
    hyphenFromCanonical,

    coreRoomIdVariant(rawSegment),
    coreRoomIdVariant(lowerRaw),
    coreRoomIdVariant(safeRaw),
    coreRoomIdVariant(hyphenSafe),
    coreRoomIdVariant(canonical),
    coreRoomIdVariant(hyphenFromCanonical),

    underscoreVariant(coreRoomIdVariant(hyphenSafe)),
    hyphenVariant(coreRoomIdVariant(canonical)),
  ];

  const seen = new Set<string>();
  const out: string[] = [];

  for (const value of ordered) {
    const candidate = String(value || "").trim();
    if (!candidate) continue;
    if (seen.has(candidate)) continue;
    seen.add(candidate);
    out.push(candidate);
  }

  return out;
}

function buildPrioritizedRoomIdCandidates(input: string): string[] {
  const requestKey = toRoomRequestCacheKey(input);
  const cachedCandidate = successfulCandidateCache.get(requestKey);
  const canonical = canonicalizeRoomId(input);
  const generated = buildRoomIdCandidates(input);

  const ordered = [cachedCandidate, canonical, ...generated];
  const seen = new Set<string>();
  const out: string[] = [];

  for (const value of ordered) {
    const candidate = String(value || "").trim();
    if (!candidate) continue;
    if (seen.has(candidate)) continue;
    seen.add(candidate);
    out.push(candidate);
  }

  return out;
}

function rememberSuccessfulCandidate(
  requestKey: string,
  requestedRoomId: string,
  candidate: string,
): void {
  const keys = [
    requestKey,
    toRoomRequestCacheKey(requestedRoomId),
    toRoomRequestCacheKey(candidate),
  ];

  for (const key of keys) {
    const normalized = String(key || "").trim();
    if (!normalized) continue;
    successfulCandidateCache.set(normalized, candidate);
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object";
}

function cleanText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function unwrapLoadedRoomPayload(payload: unknown): AnyRoomJson | null {
  if (!isObject(payload)) return null;

  const wrappedRoom = payload.room;
  if (isObject(wrappedRoom)) {
    return wrappedRoom as AnyRoomJson;
  }

  return payload as AnyRoomJson;
}

function hasUsableRoomPayload(json: AnyRoomJson | null): json is AnyRoomJson {
  if (!json || !isObject(json)) return false;

  if (Array.isArray(json.entries) && json.entries.length > 0) return true;
  if (cleanText(json.id)) return true;
  if (cleanText(json.title_en)) return true;
  if (cleanText(json.title_vi)) return true;
  if (cleanText(json.name)) return true;
  if (cleanText(json.name_vi)) return true;
  if (cleanText(json.intro_en)) return true;
  if (cleanText(json.intro_vi)) return true;
  if (cleanText(json.description)) return true;
  if (cleanText(json.description_vi)) return true;

  const title = isObject(json.title) ? json.title : null;
  if (title && (cleanText(title.en) || cleanText(title.vi))) return true;

  const intro = isObject(json.intro) ? json.intro : null;
  if (intro && (cleanText(intro.en) || cleanText(intro.vi))) return true;

  return false;
}

function extractErrorMeta(error: unknown): {
  kind: string | null;
  message: string | null;
  status: number | null;
} {
  if (isObject(error)) {
    const kind = cleanText(error.kind) || null;
    const message = cleanText(error.message) || cleanText(error.error) || null;
    const rawStatus = error.status;
    const status =
      typeof rawStatus === "number" && Number.isFinite(rawStatus) ? rawStatus : null;

    return {
      kind,
      message,
      status,
    };
  }

  if (error instanceof Error) {
    return {
      kind: null,
      message: cleanText(error.message) || "Unknown error",
      status: null,
    };
  }

  if (typeof error === "string") {
    return {
      kind: null,
      message: cleanText(error) || "Unknown error",
      status: null,
    };
  }

  return {
    kind: null,
    message: "Unknown error",
    status: null,
  };
}

function pickRoomTitle(json: AnyRoomJson | null): string | null {
  if (!json) return null;

  return (
    cleanText(json.title?.en) ||
    cleanText(json.title_en) ||
    cleanText(json.name) ||
    cleanText(json.title?.vi) ||
    cleanText(json.title_vi) ||
    cleanText(json.name_vi) ||
    null
  );
}

function formatMs(value: number): string {
  if (!Number.isFinite(value)) return "—";
  return `${value.toFixed(value >= 100 ? 0 : 1)} ms`;
}

function summarizeNotes(run: {
  attempts: AttemptResult[];
  dbMatches: DbRoomMatch[];
  success: boolean;
  succeededCandidate: string | null;
}): string[] {
  const notes: string[] = [];

  if (run.success && run.attempts.length === 1) {
    notes.push("Fast path: the first candidate loaded successfully.");
  }

  if (run.success && run.attempts.length > 1) {
    notes.push(
      `Fallback path used: ${run.attempts.length} candidates were tried before success.`,
    );
  }

  if (!run.success && run.dbMatches.length === 0) {
    notes.push("No matching room row was found in the database for the candidates tested.");
  }

  if (!run.success && run.dbMatches.length > 0) {
    notes.push("Database row exists, so the failure is likely in the secure loader or room JSON path.");
  }

  const statusCounts = new Map<number, number>();
  for (const attempt of run.attempts) {
    if (typeof attempt.status === "number") {
      statusCounts.set(attempt.status, (statusCounts.get(attempt.status) || 0) + 1);
    }
  }

  if (statusCounts.has(401)) {
    notes.push("One or more attempts returned 401 Unauthorized.");
  }
  if (statusCounts.has(403)) {
    notes.push("One or more attempts returned 403 Access Denied.");
  }
  if (statusCounts.has(404)) {
    notes.push("One or more attempts returned 404 Not Found.");
  }
  if (statusCounts.has(429)) {
    notes.push("One or more attempts returned 429 Rate Limited.");
  }
  if (statusCounts.has(500)) {
    notes.push("One or more attempts returned 500 Server Error.");
  }

  if (run.success && run.succeededCandidate) {
    notes.push(`Winning candidate: ${run.succeededCandidate}`);
  }

  if (notes.length === 0) {
    notes.push("No extra notes yet. Run a test to inspect actual loader behavior.");
  }

  return notes;
}

async function fetchDbMatches(candidates: string[]): Promise<DbRoomMatch[]> {
  const safeCandidates = Array.from(
    new Set(candidates.map((candidate) => cleanText(candidate)).filter(Boolean)),
  );

  if (safeCandidates.length === 0) return [];

  const { data, error } = await supabase
    .from(ROOMS_TABLE)
    .select("id, tier, title_en, title_vi")
    .in("id", safeCandidates);

  if (error) throw error;

  return ((data || []) as DbRoomMatch[]).sort((a, b) => a.id.localeCompare(b.id));
}

export function RoomLoadDiagnostics() {
  const admin = useAdminAccess();
  const access = useUserAccess();

  const [roomIdInput, setRoomIdInput] = useState("");
  const [running, setRunning] = useState(false);
  const [run, setRun] = useState<DiagnosticRun | null>(null);
  const [history, setHistory] = useState<DiagnosticRun[]>([]);
  const [fatalError, setFatalError] = useState<string | null>(null);

  const canRun = roomIdInput.trim().length > 0 && !running;

  const runDiagnostic = async (requestedRoomId: string) => {
    const safeInput = cleanText(requestedRoomId);
    if (!safeInput) return;

    setRunning(true);
    setFatalError(null);

    const startedAtIso = new Date().toISOString();
    const totalStart = performance.now();

    try {
      const requestKey = toRoomRequestCacheKey(safeInput);
      const canonicalRoomId = canonicalizeRoomId(safeInput);
      const candidates = buildPrioritizedRoomIdCandidates(safeInput);

      const dbMatchesPromise = fetchDbMatches(candidates);

      const attempts: AttemptResult[] = [];
      let succeededCandidate: string | null = null;

      for (const candidate of candidates) {
        const attemptStart = performance.now();

        try {
          const payload = await loadRoomJson(candidate);
          const json = unwrapLoadedRoomPayload(payload);

          if (!hasUsableRoomPayload(json)) {
            throw new Error("room_fetch_failed");
          }

          const elapsedMs = performance.now() - attemptStart;
          const resolvedRoomId =
            cleanText(json.id) || cleanText(lastPathSegment(candidate)) || null;
          const entryCount = Array.isArray(json.entries) ? json.entries.length : null;
          const title = pickRoomTitle(json);

          attempts.push({
            candidate,
            ok: true,
            elapsedMs,
            resolvedRoomId,
            entryCount,
            title,
            errorKind: null,
            errorMessage: null,
            status: null,
          });

          succeededCandidate = candidate;
          rememberSuccessfulCandidate(requestKey, safeInput, candidate);
          break;
        } catch (error: unknown) {
          const elapsedMs = performance.now() - attemptStart;
          const meta = extractErrorMeta(error);

          attempts.push({
            candidate,
            ok: false,
            elapsedMs,
            resolvedRoomId: null,
            entryCount: null,
            title: null,
            errorKind: meta.kind,
            errorMessage: meta.message,
            status: meta.status,
          });
        }
      }

      const dbMatches = await dbMatchesPromise;
      const totalElapsedMs = performance.now() - totalStart;
      const success = Boolean(succeededCandidate);

      const nextRun: DiagnosticRun = {
        requestedRoomId: safeInput,
        requestKey,
        canonicalRoomId,
        startedAtIso,
        totalElapsedMs,
        success,
        succeededCandidate,
        attempts,
        dbMatches,
        notes: summarizeNotes({
          attempts,
          dbMatches,
          success,
          succeededCandidate,
        }),
      };

      setRun(nextRun);
      setHistory((prev) => [nextRun, ...prev].slice(0, 8));
    } catch (error: unknown) {
      const meta = extractErrorMeta(error);
      setFatalError(meta.message || "Room diagnostic failed.");
    } finally {
      setRunning(false);
    }
  };

  const latestSuccessfulCandidate = useMemo(() => {
    if (!run?.requestKey) return null;
    return successfulCandidateCache.get(run.requestKey) || null;
  }, [run]);

  return (
    <Card className="border-2 border-black bg-white p-6">
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-black">Room Load Diagnostics</h2>
            <p className="mt-1 text-sm text-gray-600">
              Inspect the real room-load candidate chain, timing, and DB match state for one room id.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge className={admin.permissions.isAdmin ? "bg-green-600 text-white" : "bg-gray-200 text-black"}>
              <ShieldCheck className="mr-1 h-3 w-3" />
              Admin {admin.permissions.isAdmin ? `L${admin.permissions.level}` : "No"}
            </Badge>

            <Badge className={access.isAdmin ? "bg-blue-600 text-white" : "bg-gray-200 text-black"}>
              User tier: {String(access.tier || "free")}
            </Badge>
          </div>
        </div>

        <div className="grid gap-3 rounded border border-black/10 bg-gray-50 p-4 md:grid-cols-[1fr_auto_auto]">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-black">Room ID or path</span>
            <input
              value={roomIdInput}
              onChange={(e) => setRoomIdInput(e.target.value)}
              placeholder="example: anxiety_at_work_vip3"
              className="w-full rounded border border-black/20 bg-white px-3 py-2 text-sm outline-none transition focus:border-black"
            />
          </label>

          <div className="flex items-end">
            <Button
              onClick={() => void runDiagnostic(roomIdInput)}
              disabled={!canRun}
              className="min-w-[140px] bg-black text-white hover:bg-black/85"
            >
              {running ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Run test
                </>
              )}
            </Button>
          </div>

          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => {
                if (run?.requestedRoomId) {
                  setRoomIdInput(run.requestedRoomId);
                  void runDiagnostic(run.requestedRoomId);
                }
              }}
              disabled={!run?.requestedRoomId || running}
              className="min-w-[140px] border-black text-black hover:bg-gray-100"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Repeat test
            </Button>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <Card className="border border-black/10 p-4">
            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Frontend admin gate
            </div>
            <div className="text-sm text-black">
              {admin.loading ? "Checking…" : admin.permissions.isAdmin ? "Allowed" : "Not admin"}
            </div>
            <div className="mt-1 text-xs text-gray-600">
              email: {admin.email || "—"} · level: {admin.permissions.level}
            </div>
          </Card>

          <Card className="border border-black/10 p-4">
            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
              User access snapshot
            </div>
            <div className="text-sm text-black">
              tier: {String(access.tier || "free")}
            </div>
            <div className="mt-1 text-xs text-gray-600">
              admin: {String(Boolean(access.isAdmin))} · adminLevel: {String(access.adminLevel ?? 0)}
            </div>
          </Card>

          <Card className="border border-black/10 p-4">
            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Cached winner
            </div>
            <div className="text-sm text-black">
              {latestSuccessfulCandidate || "None yet"}
            </div>
            <div className="mt-1 text-xs text-gray-600">
              Next run will try this candidate first when available.
            </div>
          </Card>
        </div>

        {fatalError ? (
          <div className="rounded border border-red-300 bg-red-50 p-4 text-sm text-red-800">
            <div className="mb-1 flex items-center gap-2 font-semibold">
              <AlertCircle className="h-4 w-4" />
              Diagnostic failed
            </div>
            <div>{fatalError}</div>
          </div>
        ) : null}

        {run ? (
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-4">
              <Card className="border border-black/10 p-4">
                <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Result
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-black">
                  {run.success ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Success
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-red-600" />
                      Failed
                    </>
                  )}
                </div>
              </Card>

              <Card className="border border-black/10 p-4">
                <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Total time
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-black">
                  <Clock3 className="h-4 w-4 text-gray-700" />
                  {formatMs(run.totalElapsedMs)}
                </div>
              </Card>

              <Card className="border border-black/10 p-4">
                <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Attempts
                </div>
                <div className="text-sm font-semibold text-black">
                  {run.attempts.length}
                </div>
              </Card>

              <Card className="border border-black/10 p-4">
                <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  DB matches
                </div>
                <div className="text-sm font-semibold text-black">
                  {run.dbMatches.length}
                </div>
              </Card>
            </div>

            <Card className="border border-black/10 p-4">
              <div className="mb-3 text-sm font-semibold text-black">Run summary</div>

              <div className="grid gap-3 text-sm md:grid-cols-2">
                <div>
                  <div className="text-gray-500">Requested room id</div>
                  <div className="font-mono text-black">{run.requestedRoomId}</div>
                </div>

                <div>
                  <div className="text-gray-500">Canonical room id</div>
                  <div className="font-mono text-black">{run.canonicalRoomId || "—"}</div>
                </div>

                <div>
                  <div className="text-gray-500">Request cache key</div>
                  <div className="font-mono text-black">{run.requestKey || "—"}</div>
                </div>

                <div>
                  <div className="text-gray-500">Winning candidate</div>
                  <div className="font-mono text-black">{run.succeededCandidate || "—"}</div>
                </div>
              </div>

              <div className="mt-4 rounded border border-black/10 bg-gray-50 p-3">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Notes
                </div>
                <ul className="space-y-1 text-sm text-black">
                  {run.notes.map((note) => (
                    <li key={note}>• {note}</li>
                  ))}
                </ul>
              </div>
            </Card>

            <Card className="border border-black/10 p-4">
              <div className="mb-3 text-sm font-semibold text-black">Attempt chain</div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-black/10 text-left">
                      <th className="py-2 pr-3 font-semibold text-black">#</th>
                      <th className="py-2 pr-3 font-semibold text-black">Candidate</th>
                      <th className="py-2 pr-3 font-semibold text-black">Result</th>
                      <th className="py-2 pr-3 font-semibold text-black">Time</th>
                      <th className="py-2 pr-3 font-semibold text-black">Resolved ID</th>
                      <th className="py-2 pr-3 font-semibold text-black">Entries</th>
                      <th className="py-2 pr-3 font-semibold text-black">Status</th>
                      <th className="py-2 pr-3 font-semibold text-black">Error</th>
                    </tr>
                  </thead>
                  <tbody>
                    {run.attempts.map((attempt, index) => (
                      <tr
                        key={`${attempt.candidate}-${index}`}
                        className={attempt.ok ? "border-b border-black/5 bg-green-50/50" : "border-b border-black/5 bg-red-50/40"}
                      >
                        <td className="py-2 pr-3 text-black">{index + 1}</td>
                        <td className="py-2 pr-3 font-mono text-black">{attempt.candidate}</td>
                        <td className="py-2 pr-3">
                          {attempt.ok ? (
                            <Badge className="bg-green-600 text-white">OK</Badge>
                          ) : (
                            <Badge variant="destructive">Fail</Badge>
                          )}
                        </td>
                        <td className="py-2 pr-3 text-black">{formatMs(attempt.elapsedMs)}</td>
                        <td className="py-2 pr-3 font-mono text-black">{attempt.resolvedRoomId || "—"}</td>
                        <td className="py-2 pr-3 text-black">
                          {typeof attempt.entryCount === "number" ? attempt.entryCount : "—"}
                        </td>
                        <td className="py-2 pr-3 text-black">
                          {typeof attempt.status === "number" ? attempt.status : "—"}
                        </td>
                        <td className="py-2 pr-3 text-black">
                          {attempt.errorKind || attempt.errorMessage || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card className="border border-black/10 p-4">
              <div className="mb-3 text-sm font-semibold text-black">Database matches</div>

              {run.dbMatches.length === 0 ? (
                <div className="rounded border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-900">
                  No exact database room rows matched the candidate list tested in this run.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-black/10 text-left">
                        <th className="py-2 pr-3 font-semibold text-black">Room ID</th>
                        <th className="py-2 pr-3 font-semibold text-black">Tier</th>
                        <th className="py-2 pr-3 font-semibold text-black">Title EN</th>
                        <th className="py-2 pr-3 font-semibold text-black">Title VI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {run.dbMatches.map((room) => (
                        <tr key={room.id} className="border-b border-black/5">
                          <td className="py-2 pr-3 font-mono text-black">{room.id}</td>
                          <td className="py-2 pr-3 text-black">{room.tier || "—"}</td>
                          <td className="py-2 pr-3 text-black">{room.title_en || "—"}</td>
                          <td className="py-2 pr-3 text-black">{room.title_vi || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        ) : (
          <div className="rounded border border-black/10 bg-gray-50 p-6 text-sm text-gray-700">
            Enter a room id and run a test. This panel will show candidate order, per-attempt timing,
            the winning candidate, and whether the database has matching room rows.
          </div>
        )}

        <Card className="border border-black/10 p-4">
          <div className="mb-3 text-sm font-semibold text-black">Recent runs</div>

          {history.length === 0 ? (
            <div className="text-sm text-gray-600">No runs yet.</div>
          ) : (
            <div className="space-y-2">
              {history.map((item, index) => (
                <button
                  key={`${item.startedAtIso}-${index}`}
                  type="button"
                  onClick={() => {
                    setRun(item);
                    setRoomIdInput(item.requestedRoomId);
                  }}
                  className="flex w-full items-center justify-between rounded border border-black/10 bg-white px-3 py-2 text-left hover:bg-gray-50"
                >
                  <div>
                    <div className="font-mono text-sm text-black">{item.requestedRoomId}</div>
                    <div className="text-xs text-gray-600">
                      {new Date(item.startedAtIso).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-xs text-gray-600">{formatMs(item.totalElapsedMs)}</div>
                    {item.success ? (
                      <Badge className="bg-green-600 text-white">Success</Badge>
                    ) : (
                      <Badge variant="destructive">Failed</Badge>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </Card>
      </div>
    </Card>
  );
}