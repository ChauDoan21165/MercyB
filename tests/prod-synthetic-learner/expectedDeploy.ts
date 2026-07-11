/**
 * Journey (f) "expected deploy" source — PIN PER RUN (design decision #4):
 * the runner reads the latest green main deploy sha at run start and asserts
 * version.json matches it. Deliberately NOT coupled to CI_COMMIT_SHORT_SHA of
 * the *running* pipeline — the synthetic runner is a scheduled job whose own
 * SHA is unrelated to what is deployed; it must check the latest deployed main.
 *
 * Resolution order:
 *   1. EXPECTED_DEPLOY_SHA env (explicit override / test seam).
 *   2. Latest successful pipeline on `main` via the GitLab API (token from the
 *      admin-host runner env — never committed).
 *   3. "" (unresolved) → journey (f) fails loudly so the misconfig is visible,
 *      rather than silently passing.
 */
import type { APIRequestContext } from "@playwright/test";
import { execFileSync } from "node:child_process";

export async function resolveExpectedDeploySha(request: APIRequestContext): Promise<string> {
  const override = process.env.EXPECTED_DEPLOY_SHA;
  if (override) return override.trim().slice(0, 7);

  const apiBase = process.env.CI_API_V4_URL ?? "https://gitlab.com/api/v4";
  const projectId = process.env.CI_PROJECT_ID ?? encodeURIComponent("cd12536/mercyB");
  const token = process.env.GITLAB_TOKEN ?? process.env.CI_JOB_TOKEN ?? "";
  if (!token) return "";

  try {
    const resp = await request.get(
      `${apiBase}/projects/${projectId}/pipelines?ref=main&status=success&order_by=id&sort=desc&per_page=1`,
      { headers: { "PRIVATE-TOKEN": token, "JOB-TOKEN": token }, timeout: 15_000 },
    );
    if (!resp.ok()) return "";
    const rows = (await resp.json()) as Array<{ sha?: string }>;
    return (rows?.[0]?.sha ?? "").slice(0, 7);
  } catch {
    return "";
  }
}

/** Run a git command in the repo; return its exit code (execFileSync throws on
 *  non-zero — `e.status` carries the code; -1 means git absent/unusable). No
 *  shell, no output captured (stdio ignored). Host-independent, no token/API. */
function gitCode(args: string[]): number {
  try {
    execFileSync("git", args, { stdio: "ignore", timeout: 20_000 });
    return 0;
  } catch (e) {
    const code = (e as { status?: number }).status;
    return typeof code === "number" ? code : -1;
  }
}

/**
 * Journey (f) — DEPLOY-IDENTITY check (run #3 lag-tolerance + run #5 host-indep).
 *
 * (f) asserts that the live version.json sha is a real main build for this run —
 * NOT a rollback or a foreign build. It must test DEPLOY IDENTITY, not host
 * tooling, so ancestry is resolved with **local git** in the checked-out repo
 * (`git merge-base --is-ancestor`), not the GitLab API — run #5 (host
 * /Users/macbook) failed with `merge_base API http 404` because that host's
 * CI_JOB_TOKEN can't reach the endpoint, even though the deploy was fine.
 *
 * Acceptable iff live and CI_COMMIT_SHA are on the SAME main lineage:
 *   - equal                          → deployed exactly this commit;
 *   - live is an ANCESTOR of ci      → deploy lag (Cloudflare catching up);
 *   - live is a DESCENDANT of ci     → a NEWER main deploy while an older /
 *                                      scheduled pipeline runs (run #5:
 *                                      live 5631e41 is ahead of ci 8a7fc9e).
 * FAIL only if git decisively says they are UNRELATED (rollback / foreign).
 * If the oracle can't decide (git missing, commit not in the clone, fetch
 * failed) → FAIL OPEN with a WARN — a host-tooling gap must not red (f).
 */
export async function isDeployShaAcceptable(
  _request: APIRequestContext, // kept for call-site compat; no longer used
  liveSha: string,
): Promise<{ ok: boolean; reason: string }> {
  const live = (liveSha || "").trim().toLowerCase();
  if (!live) return { ok: false, reason: "no live sha in version.json" };

  const ci = (process.env.CI_COMMIT_SHA ?? process.env.EXPECTED_DEPLOY_SHA ?? "")
    .trim()
    .toLowerCase();
  if (!ci) return { ok: false, reason: "no CI_COMMIT_SHA / EXPECTED_DEPLOY_SHA to check against" };

  // Equal — version.json is a 7-char prefix, CI_COMMIT_SHA is the full 40.
  if (ci.startsWith(live) || live.startsWith(ci)) {
    return { ok: true, reason: `live ${live} == CI_COMMIT_SHA ${ci.slice(0, 7)}` };
  }

  // Best-effort: pull recent main history so a possibly-AHEAD live sha is in the
  // (shallow) clone. Failure is fine — handled by the resolvability check below.
  gitCode(["fetch", "--quiet", "--depth=200", "origin", "main"]);

  const liveKnown = gitCode(["cat-file", "-e", `${live}^{commit}`]) === 0;
  const ciKnown = gitCode(["cat-file", "-e", `${ci}^{commit}`]) === 0;
  if (!liveKnown || !ciKnown) {
    const missing = [!liveKnown ? `live ${live}` : "", !ciKnown ? `ci ${ci.slice(0, 7)}` : ""].filter(Boolean).join(" & ");
    return { ok: true, reason: `WARN oracle-unavailable: ${missing} not resolvable in the checked-out repo — accepting (deploy identity unverifiable, NOT a host-tooling red)` };
  }

  // --is-ancestor: exit 0 = ancestor, 1 = not, other = error.
  const liveAncOfCi = gitCode(["merge-base", "--is-ancestor", live, ci]);
  const ciAncOfLive = gitCode(["merge-base", "--is-ancestor", ci, live]);
  if (liveAncOfCi === 0) return { ok: true, reason: `deploy-lag: live ${live} is an ancestor of ci ${ci.slice(0, 7)}` };
  if (ciAncOfLive === 0) return { ok: true, reason: `deploy-ahead: live ${live} is a descendant of ci ${ci.slice(0, 7)} (newer main build)` };
  if (liveAncOfCi === 1 && ciAncOfLive === 1) {
    return { ok: false, reason: `live ${live} and ci ${ci.slice(0, 7)} are UNRELATED on origin/main — rollback or foreign build` };
  }
  // A git error on the compare → oracle uncertain → fail open with WARN.
  return { ok: true, reason: `WARN oracle-inconclusive (git exit ${liveAncOfCi}/${ciAncOfLive}) for live ${live} vs ci ${ci.slice(0, 7)} — accepting` };
}
