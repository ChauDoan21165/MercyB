import React from "react";
import { UpgradeButtons } from "@/components/billing/UpgradeButtons";

export default function Billing() {
  return (
    <div
      style={{
        maxWidth: 960,
        margin: "0 auto",
        padding: "24px 16px",
        display: "grid",
        gap: 24,
      }}
    >
      <header>
        <h1 style={{ marginBottom: 8 }}>Billing</h1>
        <p style={{ opacity: 0.8 }}>
          Upgrade your Mercy Blade access. Changes take effect after payment is confirmed.
        </p>
      </header>

      {/* Core upgrade UI */}
      <UpgradeButtons />

      <section style={{ opacity: 0.7, fontSize: 14 }}>
        <p>
          • Upgrades are applied automatically after Stripe confirms payment.<br />
          • Downgrades and cancellations are handled via Stripe billing portal.<br />
          • If access doesn’t update immediately, refresh once.
        </p>
      </section>
    </div>
  );
}
