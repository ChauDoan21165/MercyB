import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminTheme } from "@/lib/admin/theme";

/**
 * Admin Theme Toggle
 * Switches between light/dark mode for admin panel only
 */
export function AdminThemeToggle() {
  const { theme, toggleTheme } = useAdminTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="text-black hover:bg-gray-100"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
}
