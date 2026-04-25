// src/components/PricingToggle.tsx

import { Switch } from "@/components/ui/switch";

import { SavingsBadge } from "@/components/pricing/SavingsBadge";
import {
  MONTHLY_PRICE_VND,
  YEARLY_PRICE_VND,
} from "@/lib/pricing/displayPrices";

interface PricingToggleProps {
  isYearly: boolean;
  onToggle: (isYearly: boolean) => void;
}

export const PricingToggle = ({ isYearly, onToggle }: PricingToggleProps) => {
  return (
    <div
      className="flex items-center justify-center gap-3 mb-8"
      role="group"
      aria-label="Billing period"
    >
      {/* Clicking the monthly label switches to monthly */}
      <span
        role="button"
        tabIndex={0}
        onClick={() => onToggle(false)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onToggle(false); }}
        className={`text-sm font-medium cursor-pointer transition-colors select-none ${
          !isYearly ? "text-primary" : "text-muted-foreground"
        }`}
        aria-pressed={!isYearly}
      >
        Monthly
        <span className="block text-xs font-normal opacity-70">Hàng tháng</span>
      </span>

      <Switch
        id="pricing-toggle"
        checked={isYearly}
        onCheckedChange={onToggle}
        aria-label="Toggle yearly billing"
      />

      {/* Clicking the yearly label switches to yearly. SavingsBadge is
          rendered prominently next to the label so the value prop is
          visible whether the toggle is on or off — the rebrand from a
          static "Save 17%" string is intentional. */}
      <span
        role="button"
        tabIndex={0}
        onClick={() => onToggle(true)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onToggle(true); }}
        className={`text-sm font-medium cursor-pointer transition-colors select-none inline-flex items-center gap-2 ${
          isYearly ? "text-primary" : "text-muted-foreground"
        }`}
        aria-pressed={isYearly}
      >
        <span>
          Yearly
          <span className="block text-xs font-normal opacity-70">Hàng năm</span>
        </span>
        <SavingsBadge
          monthlyAmount={MONTHLY_PRICE_VND}
          yearlyAmount={YEARLY_PRICE_VND}
          currency="VND"
          variant="compact"
        />
      </span>
    </div>
  );
};
