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
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-3 rounded-2xl shadow-lg border-2 border-purple-200 dark:border-purple-800">
      <div className="flex items-center gap-2">
        <Button
          onClick={handleZoomOut}
          disabled={!canZoomOut}
          size="sm"
          variant="outline"
          className="h-10 w-10 p-0 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900"
          title="Zoom Out (Ctrl/Cmd + -)"
        >
          <ZoomOut className="h-5 w-5" />
        </Button>
        
        <Button
          onClick={handleReset}
          size="sm"
          variant="outline"
          className="h-10 px-3 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900"
          title="Reset Zoom (Ctrl/Cmd + 0)"
        >
          <Maximize2 className="h-4 w-4 mr-1" />
          <span className="text-xs font-bold">{Math.round(zoomLevel * 100)}%</span>
        </Button>
        
        <Button
          onClick={handleZoomIn}
          disabled={!canZoomIn}
          size="sm"
          variant="outline"
          className="h-10 w-10 p-0 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900"
          title="Zoom In (Ctrl/Cmd + +)"
        >
          <ZoomIn className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="text-[10px] text-center text-muted-foreground">
        Press Ctrl/⌘ +/- to zoom
      </div>
    </div>
  );
};
