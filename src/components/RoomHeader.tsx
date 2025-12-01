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
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* Title Block - Centered with 24px top spacing */}
      <div className="text-center space-y-3 pt-6 pb-3">
        <div className="flex items-center justify-center gap-3">
          <h1 className="text-2xl font-bold transition-colors duration-200">
            {title}
          </h1>
          {tier && (
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium transition-colors duration-200">
              {tier}
            </span>
          )}
          {roomData && roomId && (
            <RoomAdminTools roomData={roomData} roomId={roomId} />
          )}
        </div>
      </div>
      
      {/* Controls - Aligned right */}
      {showThemeToggle && (
        <div className="flex justify-end mb-6">
          <MercyBladeThemeToggle variant="outline" size="sm" />
        </div>
      )}
    </div>
  );
}
