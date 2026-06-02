// src/features/review/content/scripts/content-lint.ts
//
// Standalone content-lint runner (DC4). Reads every committed seed JSON under
// ../seeds/out/, re-runs the structural gate on every card, and EXITS NON-ZERO
// if any card is uncertified or any seed isn't status:"for-review". Run via:
//   npx tsx src/features/review/content/scripts/content-lint.ts
//
// The same logic is enforced in CI through seeds/__tests__/seedsLint.test.ts
// (the project test suite CI runs), so an uncertified card can never land.

import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { lintSeeds } from "../seeds/lintSeeds";
import type { Seed } from "../seeds/buildSeed";

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "seeds", "out");

function loadSeeds(): Seed[] {
  const files = readdirSync(OUT_DIR).filter((f) => f.endsWith(".seed.json"));
  return files.map((f) => JSON.parse(readFileSync(join(OUT_DIR, f), "utf8")) as Seed);
}

async function main(): Promise<void> {
  const seeds = loadSeeds();
  const { ok, results } = await lintSeeds(seeds);

  for (const r of results) {
    const tag = r.ok ? "OK " : "FAIL";
    // eslint-disable-next-line no-console
    console.log(`[content-lint] ${tag} ${r.flow} ${r.level} — ${r.total} cards`);
    for (const f of r.failures) {
      // eslint-disable-next-line no-console
      console.log(`    ✗ ${f.id} "${f.front}" :: ${f.reasons.join(", ")}`);
    }
    if (!r.statusOk) {
      // eslint-disable-next-line no-console
      console.log(`    ✗ status is not "for-review"`);
    }
  }

  if (!ok) {
    // eslint-disable-next-line no-console
    console.error("[content-lint] FAILED — uncertified cards in committed seeds");
    process.exitCode = 1;
  } else {
    // eslint-disable-next-line no-console
    console.log(`[content-lint] all ${results.length} seeds clean`);
  }
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("[content-lint] error:", err);
  process.exitCode = 1;
});
