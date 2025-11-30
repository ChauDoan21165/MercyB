import { Home } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function HomeButton() {
  return (
    <Button
      variant="ghost"
      size="sm"
      asChild
      className="hover:bg-accent"
    >
      <Link to="/">
        <Home className="h-4 w-4 mr-2" />
        <span className="font-medium">Home</span>
      </Link>
    </Button>
  );
}
