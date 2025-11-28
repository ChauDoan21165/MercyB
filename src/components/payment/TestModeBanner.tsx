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
    <Alert className="mb-6 border-yellow-500 bg-yellow-100 border-2">
      <AlertTriangle className="h-5 w-5 text-yellow-700" />
      <AlertDescription className="text-yellow-900 font-bold text-lg">
        ⚠️ TEST MODE – NO REAL MONEY WILL BE CHARGED ⚠️
        <p className="text-sm font-normal mt-1">
          All payments are processed through PayPal Sandbox. This is for testing only.
        </p>
      </AlertDescription>
    </Alert>
  );
}
