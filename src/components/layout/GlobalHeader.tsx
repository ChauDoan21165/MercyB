import { Link } from "react-router-dom";
import { Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HomeButton } from "@/components/HomeButton";
import { BackButton } from "@/components/BackButton";
import { ThemeToggle } from "@/components/ThemeToggle";

/**
 * GlobalHeader - Single app-wide header with Mercy Blade logo
 * 
 * - Single source of truth for the header
 * - Logo centered within 720px container
 * - Navigation left, controls right
 */
export function GlobalHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto max-w-[720px] h-12 px-4 grid grid-cols-[auto,1fr,auto] items-center">
        {/* Left: navigation */}
        <div className="flex items-center gap-2">
          <HomeButton />
          <BackButton />
        </div>

        {/* Center: Mercy Blade logo - perfectly centered in column 2 */}
        <div className="flex justify-center">
          <Link
            to="/"
            className="font-semibold text-lg tracking-tight bg-gradient-to-r from-[hsl(var(--rainbow-magenta))] via-[hsl(var(--rainbow-purple))] to-[hsl(var(--rainbow-cyan))] bg-clip-text text-transparent hover:opacity-80 transition-opacity"
          >
            Mercy Blade
          </Link>
        </div>

        {/* Right: controls */}
        <div className="flex items-center gap-2 justify-end">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            asChild
          >
            <Link to="/tier-map" title="Tier Map">
              <Map className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
