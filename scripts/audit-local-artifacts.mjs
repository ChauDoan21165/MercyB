#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const SCHEMA_VERSION = "local-artifact-audit/v1";

const EXIT_CODES = {
  CLEAN: 0,
  UNSAFE: 1,
  INVALID_AUDIT_CONFIGURATION: 3,
  USAGE_ERROR: 4,
};

const AUDIT_ITEMS = [
  {
    name: "validate:tests",
    packageScript: "validate:tests",
    files: ["scripts/validate-tests.mjs", "scripts/__tests__/validate-tests.test.mjs"],
  },
  {
    name: "mb:status",
    packageScript: "mb:status",
    files: ["scripts/morning-status.mjs", "scripts/__tests__/morning-status.test.mjs"],
  },
  {
    name: "ops:morning",
    packageScript: "ops:morning",
    files: ["scripts/ops-morning.mjs", "scripts/__tests__/ops-morning.test.mjs"],
  },
  {
    name: "pr:ready",
    packageScript: "pr:ready",
    files: ["scripts/pr-ready.mjs", "scripts/__tests__/pr-ready.test.mjs"],
  },
  {
    name: "test:resume",
    packageScript: "test:resume",
    files: ["src/pages/placement/v3/__tests__/ResultsPage.resumeSmoke.test.tsx"],
  },
  {
    name: "verify:v3-placement",
    packageScript: "verify:v3-placement",
    files: ["scripts/verify-v3-placement.mjs", "scripts/__tests__/verify-v3-placement.test.mjs"],
  },
  {
    name: "release:v3-placement",
    packageScript: "release:v3-placement",
    files: ["scripts/release-v3-placement.mjs", "scripts/__tests__/release-v3-placement.test.mjs"],
  },
  {
    name: "mobile-audio",
    packageScripts: ["test:mobile-audio", "verify:mobile-audio"],
    files: [
      "scripts/verify-mobile-audio.mjs",
      "scripts/__tests__/verify-mobile-audio.test.mjs",
      "src/lib/speech/mobileSafariSpeakingRuntime.ts",
      "src/components/mercy-guide/MercySpeakTab.tsx",
      "src/lib/speech/__tests__/mobileSafariSpeakingRuntime.test.ts",
      "src/components/mercy-guide/__tests__/MercySpeakTab.mobileAudio.test.tsx",
    ],
  },
];

function usage() {
  return [
    "Usage",
    "  npm run audit:local-artifacts",
    "  npm run audit:local-artifacts -- --json",
    "  npm run --silent audit:local-artifacts -- --json",
    "  npm run audit:local-artifacts -- --help",
    "",
    "Exit codes",
    "  0 CLEAN",
    "  1 UNSAFE",
    "  3 INVALID_AUDIT_CONFIGURATION",
    "  4 USAGE_ERROR",
  ].join("\n");
}

function parseArgs(argv) {
  const options = { json: false, help: false };
  for (const arg of argv) {
    if (arg === "--json") {
      options.json = true;
    } else if (arg === "--help" || arg === "-h") {
      options.help = true;
    } else {
      return { error: `Unknown argument: ${arg}` };
    }
  }
  return { options };
}

function git(repoRoot, args) {
  return execFileSync("git", args, {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trimEnd();
}

function repoRoot(cwd = process.cwd()) {
  return git(cwd, ["rev-parse", "--show-toplevel"]);
}

function branch(repoRootValue) {
  return git(repoRootValue, ["branch", "--show-current"]) || "DETACHED";
}

function readPackageJson(repoRootValue) {
  try {
    return JSON.parse(fs.readFileSync(path.join(repoRootValue, "package.json"), "utf8"));
  } catch (error) {
    throw new Error(`package.json is malformed or unreadable: ${error.message}`);
  }
}

function pathState(repoRootValue, relativePath) {
  const fullPath = path.join(repoRootValue, relativePath);
  if (!fs.existsSync(fullPath)) {
    return "MISSING";
  }

  const status = git(repoRootValue, ["status", "--porcelain", "--", relativePath]);
  if (status.startsWith("??")) {
    return "UNTRACKED";
  }
  if (status.trim()) {
    return "MODIFIED";
  }

  try {
    git(repoRootValue, ["ls-files", "--error-unmatch", relativePath]);
    return "TRACKED";
  } catch {
    return "UNTRACKED";
  }
}

function fileReport(repoRootValue, relativePath) {
  const state = pathState(repoRootValue, relativePath);
  return {
    path: relativePath,
    state,
    safeToDependOn: state === "TRACKED",
  };
}

function scriptReport(packageJson, scriptName) {
  const command = packageJson.scripts?.[scriptName];
  const state = typeof command === "string" ? "PRESENT" : "MISSING";
  return {
    name: scriptName,
    state,
    command: typeof command === "string" ? command : null,
    safeToDependOn: state === "PRESENT",
  };
}

function audit({ cwd = process.cwd(), now = new Date().toISOString() } = {}) {
  const root = repoRoot(cwd);
  const packageJson = readPackageJson(root);
  const artifacts = AUDIT_ITEMS.map((item) => {
    const scriptNames = item.packageScripts ?? [item.packageScript];
    const scripts = scriptNames.map((scriptName) => scriptReport(packageJson, scriptName));
    const files = item.files.map((filePath) => fileReport(root, filePath));
    const safeToDependOn = scripts.every((script) => script.safeToDependOn) && files.every((file) => file.safeToDependOn);
    return {
      name: item.name,
      scripts,
      files,
      safeToDependOn,
    };
  });

  const unsafeArtifacts = artifacts
    .filter((artifact) => !artifact.safeToDependOn)
    .map((artifact) => ({
      name: artifact.name,
      unsafeScripts: artifact.scripts.filter((script) => !script.safeToDependOn).map((script) => script.name),
      unsafeFiles: artifact.files.filter((file) => !file.safeToDependOn).map((file) => file.path),
    }));

  const exitCode = unsafeArtifacts.length === 0 ? EXIT_CODES.CLEAN : EXIT_CODES.UNSAFE;
  const exitReason = exitCode === EXIT_CODES.CLEAN ? "CLEAN" : "UNSAFE";

  return {
    schemaVersion: SCHEMA_VERSION,
    generatedAt: now,
    repoRoot: root,
    branch: branch(root),
    artifacts,
    unsafeArtifacts,
    exitCode,
    exitReason,
  };
}

function renderTerminal(report) {
  const lines = [
    "Local Artifact Audit",
    "",
    "Run Info",
    `Schema Version: ${report.schemaVersion}`,
    `Generated At: ${report.generatedAt}`,
    `Repo Root: ${report.repoRoot}`,
    `Branch: ${report.branch}`,
    "",
    "Artifacts",
  ];

  for (const artifact of report.artifacts) {
    lines.push(`- ${artifact.name}: safeToDependOn=${artifact.safeToDependOn}`);
    for (const script of artifact.scripts) {
      lines.push(`  script ${script.name}: ${script.state}, command=${script.command ?? "MISSING"}, safeToDependOn=${script.safeToDependOn}`);
    }
    for (const file of artifact.files) {
      lines.push(`  file ${file.path}: ${file.state}, safeToDependOn=${file.safeToDependOn}`);
    }
  }

  lines.push("");
  lines.push("Unsafe Dependencies");
  if (report.unsafeArtifacts.length === 0) {
    lines.push("- none");
  } else {
    for (const artifact of report.unsafeArtifacts) {
      lines.push(`- ${artifact.name}: scripts=[${artifact.unsafeScripts.join(", ")}], files=[${artifact.unsafeFiles.join(", ")}]`);
    }
  }

  lines.push("");
  lines.push("Exit Summary");
  lines.push(`Exit Code: ${report.exitCode}`);
  lines.push(`Exit Reason: ${report.exitReason}`);
  return lines.join("\n");
}

function main(argv = process.argv.slice(2)) {
  const parsed = parseArgs(argv);
  if (parsed.error) {
    console.error(parsed.error);
    console.error(usage());
    return EXIT_CODES.USAGE_ERROR;
  }

  if (parsed.options.help) {
    console.log(usage());
    return EXIT_CODES.CLEAN;
  }

  try {
    const report = audit();
    if (parsed.options.json) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      console.log(renderTerminal(report));
    }
    return report.exitCode;
  } catch (error) {
    if (parsed.options?.json) {
      console.log(JSON.stringify({
        schemaVersion: SCHEMA_VERSION,
        generatedAt: new Date().toISOString(),
        repoRoot: process.cwd(),
        branch: "UNKNOWN",
        artifacts: [],
        unsafeArtifacts: [{ name: "audit", unsafeScripts: [], unsafeFiles: [error.message] }],
        exitCode: EXIT_CODES.INVALID_AUDIT_CONFIGURATION,
        exitReason: "INVALID_AUDIT_CONFIGURATION",
      }, null, 2));
    } else {
      console.error(`Audit configuration error: ${error.message}`);
    }
    return EXIT_CODES.INVALID_AUDIT_CONFIGURATION;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  process.exitCode = main();
}

export {
  AUDIT_ITEMS,
  EXIT_CODES,
  SCHEMA_VERSION,
  audit,
  fileReport,
  main,
  parseArgs,
  pathState,
  renderTerminal,
  scriptReport,
};
