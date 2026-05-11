// scripts/check-migration-drift.ts
//
// Detect drift between supabase/migrations/ on disk and what's actually
// applied to the linked Supabase project. Two failure modes we care
// about:
//
//   1. Migration file on disk that isn't in the remote DB → next
//      `supabase db push` will try to apply it; if it has destructive
//      side-effects we want to know BEFORE the push.
//   2. Migration applied in the remote DB that isn't on disk → someone
//      ran SQL outside the migration flow (e.g. in the SQL Editor) and
//      didn't commit the file. This is the drift class that bit us
//      multiple times this month (access-codes constraint, st.key
//      trigger column, etc.).
//
// `supabase/migrations_manual/` is excluded — manual SQL Editor patches
// live there by convention; they're intentionally applied outside the
// CLI migration runner.
//
// Run:
//   npx tsx scripts/check-migration-drift.ts
//
// Exits 1 on drift detected; 0 when clean.

import { execSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const MIGRATIONS_DIR = resolve("supabase/migrations");

if (!existsSync(MIGRATIONS_DIR)) {
  console.error(`[check-migration-drift] ${MIGRATIONS_DIR} not found`);
  process.exit(2);
}

// Each on-disk migration is named `<14-digit-timestamp>_<description>.sql`.
// The CLI compares only the timestamp prefix; extract it.
function diskVersions(): Set<string> {
  const set = new Set<string>();
  for (const file of readdirSync(MIGRATIONS_DIR)) {
    if (!file.endsWith(".sql")) continue;
    const m = file.match(/^(\d{14})/);
    if (m) set.add(m[1]);
  }
  return set;
}

// `supabase migration list --linked` returns a pretty-printed table
// with three columns: Local | Remote | Time. Each row has a 14-digit
// version on one or both sides. We just want the union of "what the
// CLI thinks is on disk" (Local col) and "what the DB says is applied"
// (Remote col).
function cliView(): { local: Set<string>; remote: Set<string> } {
  let raw: string;
  try {
    raw = execSync("supabase migration list --linked", {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (err) {
    console.error(
      "[check-migration-drift] `supabase migration list --linked` failed. " +
        "CLI must be authenticated and project must be linked.",
    );
    throw err;
  }
  const local = new Set<string>();
  const remote = new Set<string>();
  for (const line of raw.split("\n")) {
    // Skip headers / separators / blank lines.
    if (!line.trim() || line.includes("Local") || line.includes("--")) continue;
    // Columns are pipe-separated with surrounding whitespace.
    const cols = line.split("|").map((c) => c.trim());
    if (cols.length < 2) continue;
    const localVer = cols[0]?.match(/^\d{14}$/)?.[0];
    const remoteVer = cols[1]?.match(/^\d{14}$/)?.[0];
    if (localVer) local.add(localVer);
    if (remoteVer) remote.add(remoteVer);
  }
  return { local, remote };
}

function main(): void {
  const disk = diskVersions();
  const { local: cliLocal, remote: cliRemote } = cliView();

  console.log(
    `[check-migration-drift] on-disk=${disk.size} cli-local=${cliLocal.size} cli-remote=${cliRemote.size}\n`,
  );
  console.log(
    "Note: supabase/migrations_manual/ is excluded — manual SQL Editor patches are applied outside the CLI runner.\n",
  );

  // Drift class 1: on disk but not applied remotely → pending apply.
  const pending = [...disk].filter((v) => !cliRemote.has(v)).sort();
  // Drift class 2: applied remotely but missing from disk → applied
  // out-of-band via SQL Editor. The dangerous class.
  const outOfBand = [...cliRemote].filter((v) => !disk.has(v)).sort();

  if (pending.length === 0 && outOfBand.length === 0) {
    console.log("✅ No drift detected. Local and remote are in sync.");
    process.exit(0);
  }

  if (pending.length > 0) {
    console.log(`⚠️  ${pending.length} migration(s) on disk but NOT YET applied to remote:`);
    for (const v of pending) console.log(`     ${v}`);
    console.log("");
  }

  if (outOfBand.length > 0) {
    console.log(`❌ ${outOfBand.length} migration(s) applied to remote but MISSING from disk:`);
    for (const v of outOfBand) console.log(`     ${v}`);
    console.log(
      "   These were likely applied via the SQL Editor. " +
        "Pull them with `supabase migration repair` or recreate the file on disk.\n",
    );
  }

  process.exit(1);
}

main();
