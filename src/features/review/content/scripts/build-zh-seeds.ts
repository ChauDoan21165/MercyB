// src/features/review/content/scripts/build-zh-seeds.ts
//
// Build-time seed generator for vi→zh (DC3-zh runner). OFFLINE: reads the
// existing Chinese lesson content (read-only module imports), runs ingestion →
// validation gate → writes the certified seed + quarantine report as static
// JSON under ../seeds/out/.
//
// ADAPTATION ONLY: the adapter maps just the rows that already carry a
// Vietnamese gloss. NO runtime model calls and NO Supabase: runs only when a
// human invokes it (`npx tsx src/features/review/content/scripts/build-zh-seeds.ts`),
// never in the app bundle. The vi-zh adaptation slice needs no round-trip
// checker (every front + back is authored).
//
// Output is "for-review" — committing a seed does NOT wire vi-zh into the live
// ReviewApp. A flow flips on only after its seed passes review (separate step).

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Real Chinese lesson corpus (read-only).
import { lessons as zhA1 } from "@/languages/chinese/lessons-a1";
import { lessons as zhA2 } from "@/languages/chinese/lessons-a2";
import { lessons as zhB1 } from "@/languages/chinese/lessons-b1";
import { lessons as zhB2 } from "@/languages/chinese/lessons-b2";
import { lessons as zhC1 } from "@/languages/chinese/lessons-c1";
import { lessons as zhC2 } from "@/languages/chinese/lessons-c2";

import { buildChineseCandidates } from "../ingestion/chineseLessons";
import { buildSeed } from "../seeds/buildSeed";

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "seeds", "out");

function writeJson(name: string, data: unknown): void {
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(join(OUT_DIR, name), JSON.stringify(data, null, 2) + "\n", "utf8");
}

async function main(): Promise<void> {
  // ── vi→zh — pure adaptation, no generation, no round-trip checker ──────────
  // FINDING: Chinese A1/A2/B1 lessons carry ZERO Vietnamese glosses — all `vi`
  // coverage lives in B2/C1/C2. So the ADAPTATION seed is emitted at B2 (where
  // real authored vi exists); an A1 vi→zh seed requires GENERATION (the gap),
  // deferred to the generation pass. We still emit the A1 seed (empty) so the
  // gap is visible in the artifacts.
  const zhLessons = [...zhA1, ...zhA2, ...zhB1, ...zhB2, ...zhC1, ...zhC2];
  const zhCandidates = buildChineseCandidates(zhLessons);

  const a1 = await buildSeed(zhCandidates, { flow: "vi-zh", level: "A1", limit: 20 });
  const b2 = await buildSeed(zhCandidates, { flow: "vi-zh", level: "B2", limit: 20 });

  // B2 is the real reviewable adaptation seed; A1 documents the generation gap.
  writeJson("vi-zh.B2.seed.json", b2.seed);
  writeJson("vi-zh.A1.seed.json", a1.seed);
  writeJson("vi-zh.quarantine.json", b2.quarantine);

  // eslint-disable-next-line no-console
  console.log(
    `[build-zh-seeds] vi-zh: candidates=${zhCandidates.length} ` +
      `certified=${b2.seed.certifiedTotal} A1=${a1.seed.certifiedAtLevel} ` +
      `B2=${b2.seed.certifiedAtLevel} seededB2=${b2.seed.cards.length} ` +
      `quarantined=${b2.quarantine.total}`,
  );
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("[build-zh-seeds] failed:", err);
  process.exitCode = 1;
});
