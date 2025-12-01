import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useState } from "react";

interface RetryButtonProps {
  onRetry: () => void | Promise<void>;
  text?: string;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "ghost";
}

/**
 * Retry Button Component
 * Standardized retry button with loading state and timeout protection
 * 
 * Usage:
 *   <RetryButton onRetry={() => loadRoom(roomId)} />
 */
export function RetryButton({ 
  onRetry, 
  text = "Retry", 
  size = "default",
  variant = "outline" 
}: RetryButtonProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    
    // Timeout protection (8s)
    const timeout = setTimeout(() => {
      setIsRetrying(false);
    }, 8000);

    try {
      await onRetry();
    } finally {
      clearTimeout(timeout);
      setIsRetrying(false);
    }
  };

  return (
    <Button
      onClick={handleRetry}
      disabled={isRetrying}
      size={size}
      variant={variant}
      className="gap-2"
      aria-label="Retry failed operation"
    >
      <RefreshCw className={`h-4 w-4 ${isRetrying ? "animate-spin" : ""}`} />
      {text}
    </Button>
  );
}
