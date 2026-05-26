import { useMbTheme } from "@/hooks/useMbTheme";
import { Button } from "@/components/ui/button";

export function RoomHeaderTools() {
  const { mode, toggle } = useMbTheme();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={toggle}
        className="text-xs"
      >
        {mode === "color" ? "B&W mode" : "Color mode"}
      </Button>
    </div>
  );
}
