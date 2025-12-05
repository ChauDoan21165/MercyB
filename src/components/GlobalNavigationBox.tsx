import { Home, ArrowLeft } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

/**
 * Global Navigation Box - Always visible on all pages in fixed position
 * Contains Home button (top) and Back button (bottom) stacked in a single box
 */
export function GlobalNavigationBox() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Don't show on homepage or onboarding
  if (location.pathname === "/" || location.pathname === "/onboarding") {
    return null;
  }

  // Root paths where back button shouldn't appear
  const isRootPath = ["/", "/admin"].includes(location.pathname);

  return (
    <div className="fixed top-4 left-4 z-50">
      <div className="flex flex-col gap-1 bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg p-1">
        {/* Home Button - Top */}
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="justify-start hover:bg-accent"
        >
          <Link to="/">
            <Home className="h-4 w-4 mr-2" />
            <span className="font-medium">Home</span>
          </Link>
        </Button>
        
        {/* Back Button - Bottom (only if not on root path) */}
        {!isRootPath && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="justify-start hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="font-medium">Back</span>
          </Button>
        )}
      </div>
    </div>
  );
}
