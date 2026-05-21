import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import {
  buildStatusModel,
  checkBranchSafety,
  checkPackageDiff,
  classifyCommandResult,
  classifyValidateTestsResult,
  decideExit,
  detectNotValidated,
  detectTestCount,
  extractBlockers,
  formatJson,
  formatTerminal,
  helpText,
  inspectResumeScript,
  inspectResumeTestStructure,
  main,
  makeCheck,
  parseArgs,
  scanDrift,
  validateCheckShape,
} from "../verify-v3-placement.mjs";

const SCRIPT = path.resolve("scripts/verify-v3-placement.mjs");
const RESUME = "src/pages/placement/v3/__tests__/ResultsPage.resumeSmoke.test.tsx";

let repo;

function write(rel, text) {
  const abs = path.join(repo, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, text);
}

function packageJson(extraScripts = {}) {
  return {
    scripts: {
      test: "vitest run",
      "test:resume": `vitest run ${RESUME}`,
      "typecheck:app": "tsc -p tsconfig.typecheck.json --noEmit",
      build: "vite build",
      ...extraScripts,
    },
  };
}

function resumeSuite(extra = "") {
  return `
describe("Placement V3 resume reliability", () => {
  it("route normalization room-prefixed normal id encoded colon", () => {});
  it("marker lifecycle stale marker valid marker completed marker different placement/session", () => {});
  it("resume behavior resumes same lesson return-to-ResultsPage resume target", () => {});
  it("duplicate actions double-click triple-click double-navigate", () => {});
  it("completion ownership completing inactive room completing active room completion", () => {});
  it("localStorage corruption malformed marker stale localStorage", () => {});
  it("learner-safe recovery scary technical copy", () => {});
  ${extra}
});
`;
}

function setupRepo(extraScripts = {}, resumeText = resumeSuite()) {
  repo = fs.mkdtempSync(path.join(os.tmpdir(), "mb-v3-verify-"));
  write("package.json", JSON.stringify(packageJson(extraScripts), null, 2));
  write(RESUME, resumeText);
}

function result(exitCode = 0, output = "", durationMs = 1) {
  return { exitCode, stdout: output, stderr: "", output, durationMs, command: "mock", error: null };
}

function mockRunner(overrides = {}) {
  return (cmd, args) => {
    const key = [cmd, ...args].join(" ");
    if (Object.prototype.hasOwnProperty.call(overrides, key)) return overrides[key];
    if (key === "git branch --show-current") return result(0, "test-branch\n");
    if (key === "git rev-parse --short HEAD") return result(0, "abc123\n");
    if (key === "git status --porcelain") return result(0, "");
    if (key.startsWith("git diff --name-only")) return result(0, "");
    if (key === "git diff --name-only") return result(0, "");
    if (key === "git diff --cached --name-only") return result(0, "");
    if (key === "git ls-files --others --exclude-standard") return result(0, "");
    if (key.startsWith("git diff origin/main...HEAD -- package.json")) return result(0, "");
    if (key.startsWith("git diff origin/main...HEAD")) return result(0, "");
    if (key === "git diff --check") return result(0, "");
    if (key === "npm run test:resume") return result(0, "Tests 42 passed (42)\n");
    if (key === "npm run test -- ResultsPage.resumeSmoke") return result(0, "Tests 42 passed (42)\n");
    if (key === "npm run typecheck:app") return result(0, "");
    if (key === "npm run build") return result(0, "");
    if (key === "npm run test -- placement-v3-session") return result(0, "Tests 2 passed (2)\n");
    return result(0, "");
  };
}

beforeEach(() => setupRepo());
afterEach(() => fs.rmSync(repo, { recursive: true, force: true }));

describe("verify-v3-placement args and help", () => {
  it("help exits 0", () => {
    expect(parseArgs(["--help"]).options.help).toBe(true);
  });

  it("help includes Usage", () => {
    expect(helpText()).toContain("Usage");
  });

  it("help includes Options", () => {
    expect(helpText()).toContain("Options");
  });

  it("help includes Exit codes", () => {
    expect(helpText()).toContain("Exit codes");
  });

  it("help includes Examples", () => {
    expect(helpText()).toContain("Examples");
  });

  it("invalid arg exits 4", () => {
    expect(parseArgs(["--bad"]).error).toContain("Unknown");
  });

  it("invalid --min-resume-tests exits 4", () => {
    expect(parseArgs(["--min-resume-tests", "0"]).error).toContain("Invalid");
  });

  it("invalid --base exits 4", () => {
    expect(parseArgs(["--base"]).error).toContain("Missing");
  });

  it("parses JSON mode", () => {
    expect(parseArgs(["--json"]).options.json).toBe(true);
  });

  it("parses skip build", () => {
    expect(parseArgs(["--skip-build"]).options.skipBuild).toBe(true);
  });

  it("parses skip optional", () => {
    expect(parseArgs(["--skip-optional"]).options.skipOptional).toBe(true);
  });

  it("parses base ref", () => {
    expect(parseArgs(["--base", "HEAD"]).options.baseRef).toBe("HEAD");
  });

  it("parses min resume tests", () => {
    expect(parseArgs(["--min-resume-tests", "50"]).options.minResumeTests).toBe(50);
  });

  it("spawned CLI --help works", () => {
    const run = spawnSync("node", [SCRIPT, "--help"], { encoding: "utf8" });
    expect(run.status).toBe(0);
    expect(run.stdout).toContain("Usage");
  });

  it("spawned CLI --json works with mocked temp fixture if feasible", () => {
    const run = spawnSync("node", [SCRIPT, "--json"], {
      encoding: "utf8",
      env: { ...process.env, VERIFY_V3_PLACEMENT_MOCK: "ready" },
    });
    expect(run.status).toBe(0);
    expect(JSON.parse(run.stdout).schemaVersion).toBe("v3-placement-verification/v1");
  });
});

describe("verify-v3-placement output", () => {
  it("JSON mode emits valid JSON", () => {
    const model = buildStatusModel({ repoRoot: repo, runner: mockRunner(), generatedAt: "T" });
    expect(() => JSON.parse(formatJson(model))).not.toThrow();
  });

  it("JSON key order locked", () => {
    const keys = Object.keys(JSON.parse(formatJson(buildStatusModel({ repoRoot: repo, runner: mockRunner(), generatedAt: "T" }))));
    expect(keys.slice(0, 6)).toEqual(["schemaVersion", "generatedAt", "repoRoot", "baseRef", "branch", "commit"]);
  });

  it("JSON has schemaVersion", () => {
    const json = JSON.parse(formatJson(buildStatusModel({ repoRoot: repo, runner: mockRunner(), generatedAt: "T" })));
    expect(json.schemaVersion).toBe("v3-placement-verification/v1");
  });

  it("terminal section order locked", () => {
    const text = formatTerminal(buildStatusModel({ repoRoot: repo, runner: mockRunner(), generatedAt: "T" }));
    const sections = ["V3 Placement Verification", "Run Info", "Required Checks", "Optional Checks", "Resume Suite", "Placement Session", "Build Readiness", "Branch Safety", "Drift Guard", "Package Diff", "Top Blockers", "Next Actions", "Exit Summary"];
    expect(sections.map((section) => text.indexOf(section))).toEqual([...sections.map((section) => text.indexOf(section))].sort((a, b) => a - b));
  });

  it("terminal includes command", () => {
    expect(formatTerminal(buildStatusModel({ repoRoot: repo, runner: mockRunner(), generatedAt: "T" }))).toContain("command:");
  });

  it("terminal includes status", () => {
    expect(formatTerminal(buildStatusModel({ repoRoot: repo, runner: mockRunner(), generatedAt: "T" }))).toContain("PASS");
  });

  it("terminal includes exit code", () => {
    expect(formatTerminal(buildStatusModel({ repoRoot: repo, runner: mockRunner(), generatedAt: "T" }))).toContain("exit code:");
  });

  it("terminal includes duration", () => {
    expect(formatTerminal(buildStatusModel({ repoRoot: repo, runner: mockRunner(), generatedAt: "T" }))).toContain("duration ms:");
  });

  it("terminal includes test count", () => {
    expect(formatTerminal(buildStatusModel({ repoRoot: repo, runner: mockRunner(), generatedAt: "T" }))).toContain("test count: 42");
  });

  it("JSON includes command", () => {
    expect(JSON.parse(formatJson(buildStatusModel({ repoRoot: repo, runner: mockRunner(), generatedAt: "T" }))).requiredChecks[0].command).toBeTruthy();
  });

  it("JSON includes status", () => {
    expect(JSON.parse(formatJson(buildStatusModel({ repoRoot: repo, runner: mockRunner(), generatedAt: "T" }))).requiredChecks[0].status).toBe("PASS");
  });

  it("JSON includes exitCode", () => {
    expect(Object.hasOwn(JSON.parse(formatJson(buildStatusModel({ repoRoot: repo, runner: mockRunner(), generatedAt: "T" }))).requiredChecks[0], "exitCode")).toBe(true);
  });

  it("JSON includes durationMs", () => {
    expect(Object.hasOwn(JSON.parse(formatJson(buildStatusModel({ repoRoot: repo, runner: mockRunner(), generatedAt: "T" }))).requiredChecks[0], "durationMs")).toBe(true);
  });

  it("JSON includes testCount", () => {
    expect(Object.hasOwn(JSON.parse(formatJson(buildStatusModel({ repoRoot: repo, runner: mockRunner(), generatedAt: "T" }))).requiredChecks[0], "testCount")).toBe(true);
  });

  it("stable terminal after normalization", () => {
    const a = formatTerminal(buildStatusModel({ repoRoot: repo, runner: mockRunner(), generatedAt: "T" })).replace(repo, "<repo>");
    const b = formatTerminal(buildStatusModel({ repoRoot: repo, runner: mockRunner(), generatedAt: "T" })).replace(repo, "<repo>");
    expect(a).toBe(b);
  });

  it("stable JSON after normalization", () => {
    const a = formatJson(buildStatusModel({ repoRoot: repo, runner: mockRunner(), generatedAt: "T" })).replace(repo, "<repo>");
    const b = formatJson(buildStatusModel({ repoRoot: repo, runner: mockRunner(), generatedAt: "T" })).replace(repo, "<repo>");
    expect(a).toBe(b);
  });
});

describe("verify-v3-placement checks", () => {
  it("required check PASS", () => {
    expect(classifyCommandResult({ name: "x", command: "x", required: true, result: result(0, ""), isTest: false }).status).toBe("PASS");
  });

  it("required check FAIL", () => {
    expect(classifyCommandResult({ name: "x", command: "x", required: true, result: result(1, "bad"), isTest: false }).status).toBe("FAIL");
  });

  it("required check MISSING", () => {
    fs.writeFileSync(path.join(repo, "package.json"), JSON.stringify({ scripts: {} }));
    expect(buildStatusModel({ repoRoot: repo, runner: mockRunner() }).requiredChecks.some((check) => check.status === "MISSING")).toBe(true);
  });

  it("required check NOT_VALIDATED", () => {
    expect(classifyCommandResult({ name: "x", command: "x", required: true, result: result(0, "0 tests"), isTest: true }).status).toBe("NOT_VALIDATED");
  });

  it("optional check MISSING does not fail", () => {
    const model = buildStatusModel({ repoRoot: repo, runner: mockRunner() });
    expect(model.optionalChecks.some((check) => check.status === "MISSING")).toBe(true);
    expect(model.exitCode).toBe(0);
  });

  it("optional check FAIL fails", () => {
    write("package.json", JSON.stringify(packageJson({ "mb:status": "node x" })));
    const model = buildStatusModel({ repoRoot: repo, runner: mockRunner({ "npm run mb:status": result(1, "bad") }) });
    expect(model.exitCode).toBe(1);
  });

  it("optional check skipped by --skip-optional", () => {
    const model = buildStatusModel({ repoRoot: repo, runner: mockRunner(), options: { skipOptional: true } });
    expect(model.optionalChecks.every((check) => check.status === "SKIPPED")).toBe(true);
  });

  it("build skipped by --skip-build", () => {
    const model = buildStatusModel({ repoRoot: repo, runner: mockRunner(), options: { skipBuild: true } });
    expect(model.requiredChecks.find((check) => check.name === "build").status).toBe("SKIPPED");
  });

  it("--skip-build does not skip typecheck", () => {
    const model = buildStatusModel({ repoRoot: repo, runner: mockRunner(), options: { skipBuild: true } });
    expect(model.requiredChecks.find((check) => check.name === "typecheck:app").status).toBe("PASS");
  });

  it("typecheck failure exits 1", () => {
    expect(buildStatusModel({ repoRoot: repo, runner: mockRunner({ "npm run typecheck:app": result(1, "ts error") }) }).exitCode).toBe(1);
  });

  it("build failure exits 1", () => {
    expect(buildStatusModel({ repoRoot: repo, runner: mockRunner({ "npm run build": result(1, "build error") }) }).exitCode).toBe(1);
  });

  it("git diff failure exits 1", () => {
    expect(buildStatusModel({ repoRoot: repo, runner: mockRunner({ "git diff --check": result(1, "space") }) }).exitCode).toBe(1);
  });

  it("command runner timeout/failure classified", () => {
    expect(classifyCommandResult({ name: "x", command: "x", required: true, result: { ...result(1, ""), error: "timeout" } }).details).toContain("timeout");
  });
});

describe("verify-v3-placement test detection", () => {
  it("zero matched output detected", () => {
    expect(detectNotValidated("0 tests")).toBe(true);
  });

  it("no matching files output detected", () => {
    expect(detectNotValidated("No matching test files")).toBe(true);
  });

  it("all skipped output detected", () => {
    expect(detectNotValidated("all skipped")).toBe(true);
  });

  it("resume count below threshold detected", () => {
    expect(classifyCommandResult({ name: "r", command: "r", required: true, result: result(0, "Tests 41 passed (41)"), isTest: true, minTests: 42 }).status).toBe("NOT_VALIDATED");
  });

  it("resume count above threshold passes", () => {
    expect(classifyCommandResult({ name: "r", command: "r", required: true, result: result(0, "Tests 43 passed (43)"), isTest: true, minTests: 42 }).status).toBe("PASS");
  });

  it("Vitest file count detected", () => {
    expect(detectTestCount("✓ file.test.ts (42 tests) 12ms")).toBe(42);
  });

  it("Vitest summary count detected", () => {
    expect(detectTestCount("Tests 42 passed (42)")).toBe(42);
  });

  it("JSON total count detected", () => {
    expect(detectTestCount(JSON.stringify({ numTotalTests: 7, numPassedTests: 7 }))).toBe(7);
  });

  it("JSON all pending is not validated", () => {
    expect(detectNotValidated(JSON.stringify({ numTotalTests: 3, numPassedTests: 0, numPendingTests: 3 }))).toBe(true);
  });

  it("0 passed output is not validated", () => {
    expect(detectNotValidated("0 passed")).toBe(true);
  });
});

describe("verify-v3-placement resume inspection", () => {
  it("malformed package scripts exits 3", () => {
    write("package.json", JSON.stringify({ scripts: null }));
    expect(buildStatusModel({ repoRoot: repo, runner: mockRunner() }).exitCode).toBe(3);
  });

  it("broad test:resume rejected", () => {
    expect(inspectResumeScript(packageJson({ "test:resume": "vitest run resume" }), repo).status).toBe("INVALID_CONFIGURATION");
  });

  it("exact test:resume accepted", () => {
    expect(inspectResumeScript(packageJson(), repo).status).toBe("PASS");
  });

  it("missing resume file exits 1", () => {
    fs.rmSync(path.join(repo, RESUME));
    expect(buildStatusModel({ repoRoot: repo, runner: mockRunner() }).exitCode).toBe(1);
  });

  it("missing resume structure group exits 2", () => {
    write(RESUME, "it('route normalization', () => {})");
    expect(buildStatusModel({ repoRoot: repo, runner: mockRunner() }).exitCode).toBe(2);
  });

  it("all resume structure groups pass", () => {
    expect(inspectResumeTestStructure(repo).status).toBe("PASS");
  });

  it("resume not-validated action text present", () => {
    const check = classifyCommandResult({ name: "r", command: "r", required: true, result: result(0, "Tests 1 passed (1)"), isTest: true, minTests: 42 });
    expect(check.action).toContain("exact resume test file");
  });

  it("missing required script action text present", () => {
    write("package.json", JSON.stringify({ scripts: { test: "vitest run" } }));
    const check = inspectResumeScript(JSON.parse(fs.readFileSync(path.join(repo, "package.json"), "utf8")), repo);
    expect(check.action).toContain("test:resume");
  });
});

describe("verify-v3-placement optional checks", () => {
  it("validate:tests expected exit 2 passes", () => {
    expect(classifyValidateTestsResult(result(2, "")).status).toBe("PASS");
  });

  it("validate:tests exit 0 becomes FALSE_GREEN_RISK", () => {
    expect(classifyValidateTestsResult(result(0, "")).status).toBe("FALSE_GREEN_RISK");
  });

  it("placement session file present triggers optional run", () => {
    write("supabase/functions/placement-v3-session/__tests__/resumePolicy.test.ts", "it('x',()=>{})");
    const model = buildStatusModel({ repoRoot: repo, runner: mockRunner() });
    expect(model.optionalChecks.find((check) => check.name === "placement session").status).toBe("PASS");
  });

  it("placement session file missing reports MISSING", () => {
    const model = buildStatusModel({ repoRoot: repo, runner: mockRunner() });
    expect(model.optionalChecks.find((check) => check.name === "placement session").status).toBe("MISSING");
  });

  it("optional placement zero matched returns NOT_VALIDATED", () => {
    write("supabase/functions/placement-v3-session/__tests__/resumePolicy.test.ts", "it('x',()=>{})");
    const model = buildStatusModel({ repoRoot: repo, runner: mockRunner({ "npm run test -- placement-v3-session": result(0, "0 tests") }) });
    expect(model.optionalChecks.find((check) => check.name === "placement session").status).toBe("NOT_VALIDATED");
  });
});

describe("verify-v3-placement branch safety", () => {
  it("branch dirty visible", () => {
    const check = checkBranchSafety({ baseRef: "origin/main", repoRoot: repo, runner: mockRunner({ "git status --porcelain": result(0, " M package.json\n") }) });
    expect(check.details).toContain("state: dirty");
  });

  it("dirty alone does not fail", () => {
    const check = checkBranchSafety({ baseRef: "origin/main", repoRoot: repo, runner: mockRunner({ "git status --porcelain": result(0, " M package.json\n") }) });
    expect(check.status).toBe("PASS");
  });

  it("unrelated changed path fails branch safety", () => {
    const check = checkBranchSafety({ baseRef: "origin/main", repoRoot: repo, runner: mockRunner({ "git diff --name-only origin/main...HEAD": result(0, "README.md\n") }) });
    expect(check.status).toBe("FAIL");
  });

  it("allowed changed path passes branch safety", () => {
    const check = checkBranchSafety({ baseRef: "origin/main", repoRoot: repo, runner: mockRunner({ "git diff --name-only origin/main...HEAD": result(0, "package.json\n") }) });
    expect(check.status).toBe("PASS");
  });

  it("package diff with only verify script passes", () => {
    const diff = '+  "verify:v3-placement": "node scripts/verify-v3-placement.mjs",\n';
    expect(checkPackageDiff({ baseRef: "origin/main", repoRoot: repo, runner: mockRunner({ "git diff origin/main...HEAD -- package.json": result(0, diff) }) }).status).toBe("PASS");
  });

  it("package diff with test:resume plus verify script passes", () => {
    const diff = '+  "test:resume": "vitest run x",\n+  "verify:v3-placement": "node scripts/verify-v3-placement.mjs",\n';
    expect(checkPackageDiff({ baseRef: "origin/main", repoRoot: repo, runner: mockRunner({ "git diff origin/main...HEAD -- package.json": result(0, diff) }) }).status).toBe("PASS");
  });

  it("unrelated package script rejected", () => {
    const diff = '+  "new:thing": "node x",\n';
    expect(checkPackageDiff({ baseRef: "origin/main", repoRoot: repo, runner: mockRunner({ "git diff origin/main...HEAD -- package.json": result(0, diff) }) }).status).toBe("FAIL");
  });

  it("package contamination action text present", () => {
    const diff = '+  "new:thing": "node x",\n';
    expect(checkPackageDiff({ baseRef: "origin/main", repoRoot: repo, runner: mockRunner({ "git diff origin/main...HEAD -- package.json": result(0, diff) }) }).action).toContain("Remove unrelated package.json");
  });
});

describe("verify-v3-placement drift guard", () => {
  it("drift path rejected", () => {
    const check = scanDrift({ baseRef: "origin/main", repoRoot: repo, runner: mockRunner({ "git diff --name-only origin/main...HEAD": result(0, "src/lib/placement/v4/x.ts\n") }) });
    expect(check.status).toBe("FAIL");
  });

  it("drift added line rejected", () => {
    const diff = "+++ b/package.json\n+  \"x\": \"replay\"\n";
    const check = scanDrift({ baseRef: "origin/main", repoRoot: repo, runner: mockRunner({ "git diff origin/main...HEAD": result(0, diff) }) });
    expect(check.status).toBe("FAIL");
  });

  it("drift fixture terms allowed in verifier test file", () => {
    const diff = "+++ b/scripts/__tests__/verify-v3-placement.test.mjs\n+const x = 'replay governance authority rehearsal sovereignty placement/v4';\n";
    const check = scanDrift({ baseRef: "origin/main", repoRoot: repo, runner: mockRunner({ "git diff origin/main...HEAD": result(0, diff) }) });
    expect(check.status).toBe("PASS");
  });

  it("no drift passes", () => {
    expect(scanDrift({ baseRef: "origin/main", repoRoot: repo, runner: mockRunner() }).status).toBe("PASS");
  });

  it("drift action text present", () => {
    const check = scanDrift({ baseRef: "origin/main", repoRoot: repo, runner: mockRunner({ "git diff --name-only origin/main...HEAD": result(0, "src/lib/placement/v4/x.ts\n") }) });
    expect(check.action).toContain("Remove banned architecture drift");
  });
});

describe("verify-v3-placement blockers and exits", () => {
  it("blocker cap at 5", () => {
    const checks = Array.from({ length: 8 }, (_, index) => makeCheck({ name: `c${index}`, required: true, status: "FAIL", action: "fix" }));
    expect(extractBlockers(checks)).toHaveLength(5);
  });

  it("next actions mirror blockers", () => {
    const model = buildStatusModel({ repoRoot: repo, runner: mockRunner({ "npm run build": result(1, "bad") }) });
    expect(model.nextActions.map((x) => x.check)).toEqual(model.topBlockers.map((x) => x.check));
  });

  it("duplicate blocker categories collapsed or ordered deterministically", () => {
    const checks = [makeCheck({ name: "x", required: true, status: "FAIL" }), makeCheck({ name: "x", required: true, status: "FAIL" })];
    expect(extractBlockers(checks)).toHaveLength(1);
  });

  it("no blockers prints None", () => {
    const model = buildStatusModel({ repoRoot: repo, runner: mockRunner() });
    expect(formatTerminal(model)).toContain("Top Blockers\nNone");
  });

  it("exit 0 READY path", () => {
    expect(decideExit([makeCheck({ name: "x", required: true, status: "PASS" })])).toEqual({ exitCode: 0, exitReason: "READY" });
  });

  it("exit 1 NOT_READY path", () => {
    expect(decideExit([makeCheck({ name: "x", required: true, status: "FAIL" })])).toEqual({ exitCode: 1, exitReason: "NOT_READY" });
  });

  it("exit 2 NOT_VALIDATED path", () => {
    expect(decideExit([makeCheck({ name: "x", required: true, status: "NOT_VALIDATED" })])).toEqual({ exitCode: 2, exitReason: "NOT_VALIDATED" });
  });

  it("exit 3 INVALID_CONFIGURATION path", () => {
    expect(decideExit([makeCheck({ name: "x", required: true, status: "INVALID_CONFIGURATION" })])).toEqual({ exitCode: 3, exitReason: "INVALID_CONFIGURATION" });
  });

  it("exit 4 USAGE_ERROR path", () => {
    expect(parseArgs(["--what"]).error).toBeTruthy();
  });

  it("final model rejects unknown status", () => {
    expect(validateCheckShape({ ...makeCheck({ name: "x", required: true, status: "PASS" }), status: "WEIRD" })).toBe(false);
  });

  it("final model rejects malformed blocker shape", () => {
    expect(validateCheckShape({ name: "x" })).toBe(false);
  });
});

describe("verify-v3-placement main helper", () => {
  it("main JSON writes valid JSON", async () => {
    let out = "";
    const code = await main(["--json"], {
      repoRoot: repo,
      runner: mockRunner(),
      generatedAt: "T",
      stdout: { write: (text) => { out += text; } },
      stderr: { write: () => {} },
      forceReal: true,
    });
    expect(code).toBe(0);
    expect(JSON.parse(out).exitReason).toBe("READY");
  });

  it("main help writes help", async () => {
    let out = "";
    const code = await main(["--help"], {
      stdout: { write: (text) => { out += text; } },
      stderr: { write: () => {} },
      forceReal: true,
    });
    expect(code).toBe(0);
    expect(out).toContain("Options");
  });

  it("main invalid args returns usage code", async () => {
    let err = "";
    const code = await main(["--bad"], {
      stdout: { write: () => {} },
      stderr: { write: (text) => { err += text; } },
      forceReal: true,
    });
    expect(code).toBe(4);
    expect(err).toContain("Unknown argument");
  });
});
