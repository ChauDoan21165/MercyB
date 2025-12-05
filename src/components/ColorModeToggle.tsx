import { Button } from "@/components/ui/button";
import { useColorMode } from "@/lib/color-mode";

export function ColorModeToggle() {
  const { mode, toggle } = useColorMode();
  const isBw = mode === "bw";

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggle}
      aria-label={isBw ? "Switch to color mode" : "Switch to black & white mode"}
      title={isBw ? "Switch to color" : "Switch to B&W"}
      className="h-8 w-8"
    >
      {isBw ? "⚫" : "🎨"}
    </Button>
  );
}
