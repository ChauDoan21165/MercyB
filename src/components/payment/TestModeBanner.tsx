import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export function TestModeBanner() {
  // Check if we're in test mode (development or sandbox)
  const isTestMode = import.meta.env.DEV || 
                     import.meta.env.MODE === 'development' ||
                     window.location.hostname === 'localhost' ||
                     window.location.hostname.includes('lovable.app');

  if (!isTestMode) return null;

  return (
    <Alert className="mb-6 border-yellow-500 bg-yellow-50 border-4 shadow-lg animate-pulse">
      <AlertTriangle className="h-6 w-6 text-yellow-700" />
      <AlertDescription className="text-yellow-900 font-extrabold text-xl">
        ⚠️ TEST MODE ACTIVE – NO REAL MONEY ⚠️
        <p className="text-sm font-semibold mt-2 text-yellow-800">
          All payments are processed through sandbox/test mode. This is for testing only.
          No actual charges will be made to any accounts.
        </p>
      </AlertDescription>
    </Alert>
  );
}
