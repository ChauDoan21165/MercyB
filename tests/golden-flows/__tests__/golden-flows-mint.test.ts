// @vitest-environment node
/**
 * Shape tests for scripts/golden-flows.sh JWT resolution.
 *
 * These tests verify the four resolution paths without hitting Supabase:
 *   1. mint path  — email+password present → curl invoked, JWT minted
 *   2. override   — *_JWT already set → curl never called
 *   3. dry-run    — ALLOW_MISSING_SECRETS=1, no creds → exit 0, flows skip
 *   4. missing    — no JWT, no creds, no escape hatch → exit 2
 * Plus: no secret-looking strings appear on stdout in any path.
 *
 * Uses GOLDEN_FLOW_DRY_MINT=1 so the playwright invocation is never reached.
 * A mock `curl` injected via PATH records calls and returns canned responses.
 */

import { describe, test, expect, beforeEach, afterEach } from "vitest";
import { spawnSync } from "child_process";
import { mkdtempSync, writeFileSync, chmodSync, rmSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

const SCRIPT = join(process.cwd(), "scripts/golden-flows.sh");
const FAKE_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmYWtlIjoidGVzdCJ9.sig";

function writeMockCurl(dir: string, httpStatus: string, accessToken: string) {
  const body = JSON.stringify({ access_token: accessToken, token_type: "bearer", expires_in: 3600 });
  // Captures -o <file> argument, writes body there, prints status code
  const script = [
    "#!/usr/bin/env bash",
    "output_file=''",
    "args=($@)",
    "for ((j=0; j<${#args[@]}; j++)); do",
    "  if [[ \"${args[$j]}\" == \"-o\" ]] && (( j+1 < ${#args[@]} )); then",
    "    output_file=\"${args[$((j+1))]}\"",
    "  fi",
    "done",
    `if [[ -n "$output_file" ]]; then`,
    `  echo '${body}' > "$output_file"`,
    "fi",
    `printf '%s' '${httpStatus}'`,
  ].join("\n");

  const curlPath = join(dir, "curl");
  writeFileSync(curlPath, script);
  chmodSync(curlPath, 0o755);
}

function writeSentinelCurl(dir: string) {
  // Fails loudly if called — used to assert curl is NOT invoked
  const script = ["#!/usr/bin/env bash", "echo 'UNEXPECTED_CURL_CALL' >&2", "exit 1"].join("\n");
  const curlPath = join(dir, "curl");
  writeFileSync(curlPath, script);
  chmodSync(curlPath, 0o755);
}

function run(env: Record<string, string | undefined>, mockDir?: string) {
  const PATH = mockDir
    ? `${mockDir}:${process.env.PATH ?? "/usr/bin:/bin"}`
    : (process.env.PATH ?? "/usr/bin:/bin");

  const result = spawnSync("bash", [SCRIPT], {
    env: {
      HOME: process.env.HOME ?? "/tmp",
      TMPDIR: process.env.TMPDIR ?? "/tmp",
      PATH,
      GOLDEN_FLOW_DRY_MINT: "1",
      ...env,
    },
    encoding: "utf-8",
    timeout: 10_000,
  });

  return {
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
    status: result.status ?? 1,
  };
}

describe("golden-flows shell: JWT resolution paths", () => {
  let mockDir: string;

  beforeEach(() => {
    mockDir = mkdtempSync(join(tmpdir(), "gf-shape-"));
  });

  afterEach(() => {
    rmSync(mockDir, { recursive: true, force: true });
  });

  test("mint path: mints both JWTs when email+password credentials are present", () => {
    writeMockCurl(mockDir, "200", FAKE_JWT);

    const result = run(
      {
        GOLDEN_FLOW_PREMIUM_EMAIL: "premium@test.internal",
        GOLDEN_FLOW_PREMIUM_PASSWORD: "premium-secret-pw",
        GOLDEN_FLOW_FREE_EMAIL: "free@test.internal",
        GOLDEN_FLOW_FREE_PASSWORD: "free-secret-pw",
        GOLDEN_FLOW_ANON_KEY: "fake-anon-key",
      },
      mockDir,
    );

    expect(result.status).toBe(0);
    expect(result.stderr).toContain("minted premium JWT");
    expect(result.stderr).toContain("minted free JWT");
    expect(result.stdout).toContain("dry-mint complete");
  });

  test("override path: uses *_JWT directly and never calls curl", () => {
    writeSentinelCurl(mockDir); // exits 1 and prints UNEXPECTED_CURL_CALL if called

    const result = run(
      {
        GOLDEN_FLOW_PREMIUM_JWT: "eyJoverridePremium.x.y",
        GOLDEN_FLOW_FREE_JWT: "eyJoverrideFree.x.y",
      },
      mockDir,
    );

    expect(result.status).toBe(0);
    expect(result.stderr).not.toContain("minted");
    expect(result.stderr).not.toContain("UNEXPECTED_CURL_CALL");
    expect(result.stdout).toContain("dry-mint complete");
  });

  test("ALLOW_MISSING_SECRETS=1: skips credential check and exits 0", () => {
    const result = run({ GOLDEN_FLOW_ALLOW_MISSING_SECRETS: "1" });

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("dry-mint complete");
  });

  test("missing credentials without escape hatch exits 2", () => {
    const result = run({});

    expect(result.status).toBe(2);
    expect(result.stderr).toContain("GOLDEN_FLOW_PREMIUM_JWT");
  });

  test("missing only free credentials exits 2 (partial creds are insufficient)", () => {
    // Premium JWT is provided but free credentials are absent
    const result = run({ GOLDEN_FLOW_PREMIUM_JWT: "eyJpremium.x.y" });

    expect(result.status).toBe(2);
    expect(result.stderr).toContain("GOLDEN_FLOW_FREE_JWT");
  });

  test("mint failure exits 2 with HTTP status and never echoes password", () => {
    writeMockCurl(mockDir, "401", "");

    const result = run(
      {
        GOLDEN_FLOW_PREMIUM_EMAIL: "bad@test.internal",
        GOLDEN_FLOW_PREMIUM_PASSWORD: "wrong-password-value",
        GOLDEN_FLOW_ANON_KEY: "fake-anon-key",
      },
      mockDir,
    );

    expect(result.status).toBe(2);
    expect(result.stderr).toContain("HTTP 401");
    expect(result.stderr).not.toContain("wrong-password-value");
    expect(result.stdout).not.toContain("wrong-password-value");
  });

  test("no secret-looking strings appear in stdout on mint path", () => {
    writeMockCurl(mockDir, "200", FAKE_JWT);

    const result = run(
      {
        GOLDEN_FLOW_PREMIUM_EMAIL: "premium@test.internal",
        GOLDEN_FLOW_PREMIUM_PASSWORD: "ultra-secret-premium-pw",
        GOLDEN_FLOW_FREE_EMAIL: "free@test.internal",
        GOLDEN_FLOW_FREE_PASSWORD: "ultra-secret-free-pw",
        GOLDEN_FLOW_ANON_KEY: "ultra-secret-anon-key",
      },
      mockDir,
    );

    expect(result.stdout).not.toContain("ultra-secret-premium-pw");
    expect(result.stdout).not.toContain("ultra-secret-free-pw");
    expect(result.stdout).not.toContain("ultra-secret-anon-key");
    expect(result.stdout).not.toContain(FAKE_JWT);
  });

  test("no secret-looking strings appear in stdout on override path", () => {
    const overrideJwt = "eyJoverride-secret-token.payload.sig";

    const result = run(
      {
        GOLDEN_FLOW_PREMIUM_JWT: overrideJwt,
        GOLDEN_FLOW_FREE_JWT: "eyJoverride-free-secret.payload.sig",
      },
    );

    expect(result.stdout).not.toContain(overrideJwt);
    expect(result.stdout).not.toContain("eyJoverride-free-secret");
  });
});
