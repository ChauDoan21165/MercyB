/**
 * Canonical AudioButton Component
 * Consistent audio interaction feedback across the app
 */

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { radius, touchTarget, interactionStates } from "@/design-system/tokens";

interface AudioButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const AudioButton = forwardRef<HTMLButtonElement, AudioButtonProps>(
  ({ className, loading, size = 'md', children, disabled, ...props }, ref) => {
    const sizeClasses = {
      sm: 'h-8 w-8',
      md: 'h-10 w-10',
      lg: 'h-12 w-12',
    }[size];

    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          "inline-flex items-center justify-center",
          "bg-primary text-primary-foreground",
          "transition-all duration-150",
          radius.full,
          touchTarget,
          sizeClasses,
          
          // Tap feedback
          "active:scale-95",
          "hover:scale-105",
          
          // Ripple effect
          "relative overflow-hidden",
          "before:absolute before:inset-0",
          "before:bg-white before:opacity-0",
          "before:transition-opacity before:duration-150",
          "active:before:opacity-20",
          
          // State styles
          interactionStates.focus,
          interactionStates.disabled,
          loading && interactionStates.loading,
          
          className
        )}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
        ) : (
          children
        )}
      </button>
    );
  }
);

AudioButton.displayName = "AudioButton";
