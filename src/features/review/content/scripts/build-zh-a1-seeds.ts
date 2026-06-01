// src/features/review/content/scripts/build-zh-a1-seeds.ts
//
// Build-time runner for the vi→zh A1 GENERATION seed (DCzh-A1). OFFLINE: reads
// the hand-authored vi⇄zh A1 batch (ingestion/chineseSeedA1.authored.ts), builds
// a staticTranslator from its two maps, generates candidates (front=vi via
// toVietnamese, pinyin reading carried from the source), then runs them through
// the gate WITH the back-translation round-trip checker before seeding.
//
// NO runtime model calls, NO Supabase: the "Translator" is the authored static
// map. Output is "for-review" — building this seed does NOT wire vi-zh A1 live
// (vi-zh stays live at B2 only).
//
//   npx tsx src/features/review/content/scripts/build-zh-a1-seeds.ts

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  RAW_ITEMS,
  toVi,
  fromVi,
} from "../ingestion/chineseSeedA1.authored";
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

  // Generate: front (vi) ← toVietnamese(back); pinyin reading carried from source.
  const candidates = await generateCandidates(RAW_ITEMS, { translator });

  // Certify through the gate WITH the injected round-trip (generated cards must
  // round-trip back to their authored hanzi ≥ threshold to be seeded).
  const { seed, quarantine } = await buildSeed(candidates, {
    flow: "vi-zh",
    level: "A1",
    limit: 20,
    roundTrip: makeRoundTripChecker(translator),
    roundTripThreshold: 0.6,
  });

  // OVERWRITE the empty A1 seed; write a DISTINCT A1 quarantine file so the
  // existing vi-zh.quarantine.json (the B2 adaptation pass) is NOT clobbered.
  writeJson("vi-zh.A1.seed.json", seed);
  writeJson("vi-zh.A1.quarantine.json", quarantine);

  // eslint-disable-next-line no-console
  console.log(
    `[build-zh-a1-seeds] vi-zh A1: rawItems=${RAW_ITEMS.length} ` +
      `generated=${candidates.length} certified=${seed.certifiedTotal} ` +
      `A1=${seed.certifiedAtLevel} seeded=${seed.cards.length} ` +
      `quarantined=${quarantine.total}`,
  );
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("[build-zh-a1-seeds] failed:", err);
  process.exitCode = 1;
});
