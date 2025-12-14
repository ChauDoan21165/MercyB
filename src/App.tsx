export default function App() {
  useEffect(() => {
    console.log("App.tsx version: v2025-12-14-03");
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <MbThemeProvider>
            <LowDataModeProvider>
              <MusicPlayerProvider>
                <TooltipProvider>
                  <OfflineDetector />

                  {/* ROUTES ONLY — NO BrowserRouter */}
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/free" element={<RoomGrid />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>

                  <Toaster />
                  <Sonner />
                </TooltipProvider>
              </MusicPlayerProvider>
            </LowDataModeProvider>
          </MbThemeProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
