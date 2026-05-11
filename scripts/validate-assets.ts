// scripts/validate-assets.ts
//
// Catch broken static-asset paths in src/. The brief said "scan for
// /assets/" but the MercyBlade codebase doesn't use that prefix — its
// public/ tree has top-level folders like /hero/, /audio/, /images/,
// /brand/, /icons/, etc. Generalised to: any quoted absolute path
// whose file extension looks like a static asset.
//
// What this catches:
//   - Typoed paths after a rename (most common regression)
//   - References to images deleted in a parallel branch
//   - Audio that was supposed to be uploaded but isn't bundled
//
// What this skips (intentional):
//   - Template-literal paths: `${base}/${id}.png` — the value isn't
//     known statically, can't be verified offline.
//   - Supabase Storage URLs (https://*.supabase.co/storage/...) and
//     other absolute http(s) URLs — out of scope for an on-disk check.
//   - dist/ and node_modules/ — build artifacts, not source.
//
// Run:
//   npx tsx scripts/validate-assets.ts
//
// Exits 1 if any referenced asset is missing from public/; 0 when clean.

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const SRC_DIR = resolve("src");
const PUBLIC_DIR = resolve("public");

// File extensions we treat as static assets that public/ must own.
const ASSET_EXT_RE = /\.(png|jpg|jpeg|svg|webp|ico|gif|avif|mp3|mp4|wav|ogg|webm|woff|woff2|ttf|otf|json|txt|xml|pdf|csv)$/i;

// Quoted ABSOLUTE path (leading "/") into a known public/ subfolder,
// ending in a static-asset extension. Restricting to known folders
// rules out the avalanche of false positives that come from bare
// filenames used as Supabase Storage keys, data identifiers, or
// runtime-composed paths (e.g. "alexander_v1_2_en.mp3" is a storage
// key, not a public/ file).
//
// Folder list comes from `ls public/` minus files. If a new top-level
// folder is added to public/, append it here.
const PUBLIC_TOP_FOLDERS = [
  "audio",
  "brand",
  "data",
  "docs",
  "hero",
  "icons",
  "images",
  "internal",
] as const;

const FOLDER_ALTERNATION = PUBLIC_TOP_FOLDERS.join("|");
const ASSET_REF_RE = new RegExp(
  `["'\`](/(?:${FOLDER_ALTERNATION})/[a-zA-Z0-9_./-]+\\.(?:png|jpg|jpeg|svg|webp|ico|gif|avif|mp3|mp4|wav|ogg|webm|woff|woff2|ttf|otf|json|txt|xml|pdf|csv))["'\`]`,
  "gi",
);

function walkSrc(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith(".")) continue;
    const full = join(dir, entry);
    let st;
    try {
      st = statSync(full);
    } catch {
      continue;
    }
    if (st.isDirectory()) {
      if (
        entry === "node_modules" ||
        entry === "__tests__" ||
        entry === "dist" ||
        entry === ".vite"
      ) {
        continue;
      }
      walkSrc(full, out);
    } else if (
      entry.endsWith(".ts") ||
      entry.endsWith(".tsx") ||
      entry.endsWith(".css")
    ) {
      out.push(full);
    }
  }
  return out;
}

type Reference = {
  rawPath: string;
  file: string;
  line: number;
};

function extractReferences(files: string[]): Reference[] {
  const refs: Reference[] = [];
  for (const file of files) {
    let body: string;
    try {
      body = readFileSync(file, "utf8");
    } catch {
      continue;
    }
    const lines = body.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Skip lines that interpolate values — we can't verify those statically.
      if (line.includes("${")) continue;
      // Skip single-line `//` comments. Block-comment lines that start
      // with `*` are also typically documentation — skip those too.
      // Catches examples like `// "/audio/foo.mp3"` in CornerTalker.tsx
      // and the JSDoc-style API examples in roomAudioResolver.ts.
      const trimmed = line.trim();
      if (trimmed.startsWith("//") || trimmed.startsWith("*")) continue;
      const matches = [...line.matchAll(ASSET_REF_RE)];
      for (const m of matches) {
        const raw = m[1];
        // Drop external URLs (http/https) and data URIs entirely.
        if (raw.startsWith("http") || raw.startsWith("data:")) continue;
        // Drop relative imports like "./foo.json" that resolve via the
        // module graph, not public/. They'd appear without a leading
        // slash AND with a "." prefix — but our regex already excludes
        // values starting with "." via the [a-zA-Z0-9_] anchor.
        refs.push({ rawPath: raw, file, line: i + 1 });
      }
    }
  }
  return refs;
}

function resolveOnDisk(rawPath: string): string {
  // Strip the leading "/" so we resolve under public/ either way.
  const trimmed = rawPath.replace(/^\/+/, "");
  return resolve(PUBLIC_DIR, trimmed);
}

function main(): void {
  if (!existsSync(SRC_DIR)) {
    console.error(`[validate-assets] ${SRC_DIR} not found`);
    process.exit(2);
  }
  if (!existsSync(PUBLIC_DIR)) {
    console.error(`[validate-assets] ${PUBLIC_DIR} not found`);
    process.exit(2);
  }

  const files = walkSrc(SRC_DIR);
  const refs = extractReferences(files);

  // De-duplicate by (rawPath) so the report is readable. Keep the
  // first occurrence's location for context.
  const unique = new Map<string, Reference>();
  for (const r of refs) {
    if (!unique.has(r.rawPath)) unique.set(r.rawPath, r);
  }

  console.log(
    `[validate-assets] scanned ${files.length} src files, found ${unique.size} unique asset references`,
  );

  const missing: Reference[] = [];
  for (const r of unique.values()) {
    if (!existsSync(resolveOnDisk(r.rawPath))) {
      missing.push(r);
    }
  }

  if (missing.length === 0) {
    console.log("✅ All referenced assets exist on disk.");
    return;
  }

  console.log(`\n❌ ${missing.length} asset(s) missing from public/:\n`);
  for (const r of missing) {
    const rel = r.file.replace(resolve(".") + "/", "");
    console.log(`  ${r.rawPath}`);
    console.log(`     referenced at ${rel}:${r.line}`);
  }
  process.exit(1);
}

main();
