import React from "react";
import Pricing from "@/screens/Pricing";

/**
 * Legacy Upgrade page
 * - Keep all existing /upgrade links working
 * - Show the SAME pricing content as /pricing (Stripe pricing table)
 * - No Supabase calls, no auth gates
 */
export default function UpgradePage() {
  return <Pricing />;
}