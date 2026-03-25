// src/components/billing/ManageSubscriptionButton.tsx

import { useState } from "react";
import { openBillingPortal } from "@/lib/billingPortal";

export function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    try {
      setLoading(true);
      setError(null);

      await openBillingPortal(`${window.location.origin}/settings/billing`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="rounded-lg border px-4 py-2"
      >
        {loading ? "Opening..." : "Manage subscription"}
      </button>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}