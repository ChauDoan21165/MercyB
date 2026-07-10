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
