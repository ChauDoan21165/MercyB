/* MB-BLUE-PERF-1 — Performance budgets (LOCKED-ish)
   Fails build if any dist asset exceeds budget.
*/
const fs = require("fs");
const path = require("path");

const DIST_ASSETS = path.join(process.cwd(), "dist", "assets");

// ---- budgets (bytes, gzip not used here; simple + stable) ----
// If you want gzip-based budgets later, we can add gzip-size (extra dep).
const MAX_SINGLE_JS = 450_000; // ~450 kB raw is reasonable for your current output
const MAX_TOTAL_JS = 1_500_000; // total raw JS budget

function isJsFile(f) {
  return f.endsWith(".js") && !f.endsWith(".js.map");
}

function main() {
  if (!fs.existsSync(DIST_ASSETS)) {
    console.error("❌ dist/assets not found. Run `npm run build` first.");
    process.exit(1);
  }

  const files = fs.readdirSync(DIST_ASSETS).filter(isJsFile);
  let total = 0;
  let worst = { file: "", size: 0 };

  for (const f of files) {
    const p = path.join(DIST_ASSETS, f);
    const st = fs.statSync(p);
    total += st.size;
    if (st.size > worst.size) worst = { file: f, size: st.size };
  }

  const tooBig = files
    .map((f) => {
      const p = path.join(DIST_ASSETS, f);
      const size = fs.statSync(p).size;
      return { f, size };
    })
    .filter((x) => x.size > MAX_SINGLE_JS)
    .sort((a, b) => b.size - a.size);

  console.log("📦 JS budget report");
  console.log(`- total JS: ${total.toLocaleString()} bytes`);
  console.log(`- largest:  ${worst.size.toLocaleString()} bytes  (${worst.file})`);

  if (total > MAX_TOTAL_JS) {
    console.error(`❌ TOTAL_JS budget exceeded: ${total} > ${MAX_TOTAL_JS}`);
    process.exit(1);
  }

  if (tooBig.length) {
    console.error(`❌ SINGLE_JS budget exceeded (>${MAX_SINGLE_JS}):`);
    for (const x of tooBig) console.error(`- ${x.f}: ${x.size.toLocaleString()} bytes`);
    process.exit(1);
  }

  console.log("✅ Budgets OK");
}

main();
