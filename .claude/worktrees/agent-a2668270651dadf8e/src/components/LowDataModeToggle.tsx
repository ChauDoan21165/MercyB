import { Button } from "@/components/ui/button";
import { Gauge } from "lucide-react";
import { useLowDataMode } from "@/contexts/LowDataModeContext";
import { useToast } from "@/hooks/use-toast";

export const LowDataModeToggle = () => {
  const { isLowDataMode, toggleLowDataMode } = useLowDataMode();
  const { toast } = useToast();

  const handleToggle = () => {
    toggleLowDataMode();
    toast({
      title: isLowDataMode ? "Normal Mode" : "Low Data Mode",
      description: isLowDataMode 
        ? "Full quality restored" 
        : "Images disabled, animations reduced",
    });
  };

  return (
    <Button
      variant={isLowDataMode ? "default" : "outline"}
      size="sm"
      onClick={handleToggle}
      className="flex items-center gap-2"
    >
      <Gauge className="h-4 w-4" />
      {isLowDataMode ? "Low Data ON" : "Low Data OFF"}
    </Button>
  );
};
