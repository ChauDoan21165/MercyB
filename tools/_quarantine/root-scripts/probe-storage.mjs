import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

const { data: buckets, error: bErr } = await supabase.storage.listBuckets();
if (bErr) throw bErr;

console.log("Buckets:");
for (const b of buckets || []) {
  console.log(" -", b.name, `(public=${b.public})`);
}

console.log("\nRoot listing per bucket:");
for (const b of buckets || []) {
  const { data, error } = await supabase.storage.from(b.name).list("", { limit: 50 });
  console.log("\n==", b.name, "==");
  if (error) {
    console.log("  list error:", error.message);
    continue;
  }
  if (!data?.length) {
    console.log("  (empty root)");
    continue;
  }
  for (const it of data) {
    console.log("  -", it.name, it.metadata ? "(file)" : "(folder?)");
  }
}

import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

const { data: buckets, error: bErr } = await supabase.storage.listBuckets();
if (bErr) throw bErr;

console.log("Buckets:");
for (const b of buckets || []) {
  console.log(" -", b.name, `(public=${b.public})`);
}

console.log("\nRoot listing per bucket:");
for (const b of buckets || []) {
  const { data, error } = await supabase.storage.from(b.name).list("", { limit: 50 });
  console.log("\n==", b.name, "==");
  if (error) {
    console.log("  list error:", error.message);
    continue;
  }
  if (!data?.length) {
    console.log("  (empty root)");
    continue;
  }
  for (const it of data) {
    console.log("  -", it.name, it.metadata ? "(file)" : "(folder?)");
  }
}









