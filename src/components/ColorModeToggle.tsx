import { Button } from "@/components/ui/button";
import { useMbTheme } from "@/hooks/useMbTheme";

export function ColorModeToggle() {
  const { mode, toggle } = useMbTheme();
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
