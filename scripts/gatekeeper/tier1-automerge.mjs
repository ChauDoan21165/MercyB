#!/usr/bin/env node

const API = process.env.CI_API_V4_URL || process.env.GITLAB_API_URL || "https://gitlab.com/api/v4";
const PROJECT_ID = process.env.CI_PROJECT_ID || process.env.GATEKEEPER_PROJECT_ID;
const TOKEN = process.env.GATEKEEPER_TOKEN || process.env.GITLAB_TOKEN || process.env.CI_JOB_TOKEN;
const R0_SCHEDULE_ID = process.env.R0_SCHEDULE_ID || "4336200";
const R0_MAX_AGE_MINUTES = Number(process.env.GATEKEEPER_R0_MAX_AGE_MINUTES || 120);
const MAX_MERGES = Number(process.env.GATEKEEPER_MAX_MERGES || 5);
const DRY_RUN = process.env.GATEKEEPER_DRY_RUN === "1";

const MARKER = "<!-- gatekeeper-tier-classification -->";

function requireEnv(name, value) {
  if (!value) throw new Error(`${name} is required`);
}

async function gitlab(path, options = {}) {
  requireEnv("CI_PROJECT_ID or GATEKEEPER_PROJECT_ID", PROJECT_ID);
  requireEnv("GATEKEEPER_TOKEN", TOKEN);

  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "content-type": "application/json",
      "PRIVATE-TOKEN": TOKEN,
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  let body = null;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }

  if (!response.ok) {
    const detail = typeof body === "string" ? body : JSON.stringify(body);
    throw new Error(`GitLab ${response.status} ${path}: ${detail}`);
  }

  return { body, headers: response.headers };
}

async function gitlabPages(path) {
  const rows = [];
  for (let page = 1; page <= 20; page += 1) {
    const joiner = path.includes("?") ? "&" : "?";
    const { body, headers } = await gitlab(`${path}${joiner}per_page=100&page=${page}`);
    rows.push(...body);
    if (!headers.get("x-next-page")) break;
  }
  return rows;
}

function minutesOld(iso) {
  return (Date.now() - new Date(iso).getTime()) / 60000;
}

async function assertR0Healthy() {
  const { body: schedule } = await gitlab(`/projects/${encodeURIComponent(PROJECT_ID)}/pipeline_schedules/${R0_SCHEDULE_ID}`);
  const pipeline = schedule.last_pipeline;
  if (!pipeline?.id) {
    throw new Error(`R0 gate failed: schedule ${R0_SCHEDULE_ID} has no last_pipeline`);
  }

  const age = minutesOld(pipeline.created_at);
  if (!Number.isFinite(age) || age > R0_MAX_AGE_MINUTES) {
    throw new Error(`R0 gate failed: last pipeline ${pipeline.id} is stale (${Math.round(age)} minutes old)`);
  }

  const jobs = await gitlabPages(`/projects/${encodeURIComponent(PROJECT_ID)}/pipelines/${pipeline.id}/jobs?include_retried=true`);
  const learnerJobs = jobs
    .filter((job) => job.name === "prod-synthetic-learner")
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const latest = learnerJobs[0];

  if (!latest) {
    throw new Error(`R0 gate failed: pipeline ${pipeline.id} has no prod-synthetic-learner job`);
  }

  if (latest.status !== "success") {
    throw new Error(`R0 gate failed: prod-synthetic-learner in pipeline ${pipeline.id} is ${latest.status}`);
  }

  console.log(`R0 gate ok: schedule ${R0_SCHEDULE_ID}, pipeline ${pipeline.id}, prod-synthetic-learner ${latest.status}`);
}

function isTier1Script(path) {
  if (!path.startsWith("scripts/")) return false;
  const lower = path.toLowerCase();
  return !(
    lower.startsWith("scripts/ci/") ||
    lower.includes("hardening-scan") ||
    lower.includes("deploy") ||
    lower.includes("release") ||
    lower.includes("runner")
  );
}

function isTier3(path) {
  const lower = path.toLowerCase();
  if (path === ".gitlab-ci.yml") return true;
  if (path === "docs/merge-policy.md" || path === "docs/gatekeeper-brief.md") return true;
  if (lower.startsWith("scripts/gatekeeper/")) return true;
  if (lower.startsWith("supabase/migrations/")) return true;
  if (/^package(-lock)?\.json$/.test(lower) || lower === "pnpm-lock.yaml" || lower === "yarn.lock") return true;
  if (lower.startsWith("scripts/ci/") || lower.includes("hardening-scan")) return true;
  return /(^|\/)(auth|oauth|login|signin|signup|session|jwt|mfa|2fa|payment|payments|billing|stripe|checkout|invoice|subscription|revenuecat|iap|entitlement|entitlements)(\/|[-_.]|$)/.test(lower);
}

function isTier2(path) {
  return path.startsWith("src/") || path.startsWith("functions/") || path.startsWith("supabase/functions/");
}

function isTier1(path) {
  return path.startsWith("docs/") || path.startsWith("reports/") || path.startsWith("tests/") || isTier1Script(path);
}

function classifyPath(path) {
  if (isTier3(path)) return { tier: 3, reason: "Chau-held path or protected auth/payment/entitlement/dependency/CI surface" };
  if (isTier2(path)) return { tier: 2, reason: "runtime source or edge function path" };
  if (isTier1(path)) return { tier: 1, reason: "auto-merge eligible docs/reports/tests/safe script path" };
  return { tier: 2, reason: "unknown path defaults to agent review" };
}

function classifyFiles(paths) {
  const details = paths.map((path) => ({ path, ...classifyPath(path) }));
  const tier = Math.max(...details.map((item) => item.tier));
  return { tier, details };
}

function mergeable(mr) {
  return mr.merge_status === "can_be_merged" || mr.detailed_merge_status === "mergeable";
}

function green(mr) {
  return (mr.head_pipeline?.status || mr.pipeline?.status) === "success";
}

function commentBody(mr, classification, action) {
  const rows = classification.details
    .slice(0, 20)
    .map((item) => `- Tier ${item.tier}: \`${item.path}\` - ${item.reason}`)
    .join("\n");
  const extra = classification.details.length > 20 ? `\n- ...and ${classification.details.length - 20} more file(s)` : "";

  return `${MARKER}
Gatekeeper classification: Tier ${classification.tier}

Action: ${action}

MR state:
- Draft: ${Boolean(mr.draft || mr.work_in_progress)}
- Pipeline: ${mr.head_pipeline?.status || mr.pipeline?.status || "unknown"}
- Merge status: ${mr.detailed_merge_status || mr.merge_status || "unknown"}

Files:
${rows}${extra}
`;
}

async function upsertClassificationComment(mr, classification, action) {
  const notes = await gitlabPages(`/projects/${encodeURIComponent(PROJECT_ID)}/merge_requests/${mr.iid}/notes?sort=desc&order_by=created_at`);
  const existing = notes.find((note) => typeof note.body === "string" && note.body.includes(MARKER));
  const body = commentBody(mr, classification, action);

  if (existing) {
    await gitlab(`/projects/${encodeURIComponent(PROJECT_ID)}/merge_requests/${mr.iid}/notes/${existing.id}`, {
      method: "PUT",
      body: JSON.stringify({ body }),
    });
    return;
  }

  await gitlab(`/projects/${encodeURIComponent(PROJECT_ID)}/merge_requests/${mr.iid}/notes`, {
    method: "POST",
    body: JSON.stringify({ body }),
  });
}

async function changedPaths(mr) {
  const { body } = await gitlab(`/projects/${encodeURIComponent(PROJECT_ID)}/merge_requests/${mr.iid}/changes`);
  const changes = body.changes || [];
  return [...new Set(changes.flatMap((change) => [change.old_path, change.new_path]).filter(Boolean))];
}

async function mergeMr(mr) {
  if (DRY_RUN) {
    console.log(`DRY RUN: would merge !${mr.iid} ${mr.title}`);
    return;
  }

  await gitlab(`/projects/${encodeURIComponent(PROJECT_ID)}/merge_requests/${mr.iid}/merge`, {
    method: "PUT",
    body: JSON.stringify({
      merge_when_pipeline_succeeds: false,
      should_remove_source_branch: false,
      squash: false,
      sha: mr.sha,
    }),
  });
  console.log(`Merged !${mr.iid} ${mr.title}`);
}

async function main() {
  await assertR0Healthy();
  console.log("R1 gate not queried: service-role keys never enter CI variables; gatekeeper is R0-only");

  const mrs = await gitlabPages(`/projects/${encodeURIComponent(PROJECT_ID)}/merge_requests?state=opened&with_merge_status_recheck=true`);
  let merges = 0;

  for (const mr of mrs) {
    const paths = await changedPaths(mr);
    const classification = classifyFiles(paths.length ? paths : ["<no changed paths reported>"]);
    const canAutoMerge = classification.tier === 1 && !mr.draft && !mr.work_in_progress && green(mr) && mergeable(mr);
    const action = canAutoMerge
      ? "Tier 1, green, and mergeable; gatekeeper will merge with a merge commit."
      : "No auto-merge; not Tier 1, not green, Draft, or not mergeable.";

    await upsertClassificationComment(mr, classification, action);
    console.log(`!${mr.iid}: Tier ${classification.tier}; ${action}`);

    if (canAutoMerge && merges < MAX_MERGES) {
      await mergeMr(mr);
      merges += 1;
    } else if (canAutoMerge) {
      console.log(`!${mr.iid}: merge limit reached (${MAX_MERGES}); left open`);
    }
  }

  console.log(`Gatekeeper complete: reviewed ${mrs.length} open MR(s), merged ${merges}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
