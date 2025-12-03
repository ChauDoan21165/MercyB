import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, ZoomIn, ZoomOut, Maximize2, Copy, Circle, FileJson, Languages } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUserAccess } from "@/hooks/useUserAccess";
import { useToast } from "@/hooks/use-toast";
import { MusicPlayer } from "@/components/MusicPlayer";

const ZOOM_LEVELS = [0.75, 0.85, 1, 1.15, 1.25, 1.5, 1.75, 2];
const DEFAULT_ZOOM = 1;

export const UnifiedBottomBar = () => {
  const navigate = useNavigate();
  const { isAdmin } = useUserAccess();
  const { toast } = useToast();
  const isDev = import.meta.env.DEV;
  
  const [versionIndicator, setVersionIndicator] = useState('A');
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeLang, setActiveLang] = useState<'en' | 'vi'>('en');
  const [zoomLevel, setZoomLevel] = useState(() => {
    const saved = localStorage.getItem("app-zoom-level");
    return saved ? parseFloat(saved) : DEFAULT_ZOOM;
  });

  // Zoom effects
  useEffect(() => {
    document.documentElement.style.fontSize = `${zoomLevel * 100}%`;
    localStorage.setItem("app-zoom-level", zoomLevel.toString());
  }, [zoomLevel]);

  useEffect(() => {
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

  // Fetch version and notifications
  useEffect(() => {
    fetchVersionIndicator();
    
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const pollInterval = isMobile ? setInterval(fetchVersionIndicator, 30000) : null;

    const versionChannel = supabase
      .channel('version-indicator-unified')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'app_settings', filter: 'setting_key=eq.version_indicator' },
        (payload) => {
          if (payload.new?.setting_value) setVersionIndicator(payload.new.setting_value);
        }
      )
      .subscribe();

    return () => {
      if (pollInterval) clearInterval(pollInterval);
      supabase.removeChannel(versionChannel);
    };
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchUnreadCount();
      const channel = supabase
        .channel('admin-notifications-unified')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'admin_notifications' }, () => fetchUnreadCount())
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'feedback' }, () => fetchUnreadCount())
        .subscribe();
      return () => { supabase.removeChannel(channel); };
    }
  }, [isAdmin]);

  const fetchVersionIndicator = async () => {
    try {
      const { data } = await supabase
        .from('app_settings')
        .select('setting_value')
        .eq('setting_key', 'version_indicator')
        .maybeSingle();
      if (data) setVersionIndicator(data.setting_value);
    } catch {}
  };

  const fetchUnreadCount = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { count: notificationCount } = await supabase
        .from('admin_notifications')
        .select('*', { count: 'exact', head: true })
        .eq('admin_user_id', user.id)
        .eq('is_read', false);
      const { count: feedbackCount } = await supabase
        .from('feedback')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'new');
      setUnreadCount((notificationCount || 0) + (feedbackCount || 0));
    } catch {}
  };

  // Zoom handlers
  const handleZoomIn = () => {
    const idx = ZOOM_LEVELS.indexOf(zoomLevel);
    if (idx < ZOOM_LEVELS.length - 1) {
      const newZoom = ZOOM_LEVELS[idx + 1];
      setZoomLevel(newZoom);
      toast({ title: "🔍 Zoomed In", description: `${Math.round(newZoom * 100)}%` });
    }
  };

  const handleZoomOut = () => {
    const idx = ZOOM_LEVELS.indexOf(zoomLevel);
    if (idx > 0) {
      const newZoom = ZOOM_LEVELS[idx - 1];
      setZoomLevel(newZoom);
      toast({ title: "🔍 Zoomed Out", description: `${Math.round(newZoom * 100)}%` });
    }
  };

  const handleReset = () => {
    setZoomLevel(DEFAULT_ZOOM);
    toast({ title: "🔍 Zoom Reset", description: "100%" });
  };

  const handleCopyPage = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: "📋 Copied", description: "Page URL copied to clipboard" });
  };

  const handleCopyJson = () => {
    // Emit event for JSON copy (handled by room page)
    window.dispatchEvent(new CustomEvent('copy-room-json'));
    toast({ title: "📄 JSON", description: "Room JSON copied" });
  };

  const toggleLang = () => {
    const newLang = activeLang === 'en' ? 'vi' : 'en';
    setActiveLang(newLang);
    window.dispatchEvent(new CustomEvent('toggle-language', { detail: newLang }));
    toast({ title: "🌐 Language", description: newLang === 'en' ? 'English' : 'Tiếng Việt' });
  };

  const currentIdx = ZOOM_LEVELS.indexOf(zoomLevel);
  const canZoomIn = currentIdx < ZOOM_LEVELS.length - 1;
  const canZoomOut = currentIdx > 0;
  const showAdminControls = isAdmin || isDev;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-background/95 backdrop-blur-sm border-t border-border">
      <div className="mx-auto max-w-7xl px-2 md:px-4 py-2 flex flex-col md:flex-row items-stretch gap-2">
        {/* LEFT 1/3: Utility Strip */}
        <div className="flex-1 md:basis-1/3 md:max-w-[33%] bg-card border border-border rounded-lg px-3 py-1.5 flex items-center gap-1.5 min-h-[42px]">
          {/* Zoom Controls */}
          <Button
            onClick={handleZoomOut}
            disabled={!canZoomOut}
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0 shrink-0"
            title="Zoom Out (Ctrl + -)"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </Button>
          <Button
            onClick={handleReset}
            size="sm"
            variant="ghost"
            className="h-7 px-1.5 shrink-0"
            title="Reset Zoom"
          >
            <Maximize2 className="h-3 w-3 mr-0.5" />
            <span className="text-[10px] font-medium">{Math.round(zoomLevel * 100)}%</span>
          </Button>
          <Button
            onClick={handleZoomIn}
            disabled={!canZoomIn}
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0 shrink-0"
            title="Zoom In (Ctrl + +)"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </Button>

          {/* Separator */}
          <div className="h-5 w-px bg-border shrink-0" />

          {/* Copy URL */}
          <Button
            onClick={handleCopyPage}
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0 shrink-0"
            title="Copy page URL"
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>

          {/* Copy JSON (Admin) */}
          {showAdminControls && (
            <Button
              onClick={handleCopyJson}
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0 shrink-0"
              title="Copy room JSON"
            >
              <FileJson className="h-3.5 w-3.5 text-amber-500" />
            </Button>
          )}

          {/* EN/VI Toggle */}
          <Button
            onClick={toggleLang}
            size="sm"
            variant="ghost"
            className="h-7 px-1.5 shrink-0 gap-1"
            title="Toggle EN / VI"
          >
            <Languages className="h-3.5 w-3.5" />
            <span className="text-[10px] font-bold uppercase">{activeLang}</span>
          </Button>

          {/* Status Dots */}
          <div className="flex items-center gap-1 shrink-0">
            <Circle className="h-2.5 w-2.5 fill-emerald-500 text-emerald-500" title="Online" />
            <Circle className="h-2.5 w-2.5 fill-blue-500 text-blue-500" title="Synced" />
            {unreadCount > 0 && (
              <Circle className="h-2.5 w-2.5 fill-red-500 text-red-500" title="Alerts" />
            )}
          </div>

          {/* Spacer */}
          <div className="flex-1 min-w-0" />

          {/* Version Dot */}
          <div 
            className="h-5 w-5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-[9px] font-bold shadow-sm shrink-0"
            title={`Version ${versionIndicator}`}
          >
            {versionIndicator}
          </div>

          {/* Admin Dashboard Button */}
          {showAdminControls && (
            <Button
              onClick={() => navigate('/admin')}
              size="sm"
              variant="outline"
              className="rounded-full h-7 w-7 p-0 bg-gray-800 hover:bg-gray-700 border-gray-600 relative shrink-0"
              title="Admin Dashboard"
            >
              <Settings className="h-3.5 w-3.5 text-white" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-3 w-3 flex items-center justify-center p-0 rounded-full text-[8px]"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Badge>
              )}
            </Button>
          )}
        </div>

        {/* RIGHT 2/3: Music Player */}
        <div className="flex-[2] md:basis-2/3 min-h-[42px]">
          <MusicPlayer />
        </div>
      </div>
    </div>
  );
};
