// src/features/review/content/scripts/build-ja-seeds.ts
//
// Build-time runner for the vi→ja GENERATION seed (DC3-ja). OFFLINE: reads the
// hand-authored vi⇄ja batch (ingestion/japaneseSeed.authored.ts), builds a
// staticTranslator from its two maps, generates candidates (front=vi via
// toVietnamese, romaji via deriveRomaji/wanakana), then runs them through the
// gate WITH the back-translation round-trip checker before seeding.
//
// NO runtime model calls, NO Supabase: the "Translator" is the authored static
// map. Output is "for-review" — building this seed does NOT wire vi-ja live.
//
//   npx tsx src/features/review/content/scripts/build-ja-seeds.ts

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  RAW_ITEMS,
  toVi,
  fromVi,
} from "../ingestion/japaneseSeed.authored";
import {
  generateCandidates,
  makeRoundTripChecker,
  staticTranslator,
} from "../generate";
import { buildSeed } from "../seeds/buildSeed";

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "seeds", "out");

function writeJson(name: string, data: unknown): void {
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(join(OUT_DIR, name), JSON.stringify(data, null, 2) + "\n", "utf8");
}

async function main(): Promise<void> {
  // The authored static maps ARE the Translator (no live MT in the build).
  const translator = staticTranslator(toVi, fromVi);

  // Generate: front (vi) ← toVietnamese(back); romaji ← deriveRomaji(back).
  const candidates = await generateCandidates(RAW_ITEMS, { translator });

  // Certify through the gate WITH the injected round-trip (generated cards must
  // round-trip back to their authored Japanese ≥ threshold to be seeded).
  const { seed, quarantine } = await buildSeed(candidates, {
    flow: "vi-ja",
    level: "A1",
    limit: 20,
    roundTrip: makeRoundTripChecker(translator),
    roundTripThreshold: 0.6,
  });

  writeJson("vi-ja.A1.seed.json", seed);
  writeJson("vi-ja.quarantine.json", quarantine);

  // eslint-disable-next-line no-console
  console.log(
    `[build-ja-seeds] vi-ja: rawItems=${RAW_ITEMS.length} ` +
      `generated=${candidates.length} certified=${seed.certifiedTotal} ` +
      `A1=${seed.certifiedAtLevel} seeded=${seed.cards.length} ` +
      `quarantined=${quarantine.total}`,
  );
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("[build-ja-seeds] failed:", err);
  process.exitCode = 1;
});
