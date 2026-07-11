#!/usr/bin/env node
import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const migrationsDir = path.join(repoRoot, "supabase", "migrations");
const markerPrefix = "// Supabase migrations fingerprint: ";
const typeFiles = [
  "src/integrations/supabase/types.ts",
  "supabase/functions/_shared/database.types.ts",
];

function migrationFingerprint() {
  const files = readdirSync(migrationsDir)
    .filter((name) => name.endsWith(".sql"))
    .sort();
  if (files.length === 0) {
    throw new Error("No supabase/migrations/*.sql files found.");
  }

  const hash = createHash("sha256");
  for (const file of files) {
    hash.update(file);
    hash.update("\0");
    hash.update(readFileSync(path.join(migrationsDir, file)));
    hash.update("\0");
  }
  return { hash: hash.digest("hex"), count: files.length };
}

function readMarker(file) {
  const text = readFileSync(path.join(repoRoot, file), "utf8");
  const firstLines = text.split("\n").slice(0, 8);
  const marker = firstLines.find((line) => line.startsWith(markerPrefix));
  return marker?.slice(markerPrefix.length).trim() ?? null;
}

const { hash, count } = migrationFingerprint();
const failures = [];

for (const file of typeFiles) {
  const marker = readMarker(file);
  if (marker !== hash) {
    failures.push({ file, marker });
  }
}

if (failures.length > 0) {
  console.error("Supabase generated types are not stamped with the current migrations fingerprint.");
  console.error(`Expected fingerprint for ${count} migration files: ${hash}`);
  for (const failure of failures) {
    console.error(`- ${failure.file}: ${failure.marker ? `found ${failure.marker}` : "missing marker"}`);
  }
  console.error("");
  console.error("Regenerate or verify Supabase types, then update the marker at the top of both generated type files.");
  process.exit(1);
}

console.log(`Supabase types drift check passed (${count} migrations, fingerprint ${hash}).`);
