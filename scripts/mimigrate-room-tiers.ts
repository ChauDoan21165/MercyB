#!/usr/bin/env ts-node

/**
 * Migration: normalize rooms.tier labels (incl. VIP3 II)
 * - Detect TierId from id/tier text
 * - Rewrite tier to canonical label, e.g.:
 *   vip3  → "VIP3 / VIP3"
 *   vip3ii → "VIP3 II / VIP3 II"
 *
 * RUN:
 * SUPABASE_SERVICE_ROLE_KEY=xxx ts-node scripts/migrate-room-tiers.ts
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

type TierId =
  | "free"
  | "vip1"
  | "vip2"
  | "vip3"
  | "vip3ii"
  | "vip4"
  | "vip5"
  | "vip6"
  | "vip7"
  | "vip8"
  | "vip9"
  | "kids_1"
  | "kids_2"
  | "kids_3";

const TIER_ID_TO_LABEL: Record<TierId, string> = {
  free: "Free / Miễn phí",
  vip1: "VIP1 / VIP1",
  vip2: "VIP2 / VIP2",
  vip3: "VIP3 / VIP3",
  vip3ii: "VIP3 II / VIP3 II",
  vip4: "VIP4 / VIP4",
  vip5: "VIP5 / VIP5",
  vip6: "VIP6 / VIP6",
  vip7: "VIP7 / VIP7",
  vip8: "VIP8 / VIP8",
  vip9: "VIP9 / VIP9",
  kids_1: "Kids 1 / Trẻ em 1",
  kids_2: "Kids 2 / Trẻ em 2",
  kids_3: "Kids 3 / Trẻ em 3",
};

function inferTierId(id: string, tier: string | null): TierId {
  const idLower = id.toLowerCase();
  const tierLower = (tier || "").toLowerCase();

  // VIP3II: id or tier mentions vip3ii or "vip3 ii"
  if (idLower.includes("vip3ii") || tierLower.includes("vip3 ii")) return "vip3ii";

  // VIP3: id or tier mentions vip3
  if (idLower.includes("vip3") || tierLower.includes("vip3")) return "vip3";

  if (idLower.includes("vip1") || tierLower.includes("vip1")) return "vip1";
  if (idLower.includes("vip2") || tierLower.includes("vip2")) return "vip2";
  if (idLower.includes("vip4") || tierLower.includes("vip4")) return "vip4";
  if (idLower.includes("vip5") || tierLower.includes("vip5")) return "vip5";
  if (idLower.includes("vip6") || tierLower.includes("vip6")) return "vip6";
  if (idLower.includes("vip7") || tierLower.includes("vip7")) return "vip7";
  if (idLower.includes("vip8") || tierLower.includes("vip8")) return "vip8";
  if (idLower.includes("vip9") || tierLower.includes("vip9")) return "vip9";

  if (idLower.includes("kids_l1") || tierLower.includes("kids_1")) return "kids_1";
  if (idLower.includes("kids_l2") || tierLower.includes("kids_2")) return "kids_2";
  if (idLower.includes("kids_l3") || tierLower.includes("kids_3")) return "kids_3";

  return "free";
}

async function run() {
  console.log("🔍 Fetching rooms...");
  const { data, error } = await supabase.from("rooms").select("id, tier");

  if (error) {
    console.error("❌ Error loading rooms:", error);
    process.exit(1);
  }

  const rooms = data || [];
  console.log(`Found ${rooms.length} rooms`);

  const updates: any[] = [];

  for (const r of rooms) {
    const tierId = inferTierId(r.id, r.tier);
    const canonicalTier = TIER_ID_TO_LABEL[tierId];
    if (r.tier !== canonicalTier) {
      updates.push({ id: r.id, oldTier: r.tier, newTier: canonicalTier, tierId });
    }
  }

  console.log(`Will update ${updates.length} rooms`);

  const batchSize = 50;
  for (let i = 0; i < updates.length; i += batchSize) {
    const batch = updates.slice(i, i + batchSize);
    console.log(
      `✏️ Updating batch ${i / batchSize + 1}/${Math.ceil(updates.length / batchSize)}`
    );

    const { error: upErr } = await supabase.from("rooms").upsert(
      batch.map((u) => ({ id: u.id, tier: u.newTier })),
      { onConflict: "id" }
    );

    if (upErr) {
      console.error("❌ Batch update error:", upErr);
      process.exit(1);
    }
  }

  console.log("✅ Done. Tier labels normalized.");
}

run().catch((err) => {
  console.error("❌ Fatal:", err);
  process.exit(1);
});
