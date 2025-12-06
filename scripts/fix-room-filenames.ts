#!/usr/bin/env tsx
/**
 * Auto-Fix Suite – Part 1: Filename normalizer
 *
 * - Only touches files in public/data (not subfolders)
 * - Keeps JSON content and id fields unchanged
 * - Fixes:
 *   - Uppercase → lowercase
 *   - "-free.json" / "-vipX.json" / "-kidslevelX.json" → "_free.json" etc.
 *
 * Usage:
 *   npx tsx scripts/fix-room-filenames.ts --dry-run   # preview
 *   npx tsx scripts/fix-room-filenames.ts             # apply
 */

import { readdirSync, renameSync, writeFileSync } from "fs";
import { join } from "path";

const DATA_DIR = join(process.cwd(), "public", "data");
const DRY_RUN = process.argv.includes("--dry-run");

type RenamePlan = {
  oldName: string;
  newName: string;
  reason: string;
};

const tierSuffixRegex = /_(free|vip[1-9]|kidslevel[1-3])\.json$/;

function computeNewName(name: string): RenamePlan | null {
  if (!name.endsWith(".json")) return null;
  if (name === "room-metrics.json") return null; // leave metrics file alone

  let newName = name;
  const reasons: string[] = [];

  // 1) enforce lowercase
  const lower = newName.toLowerCase();
  if (newName !== lower) {
    newName = lower;
    reasons.push("lowercase");
  }

  // 2) enforce suffix pattern: _free / _vipX / _kidslevelX
  if (!tierSuffixRegex.test(newName)) {
    const before = newName;
    newName = newName
      .replace(/-free\.json$/, "_free.json")
      .replace(/-vip([1-9])\.json$/, "_vip$1.json")
      .replace(/-kidslevel([1-3])\.json$/, "_kidslevel$1.json");

    if (newName !== before) {
      reasons.push("fix suffix hyphen→underscore");
    }
  }

  // If nothing changed, skip
  if (newName === name) return null;

  // Final guard: only apply if suffix is now valid
  if (!tierSuffixRegex.test(newName)) {
    // We don't want to guess too aggressively – leave these for manual fix
    return null;
  }

  return {
    oldName: name,
    newName,
    reason: reasons.join(", ") || "normalize",
  };
}

function main() {
  console.log("🔧 Auto-Fix Suite: Filename normalizer");
  console.log(`📂 Data dir: ${DATA_DIR}`);
  console.log(DRY_RUN ? "👀 DRY RUN (no files will be renamed)" : "✍️ APPLY MODE (files will be renamed)");
  console.log("");

  const files = readdirSync(DATA_DIR);
  const plan: RenamePlan[] = [];

  for (const name of files) {
    const change = computeNewName(name);
    if (!change) continue;

    const { oldName, newName, reason } = change;
    plan.push(change);
    console.log(`→ ${oldName}  ==>  ${newName}  (${reason})`);

    if (!DRY_RUN) {
      const oldPath = join(DATA_DIR, oldName);
      const newPath = join(DATA_DIR, newName);
      renameSync(oldPath, newPath);
    }
  }

  console.log("");
  console.log(`📊 Planned renames: ${plan.length}`);

  if (DRY_RUN) {
    const planPath = join(DATA_DIR, "filename-fix-plan.json");
    writeFileSync(planPath, JSON.stringify(plan, null, 2), "utf8");
    console.log(`📝 Dry-run plan written to: ${planPath}`);
  } else {
    console.log("✅ Renames applied. Please review git diff and re-run your registry generator.");
  }
}

main();
