#!/usr/bin/env ts-node

/**
 * Validation: check 3-column structure consistency.
 *
 * Columns:
 * - english: all English learning
 * - core: main spine (health, AI, philosophy, sexuality, finance, etc.)
 * - life: survival & life skills (debate, martial arts, work skills...)
 *
 * This script:
 *  - Assigns each room to a column based on domain + id patterns
 *  - Ensures VIP3/VIP3II follow correct rules
 *  - Prints anomalies for manual review
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

type Column = "english" | "core" | "life" | "unknown";

const DOMAIN_TO_COLUMN: Record<string, Column> = {
  // LEFT: English
  English: "english",
  Writing: "english",
  "Public Speaking": "english",
  Listening: "english",
  Grammar: "english",

  // CENTER: Core
  Health: "core",
  Psychology: "core",
  Philosophy: "core",
  AI: "core",
  God: "core",
  "Life Meaning": "core",
  Finance: "core",
  Sexuality: "core",

  // RIGHT: Life Skills
  "Life Skills": "life",
  Survival: "life",
  Debate: "life",
  "Martial Arts": "life",
  "Job Skills": "life",
  Career: "life",
};

function classifyColumn(room: any): Column {
  const domain = (room.domain || "").trim();
  if (domain && DOMAIN_TO_COLUMN[domain]) return DOMAIN_TO_COLUMN[domain];

  const id = room.id.toLowerCase();
  const titleEn = (room.title_en || "").toLowerCase();

  // Heuristic: English
  if (
    id.includes("english") ||
    id.includes("writing") ||
    id.includes("grammar") ||
    titleEn.includes("english")
  ) {
    return "english";
  }

  // Heuristic: Life Skills
  if (
    id.includes("survival") ||
    id.includes("debate") ||
    id.includes("martial") ||
    id.includes("career") ||
    id.includes("job-") ||
    id.includes("speaking-practice")
  ) {
    return "life";
  }

  // Heuristic: Core
  if (
    id.includes("health") ||
    id.includes("sleep") ||
    id.includes("stress") ||
    id.includes("philosophy") ||
    id.includes("meaning-of-life") ||
    id.includes("sexual") ||
    id.includes("finance") ||
    id.includes("strategy") ||
    id.includes("schizophrenia")
  ) {
    return "core";
  }

  return "unknown";
}

function inferTierIdFromLabel(tier: string | null): string {
  const t = (tier || "").toLowerCase();
  if (t.includes("vip3 ii")) return "vip3ii";
  if (t.includes("vip3")) return "vip3";
  if (t.includes("vip1")) return "vip1";
  if (t.includes("vip2")) return "vip2";
  if (t.includes("vip4")) return "vip4";
  if (t.includes("vip5")) return "vip5";
  if (t.includes("vip6")) return "vip6";
  if (t.includes("vip7")) return "vip7";
  if (t.includes("vip8")) return "vip8";
  if (t.includes("vip9")) return "vip9";
  if (t.includes("kids")) return "kids";
  return "free";
}

async function run() {
  console.log("🔍 Loading rooms for validation...");
  const { data, error } = await supabase
    .from("rooms")
    .select("id, tier, domain, title_en");

  if (error) {
    console.error("❌ Error loading rooms:", error);
    process.exit(1);
  }

  const rooms = data || [];

  const anomalies: any[] = [];
  const byTier: Record<string, { english: number; core: number; life: number; unknown: number }> =
    {};

  for (const r of rooms) {
    const column = classifyColumn(r);
    const tierId = inferTierIdFromLabel(r.tier);

    if (!byTier[tierId]) {
      byTier[tierId] = { english: 0, core: 0, life: 0, unknown: 0 };
    }
    byTier[tierId][column]++;

    // VIP3II rules: must be core
    if (tierId === "vip3ii" && column !== "core") {
      anomalies.push({
        id: r.id,
        tier: r.tier,
        domain: r.domain,
        issue: "VIP3II room is not in CORE column",
        column,
      });
    }

    // Potential misplacement: sexual/finance but classified as english/life
    if (
      r.id.toLowerCase().includes("sexual") ||
      r.id.toLowerCase().includes("finance")
    ) {
      if (column !== "core") {
        anomalies.push({
          id: r.id,
          tier: r.tier,
          domain: r.domain,
          issue: "Sexuality/Finance room should be in CORE",
          column,
        });
      }
    }

    if (column === "unknown") {
      anomalies.push({
        id: r.id,
        tier: r.tier,
        domain: r.domain,
        issue: "Unknown column classification (please set domain)",
      });
    }
  }

  console.log("\n📊 Column distribution by tier:");
  Object.entries(byTier).forEach(([tier, counts]) => {
    console.log(
      `- ${tier}: EN=${counts.english}, CORE=${counts.core}, LIFE=${counts.life}, UNKNOWN=${counts.unknown}`
    );
  });

  console.log(`\n⚠️ Found ${anomalies.length} anomalies:`);
  anomalies.slice(0, 50).forEach((a) => {
    console.log(
      `- ${a.id} | tier=${a.tier} | domain=${a.domain} | issue=${a.issue} | column=${a.column}`
    );
  });
  if (anomalies.length > 50) {
    console.log(`... and ${anomalies.length - 50} more`);
  }

  console.log("\n✅ Validation complete.");
}

run().catch((err) => {
  console.error("❌ Fatal:", err);
  process.exit(1);
});
