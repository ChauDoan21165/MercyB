import { createClient } from "@supabase/supabase-js";

/**
 * Move all room audio files referenced in DB into audio/audio/
 * SAFE: crawl storage → map → copy → verify → delete
 */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

// ✅ CORRECT BUCKET
const BUCKET = "audio";

// Target folder INSIDE the bucket
const TARGET_DIR = "audio";

/* ---------- helpers ---------- */

function isJsonish(s) {
  return typeof s === "string" && /^\s*\{/.test(s);
}

function basename(p) {
  const s = String(p).replace(/\\/g, "/");
  const i = s.lastIndexOf("/");
  return i >= 0 ? s.slice(i + 1) : s;
}

function extractFilenames(audioVal) {
  const out = [];
  if (!audioVal || typeof audioVal !== "string") return out;

  if (isJsonish(audioVal)) {
    try {
      const obj = JSON.parse(audioVal);
      for (const v of Object.values(obj || {})) {
        if (typeof v === "string" && v.toLowerCase().endsWith(".mp3")) {
          out.push(v);
        }
      }
    } catch (e) {
      /* ignore invalid JSON payloads */
    }
    return out;
  }

  const s = audioVal.trim();
  if (s.toLowerCase().endsWith(".mp3")) out.push(s);
  return out;
}

async function listFolder(prefix) {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list(prefix, { limit: 1000 });

  if (error) throw error;
  return data || [];
}

function isFolderEntry(e) {
  return !e?.metadata && !e?.id;
}

/* ---------- crawl storage ---------- */

async function crawlAllMp3s() {
  console.log("🧭 Crawling storage…");

  const queue = [""];
  const seen = new Set();
  const map = new Map(); // basename -> [full paths]

  while (queue.length) {
    const prefix = queue.shift();
    if (seen.has(prefix)) continue;
    seen.add(prefix);

    const items = await listFolder(prefix);

    for (const it of items) {
      if (!it.name) continue;
      const full = prefix ? `${prefix}/${it.name}` : it.name;

      if (isFolderEntry(it)) {
        queue.push(full);
        continue;
      }

      if (it.name.toLowerCase().endsWith(".mp3")) {
        const b = basename(full);
        const arr = map.get(b) || [];
        arr.push(full);
        map.set(b, arr);
      }
    }
  }

  console.log(`✅ Found ${map.size} unique mp3 files`);
  return map;
}

/* ---------- DB ---------- */

async function loadDbBasenames() {
  console.log("🔍 Loading audio references from DB…");

  const { data, error } = await supabase
    .from("room_entries")
    .select("audio")
    .not("audio", "is", null);

  if (error) throw error;

  const want = new Set();
  for (const r of data || []) {
    for (const f of extractFilenames(r.audio)) {
      want.add(basename(f));
    }
  }

  console.log(`🎧 DB references ${want.size} unique mp3 files`);
  return want;
}

async function existsInTarget(filename) {
  const items = await listFolder(TARGET_DIR);
  return items.some(x => x?.name === filename);
}

/* ---------- main ---------- */

async function main() {
  const want = await loadDbBasenames();
  const storageMap = await crawlAllMp3s();

  const missing = [];
  const ambiguous = [];
  let moved = 0;

  for (const fn of want) {
    const dest = `${TARGET_DIR}/${fn}`;

    if (storageMap.get(fn)?.includes(dest) || await existsInTarget(fn)) {
      continue;
    }

    const sources = storageMap.get(fn) || [];
    if (sources.length === 0) {
      missing.push(fn);
      continue;
    }
    if (sources.length > 1) {
      ambiguous.push({ fn, sources });
      continue;
    }

    const src = sources[0];
    console.log(`➡️  ${src} → ${dest}`);

    const { error: copyErr } = await supabase.storage
      .from(BUCKET)
      .copy(src, dest);

    if (copyErr && !String(copyErr.message).includes("already exists")) {
      console.error("❌ copy failed:", copyErr.message);
      continue;
    }

    if (!(await existsInTarget(fn))) {
      console.error("❌ verify failed:", dest);
      continue;
    }

    if (src !== dest) {
      const { error: delErr } = await supabase.storage
        .from(BUCKET)
        .remove([src]);

      if (delErr) {
        console.error("⚠️ delete failed:", delErr.message);
        continue;
      }
    }

    moved++;
    console.log("✅ moved");
  }

  console.log("\n===== SUMMARY =====");
  console.log("Moved:", moved);
  console.log("Missing:", missing.length);
  console.log("Ambiguous:", ambiguous.length);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
