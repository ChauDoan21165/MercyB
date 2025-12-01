import { MercyBladeThemeToggle } from "./MercyBladeThemeToggle";
import { RoomAdminTools } from "./admin/RoomAdminTools";

interface RoomHeaderProps {
  title: string;
  tier?: string;
  showThemeToggle?: boolean;
  className?: string;
  roomData?: any;
  roomId?: string;
}

/**
 * Unified Room Header Component
 * Consistent placement of title, tier badge, admin tools, and theme toggle
 */
export function RoomHeader({ 
  title, 
  tier, 
  showThemeToggle = true,
  className = "",
  roomData,
  roomId
}: RoomHeaderProps) {
  return (
    <div className={`flex items-center justify-between gap-4 mb-6 ${className}`}>
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold transition-colors duration-200">
          {title}
          {roomData && roomId && (
            <RoomAdminTools roomData={roomData} roomId={roomId} />
          )}
        </h1>
        {tier && (
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium transition-colors duration-200">
            {tier}
          </span>
        )}
      </div>
      {showThemeToggle && (
        <MercyBladeThemeToggle variant="outline" size="sm" />
      )}
    </div>
  );
}
