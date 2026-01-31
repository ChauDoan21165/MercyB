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
const TARGET_PREFIX = "audio";
const DRY_RUN = process.env.DRY_RUN === "1";

const missing = fs
  .readFileSync("missing-mp3.txt", "utf8")
  .split(/\r?\n/)
  .map((s) => s.trim())
  .filter(Boolean);

function walkAllFiles(dir) {
  const out = [];
  const stack = [dir];
  while (stack.length) {
    const d = stack.pop();
    const items = fs.readdirSync(d, { withFileTypes: true });
    for (const it of items) {
      const full = path.join(d, it.name);
      if (it.isDirectory()) {
        if (it.name === "node_modules" || it.name === ".git") continue;
        stack.push(full);
      } else if (it.isFile()) {
        out.push(full);
      }
    }
  }
  return out;
}

async function existsInTarget(filename) {
  const { data, error } = await supabase.storage.from(BUCKET).list(TARGET_PREFIX, {
    limit: 1000,
    search: filename,
  });
  if (error) throw error;
  return (data || []).some((x) => x.name === filename);
}

async function uploadOne(localPath, filename) {
  const storagePath = `${TARGET_PREFIX}/${filename}`;
  const buf = fs.readFileSync(localPath);

  if (DRY_RUN) {
    console.log(`[dry] upload ${localPath} -> ${storagePath}`);
    return { ok: true };
  }

  const { error } = await supabase.storage.from(BUCKET).upload(storagePath, buf, {
    upsert: false, // SAFE
    contentType: "audio/mpeg",
    cacheControl: "3600",
  });

  if (error) return { ok: false, error };
  return { ok: true };
}

async function main() {
  console.log("Missing list:", missing.length);
  console.log("DRY_RUN:", DRY_RUN ? "YES" : "NO");

  console.log("🧭 Scanning local repo for matches…");
  const all = walkAllFiles(process.cwd());

  // Build map: lower(basename) -> [fullpaths]
  const byBaseLower = new Map();
  for (const p of all) {
    const b = path.basename(p).toLowerCase();
    const arr = byBaseLower.get(b) || [];
    arr.push(p);
    byBaseLower.set(b, arr);
  }

  const notFoundLocal = [];
  const multiLocal = [];
  let uploaded = 0;
  let skippedExists = 0;
  let failed = 0;

  for (const fn of missing) {
    // If already exists in storage, skip
    if (await existsInTarget(fn)) {
      skippedExists++;
      continue;
    }

    const matches = byBaseLower.get(fn.toLowerCase()) || [];
    if (matches.length === 0) {
      notFoundLocal.push(fn);
      continue;
    }
    if (matches.length > 1) {
      multiLocal.push({ fn, matches });
    }

    // Choose best match: prefer path NOT under dist/music
    const best =
      matches.find((p) => !p.includes(`${path.sep}dist${path.sep}music${path.sep}`)) ||
      matches[0];

    const res = await uploadOne(best, fn);
    if (res.ok) {
      uploaded++;
      console.log(`✅ uploaded ${fn}  (from ${best})`);
    } else {
      failed++;
      console.log(`❌ failed ${fn}:`, res.error?.message || res.error);
    }
  }

  console.log("\n===== SUMMARY =====");
  console.log("Uploaded:", uploaded);
  console.log("Skipped (already existed):", skippedExists);
  console.log("Failed:", failed);
  console.log("Not found locally:", notFoundLocal.length);

  if (notFoundLocal.length) {
    console.log("\n--- Not found locally ---");
    console.log(notFoundLocal.join("\n"));
  }

  if (multiLocal.length) {
    console.log("\n--- Multiple local matches (FYI; uploaded best guess) ---");
    for (const m of multiLocal) {
      console.log("\n" + m.fn);
      for (const p of m.matches) console.log("  -", p);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

