/**
 * Global App Bar
 * Unified top navigation bar with:
 * - Left: Breadcrumb navigation
 * - Center: Mercy Blade logo (truly centered in viewport)
 * - Right: Theme toggle, Tier Map, User actions
 */

import { Button } from '@/components/ui/button';
import { UserPlus, Eye, ChevronRight, Home } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface GlobalAppBarProps {
  breadcrumbs?: BreadcrumbItem[];
  mode?: "color" | "bw";
}

export function GlobalAppBar({ 
  breadcrumbs = [],
  mode = "color" 
}: GlobalAppBarProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const headerBg = mode === "bw" 
    ? "bg-white/95" 
    : "bg-background/95";

  return (
    <header className={`sticky top-0 z-40 ${headerBg} backdrop-blur-sm border-b border-border`}>
      <div className="max-w-4xl mx-auto px-4 py-3">
        {/* Main row: 3-column grid for true center alignment */}
        <div className="grid grid-cols-3 items-center gap-2">
          
          {/* Left: Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm overflow-hidden">
            <Link 
              to="/" 
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            
            {breadcrumbs.map((item, index) => (
              <div key={index} className="flex items-center gap-1.5 min-w-0">
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />
                {item.href && index < breadcrumbs.length - 1 ? (
                  <Link 
                    to={item.href}
                    className="text-muted-foreground hover:text-foreground transition-colors truncate"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-foreground font-medium truncate">
                    {item.label}
                  </span>
                )}
              </div>
            ))}
          </nav>

          {/* Center: Logo - truly centered */}
          <div className="flex justify-center">
            <Link to="/" className="inline-block">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight whitespace-nowrap">
                {mode === "color" ? (
                  <>
                    <span style={{ color: '#E91E63' }}>M</span>
                    <span style={{ color: '#9C27B0' }}>e</span>
                    <span style={{ color: '#3F51B5' }}>r</span>
                    <span style={{ color: '#2196F3' }}>c</span>
                    <span style={{ color: '#00BCD4' }}>y</span>
                    <span className="mx-1"></span>
                    <span style={{ color: '#009688' }}>B</span>
                    <span style={{ color: '#4CAF50' }}>l</span>
                    <span style={{ color: '#8BC34A' }}>a</span>
                    <span style={{ color: '#FFC107' }}>d</span>
                    <span style={{ color: '#FF9800' }}>e</span>
                  </>
                ) : (
                  <span className="text-foreground font-black">Mercy Blade</span>
                )}
              </h1>
            </Link>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center justify-end gap-2">
            <ThemeToggle />
            
            {!user ? (
              <Button
                onClick={() => navigate('/auth')}
                size="sm"
                className="gap-1.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-sm h-8 px-3"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-xs">Sign Up</span>
              </Button>
            ) : (
              <Button 
                onClick={() => navigate('/tier-map')}
                variant="outline" 
                size="sm" 
                className="gap-1.5 h-8 px-3"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-xs">Tier Map</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
