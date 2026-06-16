#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const artifactPath = resolve(
  "docs/internal/intelligence-ladder/step7-native-azure-evidence.md",
);

const allowedStatuses = [
  "fully closed",
  "partially closed",
  "not fully evidence-closed",
];

function fail(message) {
  console.error(`[step7-native-azure-evidence] ${message}`);
  process.exitCode = 1;
}

function readText(path) {
  return readFileSync(path, "utf8");
}

function readJson(path) {
  try {
    return JSON.parse(readText(path));
  } catch (err) {
    fail(`invalid JSON at ${path}: ${err instanceof Error ? err.message : String(err)}`);
    return null;
  }
}

function section(text, heading) {
  const lines = text.split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === `## ${heading}`);
  if (start === -1) return "";

  const body = [];
  for (let index = start + 1; index < lines.length; index += 1) {
    if (/^##\s+/.test(lines[index])) break;
    body.push(lines[index]);
  }
  return body.join("\n");
}

function unique(values) {
  return [...new Set(values)];
}

function evidencePackDirs(text) {
  const matches = [...text.matchAll(/`?(reports\/ladder\/step7-evidence\/[^`\s)]+)\/manifest\.json`?/g)]
    .map((match) => resolve(match[1]));
  return unique(matches);
}

function parseCsvRows(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = lines[0].split(",");
  return lines.slice(1).map((line) => {
    const values = line.split(",");
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
  });
}

if (!existsSync(artifactPath)) {
  fail(`missing artifact: ${artifactPath}`);
} else {
  const text = readText(artifactPath);
  const normalized = text.toLowerCase();

  const finalStatusMatches = [...normalized.matchAll(/final status:\s*([^\n]+)/g)].map(
    (match) => match[1].trim(),
  );
  if (finalStatusMatches.length !== 1) {
    fail(`expected exactly one "Final status:" line, found ${finalStatusMatches.length}`);
  } else if (!allowedStatuses.includes(finalStatusMatches[0])) {
    fail(
      `invalid final status "${finalStatusMatches[0]}"; expected one of: ${allowedStatuses.join(
        ", ",
      )}`,
    );
  }

  const requiredSections = [
    "Real Azure Evidence",
    "Synthetic Evidence",
    "Native-Ear Validation",
    "Missing / Unproven Evidence",
  ];
  for (const heading of requiredSections) {
    if (!section(text, heading).trim()) {
      fail(`missing or empty section: ## ${heading}`);
    }
  }

  const realAzure = section(text, "Real Azure Evidence").toLowerCase();
  if (!/\bprovider=azure\b/.test(realAzure)) {
    fail("real Azure section must name provider=azure as required proof");
  }
  if (!/\bmode=azure_phoneme_batch\b/.test(realAzure)) {
    fail("real Azure section must name mode=azure_phoneme_batch as required proof");
  }
  if (!/(missing|unproven|captured|passed|closed)/.test(realAzure)) {
    fail("real Azure section must clearly state whether evidence is missing/unproven or captured");
  }
  if (/readiness-only|synthetic/.test(realAzure) && !/not proof|no azure-native result|no live request/.test(realAzure)) {
    fail("real Azure section appears to blur synthetic readiness with Azure proof");
  }

  const synthetic = section(text, "Synthetic Evidence").toLowerCase();
  if (!/readiness-only/.test(synthetic)) {
    fail("synthetic section must explicitly mark synthetic/local evidence as readiness-only");
  }
  if (!/must not be (presented|counted)|does not prove/.test(synthetic)) {
    fail("synthetic section must say synthetic evidence is not native-ear or real Azure proof");
  }

  const nativeEar = section(text, "Native-Ear Validation").toLowerCase();
  if (!/(reviewer|native-ear|native ear)/.test(nativeEar)) {
    fail("native-ear section must mention reviewer/native-ear validation");
  }
  if (!/(missing|unproven|completed|attached|passed)/.test(nativeEar)) {
    fail("native-ear section must clearly state validation status");
  }

  const missing = section(text, "Missing / Unproven Evidence").toLowerCase();
  const missingNeedles = [
    "live azure",
    "provider=azure",
    "mode=azure_phoneme_batch",
    "nonzero phoneme",
    "native-ear",
    "owner acceptance",
  ];
  for (const needle of missingNeedles) {
    if (!missing.includes(needle)) {
      fail(`missing/unproven section must list: ${needle}`);
    }
  }

  const packDirs = evidencePackDirs(text);
  if (packDirs.length === 0) {
    fail("artifact must reference at least one concrete reports/ladder/step7-evidence/*/manifest.json pack");
  }

  const finalStatus = finalStatusMatches[0];
  for (const packDir of packDirs) {
    const manifestPath = join(packDir, "manifest.json");
    const liveLogPath = join(packDir, "live-azure-smoke.log");
    const nativeCsvPath = join(packDir, "native-ear-scores.csv");

    if (!existsSync(manifestPath)) fail(`referenced evidence manifest is missing: ${manifestPath}`);
    if (!existsSync(liveLogPath)) fail(`referenced live Azure log is missing: ${liveLogPath}`);
    if (!existsSync(nativeCsvPath)) fail(`referenced native-ear CSV is missing: ${nativeCsvPath}`);

    const manifest = existsSync(manifestPath) ? readJson(manifestPath) : null;
    const validation = manifest?.validationStatus ?? {};
    const liveStatus = String(validation.liveAzureSmokeStatus ?? "");
    const nativeAttached = validation.nativeEarEvidenceAttached === true;
    const step7Complete = validation.step7Complete === true;
    const liveLog = existsSync(liveLogPath) ? readText(liveLogPath).toLowerCase() : "";
    const nativeRows = existsSync(nativeCsvPath) ? parseCsvRows(readText(nativeCsvPath)) : [];
    const pendingNativeRows = nativeRows.filter((row) =>
      /pending|attach|yyyy|reviewer_id/i.test(Object.values(row).join(" ")),
    );

    if (finalStatus === "fully closed") {
      if (liveStatus !== "passed") fail("fully closed status requires liveAzureSmokeStatus=passed");
      if (!nativeAttached) fail("fully closed status requires nativeEarEvidenceAttached=true");
      if (!step7Complete) fail("fully closed status requires step7Complete=true");
      if (pendingNativeRows.length > 0) fail("fully closed status cannot use pending/template native-ear rows");
    }

    if (finalStatus === "not fully evidence-closed") {
      const azureMissing =
        liveStatus !== "passed" ||
        /blocked|no live request was sent|missing preconditions/.test(liveLog);
      const nativeMissing = !nativeAttached || pendingNativeRows.length > 0;
      if (!azureMissing && !nativeMissing) {
        fail("not fully evidence-closed status must be supported by missing Azure or native-ear evidence");
      }
    }
  }

  if (process.exitCode) {
    process.exit();
  }

  console.log(`[step7-native-azure-evidence] verified ${artifactPath}`);
}
