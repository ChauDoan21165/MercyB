import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface PricingToggleProps {
  isYearly: boolean;
  onToggle: (isYearly: boolean) => void;
}

export const PricingToggle = ({ isYearly, onToggle }: PricingToggleProps) => {
  return (
    <div className="flex items-center justify-center gap-3 mb-8">
      <Label 
        htmlFor="pricing-toggle" 
        className={`text-sm font-medium cursor-pointer transition-colors ${!isYearly ? 'text-primary' : 'text-muted-foreground'}`}
      >
        Monthly / Hàng tháng
      </Label>
      <Switch
        id="pricing-toggle"
        checked={isYearly}
        onCheckedChange={onToggle}
      />
      <Label 
        htmlFor="pricing-toggle" 
        className={`text-sm font-medium cursor-pointer transition-colors ${isYearly ? 'text-primary' : 'text-muted-foreground'}`}
      >
        Yearly / Hàng năm
        <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
          Save 20% / Tiết kiệm 20%
        </span>
      </Label>
    </div>
  );
};
