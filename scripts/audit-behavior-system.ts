// scripts/audit-behavior-system.ts
// MERCY BLADE – Behavior Tracking System Audit (READ-ONLY)
//
// Validates that behavior tracking, progress, and points tables
// are properly configured in the database schema.
//
// Usage: npx tsx scripts/audit-behavior-system.ts

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;

interface AuditCheck {
  name: string;
  status: "ok" | "warn" | "error";
  details?: string;
}

async function auditBehaviorSystem(): Promise<void> {
  console.log("🔍 BEHAVIOR TRACKING SYSTEM AUDIT");
  console.log("==================================\n");

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.log("❌ Supabase credentials not found in environment.");
    console.log("   Expected VITE_SUPABASE_URL + VITE_SUPABASE_PUBLISHABLE_KEY");
    console.log("   or SUPABASE_URL + SUPABASE_ANON_KEY.\n");
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const checks: AuditCheck[] = [];

  // 1. Check user_behavior_tracking table exists and has data structure
  console.log("Checking user_behavior_tracking table...");
  const { data: behaviorSample, error: behaviorError } = await supabase
    .from("user_behavior_tracking")
    .select("id, user_id, room_id, interaction_type")
    .limit(1);

  if (behaviorError) {
    checks.push({
      name: "user_behavior_tracking table",
      status: "error",
      details: behaviorError.message
    });
  } else {
    checks.push({
      name: "user_behavior_tracking table",
      status: "ok"
    });
  }

  // 2. Check point_transactions table
  console.log("Checking point_transactions table...");
  const { error: pointsError } = await supabase
    .from("point_transactions")
    .select("id, user_id, points, transaction_type")
    .limit(1);

  if (pointsError) {
    checks.push({
      name: "point_transactions table",
      status: "error",
      details: pointsError.message
    });
  } else {
    checks.push({
      name: "point_transactions table",
      status: "ok"
    });
  }

  // 3. Check user_points table
  console.log("Checking user_points table...");
  const { error: userPointsError } = await supabase
    .from("user_points")
    .select("id, user_id, total_points")
    .limit(1);

  if (userPointsError) {
    checks.push({
      name: "user_points table",
      status: "error",
      details: userPointsError.message
    });
  } else {
    checks.push({
      name: "user_points table",
      status: "ok"
    });
  }

  // 4. Check room_usage_analytics table
  console.log("Checking room_usage_analytics table...");
  const { error: analyticsError } = await supabase
    .from("room_usage_analytics")
    .select("id, user_id, room_id, session_start")
    .limit(1);

  if (analyticsError) {
    checks.push({
      name: "room_usage_analytics table",
      status: "error",
      details: analyticsError.message
    });
  } else {
    checks.push({
      name: "room_usage_analytics table",
      status: "ok"
    });
  }

  // 5. Check subscription_usage table
  console.log("Checking subscription_usage table...");
  const { error: usageError } = await supabase
    .from("subscription_usage")
    .select("id, user_id, usage_date")
    .limit(1);

  if (usageError) {
    checks.push({
      name: "subscription_usage table",
      status: "error",
      details: usageError.message
    });
  } else {
    checks.push({
      name: "subscription_usage table",
      status: "ok"
    });
  }

  // Report
  console.log("\n📊 AUDIT RESULTS");
  console.log("================\n");

  let hasErrors = false;
  for (const check of checks) {
    const icon = check.status === "ok" ? "✅" : check.status === "warn" ? "⚠️" : "❌";
    console.log(`${icon} ${check.name}${check.details ? `: ${check.details}` : ""}`);
    if (check.status === "error") hasErrors = true;
  }

  console.log("");

  if (hasErrors) {
    console.log("❌ Behavior system has issues that need attention.\n");
    process.exit(1);
  }

  console.log("✅ Behavior tracking system is properly configured.\n");
  process.exit(0);
}

auditBehaviorSystem().catch((err) => {
  console.error("Audit failed:", err);
  process.exit(1);
});
