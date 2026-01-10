cat > scripts/migrate-leaf0-to-entries.mjs <<'EOF'
#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";

const INPUT = process.argv[2];
if (!INPUT) {
  console.error("Usage: node scripts/migrate-leaf0-to-entries.mjs <path-to-room.json>");
  process.exit(1);
}

function asArray(x) { return Array.isArray(x) ? x : []; }

function slugify(s) {
  return String(s || "")
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s\-_]/gu, "")
    .replace(/[\s\-_]+/g, "_")
    .replace(/^_+|_+$/g, "") || "entry";
}

function titleCase(s) {
  const t = String(s || "").trim();
  if (!t) return "";
  return t
    .split(/\s+/g)
    .map(w => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

function ensureRoomId(obj, fallbackId) {
  if (obj?.id) return obj.id;
  obj.id = fallbackId;
  return obj.id;
}

function ensureTier(obj) {
  if (obj?.tier) return obj.tier;
  if (obj?.meta?.tier) { obj.tier = obj.meta.tier; return obj.tier; }
  obj.tier = "free";
  return obj.tier;
}

function readKeywords(room) {
  const en = asArray(room?.keywords_en).length ? room.keywords_en
    : asArray(room?.keywords?.en).length ? room.keywords.en
    : asArray(room?.meta?.keywords_en).length ? room.meta.keywords_en
    : [];
  const vi = asArray(room?.keywords_vi).length ? room.keywords_vi
    : asArray(room?.keywords?.vi).length ? room.keywords.vi
    : asArray(room?.meta?.keywords_vi).length ? room.meta.keywords_vi
    : [];
  return { en: asArray(en).map(String), vi: asArray(vi).map(String) };
}

function hasEntries(room) {
  return Array.isArray(room?.entries) && room.entries.length > 0;
}

function makeEntriesFromKeywords({ en, vi }) {
  const n = Math.max(en.length, vi.length);
  const out = [];
  for (let i = 0; i < n; i++) {
    const kwEn = String(en[i] ?? "").trim();
    const kwVi = String(vi[i] ?? "").trim();
    if (!kwEn && !kwVi) continue;

    const id = slugify(kwEn || kwVi);
    out.push({
      id,
      title: { en: titleCase(kwEn || kwVi), vi: kwVi || "" },
      text: { en: "", vi: "" },
      audio: ""
    });
  }
  return out;
}

async function main() {
  const abs = path.resolve(process.cwd(), INPUT);
  const raw = await fs.readFile(abs, "utf8");
  const room = JSON.parse(raw);

  // do not clobber existing entries
  if (hasEntries(room)) {
    console.log("SKIP: already has entries[]:", abs);
    return;
  }

  const { en, vi } = readKeywords(room);
  if (en.length === 0 && vi.length === 0) {
    console.log("SKIP: no keywords found:", abs);
    return;
  }

  const fallbackId = path.basename(abs).replace(/\.json$/i, "");
  ensureRoomId(room, fallbackId);
  ensureTier(room);

  room.entries = makeEntriesFromKeywords({ en, vi });

  // OPTIONAL: if you have big essay blocks, keep them for now:
  // room.essay stays untouched.

  await fs.writeFile(abs, JSON.stringify(room, null, 2) + "\n", "utf8");
  console.log("OK: wrote entries[] skeleton:", abs, "entries=", room.entries.length);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
EOF
chmod +x scripts/migrate-leaf0-to-entries.mjs
