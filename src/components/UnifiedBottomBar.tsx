import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, ZoomIn, ZoomOut, Copy, Circle, FileJson, Languages } from "lucide-react";
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
    <footer className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/95 backdrop-blur-sm">
      {/* Centered container matching content width */}
      <div className="mx-auto max-w-[720px] px-4 py-2">
        <div className="flex flex-col gap-2">
          {/* Row 1: All controls, buttons, toggles, dots */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Zoom Controls */}
            <div className="flex items-center gap-0.5 bg-card/50 border border-border/50 rounded-md px-1 py-0.5">
              <Button
                onClick={handleZoomOut}
                disabled={!canZoomOut}
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                title="Zoom Out (Ctrl + -)"
              >
                <ZoomOut className="h-3 w-3" />
              </Button>
              <Button
                onClick={handleReset}
                size="sm"
                variant="ghost"
                className="h-6 px-1"
                title="Reset Zoom"
              >
                <span className="text-[10px] font-medium">{Math.round(zoomLevel * 100)}%</span>
              </Button>
              <Button
                onClick={handleZoomIn}
                disabled={!canZoomIn}
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                title="Zoom In (Ctrl + +)"
              >
                <ZoomIn className="h-3 w-3" />
              </Button>
            </div>

            {/* EN/VI Toggle */}
            <Button
              onClick={toggleLang}
              size="sm"
              variant="outline"
              className="h-7 px-2 gap-1"
              title="Toggle EN / VI"
            >
              <Languages className="h-3 w-3" />
              <span className="text-[10px] font-bold uppercase">{activeLang}</span>
            </Button>

            {/* Copy URL */}
            <Button
              onClick={handleCopyPage}
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0"
              title="Copy page URL"
            >
              <Copy className="h-3 w-3" />
            </Button>

            {/* Copy JSON (Admin) */}
            {showAdminControls && (
              <Button
                onClick={handleCopyJson}
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0"
                title="Copy room JSON"
              >
                <FileJson className="h-3 w-3 text-amber-500" />
              </Button>
            )}

            {/* Status Dots */}
            <div className="flex items-center gap-1 px-1">
              <Circle className="h-2 w-2 fill-emerald-500 text-emerald-500" title="Online" />
              <Circle className="h-2 w-2 fill-blue-500 text-blue-500" title="Synced" />
              {unreadCount > 0 && (
                <Circle className="h-2 w-2 fill-red-500 text-red-500" title="Alerts" />
              )}
            </div>

            {/* Version Indicator */}
            <div 
              className="h-5 w-5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-[9px] font-bold"
              title={`Version ${versionIndicator}`}
            >
              {versionIndicator}
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Admin Dashboard Button */}
            {showAdminControls && (
              <Button
                onClick={() => navigate('/admin')}
                size="sm"
                variant="outline"
                className="h-7 px-2 gap-1 relative"
                title="Admin Dashboard"
              >
                <Settings className="h-3 w-3" />
                <span className="text-[10px]">Admin</span>
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 rounded-full text-[8px]"
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Badge>
                )}
              </Button>
            )}
          </div>

          {/* Row 2: Music / Audio Bar */}
          <div className="w-full">
            <MusicPlayer />
          </div>
        </div>
      </div>
    </footer>
  );
};
