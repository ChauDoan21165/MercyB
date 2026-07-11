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

/**
 * Journey (f) acceptance with DEPLOY-LAG tolerance (run #3 fix).
 *
 * The old equality check compared version.json against "latest green main
 * pipeline", which races Cloudflare's auto-deploy: the synthetic job can start
 * before its own pipeline is marked green, so the resolver returns the PRIOR
 * green sha while Cloudflare has already deployed the newer one — a spurious
 * red (run #3: live=df2b0b9 vs resolver=75b2a45, where df2b0b9 == this
 * pipeline's own commit).
 *
 * New model: the target is CI_COMMIT_SHA (the main HEAD this run is for). The
 * live deploy is acceptable if it EQUALS that sha OR is an ANCESTOR of it on
 * origin/main (deploy still catching up). It fails only if live is NOT an
 * ancestor — that means a rollback or a foreign build, a real alarm.
 * Ancestry is checked via the GitLab merge_base API (full history; robust to
 * the runner's shallow clone).
 */
export async function isDeployShaAcceptable(
  request: APIRequestContext,
  liveSha: string,
): Promise<{ ok: boolean; reason: string }> {
  const live = (liveSha || "").trim().toLowerCase();
  if (!live) return { ok: false, reason: "no live sha in version.json" };

  // Baseline = the pipeline's own commit (main HEAD for this run). Fall back to
  // an explicit override only when CI_COMMIT_SHA is absent (e.g. local runs).
  const ci = (process.env.CI_COMMIT_SHA ?? process.env.EXPECTED_DEPLOY_SHA ?? "")
    .trim()
    .toLowerCase();
  if (!ci) return { ok: false, reason: "no CI_COMMIT_SHA / EXPECTED_DEPLOY_SHA to check against" };

  // Equal — version.json is a 7-char prefix, CI_COMMIT_SHA is the full 40.
  if (ci.startsWith(live) || live.startsWith(ci)) {
    return { ok: true, reason: `live ${live} == CI_COMMIT_SHA ${ci.slice(0, 7)}` };
  }

  // Deploy lag: accept iff live is an ANCESTOR of CI_COMMIT_SHA on origin/main.
  const apiBase = process.env.CI_API_V4_URL ?? "https://gitlab.com/api/v4";
  const projectId = process.env.CI_PROJECT_ID ?? encodeURIComponent("cd12536/mercyB");
  const token = process.env.GITLAB_TOKEN ?? process.env.CI_JOB_TOKEN ?? "";
  if (!token) return { ok: false, reason: `live ${live} != ci ${ci.slice(0, 7)} and no token to verify ancestry` };

  try {
    const resp = await request.get(
      `${apiBase}/projects/${projectId}/repository/merge_base?refs[]=${encodeURIComponent(live)}&refs[]=${encodeURIComponent(ci)}`,
      { headers: { "PRIVATE-TOKEN": token, "JOB-TOKEN": token }, timeout: 15_000 },
    );
    if (!resp.ok()) return { ok: false, reason: `merge_base API http ${resp.status()} (live ${live} vs ci ${ci.slice(0, 7)})` };
    const base = String(((await resp.json()) as { id?: string }).id ?? "").toLowerCase();
    // live is an ancestor of ci  ⇔  merge_base(live, ci) === live.
    const liveIsAncestor = Boolean(base) && (base.startsWith(live) || live.startsWith(base));
    return liveIsAncestor
      ? { ok: true, reason: `deploy-lag: live ${live} is an ancestor of CI_COMMIT_SHA ${ci.slice(0, 7)}` }
      : { ok: false, reason: `live ${live} is NOT an ancestor of CI_COMMIT_SHA ${ci.slice(0, 7)} — rollback or foreign build` };
  } catch (e) {
    return { ok: false, reason: `merge_base check failed: ${(e as Error).message}` };
  }
}
