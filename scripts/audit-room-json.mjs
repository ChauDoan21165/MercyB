import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dir = path.join(root, "public", "data");

function safeReadJSON(p) {
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch (e) {
    return { __error: String(e) };
  }
}

const files = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => path.join(dir, f));

const rows = [];

for (const file of files) {
  const j = safeReadJSON(file);
  if (j.__error) {
    rows.push({ file, id: "??", entries: -1, error: j.__error });
    continue;
  }
  const id = j.id || path.basename(file, ".json");
  const entries = Array.isArray(j.entries) ? j.entries.length : 0;

  // count missing copy.en/vi (common “cripple” symptom)
  let missingEn = 0;
  let missingVi = 0;
  for (const e of j.entries || []) {
    const en = e?.copy?.en;
    const vi = e?.copy?.vi;
    if (en == null || String(en).trim() === "") missingEn++;
    if (vi == null || String(vi).trim() === "") missingVi++;
  }

  rows.push({
    file: path.relative(root, file),
    id,
    entries,
    missingEn,
    missingVi,
  });
}

// sort: smallest entries first (find crippled)
rows.sort((a, b) => (a.entries ?? 0) - (b.entries ?? 0));

for (const r of rows) {
  if (r.entries <= 2 || r.missingEn || r.missingVi) {
    console.log(
      `${String(r.entries).padStart(3)}  ${r.id}  enMissing:${r.missingEn} viMissing:${r.missingVi}  ${r.file}`
    );
  }
}
