#!/usr/bin/env node
// scripts/flywheel/mine-candidates.mjs
//
// Flywheel mining cycle — queries conversation_events for uncovered
// VN→EN interference patterns. Called by the GitLab scheduled pipeline
// `flywheel-mine` (see .gitlab-ci.yml). Abstains if data is thin.
//
// Required CI vars (skip-soft if absent):
//   VITE_SUPABASE_URL         Supabase project REST URL
//   SUPABASE_SERVICE_ROLE_KEY service-role key (bypasses RLS for reads)
//
// Optional:
//   FLYWHEEL_OUT_DIR    output directory (default: _flywheel_out)
//   FLYWHEEL_WINDOW_DAYS  look-back window in days (default: 30)
//
// Outputs to FLYWHEEL_OUT_DIR/:
//   wave-candidates.json   structured candidate list (empty array when abstain)
//   board-summary.md       board-postable markdown summary
//
// Thresholds (from docs/strategy/data-flywheel-loop.md §4):
//   MIN_OCCURRENCES   = 5   (distinct learner-text samples per error_type)
//   MIN_UNIQUE_LEARNERS = 3  (reject single-learner noise)
//
// Exit codes:
//   0   success (including abstain — thin data is not a CI failure)
//   1   fatal config / unexpected error

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { execSync } from "node:child_process";

// ── Config ────────────────────────────────────────────────────────────

const MIN_OCCURRENCES = 5;
const MIN_UNIQUE_LEARNERS = 3;
const ABSTAIN_THRESHOLD = 5; // total events below this → abstain immediately

const OUT_DIR = resolve(process.env.FLYWHEEL_OUT_DIR ?? "_flywheel_out");
const WINDOW_DAYS = Number(process.env.FLYWHEEL_WINDOW_DAYS ?? "30");

// Directories to grep for existing interference coverage.
// Relative to the repo root (CWD when called from CI).
const COVERAGE_DIRS = ["src/lib/interference", "src/lib/tutor", "src/lib/feedback"];

// ── Date window (computed before env check so artifacts can reference it) ─

const now = new Date();
const windowStart = new Date(now.getTime() - WINDOW_DAYS * 24 * 60 * 60 * 1000);
const windowStartIso = windowStart.toISOString();

// ── Env check ─────────────────────────────────────────────────────────

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.log(
    "[flywheel-mine] VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY absent — skipping (exit 0).",
  );
  console.log(
    "[flywheel-mine] Set both CI variables to enable the real mining run.",
  );
  writeArtifacts([], "SKIPPED — CI variables not configured.");
  process.exit(0);
}

// ── Supabase REST helpers ─────────────────────────────────────────────

const BASE = supabaseUrl.replace(/\/$/, "");
const HEADERS = {
  apikey: serviceRoleKey,
  Authorization: `Bearer ${serviceRoleKey}`,
  "Content-Type": "application/json",
  // Return exact count in Content-Range header
  Prefer: "count=exact",
};

async function pgRestGet(path, params = {}) {
  const url = new URL(`${BASE}/rest/v1/${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const res = await fetch(url.toString(), {
    headers: {
      ...HEADERS,
      Range: "0-9999",
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    // 404 / PGRST205 means the table doesn't exist yet — soft return.
    if (res.status === 404 || body.includes("PGRST205") || body.includes("does not exist")) {
      return { rows: null, missing: true };
    }
    throw new Error(`Supabase REST ${res.status} for ${path}: ${body}`);
  }

  const rows = await res.json();
  const contentRange = res.headers.get("content-range") ?? "";
  const total = contentRange.includes("/") ? Number(contentRange.split("/")[1]) : rows.length;
  if (total > 10000) {
    console.warn(
      `[flywheel-mine] WARNING: ${path} returned ${total} total rows — only the first 10 000 are processed. Consider reducing FLYWHEEL_WINDOW_DAYS.`,
    );
  }
  return { rows, missing: false, total };
}

console.log(
  `[flywheel-mine] window: last ${WINDOW_DAYS} days (since ${windowStartIso})`,
);

// ── Fetch error_detected events ───────────────────────────────────────

console.log("[flywheel-mine] querying conversation_events …");

let errorEvents;
try {
  const result = await pgRestGet("conversation_events", {
    // Embed the parent conversation so we get user_id for unique-learner counts.
    select: "error_details,conversations!inner(user_id)",
    event_type: "eq.error_detected",
    created_at: `gte.${windowStartIso}`,
  });

  if (result.missing) {
    console.log(
      "[flywheel-mine] conversation_events table does not exist in prod yet — ABSTAIN.",
    );
    writeArtifacts([], "ABSTAIN — conversation_events table not yet applied. Re-run after B1 migration and E2 consent are live.");
    process.exit(0);
  }

  errorEvents = result.rows;
} catch (err) {
  console.error("[flywheel-mine] fatal: could not fetch events:", err.message);
  process.exit(1);
}

console.log(`[flywheel-mine] fetched ${errorEvents.length} error_detected events`);

if (errorEvents.length < ABSTAIN_THRESHOLD) {
  console.log(
    `[flywheel-mine] ABSTAIN — only ${errorEvents.length} events (threshold ${ABSTAIN_THRESHOLD}). Re-run once more sessions are captured.`,
  );
  writeArtifacts(
    [],
    `ABSTAIN — only ${errorEvents.length} error events in the last ${WINDOW_DAYS} days (threshold: ${ABSTAIN_THRESHOLD}). Re-run once more learner sessions accumulate.`,
  );
  process.exit(0);
}

// ── Fetch correction acceptance events ───────────────────────────────

console.log("[flywheel-mine] querying correction events …");

let correctionEvents = [];
try {
  const result = await pgRestGet("conversation_events", {
    select: "error_details,event_type",
    "event_type": `in.(correction_accepted,correction_rejected)`,
    created_at: `gte.${windowStartIso}`,
  });
  if (!result.missing) correctionEvents = result.rows;
} catch {
  // Non-fatal — acceptance rates just won't be shown
  console.warn("[flywheel-mine] Could not fetch correction events; acceptance rates skipped.");
}

// ── Aggregate by errorType ────────────────────────────────────────────

/**
 * @typedef {{ occurrences: number, uniqueLearners: Set<string>, sampleTexts: string[] }} TypeAgg
 */

/** @type {Map<string, TypeAgg>} */
const byType = new Map();

for (const row of errorEvents) {
  const det = row.error_details ?? {};
  const errorType = (det.errorType ?? det.error_type ?? "").trim();
  if (!errorType) continue;

  const userId = row.conversations?.user_id ?? "unknown";
  const learnerText = (det.learnerText ?? det.learner_text ?? "").trim();

  if (!byType.has(errorType)) {
    byType.set(errorType, { occurrences: 0, uniqueLearners: new Set(), sampleTexts: [] });
  }
  const agg = byType.get(errorType);
  agg.occurrences++;
  if (userId !== "unknown") agg.uniqueLearners.add(userId);
  if (learnerText && agg.sampleTexts.length < 3) {
    agg.sampleTexts.push(learnerText);
  }
}

// Acceptance rates per errorType
const acceptedByType = new Map();
const rejectedByType = new Map();
for (const row of correctionEvents) {
  const det = row.error_details ?? {};
  const errorType = (det.errorType ?? det.error_type ?? "").trim();
  if (!errorType) continue;
  if (row.event_type === "correction_accepted") {
    acceptedByType.set(errorType, (acceptedByType.get(errorType) ?? 0) + 1);
  } else {
    rejectedByType.set(errorType, (rejectedByType.get(errorType) ?? 0) + 1);
  }
}

// ── Filter by thresholds ──────────────────────────────────────────────

/** @type {{ errorType: string, occurrences: number, uniqueLearners: number, acceptanceRate: number|null, sampleTexts: string[], coverageStatus: string, action: string }[]} */
const candidates = [];
/** @type {{ errorType: string, occurrences: number, uniqueLearners: number }[]} */
const watchList = [];

for (const [errorType, agg] of byType) {
  const uniqueLearnersCount = agg.uniqueLearners.size;
  const accepted = acceptedByType.get(errorType) ?? 0;
  const rejected = rejectedByType.get(errorType) ?? 0;
  const total = accepted + rejected;
  const acceptanceRate = total > 0 ? accepted / total : null;

  if (agg.occurrences < MIN_OCCURRENCES || uniqueLearnersCount < MIN_UNIQUE_LEARNERS) {
    watchList.push({ errorType, occurrences: agg.occurrences, uniqueLearners: uniqueLearnersCount });
    continue;
  }

  // Coverage check: grep for the errorType string in known interference dirs
  const coverageStatus = checkCoverage(errorType);
  const action = determineAction(coverageStatus, acceptanceRate);

  candidates.push({
    errorType,
    occurrences: agg.occurrences,
    uniqueLearners: uniqueLearnersCount,
    acceptanceRate: acceptanceRate !== null ? Math.round(acceptanceRate * 100) / 100 : null,
    sampleTexts: agg.sampleTexts,
    coverageStatus,
    action,
  });
}

// Sort by occurrences desc
candidates.sort((a, b) => b.occurrences - a.occurrences);

// ── Coverage check helper ─────────────────────────────────────────────

function checkCoverage(errorType) {
  const sanitized = errorType.replace(/[^a-zA-Z0-9_\-]/g, "");
  if (!sanitized) return "unknown";

  for (const dir of COVERAGE_DIRS) {
    if (!existsSync(dir)) continue;
    try {
      // Grep case-insensitively; exit code 0 = found, 1 = not found
      execSync(`grep -rl "${sanitized}" "${dir}" --include='*.ts' 2>/dev/null`, {
        stdio: "pipe",
        encoding: "utf8",
      });
      return "covered";
    } catch {
      // exit 1 = no match in this dir; continue to next
    }
  }

  // One more pass: check if it's a partial match (gap)
  for (const dir of COVERAGE_DIRS) {
    if (!existsSync(dir)) continue;
    try {
      // Check for the base stem (e.g. "tense" from "tense_omission")
      const stem = sanitized.split(/[_\-]/)[0];
      if (stem.length < 4) continue;
      execSync(`grep -rl "${stem}" "${dir}" --include='*.ts' 2>/dev/null`, {
        stdio: "pipe",
        encoding: "utf8",
      });
      return "partial";
    } catch {
      // No partial match either
    }
  }

  return "missing";
}

function determineAction(coverageStatus, acceptanceRate) {
  if (coverageStatus === "covered") {
    if (acceptanceRate !== null && acceptanceRate < 0.4) return "TUNE";
    return "SKIP";
  }
  if (coverageStatus === "partial") return "TUNE";
  return "NEW";
}

// ── Emit artifacts ────────────────────────────────────────────────────

const runMeta = {
  runAt: now.toISOString(),
  windowDays: WINDOW_DAYS,
  windowStart: windowStartIso,
  totalErrorEvents: errorEvents.length,
  totalTypes: byType.size,
  candidatesAboveThreshold: candidates.length,
  watchListCount: watchList.length,
};

writeArtifacts(candidates, null, runMeta, watchList);

console.log(
  `[flywheel-mine] done — ${candidates.length} candidate(s) above threshold, ${watchList.length} in watch list`,
);
console.log("[flywheel-mine] NEW:", candidates.filter((c) => c.action === "NEW").length);
console.log("[flywheel-mine] TUNE:", candidates.filter((c) => c.action === "TUNE").length);
console.log("[flywheel-mine] SKIP:", candidates.filter((c) => c.action === "SKIP").length);

// ── Artifact writer ───────────────────────────────────────────────────

function writeArtifacts(candidates, abstainReason, meta, watchList = []) {
  mkdirSync(OUT_DIR, { recursive: true });

  // 1. JSON artifact
  const jsonPayload = {
    meta: meta ?? {
      runAt: new Date().toISOString(),
      windowDays: WINDOW_DAYS,
      windowStart: windowStartIso,
      totalErrorEvents: 0,
      totalTypes: 0,
      candidatesAboveThreshold: 0,
      watchListCount: 0,
    },
    abstainReason: abstainReason ?? null,
    candidates,
    watchList: watchList.slice(0, 20),
  };
  writeFileSync(join(OUT_DIR, "wave-candidates.json"), JSON.stringify(jsonPayload, null, 2), "utf8");

  // 2. Markdown board summary
  const lines = [];
  const runAt = jsonPayload.meta.runAt;

  lines.push(`## Flywheel Mining Report — ${runAt.slice(0, 10)}`);
  lines.push("");
  lines.push(`- **Window**: last ${jsonPayload.meta.windowDays} days`);
  lines.push(`- **Total error events**: ${jsonPayload.meta.totalErrorEvents}`);
  lines.push(`- **Distinct error types**: ${jsonPayload.meta.totalTypes}`);
  lines.push(`- **Candidates above threshold**: ${jsonPayload.meta.candidatesAboveThreshold}`);
  lines.push("");

  if (abstainReason) {
    lines.push(`### Status: ABSTAIN`);
    lines.push("");
    lines.push(`> ${abstainReason}`);
    lines.push("");
    lines.push("_Re-run once more sessions are captured._");
  } else {
    const newOnes = candidates.filter((c) => c.action === "NEW");
    const tuneOnes = candidates.filter((c) => c.action === "TUNE");
    const skipOnes = candidates.filter((c) => c.action === "SKIP");

    if (newOnes.length > 0) {
      lines.push("### NEW — author interference rule");
      lines.push("");
      lines.push("| errorType | occurrences | unique_learners | acceptance_rate | sample |");
      lines.push("|---|---|---|---|---|");
      for (const c of newOnes) {
        const sample = c.sampleTexts[0] ? `\`${c.sampleTexts[0].slice(0, 40)}\`` : "—";
        const rate = c.acceptanceRate !== null ? `${Math.round(c.acceptanceRate * 100)}%` : "n/a";
        lines.push(`| \`${c.errorType}\` | ${c.occurrences} | ${c.uniqueLearners} | ${rate} | ${sample} |`);
      }
      lines.push("");
    }

    if (tuneOnes.length > 0) {
      lines.push("### TUNE — update existing rule");
      lines.push("");
      lines.push("| errorType | occurrences | unique_learners | acceptance_rate | coverage |");
      lines.push("|---|---|---|---|---|");
      for (const c of tuneOnes) {
        const rate = c.acceptanceRate !== null ? `${Math.round(c.acceptanceRate * 100)}%` : "n/a";
        lines.push(`| \`${c.errorType}\` | ${c.occurrences} | ${c.uniqueLearners} | ${rate} | ${c.coverageStatus} |`);
      }
      lines.push("");
    }

    if (skipOnes.length > 0) {
      lines.push(`### SKIP — already covered (${skipOnes.length})`);
      lines.push("");
      lines.push(skipOnes.map((c) => `\`${c.errorType}\``).join(", "));
      lines.push("");
    }

    if (watchList.length > 0) {
      lines.push(`### WATCH — below threshold (${watchList.length})`);
      lines.push("");
      lines.push("_These error types appeared but did not meet occurrences ≥ " + MIN_OCCURRENCES + " or unique_learners ≥ " + MIN_UNIQUE_LEARNERS + ". Re-check next cycle._");
      lines.push("");
      lines.push("| errorType | occurrences | unique_learners |");
      lines.push("|---|---|---|");
      for (const w of watchList.slice(0, 10)) {
        lines.push(`| \`${w.errorType}\` | ${w.occurrences} | ${w.uniqueLearners} |`);
      }
      if (watchList.length > 10) {
        lines.push(`| _(+${watchList.length - 10} more)_ | | |`);
      }
      lines.push("");
    }

    if (candidates.length === 0 && watchList.length === 0) {
      lines.push("### Status: no candidates this cycle");
      lines.push("");
      lines.push("_All observed error types are below threshold. Re-check next cycle._");
    }
  }

  lines.push("---");
  lines.push(`_Generated by scripts/flywheel/mine-candidates.mjs · artifact: _flywheel_out/wave-candidates.json_`);

  writeFileSync(join(OUT_DIR, "board-summary.md"), lines.join("\n") + "\n", "utf8");
  console.log(`[flywheel-mine] artifacts written to ${OUT_DIR}/`);
}
