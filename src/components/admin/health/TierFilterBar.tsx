import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface TierFilterBarProps {
  selectedTier: string;
  onTierChange: (tier: string) => void;
  roomCount?: number;
}

const TIER_OPTIONS = [
  { value: "all", label: "All Tiers" },
  { value: "level0", label: "Level 0" },
  { value: "level1", label: "Level 1" },
  { value: "level2", label: "Level 2" },
  { value: "level3", label: "Level 3" },
  { value: "level4", label: "Level 4" },
  { value: "level5", label: "Level 5" },
  { value: "level6", label: "Level 6" },
  { value: "level9", label: "Level 9" },
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
