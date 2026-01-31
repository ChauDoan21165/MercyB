import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

const BUCKET = "public";
const TARGET_DIR = "audio";

function isJsonish(s) {
  return typeof s === "string" && /^\s*\{/.test(s);
}

function extractFilenames(audioVal) {
  const out = [];
  if (!audioVal || typeof audioVal !== "string") return out;

  // JSON string like {"en":"file.mp3"} or {"en":"...","vi":"..."}
  if (isJsonish(audioVal)) {
    try {
      const obj = JSON.parse(audioVal);
      for (const v of Object.values(obj || {})) {
        if (typeof v === "string" && v.toLowerCase().endsWith(".mp3")) out.push(v);
      }
    } catch {
      // ignore malformed JSON strings
    }
    return out;
  }

  // plain "file.mp3" (already exploded earlier)
  const s = audioVal.trim();
  if (s.toLowerCase().endsWith(".mp3")) out.push(s);
  return out;
}

function basename(p) {
  const s = String(p).replace(/\\/g, "/");
  const i = s.lastIndexOf("/");
  return i >= 0 ? s.slice(i + 1) : s;
}

async function listFolder(prefix) {
  const { data, error } = await supabase.storage.from(BUCKET).list(prefix, {
    limit: 1000,
    offset: 0,
    sortBy: { column: "name", order: "asc" },
  });
  if (error) throw error;
  return data || [];
}

// Supabase list() returns "folders" as entries with null metadata/id in many setups.
// We treat "has no metadata" as folder-ish.
function isFolderEntry(e) {
  return !e?.metadata && !e?.id;
}

async function crawlAllObjects() {
  console.log("🧭 Crawling storage bucket to discover actual mp3 paths…");

  const queue = [""]; // "" = root
  const seen = new Set();
  const fileMap = new Map(); // basename -> [fullPaths]

  while (queue.length) {
    const prefix = queue.shift();
    if (seen.has(prefix)) continue;
    seen.add(prefix);

    const items = await listFolder(prefix);

    for (const it of items) {
      const name = it.name;
      if (!name) continue;

      const fullPath = prefix ? `${prefix}/${name}` : name;

      if (isFolderEntry(it)) {
        queue.push(fullPath);
        continue;
      }

      if (name.toLowerCase().endsWith(".mp3")) {
        const b = basename(fullPath);
        const arr = fileMap.get(b) || [];
        arr.push(fullPath);
        fileMap.set(b, arr);
      }
    }
  }

  console.log(`✅ Discovered ${fileMap.size} unique mp3 basenames in storage.`);
  return fileMap;
}

async function loadDbAudioBasenames() {
  console.log("🔍 Loading room audio references from DB…");

  // If room_entries is huge, we can paginate later. Start simple.
  const { data, error } = await supabase
    .from("room_entries")
    .select("id,audio")
    .not("audio", "is", null);

  if (error) throw error;

  const want = new Set();
  for (const r of data || []) {
    for (const fn of extractFilenames(r.audio)) {
      want.add(basename(fn));
    }
  }

  console.log(`🎧 DB references ${want.size} unique mp3 basenames.`);
  return want;
}

async function existsInTarget(filename) {
  const items = await listFolder(TARGET_DIR);
  return items.some((x) => x?.name === filename);
}

async function main() {
  const want = await loadDbAudioBasenames();
  const storageMap = await crawlAllObjects();

  const missing = [];
  const ambiguous = [];
  const moved = [];

  for (const fn of want) {
    const dest = `${TARGET_DIR}/${fn}`;

    // Already in target?
    if (storageMap.get(fn)?.includes(dest) || (await existsInTarget(fn))) {
      continue;
    }

    const sources = storageMap.get(fn) || [];
    if (sources.length === 0) {
      missing.push(fn);
      continue;
    }
    if (sources.length > 1) {
      ambiguous.push({ fn, sources });
      continue; // safe: do NOT guess
    }

    const src = sources[0];
    console.log(`➡️  ${src} → ${dest}`);

    // copy
    const { error: copyErr } = await supabase.storage.from(BUCKET).copy(src, dest);
    if (copyErr && !String(copyErr.message || "").toLowerCase().includes("already exists")) {
      console.error(`❌ copy failed: ${src}`, copyErr.message || copyErr);
      continue;
    }

    // verify destination now exists
    if (!(await existsInTarget(fn))) {
      console.error(`❌ verify failed: ${dest}`);
      continue;
    }

    // delete original (only if different from dest)
    if (src !== dest) {
      const { error: delErr } = await supabase.storage.from(BUCKET).remove([src]);
      if (delErr) {
        console.error(`⚠️  delete failed: ${src}`, delErr.message || delErr);
        continue;
      }
    }

    moved.push({ fn, from: src, to: dest });
    console.log("✅ moved");
  }

  console.log("\n===== SUMMARY =====");
  console.log(`Moved: ${moved.length}`);
  console.log(`Missing: ${missing.length}`);
  console.log(`Ambiguous (same filename multiple places): ${ambiguous.length}`);

  if (missing.length) {
    console.log("\n--- Missing basenames (DB references but not found in storage) ---");
    console.log(missing.slice(0, 200).join("\n"));
    if (missing.length > 200) console.log(`... plus ${missing.length - 200} more`);
  }

  if (ambiguous.length) {
    console.log("\n--- Ambiguous basenames (won't move; needs human decision) ---");
    for (const a of ambiguous.slice(0, 50)) {
      console.log(`\n${a.fn}\n  - ${a.sources.join("\n  - ")}`);
    }
    if (ambiguous.length > 50) console.log(`\n... plus ${ambiguous.length - 50} more`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
import { createClient } from "@supabase/supabase-js";
import path from "path";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

const BUCKET = "public";
const TARGET_DIR = "audio";

function normalize(p) {
  return p.replace(/^\/+/, "");
}

function targetPath(original) {
  const filename = path.basename(original);
  return `${TARGET_DIR}/${filename}`;
}

async function main() {
  console.log("🔍 Loading room audio references…");

  const { data: rows, error } = await supabase
    .from("room_entries")
    .select("id, audio")
    .not("audio", "is", null);

  if (error) throw error;

  const files = [
    ...new Set(
      rows
        .map(r => r.audio)
        .filter(a => typeof a === "string" && a.toLowerCase().endsWith(".mp3"))
        .map(normalize)
    ),
  ];

  console.log(`🎧 Found ${files.length} audio files`);

  for (const src of files) {
    if (src.startsWith(`${TARGET_DIR}/`)) {
      continue; // already moved
    }

    const dest = targetPath(src);

    console.log(`➡️  ${src} → ${dest}`);

    // 1) copy
    const { error: copyErr } = await supabase
      .storage
      .from(BUCKET)
      .copy(src, dest);

    if (copyErr && !copyErr.message.includes("already exists")) {
      console.error("❌ copy failed:", src, copyErr.message);
      continue;
    }

    // 2) verify
    const { data: stat, error: statErr } = await supabase
      .storage
      .from(BUCKET)
      .list(TARGET_DIR, {
        search: path.basename(dest),
      });

    if (statErr || !stat?.length) {
      console.error("❌ verification failed:", dest);
      continue;
    }

    // 3) delete original
    const { error: delErr } = await supabase
      .storage
      .from(BUCKET)
      .remove([src]);

    if (delErr) {
      console.error("⚠️  delete failed:", src, delErr.message);
      continue;
    }

    console.log("✅ moved");
  }

  console.log("🎉 Done");
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});

