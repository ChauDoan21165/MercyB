import { Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function HomeButton() {
  const location = useLocation();
  const isHomepage = location.pathname === "/";

  // Don't show on homepage itself
  if (isHomepage) return null;

  return (
    <Link to="/">
      <Button
        variant="outline"
        size="sm"
        className="fixed top-4 left-4 z-50 bg-background/95 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200 border-2 hover:scale-105"
      >
        <Home className="h-4 w-4 mr-2" />
        <span className="font-semibold">Home</span>
      </Button>
    </Link>
  );
}
