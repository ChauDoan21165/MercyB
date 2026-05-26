import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ZOOM_LEVELS = [0.75, 0.85, 1, 1.15, 1.25, 1.5, 1.75, 2];
const DEFAULT_ZOOM = 1;

export const ZoomControl = () => {
  const { toast } = useToast();
  const [zoomLevel, setZoomLevel] = useState(() => {
    const saved = localStorage.getItem("app-zoom-level");
    return saved ? parseFloat(saved) : DEFAULT_ZOOM;
  });

  useEffect(() => {
    // Apply zoom to the root element
    document.documentElement.style.fontSize = `${zoomLevel * 100}%`;
    localStorage.setItem("app-zoom-level", zoomLevel.toString());
  }, [zoomLevel]);

  useEffect(() => {
    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey)) {
        if (e.key === '=' || e.key === '+') {
          e.preventDefault();
          handleZoomIn();
        } else if (e.key === '-') {
          e.preventDefault();
          handleZoomOut();
        } else if (e.key === '0') {
          e.preventDefault();
          handleReset();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoomLevel]);

  const handleZoomIn = () => {
    const currentIndex = ZOOM_LEVELS.indexOf(zoomLevel);
    if (currentIndex < ZOOM_LEVELS.length - 1) {
      const newZoom = ZOOM_LEVELS[currentIndex + 1];
      setZoomLevel(newZoom);
      toast({
        title: "🔍 Zoomed In",
        description: `Zoom level: ${Math.round(newZoom * 100)}%`,
      });
    }
  };

  const handleZoomOut = () => {
    const currentIndex = ZOOM_LEVELS.indexOf(zoomLevel);
    if (currentIndex > 0) {
      const newZoom = ZOOM_LEVELS[currentIndex - 1];
      setZoomLevel(newZoom);
      toast({
        title: "🔍 Zoomed Out",
        description: `Zoom level: ${Math.round(newZoom * 100)}%`,
      });
    }
  };

  const handleReset = () => {
    setZoomLevel(DEFAULT_ZOOM);
    toast({
      title: "🔍 Zoom Reset",
      description: "Zoom level: 100%",
    });
  };

  const currentIndex = ZOOM_LEVELS.indexOf(zoomLevel);
  const canZoomIn = currentIndex < ZOOM_LEVELS.length - 1;
  const canZoomOut = currentIndex > 0;

  return (
    <div className="fixed bottom-2 left-2 z-40 flex items-center gap-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-md border border-purple-200 dark:border-purple-800">
      <Button
        onClick={handleZoomOut}
        disabled={!canZoomOut}
        size="sm"
        variant="ghost"
        className="h-6 w-6 p-0 hover:bg-purple-100 dark:hover:bg-purple-900"
        title="Zoom Out (Ctrl/Cmd + -)"
      >
        <ZoomOut className="h-3 w-3" />
      </Button>
      
      <Button
        onClick={handleReset}
        size="sm"
        variant="ghost"
        className="h-6 px-2 hover:bg-purple-100 dark:hover:bg-purple-900"
        title="Reset Zoom (Ctrl/Cmd + 0)"
      >
        <Maximize2 className="h-3 w-3 mr-1" />
        <span className="text-[10px] font-medium">{Math.round(zoomLevel * 100)}%</span>
      </Button>
      
      <Button
        onClick={handleZoomIn}
        disabled={!canZoomIn}
        size="sm"
        variant="ghost"
        className="h-6 w-6 p-0 hover:bg-purple-100 dark:hover:bg-purple-900"
        title="Zoom In (Ctrl/Cmd + +)"
      >
        <ZoomIn className="h-3 w-3" />
      </Button>
    </div>
  );
};
