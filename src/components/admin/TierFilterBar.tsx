/**
 * L8 — Tier Filter Bar Component
 * Dropdown to select which tier to validate
 */

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { tierIdToLabel, type TierId } from "@/lib/constants/tiers";

interface TierFilterBarProps {
  selectedTier: TierId | "all";
  onTierChange: (tier: TierId | "all") => void;
  availableTiers?: TierId[];
}

export const TierFilterBar = ({
  selectedTier,
  onTierChange,
  availableTiers = [
    "level0",
    "level1",
    "level2",
    "level3",
    "level4",
    "level5",
    "level6",
    "level9",
    "kids_1",
    "kids_2",
    "kids_3",
  ],
}: TierFilterBarProps) => {
  return (
    <div className="flex items-center gap-4">
      <label className="text-sm font-medium">Select Tier:</label>
      <Select
        value={selectedTier}
        onValueChange={(value) => onTierChange(value as TierId | "all")}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select tier" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Tiers</SelectItem>
          {availableTiers.map((tier) => (
            <SelectItem key={tier} value={tier}>
              {tierIdToLabel[tier] ?? tier}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};