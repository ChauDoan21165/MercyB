import fs from "fs";
import path from "path";
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

const BUCKET = "audio";
const TARGET_PREFIX = "audio"; // store as audio/<filename>
const DRY_RUN = process.env.DRY_RUN === "1";
const LIMIT = Number(process.env.LIMIT || "0"); // 0 = no limit
const ROOT = process.cwd();

// Only upload mp3 that DB references? (faster/safer). Default YES.
const ONLY_DB_REFERENCED = process.env.ONLY_DB_REFERENCED !== "0";

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
        if (typeof v === "string" && v.toLowerCase().endsWith(".mp3")) out.push(v);
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

async function loadDbBasenames() {
  const { data, error } = await supabase
    .from("room_entries")
    .select("audio")
    .not("audio", "is", null);

  if (error) throw error;

  const want = new Set();
  for (const r of data || []) {
    for (const f of extractFilenames(r.audio)) want.add(basename(f));
  }
  return want;
}

function walkMp3Files(dir) {
  const out = [];
  const stack = [dir];
  while (stack.length) {
    const d = stack.pop();
    const items = fs.readdirSync(d, { withFileTypes: true });
    for (const it of items) {
      const full = path.join(d, it.name);
      if (it.isDirectory()) {
        // skip node_modules to avoid huge crawl
        if (it.name === "node_modules" || it.name === ".git") continue;
        stack.push(full);
      } else if (it.isFile() && it.name.toLowerCase().endsWith(".mp3")) {
        out.push(full);
      }
    }
  }
  return out;
}

async function listExistingTargetNames() {
  // list TARGET_PREFIX/ (first 1000). If you have >1000 existing, we can paginate.
  const { data, error } = await supabase.storage.from(BUCKET).list(TARGET_PREFIX, {
    limit: 1000,
  });
  if (error) throw error;
  return new Set((data || []).map((x) => x.name));
}

async function uploadOne(localPath, filename) {
  const storagePath = `${TARGET_PREFIX}/${filename}`;

  const buf = fs.readFileSync(localPath);

  if (DRY_RUN) {
    console.log(`[dry] upload ${localPath} -> ${storagePath}`);
    return { ok: true, storagePath };
  }

  const { error } = await supabase.storage.from(BUCKET).upload(storagePath, buf, {
    upsert: false, // SAFE: never overwrite
    contentType: "audio/mpeg",
    cacheControl: "3600",
  });

  if (error) return { ok: false, storagePath, error };
  return { ok: true, storagePath };
}

async function main() {
  console.log("📦 Upload local mp3 -> Supabase Storage");
  console.log("Bucket:", BUCKET, "Target:", `${TARGET_PREFIX}/`);
  console.log("DRY_RUN:", DRY_RUN ? "YES" : "NO");
  console.log("ONLY_DB_REFERENCED:", ONLY_DB_REFERENCED ? "YES" : "NO");
  if (LIMIT) console.log("LIMIT:", LIMIT);

  let want = null;
  if (ONLY_DB_REFERENCED) {
    console.log("🔍 Loading DB referenced basenames…");
    want = await loadDbBasenames();
    console.log(`🎧 DB references ${want.size} unique mp3 basenames`);
  }

  console.log("🧭 Scanning local mp3 files (this may take a bit)…");
  const allLocal = walkMp3Files(ROOT);
  console.log(`✅ Found ${allLocal.length} local mp3 files`);

  // map basename -> first path (if duplicates, we keep first and report)
  const seen = new Map();
  const dup = new Map();

  for (const p of allLocal) {
    const fn = path.basename(p);
    if (!seen.has(fn)) seen.set(fn, p);
    else {
      const arr = dup.get(fn) || [seen.get(fn)];
      arr.push(p);
      dup.set(fn, arr);
    }
  }

  if (dup.size) {
    console.log(
      `⚠️ Local duplicate basenames: ${dup.size} (we will upload only the first occurrence)`
    );
  }

  console.log("📚 Listing existing objects in target folder…");
  const existing = await listExistingTargetNames();
  console.log(`✅ Existing in ${TARGET_PREFIX}/: ${existing.size}`);

  const plan = [];
  for (const [fn, p] of seen.entries()) {
    if (ONLY_DB_REFERENCED && want && !want.has(fn)) continue;
    if (existing.has(fn)) continue;
    plan.push({ fn, p });
  }

  console.log(`📝 Upload plan: ${plan.length} files to upload`);

  let uploaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const item of plan) {
    if (LIMIT && uploaded >= LIMIT) break;

    const res = await uploadOne(item.p, item.fn);
    if (res.ok) {
      uploaded++;
      if (uploaded % 50 === 0) console.log(`…uploaded ${uploaded}`);
    } else {
      failed++;
      console.log("❌ upload failed:", item.fn, res.error?.message || res.error);
    }
  }

  skipped = (ONLY_DB_REFERENCED && want)
    ? (want.size - (plan.length + existing.size))
    : 0;

  console.log("\n===== SUMMARY =====");
  console.log("Uploaded:", uploaded);
  console.log("Failed:", failed);
  console.log("Already existed:", existing.size);
  console.log("Local duplicate basenames:", dup.size);
  if (ONLY_DB_REFERENCED) console.log("DB referenced:", want.size);
  if (LIMIT) console.log("LIMIT used:", LIMIT);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
