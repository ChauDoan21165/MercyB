import { Button } from '@/components/ui/button';
import { Palette } from 'lucide-react';
import { useMercyBladeTheme } from '@/hooks/useMercyBladeTheme';

interface MercyBladeThemeToggleProps {
  /**
   * Button variant
   * @default "outline"
   */
  variant?: "outline" | "ghost" | "default";
  
  /**
   * Button size
   * @default "sm"
   */
  size?: "sm" | "default" | "lg" | "icon";
  
  /**
   * Additional className
   */
  className?: string;
}

/**
 * Canonical Theme Toggle Component
 * 
 * Switches between color (Mercy Blade rainbow) and black & white modes.
 * Uses useMercyBladeTheme hook for unified state management.
 * 
 * @example
 * <MercyBladeThemeToggle variant="outline" size="sm" />
 */
export function MercyBladeThemeToggle({
  variant = "outline",
  size = "sm",
  className = "",
}: MercyBladeThemeToggleProps) {
  const { mode, toggleMode, isColor } = useMercyBladeTheme();

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleMode}
      className={`gap-2 ${className}`}
      aria-label={isColor ? "Switch to black & white mode" : "Switch to color mode"}
      title={isColor ? "Switch to B&W / Chuyển sang Đen Trắng" : "Switch to Color / Chuyển sang Màu"}
      data-theme-toggle={mode}
    >
      <Palette 
        className="w-4 h-4" 
        aria-hidden="true"
        style={isColor ? { 
          color: 'hsl(var(--primary))',
        } : {
          color: '#000000',
        }}
      />
      <span className="hidden sm:inline">
        {isColor ? "Color / Màu" : "B&W / Đen Trắng"}
      </span>
    </Button>
  );
}
