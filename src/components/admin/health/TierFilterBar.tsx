import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface TierFilterBarProps {
  selectedTier: string;
  onTierChange: (tier: string) => void;
  roomCount?: number;
}

const TIER_OPTIONS = [
  { value: "all", label: "All Tiers" },
  { value: "free", label: "Free" },
  { value: "vip1", label: "VIP1" },
  { value: "vip2", label: "VIP2" },
  { value: "vip3", label: "VIP3" },
  { value: "vip3ii", label: "VIP3 II" },
  { value: "vip4", label: "VIP4" },
  { value: "vip5", label: "VIP5" },
  { value: "vip6", label: "VIP6" },
  { value: "vip9", label: "VIP9" },
  { value: "kids", label: "Kids Rooms" },
];

export function TierFilterBar({ selectedTier, onTierChange, roomCount }: TierFilterBarProps) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-black">Filter by tier:</span>
        <Select value={selectedTier} onValueChange={onTierChange}>
          <SelectTrigger className="w-[180px] border-black">
            <SelectValue placeholder="Select tier" />
          </SelectTrigger>
          <SelectContent>
            {TIER_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {roomCount !== undefined && (
        <Badge variant="outline" className="border-black">
          {roomCount} rooms
        </Badge>
      )}
    </div>
  );
}
