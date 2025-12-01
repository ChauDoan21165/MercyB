import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface RoomLoadShellProps {
  isLoading: boolean;
  error?: string | null;
  children: React.ReactNode;
  onRetry?: () => void;
}

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
          {/* Skeleton header */}
          <div className="h-8 bg-gray-200 rounded animate-pulse mb-4 w-2/3"></div>
          
          {/* Skeleton lines */}
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-4/5"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
          </div>
        </Card>
        
        <Card className="p-6 border-2 border-black bg-white">
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-4/5"></div>
          </div>
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
              <AlertCircle className="w-8 h-8 text-red-600" aria-hidden="true" />
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-black mb-2">
              Something went wrong
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
              Try again
            </Button>
          )}
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
