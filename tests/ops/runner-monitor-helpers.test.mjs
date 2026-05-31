import { describe, expect, it } from "vitest";
import { existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

// End-to-end test for the pause/resume helpers and how they drive the monitor.
// Everything is redirected through env overrides (marker path, brew stub,
// docker/gitlab-runner stubs) so the real ~/.mercyb-runner-paused marker and
// the real gitlab-runner service are never touched.
const repoRoot = path.resolve(import.meta.dirname, "../..");
const pauseScript = path.join(repoRoot, "scripts/pause-runner-monitor.sh");
const resumeScript = path.join(repoRoot, "scripts/resume-runner-monitor.sh");
const monitorScript = path.join(repoRoot, "scripts/ci-runner-healthcheck.sh");

function executable(filePath, body) {
  writeFileSync(filePath, body, { mode: 0o755 });
}

function makeEnv(temp) {
  const marker = path.join(temp, "runner-paused");
  // brew stub records calls and reports the runner as stopped, so the helpers
  // and monitor never reach the real Homebrew or gitlab-runner.
  const brewLog = path.join(temp, "brew.log");
  executable(
    path.join(temp, "brew"),
    `#!/bin/sh\nprintf '%s\\n' "$*" >> "${brewLog}"\n` +
      `if [ "$1" = "services" ] && [ "$2" = "list" ]; then\n` +
      `  echo "gitlab-runner stopped admin ~/Library/LaunchAgents/homebrew.mxcl.gitlab-runner.plist"\n` +
      `  exit 0\nfi\nexit 0\n`,
  );
  executable(path.join(temp, "docker"), `#!/bin/sh\nexit 1\n`); // docker "down"
  executable(path.join(temp, "gitlab-runner"), `#!/bin/sh\nexit 1\n`);
  executable(path.join(temp, "notify"), `#!/bin/sh\nprintf '%s\\n' "$1" >> "${path.join(temp, "notify.log")}"\n`);

  return {
    marker,
    brewLog,
    notifyLog: path.join(temp, "notify.log"),
    env: {
      ...process.env,
      MERCYB_RUNNER_PAUSE_MARKER: marker,
      MERCYB_BREW_BIN: path.join(temp, "brew"),
      MERCYB_DOCKER_BIN: path.join(temp, "docker"),
      MERCYB_GITLAB_RUNNER_BIN: path.join(temp, "gitlab-runner"),
      MERCYB_RUNNER_NOTIFY_CMD: path.join(temp, "notify"),
      MERCYB_RUNNER_HEALTH_LOG: path.join(temp, "health.log"),
    },
  };
}

function run(script, env) {
  return spawnSync("sh", [script], { cwd: repoRoot, env, encoding: "utf8" });
}

describe("runner monitor pause/resume helpers", () => {
  it("pause helper creates the marker, stops the runner, and silences the monitor", () => {
    const temp = mkdtempSync(path.join(tmpdir(), "mercyb-helpers-"));
    try {
      const { marker, brewLog, notifyLog, env } = makeEnv(temp);

      const pause = run(pauseScript, env);
      expect(pause.status).toBe(0);
      expect(existsSync(marker)).toBe(true);
      expect(spawnSync("cat", [brewLog], { encoding: "utf8" }).stdout).toContain("services stop gitlab-runner");

      // Monitor must stay silent while the marker exists, even with docker down.
      const monitor = run(monitorScript, env);
      expect(monitor.status).toBe(0);
      expect(existsSync(notifyLog)).toBe(false);
    } finally {
      rmSync(temp, { recursive: true, force: true });
    }
  });

  it("resume helper removes the marker, restarts the runner, and re-arms the monitor", () => {
    const temp = mkdtempSync(path.join(tmpdir(), "mercyb-helpers-"));
    try {
      const { marker, brewLog, notifyLog, env } = makeEnv(temp);
      writeFileSync(marker, "paused intentionally\n");

      const resume = run(resumeScript, env);
      expect(resume.status).toBe(0);
      expect(existsSync(marker)).toBe(false);
      expect(spawnSync("cat", [brewLog], { encoding: "utf8" }).stdout).toContain("services start gitlab-runner");

      // With the marker gone and docker down, the monitor alerts again.
      const monitor = run(monitorScript, env);
      expect(monitor.status).toBe(1);
      expect(spawnSync("cat", [notifyLog], { encoding: "utf8" }).stdout).toContain(
        "Docker daemon down on local runner",
      );
    } finally {
      rmSync(temp, { recursive: true, force: true });
    }
  });
});
