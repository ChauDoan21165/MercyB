import { Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

/**
 * Global Home Button - Always visible on all pages in fixed position
 * Provides consistent navigation back to homepage from anywhere
 */
export function GlobalHomeButton() {
  const location = useLocation();
  
  // Don't show on homepage itself
  if (location.pathname === "/" || location.pathname === "/onboarding") {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 z-50">
      <Button
        variant="outline"
        size="sm"
        asChild
        className="bg-background/95 backdrop-blur-sm border-border shadow-lg hover:bg-accent"
      >
        <Link to="/">
          <Home className="h-4 w-4 mr-2" />
          <span className="font-medium">Home</span>
        </Link>
      </Button>
    </div>
  );
}
