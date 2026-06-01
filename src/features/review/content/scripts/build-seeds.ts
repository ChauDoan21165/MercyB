// src/features/review/content/scripts/build-seeds.ts
//
// Build-time seed generator (DC1 runner). OFFLINE: reads existing lesson content
// (read-only module imports), runs ingestion → validation gate → writes the
// certified seed + quarantine report as static JSON under ../seeds/out/.
//
// NO runtime model calls and NO Supabase: this script runs only when a human
// invokes it (`npx tsx src/features/review/content/scripts/build-seeds.ts`),
// never in the app bundle. Generation-backed flows (zh/ko/ja gaps) plug a real
// Translator into the gate's roundTrip option here; vi→de needs none.
//
// Output is "for-review" — committing a seed does NOT wire a flow into the live
// ReviewApp. A flow flips on only after its seed passes review (separate step).

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Real German lesson corpus (read-only).
import { lessons as deA1 } from "@/languages/german/lessons-a1";
import { lessons as deA2 } from "@/languages/german/lessons-a2";
import { lessons as deB1 } from "@/languages/german/lessons-b1";
import { lessons as deB2 } from "@/languages/german/lessons-b2";
import { lessons as deC1 } from "@/languages/german/lessons-c1";
import { lessons as deC2 } from "@/languages/german/lessons-c2";

import { buildGermanCandidates } from "../ingestion/germanLessons";
import { buildSeed } from "../seeds/buildSeed";

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "seeds", "out");

function writeJson(name: string, data: unknown): void {
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(join(OUT_DIR, name), JSON.stringify(data, null, 2) + "\n", "utf8");
}

async function main(): Promise<void> {
  // ── vi→de — pure adaptation, no generation, no round-trip checker ──────────
  const deLessons = [...deA1, ...deA2, ...deB1, ...deB2, ...deC1, ...deC2];
  const deCandidates = buildGermanCandidates(deLessons);
  const { seed, quarantine } = await buildSeed(deCandidates, {
    flow: "vi-de",
    level: "A1",
    limit: 20,
  });

  writeJson("vi-de.A1.seed.json", seed);
  writeJson("vi-de.quarantine.json", quarantine);

  // eslint-disable-next-line no-console
  console.log(
    `[build-seeds] vi-de: candidates=${deCandidates.length} ` +
      `certified=${seed.certifiedTotal} A1=${seed.certifiedAtLevel} ` +
      `seeded=${seed.cards.length} quarantined=${quarantine.total}`,
  );
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("[build-seeds] failed:", err);
  process.exitCode = 1;
});
