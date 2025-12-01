import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Initialize session manager for auto-renewal
import "./lib/session-manager";

// Initialize performance monitoring
import { performanceMonitor } from "./lib/performance/monitor";

// Start monitoring in development
if (import.meta.env.DEV) {
  performanceMonitor.startFpsMonitoring();
}

createRoot(document.getElementById("root")!).render(<App />);
