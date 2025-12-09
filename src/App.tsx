import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { MusicPlayerProvider } from "@/contexts/MusicPlayerContext";
import { LowDataModeProvider } from "@/contexts/LowDataModeContext";
import { MbThemeProvider } from "@/hooks/useMbTheme";
import { UnifiedBottomBar } from "@/components/UnifiedBottomBar";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { OfflineDetector } from "@/components/OfflineDetector";
import { PerformanceProfiler } from "@/lib/performance/profiler";
import { DevObservabilityPanel } from "@/components/dev/DevObservabilityPanel";
import { MercyToggle } from "@/components/companion/MercyToggle";
import { MercyGuide } from "@/components/MercyGuide";
import { GlobalNavigationBox } from "@/components/GlobalNavigationBox";
import { AppVersionManager } from "@/components/AppVersionManager";
import { GlobalFeedbackWidget } from "@/components/GlobalFeedbackWidget";
import { logger } from "@/lib/logger";
import EnvironmentBanner from "./components/admin/EnvironmentBanner";
import { AppRouter } from "@/router/AppRouter";

// Optimized QueryClient config
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Route-aware unified bottom bar
const RouteAwareBottomBar = () => {
  const location = useLocation();
  const hideOnRoutes = ['/onboarding'];
  if (hideOnRoutes.includes(location.pathname)) return null;
  return <UnifiedBottomBar />;
};

// Content wrapper for B&W mode scoping
const ScopedAppContent = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  if (isAdminRoute) return <>{children}</>;
  return <div className="mb-app-content">{children}</div>;
};

const App = () => {
  useEffect(() => {
    // Lazy preload companion assets
    import('@/lib/companionPreload').then(({ preloadCompanionAssets }) => {
      preloadCompanionAssets();
    });
    
    logger.info('App initialized', {
      scope: 'App',
      environment: import.meta.env.DEV ? 'development' : 'production',
    });

    // Remove tracking parameters
    const url = new URL(window.location.href);
    const trackingParams = ['fbclid', 'gclid', 'msclkid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    let hasTrackingParams = false;
    trackingParams.forEach(param => {
      if (url.searchParams.has(param)) {
        url.searchParams.delete(param);
        hasTrackingParams = true;
      }
    });
    if (hasTrackingParams) {
      window.history.replaceState({}, '', url.toString());
    }

    // Lazy preload critical routes on idle
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        import('@/lib/performance').then(({ preloadCriticalRoutes }) => {
          preloadCriticalRoutes(['/vip/vip1', '/vip/vip2', '/room']);
        });
      });
    }
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <MbThemeProvider>
            <LowDataModeProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <OfflineDetector />
                <DevObservabilityPanel />
                <MusicPlayerProvider>
                  <BrowserRouter>
                    <EnvironmentBanner />
                    <GlobalNavigationBox />
                    <AppVersionManager />
                    <PerformanceProfiler />
                    
                    <ScopedAppContent>
                      <AppRouter />
                    </ScopedAppContent>
                    
                    <MercyToggle />
                    <MercyGuide />
                    <GlobalFeedbackWidget />
                    <RouteAwareBottomBar />
                  </BrowserRouter>
                </MusicPlayerProvider>
              </TooltipProvider>
            </LowDataModeProvider>
          </MbThemeProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
