import { describe, expect, it } from "vitest";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const repoRoot = path.resolve(import.meta.dirname, "../..");
const scriptPath = path.join(repoRoot, "scripts/ci-runner-healthcheck.sh");

function executable(filePath, body) {
  writeFileSync(filePath, body, { mode: 0o755 });
}

function runHealthcheck({ paused = false, dockerOk = false, runnerOk = false, brewStarted = false } = {}) {
  const temp = mkdtempSync(path.join(tmpdir(), "mercyb-runner-health-"));
  const pauseMarker = path.join(temp, "runner-paused");
  const notifyLog = path.join(temp, "notify.log");
  const healthLog = path.join(temp, "health.log");

  if (paused) {
    writeFileSync(pauseMarker, "paused intentionally\n");
  }

  executable(path.join(temp, "docker"), `#!/bin/sh\n${dockerOk ? "exit 0" : "exit 1"}\n`);
  executable(path.join(temp, "gitlab-runner"), `#!/bin/sh\n${runnerOk ? "exit 0" : "exit 1"}\n`);
  executable(
    path.join(temp, "brew"),
    `#!/bin/sh\nif [ "$1" = "services" ] && [ "$2" = "list" ]; then\n  echo "gitlab-runner ${brewStarted ? "started" : "stopped"} admin ~/Library/LaunchAgents/homebrew.mxcl.gitlab-runner.plist"\n  exit 0\nfi\nexit 1\n`,
  );
  executable(path.join(temp, "notify"), `#!/bin/sh\nprintf '%s\\n' "$1" >> "${notifyLog}"\n`);

  const result = spawnSync("sh", [scriptPath], {
    cwd: repoRoot,
    env: {
      ...process.env,
      MERCYB_RUNNER_PAUSE_MARKER: pauseMarker,
      MERCYB_DOCKER_BIN: path.join(temp, "docker"),
      MERCYB_GITLAB_RUNNER_BIN: path.join(temp, "gitlab-runner"),
      MERCYB_BREW_BIN: path.join(temp, "brew"),
      MERCYB_RUNNER_NOTIFY_CMD: path.join(temp, "notify"),
      MERCYB_RUNNER_HEALTH_LOG: healthLog,
    },
    encoding: "utf8",
  });

  const readOptional = (filePath) => {
    try {
      return readFileSync(filePath, "utf8");
    } catch {
      return "";
    }
  };

  const output = {
    result,
    notifyLog: readOptional(notifyLog),
    healthLog: readOptional(healthLog),
  };
  rmSync(temp, { recursive: true, force: true });
  return output;
}

describe("ci-runner-healthcheck", () => {
  it("stays silent when the local runner is intentionally paused", () => {
    const { result, notifyLog, healthLog } = runHealthcheck({ paused: true });

    expect(result.status).toBe(0);
    expect(notifyLog).toBe("");
    expect(healthLog).toBe("");
  });

  it("alerts when Docker is down and the pause marker is absent", () => {
    const { result, notifyLog, healthLog } = runHealthcheck({
      dockerOk: false,
      runnerOk: true,
    });

    expect(result.status).toBe(1);
    expect(notifyLog).toContain("Docker daemon down on local runner");
    expect(healthLog).toContain("Docker daemon down on local runner");
  });
});
