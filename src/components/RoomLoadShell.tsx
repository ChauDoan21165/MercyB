import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { BUTTON_LABELS } from "@/lib/constants/uiText";
import { XCircle } from "lucide-react";

interface RoomLoadShellProps {
  isLoading: boolean;
  error?: string | null;
  children: React.ReactNode;
  onRetry?: () => void;
}

/**
 * Room Load Shell with standardized loading and error states
 */
export const RoomLoadShell = ({
  isLoading,
  error,
  children,
  onRetry,
}: RoomLoadShellProps) => {
  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 space-y-4">
        <Card className="p-6 border-2 border-black bg-white">
          <LoadingSpinner size="lg" />
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6">
        <Card className="p-8 border-2 border-black bg-white text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-red-100 rounded-full">
              <XCircle className="w-8 h-8 text-red-600" aria-hidden="true" />
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-black mb-2">
              There seems to be an issue.
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {error}
            </p>
          </div>
          
          {onRetry && (
            <Button
              onClick={onRetry}
              className="bg-black text-white hover:bg-gray-800 font-bold"
            >
              {BUTTON_LABELS.en.tryAgain}
            </Button>
          )}
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}