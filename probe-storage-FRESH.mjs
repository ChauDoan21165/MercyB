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

const { data: buckets, error } = await supabase.storage.listBuckets();
if (error) {
  console.error("Bucket list error:", error.message);
  process.exit(1);
}

console.log("Buckets:");
for (const b of buckets || []) {
  console.log(" -", b.name, `(public=${b.public})`);
}

for (const b of buckets || []) {
  console.log(`\n== ${b.name} (root) ==`);
  const { data, error } = await supabase.storage.from(b.name).list("", { limit: 50 });
  if (error) {
    console.log("  list error:", error.message);
    continue;
  }
  if (!data?.length) {
    console.log("  (empty)");
    continue;
  }
  for (const it of data) {
    console.log("  -", it.name, it.metadata ? "(file)" : "(folder)");
  }
}

