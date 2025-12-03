/**
 * Room Header Standard v1
 * Canonical room header component for all room pages.
 * 
 * Structure:
 * - Single H1 title (EN / VI or just one if same)
 * - Meta row: tier pill, category pill, author info, action buttons
 * - Optional subtitle/tagline
 */

import { cn } from "@/lib/utils";
import { Heart, RefreshCw, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ReactNode } from "react";

export interface RoomHeaderStandardProps {
  titleEn: string;
  titleVi: string;
  tier: string;
  categoryLabel?: string;
  authorName?: string;
  authorTier?: string;
  subtitle?: string;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  actions?: ReactNode;
  className?: string;
}

// Tier color mapping for consistent styling
const tierColors: Record<string, string> = {
  free: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  vip1: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  vip2: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  vip3: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  vip4: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
  vip5: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  vip6: "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/30 dark:text-fuchsia-300",
  vip7: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
  vip8: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  vip9: "bg-slate-800 text-slate-100 dark:bg-slate-700 dark:text-slate-100",
  kids: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
};

function getTierColorClass(tier: string): string {
  const normalized = tier.toLowerCase().replace(/\s+/g, '').replace('vip', 'vip');
  return tierColors[normalized] || tierColors.free;
}

function formatTierLabel(tier: string): string {
  if (!tier) return "Free";
  const lower = tier.toLowerCase();
  if (lower === "free") return "Free";
  if (lower.startsWith("vip")) {
    const num = lower.replace("vip", "").trim();
    return `VIP ${num}`;
  }
  if (lower.includes("kids")) return "Kids";
  return tier;
}

export function RoomHeaderStandard({
  titleEn,
  titleVi,
  tier,
  categoryLabel,
  authorName,
  authorTier,
  subtitle,
  isFavorite,
  onFavoriteToggle,
  onRefresh,
  isRefreshing,
  actions,
  className,
}: RoomHeaderStandardProps) {
  // Compose title: show both if different, single if same
  const displayTitle = titleEn === titleVi 
    ? titleEn 
    : `${titleEn} / ${titleVi}`;

  return (
    <div className={cn("space-y-2", className)}>
      {/* H1 Title - Single, no duplicates */}
      <h1 
        className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground leading-tight"
        data-room-title
      >
        {displayTitle}
      </h1>

      {/* Meta Row - Compact, single line */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Tier Pill */}
        <Badge 
          variant="secondary" 
          className={cn(
            "text-xs font-medium px-2.5 py-0.5 rounded-full",
            getTierColorClass(tier)
          )}
        >
          {formatTierLabel(tier)}
        </Badge>

        {/* Category Pill (optional) */}
        {categoryLabel && (
          <Badge 
            variant="outline" 
            className="text-xs font-medium px-2.5 py-0.5 rounded-full border-border"
          >
            {categoryLabel}
          </Badge>
        )}

        {/* Author Info (optional) */}
        {authorName && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <User className="w-3 h-3" />
            <span>{authorName}</span>
            {authorTier && (
              <span className="font-medium text-primary">• {authorTier}</span>
            )}
          </span>
        )}

        {/* Spacer to push actions right on desktop */}
        <div className="flex-1 hidden sm:block" />

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          {onFavoriteToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onFavoriteToggle}
              className="h-7 w-7 p-0"
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart 
                className={cn(
                  "w-4 h-4",
                  isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"
                )} 
              />
            </Button>
          )}

          {onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="h-7 w-7 p-0"
              title="Refresh room"
            >
              <RefreshCw 
                className={cn(
                  "w-4 h-4 text-muted-foreground",
                  isRefreshing && "animate-spin"
                )} 
              />
            </Button>
          )}

          {actions}
        </div>
      </div>

      {/* Optional Subtitle/Tagline */}
      {subtitle && (
        <p className="text-sm text-muted-foreground leading-snug">
          {subtitle}
        </p>
      )}
    </div>
  );
}
