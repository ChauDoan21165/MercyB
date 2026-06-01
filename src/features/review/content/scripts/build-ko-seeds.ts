// src/features/review/content/scripts/build-ko-seeds.ts
//
// Build-time seed generator for vi→ko (DC3-ko runner). OFFLINE: reads the
// existing Korean lesson content (read-only module imports), runs ingestion →
// validation gate → writes the certified seed + quarantine report as static
// JSON under ../seeds/out/.
//
// PURE ADAPTATION, no generation: every front (VI) + back (hangul) + reading
// (romaja) is authored, so no round-trip checker is plugged in here.
//
// NO runtime model calls and NO Supabase: this script runs only when a human
// invokes it (`npx tsx src/features/review/content/scripts/build-ko-seeds.ts`),
// never in the app bundle.
//
// Output is "for-review" — committing a seed does NOT wire vi-ko into the live
// ReviewApp. The flow flips on only after its seed passes review (separate step).

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Real Korean lesson corpus (read-only).
import { lessons as koA1 } from "@/languages/korean/lessons-a1";
import { lessons as koA2 } from "@/languages/korean/lessons-a2";
import { lessons as koB1 } from "@/languages/korean/lessons-b1";
import { lessons as koB2 } from "@/languages/korean/lessons-b2";
import { lessons as koC1 } from "@/languages/korean/lessons-c1";
import { lessons as koC2 } from "@/languages/korean/lessons-c2";

import { buildKoreanCandidates } from "../ingestion/koreanLessons";
import { buildSeed } from "../seeds/buildSeed";

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "seeds", "out");

function writeJson(name: string, data: unknown): void {
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(join(OUT_DIR, name), JSON.stringify(data, null, 2) + "\n", "utf8");
}

async function main(): Promise<void> {
  // ── vi→ko — pure adaptation (sentences only), no generation ────────────────
  const koLessons = [...koA1, ...koA2, ...koB1, ...koB2, ...koC1, ...koC2];
  const koCandidates = buildKoreanCandidates(koLessons);
  const { seed, quarantine } = await buildSeed(koCandidates, {
    flow: "vi-ko",
    level: "A1",
    limit: 20,
  });

  writeJson("vi-ko.A1.seed.json", seed);
  writeJson("vi-ko.quarantine.json", quarantine);

  // eslint-disable-next-line no-console
  console.log(
    `[build-ko-seeds] vi-ko: candidates=${koCandidates.length} ` +
      `certified=${seed.certifiedTotal} A1=${seed.certifiedAtLevel} ` +
      `seeded=${seed.cards.length} quarantined=${quarantine.total}`,
  );
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("[build-ko-seeds] failed:", err);
  process.exitCode = 1;
});
