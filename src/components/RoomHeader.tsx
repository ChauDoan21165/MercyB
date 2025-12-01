import { MercyBladeThemeToggle } from "./MercyBladeThemeToggle";

interface RoomHeaderProps {
  title: string;
  tier?: string;
  showThemeToggle?: boolean;
  className?: string;
}

/**
 * Unified Room Header Component
 * Consistent placement of title, tier badge, and theme toggle
 */
export function RoomHeader({ 
  title, 
  tier, 
  showThemeToggle = true,
  className = "" 
}: RoomHeaderProps) {
  return (
    <div className={`flex items-center justify-between gap-4 mb-6 ${className}`}>
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold transition-colors duration-200">{title}</h1>
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
