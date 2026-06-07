#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const candidateDirs = [
  "tests/regression/ai-tutor-golden-flow",
  "tests/regression/golden-flow",
];
const requiredSuites = [
  "src/components/ai-tutor/__tests__/aiTutorGoldenFlow.audio.test.tsx",
];

const testFilePattern = /\.(test|spec)\.[cm]?[jt]sx?$/;

function walk(dir) {
  if (!existsSync(dir)) return [];

  const entries = readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
    } else if (entry.isFile() && testFilePattern.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

const fixtureFiles = candidateDirs
  .flatMap((dir) => walk(path.join(root, dir)))
  .filter((file) => statSync(file).isFile())
  .sort();
const requiredFiles = requiredSuites
  .map((file) => path.join(root, file))
  .filter((file) => existsSync(file) && statSync(file).isFile());
const testFiles = [...new Set([...requiredFiles, ...fixtureFiles])].sort();

if (testFiles.length === 0) {
  console.log(
    "[ai-tutor-quality-gate] No golden-flow test files found. Gate is wired and passing vacuously.",
  );
  console.log(
    `[ai-tutor-quality-gate] Populate one of: ${candidateDirs.join(", ")}`,
  );
  process.exit(0);
}

if (fixtureFiles.length === 0) {
  console.log(
    `[ai-tutor-quality-gate] No fixture files found in: ${candidateDirs.join(", ")}`,
  );
}

console.log(
  `[ai-tutor-quality-gate] Running ${testFiles.length} golden-flow test file(s).`,
);

const result = spawnSync("npx", ["vitest", "run", ...testFiles], {
  cwd: root,
  env: {
    ...process.env,
    AI_TUTOR_QUALITY_GATE: "1",
    OPENAI_API_KEY: "",
    ANTHROPIC_API_KEY: "",
    GEMINI_API_KEY: "",
    VITE_SUPABASE_URL: "",
    VITE_SUPABASE_ANON_KEY: "",
    SUPABASE_SERVICE_ROLE_KEY: "",
  },
  stdio: "inherit",
});

if (result.error) {
  console.error(`[ai-tutor-quality-gate] Failed to run Vitest: ${result.error.message}`);
  process.exit(1);
}

process.exit(result.status ?? 1);
