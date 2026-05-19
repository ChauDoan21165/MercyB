// supabase/functions/placement-session/index.ts
//
// Placement Test v2 — Deno entrypoint (Phase 2, PR 9).
//
// Thin wiring only: real Supabase service-role `Deps` (all SQL row-shape
// knowledge lives HERE, behind the seam) + `serve(wrapHandler(...))`.
// The pure orchestration is core.ts. SAME split as mock-interview /
// azure-phoneme; tsconfig.functions.json was PRE-WIRED in PR-V2-4 to
// exclude this file (Deno-URL imports are Node-tsc-unresolvable) with
// the comment "Logic lives in core.ts (vitest-tested)".
//
// SECURITY: placement_items / its content jsonb hold the ANSWER KEY
// (correctOptionId, listening transcript, IRT params). They are read
// ONLY here via the service-role client and reduced to `PublicItem` by
// core.ts before anything leaves the server (locked Q1/Q2). RLS on the
// placement_* tables is the second line; the service-role key bypasses
// RLS by design for this server-only path.
//
// Row→domain mapping is "the edge fn's job" (placement_items
// migration:13). The placement_* tables were applied via the Supabase
// SQL Editor (Phase-2 manual gate) and are intentionally absent from
// _shared/database.types.ts, so this file uses an UNTYPED client
// (mock-interview/index.ts precedent) — type-safety here is the Deno
// gate's job, not Node tsc's.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

import { getUserFromAuthHeader } from "../_shared/security.ts";
import { wrapHandler } from "../_shared/sentry.ts";

import {
  type Deps,
  handleRequest,
  type LegacySnapshot,
} from "./core.ts";
import type {
  ItemType,
  PlacementHistoryEntry,
  SessionState,
} from "./types.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
// Untyped on purpose — see header (placement_* not in database.types.ts).
// deno-lint-ignore no-explicit-any
const db: any = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

const ZERO_TYPE_COUNTS: () => Record<ItemType, number> = () => ({
  reading: 0,
  listening: 0,
  grammar: 0,
  vocabulary: 0,
  writing_sample: 0,
});

const ALL_ITEM_TYPES: ReadonlyArray<ItemType> = [
  "reading",
  "listening",
  "grammar",
  "vocabulary",
  "writing_sample",
];

function isoOrNow(v: unknown): string {
  if (typeof v === "string" && v.length > 0) {
    const d = new Date(v);
    if (!Number.isNaN(d.getTime())) return d.toISOString();
  }
  return new Date().toISOString();
}

function numOrNull(v: unknown): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

// ── placement_items row → engine `Item` (+ a non-Item `bankVersion`
//    tag core.ts filters on; buildItemBank ignores unknown fields and
//    rejects anything malformed, so this stays a loose pass-through). ──
// deno-lint-ignore no-explicit-any
function rowToRawItem(row: any): unknown {
  const content = (row?.content ?? {}) as Record<string, unknown>;
  return {
    bankVersion: row?.bank_version ?? "",
    id: row?.id,
    type: row?.item_type,
    cefr: row?.cefr_level,
    difficulty: typeof row?.difficulty === "string"
      ? Number(row.difficulty)
      : row?.difficulty,
    discrimination: typeof row?.discrimination === "string"
      ? Number(row.discrimination)
      : row?.discrimination,
    skill: content.skill,
    prompt: content.prompt,
    passage: content.passage,
    options: content.options,
    correctOptionId: content.correctOptionId,
    audio: content.audio,
    transcript: content.transcript,
    isL1TransferDistractor: row?.is_l1_transfer ?? false,
    l1Tags: content.l1_tags,
    meta: content.meta ?? {
      author: "unknown",
      cefrDescriptor: "",
      paramSource: (content.param_source as string) ?? "expert",
      displayPreference: "en_first",
    },
  };
}

// ── placement_sessions (+ placement_responses) → SessionState ──────────
// `currentItemId` is ALWAYS null and administered/servedItemIds/
// typeCounts are rebuilt from the append-only response rows — the schema
// persists nothing else (core.ts flag #4 reconstructs the live anchor).
// deno-lint-ignore no-explicit-any
function rowToSession(sess: any, resps: any[]): SessionState {
  const ordered = [...(resps ?? [])].sort(
    (a, b) => (a?.seq ?? 0) - (b?.seq ?? 0),
  );
  const administered: SessionState["administered"] = ordered.map((r) => {
    const out: SessionState["administered"][number] = {
      itemId: String(r?.item_id ?? ""),
      correct: r?.correct === null || r?.correct === undefined
        ? null
        : Boolean(r.correct),
      responseMs: typeof r?.response_ms === "number" ? r.response_ms : 0,
      timedOut: Boolean(r?.timed_out),
      l1RevealedUsed: Boolean(r?.l1_revealed),
      shownAt: isoOrNow(r?.shown_at),
      answeredAt: isoOrNow(r?.answered_at),
    };
    if (typeof r?.selected_option_id === "string") {
      out.selectedOptionId = r.selected_option_id;
    }
    if (typeof r?.audio_plays === "number") out.audioPlays = r.audio_plays;
    return out;
  });

  const typeCounts = ZERO_TYPE_COUNTS();
  for (const r of ordered) {
    const t = r?.item_type as ItemType | undefined;
    if (t && ALL_ITEM_TYPES.includes(t)) typeCounts[t] += 1;
  }

  const theta = numOrNull(
    typeof sess?.theta === "string" ? Number(sess.theta) : sess?.theta,
  );
  const se = numOrNull(
    typeof sess?.theta_se === "string" ? Number(sess.theta_se) : sess?.theta_se,
  );
  const priorMean = numOrNull(
    typeof sess?.prior_mean === "string"
      ? Number(sess.prior_mean)
      : sess?.prior_mean,
  );

  return {
    sessionId: String(sess?.id ?? ""),
    userId: String(sess?.user_id ?? ""),
    bankVersion: String(sess?.bank_version ?? ""),
    phase: sess?.phase ?? "in_progress",
    selfRating: sess?.self_rating ?? null,
    priorMean: priorMean ?? 0,
    administered,
    servedItemIds: administered.map((a) => a.itemId),
    current: {
      theta: theta ?? 0,
      // No persisted SE ⇒ +Infinity so a half-rebuilt mid-test state
      // never precision-stops (advance re-estimates anyway; /result on a
      // complete session has a real persisted theta_se).
      se: se ?? Number.POSITIVE_INFINITY,
      method: "eap",
      iterations: 0,
      converged: theta !== null,
    },
    currentItemId: null,
    typeCounts,
    startedAt: isoOrNow(sess?.started_at),
    updatedAt: isoOrNow(sess?.updated_at),
  };
}

function sessionUpsertRow(s: SessionState) {
  const se = Number.isFinite(s.current.se) ? s.current.se : null;
  const completed = s.phase === "complete";
  return {
    id: s.sessionId,
    user_id: s.userId,
    bank_version: s.bankVersion,
    self_rating: s.selfRating,
    phase: s.phase,
    prior_mean: s.priorMean,
    theta: s.current.theta,
    theta_se: se,
    started_at: s.startedAt,
    updated_at: s.updatedAt,
    ...(completed ? { completed_at: s.updatedAt } : {}),
  };
}

// ── Real Deps ──────────────────────────────────────────────────────────

const deps: Deps = {
  getUser: async (req) => {
    const u = await getUserFromAuthHeader(req);
    return u ? { id: u.id } : null;
  },

  loadActiveItems: async () => {
    const { data, error } = await db
      .from("placement_items")
      .select(
        "id,bank_version,active,item_type,cefr_level,difficulty," +
          "discrimination,is_l1_transfer,content",
      )
      .eq("active", true);
    if (error) {
      console.error("[placement-session] loadActiveItems:", error.message);
      return { rawItems: [], activeVersions: [] };
    }
    const rows = (data ?? []) as unknown[];
    const activeVersions = [
      ...new Set(
        rows
          // deno-lint-ignore no-explicit-any
          .map((r: any) => String(r?.bank_version ?? ""))
          .filter((v) => v.length > 0),
      ),
    ];
    const envVersion = Deno.env.get("PLACEMENT_BANK_VERSION") || undefined;
    return {
      rawItems: rows.map(rowToRawItem),
      activeVersions,
      envVersion,
    };
  },

  loadSession: async (sessionId, userId) => {
    const { data: sess, error } = await db
      .from("placement_sessions")
      .select("*")
      .eq("id", sessionId)
      .eq("user_id", userId)
      .maybeSingle();
    if (error || !sess) return null;
    const { data: resps } = await db
      .from("placement_responses")
      .select("*")
      .eq("session_id", sessionId)
      .order("seq", { ascending: true });
    return rowToSession(sess, (resps ?? []) as unknown[] as any[]);
  },

  loadLatestUnfinished: async (userId) => {
    const { data: sess, error } = await db
      .from("placement_sessions")
      .select("*")
      .eq("user_id", userId)
      .in("phase", ["awaiting_self_rating", "in_progress"])
      .order("started_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error || !sess) return null;
    const { data: resps } = await db
      .from("placement_responses")
      .select("*")
      .eq("session_id", sess.id)
      .order("seq", { ascending: true });
    return rowToSession(sess, (resps ?? []) as unknown[] as any[]);
  },

  persistSession: async (session) => {
    const { error } = await db
      .from("placement_sessions")
      .upsert(sessionUpsertRow(session), { onConflict: "id" });
    if (error) {
      throw new Error(`persistSession: ${error.message}`);
    }
  },

  appendResponse: async ({ session, response, seq, itemType, itemCefr }) => {
    const { error } = await db.from("placement_responses").insert({
      session_id: session.sessionId,
      user_id: session.userId,
      item_id: response.itemId,
      item_type: itemType,
      item_cefr: itemCefr,
      seq,
      correct: response.correct,
      selected_option_id: response.selectedOptionId ?? null,
      response_ms: response.responseMs,
      timed_out: response.timedOut,
      l1_revealed: response.l1RevealedUsed,
      audio_plays: response.audioPlays ?? null,
      shown_at: response.shownAt,
      answered_at: response.answeredAt,
    });
    if (error) {
      throw new Error(`appendResponse: ${error.message}`);
    }
  },

  loadPrevHistory: async (userId, excludeSessionId) => {
    const { data, error } = await db
      .from("profiles")
      .select("placement_history")
      .eq("id", userId)
      .maybeSingle();
    if (error || !data) return null;
    const hist = Array.isArray(data.placement_history)
      ? (data.placement_history as PlacementHistoryEntry[])
      : [];
    const prior = hist
      .filter((h) => h && h.sessionId !== excludeSessionId)
      .sort((a, b) => Date.parse(b.ts) - Date.parse(a.ts));
    return prior.length > 0 ? prior[0] : null;
  },

  writeCompletion: async (
    { session, historyEntry, snapshot, terminationReason },
  ) => {
    // 1. session row → complete (+ θ/se/cefr/termination_reason/
    //    completed_at). `session.phase` is already "complete".
    const se = Number.isFinite(session.current.se)
      ? session.current.se
      : null;
    const { error: sErr } = await db
      .from("placement_sessions")
      .upsert(
        {
          ...sessionUpsertRow(session),
          theta_se: se,
          cefr: snapshot.cefr,
          termination_reason: terminationReason,
          completed_at: session.updatedAt,
        },
        { onConflict: "id" },
      );
    if (sErr) throw new Error(`writeCompletion.session: ${sErr.message}`);

    // 2. append the placement_history entry + 3. write the shared
    //    profiles snapshot (flag #3) — read-modify-write the jsonb log.
    const { data: prof } = await db
      .from("profiles")
      .select("placement_history")
      .eq("id", session.userId)
      .maybeSingle();
    const hist = Array.isArray(prof?.placement_history)
      ? (prof.placement_history as PlacementHistoryEntry[])
      : [];
    const already = hist.some(
      (h) => h && h.sessionId === historyEntry.sessionId,
    );
    const nextHist = already ? hist : [...hist, historyEntry];

    const snap: LegacySnapshot = snapshot;
    const { error: pErr } = await db
      .from("profiles")
      .update({
        placement_history: nextHist,
        placement_cefr: snap.cefr,
        placement_score: snap.score,
        placement_starting_room: snap.startingRoom,
        placement_completed_at: snap.completedAt,
        placement_weaknesses: snap.weaknessTags,
      })
      .eq("id", session.userId);
    if (pErr) throw new Error(`writeCompletion.profile: ${pErr.message}`);
  },

  newSessionId: () => crypto.randomUUID(),
  now: () => new Date().toISOString(),
  rng: () => Math.random(),
  warn: (msg, meta) => console.warn("[placement-session]", msg, meta ?? ""),
};

serve(wrapHandler("placement-session", (req) => handleRequest(req, deps)));
