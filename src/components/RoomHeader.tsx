import { ReactNode } from "react";
import { MercyBladeThemeToggle } from "./MercyBladeThemeToggle";
import { RoomAdminTools } from "./admin/RoomAdminTools";

interface RoomHeaderProps {
  title: string;
  subtitle?: string;
  tier?: string;
  breadcrumbs?: ReactNode;
  showThemeToggle?: boolean;
  className?: string;
  roomData?: any;
  roomId?: string;
  actions?: ReactNode;
}

/**
 * Unified Room Header Component
 * Clean, centered layout with:
 * - Breadcrumbs left-aligned
 * - Title + tier badge centered
 * - Subtitle centered below title
 * - Controls row for theme toggle and admin tools
 */
export function RoomHeader({ 
  title, 
  subtitle,
  tier, 
  breadcrumbs,
  showThemeToggle = true,
  className = "",
  roomData,
  roomId,
  actions
}: RoomHeaderProps) {
  return (
    <div className={`mb-6 space-y-4 ${className}`}>
      {/* Breadcrumbs: left aligned */}
      {breadcrumbs && (
        <div className="text-xs text-muted-foreground flex items-center gap-2">
          {breadcrumbs}
        </div>
      )}

      {/* Title block: centered, symmetric */}
      <div className="flex flex-col items-center text-center gap-3">
        <h1 
          className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground"
          data-room-title
        >
          {title}
        </h1>
        
        {subtitle && (
          <p className="max-w-2xl text-sm sm:text-base text-muted-foreground">
            {subtitle}
          </p>
        )}

        {/* Tier badge + controls under title */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {tier && (
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium transition-colors duration-200">
              {tier}
            </span>
          )}
          {roomData && roomId && (
            <RoomAdminTools roomData={roomData} roomId={roomId} />
          )}
          {showThemeToggle && (
            <MercyBladeThemeToggle variant="outline" size="sm" />
          )}
        </div>
        
        {/* Additional actions (refresh, favorites, etc.) */}
        {actions && (
          <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
