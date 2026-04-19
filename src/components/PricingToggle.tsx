// src/components/PricingToggle.tsx

import { Switch } from "@/components/ui/switch";

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

      {/* Clicking the yearly label switches to yearly */}
      <span
        role="button"
        tabIndex={0}
        onClick={() => onToggle(true)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onToggle(true); }}
        className={`text-sm font-medium cursor-pointer transition-colors select-none ${
          isYearly ? "text-primary" : "text-muted-foreground"
        }`}
        aria-pressed={isYearly}
      >
        Yearly
        <span className="block text-xs font-normal opacity-70">Hàng năm</span>
        <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
          Save 17%
          <span className="sr-only"> / Tiết kiệm 17%</span>
        </span>
      </span>
    </div>
  );
};