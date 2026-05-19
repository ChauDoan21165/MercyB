// src/lib/placement/v2/client.ts
//
// Placement Test v2 — typed browser transport for the `placement-session`
// edge function (Phase 2, PR 10).
//
// ── RECONSTRUCTION FLAG #2 (docs ephemeral — same transparency as
//    #712/#718/#724/#728) ──────────────────────────────────────────────
// Transport choice: raw `fetch` to
//   `${VITE_SUPABASE_URL}/functions/v1/placement-session/<route>`
// — the EXACT in-house idiom of `src/lib/billingPortal.ts`
// (getSession → access_token; headers `apikey` + `Authorization: Bearer`;
// AbortController timeout; status-aware JSON parse). Chosen over the more
// common `supabase.functions.invoke(name,{body})` ON PURPOSE, for two
// concrete reasons grounded in the merged PR 9 contract:
//   1. The edge fn is PATH-ROUTED (core.ts routes on `/start` `/answer`
//      … via `url.pathname.replace(/^.*\/placement-session/, "")`);
//      `invoke('placement-session',…)` hits the function ROOT → core.ts
//      router returns 404. We must address sub-paths.
//   2. The contract is STATUS + STRUCTURED-BODY meaningful (401
//      auth_required w/ bilingual copy, 400 validation codes, 404, 409
//      not_finalizable, plus 200 bodies carrying `deduplicated`/
//      `resumed`). `fetch` exposes `res.status` + `res.json()` directly;
//      `invoke` buries non-2xx bodies in `error.context`. billingPortal
//      already set this precedent for a status+JSON edge contract.
// No new knob: this anchors to an EXISTING house file's pattern, it does
// not invent one.
//
// PURE + DI: every non-deterministic input (fetch, the auth token, the
// supabase URL/anon key, the clock for timeout) is injected via
// `PlacementClientConfig`, defaulting to the real browser singletons. So
// the whole client is deterministic + vitest-testable with a fake fetch
// (no network) — the locked DI discipline the engine/orchestrator PRs
// use. UI-free; touches no feature flag (PR 11 owns re-surfacing).

import { supabase } from "@/lib/supabaseClient";

import type {
  AbandonResponse,
  AnswerResponse,
  ClientResponse,
  ClientResult,
  EdgeErrorBody,
  ResultResponse,
  SelfRating,
  SelfRatingResponse,
  StartResponse,
} from "./types";

const DEFAULT_TIMEOUT_MS = 15_000;
const FN_PATH = "/functions/v1/placement-session";

type Route = "/start" | "/self-rating" | "/answer" | "/result" | "/abandon";

/** The injectable seam. Real defaults resolve lazily so importing this
 *  module never touches `import.meta.env` / the network at module load. */
export interface PlacementClientConfig {
  /** Fetch implementation (default: global `fetch`). */
  fetchImpl: typeof fetch;
  /** Returns the signed-in user's access token, or null if unauthed. */
  getAccessToken: () => Promise<string | null>;
  /** Supabase project URL (default: `VITE_SUPABASE_URL`). */
  supabaseUrl: string;
  /** Anon apikey header (default: `VITE_SUPABASE_ANON_KEY`). */
  anonKey: string;
  /** Per-request timeout. */
  timeoutMs: number;
}

function envStr(key: string): string {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return String((import.meta as any)?.env?.[key] ?? "").trim();
  } catch {
    return "";
  }
}

function resolveConfig(
  partial?: Partial<PlacementClientConfig>,
): PlacementClientConfig {
  return {
    fetchImpl: partial?.fetchImpl ?? fetch,
    getAccessToken:
      partial?.getAccessToken ??
      (async () => {
        const { data, error } = await supabase.auth.getSession();
        if (error) return null;
        return data.session?.access_token ?? null;
      }),
    supabaseUrl: partial?.supabaseUrl ?? envStr("VITE_SUPABASE_URL"),
    anonKey: partial?.anonKey ?? envStr("VITE_SUPABASE_ANON_KEY"),
    timeoutMs: partial?.timeoutMs ?? DEFAULT_TIMEOUT_MS,
  };
}

function mapErrorBody(
  status: number,
  body: EdgeErrorBody | null,
): ClientResult<never> {
  const code = body?.error ?? "";
  if (status === 401 || code === "auth_required") {
    return {
      ok: false,
      error: {
        kind: "auth_required",
        message: body?.message ?? "Sign in to take the placement test.",
        messageVi:
          body?.message_vi ??
          "Vui lòng đăng nhập để làm bài kiểm tra xếp lớp.",
      },
    };
  }
  if (status === 400) {
    return { ok: false, error: { kind: "validation", code: code || "bad_request" } };
  }
  if (status === 404) return { ok: false, error: { kind: "not_found" } };
  if (status === 409) {
    return { ok: false, error: { kind: "conflict", phase: body?.phase } };
  }
  return {
    ok: false,
    error: { kind: "server", status, code: code || undefined },
  };
}

async function callEdge<T>(
  route: Route,
  payload: Record<string, unknown>,
  cfg: PlacementClientConfig,
): Promise<ClientResult<T>> {
  if (!cfg.supabaseUrl || !cfg.anonKey) {
    return { ok: false, error: { kind: "server", status: 0, code: "missing_env" } };
  }

  const token = await cfg.getAccessToken();
  if (!token) {
    return {
      ok: false,
      error: {
        kind: "auth_required",
        message: "Sign in to take the placement test.",
        messageVi: "Vui lòng đăng nhập để làm bài kiểm tra xếp lớp.",
      },
    };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), cfg.timeoutMs);

  let res: Response;
  try {
    res = await cfg.fetchImpl(`${cfg.supabaseUrl}${FN_PATH}${route}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: cfg.anonKey,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } catch (err) {
    return {
      ok: false,
      error: {
        kind:
          err instanceof Error && err.name === "AbortError"
            ? "timeout"
            : "network",
      },
    };
  } finally {
    clearTimeout(timer);
  }

  let body: unknown = null;
  try {
    body = await res.json();
  } catch {
    if (res.ok) {
      return { ok: false, error: { kind: "bad_response", status: res.status } };
    }
  }

  if (!res.ok) {
    return mapErrorBody(res.status, body as EdgeErrorBody | null);
  }
  return { ok: true, data: body as T };
}

/** The PR-11-facing surface (also what flow.ts depends on / tests fake). */
export interface PlacementClient {
  start(opts?: { selfRating?: SelfRating }): Promise<ClientResult<StartResponse>>;
  selfRating(
    sessionId: string,
    rating: SelfRating,
  ): Promise<ClientResult<SelfRatingResponse>>;
  answer(
    sessionId: string,
    response: ClientResponse,
  ): Promise<ClientResult<AnswerResponse>>;
  result(sessionId: string): Promise<ClientResult<ResultResponse>>;
  abandon(sessionId: string): Promise<ClientResult<AbandonResponse>>;
}

export function createPlacementClient(
  partial?: Partial<PlacementClientConfig>,
): PlacementClient {
  const cfg = resolveConfig(partial);
  return {
    start: (opts) =>
      callEdge<StartResponse>(
        "/start",
        opts?.selfRating ? { selfRating: opts.selfRating } : {},
        cfg,
      ),
    selfRating: (sessionId, rating) =>
      callEdge<SelfRatingResponse>(
        "/self-rating",
        { sessionId, rating },
        cfg,
      ),
    answer: (sessionId, response) =>
      callEdge<AnswerResponse>("/answer", { sessionId, response }, cfg),
    result: (sessionId) =>
      callEdge<ResultResponse>("/result", { sessionId }, cfg),
    abandon: (sessionId) =>
      callEdge<AbandonResponse>("/abandon", { sessionId }, cfg),
  };
}
